// Color palette configuration for PrimeBody Landing Page
export const colors = {
  // Primary brand colors
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#3b82f6', // Main brand color
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
  
  // Accent colors (green for fitness/health)
  accent: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981', // Main accent color
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
    950: '#022c22',
  },
  
  // Neutral colors
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },
  
  // Semantic colors
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a',
    900: '#14532d',
  },
  
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
    900: '#78350f',
  },
  
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
    900: '#7f1d1d',
  },
  
  info: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
    900: '#1e3a8a',
  },
} as const;

// Color utilities
export const getColorValue = (color: string, shade: number = 500) => {
  const colorPath = color.split('.');
  let value: Record<string, unknown> = colors as Record<string, unknown>;
  
  for (const path of colorPath) {
    value = value[path] as Record<string, unknown>;
  }
  
  return (value as Record<number, string>)?.[shade] || value;
};

// Theme-aware color functions
export const getThemeColor = (lightColor: string, darkColor: string) => ({
  light: lightColor,
  dark: darkColor,
});

// Gradient definitions
export const gradients = {
  primary: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  accent: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  hero: 'linear-gradient(135deg, #f0f9ff 0%, #ecfdf5 50%, #f0f9ff 100%)',
  heroDark: 'linear-gradient(135deg, #172554 0%, #022c22 50%, #172554 100%)',
  card: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
  cardDark: 'linear-gradient(145deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 100%)',
} as const;