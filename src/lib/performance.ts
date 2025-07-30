import { analytics } from './analytics';

// Web Vitals tracking
export interface WebVitalsMetric {
  name: string;
  value: number;
  id: string;
  delta: number;
}

// Performance observer for Core Web Vitals
export const trackWebVitals = () => {
  if (typeof window === 'undefined') return;

  // Track Largest Contentful Paint (LCP)
  const observeLCP = () => {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        analytics.performance('LCP', lastEntry.startTime, 'ms');
        
        if (lastEntry.startTime > 2500) {
          analytics.error(`LCP too slow: ${lastEntry.startTime}ms`, 'performance', false);
        }
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (error) {
      console.warn('LCP observation not supported');
    }
  };

  // Track First Input Delay (FID)
  const observeFID = () => {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          analytics.performance('FID', entry.processingStart - entry.startTime, 'ms');
          
          if (entry.processingStart - entry.startTime > 100) {
            analytics.error(`FID too slow: ${entry.processingStart - entry.startTime}ms`, 'performance', false);
          }
        });
      });
      
      observer.observe({ entryTypes: ['first-input'] });
    } catch (error) {
      console.warn('FID observation not supported');
    }
  };

  // Track Cumulative Layout Shift (CLS)
  const observeCLS = () => {
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        
        analytics.performance('CLS', clsValue * 1000, 'score');
        
        if (clsValue > 0.1) {
          analytics.error(`CLS too high: ${clsValue}`, 'performance', false);
        }
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.warn('CLS observation not supported');
    }
  };

  // Initialize observers
  observeLCP();
  observeFID();
  observeCLS();
};

// Resource loading performance
export const trackResourcePerformance = () => {
  if (typeof window === 'undefined') return;

  window.addEventListener('load', () => {
    // Track page load time
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      const pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
      const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
      const firstByte = navigation.responseStart - navigation.fetchStart;
      
      analytics.performance('Page Load Time', pageLoadTime, 'ms');
      analytics.performance('DOM Content Loaded', domContentLoaded, 'ms');
      analytics.performance('Time to First Byte', firstByte, 'ms');
    }

    // Track resource loading
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    resources.forEach((resource) => {
      const loadTime = resource.responseEnd - resource.fetchStart;
      
      // Track slow resources
      if (loadTime > 1000) {
        analytics.error(`Slow resource: ${resource.name} (${loadTime}ms)`, 'performance', false);
      }
      
      // Track resource types
      if (resource.name.includes('.js')) {
        analytics.performance('JavaScript Load Time', loadTime, 'ms');
      } else if (resource.name.includes('.css')) {
        analytics.performance('CSS Load Time', loadTime, 'ms');
      } else if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
        analytics.performance('Image Load Time', loadTime, 'ms');
      }
    });
  });
};

// Memory usage tracking
export const trackMemoryUsage = () => {
  if (typeof window === 'undefined' || !('memory' in performance)) return;

  const memory = (performance as any).memory;
  
  analytics.performance('Used JS Heap Size', memory.usedJSHeapSize / 1024 / 1024, 'MB');
  analytics.performance('Total JS Heap Size', memory.totalJSHeapSize / 1024 / 1024, 'MB');
  analytics.performance('JS Heap Size Limit', memory.jsHeapSizeLimit / 1024 / 1024, 'MB');
  
  // Warn if memory usage is high
  const usagePercentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
  if (usagePercentage > 80) {
    analytics.error(`High memory usage: ${usagePercentage.toFixed(2)}%`, 'performance', false);
  }
};

// Connection quality tracking
export const trackConnectionQuality = () => {
  if (typeof window === 'undefined' || !('connection' in navigator)) return;

  const connection = (navigator as any).connection;
  
  if (connection) {
    analytics.performance('Connection Downlink', connection.downlink, 'Mbps');
    analytics.performance('Connection RTT', connection.rtt, 'ms');
    
    // Track connection type
    analytics.trackEvent({
      action: 'connection_type',
      category: 'performance',
      label: connection.effectiveType,
      custom_parameters: {
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
      },
    });
  }
};

// Bundle size tracking
export const trackBundleSize = () => {
  if (typeof window === 'undefined') return;

  // Track initial bundle size
  const scripts = document.querySelectorAll('script[src]');
  let totalSize = 0;

  scripts.forEach((script) => {
    const src = (script as HTMLScriptElement).src;
    if (src.includes('/_next/static/')) {
      // Estimate size based on script name patterns
      if (src.includes('chunks/pages/')) {
        totalSize += 50; // Estimated page chunk size in KB
      } else if (src.includes('chunks/main-')) {
        totalSize += 200; // Estimated main bundle size in KB
      } else if (src.includes('chunks/framework-')) {
        totalSize += 150; // Estimated framework size in KB
      }
    }
  });

  if (totalSize > 0) {
    analytics.performance('Estimated Bundle Size', totalSize, 'KB');
    
    // Warn if bundle is too large
    if (totalSize > 500) {
      analytics.error(`Large bundle size: ${totalSize}KB`, 'performance', false);
    }
  }
};

// Initialize all performance tracking
export const initializePerformanceTracking = () => {
  if (typeof window === 'undefined') return;

  // Track immediately
  trackConnectionQuality();
  trackBundleSize();

  // Track after load
  window.addEventListener('load', () => {
    trackResourcePerformance();
    trackMemoryUsage();
    
    // Track Web Vitals with a delay to ensure accuracy
    setTimeout(() => {
      trackWebVitals();
    }, 1000);
  });

  // Track memory usage periodically
  setInterval(() => {
    trackMemoryUsage();
  }, 30000); // Every 30 seconds
};

// Performance budget alerts
export const checkPerformanceBudget = () => {
  const budgets = {
    LCP: 2500, // ms
    FID: 100,  // ms
    CLS: 0.1,  // score
    pageLoadTime: 3000, // ms
    bundleSize: 500, // KB
  };

  // This would be called after measurements are taken
  return budgets;
};