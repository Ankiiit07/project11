// netlify/functions/contact.mjs
//
// POST { type: 'contact', name, email, subject?, message }   contact form
// POST { type: 'newsletter', email }                          newsletter sign-up
//
// Saves to MongoDB (`messages`, `subscribers`) so nothing is lost, then emails the
// store inbox (ADMIN_ORDER_EMAIL, else ADMIN_EMAILS) via Resend. A hidden
// `website` field catches bots, and each IP is limited to 5 submissions an hour.

import { getDb } from '../lib/db.mjs';
import { reply, str, isEmail, parseBody } from '../lib/http.mjs';
import { sendEmail, storeInbox } from '../lib/email.mjs';

const HOURLY_LIMIT = 5;

const clientIp = (event) =>
  str(event.headers?.['x-nf-client-connection-ip'] || event.headers?.['x-forwarded-for']?.split(',')[0], 64);

async function notify(subject, text, replyTo) {
  const to = storeInbox();
  if (!to.length) return console.warn('contact: no ADMIN_ORDER_EMAIL / ADMIN_EMAILS set, skipping email');
  try {
    await sendEmail({ to, subject, text, replyTo });
  } catch (err) {
    // Saved in MongoDB already; don't fail the customer's request over email.
    console.error('contact: email failed:', err.message);
  }
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return reply(200, {});
  if (event.httpMethod !== 'POST') return reply(405, { success: false, error: 'Method not allowed' });

  const body = parseBody(event);
  if (!body) return reply(400, { success: false, error: 'Invalid JSON' });
  // Bots fill every field, including this one that people can't see.
  if (str(body.website)) return reply(200, { success: true });

  const email = str(body.email, 200).toLowerCase();
  if (!isEmail(email)) return reply(400, { success: false, error: 'Please enter a valid email address' });

  try {
    const db = await getDb();
    const ip = clientIp(event);
    const since = new Date(Date.now() - 60 * 60 * 1000);
    if (ip && (await db.collection('messages').countDocuments({ ip, createdAt: { $gte: since } })) >= HOURLY_LIMIT) {
      return reply(429, { success: false, error: 'Too many messages. Please try again in a little while.' });
    }

    if (body.type === 'newsletter') {
      const existing = await db.collection('subscribers').findOne({ email });
      if (existing) return reply(200, { success: true, alreadySubscribed: true });
      await db.collection('subscribers').insertOne({ email, source: 'footer', subscribedAt: new Date() });
      await db.collection('messages').insertOne({ type: 'newsletter', email, ip, createdAt: new Date() });
      await notify('New newsletter subscriber', `${email} subscribed to the newsletter.`);
      return reply(200, { success: true });
    }

    const name = str(body.name, 100);
    const subject = str(body.subject, 60);
    const message = str(body.message, 5000);
    if (!name) return reply(400, { success: false, error: 'Please enter your name' });
    if (message.length < 10) return reply(400, { success: false, error: 'Please write a little more (10+ characters)' });

    await db.collection('messages').insertOne({ type: 'contact', name, email, subject, message, ip, createdAt: new Date() });
    await notify(
      `Website message${subject ? ` (${subject})` : ''} from ${name}`,
      `${message}\n\n— ${name} <${email}>\nReply to this email to answer them.`,
      email
    );
    return reply(200, { success: true });
  } catch (err) {
    console.error('contact:', err);
    return reply(500, { success: false, error: 'Something went wrong. Please try again, or email cafeatonce@gmail.com.' });
  }
};
