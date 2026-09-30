// Contact form and newsletter sign-ups (netlify/functions/contact.mjs).

type ContactRequest =
  | { type: 'contact'; name: string; email: string; subject?: string; message: string; website?: string }
  | { type: 'newsletter'; email: string; website?: string };

export async function sendContact(request: ContactRequest): Promise<{ alreadySubscribed?: boolean }> {
  const res = await fetch('/.netlify/functions/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    throw new Error(data.error || 'Something went wrong. Please try again.');
  }
  return data;
}
