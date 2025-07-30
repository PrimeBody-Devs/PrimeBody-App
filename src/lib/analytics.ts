// Analytics utilities for tracking user interactions
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, unknown>;
}

// Google Analytics 4 tracking
export const trackEvent = ({
  action,
  category,
  label,
  value,
  custom_parameters = {},
}: AnalyticsEvent) => {
  if (typeof window === 'undefined' || !window.gtag) {
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', { action, category, label, value, custom_parameters });
    }
    return;
  }

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    ...custom_parameters,
  });
};

// Predefined event tracking functions
export const analytics = {
  // Page views
  pageView: (page_title: string, page_location: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_title,
        page_location,
      });
    }
  },

  // User interactions
  buttonClick: (button_name: string, section?: string) => {
    trackEvent({
      action: 'click',
      category: 'engagement',
      label: button_name,
      custom_parameters: {
        section,
        timestamp: Date.now(),
      },
    });
  },

  // Wallet interactions
  walletConnect: (wallet_type: string, success: boolean) => {
    trackEvent({
      action: 'wallet_connect',
      category: 'web3',
      label: wallet_type,
      value: success ? 1 : 0,
      custom_parameters: {
        success,
        timestamp: Date.now(),
      },
    });
  },

  walletDisconnect: (wallet_type: string) => {
    trackEvent({
      action: 'wallet_disconnect',
      category: 'web3',
      label: wallet_type,
      custom_parameters: {
        timestamp: Date.now(),
      },
    });
  },

  // Form interactions
  formStart: (form_name: string) => {
    trackEvent({
      action: 'form_start',
      category: 'engagement',
      label: form_name,
      custom_parameters: {
        timestamp: Date.now(),
      },
    });
  },

  formSubmit: (form_name: string, success: boolean) => {
    trackEvent({
      action: 'form_submit',
      category: 'conversion',
      label: form_name,
      value: success ? 1 : 0,
      custom_parameters: {
        success,
        timestamp: Date.now(),
      },
    });
  },

  // Navigation
  linkClick: (link_url: string, link_text: string, external: boolean = false) => {
    trackEvent({
      action: 'link_click',
      category: 'navigation',
      label: link_text,
      custom_parameters: {
        link_url,
        external,
        timestamp: Date.now(),
      },
    });
  },

  // Scroll tracking
  scrollDepth: (depth: number, page: string) => {
    trackEvent({
      action: 'scroll',
      category: 'engagement',
      label: `${depth}%`,
      value: depth,
      custom_parameters: {
        page,
        timestamp: Date.now(),
      },
    });
  },

  // Error tracking
  error: (error_message: string, error_location: string, fatal: boolean = false) => {
    trackEvent({
      action: 'exception',
      category: 'error',
      label: error_message,
      custom_parameters: {
        error_location,
        fatal,
        timestamp: Date.now(),
      },
    });
  },

  // Performance tracking
  performance: (metric_name: string, value: number, unit: string = 'ms') => {
    trackEvent({
      action: 'timing_complete',
      category: 'performance',
      label: metric_name,
      value: Math.round(value),
      custom_parameters: {
        unit,
        timestamp: Date.now(),
      },
    });
  },
};

// Hook for tracking page views
export const usePageTracking = () => {
  if (typeof window !== 'undefined') {
    analytics.pageView(document.title, window.location.href);
  }
};

// Consent management
export const setAnalyticsConsent = (granted: boolean) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: granted ? 'granted' : 'denied',
      ad_storage: granted ? 'granted' : 'denied',
    });
  }
};

// Initialize analytics
export const initializeAnalytics = () => {
  if (typeof window === 'undefined' || !process.env.NEXT_PUBLIC_GA_ID) {
    return;
  }

  // Load Google Analytics
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };

  window.gtag('js', new Date());
  window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
    page_title: document.title,
    page_location: window.location.href,
  });

  // Set default consent
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
  });
};