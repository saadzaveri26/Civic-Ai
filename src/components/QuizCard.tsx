"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, ArrowRight } from "lucide-react";

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuizCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onNext: (isCorrect: boolean) => void;
}

export function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  onNext,
}: QuizCardProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleSelect = (index: number) => {
    if (hasAnswered) return;
    setSelectedIndex(index);
    setHasAnswered(true);
  };

  const isCorrect = selectedIndex === question.correctIndex;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-4 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
        <span>
          Question {questionNumber} of {totalQuestions}
        </span>
        <span>
          {Math.round((questionNumber / totalQuestions) * 100)}% Complete
        </span>
      </div>

      <Card className="glow-blue bg-card border-border">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-6 leading-snug">
            {question.question}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, index) => {
              let buttonStyle = "bg-secondary/50 border-border text-foreground hover:bg-secondary";

              if (hasAnswered) {
                if (index === question.correctIndex) {
                  buttonStyle =
                    "bg-green-500/20 border-green-500 text-green-400";
                } else if (index === selectedIndex && !isCorrect) {
                  buttonStyle = "bg-red-500/20 border-red-500 text-red-400";
                } else {
                  buttonStyle = "bg-secondary/30 border-border/50 text-muted-foreground";
                }
              }

              return (
                <motion.div
                  key={index}
                  animate={
                    hasAnswered && index === selectedIndex && !isCorrect
                      ? { x: [0, -8, 8, -8, 8, 0] }
                      : {}
                  }
                  transition={{ duration: 0.4 }}
                >
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left h-auto py-4 px-4 text-sm ${buttonStyle} transition-all duration-200`}
                    onClick={() => handleSelect(index)}
                    disabled={hasAnswered}
                  >
                    <span className="flex-1">{option}</span>
                    {hasAnswered && index === question.correctIndex && (
                      <Check className="w-5 h-5 text-green-400 ml-2 flex-shrink-0" />
                    )}
                    {hasAnswered &&
                      index === selectedIndex &&
                      !isCorrect && (
                        <X className="w-5 h-5 text-red-400 ml-2 flex-shrink-0" />
                      )}
                  </Button>
                </motion.div>
              );
            })}
          </div>

          {hasAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <div
                className={`p-3 rounded-lg text-sm mb-4 ${
                  isCorrect
                    ? "bg-green-500/10 text-green-300 border border-green-500/20"
                    : "bg-red-500/10 text-red-300 border border-red-500/20"
                }`}
              >
                <p className="font-semibold mb-1">
                  {isCorrect ? "✓ Correct!" : "✗ Incorrect"}
                </p>
                <p className="text-xs opacity-80">{question.explanation}</p>
              </div>

              <Button
                onClick={() => onNext(isCorrect)}
                className="w-full bg-electric hover:bg-electric/80 text-white font-semibold"
              >
                Next Question <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
