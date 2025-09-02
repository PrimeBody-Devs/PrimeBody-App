import { Metadata } from 'next';
import { APP_CONFIG, SEO_CONFIG } from './constants';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
  noIndex?: boolean;
  noFollow?: boolean;
}

export function generateSEOMetadata({
  title,
  description = SEO_CONFIG.description,
  keywords = SEO_CONFIG.keywords,
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
  section,
  tags,
  noIndex = false,
  noFollow = false,
}: SEOProps = {}): Metadata {
  const pageTitle = title 
    ? `${title} | ${APP_CONFIG.name}`
    : SEO_CONFIG.title.default;
  
  const pageUrl = url || APP_CONFIG.url;
  const pageImage = image || `${APP_CONFIG.url}/images/og-image.jpg`;
  
  // Combine default keywords with page-specific ones
  const allKeywords = [...new Set([...SEO_CONFIG.keywords, ...keywords])];
  
  const metadata: Metadata = {
    title: pageTitle,
    description,
    keywords: allKeywords,
    authors: authors ? authors.map(name => ({ name })) : SEO_CONFIG.authors,
    creator: SEO_CONFIG.creator,
    publisher: SEO_CONFIG.publisher,
    applicationName: SEO_CONFIG.applicationName,
    referrer: SEO_CONFIG.referrer,
    colorScheme: SEO_CONFIG.colorScheme,
    
    openGraph: {
      type,
      locale: SEO_CONFIG.openGraph.locale,
      alternateLocale: SEO_CONFIG.openGraph.alternateLocale,
      url: pageUrl,
      siteName: SEO_CONFIG.openGraph.siteName,
      title: pageTitle,
      description,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: `${APP_CONFIG.name} - ${title || 'Fitness Web3'}`,
          type: 'image/jpeg',
        },
      ],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: authors || ['PrimeBody Team'],
        section,
        tags,
      }),
    },
    
    twitter: {
      card: 'summary_large_image',
      site: SEO_CONFIG.twitter.site,
      creator: SEO_CONFIG.twitter.creator,
      title: pageTitle,
      description,
      images: [
        {
          url: pageImage,
          alt: `${APP_CONFIG.name} - ${title || 'Fitness Web3'}`,
        },
      ],
    },
    
    robots: {
      index: !noIndex,
      follow: !noFollow,
      nocache: false,
      googleBot: {
        index: !noIndex,
        follow: !noFollow,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    alternates: {
      canonical: pageUrl,
      languages: SEO_CONFIG.alternates.languages,
      types: SEO_CONFIG.alternates.types,
    },
    
    verification: SEO_CONFIG.verification,
    icons: SEO_CONFIG.icons,
    manifest: SEO_CONFIG.manifest,
    
    other: {
      'format-detection': 'telephone=no',
      'msapplication-TileColor': '#3b82f6',
      'msapplication-config': '/browserconfig.xml',
    },
  };
  
  return metadata;
}

// Generate structured data for different page types
export function generateStructuredData(
  type: 'website' | 'article' | 'organization' | 'breadcrumb',
  data: Record<string, any> = {}
) {
  const baseStructuredData = {
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
    },
    
    article: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: data.title || APP_CONFIG.name,
      description: data.description || APP_CONFIG.description,
      image: data.image || `${APP_CONFIG.url}/images/og-image.jpg`,
      author: {
        '@type': 'Organization',
        name: 'PrimeBody Team',
        url: APP_CONFIG.url,
      },
      publisher: {
        '@type': 'Organization',
        name: APP_CONFIG.name,
        logo: {
          '@type': 'ImageObject',
          url: `${APP_CONFIG.url}/images/logo.png`,
        },
      },
      datePublished: data.publishedTime || new Date().toISOString(),
      dateModified: data.modifiedTime || new Date().toISOString(),
    },
    
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: APP_CONFIG.name,
      description: APP_CONFIG.description,
      url: APP_CONFIG.url,
      logo: {
        '@type': 'ImageObject',
        url: `${APP_CONFIG.url}/images/logo.png`,
        width: 512,
        height: 512,
      },
      sameAs: [
        'https://twitter.com/primebody',
        'https://warpcast.com/primebody',
        'https://github.com/primebody/app',
        'https://discord.gg/primebody',
      ],
    },
    
    breadcrumb: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: data.breadcrumbs || [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Inicio',
          item: APP_CONFIG.url,
        },
      ],
    },
  };
  
  return { ...baseStructuredData[type], ...data };
}

// Generate page-specific meta tags
export function generatePageMeta(
  page: 'home' | 'register' | 'challenges' | 'community' | 'about' | 'contact'
) {
  const pageMeta = {
    home: {
      title: 'PrimeBody - Transforma tu Cuerpo con Recompensas Crypto',
      description: 'Únete a desafíos fitness diarios, gana PRIME tokens y comparte tu progreso en Farcaster. La primera Mini App que combina fitness con Web3.',
      keywords: ['primebody', 'fitness web3', 'prime tokens', 'farcaster mini app', 'transformación corporal'],
    },
    
    register: {
      title: 'Registro - Comienza tu Transformación',
      description: 'Regístrate en PrimeBody y comienza a ganar PRIME tokens por entrenar. Únete a la comunidad fitness Web3 más grande.',
      keywords: ['registro primebody', 'crear cuenta fitness', 'ganar prime tokens', 'fitness web3'],
    },
    
    challenges: {
      title: 'Desafíos Fitness - Gana PRIME Tokens',
      description: 'Descubre desafíos fitness personalizados que te ayudan a transformar tu cuerpo mientras ganas recompensas crypto reales.',
      keywords: ['desafíos fitness', 'ejercicios primebody', 'ganar tokens ejercicio', 'fitness gamificado'],
    },
    
    community: {
      title: 'Comunidad Fitness Web3 - Conecta en Farcaster',
      description: 'Únete a la comunidad fitness más activa de Web3. Comparte tu progreso, motiva a otros y participa en desafíos grupales.',
      keywords: ['comunidad fitness', 'farcaster fitness', 'web3 community', 'fitness social'],
    },
    
    about: {
      title: 'Acerca de PrimeBody - Revolución Fitness Web3',
      description: 'Conoce la historia detrás de PrimeBody y cómo estamos revolucionando la industria del fitness con blockchain y recompensas crypto.',
      keywords: ['acerca primebody', 'historia fitness web3', 'equipo primebody', 'misión fitness'],
    },
    
    contact: {
      title: 'Contacto - Soporte PrimeBody',
      description: 'Ponte en contacto con el equipo de PrimeBody. Estamos aquí para ayudarte en tu transformación fitness Web3.',
      keywords: ['contacto primebody', 'soporte fitness', 'ayuda prime tokens', 'support web3'],
    },
  };
  
  return pageMeta[page];
}

// Utility to generate canonical URLs
export function generateCanonicalUrl(path: string = '') {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${APP_CONFIG.url}${cleanPath}`;
}

// Utility to generate hreflang tags
export function generateHreflangTags(path: string = '') {
  const languages = {
    'es': APP_CONFIG.url,
    'en': `${APP_CONFIG.url}/en`,
    'pt': `${APP_CONFIG.url}/pt`,
  };
  
  return Object.entries(languages).map(([lang, baseUrl]) => ({
    hreflang: lang,
    href: `${baseUrl}${path}`,
  }));
}