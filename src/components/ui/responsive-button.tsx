import { ReactNode, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { touchTargets, responsiveTypography } from '@/lib/responsive';
import { Button, ButtonProps } from './button';

interface ResponsiveButtonProps extends ButtonProps {
  children: ReactNode;
  touchTarget?: 'button' | 'buttonSmall' | 'buttonLarge';
  textSize?: 'button' | 'buttonLarge';
}

export function ResponsiveButton({
  children,
  className,
  size = 'default',
  touchTarget = 'button',
  textSize = 'button',
  ...props
}: ResponsiveButtonProps) {
  return (
    <Button
      className={cn(
        touchTargets[touchTarget],
        responsiveTypography[textSize],
        // Ensure proper spacing on mobile
        'px-4 sm:px-6 py-2 sm:py-3',
        // Touch-friendly hover states
        'transition-all duration-200',
        'active:scale-95 sm:active:scale-100',
        'focus-visible:ring-2 focus-visible:ring-offset-2',
        className
      )}
      size={size}
      {...props}
    >
      {children}
    </Button>
  );
}

// Specialized button variants
export function CTAButton({ children, className, ...props }: Omit<ResponsiveButtonProps, 'touchTarget' | 'textSize'>) {
  return (
    <ResponsiveButton
      touchTarget="buttonLarge"
      textSize="buttonLarge"
      className={cn(
        'w-full sm:w-auto',
        'bg-gradient-to-r from-primary to-accent',
        'hover:from-primary/90 hover:to-accent/90',
        'shadow-lg hover:shadow-xl',
        'transform hover:-translate-y-1 hover:scale-105',
        'active:translate-y-0 active:scale-100',
        className
      )}
      {...props}
    >
      {children}
    </ResponsiveButton>
  );
}

export function SecondaryButton({ children, className, ...props }: Omit<ResponsiveButtonProps, 'touchTarget' | 'textSize'>) {
  return (
    <ResponsiveButton
      variant="outline"
      touchTarget="buttonLarge"
      textSize="buttonLarge"
      className={cn(
        'w-full sm:w-auto',
        'border-2 hover:bg-primary/5',
        'hover:border-primary/50',
        className
      )}
      {...props}
    >
      {children}
    </ResponsiveButton>
  );
}

export function IconButton({ 
  children, 
  className, 
  'aria-label': ariaLabel,
  ...props 
}: Omit<ResponsiveButtonProps, 'touchTarget' | 'textSize'> & { 'aria-label': string }) {
  return (
    <ResponsiveButton
      variant="ghost"
      touchTarget="button"
      className={cn(
        'h-11 w-11 p-0',
        'rounded-full',
        'hover:bg-primary/10',
        className
      )}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </ResponsiveButton>
  );
}