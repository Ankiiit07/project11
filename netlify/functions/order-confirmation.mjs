// netlify/functions/order-confirmation.mjs
//
// Sends the order confirmation email (customer) + new-order alert (store owner)
// via Resend, ONLY after the Razorpay payment is proven genuine on the server.
//
// Env vars (Netlify → Site settings → Environment variables):
//   RESEND_API_KEY      required
//   EMAIL_FROM          e.g. "Cafe at Once <orders@cafeatonce.com>"
//                       (defaults to Resend's test sender until the domain is verified)
//   ADMIN_ORDER_EMAIL   where "New order" alerts go (optional; comma-separate for several)
//   RAZORPAY_SECRET     already used by verify-payment
//   VITE_RAZORPAY_KEY_ID already used by create-order
//   URL                 set automatically by Netlify (site URL)

import { renderCustomerEmail, renderAdminEmail } from '../emails/orderConfirmation.mjs';
import { isValidSignature, fetchRazorpayPayment } from '../lib/razorpay.mjs';

export { isValidSignature };

const HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

const reply = (statusCode, body) => ({ statusCode, headers: HEADERS, body: JSON.stringify(body) });

const str = (v, max = 300) => String(v ?? '').trim().slice(0, max);
const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

// Resend's Idempotency-Key guarantees one email per key for 24h, so page reloads,
// double clicks and retries can't send duplicates. We don't need a database for this.
async function sendEmail({ to, subject, html, text, idempotencyKey, replyTo }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || 'Cafe at Once <onboarding@resend.dev>',
      to,
      subject,
      html,
      text,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (res.ok) return { sent: true, id: data.id };
  // 409 = this idempotency key was already used → the email already went out.
  if (res.status === 409) return { sent: false, duplicate: true };
  throw new Error(`Resend error ${res.status}: ${data.message || data.name || 'unknown'}`);
}

export function buildOrder(body, payment) {
  const c = body.customer || {};
  const items = (Array.isArray(body.items) ? body.items : []).slice(0, 50).map((i) => ({
    name: str(i.name, 120) || 'Item',
    quantity: Math.max(1, Math.round(num(i.quantity))),
    price: Math.max(0, num(i.price)),
    type: i.type === 'subscription' ? 'subscription' : 'single',
  }));
  const subtotal = num(body.subtotal) || items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = Math.max(0, num(body.discount));
  const shipping = Math.max(0, num(body.shipping));
  const tax = Math.max(0, num(body.tax));
  const clientTotal = subtotal - discount + shipping + tax;

  const warnings = [];
  let total = clientTotal;
  if (payment) {
    total = payment.amount / 100; // what Razorpay actually charged is the source of truth
    if (Math.abs(total - clientTotal) > 1) {
      warnings.push(`Cart total ${clientTotal.toFixed(2)} ≠ amount paid ${total.toFixed(2)}`);
    }
  } else {
    warnings.push('Could not confirm the paid amount with Razorpay; total shown is from the cart.');
  }

  const siteUrl = (process.env.URL || 'https://cafeatonce.com').replace(/\/$/, '');
  const orderId = str(body.orderId, 80);
  const awbCode = str(body.awbCode, 40);

  return {
    order: {
      orderId,
      orderDate: payment?.created_at ? payment.created_at * 1000 : Date.now(),
      paymentId: str(body.razorpay_payment_id, 60),
      customer: {
        firstName: str(c.firstName, 60),
        lastName: str(c.lastName, 60),
        email: str(c.email, 200),
        phone: str(c.phone, 20),
        address: str(c.address, 300),
        city: str(c.city, 80),
        state: str(c.state, 80),
        zipCode: str(c.zipCode, 12),
      },
      items,
      subtotal,
      discount,
      shipping,
      tax,
      total,
      awbCode,
      courierName: str(body.courierName, 60),
      estimatedDelivery: str(body.estimatedDelivery, 80),
      trackingUrl: awbCode ? `https://www.shiprocket.in/shipment-tracking/?awb=${encodeURIComponent(awbCode)}` : '',
      orderUrl: awbCode
        ? `${siteUrl}/track/${encodeURIComponent(awbCode)}`
        : `${siteUrl}/orders/${encodeURIComponent(orderId)}`,
    },
    warnings,
  };
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return reply(200, {});
  if (event.httpMethod !== 'POST') return reply(405, { success: false, error: 'Method not allowed' });

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return reply(400, { success: false, error: 'Invalid JSON' });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

  // 1. Only paid orders get an email: the Razorpay signature must be genuine.
  if (!isValidSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature, process.env.RAZORPAY_SECRET)) {
    return reply(403, { success: false, error: 'Payment could not be verified' });
  }

  if (!body.orderId || !body.customer?.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.customer.email)) {
    return reply(400, { success: false, error: 'Missing order ID or a valid customer email' });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('order-confirmation: RESEND_API_KEY is not set');
    return reply(500, { success: false, error: 'Email is not configured' });
  }

  // 2. Double-check with Razorpay that the payment went through, and use the real amount.
  let payment = null;
  try {
    payment = await fetchRazorpayPayment(razorpay_payment_id);
    if (payment) {
      if (payment.order_id && payment.order_id !== razorpay_order_id) {
        return reply(403, { success: false, error: 'Payment does not belong to this order' });
      }
      if (!['captured', 'authorized'].includes(payment.status)) {
        return reply(409, { success: false, error: `Payment status is ${payment.status}` });
      }
    }
  } catch (err) {
    console.warn('order-confirmation: Razorpay lookup failed, continuing on signature alone:', err.message);
  }

  const { order, warnings } = buildOrder(body, payment);
  const result = { success: true, customer: null, admin: null };

  // 3. Customer email (one per payment).
  try {
    const email = renderCustomerEmail(order);
    result.customer = await sendEmail({
      to: [order.customer.email],
      ...email,
      replyTo: 'support@cafeatonce.com',
      idempotencyKey: `order-confirmation/${razorpay_payment_id}`,
    });
  } catch (err) {
    console.error('order-confirmation: customer email failed:', err.message);
    result.success = false;
    result.customer = { sent: false, error: err.message };
  }

  // 4. Store-owner alert (one per payment). Never blocks the customer email.
  const admins = str(process.env.ADMIN_ORDER_EMAIL, 500).split(',').map((s) => s.trim()).filter(Boolean);
  if (admins.length) {
    try {
      const email = renderAdminEmail(order, warnings);
      result.admin = await sendEmail({
        to: admins,
        ...email,
        replyTo: order.customer.email,
        idempotencyKey: `admin-new-order/${razorpay_payment_id}`,
      });
    } catch (err) {
      console.error('order-confirmation: admin email failed:', err.message);
      result.admin = { sent: false, error: err.message };
    }
  }

  console.log('order-confirmation:', order.orderId, JSON.stringify(result));
  return reply(result.success ? 200 : 502, result);
};
