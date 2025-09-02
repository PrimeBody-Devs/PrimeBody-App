// Performance monitoring and optimization utilities for PrimeBody
import { ANIMATION_CONFIG } from './constants';

// Performance metrics interface
export interface PerformanceMetrics {
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  fcp: number | null; // First Contentful Paint
  ttfb: number | null; // Time to First Byte
  loadTime: number | null;
  domContentLoaded: number | null;
  memoryUsage?: {
    used: number;
    total: number;
    limit: number;
  };
}

// Performance observer class
export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    loadTime: null,
    domContentLoaded: null,
  };

  private observers: PerformanceObserver[] = [];
  private callbacks: ((metrics: PerformanceMetrics) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObservers();
      this.measureBasicMetrics();
    }
  }

  private initializeObservers() {
    // Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
        this.metrics.lcp = lastEntry.startTime;
        this.notifyCallbacks();
      });
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.warn('LCP observation not supported');
    }

    // First Input Delay
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.fid = entry.processingStart - entry.startTime;
          this.notifyCallbacks();
        });
      });
      
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.warn('FID observation not supported');
    }

    // Cumulative Layout Shift
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.metrics.cls = clsValue;
            this.notifyCallbacks();
          }
        });
      });
      
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.warn('CLS observation not supported');
    }

    // First Contentful Paint
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = entry.startTime;
            this.notifyCallbacks();
          }
        });
      });
      
      fcpObserver.observe({ entryTypes: ['paint'] });
      this.observers.push(fcpObserver);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.warn('FCP observation not supported');
    }
  }

  private measureBasicMetrics() {
    // Time to First Byte
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      this.metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
    }

    // Load time and DOM content loaded
    window.addEventListener('load', () => {
      this.metrics.loadTime = performance.now();
      this.notifyCallbacks();
    });

    window.addEventListener('DOMContentLoaded', () => {
      this.metrics.domContentLoaded = performance.now();
      this.notifyCallbacks();
    });

    // Memory usage (if available)
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.metrics.memoryUsage = {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
      };
    }
  }

  private notifyCallbacks() {
    this.callbacks.forEach(callback => callback(this.metrics));
  }

  public onMetricsUpdate(callback: (metrics: PerformanceMetrics) => void) {
    this.callbacks.push(callback);
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public getPerformanceScore(): number {
    const { lcp, fid, cls, fcp } = this.metrics;
    
    let score = 100;
    
    // LCP scoring (good: <2.5s, needs improvement: 2.5-4s, poor: >4s)
    if (lcp !== null) {
      if (lcp > 4000) score -= 30;
      else if (lcp > 2500) score -= 15;
    }
    
    // FID scoring (good: <100ms, needs improvement: 100-300ms, poor: >300ms)
    if (fid !== null) {
      if (fid > 300) score -= 25;
      else if (fid > 100) score -= 10;
    }
    
    // CLS scoring (good: <0.1, needs improvement: 0.1-0.25, poor: >0.25)
    if (cls !== null) {
      if (cls > 0.25) score -= 25;
      else if (cls > 0.1) score -= 10;
    }
    
    // FCP scoring (good: <1.8s, needs improvement: 1.8-3s, poor: >3s)
    if (fcp !== null) {
      if (fcp > 3000) score -= 20;
      else if (fcp > 1800) score -= 10;
    }
    
    return Math.max(0, score);
  }

  public disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.callbacks = [];
  }
}

// Resource loading optimization
export class ResourceOptimizer {
  private preloadedResources = new Set<string>();
  private criticalResources = new Set<string>();

  // Preload critical resources
  public preloadResource(href: string, as: string, type?: string, crossorigin?: string) {
    if (this.preloadedResources.has(href)) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    if (crossorigin) link.crossOrigin = crossorigin;

    document.head.appendChild(link);
    this.preloadedResources.add(href);
  }

  // Prefetch non-critical resources
  public prefetchResource(href: string) {
    if (this.preloadedResources.has(href)) return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;

    document.head.appendChild(link);
    this.preloadedResources.add(href);
  }

  // Mark resources as critical
  public markAsCritical(href: string) {
    this.criticalResources.add(href);
  }

  // Preload critical fonts
  public preloadFonts() {
    const fonts = [
      '/fonts/inter-var.woff2',
      '/fonts/inter-latin.woff2',
    ];

    fonts.forEach(font => {
      this.preloadResource(font, 'font', 'font/woff2', 'anonymous');
    });
  }

  // Preload critical images
  public preloadCriticalImages() {
    const images = [
      '/images/hero-image.webp',
      '/images/logo.svg',
      '/images/og-image.jpg',
    ];

    images.forEach(image => {
      this.preloadResource(image, 'image');
    });
  }

  // Lazy load non-critical resources
  public lazyLoadResource(href: string, as: string, callback?: () => void) {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        this.preloadResource(href, as);
        callback?.();
      });
    } else {
      setTimeout(() => {
        this.preloadResource(href, as);
        callback?.();
      }, 100);
    }
  }
}

// Bundle size analyzer
export class BundleAnalyzer {
  private loadTimes = new Map<string, number>();
  private bundleSizes = new Map<string, number>();

  public trackBundleLoad(bundleName: string, startTime: number) {
    const loadTime = performance.now() - startTime;
    this.loadTimes.set(bundleName, loadTime);
  }

  public trackBundleSize(bundleName: string, size: number) {
    this.bundleSizes.set(bundleName, size);
  }

  public getBundleMetrics() {
    return {
      loadTimes: Object.fromEntries(this.loadTimes),
      bundleSizes: Object.fromEntries(this.bundleSizes),
    };
  }

  public getSlowBundles(threshold: number = 1000): string[] {
    return Array.from(this.loadTimes.entries())
      .filter(([, time]) => time > threshold)
      .map(([name]) => name);
  }

  public getLargeBundles(threshold: number = 100000): string[] {
    return Array.from(this.bundleSizes.entries())
      .filter(([, size]) => size > threshold)
      .map(([name]) => name);
  }
}

// Performance optimization utilities
export const performanceUtils = {
  // Check if device is low-end
  isLowEndDevice(): boolean {
    if (typeof navigator === 'undefined') return false;
    
    const connection = (navigator as any).connection;
    const memory = (performance as any).memory;
    
    // Check for slow connection
    if (connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')) {
      return true;
    }
    
    // Check for low memory
    if (memory && memory.totalJSHeapSize < 50 * 1024 * 1024) { // Less than 50MB
      return true;
    }
    
    // Check for save-data preference
    if (connection && connection.saveData) {
      return true;
    }
    
    return false;
  },

  // Optimize images based on device capabilities
  getOptimalImageFormat(): 'webp' | 'avif' | 'jpeg' {
    if (typeof window === 'undefined') return 'jpeg';
    
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    // Check for AVIF support
    if (canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0) {
      return 'avif';
    }
    
    // Check for WebP support
    if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
      return 'webp';
    }
    
    return 'jpeg';
  },

  // Debounce function for performance
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
    immediate?: boolean
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;
    
    return function executedFunction(...args: Parameters<T>) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      
      const callNow = immediate && !timeout;
      
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      
      if (callNow) func(...args);
    };
  },

  // Throttle function for performance
  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    
    return function executedFunction(...args: Parameters<T>) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Measure function execution time
  measureExecutionTime<T>(name: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
  },

  // Check if user prefers reduced data usage
  prefersReducedData(): boolean {
    if (typeof navigator === 'undefined') return false;
    
    const connection = (navigator as any).connection;
    return connection && connection.saveData;
  },

  // Get device memory information
  getDeviceMemory(): number {
    if (typeof navigator === 'undefined') return 4; // Default to 4GB
    
    return (navigator as any).deviceMemory || 4;
  },

  // Check if device supports hardware acceleration
  supportsHardwareAcceleration(): boolean {
    if (typeof window === 'undefined') return false;
    
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    return !!gl;
  },
};

// Global performance monitor instance
export const globalPerformanceMonitor = typeof window !== 'undefined' 
  ? new PerformanceMonitor() 
  : null;

// Global resource optimizer instance
export const globalResourceOptimizer = typeof window !== 'undefined' 
  ? new ResourceOptimizer() 
  : null;

// Global bundle analyzer instance
export const globalBundleAnalyzer = typeof window !== 'undefined' 
  ? new BundleAnalyzer() 
  : null;