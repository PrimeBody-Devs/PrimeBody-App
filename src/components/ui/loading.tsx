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
        'animate-pulse rounded-md bg-muted',
        className
      )}
    />
  );
}

export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-8">
            <Skeleton className="h-6 w-32" />
            <div className="hidden md:flex items-center space-x-6">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-18" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <div className="relative overflow-hidden py-20">
        <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="text-center lg:text-left space-y-8">
              <Skeleton className="h-4 w-48 mx-auto lg:mx-0" />
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-3/4" />
              </div>
              <Skeleton className="h-6 w-full" />
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-6">
                <Skeleton className="h-12 w-40" />
                <Skeleton className="h-12 w-32" />
              </div>
            </div>
            <div className="relative">
              <Skeleton className="aspect-square w-full max-w-lg mx-auto rounded-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section Skeleton */}
      <div className="py-20">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Skeleton className="h-8 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-2/3 mx-auto" />
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-6 rounded-xl border">
                <Skeleton className="h-12 w-12 rounded-lg mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
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
    <div className="p-6 rounded-xl border space-y-4">
      <Skeleton className="h-12 w-12 rounded-lg" />
      <Skeleton className="h-6 w-3/4" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}

export function ButtonSkeleton({ className }: { className?: string }) {
  return <Skeleton className={cn('h-10 w-24 rounded-md', className)} />;
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
      <div className={cn('animate-pulse', className)}>
        {skeleton || <PageLoadingSkeleton />}
      </div>
    );
  }

  return <>{children}</>;
}