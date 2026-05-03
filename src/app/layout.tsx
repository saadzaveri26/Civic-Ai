import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import { NewsNavLink } from "@/components/NewsNavLink";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CivicAI — Your Election Guide",
  description:
    "CivicAI explains the entire election process step by step, in plain language. Understand your vote and shape your democracy with AI-powered guidance.",
  keywords: ["election", "voting", "democracy", "civic education", "AI assistant"],
};

/** Props for the root layout component. */
interface RootLayoutProps {
  readonly children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased dark`} data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col relative">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-blue-600 focus:text-white focus:p-2 focus:rounded"
        >
          Skip to main content
        </a>
        <LanguageProvider>
          <NewsNavLink />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
