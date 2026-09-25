// Verifies Firebase Auth ID tokens sent as "Authorization: Bearer <token>".
// Uses Google's public signing keys, so no Firebase service-account secret is needed,
// only FIREBASE_PROJECT_ID (falls back to VITE_FIREBASE_PROJECT_ID).

import { createRemoteJWKSet, jwtVerify } from 'jose';

const JWKS = createRemoteJWKSet(
  new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com')
);

/** Returns { uid, email, emailVerified, name } for a valid token, otherwise null. */
export async function getAuthUser(event) {
  const header = event.headers?.authorization || event.headers?.Authorization || '';
  const match = /^Bearer\s+(.+)$/i.exec(header);
  if (!match) return null;

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;
  if (!projectId) {
    console.error('auth: FIREBASE_PROJECT_ID is not set');
    return null;
  }

  try {
    const { payload } = await jwtVerify(match[1], JWKS, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
    });
    if (!payload.sub) return null;
    return {
      uid: payload.sub,
      email: typeof payload.email === 'string' ? payload.email.toLowerCase() : '',
      emailVerified: payload.email_verified === true,
      name: typeof payload.name === 'string' ? payload.name : '',
    };
  } catch (err) {
    console.warn('auth: rejected token:', err.code || err.message);
    return null;
  }
}
