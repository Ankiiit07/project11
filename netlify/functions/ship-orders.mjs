// netlify/functions/ship-orders.mjs
//
// Runs every 10 minutes (schedule in netlify.toml):
//  1. When SHIPROCKET_AUTO_SHIP=on, creates Shiprocket shipments for new paid orders.
//  2. Moves shipped orders along (processing → shipped → delivered) from courier tracking.
// Emails the store when an order still has no shipment after the last retry.

import { getDb } from '../lib/db.mjs';
import { sendEmail, storeInbox } from '../lib/email.mjs';
import {
  AUTO_SHIP_WINDOW_MS,
  MAX_ATTEMPTS,
  canAutoShip,
  isConfigured,
  shipOrder,
  statusFromTracking,
  trackAwb,
} from '../lib/shiprocket.mjs';

const SHIP_PER_RUN = 8;
const SYNC_PER_RUN = 20;
const ORDER_RANK = { placed: 0, processing: 1, shipped: 2, delivered: 3 };

async function alertStore(order, error) {
  const to = storeInbox();
  if (!to.length) return;
  try {
    await sendEmail({
      to,
      subject: `Shipment needed: order ${order.id}`,
      text:
        `Shiprocket could not create a shipment for order ${order.id} after ${MAX_ATTEMPTS} tries.\n\n` +
        `Last error: ${error}\n\n` +
        `Open the admin page, fix the issue (often the pincode, phone number or pickup location), ` +
        `then press "Create shipment" on the order, or ship it by hand and save the AWB.`,
    });
  } catch (err) {
    console.warn('ship-orders: alert email failed:', err.message);
  }
}

export async function createShipments(orders, now = Date.now()) {
  const recent = await orders
    .find({ status: 'placed', createdAt: { $gte: new Date(now - AUTO_SHIP_WINDOW_MS) } })
    .sort({ createdAt: 1 })
    .limit(50)
    .toArray();

  const results = { shipped: [], failed: [] };
  for (const order of recent.filter((o) => canAutoShip(o, now)).slice(0, SHIP_PER_RUN)) {
    try {
      const done = await shipOrder(orders, order);
      if (done?.awbCode) results.shipped.push(order.id);
    } catch (err) {
      results.failed.push(order.id);
      console.warn(`ship-orders: ${order.id} failed:`, err.message);
      if ((order.shipment?.attempts || 0) + 1 >= MAX_ATTEMPTS) await alertStore(order, err.message);
    }
  }
  return results;
}

export async function syncTracking(orders) {
  const active = await orders
    .find({ $or: [{ status: 'processing' }, { status: 'shipped' }] })
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray();

  const updated = [];
  for (const order of active.filter((o) => o.awbCode).slice(0, SYNC_PER_RUN)) {
    try {
      const tracking = await trackAwb(order.awbCode);
      const next = statusFromTracking(tracking.currentStatus);
      if (!next || ORDER_RANK[next] <= ORDER_RANK[order.status]) continue;
      await orders.findOneAndUpdate(
        { id: order.id },
        {
          $set: { status: next, updatedAt: new Date() },
          $push: { statusHistory: { status: next, at: new Date(), by: 'courier tracking' } },
        },
        { returnDocument: 'after' }
      );
      updated.push(`${order.id}:${next}`);
    } catch (err) {
      console.warn(`ship-orders: tracking ${order.id} failed:`, err.message);
    }
  }
  return updated;
}

export const handler = async () => {
  if (!isConfigured()) {
    console.log('ship-orders: Shiprocket is not set up, skipping');
    return { statusCode: 200 };
  }
  try {
    const orders = (await getDb()).collection('orders');
    const shipments = process.env.SHIPROCKET_AUTO_SHIP === 'on' ? await createShipments(orders) : 'auto-ship off';
    const tracking = await syncTracking(orders);
    console.log('ship-orders:', JSON.stringify({ shipments, tracking }));
  } catch (err) {
    console.error('ship-orders:', err);
  }
  return { statusCode: 200 };
};
