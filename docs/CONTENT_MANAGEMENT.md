# PrimeBody Content Management System

This document explains how to manage and configure content for the PrimeBody landing page.

## Overview

The content management system provides a structured way to manage all text, images, and configuration for the PrimeBody landing page. It includes:

- **Content Configuration**: Centralized content definitions
- **TypeScript Interfaces**: Type-safe content structures  
- **Environment Configuration**: Environment-specific settings
- **Validation Utilities**: Content and configuration validation
- **CLI Tools**: Command-line utilities for content management

## File Structure

```
src/
├── config/
│   ├── content.ts          # Main content configuration
│   └── environment.ts      # Environment configuration
├── types/
│   └── content.ts         # TypeScript interfaces
├── hooks/
│   └── use-content.ts     # React hooks for content
├── lib/
│   ├── content-utils.ts   # Content utilities
│   └── config-validator.ts # Configuration validation
└── scripts/
    └── content-manager.js  # CLI management tool
```

## Content Configuration

### Main Content File

The main content is defined in `src/config/content.ts`:

```typescript
import { LandingPageContent } from '@/types/content';

export const landingPageContent: LandingPageContent = {
  hero: {
    title: "Transforma tu cuerpo con PrimeBody",
    subtitle: "Únete a desafíos fitness diarios...",
    ctaText: "Comenzar Transformación",
    backgroundImage: "/images/hero-bg.jpg"
  },
  features: [
    {
      id: "daily-challenges",
      icon: "Trophy",
      title: "Desafíos Diarios",
      description: "Completa rutinas personalizadas...",
      highlight: "Gana tokens diariamente"
    }
    // ... more features
  ],
  // ... other sections
};
```

### Content Sections

#### Hero Section
- **title**: Main headline (recommended: < 60 characters)
- **subtitle**: Supporting text (recommended: < 160 characters)  
- **ctaText**: Call-to-action button text
- **backgroundImage**: Optional hero background image

#### Features Section
- **id**: Unique identifier for the feature
- **icon**: Icon name (string reference)
- **title**: Feature title
- **description**: Feature description
- **highlight**: Optional highlight text

#### Demo Section
- **title**: Demo section title
- **description**: Demo description
- **screenshots**: Array of screenshot objects
- **videoUrl**: Optional demo video URL

#### CTA Section
- **title**: Call-to-action title
- **description**: Supporting text
- **primaryText**: Primary button text
- **secondaryText**: Optional secondary button text
- **urgency**: Optional urgency message configuration

#### Footer Section
- **links**: Organized footer links by category
- **socialLinks**: Social media links
- **copyright**: Copyright text
- **newsletter**: Optional newsletter signup configuration

## Environment Configuration

### Environment Variables

Create a `.env.local` file based on `.env.example`:

```bash
# App Configuration
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_BASE_URL=http://localhost:3000
SUPPORT_EMAIL=support@primebody.app

# Web3 Configuration
NEXT_PUBLIC_CHAIN_ID=8453
NEXT_PUBLIC_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_CONTRACT_ADDRESS=
NEXT_PUBLIC_EXPLORER_URL=https://basescan.org

# Analytics Configuration
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_MIXPANEL_TOKEN=
NEXT_PUBLIC_ANALYTICS_ENABLED=false

# Feature Flags
NEXT_PUBLIC_ENABLE_WEB3=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_NEWSLETTER=true
NEXT_PUBLIC_ENABLE_DEMO_VIDEO=true
NEXT_PUBLIC_ENABLE_DARK_MODE=true
```

### Environment-Specific Configuration

The system automatically loads different configurations based on `NODE_ENV`:

- **Development**: Local development settings
- **Staging**: Staging environment settings  
- **Production**: Production environment settings

## Using Content in Components

### React Hooks

Use the provided hooks to access content in your components:

```typescript
import { useContent, useHeroContent, useFeaturesContent } from '@/hooks/use-content';

// Full content access
const { content, isLoading, error, refreshContent } = useContent();

// Section-specific hooks
const { hero } = useHeroContent();
const { features } = useFeaturesContent();
const { demo } = useDemoContent();
const { cta } = useCTAContent();
const { footer } = useFooterContent();
```

### Content Loading Options

```typescript
const { content } = useContent({
  source: { type: 'static' }, // or 'api', 'cms'
  enableCaching: true,
  validateOnLoad: true,
  sanitizeOnLoad: true
});
```

## Content Validation

### Automatic Validation

Content is automatically validated when loaded. The validation checks:

- Required fields are present
- Content length recommendations
- URL format validation
- Image URL accessibility

### Manual Validation

```typescript
import { validateContent } from '@/lib/content-utils';

const validation = validateContent(content);
if (!validation.isValid) {
  console.error('Validation errors:', validation.errors);
}
```

## CLI Management Tools

### Available Commands

```bash
# Validate content structure
npm run content:validate

# Check environment configuration  
npm run content:check-env

# Show content statistics
npm run content:stats

# Run complete health check
npm run content:health

# Generate content template
npm run content:template

# Generate environment template
npm run content:env-template
```

### Health Check

Run a complete health check before deployment:

```bash
npm run content:health
```

This will validate:
- Content structure and required fields
- Environment variable configuration
- URL formats and accessibility
- Feature flag consistency

## Content Updates

### Updating Content

1. Edit `src/config/content.ts`
2. Run validation: `npm run content:validate`
3. Test changes locally
4. Deploy updates

### Adding New Sections

1. Update TypeScript interfaces in `src/types/content.ts`
2. Add content to `src/config/content.ts`
3. Create corresponding React hooks if needed
4. Update validation rules in `src/lib/content-utils.ts`

### Environment-Specific Content

For environment-specific content, use feature flags:

```typescript
import { isFeatureEnabled } from '@/config/environment';

const showUrgencyMessage = isFeatureEnabled('enableUrgencyMessages');
```

## Best Practices

### Content Guidelines

1. **Keep titles concise**: Hero titles should be under 60 characters
2. **Optimize descriptions**: Subtitles should be under 160 characters
3. **Use consistent tone**: Maintain brand voice throughout
4. **Test on mobile**: Ensure content works on all screen sizes
5. **Validate regularly**: Run health checks before deployments

### Performance Considerations

1. **Image optimization**: Use optimized images and proper formats
2. **Content caching**: Enable caching for better performance
3. **Lazy loading**: Use lazy loading for non-critical content
4. **Bundle size**: Keep content configuration reasonable in size

### Security

1. **Sanitize content**: Always sanitize user-generated content
2. **Validate URLs**: Ensure all URLs are valid and safe
3. **Environment variables**: Keep sensitive data in environment variables
4. **Content validation**: Validate all content before deployment

## Troubleshooting

### Common Issues

**Content not updating**
- Check if caching is enabled and clear cache
- Verify content file syntax
- Run validation to check for errors

**Environment variables not working**
- Ensure variables are prefixed with `NEXT_PUBLIC_` for client-side access
- Check `.env.local` file exists and has correct values
- Restart development server after changes

**Validation errors**
- Run `npm run content:validate` to see specific errors
- Check TypeScript interfaces match content structure
- Ensure all required fields are present

**Performance issues**
- Check image sizes and formats
- Verify content caching is enabled
- Monitor bundle size impact

### Getting Help

1. Run health check: `npm run content:health`
2. Check validation: `npm run content:validate`
3. Review content statistics: `npm run content:stats`
4. Check environment configuration: `npm run content:check-env`

## Migration Guide

### From Static Content

If migrating from hardcoded content:

1. Extract existing content to `src/config/content.ts`
2. Replace hardcoded strings with content hooks
3. Add TypeScript interfaces
4. Run validation and fix any issues

### Adding CMS Integration

To integrate with a CMS:

1. Update content source in hooks: `{ type: 'cms', url: 'your-cms-api' }`
2. Implement CMS-specific loading logic in `src/lib/content-utils.ts`
3. Add authentication and error handling
4. Test with fallback content

This content management system provides a robust foundation for managing PrimeBody's landing page content while maintaining type safety, validation, and performance.