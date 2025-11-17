/**
 * Database Query Optimization Utilities
 * Provides caching, batching, and optimization for database queries
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class QueryCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(
      () => {
        this.cleanup();
      },
      5 * 60 * 1000
    );
  }

  /**
   * Get cached data
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set cached data
   */
  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Invalidate cache entry
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Invalidate cache entries matching pattern
   */
  invalidatePattern(pattern: RegExp): void {
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
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
export const queryCache = new QueryCache();

/**
 * Cache TTL configurations
 */
export const CACHE_TTL = {
  SHORT: 1 * 60 * 1000, // 1 minute
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 15 * 60 * 1000, // 15 minutes
  VERY_LONG: 60 * 60 * 1000, // 1 hour
} as const;

/**
 * Generate cache key from parameters
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

/**
 * Cached query wrapper
 */
export async function cachedQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
  ttl: number = CACHE_TTL.MEDIUM
): Promise<T> {
  // Try to get from cache
  const cached = queryCache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Execute query
  const result = await queryFn();

  // Cache result
  queryCache.set(key, result, ttl);

  return result;
}

/**
 * Batch query executor to reduce database round trips
 */
class BatchQueryExecutor {
  private batches: Map<string, Promise<any>[]> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Add query to batch
   */
  add<T>(
    batchKey: string,
    queryFn: () => Promise<T>,
    delay: number = 10
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const batch = this.batches.get(batchKey) || [];
      batch.push(queryFn().then(resolve).catch(reject));
      this.batches.set(batchKey, batch);

      // Clear existing timer
      const existingTimer = this.timers.get(batchKey);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      // Set new timer to execute batch
      const timer = setTimeout(() => {
        this.executeBatch(batchKey);
      }, delay);

      this.timers.set(batchKey, timer);
    });
  }

  /**
   * Execute batch
   */
  private async executeBatch(batchKey: string): Promise<void> {
    const batch = this.batches.get(batchKey);
    if (!batch || batch.length === 0) {
      return;
    }

    // Execute all queries in parallel
    await Promise.allSettled(batch);

    // Clean up
    this.batches.delete(batchKey);
    this.timers.delete(batchKey);
  }
}

export const batchExecutor = new BatchQueryExecutor();

/**
 * Pagination helper
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function createPaginatedResult<T>(
  data: T[],
  total: number,
  params: PaginationParams
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / params.limit);

  return {
    data,
    pagination: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages,
      hasNext: params.page < totalPages,
      hasPrev: params.page > 1,
    },
  };
}

/**
 * Query performance monitoring
 */
interface QueryMetrics {
  count: number;
  totalTime: number;
  avgTime: number;
  minTime: number;
  maxTime: number;
}

class QueryMonitor {
  private metrics: Map<string, QueryMetrics> = new Map();

  /**
   * Track query execution
   */
  async track<T>(queryName: string, queryFn: () => Promise<T>): Promise<T> {
    const startTime = Date.now();

    try {
      const result = await queryFn();
      const duration = Date.now() - startTime;
      this.recordMetric(queryName, duration);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.recordMetric(queryName, duration, true);
      throw error;
    }
  }

  /**
   * Record query metric
   */
  private recordMetric(
    queryName: string,
    duration: number,
    error: boolean = false
  ): void {
    const existing = this.metrics.get(queryName);

    if (!existing) {
      this.metrics.set(queryName, {
        count: 1,
        totalTime: duration,
        avgTime: duration,
        minTime: duration,
        maxTime: duration,
      });
    } else {
      const count = existing.count + 1;
      const totalTime = existing.totalTime + duration;
      this.metrics.set(queryName, {
        count,
        totalTime,
        avgTime: totalTime / count,
        minTime: Math.min(existing.minTime, duration),
        maxTime: Math.max(existing.maxTime, duration),
      });
    }

    // Log slow queries (> 1 second)
    if (duration > 1000) {
      console.warn(`Slow query detected: ${queryName} took ${duration}ms`);
    }
  }

  /**
   * Get metrics for a query
   */
  getMetrics(queryName: string): QueryMetrics | null {
    return this.metrics.get(queryName) || null;
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): Map<string, QueryMetrics> {
    return new Map(this.metrics);
  }

  /**
   * Reset metrics
   */
  reset(): void {
    this.metrics.clear();
  }
}

export const queryMonitor = new QueryMonitor();

/**
 * Debounced query executor
 */
export function createDebouncedQuery<T>(
  queryFn: () => Promise<T>,
  delay: number = 300
): () => Promise<T> {
  let timeoutId: NodeJS.Timeout | null = null;
  let pendingPromise: Promise<T> | null = null;

  return (): Promise<T> => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (!pendingPromise) {
      pendingPromise = new Promise((resolve, reject) => {
        timeoutId = setTimeout(async () => {
          try {
            const result = await queryFn();
            resolve(result);
          } catch (error) {
            reject(error);
          } finally {
            pendingPromise = null;
            timeoutId = null;
          }
        }, delay);
      });
    }

    return pendingPromise;
  };
}
