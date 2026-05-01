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

const googleProvider = new GoogleAuthProvider();

export function useAuth() {
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
    getRedirectResult(auth).catch((err) => {
      if (err?.code && err.code !== "auth/popup-closed-by-user") {
        console.error("Redirect result error:", err);
      }
    });
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (popupError: unknown) {
      const firebaseError = popupError as { code?: string; message?: string };
      console.warn("Popup sign-in failed, trying redirect:", firebaseError.code);

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
        } catch (redirectError) {
          console.error("Redirect sign-in also failed:", redirectError);
          setError("Sign in failed. Please try again.");
        }
      } else {
        console.error("Sign in failed:", firebaseError);
        setError(firebaseError.message || "Sign in failed. Please try again.");
      }
    }
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out failed:", error);
      setError("Sign out failed. Please try again.");
    }
  }, []);

  return { user, loading, error, signInWithGoogle, logout };
}

