"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface SuggestionChipProps {
  text: string;
  onSelect: (text: string) => void;
  index: number;
  size?: "sm" | "md";
}

import React from "react";

export const SuggestionChip = React.memo(function SuggestionChip({ text, onSelect, index, size = "md" }: SuggestionChipProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
    >
      <Badge
        variant="outline"
        className={`cursor-pointer bg-card hover:bg-electric/10 hover:border-electric hover:text-electric-dim transition-all duration-200 whitespace-normal text-left ${
          size === "sm"
            ? "px-2 py-1 text-xs"
            : "px-3 py-2 text-sm"
        }`}
        onClick={() => onSelect(text)}
      >
        {text}
      </Badge>
    </motion.div>
  );
});
