import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { responsiveTypography } from '@/lib/responsive';

interface ResponsiveTextProps {
  children: ReactNode;
  variant?: keyof typeof responsiveTypography;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
}

export function ResponsiveText({
  children,
  variant = 'body',
  className,
  as: Component = 'p',
}: ResponsiveTextProps) {
  return (
    <Component
      className={cn(
        responsiveTypography[variant],
        className
      )}
    >
      {children}
    </Component>
  );
}

// Specialized text components
export function HeroTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <ResponsiveText
      variant="heroTitle"
      as="h1"
      className={cn('font-bold tracking-tight text-balance', className)}
    >
      {children}
    </ResponsiveText>
  );
}

export function HeroSubtitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <ResponsiveText
      variant="heroSubtitle"
      as="p"
      className={cn('text-muted-foreground leading-relaxed', className)}
    >
      {children}
    </ResponsiveText>
  );
}

export function SectionTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <ResponsiveText
      variant="sectionTitle"
      as="h2"
      className={cn('font-bold tracking-tight text-center', className)}
    >
      {children}
    </ResponsiveText>
  );
}

export function SectionSubtitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <ResponsiveText
      variant="sectionSubtitle"
      as="p"
      className={cn('text-muted-foreground text-center leading-relaxed', className)}
    >
      {children}
    </ResponsiveText>
  );
}

export function FeatureTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <ResponsiveText
      variant="featureTitle"
      as="h3"
      className={cn('font-semibold tracking-tight', className)}
    >
      {children}
    </ResponsiveText>
  );
}

export function FeatureDescription({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <ResponsiveText
      variant="featureDescription"
      as="p"
      className={cn('text-muted-foreground leading-relaxed', className)}
    >
      {children}
    </ResponsiveText>
  );
}