"use client";

import { BottomNav } from "@/components/BottomNav";
import { ProgressBar } from "@/components/ProgressBar";
import { TimelineStep } from "@/components/TimelineStep";
import { ELECTION_STEPS } from "@/lib/electionData";
import { useJourneyProgress } from "@/lib/hooks/useJourneyProgress";
import { motion } from "framer-motion";
import { Vote } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function JourneyPage() {
  const { completedSteps, loading, markStepComplete } = useJourneyProgress();

  return (
    <main className="flex flex-col min-h-screen pb-20">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-electric/20 flex items-center justify-center">
            <Vote className="w-4 h-4 text-electric" />
          </div>
          <span className="font-bold text-lg text-foreground">CivicAI</span>
        </div>
      </header>

      {/* Title */}
      <section className="px-5 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Your Election Journey
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Track your progress toward becoming a fully informed voter for the
            upcoming elections.
          </p>
        </motion.div>
      </section>

      {/* Progress */}
      <section className="px-5 pb-6">
        {loading ? (
          <Skeleton className="h-12 w-full rounded-lg" />
        ) : (
          <ProgressBar
            completed={completedSteps.length}
            total={ELECTION_STEPS.length}
          />
        )}
      </section>

      {/* Timeline Steps */}
      <section className="px-5 space-y-3 pb-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))
        ) : (
          ELECTION_STEPS.map((step, index) => (
            <TimelineStep
              key={step.id}
              step={step}
              isCompleted={completedSteps.includes(step.id)}
              onMarkComplete={markStepComplete}
              index={index}
            />
          ))
        )}
      </section>

      <BottomNav />
    </main>
  );
}
