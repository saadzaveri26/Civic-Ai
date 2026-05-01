"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Newspaper } from "lucide-react";

export function NewsNavLink() {
  const pathname = usePathname();
  const isActive = pathname === "/news";

  return (
    <div className="fixed top-4 right-1/2 translate-x-32 z-50">
      <Link 
        href="/news" 
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
          isActive 
            ? "text-electric bg-electric/10 border border-electric/20" 
            : "text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent"
        }`}
      >
        <Newspaper className="w-4 h-4" />
        <span className="hidden sm:inline">News</span>
      </Link>
    </div>
  );
}
