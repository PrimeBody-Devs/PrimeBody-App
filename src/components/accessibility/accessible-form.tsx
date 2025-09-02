'use client';

import { ReactNode, FormHTMLAttributes, useId } from 'react';
import { cn } from '@/lib/utils';
import { formAccessibility, ariaLabels, announceToScreenReader } from '@/lib/accessibility';

interface AccessibleFormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  title?: string;
  description?: string;
  onSubmitSuccess?: (message: string) => void;
  onSubmitError?: (message: string) => void;
}

export function AccessibleForm({
  children,
  title,
  description,
  className,
  onSubmitSuccess,
  onSubmitError,
  onSubmit,
  ...props
}: AccessibleFormProps) {
  const formId = useId();
  const titleId = `${formId}-title`;
  const descriptionId = `${formId}-description`;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if (onSubmit) {
      try {
        await onSubmit(event);
        if (onSubmitSuccess) {
          const message = 'Formulario enviado exitosamente';
          onSubmitSuccess(message);
          announceToScreenReader(message, 'assertive');
        }
      } catch (error) {
        if (onSubmitError) {
          const message = 'Error al enviar el formulario. Por favor intenta nuevamente.';
          onSubmitError(message);
          announceToScreenReader(message, 'assertive');
        }
      }
    }
  };

  return (
    <form
      className={cn('space-y-6', className)}
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descriptionId : undefined}
      onSubmit={handleSubmit}
      noValidate
      {...props}
    >
      {title && (
        <h2 id={titleId} className="text-2xl font-bold text-center">
          {title}
        </h2>
      )}
      
      {description && (
        <p id={descriptionId} className="text-muted-foreground text-center">
          {description}
        </p>
      )}
      
      {children}
    </form>
  );
}

// Accessible form field component
interface AccessibleFieldProps {
  children: ReactNode;
  label: string;
  required?: boolean;
  error?: string;
  help?: string;
  className?: string;
}

export function AccessibleField({
  children,
  label,
  required = false,
  error,
  help,
  className,
}: AccessibleFieldProps) {
  const fieldId = useId();
  const errorId = formAccessibility.errorId(fieldId);
  const helpId = formAccessibility.helpId(fieldId);

  return (
    <div className={cn('space-y-2', className)}>
      <label
        htmlFor={fieldId}
        className="block text-sm font-medium text-foreground"
      >
        {label}
        {required && (
          <span className="text-destructive ml-1" aria-label={ariaLabels.requiredField}>
            {formAccessibility.requiredIndicator}
          </span>
        )}
        {!required && (
          <span className="text-muted-foreground ml-1 text-xs">
            {formAccessibility.optionalText}
          </span>
        )}
      </label>
      
      <div className="relative">
        {/* Clone children and add accessibility props */}
        {typeof children === 'object' && children !== null && 'props' in children
          ? {
              ...children,
              props: {
                ...children.props,
                id: fieldId,
                'aria-required': required,
                'aria-invalid': !!error,
                'aria-describedby': [
                  error ? errorId : null,
                  help ? helpId : null,
                ].filter(Boolean).join(' ') || undefined,
              },
            }
          : children}
      </div>
      
      {help && (
        <p id={helpId} className="text-sm text-muted-foreground">
          {help}
        </p>
      )}
      
      {error && (
        <p
          id={errorId}
          className="text-sm text-destructive"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  );
}

// Accessible input component
interface AccessibleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  help?: string;
}

export function AccessibleInput({
  label,
  required = false,
  error,
  help,
  className,
  ...props
}: AccessibleInputProps) {
  return (
    <AccessibleField
      label={label}
      required={required}
      error={error}
      help={help}
    >
      <input
        className={cn(
          'flex h-11 w-full rounded-md border border-input bg-background px-3 py-2',
          'text-sm ring-offset-background file:border-0 file:bg-transparent',
          'file:text-sm file:font-medium placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive focus-visible:ring-destructive',
          className
        )}
        {...props}
      />
    </AccessibleField>
  );
}

// Accessible textarea component
interface AccessibleTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  help?: string;
}

export function AccessibleTextarea({
  label,
  required = false,
  error,
  help,
  className,
  ...props
}: AccessibleTextareaProps) {
  return (
    <AccessibleField
      label={label}
      required={required}
      error={error}
      help={help}
    >
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2',
          'text-sm ring-offset-background placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive focus-visible:ring-destructive',
          className
        )}
        {...props}
      />
    </AccessibleField>
  );
}