import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// Performance monitoring configuration
interface PerformanceConfig {
  enableWebVitals: boolean;
  enableResourceTiming: boolean;
  enableNavigationTiming: boolean;
  enableUserTiming: boolean;
  reportingEndpoint?: string;
  sampleRate: number;
}

const defaultConfig: PerformanceConfig = {
  enableWebVitals: true,
  enableResourceTiming: true,
  enableNavigationTiming: true,
  enableUserTiming: true,
  sampleRate: 1.0, // 100% sampling in development, reduce in production
};

// Performance metrics interface
interface PerformanceMetric {
  name: string;
  value: number;
  id: string;
  delta?: number;
  rating?: 'good' | 'needs-improvement' | 'poor';
  navigationType?: string;
  timestamp: number;
  url: string;
  userAgent: string;
}

// Performance thresholds based on Core Web Vitals
const PERFORMANCE_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
};

class PerformanceMonitor {
  private config: PerformanceConfig;
  private metrics: PerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];

  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    // Initialize Web Vitals monitoring
    if (this.config.enableWebVitals) {
      this.initWebVitals();
    }

    // Initialize Resource Timing monitoring
    if (this.config.enableResourceTiming) {
      this.initResourceTiming();
    }

    // Initialize Navigation Timing monitoring
    if (this.config.enableNavigationTiming) {
      this.initNavigationTiming();
    }

    // Initialize User Timing monitoring
    if (this.config.enableUserTiming) {
      this.initUserTiming();
    }

    // Monitor long tasks
    this.initLongTaskMonitoring();

    // Monitor memory usage
    this.initMemoryMonitoring();
  }

  private initWebVitals() {
    const reportMetric = (metric: any) => {
      if (Math.random() > this.config.sampleRate) return;

      const performanceMetric: PerformanceMetric = {
        name: metric.name,
        value: metric.value,
        id: metric.id,
        delta: metric.delta,
        rating: this.getRating(metric.name, metric.value),
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      };

      this.recordMetric(performanceMetric);
    };

    // Core Web Vitals
    getCLS(reportMetric);
    getFID(reportMetric);
    getFCP(reportMetric);
    getLCP(reportMetric);
    getTTFB(reportMetric);
  }

  private initResourceTiming() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming;
          
          // Monitor slow resources
          if (resourceEntry.duration > 1000) {
            this.recordMetric({
              name: 'slow-resource',
              value: resourceEntry.duration,
              id: resourceEntry.name,
              timestamp: Date.now(),
              url: window.location.href,
              userAgent: navigator.userAgent,
            });
          }

          // Monitor large resources
          if (resourceEntry.transferSize > 1024 * 1024) { // > 1MB
            this.recordMetric({
              name: 'large-resource',
              value: resourceEntry.transferSize,
              id: resourceEntry.name,
              timestamp: Date.now(),
              url: window.location.href,
              userAgent: navigator.userAgent,
            });
          }
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
    this.observers.push(observer);
  }

  private initNavigationTiming() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          
          // Calculate key navigation metrics
          const metrics = {
            'dns-lookup': navEntry.domainLookupEnd - navEntry.domainLookupStart,
            'tcp-connection': navEntry.connectEnd - navEntry.connectStart,
            'tls-negotiation': navEntry.connectEnd - navEntry.secureConnectionStart,
            'request-response': navEntry.responseEnd - navEntry.requestStart,
            'dom-processing': navEntry.domContentLoadedEventEnd - navEntry.responseEnd,
            'resource-loading': navEntry.loadEventEnd - navEntry.domContentLoadedEventEnd,
          };

          Object.entries(metrics).forEach(([name, value]) => {
            if (value > 0) {
              this.recordMetric({
                name: `navigation-${name}`,
                value,
                id: window.location.pathname,
                timestamp: Date.now(),
                url: window.location.href,
                userAgent: navigator.userAgent,
              });
            }
          });
        }
      });
    });

    observer.observe({ entryTypes: ['navigation'] });
    this.observers.push(observer);
  }

  private initUserTiming() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'measure') {
          this.recordMetric({
            name: `user-timing-${entry.name}`,
            value: entry.duration,
            id: entry.name,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
          });
        }
      });
    });

    observer.observe({ entryTypes: ['measure'] });
    this.observers.push(observer);
  }

  private initLongTaskMonitoring() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'longtask') {
          this.recordMetric({
            name: 'long-task',
            value: entry.duration,
            id: `task-${Date.now()}`,
            rating: entry.duration > 100 ? 'poor' : 'needs-improvement',
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
          });
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['longtask'] });
      this.observers.push(observer);
    } catch (e) {
      // Long task API not supported
    }
  }

  private initMemoryMonitoring() {
    if (!('memory' in performance)) return;

    // Monitor memory usage periodically
    const checkMemory = () => {
      const memory = (performance as any).memory;
      
      if (memory) {
        const memoryUsage = {
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit,
        };

        // Alert if memory usage is high
        const usagePercent = (memoryUsage.used / memoryUsage.limit) * 100;
        if (usagePercent > 80) {
          this.recordMetric({
            name: 'high-memory-usage',
            value: usagePercent,
            id: 'memory-warning',
            rating: 'poor',
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
          });
        }
      }
    };

    // Check memory every 30 seconds
    setInterval(checkMemory, 30000);
  }

  private getRating(metricName: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds = PERFORMANCE_THRESHOLDS[metricName as keyof typeof PERFORMANCE_THRESHOLDS];
    if (!thresholds) return 'good';

    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.poor) return 'needs-improvement';
    return 'poor';
  }

  private recordMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);

    // Report to analytics
    this.reportToAnalytics(metric);

    // Report to external endpoint if configured
    if (this.config.reportingEndpoint) {
      this.reportToEndpoint(metric);
    }

    // Log poor performance in development
    if (process.env.NODE_ENV === 'development' && metric.rating === 'poor') {
      console.warn(`Poor performance detected: ${metric.name}`, metric);
    }
  }

  private reportToAnalytics(metric: PerformanceMetric) {
    // Report to Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', metric.name, {
        event_category: 'Web Vitals',
        value: Math.round(metric.value),
        metric_rating: metric.rating,
        custom_parameter_1: metric.id,
      });
    }

    // Report to other analytics services
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('Performance Metric', {
        metric: metric.name,
        value: metric.value,
        rating: metric.rating,
        url: metric.url,
      });
    }
  }

  private async reportToEndpoint(metric: PerformanceMetric) {
    try {
      await fetch(this.config.reportingEndpoint!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metric),
      });
    } catch (error) {
      console.error('Failed to report performance metric:', error);
    }
  }

  // Public methods
  public startTiming(name: string) {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(`${name}-start`);
    }
  }

  public endTiming(name: string) {
    if (typeof performance !== 'undefined' && performance.mark && performance.measure) {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
    }
  }

  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  public getMetricsByName(name: string): PerformanceMetric[] {
    return this.metrics.filter(metric => metric.name === name);
  }

  public clearMetrics() {
    this.metrics = [];
  }

  public destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.clearMetrics();
  }
}

// Singleton instance
let performanceMonitor: PerformanceMonitor | null = null;

export function initPerformanceMonitoring(config?: Partial<PerformanceConfig>) {
  if (typeof window === 'undefined') return null;
  
  if (!performanceMonitor) {
    performanceMonitor = new PerformanceMonitor(config);
  }
  
  return performanceMonitor;
}

export function getPerformanceMonitor(): PerformanceMonitor | null {
  return performanceMonitor;
}

// Utility functions for manual timing
export function startTiming(name: string) {
  performanceMonitor?.startTiming(name);
}

export function endTiming(name: string) {
  performanceMonitor?.endTiming(name);
}

// React hook for performance monitoring
export function usePerformanceMonitoring() {
  const monitor = getPerformanceMonitor();
  
  return {
    startTiming: (name: string) => monitor?.startTiming(name),
    endTiming: (name: string) => monitor?.endTiming(name),
    getMetrics: () => monitor?.getMetrics() || [],
    clearMetrics: () => monitor?.clearMetrics(),
  };
}

export default PerformanceMonitor;