import { EnvironmentConfig } from '@/types/content';
import { validateEnvironmentConfig } from '@/config/environment';

export interface ConfigValidationReport {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  recommendations: string[];
}

export const validateConfiguration = (): ConfigValidationReport => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];

  // Validate environment configuration
  const envValidation = validateEnvironmentConfig();
  if (!envValidation.isValid) {
    errors.push(...envValidation.errors);
  }

  // Check for missing optional but recommended environment variables
  const optionalEnvVars = [
    'NEXT_PUBLIC_GA_ID',
    'NEXT_PUBLIC_MIXPANEL_TOKEN',
    'SUPPORT_EMAIL'
  ];

  optionalEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
      warnings.push(`Optional environment variable ${envVar} is not set`);
    }
  });

  // Production-specific validations
  if (process.env.NODE_ENV === 'production') {
    // Analytics should be enabled in production
    if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== 'true') {
      warnings.push('Analytics is disabled in production environment');
    }

    // GA ID should be set in production
    if (!process.env.NEXT_PUBLIC_GA_ID) {
      warnings.push('Google Analytics ID is not set in production');
    }

    // Base URL should be HTTPS in production
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (baseUrl && !baseUrl.startsWith('https://')) {
      errors.push('Base URL should use HTTPS in production');
    }

    // Contract address should be set in production if Web3 is enabled
    if (process.env.NEXT_PUBLIC_ENABLE_WEB3 === 'true' && !process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
      warnings.push('Contract address is not set but Web3 is enabled');
    }
  }

  // Development-specific recommendations
  if (process.env.NODE_ENV === 'development') {
    recommendations.push('Consider enabling analytics in development for testing');
    recommendations.push('Test with different feature flag combinations');
    recommendations.push('Validate all environment variables before deployment');
  }

  // Feature flag consistency checks
  const web3Enabled = process.env.NEXT_PUBLIC_ENABLE_WEB3 === 'true';
  const hasRpcUrl = !!process.env.NEXT_PUBLIC_RPC_URL;
  const hasChainId = !!process.env.NEXT_PUBLIC_CHAIN_ID;

  if (web3Enabled && (!hasRpcUrl || !hasChainId)) {
    errors.push('Web3 is enabled but RPC URL or Chain ID is missing');
  }

  // URL format validations
  const urlFields = [
    { key: 'NEXT_PUBLIC_BASE_URL', name: 'Base URL' },
    { key: 'NEXT_PUBLIC_RPC_URL', name: 'RPC URL' },
    { key: 'API_BASE_URL', name: 'API Base URL' }
  ];

  urlFields.forEach(({ key, name }) => {
    const url = process.env[key];
    if (url) {
      try {
        new URL(url);
      } catch {
        errors.push(`Invalid ${name} format: ${url}`);
      }
    }
  });

  // Numeric field validations
  const numericFields = [
    { key: 'NEXT_PUBLIC_CHAIN_ID', name: 'Chain ID', min: 1 },
    { key: 'API_TIMEOUT', name: 'API Timeout', min: 1000 },
    { key: 'API_RETRY_ATTEMPTS', name: 'API Retry Attempts', min: 0, max: 10 }
  ];

  numericFields.forEach(({ key, name, min, max }) => {
    const value = process.env[key];
    if (value) {
      const num = parseInt(value, 10);
      if (isNaN(num)) {
        errors.push(`${name} must be a valid number: ${value}`);
      } else {
        if (min !== undefined && num < min) {
          errors.push(`${name} must be at least ${min}: ${num}`);
        }
        if (max !== undefined && num > max) {
          errors.push(`${name} must be at most ${max}: ${num}`);
        }
      }
    }
  });

  // Security recommendations
  if (process.env.NODE_ENV === 'production') {
    recommendations.push('Ensure all sensitive environment variables are properly secured');
    recommendations.push('Use environment-specific configurations for different deployment stages');
    recommendations.push('Regularly rotate API keys and secrets');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    recommendations
  };
};

// Configuration health check
export const performConfigHealthCheck = (): {
  status: 'healthy' | 'warning' | 'error';
  report: ConfigValidationReport;
} => {
  const report = validateConfiguration();
  
  let status: 'healthy' | 'warning' | 'error';
  
  if (report.errors.length > 0) {
    status = 'error';
  } else if (report.warnings.length > 0) {
    status = 'warning';
  } else {
    status = 'healthy';
  }

  return { status, report };
};

// Environment-specific configuration suggestions
export const getEnvironmentSuggestions = (environment: string): string[] => {
  const suggestions: string[] = [];

  switch (environment) {
    case 'development':
      suggestions.push('Enable debug logging for better development experience');
      suggestions.push('Use local API endpoints for faster development');
      suggestions.push('Consider disabling analytics to avoid test data');
      break;

    case 'staging':
      suggestions.push('Enable analytics to test tracking implementation');
      suggestions.push('Use staging-specific API endpoints');
      suggestions.push('Test with production-like feature flag settings');
      break;

    case 'production':
      suggestions.push('Enable all analytics and monitoring');
      suggestions.push('Use production API endpoints with proper authentication');
      suggestions.push('Ensure all feature flags are properly configured');
      suggestions.push('Monitor performance and error rates');
      break;
  }

  return suggestions;
};

// Configuration export for debugging
export const exportConfiguration = () => {
  const config = {
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    variables: Object.keys(process.env)
      .filter(key => key.startsWith('NEXT_PUBLIC_') || key.startsWith('API_'))
      .reduce((acc, key) => {
        // Mask sensitive values
        const value = process.env[key];
        const maskedValue = key.toLowerCase().includes('secret') || 
                           key.toLowerCase().includes('key') || 
                           key.toLowerCase().includes('token')
          ? '***MASKED***'
          : value;
        
        acc[key] = maskedValue;
        return acc;
      }, {} as Record<string, string | undefined>)
  };

  return config;
};