import { NextRequest, NextResponse } from "next/server";

/** Configuration for the rate limiter per route. */
interface RateLimitConfig {
  /** Maximum number of requests allowed within the window. */
  maxRequests: number;
  /** Sliding window duration in milliseconds. */
  windowMs: number;
}

/** A single timestamped request record. */
interface RequestRecord {
  timestamps: number[];
}

/** In-memory rate limit stores, keyed by route prefix. */
const stores = new Map<string, Map<string, RequestRecord>>();

/**
 * Extracts the client IP address from a Next.js request.
 * Falls back to "unknown" if no IP headers are found.
 */
function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * Sliding-window rate limiter using an in-memory Map.
 * Each route gets its own store to avoid key collisions.
 *
 * @param request - The incoming Next.js request.
 * @param routeKey - A unique identifier for the route (e.g. "chat", "quiz-generate").
 * @param config - Rate limit configuration (maxRequests, windowMs).
 * @returns A 429 NextResponse if the limit is exceeded, or `null` if the request is allowed.
 */
export function rateLimit(
  request: NextRequest,
  routeKey: string,
  config: RateLimitConfig
): NextResponse | null {
  const ip = getClientIp(request);

  if (!stores.has(routeKey)) {
    stores.set(routeKey, new Map());
  }
  const store = stores.get(routeKey)!;

  const now = Date.now();
  const windowStart = now - config.windowMs;

  // Get or create the record for this IP
  let record = store.get(ip);
  if (!record) {
    record = { timestamps: [] };
    store.set(ip, record);
  }

  // Slide the window: remove timestamps older than the window
  record.timestamps = record.timestamps.filter((t) => t > windowStart);

  if (record.timestamps.length >= config.maxRequests) {
    const oldestInWindow = record.timestamps[0];
    const retryAfterMs = oldestInWindow + config.windowMs - now;
    const retryAfterSec = Math.ceil(retryAfterMs / 1000);

    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSec),
          "X-RateLimit-Limit": String(config.maxRequests),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  // Record the current request
  record.timestamps.push(now);

  // Periodic cleanup: remove IPs with no recent activity (every 100th request)
  if (Math.random() < 0.01) {
    for (const [key, rec] of store.entries()) {
      rec.timestamps = rec.timestamps.filter((t) => t > windowStart);
      if (rec.timestamps.length === 0) {
        store.delete(key);
      }
    }
  }

  return null;
}
