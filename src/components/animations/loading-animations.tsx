'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useAccessibility } from '@/components/providers/accessibility-provider';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'accent' | 'muted';
  className?: string;
}

export function LoadingSpinner({ size = 'md', color = 'primary', className }: LoadingSpinnerProps) {
  const { settings } = useAccessibility();

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  const colorClasses = {
    primary: 'text-primary',
    accent: 'text-accent',
    muted: 'text-muted-foreground',
  };

  // Use a simple static indicator if reduced motion is preferred
  if (settings.reducedMotion) {
    return (
      <div
        className={cn(
          sizeClasses[size],
          colorClasses[color],
          'rounded-full border-2 border-current border-t-transparent',
          className
        )}
        role="status"
        aria-label="Cargando"
      >
        <span className="sr-only">Cargando...</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        sizeClasses[size],
        colorClasses[color],
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        className
      )}
      role="status"
      aria-label="Cargando"
    >
      <span className="sr-only">Cargando...</span>
    </div>
  );
}

// Skeleton loader components
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({ 
  className, 
  variant = 'rectangular', 
  width, 
  height, 
  lines = 1 
}: SkeletonProps) {
  const { settings } = useAccessibility();

  const baseClasses = cn(
    'bg-muted',
    !settings.reducedMotion && 'animate-pulse',
    settings.reducedMotion && 'opacity-60'
  );

  const variantClasses = {
    text: 'h-4 rounded',
    rectangular: 'rounded-md',
    circular: 'rounded-full',
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              variantClasses.text,
              index === lines - 1 && 'w-3/4' // Last line is shorter
            )}
            style={{ width: index === lines - 1 ? '75%' : width, height }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={{ width, height }}
    />
  );
}

// Specialized skeleton components
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('p-6 space-y-4', className)}>
      <Skeleton variant="circular" width={48} height={48} />
      <div className="space-y-2">
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" lines={3} />
      </div>
    </div>
  );
}

export function SkeletonHero({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-6', className)}>
      <Skeleton variant="text" width="80%" height={48} />
      <Skeleton variant="text" lines={3} />
      <div className="flex gap-4">
        <Skeleton variant="rectangular" width={120} height={44} />
        <Skeleton variant="rectangular" width={100} height={44} />
      </div>
    </div>
  );
}

export function SkeletonFeature({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-4', className)}>
      <Skeleton variant="rectangular" width={64} height={64} />
      <Skeleton variant="text" width="70%" />
      <Skeleton variant="text" lines={2} />
    </div>
  );
}

// Pulse animation component
interface PulseAnimationProps {
  children: ReactNode;
  intensity?: 'subtle' | 'normal' | 'strong';
  duration?: number;
  className?: string;
}

export function PulseAnimation({ 
  children, 
  intensity = 'normal', 
  duration = 2000, 
  className 
}: PulseAnimationProps) {
  const { settings } = useAccessibility();

  const intensityClasses = {
    subtle: 'animate-pulse',
    normal: 'animate-pulse',
    strong: 'animate-bounce',
  };

  return (
    <div
      className={cn(
        !settings.reducedMotion && intensityClasses[intensity],
        className
      )}
      style={{
        animationDuration: !settings.reducedMotion ? `${duration}ms` : undefined,
      }}
    >
      {children}
    </div>
  );
}

// Breathing animation (subtle scale)
interface BreathingAnimationProps {
  children: ReactNode;
  scale?: number;
  duration?: number;
  className?: string;
}

export function BreathingAnimation({ 
  children, 
  scale = 1.05, 
  duration = 3000, 
  className 
}: BreathingAnimationProps) {
  const { settings } = useAccessibility();

  const shouldAnimate = !settings.reducedMotion;

  return (
    <div
      className={cn(
        shouldAnimate && 'animate-[breathe_3s_ease-in-out_infinite]',
        className
      )}
      style={{
        animationDuration: shouldAnimate ? `${duration}ms` : undefined,
      }}
    >
      {children}
      
      {shouldAnimate && (
        <style jsx>{`
          @keyframes breathe {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(${scale}); }
          }
        `}</style>
      )}
    </div>
  );
}

// Progress bar animation
interface ProgressBarProps {
  progress: number;
  className?: string;
  showLabel?: boolean;
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'error';
}

export function ProgressBar({ 
  progress, 
  className, 
  showLabel = false, 
  color = 'primary' 
}: ProgressBarProps) {
  const { settings } = useAccessibility();

  const colorClasses = {
    primary: 'bg-primary',
    accent: 'bg-accent',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span>Progreso</span>
          <span>{Math.round(clampedProgress)}%</span>
        </div>
      )}
      
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div
          className={cn(
            colorClasses[color],
            'h-full rounded-full',
            !settings.reducedMotion && 'transition-all duration-500 ease-out'
          )}
          style={{ width: `${clampedProgress}%` }}
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}

// Typing animation effect
interface TypingAnimationProps {
  text: string;
  speed?: number;
  className?: string;
  cursor?: boolean;
}

export function TypingAnimation({ 
  text, 
  speed = 50, 
  className, 
  cursor = true 
}: TypingAnimationProps) {
  const { settings } = useAccessibility();
  
  // If reduced motion is preferred, show full text immediately
  if (settings.reducedMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={cn('inline-block', className)}>
      <span className="animate-[typing_3s_steps(40,end)] overflow-hidden whitespace-nowrap border-r-2 border-primary">
        {text}
      </span>
      
      <style jsx>{`
        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }
        
        @keyframes blink {
          50% { border-color: transparent; }
        }
      `}</style>
    </span>
  );
}