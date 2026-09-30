// Tests for the orders, profile, admin-orders and reviews Netlify functions.
// MongoDB is replaced by a small in-memory stand-in, and Firebase ID tokens are
// signed with a local key served through a mocked JWKS fetch.
// Run with: npm run test:functions

import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { generateKeyPair, exportJWK, SignJWT } from 'jose';

// ---- tiny in-memory stand-in for the MongoDB driver ----
// Like MongoDB, a path through an array ("items.id") matches if any element matches.
const get = (o, path) => path.split('.').reduce((v, k) => (v == null ? v : Array.isArray(v) ? v.map((x) => x?.[k]) : v[k]), o);
const cond = (val, v) => {
  if (Array.isArray(val) && !(v && typeof v === 'object' && '$ne' in v)) return val.some((x) => cond(x, v));
  if (v && typeof v === 'object' && !(v instanceof Date)) {
    if ('$regex' in v) return new RegExp(v.$regex, v.$options).test(String(val ?? ''));
    if ('$ne' in v) return val !== v.$ne;
    if ('$gte' in v) return val >= v.$gte;
  }
  return val === v;
};
const matches = (doc, f) => Object.entries(f).every(([k, v]) => k === '$or' ? v.some((g) => matches(doc, g)) : k === '$and' ? v.every((g) => matches(doc, g)) : cond(get(doc, k), v));
const aggregate = (docs, pipeline) => pipeline.reduce((rows, stage) => {
  if (stage.$match) return rows.filter((d) => matches(d, stage.$match));
  const { _id, ...acc } = stage.$group;
  const groups = new Map();
  for (const d of rows) {
    const key = _id === null ? null : get(d, _id.slice(1));
    const g = groups.get(key) || { _id: key, ...Object.fromEntries(Object.keys(acc).map((a) => [a, 0])) };
    for (const [a, { $sum }] of Object.entries(acc)) g[a] += $sum === 1 ? 1 : get(d, $sum.slice(1)) || 0;
    groups.set(key, g);
  }
  return [...groups.values()];
}, docs);
const collections = {};
const coll = (name) => (collections[name] ||= (() => {
  const docs = [];
  return {
    docs,
    createIndex: async () => {},
    findOne: async (f) => structuredClone(docs.find((d) => matches(d, f)) ?? null),
    insertOne: async (d) => {
      if (name === 'orders' && docs.some((x) => x.payment.paymentId === d.payment.paymentId)) throw Object.assign(new Error('dup'), { code: 11000 });
      docs.push(structuredClone(d));
    },
    find: (f) => {
      let out = docs.filter((d) => matches(d, f));
      const cur = { sort: () => (out.sort((a, b) => b.createdAt - a.createdAt), cur), skip: (n) => (out = out.slice(n), cur), limit: (n) => (out = out.slice(0, n), cur), toArray: async () => structuredClone(out) };
      return cur;
    },
    countDocuments: async (f) => docs.filter((d) => matches(d, f)).length,
    aggregate: (pipeline) => ({ toArray: async () => aggregate(docs, pipeline) }),
    findOneAndUpdate: async (f, u, o) => {
      let d = docs.find((x) => matches(x, f));
      if (!d && o.upsert) { d = { ...(u.$setOnInsert || {}) }; docs.push(d); }
      if (!d) return null;
      Object.assign(d, u.$set);
      for (const [k, v] of Object.entries(u.$push || {})) (d[k] ||= []).push(v);
      return structuredClone(d);
    },
  };
})());
mock.module(new URL('../netlify/lib/db.mjs', import.meta.url).href, { namedExports: { getDb: async () => ({ collection: coll }) } });

// ---- Firebase-like tokens signed with a local key, served through a mocked JWKS fetch ----
process.env.FIREBASE_PROJECT_ID = 'cafe-test';
process.env.RAZORPAY_SECRET = 'rzp_secret';
const { publicKey, privateKey } = await generateKeyPair('RS256');
const jwk = { ...(await exportJWK(publicKey)), kid: 'k1', alg: 'RS256', use: 'sig' };
const realFetch = globalThis.fetch;
globalThis.fetch = async (url, init) => String(url).includes('securetoken@system') ? new Response(JSON.stringify({ keys: [jwk] }), { headers: { 'content-type': 'application/json' } }) : realFetch(url, init);
const token = (sub, email, verified, aud = 'cafe-test') => new SignJWT({ email, email_verified: verified })
  .setProtectedHeader({ alg: 'RS256', kid: 'k1' }).setSubject(sub).setIssuer(`https://securetoken.google.com/${aud}`)
  .setAudience(aud).setIssuedAt().setExpirationTime('1h').sign(privateKey);

const { handler: orders } = await import('../netlify/functions/orders.mjs');
const { handler: profile } = await import('../netlify/functions/profile.mjs');
const { handler: adminOrders, startOfDayIST } = await import('../netlify/functions/admin-orders.mjs');
const { handler: reviews, displayName } = await import('../netlify/functions/reviews.mjs');
const call = async (h, method, { body, tok, qs } = {}) => {
  const r = await h({ httpMethod: method, body: body && JSON.stringify(body), queryStringParameters: qs, headers: tok ? { authorization: `Bearer ${tok}` } : {} });
  return { status: r.statusCode, ...JSON.parse(r.body) };
};
const sig = (o, p) => crypto.createHmac('sha256', 'rzp_secret').update(`${o}|${p}`).digest('hex');
const order = (p, email, extra = {}) => ({
  razorpay_order_id: 'order_' + p, razorpay_payment_id: p, razorpay_signature: sig('order_' + p, p),
  customer: { firstName: 'Asha', lastName: 'K', email, phone: '9999999999', address: '1 MG Rd', city: 'Mumbai', state: 'MH', zipCode: '400001' },
  items: [{ id: 'latte', name: 'Latte', quantity: 2, price: 199 }], subtotal: 398, discount: 39.8, shipping: 50, tax: 0, ...extra,
});

test('rejects an order without a valid Razorpay signature', async () => {
  const r = await call(orders, 'POST', { body: { ...order('pay_x', 'a@x.com'), razorpay_signature: 'forged' } });
  assert.equal(r.status, 403);
});

test('guest order is saved; retrying the same payment returns the same order', async () => {
  const a = await call(orders, 'POST', { body: order('pay_guest', 'Guest@X.com') });
  assert.equal(a.status, 201);
  assert.match(a.order.id, /^CAO-\d{8}-[0-9A-F]{6}$/);
  assert.equal(a.order.total, 408.2);
  assert.equal(a.order.customer.email, 'guest@x.com');
  assert.equal(a.order.userId, undefined);
  const b = await call(orders, 'POST', { body: order('pay_guest', 'guest@x.com') });
  assert.equal(b.status, 200);
  assert.equal(b.order.id, a.order.id);
});

test('signed-in order is linked to the account, not to a userId in the body', async () => {
  const t = await token('uid-asha', 'asha@x.com', false);
  const r = await call(orders, 'POST', { tok: t, body: order('pay_asha', 'asha@x.com', { userId: 'someone-else' }) });
  assert.equal(r.status, 201);
  assert.equal(coll('orders').docs.find((d) => d.id === r.order.id).userId, 'uid-asha');
});

test('order list needs sign-in and only returns the customer\'s own orders', async () => {
  assert.equal((await call(orders, 'GET')).status, 401);
  const mine = await call(orders, 'GET', { tok: await token('uid-asha', 'asha@x.com', false) });
  assert.deepEqual(mine.orders.map((o) => o.payment.paymentId), ['pay_asha']);
  // an unverified account with the guest's email must NOT see the guest order
  const unverified = await call(orders, 'GET', { tok: await token('uid-g', 'guest@x.com', false) });
  assert.equal(unverified.orders.length, 0);
  // once verified, guest orders with that email show up
  const verified = await call(orders, 'GET', { tok: await token('uid-g', 'guest@x.com', true) });
  assert.deepEqual(verified.orders.map((o) => o.payment.paymentId), ['pay_guest']);
});

test('single order: owner only', async () => {
  const id = coll('orders').docs.find((d) => d.payment.paymentId === 'pay_asha').id;
  assert.equal((await call(orders, 'GET', { qs: { id } })).status, 401);
  assert.equal((await call(orders, 'GET', { qs: { id }, tok: await token('uid-other', 'o@x.com', true) })).status, 404);
  assert.equal((await call(orders, 'GET', { qs: { id }, tok: await token('uid-asha', 'asha@x.com', false) })).status, 200);
  assert.equal((await call(orders, 'GET', { qs: { id, email: 'asha@x.com' } })).status, 401);
});

test('tokens for another Firebase project or with bad signatures are rejected', async () => {
  assert.equal((await call(orders, 'GET', { tok: await token('uid-asha', 'asha@x.com', true, 'other-project') })).status, 401);
  const t = await token('uid-asha', 'asha@x.com', true);
  assert.equal((await call(orders, 'GET', { tok: t.slice(0, -4) + 'AAAA' })).status, 401);
});

test('profile: created on first read, updated, email always from token', async () => {
  assert.equal((await call(profile, 'GET')).status, 401);
  const t = await token('uid-asha', 'asha@x.com', true);
  const first = await call(profile, 'GET', { tok: t });
  assert.deepEqual(first.profile, { id: 'uid-asha', email: 'asha@x.com', name: '', phone: '', address: null, role: 'customer' });
  const upd = await call(profile, 'PUT', { tok: t, body: { name: 'Asha K', phone: '9999999999', email: 'evil@x.com', address: { street: '1 MG Rd', city: 'Mumbai', state: 'MH', zipCode: '400001' } } });
  assert.equal(upd.profile.name, 'Asha K');
  assert.equal(upd.profile.email, 'asha@x.com');
  assert.equal(upd.profile.address.city, 'Mumbai');
  assert.equal((await call(profile, 'GET', { tok: t })).profile.phone, '9999999999');
});

test('admin: only verified emails on ADMIN_EMAILS get in', async () => {
  process.env.ADMIN_EMAILS = 'Owner@Cafe.com, second@cafe.com';
  assert.equal((await call(adminOrders, 'GET')).status, 401);
  assert.equal((await call(adminOrders, 'GET', { tok: await token('uid-asha', 'asha@x.com', true) })).status, 403);
  // someone who signed up with the owner's email but never verified it
  assert.equal((await call(adminOrders, 'GET', { tok: await token('uid-fake', 'owner@cafe.com', false) })).status, 403);
  assert.equal((await call(adminOrders, 'GET', { tok: await token('uid-owner', 'owner@cafe.com', true) })).status, 200);
});

test('admin: lists every customer\'s orders with summary, filters and search', async () => {
  const t = await token('uid-owner', 'owner@cafe.com', true);
  const all = await call(adminOrders, 'GET', { tok: t });
  assert.equal(all.total, 2);
  assert.deepEqual(all.orders.map((o) => o.payment.paymentId).sort(), ['pay_asha', 'pay_guest']);
  assert.equal(all.summary.totalOrders, 2);
  assert.equal(all.summary.counts.placed, 2);
  assert.equal(all.summary.todayOrders, 2);
  assert.equal(all.summary.revenue, 816.4);
  const byEmail = await call(adminOrders, 'GET', { tok: t, qs: { q: 'GUEST@' } });
  assert.deepEqual(byEmail.orders.map((o) => o.customer.email), ['guest@x.com']);
  const regexy = await call(adminOrders, 'GET', { tok: t, qs: { q: '.*' } });
  assert.equal(regexy.total, 0);
  assert.equal((await call(adminOrders, 'GET', { tok: t, qs: { status: 'shipped' } })).total, 0);
});

test('admin: update status and AWB, with history; bad input rejected', async () => {
  const t = await token('uid-owner', 'owner@cafe.com', true);
  const id = coll('orders').docs.find((d) => d.payment.paymentId === 'pay_asha').id;
  assert.equal((await call(adminOrders, 'POST', { tok: t, body: { id, status: 'lost' } })).status, 400);
  assert.equal((await call(adminOrders, 'POST', { tok: t, body: { id: 'CAO-NOPE', status: 'shipped' } })).status, 404);
  assert.equal((await call(adminOrders, 'POST', { tok: await token('uid-asha', 'asha@x.com', true), body: { id, status: 'delivered' } })).status, 403);
  const r = await call(adminOrders, 'POST', { tok: t, body: { id, status: 'shipped', awbCode: 'AWB123' } });
  assert.equal(r.status, 200);
  assert.equal(r.order.status, 'shipped');
  assert.equal(r.order.awbCode, 'AWB123');
  assert.equal(r.order.statusHistory[0].by, 'owner@cafe.com');
  assert.equal((await call(adminOrders, 'GET', { tok: t, qs: { status: 'shipped' } })).total, 1);
  // the customer sees the new status in their own list
  const mine = await call(orders, 'GET', { tok: await token('uid-asha', 'asha@x.com', false) });
  assert.equal(mine.orders[0].status, 'shipped');
});

test('startOfDayIST is midnight in India', () => {
  // 2026-09-25 01:00 IST == 2026-09-24T19:30Z -> midnight IST == 2026-09-24T18:30Z
  assert.equal(startOfDayIST(Date.parse('2026-09-24T19:30:00Z')).toISOString(), '2026-09-24T18:30:00.000Z');
  // 2026-09-25 23:00 IST == 2026-09-25T17:30Z -> same day's midnight
  assert.equal(startOfDayIST(Date.parse('2026-09-25T17:30:00Z')).toISOString(), '2026-09-24T18:30:00.000Z');
});

test('reviews: only buyers can review; one review per customer per product', async () => {
  const asha = await token('uid-asha', 'asha@x.com', false); // bought 2x latte (pay_asha)
  const stranger = await token('uid-new', 'new@x.com', true);
  const body = { productId: 'latte', rating: 5, title: 'Great', text: 'Smooth and quick, perfect for the office.' };

  assert.equal((await call(reviews, 'POST', { body })).status, 401);
  const denied = await call(reviews, 'POST', { tok: stranger, body });
  assert.equal(denied.status, 403);
  assert.equal((await call(reviews, 'POST', { tok: asha, body: { ...body, productId: 'mocha' } })).status, 403);
  assert.equal((await call(reviews, 'POST', { tok: asha, body: { ...body, rating: 6 } })).status, 400);
  assert.equal((await call(reviews, 'POST', { tok: asha, body: { ...body, text: 'ok' } })).status, 400);

  const first = await call(reviews, 'POST', { tok: asha, body });
  assert.equal(first.status, 200);
  assert.equal(first.review.verifiedPurchase, true);
  assert.equal(first.review.name, 'Asha K.'); // from the saved profile name "Asha K"
  const edited = await call(reviews, 'POST', { tok: asha, body: { ...body, rating: 4 } });
  assert.equal(edited.review.id, first.review.id);
  assert.equal(coll('reviews').docs.filter((d) => d.productId === 'latte').length, 1);

  // the guest who later verified their email can review what they bought as a guest
  const guest = await token('uid-g', 'guest@x.com', true);
  assert.equal((await call(reviews, 'POST', { tok: guest, body: { ...body, rating: 3 } })).status, 200);
});

test('reviews: public list and summary; no account details leak', async () => {
  const pub = await call(reviews, 'GET', { qs: { productId: 'latte' } });
  assert.equal(pub.reviews.length, 2);
  assert.deepEqual(pub.summary, { count: 2, average: 3.5 });
  assert.equal(pub.canReview, undefined);
  for (const r of pub.reviews) {
    assert.equal(r.uid, undefined);
    assert.equal(r.orderId, undefined);
    assert.equal(r._id, undefined);
  }
  const recent = await call(reviews, 'GET', { qs: { recent: '1' } });
  assert.equal(recent.reviews.length, 2);
  assert.deepEqual(recent.summary, { count: 2, average: 3.5 });
  assert.equal(recent.reviews[0].uid, undefined);
  const all = await call(reviews, 'GET', { qs: { summary: '1' } });
  assert.deepEqual(all.summary, { latte: { count: 2, average: 3.5 } });

  const mine = await call(reviews, 'GET', { qs: { productId: 'latte' }, tok: await token('uid-asha', 'asha@x.com', false) });
  assert.equal(mine.canReview, true);
  assert.equal(mine.mine.rating, 4);
  const other = await call(reviews, 'GET', { qs: { productId: 'latte' }, tok: await token('uid-new', 'new@x.com', true) });
  assert.equal(other.canReview, false);
  assert.equal(other.mine, null);
});

test('reviews: admins can hide and show; hidden reviews stay hidden when edited', async () => {
  const owner = await token('uid-owner', 'owner@cafe.com', true);
  const asha = await token('uid-asha', 'asha@x.com', false);
  const id = coll('reviews').docs.find((d) => d.uid === 'uid-asha').id;
  assert.equal((await call(reviews, 'POST', { tok: asha, body: { action: 'hide', id } })).status, 403);
  assert.equal((await call(reviews, 'POST', { tok: owner, body: { action: 'hide', id } })).review.status, 'hidden');
  assert.deepEqual((await call(reviews, 'GET', { qs: { productId: 'latte' } })).summary, { count: 1, average: 3 });
  const publicView = await call(reviews, 'GET', { qs: { productId: 'latte' } });
  assert.equal(publicView.reviews.some((r) => r.id === id), false);
  const adminView = await call(reviews, 'GET', { qs: { productId: 'latte' }, tok: owner });
  assert.equal(adminView.reviews.find((r) => r.id === id).status, 'hidden');
  await call(reviews, 'POST', { tok: asha, body: { productId: 'latte', rating: 5, text: 'Editing my review again.' } });
  assert.equal(coll('reviews').docs.find((d) => d.id === id).status, 'hidden');
  assert.equal((await call(reviews, 'POST', { tok: owner, body: { action: 'show', id } })).review.status, 'published');
  assert.equal((await call(reviews, 'GET', { qs: { productId: 'latte' } })).summary.count, 2);
});

test('reviews: cancelled orders do not count as a purchase', async () => {
  const owner = await token('uid-owner', 'owner@cafe.com', true);
  const t = await token('uid-c', 'cancel@x.com', false);
  const placed = await call(orders, 'POST', { tok: t, body: order('pay_cancel', 'cancel@x.com', { items: [{ id: 'mocha', name: 'Mocha', quantity: 1, price: 199 }] }) });
  await call(adminOrders, 'POST', { tok: owner, body: { id: placed.order.id, status: 'cancelled' } });
  assert.equal((await call(reviews, 'POST', { tok: t, body: { productId: 'mocha', rating: 5, text: 'Should not be allowed.' } })).status, 403);
});

test('displayName shortens names for privacy', () => {
  assert.equal(displayName('Priya Sharma', 'p@x.com'), 'Priya S.');
  assert.equal(displayName('Rahul Kumar verma', 'r@x.com'), 'Rahul V.');
  assert.equal(displayName('Neha', 'n@x.com'), 'Neha');
  assert.equal(displayName('', 'coffee.lover@x.com'), 'coffee.lover');
});

test('profile marks admins', async () => {
  const p = await call(profile, 'GET', { tok: await token('uid-owner', 'owner@cafe.com', true) });
  assert.equal(p.profile.role, 'admin');
});
