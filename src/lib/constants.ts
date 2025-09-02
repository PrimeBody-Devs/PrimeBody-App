// App configuration constants
export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'PrimeBody',
  description: 'Transform your body with real crypto rewards on Farcaster',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://primebody.pages.dev',
  version: '1.0.0',
} as const;

// Social media links
export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/primebody',
  farcaster: 'https://warpcast.com/primebody',
  github: 'https://github.com/primebody/app',
  discord: 'https://discord.gg/primebody',
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
  storageKey: 'primebody-theme',
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
    default: 'PrimeBody - Transforma tu Cuerpo con Recompensas Crypto | Mini App Farcaster',
    template: `%s | ${APP_CONFIG.name}`,
  },
  description: 'Únete a desafíos fitness diarios, gana PRIME tokens y comparte tu progreso en Farcaster. La primera Mini App que combina fitness con Web3 de forma revolucionaria.',
  keywords: [
    'primebody',
    'transformación corporal',
    'recompensas crypto',
    'farcaster mini app',
    'web3 fitness',
    'blockchain fitness',
    'move to earn',
    'prime tokens',
    'base network',
    'crypto fitness app',
    'fitness descentralizado',
    'comunidad fitness',
    'recompensas ejercicio',
    'seguimiento fitness',
    'salud web3',
    'desafíos fitness',
    'tokens fitness',
    'aplicación fitness crypto',
    'entrenamiento blockchain',
    'fitness gamificado',
    'ejercicio con recompensas',
    'fitness social',
    'mini app base',
    'farcaster frames',
    'web3 health',
  ],
  authors: [{ name: 'PrimeBody Team', url: APP_CONFIG.url }],
  creator: 'PrimeBody Team',
  publisher: 'PrimeBody',
  category: 'Health & Fitness',
  applicationName: 'PrimeBody',
  referrer: 'origin-when-cross-origin',
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    alternateLocale: ['en_US', 'pt_BR'],
    url: APP_CONFIG.url,
    siteName: APP_CONFIG.name,
    title: 'PrimeBody - Transforma tu Cuerpo con Recompensas Crypto',
    description: 'Únete a la revolución del fitness Web3. Transforma tu cuerpo, gana PRIME tokens y conecta con una comunidad fitness global en Farcaster.',
    images: [
      {
        url: `${APP_CONFIG.url}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'PrimeBody - Plataforma de Fitness Web3',
        type: 'image/jpeg',
      },
      {
        url: `${APP_CONFIG.url}/images/og-image-square.jpg`,
        width: 1200,
        height: 1200,
        alt: 'PrimeBody Logo - Fitness con Recompensas Crypto',
        type: 'image/jpeg',
      },
      {
        url: `${APP_CONFIG.url}/images/og-image-wide.jpg`,
        width: 1920,
        height: 1080,
        alt: 'PrimeBody - Transforma tu Cuerpo con Web3',
        type: 'image/jpeg',
      },
    ],
    videos: [
      {
        url: `${APP_CONFIG.url}/videos/primebody-demo.mp4`,
        width: 1280,
        height: 720,
        type: 'video/mp4',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@primebody',
    creator: '@primebody',
    title: 'PrimeBody - Transforma tu Cuerpo con Recompensas Crypto',
    description: 'Únete a la revolución del fitness Web3. Transforma tu cuerpo, gana PRIME tokens y conecta con una comunidad fitness global.',
    images: [
      {
        url: `${APP_CONFIG.url}/images/twitter-image.jpg`,
        alt: 'PrimeBody - Fitness Web3 con Recompensas Crypto',
      },
    ],
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
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION,
    },
  },
  alternates: {
    canonical: APP_CONFIG.url,
    languages: {
      'es-ES': APP_CONFIG.url,
      'en-US': `${APP_CONFIG.url}/en`,
      'pt-BR': `${APP_CONFIG.url}/pt`,
    },
    types: {
      'application/rss+xml': `${APP_CONFIG.url}/feed.xml`,
    },
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/apple-touch-icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/apple-touch-icon-144x144.png', sizes: '144x144', type: 'image/png' },
      { url: '/apple-touch-icon-120x120.png', sizes: '120x120', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#3b82f6' },
      { rel: 'icon', url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
  manifest: '/manifest.json',
} as const;

// Structured Data (JSON-LD) configuration
export const STRUCTURED_DATA = {
  website: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: APP_CONFIG.name,
    description: APP_CONFIG.description,
    url: APP_CONFIG.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${APP_CONFIG.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    sameAs: [
      SOCIAL_LINKS.twitter,
      SOCIAL_LINKS.farcaster,
      SOCIAL_LINKS.github,
      SOCIAL_LINKS.discord,
    ],
  },
  webApplication: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: APP_CONFIG.name,
    description: 'Mini App de fitness con recompensas crypto en Farcaster que permite a los usuarios transformar su cuerpo mientras ganan PRIME tokens.',
    url: APP_CONFIG.url,
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    permissions: 'Acceso a cámara para fotos de progreso, notificaciones push para recordatorios de ejercicio',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      category: 'Free',
    },
    author: {
      '@type': 'Organization',
      name: 'PrimeBody Team',
      url: APP_CONFIG.url,
    },
    publisher: {
      '@type': 'Organization',
      name: 'PrimeBody',
      url: APP_CONFIG.url,
      logo: {
        '@type': 'ImageObject',
        url: `${APP_CONFIG.url}/images/logo.png`,
        width: 512,
        height: 512,
      },
    },
    screenshot: [
      {
        '@type': 'ImageObject',
        url: `${APP_CONFIG.url}/images/screenshots/dashboard.jpg`,
        description: 'Dashboard principal de PrimeBody mostrando desafíos activos',
      },
      {
        '@type': 'ImageObject',
        url: `${APP_CONFIG.url}/images/screenshots/challenges.jpg`,
        description: 'Pantalla de desafíos fitness disponibles',
      },
      {
        '@type': 'ImageObject',
        url: `${APP_CONFIG.url}/images/screenshots/rewards.jpg`,
        description: 'Sistema de recompensas PRIME tokens',
      },
    ],
    featureList: [
      'Desafíos fitness diarios personalizados',
      'Recompensas en PRIME tokens por completar ejercicios',
      'Integración nativa con Farcaster para compartir progreso',
      'Seguimiento de progreso corporal con fotos',
      'Comunidad fitness Web3 global',
      'Gamificación con niveles y logros',
    ],
  },
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PrimeBody',
    description: 'Plataforma líder de fitness Web3 que combina transformación corporal con recompensas crypto.',
    url: APP_CONFIG.url,
    logo: {
      '@type': 'ImageObject',
      url: `${APP_CONFIG.url}/images/logo.png`,
      width: 512,
      height: 512,
    },
    sameAs: [
      SOCIAL_LINKS.twitter,
      SOCIAL_LINKS.farcaster,
      SOCIAL_LINKS.github,
      SOCIAL_LINKS.discord,
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['Spanish', 'English', 'Portuguese'],
    },
  },
  breadcrumbList: {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: APP_CONFIG.url,
      },
    ],
  },
} as const;

// Feature flags
export const FEATURE_FLAGS = {
  enableAnalytics: process.env.NODE_ENV === 'production',
  enableNewsletter: true,
  enableWalletConnect: false, // Will be enabled when MiniKit integration is ready
  enableBetaFeatures: process.env.NODE_ENV === 'development',
} as const;

// Farcaster Frame configuration
export const FRAME_CONFIG = {
  version: 'vNext',
  imageUrl: `${APP_CONFIG.url}/api/frame/image`,
  buttonText: 'Start Your Body Transformation',
  postUrl: `${APP_CONFIG.url}/api/frame`,
  aspectRatio: '1.91:1' as const,
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