// Main design system export for PrimeBody Landing Page
export { colors, getColorValue, getThemeColor, gradients } from './colors';
export { typography, typographyClasses, responsiveText } from './typography';
export { spacing, containers, sectionSpacing, borderRadius, shadows, zIndex } from './spacing';
export { animations, motionVariants, scrollAnimations } from './animations';

// Design tokens object for easy access
export const designTokens = {
  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Common component sizes
  sizes: {
    button: {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base',
      xl: 'h-14 px-8 text-lg',
    },
    input: {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-3 text-sm',
      lg: 'h-12 px-4 text-base',
    },
    avatar: {
      sm: 'h-8 w-8',
      md: 'h-10 w-10',
      lg: 'h-12 w-12',
      xl: 'h-16 w-16',
    },
    icon: {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
      xl: 'h-8 w-8',
    },
  },
  
  // Common layouts
  layouts: {
    maxWidth: {
      sm: 'max-w-screen-sm',
      md: 'max-w-screen-md',
      lg: 'max-w-screen-lg',
      xl: 'max-w-screen-xl',
      '2xl': 'max-w-screen-2xl',
      prose: 'max-w-prose',
      container: 'max-w-7xl',
    },
    center: 'mx-auto',
    section: 'py-16 sm:py-20 lg:py-24',
    container: 'container mx-auto px-4 sm:px-6 lg:px-8',
  },
  
  // Common effects
  effects: {
    glass: 'bg-white/10 backdrop-blur-md border border-white/20',
    glassDark: 'bg-black/10 backdrop-blur-md border border-white/10',
    card: 'bg-card text-card-foreground shadow-sm border rounded-lg',
    cardHover: 'hover:shadow-md transition-shadow duration-200',
    gradient: 'bg-gradient-to-r from-primary-500 to-primary-600',
    gradientText: 'bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent',
  },
} as const;

// Utility functions for design system
export const ds = {
  // Get responsive classes
  responsive: (base: string, sm?: string, md?: string, lg?: string, xl?: string) => {
    let classes = base;
    if (sm) classes += ` sm:${sm}`;
    if (md) classes += ` md:${md}`;
    if (lg) classes += ` lg:${lg}`;
    if (xl) classes += ` xl:${xl}`;
    return classes;
  },
  
  // Get size classes
  size: (component: keyof typeof designTokens.sizes, size: string) => {
    return designTokens.sizes[component]?.[size as keyof typeof designTokens.sizes[typeof component]] || '';
  },
  
  // Get layout classes
  layout: (type: keyof typeof designTokens.layouts, variant?: string) => {
    const layoutGroup = designTokens.layouts[type];
    if (typeof layoutGroup === 'string') return layoutGroup;
    return variant ? layoutGroup[variant as keyof typeof layoutGroup] || '' : '';
  },
  
  // Get effect classes
  effect: (effect: keyof typeof designTokens.effects) => {
    return designTokens.effects[effect];
  },
} as const;