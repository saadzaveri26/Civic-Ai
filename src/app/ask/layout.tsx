"use client";

import { ErrorBoundary } from "@/components/ErrorBoundary";

/** Props for the AskLayout component. */
interface AskLayoutProps {
  readonly children: React.ReactNode;
}

/**
 * Layout wrapper for the /ask route.
 * Wraps child content in an ErrorBoundary to catch and display rendering errors.
 */
export default function AskLayout({ children }: AskLayoutProps) {
  return <ErrorBoundary sectionName="Ask AI">{children}</ErrorBoundary>;
}
