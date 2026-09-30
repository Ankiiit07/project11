// netlify/functions/reviews.mjs
//
// Customer reviews. Only people who bought a product can review it, so every
// published review is a verified purchase.
//
// GET  ?summary=1                  { summary: { [productId]: { count, average } } }
// GET  ?productId=X                published reviews + summary (admins also get hidden ones);
//                                  when signed in, also `mine` and `canReview` (they bought it)
// POST { productId, rating, title?, text }   write or update your review
// POST { action: 'hide'|'show', id }          admins only: moderate a review

import crypto from 'node:crypto';
import { getDb } from '../lib/db.mjs';
import { getAuthUser } from '../lib/auth.mjs';
import { isAdmin } from '../lib/admin.mjs';
import { reply, str, parseBody } from '../lib/http.mjs';
import { ownerFilter } from './orders.mjs';

const round1 = (n) => Math.round(n * 10) / 10;

// Public view of a review: no account IDs or emails.
export function toPublic(doc) {
  return {
    id: doc.id,
    productId: doc.productId,
    name: doc.name,
    rating: doc.rating,
    title: doc.title,
    text: doc.text,
    verifiedPurchase: true,
    status: doc.status,
    createdAt: new Date(doc.createdAt).toISOString(),
    ...(doc.updatedAt ? { updatedAt: new Date(doc.updatedAt).toISOString() } : {}),
  };
}

/** "Priya Sharma" → "Priya S." so reviews don't show full names. */
export function displayName(fullName, email) {
  const parts = str(fullName, 120).split(/\s+/).filter(Boolean);
  if (parts.length === 0) return str(email, 200).split('@')[0].slice(0, 20) || 'Customer';
  return parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0].toUpperCase()}.` : parts[0];
}

async function summaryFor(reviews, match) {
  const rows = await reviews
    .aggregate([
      { $match: { ...match, status: 'published' } },
      { $group: { _id: '$productId', count: { $sum: 1 }, total: { $sum: '$rating' } } },
    ])
    .toArray();
  return Object.fromEntries(rows.map((r) => [r._id, { count: r.count, average: round1(r.total / r.count) }]));
}

// A non-cancelled order of theirs that contains the product.
const purchaseOf = (orders, user, productId) =>
  orders.findOne({ $and: [ownerFilter(user), { 'items.id': productId }, { status: { $ne: 'cancelled' } }] });

async function getReviews(event, db) {
  const q = event.queryStringParameters || {};
  const reviews = db.collection('reviews');

  if (q.summary) {
    const res = reply(200, { success: true, summary: await summaryFor(reviews, {}) });
    res.headers = { ...res.headers, 'Cache-Control': 'public, max-age=300' };
    return res;
  }

  const productId = str(q.productId, 80);
  if (!productId) return reply(400, { success: false, error: 'productId is required' });

  const user = await getAuthUser(event);
  const admin = isAdmin(user);
  // Admins also see hidden reviews, so they can restore them.
  const [list, summary] = await Promise.all([
    reviews
      .find(admin ? { productId } : { productId, status: 'published' })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray(),
    summaryFor(reviews, { productId }),
  ]);

  const body = {
    success: true,
    reviews: list.map(toPublic),
    summary: summary[productId] || { count: 0, average: 0 },
  };
  if (user) {
    const [mine, bought] = await Promise.all([
      reviews.findOne({ productId, uid: user.uid }),
      purchaseOf(db.collection('orders'), user, productId),
    ]);
    body.mine = mine ? toPublic(mine) : null;
    body.canReview = Boolean(bought);
    body.isAdmin = admin;
  }
  return reply(200, body);
}

async function writeReview(body, user, db) {
  const productId = str(body.productId, 80);
  const rating = Number(body.rating);
  const text = str(body.text, 2000);
  const title = str(body.title, 120);
  if (!productId || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return reply(400, { success: false, error: 'Please choose a rating from 1 to 5 stars' });
  }
  if (text.length < 10) return reply(400, { success: false, error: 'Please write at least a few words (10+ characters)' });

  const order = await purchaseOf(db.collection('orders'), user, productId);
  if (!order) {
    return reply(403, { success: false, error: 'Only customers who bought this product can review it' });
  }

  const profile = await db.collection('users').findOne({ uid: user.uid });
  const now = new Date();
  const doc = await db.collection('reviews').findOneAndUpdate(
    { productId, uid: user.uid },
    {
      $set: {
        rating,
        title,
        text,
        name: displayName(profile?.name || user.name || `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`, user.email),
        orderId: order.id,
        updatedAt: now,
      },
      $setOnInsert: { id: crypto.randomUUID(), productId, uid: user.uid, status: 'published', createdAt: now },
    },
    { upsert: true, returnDocument: 'after' }
  );
  return reply(200, { success: true, review: toPublic(doc) });
}

async function moderate(body, user, db) {
  if (!isAdmin(user)) return reply(403, { success: false, error: 'Admins only' });
  const status = body.action === 'hide' ? 'hidden' : body.action === 'show' ? 'published' : null;
  if (!status) return reply(400, { success: false, error: 'action must be hide or show' });
  const doc = await db.collection('reviews').findOneAndUpdate(
    { id: str(body.id, 60) },
    { $set: { status, moderatedBy: user.email, moderatedAt: new Date() } },
    { returnDocument: 'after' }
  );
  if (!doc) return reply(404, { success: false, error: 'Review not found' });
  return reply(200, { success: true, review: toPublic(doc) });
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return reply(200, {});
  try {
    const db = await getDb();
    if (event.httpMethod === 'GET') return await getReviews(event, db);
    if (event.httpMethod === 'POST') {
      const body = parseBody(event);
      if (!body) return reply(400, { success: false, error: 'Invalid JSON' });
      const user = await getAuthUser(event);
      if (!user) return reply(401, { success: false, error: 'Please sign in to write a review' });
      return body.action ? await moderate(body, user, db) : await writeReview(body, user, db);
    }
    return reply(405, { success: false, error: 'Method not allowed' });
  } catch (err) {
    console.error('reviews:', err);
    return reply(500, { success: false, error: 'Something went wrong. Please try again.' });
  }
};
