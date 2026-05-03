"use client";

import { Globe, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage, SUPPORTED_LANGUAGES } from "@/lib/i18n";

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex items-center gap-1.5 h-8 px-2 text-xs text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors outline-none cursor-pointer"
        aria-label="Select language"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline-block">{currentLang?.nativeName ?? "English"}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 bg-card border-border"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span>
              {lang.nativeName}{" "}
              <span className="text-muted-foreground text-xs">({lang.label})</span>
            </span>
            {language === lang.code && (
              <Check className="w-4 h-4 text-electric" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
