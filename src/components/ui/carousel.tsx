'use client';

import { useState, useEffect, useRef, TouchEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface CarouselProps {
  items: {
    id: number;
    title: string;
    description: string;
    image: string;
  }[];
  autoPlay?: boolean;
  interval?: number;
}

export function Carousel({ items, autoPlay = true, interval = 5000 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const minSwipeDistance = 50; // Minimum distance for swipe to be considered

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === items.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? items.length - 1 : prevIndex - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Touch event handlers for swipe
  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  };

  // Remove nextSlide from dependencies by moving logic inline
  useEffect(() => {
    if (!autoPlay || isPaused) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === items.length - 1 ? 0 : prevIndex + 1));
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, isPaused, interval, items.length]);

  return (
    <div 
      ref={carouselRef}
      className="relative w-full overflow-hidden rounded-xl touch-pan-x"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Carousel container */}
      <div 
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item, index) => (
          <div key={item.id} className="w-full flex-shrink-0">
            <div className="relative aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 shadow-lg hover:shadow-xl transition-all duration-500 group">
              <div className="relative w-full h-full">
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="object-cover transition-all duration-700 ease-out"
                    priority={index === 0} // Only preload first image
                    loading={index === 0 ? 'eager' : 'lazy'}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6 flex flex-col justify-end group-hover:from-black/80 transition-all duration-500">
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 drop-shadow-lg">{item.title}</h3>
                  <p className="text-gray-200 text-sm sm:text-base leading-relaxed drop-shadow-md">{item.description}</p>
                  
                  {/* PrimeBody branding element */}
                  <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                    <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
                    <span className="text-xs text-primary font-medium">PrimeBody Experience</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Navigation buttons with PrimeBody styling */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 backdrop-blur-md p-2 text-foreground shadow-lg border border-white/20 transition-all hover:bg-gradient-to-r hover:from-primary hover:to-accent hover:text-white hover:scale-110 hover:shadow-xl active:scale-95 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:-translate-x-0.5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 backdrop-blur-md p-2 text-foreground shadow-lg border border-white/20 transition-all hover:bg-gradient-to-r hover:from-primary hover:to-accent hover:text-white hover:scale-110 hover:shadow-xl active:scale-95 group"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:translate-x-0.5" />
      </button>

      {/* Enhanced Indicators with PrimeBody styling */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2 bg-black/20 backdrop-blur-sm rounded-full px-3 py-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              'h-2 sm:h-2.5 rounded-full transition-all duration-300 touch-manipulation hover:scale-125',
              currentIndex === index 
                ? 'bg-gradient-to-r from-primary to-accent w-8 sm:w-10 shadow-lg' 
                : 'bg-white/60 w-3 sm:w-4 hover:bg-white/80'
            )}
            aria-label={`Ir a la diapositiva ${index + 1}`}
            aria-current={currentIndex === index ? 'step' : undefined}
          />
        ))}
      </div>
    </div>
  );
}
