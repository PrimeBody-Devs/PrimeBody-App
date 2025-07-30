import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Props for the Input component.
 * Extends all standard HTML input element attributes.
 */
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Optional size variant for the input */
  size?: 'sm' | 'md' | 'lg';
  /** Optional variant style for the input */
  variant?: 'default' | 'ghost' | 'outline';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, size = 'md', variant = 'default', ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          {
            'h-8 text-xs': size === 'sm',
            'h-10 text-sm': size === 'md',
            'h-12 text-base': size === 'lg',
            'border border-input': variant === 'default',
            'border-0 bg-transparent': variant === 'ghost',
            'border-2': variant === 'outline',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
