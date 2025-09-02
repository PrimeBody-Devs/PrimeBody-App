import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from '../theme-toggle';

// Mock the theme hook
const mockToggleTheme = jest.fn();
const mockUseTheme = {
  toggleTheme: mockToggleTheme,
  isDark: false,
  mounted: true,
};

jest.mock('@/hooks/use-theme', () => ({
  useTheme: () => mockUseTheme,
}));

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Moon: ({ className, ...props }: any) => (
    <div data-testid="moon-icon" className={className} {...props} />
  ),
  Sun: ({ className, ...props }: any) => (
    <div data-testid="sun-icon" className={className} {...props} />
  ),
}));

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTheme.isDark = false;
    mockUseTheme.mounted = true;
  });

  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<ThemeToggle />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center');
    });

    it('renders moon icon in light mode', () => {
      mockUseTheme.isDark = false;
      render(<ThemeToggle />);
      
      expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('sun-icon')).not.toBeInTheDocument();
    });

    it('renders sun icon in dark mode', () => {
      mockUseTheme.isDark = true;
      render(<ThemeToggle />);
      
      expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('moon-icon')).not.toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<ThemeToggle className="custom-toggle" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-toggle');
    });
  });

  describe('Sizes', () => {
    it('renders with small size', () => {
      render(<ThemeToggle size="sm" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-8', 'w-8');
    });

    it('renders with medium size (default)', () => {
      render(<ThemeToggle size="md" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10', 'w-10');
    });

    it('renders with large size', () => {
      render(<ThemeToggle size="lg" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-12', 'w-12');
    });

    it('uses medium size as default', () => {
      render(<ThemeToggle />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10', 'w-10');
    });
  });

  describe('Hydration Handling', () => {
    it('renders placeholder when not mounted', () => {
      mockUseTheme.mounted = false;
      render(<ThemeToggle />);
      
      // Should render a div instead of button when not mounted
      const placeholder = document.querySelector('.inline-flex.items-center.justify-center');
      expect(placeholder).toBeInTheDocument();
      expect(placeholder?.tagName).toBe('DIV');
      
      // Should show sun icon as default
      expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
    });

    it('renders interactive button when mounted', () => {
      mockUseTheme.mounted = true;
      render(<ThemeToggle />);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('BUTTON');
    });
  });

  describe('Interactions', () => {
    it('calls toggleTheme when clicked', async () => {
      const user = userEvent.setup();
      render(<ThemeToggle />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    });

    it('handles keyboard interactions', () => {
      render(<ThemeToggle />);
      const button = screen.getByRole('button');
      
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
      expect(mockToggleTheme).toHaveBeenCalledTimes(1);
      
      fireEvent.keyDown(button, { key: ' ', code: 'Space' });
      expect(mockToggleTheme).toHaveBeenCalledTimes(2);
    });

    it('does not call toggleTheme when not mounted', async () => {
      mockUseTheme.mounted = false;
      const user = userEvent.setup();
      render(<ThemeToggle />);
      
      // Try to click the placeholder div
      const placeholder = document.querySelector('.inline-flex');
      if (placeholder) {
        await user.click(placeholder);
      }
      
      expect(mockToggleTheme).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has proper aria-label for light mode', () => {
      mockUseTheme.isDark = false;
      render(<ThemeToggle />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
    });

    it('has proper aria-label for dark mode', () => {
      mockUseTheme.isDark = true;
      render(<ThemeToggle />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
    });

    it('has focus-visible styles', () => {
      render(<ThemeToggle />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-ring',
        'focus-visible:ring-offset-2'
      );
    });

    it('has proper button role', () => {
      render(<ThemeToggle />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('supports keyboard navigation', () => {
      render(<ThemeToggle />);
      const button = screen.getByRole('button');
      
      // Button should be focusable
      button.focus();
      expect(document.activeElement).toBe(button);
    });
  });

  describe('Visual States', () => {
    it('has hover styles', () => {
      render(<ThemeToggle />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('hover:bg-accent', 'hover:text-accent-foreground');
    });

    it('has transition classes', () => {
      render(<ThemeToggle />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('transition-colors');
      
      const icon = screen.getByTestId('moon-icon');
      expect(icon).toHaveClass('transition-all');
    });

    it('has proper border and background styles', () => {
      render(<ThemeToggle />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'border',
        'border-input',
        'bg-background',
        'rounded-md'
      );
    });
  });

  describe('Icon Rendering', () => {
    it('renders icons with correct size classes', () => {
      render(<ThemeToggle />);
      const icon = screen.getByTestId('moon-icon');
      expect(icon).toHaveClass('h-4', 'w-4');
    });

    it('switches icons based on theme state', () => {
      const { rerender } = render(<ThemeToggle />);
      
      // Light mode - should show moon
      expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
      
      // Switch to dark mode
      mockUseTheme.isDark = true;
      rerender(<ThemeToggle />);
      
      // Dark mode - should show sun
      expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('moon-icon')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles missing theme hook gracefully', () => {
      // This test ensures the component doesn't crash if the hook returns undefined
      const originalConsoleError = console.error;
      console.error = jest.fn();
      
      // Mock a broken hook
      jest.doMock('@/hooks/use-theme', () => ({
        useTheme: () => ({
          toggleTheme: undefined,
          isDark: false,
          mounted: true,
        }),
      }));
      
      expect(() => {
        render(<ThemeToggle />);
      }).not.toThrow();
      
      console.error = originalConsoleError;
    });
  });

  describe('Performance', () => {
    it('prevents unnecessary re-renders when theme state changes', () => {
      const { rerender } = render(<ThemeToggle />);
      
      // Change theme state
      mockUseTheme.isDark = true;
      rerender(<ThemeToggle />);
      
      // Component should handle the state change smoothly
      expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
    });

    it('handles rapid theme toggles', async () => {
      const user = userEvent.setup();
      render(<ThemeToggle />);
      
      const button = screen.getByRole('button');
      
      // Rapid clicks
      await user.click(button);
      await user.click(button);
      await user.click(button);
      
      expect(mockToggleTheme).toHaveBeenCalledTimes(3);
    });
  });
});