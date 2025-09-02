'use client';

import { ReactNode, Children, cloneElement, isValidElement, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { animationUtils, animationDelays } from '@/lib/animations';
import { useAccessibility } from '@/components/providers/accessibility-provider';

interface StaggeredAnimationProps {
  children: ReactNode;
  staggerDelay?: number;
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scaleIn';
  trigger?: 'immediate' | 'scroll';
  className?: string;
  threshold?: number;
  rootMargin?: string;
}

export function StaggeredAnimation({
  children,
  staggerDelay = 100,
  animation = 'slideUp',
  trigger = 'scroll',
  className,
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
}: StaggeredAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(trigger === 'immediate');
  const [hasAnimated, setHasAnimated] = useState(false);
  const { settings } = useAccessibility();

  // Check if animations should be disabled
  const shouldAnimate = !settings.reducedMotion && animationUtils.canAnimate();

  useEffect(() => {
    if (trigger !== 'scroll' || !containerRef.current || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [trigger, threshold, rootMargin, hasAnimated]);

  // Handle immediate trigger
  useEffect(() => {
    if (trigger === 'immediate' && !hasAnimated) {
      setIsVisible(true);
      setHasAnimated(true);
    }
  }, [trigger, hasAnimated]);

  // Animation classes for different types
  const animationClasses = {
    fadeIn: 'opacity-0 animate-in fade-in',
    slideUp: 'opacity-0 translate-y-4 animate-in slide-in-from-bottom-4',
    slideLeft: 'opacity-0 translate-x-4 animate-in slide-in-from-right-4',
    slideRight: 'opacity-0 -translate-x-4 animate-in slide-in-from-left-4',
    scaleIn: 'opacity-0 scale-90 animate-in zoom-in',
  };

  const childrenArray = Children.toArray(children);

  return (
    <div ref={containerRef} className={cn('space-y-4', className)}>
      {childrenArray.map((child, index) => {
        if (!isValidElement(child)) return child;

        const delay = shouldAnimate && isVisible ? index * staggerDelay : 0;

        return cloneElement(child, {
          key: child.key || index,
          className: cn(
            child.props.className,
            // Only apply animations if they should be enabled
            shouldAnimate && !isVisible && 'opacity-0 translate-y-4',
            shouldAnimate && isVisible && [
              animationClasses[animation],
              'duration-700 ease-out',
            ],
            // Reduced motion fallback
            !shouldAnimate && 'opacity-100 translate-y-0'
          ),
          style: {
            ...child.props.style,
            animationDelay: shouldAnimate && isVisible ? `${delay}ms` : '0ms',
          },
        });
      })}
    </div>
  );
}

// Specialized staggered components
export function StaggeredGrid({ 
  children, 
  className, 
  columns = 2,
  ...props 
}: StaggeredAnimationProps & { columns?: number }) {
  return (
    <StaggeredAnimation
      animation="slideUp"
      className={cn(
        'grid gap-6 sm:gap-8 lg:gap-12',
        columns === 1 && 'grid-cols-1',
        columns === 2 && 'grid-cols-1 md:grid-cols-2',
        columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        columns === 4 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
        className
      )}
      {...props}
    >
      {children}
    </StaggeredAnimation>
  );
}

export function StaggeredList({ children, className, ...props }: StaggeredAnimationProps) {
  return (
    <StaggeredAnimation
      animation="slideLeft"
      className={cn('space-y-4', className)}
      {...props}
    >
      {children}
    </StaggeredAnimation>
  );
}

export function StaggeredFeatures({ children, className, ...props }: StaggeredAnimationProps) {
  return (
    <StaggeredGrid
      columns={2}
      animation="slideUp"
      staggerDelay={150}
      className={cn('items-stretch', className)}
      {...props}
    >
      {children}
    </StaggeredGrid>
  );
}