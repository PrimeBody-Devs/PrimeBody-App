'use client';

import { useEffect, useState } from 'react';
import { useAnimationPerformance } from '@/hooks/use-scroll-animation';
import { useAccessibility } from '@/components/providers/accessibility-provider';

interface PerformanceMonitorProps {
  onPerformanceChange?: (isPerformant: boolean) => void;
  showDebugInfo?: boolean;
}

export function PerformanceMonitor({ 
  onPerformanceChange, 
  showDebugInfo = false 
}: PerformanceMonitorProps) {
  const { fps, isPerformant } = useAnimationPerformance();
  const { settings, updateSetting } = useAccessibility();
  const [hasAdjusted, setHasAdjusted] = useState(false);

  // Automatically adjust animations based on performance
  useEffect(() => {
    if (!isPerformant && !hasAdjusted && !settings.reducedMotion) {
      // If performance is poor, suggest enabling reduced motion
      console.warn('Poor animation performance detected. Consider enabling reduced motion.');
      
      // Optionally auto-enable reduced motion for very poor performance
      if (fps < 30) {
        updateSetting('reducedMotion', true);
        setHasAdjusted(true);
      }
    }

    onPerformanceChange?.(isPerformant);
  }, [isPerformant, fps, hasAdjusted, settings.reducedMotion, updateSetting, onPerformanceChange]);

  if (!showDebugInfo) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-background/90 backdrop-blur-sm border border-border rounded-lg p-3 text-xs font-mono z-50">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span>FPS:</span>
          <span className={fps >= 55 ? 'text-green-500' : fps >= 30 ? 'text-yellow-500' : 'text-red-500'}>
            {fps}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>Performance:</span>
          <span className={isPerformant ? 'text-green-500' : 'text-red-500'}>
            {isPerformant ? 'Good' : 'Poor'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>Reduced Motion:</span>
          <span className={settings.reducedMotion ? 'text-blue-500' : 'text-gray-500'}>
            {settings.reducedMotion ? 'On' : 'Off'}
          </span>
        </div>
      </div>
    </div>
  );
}

// Animation performance context
export function AnimationPerformanceProvider({ children }: { children: React.ReactNode }) {
  const [isPerformant, setIsPerformant] = useState(true);

  return (
    <>
      {children}
      <PerformanceMonitor 
        onPerformanceChange={setIsPerformant}
        showDebugInfo={process.env.NODE_ENV === 'development'}
      />
    </>
  );
}