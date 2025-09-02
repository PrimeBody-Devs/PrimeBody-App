import { EnvironmentConfig } from '@/types/content';

// Environment variable validation and defaults
const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || defaultValue!;
};

const getEnvVarOptional = (key: string, defaultValue?: string): string | undefined => {
  return process.env[key] || defaultValue;
};

const getBooleanEnvVar = (key: string, defaultValue: boolean = false): boolean => {
  const value = process.env[key];
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
};

const getNumberEnvVar = (key: string, defaultValue: number): number => {
  const value = process.env[key];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

// Environment-specific configurations
const developmentConfig: EnvironmentConfig = {
  app: {
    name: 'PrimeBody',
    version: getEnvVar('NEXT_PUBLIC_APP_VERSION', '1.0.0'),
    environment: 'development',
    baseUrl: getEnvVar('NEXT_PUBLIC_BASE_URL', 'http://localhost:3000'),
    supportEmail: getEnvVar('SUPPORT_EMAIL', 'support@primebody.app')
  },
  web3: {
    chainId: getNumberEnvVar('NEXT_PUBLIC_CHAIN_ID', 8453), // Base mainnet
    rpcUrl: getEnvVar('NEXT_PUBLIC_RPC_URL', 'https://mainnet.base.org'),
    contractAddress: getEnvVarOptional('NEXT_PUBLIC_CONTRACT_ADDRESS'),
    tokenSymbol: 'PRIME',
    explorerUrl: getEnvVar('NEXT_PUBLIC_EXPLORER_URL', 'https://basescan.org')
  },
  analytics: {
    googleAnalyticsId: getEnvVarOptional('NEXT_PUBLIC_GA_ID'),
    mixpanelToken: getEnvVarOptional('NEXT_PUBLIC_MIXPANEL_TOKEN'),
    hotjarId: getEnvVarOptional('NEXT_PUBLIC_HOTJAR_ID'),
    enabled: getBooleanEnvVar('NEXT_PUBLIC_ANALYTICS_ENABLED', false)
  },
  api: {
    baseUrl: getEnvVar('API_BASE_URL', 'http://localhost:3001/api'),
    timeout: getNumberEnvVar('API_TIMEOUT', 10000),
    retryAttempts: getNumberEnvVar('API_RETRY_ATTEMPTS', 3)
  },
  features: {
    enableWeb3Integration: getBooleanEnvVar('NEXT_PUBLIC_ENABLE_WEB3', true),
    enableAnalytics: getBooleanEnvVar('NEXT_PUBLIC_ENABLE_ANALYTICS', false),
    enableNewsletter: getBooleanEnvVar('NEXT_PUBLIC_ENABLE_NEWSLETTER', true),
    enableDemoVideo: getBooleanEnvVar('NEXT_PUBLIC_ENABLE_DEMO_VIDEO', true),
    enableUrgencyMessages: getBooleanEnvVar('NEXT_PUBLIC_ENABLE_URGENCY', true),
    enableDarkMode: getBooleanEnvVar('NEXT_PUBLIC_ENABLE_DARK_MODE', true)
  }
};

const stagingConfig: EnvironmentConfig = {
  ...developmentConfig,
  app: {
    ...developmentConfig.app,
    environment: 'staging',
    baseUrl: getEnvVar('NEXT_PUBLIC_BASE_URL', 'https://staging.primebody.app')
  },
  analytics: {
    ...developmentConfig.analytics,
    enabled: getBooleanEnvVar('NEXT_PUBLIC_ANALYTICS_ENABLED', true)
  }
};

const productionConfig: EnvironmentConfig = {
  ...developmentConfig,
  app: {
    ...developmentConfig.app,
    environment: 'production',
    baseUrl: getEnvVar('NEXT_PUBLIC_BASE_URL', 'https://primebody.app')
  },
  analytics: {
    ...developmentConfig.analytics,
    enabled: getBooleanEnvVar('NEXT_PUBLIC_ANALYTICS_ENABLED', true)
  },
  api: {
    ...developmentConfig.api,
    baseUrl: getEnvVar('API_BASE_URL', 'https://api.primebody.app')
  }
};

// Export the appropriate configuration based on NODE_ENV
const getEnvironmentConfig = (): EnvironmentConfig => {
  const env = process.env.NODE_ENV || 'development';
  
  switch (env) {
    case 'production':
      return productionConfig;
    case 'staging':
      return stagingConfig;
    case 'development':
    default:
      return developmentConfig;
  }
};

export const environmentConfig = getEnvironmentConfig();

// Utility functions for accessing config values
export const isProduction = () => environmentConfig.app.environment === 'production';
export const isStaging = () => environmentConfig.app.environment === 'staging';
export const isDevelopment = () => environmentConfig.app.environment === 'development';

// Feature flag helpers
export const isFeatureEnabled = (feature: keyof EnvironmentConfig['features']): boolean => {
  return environmentConfig.features[feature];
};

// Validation function for environment configuration
export const validateEnvironmentConfig = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Required fields validation
  if (!environmentConfig.app.name) {
    errors.push('App name is required');
  }
  
  if (!environmentConfig.app.baseUrl) {
    errors.push('Base URL is required');
  }
  
  if (!environmentConfig.web3.rpcUrl) {
    errors.push('RPC URL is required');
  }
  
  // URL validation
  try {
    new URL(environmentConfig.app.baseUrl);
  } catch {
    errors.push('Invalid base URL format');
  }
  
  try {
    new URL(environmentConfig.web3.rpcUrl);
  } catch {
    errors.push('Invalid RPC URL format');
  }
  
  // Chain ID validation
  if (environmentConfig.web3.chainId <= 0) {
    errors.push('Invalid chain ID');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};