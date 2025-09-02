// Dynamic import utilities for code splitting and lazy loading
import dynamic from 'next/dynamic';
import { ComponentType, ReactNode } from 'react';
import { LoadingSpinner, Skeleton } from '@/components/animations/loading-animations';

// Loading component options
interface LoadingOptions {
  type?: 'spinner' | 'skeleton' | 'custom';
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  customLoader?: ReactNode;
}

// Create loading component based on options
function createLoadingComponent(options: LoadingOptions = {}) {
  const { type = 'skeleton', size = 'md', message, customLoader } = options;

  return function LoadingComponent() {
    if (customLoader) {
      return <>{customLoader}</>;
    }

    switch (type) {
      case 'spinner':
        return (
          <div className="flex items-center justify-center p-8">
            <div className="text-center space-y-3">
              <LoadingSpinner size={size} />
              {message && <p className="text-sm text-muted-foreground">{message}</p>}
            </div>
          </div>
        );
      
      case 'skeleton':
        return (
          <div className="space-y-4 p-6">
            <Skeleton variant="rectangular" height={200} />
            <div className="space-y-2">
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="40%" />
            </div>
          </div>
        );
      
      default:
        return (
          <div className="flex items-center justify-center p-8">
            <LoadingSpinner size={size} />
          </div>
        );
    }
  };
}

// Dynamic import wrapper with enhanced loading states
export function createDynamicComponent<P = {}>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: LoadingOptions & {
    ssr?: boolean;
    suspense?: boolean;
  } = {}
) {
  const { ssr = false, suspense = false, ...loadingOptions } = options;

  return dynamic(importFn, {
    loading: createLoadingComponent(loadingOptions),
    ssr,
    suspense,
  });
}

// Pre-configured dynamic components for common use cases

// Heavy components that should be lazy loaded
export const DynamicCarousel = createDynamicComponent(
  () => import('@/components/ui/carousel'),
  {
    type: 'skeleton',
    message: 'Cargando carrusel...',
    ssr: false,
  }
);

export const DynamicModal = createDynamicComponent(
  () => import('@/components/accessibility/accessible-modal').then(mod => ({ default: mod.AccessibleModal })),
  {
    type: 'spinner',
    size: 'sm',
    ssr: false,
  }
);

export const DynamicAnimationShowcase = createDynamicComponent(
  () => import('@/components/animations/animation-showcase'),
  {
    type: 'skeleton',
    message: 'Cargando animaciones...',
    ssr: false,
  }
);

// Form components (often not needed immediately)
export const DynamicRegistrationForm = createDynamicComponent(
  () => import('@/components/auth/registration-form'),
  {
    type: 'skeleton',
    message: 'Cargando formulario...',
    ssr: false,
  }
);

// Chart/visualization components
export const DynamicChart = createDynamicComponent(
  () => import('@/components/ui/chart').catch(() => ({ default: () => <div>Chart not available</div> })),
  {
    type: 'skeleton',
    message: 'Cargando gráfico...',
    ssr: false,
  }
);

// Social media components
export const DynamicSocialShare = createDynamicComponent(
  () => import('@/components/social/social-share').catch(() => ({ default: () => <div>Share not available</div> })),
  {
    type: 'spinner',
    size: 'sm',
    ssr: false,
  }
);

// Analytics components
export const DynamicAnalytics = createDynamicComponent(
  () => import('@/components/analytics/analytics-provider').catch(() => ({ default: ({ children }: { children: ReactNode }) => <>{children}</> })),
  {
    type: 'custom',
    customLoader: null,
    ssr: false,
  }
);

// Web3 components (heavy dependencies)
export const DynamicWeb3Provider = createDynamicComponent(
  () => import('@/components/providers/web3-provider'),
  {
    type: 'custom',
    customLoader: null,
    ssr: false,
  }
);

export const DynamicWalletConnect = createDynamicComponent(
  () => import('@/components/web3/wallet-connect').catch(() => ({ default: () => <div>Wallet not available</div> })),
  {
    type: 'spinner',
    message: 'Conectando wallet...',
    ssr: false,
  }
);

// Performance monitoring components
export const DynamicPerformanceMonitor = createDynamicComponent(
  () => import('@/components/animations/performance-monitor'),
  {
    type: 'custom',
    customLoader: null,
    ssr: false,
  }
);

// Accessibility settings (not critical for initial load)
export const DynamicAccessibilitySettings = createDynamicComponent(
  () => import('@/components/providers/accessibility-provider').then(mod => ({ default: mod.AccessibilitySettings })),
  {
    type: 'skeleton',
    message: 'Cargando configuración...',
    ssr: false,
  }
);

// Route-based dynamic imports
export const DynamicRegisterPage = createDynamicComponent(
  () => import('@/app/register/page'),
  {
    type: 'skeleton',
    message: 'Cargando página de registro...',
    ssr: true, // This page should be SSR for SEO
  }
);

// Utility function for conditional dynamic imports
export function conditionalDynamicImport<P = {}>(
  condition: boolean,
  importFn: () => Promise<{ default: ComponentType<P> }>,
  fallback?: ComponentType<P>,
  options?: LoadingOptions
) {
  if (!condition && fallback) {
    return fallback;
  }

  return condition 
    ? createDynamicComponent(importFn, options)
    : () => null;
}

// Preload utility for critical components
export function preloadComponent(importFn: () => Promise<any>) {
  if (typeof window !== 'undefined') {
    // Preload on idle or after a delay
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => importFn());
    } else {
      setTimeout(() => importFn(), 100);
    }
  }
}

// Bundle splitting utilities
export const bundleSplits = {
  // Core UI components (always needed)
  core: () => import('@/components/ui'),
  
  // Animation components (can be lazy loaded)
  animations: () => import('@/components/animations'),
  
  // Accessibility components (progressive enhancement)
  accessibility: () => import('@/components/accessibility'),
  
  // Web3 components (heavy, often not needed immediately)
  web3: () => import('@/components/web3').catch(() => ({ default: {} })),
  
  // Analytics (non-critical)
  analytics: () => import('@/components/analytics').catch(() => ({ default: {} })),
  
  // Social features (progressive enhancement)
  social: () => import('@/components/social').catch(() => ({ default: {} })),
};

// Preload critical bundles
export function preloadCriticalBundles() {
  if (typeof window !== 'undefined') {
    // Preload core components immediately
    preloadComponent(bundleSplits.core);
    
    // Preload animations after a short delay
    setTimeout(() => preloadComponent(bundleSplits.animations), 500);
    
    // Preload accessibility features after user interaction
    const preloadAccessibility = () => {
      preloadComponent(bundleSplits.accessibility);
      document.removeEventListener('click', preloadAccessibility);
      document.removeEventListener('keydown', preloadAccessibility);
    };
    
    document.addEventListener('click', preloadAccessibility, { once: true });
    document.addEventListener('keydown', preloadAccessibility, { once: true });
  }
}