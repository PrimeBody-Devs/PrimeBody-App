// App configuration constants
export const APP_CONFIG = {
  name: 'FitCast Challenges',
  description: 'Desafíos fitness con recompensas crypto reales en Farcaster',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://fitcast.app',
  version: '1.0.0',
} as const;

// Social media links
export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/fitcast',
  farcaster: 'https://warpcast.com/fitcast',
  github: 'https://github.com/fitcast/challenges',
  discord: 'https://discord.gg/fitcast',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  base: process.env.NEXT_PUBLIC_API_URL || '/api',
  analytics: '/analytics',
  newsletter: '/newsletter',
} as const;

// Theme configuration
export const THEME_CONFIG = {
  defaultTheme: 'dark' as const,
  storageKey: 'fitcast-theme',
  attribute: 'class',
} as const;

// Animation configuration
export const ANIMATION_CONFIG = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// SEO configuration
export const SEO_CONFIG = {
  title: {
    default: APP_CONFIG.name,
    template: `%s | ${APP_CONFIG.name}`,
  },
  description: APP_CONFIG.description,
  keywords: [
    'fitness',
    'crypto',
    'farcaster',
    'web3',
    'challenges',
    'tokens',
    'base',
    'miniapp',
    'move-to-earn',
    'blockchain',
  ],
  authors: [{ name: 'FitCast Team' }],
  creator: 'FitCast Team',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: APP_CONFIG.url,
    siteName: APP_CONFIG.name,
    title: APP_CONFIG.name,
    description: APP_CONFIG.description,
    images: [
      {
        url: `${APP_CONFIG.url}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: APP_CONFIG.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_CONFIG.name,
    description: APP_CONFIG.description,
    images: [`${APP_CONFIG.url}/og-image.jpg`],
    creator: '@fitcast',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
} as const;

// Feature flags
export const FEATURE_FLAGS = {
  enableAnalytics: process.env.NODE_ENV === 'production',
  enableNewsletter: true,
  enableWalletConnect: false, // Will be enabled when MiniKit integration is ready
  enableBetaFeatures: process.env.NODE_ENV === 'development',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  generic: 'Algo salió mal. Por favor, intenta de nuevo.',
  network: 'Error de conexión. Verifica tu internet.',
  notFound: 'No se encontró lo que buscas.',
  unauthorized: 'No tienes permisos para esta acción.',
  validation: 'Por favor, verifica los datos ingresados.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  newsletter: '¡Te has suscrito exitosamente!',
  contact: '¡Mensaje enviado correctamente!',
  copy: '¡Copiado al portapapeles!',
} as const;