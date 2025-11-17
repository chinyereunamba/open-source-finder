/**
 * Monitoring and Error Tracking
 * Provides comprehensive error tracking, logging, and performance monitoring
 */

export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
  FATAL = "fatal",
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, any>;
  error?: Error;
  userId?: string;
  requestId?: string;
}

export interface ErrorReport {
  message: string;
  stack?: string;
  context?: Record<string, any>;
  userId?: string;
  url?: string;
  userAgent?: string;
  timestamp: Date;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === "development";
  }

  /**
   * Log debug message
   */
  debug(message: string, context?: Record<string, any>): void {
    if (this.isDevelopment) {
      this.log(LogLevel.DEBUG, message, context);
    }
  }

  /**
   * Log info message
   */
  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context, error);

    // In production, you would send this to an error tracking service
    if (!this.isDevelopment) {
      this.reportError({
        message,
        stack: error?.stack,
        context,
        timestamp: new Date(),
      });
    }
  }

  /**
   * Log fatal error
   */
  fatal(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.FATAL, message, context, error);

    // Always report fatal errors
    this.reportError({
      message: `FATAL: ${message}`,
      stack: error?.stack,
      context,
      timestamp: new Date(),
    });
  }

  /**
   * Internal log method
   */
  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
      error,
    };

    this.logs.push(entry);

    // Trim logs if exceeding max
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output
    const logFn = this.getConsoleMethod(level);
    const prefix = `[${entry.timestamp.toISOString()}] [${level.toUpperCase()}]`;

    if (error) {
      logFn(prefix, message, context || "", error);
    } else {
      logFn(prefix, message, context || "");
    }
  }

  /**
   * Get appropriate console method
   */
  private getConsoleMethod(level: LogLevel): (...args: any[]) => void {
    switch (level) {
      case LogLevel.DEBUG:
        return console.debug;
      case LogLevel.INFO:
        return console.info;
      case LogLevel.WARN:
        return console.warn;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        return console.error;
      default:
        return console.log;
    }
  }

  /**
   * Report error to tracking service
   */
  private reportError(report: ErrorReport): void {
    // In production, integrate with services like Sentry, Datadog, etc.
    // For now, just log to console
    console.error("Error Report:", report);
  }

  /**
   * Get recent logs
   */
  getLogs(level?: LogLevel, limit: number = 100): LogEntry[] {
    let filtered = this.logs;

    if (level) {
      filtered = filtered.filter((log) => log.level === level);
    }

    return filtered.slice(-limit);
  }

  /**
   * Clear logs
   */
  clear(): void {
    this.logs = [];
  }
}

// Singleton instance
export const logger = new Logger();

/**
 * Performance monitoring
 */
export interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private maxMetrics: number = 500;

  /**
   * Measure function execution time
   */
  async measure<T>(
    name: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    const startTime = performance.now();

    try {
      const result = await fn();
      const duration = performance.now() - startTime;

      this.recordMetric({
        name,
        duration,
        timestamp: new Date(),
        metadata,
      });

      // Log slow operations
      if (duration > 1000) {
        logger.warn(
          `Slow operation detected: ${name} took ${duration.toFixed(2)}ms`,
          metadata
        );
      }

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      this.recordMetric({
        name: `${name} (failed)`,
        duration,
        timestamp: new Date(),
        metadata: { ...metadata, error: true },
      });
      throw error;
    }
  }

  /**
   * Record performance metric
   */
  private recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);

    // Trim metrics if exceeding max
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  /**
   * Get metrics
   */
  getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.filter((m) => m.name === name);
    }
    return [...this.metrics];
  }

  /**
   * Get average duration for a metric
   */
  getAverageDuration(name: string): number {
    const metrics = this.getMetrics(name);
    if (metrics.length === 0) return 0;

    const total = metrics.reduce((sum, m) => sum + m.duration, 0);
    return total / metrics.length;
  }

  /**
   * Clear metrics
   */
  clear(): void {
    this.metrics = [];
  }
}

export const performanceMonitor = new PerformanceMonitor();

/**
 * API request tracking
 */
export interface ApiRequest {
  method: string;
  url: string;
  statusCode: number;
  duration: number;
  timestamp: Date;
  userId?: string;
  error?: string;
}

class ApiMonitor {
  private requests: ApiRequest[] = [];
  private maxRequests: number = 1000;

  /**
   * Track API request
   */
  track(request: ApiRequest): void {
    this.requests.push(request);

    // Trim requests if exceeding max
    if (this.requests.length > this.maxRequests) {
      this.requests = this.requests.slice(-this.maxRequests);
    }

    // Log errors
    if (request.statusCode >= 400) {
      logger.warn(
        `API Error: ${request.method} ${request.url} - ${request.statusCode}`,
        {
          duration: request.duration,
          userId: request.userId,
          error: request.error,
        }
      );
    }
  }

  /**
   * Get request statistics
   */
  getStats(): {
    total: number;
    byStatus: Record<number, number>;
    byMethod: Record<string, number>;
    avgDuration: number;
    errorRate: number;
  } {
    const total = this.requests.length;
    const byStatus: Record<number, number> = {};
    const byMethod: Record<string, number> = {};
    let totalDuration = 0;
    let errorCount = 0;

    for (const req of this.requests) {
      byStatus[req.statusCode] = (byStatus[req.statusCode] || 0) + 1;
      byMethod[req.method] = (byMethod[req.method] || 0) + 1;
      totalDuration += req.duration;

      if (req.statusCode >= 400) {
        errorCount++;
      }
    }

    return {
      total,
      byStatus,
      byMethod,
      avgDuration: total > 0 ? totalDuration / total : 0,
      errorRate: total > 0 ? errorCount / total : 0,
    };
  }

  /**
   * Get recent requests
   */
  getRecentRequests(limit: number = 100): ApiRequest[] {
    return this.requests.slice(-limit);
  }

  /**
   * Clear requests
   */
  clear(): void {
    this.requests = [];
  }
}

export const apiMonitor = new ApiMonitor();

/**
 * Health check utilities
 */
export interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: Date;
  checks: {
    api: boolean;
    cache: boolean;
    performance: boolean;
  };
  metrics: {
    uptime: number;
    requestCount: number;
    errorRate: number;
    avgResponseTime: number;
  };
}

export function getHealthStatus(): HealthStatus {
  const stats = apiMonitor.getStats();
  const uptime = process.uptime();

  const checks = {
    api: stats.errorRate < 0.1, // Less than 10% error rate
    cache: true, // Could check cache connectivity
    performance: stats.avgDuration < 1000, // Average response time under 1s
  };

  const allHealthy = Object.values(checks).every((check) => check);
  const anyUnhealthy = Object.values(checks).some((check) => !check);

  return {
    status: allHealthy ? "healthy" : anyUnhealthy ? "degraded" : "unhealthy",
    timestamp: new Date(),
    checks,
    metrics: {
      uptime,
      requestCount: stats.total,
      errorRate: stats.errorRate,
      avgResponseTime: stats.avgDuration,
    },
  };
}
