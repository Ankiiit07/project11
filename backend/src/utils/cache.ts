import logger from './logger';

// Cache interface
interface CacheItem<T = any> {
  value: T;
  timestamp: number;
  ttl: number;
}

// In-memory cache store
const memoryCache = new Map<string, CacheItem>();

// Cache configuration
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 1000; // Maximum number of items in cache

// Cache utility class
class Cache {
  private cache: Map<string, CacheItem>;
  private maxSize: number;

  constructor(maxSize: number = MAX_CACHE_SIZE) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  // Set cache item
  set<T>(key: string, value: T, ttl: number = DEFAULT_TTL): void {
    // Clean expired items first
    this.cleanup();

    // Check if cache is full
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    const item: CacheItem<T> = {
      value,
      timestamp: Date.now(),
      ttl,
    };

    this.cache.set(key, item);
    logger.debug(`Cache set: ${key}`);
  }

  // Get cache item
  get<T>(key: string): T | null {
    const item = this.cache.get(key) as CacheItem<T> | undefined;

    if (!item) {
      logger.debug(`Cache miss: ${key}`);
      return null;
    }

    // Check if item is expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      logger.debug(`Cache expired: ${key}`);
      return null;
    }

    logger.debug(`Cache hit: ${key}`);
    return item.value;
  }

  // Delete cache item
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      logger.debug(`Cache deleted: ${key}`);
    }
    return deleted;
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
    logger.info('Cache cleared');
  }

  // Get cache size
  size(): number {
    return this.cache.size;
  }

  // Get cache keys
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  // Check if key exists
  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  // Cleanup expired items
  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // Evict oldest item (LRU-like)
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, item] of this.cache.entries()) {
      if (item.timestamp < oldestTime) {
        oldestTime = item.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      logger.debug(`Cache evicted: ${oldestKey}`);
    }
  }

  // Get cache statistics
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

// Create cache instance
const cache = new Cache();

// Cache decorator for functions
export function cached(ttl: number = DEFAULT_TTL, keyGenerator?: (...args: any[]) => string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const key = keyGenerator 
        ? keyGenerator(...args)
        : `${target.constructor.name}:${propertyName}:${JSON.stringify(args)}`;

      // Try to get from cache
      const cachedResult = cache.get(key);
      if (cachedResult !== null) {
        return cachedResult;
      }

      // Execute method and cache result
      const result = await method.apply(this, args);
      cache.set(key, result, ttl);

      return result;
    };
  };
}

// Cache middleware for Express routes
export const cacheMiddleware = (ttl: number = DEFAULT_TTL) => {
  return (req: any, res: any, next: any) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `route:${req.originalUrl}`;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      return res.json(cachedResponse);
    }

    // Override res.json to cache the response
    const originalJson = res.json;
    res.json = function(data: any) {
      cache.set(key, data, ttl);
      return originalJson.call(this, data);
    };

    next();
  };
};

// Cache invalidation patterns
export const invalidatePattern = (pattern: string): number => {
  let count = 0;
  const keys = cache.keys();
  
  for (const key of keys) {
    if (key.includes(pattern)) {
      cache.delete(key);
      count++;
    }
  }

  logger.info(`Invalidated ${count} cache entries matching pattern: ${pattern}`);
  return count;
};

// Cache warming utility
export const warmCache = async (keys: string[], fetcher: (key: string) => Promise<any>, ttl: number = DEFAULT_TTL) => {
  logger.info(`Warming cache with ${keys.length} keys`);
  
  const promises = keys.map(async (key) => {
    try {
      const value = await fetcher(key);
      cache.set(key, value, ttl);
      return { key, success: true };
    } catch (error) {
      logger.error(`Failed to warm cache for key ${key}:`, error);
      return { key, success: false, error };
    }
  });

  const results = await Promise.allSettled(promises);
  const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
  
  logger.info(`Cache warming completed: ${successful}/${keys.length} successful`);
  return results;
};

// Export cache instance and utilities
export default cache;
export { Cache }; 