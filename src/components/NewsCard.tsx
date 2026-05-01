"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { SuggestionChip } from "@/components/SuggestionChip";
import { Bot } from "lucide-react";

export interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  category: "Voting" | "Policy" | "Campaign" | "Results" | "Legal";
  state: string;
  timeAgo: string;
  isBreaking: boolean;
}

const categoryColors = {
  Voting: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Policy: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  Campaign: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  Results: "bg-green-500/10 text-green-500 border-green-500/20",
  Legal: "bg-red-500/10 text-red-500 border-red-500/20",
};

const relatedTopicsMap = {
  Voting: ["How to register?", "Find my polling booth", "What is VVPAT?"],
  Policy: ["Election manifesto", "Code of conduct", "Economic impact"],
  Campaign: ["Campaign finance limits", "Political advertising", "Rally rules"],
  Results: ["How are votes counted?", "Exit polls explained", "EVM security"],
  Legal: ["Election disputes", "Supreme Court rulings", "ECI powers"],
};

interface NewsCardProps {
  news: NewsItem;
  index: number;
}

export function NewsCard({ news, index }: NewsCardProps) {
  const router = useRouter();
  
  const relatedTopics = relatedTopicsMap[news.category] || relatedTopicsMap["Voting"];

  const handleAskAI = () => {
    // Navigate to ask page and ideally pass the query.
    // The ask page currently doesn't read query params, but the prompt says 
    // "navigates to /ask?q={encodeURIComponent(headline)}"
    router.push(`/ask?q=${encodeURIComponent(news.headline)}`);
  };

  return (
    <Sheet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="h-full"
      >
        <SheetTrigger className="h-full w-full text-left outline-none">
          <Card className="p-4 bg-card border-border hover:shadow-lg hover:shadow-electric/10 hover:border-electric/50 transition-all cursor-pointer h-full flex flex-col group">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={categoryColors[news.category] || "bg-secondary text-secondary-foreground"}>
                  {news.category}
                </Badge>
                {news.isBreaking && (
                  <Badge variant="default" className="bg-red-500 text-white animate-pulse">
                    BREAKING
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{news.state}</span>
            </div>
            
            <h3 className="font-semibold text-base mb-2 group-hover:text-electric transition-colors line-clamp-2">
              {news.headline}
            </h3>
            
            <div className="mt-auto pt-3">
              <p className="text-sm text-slate-400 line-clamp-2 mb-3">
                {news.summary}
              </p>
              <div className="flex justify-end">
                <span className="text-xs text-slate-500">{news.timeAgo}</span>
              </div>
            </div>
          </Card>
        </SheetTrigger>
      </motion.div>
      
      <SheetContent className="bg-card border-l-border w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6 mt-4 text-left">
          <div className="flex gap-2 items-center mb-4">
            <Badge variant="outline" className={categoryColors[news.category] || "bg-secondary text-secondary-foreground"}>
              {news.category}
            </Badge>
            <span className="text-xs text-muted-foreground">{news.timeAgo} • {news.state}</span>
          </div>
          <SheetTitle className="text-xl font-bold leading-tight mb-2">
            {news.headline}
          </SheetTitle>
          <SheetDescription className="text-base text-foreground/80 pt-2">
            {news.summary}
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-8 space-y-6">
          <Button onClick={handleAskAI} className="w-full bg-electric hover:bg-electric/80 text-white font-semibold py-6 rounded-xl">
            <Bot className="w-5 h-5 mr-2" />
            Ask AI about this
          </Button>
          
          <div className="space-y-3 border-t border-border pt-6">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Related Topics
            </h4>
            <div className="flex flex-wrap gap-2">
              {relatedTopics.map((topic, i) => (
                <SuggestionChip 
                  key={i} 
                  text={topic} 
                  index={i} 
                  onSelect={(text) => router.push(`/ask?q=${encodeURIComponent(text)}`)} 
                />
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
