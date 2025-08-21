// Optimized memoization utilities

// Simple memoization function
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  getKey?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = getKey ? getKey(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

// Memoization with cache size limit
export function memoizeWithLimit<T extends (...args: any[]) => any>(
  fn: T,
  limit: number = 100,
  getKey?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = getKey ? getKey(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    // Remove oldest entry if cache is full
    if (cache.size >= limit) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

// Memoization with TTL (Time To Live)
export function memoizeWithTTL<T extends (...args: any[]) => any>(
  fn: T,
  ttl: number = 60000, // 1 minute default
  getKey?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, { value: ReturnType<T>; timestamp: number }>();

  return ((...args: Parameters<T>) => {
    const key = getKey ? getKey(...args) : JSON.stringify(args);
    const now = Date.now();
    
    if (cache.has(key)) {
      const cached = cache.get(key)!;
      if (now - cached.timestamp < ttl) {
        return cached.value;
      } else {
        cache.delete(key);
      }
    }
    
    const result = fn(...args);
    cache.set(key, { value: result, timestamp: now });
    return result;
  }) as T;
}

// Optimized object comparison
export function shallowEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;
  
  if (obj1 == null || obj2 == null) return false;
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (!keys2.includes(key) || obj1[key] !== obj2[key]) {
      return false;
    }
  }
  
  return true;
}

// Deep comparison for objects
export function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;
  
  if (obj1 == null || obj2 == null) return false;
  
  if (typeof obj1 !== typeof obj2) return false;
  
  if (typeof obj1 !== 'object') return obj1 === obj2;
  
  if (Array.isArray(obj1) !== Array.isArray(obj2)) return false;
  
  if (Array.isArray(obj1)) {
    if (obj1.length !== obj2.length) return false;
    return obj1.every((item, index) => deepEqual(item, obj2[index]));
  }
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  return keys1.every(key => deepEqual(obj1[key], obj2[key]));
}

// Optimized array comparison
export function arrayEqual<T>(arr1: T[], arr2: T[]): boolean {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((item, index) => item === arr2[index]);
}

// Memoized selector for Redux-like state
export function createSelector<State, Result>(
  selector: (state: State) => Result,
  equalityFn: (a: Result, b: Result) => boolean = shallowEqual
) {
  let lastState: State | null = null;
  let lastResult: Result | null = null;
  
  return (state: State): Result => {
    if (lastState === state) {
      return lastResult!;
    }
    
    const result = selector(state);
    
    if (lastResult !== null && equalityFn(lastResult, result)) {
      return lastResult;
    }
    
    lastState = state;
    lastResult = result;
    
    return result;
  };
}

// Optimized throttle function
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;
  
  return ((...args: Parameters<T>) => {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  }) as T;
}

// Optimized debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return ((...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
}

// Cache invalidation utilities
export class CacheManager {
  private cache = new Map<string, { value: any; timestamp: number; ttl: number }>();
  
  set(key: string, value: any, ttl: number = 60000): void {
    this.cache.set(key, { value, timestamp: Date.now(), ttl });
  }
  
  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  clearExpired(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
  
  size(): number {
    return this.cache.size;
  }
} 