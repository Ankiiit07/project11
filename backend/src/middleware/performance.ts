import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

// Performance metrics interface
interface PerformanceMetrics {
  responseTime: number;
  memoryUsage: NodeJS.MemoryUsage;
  timestamp: Date;
  method: string;
  url: string;
  statusCode: number;
  userAgent?: string;
  ip?: string;
}

// Store metrics in memory (in production, you'd want to use Redis or a database)
const metrics: PerformanceMetrics[] = [];

// Performance monitoring middleware
export const performanceMonitor = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const startMemory = process.memoryUsage();

  // Capture original send method
  const originalSend = res.send;

  // Override send method to capture response data
  res.send = function(body: any) {
    const endTime = Date.now();
    const endMemory = process.memoryUsage();
    
    const responseTime = endTime - startTime;
    const memoryDelta = {
      rss: endMemory.rss - startMemory.rss,
      heapUsed: endMemory.heapUsed - startMemory.heapUsed,
      heapTotal: endMemory.heapTotal - startMemory.heapTotal,
      external: endMemory.external - startMemory.external,
      arrayBuffers: endMemory.arrayBuffers - startMemory.arrayBuffers,
    };

    const metric: PerformanceMetrics = {
      responseTime,
      memoryUsage: memoryDelta,
      timestamp: new Date(),
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
    };

    // Store metric
    metrics.push(metric);

    // Log slow requests
    if (responseTime > 1000) { // Log requests taking more than 1 second
      logger.warn(`Slow request detected: ${req.method} ${req.originalUrl} took ${responseTime}ms`);
    }

    // Log high memory usage
    if (memoryDelta.heapUsed > 50 * 1024 * 1024) { // Log if heap usage increased by more than 50MB
      logger.warn(`High memory usage detected: ${req.method} ${req.originalUrl} used ${Math.round(memoryDelta.heapUsed / 1024 / 1024)}MB`);
    }

    // Call original send method
    return originalSend.call(this, body);
  };

  next();
};

// Get performance metrics
export const getPerformanceMetrics = () => {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  
  // Filter metrics from last hour
  const recentMetrics = metrics.filter(m => m.timestamp > oneHourAgo);
  
  if (recentMetrics.length === 0) {
    return {
      totalRequests: 0,
      averageResponseTime: 0,
      slowRequests: 0,
      errorRate: 0,
      memoryUsage: {
        average: 0,
        peak: 0,
      },
    };
  }

  const totalRequests = recentMetrics.length;
  const averageResponseTime = recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) / totalRequests;
  const slowRequests = recentMetrics.filter(m => m.responseTime > 1000).length;
  const errorRequests = recentMetrics.filter(m => m.statusCode >= 400).length;
  const errorRate = (errorRequests / totalRequests) * 100;

  const memoryUsage = recentMetrics.reduce(
    (acc, m) => ({
      average: acc.average + m.memoryUsage.heapUsed,
      peak: Math.max(acc.peak, m.memoryUsage.heapUsed),
    }),
    { average: 0, peak: 0 }
  );

  memoryUsage.average = memoryUsage.average / totalRequests;

  return {
    totalRequests,
    averageResponseTime: Math.round(averageResponseTime),
    slowRequests,
    errorRate: Math.round(errorRate * 100) / 100,
    memoryUsage: {
      average: Math.round(memoryUsage.average / 1024 / 1024 * 100) / 100, // MB
      peak: Math.round(memoryUsage.peak / 1024 / 1024 * 100) / 100, // MB
    },
  };
};

// Cleanup old metrics (keep only last 24 hours)
export const cleanupMetrics = () => {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  const initialLength = metrics.length;
  const filteredMetrics = metrics.filter(m => m.timestamp > oneDayAgo);
  
  // Clear array and add filtered metrics back
  metrics.length = 0;
  metrics.push(...filteredMetrics);
  
  logger.info(`Cleaned up ${initialLength - metrics.length} old performance metrics`);
};

// Schedule cleanup every hour
setInterval(cleanupMetrics, 60 * 60 * 1000);

// Database query performance monitoring
export const queryPerformanceMonitor = (query: string, duration: number) => {
  if (duration > 100) { // Log queries taking more than 100ms
    logger.warn(`Slow database query detected: ${query} took ${duration}ms`);
  }
  
  // Store query metrics
  metrics.push({
    responseTime: duration,
    memoryUsage: process.memoryUsage(),
    timestamp: new Date(),
    method: 'DB_QUERY',
    url: query,
    statusCode: 200,
  });
}; 