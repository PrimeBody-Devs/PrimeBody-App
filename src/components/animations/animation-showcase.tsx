'use client';

import { useState } from 'react';
import { 
  AnimatedElement, 
  AnimatedSection, 
  AnimatedCard, 
  AnimatedButton, 
  AnimatedIcon,
  StaggeredAnimation,
  StaggeredGrid,
  HoverLift,
  ClickScale,
  GlowEffect,
  PulseEffect,
  RippleEffect,
  MagneticEffect,
  FloatingAnimation,
  LoadingSpinner,
  Skeleton,
  ProgressBar,
  TypingAnimation
} from './index';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Heart, Star, Sparkles } from 'lucide-react';

export function AnimationShowcase() {
  const [progress, setProgress] = useState(75);

  return (
    <div className="space-y-12 p-8">
      <AnimatedSection>
        <h2 className="text-3xl font-bold text-center mb-8">
          PrimeBody Animation Showcase
        </h2>
      </AnimatedSection>

      {/* Entrance Animations */}
      <section className="space-y-6">
        <h3 className="text-2xl font-semibold">Entrance Animations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimatedElement animation="fadeIn" delay="sm">
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-2">Fade In</h4>
                <p className="text-sm text-muted-foreground">Smooth opacity transition</p>
              </CardContent>
            </Card>
          </AnimatedElement>

          <AnimatedElement animation="slideUp" delay="md">
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-2">Slide Up</h4>
                <p className="text-sm text-muted-foreground">Slides from bottom with fade</p>
              </CardContent>
            </Card>
          </AnimatedElement>

          <AnimatedElement animation="scaleIn" delay="lg">
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-2">Scale In</h4>
                <p className="text-sm text-muted-foreground">Scales from 80% to 100%</p>
              </CardContent>
            </Card>
          </AnimatedElement>
        </div>
      </section>

      {/* Staggered Animations */}
      <section className="space-y-6">
        <h3 className="text-2xl font-semibold">Staggered Animations</h3>
        <StaggeredGrid columns={4} staggerDelay={100}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4 text-center">
                <div className="h-12 w-12 bg-primary/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-primary font-bold">{index + 1}</span>
                </div>
                <p className="text-sm">Item {index + 1}</p>
              </CardContent>
            </Card>
          ))}
        </StaggeredGrid>
      </section>

      {/* Micro-interactions */}
      <section className="space-y-6">
        <h3 className="text-2xl font-semibold">Micro-interactions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <HoverLift>
            <Card className="cursor-pointer">
              <CardContent className="p-6 text-center">
                <Zap className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Hover Lift</p>
              </CardContent>
            </Card>
          </HoverLift>

          <ClickScale>
            <Card className="cursor-pointer">
              <CardContent className="p-6 text-center">
                <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
                <p className="text-sm font-medium">Click Scale</p>
              </CardContent>
            </Card>
          </ClickScale>

          <GlowEffect>
            <Card>
              <CardContent className="p-6 text-center">
                <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                <p className="text-sm font-medium">Glow Effect</p>
              </CardContent>
            </Card>
          </GlowEffect>

          <PulseEffect>
            <Card>
              <CardContent className="p-6 text-center">
                <Sparkles className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <p className="text-sm font-medium">Pulse Effect</p>
              </CardContent>
            </Card>
          </PulseEffect>
        </div>
      </section>

      {/* Advanced Interactions */}
      <section className="space-y-6">
        <h3 className="text-2xl font-semibold">Advanced Interactions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RippleEffect>
            <Card className="cursor-pointer">
              <CardContent className="p-8 text-center">
                <h4 className="font-semibold mb-2">Ripple Effect</h4>
                <p className="text-sm text-muted-foreground">Click to see ripple</p>
              </CardContent>
            </Card>
          </RippleEffect>

          <MagneticEffect strength={0.2}>
            <Card>
              <CardContent className="p-8 text-center">
                <h4 className="font-semibold mb-2">Magnetic Effect</h4>
                <p className="text-sm text-muted-foreground">Follows your cursor</p>
              </CardContent>
            </Card>
          </MagneticEffect>

          <FloatingAnimation duration={3000} distance={8}>
            <Card>
              <CardContent className="p-8 text-center">
                <h4 className="font-semibold mb-2">Floating Animation</h4>
                <p className="text-sm text-muted-foreground">Gentle up and down</p>
              </CardContent>
            </Card>
          </FloatingAnimation>
        </div>
      </section>

      {/* Loading States */}
      <section className="space-y-6">
        <h3 className="text-2xl font-semibold">Loading States</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Loading Spinners
                <LoadingSpinner size="sm" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <LoadingSpinner size="sm" color="primary" />
                <LoadingSpinner size="md" color="accent" />
                <LoadingSpinner size="lg" color="muted" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skeleton Loading</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton variant="circular" width={40} height={40} />
                <div className="flex-1 space-y-2">
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Progress and Text Animations */}
      <section className="space-y-6">
        <h3 className="text-2xl font-semibold">Progress & Text Animations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Progress Bar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProgressBar progress={progress} showLabel color="primary" />
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => setProgress(Math.max(0, progress - 10))}
                >
                  -10%
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => setProgress(Math.min(100, progress + 10))}
                >
                  +10%
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Typing Animation</CardTitle>
            </CardHeader>
            <CardContent>
              <TypingAnimation 
                text="Transforma tu cuerpo con PrimeBody" 
                speed={100}
                className="text-lg font-medium"
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Animated Buttons */}
      <section className="space-y-6">
        <h3 className="text-2xl font-semibold">Animated Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <AnimatedButton>
            <Button>Animated Button</Button>
          </AnimatedButton>
          
          <Button className="hover-lift">
            Hover Lift Button
          </Button>
          
          <Button className="hover-scale">
            Hover Scale Button
          </Button>
          
          <Button className="hover-glow">
            Hover Glow Button
          </Button>
        </div>
      </section>

      {/* Performance Note */}
      <section className="mt-12">
        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Performance & Accessibility
            </h4>
            <p className="text-sm text-muted-foreground">
              All animations respect user preferences for reduced motion and automatically 
              adjust based on device performance. Animations maintain 60fps and are 
              GPU-accelerated for smooth performance.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}