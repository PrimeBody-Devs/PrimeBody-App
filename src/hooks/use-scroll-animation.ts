'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { animationUtils } from '@/lib/animations';
import { useAccessibility } from '@/components/providers/accessibility-provider';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
    delay = 0,
  } = options;

  const elementRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const { settings } = useAccessibility();

  const shouldAnimate = !settings.reducedMotion && animationUtils.canAnimate();

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !shouldAnimate) {
      // If animations are disabled, immediately set as visible
      if (!shouldAnimate) {
        setIsVisible(true);
      }
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!triggerOnce || !hasTriggered)) {
          if (delay > 0) {
            setTimeout(() => {
              setIsVisible(true);
              if (triggerOnce) setHasTriggered(true);
            }, delay);
          } else {
            setIsVisible(true);
            if (triggerOnce) setHasTriggered(true);
          }
        } else if (!triggerOnce && !entry.isIntersecting) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce, delay, hasTriggered, shouldAnimate]);

  return {
    elementRef,
    isVisible: shouldAnimate ? isVisible : true,
    shouldAnimate,
  };
}

// Hook for staggered animations
export function useStaggeredAnimation(itemCount: number, staggerDelay: number = 100) {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const { settings } = useAccessibility();
  
  const shouldAnimate = !settings.reducedMotion && animationUtils.canAnimate();

  const triggerStagger = useCallback(() => {
    if (!shouldAnimate) {
      // If animations are disabled, show all items immediately
      setVisibleItems(new Set(Array.from({ length: itemCount }, (_, i) => i)));
      return;
    }

    // Trigger items one by one with delay
    Array.from({ length: itemCount }).forEach((_, index) => {
      setTimeout(() => {
        setVisibleItems(prev => new Set([...prev, index]));
      }, index * staggerDelay);
    });
  }, [itemCount, staggerDelay, shouldAnimate]);

  const resetStagger = useCallback(() => {
    setVisibleItems(new Set());
  }, []);

  const isItemVisible = useCallback((index: number) => {
    return shouldAnimate ? visibleItems.has(index) : true;
  }, [visibleItems, shouldAnimate]);

  return {
    triggerStagger,
    resetStagger,
    isItemVisible,
    shouldAnimate,
  };
}

// Hook for scroll progress
export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollProgress;
}

// Hook for element visibility
export function useElementVisibility(threshold: number = 0.1) {
  const elementRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold]);

  return { elementRef, isVisible };
}

// Hook for parallax effect
export function useParallax(speed: number = 0.5) {
  const elementRef = useRef<HTMLElement>(null);
  const { settings } = useAccessibility();

  useEffect(() => {
    const element = elementRef.current;
    if (!element || settings.reducedMotion) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const scrolled = window.scrollY;
      const rate = scrolled * -speed;
      
      element.style.transform = `translateY(${rate}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, settings.reducedMotion]);

  return elementRef;
}

// Hook for mouse tracking
export function useMouseTracking() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { settings } = useAccessibility();

  useEffect(() => {
    if (settings.reducedMotion) return;

    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [settings.reducedMotion]);

  return mousePosition;
}

// Hook for performance monitoring
export function useAnimationPerformance() {
  const [fps, setFps] = useState(60);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    let animationId: number;

    const measureFPS = () => {
      frameCount.current++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime.current + 1000) {
        setFps(Math.round((frameCount.current * 1000) / (currentTime - lastTime.current)));
        frameCount.current = 0;
        lastTime.current = currentTime;
      }
      
      animationId = requestAnimationFrame(measureFPS);
    };

    animationId = requestAnimationFrame(measureFPS);

    return () => cancelAnimationFrame(animationId);
  }, []);

  return {
    fps,
    isPerformant: fps >= 55, // Consider 55+ FPS as good performance
  };
}