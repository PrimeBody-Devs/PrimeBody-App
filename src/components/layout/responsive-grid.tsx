import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { gridClasses } from '@/lib/responsive';

interface ResponsiveGridProps {
  children: ReactNode;
  variant?: 'cols1' | 'cols2' | 'cols3' | 'cols4' | 'cols6' | 'features' | 'hero' | 'autoFit' | 'autoFill';
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ResponsiveGrid({
  children,
  variant = 'cols2',
  gap = 'md',
  className,
}: ResponsiveGridProps) {
  return (
    <div
      className={cn(
        gridClasses[variant],
        gridClasses.gap[gap],
        className
      )}
    >
      {children}
    </div>
  );
}

// Specialized grids for different sections
export function FeatureGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <ResponsiveGrid
      variant="features"
      gap="lg"
      className={cn('items-stretch', className)}
    >
      {children}
    </ResponsiveGrid>
  );
}

export function HeroGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <ResponsiveGrid
      variant="hero"
      gap="lg"
      className={cn('items-center', className)}
    >
      {children}
    </ResponsiveGrid>
  );
}

export function StatsGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <ResponsiveGrid
      variant="cols3"
      gap="md"
      className={cn('text-center', className)}
    >
      {children}
    </ResponsiveGrid>
  );
}