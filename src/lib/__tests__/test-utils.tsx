import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';

// Mock providers for testing
const MockThemeProvider = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
    {children}
  </ThemeProvider>
);

// Custom render function that includes providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <MockThemeProvider>{children}</MockThemeProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Test utilities for PrimeBody components
export const createMockContent = () => ({
  hero: {
    title: 'Test Hero Title',
    subtitle: 'Test Hero Subtitle',
    ctaText: 'Test CTA',
    backgroundImage: '/test-bg.jpg',
  },
  features: [
    {
      id: 'test-feature-1',
      icon: 'TestIcon',
      title: 'Test Feature 1',
      description: 'Test feature description',
      highlight: 'Test highlight',
    },
    {
      id: 'test-feature-2',
      icon: 'TestIcon2',
      title: 'Test Feature 2',
      description: 'Test feature description 2',
    },
  ],
  demo: {
    title: 'Test Demo Title',
    description: 'Test demo description',
    screenshots: [
      {
        id: 'test-screenshot-1',
        url: '/test-screenshot.jpg',
        alt: 'Test screenshot',
        title: 'Test Screenshot Title',
      },
    ],
    videoUrl: '/test-video.mp4',
  },
  cta: {
    title: 'Test CTA Title',
    description: 'Test CTA description',
    primaryText: 'Primary CTA',
    secondaryText: 'Secondary CTA',
    urgency: {
      enabled: true,
      message: 'Test urgency message',
    },
  },
  footer: {
    links: [
      {
        category: 'Test Category',
        items: [
          { label: 'Test Link', href: '/test' },
        ],
      },
    ],
    socialLinks: [
      {
        platform: 'twitter' as const,
        url: 'https://twitter.com/test',
        label: 'Test Twitter',
      },
    ],
    copyright: 'Test Copyright',
    newsletter: {
      enabled: true,
      title: 'Test Newsletter',
      description: 'Test newsletter description',
      placeholder: 'Test placeholder',
      buttonText: 'Test Subscribe',
    },
  },
});

// Mock environment config
export const createMockEnvironmentConfig = () => ({
  app: {
    name: 'Test App',
    version: '1.0.0',
    environment: 'test' as const,
    baseUrl: 'http://localhost:3000',
    supportEmail: 'test@example.com',
  },
  web3: {
    chainId: 1,
    rpcUrl: 'http://localhost:8545',
    contractAddress: '0x123',
    tokenSymbol: 'TEST',
    explorerUrl: 'http://localhost:3000',
  },
  analytics: {
    googleAnalyticsId: 'GA-TEST',
    mixpanelToken: 'test-token',
    hotjarId: 'test-hotjar',
    enabled: false,
  },
  api: {
    baseUrl: 'http://localhost:3001',
    timeout: 5000,
    retryAttempts: 3,
  },
  features: {
    enableWeb3Integration: true,
    enableAnalytics: false,
    enableNewsletter: true,
    enableDemoVideo: true,
    enableUrgencyMessages: true,
    enableDarkMode: true,
  },
});

// Mock analytics event
export const createMockAnalyticsEvent = () => ({
  event: 'test_event',
  properties: {
    section: 'test_section',
    action: 'test_action',
    value: 'test_value',
    timestamp: Date.now(),
  },
});

// Helper to wait for animations
export const waitForAnimation = () => 
  new Promise(resolve => setTimeout(resolve, 100));

// Helper to mock intersection observer
export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver;
};

// Helper to mock resize observer
export const mockResizeObserver = () => {
  const mockResizeObserver = jest.fn();
  mockResizeObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.ResizeObserver = mockResizeObserver;
};

// Helper to mock matchMedia
export const mockMatchMedia = (matches: boolean = false) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

// Helper to mock localStorage
export const mockLocalStorage = () => {
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });
  return localStorageMock;
};

// Helper to create mock refs
export const createMockRef = <T = HTMLElement>() => ({
  current: null as T | null,
});

// Helper to simulate user interactions
export const simulateHover = (element: Element) => {
  element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
};

export const simulateUnhover = (element: Element) => {
  element.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
};

export const simulateFocus = (element: Element) => {
  element.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
};

export const simulateBlur = (element: Element) => {
  element.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
};

// Helper to test responsive behavior
export const testResponsiveClasses = (
  element: Element,
  breakpoints: Record<string, string[]>
) => {
  Object.entries(breakpoints).forEach(([breakpoint, classes]) => {
    classes.forEach(className => {
      if (breakpoint === 'base') {
        expect(element).toHaveClass(className);
      } else {
        expect(element).toHaveClass(`${breakpoint}:${className}`);
      }
    });
  });
};

// Helper to test animation classes
export const testAnimationClasses = (element: Element, animations: string[]) => {
  animations.forEach(animation => {
    expect(element).toHaveClass(animation);
  });
};

// Helper to test accessibility attributes
export const testAccessibilityAttributes = (
  element: Element,
  attributes: Record<string, string>
) => {
  Object.entries(attributes).forEach(([attr, value]) => {
    expect(element).toHaveAttribute(attr, value);
  });
};

// Helper to create mock component props
export const createMockButtonProps = () => ({
  variant: 'default' as const,
  size: 'md' as const,
  loading: false,
  disabled: false,
  onClick: jest.fn(),
});

export const createMockCardProps = () => ({
  variant: 'default' as const,
  padding: 'md' as const,
  hover: 'none' as const,
});

export const createMockModalProps = () => ({
  isOpen: false,
  onClose: jest.fn(),
  size: 'md' as const,
});

// Helper to test error boundaries
export const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

// Helper to suppress console errors in tests
export const suppressConsoleError = () => {
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });
};

// Helper to test component snapshots
export const expectComponentSnapshot = (component: ReactElement) => {
  const { container } = render(component);
  expect(container.firstChild).toMatchSnapshot();
};

export default {
  createMockContent,
  createMockEnvironmentConfig,
  createMockAnalyticsEvent,
  waitForAnimation,
  mockIntersectionObserver,
  mockResizeObserver,
  mockMatchMedia,
  mockLocalStorage,
  createMockRef,
  simulateHover,
  simulateUnhover,
  simulateFocus,
  simulateBlur,
  testResponsiveClasses,
  testAnimationClasses,
  testAccessibilityAttributes,
  createMockButtonProps,
  createMockCardProps,
  createMockModalProps,
  ThrowError,
  suppressConsoleError,
  expectComponentSnapshot,
};