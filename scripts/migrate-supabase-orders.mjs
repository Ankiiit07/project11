#!/usr/bin/env node
// One-time copy of the old Supabase orders into MongoDB, so they show up on
// /admin and in customers' "My Orders" (matched by verified email).
//
// Read from Supabase directly:
//   SUPABASE_URL=https://xxxx.supabase.co SUPABASE_SERVICE_ROLE_KEY=... \
//   MONGODB_URI='mongodb+srv://...' node scripts/migrate-supabase-orders.mjs
//
// ...or from a file exported in the Supabase dashboard (Table editor → orders → Export → CSV/JSON):
//   MONGODB_URI='mongodb+srv://...' node scripts/migrate-supabase-orders.mjs --file orders.csv
//
// It is a dry run unless you add --write. Safe to run more than once: orders
// already copied (or already saved by the new checkout) are skipped.

import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const STATUS_MAP = {
  pending: 'placed',
  confirmed: 'placed',
  placed: 'placed',
  processing: 'processing',
  shipped: 'shipped',
  delivered: 'delivered',
  cancelled: 'cancelled',
  canceled: 'cancelled',
};

const json = (v) => {
  if (typeof v !== 'string') return v;
  try {
    return JSON.parse(v);
  } catch {
    return v;
  }
};
const text = (v, max = 300) => (v == null ? '' : String(v).trim().slice(0, max));
const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

/** Converts one Supabase `orders` row (either schema the site used) into our MongoDB order shape. */
export function mapSupabaseOrder(row) {
  const ci = json(row.customer_info) || {};
  const sa = json(row.shipping_address) || {};
  const pay = json(row.payment_info) || json(row.payment_details) || {};
  const addr = typeof ci.address === 'object' && ci.address ? ci.address : {};

  let firstName = text(ci.firstName || ci.first_name, 60);
  let lastName = text(ci.lastName || ci.last_name, 60);
  if (!firstName && (ci.name || ci.fullName || sa.name)) {
    const [f, ...rest] = text(ci.name || ci.fullName || sa.name, 120).split(/\s+/);
    firstName = f || '';
    lastName = rest.join(' ');
  }

  const items = (Array.isArray(json(row.items)) ? json(row.items) : []).map((i) => ({
    id: text(i.id || i.productId || i.product_id, 80),
    name: text(i.name || i.product_name || i.title, 120) || 'Item',
    image: text(i.image, 500),
    quantity: Math.max(1, Math.round(num(i.quantity) || 1)),
    price: Math.max(0, num(i.price)),
    type: i.type === 'subscription' ? 'subscription' : 'single',
  }));

  const subtotal = num(row.subtotal) || items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = num(row.shipping);
  const tax = num(row.tax);
  const discount = num(row.discount);
  const total = num(row.total) || subtotal - discount + shipping + tax;

  const method = text(pay.method || row.payment_method, 20);
  const paymentId = text(pay.paymentId || pay.razorpay_payment_id || pay.payment_id, 60);
  const created = new Date(row.created_at);

  return {
    id: text(row.order_number, 40) || `SB-${text(row.id, 40)}`,
    status: STATUS_MAP[text(row.status || row.order_status).toLowerCase()] || 'placed',
    customer: {
      firstName,
      lastName,
      email: text(ci.email || sa.email, 200).toLowerCase(),
      phone: text(ci.phone || sa.phone, 20),
      address: text(typeof ci.address === 'string' ? ci.address : addr.street || sa.street || sa.address || sa.line1, 300),
      city: text(ci.city || addr.city || sa.city, 80),
      state: text(ci.state || addr.state || sa.state, 80),
      zipCode: text(ci.zipCode || ci.pincode || addr.zipCode || sa.zipCode || sa.pincode || sa.postal_code, 12),
      country: text(ci.country || addr.country || sa.country, 4) || 'IN',
    },
    items,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    // No paymentId key when there isn't one: the unique index on it ignores missing values only.
    payment: {
      method: method === 'online' ? 'razorpay' : method || 'razorpay',
      ...(paymentId ? { paymentId } : {}),
      status: text(pay.status || row.payment_status, 20) || 'completed',
    },
    ...(text(row.tracking_number) ? { awbCode: text(row.tracking_number, 40) } : {}),
    createdAt: Number.isNaN(created.getTime()) ? new Date() : created,
    source: 'supabase',
    supabaseId: text(row.id, 60),
  };
}

/** Minimal RFC 4180 CSV parser (quoted fields, "" escapes, newlines inside quotes). */
export function parseCsv(input) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (quoted) {
      if (ch === '"' && input[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && input[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else field += ch;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const [header, ...data] = rows.filter((r) => r.some((c) => c !== ''));
  return data.map((r) => Object.fromEntries(header.map((h, i) => [h.trim(), r[i] === '' ? null : r[i]])));
}

async function readFromFile(path) {
  const content = await readFile(path, 'utf8');
  if (path.toLowerCase().endsWith('.json')) {
    const data = JSON.parse(content);
    return Array.isArray(data) ? data : data.orders || data.data || [];
  }
  return parseCsv(content);
}

async function readFromSupabase() {
  const url = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
  if (!url || !key) {
    throw new Error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, or pass --file with an export of the orders table.');
  }
  const rows = [];
  for (let from = 0; ; from += 1000) {
    const res = await fetch(`${url}/rest/v1/orders?select=*&order=created_at.asc`, {
      headers: { apikey: key, Authorization: `Bearer ${key}`, Range: `${from}-${from + 999}` },
    });
    if (!res.ok) throw new Error(`Supabase returned ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const page = await res.json();
    rows.push(...page);
    if (page.length < 1000) return rows;
  }
}

/** Inserts mapped orders that aren't in MongoDB yet. Returns counts. */
export async function copyOrders(collection, orders, { write }) {
  const result = { inserted: 0, alreadyCopied: 0, duplicatePayment: 0 };
  const seen = new Set();
  for (const order of orders) {
    if (seen.has(order.id)) order.id = `${order.id}-${order.supabaseId.slice(0, 6)}`;
    seen.add(order.id);

    if (await collection.findOne({ $or: [{ supabaseId: order.supabaseId }, { id: order.id }] })) {
      result.alreadyCopied++;
      continue;
    }
    if (order.payment.paymentId && (await collection.findOne({ 'payment.paymentId': order.payment.paymentId }))) {
      result.duplicatePayment++;
      continue;
    }
    if (write) await collection.insertOne({ ...order, importedAt: new Date() });
    result.inserted++;
  }
  return result;
}

async function main() {
  const args = process.argv.slice(2);
  const write = args.includes('--write');
  const fileIdx = args.indexOf('--file');
  const file = fileIdx >= 0 ? args[fileIdx + 1] : null;

  const rows = file ? await readFromFile(file) : await readFromSupabase();
  const orders = rows.map(mapSupabaseOrder);
  console.log(`Read ${rows.length} order(s) from ${file || 'Supabase'}.`);
  const noEmail = orders.filter((o) => !o.customer.email).length;
  if (noEmail) console.log(`  ${noEmail} have no customer email (they'll show on /admin but not in any customer's My Orders).`);
  for (const o of orders.slice(0, 3)) {
    console.log(`  e.g. ${o.id} · ${o.createdAt.toISOString().slice(0, 10)} · ${o.customer.firstName} ${o.customer.lastName} <${o.customer.email || 'no email'}> · ₹${o.total} · ${o.status}`);
  }

  if (!process.env.MONGODB_URI) {
    console.log('\nSet MONGODB_URI to compare with MongoDB and copy the orders.');
    return;
  }
  const { MongoClient } = await import('mongodb');
  const client = await new MongoClient(process.env.MONGODB_URI).connect();
  try {
    const collection = client.db(process.env.MONGODB_DB || 'cafe-at-once').collection('orders');
    const r = await copyOrders(collection, orders, { write });
    console.log(
      `\n${write ? 'Copied' : 'Would copy'} ${r.inserted} order(s). ` +
        `Skipped ${r.alreadyCopied} already in MongoDB and ${r.duplicatePayment} already saved by the new checkout.`
    );
    if (!write && r.inserted) console.log('This was a dry run. Run again with --write to copy them.');
  } finally {
    await client.close();
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  main().catch((err) => {
    console.error(`\nFailed: ${err.message}`);
    process.exit(1);
  });
}
