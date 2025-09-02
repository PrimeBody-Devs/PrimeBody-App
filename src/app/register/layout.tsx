import { Metadata } from 'next';
import { generateSEOMetadata, generatePageMeta, generateStructuredData } from '@/lib/seo-utils';
import { STRUCTURED_DATA } from '@/lib/constants';

const pageMeta = generatePageMeta('register');

export const metadata: Metadata = generateSEOMetadata({
  title: pageMeta.title,
  description: pageMeta.description,
  keywords: pageMeta.keywords,
  url: '/register',
  type: 'website',
});

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = generateStructuredData('breadcrumb', {
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: 'https://primebody.pages.dev',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Registro',
        item: 'https://primebody.pages.dev/register',
      },
    ],
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(STRUCTURED_DATA.webApplication),
        }}
      />
      {children}
    </>
  );
}