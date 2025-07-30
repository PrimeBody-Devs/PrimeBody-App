// App configuration constants
export const APP_CONFIG = {
  name: 'FitCast Challenges',
  description: 'Fitness challenges with real crypto rewards on Farcaster',
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
    'fitness challenges',
    'crypto rewards',
    'farcaster mini app',
    'web3 fitness',
    'blockchain fitness',
    'move to earn',
    'fitness tokens',
    'base network',
    'crypto fitness app',
    'decentralized fitness',
    'fitness community',
    'workout rewards',
    'prime tokens',
    'fitness tracking',
    'web3 health',
  ],
  authors: [{ name: 'FitCast Team', url: 'https://fitcast.app' }],
  creator: 'FitCast Team',
  publisher: 'FitCast',
  category: 'Health & Fitness',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['es_ES', 'pt_BR'],
    url: APP_CONFIG.url,
    siteName: APP_CONFIG.name,
    title: 'FitCast Challenges - Earn Crypto Rewards for Your Fitness Journey',
    description: 'Join the Web3 fitness revolution. Complete daily challenges, earn PRIME tokens, and connect with a global fitness community on Farcaster.',
    images: [
      {
        url: `${APP_CONFIG.url}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'FitCast Challenges - Web3 Fitness Platform',
        type: 'image/jpeg',
      },
      {
        url: `${APP_CONFIG.url}/og-image-square.jpg`,
        width: 1200,
        height: 1200,
        alt: 'FitCast Challenges Logo',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@fitcast',
    creator: '@fitcast',
    title: 'FitCast Challenges - Earn Crypto Rewards for Your Fitness Journey',
    description: 'Join the Web3 fitness revolution. Complete daily challenges, earn PRIME tokens, and connect with a global fitness community.',
    images: [`${APP_CONFIG.url}/twitter-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
  },
  alternates: {
    canonical: APP_CONFIG.url,
    languages: {
      'en-US': APP_CONFIG.url,
      'es-ES': `${APP_CONFIG.url}/es`,
      'pt-BR': `${APP_CONFIG.url}/pt`,
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
  generic: 'Something went wrong. Please try again.',
  network: 'Connection error. Please check your internet connection.',
  notFound: 'The requested resource was not found.',
  unauthorized: 'You do not have permission for this action.',
  validation: 'Please verify the entered data.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  newsletter: 'Successfully subscribed!',
  contact: 'Message sent successfully!',
  copy: 'Copied to clipboard!',
} as const;