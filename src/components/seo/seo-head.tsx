import Head from 'next/head';
import { SEO_CONFIG, APP_CONFIG } from '@/lib/constants';
import { StructuredData, generatePageStructuredData } from './structured-data';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  pageType?: 'home' | 'register' | 'about' | 'contact';
  noIndex?: boolean;
  noFollow?: boolean;
  canonical?: string;
  structuredData?: Record<string, any>[];
}

export function SEOHead({
  title,
  description = SEO_CONFIG.description,
  keywords = SEO_CONFIG.keywords,
  image,
  url,
  type = 'website',
  pageType = 'home',
  noIndex = false,
  noFollow = false,
  canonical,
  structuredData,
}: SEOHeadProps) {
  const pageTitle = title 
    ? `${title} | ${APP_CONFIG.name}`
    : SEO_CONFIG.title.default;
  
  const pageUrl = url || APP_CONFIG.url;
  const pageImage = image || `${APP_CONFIG.url}/images/og-image.jpg`;
  const pageCanonical = canonical || pageUrl;

  // Generate structured data for the page
  const pageStructuredData = structuredData || generatePageStructuredData(pageType);

  return (
    <>
      <Head>
        {/* Basic Meta Tags */}
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords.join(', ')} />
        <meta name="author" content={SEO_CONFIG.creator} />
        <meta name="publisher" content={SEO_CONFIG.publisher} />
        <meta name="copyright" content={`© ${new Date().getFullYear()} ${APP_CONFIG.name}`} />
        <meta name="language" content="es" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />

        {/* Robots Meta Tags */}
        <meta 
          name="robots" 
          content={`${noIndex ? 'noindex' : 'index'}, ${noFollow ? 'nofollow' : 'follow'}, max-snippet:-1, max-image-preview:large, max-video-preview:-1`} 
        />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="bingbot" content="index, follow" />

        {/* Canonical URL */}
        <link rel="canonical" href={pageCanonical} />

        {/* Open Graph Meta Tags */}
        <meta property="og:type" content={type} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:image:alt" content={`${APP_CONFIG.name} - ${title || 'Fitness Web3'}`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content={APP_CONFIG.name} />
        <meta property="og:locale" content="es_ES" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:locale:alternate" content="pt_BR" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@primebody" />
        <meta name="twitter:creator" content="@primebody" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={pageImage} />
        <meta name="twitter:image:alt" content={`${APP_CONFIG.name} - ${title || 'Fitness Web3'}`} />

        {/* Additional Meta Tags for Mobile and PWA */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="application-name" content={APP_CONFIG.name} />
        <meta name="apple-mobile-web-app-title" content={APP_CONFIG.name} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Preconnect to External Domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://mainnet.base.org" />
        <link rel="dns-prefetch" href="https://basescan.org" />
        <link rel="dns-prefetch" href="https://warpcast.com" />

        {/* Favicon and Icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#3b82f6" />

        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Alternative Formats */}
        <link rel="alternate" type="application/rss+xml" title={`${APP_CONFIG.name} RSS Feed`} href="/feed.xml" />
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />

        {/* Verification Tags */}
        {process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION && (
          <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION} />
        )}
        {process.env.NEXT_PUBLIC_BING_VERIFICATION && (
          <meta name="msvalidate.01" content={process.env.NEXT_PUBLIC_BING_VERIFICATION} />
        )}
        {process.env.NEXT_PUBLIC_YANDEX_VERIFICATION && (
          <meta name="yandex-verification" content={process.env.NEXT_PUBLIC_YANDEX_VERIFICATION} />
        )}

        {/* Security Headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />

        {/* Performance Hints */}
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </Head>

      {/* Structured Data */}
      {pageStructuredData.map((data, index) => (
        <StructuredData
          key={index}
          type="website" // This will be overridden by the data prop
          data={data}
        />
      ))}
    </>
  );
}