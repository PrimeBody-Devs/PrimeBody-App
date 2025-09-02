import { Metadata } from 'next';
import { generateSEOMetadata, generatePageMeta } from '@/lib/seo-utils';

const pageMeta = generatePageMeta('register');

export const metadata: Metadata = generateSEOMetadata({
  title: pageMeta.title,
  description: pageMeta.description,
  keywords: pageMeta.keywords,
  url: '/register',
  type: 'website',
});