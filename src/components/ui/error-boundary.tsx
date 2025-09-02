'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, MessageCircle } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  className?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <PrimeBodyErrorFallback
          error={this.state.error}
          onRetry={this.handleRetry}
          onReload={this.handleReload}
          className={this.props.className}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
  onRetry?: () => void;
  onReload?: () => void;
  className?: string;
  variant?: 'page' | 'section' | 'component';
}

export function PrimeBodyErrorFallback({
  error,
  onRetry,
  onReload,
  className,
  variant = 'section'
}: ErrorFallbackProps) {
  const isPageError = variant === 'page';
  
  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center',
      isPageError ? 'min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 p-8' : 'p-8 rounded-xl border border-destructive/20 bg-destructive/5',
      className
    )}>
      {/* Error Icon with PrimeBody styling */}
      <div className={cn(
        'rounded-full flex items-center justify-center mb-6',
        isPageError 
          ? 'h-24 w-24 bg-gradient-to-br from-destructive/20 to-destructive/10 border-2 border-destructive/20' 
          : 'h-16 w-16 bg-destructive/10 border border-destructive/20'
      )}>
        <AlertTriangle className={cn(
          'text-destructive',
          isPageError ? 'h-12 w-12' : 'h-8 w-8'
        )} />
      </div>

      {/* Error Message */}
      <div className="space-y-4 max-w-md">
        <h2 className={cn(
          'font-bold text-foreground',
          isPageError ? 'text-2xl sm:text-3xl' : 'text-xl'
        )}>
          {isPageError ? '¡Oops! Algo salió mal' : 'Error en esta sección'}
        </h2>
        
        <p className="text-muted-foreground leading-relaxed">
          {isPageError 
            ? 'No te preocupes, nuestro equipo de PrimeBody está trabajando para solucionarlo. Mientras tanto, puedes intentar recargar la página.'
            : 'Hubo un problema cargando esta parte de PrimeBody. Puedes intentar nuevamente.'
          }
        </p>

        {/* Error details (only in development) */}
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mt-4 p-4 bg-muted rounded-lg text-left text-sm">
            <summary className="cursor-pointer font-medium text-destructive mb-2">
              Detalles del error (desarrollo)
            </summary>
            <pre className="whitespace-pre-wrap text-xs text-muted-foreground overflow-auto">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        {onRetry && (
          <Button
            onClick={onRetry}
            className="group bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <RefreshCw className="mr-2 h-4 w-4 group-hover:animate-spin" />
            Intentar de nuevo
          </Button>
        )}
        
        {isPageError && (
          <>
            {onReload && (
              <Button
                onClick={onReload}
                variant="outline"
                className="border-2 hover:bg-primary/5 transition-all duration-300"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Recargar página
              </Button>
            )}
            
            <Button
              onClick={() => window.location.href = '/'}
              variant="ghost"
              className="hover:bg-primary/5 transition-all duration-300"
            >
              <Home className="mr-2 h-4 w-4" />
              Ir al inicio
            </Button>
          </>
        )}
      </div>

      {/* Support Link */}
      {isPageError && (
        <div className="mt-8 pt-6 border-t border-border/50">
          <p className="text-sm text-muted-foreground mb-3">
            ¿El problema persiste?
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary/80 hover:bg-primary/5"
            onClick={() => window.open('mailto:support@primebody.app', '_blank')}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Contactar soporte
          </Button>
        </div>
      )}

      {/* PrimeBody Branding */}
      <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
        <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
        <span>PrimeBody - Transformando tu experiencia fitness</span>
      </div>
    </div>
  );
}

// Specific error fallbacks for different sections
export function HeroErrorFallback({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="relative overflow-hidden py-20 bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <PrimeBodyErrorFallback
          onRetry={onRetry}
          variant="section"
          className="max-w-md mx-auto"
        />
      </div>
    </div>
  );
}

export function FeaturesErrorFallback({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="py-20">
      <div className="container px-4 sm:px-6 lg:px-8">
        <PrimeBodyErrorFallback
          onRetry={onRetry}
          variant="section"
          className="max-w-md mx-auto"
        />
      </div>
    </div>
  );
}

export function DemoErrorFallback({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="py-20 bg-gradient-to-br from-muted/20 via-primary/5 to-accent/5 rounded-3xl my-16 relative overflow-hidden">
      <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
        <PrimeBodyErrorFallback
          onRetry={onRetry}
          variant="section"
          className="max-w-md mx-auto"
        />
      </div>
    </div>
  );
}

export function CTAErrorFallback({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="py-20 relative overflow-hidden">
      <div className="container px-4 sm:px-6 lg:px-8">
        <PrimeBodyErrorFallback
          onRetry={onRetry}
          variant="section"
          className="max-w-md mx-auto"
        />
      </div>
    </div>
  );
}

// Hook for handling async errors in components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const handleError = React.useCallback((error: Error) => {
    console.error('Async error caught:', error);
    setError(error);
  }, []);

  // Throw error to be caught by ErrorBoundary
  if (error) {
    throw error;
  }

  return { handleError, resetError };
}

// Higher-order component for wrapping sections with error boundaries
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}