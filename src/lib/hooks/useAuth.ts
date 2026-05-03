"use client";

import { useState, useEffect, useCallback } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  signOut,
  User,
  getRedirectResult,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

/** Return type for the {@link useAuth} hook. */
interface UseAuthReturn {
  /** The currently authenticated Firebase user, or null if signed out. */
  user: User | null;
  /** Whether the auth state is still being determined on mount. */
  loading: boolean;
  /** A user-facing error message if authentication failed. */
  error: string | null;
  /** Initiates Google sign-in via popup (falls back to redirect). */
  signInWithGoogle: () => Promise<void>;
  /** Signs the current user out. */
  logout: () => Promise<void>;
}

const googleProvider = new GoogleAuthProvider();

/**
 * Custom hook for Firebase authentication.
 * Manages user state, handles Google sign-in (popup with redirect fallback),
 * and provides a logout function. Subscribes to `onAuthStateChanged` on mount.
 *
 * @returns An object containing the user, loading state, error, and auth actions.
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Handle redirect result on mount (for signInWithRedirect fallback)
  useEffect(() => {
    getRedirectResult(auth).catch(() => {
      // Silently ignore redirect result errors (e.g. popup-closed-by-user)
    });
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (popupError: unknown) {
      const firebaseError = popupError as { code?: string; message?: string };

      // If popup was blocked or failed, fall back to redirect
      if (
        firebaseError.code === "auth/popup-blocked" ||
        firebaseError.code === "auth/popup-closed-by-user" ||
        firebaseError.code === "auth/cancelled-popup-request"
      ) {
        // For user-cancelled, don't retry
        if (firebaseError.code === "auth/popup-closed-by-user") return;
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch {
          setError("Sign in failed. Please try again.");
        }
      } else {
        setError(firebaseError.message || "Sign in failed. Please try again.");
      }
    }
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    try {
      await signOut(auth);
    } catch {
      setError("Sign out failed. Please try again.");
    }
  }, []);

  return { user, loading, error, signInWithGoogle, logout };
}
