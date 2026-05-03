"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

/**
 * Animated typing indicator shown while the AI assistant is generating a response.
 * Displays a spinning loader icon and three bouncing dots.
 */
export function TypingIndicator() {
  return (
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
  );
}
