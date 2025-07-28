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
            <div className="relative aspect-video overflow-hidden rounded-xl bg-muted/50">
              <div className="relative w-full h-full">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-cover"
                  priority={index === 0} // Only preload first image
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-6 flex flex-col justify-end">
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-foreground shadow-md backdrop-blur-sm transition-all hover:bg-white hover:scale-110 active:scale-95"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-foreground shadow-md backdrop-blur-sm transition-all hover:bg-white hover:scale-110 active:scale-95"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              'h-1.5 sm:h-2 rounded-full transition-all touch-manipulation',
              currentIndex === index ? 'bg-white w-6 sm:w-8' : 'bg-white/50 w-3 sm:w-4'
            )}
            aria-label={`Ir a la diapositiva ${index + 1}`}
            aria-current={currentIndex === index ? 'step' : undefined}
          />
        ))}
      </div>
    </div>
  );
}
