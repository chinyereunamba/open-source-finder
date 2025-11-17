/**
 * Rate Limiter Implementation
 * Provides in-memory rate limiting for API endpoints
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private requests: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  /**
   * Check if a request should be rate limited
   * @param identifier - Unique identifier (IP, user ID, etc.)
   * @param limit - Maximum number of requests allowed
   * @param windowMs - Time window in milliseconds
   * @returns Object with allowed status and remaining requests
   */
  check(
    identifier: string,
    limit: number,
    windowMs: number
  ): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = this.requests.get(identifier);

    if (!entry || now > entry.resetTime) {
      // New window or expired entry
      const resetTime = now + windowMs;
      this.requests.set(identifier, { count: 1, resetTime });
      return { allowed: true, remaining: limit - 1, resetTime };
    }

    if (entry.count >= limit) {
      // Rate limit exceeded
      return { allowed: false, remaining: 0, resetTime: entry.resetTime };
    }

    // Increment count
    entry.count++;
    this.requests.set(identifier, entry);
    return {
      allowed: true,
      remaining: limit - entry.count,
      resetTime: entry.resetTime,
    };
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.requests.entries()) {
      if (now > entry.resetTime) {
        this.requests.delete(key);
      }
    }
  }

  /**
   * Reset rate limit for a specific identifier
   */
  reset(identifier: string): void {
    this.requests.delete(identifier);
  }

  /**
   * Clear all rate limit data
   */
  clear(): void {
    this.requests.clear();
  }

  /**
   * Cleanup on shutdown
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.clear();
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter();

/**
 * Rate limit configurations for different endpoint types
 */
export const RATE_LIMITS = {
  // Strict limits for write operations
  SUBMIT_PROJECT: { limit: 5, windowMs: 60 * 60 * 1000 }, // 5 per hour
  POST_COMMENT: { limit: 20, windowMs: 60 * 60 * 1000 }, // 20 per hour
  POST_RATING: { limit: 10, windowMs: 60 * 60 * 1000 }, // 10 per hour

  // Moderate limits for authenticated reads
  RECOMMENDATIONS: { limit: 100, windowMs: 60 * 60 * 1000 }, // 100 per hour
  SEARCH: { limit: 200, windowMs: 60 * 60 * 1000 }, // 200 per hour

  // Generous limits for public reads
  PUBLIC_API: { limit: 1000, windowMs: 60 * 60 * 1000 }, // 1000 per hour

  // Very strict for sensitive operations
  AUTH: { limit: 5, windowMs: 15 * 60 * 1000 }, // 5 per 15 minutes
} as const;

/**
 * Get client identifier from request
 */
export function getClientIdentifier(request: Request): string {
  // Try to get IP from various headers (for proxies/load balancers)
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip");

  const ip =
    forwarded?.split(",")[0].trim() || realIp || cfConnectingIp || "unknown";

  return ip;
}

/**
 * Helper function to apply rate limiting to API routes
 */
export function withRateLimit(
  handler: (request: Request) => Promise<Response>,
  config: { limit: number; windowMs: number }
) {
  return async (request: Request): Promise<Response> => {
    const identifier = getClientIdentifier(request);
    const { allowed, remaining, resetTime } = rateLimiter.check(
      identifier,
      config.limit,
      config.windowMs
    );

    if (!allowed) {
      const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
      return new Response(
        JSON.stringify({
          error: "Too many requests",
          message: "Rate limit exceeded. Please try again later.",
          retryAfter,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": retryAfter.toString(),
            "X-RateLimit-Limit": config.limit.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": new Date(resetTime).toISOString(),
          },
        }
      );
    }

    const response = await handler(request);

    // Add rate limit headers to successful responses
    response.headers.set("X-RateLimit-Limit", config.limit.toString());
    response.headers.set("X-RateLimit-Remaining", remaining.toString());
    response.headers.set(
      "X-RateLimit-Reset",
      new Date(resetTime).toISOString()
    );

    return response;
  };
}
