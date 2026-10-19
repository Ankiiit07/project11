// Firebase Auth setup. Values come from Netlify env vars (Firebase console →
// Project settings → Your apps → Web app). They are public by design; access is
// controlled by Firebase Auth and by our Netlify functions verifying ID tokens.
//
// The Firebase SDK is large (about 400 KB), so it is not part of the main bundle:
// loadAuth() fetches it on first use and every caller shares the same instance.

import type { Auth } from 'firebase/auth';

// On the live site, run the sign-in helper (/__/auth/handler) on our own domain;
// public/_redirects proxies it to Firebase. Browsers that block third-party
// storage (Safari, iOS, private windows) break Google sign-in otherwise.
// Locally there is no proxy, so use Firebase's own domain.
const isLocal = typeof window === 'undefined' || /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: isLocal ? import.meta.env.VITE_FIREBASE_AUTH_DOMAIN : window.location.host,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(config.apiKey && config.authDomain && config.projectId);

if (!isFirebaseConfigured) {
  console.warn('Firebase is not configured: sign-in is disabled. Set the VITE_FIREBASE_* env vars.');
}

export type FirebaseAuthModule = typeof import('firebase/auth');

let loading: Promise<{ auth: Auth; fb: FirebaseAuthModule } | null> | null = null;

/** The Firebase Auth instance and SDK functions, loaded on first call; null when not configured. */
export const loadAuth = () => {
  if (!loading) {
    loading = isFirebaseConfigured
      ? Promise.all([import('firebase/app'), import('firebase/auth')]).then(([app, fb]) => ({
          // Same persistence as getAuth() (so existing sign-ins carry over), but without the
          // popup/redirect helper: that pulls Google's gapi iframe into every page, so it is
          // passed to signInWithPopup only when someone actually signs in with Google.
          auth: fb.initializeAuth(app.initializeApp(config), {
            persistence: [fb.indexedDBLocalPersistence, fb.browserLocalPersistence, fb.browserSessionPersistence],
          }),
          fb,
        }))
      : Promise.resolve(null);
  }
  return loading;
};

/** Auth once loading has begun (the app starts it shortly after each page loads); null before that. */
export const authIfLoading = async () => (loading ? (await loading)?.auth ?? null : null);
