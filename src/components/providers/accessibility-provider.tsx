'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { prefersReducedMotion, prefersHighContrast, announceToScreenReader } from '@/lib/accessibility';

interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'larger';
  announcements: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => void;
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

interface AccessibilityProviderProps {
  children: ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    reducedMotion: false,
    highContrast: false,
    fontSize: 'normal',
    announcements: true,
  });

  // Initialize settings from user preferences and localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('primebody-accessibility');
    const userPreferences = {
      reducedMotion: prefersReducedMotion(),
      highContrast: prefersHighContrast(),
    };

    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({
          ...parsed,
          ...userPreferences, // User system preferences override saved settings
        });
      } catch {
        setSettings(prev => ({ ...prev, ...userPreferences }));
      }
    } else {
      setSettings(prev => ({ ...prev, ...userPreferences }));
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('primebody-accessibility', JSON.stringify(settings));
  }, [settings]);

  // Apply CSS classes based on settings
  useEffect(() => {
    const root = document.documentElement;
    
    // Font size
    root.classList.remove('text-normal', 'text-large', 'text-larger');
    root.classList.add(`text-${settings.fontSize}`);
    
    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
  }, [settings]);

  // Listen for system preference changes
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, reducedMotion: e.matches }));
    };

    const handleContrastChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, highContrast: e.matches }));
    };

    motionQuery.addEventListener('change', handleMotionChange);
    contrastQuery.addEventListener('change', handleContrastChange);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      contrastQuery.removeEventListener('change', handleContrastChange);
    };
  }, []);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Announce setting changes
    if (settings.announcements) {
      const messages = {
        reducedMotion: value ? 'Movimiento reducido activado' : 'Movimiento reducido desactivado',
        highContrast: value ? 'Alto contraste activado' : 'Alto contraste desactivado',
        fontSize: `Tamaño de fuente cambiado a ${value}`,
        announcements: value ? 'Anuncios activados' : 'Anuncios desactivados',
      };
      
      announceToScreenReader(messages[key], 'polite');
    }
  };

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (settings.announcements) {
      announceToScreenReader(message, priority);
    }
  };

  const contextValue: AccessibilityContextType = {
    settings,
    updateSetting,
    announce,
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}

// Accessibility settings panel component
export function AccessibilitySettings() {
  const { settings, updateSetting } = useAccessibility();

  return (
    <div className="space-y-6 p-6 bg-background border border-border rounded-lg">
      <h3 className="text-lg font-semibold">Configuración de Accesibilidad</h3>
      
      <div className="space-y-4">
        {/* Reduced Motion */}
        <div className="flex items-center justify-between">
          <label htmlFor="reduced-motion" className="text-sm font-medium">
            Reducir movimiento
          </label>
          <input
            id="reduced-motion"
            type="checkbox"
            checked={settings.reducedMotion}
            onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
        </div>

        {/* High Contrast */}
        <div className="flex items-center justify-between">
          <label htmlFor="high-contrast" className="text-sm font-medium">
            Alto contraste
          </label>
          <input
            id="high-contrast"
            type="checkbox"
            checked={settings.highContrast}
            onChange={(e) => updateSetting('highContrast', e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
        </div>

        {/* Font Size */}
        <div className="space-y-2">
          <label htmlFor="font-size" className="text-sm font-medium">
            Tamaño de fuente
          </label>
          <select
            id="font-size"
            value={settings.fontSize}
            onChange={(e) => updateSetting('fontSize', e.target.value as AccessibilitySettings['fontSize'])}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
          >
            <option value="normal">Normal</option>
            <option value="large">Grande</option>
            <option value="larger">Más grande</option>
          </select>
        </div>

        {/* Announcements */}
        <div className="flex items-center justify-between">
          <label htmlFor="announcements" className="text-sm font-medium">
            Anuncios de pantalla
          </label>
          <input
            id="announcements"
            type="checkbox"
            checked={settings.announcements}
            onChange={(e) => updateSetting('announcements', e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
        </div>
      </div>
    </div>
  );
}