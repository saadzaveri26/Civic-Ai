"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Clock } from "lucide-react";
import type { ElectionStep } from "@/lib/electionData";

/** Props for the TimelineStepDetail component. */
interface TimelineStepDetailProps {
  /** The election step data to render details for. */
  step: ElectionStep;
  /** Whether the user has already completed (marked as read) this step. */
  isCompleted: boolean;
  /** Callback invoked when the user marks the step as complete. */
  onMarkComplete: (stepId: string) => void;
  /** Resolved icon component for the step. */
  icon: React.ElementType;
}

/**
 * Expandable detail panel for a single timeline step.
 * Shows step details, key facts, duration, and a "Mark as Read" action.
 */
export function TimelineStepDetail({ step, isCompleted, onMarkComplete, icon: IconComponent }: TimelineStepDetailProps) {
  return (
    <div className="mt-4 pt-4 border-t border-border/50">
      <div className="flex items-center gap-2 mb-3 text-electric-dim">
        <IconComponent className="w-4 h-4" />
        <span className="text-xs font-semibold uppercase tracking-wider">
          Step {step.stepNumber} Details
        </span>
      </div>

      <p className="text-foreground/80 text-sm leading-relaxed mb-4">
        {step.details}
      </p>

      <div className="mb-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Key Facts
        </p>
        <div className="flex flex-wrap gap-2">
          {step.keyFacts.map((fact, i) => (
            <Badge
              key={i}
              variant="outline"
              className="text-xs bg-secondary/50 border-border"
            >
              {fact}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
        <Clock className="w-3 h-3" />
        <span>{step.duration}</span>
      </div>

      {!isCompleted && (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onMarkComplete(step.id);
          }}
          className="w-full bg-electric hover:bg-electric/80 text-white font-semibold"
        >
          Mark as Read <Check className="w-4 h-4 ml-2" />
        </Button>
      )}
    </div>
  );
}
