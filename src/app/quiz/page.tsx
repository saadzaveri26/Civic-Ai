"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";
import { QuizCard } from "@/components/QuizCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Vote, Sparkles, Share2, RotateCcw, Trophy } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export default function QuizPage() {
  const { language } = useLanguage();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<"idle" | "loading" | "playing" | "done">("idle");

  const generateQuiz = async () => {
    setPhase("loading");
    try {
      const res = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language }),
      });
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setQuestions(data);
        setCurrentIndex(0);
        setScore(0);
        setPhase("playing");
      } else {
        setPhase("idle");
      }
    } catch {
      setPhase("idle");
    }
  };

  const handleNext = (isCorrect: boolean) => {
    if (isCorrect) setScore((s) => s + 1);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setPhase("done");
    }
  };

  const shareResult = () => {
    const text = `I scored ${score}/${questions.length} on the CivicAI Election Quiz! 🗳️ Try it yourself!`;
    navigator.clipboard.writeText(text);
  };

  return (
    <main id="main-content" className="flex flex-col min-h-screen pb-20">
      <header className="flex items-center px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-electric/20 flex items-center justify-center">
            <Vote className="w-4 h-4 text-electric" />
          </div>
          <span className="font-bold text-lg">CivicAI</span>
        </div>
      </header>

      <section className="px-5 pt-4 pb-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-2">Test Your Knowledge</h1>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Challenge your understanding of current civic measures and election protocols with our AI-curated quiz.
          </p>
        </motion.div>
      </section>

      <section className="px-5 flex-1">
        {phase === "idle" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center pt-10">
            <Button onClick={generateQuiz} className="bg-electric hover:bg-electric/80 text-white font-semibold py-6 px-8 text-base rounded-xl">
              <Sparkles className="w-5 h-5 mr-2" /> Generate Quiz
            </Button>
          </motion.div>
        )}

        {phase === "loading" && (
          <div className="space-y-4">
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        )}

        {phase === "playing" && questions[currentIndex] && (
          <AnimatePresence mode="wait">
            <QuizCard
              key={currentIndex}
              question={questions[currentIndex]}
              questionNumber={currentIndex + 1}
              totalQuestions={questions.length}
              onNext={handleNext}
            />
          </AnimatePresence>
        )}

        {phase === "done" && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <Card className="glow-blue-strong bg-card border-border">
              <CardContent className="p-8">
                <div className="text-6xl mb-4">
                  <Trophy className="w-16 h-16 mx-auto text-yellow-400" />
                </div>
                <h2 className="text-3xl font-bold mb-2">
                  {score}/{questions.length} Correct 🎉
                </h2>
                <p className="text-muted-foreground mb-6">
                  {score >= 4
                    ? "You're a Civic Master! You've successfully navigated the complexities of the election guides."
                    : score >= 2
                    ? "Good effort! Review the election journey to boost your knowledge."
                    : "Keep learning! Check out the election journey to improve."}
                </p>
                <div className="flex flex-col gap-3">
                  <Button onClick={shareResult} className="bg-electric hover:bg-electric/80 text-white font-semibold py-5 rounded-xl">
                    <Share2 className="w-4 h-4 mr-2" /> Share Result
                  </Button>
                  <Button variant="outline" onClick={generateQuiz} className="border-border hover:bg-secondary py-5 rounded-xl">
                    <RotateCcw className="w-4 h-4 mr-2" /> Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </section>

      <BottomNav />
    </main>
  );
}
