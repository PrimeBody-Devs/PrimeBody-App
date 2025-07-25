import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { APP_CONFIG, SEO_CONFIG, THEME_CONFIG } from '@/lib/constants';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

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
  openGraph: {
    ...SEO_CONFIG.openGraph,
    images: [...SEO_CONFIG.openGraph.images],
  },
  twitter: {
    ...SEO_CONFIG.twitter,
    images: [...SEO_CONFIG.twitter.images],
  },
  robots: SEO_CONFIG.robots,
  metadataBase: new URL(APP_CONFIG.url),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute={THEME_CONFIG.attribute}
          defaultTheme={THEME_CONFIG.defaultTheme}
          enableSystem
          disableTransitionOnChange={false}
          storageKey={THEME_CONFIG.storageKey}
        >
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
