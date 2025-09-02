import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '@/styles/accessibility.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Web3Provider } from '@/components/providers/web3-provider';
import { AccessibilityProvider } from '@/components/providers/accessibility-provider';
import { SkipLinks } from '@/components/accessibility/skip-links';
import { APP_CONFIG, SEO_CONFIG, THEME_CONFIG, FRAME_CONFIG, STRUCTURED_DATA } from '@/lib/constants';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: SEO_CONFIG.title,
  description: SEO_CONFIG.description,
  keywords: [...SEO_CONFIG.keywords],
  authors: [...SEO_CONFIG.authors],
  creator: SEO_CONFIG.creator,
  publisher: SEO_CONFIG.publisher,
  category: SEO_CONFIG.category,
  applicationName: SEO_CONFIG.applicationName,
  referrer: SEO_CONFIG.referrer,
  openGraph: {
    ...SEO_CONFIG.openGraph,
    images: [...SEO_CONFIG.openGraph.images],
    videos: SEO_CONFIG.openGraph.videos ? [...SEO_CONFIG.openGraph.videos] : undefined,
    // Fix alternateLocale if present
    ...(SEO_CONFIG.openGraph.alternateLocale && {
      alternateLocale: [...SEO_CONFIG.openGraph.alternateLocale],
    }),
  },
  twitter: {
    ...SEO_CONFIG.twitter,
    images: [...SEO_CONFIG.twitter.images],
  },
  robots: SEO_CONFIG.robots,
  verification: SEO_CONFIG.verification,
  alternates: SEO_CONFIG.alternates,
  metadataBase: new URL(APP_CONFIG.url),
  manifest: SEO_CONFIG.manifest,
  // Farcaster Frame meta tags
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': FRAME_CONFIG.imageUrl,
    'fc:frame:image:aspect_ratio': FRAME_CONFIG.aspectRatio,
    'fc:frame:button:1': FRAME_CONFIG.buttonText,
    'fc:frame:post_url': FRAME_CONFIG.postUrl,
    // Additional meta tags for better SEO
    'format-detection': 'telephone=no',
    'msapplication-TileColor': '#3b82f6',
    'msapplication-config': '/browserconfig.xml',
  },
  icons: SEO_CONFIG.icons,
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: SEO_CONFIG.themeColor,
  colorScheme: 'dark light',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Preconnect to External Domains for Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://mainnet.base.org" />
        <link rel="dns-prefetch" href="https://basescan.org" />
        <link rel="dns-prefetch" href="https://warpcast.com" />
        <link rel="dns-prefetch" href="https://api.farcaster.xyz" />
        
        {/* Preload Critical Resources */}
        <link rel="preload" href="/fonts/GeistVF.woff" as="font" type="font/woff" crossOrigin="anonymous" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Security Headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        
        {/* RSS Feed */}
        <link rel="alternate" type="application/rss+xml" title="PrimeBody RSS Feed" href="/feed.xml" />
        
        {/* Sitemap */}
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
        
        {/* Global Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(STRUCTURED_DATA.organization),
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <SkipLinks />
        <ErrorBoundary>
          <AccessibilityProvider>
            <Web3Provider>
              <ThemeProvider
                attribute={THEME_CONFIG.attribute}
                defaultTheme={THEME_CONFIG.defaultTheme}
                enableSystem
                disableTransitionOnChange={false}
                storageKey={THEME_CONFIG.storageKey}
              >
              <div className="flex min-h-screen flex-col">
                <ErrorBoundary>
                  <Header />
                </ErrorBoundary>
                
                <main id="main-content" className="flex-1" role="main" aria-label="Contenido principal">
                  <ErrorBoundary>
                    {children}
                  </ErrorBoundary>
                </main>
                
                <ErrorBoundary>
                  <Footer />
                </ErrorBoundary>
              </div>
              
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'hsl(var(--background))',
                    color: 'hsl(var(--foreground))',
                    border: '1px solid hsl(var(--border))',
                  },
                }}
              />
            </ThemeProvider>
          </Web3Provider>
        </AccessibilityProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
