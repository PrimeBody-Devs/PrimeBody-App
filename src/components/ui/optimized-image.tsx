'use client';

import Image, { ImageProps } from 'next/image';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from './loading';
import { ImageIcon, AlertCircle } from 'lucide-react';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallbackSrc?: string;
  showSkeleton?: boolean;
  skeletonClassName?: string;
  enableWebP?: boolean;
  retryAttempts?: number;
  onLoadingChange?: (loading: boolean) => void;
  onErrorChange?: (hasError: boolean) => void;
}

export function OptimizedImage({
  src,
  alt,
  className,
  fallbackSrc,
  showSkeleton = true,
  skeletonClassName,
  enableWebP = true,
  retryAttempts = 2,
  onLoadingChange,
  onErrorChange,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [attempts, setAttempts] = useState(0);

  // Generate WebP version if enabled
  const getOptimizedSrc = (originalSrc: string) => {
    if (!enableWebP || typeof originalSrc !== 'string') return originalSrc;
    
    // Check if it's already WebP or if it's an external URL
    if (originalSrc.includes('.webp') || originalSrc.startsWith('http')) {
      return originalSrc;
    }
    
    // Convert to WebP for internal images
    return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  };

  // Default PrimeBody fallback
  const defaultFallback = fallbackSrc || '/images/primebody-placeholder.jpg';

  useEffect(() => {
    setCurrentSrc(getOptimizedSrc(src as string));
    setIsLoading(true);
    setHasError(false);
    setAttempts(0);
  }, [src, enableWebP]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoadingChange?.(false);
  };

  const handleError = () => {
    console.warn(`Image failed to load: ${currentSrc}`);
    
    if (attempts < retryAttempts) {
      // Try original format if WebP failed
      if (enableWebP && currentSrc.includes('.webp')) {
        const originalSrc = (src as string).replace(/\.(jpg|jpeg|png)$/i, (match) => match);
        setCurrentSrc(originalSrc);
        setAttempts(prev => prev + 1);
        return;
      }
      
      // Retry with same source
      setAttempts(prev => prev + 1);
      setTimeout(() => {
        setCurrentSrc(currentSrc + `?retry=${attempts + 1}`);
      }, 1000);
      return;
    }

    // Use fallback after all retries
    setHasError(true);
    setIsLoading(false);
    onErrorChange?.(true);
    onLoadingChange?.(false);
    
    if (currentSrc !== defaultFallback) {
      setCurrentSrc(defaultFallback);
    }
  };

  return (
    <div className="relative overflow-hidden group">
      {/* Enhanced skeleton with PrimeBody branding */}
      {isLoading && showSkeleton && (
        <div className={cn(
          'absolute inset-0 z-10 bg-gradient-to-br from-muted via-muted/50 to-muted bg-[length:200%_100%] animate-[shimmer_2s_infinite] flex items-center justify-center',
          skeletonClassName
        )}>
          <div className="flex flex-col items-center gap-2 opacity-50">
            <ImageIcon className="h-8 w-8 text-muted-foreground animate-pulse" />
            <div className="flex items-center gap-1">
              <div className="h-1 w-1 bg-primary rounded-full animate-pulse"></div>
              <span className="text-xs text-muted-foreground">PrimeBody</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Error state with PrimeBody branding */}
      {hasError && !isLoading && (
        <div className={cn(
          'absolute inset-0 z-10 bg-gradient-to-br from-muted/20 to-muted/10 flex items-center justify-center border border-muted',
          className
        )}>
          <div className="flex flex-col items-center gap-2 text-muted-foreground p-4 text-center">
            <AlertCircle className="h-8 w-8" />
            <div className="space-y-1">
              <p className="text-xs font-medium">Imagen no disponible</p>
              <div className="flex items-center gap-1">
                <div className="h-1 w-1 bg-primary rounded-full"></div>
                <span className="text-xs">PrimeBody</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Main image */}
      <Image
        {...props}
        src={currentSrc}
        alt={alt}
        className={cn(
          'transition-all duration-700 ease-out',
          isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100',
          hasError && 'opacity-50 grayscale',
          'group-hover:scale-105 transition-transform duration-500',
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        quality={90}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
      />
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute bottom-2 right-2 z-20">
          <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  );
}

// Specialized components for PrimeBody use cases
export function HeroImage(props: OptimizedImageProps) {
  return (
    <OptimizedImage
      {...props}
      priority
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      fallbackSrc="/images/primebody-hero-fallback.jpg"
      className={cn('rounded-2xl shadow-2xl', props.className)}
    />
  );
}

export function FeatureImage(props: OptimizedImageProps) {
  return (
    <OptimizedImage
      {...props}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
      fallbackSrc="/images/primebody-feature-fallback.jpg"
      className={cn('rounded-xl', props.className)}
    />
  );
}

export function DemoImage(props: OptimizedImageProps) {
  return (
    <OptimizedImage
      {...props}
      sizes="(max-width: 768px) 100vw, 800px"
      fallbackSrc="/images/primebody-demo-fallback.jpg"
      className={cn('rounded-xl shadow-lg', props.className)}
      enableWebP={true}
    />
  );
}

export function AvatarImage(props: OptimizedImageProps) {
  return (
    <OptimizedImage
      {...props}
      sizes="(max-width: 768px) 64px, 96px"
      fallbackSrc="/images/primebody-avatar-fallback.jpg"
      className={cn('rounded-full border-2 border-primary/20', props.className)}
    />
  );
}

export function LogoImage(props: OptimizedImageProps) {
  return (
    <OptimizedImage
      {...props}
      priority
      sizes="(max-width: 768px) 120px, 160px"
      fallbackSrc="/images/primebody-logo-fallback.svg"
      className={cn('object-contain', props.className)}
      showSkeleton={false} // Logos usually don't need skeleton
    />
  );
}

// Progressive image component with multiple quality levels
interface ProgressiveImageProps extends OptimizedImageProps {
  lowQualitySrc?: string;
  mediumQualitySrc?: string;
}

export function ProgressiveImage({
  lowQualitySrc,
  mediumQualitySrc,
  src,
  ...props
}: ProgressiveImageProps) {
  const [currentQuality, setCurrentQuality] = useState<'low' | 'medium' | 'high'>('low');
  const [loadedQualities, setLoadedQualities] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Preload higher quality images
    if (mediumQualitySrc && !loadedQualities.has('medium')) {
      const img = new window.Image();
      img.onload = () => {
        setLoadedQualities(prev => new Set(prev).add('medium'));
        if (currentQuality === 'low') {
          setCurrentQuality('medium');
        }
      };
      img.src = mediumQualitySrc;
    }

    if (src && !loadedQualities.has('high')) {
      const img = new window.Image();
      img.onload = () => {
        setLoadedQualities(prev => new Set(prev).add('high'));
        setCurrentQuality('high');
      };
      img.src = src as string;
    }
  }, [src, mediumQualitySrc, lowQualitySrc, currentQuality, loadedQualities]);

  const getCurrentSrc = () => {
    switch (currentQuality) {
      case 'high':
        return src;
      case 'medium':
        return mediumQualitySrc || src;
      case 'low':
      default:
        return lowQualitySrc || mediumQualitySrc || src;
    }
  };

  return (
    <OptimizedImage
      {...props}
      src={getCurrentSrc()}
      className={cn(
        'transition-all duration-700',
        currentQuality === 'low' && 'blur-sm',
        currentQuality === 'medium' && 'blur-[1px]',
        props.className
      )}
    />
  );
}