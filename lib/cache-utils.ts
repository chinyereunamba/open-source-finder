/**
 * Cache utilities for API responses and data
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

class CacheManager {
  private cache: Map<string, CacheEntry<any>>;
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.cache = new Map();
  }

  /**
   * Set a cache entry with optional TTL
   */
  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn: ttl,
    });
  }

  /**
   * Get a cache entry if it exists and hasn't expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    const isExpired = Date.now() - entry.timestamp > entry.expiresIn;

    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Check if a key exists and is valid
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Clear a specific cache entry
   */
  clear(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clearAll(): void {
    this.cache.clear();
  }

  /**
   * Clear expired entries
   */
  clearExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.expiresIn) {
        this.cache.delete(key);
      }
    }
  }
}

// Singleton instance
export const cacheManager = new CacheManager();

/**
 * Generate a cache key from parameters
 */
export function generateCacheKey(
  prefix: string,
  params: Record<string, any>
): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}:${JSON.stringify(params[key])}`)
    .join("|");
  return `${prefix}:${sortedParams}`;
}
