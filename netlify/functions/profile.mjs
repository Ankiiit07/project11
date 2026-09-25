// netlify/functions/profile.mjs
//
// GET /.netlify/functions/profile   the signed-in customer's profile (created on first call)
// PUT /.netlify/functions/profile   update name, phone and saved address
//
// The email always comes from the verified Firebase token, never from the request body.

import { getDb } from '../lib/db.mjs';
import { getAuthUser } from '../lib/auth.mjs';
import { reply, str, parseBody } from '../lib/http.mjs';

export function toProfile(doc) {
  return {
    id: doc.uid,
    email: doc.email,
    name: doc.name || '',
    phone: doc.phone || '',
    address: doc.address || null,
    role: 'customer',
  };
}

export function cleanUpdate(body) {
  const update = {};
  if (body.name !== undefined) update.name = str(body.name, 120);
  if (body.phone !== undefined) update.phone = str(body.phone, 20);
  if (body.address !== undefined) {
    const a = body.address || {};
    update.address = {
      street: str(a.street, 300),
      city: str(a.city, 80),
      state: str(a.state, 80),
      zipCode: str(a.zipCode, 12),
      country: str(a.country, 4) || 'IN',
    };
  }
  return update;
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return reply(200, {});
  try {
    const user = await getAuthUser(event);
    if (!user) return reply(401, { success: false, error: 'Please sign in' });

    const users = (await getDb()).collection('users');
    const now = new Date();

    if (event.httpMethod === 'GET') {
      const doc = await users.findOneAndUpdate(
        { uid: user.uid },
        {
          $set: { email: user.email, lastSeenAt: now },
          $setOnInsert: { uid: user.uid, name: user.name, createdAt: now },
        },
        { upsert: true, returnDocument: 'after' }
      );
      return reply(200, { success: true, profile: toProfile(doc) });
    }

    if (event.httpMethod === 'PUT') {
      const body = parseBody(event);
      if (!body) return reply(400, { success: false, error: 'Invalid JSON' });
      const doc = await users.findOneAndUpdate(
        { uid: user.uid },
        {
          $set: { ...cleanUpdate(body), email: user.email, updatedAt: now },
          $setOnInsert: { uid: user.uid, createdAt: now },
        },
        { upsert: true, returnDocument: 'after' }
      );
      return reply(200, { success: true, profile: toProfile(doc) });
    }

    return reply(405, { success: false, error: 'Method not allowed' });
  } catch (err) {
    console.error('profile:', err);
    return reply(500, { success: false, error: 'Something went wrong. Please try again.' });
  }
};
