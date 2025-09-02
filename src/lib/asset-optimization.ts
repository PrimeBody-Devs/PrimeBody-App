// Static asset optimization utilities

// Image optimization configuration
export const imageOptimization = {
  // Quality settings based on image type and usage
  qualitySettings: {
    hero: 90,        // High quality for hero images
    feature: 85,     // Good quality for feature images
    thumbnail: 80,   // Standard quality for thumbnails
    avatar: 85,      // Good quality for user avatars
    background: 75,  // Lower quality for background images
    icon: 90,        // High quality for icons
  },

  // Format preferences (in order of preference)
  formatPreference: ['avif', 'webp', 'jpg', 'png'] as const,

  // Responsive breakpoints for image sizing
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1440,
    wide: 1920,
  },

  // Generate responsive sizes string
  generateSizes: (type: 'hero' | 'feature' | 'thumbnail' | 'full') => {
    switch (type) {
      case 'hero':
        return '(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 80vw';
      case 'feature':
        return '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw';
      case 'thumbnail':
        return '(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 200px';
      case 'full':
        return '100vw';
      default:
        return '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw';
    }
  },

  // Generate blur data URL for placeholder
  generateBlurDataURL: (width: number = 10, height: number = 10) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Create a simple gradient blur placeholder
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#f3f4f6');
      gradient.addColorStop(1, '#e5e7eb');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }
    
    return canvas.toDataURL('image/jpeg', 0.1);
  },
};

// Font optimization
export const fontOptimization = {
  // Font loading strategies
  loadingStrategies: {
    critical: 'swap',     // Swap immediately for critical fonts
    important: 'fallback', // Use fallback for important fonts
    optional: 'optional',  // Optional for non-critical fonts
  },

  // Font display values
  fontDisplay: {
    auto: 'auto',
    block: 'block',
    swap: 'swap',
    fallback: 'fallback',
    optional: 'optional',
  },

  // Generate font preload links
  generatePreloadLinks: () => {
    const fonts = [
      {
        href: '/fonts/inter-var.woff2',
        type: 'font/woff2',
        crossorigin: 'anonymous',
      },
    ];

    return fonts.map(font => ({
      rel: 'preload',
      as: 'font',
      ...font,
    }));
  },

  // Font fallback stacks
  fallbackStacks: {
    sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
    mono: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
};

// CSS optimization
export const cssOptimization = {
  // Critical CSS extraction
  criticalCSS: {
    // Above-the-fold selectors that should be inlined
    aboveFoldSelectors: [
      'body',
      'html',
      '.hero-section',
      '.navigation',
      '.header',
      '.loading-spinner',
      '.skeleton',
    ],
    
    // CSS that can be deferred
    deferredSelectors: [
      '.animation-showcase',
      '.accessibility-settings',
      '.modal',
      '.carousel',
      '.footer',
    ],
  },

  // CSS minification settings
  minification: {
    removeComments: true,
    removeWhitespace: true,
    optimizeSelectors: true,
    mergeRules: true,
  },

  // Generate critical CSS inline styles
  generateCriticalStyles: () => {
    return `
      /* Critical CSS for immediate rendering */
      body { margin: 0; font-family: Inter, system-ui, sans-serif; }
      .loading-spinner { animation: spin 1s linear infinite; }
      @keyframes spin { to { transform: rotate(360deg); } }
      .skeleton { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); }
    `;
  },
};

// JavaScript optimization
export const jsOptimization = {
  // Bundle splitting configuration
  bundleSplitting: {
    vendor: ['react', 'react-dom', 'next'],
    ui: ['@/components/ui'],
    animations: ['@/components/animations'],
    accessibility: ['@/components/accessibility'],
    utils: ['@/lib'],
  },

  // Tree shaking configuration
  treeShaking: {
    // Modules that should be tree-shaken
    sideEffectFree: [
      '@/lib/utils',
      '@/lib/constants',
      '@/components/ui',
    ],
    
    // Modules with side effects
    sideEffects: [
      '@/lib/analytics',
      '@/lib/performance-monitor',
      '*.css',
    ],
  },

  // Code splitting points
  splitPoints: [
    {
      name: 'auth',
      pattern: '@/components/auth/**',
      priority: 'high',
    },
    {
      name: 'animations',
      pattern: '@/components/animations/**',
      priority: 'medium',
    },
    {
      name: 'accessibility',
      pattern: '@/components/accessibility/**',
      priority: 'low',
    },
  ],
};

// Asset compression settings
export const compressionSettings = {
  // Gzip compression levels
  gzip: {
    level: 9,
    threshold: 1024, // Only compress files larger than 1KB
    extensions: ['.js', '.css', '.html', '.json', '.xml', '.svg'],
  },

  // Brotli compression settings
  brotli: {
    quality: 11,
    threshold: 1024,
    extensions: ['.js', '.css', '.html', '.json', '.xml', '.svg'],
  },

  // Image compression settings
  images: {
    jpeg: {
      quality: 85,
      progressive: true,
      mozjpeg: true,
    },
    png: {
      quality: 90,
      compressionLevel: 9,
      adaptiveFiltering: true,
    },
    webp: {
      quality: 85,
      method: 6,
      lossless: false,
    },
    avif: {
      quality: 80,
      speed: 2,
    },
  },
};

// Resource hints and preloading
export const resourceHints = {
  // DNS prefetch for external domains
  dnsPrefetch: [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://mainnet.base.org',
    'https://basescan.org',
    'https://warpcast.com',
  ],

  // Preconnect for critical external resources
  preconnect: [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ],

  // Preload critical resources
  preload: [
    {
      href: '/fonts/inter-var.woff2',
      as: 'font',
      type: 'font/woff2',
      crossorigin: 'anonymous',
    },
  ],

  // Prefetch likely-needed resources
  prefetch: [
    '/api/register',
    '/api/challenges',
    '/images/demo-screenshot-1.webp',
    '/images/demo-screenshot-2.webp',
  ],

  // Generate resource hint HTML
  generateHints: () => {
    const hints: string[] = [];

    // DNS prefetch
    resourceHints.dnsPrefetch.forEach(domain => {
      hints.push(`<link rel="dns-prefetch" href="${domain}">`);
    });

    // Preconnect
    resourceHints.preconnect.forEach(domain => {
      hints.push(`<link rel="preconnect" href="${domain}" crossorigin>`);
    });

    // Preload
    resourceHints.preload.forEach(resource => {
      const attrs = Object.entries(resource)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ');
      hints.push(`<link rel="preload" ${attrs}>`);
    });

    return hints.join('\n');
  },
};

// Performance budget configuration
export const performanceBudget = {
  // Size limits in bytes
  limits: {
    totalBundle: 500 * 1024,      // 500KB total
    mainChunk: 250 * 1024,        // 250KB main chunk
    vendorChunk: 200 * 1024,      // 200KB vendor chunk
    asyncChunk: 100 * 1024,       // 100KB per async chunk
    css: 50 * 1024,               // 50KB CSS
    images: 2 * 1024 * 1024,      // 2MB total images
  },

  // Performance metrics targets
  metrics: {
    fcp: 1500,    // First Contentful Paint < 1.5s
    lcp: 2500,    // Largest Contentful Paint < 2.5s
    fid: 100,     // First Input Delay < 100ms
    cls: 0.1,     // Cumulative Layout Shift < 0.1
    ttfb: 600,    // Time to First Byte < 600ms
  },

  // Check if bundle meets performance budget
  checkBudget: (actualSizes: Record<string, number>) => {
    const violations: string[] = [];

    Object.entries(performanceBudget.limits).forEach(([key, limit]) => {
      const actual = actualSizes[key] || 0;
      if (actual > limit) {
        violations.push(`${key}: ${actual} bytes exceeds limit of ${limit} bytes`);
      }
    });

    return {
      passed: violations.length === 0,
      violations,
    };
  },
};

// Asset optimization utilities
export const assetUtils = {
  // Generate optimized image URLs
  getOptimizedImageUrl: (
    src: string, 
    width?: number, 
    height?: number, 
    quality?: number,
    format?: 'webp' | 'avif' | 'jpg' | 'png'
  ) => {
    const params = new URLSearchParams();
    
    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    if (quality) params.set('q', quality.toString());
    if (format) params.set('f', format);

    return `${src}?${params.toString()}`;
  },

  // Check if WebP is supported
  supportsWebP: (): Promise<boolean> => {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  },

  // Check if AVIF is supported
  supportsAVIF: (): Promise<boolean> => {
    return new Promise((resolve) => {
      const avif = new Image();
      avif.onload = avif.onerror = () => {
        resolve(avif.height === 2);
      };
      avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
    });
  },

  // Get best supported image format
  getBestImageFormat: async (formats: string[]): Promise<string> => {
    const [supportsWebP, supportsAVIF] = await Promise.all([
      assetUtils.supportsWebP(),
      assetUtils.supportsAVIF(),
    ]);

    for (const format of formats) {
      if (format === 'avif' && supportsAVIF) return 'avif';
      if (format === 'webp' && supportsWebP) return 'webp';
      if (['jpg', 'jpeg', 'png'].includes(format)) return format;
    }

    return formats[formats.length - 1] || 'jpg';
  },

  // Calculate image dimensions for responsive images
  calculateResponsiveDimensions: (
    originalWidth: number,
    originalHeight: number,
    breakpoints: number[]
  ) => {
    const aspectRatio = originalWidth / originalHeight;
    
    return breakpoints.map(width => ({
      width,
      height: Math.round(width / aspectRatio),
    }));
  },
};

// Initialize asset optimizations
export const initializeAssetOptimizations = () => {
  if (typeof document !== 'undefined') {
    // Add resource hints to document head
    const hintsHTML = resourceHints.generateHints();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = hintsHTML;
    
    Array.from(tempDiv.children).forEach(child => {
      document.head.appendChild(child);
    });

    // Log optimization status in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚀 Asset Optimizations Initialized');
      console.log('Resource hints added:', resourceHints.dnsPrefetch.length + resourceHints.preconnect.length);
      console.log('Performance budget:', performanceBudget.limits);
      console.log('Image formats supported:', {
        webp: 'checking...',
        avif: 'checking...',
      });
      console.groupEnd();

      // Check format support
      Promise.all([
        assetUtils.supportsWebP(),
        assetUtils.supportsAVIF(),
      ]).then(([webp, avif]) => {
        console.log('Image format support:', { webp, avif });
      });
    }
  }
};