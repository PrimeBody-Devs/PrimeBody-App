// Animation system for PrimeBody Landing Page
import { ANIMATION_CONFIG } from './constants';

// Animation variants for different use cases
export const animationVariants = {
  // Entrance animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  
  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  
  // Scale animations
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
  
  scaleUp: {
    initial: { scale: 1 },
    animate: { scale: 1.05 },
    exit: { scale: 1 },
  },
  
  // Stagger animations for lists
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
  
  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
  
  // Hero animations
  heroTitle: {
    initial: { opacity: 0, y: 30 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: ANIMATION_CONFIG.easing.out,
      },
    },
  },
  
  heroSubtitle: {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.2,
        ease: ANIMATION_CONFIG.easing.out,
      },
    },
  },
  
  heroButton: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.4,
        delay: 0.4,
        ease: ANIMATION_CONFIG.easing.bounce,
      },
    },
    hover: {
      scale: 1.05,
      y: -2,
      transition: {
        duration: 0.2,
        ease: ANIMATION_CONFIG.easing.out,
      },
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1,
      },
    },
  },
  
  // Card animations
  card: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: ANIMATION_CONFIG.easing.out,
      },
    },
  },
  
  // Icon animations
  icon: {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: {
        duration: 0.5,
        ease: ANIMATION_CONFIG.easing.bounce,
      },
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.2,
      },
    },
  },
  
  // Loading animations
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },
  
  spin: {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  },
  
  // Gradient animations
  gradientShift: {
    animate: {
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },
} as const;

// CSS animation classes for Tailwind
export const animationClasses = {
  // Entrance animations
  fadeIn: 'animate-in fade-in duration-500',
  slideUp: 'animate-in slide-in-from-bottom-4 duration-700',
  slideDown: 'animate-in slide-in-from-top-4 duration-700',
  slideLeft: 'animate-in slide-in-from-right-4 duration-700',
  slideRight: 'animate-in slide-in-from-left-4 duration-700',
  
  // Hover effects
  hoverScale: 'transition-transform duration-300 hover:scale-105',
  hoverLift: 'transition-all duration-300 hover:-translate-y-2 hover:shadow-xl',
  hoverGlow: 'transition-all duration-300 hover:shadow-lg hover:shadow-primary/25',
  
  // Button animations
  buttonPress: 'transition-all duration-150 active:scale-95',
  buttonBounce: 'transition-all duration-300 hover:scale-105 active:scale-95',
  
  // Loading states
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  bounce: 'animate-bounce',
  
  // Gradient animations
  gradientX: 'bg-gradient-to-r bg-[length:200%_100%] animate-[gradient_3s_ease-in-out_infinite]',
  gradientY: 'bg-gradient-to-b bg-[length:100%_200%] animate-[gradient_3s_ease-in-out_infinite]',
  
  // Blob animations
  blob: 'animate-blob',
  blobDelay2: 'animate-blob animation-delay-2000',
  blobDelay4: 'animate-blob animation-delay-4000',
  
  // Scroll animations
  scrollFade: 'opacity-0 translate-y-4 transition-all duration-700 ease-out',
  scrollSlide: 'opacity-0 translate-x-4 transition-all duration-500 ease-out',
  
  // Micro-interactions
  wiggle: 'animate-[wiggle_1s_ease-in-out_infinite]',
  heartbeat: 'animate-[heartbeat_1.5s_ease-in-out_infinite]',
  float: 'animate-[float_3s_ease-in-out_infinite]',
} as const;

// Scroll-triggered animation observer
export class ScrollAnimationObserver {
  private observer: IntersectionObserver;
  private elements: Map<Element, string> = new Map();

  constructor(options: IntersectionObserverInit = {}) {
    const defaultOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
      ...options,
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const element = entry.target;
        const animationClass = this.elements.get(element);

        if (entry.isIntersecting && animationClass) {
          element.classList.add('in-view');
          element.classList.remove('opacity-0', 'translate-y-4', 'translate-x-4');
          element.classList.add('opacity-100', 'translate-y-0', 'translate-x-0');
          
          // Add custom animation class if provided
          if (animationClass !== 'default') {
            element.classList.add(animationClass);
          }
        }
      });
    }, defaultOptions);
  }

  observe(element: Element, animationClass: string = 'default') {
    this.elements.set(element, animationClass);
    this.observer.observe(element);
  }

  unobserve(element: Element) {
    this.elements.delete(element);
    this.observer.unobserve(element);
  }

  disconnect() {
    this.observer.disconnect();
    this.elements.clear();
  }
}

// Animation utilities
export const animationUtils = {
  // Stagger delay calculator
  staggerDelay: (index: number, baseDelay: number = 100) => `${index * baseDelay}ms`,
  
  // Reduced motion check
  respectsReducedMotion: () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },
  
  // Performance-aware animation
  canAnimate: () => {
    if (typeof window === 'undefined') return false;
    
    // Check for reduced motion preference
    if (animationUtils.respectsReducedMotion()) return false;
    
    // Check for low-end device indicators
    const connection = (navigator as any).connection;
    if (connection && connection.saveData) return false;
    
    // Check for sufficient performance
    const memory = (performance as any).memory;
    if (memory && memory.usedJSHeapSize > memory.totalJSHeapSize * 0.9) return false;
    
    return true;
  },
  
  // Safe animation wrapper
  safeAnimate: (element: Element, animation: string, duration: number = 300) => {
    if (!animationUtils.canAnimate()) return;
    
    element.classList.add(animation);
    
    setTimeout(() => {
      element.classList.remove(animation);
    }, duration);
  },
  
  // Intersection observer for scroll animations
  createScrollObserver: (callback?: (entry: IntersectionObserverEntry) => void) => {
    return new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          if (callback) callback(entry);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    });
  },
};

// Keyframe definitions for custom animations
export const keyframes = {
  gradient: `
    @keyframes gradient {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
  `,
  
  blob: `
    @keyframes blob {
      0%, 100% { transform: translate(0px, 0px) scale(1); }
      33% { transform: translate(30px, -50px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
    }
  `,
  
  wiggle: `
    @keyframes wiggle {
      0%, 100% { transform: rotate(-3deg); }
      50% { transform: rotate(3deg); }
    }
  `,
  
  heartbeat: `
    @keyframes heartbeat {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
  `,
  
  float: `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
  `,
  
  slideInUp: `
    @keyframes slideInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `,
  
  slideInLeft: `
    @keyframes slideInLeft {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
  `,
  
  scaleIn: `
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.8); }
      to { opacity: 1; transform: scale(1); }
    }
  `,
} as const;

// Animation delays for staggered effects
export const animationDelays = {
  none: '0ms',
  xs: '50ms',
  sm: '100ms',
  md: '150ms',
  lg: '200ms',
  xl: '300ms',
  '2xl': '500ms',
} as const;