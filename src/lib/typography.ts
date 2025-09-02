// Typography configuration for PrimeBody Landing Page
export const typography = {
  // Font families
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
  },
  
  // Font sizes with line heights
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
    base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
    '5xl': ['3rem', { lineHeight: '1' }],           // 48px
    '6xl': ['3.75rem', { lineHeight: '1' }],        // 60px
    '7xl': ['4.5rem', { lineHeight: '1' }],         // 72px
    '8xl': ['6rem', { lineHeight: '1' }],           // 96px
    '9xl': ['8rem', { lineHeight: '1' }],           // 128px
  },
  
  // Font weights
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  
  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
  
  // Line heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
} as const;

// Typography utility classes
export const typographyClasses = {
  // Headings
  h1: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight',
  h2: 'text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight',
  h3: 'text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight',
  h4: 'text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight',
  h5: 'text-lg md:text-xl lg:text-2xl font-semibold tracking-tight',
  h6: 'text-base md:text-lg lg:text-xl font-semibold tracking-tight',
  
  // Body text
  body: 'text-base leading-relaxed',
  bodyLarge: 'text-lg leading-relaxed',
  bodySmall: 'text-sm leading-normal',
  
  // Special text styles
  lead: 'text-xl md:text-2xl leading-relaxed text-muted-foreground',
  subtitle: 'text-lg md:text-xl leading-relaxed text-muted-foreground',
  caption: 'text-sm text-muted-foreground',
  overline: 'text-xs font-medium uppercase tracking-wider text-muted-foreground',
  
  // Interactive text
  link: 'text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-colors',
  button: 'font-medium',
  
  // Code text
  code: 'font-mono text-sm bg-muted px-1.5 py-0.5 rounded',
  codeBlock: 'font-mono text-sm bg-muted p-4 rounded-lg overflow-x-auto',
} as const;

// Responsive typography utilities
export const responsiveText = {
  hero: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl',
  title: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
  subtitle: 'text-lg sm:text-xl md:text-2xl',
  body: 'text-base sm:text-lg',
  small: 'text-sm sm:text-base',
} as const;