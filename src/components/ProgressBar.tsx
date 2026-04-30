"use client";

import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  completed: number;
  total: number;
}

export function ProgressBar({ completed, total }: ProgressBarProps) {
  const percentage = Math.round((completed / total) * 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-muted-foreground">Your Progress</p>
        <p className="text-sm font-semibold text-electric-dim">
          {completed}/{total} steps completed
        </p>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Progress
          value={percentage}
          className="h-2 bg-secondary"
        />
      </motion.div>
      {/* Step indicators */}
      <div className="flex gap-1 mt-2">
        {Array.from({ length: total }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.05, duration: 0.2 }}
            className={`flex-1 h-1 rounded-full ${
              i < completed ? "bg-electric" : "bg-secondary"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
