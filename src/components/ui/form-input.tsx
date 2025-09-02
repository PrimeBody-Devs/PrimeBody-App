import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string;
  error?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
}

const FormInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, description, id: propId, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = propId || generatedId;
    
    return (
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor={inputId} className={cn(error && 'text-destructive')}>
          {label}
        </Label>
        <Input
          type={type}
          id={inputId}
          className={cn(
            'border-border/40 focus-visible:ring-2 focus-visible:ring-primary/20',
            error && 'border-destructive focus-visible:ring-destructive/50',
            className
          )}
          ref={ref}
          {...props}
        />
        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
        {error && (
          <p className="text-sm font-medium text-destructive">
            {error}
          </p>
        )}
      </div>
    );
  }
);
FormInput.displayName = 'FormInput';

export { FormInput };
