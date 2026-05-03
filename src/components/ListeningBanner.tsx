"use client";

import { motion, AnimatePresence } from "framer-motion";

/** Props for the ListeningBanner component. */
interface ListeningBannerProps {
  /** Whether the microphone is currently listening. */
  isListening: boolean;
  /** Native name of the language being listened for (e.g. "English", "हिंदी"). */
  languageNativeName: string;
}

/**
 * Animated banner displayed above the chat input when the user's microphone
 * is active and speech recognition is in progress.
 */
export function ListeningBanner({ isListening, languageNativeName }: ListeningBannerProps) {
  return (
    <AnimatePresence>
      {isListening && (
        <motion.div
          initial={{ height: 0, opacity: 0, y: -10 }}
          animate={{ height: "auto", opacity: 1, y: 0 }}
          exit={{ height: 0, opacity: 0, y: -10 }}
          className="overflow-hidden"
        >
          <div role="alert" aria-live="assertive" className="px-5 pt-3 pb-1 flex items-center gap-2 text-xs text-red-400">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            🎤 Listening in {languageNativeName}...
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
