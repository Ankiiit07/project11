// netlify/functions/admin-orders.mjs
//
// Store-owner view of every order.
// GET  /.netlify/functions/admin-orders?status=&q=&page=   list orders + summary
// POST /.netlify/functions/admin-orders  { id, status, awbCode? }   update an order
//
// Only signed-in accounts whose *verified* email is listed in ADMIN_EMAILS
// (comma-separated; falls back to ADMIN_EMAIL) can use it.

import { getDb } from '../lib/db.mjs';
import { getAuthUser } from '../lib/auth.mjs';
import { reply, str, parseBody } from '../lib/http.mjs';
import { toClient } from './orders.mjs';

export const STATUSES = ['placed', 'processing', 'shipped', 'delivered', 'cancelled'];
const PAGE_SIZE = 50;

export function adminEmails() {
  return (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export const isAdmin = (user) => Boolean(user?.emailVerified && user.email && adminEmails().includes(user.email));

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

/** Midnight in India (IST), as a UTC Date. */
export function startOfDayIST(now = Date.now()) {
  const ist = new Date(now + IST_OFFSET_MS);
  ist.setUTCHours(0, 0, 0, 0);
  return new Date(ist.getTime() - IST_OFFSET_MS);
}

const escapeRegex =(s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function buildFilter({ status, q }) {
  const filter = {};
  if (STATUSES.includes(status)) filter.status = status;
  const term = str(q, 100);
  if (term) {
    const re = { $regex: escapeRegex(term), $options: 'i' };
    filter.$or = [
      { id: re },
      { 'customer.email': re },
      { 'customer.firstName': re },
      { 'customer.lastName': re },
      { 'customer.phone': re },
      { 'payment.paymentId': re },
    ];
  }
  return filter;
}

async function listOrders(orders, params) {
  const page = Math.max(1, parseInt(params.page, 10) || 1);
  const filter = buildFilter(params);

  const startOfToday = startOfDayIST();

  const [list, total, byStatus, today] = await Promise.all([
    orders.find(filter).sort({ createdAt: -1 }).skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE).toArray(),
    orders.countDocuments(filter),
    orders.aggregate([{ $group: { _id: '$status', count: { $sum: 1 }, revenue: { $sum: '$total' } } }]).toArray(),
    orders
      .aggregate([
        { $match: { createdAt: { $gte: startOfToday }, status: { $ne: 'cancelled' } } },
        { $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: '$total' } } },
      ])
      .toArray(),
  ]);

  const counts = Object.fromEntries(STATUSES.map((s) => [s, 0]));
  let revenue = 0;
  for (const row of byStatus) {
    if (row._id in counts) counts[row._id] = row.count;
    if (row._id !== 'cancelled') revenue += row.revenue || 0;
  }

  return {
    orders: list.map(toClient),
    total,
    page,
    pageSize: PAGE_SIZE,
    summary: {
      counts,
      totalOrders: Object.values(counts).reduce((a, b) => a + b, 0),
      revenue,
      todayOrders: today[0]?.count || 0,
      todayRevenue: today[0]?.revenue || 0,
    },
  };
}

async function updateOrder(orders, body, admin) {
  const id = str(body.id, 40);
  const status = str(body.status, 20);
  if (!id || !STATUSES.includes(status)) {
    return reply(400, { success: false, error: 'A valid order id and status are required' });
  }
  const set = { status, updatedAt: new Date() };
  if (body.awbCode !== undefined) set.awbCode = str(body.awbCode, 40);

  const doc = await orders.findOneAndUpdate(
    { id },
    { $set: set, $push: { statusHistory: { status, at: new Date(), by: admin.email } } },
    { returnDocument: 'after' }
  );
  if (!doc) return reply(404, { success: false, error: 'Order not found' });
  return reply(200, { success: true, order: toClient(doc) });
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return reply(200, {});
  try {
    const user = await getAuthUser(event);
    if (!user) return reply(401, { success: false, error: 'Please sign in' });
    if (!isAdmin(user)) return reply(403, { success: false, error: 'This account does not have admin access' });

    const orders = (await getDb()).collection('orders');

    if (event.httpMethod === 'GET') {
      return reply(200, { success: true, ...(await listOrders(orders, event.queryStringParameters || {})) });
    }
    if (event.httpMethod === 'POST') {
      const body = parseBody(event);
      if (!body) return reply(400, { success: false, error: 'Invalid JSON' });
      return await updateOrder(orders, body, user);
    }
    return reply(405, { success: false, error: 'Method not allowed' });
  } catch (err) {
    console.error('admin-orders:', err);
    return reply(500, { success: false, error: 'Something went wrong. Please try again.' });
  }
};
