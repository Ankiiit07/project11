// netlify/functions/shiprocket.mjs
//
// GET  /.netlify/functions/shiprocket?awb=X       courier tracking for an AWB (public)
// GET  /.netlify/functions/shiprocket?orderId=X   order status + tracking, no personal details (public)
// POST /.netlify/functions/shiprocket { orderId } create the shipment now (admins only)
//
// Env vars: SHIPROCKET_EMAIL, SHIPROCKET_PASSWORD (see netlify/lib/shiprocket.mjs).

import { getDb } from '../lib/db.mjs';
import { getAuthUser } from '../lib/auth.mjs';
import { isAdmin } from '../lib/admin.mjs';
import { reply, str, parseBody } from '../lib/http.mjs';
import { toClient } from './orders.mjs';
import { isConfigured, shipOrder, trackAwb } from '../lib/shiprocket.mjs';

const AWB_RE = /^[A-Za-z0-9-]{6,40}$/;

async function track(awb) {
  if (!isConfigured()) return null;
  try {
    return await trackAwb(awb);
  } catch (err) {
    console.warn('shiprocket: tracking failed:', err.message);
    return null;
  }
}

async function getTracking(params) {
  if (params.awb) {
    const awb = str(params.awb, 40);
    if (!AWB_RE.test(awb)) return reply(400, { success: false, error: 'Please enter a valid tracking number' });
    const tracking = await track(awb);
    if (!tracking) return reply(503, { success: false, error: 'Tracking is unavailable right now. Please try again shortly.' });
    return reply(200, { success: true, tracking });
  }

  const orderId = str(params.orderId, 40);
  if (!orderId) return reply(400, { success: false, error: 'An order number or tracking number is required' });
  const order = await (await getDb()).collection('orders').findOne({ id: orderId });
  if (!order) return reply(404, { success: false, error: 'We could not find that order' });

  return reply(200, {
    success: true,
    order: {
      id: order.id,
      status: order.status,
      createdAt: new Date(order.createdAt).toISOString(),
      awbCode: order.awbCode || null,
      courierName: order.courierName || null,
    },
    tracking: order.awbCode ? await track(order.awbCode) : null,
  });
}

async function createShipment(event) {
  const user = await getAuthUser(event);
  if (!user) return reply(401, { success: false, error: 'Please sign in' });
  if (!isAdmin(user)) return reply(403, { success: false, error: 'This account does not have admin access' });
  if (!isConfigured()) {
    return reply(503, { success: false, error: 'Shiprocket is not set up. Add SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD in Netlify.' });
  }

  const body = parseBody(event);
  const orders = (await getDb()).collection('orders');
  const order = await orders.findOne({ id: str(body?.orderId, 40) });
  if (!order) return reply(404, { success: false, error: 'Order not found' });
  if (order.status === 'cancelled') return reply(409, { success: false, error: 'This order is cancelled' });

  try {
    const shipped = await shipOrder(orders, order, user.email);
    if (!shipped) return reply(409, { success: false, error: 'This order is being shipped right now. Refresh in a minute.' });
    return reply(200, { success: true, order: toClient(shipped) });
  } catch (err) {
    return reply(502, { success: false, error: err.message });
  }
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return reply(200, {});
  try {
    if (event.httpMethod === 'GET') return await getTracking(event.queryStringParameters || {});
    if (event.httpMethod === 'POST') return await createShipment(event);
    return reply(405, { success: false, error: 'Method not allowed' });
  } catch (err) {
    console.error('shiprocket:', err);
    return reply(500, { success: false, error: 'Something went wrong. Please try again.' });
  }
};
