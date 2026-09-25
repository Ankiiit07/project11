// netlify/functions/orders.mjs
//
// POST /.netlify/functions/orders          save a paid order (Razorpay proof required)
// GET  /.netlify/functions/orders          the signed-in customer's orders
// GET  /.netlify/functions/orders?id=X     one of the signed-in customer's orders
//
// Env vars: MONGODB_URI, RAZORPAY_SECRET, FIREBASE_PROJECT_ID (see netlify/lib/*).

import crypto from 'node:crypto';
import { getDb } from '../lib/db.mjs';
import { getAuthUser } from '../lib/auth.mjs';
import { isValidSignature, fetchRazorpayPayment } from '../lib/razorpay.mjs';
import { reply, str, num, isEmail, parseBody } from '../lib/http.mjs';

const newOrderId = () => {
  const d = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `CAO-${d}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
};

// What the browser gets back: no Mongo internals.
export function toClient(doc) {
  if (!doc) return null;
  const { _id, userId, ...rest } = doc;
  return { ...rest, createdAt: new Date(doc.createdAt).toISOString() };
}

export function buildOrderDoc(body, { payment, user }) {
  const c = body.customer || {};
  const items = (Array.isArray(body.items) ? body.items : []).slice(0, 50).map((i) => ({
    id: str(i.id, 80),
    name: str(i.name, 120) || 'Item',
    image: str(i.image, 500),
    quantity: Math.max(1, Math.round(num(i.quantity))),
    price: Math.max(0, num(i.price)),
    type: i.type === 'subscription' ? 'subscription' : 'single',
  }));
  const subtotal = Math.max(0, num(body.subtotal)) || items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = Math.max(0, num(body.discount));
  const shipping = Math.max(0, num(body.shipping));
  const tax = Math.max(0, num(body.tax));
  // What Razorpay actually charged is the source of truth when we can see it.
  const total = payment?.amount ? payment.amount / 100 : subtotal - discount + shipping + tax;

  return {
    id: newOrderId(),
    ...(user ? { userId: user.uid } : {}),
    status: 'placed',
    customer: {
      firstName: str(c.firstName, 60),
      lastName: str(c.lastName, 60),
      email: str(c.email, 200).toLowerCase(),
      phone: str(c.phone, 20),
      address: str(c.address, 300),
      city: str(c.city, 80),
      state: str(c.state, 80),
      zipCode: str(c.zipCode, 12),
      country: str(c.country, 4) || 'IN',
    },
    items,
    subtotal,
    discount,
    discountCode: str(body.discountCode, 30),
    shipping,
    shippingMethod: str(body.shippingMethod, 30),
    tax,
    total,
    payment: {
      method: 'razorpay',
      paymentId: str(body.razorpay_payment_id, 60),
      razorpayOrderId: str(body.razorpay_order_id, 60),
      status: payment?.status || 'captured',
    },
    createdAt: new Date(),
  };
}

async function createOrder(event) {
  const body = parseBody(event);
  if (!body) return reply(400, { success: false, error: 'Invalid JSON' });

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
  if (!isValidSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature, process.env.RAZORPAY_SECRET)) {
    return reply(403, { success: false, error: 'Payment could not be verified' });
  }
  if (!isEmail(body.customer?.email)) {
    return reply(400, { success: false, error: 'A valid customer email is required' });
  }

  const db = await getDb();
  const orders = db.collection('orders');

  // A retry for the same payment returns the order we already saved.
  const existing = await orders.findOne({ 'payment.paymentId': String(razorpay_payment_id) });
  if (existing) return reply(200, { success: true, order: toClient(existing) });

  let payment = null;
  try {
    payment = await fetchRazorpayPayment(razorpay_payment_id);
    if (payment?.order_id && payment.order_id !== razorpay_order_id) {
      return reply(403, { success: false, error: 'Payment does not belong to this order' });
    }
    if (payment && !['captured', 'authorized'].includes(payment.status)) {
      return reply(409, { success: false, error: `Payment status is ${payment.status}` });
    }
  } catch (err) {
    console.warn('orders: Razorpay lookup failed, continuing on signature alone:', err.message);
  }

  const user = await getAuthUser(event);
  const doc = buildOrderDoc(body, { payment, user });
  try {
    await orders.insertOne(doc);
  } catch (err) {
    if (err.code === 11000) {
      const dup = await orders.findOne({ 'payment.paymentId': doc.payment.paymentId });
      if (dup) return reply(200, { success: true, order: toClient(dup) });
    }
    throw err;
  }
  return reply(201, { success: true, order: toClient(doc) });
}

// Orders a signed-in customer may see: ones placed while signed in, plus guest orders
// with their email once Firebase has verified that they own that address.
export function ownerFilter(user) {
  const or = [{ userId: user.uid }];
  if (user.emailVerified && user.email) or.push({ 'customer.email': user.email });
  return { $or: or };
}

async function getOrders(event) {
  const q = event.queryStringParameters || {};
  const user = await getAuthUser(event);
  const db = await getDb();
  const orders = db.collection('orders');

  if (!user) return reply(401, { success: false, error: 'Please sign in to see your orders' });

  if (q.id) {
    const doc = await orders.findOne({ $and: [{ id: str(q.id, 40) }, ownerFilter(user)] });
    if (!doc) return reply(404, { success: false, error: 'Order not found' });
    return reply(200, { success: true, order: toClient(doc) });
  }

  const list = await orders.find(ownerFilter(user)).sort({ createdAt: -1 }).limit(100).toArray();
  return reply(200, { success: true, orders: list.map(toClient) });
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return reply(200, {});
  try {
    if (event.httpMethod === 'POST') return await createOrder(event);
    if (event.httpMethod === 'GET') return await getOrders(event);
    return reply(405, { success: false, error: 'Method not allowed' });
  } catch (err) {
    console.error('orders:', err);
    return reply(500, { success: false, error: 'Something went wrong. Please try again.' });
  }
};
