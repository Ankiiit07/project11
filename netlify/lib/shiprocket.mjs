// Shiprocket: create shipments for saved orders and read tracking.
//
// Env vars:
//   SHIPROCKET_EMAIL, SHIPROCKET_PASSWORD   an API user (Shiprocket → Settings → API → Create API user)
//   SHIPROCKET_PICKUP_LOCATION              pickup address nickname in Shiprocket (default "Primary")
//   SHIPROCKET_AUTO_SHIP=on                 let the scheduled ship-orders function create shipments

import { sendEmail, storeInbox } from './email.mjs';

const BASE = 'https://apiv2.shiprocket.in/v1/external';
const SITE = 'https://cafeatonce.com';
const DAY = 24 * 60 * 60 * 1000;
const LOCK_MS = 2 * 60 * 1000;
export const MAX_ATTEMPTS = 3;
export const AUTO_SHIP_WINDOW_MS = 3 * DAY; // never auto-ship old (e.g. migrated) orders

export const isConfigured = () => Boolean(process.env.SHIPROCKET_EMAIL && process.env.SHIPROCKET_PASSWORD);

let token = null;
let tokenExpiry = 0;

async function login() {
  if (token && Date.now() < tokenExpiry) return token;
  if (!isConfigured()) throw new Error('Shiprocket is not set up (SHIPROCKET_EMAIL / SHIPROCKET_PASSWORD)');
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: process.env.SHIPROCKET_EMAIL, password: process.env.SHIPROCKET_PASSWORD }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.token) throw new Error(`Shiprocket login failed: ${data.message || res.status}`);
  token = data.token;
  tokenExpiry = Date.now() + 9 * DAY; // tokens last 10 days
  return token;
}

/** Test hook: forget the cached login. */
export const resetToken = () => {
  token = null;
  tokenExpiry = 0;
};

async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await login()}` },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) resetToken();
  if (!res.ok) {
    const detail = data.message || (data.errors && JSON.stringify(data.errors)) || `HTTP ${res.status}`;
    throw new Error(`Shiprocket ${path.split('/').slice(0, 3).join('/')}: ${detail}`);
  }
  return data;
}

/** "YYYY-MM-DD HH:mm" in India time, as Shiprocket expects. */
export function shiprocketDate(date) {
  const ist = new Date(new Date(date).getTime() + 5.5 * 60 * 60 * 1000);
  return ist.toISOString().slice(0, 16).replace('T', ' ');
}

/** Our order document → Shiprocket's "create adhoc order" body. */
export function buildShiprocketOrder(order) {
  const c = order.customer || {};
  const units = order.items.reduce((n, i) => n + i.quantity, 0);
  return {
    order_id: order.id,
    order_date: shiprocketDate(order.createdAt),
    pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || 'Primary',
    billing_customer_name: c.firstName || 'Customer',
    billing_last_name: c.lastName || '',
    billing_address: c.address,
    billing_city: c.city,
    billing_pincode: c.zipCode,
    billing_state: c.state,
    billing_country: 'India',
    billing_email: c.email,
    billing_phone: String(c.phone || '').replace(/\D/g, '').slice(-10),
    shipping_is_billing: true,
    order_items: order.items.map((i) => ({
      name: i.name,
      sku: `CAO-${i.id || i.name}`.slice(0, 50),
      units: i.quantity,
      selling_price: i.price,
    })),
    payment_method: order.payment?.method === 'cod' ? 'COD' : 'Prepaid',
    sub_total: order.subtotal,
    total_discount: order.discount || 0,
    shipping_charges: order.shipping || 0,
    // Each tube with its pack weighs about 100 g; couriers bill a 0.5 kg minimum.
    weight: Math.max(0.5, (units * 100) / 1000),
    length: 15,
    breadth: 10,
    height: Math.min(30, 5 + units),
  };
}

/**
 * Create the Shiprocket order, assign a courier (AWB) and request pickup.
 * Progress is saved after each step, so a retry carries on where it stopped
 * instead of creating a second shipment. Returns the updated order, or null if
 * another run is already shipping it.
 */
export async function shipOrder(orders, order, by = 'shiprocket') {
  if (order.awbCode) return order;
  const now = new Date();

  // Claim the order so two runs (schedule + admin button) can't both ship it.
  const claimed = await orders.findOneAndUpdate(
    {
      id: order.id,
      $or: [{ 'shipment.lockedUntil': { $exists: false } }, { 'shipment.lockedUntil': { $lt: now } }],
    },
    { $set: { 'shipment.lockedUntil': new Date(now.getTime() + LOCK_MS) } },
    { returnDocument: 'after' }
  );
  if (!claimed) return null;
  if (claimed.awbCode) return claimed;

  const shipment = { ...(claimed.shipment || {}) };
  try {
    if (!shipment.shipmentId) {
      const created = await api('/orders/create/adhoc', { method: 'POST', body: buildShiprocketOrder(claimed) });
      if (!created.shipment_id) throw new Error(`Shiprocket did not return a shipment (${created.message || created.status || 'no reason'})`);
      shipment.shiprocketOrderId = created.order_id;
      shipment.shipmentId = created.shipment_id;
      if (created.awb_code) {
        shipment.awbCode = created.awb_code;
        shipment.courierName = created.courier_name;
      }
      await orders.findOneAndUpdate(
        { id: claimed.id },
        { $set: { 'shipment.shiprocketOrderId': shipment.shiprocketOrderId, 'shipment.shipmentId': shipment.shipmentId } },
        { returnDocument: 'after' }
      );
    }

    if (!shipment.awbCode) {
      const assigned = await api('/courier/assign/awb', { method: 'POST', body: { shipment_id: shipment.shipmentId } });
      const data = assigned.response?.data || {};
      if (!data.awb_code) {
        const reason = data.awb_assign_error || assigned.message || 'no courier available for this pincode';
        throw new Error(`Could not assign a courier: ${reason}`);
      }
      shipment.awbCode = data.awb_code;
      shipment.courierName = data.courier_name;
    }

    // Asking for pickup can fail harmlessly (e.g. already scheduled); the AWB is what matters.
    try {
      await api('/courier/generate/pickup', { method: 'POST', body: { shipment_id: [shipment.shipmentId] } });
      shipment.pickupRequested = true;
    } catch (err) {
      console.warn(`shiprocket: pickup request for ${claimed.id} failed:`, err.message);
    }

    const status = claimed.status === 'placed' ? 'processing' : claimed.status;
    const updated = await orders.findOneAndUpdate(
      { id: claimed.id },
      {
        $set: {
          status,
          awbCode: String(shipment.awbCode),
          courierName: shipment.courierName || '',
          'shipment.shiprocketOrderId': shipment.shiprocketOrderId,
          'shipment.shipmentId': shipment.shipmentId,
          'shipment.pickupRequested': Boolean(shipment.pickupRequested),
          'shipment.createdAt': new Date(),
          'shipment.error': null,
          'shipment.lockedUntil': new Date(0),
          updatedAt: new Date(),
        },
        $push: { statusHistory: { status, at: new Date(), by } },
      },
      { returnDocument: 'after' }
    );
    await emailTracking(updated);
    return updated;
  } catch (err) {
    await orders.findOneAndUpdate(
      { id: claimed.id },
      {
        $set: {
          'shipment.error': String(err.message).slice(0, 300),
          'shipment.attempts': (claimed.shipment?.attempts || 0) + 1,
          'shipment.lastTriedAt': new Date(),
          'shipment.lockedUntil': new Date(0),
        },
      },
      { returnDocument: 'after' }
    );
    throw err;
  }
}

/** Tell the customer their order is packed, with the tracking link. Never fails the shipment. */
export async function emailTracking(order) {
  const to = order?.customer?.email;
  if (!to || !process.env.RESEND_API_KEY) return;
  const link = `${SITE}/track?orderId=${encodeURIComponent(order.id)}`;
  try {
    await sendEmail({
      to,
      subject: `Your Cafe at Once order ${order.id} is packed`,
      replyTo: storeInbox()[0],
      text:
        `Hi ${order.customer.firstName || 'there'},\n\n` +
        `Good news: your order ${order.id} is packed and ${order.courierName || 'the courier'} will pick it up shortly.\n\n` +
        `Tracking number (AWB): ${order.awbCode}\n` +
        `Track it here: ${link}\n\n` +
        `Questions? Just reply to this email or WhatsApp us on +91 79798 37079.\n\n` +
        `Team Cafe at Once`,
    });
  } catch (err) {
    console.warn(`shiprocket: tracking email for ${order.id} failed:`, err.message);
  }
}

/** Tracking for one AWB, trimmed to what the customer needs (no addresses or phone numbers). */
export async function trackAwb(awb) {
  const data = await api(`/courier/track/awb/${encodeURIComponent(awb)}`);
  const t = data.tracking_data || {};
  const track = (t.shipment_track || [])[0] || {};
  return {
    awbCode: String(awb),
    courierName: track.courier_name || '',
    currentStatus: track.current_status || (t.error ? '' : 'Shipment created'),
    deliveredDate: track.delivered_date || null,
    estimatedDelivery: t.etd || track.edd || null,
    origin: track.origin || '',
    destination: track.destination || '',
    trackingUrl: t.track_url || '',
    checkpoints: (t.shipment_track_activities || []).slice(0, 30).map((a) => ({
      date: a.date,
      activity: a.activity,
      location: a.location || '',
    })),
    message: t.error || '',
  };
}

/** Our order status implied by a courier status, or null to leave it alone. */
export function statusFromTracking(currentStatus) {
  const s = String(currentStatus || '').toUpperCase();
  if (!s || /RTO|UNDELIVERED|CANCEL|LOST|DAMAGE/.test(s)) return null;
  if (s === 'DELIVERED') return 'delivered';
  if (/PICKED UP|SHIPPED|IN TRANSIT|OUT FOR DELIVERY|REACHED|DISPATCHED/.test(s)) return 'shipped';
  return null;
}

/** Whether the scheduled run may create a shipment for this order on its own. */
export function canAutoShip(order, now = Date.now()) {
  return (
    order.status === 'placed' &&
    !order.awbCode &&
    (order.shipment?.attempts || 0) < MAX_ATTEMPTS &&
    now - new Date(order.createdAt).getTime() < AUTO_SHIP_WINDOW_MS
  );
}
