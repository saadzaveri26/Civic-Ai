"use client";

import { ErrorBoundary } from "@/components/ErrorBoundary";

/** Props for the QuizLayout component. */
interface QuizLayoutProps {
  readonly children: React.ReactNode;
}

/**
 * Layout wrapper for the /quiz route.
 * Wraps child content in an ErrorBoundary to catch and display rendering errors.
 */
export default function QuizLayout({ children }: QuizLayoutProps) {
  return <ErrorBoundary sectionName="Quiz">{children}</ErrorBoundary>;
}
