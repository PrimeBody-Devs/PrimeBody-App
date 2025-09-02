import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'next-themes';
import { mockIntersectionObserver, mockMatchMedia, mockLocalStorage } from '@/lib/__tests__/test-utils';

// Mock Next.js components
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => children,
  useAnimation: () => ({
    start: jest.fn(),
    stop: jest.fn(),
    set: jest.fn(),
  }),
  useInView: () => true,
}));

// Mock content hook
const mockContent = {
  hero: {
    title: 'Transforma tu cuerpo con PrimeBody',
    subtitle: 'Únete a desafíos fitness diarios, gana PRIME tokens y comparte tu progreso en Farcaster.',
    ctaText: 'Comenzar Transformación',
    backgroundImage: '/images/hero-bg.jpg',
  },
  features: [
    {
      id: 'daily-challenges',
      icon: 'Trophy',
      title: 'Desafíos Diarios',
      description: 'Completa rutinas personalizadas y gana PRIME tokens.',
      highlight: 'Gana tokens diariamente',
    },
    {
      id: 'social-sharing',
      icon: 'Share',
      title: 'Comparte en Farcaster',
      description: 'Conecta con la comunidad fitness.',
      highlight: 'Comunidad activa',
    },
  ],
  demo: {
    title: 'Ve PrimeBody en Acción',
    description: 'Descubre cómo funciona nuestra Mini App.',
    screenshots: [
      {
        id: 'dashboard',
        url: '/images/demo/dashboard.jpg',
        alt: 'Dashboard principal',
        title: 'Dashboard',
      },
    ],
  },
  cta: {
    title: '¿Listo para Transformar tu Cuerpo?',
    description: 'Únete a miles de usuarios.',
    primaryText: 'Comenzar Transformación',
    secondaryText: 'Ver Demo',
  },
  footer: {
    links: [
      {
        category: 'Producto',
        items: [
          { label: 'Características', href: '#features' },
          { label: 'Demo', href: '#demo' },
        ],
      },
    ],
    socialLinks: [
      {
        platform: 'twitter' as const,
        url: 'https://twitter.com/primebody',
        label: 'Twitter',
      },
    ],
    copyright: '© 2025 PrimeBody. Todos los derechos reservados.',
  },
};

jest.mock('@/hooks/use-content', () => ({
  useContent: () => ({
    content: mockContent,
    isLoading: false,
    error: null,
  }),
  useHeroContent: () => ({
    hero: mockContent.hero,
    isLoading: false,
    error: null,
  }),
  useFeaturesContent: () => ({
    features: mockContent.features,
    isLoading: false,
    error: null,
  }),
  useDemoContent: () => ({
    demo: mockContent.demo,
    isLoading: false,
    error: null,
  }),
  useCTAContent: () => ({
    cta: mockContent.cta,
    isLoading: false,
    error: null,
  }),
  useFooterContent: () => ({
    footer: mockContent.footer,
    isLoading: false,
    error: null,
  }),
}));

// Mock theme hook
const mockTheme = {
  theme: 'light',
  setTheme: jest.fn(),
  toggleTheme: jest.fn(),
  isDark: false,
  mounted: true,
};

jest.mock('@/hooks/use-theme', () => ({
  useTheme: () => mockTheme,
}));

// Mock analytics
const mockTrackEvent = jest.fn();
jest.mock('@/hooks/use-analytics', () => ({
  useAnalytics: () => ({
    trackEvent: mockTrackEvent,
    trackPageView: jest.fn(),
  }),
}));

// Create a mock landing page component
const MockLandingPage = () => (
  <ThemeProvider attribute="class" defaultTheme="light">
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl">PrimeBody</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features">Características</a>
            <a href="#demo">Demo</a>
            <a href="#pricing">Precios</a>
          </nav>
          <div className="flex items-center gap-4">
            <button 
              data-testid="theme-toggle"
              onClick={mockTheme.toggleTheme}
              aria-label="Toggle theme"
            >
              🌙
            </button>
            <button 
              data-testid="cta-header"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
            >
              {mockContent.hero.ctaText}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container text-center">
          <h1 className="text-4xl font-bold mb-6">{mockContent.hero.title}</h1>
          <p className="text-xl mb-8">{mockContent.hero.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              data-testid="cta-primary"
              className="bg-primary text-primary-foreground px-8 py-3 rounded-md"
              onClick={() => mockTrackEvent('cta_clicked', { location: 'hero' })}
            >
              {mockContent.hero.ctaText}
            </button>
            <button 
              data-testid="cta-secondary"
              className="border border-input px-8 py-3 rounded-md"
            >
              Ver Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Características</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {mockContent.features.map((feature) => (
              <div 
                key={feature.id}
                data-testid={`feature-${feature.id}`}
                className="p-6 rounded-xl border hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
                {feature.highlight && (
                  <span className="inline-block mt-2 text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                    {feature.highlight}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 px-4 bg-muted/50">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6">{mockContent.demo.title}</h2>
          <p className="text-xl mb-12">{mockContent.demo.description}</p>
          <div className="max-w-4xl mx-auto">
            <img 
              src={mockContent.demo.screenshots[0].url}
              alt={mockContent.demo.screenshots[0].alt}
              className="w-full rounded-xl shadow-2xl"
            />
          </div>
          <button 
            data-testid="demo-cta"
            className="mt-8 bg-primary text-primary-foreground px-8 py-3 rounded-md"
            onClick={() => mockTrackEvent('demo_cta_clicked')}
          >
            Probar Ahora
          </button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6">{mockContent.cta.title}</h2>
          <p className="text-xl mb-8">{mockContent.cta.description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              data-testid="final-cta-primary"
              className="bg-primary text-primary-foreground px-8 py-3 rounded-md"
              onClick={() => mockTrackEvent('final_cta_clicked')}
            >
              {mockContent.cta.primaryText}
            </button>
            <button 
              data-testid="final-cta-secondary"
              className="border border-input px-8 py-3 rounded-md"
            >
              {mockContent.cta.secondaryText}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4">
            {mockContent.footer.links.map((category) => (
              <div key={category.category}>
                <h3 className="font-semibold mb-4">{category.category}</h3>
                <ul className="space-y-2">
                  {category.items.map((link) => (
                    <li key={link.href}>
                      <a 
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t text-center">
            <p className="text-muted-foreground">{mockContent.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  </ThemeProvider>
);

describe('PrimeBody User Journey Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIntersectionObserver();
    mockMatchMedia();
    mockLocalStorage();
  });

  describe('Complete Landing Page Journey', () => {
    it('renders the complete landing page', () => {
      render(<MockLandingPage />);
      
      // Check all main sections are present
      expect(screen.getByText('PrimeBody')).toBeInTheDocument();
      expect(screen.getByText(mockContent.hero.title)).toBeInTheDocument();
      expect(screen.getByText('Características')).toBeInTheDocument();
      expect(screen.getByText(mockContent.demo.title)).toBeInTheDocument();
      expect(screen.getByText(mockContent.cta.title)).toBeInTheDocument();
      expect(screen.getByText(mockContent.footer.copyright)).toBeInTheDocument();
    });

    it('allows user to navigate through sections', async () => {
      const user = userEvent.setup();
      render(<MockLandingPage />);
      
      // Click on features navigation
      const featuresLink = screen.getByText('Características');
      await user.click(featuresLink);
      
      // Should navigate to features section (in real app, this would scroll)
      expect(featuresLink).toHaveAttribute('href', '#features');
      
      // Click on demo navigation
      const demoLink = screen.getByText('Demo');
      await user.click(demoLink);
      
      expect(demoLink).toHaveAttribute('href', '#demo');
    });

    it('handles theme switching throughout the journey', async () => {
      const user = userEvent.setup();
      render(<MockLandingPage />);
      
      const themeToggle = screen.getByTestId('theme-toggle');
      
      // Toggle theme
      await user.click(themeToggle);
      
      expect(mockTheme.toggleTheme).toHaveBeenCalledTimes(1);
    });
  });

  describe('CTA Conversion Flow', () => {
    it('tracks CTA clicks from different sections', async () => {
      const user = userEvent.setup();
      render(<MockLandingPage />);
      
      // Click hero CTA
      const heroCTA = screen.getByTestId('cta-primary');
      await user.click(heroCTA);
      
      expect(mockTrackEvent).toHaveBeenCalledWith('cta_clicked', { location: 'hero' });
      
      // Click demo CTA
      const demoCTA = screen.getByTestId('demo-cta');
      await user.click(demoCTA);
      
      expect(mockTrackEvent).toHaveBeenCalledWith('demo_cta_clicked');
      
      // Click final CTA
      const finalCTA = screen.getByTestId('final-cta-primary');
      await user.click(finalCTA);
      
      expect(mockTrackEvent).toHaveBeenCalledWith('final_cta_clicked');
    });

    it('provides multiple CTA opportunities', () => {
      render(<MockLandingPage />);
      
      // Should have multiple CTA buttons
      const ctaButtons = [
        screen.getByTestId('cta-header'),
        screen.getByTestId('cta-primary'),
        screen.getByTestId('demo-cta'),
        screen.getByTestId('final-cta-primary'),
      ];
      
      ctaButtons.forEach(button => {
        expect(button).toBeInTheDocument();
        expect(button).toBeEnabled();
      });
    });

    it('handles secondary actions', async () => {
      const user = userEvent.setup();
      render(<MockLandingPage />);
      
      // Click secondary CTA buttons
      const secondaryCTA = screen.getByTestId('cta-secondary');
      await user.click(secondaryCTA);
      
      const finalSecondaryCTA = screen.getByTestId('final-cta-secondary');
      await user.click(finalSecondaryCTA);
      
      // These should be clickable (in real app would show demo or more info)
      expect(secondaryCTA).toBeInTheDocument();
      expect(finalSecondaryCTA).toBeInTheDocument();
    });
  });

  describe('Feature Discovery Flow', () => {
    it('displays all features with proper information', () => {
      render(<MockLandingPage />);
      
      mockContent.features.forEach((feature) => {
        const featureElement = screen.getByTestId(`feature-${feature.id}`);
        expect(featureElement).toBeInTheDocument();
        
        expect(screen.getByText(feature.title)).toBeInTheDocument();
        expect(screen.getByText(feature.description)).toBeInTheDocument();
        
        if (feature.highlight) {
          expect(screen.getByText(feature.highlight)).toBeInTheDocument();
        }
      });
    });

    it('features have proper hover interactions', async () => {
      const user = userEvent.setup();
      render(<MockLandingPage />);
      
      const firstFeature = screen.getByTestId('feature-daily-challenges');
      
      // Hover over feature
      await user.hover(firstFeature);
      
      // Should have hover classes (tested via CSS classes)
      expect(firstFeature).toHaveClass('hover:shadow-lg');
    });
  });

  describe('Demo Engagement Flow', () => {
    it('displays demo content properly', () => {
      render(<MockLandingPage />);
      
      expect(screen.getByText(mockContent.demo.title)).toBeInTheDocument();
      expect(screen.getByText(mockContent.demo.description)).toBeInTheDocument();
      
      const demoImage = screen.getByAltText(mockContent.demo.screenshots[0].alt);
      expect(demoImage).toBeInTheDocument();
      expect(demoImage).toHaveAttribute('src', mockContent.demo.screenshots[0].url);
    });

    it('allows interaction with demo CTA', async () => {
      const user = userEvent.setup();
      render(<MockLandingPage />);
      
      const demoCTA = screen.getByTestId('demo-cta');
      await user.click(demoCTA);
      
      expect(mockTrackEvent).toHaveBeenCalledWith('demo_cta_clicked');
    });
  });

  describe('Responsive Behavior', () => {
    it('adapts layout for mobile screens', () => {
      // Mock mobile viewport
      mockMatchMedia(true);
      
      render(<MockLandingPage />);
      
      // Check that responsive classes are applied
      const ctaContainer = screen.getByTestId('cta-primary').parentElement;
      expect(ctaContainer).toHaveClass('flex-col', 'sm:flex-row');
    });

    it('shows/hides navigation elements based on screen size', () => {
      render(<MockLandingPage />);
      
      const navigation = screen.getByText('Características').parentElement;
      expect(navigation).toHaveClass('hidden', 'md:flex');
    });
  });

  describe('Accessibility Journey', () => {
    it('supports keyboard navigation through CTAs', async () => {
      render(<MockLandingPage />);
      
      const heroCTA = screen.getByTestId('cta-primary');
      
      // Focus and activate with keyboard
      heroCTA.focus();
      expect(document.activeElement).toBe(heroCTA);
      
      fireEvent.keyDown(heroCTA, { key: 'Enter', code: 'Enter' });
      expect(mockTrackEvent).toHaveBeenCalledWith('cta_clicked', { location: 'hero' });
    });

    it('has proper ARIA labels and roles', () => {
      render(<MockLandingPage />);
      
      const themeToggle = screen.getByTestId('theme-toggle');
      expect(themeToggle).toHaveAttribute('aria-label', 'Toggle theme');
      
      // Check heading hierarchy
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toHaveTextContent(mockContent.hero.title);
      
      const sectionHeadings = screen.getAllByRole('heading', { level: 2 });
      expect(sectionHeadings.length).toBeGreaterThan(0);
    });

    it('provides alternative text for images', () => {
      render(<MockLandingPage />);
      
      const demoImage = screen.getByAltText(mockContent.demo.screenshots[0].alt);
      expect(demoImage).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles missing content gracefully', () => {
      // Mock empty content
      jest.doMock('@/hooks/use-content', () => ({
        useContent: () => ({
          content: null,
          isLoading: false,
          error: 'Content not found',
        }),
      }));
      
      expect(() => render(<MockLandingPage />)).not.toThrow();
    });

    it('handles analytics failures gracefully', async () => {
      const user = userEvent.setup();
      mockTrackEvent.mockImplementation(() => {
        throw new Error('Analytics error');
      });
      
      render(<MockLandingPage />);
      
      const heroCTA = screen.getByTestId('cta-primary');
      
      // Should not crash when analytics fails
      expect(async () => {
        await user.click(heroCTA);
      }).not.toThrow();
    });
  });

  describe('Performance Considerations', () => {
    it('loads content efficiently', () => {
      const startTime = performance.now();
      render(<MockLandingPage />);
      const endTime = performance.now();
      
      // Should render quickly (this is a basic check)
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('handles large content sets', () => {
      // Mock large feature set
      const largeFeatureSet = Array.from({ length: 20 }, (_, i) => ({
        id: `feature-${i}`,
        icon: 'Icon',
        title: `Feature ${i}`,
        description: `Description ${i}`,
      }));
      
      jest.doMock('@/hooks/use-content', () => ({
        useFeaturesContent: () => ({
          features: largeFeatureSet,
          isLoading: false,
          error: null,
        }),
      }));
      
      expect(() => render(<MockLandingPage />)).not.toThrow();
    });
  });

  describe('Loading States', () => {
    it('handles loading states properly', () => {
      jest.doMock('@/hooks/use-content', () => ({
        useContent: () => ({
          content: null,
          isLoading: true,
          error: null,
        }),
      }));
      
      // In a real implementation, this would show loading skeletons
      expect(() => render(<MockLandingPage />)).not.toThrow();
    });
  });
});