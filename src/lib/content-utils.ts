import { 
  LandingPageContent, 
  ContentValidationResult, 
  ContentValidationError,
  ContentValidationWarning,
  ContentLoadingState,
  ContentSource
} from '@/types/content';
import { landingPageContent } from '@/config/content';

// Content validation functions
export const validateContent = (content: LandingPageContent): ContentValidationResult => {
  const errors: ContentValidationError[] = [];
  const warnings: ContentValidationWarning[] = [];

  // Hero validation
  if (!content.hero.title || content.hero.title.trim().length === 0) {
    errors.push({
      field: 'hero.title',
      message: 'Hero title is required',
      severity: 'error'
    });
  }

  if (!content.hero.subtitle || content.hero.subtitle.trim().length === 0) {
    errors.push({
      field: 'hero.subtitle',
      message: 'Hero subtitle is required',
      severity: 'error'
    });
  }

  if (!content.hero.ctaText || content.hero.ctaText.trim().length === 0) {
    errors.push({
      field: 'hero.ctaText',
      message: 'Hero CTA text is required',
      severity: 'error'
    });
  }

  // Title length warnings
  if (content.hero.title.length > 60) {
    warnings.push({
      field: 'hero.title',
      message: 'Hero title is longer than recommended (60 characters)',
      suggestion: 'Consider shortening for better mobile display'
    });
  }

  if (content.hero.subtitle.length > 160) {
    warnings.push({
      field: 'hero.subtitle',
      message: 'Hero subtitle is longer than recommended (160 characters)',
      suggestion: 'Consider shortening for better readability'
    });
  }

  // Features validation
  if (!content.features || content.features.length === 0) {
    errors.push({
      field: 'features',
      message: 'At least one feature is required',
      severity: 'error'
    });
  } else {
    content.features.forEach((feature, index) => {
      if (!feature.title || feature.title.trim().length === 0) {
        errors.push({
          field: `features[${index}].title`,
          message: `Feature ${index + 1} title is required`,
          severity: 'error'
        });
      }

      if (!feature.description || feature.description.trim().length === 0) {
        errors.push({
          field: `features[${index}].description`,
          message: `Feature ${index + 1} description is required`,
          severity: 'error'
        });
      }

      if (!feature.icon || feature.icon.trim().length === 0) {
        errors.push({
          field: `features[${index}].icon`,
          message: `Feature ${index + 1} icon is required`,
          severity: 'error'
        });
      }
    });

    // Recommend 4 features for optimal layout
    if (content.features.length < 4) {
      warnings.push({
        field: 'features',
        message: 'Less than 4 features provided',
        suggestion: 'Consider adding more features for better visual balance'
      });
    }
  }

  // Demo validation
  if (!content.demo.title || content.demo.title.trim().length === 0) {
    errors.push({
      field: 'demo.title',
      message: 'Demo title is required',
      severity: 'error'
    });
  }

  if (!content.demo.screenshots || content.demo.screenshots.length === 0) {
    warnings.push({
      field: 'demo.screenshots',
      message: 'No demo screenshots provided',
      suggestion: 'Add screenshots to showcase the app'
    });
  }

  // CTA validation
  if (!content.cta.title || content.cta.title.trim().length === 0) {
    errors.push({
      field: 'cta.title',
      message: 'CTA title is required',
      severity: 'error'
    });
  }

  if (!content.cta.primaryText || content.cta.primaryText.trim().length === 0) {
    errors.push({
      field: 'cta.primaryText',
      message: 'CTA primary button text is required',
      severity: 'error'
    });
  }

  // Footer validation
  if (!content.footer.copyright || content.footer.copyright.trim().length === 0) {
    warnings.push({
      field: 'footer.copyright',
      message: 'Copyright text is missing',
      suggestion: 'Add copyright information for legal compliance'
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Content loading functions
export const loadContent = async (source: ContentSource): Promise<LandingPageContent> => {
  switch (source.type) {
    case 'static':
      return landingPageContent;
    
    case 'api':
      if (!source.url) {
        throw new Error('API URL is required for API content source');
      }
      
      try {
        const response = await fetch(source.url);
        if (!response.ok) {
          throw new Error(`Failed to fetch content: ${response.statusText}`);
        }
        const content = await response.json();
        return content as LandingPageContent;
      } catch (error) {
        console.error('Failed to load content from API:', error);
        if (source.fallback) {
          return source.fallback;
        }
        throw error;
      }
    
    case 'cms':
      // Placeholder for CMS integration
      console.warn('CMS content loading not implemented, using static content');
      return landingPageContent;
    
    default:
      return landingPageContent;
  }
};

// Content caching utilities
const CONTENT_CACHE_KEY = 'primebody_content_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getCachedContent = (): LandingPageContent | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem(CONTENT_CACHE_KEY);
    if (!cached) return null;
    
    const { content, timestamp } = JSON.parse(cached);
    const now = Date.now();
    
    if (now - timestamp > CACHE_DURATION) {
      localStorage.removeItem(CONTENT_CACHE_KEY);
      return null;
    }
    
    return content as LandingPageContent;
  } catch (error) {
    console.error('Failed to get cached content:', error);
    return null;
  }
};

export const setCachedContent = (content: LandingPageContent): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const cacheData = {
      content,
      timestamp: Date.now()
    };
    localStorage.setItem(CONTENT_CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Failed to cache content:', error);
  }
};

// Content transformation utilities
export const transformContentForSEO = (content: LandingPageContent) => {
  return {
    title: content.hero.title,
    description: content.hero.subtitle,
    keywords: [
      'fitness',
      'crypto',
      'farcaster',
      'web3',
      'challenges',
      'prime tokens',
      'base',
      'miniapp',
      'primebody'
    ].join(', '),
    openGraph: {
      title: content.hero.title,
      description: content.hero.subtitle,
      type: 'website',
      images: content.hero.backgroundImage ? [content.hero.backgroundImage] : []
    }
  };
};

// Content sanitization
export const sanitizeContent = (content: LandingPageContent): LandingPageContent => {
  const sanitizeString = (str: string): string => {
    return str.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  };

  return {
    ...content,
    hero: {
      ...content.hero,
      title: sanitizeString(content.hero.title),
      subtitle: sanitizeString(content.hero.subtitle),
      ctaText: sanitizeString(content.hero.ctaText)
    },
    features: content.features.map(feature => ({
      ...feature,
      title: sanitizeString(feature.title),
      description: sanitizeString(feature.description),
      highlight: feature.highlight ? sanitizeString(feature.highlight) : undefined
    })),
    demo: {
      ...content.demo,
      title: sanitizeString(content.demo.title),
      description: sanitizeString(content.demo.description)
    },
    cta: {
      ...content.cta,
      title: sanitizeString(content.cta.title),
      description: sanitizeString(content.cta.description),
      primaryText: sanitizeString(content.cta.primaryText),
      secondaryText: content.cta.secondaryText ? sanitizeString(content.cta.secondaryText) : undefined
    }
  };
};

// Content loading hook state management
export const createContentLoadingState = (): ContentLoadingState => ({
  isLoading: false,
  error: undefined,
  lastUpdated: undefined
});

// URL validation utility
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Image URL validation
export const validateImageUrls = (content: LandingPageContent): string[] => {
  const invalidUrls: string[] = [];
  
  // Check hero background image
  if (content.hero.backgroundImage && !isValidUrl(content.hero.backgroundImage)) {
    invalidUrls.push(`Hero background: ${content.hero.backgroundImage}`);
  }
  
  // Check demo screenshots
  content.demo.screenshots.forEach((screenshot, index) => {
    if (!isValidUrl(screenshot.url)) {
      invalidUrls.push(`Demo screenshot ${index + 1}: ${screenshot.url}`);
    }
  });
  
  return invalidUrls;
};