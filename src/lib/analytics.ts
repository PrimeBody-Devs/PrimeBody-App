// Analytics and tracking utilities for PrimeBody
'use client';

// Analytics event types
export interface AnalyticsEvent {
  name: string;
  category: 'engagement' | 'conversion' | 'navigation' | 'error' | 'performance';
  properties?: Record<string, any>;
  value?: number;
  timestamp?: number;
  userId?: string;
  sessionId?: string;
}

// User properties interface
export interface UserProperties {
  userId?: string;
  walletAddress?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  browser?: string;
  os?: string;
  language?: string;
  timezone?: string;
  firstVisit?: boolean;
  sessionCount?: number;
}

// Conversion events
export const CONVERSION_EVENTS = {
  // Primary conversions
  CTA_CLICK: 'cta_click',
  REGISTRATION_START: 'registration_start',
  REGISTRATION_COMPLETE: 'registration_complete',
  WALLET_CONNECT: 'wallet_connect',
  
  // Secondary conversions
  DEMO_VIEW: 'demo_view',
  FEATURE_EXPLORE: 'feature_explore',
  SOCIAL_SHARE: 'social_share',
  EMAIL_SIGNUP: 'email_signup',
  
  // Engagement
  SCROLL_DEPTH: 'scroll_depth',
  TIME_ON_PAGE: 'time_on_page',
  SECTION_VIEW: 'section_view',
  THEME_TOGGLE: 'theme_toggle',
} as const;

// Analytics providers configuration
interface AnalyticsProvider {
  name: string;
  enabled: boolean;
  config: Record<string, any>;
  track: (event: AnalyticsEvent) => Promise<void>;
  identify: (userId: string, properties: UserProperties) => Promise<void>;
  page: (pageName: string, properties?: Record<string, any>) => Promise<void>;
}

// Google Analytics 4 provider
const createGA4Provider = (): AnalyticsProvider => ({
  name: 'GA4',
  enabled: !!process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID,
  config: {
    measurementId: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID,
  },
  
  track: async (event: AnalyticsEvent) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.name, {
        event_category: event.category,
        event_label: event.properties?.label,
        value: event.value,
        custom_parameters: event.properties,
        user_id: event.userId,
      });
    }
  },
  
  identify: async (userId: string, properties: UserProperties) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID!, {
        user_id: userId,
        custom_map: properties,
      });
    }
  },
  
  page: async (pageName: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID!, {\n        page_title: pageName,\n        page_location: window.location.href,\n        ...properties,\n      });\n    }\n  },\n});\n\n// Plausible Analytics provider\nconst createPlausibleProvider = (): AnalyticsProvider => ({\n  name: 'Plausible',\n  enabled: !!process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,\n  config: {\n    domain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,\n  },\n  \n  track: async (event: AnalyticsEvent) => {\n    if (typeof window !== 'undefined' && window.plausible) {\n      window.plausible(event.name, {\n        props: {\n          category: event.category,\n          value: event.value,\n          ...event.properties,\n        },\n      });\n    }\n  },\n  \n  identify: async (userId: string, properties: UserProperties) => {\n    // Plausible doesn't have user identification, but we can track as custom event\n    if (typeof window !== 'undefined' && window.plausible) {\n      window.plausible('User Identified', {\n        props: {\n          userId,\n          ...properties,\n        },\n      });\n    }\n  },\n  \n  page: async (pageName: string, properties?: Record<string, any>) => {\n    if (typeof window !== 'undefined' && window.plausible) {\n      window.plausible('pageview', {\n        props: {\n          page: pageName,\n          ...properties,\n        },\n      });\n    }\n  },\n});\n\n// Custom analytics provider (for internal tracking)\nconst createCustomProvider = (): AnalyticsProvider => ({\n  name: 'Custom',\n  enabled: !!process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT,\n  config: {\n    endpoint: process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT,\n  },\n  \n  track: async (event: AnalyticsEvent) => {\n    try {\n      await fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT!, {\n        method: 'POST',\n        headers: {\n          'Content-Type': 'application/json',\n        },\n        body: JSON.stringify({\n          type: 'event',\n          event,\n          timestamp: Date.now(),\n        }),\n      });\n    } catch (error) {\n      console.error('Custom analytics error:', error);\n    }\n  },\n  \n  identify: async (userId: string, properties: UserProperties) => {\n    try {\n      await fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT!, {\n        method: 'POST',\n        headers: {\n          'Content-Type': 'application/json',\n        },\n        body: JSON.stringify({\n          type: 'identify',\n          userId,\n          properties,\n          timestamp: Date.now(),\n        }),\n      });\n    } catch (error) {\n      console.error('Custom analytics identify error:', error);\n    }\n  },\n  \n  page: async (pageName: string, properties?: Record<string, any>) => {\n    try {\n      await fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT!, {\n        method: 'POST',\n        headers: {\n          'Content-Type': 'application/json',\n        },\n        body: JSON.stringify({\n          type: 'page',\n          page: pageName,\n          properties,\n          timestamp: Date.now(),\n        }),\n      });\n    } catch (error) {\n      console.error('Custom analytics page error:', error);\n    }\n  },\n});\n\n// Analytics manager class\nclass AnalyticsManager {\n  private providers: AnalyticsProvider[] = [];\n  private userProperties: UserProperties = {};\n  private sessionId: string;\n  private isInitialized = false;\n  private eventQueue: AnalyticsEvent[] = [];\n  private consentGiven = false;\n\n  constructor() {\n    this.sessionId = this.generateSessionId();\n    this.initializeProviders();\n  }\n\n  private generateSessionId(): string {\n    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;\n  }\n\n  private initializeProviders() {\n    this.providers = [\n      createGA4Provider(),\n      createPlausibleProvider(),\n      createCustomProvider(),\n    ].filter(provider => provider.enabled);\n  }\n\n  // Initialize analytics with user consent\n  async initialize(consent: boolean = false) {\n    this.consentGiven = consent;\n    this.isInitialized = true;\n\n    // Set up user properties\n    await this.setupUserProperties();\n\n    // Process queued events if consent is given\n    if (this.consentGiven && this.eventQueue.length > 0) {\n      for (const event of this.eventQueue) {\n        await this.track(event.name, event.category, event.properties, event.value);\n      }\n      this.eventQueue = [];\n    }\n\n    // Track initialization\n    if (this.consentGiven) {\n      await this.track('analytics_initialized', 'engagement', {\n        providers: this.providers.map(p => p.name),\n        sessionId: this.sessionId,\n      });\n    }\n  }\n\n  // Set up user properties from browser and URL\n  private async setupUserProperties() {\n    if (typeof window === 'undefined') return;\n\n    const urlParams = new URLSearchParams(window.location.search);\n    \n    this.userProperties = {\n      referrer: document.referrer || 'direct',\n      utmSource: urlParams.get('utm_source') || undefined,\n      utmMedium: urlParams.get('utm_medium') || undefined,\n      utmCampaign: urlParams.get('utm_campaign') || undefined,\n      deviceType: this.getDeviceType(),\n      browser: this.getBrowser(),\n      os: this.getOS(),\n      language: navigator.language,\n      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,\n      firstVisit: !localStorage.getItem('primebody_visited'),\n      sessionCount: this.getSessionCount(),\n    };\n\n    // Mark as visited\n    if (!localStorage.getItem('primebody_visited')) {\n      localStorage.setItem('primebody_visited', 'true');\n      localStorage.setItem('primebody_first_visit', Date.now().toString());\n    }\n  }\n\n  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {\n    if (typeof window === 'undefined') return 'desktop';\n    \n    const width = window.innerWidth;\n    if (width < 768) return 'mobile';\n    if (width < 1024) return 'tablet';\n    return 'desktop';\n  }\n\n  private getBrowser(): string {\n    if (typeof navigator === 'undefined') return 'unknown';\n    \n    const userAgent = navigator.userAgent;\n    if (userAgent.includes('Chrome')) return 'Chrome';\n    if (userAgent.includes('Firefox')) return 'Firefox';\n    if (userAgent.includes('Safari')) return 'Safari';\n    if (userAgent.includes('Edge')) return 'Edge';\n    return 'Other';\n  }\n\n  private getOS(): string {\n    if (typeof navigator === 'undefined') return 'unknown';\n    \n    const userAgent = navigator.userAgent;\n    if (userAgent.includes('Windows')) return 'Windows';\n    if (userAgent.includes('Mac')) return 'macOS';\n    if (userAgent.includes('Linux')) return 'Linux';\n    if (userAgent.includes('Android')) return 'Android';\n    if (userAgent.includes('iOS')) return 'iOS';\n    return 'Other';\n  }\n\n  private getSessionCount(): number {\n    const count = localStorage.getItem('primebody_session_count');\n    const newCount = count ? parseInt(count) + 1 : 1;\n    localStorage.setItem('primebody_session_count', newCount.toString());\n    return newCount;\n  }\n\n  // Track an event\n  async track(\n    eventName: string,\n    category: AnalyticsEvent['category'],\n    properties?: Record<string, any>,\n    value?: number\n  ) {\n    const event: AnalyticsEvent = {\n      name: eventName,\n      category,\n      properties: {\n        ...properties,\n        sessionId: this.sessionId,\n        ...this.userProperties,\n      },\n      value,\n      timestamp: Date.now(),\n      userId: this.userProperties.userId,\n      sessionId: this.sessionId,\n    };\n\n    // Queue event if consent not given or not initialized\n    if (!this.consentGiven || !this.isInitialized) {\n      this.eventQueue.push(event);\n      return;\n    }\n\n    // Send to all enabled providers\n    await Promise.all(\n      this.providers.map(async (provider) => {\n        try {\n          await provider.track(event);\n        } catch (error) {\n          console.error(`Analytics error (${provider.name}):`, error);\n        }\n      })\n    );\n\n    // Log in development\n    if (process.env.NODE_ENV === 'development') {\n      console.log('📊 Analytics Event:', event);\n    }\n  }\n\n  // Identify a user\n  async identify(userId: string, properties?: Partial<UserProperties>) {\n    this.userProperties = {\n      ...this.userProperties,\n      userId,\n      ...properties,\n    };\n\n    if (!this.consentGiven || !this.isInitialized) return;\n\n    await Promise.all(\n      this.providers.map(async (provider) => {\n        try {\n          await provider.identify(userId, this.userProperties);\n        } catch (error) {\n          console.error(`Analytics identify error (${provider.name}):`, error);\n        }\n      })\n    );\n  }\n\n  // Track page view\n  async page(pageName: string, properties?: Record<string, any>) {\n    if (!this.consentGiven || !this.isInitialized) return;\n\n    await Promise.all(\n      this.providers.map(async (provider) => {\n        try {\n          await provider.page(pageName, {\n            ...properties,\n            ...this.userProperties,\n          });\n        } catch (error) {\n          console.error(`Analytics page error (${provider.name}):`, error);\n        }\n      })\n    );\n  }\n\n  // Update consent\n  async updateConsent(consent: boolean) {\n    this.consentGiven = consent;\n    \n    if (consent && this.eventQueue.length > 0) {\n      // Process queued events\n      for (const event of this.eventQueue) {\n        await this.track(event.name, event.category, event.properties, event.value);\n      }\n      this.eventQueue = [];\n    } else if (!consent) {\n      // Clear queued events if consent is revoked\n      this.eventQueue = [];\n    }\n  }\n\n  // Get analytics status\n  getStatus() {\n    return {\n      initialized: this.isInitialized,\n      consentGiven: this.consentGiven,\n      providers: this.providers.map(p => ({ name: p.name, enabled: p.enabled })),\n      queuedEvents: this.eventQueue.length,\n      sessionId: this.sessionId,\n      userProperties: this.userProperties,\n    };\n  }\n}\n\n// Global analytics instance\nexport const analytics = new AnalyticsManager();\n\n// Convenience functions for common events\nexport const trackConversion = {\n  ctaClick: (ctaText: string, location: string) => \n    analytics.track(CONVERSION_EVENTS.CTA_CLICK, 'conversion', { ctaText, location }),\n  \n  registrationStart: (method: string) => \n    analytics.track(CONVERSION_EVENTS.REGISTRATION_START, 'conversion', { method }),\n  \n  registrationComplete: (method: string, userId: string) => {\n    analytics.identify(userId);\n    return analytics.track(CONVERSION_EVENTS.REGISTRATION_COMPLETE, 'conversion', { method });\n  },\n  \n  walletConnect: (walletType: string, address: string) => {\n    analytics.identify(address, { walletAddress: address });\n    return analytics.track(CONVERSION_EVENTS.WALLET_CONNECT, 'conversion', { walletType });\n  },\n  \n  demoView: (demoType: string, duration?: number) => \n    analytics.track(CONVERSION_EVENTS.DEMO_VIEW, 'engagement', { demoType, duration }),\n  \n  featureExplore: (featureName: string) => \n    analytics.track(CONVERSION_EVENTS.FEATURE_EXPLORE, 'engagement', { featureName }),\n  \n  socialShare: (platform: string, content: string) => \n    analytics.track(CONVERSION_EVENTS.SOCIAL_SHARE, 'engagement', { platform, content }),\n  \n  scrollDepth: (depth: number, maxDepth: number) => \n    analytics.track(CONVERSION_EVENTS.SCROLL_DEPTH, 'engagement', { depth, maxDepth }),\n  \n  sectionView: (sectionName: string, timeSpent?: number) => \n    analytics.track(CONVERSION_EVENTS.SECTION_VIEW, 'engagement', { sectionName, timeSpent }),\n  \n  themeToggle: (theme: 'light' | 'dark') => \n    analytics.track(CONVERSION_EVENTS.THEME_TOGGLE, 'engagement', { theme }),\n};\n\n// Error tracking\nexport const trackError = (error: Error, context?: string) => {\n  analytics.track('error_occurred', 'error', {\n    errorMessage: error.message,\n    errorStack: error.stack,\n    context,\n  });\n};\n\n// Performance tracking\nexport const trackPerformance = (metric: string, value: number, unit: string) => {\n  analytics.track('performance_metric', 'performance', {\n    metric,\n    value,\n    unit,\n  });\n};\n\n// Initialize analytics on import (client-side only)\nif (typeof window !== 'undefined') {\n  // Check for stored consent\n  const storedConsent = localStorage.getItem('primebody_analytics_consent');\n  const consent = storedConsent === 'true';\n  \n  // Initialize with stored consent or wait for user decision\n  analytics.initialize(consent);\n}\n\n// Type declarations for global analytics\ndeclare global {\n  interface Window {\n    gtag: (...args: any[]) => void;\n    plausible: (event: string, options?: { props?: Record<string, any> }) => void;\n  }\n}"