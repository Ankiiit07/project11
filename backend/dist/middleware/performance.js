"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryPerformanceMonitor = exports.cleanupMetrics = exports.getPerformanceMetrics = exports.performanceMonitor = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const metrics = [];
const performanceMonitor = (req, res, next) => {
    const startTime = Date.now();
    const startMemory = process.memoryUsage();
    const originalSend = res.send;
    res.send = function (body) {
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
        const metric = {
            responseTime,
            memoryUsage: memoryDelta,
            timestamp: new Date(),
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            userAgent: req.get('User-Agent'),
            ip: req.ip || req.connection.remoteAddress,
        };
        metrics.push(metric);
        if (responseTime > 1000) {
            logger_1.default.warn(`Slow request detected: ${req.method} ${req.originalUrl} took ${responseTime}ms`);
        }
        if (memoryDelta.heapUsed > 50 * 1024 * 1024) {
            logger_1.default.warn(`High memory usage detected: ${req.method} ${req.originalUrl} used ${Math.round(memoryDelta.heapUsed / 1024 / 1024)}MB`);
        }
        return originalSend.call(this, body);
    };
    next();
};
exports.performanceMonitor = performanceMonitor;
const getPerformanceMetrics = () => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
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
    const memoryUsage = recentMetrics.reduce((acc, m) => ({
        average: acc.average + m.memoryUsage.heapUsed,
        peak: Math.max(acc.peak, m.memoryUsage.heapUsed),
    }), { average: 0, peak: 0 });
    memoryUsage.average = memoryUsage.average / totalRequests;
    return {
        totalRequests,
        averageResponseTime: Math.round(averageResponseTime),
        slowRequests,
        errorRate: Math.round(errorRate * 100) / 100,
        memoryUsage: {
            average: Math.round(memoryUsage.average / 1024 / 1024 * 100) / 100,
            peak: Math.round(memoryUsage.peak / 1024 / 1024 * 100) / 100,
        },
    };
};
exports.getPerformanceMetrics = getPerformanceMetrics;
const cleanupMetrics = () => {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const initialLength = metrics.length;
    const filteredMetrics = metrics.filter(m => m.timestamp > oneDayAgo);
    metrics.length = 0;
    metrics.push(...filteredMetrics);
    logger_1.default.info(`Cleaned up ${initialLength - metrics.length} old performance metrics`);
};
exports.cleanupMetrics = cleanupMetrics;
setInterval(exports.cleanupMetrics, 60 * 60 * 1000);
const queryPerformanceMonitor = (query, duration) => {
    if (duration > 100) {
        logger_1.default.warn(`Slow database query detected: ${query} took ${duration}ms`);
    }
    metrics.push({
        responseTime: duration,
        memoryUsage: process.memoryUsage(),
        timestamp: new Date(),
        method: 'DB_QUERY',
        url: query,
        statusCode: 200,
    });
};
exports.queryPerformanceMonitor = queryPerformanceMonitor;
//# sourceMappingURL=performance.js.map