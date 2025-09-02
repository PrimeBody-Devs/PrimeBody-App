export interface LandingPageContent {
  hero: HeroContent;
  features: Feature[];
  demo: DemoContent;
  cta: CTAContent;
  footer: FooterContent;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  ctaText: string;
  backgroundImage?: string;
}

export interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
  highlight?: string;
}

export interface DemoContent {
  title: string;
  description: string;
  screenshots: Screenshot[];
  videoUrl?: string;
}

export interface Screenshot {
  id: string;
  url: string;
  alt: string;
  title: string;
}

export interface CTAContent {
  title: string;
  description: string;
  primaryText: string;
  secondaryText?: string;
  urgency?: UrgencyMessage;
}

export interface UrgencyMessage {
  enabled: boolean;
  message: string;
}

export interface FooterContent {
  links: FooterLinkCategory[];
  socialLinks: SocialLink[];
  copyright: string;
  newsletter?: NewsletterConfig;
}

export interface FooterLinkCategory {
  category: string;
  items: FooterLink[];
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface SocialLink {
  platform: 'twitter' | 'farcaster' | 'discord' | 'github' | 'linkedin' | 'youtube';
  url: string;
  label: string;
}

export interface NewsletterConfig {
  enabled: boolean;
  title: string;
  description: string;
  placeholder: string;
  buttonText: string;
}

// Environment Configuration Types
export interface EnvironmentConfig {
  app: AppConfig;
  web3: Web3Config;
  analytics: AnalyticsConfig;
  api: APIConfig;
  features: FeatureFlags;
}

export interface AppConfig {
  name: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  baseUrl: string;
  supportEmail: string;
}

export interface Web3Config {
  chainId: number;
  rpcUrl: string;
  contractAddress?: string;
  tokenSymbol: string;
  explorerUrl: string;
}

export interface AnalyticsConfig {
  googleAnalyticsId?: string;
  mixpanelToken?: string;
  hotjarId?: string;
  enabled: boolean;
}

export interface APIConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
}

export interface FeatureFlags {
  enableWeb3Integration: boolean;
  enableAnalytics: boolean;
  enableNewsletter: boolean;
  enableDemoVideo: boolean;
  enableUrgencyMessages: boolean;
  enableDarkMode: boolean;
}

// Content Validation Types
export interface ContentValidationResult {
  isValid: boolean;
  errors: ContentValidationError[];
  warnings: ContentValidationWarning[];
}

export interface ContentValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ContentValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

// Content Loading Types
export interface ContentLoadingState {
  isLoading: boolean;
  error?: string;
  lastUpdated?: Date;
}

export interface ContentSource {
  type: 'static' | 'cms' | 'api';
  url?: string;
  fallback?: LandingPageContent;
}