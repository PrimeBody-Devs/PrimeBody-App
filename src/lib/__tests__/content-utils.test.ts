import {
  validateContent,
  loadContent,
  getCachedContent,
  setCachedContent,
  transformContentForSEO,
  sanitizeContent,
  isValidUrl,
  validateImageUrls,
} from '../content-utils';
import { LandingPageContent } from '@/types/content';
import { createMockContent } from './test-utils';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock fetch
global.fetch = jest.fn();

describe('Content Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    mockLocalStorage.removeItem.mockClear();
  });

  describe('validateContent', () => {
    it('validates valid content successfully', () => {
      const content = createMockContent();
      const result = validateContent(content);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('detects missing hero title', () => {
      const content = createMockContent();
      content.hero.title = '';
      
      const result = validateContent(content);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'hero.title',
        message: 'Hero title is required',
        severity: 'error',
      });
    });

    it('detects missing hero subtitle', () => {
      const content = createMockContent();
      content.hero.subtitle = '';
      
      const result = validateContent(content);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'hero.subtitle',
        message: 'Hero subtitle is required',
        severity: 'error',
      });
    });

    it('detects missing hero CTA text', () => {
      const content = createMockContent();
      content.hero.ctaText = '';
      
      const result = validateContent(content);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'hero.ctaText',
        message: 'Hero CTA text is required',
        severity: 'error',
      });
    });

    it('warns about long hero title', () => {
      const content = createMockContent();
      content.hero.title = 'A'.repeat(70); // Longer than 60 characters
      
      const result = validateContent(content);
      
      expect(result.warnings).toContainEqual({
        field: 'hero.title',
        message: 'Hero title is longer than recommended (60 characters)',
        suggestion: 'Consider shortening for better mobile display',
      });
    });

    it('warns about long hero subtitle', () => {
      const content = createMockContent();
      content.hero.subtitle = 'A'.repeat(170); // Longer than 160 characters
      
      const result = validateContent(content);
      
      expect(result.warnings).toContainEqual({
        field: 'hero.subtitle',
        message: 'Hero subtitle is longer than recommended (160 characters)',
        suggestion: 'Consider shortening for better readability',
      });
    });

    it('detects missing features', () => {
      const content = createMockContent();
      content.features = [];
      
      const result = validateContent(content);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'features',
        message: 'At least one feature is required',
        severity: 'error',
      });
    });

    it('validates individual feature fields', () => {
      const content = createMockContent();
      content.features[0].title = '';
      content.features[0].description = '';
      content.features[0].icon = '';
      
      const result = validateContent(content);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'features[0].title',
        message: 'Feature 1 title is required',
        severity: 'error',
      });
      expect(result.errors).toContainEqual({
        field: 'features[0].description',
        message: 'Feature 1 description is required',
        severity: 'error',
      });
      expect(result.errors).toContainEqual({
        field: 'features[0].icon',
        message: 'Feature 1 icon is required',
        severity: 'error',
      });
    });

    it('warns about insufficient features', () => {
      const content = createMockContent();
      content.features = content.features.slice(0, 2); // Only 2 features
      
      const result = validateContent(content);
      
      expect(result.warnings).toContainEqual({
        field: 'features',
        message: 'Less than 4 features provided',
        suggestion: 'Consider adding more features for better visual balance',
      });
    });

    it('detects missing demo title', () => {
      const content = createMockContent();
      content.demo.title = '';
      
      const result = validateContent(content);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'demo.title',
        message: 'Demo title is required',
        severity: 'error',
      });
    });

    it('warns about missing demo screenshots', () => {
      const content = createMockContent();
      content.demo.screenshots = [];
      
      const result = validateContent(content);
      
      expect(result.warnings).toContainEqual({
        field: 'demo.screenshots',
        message: 'No demo screenshots provided',
        suggestion: 'Add screenshots to showcase the app',
      });
    });

    it('detects missing CTA fields', () => {
      const content = createMockContent();
      content.cta.title = '';
      content.cta.primaryText = '';
      
      const result = validateContent(content);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'cta.title',
        message: 'CTA title is required',
        severity: 'error',
      });
      expect(result.errors).toContainEqual({
        field: 'cta.primaryText',
        message: 'CTA primary button text is required',
        severity: 'error',
      });
    });

    it('warns about missing copyright', () => {
      const content = createMockContent();
      content.footer.copyright = '';
      
      const result = validateContent(content);
      
      expect(result.warnings).toContainEqual({
        field: 'footer.copyright',
        message: 'Copyright text is missing',
        suggestion: 'Add copyright information for legal compliance',
      });
    });
  });

  describe('loadContent', () => {
    it('loads static content', async () => {
      const mockContent = createMockContent();
      
      // Mock the static content import
      jest.doMock('@/config/content', () => ({
        landingPageContent: mockContent,
      }));
      
      const result = await loadContent({ type: 'static' });
      expect(result).toBeDefined();
    });

    it('loads content from API', async () => {
      const mockContent = createMockContent();
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockContent,
      });
      
      const result = await loadContent({
        type: 'api',
        url: 'https://api.example.com/content',
      });
      
      expect(fetch).toHaveBeenCalledWith('https://api.example.com/content');
      expect(result).toEqual(mockContent);
    });

    it('throws error when API URL is missing', async () => {
      await expect(
        loadContent({ type: 'api' })
      ).rejects.toThrow('API URL is required for API content source');
    });

    it('handles API fetch failure', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      });
      
      await expect(
        loadContent({
          type: 'api',
          url: 'https://api.example.com/content',
        })
      ).rejects.toThrow('Failed to fetch content: Not Found');
    });

    it('uses fallback content on API failure', async () => {
      const fallbackContent = createMockContent();
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
      
      const result = await loadContent({
        type: 'api',
        url: 'https://api.example.com/content',
        fallback: fallbackContent,
      });
      
      expect(result).toEqual(fallbackContent);
    });

    it('handles CMS content type', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const result = await loadContent({ type: 'cms' });
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'CMS content loading not implemented, using static content'
      );
      expect(result).toBeDefined();
      
      consoleSpy.mockRestore();
    });
  });

  describe('Content Caching', () => {
    it('returns null when no cached content exists', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      const result = getCachedContent();
      expect(result).toBeNull();
    });

    it('returns cached content when valid', () => {
      const mockContent = createMockContent();
      const cacheData = {
        content: mockContent,
        timestamp: Date.now(),
      };
      
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(cacheData));
      
      const result = getCachedContent();
      expect(result).toEqual(mockContent);
    });

    it('removes expired cached content', () => {
      const mockContent = createMockContent();
      const expiredTimestamp = Date.now() - (6 * 60 * 1000); // 6 minutes ago
      const cacheData = {
        content: mockContent,
        timestamp: expiredTimestamp,
      };
      
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(cacheData));
      
      const result = getCachedContent();
      expect(result).toBeNull();
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('primebody_content_cache');
    });

    it('handles invalid cached data', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid json');
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const result = getCachedContent();
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    it('sets cached content', () => {
      const mockContent = createMockContent();
      
      setCachedContent(mockContent);
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'primebody_content_cache',
        expect.stringContaining('"content":')
      );
    });

    it('handles cache set errors', () => {
      const mockContent = createMockContent();
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage full');
      });
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      setCachedContent(mockContent);
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('transformContentForSEO', () => {
    it('transforms content for SEO', () => {
      const content = createMockContent();
      const seoData = transformContentForSEO(content);
      
      expect(seoData).toEqual({
        title: content.hero.title,
        description: content.hero.subtitle,
        keywords: 'fitness, crypto, farcaster, web3, challenges, prime tokens, base, miniapp, primebody',
        openGraph: {
          title: content.hero.title,
          description: content.hero.subtitle,
          type: 'website',
          images: [content.hero.backgroundImage],
        },
      });
    });

    it('handles missing background image', () => {
      const content = createMockContent();
      delete content.hero.backgroundImage;
      
      const seoData = transformContentForSEO(content);
      
      expect(seoData.openGraph.images).toEqual([]);
    });
  });

  describe('sanitizeContent', () => {
    it('sanitizes content strings', () => {
      const content = createMockContent();
      content.hero.title = 'Title <script>alert("xss")</script>';
      content.hero.subtitle = 'Subtitle <script>alert("xss")</script>';
      content.features[0].title = 'Feature <script>alert("xss")</script>';
      
      const sanitized = sanitizeContent(content);
      
      expect(sanitized.hero.title).toBe('Title');
      expect(sanitized.hero.subtitle).toBe('Subtitle');
      expect(sanitized.features[0].title).toBe('Feature');
    });

    it('trims whitespace', () => {
      const content = createMockContent();
      content.hero.title = '  Title with spaces  ';
      
      const sanitized = sanitizeContent(content);
      
      expect(sanitized.hero.title).toBe('Title with spaces');
    });

    it('handles optional fields', () => {
      const content = createMockContent();
      content.features[0].highlight = '  Highlight  ';
      delete content.cta.secondaryText;
      
      const sanitized = sanitizeContent(content);
      
      expect(sanitized.features[0].highlight).toBe('Highlight');
      expect(sanitized.cta.secondaryText).toBeUndefined();
    });
  });

  describe('isValidUrl', () => {
    it('validates correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://localhost:3000')).toBe(true);
      expect(isValidUrl('https://subdomain.example.com/path')).toBe(true);
    });

    it('rejects invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('ftp://example.com')).toBe(true); // FTP is valid URL
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl('javascript:alert(1)')).toBe(true); // Technically valid URL
    });
  });

  describe('validateImageUrls', () => {
    it('validates all image URLs in content', () => {
      const content = createMockContent();
      content.hero.backgroundImage = 'invalid-url';
      content.demo.screenshots[0].url = 'also-invalid';
      
      const invalidUrls = validateImageUrls(content);
      
      expect(invalidUrls).toContain('Hero background: invalid-url');
      expect(invalidUrls).toContain('Demo screenshot 1: also-invalid');
    });

    it('returns empty array for valid URLs', () => {
      const content = createMockContent();
      content.hero.backgroundImage = 'https://example.com/bg.jpg';
      content.demo.screenshots[0].url = 'https://example.com/screenshot.jpg';
      
      const invalidUrls = validateImageUrls(content);
      
      expect(invalidUrls).toHaveLength(0);
    });

    it('handles missing background image', () => {
      const content = createMockContent();
      delete content.hero.backgroundImage;
      
      const invalidUrls = validateImageUrls(content);
      
      expect(invalidUrls).toHaveLength(0);
    });
  });

  describe('Server-side rendering', () => {
    it('handles missing window object', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;
      
      expect(() => getCachedContent()).not.toThrow();
      expect(getCachedContent()).toBeNull();
      
      expect(() => setCachedContent(createMockContent())).not.toThrow();
      
      global.window = originalWindow;
    });
  });
});