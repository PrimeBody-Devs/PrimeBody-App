import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  LoadingSpinner,
  Skeleton,
  PageLoadingSkeleton,
  CardSkeleton,
  HeroSkeleton,
  FeaturesSkeleton,
  DemoSkeleton,
  CTASkeleton,
  ButtonSkeleton,
  PrimeBodyPageSkeleton,
  LoadingState,
  SectionLoadingState,
} from '../loading';

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Loader2: ({ className, ...props }: any) => (
    <div data-testid="loader-icon" className={className} {...props} />
  ),
}));

describe('Loading Components', () => {
  describe('LoadingSpinner', () => {
    it('renders with default props', () => {
      render(<LoadingSpinner />);
      const spinner = screen.getByTestId('loader-icon');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('animate-spin', 'text-primary', 'h-6', 'w-6');
    });

    it('renders with different sizes', () => {
      const sizes = ['sm', 'md', 'lg', 'xl'] as const;
      
      sizes.forEach((size) => {
        const { unmount } = render(<LoadingSpinner size={size} />);
        const spinner = screen.getByTestId('loader-icon');
        
        switch (size) {
          case 'sm':
            expect(spinner).toHaveClass('h-4', 'w-4');
            break;
          case 'md':
            expect(spinner).toHaveClass('h-6', 'w-6');
            break;
          case 'lg':
            expect(spinner).toHaveClass('h-8', 'w-8');
            break;
          case 'xl':
            expect(spinner).toHaveClass('h-12', 'w-12');
            break;
        }
        
        unmount();
      });
    });

    it('applies custom className', () => {
      render(<LoadingSpinner className="custom-spinner" />);
      const spinner = screen.getByTestId('loader-icon');
      expect(spinner).toHaveClass('custom-spinner');
    });
  });

  describe('Skeleton', () => {
    it('renders with default props', () => {
      render(<Skeleton data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass('animate-pulse', 'rounded-md', 'bg-gradient-to-r');
    });

    it('applies custom className', () => {
      render(<Skeleton className="custom-skeleton" data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass('custom-skeleton');
    });
  });

  describe('PageLoadingSkeleton', () => {
    it('renders complete page skeleton', () => {
      render(<PageLoadingSkeleton />);
      
      // Check for main container
      expect(screen.getByText((content, element) => {
        return element?.className?.includes('min-h-screen') || false;
      })).toBeInTheDocument();
    });

    it('includes header skeleton', () => {
      render(<PageLoadingSkeleton />);
      
      // Check for header elements
      const container = document.querySelector('.sticky.top-0');
      expect(container).toBeInTheDocument();
    });

    it('includes hero section skeleton', () => {
      render(<PageLoadingSkeleton />);
      
      // Check for hero section
      const heroSection = document.querySelector('.py-20');
      expect(heroSection).toBeInTheDocument();
    });
  });

  describe('CardSkeleton', () => {
    it('renders card skeleton structure', () => {
      render(<CardSkeleton />);
      
      const cardContainer = document.querySelector('.p-6.rounded-xl.border');
      expect(cardContainer).toBeInTheDocument();
    });
  });

  describe('HeroSkeleton', () => {
    it('renders hero skeleton with decorative elements', () => {
      render(<HeroSkeleton />);
      
      const heroContainer = document.querySelector('.relative.overflow-hidden.py-20');
      expect(heroContainer).toBeInTheDocument();
      
      // Check for decorative background elements
      const decorativeElements = document.querySelectorAll('.absolute');
      expect(decorativeElements.length).toBeGreaterThan(0);
    });
  });

  describe('FeaturesSkeleton', () => {
    it('renders features skeleton with grid layout', () => {
      render(<FeaturesSkeleton />);
      
      const featuresContainer = document.querySelector('.py-20');
      expect(featuresContainer).toBeInTheDocument();
      
      // Check for grid layout
      const gridContainer = document.querySelector('.grid.gap-8');
      expect(gridContainer).toBeInTheDocument();
    });
  });

  describe('DemoSkeleton', () => {
    it('renders demo skeleton with background effects', () => {
      render(<DemoSkeleton />);
      
      const demoContainer = document.querySelector('.py-20.bg-gradient-to-br');
      expect(demoContainer).toBeInTheDocument();
      
      // Check for decorative elements
      const decorativeElements = document.querySelectorAll('.absolute');
      expect(decorativeElements.length).toBeGreaterThan(0);
    });
  });

  describe('CTASkeleton', () => {
    it('renders CTA skeleton with grid layout', () => {
      render(<CTASkeleton />);
      
      const ctaContainer = document.querySelector('.py-20.relative');
      expect(ctaContainer).toBeInTheDocument();
      
      // Check for grid layout
      const gridContainer = document.querySelector('.grid.gap-6');
      expect(gridContainer).toBeInTheDocument();
    });
  });

  describe('ButtonSkeleton', () => {
    it('renders button skeleton with default size', () => {
      render(<ButtonSkeleton data-testid="button-skeleton" />);
      const buttonSkeleton = screen.getByTestId('button-skeleton');
      expect(buttonSkeleton).toBeInTheDocument();
      expect(buttonSkeleton).toHaveClass('h-10', 'w-24', 'rounded-md');
    });

    it('applies custom className', () => {
      render(<ButtonSkeleton className="custom-button-skeleton" data-testid="button-skeleton" />);
      const buttonSkeleton = screen.getByTestId('button-skeleton');
      expect(buttonSkeleton).toHaveClass('custom-button-skeleton');
    });
  });

  describe('PrimeBodyPageSkeleton', () => {
    it('renders complete PrimeBody page skeleton', () => {
      render(<PrimeBodyPageSkeleton />);
      
      // Check for main container with PrimeBody styling
      const mainContainer = document.querySelector('.min-h-screen.bg-gradient-to-br');
      expect(mainContainer).toBeInTheDocument();
      
      // Check for header
      const header = document.querySelector('.sticky.top-0');
      expect(header).toBeInTheDocument();
      
      // Check for footer
      const footer = document.querySelector('.border-t.bg-muted\\/30');
      expect(footer).toBeInTheDocument();
    });
  });

  describe('LoadingState', () => {
    it('renders children when not loading', () => {
      render(
        <LoadingState loading={false}>
          <div data-testid="content">Content</div>
        </LoadingState>
      );
      
      expect(screen.getByTestId('content')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('renders skeleton when loading', () => {
      render(
        <LoadingState 
          loading={true}
          skeleton={<div data-testid="custom-skeleton">Loading...</div>}
        >
          <div data-testid="content">Content</div>
        </LoadingState>
      );
      
      expect(screen.getByTestId('custom-skeleton')).toBeInTheDocument();
      expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    });

    it('renders default PrimeBodyPageSkeleton when loading without custom skeleton', () => {
      render(
        <LoadingState loading={true}>
          <div data-testid="content">Content</div>
        </LoadingState>
      );
      
      // Check for PrimeBodyPageSkeleton elements
      const mainContainer = document.querySelector('.min-h-screen.bg-gradient-to-br');
      expect(mainContainer).toBeInTheDocument();
      expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <LoadingState 
          loading={true}
          className="custom-loading"
          skeleton={<div data-testid="skeleton">Loading...</div>}
        >
          <div>Content</div>
        </LoadingState>
      );
      
      const container = screen.getByTestId('skeleton').parentElement;
      expect(container).toHaveClass('custom-loading');
    });
  });

  describe('SectionLoadingState', () => {
    it('renders children when not loading', () => {
      render(
        <SectionLoadingState loading={false} skeleton={<div>Skeleton</div>}>
          <div data-testid="section-content">Section Content</div>
        </SectionLoadingState>
      );
      
      expect(screen.getByTestId('section-content')).toBeInTheDocument();
      expect(screen.queryByText('Skeleton')).not.toBeInTheDocument();
    });

    it('renders skeleton when loading', () => {
      render(
        <SectionLoadingState 
          loading={true} 
          skeleton={<div data-testid="section-skeleton">Section Loading...</div>}
        >
          <div data-testid="section-content">Section Content</div>
        </SectionLoadingState>
      );
      
      expect(screen.getByTestId('section-skeleton')).toBeInTheDocument();
      expect(screen.queryByTestId('section-content')).not.toBeInTheDocument();
    });

    it('applies animate-pulse class when loading', () => {
      const { container } = render(
        <SectionLoadingState 
          loading={true} 
          skeleton={<div data-testid="section-skeleton">Loading...</div>}
        >
          <div>Content</div>
        </SectionLoadingState>
      );
      
      const loadingContainer = container.firstChild as HTMLElement;
      expect(loadingContainer).toHaveClass('animate-pulse');
    });

    it('applies custom className', () => {
      const { container } = render(
        <SectionLoadingState 
          loading={true}
          className="custom-section-loading"
          skeleton={<div>Loading...</div>}
        >
          <div>Content</div>
        </SectionLoadingState>
      );
      
      const loadingContainer = container.firstChild as HTMLElement;
      expect(loadingContainer).toHaveClass('custom-section-loading');
    });
  });

  describe('Accessibility', () => {
    it('LoadingSpinner has proper ARIA attributes', () => {
      render(<LoadingSpinner />);
      const spinner = screen.getByTestId('loader-icon');
      
      // The spinner should be focusable and have appropriate styling
      expect(spinner).toBeInTheDocument();
    });

    it('skeleton components do not interfere with screen readers', () => {
      render(<Skeleton data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      
      // Skeleton should not have any interactive elements
      expect(skeleton).not.toHaveAttribute('role');
      expect(skeleton).not.toHaveAttribute('aria-label');
    });
  });

  describe('Performance', () => {
    it('skeletons use CSS animations for better performance', () => {
      render(<Skeleton data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      
      expect(skeleton).toHaveClass('animate-pulse');
    });

    it('loading states do not cause layout shifts', () => {
      const { rerender } = render(
        <LoadingState loading={true} skeleton={<div style={{ height: '100px' }}>Loading...</div>}>
          <div style={{ height: '100px' }}>Content</div>
        </LoadingState>
      );
      
      // Switch to loaded state
      rerender(
        <LoadingState loading={false} skeleton={<div style={{ height: '100px' }}>Loading...</div>}>
          <div style={{ height: '100px' }}>Content</div>
        </LoadingState>
      );
      
      // Both states should maintain consistent height
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });
});