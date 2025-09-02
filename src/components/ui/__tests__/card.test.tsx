import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../card';

describe('Card Components', () => {
  describe('Card', () => {
    it('renders with default props', () => {
      render(<Card data-testid="card">Card Content</Card>);
      const card = screen.getByTestId('card');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass('rounded-xl', 'border', 'bg-card');
    });

    it('renders children correctly', () => {
      render(<Card>Test Card Content</Card>);
      expect(screen.getByText('Test Card Content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<Card className="custom-class" data-testid="card">Card</Card>);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('custom-class');
    });

    describe('Variants', () => {
      it('renders default variant correctly', () => {
        render(<Card variant="default" data-testid="card">Default Card</Card>);
        const card = screen.getByTestId('card');
        expect(card).toHaveClass('border-border');
      });

      it('renders feature variant correctly', () => {
        render(<Card variant="feature" data-testid="card">Feature Card</Card>);
        const card = screen.getByTestId('card');
        expect(card).toHaveClass('border-border', 'hover:border-primary/20', 'hover:shadow-lg');
      });

      it('renders demo variant correctly', () => {
        render(<Card variant="demo" data-testid="card">Demo Card</Card>);
        const card = screen.getByTestId('card');
        expect(card).toHaveClass('border-border', 'bg-gradient-to-br');
      });

      it('renders glass variant correctly', () => {
        render(<Card variant="glass" data-testid="card">Glass Card</Card>);
        const card = screen.getByTestId('card');
        expect(card).toHaveClass('border-white/20', 'bg-white/10', 'backdrop-blur-md');
      });

      it('renders elevated variant correctly', () => {
        render(<Card variant="elevated" data-testid="card">Elevated Card</Card>);
        const card = screen.getByTestId('card');
        expect(card).toHaveClass('border-border', 'shadow-lg', 'hover:shadow-xl');
      });
    });

    describe('Padding', () => {
      it('renders with no padding', () => {
        render(<Card padding="none" data-testid="card">No Padding</Card>);
        const card = screen.getByTestId('card');
        expect(card).not.toHaveClass('p-4', 'p-6', 'p-8', 'p-10');
      });

      it('renders with small padding', () => {
        render(<Card padding="sm" data-testid="card">Small Padding</Card>);
        const card = screen.getByTestId('card');
        expect(card).toHaveClass('p-4');
      });

      it('renders with medium padding (default)', () => {
        render(<Card padding="md" data-testid="card">Medium Padding</Card>);
        const card = screen.getByTestId('card');
        expect(card).toHaveClass('p-6');
      });

      it('renders with large padding', () => {
        render(<Card padding="lg" data-testid="card">Large Padding</Card>);
        const card = screen.getByTestId('card');
        expect(card).toHaveClass('p-8');
      });

      it('renders with extra large padding', () => {
        render(<Card padding="xl" data-testid="card">XL Padding</Card>);
        const card = screen.getByTestId('card');
        expect(card).toHaveClass('p-10');
      });
    });

    describe('Hover Effects', () => {
      it('renders with no hover effect', () => {
        render(<Card hover="none" data-testid="card">No Hover</Card>);
        const card = screen.getByTestId('card');
        expect(card).not.toHaveClass('hover:-translate-y-1', 'hover:scale-[1.02]');
      });

      it('renders with lift hover effect', () => {
        render(<Card hover="lift" data-testid="card">Lift Hover</Card>);
        const card = screen.getByTestId('card');
        expect(card).toHaveClass('hover:-translate-y-1');
      });

      it('renders with scale hover effect', () => {
        render(<Card hover="scale" data-testid="card">Scale Hover</Card>);
        const card = screen.getByTestId('card');
        expect(card).toHaveClass('hover:scale-[1.02]');
      });

      it('renders with glow hover effect', () => {
        render(<Card hover="glow" data-testid="card">Glow Hover</Card>);
        const card = screen.getByTestId('card');
        expect(card).toHaveClass('hover:shadow-lg', 'hover:shadow-primary/10');
      });
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Card ref={ref}>Ref Card</Card>);
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current?.textContent).toBe('Ref Card');
    });
  });

  describe('CardHeader', () => {
    it('renders correctly', () => {
      render(<CardHeader data-testid="card-header">Header Content</CardHeader>);
      const header = screen.getByTestId('card-header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5');
      expect(screen.getByText('Header Content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<CardHeader className="custom-header" data-testid="card-header">Header</CardHeader>);
      const header = screen.getByTestId('card-header');
      expect(header).toHaveClass('custom-header');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<CardHeader ref={ref}>Header</CardHeader>);
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('CardTitle', () => {
    it('renders correctly', () => {
      render(<CardTitle data-testid="card-title">Card Title</CardTitle>);
      const title = screen.getByTestId('card-title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass('font-semibold', 'leading-none', 'tracking-tight');
      expect(screen.getByText('Card Title')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<CardTitle className="custom-title" data-testid="card-title">Title</CardTitle>);
      const title = screen.getByTestId('card-title');
      expect(title).toHaveClass('custom-title');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<CardTitle ref={ref}>Title</CardTitle>);
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('CardDescription', () => {
    it('renders correctly', () => {
      render(<CardDescription data-testid="card-description">Card Description</CardDescription>);
      const description = screen.getByTestId('card-description');
      expect(description).toBeInTheDocument();
      expect(description).toHaveClass('text-sm', 'text-muted-foreground');
      expect(screen.getByText('Card Description')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<CardDescription className="custom-desc" data-testid="card-description">Description</CardDescription>);
      const description = screen.getByTestId('card-description');
      expect(description).toHaveClass('custom-desc');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<CardDescription ref={ref}>Description</CardDescription>);
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('CardContent', () => {
    it('renders correctly', () => {
      render(<CardContent data-testid="card-content">Card Content</CardContent>);
      const content = screen.getByTestId('card-content');
      expect(content).toBeInTheDocument();
      expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<CardContent className="custom-content" data-testid="card-content">Content</CardContent>);
      const content = screen.getByTestId('card-content');
      expect(content).toHaveClass('custom-content');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<CardContent ref={ref}>Content</CardContent>);
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('CardFooter', () => {
    it('renders correctly', () => {
      render(<CardFooter data-testid="card-footer">Footer Content</CardFooter>);
      const footer = screen.getByTestId('card-footer');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass('flex', 'items-center');
      expect(screen.getByText('Footer Content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<CardFooter className="custom-footer" data-testid="card-footer">Footer</CardFooter>);
      const footer = screen.getByTestId('card-footer');
      expect(footer).toHaveClass('custom-footer');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<CardFooter ref={ref}>Footer</CardFooter>);
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Complete Card Structure', () => {
    it('renders a complete card with all components', () => {
      render(
        <Card data-testid="complete-card">
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
            <CardDescription>Test Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Test content goes here</p>
          </CardContent>
          <CardFooter>
            <button>Action Button</button>
          </CardFooter>
        </Card>
      );

      expect(screen.getByTestId('complete-card')).toBeInTheDocument();
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('Test content goes here')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument();
    });
  });
});