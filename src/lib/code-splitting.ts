// Code splitting utilities for optimal bundle loading
import { ComponentType } from 'react';
import { globalBundleAnalyzer } from './performance';

// Route-based code splitting configuration
export const routeSplits = {
  // Core routes (always loaded)
  home: {
    priority: 'high' as const,
    preload: true,
    chunk: 'home',
  },
  
  // Secondary routes (lazy loaded)
  register: {
    priority: 'medium' as const,
    preload: false,
    chunk: 'auth',
  },
  
  challenges: {
    priority: 'medium' as const,
    preload: false,
    chunk: 'challenges',
  },
  
  community: {
    priority: 'low' as const,
    preload: false,
    chunk: 'community',
  },
  
  rewards: {
    priority: 'low' as const,
    preload: false,
    chunk: 'rewards',
  },
  
  about: {
    priority: 'low' as const,
    preload: false,
    chunk: 'static',
  },
  
  contact: {
    priority: 'low' as const,
    preload: false,
    chunk: 'static',
  },
};

// Feature-based code splitting
export const featureSplits = {
  // Core UI (always needed)
  ui: {
    components: ['Button', 'Card', 'Input', 'Modal'],
    priority: 'critical' as const,
    size: 'small' as const,
  },
  
  // Animations (progressive enhancement)
  animations: {
    components: ['AnimatedElement', 'StaggeredAnimation', 'MicroInteraction'],
    priority: 'medium' as const,
    size: 'medium' as const,
  },
  
  // Web3 functionality (heavy, conditional)
  web3: {
    components: ['WalletConnect', 'TokenBalance', 'TransactionHistory'],
    priority: 'low' as const,
    size: 'large' as const,
  },
  
  // Analytics (non-critical)
  analytics: {
    components: ['AnalyticsProvider', 'EventTracker', 'PerformanceMonitor'],
    priority: 'low' as const,
    size: 'small' as const,
  },
  
  // Social features (progressive enhancement)
  social: {
    components: ['SocialShare', 'SocialLogin', 'SocialFeed'],
    priority: 'low' as const,
    size: 'medium' as const,
  },
  
  // Accessibility (progressive enhancement)
  accessibility: {
    components: ['ScreenReader', 'KeyboardNavigation', 'HighContrast'],
    priority: 'medium' as const,
    size: 'small' as const,
  },
};

// Bundle loading strategy
export class BundleLoader {
  private loadedBundles = new Set<string>();
  private loadingBundles = new Map<string, Promise<any>>();
  private preloadQueue: string[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializePreloading();
    }
  }

  private initializePreloading() {
    // Preload critical bundles immediately
    this.preloadCriticalBundles();
    
    // Preload medium priority bundles on idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => this.preloadMediumPriorityBundles());
    } else {
      setTimeout(() => this.preloadMediumPriorityBundles(), 1000);
    }
    
    // Preload low priority bundles on user interaction
    this.setupInteractionPreloading();
  }

  private preloadCriticalBundles() {
    Object.entries(featureSplits)
      .filter(([, config]) => config.priority === 'critical')
      .forEach(([name]) => this.preloadBundle(name));
  }

  private preloadMediumPriorityBundles() {
    Object.entries(featureSplits)
      .filter(([, config]) => config.priority === 'medium')
      .forEach(([name]) => this.preloadBundle(name));
  }

  private setupInteractionPreloading() {
    const preloadOnInteraction = () => {
      Object.entries(featureSplits)
        .filter(([, config]) => config.priority === 'low')
        .forEach(([name]) => this.preloadBundle(name));
      
      // Remove listeners after first interaction
      document.removeEventListener('click', preloadOnInteraction);
      document.removeEventListener('keydown', preloadOnInteraction);
      document.removeEventListener('touchstart', preloadOnInteraction);
    };

    document.addEventListener('click', preloadOnInteraction, { once: true });
    document.addEventListener('keydown', preloadOnInteraction, { once: true });
    document.addEventListener('touchstart', preloadOnInteraction, { once: true });
  }

  public async loadBundle(bundleName: string): Promise<any> {
    if (this.loadedBundles.has(bundleName)) {
      return Promise.resolve();
    }

    if (this.loadingBundles.has(bundleName)) {
      return this.loadingBundles.get(bundleName);
    }

    const startTime = performance.now();
    
    const loadPromise = this.importBundle(bundleName)
      .then((module) => {
        this.loadedBundles.add(bundleName);
        this.loadingBundles.delete(bundleName);
        
        // Track bundle load time
        globalBundleAnalyzer?.trackBundleLoad(bundleName, startTime);
        
        return module;
      })
      .catch((error) => {
        this.loadingBundles.delete(bundleName);
        console.error(`Failed to load bundle: ${bundleName}`, error);
        throw error;
      });

    this.loadingBundles.set(bundleName, loadPromise);
    return loadPromise;
  }

  public preloadBundle(bundleName: string) {
    if (!this.loadedBundles.has(bundleName) && !this.loadingBundles.has(bundleName)) {
      this.preloadQueue.push(bundleName);
      this.processPreloadQueue();
    }
  }

  private processPreloadQueue() {
    if (this.preloadQueue.length === 0) return;

    const bundleName = this.preloadQueue.shift()!;
    
    // Use requestIdleCallback for non-blocking preloading
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => this.loadBundle(bundleName));
    } else {
      setTimeout(() => this.loadBundle(bundleName), 0);
    }
  }

  private async importBundle(bundleName: string): Promise<any> {
    switch (bundleName) {
      case 'ui':
        return import('@/components/ui');
      
      case 'animations':
        return import('@/components/animations');
      
      case 'web3':
        return import('@/components/web3').catch(() => ({ default: {} }));
      
      case 'analytics':
        return import('@/components/analytics').catch(() => ({ default: {} }));
      
      case 'social':
        return import('@/components/social').catch(() => ({ default: {} }));
      
      case 'accessibility':
        return import('@/components/accessibility');
      
      case 'auth':
        return import('@/components/auth');
      
      case 'challenges':
        return import('@/app/challenges/page').catch(() => ({ default: () => null }));
      
      case 'community':
        return import('@/app/community/page').catch(() => ({ default: () => null }));
      
      case 'rewards':
        return import('@/app/rewards/page').catch(() => ({ default: () => null }));
      
      case 'static':
        return import('@/components/static');
      
      default:
        throw new Error(`Unknown bundle: ${bundleName}`);
    }
  }

  public getBundleStatus() {
    return {
      loaded: Array.from(this.loadedBundles),
      loading: Array.from(this.loadingBundles.keys()),
      queued: [...this.preloadQueue],
    };
  }

  public getLoadedBundleCount(): number {
    return this.loadedBundles.size;
  }

  public isLoaded(bundleName: string): boolean {
    return this.loadedBundles.has(bundleName);
  }
}

// Tree shaking utilities
export const treeShakingConfig = {
  // Mark side-effect free modules
  sideEffects: false,
  
  // Optimize imports
  optimizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
      skipDefaultConversion: true,
    },
    'lodash': {
      transform: 'lodash/{{member}}',
    },
    '@radix-ui/react-icons': {
      transform: '@radix-ui/react-icons/dist/{{member}}',
    },
  },
  
  // Dead code elimination
  deadCodeElimination: {
    removeUnusedImports: true,
    removeUnusedExports: true,
    removeDeadCode: true,
  },
};

// Webpack optimization configuration
export const webpackOptimization = {
  splitChunks: {
    chunks: 'all' as const,
    cacheGroups: {
      // Vendor libraries
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all' as const,
        priority: 10,
      },
      
      // Common components
      common: {
        name: 'common',
        minChunks: 2,
        chunks: 'all' as const,
        priority: 5,
        reuseExistingChunk: true,
      },
      
      // UI components
      ui: {
        test: /[\\/]components[\\/]ui[\\/]/,
        name: 'ui',
        chunks: 'all' as const,
        priority: 8,
      },
      
      // Animations
      animations: {
        test: /[\\/]components[\\/]animations[\\/]/,
        name: 'animations',
        chunks: 'all' as const,
        priority: 6,
      },
      
      // Web3 libraries (heavy)
      web3: {
        test: /[\\/](web3|ethers|@web3|@ethereum)[\\/]/,
        name: 'web3',
        chunks: 'all' as const,
        priority: 7,
      },
    },
  },
  
  // Runtime chunk optimization
  runtimeChunk: {
    name: 'runtime',
  },
  
  // Module concatenation
  concatenateModules: true,
  
  // Minimize configuration
  minimize: true,
  minimizer: [
    // Terser for JS minification
    {
      terserOptions: {
        compress: {
          drop_console: process.env.NODE_ENV === 'production',
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info'],
        },
        mangle: {
          safari10: true,
        },
        format: {
          comments: false,
        },
      },
    },
    
    // CSS optimization
    {
      cssProcessorOptions: {
        map: {
          inline: false,
          annotation: true,
        },
      },
    },
  ],
};

// Global bundle loader instance
export const globalBundleLoader = typeof window !== 'undefined' 
  ? new BundleLoader() 
  : null;