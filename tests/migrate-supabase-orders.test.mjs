// Tests for scripts/migrate-supabase-orders.mjs (mapping, CSV parsing, safe re-runs).
// Run with: npm run test:functions

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mapSupabaseOrder, parseCsv, copyOrders } from '../scripts/migrate-supabase-orders.mjs';

// Shape written by the site's checkout (src/hooks/useOrders.ts before the MongoDB move)
const appRow = {
  id: '6f1c2d3e-aaaa-bbbb-cccc-000000000001',
  items: [{ id: 'latte', name: 'Cafe at Once Latte', price: 199, quantity: 2, type: 'single', image: 'https://x/latte.png' }],
  customer_info: { email: 'Priya@Gmail.com', firstName: 'Priya', lastName: 'Sharma', phone: '9820010000', address: '12 Hill Rd', city: 'Mumbai', state: 'MH', zipCode: '400050', country: 'IN' },
  payment_info: { method: 'online', paymentId: 'pay_OLD1', status: 'completed' },
  subtotal: 398, shipping: 50, tax: 0, total: 448, status: 'placed', created_at: '2026-03-10T08:30:00+00:00',
};

// Shape from supabase/migrations (order_number, order_status, payment_details, shipping_address)
const migrationRow = {
  id: '6f1c2d3e-aaaa-bbbb-cccc-000000000002', order_number: 'ORD-482913',
  customer_info: { name: 'Rahul Kumar Verma', email: 'rahul@x.com', phone: '9000000000' },
  shipping_address: { street: '5 MG Road', city: 'Pune', state: 'MH', pincode: '411001' },
  items: [{ product_id: 'mocha', product_name: 'Mocha', price: '199.00', quantity: '3' }],
  subtotal: '597.00', tax: '0', shipping: '0', discount: '59.70', total: '537.30',
  payment_method: 'online', payment_status: 'completed', payment_details: { razorpay_payment_id: 'pay_OLD2' },
  order_status: 'confirmed', tracking_number: 'AWB999', created_at: '2026-02-01T10:00:00Z',
};

test('maps the checkout schema', () => {
  const o = mapSupabaseOrder(appRow);
  assert.equal(o.id, 'SB-6f1c2d3e-aaaa-bbbb-cccc-000000000001');
  assert.equal(o.customer.email, 'priya@gmail.com');
  assert.equal(o.customer.address, '12 Hill Rd');
  assert.deepEqual(o.payment, { method: 'razorpay', paymentId: 'pay_OLD1', status: 'completed' });
  assert.equal(o.total, 448);
  assert.equal(o.status, 'placed');
  assert.equal(o.createdAt.toISOString(), '2026-03-10T08:30:00.000Z');
  assert.equal(o.items[0].image, 'https://x/latte.png');
});

test('maps the migration schema', () => {
  const o = mapSupabaseOrder(migrationRow);
  assert.equal(o.id, 'ORD-482913');
  assert.equal(o.customer.firstName, 'Rahul');
  assert.equal(o.customer.lastName, 'Kumar Verma');
  assert.equal(o.customer.address, '5 MG Road');
  assert.equal(o.customer.zipCode, '411001');
  assert.deepEqual(o.items[0], { id: 'mocha', name: 'Mocha', image: '', quantity: 3, price: 199, type: 'single' });
  assert.equal(o.discount, 59.7);
  assert.equal(o.total, 537.3);
  assert.equal(o.status, 'placed');
  assert.equal(o.payment.paymentId, 'pay_OLD2');
  assert.equal(o.awbCode, 'AWB999');
});

test('no payment ID means no paymentId key (keeps the unique index happy)', () => {
  const o = mapSupabaseOrder({ ...appRow, payment_info: { method: 'cod', status: 'pending' } });
  assert.equal('paymentId' in o.payment, false);
  assert.equal(o.payment.method, 'cod');
});

test('parses a Supabase CSV export with JSON columns', () => {
  const csv =
    'id,order_number,customer_info,items,total,status,created_at\r\n' +
    `abc,,"{""email"":""a@b.com"",""firstName"":""A"",""address"":""1, Main St""}","[{""name"":""Latte"",""price"":199,""quantity"":1}]",249,shipped,2026-01-05 10:00:00+00\r\n` +
    '\r\n';
  const rows = parseCsv(csv);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].order_number, null);
  const o = mapSupabaseOrder(rows[0]);
  assert.equal(o.id, 'SB-abc');
  assert.equal(o.customer.address, '1, Main St');
  assert.equal(o.items[0].name, 'Latte');
  assert.equal(o.status, 'shipped');
  assert.equal(o.total, 249);
});

test('copyOrders: dry run writes nothing; re-runs and new-checkout duplicates are skipped', async () => {
  const docs = [{ id: 'CAO-20260920-ABCDEF', payment: { paymentId: 'pay_OLD2' } }];
  const get = (o, p) => p.split('.').reduce((v, k) => v?.[k], o);
  const match = (d, f) => Object.entries(f).every(([k, v]) => (k === '$or' ? v.some((g) => match(d, g)) : get(d, k) === v));
  const collection = { findOne: async (f) => docs.find((d) => match(d, f)) || null, insertOne: async (d) => docs.push(d) };
  const orders = () => [mapSupabaseOrder(appRow), mapSupabaseOrder(migrationRow)];

  assert.deepEqual(await copyOrders(collection, orders(), { write: false }), { inserted: 1, alreadyCopied: 0, duplicatePayment: 1 });
  assert.equal(docs.length, 1);
  assert.deepEqual(await copyOrders(collection, orders(), { write: true }), { inserted: 1, alreadyCopied: 0, duplicatePayment: 1 });
  assert.equal(docs.length, 2);
  assert.ok(docs[1].importedAt instanceof Date);
  assert.deepEqual(await copyOrders(collection, orders(), { write: true }), { inserted: 0, alreadyCopied: 1, duplicatePayment: 1 });
  assert.equal(docs.length, 2);
});
