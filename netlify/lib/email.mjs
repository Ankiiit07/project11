// Minimal Resend sender for store notifications (RESEND_API_KEY, EMAIL_FROM).

export const storeInbox = () =>
  (process.env.ADMIN_ORDER_EMAIL || process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || '')
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);

export async function sendEmail({ to, subject, text, html, replyTo }) {
  if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY is not set');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || 'Cafe at Once <onboarding@resend.dev>',
      to,
      subject,
      text,
      ...(html ? { html } : {}),
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(`Resend error ${res.status}: ${data.message || data.name || 'unknown'}`);
  }
}
