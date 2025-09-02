'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/animations/loading-animations';
import { performanceUtils } from '@/lib/performance';

interface LazyImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  blurDataURL?: string;
  showSkeleton?: boolean;
  skeletonClassName?: string;
  onLoadStart?: () => void;
  onLoadComplete?: () => void;
  onError?: () => void;
}

export function LazyImage({
  src,
  alt,
  fallbackSrc,
  blurDataURL,
  showSkeleton = true,
  skeletonClassName,
  className,
  onLoadStart,
  onLoadComplete,
  onError,
  ...props
}: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  // Optimize image format based on device capabilities
  const optimizedSrc = src.includes('.') 
    ? src.replace(/\.(jpg|jpeg|png)$/i, `.${performanceUtils.getOptimalImageFormat()}`)
    : src;

  const handleLoadStart = () => {
    setIsLoading(true);
    onLoadStart?.();
  };

  const handleLoadComplete = () => {
    setIsLoading(false);
    onLoadComplete?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
      setHasError(false);
      setIsLoading(true);
    } else {
      onError?.();
    }
  };

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {isLoading && showSkeleton && (
        <Skeleton 
          className={cn('absolute inset-0', skeletonClassName)}
          variant="rectangular"
        />
      )}
      
      {!hasError ? (
        <Image
          src={performanceUtils.prefersReducedData() ? imageSrc : optimizedSrc}
          alt={alt}
          className={cn(
            'transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100'
          )}
          onLoadingComplete={handleLoadComplete}
          onLoadStart={handleLoadStart}
          onError={handleError}
          placeholder={blurDataURL ? 'blur' : 'empty'}
          blurDataURL={blurDataURL}
          loading="lazy"
          {...props}
        />
      ) : (
        <div className="flex items-center justify-center h-full bg-muted text-muted-foreground">
          <span className="text-sm">Error al cargar imagen</span>
        </div>
      )}
    </div>
  );
}

// Lazy content loader with intersection observer
interface LazyContentProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  className?: string;
  onVisible?: () => void;
}

export function LazyContent({
  children,
  fallback,
  threshold = 0.1,
  rootMargin = '50px',
  triggerOnce = true,
  className,
  onVisible,
}: LazyContentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!triggerOnce || !hasTriggered)) {
          setIsVisible(true);
          if (triggerOnce) setHasTriggered(true);
          onVisible?.();
        } else if (!triggerOnce && !entry.isIntersecting) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce, hasTriggered, onVisible]);

  return (
    <div ref={elementRef} className={className}>
      {isVisible ? children : (fallback || <Skeleton variant="rectangular" height={200} />)}
    </div>
  );
}

// Lazy component loader with dynamic imports
interface LazyComponentProps {
  importFn: () => Promise<{ default: React.ComponentType<any> }>;
  fallback?: ReactNode;
  props?: Record<string, any>;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export function LazyComponent({
  importFn,
  fallback,
  props = {},
  onLoad,
  onError,
}: LazyComponentProps) {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    importFn()
      .then((module) => {
        if (isMounted) {
          setComponent(() => module.default);
          setIsLoading(false);
          onLoad?.();
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setIsLoading(false);
          onError?.(err);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [importFn, onLoad, onError]);

  if (error) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>Error al cargar componente</p>
      </div>
    );
  }

  if (isLoading || !Component) {
    return <>{fallback || <Skeleton variant="rectangular" height={200} />}</>;
  }

  return <Component {...props} />;
}

// Progressive image loading with multiple sources
interface ProgressiveImageProps {
  src: string;
  lowQualitySrc?: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export function ProgressiveImage({
  src,
  lowQualitySrc,
  alt,
  className,
  width,
  height,
}: ProgressiveImageProps) {
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc || src);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (lowQualitySrc && currentSrc === lowQualitySrc) {
      // Preload high quality image
      const img = new window.Image();
      img.onload = () => {
        setCurrentSrc(src);
        setIsLoading(false);
      };
      img.src = src;
    } else {
      setIsLoading(false);
    }
  }, [src, lowQualitySrc, currentSrc]);

  return (
    <div className={cn('relative', className)}>
      <Image
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          'transition-all duration-500',
          isLoading && lowQualitySrc ? 'blur-sm scale-105' : 'blur-0 scale-100'
        )}
        loading="lazy"
      />
      
      {isLoading && (
        <div className="absolute inset-0 bg-muted/20 animate-pulse" />
      )}
    </div>
  );
}

// Lazy video component
interface LazyVideoProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
}

export function LazyVideo({
  src,
  poster,
  className,
  autoPlay = false,
  muted = true,
  loop = false,
  controls = true,
}: LazyVideoProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  const handleLoadedData = () => {
    setIsLoaded(true);
  };

  return (
    <div className={cn('relative', className)}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <Skeleton variant="rectangular" className="w-full h-full" />
        </div>
      )}
      
      <video
        ref={videoRef}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
        poster={poster}
        autoPlay={autoPlay && isVisible}
        muted={muted}
        loop={loop}
        controls={controls}
        onLoadedData={handleLoadedData}
        preload="metadata"
      >
        {isVisible && <source src={src} type="video/mp4" />}
        Tu navegador no soporta el elemento video.
      </video>
    </div>
  );
}