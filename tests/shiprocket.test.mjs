// Tests for Shiprocket shipping: netlify/lib/shiprocket.mjs, the shiprocket function
// and the scheduled ship-orders function. MongoDB, Firebase auth and the Shiprocket
// and Resend APIs are all replaced by small fakes.
// Run with: npm run test:functions

import { test, mock, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

// ---- tiny in-memory orders collection (only the query shapes the code uses) ----
const get = (o, path) => path.split('.').reduce((v, k) => v?.[k], o);
const cond = (val, v) => {
  if (v && typeof v === 'object' && !(v instanceof Date)) {
    if ('$exists' in v) return (val !== undefined) === v.$exists;
    if ('$lt' in v) return val !== undefined && val < v.$lt;
    if ('$gte' in v) return val !== undefined && val >= v.$gte;
  }
  return val === v;
};
const matches = (doc, f) => Object.entries(f).every(([k, v]) => (k === '$or' ? v.some((g) => matches(doc, g)) : cond(get(doc, k), v)));
const setPath = (o, path, v) => {
  const keys = path.split('.');
  const last = keys.pop();
  keys.reduce((x, k) => (x[k] ||= {}), o)[last] = v;
};
let docs = [];
const orders = {
  findOne: async (f) => structuredClone(docs.find((d) => matches(d, f)) ?? null),
  find: (f) => {
    let out = docs.filter((d) => matches(d, f));
    const cur = { sort: () => cur, limit: (n) => ((out = out.slice(0, n)), cur), toArray: async () => structuredClone(out) };
    return cur;
  },
  findOneAndUpdate: async (f, u) => {
    const d = docs.find((x) => matches(x, f));
    if (!d) return null;
    for (const [k, v] of Object.entries(u.$set || {})) setPath(d, k, v);
    for (const [k, v] of Object.entries(u.$push || {})) (d[k] ||= []).push(v);
    return structuredClone(d);
  },
};
mock.module(new URL('../netlify/lib/db.mjs', import.meta.url).href, {
  namedExports: { getDb: async () => ({ collection: () => orders }) },
});
// "Bearer admin" is the store owner, "Bearer shopper" a customer, anything else signed out.
mock.module(new URL('../netlify/lib/auth.mjs', import.meta.url).href, {
  namedExports: {
    getAuthUser: async (e) => {
      const t = e.headers?.authorization;
      if (t === 'Bearer admin') return { uid: 'a1', email: 'owner@cafe.test', emailVerified: true };
      if (t === 'Bearer shopper') return { uid: 'c1', email: 'priya@example.com', emailVerified: true };
      return null;
    },
  },
});

// ---- fake Shiprocket + Resend ----
let calls = [];
let sr = {};
globalThis.fetch = async (url, init = {}) => {
  const u = String(url);
  const body = init.body ? JSON.parse(init.body) : null;
  calls.push({ url: u, body, auth: init.headers?.Authorization });
  const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });
  if (u.includes('api.resend.com')) return json({ id: 'email_1' });
  if (u.endsWith('/auth/login')) return json({ token: 'sr-token' });
  if (u.endsWith('/orders/create/adhoc')) return sr.create ? sr.create(body) : json({ order_id: 111, shipment_id: 222, status: 'NEW' });
  if (u.endsWith('/courier/assign/awb')) return sr.assign ? sr.assign(body) : json({ awb_assign_status: 1, response: { data: { awb_code: 'AWB12345', courier_name: 'Delhivery' } } });
  if (u.endsWith('/courier/generate/pickup')) return json({ pickup_status: 1 });
  if (u.includes('/courier/track/awb/')) {
    return json({ tracking_data: sr.track || { shipment_track: [{ current_status: 'IN TRANSIT', courier_name: 'Delhivery', origin: 'Delhi', destination: 'Pune' }], shipment_track_activities: [{ date: '2026-10-01 10:00:00', activity: 'Picked up', location: 'Delhi' }], track_url: 'https://shiprocket.co/tracking/AWB12345', etd: '2026-10-04' } });
  }
  return json({ message: 'unexpected' }, 404);
};

process.env.SHIPROCKET_EMAIL = 'api@cafe.test';
process.env.SHIPROCKET_PASSWORD = 'from-env';
process.env.ADMIN_EMAILS = 'owner@cafe.test';
process.env.RESEND_API_KEY = 'test-key';

const lib = await import('../netlify/lib/shiprocket.mjs');
const { handler: shiprocket } = await import('../netlify/functions/shiprocket.mjs');
const { createShipments, syncTracking } = await import('../netlify/functions/ship-orders.mjs');

const HOUR = 60 * 60 * 1000;
const order = (over = {}) => ({
  id: 'CAO-20261001-AAA111',
  userId: 'c1',
  status: 'placed',
  customer: { firstName: 'Priya', lastName: 'Shah', email: 'priya@example.com', phone: '+91 98765-43210', address: '12 MG Road', city: 'Pune', state: 'Maharashtra', zipCode: '411001', country: 'IN' },
  items: [{ id: 'latte-concentrate', name: 'Latte', quantity: 3, price: 199, type: 'single' }],
  subtotal: 597,
  discount: 0,
  shipping: 0,
  tax: 0,
  total: 597,
  payment: { method: 'razorpay', paymentId: 'pay_1', status: 'captured' },
  createdAt: new Date(Date.now() - HOUR),
  ...over,
});
const srCalls = (part) => calls.filter((c) => c.url.includes(part));

beforeEach(() => {
  docs = [];
  calls = [];
  sr = {};
  lib.resetToken();
});

test('buildShiprocketOrder maps our order to Shiprocket fields', () => {
  const body = lib.buildShiprocketOrder(order());
  assert.equal(body.order_id, 'CAO-20261001-AAA111');
  assert.equal(body.billing_phone, '9876543210');
  assert.equal(body.billing_pincode, '411001');
  assert.equal(body.payment_method, 'Prepaid');
  assert.equal(body.pickup_location, 'Primary');
  assert.deepEqual(body.order_items, [{ name: 'Latte', sku: 'CAO-latte-concentrate', units: 3, selling_price: 199 }]);
  assert.equal(body.weight, 0.5);
  assert.equal(lib.buildShiprocketOrder(order({ items: [{ id: 'x', name: 'X', quantity: 12, price: 1 }] })).weight, 1.2);
  assert.match(body.order_date, /^\d{4}-\d\d-\d\d \d\d:\d\d$/);
});

test('shipOrder creates the shipment, assigns an AWB, requests pickup and emails the customer', async () => {
  docs = [order()];
  const shipped = await lib.shipOrder(orders, docs[0]);
  assert.equal(shipped.awbCode, 'AWB12345');
  assert.equal(shipped.courierName, 'Delhivery');
  assert.equal(shipped.status, 'processing');
  assert.equal(shipped.shipment.shipmentId, 222);
  assert.equal(shipped.shipment.pickupRequested, true);
  assert.equal(shipped.statusHistory.at(-1).by, 'shiprocket');
  assert.equal(srCalls('/auth/login')[0].body.password, 'from-env');
  assert.equal(srCalls('/orders/create/adhoc')[0].auth, 'Bearer sr-token');
  const email = srCalls('api.resend.com')[0].body;
  assert.equal(email.to, 'priya@example.com');
  assert.match(email.text, /AWB12345/);
  assert.match(email.text, /track\?orderId=CAO-20261001-AAA111/);
});

test('a failed courier assignment is recorded, and the retry does not create a second Shiprocket order', async () => {
  docs = [order()];
  sr.assign = () => new Response(JSON.stringify({ awb_assign_status: 0, response: { data: { awb_assign_error: 'Pincode not serviceable' } } }), { status: 200 });
  await assert.rejects(lib.shipOrder(orders, docs[0]), /Pincode not serviceable/);
  assert.equal(docs[0].shipment.attempts, 1);
  assert.equal(docs[0].shipment.shipmentId, 222);
  assert.equal(docs[0].status, 'placed');

  sr.assign = null;
  const shipped = await lib.shipOrder(orders, structuredClone(docs[0]));
  assert.equal(shipped.awbCode, 'AWB12345');
  assert.equal(shipped.shipment.error, null);
  assert.equal(srCalls('/orders/create/adhoc').length, 1);
});

test('shipOrder leaves an order alone while another run holds it', async () => {
  docs = [order({ shipment: { lockedUntil: new Date(Date.now() + 60_000) } })];
  assert.equal(await lib.shipOrder(orders, docs[0]), null);
  assert.equal(srCalls('/orders/create/adhoc').length, 0);
});

test('canAutoShip only picks fresh, unshipped orders under the retry limit', () => {
  const now = Date.now();
  assert.equal(lib.canAutoShip(order(), now), true);
  assert.equal(lib.canAutoShip(order({ createdAt: new Date(now - 30 * 24 * HOUR) }), now), false); // migrated / old
  assert.equal(lib.canAutoShip(order({ awbCode: 'X' }), now), false);
  assert.equal(lib.canAutoShip(order({ status: 'cancelled' }), now), false);
  assert.equal(lib.canAutoShip(order({ shipment: { attempts: 3 } }), now), false);
});

test('statusFromTracking moves orders forward and ignores returns', () => {
  assert.equal(lib.statusFromTracking('DELIVERED'), 'delivered');
  assert.equal(lib.statusFromTracking('In Transit'), 'shipped');
  assert.equal(lib.statusFromTracking('OUT FOR DELIVERY'), 'shipped');
  assert.equal(lib.statusFromTracking('RTO DELIVERED'), null);
  assert.equal(lib.statusFromTracking('UNDELIVERED'), null);
  assert.equal(lib.statusFromTracking('AWB Assigned'), null);
});

test('createShipments ships new orders only and alerts the store after the last failed try', async () => {
  docs = [
    order(),
    order({ id: 'CAO-OLD', createdAt: new Date(Date.now() - 40 * 24 * HOUR), payment: { paymentId: 'pay_2' } }),
    order({ id: 'CAO-BAD', shipment: { attempts: 2 }, payment: { paymentId: 'pay_3' } }),
  ];
  sr.create = (body) =>
    body.order_id === 'CAO-BAD'
      ? new Response(JSON.stringify({ message: 'Invalid pickup location' }), { status: 422 })
      : new Response(JSON.stringify({ order_id: 1, shipment_id: 2 }), { status: 200 });

  const result = await createShipments(orders);
  assert.deepEqual(result, { shipped: ['CAO-20261001-AAA111'], failed: ['CAO-BAD'] });
  assert.equal(docs.find((d) => d.id === 'CAO-OLD').awbCode, undefined);
  const alert = srCalls('api.resend.com').map((c) => c.body).find((b) => b.subject.includes('CAO-BAD'));
  assert.deepEqual(alert.to, ['owner@cafe.test']);
  assert.match(alert.text, /Invalid pickup location/);
});

test('syncTracking advances statuses from courier tracking but never moves backwards', async () => {
  docs = [
    order({ status: 'processing', awbCode: 'AWB1' }),
    order({ id: 'CAO-DONE', status: 'delivered', awbCode: 'AWB2' }),
  ];
  assert.deepEqual(await syncTracking(orders), ['CAO-20261001-AAA111:shipped']);
  assert.equal(docs[0].status, 'shipped');
  assert.equal(docs[0].statusHistory.at(-1).by, 'courier tracking');

  sr.track = { shipment_track: [{ current_status: 'DELIVERED' }] };
  assert.deepEqual(await syncTracking(orders), ['CAO-20261001-AAA111:delivered']);
});

const call = (method, { qs, body, auth } = {}) =>
  shiprocket({ httpMethod: method, queryStringParameters: qs || {}, body: body ? JSON.stringify(body) : null, headers: auth ? { authorization: `Bearer ${auth}` } : {} });

test('creating a shipment by hand is for admins only', async () => {
  docs = [order()];
  assert.equal((await call('POST', { body: { orderId: docs[0].id } })).statusCode, 401);
  assert.equal((await call('POST', { body: { orderId: docs[0].id }, auth: 'shopper' })).statusCode, 403);
  assert.equal(srCalls('/orders/create/adhoc').length, 0);

  const res = await call('POST', { body: { orderId: docs[0].id }, auth: 'admin' });
  const data = JSON.parse(res.body);
  assert.equal(res.statusCode, 200);
  assert.equal(data.order.awbCode, 'AWB12345');
  assert.equal(data.order.userId, undefined);
  assert.equal(docs[0].statusHistory.at(-1).by, 'owner@cafe.test');
});

test('manual shipment works for an old order, and Shiprocket errors reach the admin', async () => {
  docs = [order({ createdAt: new Date('2025-01-01') })];
  sr.create = () => new Response(JSON.stringify({ message: 'Wrong Pickup location entered' }), { status: 422 });
  const res = await call('POST', { body: { orderId: docs[0].id }, auth: 'admin' });
  assert.equal(res.statusCode, 502);
  assert.match(JSON.parse(res.body).error, /Wrong Pickup location/);
});

test('public tracking by order number shares status and tracking, but no personal details', async () => {
  docs = [order({ status: 'shipped', awbCode: 'AWB12345', courierName: 'Delhivery' })];
  const res = await call('GET', { qs: { orderId: docs[0].id } });
  const data = JSON.parse(res.body);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(Object.keys(data.order).sort(), ['awbCode', 'courierName', 'createdAt', 'id', 'status']);
  assert.equal(data.tracking.currentStatus, 'IN TRANSIT');
  assert.equal(data.tracking.checkpoints[0].activity, 'Picked up');
  assert.doesNotMatch(res.body, /priya|9876543210|MG Road/i);

  assert.equal((await call('GET', { qs: { orderId: 'CAO-NOPE' } })).statusCode, 404);
});

test('public tracking by AWB validates the number', async () => {
  assert.equal((await call('GET', { qs: { awb: '../../etc' } })).statusCode, 400);
  const res = await call('GET', { qs: { awb: 'AWB12345' } });
  assert.equal(JSON.parse(res.body).tracking.trackingUrl, 'https://shiprocket.co/tracking/AWB12345');
});
