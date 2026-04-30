"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Clock,
} from "lucide-react";
import type { ElectionStep } from "@/lib/electionData";

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

interface TimelineStepProps {
  step: ElectionStep;
  isCompleted: boolean;
  onMarkComplete: (stepId: string) => void;
  index: number;
}

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
                <h3 className="font-semibold text-foreground text-lg">
                  {step.title}
                </h3>
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
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
