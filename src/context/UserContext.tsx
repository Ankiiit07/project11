// src/context/UserContext.tsx
// Sign-in is handled by Firebase Auth; the customer's profile (name, phone,
// saved address) lives in MongoDB behind the `profile` Netlify function.

import React, { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile as updateFirebaseProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "../lib/firebase";
import { accountApi } from "../services/accountApi";
import type { User } from "../store";

interface UserContextType {
  user: User | null;
  loading: boolean;
  /** False until Firebase has told us whether someone is signed in. */
  ready: boolean;
  isAuthenticated: boolean;
  emailVerified: boolean;
  authAvailable: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

const FRIENDLY_ERRORS: Record<string, string> = {
  "auth/invalid-credential": "That email and password don't match. Please try again.",
  "auth/wrong-password": "That email and password don't match. Please try again.",
  "auth/user-not-found": "That email and password don't match. Please try again.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/email-already-in-use": "An account with this email already exists. Try signing in instead.",
  "auth/weak-password": "Please choose a password with at least 6 characters.",
  "auth/too-many-requests": "Too many attempts. Please wait a few minutes and try again.",
  "auth/popup-closed-by-user": "Google sign-in was closed before it finished.",
  "auth/popup-blocked": "Your browser blocked the Google sign-in window. Please allow pop-ups and try again.",
  "auth/network-request-failed": "Network error. Please check your connection and try again.",
  "auth/account-exists-with-different-credential":
    "This email is already registered with a password. Sign in with your password instead.",
};

export function friendlyAuthError(err: unknown): Error {
  const code = (err as { code?: string })?.code;
  if (code && FRIENDLY_ERRORS[code]) return new Error(FRIENDLY_ERRORS[code]);
  return err instanceof Error ? err : new Error("Something went wrong. Please try again.");
}

function requireAuth() {
  if (!auth) throw new Error("Sign-in isn't available right now. Please try again later.");
  return auth;
}

// Used when the profile service can't be reached, so sign-in still works.
const fallbackProfile = (fbUser: FirebaseUser): User => ({
  id: fbUser.uid,
  email: fbUser.email || "",
  name: fbUser.displayName || "",
  phone: "",
  role: "customer",
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(!isFirebaseConfigured);

  const loadProfile = useCallback(async (fbUser: FirebaseUser) => {
    try {
      setUser(await accountApi.getProfile());
    } catch (error) {
      console.error("Could not load profile:", error);
      setUser(fallbackProfile(fbUser));
    }
  }, []);

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) await loadProfile(fbUser);
      else setUser(null);
      setReady(true);
    });
  }, [loadProfile]);

  const run = async (fn: () => Promise<unknown>) => {
    setLoading(true);
    try {
      await fn();
    } catch (error) {
      throw friendlyAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const login = (email: string, password: string) =>
    run(() => signInWithEmailAndPassword(requireAuth(), email.trim(), password));

  const loginWithGoogle = () => run(() => signInWithPopup(requireAuth(), new GoogleAuthProvider()));

  const register = (name: string, email: string, password: string, phone?: string) =>
    run(async () => {
      const { user: fbUser } = await createUserWithEmailAndPassword(requireAuth(), email.trim(), password);
      await updateFirebaseProfile(fbUser, { displayName: name.trim() });
      sendEmailVerification(fbUser).catch((e) => console.warn("Verification email failed:", e));
      setUser(await accountApi.updateProfile({ name: name.trim(), phone: phone?.trim() || "" }));
    });

  const resetPassword = (email: string) => run(() => sendPasswordResetEmail(requireAuth(), email.trim()));

  const resendVerification = () =>
    run(async () => {
      if (auth?.currentUser) await sendEmailVerification(auth.currentUser);
    });

  const logout = async () => {
    if (auth) await signOut(auth);
    setUser(null);
  };

  // Saves to the account when signed in; does nothing for guests.
  const updateProfile = async (userData: Partial<User>) => {
    if (!firebaseUser) return;
    const { name, phone, address } = userData;
    setUser(await accountApi.updateProfile({ name, phone, address }));
  };

  const refreshUser = async () => {
    if (!auth?.currentUser) return;
    await auth.currentUser.reload();
    setFirebaseUser(auth.currentUser);
    await loadProfile(auth.currentUser);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        ready,
        isAuthenticated: !!user,
        emailVerified: !!firebaseUser?.emailVerified,
        authAvailable: isFirebaseConfigured,
        login,
        loginWithGoogle,
        register,
        resetPassword,
        resendVerification,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
