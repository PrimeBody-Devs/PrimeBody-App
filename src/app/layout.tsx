import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Web3Provider } from '@/components/providers/web3-provider';
import { APP_CONFIG, SEO_CONFIG, THEME_CONFIG } from '@/lib/constants';
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
  openGraph: {
    ...SEO_CONFIG.openGraph,
    images: [...SEO_CONFIG.openGraph.images],
  },
  twitter: {
    ...SEO_CONFIG.twitter,
    images: [...SEO_CONFIG.twitter.images],
  },
  robots: SEO_CONFIG.robots,
  verification: SEO_CONFIG.verification,
  alternates: SEO_CONFIG.alternates,
  metadataBase: new URL(APP_CONFIG.url),
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#3b82f6' },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://mainnet.base.org" />
        <link rel="dns-prefetch" href="https://basescan.org" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ErrorBoundary>
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
                
                <main className="flex-1">
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
        </ErrorBoundary>
      </body>
    </html>
  );
}
