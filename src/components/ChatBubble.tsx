"use client";

import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  index: number;
}

export function ChatBubble({ role, content, timestamp, index }: ChatBubbleProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? "bg-electric text-white"
            : "bg-secondary border border-border"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-electric-dim" />}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-electric text-white rounded-br-md"
            : "bg-card border border-border rounded-bl-md"
        }`}
      >
        <div
          className="text-sm leading-relaxed whitespace-pre-wrap"
          dangerouslySetInnerHTML={{
            __html: content
              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
              .replace(/\*(.*?)\*/g, "<em>$1</em>")
              .replace(/\n/g, "<br/>"),
          }}
        />
        {timestamp && (
          <p
            className={`text-[10px] mt-1 ${
              isUser ? "text-white/60" : "text-muted-foreground"
            }`}
          >
            {timestamp}
          </p>
        )}
      </div>
    </motion.div>
  );
}
