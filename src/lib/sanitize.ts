/**
 * Input sanitization utilities for protecting against prompt injection
 * and ensuring clean user input before passing to AI models.
 */

/** Known prompt injection patterns (case-insensitive matching). */
const INJECTION_PATTERNS = [
  "ignore previous",
  "system:",
  "you are now",
  "jailbreak",
];

/**
 * Strips all HTML tags from a string.
 *
 * @param input - Raw user input.
 * @returns The input with all HTML tags removed.
 */
export function stripHtmlTags(input: string): string {
  return input.replace(/<[^>]*>/g, "");
}

/**
 * Checks whether the input contains known prompt injection patterns.
 *
 * @param input - Sanitized user input to check.
 * @returns `true` if a prompt injection pattern is detected.
 */
export function containsInjection(input: string): boolean {
  const lower = input.toLowerCase();
  return INJECTION_PATTERNS.some((pattern) => lower.includes(pattern));
}

/**
 * Full sanitization pipeline for user messages:
 * 1. Strips HTML tags
 * 2. Trims whitespace
 * 3. Checks for prompt injection patterns
 *
 * @param input - Raw user input.
 * @returns An object with the sanitized text and whether injection was detected.
 */
export function sanitizeMessage(input: string): {
  sanitized: string;
  isInjection: boolean;
} {
  const stripped = stripHtmlTags(input).trim();
  return {
    sanitized: stripped,
    isInjection: containsInjection(stripped),
  };
}
