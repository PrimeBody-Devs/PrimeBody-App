// Web Vitals tracking and reporting
import { getCLS, getFID, getFCP, getLCP, getTTFB, Metric } from 'web-vitals';

// Analytics endpoint for sending metrics
const ANALYTICS_ENDPOINT = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT || '/api/analytics';

// Performance thresholds based on Google's recommendations
export const PERFORMANCE_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 600, poor: 1500 },
} as const;

// Metric status calculation
export function getMetricStatus(name: keyof typeof PERFORMANCE_THRESHOLDS, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = PERFORMANCE_THRESHOLDS[name];
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
}

// Enhanced metric interface
interface EnhancedMetric extends Metric {
  status: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
  url: string;
  userAgent: string;
  connectionType?: string;
  deviceMemory?: number;
  hardwareConcurrency?: number;
}

// Metric collection and enhancement
function enhanceMetric(metric: Metric): EnhancedMetric {
  const status = getMetricStatus(metric.name as keyof typeof PERFORMANCE_THRESHOLDS, metric.value);
  
  // Get connection information
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  
  return {
    ...metric,
    status,
    timestamp: Date.now(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    connectionType: connection?.effectiveType || 'unknown',
    deviceMemory: (navigator as any).deviceMemory || undefined,
    hardwareConcurrency: navigator.hardwareConcurrency || undefined,
  };
}

// Send metric to analytics
async function sendMetric(metric: EnhancedMetric) {
  try {
    // Only send in production or when analytics is enabled
    if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_ENABLE_ANALYTICS) {
      console.log('Web Vital:', metric);
      return;
    }

    // Send to analytics endpoint
    await fetch(ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'web-vital',
        metric,
      }),
    });
  } catch (error) {
    console.error('Failed to send web vital:', error);
  }
}

// Batch metrics for efficient sending
class MetricsBatcher {
  private metrics: EnhancedMetric[] = [];
  private batchSize = 5;
  private flushInterval = 10000; // 10 seconds
  private timeoutId: NodeJS.Timeout | null = null;

  add(metric: EnhancedMetric) {
    this.metrics.push(metric);
    
    if (this.metrics.length >= this.batchSize) {
      this.flush();
    } else if (!this.timeoutId) {
      this.timeoutId = setTimeout(() => this.flush(), this.flushInterval);
    }
  }

  private async flush() {
    if (this.metrics.length === 0) return;
    
    const metricsToSend = [...this.metrics];\n    this.metrics = [];\n    \n    if (this.timeoutId) {\n      clearTimeout(this.timeoutId);\n      this.timeoutId = null;\n    }\n\n    try {\n      await fetch(ANALYTICS_ENDPOINT, {\n        method: 'POST',\n        headers: {\n          'Content-Type': 'application/json',\n        },\n        body: JSON.stringify({\n          type: 'web-vitals-batch',\n          metrics: metricsToSend,\n        }),\n      });\n    } catch (error) {\n      console.error('Failed to send metrics batch:', error);\n    }\n  }\n\n  // Flush on page unload\n  flushOnUnload() {\n    if (this.metrics.length > 0) {\n      // Use sendBeacon for reliable delivery on page unload\n      const data = JSON.stringify({\n        type: 'web-vitals-batch',\n        metrics: this.metrics,\n      });\n      \n      if (navigator.sendBeacon) {\n        navigator.sendBeacon(ANALYTICS_ENDPOINT, data);\n      }\n    }\n  }\n}\n\nconst metricsBatcher = new MetricsBatcher();\n\n// Web Vitals collection\nexport function initWebVitals() {\n  // Collect Core Web Vitals\n  getCLS((metric) => {\n    const enhanced = enhanceMetric(metric);\n    metricsBatcher.add(enhanced);\n  });\n\n  getFID((metric) => {\n    const enhanced = enhanceMetric(metric);\n    metricsBatcher.add(enhanced);\n  });\n\n  getLCP((metric) => {\n    const enhanced = enhanceMetric(metric);\n    metricsBatcher.add(enhanced);\n  });\n\n  getFCP((metric) => {\n    const enhanced = enhanceMetric(metric);\n    metricsBatcher.add(enhanced);\n  });\n\n  getTTFB((metric) => {\n    const enhanced = enhanceMetric(metric);\n    metricsBatcher.add(enhanced);\n  });\n\n  // Flush metrics on page unload\n  window.addEventListener('beforeunload', () => {\n    metricsBatcher.flushOnUnload();\n  });\n\n  // Flush metrics on visibility change (mobile)\n  document.addEventListener('visibilitychange', () => {\n    if (document.visibilityState === 'hidden') {\n      metricsBatcher.flushOnUnload();\n    }\n  });\n}\n\n// Custom performance tracking\nexport class PerformanceTracker {\n  private marks: Map<string, number> = new Map();\n  private measures: Map<string, number> = new Map();\n\n  // Mark a performance point\n  mark(name: string) {\n    const timestamp = performance.now();\n    this.marks.set(name, timestamp);\n    \n    if (performance.mark) {\n      performance.mark(name);\n    }\n  }\n\n  // Measure time between two marks\n  measure(name: string, startMark: string, endMark?: string) {\n    const startTime = this.marks.get(startMark);\n    const endTime = endMark ? this.marks.get(endMark) : performance.now();\n    \n    if (startTime && endTime) {\n      const duration = endTime - startTime;\n      this.measures.set(name, duration);\n      \n      if (performance.measure) {\n        try {\n          performance.measure(name, startMark, endMark);\n        } catch (error) {\n          console.warn('Performance measure failed:', error);\n        }\n      }\n      \n      return duration;\n    }\n    \n    return null;\n  }\n\n  // Get all measurements\n  getMeasures() {\n    return Object.fromEntries(this.measures);\n  }\n\n  // Clear all marks and measures\n  clear() {\n    this.marks.clear();\n    this.measures.clear();\n    \n    if (performance.clearMarks) {\n      performance.clearMarks();\n    }\n    if (performance.clearMeasures) {\n      performance.clearMeasures();\n    }\n  }\n\n  // Track component render time\n  trackComponentRender(componentName: string, renderFn: () => void) {\n    this.mark(`${componentName}-render-start`);\n    renderFn();\n    this.mark(`${componentName}-render-end`);\n    \n    const duration = this.measure(\n      `${componentName}-render`,\n      `${componentName}-render-start`,\n      `${componentName}-render-end`\n    );\n    \n    if (duration && duration > 16) { // Longer than one frame\n      console.warn(`Slow component render: ${componentName} took ${duration.toFixed(2)}ms`);\n    }\n    \n    return duration;\n  }\n\n  // Track async operation\n  async trackAsyncOperation<T>(name: string, operation: () => Promise<T>): Promise<T> {\n    this.mark(`${name}-start`);\n    \n    try {\n      const result = await operation();\n      this.mark(`${name}-end`);\n      \n      const duration = this.measure(name, `${name}-start`, `${name}-end`);\n      \n      if (process.env.NODE_ENV === 'development') {\n        console.log(`${name} completed in ${duration?.toFixed(2)}ms`);\n      }\n      \n      return result;\n    } catch (error) {\n      this.mark(`${name}-error`);\n      this.measure(`${name}-failed`, `${name}-start`, `${name}-error`);\n      throw error;\n    }\n  }\n}\n\n// Global performance tracker instance\nexport const performanceTracker = new PerformanceTracker();\n\n// Resource timing analysis\nexport function analyzeResourceTiming() {\n  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];\n  \n  const analysis = {\n    totalResources: resources.length,\n    totalSize: 0,\n    totalDuration: 0,\n    slowResources: [] as Array<{ name: string; duration: number; size: number }>,\n    largeResources: [] as Array<{ name: string; duration: number; size: number }>,\n    resourceTypes: {} as Record<string, number>,\n  };\n  \n  resources.forEach((resource) => {\n    const duration = resource.responseEnd - resource.requestStart;\n    const size = resource.transferSize || 0;\n    \n    analysis.totalSize += size;\n    analysis.totalDuration += duration;\n    \n    // Categorize by type\n    const extension = resource.name.split('.').pop()?.toLowerCase() || 'other';\n    analysis.resourceTypes[extension] = (analysis.resourceTypes[extension] || 0) + 1;\n    \n    // Identify slow resources (>1s)\n    if (duration > 1000) {\n      analysis.slowResources.push({\n        name: resource.name.split('/').pop() || resource.name,\n        duration,\n        size,\n      });\n    }\n    \n    // Identify large resources (>500KB)\n    if (size > 500 * 1024) {\n      analysis.largeResources.push({\n        name: resource.name.split('/').pop() || resource.name,\n        duration,\n        size,\n      });\n    }\n  });\n  \n  return analysis;\n}\n\n// Performance budget checker\nexport function checkPerformanceBudget() {\n  const budget = {\n    maxLCP: 2500,\n    maxFID: 100,\n    maxCLS: 0.1,\n    maxTTFB: 600,\n    maxBundleSize: 500 * 1024,\n  };\n  \n  const violations: string[] = [];\n  \n  // This would be populated by actual measurements\n  // For now, return the budget configuration\n  return {\n    budget,\n    violations,\n    passed: violations.length === 0,\n  };\n}\n\n// Initialize web vitals tracking\nif (typeof window !== 'undefined') {\n  // Initialize on next tick to ensure DOM is ready\n  setTimeout(initWebVitals, 0);\n}\n