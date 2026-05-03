import { z } from "zod";

/** Valid language codes supported by the application. */
export const VALID_LANGUAGE_CODES = ["en", "hi", "mr", "ta", "te", "bn", "gu", "kn"] as const;

/** Zod schema for a valid language code. */
export const languageSchema = z.enum(VALID_LANGUAGE_CODES).default("en");

/** Zod schema for a single chat message in the conversation history. */
const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().max(2000),
});

/** Zod schema for the /api/chat POST request body. */
export const chatBodySchema = z.object({
  messages: z.array(chatMessageSchema).max(50),
  newMessage: z.string().min(1).max(500),
  language: languageSchema,
});

/** Zod schema for the /api/quiz/generate POST request body. */
export const quizGenerateBodySchema = z.object({
  language: languageSchema,
});

/** Zod schema for the /api/quiz/submit POST request body. */
export const quizSubmitBodySchema = z.object({
  userId: z.string().min(1).max(128),
  score: z.number().int().min(0).max(5),
  total: z.literal(5),
  answers: z.array(z.number().int().min(0).max(3)).length(5).optional(),
});

/** Zod schema for the /api/progress POST request body. */
export const progressBodySchema = z.object({
  userId: z.string().min(1).max(128),
  stepId: z.string().min(1).max(64),
});

/** Zod schema for validating the language query param on the /api/news GET route. */
export const newsQuerySchema = z.object({
  language: languageSchema,
});
