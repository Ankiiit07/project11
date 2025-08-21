import React, { useEffect } from 'react';

const PerformanceMonitor: React.FC = () => {
  useEffect(() => {
    // Track Core Web Vitals
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
        
        // Send to analytics if needed
        if (lastEntry.startTime > 2500) {
          console.warn('LCP is slow:', lastEntry.startTime);
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          const fid = entry.processingStart - entry.startTime;
          console.log('FID:', fid);
          
          if (fid > 100) {
            console.warn('FID is slow:', fid);
          }
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            console.log('CLS:', clsValue);
            
            if (clsValue > 0.1) {
              console.warn('CLS is poor:', clsValue);
            }
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // Track long tasks
      const longTaskObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.duration > 50) {
            console.warn('Long task detected:', entry.duration + 'ms');
          }
        });
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });

      return () => {
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
        longTaskObserver.disconnect();
      };
    }

    // Track page load time
    (window as any).addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        console.log('Page Load Time:', loadTime);
        
        if (loadTime > 3000) {
          console.warn('Page load time is slow:', loadTime);
        }
      }
    });

    // Track memory usage
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      console.log('Memory Usage:', {
        used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
        total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
        limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB'
      });
    }
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceMonitor; 