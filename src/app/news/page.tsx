"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Newspaper, RefreshCw, Inbox } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { NewsCard, NewsItem } from "@/components/NewsCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";

const CATEGORIES = ["All", "Voting", "Policy", "Campaign", "Results", "Legal"];

export default function NewsPage() {
  const { language } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchNews = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      // Pass cache-busting timestamp if refreshing so API bypasses browser cache,
      // though the route itself implements cache logic.
      const url = `/api/news?language=${language}${isRefresh ? `&_t=${Date.now()}` : ""}`;
      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data)) {
        setNews(data);
      }
    } catch {
      // Fetch errors are silently handled; the previous data or empty state remains
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [language]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const filteredNews = React.useMemo(() => {
    return selectedCategory === "All"
      ? news
      : news.filter((item) => item.category === selectedCategory);
  }, [news, selectedCategory]);

  return (
    <main id="main-content" className="flex flex-col min-h-screen pb-20">
      <header className="flex items-center px-5 py-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-electric/20 flex items-center justify-center">
            <Newspaper className="w-4 h-4 text-electric" />
          </div>
          <span className="font-bold text-lg">CivicAI</span>
        </div>
      </header>

      <section className="px-5 pt-6 pb-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
              Election News
            </h1>
            <p className="text-muted-foreground text-sm">
              AI-curated election updates, always neutral
            </p>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => fetchNews(true)}
            disabled={refreshing || loading}
            className="rounded-full w-10 h-10 border-border hover:bg-secondary flex-shrink-0"
            aria-label="Refresh news feed"
          >
            <RefreshCw className={`w-4 h-4 text-muted-foreground ${refreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </section>

      <section className="px-5 mb-6 overflow-x-auto pb-2 -mx-5 px-5 no-scrollbar">
        <Tabs defaultValue="All" value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="bg-transparent h-10 p-0 flex justify-start gap-2">
            {CATEGORIES.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="data-[state=active]:bg-electric data-[state=active]:text-white rounded-full px-4 py-2 text-sm bg-secondary text-secondary-foreground hover:bg-secondary/80 data-[state=active]:shadow-md transition-all whitespace-nowrap"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </section>

      <section className="px-5 flex-1">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="p-4 rounded-xl border border-border bg-card space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <div className="pt-4">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNews.map((item, index) => (
              <NewsCard key={item.id} news={item} index={index} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Inbox className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No {selectedCategory !== "All" ? selectedCategory : ""} news right now</h2>
            <p className="text-muted-foreground text-sm max-w-xs">
              Check back later or pull to refresh for the latest updates.
            </p>
          </div>
        )}
      </section>

      <BottomNav />
    </main>
  );
}
