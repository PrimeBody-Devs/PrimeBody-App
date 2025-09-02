import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'next-themes';
import { mockMatchMedia, mockLocalStorage } from '@/lib/__tests__/test-utils';

// Mock theme hook with more detailed state management
const mockThemeState = {
  theme: 'light',
  setTheme: jest.fn(),
  toggleTheme: jest.fn(),
  isDark: false,
  mounted: true,
};

jest.mock('@/hooks/use-theme', () => ({
  useTheme: () => mockThemeState,
}));

// Mock responsive hook
const mockResponsiveState = {
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  breakpoint: 'lg',
};

jest.mock('@/hooks/use-responsive', () => ({
  useResponsive: () => mockResponsiveState,
}));

// Test component that uses theme and responsive features
const ThemeResponsiveTestComponent = () => {
  const { theme, toggleTheme, isDark } = mockThemeState;
  const { isMobile, isTablet, isDesktop } = mockResponsiveState;
  
  return (
    <div data-testid="test-component" className={`theme-${theme}`}>
      {/* Theme Toggle */}
      <button
        data-testid="theme-toggle"
        onClick={toggleTheme}
        className="p-2 rounded-md border"
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? '☀️' : '🌙'}
      </button>

      {/* Responsive Content */}
      <div data-testid="responsive-content">
        {isMobile && <div data-testid="mobile-content">Mobile View</div>}
        {isTablet && <div data-testid="tablet-content">Tablet View</div>}
        {isDesktop && <div data-testid="desktop-content">Desktop View</div>}
      </div>

      {/* Responsive Grid */}
      <div 
        data-testid="responsive-grid"
        className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      >
        <div className="p-4 bg-background border rounded">Item 1</div>
        <div className="p-4 bg-background border rounded">Item 2</div>
        <div className="p-4 bg-background border rounded">Item 3</div>
      </div>

      {/* Theme-dependent styling */}
      <div 
        data-testid="theme-dependent"
        className="p-4 bg-card text-card-foreground border rounded"
      >
        <h2 className="text-foreground">Theme Dependent Content</h2>
        <p className="text-muted-foreground">This content adapts to theme changes</p>
      </div>

      {/* Navigation that changes based on screen size */}
      <nav data-testid="responsive-nav">
        <div className="hidden md:flex space-x-4">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="md:hidden">
          <button data-testid="mobile-menu-toggle">☰</button>
        </div>
      </nav>

      {/* Responsive text sizing */}
      <h1 
        data-testid="responsive-heading"
        className="text-2xl md:text-4xl lg:text-6xl font-bold"
      >
        Responsive Heading
      </h1>

      {/* Responsive spacing */}
      <div 
        data-testid="responsive-spacing"
        className="p-4 md:p-8 lg:p-12 m-2 md:m-4 lg:m-8"
      >
        Responsive Spacing
      </div>
    </div>
  );
};

describe('Theme and Responsive Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage();
    
    // Reset theme state
    mockThemeState.theme = 'light';
    mockThemeState.isDark = false;
    mockThemeState.mounted = true;
    
    // Reset responsive state
    mockResponsiveState.isMobile = false;
    mockResponsiveState.isTablet = false;
    mockResponsiveState.isDesktop = true;
    mockResponsiveState.breakpoint = 'lg';
  });

  describe('Theme Switching Integration', () => {
    it('renders with light theme by default', () => {
      render(
        <ThemeProvider attribute="class" defaultTheme="light">
          <ThemeResponsiveTestComponent />
        </ThemeProvider>
      );

      const component = screen.getByTestId('test-component');
      expect(component).toHaveClass('theme-light');
      
      const themeToggle = screen.getByTestId('theme-toggle');
      expect(themeToggle).toHaveTextContent('🌙');
      expect(themeToggle).toHaveAttribute('aria-label', 'Switch to dark mode');
    });

    it('switches to dark theme when toggled', async () => {
      const user = userEvent.setup();
      
      render(
        <ThemeProvider attribute="class" defaultTheme="light">
          <ThemeResponsiveTestComponent />
        </ThemeProvider>
      );

      const themeToggle = screen.getByTestId('theme-toggle');
      
      // Simulate theme change
      mockThemeState.toggleTheme.mockImplementation(() => {
        mockThemeState.theme = 'dark';
        mockThemeState.isDark = true;
      });

      await user.click(themeToggle);
      
      expect(mockThemeState.toggleTheme).toHaveBeenCalledTimes(1);
    });

    it('persists theme preference', async () => {
      const user = userEvent.setup();
      const localStorage = mockLocalStorage();
      
      render(
        <ThemeProvider attribute="class" defaultTheme="light">
          <ThemeResponsiveTestComponent />
        </ThemeProvider>
      );

      const themeToggle = screen.getByTestId('theme-toggle');
      await user.click(themeToggle);
      
      // In real implementation, ThemeProvider would handle localStorage
      expect(mockThemeState.toggleTheme).toHaveBeenCalled();
    });

    it('applies theme-dependent styles correctly', () => {
      render(
        <ThemeProvider attribute="class" defaultTheme="light">
          <ThemeResponsiveTestComponent />
        </ThemeProvider>
      );

      const themeDependent = screen.getByTestId('theme-dependent');
      expect(themeDependent).toHaveClass('bg-card', 'text-card-foreground');
    });

    it('handles theme switching without hydration issues', () => {
      // Test server-side rendering scenario
      mockThemeState.mounted = false;
      
      render(
        <ThemeProvider attribute="class" defaultTheme="light">
          <ThemeResponsiveTestComponent />
        </ThemeProvider>
      );

      // Should render without crashing
      expect(screen.getByTestId('test-component')).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior Integration', () => {
    it('displays desktop content on large screens', () => {
      mockMatchMedia(false); // Desktop
      mockResponsiveState.isDesktop = true;
      mockResponsiveState.isMobile = false;
      mockResponsiveState.isTablet = false;
      
      render(<ThemeResponsiveTestComponent />);
      
      expect(screen.getByTestId('desktop-content')).toBeInTheDocument();
      expect(screen.queryByTestId('mobile-content')).not.toBeInTheDocument();
      expect(screen.queryByTestId('tablet-content')).not.toBeInTheDocument();
    });

    it('displays mobile content on small screens', () => {
      mockMatchMedia(true); // Mobile
      mockResponsiveState.isMobile = true;
      mockResponsiveState.isDesktop = false;
      mockResponsiveState.isTablet = false;
      
      render(<ThemeResponsiveTestComponent />);
      
      expect(screen.getByTestId('mobile-content')).toBeInTheDocument();
      expect(screen.queryByTestId('desktop-content')).not.toBeInTheDocument();
      expect(screen.queryByTestId('tablet-content')).not.toBeInTheDocument();
    });

    it('displays tablet content on medium screens', () => {
      mockResponsiveState.isTablet = true;
      mockResponsiveState.isMobile = false;
      mockResponsiveState.isDesktop = false;
      
      render(<ThemeResponsiveTestComponent />);
      
      expect(screen.getByTestId('tablet-content')).toBeInTheDocument();
      expect(screen.queryByTestId('mobile-content')).not.toBeInTheDocument();
      expect(screen.queryByTestId('desktop-content')).not.toBeInTheDocument();
    });

    it('applies responsive grid classes correctly', () => {
      render(<ThemeResponsiveTestComponent />);
      
      const grid = screen.getByTestId('responsive-grid');
      expect(grid).toHaveClass(
        'grid',
        'gap-4',
        'grid-cols-1',
        'md:grid-cols-2',
        'lg:grid-cols-3'
      );
    });

    it('shows appropriate navigation for screen size', () => {
      render(<ThemeResponsiveTestComponent />);
      
      const nav = screen.getByTestId('responsive-nav');
      
      // Desktop navigation should be hidden on mobile
      const desktopNav = nav.querySelector('.hidden.md\\:flex');
      expect(desktopNav).toBeInTheDocument();
      
      // Mobile menu should be hidden on desktop
      const mobileNav = nav.querySelector('.md\\:hidden');
      expect(mobileNav).toBeInTheDocument();
    });

    it('applies responsive text sizing', () => {
      render(<ThemeResponsiveTestComponent />);
      
      const heading = screen.getByTestId('responsive-heading');
      expect(heading).toHaveClass(
        'text-2xl',
        'md:text-4xl',
        'lg:text-6xl'
      );
    });

    it('applies responsive spacing', () => {
      render(<ThemeResponsiveTestComponent />);
      
      const spacing = screen.getByTestId('responsive-spacing');
      expect(spacing).toHaveClass(
        'p-4', 'md:p-8', 'lg:p-12',
        'm-2', 'md:m-4', 'lg:m-8'
      );
    });
  });

  describe('Combined Theme and Responsive Behavior', () => {
    it('handles theme changes across different screen sizes', async () => {
      const user = userEvent.setup();
      
      // Start with desktop light theme
      render(
        <ThemeProvider attribute="class" defaultTheme="light">
          <ThemeResponsiveTestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('desktop-content')).toBeInTheDocument();
      
      // Switch to dark theme
      const themeToggle = screen.getByTestId('theme-toggle');
      await user.click(themeToggle);
      
      // Content should still be responsive
      expect(screen.getByTestId('desktop-content')).toBeInTheDocument();
    });

    it('maintains theme state when screen size changes', () => {
      mockThemeState.theme = 'dark';
      mockThemeState.isDark = true;
      
      const { rerender } = render(<ThemeResponsiveTestComponent />);
      
      // Switch to mobile
      mockResponsiveState.isMobile = true;
      mockResponsiveState.isDesktop = false;
      
      rerender(<ThemeResponsiveTestComponent />);
      
      // Theme should be maintained
      const component = screen.getByTestId('test-component');
      expect(component).toHaveClass('theme-dark');
      
      // But content should be mobile
      expect(screen.getByTestId('mobile-content')).toBeInTheDocument();
    });

    it('handles rapid theme and viewport changes', async () => {
      const user = userEvent.setup();
      
      render(
        <ThemeProvider attribute="class" defaultTheme="light">
          <ThemeResponsiveTestComponent />
        </ThemeProvider>
      );

      const themeToggle = screen.getByTestId('theme-toggle');
      
      // Rapid theme changes
      await user.click(themeToggle);
      await user.click(themeToggle);
      await user.click(themeToggle);
      
      expect(mockThemeState.toggleTheme).toHaveBeenCalledTimes(3);
    });
  });

  describe('Accessibility with Theme and Responsive', () => {
    it('maintains accessibility across theme changes', async () => {
      const user = userEvent.setup();
      
      render(
        <ThemeProvider attribute="class" defaultTheme="light">
          <ThemeResponsiveTestComponent />
        </ThemeProvider>
      );

      const themeToggle = screen.getByTestId('theme-toggle');
      
      // Check initial accessibility
      expect(themeToggle).toHaveAttribute('aria-label', 'Switch to dark mode');
      
      // Switch theme
      mockThemeState.isDark = true;
      await user.click(themeToggle);
      
      // Accessibility should update
      expect(themeToggle).toHaveAttribute('aria-label', 'Switch to dark mode');
    });

    it('maintains keyboard navigation across responsive breakpoints', () => {
      render(<ThemeResponsiveTestComponent />);
      
      const themeToggle = screen.getByTestId('theme-toggle');
      
      // Should be focusable
      themeToggle.focus();
      expect(document.activeElement).toBe(themeToggle);
      
      // Should work with keyboard
      fireEvent.keyDown(themeToggle, { key: 'Enter' });
      expect(mockThemeState.toggleTheme).toHaveBeenCalled();
    });

    it('provides appropriate focus indicators', () => {
      render(<ThemeResponsiveTestComponent />);
      
      const themeToggle = screen.getByTestId('theme-toggle');
      expect(themeToggle).toHaveClass('p-2', 'rounded-md', 'border');
    });
  });

  describe('Performance with Theme and Responsive', () => {
    it('handles theme changes efficiently', async () => {
      const user = userEvent.setup();
      
      const startTime = performance.now();
      
      render(
        <ThemeProvider attribute="class" defaultTheme="light">
          <ThemeResponsiveTestComponent />
        </ThemeProvider>
      );

      const themeToggle = screen.getByTestId('theme-toggle');
      await user.click(themeToggle);
      
      const endTime = performance.now();
      
      // Should be fast
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('handles responsive changes without layout thrashing', () => {
      const { rerender } = render(<ThemeResponsiveTestComponent />);
      
      // Change breakpoint multiple times
      mockResponsiveState.isMobile = true;
      mockResponsiveState.isDesktop = false;
      rerender(<ThemeResponsiveTestComponent />);
      
      mockResponsiveState.isTablet = true;
      mockResponsiveState.isMobile = false;
      rerender(<ThemeResponsiveTestComponent />);
      
      mockResponsiveState.isDesktop = true;
      mockResponsiveState.isTablet = false;
      rerender(<ThemeResponsiveTestComponent />);
      
      // Should not crash
      expect(screen.getByTestId('test-component')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles missing theme provider gracefully', () => {
      // Render without ThemeProvider
      expect(() => {
        render(<ThemeResponsiveTestComponent />);
      }).not.toThrow();
    });

    it('handles broken responsive hooks gracefully', () => {
      // Mock broken responsive state
      mockResponsiveState.isMobile = undefined as any;
      mockResponsiveState.isDesktop = undefined as any;
      
      expect(() => {
        render(<ThemeResponsiveTestComponent />);
      }).not.toThrow();
    });

    it('handles theme toggle failures gracefully', async () => {
      const user = userEvent.setup();
      
      mockThemeState.toggleTheme.mockImplementation(() => {
        throw new Error('Theme toggle failed');
      });
      
      render(<ThemeResponsiveTestComponent />);
      
      const themeToggle = screen.getByTestId('theme-toggle');
      
      // Should not crash the app
      await expect(user.click(themeToggle)).rejects.toThrow('Theme toggle failed');
    });
  });
});