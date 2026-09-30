// Store-owner accounts: signed-in users whose *verified* email is listed in
// ADMIN_EMAILS (comma-separated; falls back to ADMIN_EMAIL).

export function adminEmails() {
  return (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export const isAdmin = (user) => Boolean(user?.emailVerified && user.email && adminEmails().includes(user.email));
