// Razorpay helpers shared by the order functions.

import crypto from 'node:crypto';

export function isValidSignature(orderId, paymentId, signature, secret) {
  if (!orderId || !paymentId || !signature || !secret) return false;
  const expected = crypto.createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(String(signature));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Looks up a payment with Razorpay. Returns null when keys aren't configured. */
export async function fetchRazorpayPayment(paymentId) {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_SECRET;
  if (!keyId || !secret) return null;
  const res = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`, {
    headers: { Authorization: 'Basic ' + Buffer.from(`${keyId}:${secret}`).toString('base64') },
  });
  if (!res.ok) throw new Error(`Razorpay payment lookup failed (${res.status})`);
  return res.json();
}
