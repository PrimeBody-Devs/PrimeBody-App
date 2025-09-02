'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { animationClasses, animationUtils, animationDelays } from '@/lib/animations';
import { useAccessibility } from '@/components/providers/accessibility-provider';

interface AnimatedElementProps {
  children: ReactNode;
  animation?: keyof typeof animationClasses;
  delay?: keyof typeof animationDelays;
  duration?: 'fast' | 'normal' | 'slow';
  trigger?: 'immediate' | 'scroll' | 'hover' | 'focus';
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  threshold?: number;
  rootMargin?: string;
}

export function AnimatedElement({
  children,
  animation = 'fadeIn',
  delay = 'none',
  duration = 'normal',
  trigger = 'scroll',
  className,
  as: Component = 'div',
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
}: AnimatedElementProps) {
  const elementRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(trigger === 'immediate');
  const [hasAnimated, setHasAnimated] = useState(false);
  const { settings } = useAccessibility();

  // Duration classes
  const durationClasses = {
    fast: 'duration-150',
    normal: 'duration-300',
    slow: 'duration-500',
  };

  // Check if animations should be disabled
  const shouldAnimate = !settings.reducedMotion && animationUtils.canAnimate();

  useEffect(() => {
    if (trigger !== 'scroll' || !elementRef.current || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [trigger, threshold, rootMargin, hasAnimated]);

  // Handle immediate trigger
  useEffect(() => {
    if (trigger === 'immediate' && !hasAnimated) {
      setIsVisible(true);
      setHasAnimated(true);
    }
  }, [trigger, hasAnimated]);

  const handleMouseEnter = () => {
    if (trigger === 'hover' && !hasAnimated) {
      setIsVisible(true);
      setHasAnimated(true);
    }
  };

  const handleFocus = () => {
    if (trigger === 'focus' && !hasAnimated) {
      setIsVisible(true);
      setHasAnimated(true);
    }
  };

  return (
    <Component
      ref={elementRef}
      className={cn(
        // Base classes
        'transition-all ease-out',
        durationClasses[duration],
        
        // Animation classes (only if animations are enabled)
        shouldAnimate && !isVisible && 'opacity-0 translate-y-4',
        shouldAnimate && isVisible && animationClasses[animation],
        
        // Delay
        delay !== 'none' && `delay-[${animationDelays[delay]}]`,
        
        // Reduced motion fallback
        !shouldAnimate && 'opacity-100 translate-y-0',
        
        className
      )}
      style={{
        animationDelay: delay !== 'none' ? animationDelays[delay] : undefined,
      }}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
    >
      {children}
    </Component>
  );
}

// Specialized animated components
export function AnimatedSection({ children, className, ...props }: Omit<AnimatedElementProps, 'as'>) {
  return (
    <AnimatedElement
      as="section"
      animation="slideUp"
      className={cn('py-12 sm:py-16 md:py-20 lg:py-24', className)}
      {...props}
    >
      {children}
    </AnimatedElement>
  );
}

export function AnimatedCard({ children, className, ...props }: Omit<AnimatedElementProps, 'as'>) {
  return (
    <AnimatedElement
      as="div"
      animation="slideUp"
      className={cn(
        'group cursor-pointer',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-2 hover:shadow-xl',
        'motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-none',
        className
      )}
      {...props}
    >
      {children}
    </AnimatedElement>
  );
}

export function AnimatedButton({ children, className, ...props }: Omit<AnimatedElementProps, 'as'>) {
  return (
    <AnimatedElement
      as="button"
      animation="scaleIn"
      trigger="immediate"
      className={cn(
        'transition-all duration-200 ease-out',
        'hover:scale-105 active:scale-95',
        'motion-reduce:hover:scale-100 motion-reduce:active:scale-100',
        'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary',
        className
      )}
      {...props}
    >
      {children}
    </AnimatedElement>
  );
}

export function AnimatedIcon({ children, className, ...props }: Omit<AnimatedElementProps, 'as'>) {
  return (
    <AnimatedElement
      as="div"
      animation="scaleIn"
      className={cn(
        'transition-all duration-300 ease-out',
        'hover:scale-110 hover:rotate-3',
        'motion-reduce:hover:scale-100 motion-reduce:hover:rotate-0',
        className
      )}
      {...props}
    >
      {children}
    </AnimatedElement>
  );
}