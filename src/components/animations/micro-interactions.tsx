'use client';

import { ReactNode, useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useAccessibility } from '@/components/providers/accessibility-provider';

interface MicroInteractionProps {
  children: ReactNode;
  type?: 'hover' | 'click' | 'focus' | 'pulse' | 'glow' | 'bounce' | 'wiggle';
  intensity?: 'subtle' | 'normal' | 'strong';
  className?: string;
  disabled?: boolean;
}

export function MicroInteraction({
  children,
  type = 'hover',
  intensity = 'normal',
  className,
  disabled = false,
}: MicroInteractionProps) {
  const [isActive, setIsActive] = useState(false);
  const { settings } = useAccessibility();

  // Don't apply animations if reduced motion is preferred
  const shouldAnimate = !settings.reducedMotion && !disabled;

  // Intensity-based scale values
  const intensityValues = {
    subtle: { scale: 1.02, translate: 1, glow: 0.1 },
    normal: { scale: 1.05, translate: 2, glow: 0.2 },
    strong: { scale: 1.1, translate: 4, glow: 0.3 },
  };

  const values = intensityValues[intensity];

  // Animation classes based on type and intensity
  const getAnimationClasses = () => {
    if (!shouldAnimate) return '';

    const baseClasses = 'transition-all duration-300 ease-out';

    switch (type) {
      case 'hover':
        return cn(
          baseClasses,
          `hover:scale-[${1 + (values.scale - 1)}] hover:-translate-y-${values.translate}`,
          'active:scale-95 active:translate-y-0'
        );
      
      case 'click':
        return cn(
          baseClasses,
          isActive && `scale-[${values.scale}] -translate-y-${values.translate}`,
          'active:scale-95'
        );
      
      case 'focus':
        return cn(
          baseClasses,
          'focus-visible:scale-105 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary'
        );
      
      case 'pulse':
        return cn(
          baseClasses,
          'animate-pulse hover:animate-none hover:scale-105'
        );
      
      case 'glow':
        return cn(
          baseClasses,
          `hover:shadow-lg hover:shadow-primary/${Math.round(values.glow * 100)}`
        );
      
      case 'bounce':
        return cn(
          baseClasses,
          'hover:animate-bounce'
        );
      
      case 'wiggle':
        return cn(
          baseClasses,
          'hover:animate-[wiggle_0.5s_ease-in-out]'
        );
      
      default:
        return baseClasses;
    }
  };

  const handleClick = () => {
    if (type === 'click' && shouldAnimate) {
      setIsActive(true);
      setTimeout(() => setIsActive(false), 150);
    }
  };

  return (
    <div
      className={cn(getAnimationClasses(), className)}
      onClick={handleClick}
    >
      {children}
    </div>
  );
}

// Specialized micro-interaction components
export function HoverLift({ children, className, ...props }: Omit<MicroInteractionProps, 'type'>) {
  return (
    <MicroInteraction
      type="hover"
      className={cn('cursor-pointer', className)}
      {...props}
    >
      {children}
    </MicroInteraction>
  );
}

export function ClickScale({ children, className, ...props }: Omit<MicroInteractionProps, 'type'>) {
  return (
    <MicroInteraction
      type="click"
      className={cn('cursor-pointer select-none', className)}
      {...props}
    >
      {children}
    </MicroInteraction>
  );
}

export function GlowEffect({ children, className, ...props }: Omit<MicroInteractionProps, 'type'>) {
  return (
    <MicroInteraction
      type="glow"
      className={className}
      {...props}
    >
      {children}
    </MicroInteraction>
  );
}

export function PulseEffect({ children, className, ...props }: Omit<MicroInteractionProps, 'type'>) {
  return (
    <MicroInteraction
      type="pulse"
      className={className}
      {...props}
    >
      {children}
    </MicroInteraction>
  );
}

// Ripple effect component
interface RippleEffectProps {
  children: ReactNode;
  className?: string;
  color?: string;
}

export function RippleEffect({ children, className, color = 'rgba(255, 255, 255, 0.3)' }: RippleEffectProps) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const { settings } = useAccessibility();

  const shouldAnimate = !settings.reducedMotion;

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!shouldAnimate) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const newRipple = {
      id: Date.now(),
      x,
      y,
    };

    setRipples(prev => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      onClick={handleClick}
    >
      {children}
      
      {shouldAnimate && ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute pointer-events-none animate-ping"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
            borderRadius: '50%',
            backgroundColor: color,
            transform: 'scale(0)',
            animation: 'ripple 0.6s linear',
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

// Magnetic effect component (subtle attraction to cursor)
interface MagneticEffectProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

export function MagneticEffect({ children, strength = 0.3, className }: MagneticEffectProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const { settings } = useAccessibility();

  const shouldAnimate = !settings.reducedMotion;

  useEffect(() => {
    if (!shouldAnimate || !elementRef.current) return;

    const element = elementRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;
      
      element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    };

    const handleMouseLeave = () => {
      element.style.transform = 'translate(0px, 0px)';
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength, shouldAnimate]);

  return (
    <div
      ref={elementRef}
      className={cn('transition-transform duration-200 ease-out', className)}
    >
      {children}
    </div>
  );
}

// Floating animation component
interface FloatingAnimationProps {
  children: ReactNode;
  duration?: number;
  distance?: number;
  className?: string;
}

export function FloatingAnimation({ 
  children, 
  duration = 3000, 
  distance = 10, 
  className 
}: FloatingAnimationProps) {
  const { settings } = useAccessibility();

  const shouldAnimate = !settings.reducedMotion;

  return (
    <div
      className={cn(
        shouldAnimate && 'animate-[float_3s_ease-in-out_infinite]',
        className
      )}
      style={{
        animationDuration: shouldAnimate ? `${duration}ms` : undefined,
      }}
    >
      {children}
      
      {shouldAnimate && (
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-${distance}px); }
          }
        `}</style>
      )}
    </div>
  );
}