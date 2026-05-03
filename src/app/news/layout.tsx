"use client";

import { ErrorBoundary } from "@/components/ErrorBoundary";

/** Props for the NewsLayout component. */
interface NewsLayoutProps {
  readonly children: React.ReactNode;
}

/**
 * Layout wrapper for the /news route.
 * Wraps child content in an ErrorBoundary to catch and display rendering errors.
 */
export default function NewsLayout({ children }: NewsLayoutProps) {
  return <ErrorBoundary sectionName="News">{children}</ErrorBoundary>;
}
