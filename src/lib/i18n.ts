"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import React from "react";

export interface Language {
  code: string;
  label: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", label: "English", nativeName: "English" },
  { code: "hi", label: "Hindi", nativeName: "हिंदी" },
  { code: "mr", label: "Marathi", nativeName: "मराठी" },
  { code: "ta", label: "Tamil", nativeName: "தமிழ்" },
  { code: "te", label: "Telugu", nativeName: "తెలుగు" },
  { code: "bn", label: "Bengali", nativeName: "বাংলা" },
  { code: "gu", label: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "kn", label: "Kannada", nativeName: "ಕನ್ನಡ" },
];

interface LanguageContextType {
  language: string;
  setLanguage: (code: string) => void;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
});

const STORAGE_KEY = "civicai_lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState("en");
  const [mounted, setMounted] = useState(false);

  // Load persisted language on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGUAGES.some((l) => l.code === stored)) {
      setLanguageState(stored);
    }
    setMounted(true);
  }, []);

  const setLanguage = (code: string) => {
    setLanguageState(code);
    localStorage.setItem(STORAGE_KEY, code);
  };

  // Prevent hydration mismatch by rendering children only after mount
  // but still render during SSR with default "en"
  return React.createElement(
    LanguageContext.Provider,
    { value: { language: mounted ? language : "en", setLanguage } },
    children
  );
}

/**
 * Custom hook to access and update the current language setting.
 * Must be used within a {@link LanguageProvider} component.
 *
 * @returns An object with the current `language` code and a `setLanguage` setter.
 * @throws If used outside of a LanguageProvider context.
 */
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
