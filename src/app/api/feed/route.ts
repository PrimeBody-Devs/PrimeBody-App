import { NextResponse } from 'next/server';
import { APP_CONFIG } from '@/lib/constants';

export async function GET() {
  const baseUrl = APP_CONFIG.url;
  const currentDate = new Date().toISOString();

  // Sample blog posts/updates for RSS feed
  const posts = [
    {
      title: 'Lanzamiento de PrimeBody: La Revolución del Fitness Web3',
      description: 'Descubre cómo PrimeBody está transformando la industria del fitness con recompensas crypto reales y tecnología blockchain.',
      link: `${baseUrl}/blog/lanzamiento-primebody`,
      pubDate: new Date('2024-01-15').toISOString(),
      guid: `${baseUrl}/blog/lanzamiento-primebody`,
    },
    {
      title: 'Cómo Ganar PRIME Tokens con Ejercicio Diario',
      description: 'Guía completa sobre cómo maximizar tus recompensas PRIME tokens a través de entrenamientos consistentes y desafíos completados.',
      link: `${baseUrl}/blog/ganar-prime-tokens`,
      pubDate: new Date('2024-01-10').toISOString(),
      guid: `${baseUrl}/blog/ganar-prime-tokens`,
    },
    {
      title: 'Integración con Farcaster: Comparte tu Progreso Fitness',
      description: 'Aprende a conectar tu progreso fitness con la comunidad Web3 de Farcaster y motivar a otros en su transformación.',
      link: `${baseUrl}/blog/integracion-farcaster`,
      pubDate: new Date('2024-01-05').toISOString(),
      guid: `${baseUrl}/blog/integracion-farcaster`,
    },
    {
      title: 'Base Network: La Blockchain Perfecta para Fitness',
      description: 'Descubre por qué elegimos Base Network para construir PrimeBody y cómo beneficia a nuestros usuarios.',
      link: `${baseUrl}/blog/base-network-fitness`,
      pubDate: new Date('2024-01-01').toISOString(),
      guid: `${baseUrl}/blog/base-network-fitness`,
    },
  ];

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:wfw="http://wellformedweb.org/CommentAPI/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
     xmlns:slash="http://purl.org/rss/1.0/modules/slash/">
  <channel>
    <title>PrimeBody Blog - Fitness Web3 y Recompensas Crypto</title>
    <link>${baseUrl}</link>
    <description>Mantente actualizado con las últimas noticias, consejos y actualizaciones de PrimeBody, la plataforma líder de fitness Web3 con recompensas PRIME tokens.</description>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <language>es-ES</language>
    <sy:updatePeriod>weekly</sy:updatePeriod>
    <sy:updateFrequency>1</sy:updateFrequency>
    <generator>PrimeBody RSS Generator</generator>
    <managingEditor>team@primebody.app (PrimeBody Team)</managingEditor>
    <webMaster>tech@primebody.app (PrimeBody Tech Team)</webMaster>
    <copyright>© ${new Date().getFullYear()} PrimeBody. Todos los derechos reservados.</copyright>
    <category>Health &amp; Fitness</category>
    <category>Cryptocurrency</category>
    <category>Web3</category>
    <category>Blockchain</category>
    <ttl>1440</ttl>
    <image>
      <url>${baseUrl}/images/rss-logo.png</url>
      <title>PrimeBody</title>
      <link>${baseUrl}</link>
      <width>144</width>
      <height>144</height>
      <description>PrimeBody - Transforma tu Cuerpo con Recompensas Crypto</description>
    </image>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    
${posts.map(post => `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${post.link}</link>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${new Date(post.pubDate).toUTCString()}</pubDate>
      <guid isPermaLink="true">${post.guid}</guid>
      <dc:creator><![CDATA[PrimeBody Team]]></dc:creator>
      <category><![CDATA[Fitness]]></category>
      <category><![CDATA[Web3]]></category>
      <category><![CDATA[PRIME Tokens]]></category>
    </item>`).join('\n')}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}