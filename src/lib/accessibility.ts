// Accessibility utilities for PrimeBody Landing Page

// ARIA label generators
export const ariaLabels = {
  // Navigation
  mainNavigation: 'Navegación principal',
  mobileMenu: 'Menú móvil',
  openMenu: 'Abrir menú de navegación',
  closeMenu: 'Cerrar menú de navegación',
  
  // Theme toggle
  toggleTheme: 'Alternar tema claro/oscuro',
  currentTheme: (theme: string) => `Tema actual: ${theme}`,
  
  // Buttons and links
  ctaButton: 'Comenzar transformación con PrimeBody',
  demoButton: 'Ver demostración de PrimeBody',
  learnMore: 'Aprender más sobre',
  externalLink: 'Enlace externo (se abre en nueva pestaña)',
  
  // Forms
  requiredField: 'Campo obligatorio',
  optionalField: 'Campo opcional',
  formError: 'Error en el formulario',
  formSuccess: 'Formulario enviado exitosamente',
  
  // Content sections
  heroSection: 'Sección principal de PrimeBody',
  featuresSection: 'Características de PrimeBody',
  demoSection: 'Demostración de la aplicación',
  ctaSection: 'Llamada a la acción',
  
  // Interactive elements
  expandCollapse: (expanded: boolean) => expanded ? 'Contraer contenido' : 'Expandir contenido',
  loading: 'Cargando contenido',
  imageLoading: 'Imagen cargando',
  
  // Social proof
  userTestimonial: 'Testimonio de usuario',
  userRating: (rating: number) => `Calificación: ${rating} de 5 estrellas`,
  userCount: (count: string) => `${count} usuarios activos`,
} as const;

// Screen reader utilities
export const screenReader = {
  // Screen reader only text
  srOnly: 'sr-only',
  
  // Skip links
  skipToMain: 'Saltar al contenido principal',
  skipToNav: 'Saltar a la navegación',
  skipToFooter: 'Saltar al pie de página',
  
  // Live regions
  liveRegion: 'aria-live="polite"',
  assertiveLiveRegion: 'aria-live="assertive"',
  
  // Status messages
  statusSuccess: 'Operación completada exitosamente',
  statusError: 'Ha ocurrido un error',
  statusLoading: 'Cargando, por favor espere',
} as const;

// Focus management utilities
export const focusManagement = {
  // Focus trap for modals
  trapFocus: (element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  },

  // Focus visible utilities
  focusVisible: 'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary focus-visible:outline-none',
  focusVisibleInset: 'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary focus-visible:outline-none',
  
  // Skip link styles
  skipLink: 'absolute -top-10 left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md focus:top-4 transition-all duration-200',
} as const;

// Keyboard navigation utilities
export const keyboardNavigation = {
  // Arrow key navigation for grids/lists
  handleArrowKeys: (
    event: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    columns?: number
  ) => {
    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowRight':
        newIndex = Math.min(currentIndex + 1, items.length - 1);
        break;
      case 'ArrowLeft':
        newIndex = Math.max(currentIndex - 1, 0);
        break;
      case 'ArrowDown':
        if (columns) {
          newIndex = Math.min(currentIndex + columns, items.length - 1);
        }
        break;
      case 'ArrowUp':
        if (columns) {
          newIndex = Math.max(currentIndex - columns, 0);
        }
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = items.length - 1;
        break;
      default:
        return currentIndex;
    }

    event.preventDefault();
    items[newIndex]?.focus();
    return newIndex;
  },

  // Enter/Space key handler for custom interactive elements
  handleActivation: (event: KeyboardEvent, callback: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  },

  // Escape key handler for modals/dropdowns
  handleEscape: (event: KeyboardEvent, callback: () => void) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      callback();
    }
  },
} as const;

// Color contrast utilities
export const colorContrast = {
  // Ensure sufficient contrast ratios
  highContrast: 'contrast-125',
  normalContrast: 'contrast-100',
  
  // Text contrast classes
  textHighContrast: 'text-foreground',
  textMediumContrast: 'text-muted-foreground',
  textLowContrast: 'text-muted-foreground/70',
  
  // Background contrast classes
  bgHighContrast: 'bg-background',
  bgMediumContrast: 'bg-muted',
  bgLowContrast: 'bg-muted/50',
} as const;

// Motion preferences
export const motionPreferences = {
  // Respect user's motion preferences
  respectMotion: 'motion-safe:animate-in motion-reduce:animate-none',
  reduceMotion: 'motion-reduce:transition-none motion-reduce:animate-none',
  
  // Safe animations
  safeTransition: 'motion-safe:transition-all motion-safe:duration-300',
  safeFadeIn: 'motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500',
  safeSlideUp: 'motion-safe:animate-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700',
} as const;

// Form accessibility utilities
export const formAccessibility = {
  // Required field indicators
  requiredIndicator: '*',
  requiredText: '(obligatorio)',
  optionalText: '(opcional)',
  
  // Error message patterns
  errorId: (fieldId: string) => `${fieldId}-error`,
  helpId: (fieldId: string) => `${fieldId}-help`,
  
  // Form validation messages
  validationMessages: {
    required: 'Este campo es obligatorio',
    email: 'Por favor ingresa un email válido',
    minLength: (min: number) => `Debe tener al menos ${min} caracteres`,
    maxLength: (max: number) => `No debe exceder ${max} caracteres`,
    pattern: 'El formato ingresado no es válido',
  },
} as const;

// Utility function to announce messages to screen readers
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Utility function to check if user prefers reduced motion
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Utility function to check if user prefers high contrast
export const prefersHighContrast = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-contrast: high)').matches;
};