// Responsive design utilities for PrimeBody Landing Page
import { BREAKPOINTS } from './constants';

// Responsive breakpoint utilities
export const breakpoints = {
  // Mobile-first breakpoints (min-width)
  sm: `@media (min-width: ${BREAKPOINTS.sm}px)`,
  md: `@media (min-width: ${BREAKPOINTS.md}px)`,
  lg: `@media (min-width: ${BREAKPOINTS.lg}px)`,
  xl: `@media (min-width: ${BREAKPOINTS.xl}px)`,
  '2xl': `@media (min-width: ${BREAKPOINTS['2xl']}px)`,
  
  // Max-width breakpoints for mobile-specific styles
  'max-sm': `@media (max-width: ${BREAKPOINTS.sm - 1}px)`,
  'max-md': `@media (max-width: ${BREAKPOINTS.md - 1}px)`,
  'max-lg': `@media (max-width: ${BREAKPOINTS.lg - 1}px)`,
  'max-xl': `@media (max-width: ${BREAKPOINTS.xl - 1}px)`,
  
  // Range breakpoints
  'sm-md': `@media (min-width: ${BREAKPOINTS.sm}px) and (max-width: ${BREAKPOINTS.md - 1}px)`,
  'md-lg': `@media (min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`,
  'lg-xl': `@media (min-width: ${BREAKPOINTS.lg}px) and (max-width: ${BREAKPOINTS.xl - 1}px)`,
  
  // Orientation breakpoints
  portrait: '@media (orientation: portrait)',
  landscape: '@media (orientation: landscape)',
  
  // High DPI screens
  retina: '@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',
} as const;

// Container classes with responsive padding
export const containerClasses = {
  // Standard container with responsive padding
  default: 'mx-auto px-4 sm:px-6 lg:px-8',
  
  // Wide container for full-width sections
  wide: 'mx-auto px-6 sm:px-8 lg:px-12 xl:px-16',
  
  // Narrow container for focused content
  narrow: 'mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl',
  
  // Full width container
  full: 'w-full px-4 sm:px-6 lg:px-8',
  
  // Responsive max-widths
  responsive: 'mx-auto px-4 sm:px-6 lg:px-8 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl',
} as const;

// Grid system utilities
export const gridClasses = {
  // Responsive grid columns
  cols1: 'grid grid-cols-1',
  cols2: 'grid grid-cols-1 sm:grid-cols-2',
  cols3: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  cols4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  cols6: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
  
  // Feature grid (2x2 desktop, 1x4 mobile as per requirements)
  features: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2',
  
  // Hero grid (stacked mobile, side-by-side desktop)
  hero: 'grid grid-cols-1 lg:grid-cols-2',
  
  // Auto-fit grids
  autoFit: 'grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))]',
  autoFill: 'grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))]',
  
  // Gap utilities
  gap: {
    sm: 'gap-4 sm:gap-6',
    md: 'gap-6 sm:gap-8 lg:gap-12',
    lg: 'gap-8 sm:gap-12 lg:gap-16',
  },
} as const;

// Flexbox utilities
export const flexClasses = {
  // Responsive flex direction
  col: 'flex flex-col',
  colSm: 'flex flex-col sm:flex-row',
  colMd: 'flex flex-col md:flex-row',
  colLg: 'flex flex-col lg:flex-row',
  
  // Responsive alignment
  centerMobile: 'flex flex-col items-center sm:items-start',
  centerDesktop: 'flex flex-col items-start lg:items-center',
  
  // Responsive gaps
  gap: {
    sm: 'gap-4 sm:gap-6',
    md: 'gap-6 sm:gap-8',
    lg: 'gap-8 sm:gap-12',
  },
} as const;

// Typography responsive classes
export const responsiveTypography = {
  // Hero text scaling
  heroTitle: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl',
  heroSubtitle: 'text-lg sm:text-xl md:text-2xl lg:text-3xl',
  
  // Section headings
  sectionTitle: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
  sectionSubtitle: 'text-base sm:text-lg md:text-xl lg:text-2xl',
  
  // Body text
  bodyLarge: 'text-lg sm:text-xl md:text-2xl',
  body: 'text-base sm:text-lg',
  bodySmall: 'text-sm sm:text-base',
  
  // Feature text
  featureTitle: 'text-lg sm:text-xl md:text-2xl',
  featureDescription: 'text-sm sm:text-base md:text-lg',
  
  // Button text
  buttonLarge: 'text-base sm:text-lg',
  button: 'text-sm sm:text-base',
} as const;

// Spacing responsive classes
export const responsiveSpacing = {
  // Section padding
  section: 'py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32',
  sectionSmall: 'py-8 sm:py-12 md:py-16 lg:py-20',
  sectionLarge: 'py-16 sm:py-20 md:py-24 lg:py-32 xl:py-40',
  
  // Container padding
  container: 'px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16',
  containerSmall: 'px-4 sm:px-6 lg:px-8',
  
  // Margin utilities
  marginY: {
    sm: 'my-4 sm:my-6 md:my-8',
    md: 'my-6 sm:my-8 md:my-12 lg:my-16',
    lg: 'my-8 sm:my-12 md:my-16 lg:my-20 xl:my-24',
  },
  
  marginX: {
    sm: 'mx-4 sm:mx-6 md:mx-8',
    md: 'mx-6 sm:mx-8 md:mx-12 lg:mx-16',
    lg: 'mx-8 sm:mx-12 md:mx-16 lg:mx-20 xl:mx-24',
  },
} as const;

// Touch-friendly sizing (minimum 44px as per requirements)
export const touchTargets = {
  // Minimum touch target size (44px)
  button: 'min-h-[44px] min-w-[44px]',
  buttonSmall: 'min-h-[40px] min-w-[40px]',
  buttonLarge: 'min-h-[48px] min-w-[48px]',
  
  // Interactive elements
  link: 'min-h-[44px] inline-flex items-center',
  icon: 'h-11 w-11 flex items-center justify-center', // 44px
  
  // Form elements
  input: 'min-h-[44px]',
  select: 'min-h-[44px]',
  textarea: 'min-h-[88px]', // 2x touch target
} as const;

// Responsive visibility utilities
export const visibility = {
  // Show/hide on different screen sizes
  showMobile: 'block sm:hidden',
  hideMobile: 'hidden sm:block',
  showTablet: 'hidden sm:block lg:hidden',
  hideTablet: 'block sm:hidden lg:block',
  showDesktop: 'hidden lg:block',
  hideDesktop: 'block lg:hidden',
  
  // Show only on specific breakpoints
  onlyMobile: 'block sm:hidden',
  onlyTablet: 'hidden sm:block lg:hidden',
  onlyDesktop: 'hidden lg:block',
} as const;

// Animation and transition utilities for responsive design
export const responsiveAnimations = {
  // Hover effects (disabled on touch devices)
  hover: 'transition-all duration-300 hover:scale-105 active:scale-95 md:hover:scale-105 md:active:scale-100',
  hoverSubtle: 'transition-all duration-200 hover:opacity-80 active:opacity-60 md:hover:opacity-80 md:active:opacity-100',
  
  // Transform utilities
  transform: 'transition-transform duration-300 ease-out',
  transformFast: 'transition-transform duration-150 ease-out',
  
  // Responsive animations (reduced motion on mobile)
  slideUp: 'transform translate-y-4 opacity-0 transition-all duration-700 ease-out',
  slideIn: 'transform translate-x-4 opacity-0 transition-all duration-500 ease-out',
  fadeIn: 'opacity-0 transition-opacity duration-500 ease-out',
} as const;

// Utility function to check if device is mobile
export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < BREAKPOINTS.md;
};

// Utility function to check if device is tablet
export const isTablet = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= BREAKPOINTS.md && window.innerWidth < BREAKPOINTS.lg;
};

// Utility function to check if device is desktop
export const isDesktop = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= BREAKPOINTS.lg;
};

// Utility function to get current breakpoint
export const getCurrentBreakpoint = () => {
  if (typeof window === 'undefined') return 'sm';
  
  const width = window.innerWidth;
  if (width >= BREAKPOINTS['2xl']) return '2xl';
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  return 'sm';
};

// Hook for responsive behavior
export const useResponsive = () => {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      breakpoint: 'lg' as const,
    };
  }

  return {
    isMobile: isMobile(),
    isTablet: isTablet(),
    isDesktop: isDesktop(),
    breakpoint: getCurrentBreakpoint(),
  };
};