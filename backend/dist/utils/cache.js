"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = exports.warmCache = exports.invalidatePattern = exports.cacheMiddleware = void 0;
exports.cached = cached;
const logger_1 = __importDefault(require("./logger"));
const memoryCache = new Map();
const DEFAULT_TTL = 5 * 60 * 1000;
const MAX_CACHE_SIZE = 1000;
class Cache {
    constructor(maxSize = MAX_CACHE_SIZE) {
        this.cache = new Map();
        this.maxSize = maxSize;
    }
    set(key, value, ttl = DEFAULT_TTL) {
        this.cleanup();
        if (this.cache.size >= this.maxSize) {
            this.evictOldest();
        }
        const item = {
            value,
            timestamp: Date.now(),
            ttl,
        };
        this.cache.set(key, item);
        logger_1.default.debug(`Cache set: ${key}`);
    }
    get(key) {
        const item = this.cache.get(key);
        if (!item) {
            logger_1.default.debug(`Cache miss: ${key}`);
            return null;
        }
        if (Date.now() - item.timestamp > item.ttl) {
            this.cache.delete(key);
            logger_1.default.debug(`Cache expired: ${key}`);
            return null;
        }
        logger_1.default.debug(`Cache hit: ${key}`);
        return item.value;
    }
    delete(key) {
        const deleted = this.cache.delete(key);
        if (deleted) {
            logger_1.default.debug(`Cache deleted: ${key}`);
        }
        return deleted;
    }
    clear() {
        this.cache.clear();
        logger_1.default.info('Cache cleared');
    }
    size() {
        return this.cache.size;
    }
    keys() {
        return Array.from(this.cache.keys());
    }
    has(key) {
        const item = this.cache.get(key);
        if (!item)
            return false;
        if (Date.now() - item.timestamp > item.ttl) {
            this.cache.delete(key);
            return false;
        }
        return true;
    }
    cleanup() {
        const now = Date.now();
        for (const [key, item] of this.cache.entries()) {
            if (now - item.timestamp > item.ttl) {
                this.cache.delete(key);
            }
        }
    }
    evictOldest() {
        let oldestKey = null;
        let oldestTime = Date.now();
        for (const [key, item] of this.cache.entries()) {
            if (item.timestamp < oldestTime) {
                oldestTime = item.timestamp;
                oldestKey = key;
            }
        }
        if (oldestKey) {
            this.cache.delete(oldestKey);
            logger_1.default.debug(`Cache evicted: ${oldestKey}`);
        }
    }
    getStats() {
        const now = Date.now();
        let expiredCount = 0;
        let totalAge = 0;
        for (const item of this.cache.values()) {
            if (now - item.timestamp > item.ttl) {
                expiredCount++;
            }
            totalAge += now - item.timestamp;
        }
        return {
            size: this.cache.size,
            maxSize: this.maxSize,
            expiredCount,
            averageAge: this.cache.size > 0 ? totalAge / this.cache.size : 0,
        };
    }
}
exports.Cache = Cache;
const cache = new Cache();
function cached(ttl = DEFAULT_TTL, keyGenerator) {
    return function (target, propertyName, descriptor) {
        const method = descriptor.value;
        descriptor.value = async function (...args) {
            const key = keyGenerator
                ? keyGenerator(...args)
                : `${target.constructor.name}:${propertyName}:${JSON.stringify(args)}`;
            const cachedResult = cache.get(key);
            if (cachedResult !== null) {
                return cachedResult;
            }
            const result = await method.apply(this, args);
            cache.set(key, result, ttl);
            return result;
        };
    };
}
const cacheMiddleware = (ttl = DEFAULT_TTL) => {
    return (req, res, next) => {
        if (req.method !== 'GET') {
            return next();
        }
        const key = `route:${req.originalUrl}`;
        const cachedResponse = cache.get(key);
        if (cachedResponse) {
            return res.json(cachedResponse);
        }
        const originalJson = res.json;
        res.json = function (data) {
            cache.set(key, data, ttl);
            return originalJson.call(this, data);
        };
        next();
    };
};
exports.cacheMiddleware = cacheMiddleware;
const invalidatePattern = (pattern) => {
    let count = 0;
    const keys = cache.keys();
    for (const key of keys) {
        if (key.includes(pattern)) {
            cache.delete(key);
            count++;
        }
    }
    logger_1.default.info(`Invalidated ${count} cache entries matching pattern: ${pattern}`);
    return count;
};
exports.invalidatePattern = invalidatePattern;
const warmCache = async (keys, fetcher, ttl = DEFAULT_TTL) => {
    logger_1.default.info(`Warming cache with ${keys.length} keys`);
    const promises = keys.map(async (key) => {
        try {
            const value = await fetcher(key);
            cache.set(key, value, ttl);
            return { key, success: true };
        }
        catch (error) {
            logger_1.default.error(`Failed to warm cache for key ${key}:`, error);
            return { key, success: false, error };
        }
    });
    const results = await Promise.allSettled(promises);
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    logger_1.default.info(`Cache warming completed: ${successful}/${keys.length} successful`);
    return results;
};
exports.warmCache = warmCache;
exports.default = cache;
//# sourceMappingURL=cache.js.map