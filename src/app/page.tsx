"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";
import { TrendingUp, Bot, HelpCircle, ArrowRight, Vote, Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/hooks/useAuth";
import { LanguageSelector } from "@/components/LanguageSelector";


const features = [
  {
    icon: TrendingUp,
    title: "Timeline Journey",
    description:
      "Track key dates, local town halls, and registration deadlines with your personalized civic roadmap.",
    link: "/journey",
    linkText: "Explore Map",
  },
  {
    icon: Bot,
    title: "Ask AI Expert",
    description:
      "Neutral, fact-checked analysis of complex ballot measures and legislative impacts in plain language.",
    link: "/ask",
    linkText: "Open Chat",
  },
  {
    icon: HelpCircle,
    title: "Civic Quiz",
    description:
      "Test your knowledge on local governance and find out how proposed policies align with your values.",
    link: "/quiz",
    linkText: "Start Quiz",
  },
];

export default function HomePage() {
  const { user, loading, signInWithGoogle, logout } = useAuth();

  return (
    <main id="main-content" className="flex flex-col min-h-screen pb-20">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-electric/20 flex items-center justify-center">
            <Vote className="w-4 h-4 text-electric" />
          </div>
          <span className="font-bold text-lg text-foreground">CivicAI</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          {loading ? (
            <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-muted-foreground hidden sm:inline-block">
                {user.displayName || "User"}
              </span>
              {user.photoURL ? (
                <Image src={user.photoURL} alt="Profile" width={32} height={32} className="w-8 h-8 rounded-full border border-border" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-xs">👤</span>
                </div>
              )}
              <Button variant="ghost" size="icon" onClick={logout} className="h-8 w-8 text-muted-foreground hover:text-red-400" title="Sign out">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={signInWithGoogle} className="text-xs h-8 bg-card border-border hover:bg-electric/10 hover:border-electric">
              Sign In
            </Button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-5 pt-8 pb-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="bg-electric/10 text-electric border-electric/20 mb-6 px-4 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2 inline-block animate-pulse" />
            LIVE ELECTION DATA 2024
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold leading-tight mb-4"
        >
          Understand Your Vote.{" "}
          <span className="gradient-text">Shape Your Democracy.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground text-base max-w-md mx-auto mb-8 leading-relaxed"
        >
          CivicAI demystifies complex electoral data, ballot measures, and
          candidate platforms using verified information and neutral AI analysis.
          Your journey to an informed vote starts here.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col gap-3 max-w-xs mx-auto"
        >
          <Link href="/journey">
            <Button className="w-full bg-electric hover:bg-electric/80 text-white font-semibold py-6 text-base rounded-xl">
              Start Your Journey
            </Button>
          </Link>
          <Link href="/ask">
            <Button
              variant="outline"
              className="w-full border-border hover:bg-secondary/50 font-semibold py-6 text-base rounded-xl"
            >
              Ask AI Assistant
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Feature Cards */}
      <section className="px-5 space-y-4 pb-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.15 }}
            >
              <Link href={feature.link}>
                <Card className="bg-card border-border hover:glow-blue transition-all duration-300 group">
                  <CardContent className="p-5">
                    <div className="w-10 h-10 rounded-xl bg-electric/10 flex items-center justify-center mb-4 group-hover:bg-electric/20 transition-colors">
                      <Icon className="w-5 h-5 text-electric" />
                    </div>
                    <h2 className="font-bold text-lg text-foreground mb-2">
                      {feature.title}
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                      {feature.description}
                    </p>
                    <span className="text-electric text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      {feature.linkText}{" "}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </section>

      <BottomNav />
    </main>
  );
}
