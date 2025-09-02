import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardProps } from './card';
import { responsiveAnimations } from '@/lib/responsive';

interface ResponsiveCardProps extends CardProps {
  children: ReactNode;
  hover?: boolean;
  touchFriendly?: boolean;
}

export function ResponsiveCard({
  children,
  className,
  hover = true,
  touchFriendly = true,
  ...props
}: ResponsiveCardProps) {
  return (
    <Card
      className={cn(
        // Base responsive padding
        'p-4 sm:p-6 lg:p-8',
        // Touch-friendly interactions
        touchFriendly && 'cursor-pointer select-none',
        // Hover effects (disabled on touch devices for better UX)
        hover && [
          'transition-all duration-300 ease-out',
          'hover:shadow-xl hover:-translate-y-2',
          'active:translate-y-0 active:shadow-lg',
          'sm:hover:-translate-y-2 sm:active:translate-y-0',
        ],
        // Focus states for accessibility
        'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary',
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
}

// Feature card with responsive layout
interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  highlight?: string;
  className?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  highlight,
  className,
}: FeatureCardProps) {
  return (
    <ResponsiveCard
      className={cn(
        'group h-full',
        'border-2 hover:border-primary/20',
        'bg-gradient-to-br from-background to-primary/5',
        className
      )}
    >
      <CardHeader className="pb-4 sm:pb-6">
        {/* Icon container with responsive sizing */}
        <div className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
          {icon}
        </div>
        
        {/* Title with responsive typography */}
        <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold group-hover:text-primary transition-colors duration-300">
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3 sm:space-y-4">
        {/* Description with responsive text */}
        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
          {description}
        </p>
        
        {/* Highlight with responsive styling */}
        {highlight && (
          <div className="flex items-center gap-2 text-xs sm:text-sm text-primary font-medium">
            <span className="h-2 w-2 bg-primary rounded-full animate-pulse"></span>
            {highlight}
          </div>
        )}
      </CardContent>
    </ResponsiveCard>
  );
}

// Stats card for metrics display
interface StatsCardProps {
  value: string;
  label: string;
  icon?: ReactNode;
  className?: string;
}

export function StatsCard({
  value,
  label,
  icon,
  className,
}: StatsCardProps) {
  return (
    <ResponsiveCard
      hover={false}
      className={cn(
        'text-center',
        'bg-gradient-to-br from-primary/5 to-transparent',
        'border border-primary/10 hover:border-primary/20',
        className
      )}
    >
      <CardContent className="space-y-2 sm:space-y-3">
        {icon && (
          <div className="h-8 w-8 sm:h-10 sm:w-10 mx-auto rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        )}
        
        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {value}
        </div>
        
        <div className="text-xs sm:text-sm text-muted-foreground">
          {label}
        </div>
      </CardContent>
    </ResponsiveCard>
  );
}