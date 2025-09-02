import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

interface ResponsiveImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  alt: string;
  mobileSrc?: string;
  tabletSrc?: string;
  desktopSrc?: string;
  aspectRatio?: 'square' | 'video' | 'wide' | 'portrait' | 'auto';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

export function ResponsiveImage({
  src,
  alt,
  mobileSrc,
  tabletSrc,
  desktopSrc,
  aspectRatio = 'auto',
  objectFit = 'cover',
  className,
  loading = 'lazy',
  priority = false,
  ...props
}: ResponsiveImageProps) {
  // Determine which image source to use based on screen size
  const getImageSrc = () => {
    // For now, we'll use the main src
    // In a real implementation, you might use a picture element or srcset
    return desktopSrc || tabletSrc || mobileSrc || src;
  };

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[16/9]',
    portrait: 'aspect-[3/4]',
    auto: '',
  };

  const objectFitClasses = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down',
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        aspectRatioClasses[aspectRatio],
        className
      )}
    >
      <Image
        src={getImageSrc()}
        alt={alt}
        fill={aspectRatio !== 'auto'}
        className={cn(
          objectFitClasses[objectFit],
          'transition-transform duration-300 ease-out'
        )}
        loading={loading}
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        {...props}
      />
    </div>
  );
}

// Hero image component with responsive behavior
interface HeroImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function HeroImage({ src, alt, className }: HeroImageProps) {
  return (
    <ResponsiveImage
      src={src}
      alt={alt}
      aspectRatio="square"
      className={cn(
        'w-full max-w-lg mx-auto',
        'rounded-2xl overflow-hidden',
        'shadow-2xl hover:shadow-3xl',
        'transition-all duration-500',
        'group-hover:scale-105',
        className
      )}
      priority
    />
  );
}

// Feature icon component
interface FeatureIconProps {
  src?: string;
  alt?: string;
  children?: React.ReactNode;
  className?: string;
}

export function FeatureIcon({ src, alt, children, className }: FeatureIconProps) {
  if (src && alt) {
    return (
      <ResponsiveImage
        src={src}
        alt={alt}
        aspectRatio="square"
        className={cn(
          'h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16',
          'rounded-xl',
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16',
        'rounded-xl bg-gradient-to-br from-primary/20 to-accent/20',
        'flex items-center justify-center text-primary',
        'shadow-lg group-hover:scale-110 transition-transform duration-300',
        className
      )}
    >
      {children}
    </div>
  );
}

// Avatar component for user profiles
interface AvatarImageProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function AvatarImage({ src, alt, size = 'md', className }: AvatarImageProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  return (
    <ResponsiveImage
      src={src}
      alt={alt}
      aspectRatio="square"
      className={cn(
        sizeClasses[size],
        'rounded-full border-2 border-background',
        'shadow-md hover:scale-110 transition-transform duration-200',
        className
      )}
    />
  );
}