"use client";

import { useState, useEffect, useCallback } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./useAuth";

/** Return type for the {@link useJourneyProgress} hook. */
interface UseJourneyProgressReturn {
  /** Array of step IDs that the user has completed. */
  completedSteps: string[];
  /** Whether the progress data is still being fetched. */
  loading: boolean;
  /** Marks a specific step as complete (optimistically updates state, then persists). */
  markStepComplete: (stepId: string) => Promise<void>;
  /** Resets all progress for the current user. */
  resetProgress: () => Promise<void>;
}

/**
 * Custom hook for managing a user's election journey progress.
 * Reads completed steps from Firestore on mount and provides functions
 * to mark individual steps as complete or reset all progress.
 * Falls back to empty state when the user is not authenticated.
 *
 * @returns An object containing completed steps, loading state, and mutation functions.
 */
export function useJourneyProgress(): UseJourneyProgressReturn {
  const { user } = useAuth();
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCompletedSteps([]);
      setLoading(false);
      return;
    }

    const fetchProgress = async () => {
      try {
        const docRef = doc(db, "journeyProgress", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCompletedSteps(docSnap.data().completedSteps || []);
        }
      } catch {
        // Silently handle Firestore read errors; user sees empty progress
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user]);

  const markStepComplete = useCallback(
    async (stepId: string) => {
      const newSteps = [...completedSteps, stepId];
      setCompletedSteps(newSteps);

      if (user) {
        try {
          const idToken = await user.getIdToken();
          await fetch("/api/progress", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${idToken}`,
            },
            body: JSON.stringify({ userId: user.uid, stepId }),
          });
        } catch {
          // Silently handle network errors; optimistic update remains
        }
      }
    },
    [user, completedSteps]
  );

  const resetProgress = useCallback(async () => {
    setCompletedSteps([]);
    if (user) {
      try {
        const docRef = doc(db, "journeyProgress", user.uid);
        await setDoc(docRef, { userId: user.uid, completedSteps: [], lastVisited: new Date() });
      } catch {
        // Silently handle Firestore write errors
      }
    }
  }, [user]);

  return { completedSteps, loading, markStepComplete, resetProgress };
}
