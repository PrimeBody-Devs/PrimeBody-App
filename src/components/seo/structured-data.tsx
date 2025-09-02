import { STRUCTURED_DATA } from '@/lib/constants';

interface StructuredDataProps {
  type: keyof typeof STRUCTURED_DATA;
  data?: Record<string, any>;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const baseData = STRUCTURED_DATA[type];
  const mergedData = data ? { ...baseData, ...data } : baseData;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(mergedData, null, 0),
      }}
    />
  );
}

// Utility function to generate page-specific structured data
export function generatePageStructuredData(
  pageType: 'home' | 'register' | 'about' | 'contact',
  additionalData?: Record<string, any>
) {
  const baseData = {
    home: [
      STRUCTURED_DATA.website,
      STRUCTURED_DATA.webApplication,
      STRUCTURED_DATA.organization,
    ],
    register: [
      STRUCTURED_DATA.webApplication,
      {
        ...STRUCTURED_DATA.breadcrumbList,
        itemListElement: [
          ...STRUCTURED_DATA.breadcrumbList.itemListElement,
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Registro',
            item: `${STRUCTURED_DATA.website.url}/register`,
          },
        ],
      },
    ],
    about: [
      STRUCTURED_DATA.organization,
      {
        ...STRUCTURED_DATA.breadcrumbList,
        itemListElement: [
          ...STRUCTURED_DATA.breadcrumbList.itemListElement,
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Acerca de',
            item: `${STRUCTURED_DATA.website.url}/about`,
          },
        ],
      },
    ],
    contact: [
      STRUCTURED_DATA.organization,
      {
        ...STRUCTURED_DATA.breadcrumbList,
        itemListElement: [
          ...STRUCTURED_DATA.breadcrumbList.itemListElement,
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Contacto',
            item: `${STRUCTURED_DATA.website.url}/contact`,
          },
        ],
      },
    ],
  };

  return baseData[pageType].map((data, index) => ({
    ...data,
    ...(additionalData && additionalData[index] ? additionalData[index] : {}),
  }));
}