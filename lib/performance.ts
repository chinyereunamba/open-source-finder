/**
 * Performance monitoring utilities
 */

export interface PerformanceMetrics {
  name: string;
  duration: number;
  timestamp: number;
}

class PerformanceMonitor {
  private marks: Map<string, number>;
  private metrics: PerformanceMetrics[];

  constructor() {
    this.marks = new Map();
    this.metrics = [];
  }

  /**
   * Start measuring performance
   */
  start(name: string): void {
    this.marks.set(name, performance.now());
  }

  /**
   * End measuring and record metric
   */
  end(name: string): number | null {
    const startTime = this.marks.get(name);
    if (!startTime) {
      console.warn(`No start mark found for: ${name}`);
      return null;
    }

    const duration = performance.now() - startTime;
    this.metrics.push({
      name,
      duration,
      timestamp: Date.now(),
    });

    this.marks.delete(name);
    return duration;
  }

  /**
   * Get all recorded metrics
   */
  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  /**
   * Get metrics by name
   */
  getMetricsByName(name: string): PerformanceMetrics[] {
    return this.metrics.filter((m) => m.name === name);
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.marks.clear();
    this.metrics = [];
  }

  /**
   * Log metrics to console
   */
  log(): void {
    console.table(this.metrics);
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Measure async function execution time
 */
export async function measureAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  performanceMonitor.start(name);
  try {
    const result = await fn();
    const duration = performanceMonitor.end(name);
    if (process.env.NODE_ENV === "development") {
      console.log(`[Performance] ${name}: ${duration?.toFixed(2)}ms`);
    }
    return result;
  } catch (error) {
    performanceMonitor.end(name);
    throw error;
  }
}

/**
 * Measure sync function execution time
 */
export function measure<T>(name: string, fn: () => T): T {
  performanceMonitor.start(name);
  try {
    const result = fn();
    const duration = performanceMonitor.end(name);
    if (process.env.NODE_ENV === "development") {
      console.log(`[Performance] ${name}: ${duration?.toFixed(2)}ms`);
    }
    return result;
  } catch (error) {
    performanceMonitor.end(name);
    throw error;
  }
}

/**
 * Report Web Vitals
 */
export function reportWebVitals(metric: any): void {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Web Vitals] ${metric.name}:`, metric.value);
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === "production") {
    // Example: send to analytics service
    // analytics.track('web-vitals', metric);
  }
}
