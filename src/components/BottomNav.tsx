"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Compass, TrendingUp, Bot, HelpCircle } from "lucide-react";

const navItems = [
  { href: "/", label: "Explore", icon: Compass },
  { href: "/journey", label: "Journey", icon: TrendingUp },
  { href: "/ask", label: "Ask AI", icon: Bot },
  { href: "/quiz", label: "Quiz", icon: HelpCircle },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0e0e10]/95 backdrop-blur-xl border-t border-border">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 relative py-2 px-3"
              aria-label={item.label}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-px left-2 right-2 h-0.5 bg-electric rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? "text-electric" : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                  isActive ? "text-electric" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
