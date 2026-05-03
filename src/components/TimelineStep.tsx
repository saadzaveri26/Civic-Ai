"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  Check,
  ClipboardCheck,
  UserCheck,
  Megaphone,
  Vote,
  Calculator,
  Trophy,
  Scale,
  Landmark,
} from "lucide-react";
import type { ElectionStep } from "@/lib/electionData";
import { TimelineStepDetail } from "@/components/TimelineStepDetail";

const iconMap: Record<string, React.ElementType> = {
  ClipboardCheck,
  UserCheck,
  Megaphone,
  Vote,
  Calculator,
  Trophy,
  Scale,
  Landmark,
};

/** Props for the TimelineStep component. */
interface TimelineStepProps {
  /** Election step data to display. */
  step: ElectionStep;
  /** Whether this step has been completed by the user. */
  isCompleted: boolean;
  /** Callback to mark a step as complete. */
  onMarkComplete: (stepId: string) => void;
  /** Index in the list, used for staggered animation delay. */
  index: number;
}

/**
 * An expandable timeline card for a single election process step.
 * Clicking toggles the detail panel rendered by `TimelineStepDetail`.
 */
export function TimelineStep({
  step,
  isCompleted,
  onMarkComplete,
  index,
}: TimelineStepProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const IconComponent = iconMap[step.icon] || ClipboardCheck;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card
        tabIndex={0}
        aria-expanded={isExpanded}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
        className={`cursor-pointer transition-all duration-300 border-l-4 ${
          isCompleted
            ? "border-l-green-500 bg-card/80"
            : "border-l-electric hover:glow-blue bg-card"
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardContent className="p-4">
          {/* Header - always visible */}
          <div className="flex items-start gap-3">
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                isCompleted
                  ? "bg-green-500/20 text-green-400"
                  : "bg-electric/20 text-electric-dim"
              }`}
            >
              {isCompleted ? (
                <Check className="w-5 h-5" />
              ) : (
                step.stepNumber
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-semibold text-foreground text-lg">
                  {step.title}
                </h2>
                {isCompleted && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                    DONE
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground text-sm">{step.summary}</p>
            </div>

            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            </motion.div>
          </div>

          {/* Expandable content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <TimelineStepDetail
                  step={step}
                  isCompleted={isCompleted}
                  onMarkComplete={onMarkComplete}
                  icon={IconComponent}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
