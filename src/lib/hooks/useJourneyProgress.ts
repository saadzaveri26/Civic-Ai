"use client";

import { useState, useEffect, useCallback } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./useAuth";

export function useJourneyProgress() {
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
      } catch (error) {
        console.error("Error fetching progress:", error);
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
          await fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.uid, stepId }),
          });
        } catch (error) {
          console.error("Error saving progress:", error);
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
      } catch (error) {
        console.error("Error resetting progress:", error);
      }
    }
  }, [user]);

  return { completedSteps, loading, markStepComplete, resetProgress };
}
