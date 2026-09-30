// Tests for netlify/functions/contact.mjs (MongoDB and Resend are replaced with fakes).
// Run with: npm run test:functions

import { test, mock, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

const store = { messages: [], subscribers: [] };
const matches = (d, f) => Object.entries(f).every(([k, v]) => (v && v.$gte ? d[k] >= v.$gte : d[k] === v));
const coll = (name) => ({
  countDocuments: async (f) => store[name].filter((d) => matches(d, f)).length,
  findOne: async (f) => store[name].find((d) => matches(d, f)) || null,
  insertOne: async (d) => store[name].push(d),
});
mock.module(new URL('../netlify/lib/db.mjs', import.meta.url).href, { namedExports: { getDb: async () => ({ collection: coll }) } });

const emails = [];
let resendFails = false;
globalThis.fetch = async (url, init) => {
  if (resendFails) return new Response('{}', { status: 500 });
  emails.push(JSON.parse(init.body));
  return new Response('{"id":"e1"}', { status: 200 });
};
process.env.RESEND_API_KEY = 'k';
process.env.ADMIN_ORDER_EMAIL = 'owner@cafe.com';

const { handler } = await import('../netlify/functions/contact.mjs');
const post = async (body, ip = '1.1.1.1') => {
  const r = await handler({ httpMethod: 'POST', body: JSON.stringify(body), headers: { 'x-nf-client-connection-ip': ip } });
  return { status: r.statusCode, ...JSON.parse(r.body) };
};

beforeEach(() => {
  store.messages.length = 0;
  store.subscribers.length = 0;
  emails.length = 0;
  resendFails = false;
});

test('contact message is saved and emailed to the store with reply-to', async () => {
  const r = await post({ type: 'contact', name: 'Priya', email: 'Priya@X.com', subject: 'order', message: 'Where is my order #123?' });
  assert.equal(r.status, 200);
  assert.equal(store.messages.length, 1);
  assert.equal(store.messages[0].email, 'priya@x.com');
  assert.deepEqual(emails[0].to, ['owner@cafe.com']);
  assert.equal(emails[0].reply_to, 'priya@x.com');
  assert.match(emails[0].subject, /Website message \(order\) from Priya/);
  assert.match(emails[0].text, /Where is my order #123\?/);
});

test('validation: email, name and message length', async () => {
  assert.equal((await post({ type: 'contact', name: 'A', email: 'nope', message: 'long enough text' })).status, 400);
  assert.equal((await post({ type: 'contact', name: '', email: 'a@b.com', message: 'long enough text' })).status, 400);
  assert.equal((await post({ type: 'contact', name: 'A', email: 'a@b.com', message: 'short' })).status, 400);
  assert.equal(store.messages.length, 0);
});

test('bots filling the hidden field get a fake success and nothing is saved or sent', async () => {
  const r = await post({ type: 'contact', name: 'Bot', email: 'bot@spam.com', message: 'buy cheap stuff now', website: 'http://spam' });
  assert.equal(r.status, 200);
  assert.equal(store.messages.length, 0);
  assert.equal(emails.length, 0);
});

test('each IP can send 5 per hour', async () => {
  for (let i = 0; i < 5; i++) assert.equal((await post({ type: 'contact', name: 'A', email: 'a@b.com', message: 'message number ' + i })).status, 200);
  assert.equal((await post({ type: 'contact', name: 'A', email: 'a@b.com', message: 'one message too many' })).status, 429);
  assert.equal((await post({ type: 'contact', name: 'B', email: 'b@b.com', message: 'different visitor here' }, '2.2.2.2')).status, 200);
});

test('newsletter: saves once, reports duplicates, notifies the store', async () => {
  assert.deepEqual(await post({ type: 'newsletter', email: 'Fan@X.com' }), { status: 200, success: true });
  assert.equal(store.subscribers[0].email, 'fan@x.com');
  assert.match(emails[0].text, /fan@x.com subscribed/);
  const again = await post({ type: 'newsletter', email: 'fan@x.com' });
  assert.equal(again.alreadySubscribed, true);
  assert.equal(store.subscribers.length, 1);
});

test('email failure does not lose the message', async () => {
  resendFails = true;
  const r = await post({ type: 'contact', name: 'A', email: 'a@b.com', message: 'please still save me' });
  assert.equal(r.status, 200);
  assert.equal(store.messages.length, 1);
});
