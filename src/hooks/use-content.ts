import { useState, useEffect, useCallback } from 'react';
import { 
  LandingPageContent, 
  ContentLoadingState, 
  ContentSource,
  ContentValidationResult 
} from '@/types/content';
import { 
  loadContent, 
  validateContent, 
  getCachedContent, 
  setCachedContent,
  sanitizeContent 
} from '@/lib/content-utils';
import { landingPageContent } from '@/config/content';

interface UseContentOptions {
  source?: ContentSource;
  enableCaching?: boolean;
  validateOnLoad?: boolean;
  sanitizeOnLoad?: boolean;
}

interface UseContentReturn {
  content: LandingPageContent;
  loadingState: ContentLoadingState;
  validation: ContentValidationResult | null;
  refreshContent: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useContent = (options: UseContentOptions = {}): UseContentReturn => {
  const {
    source = { type: 'static' },
    enableCaching = true,
    validateOnLoad = true,
    sanitizeOnLoad = true
  } = options;

  const [content, setContent] = useState<LandingPageContent>(landingPageContent);
  const [loadingState, setLoadingState] = useState<ContentLoadingState>({
    isLoading: false,
    error: undefined,
    lastUpdated: undefined
  });
  const [validation, setValidation] = useState<ContentValidationResult | null>(null);

  const loadContentData = useCallback(async () => {
    setLoadingState(prev => ({ ...prev, isLoading: true, error: undefined }));

    try {
      // Try to get cached content first
      let loadedContent: LandingPageContent | null = null;
      
      if (enableCaching && source.type === 'static') {
        loadedContent = getCachedContent();
      }

      // Load fresh content if no cache or not using cache
      if (!loadedContent) {
        loadedContent = await loadContent(source);
        
        // Cache the loaded content
        if (enableCaching) {
          setCachedContent(loadedContent);
        }
      }

      // Sanitize content if enabled
      if (sanitizeOnLoad) {
        loadedContent = sanitizeContent(loadedContent);
      }

      // Validate content if enabled
      let validationResult: ContentValidationResult | null = null;
      if (validateOnLoad) {
        validationResult = validateContent(loadedContent);
        setValidation(validationResult);

        // Log validation warnings in development
        if (process.env.NODE_ENV === 'development' && validationResult.warnings.length > 0) {
          console.warn('Content validation warnings:', validationResult.warnings);
        }

        // Throw error if validation fails
        if (!validationResult.isValid) {
          throw new Error(`Content validation failed: ${validationResult.errors.map(e => e.message).join(', ')}`);
        }
      }

      setContent(loadedContent);
      setLoadingState({
        isLoading: false,
        error: undefined,
        lastUpdated: new Date()
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load content';
      
      setLoadingState({
        isLoading: false,
        error: errorMessage,
        lastUpdated: undefined
      });

      // Use fallback content on error
      if (source.fallback) {
        setContent(source.fallback);
      }

      console.error('Content loading error:', error);
    }
  }, [source, enableCaching, validateOnLoad, sanitizeOnLoad]);

  const refreshContent = useCallback(async () => {
    // Clear cache before refreshing
    if (enableCaching && typeof window !== 'undefined') {
      localStorage.removeItem('primebody_content_cache');
    }
    
    await loadContentData();
  }, [loadContentData, enableCaching]);

  // Load content on mount and when dependencies change
  useEffect(() => {
    loadContentData();
  }, [loadContentData]);

  return {
    content,
    loadingState,
    validation,
    refreshContent,
    isLoading: loadingState.isLoading,
    error: loadingState.error || null
  };
};

// Specialized hooks for different content sections
export const useHeroContent = () => {
  const { content, isLoading, error } = useContent();
  return {
    hero: content.hero,
    isLoading,
    error
  };
};

export const useFeaturesContent = () => {
  const { content, isLoading, error } = useContent();
  return {
    features: content.features,
    isLoading,
    error
  };
};

export const useDemoContent = () => {
  const { content, isLoading, error } = useContent();
  return {
    demo: content.demo,
    isLoading,
    error
  };
};

export const useCTAContent = () => {
  const { content, isLoading, error } = useContent();
  return {
    cta: content.cta,
    isLoading,
    error
  };
};

export const useFooterContent = () => {
  const { content, isLoading, error } = useContent();
  return {
    footer: content.footer,
    isLoading,
    error
  };
};