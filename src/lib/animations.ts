// Animation configuration for FitCast Landing Page
export const animations = {
  // Duration values
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '750ms',
    slowest: '1000ms',
  },
  
  // Easing functions
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  
  // Keyframe animations
  keyframes: {
    fadeIn: {
      '0%': { opacity: '0' },
      '100%': { opacity: '1' },
    },
    fadeOut: {
      '0%': { opacity: '1' },
      '100%': { opacity: '0' },
    },
    slideUp: {
      '0%': { transform: 'translateY(20px)', opacity: '0' },
      '100%': { transform: 'translateY(0)', opacity: '1' },
    },
    slideDown: {
      '0%': { transform: 'translateY(-20px)', opacity: '0' },
      '100%': { transform: 'translateY(0)', opacity: '1' },
    },
    slideLeft: {
      '0%': { transform: 'translateX(20px)', opacity: '0' },
      '100%': { transform: 'translateX(0)', opacity: '1' },
    },
    slideRight: {
      '0%': { transform: 'translateX(-20px)', opacity: '0' },
      '100%': { transform: 'translateX(0)', opacity: '1' },
    },
    scaleIn: {
      '0%': { transform: 'scale(0.95)', opacity: '0' },
      '100%': { transform: 'scale(1)', opacity: '1' },
    },
    scaleOut: {
      '0%': { transform: 'scale(1)', opacity: '1' },
      '100%': { transform: 'scale(0.95)', opacity: '0' },
    },
    bounceIn: {
      '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
      '40%, 43%': { transform: 'translate3d(0, -8px, 0)' },
      '70%': { transform: 'translate3d(0, -4px, 0)' },
      '90%': { transform: 'translate3d(0, -2px, 0)' },
    },
    pulse: {
      '0%, 100%': { opacity: '1' },
      '50%': { opacity: '0.5' },
    },
    spin: {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
    ping: {
      '75%, 100%': {
        transform: 'scale(2)',
        opacity: '0',
      },
    },
    wiggle: {
      '0%, 100%': { transform: 'rotate(-3deg)' },
      '50%': { transform: 'rotate(3deg)' },
    },
  },
  
  // Animation classes
  classes: {
    // Entrance animations
    fadeIn: 'animate-fade-in',
    slideUp: 'animate-slide-up',
    slideDown: 'animate-slide-down',
    slideLeft: 'animate-slide-left',
    slideRight: 'animate-slide-right',
    scaleIn: 'animate-scale-in',
    bounceIn: 'animate-bounce-in',
    
    // Loading animations
    pulse: 'animate-pulse',
    spin: 'animate-spin',
    ping: 'animate-ping',
    
    // Interactive animations
    wiggle: 'animate-wiggle',
    
    // Hover effects
    hoverScale: 'hover:scale-105 transition-transform duration-200',
    hoverLift: 'hover:-translate-y-1 transition-transform duration-200',
    hoverGlow: 'hover:shadow-lg transition-shadow duration-200',
    
    // Focus effects
    focusRing: 'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
    focusVisible: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
  },
} as const;

// Framer Motion variants
export const motionVariants = {
  // Container variants
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1,
      },
    },
  },
  
  // Item variants
  item: {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  },
  
  // Fade variants
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  },
  
  // Scale variants
  scale: {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
  },
  
  // Slide variants
  slideUp: {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -50, opacity: 0 },
  },
  
  slideDown: {
    hidden: { y: -50, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: 50, opacity: 0 },
  },
  
  slideLeft: {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
  },
  
  slideRight: {
    hidden: { x: -50, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: 50, opacity: 0 },
  },
} as const;

// Scroll animation utilities
export const scrollAnimations = {
  // Intersection Observer options
  observerOptions: {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  },
  
  // Animation classes for scroll triggers
  onScroll: {
    fadeIn: 'opacity-0 translate-y-4 transition-all duration-700 ease-out',
    fadeInVisible: 'opacity-100 translate-y-0',
    slideUp: 'opacity-0 translate-y-8 transition-all duration-700 ease-out',
    slideUpVisible: 'opacity-100 translate-y-0',
    scaleIn: 'opacity-0 scale-95 transition-all duration-700 ease-out',
    scaleInVisible: 'opacity-100 scale-100',
  },
} as const;