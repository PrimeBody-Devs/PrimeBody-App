'use client';

import { useState, useEffect, useRef, useId } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';
import { keyboardNavigation, ariaLabels, announceToScreenReader } from '@/lib/accessibility';
import { IconButton } from '@/components/ui/responsive-button';

interface CarouselItem {
  id: string | number;
  title: string;
  description: string;
  image: string;
  alt?: string;
}

interface AccessibleCarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  interval?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  className?: string;
}

export function AccessibleCarousel({
  items,
  autoPlay = false,
  interval = 5000,
  showControls = true,
  showIndicators = true,
  className,
}: AccessibleCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const carouselId = useId();
  const liveRegionId = `${carouselId}-live`;

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && !isUserInteracting && items.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
      }, interval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, isUserInteracting, items.length, interval]);

  // Pause auto-play when user interacts
  useEffect(() => {
    if (isUserInteracting) {
      const timer = setTimeout(() => {
        setIsUserInteracting(false);
      }, 10000); // Resume auto-play after 10 seconds of no interaction

      return () => clearTimeout(timer);
    }
  }, [isUserInteracting]);

  // Keyboard navigation
  const handleKeyDown = (event: KeyboardEvent) => {
    const indicators = carouselRef.current?.querySelectorAll('[role="tab"]') as NodeListOf<HTMLElement>;
    if (!indicators) return;

    const indicatorArray = Array.from(indicators);
    const newIndex = keyboardNavigation.handleArrowKeys(event, indicatorArray, currentIndex);
    
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
      setIsUserInteracting(true);
      announceToScreenReader(`Diapositiva ${newIndex + 1} de ${items.length}: ${items[newIndex].title}`);
    }
  };

  // Navigation functions
  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setIsUserInteracting(true);
    announceToScreenReader(`Diapositiva anterior: ${items[newIndex].title}`);
  };

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % items.length;
    setCurrentIndex(newIndex);
    setIsUserInteracting(true);
    announceToScreenReader(`Siguiente diapositiva: ${items[newIndex].title}`);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsUserInteracting(true);
    announceToScreenReader(`Diapositiva ${index + 1}: ${items[index].title}`);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    setIsUserInteracting(true);
    announceToScreenReader(isPlaying ? 'Carrusel pausado' : 'Carrusel reproduciendo');
  };

  if (items.length === 0) return null;

  const currentItem = items[currentIndex];

  return (
    <div
      ref={carouselRef}
      className={cn('relative', className)}
      role="region"
      aria-label="Carrusel de imágenes de PrimeBody"
      aria-describedby={liveRegionId}
      onKeyDown={handleKeyDown}
    >
      {/* Live region for screen reader announcements */}
      <div
        id={liveRegionId}
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        Diapositiva {currentIndex + 1} de {items.length}: {currentItem.title}
      </div>

      {/* Main carousel content */}
      <div className="relative overflow-hidden rounded-lg bg-muted">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              className="w-full flex-shrink-0"
              role="tabpanel"
              aria-labelledby={`carousel-tab-${index}`}
              aria-hidden={index !== currentIndex}
            >
              <div className="aspect-video relative">
                <img
                  src={item.image}
                  alt={item.alt || item.title}
                  className="w-full h-full object-cover"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                
                {/* Content overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm opacity-90">{item.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation controls */}
        {showControls && items.length > 1 && (
          <>
            <IconButton
              onClick={goToPrevious}
              aria-label="Diapositiva anterior"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
            >
              <ChevronLeft className="h-5 w-5" />
            </IconButton>

            <IconButton
              onClick={goToNext}
              aria-label="Siguiente diapositiva"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
            >
              <ChevronRight className="h-5 w-5" />
            </IconButton>
          </>
        )}

        {/* Play/Pause control */}
        {autoPlay && items.length > 1 && (
          <IconButton
            onClick={togglePlayPause}
            aria-label={isPlaying ? 'Pausar carrusel' : 'Reproducir carrusel'}
            className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </IconButton>
        )}
      </div>

      {/* Indicators */}
      {showIndicators && items.length > 1 && (
        <div
          className="flex justify-center mt-4 space-x-2"
          role="tablist"
          aria-label="Indicadores de diapositivas"
        >
          {items.map((_, index) => (
            <button
              key={index}
              id={`carousel-tab-${index}`}
              role="tab"
              aria-selected={index === currentIndex}
              aria-controls={`carousel-panel-${index}`}
              onClick={() => goToSlide(index)}
              className={cn(
                'w-3 h-3 rounded-full transition-all duration-200',
                'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary',
                index === currentIndex
                  ? 'bg-primary scale-110'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              )}
              aria-label={`Ir a diapositiva ${index + 1}: ${items[index].title}`}
            />
          ))}
        </div>
      )}

      {/* Progress bar (optional) */}
      {autoPlay && isPlaying && items.length > 1 && (
        <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-100 ease-linear"
            style={{
              width: `${((Date.now() % interval) / interval) * 100}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}