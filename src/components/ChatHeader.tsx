"use client";

import { Vote } from "lucide-react";

/**
 * Header component displayed at the top of the Ask AI chat page.
 * Shows the CivicAI branding with the Vote icon.
 */
export function ChatHeader() {
  return (
    <header className="flex items-center px-5 py-4 border-b border-border flex-shrink-0">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-electric/20 flex items-center justify-center">
          <Vote className="w-4 h-4 text-electric" />
        </div>
        <h1 className="font-bold text-lg m-0">CivicAI</h1>
      </div>
    </header>
  );
}
