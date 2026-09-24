// Firebase Auth setup. Values come from Netlify env vars (Firebase console →
// Project settings → Your apps → Web app). They are public by design; access is
// controlled by Firebase Auth and by our Netlify functions verifying ID tokens.

import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(config.apiKey && config.authDomain && config.projectId);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

if (isFirebaseConfigured) {
  app = initializeApp(config);
  auth = getAuth(app);
} else {
  console.warn('Firebase is not configured: sign-in is disabled. Set the VITE_FIREBASE_* env vars.');
}

export { auth };
