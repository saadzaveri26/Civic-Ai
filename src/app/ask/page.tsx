"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";
import { ChatBubble } from "@/components/ChatBubble";
import { SuggestionChip } from "@/components/SuggestionChip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Vote, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const SUGGESTIONS = [
  "How do I register to vote?",
  "What happens on voting day?",
  "How are votes counted?",
  "What is VVPAT?",
  "How long does the election process take?",
  "What if I disagree with a result?",
];

const GREETING =
  "Hello! I'm your CivicAI assistant. I can help you with voter registration, polling information, and understanding ballot measures. How can I assist your democratic journey today?";

function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function AskPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: GREETING, timestamp: getTime() },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;
      setShowSuggestions(false);
      const userMsg: Message = { role: "user", content: text.trim(), timestamp: getTime() };
      const newMsgs = [...messages, userMsg];
      setMessages(newMsgs);
      setInput("");
      setIsLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: newMsgs.map((m) => ({ role: m.role, content: m.content })),
            newMessage: text.trim(),
          }),
        });
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply || "Could you try again?", timestamp: getTime() },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Connection issue. Please try again.", timestamp: getTime() },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <main className="flex flex-col h-screen">
      <header className="flex items-center px-5 py-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-electric/20 flex items-center justify-center">
            <Vote className="w-4 h-4 text-electric" />
          </div>
          <span className="font-bold text-lg">CivicAI</span>
        </div>
      </header>

      {showSuggestions && (
        <div className="flex gap-2 px-5 py-3 overflow-x-auto flex-shrink-0 border-b border-border/50">
          {SUGGESTIONS.slice(0, 3).map((t, i) => (
            <SuggestionChip key={t} text={t} onSelect={sendMessage} index={i} />
          ))}
        </div>
      )}

      <ScrollArea className="flex-1 px-5">
        <div className="py-4 space-y-4">
          {messages.map((msg, i) => (
            <ChatBubble key={i} role={msg.role} content={msg.content} timestamp={msg.timestamp} index={i} />
          ))}
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center flex-shrink-0">
                <Loader2 className="w-4 h-4 text-electric-dim animate-spin" />
              </div>
              <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
              </div>
            </motion.div>
          )}
          {showSuggestions && messages.length === 1 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {SUGGESTIONS.slice(3).map((t, i) => (
                <SuggestionChip key={t} text={t} onSelect={sendMessage} index={i + 3} />
              ))}
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-5 py-4 border-t border-border bg-background flex-shrink-0 mb-16">
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about candidates, registration..." className="flex-1 bg-card border-border focus-visible:ring-electric rounded-xl py-5" disabled={isLoading} aria-label="Chat message input" />
        <Button type="submit" size="icon" disabled={!input.trim() || isLoading} className="bg-electric hover:bg-electric/80 text-white rounded-xl h-10 w-10 flex-shrink-0" aria-label="Send message">
          <Send className="w-4 h-4" />
        </Button>
      </form>
      <BottomNav />
    </main>
  );
}
