import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { containerClasses } from '@/lib/responsive';

interface ResponsiveContainerProps {
  children: ReactNode;
  variant?: 'default' | 'wide' | 'narrow' | 'full' | 'responsive';
  className?: string;
  as?: 'div' | 'section' | 'article' | 'main' | 'header' | 'footer';
}

export function ResponsiveContainer({
  children,
  variant = 'default',
  className,
  as: Component = 'div',
}: ResponsiveContainerProps) {
  return (
    <Component
      className={cn(
        containerClasses[variant],
        className
      )}
    >
      {children}
    </Component>
  );
}

// Specialized containers for different sections
export function HeroContainer({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <ResponsiveContainer
      variant="responsive"
      className={cn('py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32', className)}
    >
      {children}
    </ResponsiveContainer>
  );
}

export function SectionContainer({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <ResponsiveContainer
      variant="default"
      className={cn('py-8 sm:py-12 md:py-16 lg:py-20', className)}
      as="section"
    >
      {children}
    </ResponsiveContainer>
  );
}

export function ContentContainer({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <ResponsiveContainer
      variant="narrow"
      className={cn('py-6 sm:py-8 md:py-12', className)}
    >
      {children}
    </ResponsiveContainer>
  );
}