// Performance monitoring and optimization utilities

interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
}

interface PerformanceObserver {
  observe: (entry: PerformanceEntry) => void;
  disconnect: () => void;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    pageLoadTime: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    cumulativeLayoutShift: 0,
    firstInputDelay: 0,
    timeToInteractive: 0,
  };

  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initObservers();
    this.measurePageLoad();
  }

  private initObservers(): void {
    // First Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const fcpObserver = new (window as any).PerformanceObserver((list: any) => {
          const entries = list.getEntries();
          const fcp = entries.find((entry: any) => entry.name === 'first-contentful-paint');
          if (fcp) {
            this.metrics.firstContentfulPaint = fcp.startTime;
            this.logMetric('First Contentful Paint', fcp.startTime);
          }
        });
        fcpObserver.observe({ entryTypes: ['paint'] });
        this.observers.push(fcpObserver);
      } catch (error) {
        console.warn('FCP observer not supported:', error);
      }

      // Largest Contentful Paint
      try {
        const lcpObserver = new (window as any).PerformanceObserver((list: any) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            this.metrics.largestContentfulPaint = lastEntry.startTime;
            this.logMetric('Largest Contentful Paint', lastEntry.startTime);
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (error) {
        console.warn('LCP observer not supported:', error);
      }

      // Cumulative Layout Shift
      try {
        const clsObserver = new (window as any).PerformanceObserver((list: any) => {
          let clsValue = 0;
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          this.metrics.cumulativeLayoutShift = clsValue;
          this.logMetric('Cumulative Layout Shift', clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (error) {
        console.warn('CLS observer not supported:', error);
      }

      // First Input Delay
      try {
        const fidObserver = new (window as any).PerformanceObserver((list: any) => {
          for (const entry of list.getEntries()) {
            this.metrics.firstInputDelay = entry.processingStart - entry.startTime;
            this.logMetric('First Input Delay', this.metrics.firstInputDelay);
            break; // Only measure the first input
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (error) {
        console.warn('FID observer not supported:', error);
      }
    }
  }

  private measurePageLoad(): void {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.loadEventStart;
        this.metrics.timeToInteractive = navigation.domContentLoadedEventEnd - navigation.fetchStart;
        
        this.logMetric('Page Load Time', this.metrics.pageLoadTime);
        this.logMetric('Time to Interactive', this.metrics.timeToInteractive);
      }
    });
  }

  private logMetric(name: string, value: number): void {
    const color = this.getMetricColor(name, value);
    console.log(
      `%c${name}: ${value.toFixed(2)}ms`,
      `color: ${color}; font-weight: bold; font-size: 14px;`
    );
  }

  private getMetricColor(name: string, value: number): string {
    const thresholds: { [key: string]: { good: number; poor: number } } = {
      'First Contentful Paint': { good: 1800, poor: 3000 },
      'Largest Contentful Paint': { good: 2500, poor: 4000 },
      'Cumulative Layout Shift': { good: 0.1, poor: 0.25 },
      'First Input Delay': { good: 100, poor: 300 },
      'Page Load Time': { good: 2000, poor: 4000 },
      'Time to Interactive': { good: 3800, poor: 7300 },
    };

    const threshold = thresholds[name];
    if (!threshold) return '#666';

    if (value <= threshold.good) return '#4CAF50'; // Green
    if (value <= threshold.poor) return '#FF9800'; // Orange
    return '#F44336'; // Red
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public disconnect(): void {
    this.observers.forEach(observer => observer.disconnect());
  }
}

// Image optimization utilities
export class ImageOptimizer {
  private static readonly LAZY_LOADING_THRESHOLD = 0.1; // 10% of viewport
  private static readonly INTERSECTION_OBSERVER_OPTIONS = {
    root: null,
    rootMargin: '50px',
    threshold: this.LAZY_LOADING_THRESHOLD,
  };

  public static lazyLoadImages(): void {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.remove('lazy');
              imageObserver.unobserve(img);
            }
          }
        });
      }, this.INTERSECTION_OBSERVER_OPTIONS);

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  public static preloadCriticalImages(urls: string[]): void {
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      document.head.appendChild(link);
    });
  }

  public static optimizeImageQuality(img: HTMLImageElement, quality: number = 0.8): void {
    if ('createImageBitmap' in window) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            img.src = url;
          }
        }, 'image/jpeg', quality);
      }
    }
  }
}

// Memory optimization utilities
export class MemoryOptimizer {
  private static readonly MEMORY_THRESHOLD = 50 * 1024 * 1024; // 50MB

  public static checkMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usedMB = memory.usedJSHeapSize / 1024 / 1024;
      const totalMB = memory.totalJSHeapSize / 1024 / 1024;
      
      if (usedMB > this.MEMORY_THRESHOLD / 1024 / 1024) {
        console.warn(`High memory usage: ${usedMB.toFixed(2)}MB / ${totalMB.toFixed(2)}MB`);
        this.cleanup();
      }
    }
  }

  public static cleanup(): void {
    // Clear unused event listeners
    // Clear unused timers
    // Clear unused DOM references
    if (window.gc) {
      window.gc();
    }
  }

  public static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  public static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }
}

// Bundle optimization utilities
export class BundleOptimizer {
  public static async loadScript(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
      document.head.appendChild(script);
    });
  }

  public static async loadCSS(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to load CSS: ${url}`));
      document.head.appendChild(link);
    });
  }

  public static preloadResource(url: string, as: string = 'fetch'): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = as;
    document.head.appendChild(link);
  }
}

// Cache optimization utilities
export class CacheOptimizer {
  private static readonly CACHE_NAME = 'cafe-at-once-v1';
  private static readonly CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

  public static async cacheResources(urls: string[]): Promise<void> {
    if ('caches' in window) {
      try {
        const cache = await caches.open(this.CACHE_NAME);
        await cache.addAll(urls);
      } catch (error) {
        console.warn('Failed to cache resources:', error);
      }
    }
  }

  public static async getCachedResource(url: string): Promise<Response | null> {
    if ('caches' in window) {
      try {
        const cache = await caches.open(this.CACHE_NAME);
        const response = await cache.match(url);
        return response || null;
      } catch (error) {
        console.warn('Failed to get cached resource:', error);
        return null;
      }
    }
    return null;
  }

  public static async clearOldCaches(): Promise<void> {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        const oldCaches = cacheNames.filter(name => name !== this.CACHE_NAME);
        await Promise.all(oldCaches.map(name => caches.delete(name)));
      } catch (error) {
        console.warn('Failed to clear old caches:', error);
      }
    }
  }
}

// Initialize performance monitoring
export const performanceMonitor = new PerformanceMonitor();

// Export utilities
export {
  PerformanceMonitor,
  type PerformanceMetrics,
}; 