// Tests for the orders and profile Netlify functions.
// MongoDB is replaced by a small in-memory stand-in, and Firebase ID tokens are
// signed with a local key served through a mocked JWKS fetch.
// Run with: npm run test:functions

import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { generateKeyPair, exportJWK, SignJWT } from 'jose';

// ---- tiny in-memory stand-in for the MongoDB driver ----
const get = (o, path) => path.split('.').reduce((v, k) => (v == null ? v : v[k]), o);
const matches = (doc, f) => Object.entries(f).every(([k, v]) => k === '$or' ? v.some((g) => matches(doc, g)) : k === '$and' ? v.every((g) => matches(doc, g)) : get(doc, k) === v);
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
      const cur = { sort: () => (out.sort((a, b) => b.createdAt - a.createdAt), cur), limit: (n) => (out = out.slice(0, n), cur), toArray: async () => structuredClone(out) };
      return cur;
    },
    findOneAndUpdate: async (f, u, o) => {
      let d = docs.find((x) => matches(x, f));
      if (!d && o.upsert) { d = { ...(u.$setOnInsert || {}) }; docs.push(d); }
      Object.assign(d, u.$set);
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
