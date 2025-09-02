'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  return (
    <Loader2 
      className={cn(
        'animate-spin text-primary',
        sizeClasses[size],
        className
      )} 
    />
  );
}

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] animate-[shimmer_2s_infinite]',
        className
      )}
    />
  );
}

export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      {/* Header Skeleton with PrimeBody branding */}
      <div className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-18" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-10 w-36 rounded-md" />
          </div>
        </div>
      </div>

      {/* Hero Section Skeleton with PrimeBody styling */}
      <div className="relative overflow-hidden py-20">
        {/* Background decorative elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/10 rounded-full filter blur-3xl opacity-60 animate-pulse [animation-delay:1s]"></div>
        
        <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="text-center lg:text-left space-y-8">
              {/* Badge skeleton */}
              <Skeleton className="h-8 w-56 mx-auto lg:mx-0 rounded-full" />
              
              {/* Title skeleton */}
              <div className="space-y-4">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-3/4 mx-auto lg:mx-0" />
              </div>
              
              {/* Subtitle skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6 mx-auto lg:mx-0" />
                <Skeleton className="h-6 w-4/5 mx-auto lg:mx-0" />
              </div>
              
              {/* CTA buttons skeleton */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-6">
                <Skeleton className="h-12 w-48 rounded-md" />
                <Skeleton className="h-12 w-36 rounded-md" />
              </div>
              
              {/* Social proof skeleton */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-10 w-10 rounded-full" />
                    ))}
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-4 w-4 rounded-sm" />
                    ))}
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
            
            {/* Hero visual skeleton */}
            <div className="relative">
              <Skeleton className="aspect-square w-full max-w-lg mx-auto rounded-2xl" />
              {/* Floating elements */}
              <Skeleton className="absolute top-8 left-8 h-16 w-16 rounded-xl" />
              <Skeleton className="absolute top-8 right-8 h-12 w-12 rounded-full" />
              <Skeleton className="absolute bottom-20 left-12 h-14 w-14 rounded-lg" />
              <Skeleton className="absolute -bottom-4 -right-4 h-24 w-24 rounded-tl-2xl rounded-br-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section Skeleton */}
      <div className="py-20">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-2/3 mx-auto" />
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-8 rounded-xl border-2 bg-gradient-to-br from-background to-primary/5">
                <Skeleton className="h-16 w-16 rounded-xl mb-6" />
                <Skeleton className="h-7 w-3/4 mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
                <Skeleton className="h-4 w-2/3 mt-4" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demo Section Skeleton */}
      <div className="py-20 bg-gradient-to-br from-muted/20 via-primary/5 to-accent/5 rounded-3xl my-16 mx-4">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-48 mx-auto mb-6 rounded-full" />
            <Skeleton className="h-10 w-80 mx-auto mb-4" />
            <Skeleton className="h-6 w-2/3 mx-auto" />
          </div>
          
          {/* Carousel skeleton */}
          <div className="max-w-5xl mx-auto px-4 mb-16">
            <Skeleton className="aspect-video w-full rounded-xl" />
          </div>
          
          {/* Feature cards skeleton */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto px-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-background/80 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                <Skeleton className="h-16 w-16 mx-auto mb-4 rounded-full" />
                <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6 mx-auto" />
                </div>
                <Skeleton className="h-1 w-0 mx-auto mt-4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="p-6 rounded-xl border space-y-4 bg-gradient-to-br from-background to-primary/5">
      <Skeleton className="h-12 w-12 rounded-lg" />
      <Skeleton className="h-6 w-3/4" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}

// PrimeBody-specific skeleton components
export function HeroSkeleton() {
  return (
    <div className="relative overflow-hidden py-20 bg-gradient-to-br from-background via-primary/5 to-accent/5">
      {/* Background decorative elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-60 animate-pulse"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/10 rounded-full filter blur-3xl opacity-60 animate-pulse [animation-delay:1s]"></div>
      
      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="text-center lg:text-left space-y-8">
            <Skeleton className="h-8 w-56 mx-auto lg:mx-0 rounded-full" />
            <div className="space-y-4">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-3/4 mx-auto lg:mx-0" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6 mx-auto lg:mx-0" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-6">
              <Skeleton className="h-12 w-48 rounded-md" />
              <Skeleton className="h-12 w-36 rounded-md" />
            </div>
          </div>
          <div className="relative">
            <Skeleton className="aspect-square w-full max-w-lg mx-auto rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeaturesSkeleton() {
  return (
    <div className="py-20">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Skeleton className="h-10 w-96 mx-auto mb-4" />
          <Skeleton className="h-6 w-2/3 mx-auto" />
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-8 rounded-xl border-2 bg-gradient-to-br from-background to-primary/5 hover:shadow-xl transition-all duration-500">
              <Skeleton className="h-16 w-16 rounded-xl mb-6" />
              <Skeleton className="h-7 w-3/4 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
              </div>
              <Skeleton className="h-4 w-2/3 mt-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DemoSkeleton() {
  return (
    <div className="py-20 bg-gradient-to-br from-muted/20 via-primary/5 to-accent/5 rounded-3xl my-16 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-accent/10 rounded-full filter blur-3xl opacity-50 animate-pulse [animation-delay:1s]"></div>
      
      <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <Skeleton className="h-8 w-48 mx-auto mb-6 rounded-full" />
          <Skeleton className="h-10 w-80 mx-auto mb-4" />
          <Skeleton className="h-6 w-2/3 mx-auto" />
        </div>
        
        <div className="max-w-5xl mx-auto px-4 mb-16">
          <Skeleton className="aspect-video w-full rounded-xl" />
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto px-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-background/80 backdrop-blur-sm p-6 rounded-xl border border-white/10">
              <Skeleton className="h-16 w-16 mx-auto mb-4 rounded-full" />
              <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6 mx-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CTASkeleton() {
  return (
    <div className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-accent/5 rounded-full filter blur-3xl opacity-70 animate-pulse [animation-delay:1s]"></div>
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 text-center">
        <Skeleton className="h-10 w-96 mx-auto mb-6" />
        <Skeleton className="h-6 w-2/3 mx-auto mb-12" />

        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-background border rounded-2xl p-8">
              <Skeleton className="h-16 w-16 mx-auto mb-6 rounded-xl" />
              <Skeleton className="h-6 w-3/4 mx-auto mb-3" />
              <div className="space-y-2 mb-6">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6 mx-auto" />
              </div>
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-3 w-2/3 mx-auto mt-3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ButtonSkeleton({ className }: { className?: string }) {
  return <Skeleton className={cn('h-10 w-24 rounded-md', className)} />;
}

// Full-page skeleton loader with PrimeBody branding
export function PrimeBodyPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      {/* Header */}
      <div className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-10 w-36 rounded-md" />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <HeroSkeleton />

      {/* Features Section */}
      <FeaturesSkeleton />

      {/* Demo Section */}
      <DemoSkeleton />

      {/* CTA Section */}
      <CTASkeleton />

      {/* Footer */}
      <div className="border-t bg-muted/30 py-12">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-5 w-24" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-18" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t text-center">
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface LoadingStateProps {
  children: React.ReactNode;
  loading: boolean;
  skeleton?: React.ReactNode;
  className?: string;
}

export function LoadingState({ 
  children, 
  loading, 
  skeleton, 
  className 
}: LoadingStateProps) {
  if (loading) {
    return (
      <div className={cn('', className)}>
        {skeleton || <PrimeBodyPageSkeleton />}
      </div>
    );
  }

  return <>{children}</>;
}

// Section-specific loading states
export function SectionLoadingState({ 
  children, 
  loading, 
  skeleton, 
  className 
}: LoadingStateProps) {
  if (loading) {
    return (
      <div className={cn('animate-pulse', className)}>
        {skeleton}
      </div>
    );
  }

  return <>{children}</>;
}