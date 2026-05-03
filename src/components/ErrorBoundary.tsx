"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, RotateCcw } from "lucide-react";

/** Props for the ErrorBoundary component. */
interface ErrorBoundaryProps {
  /** Child components to wrap with error protection. */
  children: React.ReactNode;
  /** Optional display name for the section that failed (shown in the fallback UI). */
  sectionName?: string;
}

/** Internal state for the ErrorBoundary component. */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * React class-based error boundary that catches render errors in its subtree
 * and displays a user-friendly fallback UI with a retry button.
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary sectionName="Quiz">
 *   <QuizPage />
 * </ErrorBoundary>
 * ```
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static displayName = "ErrorBoundary";

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
          <Card className="bg-card border-border max-w-md w-full">
            <CardContent className="p-8 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-foreground">
                Something went wrong
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {this.props.sectionName
                  ? `The ${this.props.sectionName} section encountered an unexpected error.`
                  : "An unexpected error occurred."}
                {" "}Please try again or reload the page.
              </p>
              <Button
                onClick={this.handleRetry}
                className="bg-electric hover:bg-electric/80 text-white font-semibold py-5 px-6 rounded-xl mt-2"
              >
                <RotateCcw className="w-4 h-4 mr-2" /> Try Again
              </Button>
            </CardContent>
          </Card>
        </main>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
