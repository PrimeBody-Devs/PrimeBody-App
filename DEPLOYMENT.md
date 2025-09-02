# PrimeBody Deployment Guide

This guide provides comprehensive instructions for deploying the PrimeBody landing page to production.

## Quick Start

```bash
# 1. Check deployment readiness
npm run deploy:ready

# 2. Build for production
npm run build

# 3. Deploy to your platform
# (See platform-specific instructions below)
```

## Pre-Deployment Checklist

### 1. Environment Setup

Ensure all required environment variables are configured:

```bash
# Copy and configure environment variables
cp .env.example .env.local
# Edit .env.local with your production values
```

**Required Variables:**
- `NEXT_PUBLIC_BASE_URL` - Your production domain
- `NEXT_PUBLIC_CHAIN_ID` - Blockchain network ID (8453 for Base)
- `NEXT_PUBLIC_RPC_URL` - RPC endpoint URL

**Recommended Variables:**
- `NEXT_PUBLIC_GA_ID` - Google Analytics tracking ID
- `NEXT_PUBLIC_MIXPANEL_TOKEN` - Mixpanel analytics token
- `SUPPORT_EMAIL` - Support contact email

### 2. Quality Assurance

Run the complete test suite:

```bash
# Run all tests
npm test

# Check TypeScript compilation
npm run type-check

# Lint code
npm run lint

# Optimize for production
npm run optimize
```

### 3. Performance Validation

Ensure performance targets are met:

```bash
# Run Lighthouse CI
npm run lighthouse:ci

# Test cross-browser compatibility
npm run cross-browser

# Check Core Web Vitals
npm run optimize:vitals
```

**Performance Targets:**
- Lighthouse Performance: ≥ 90
- Lighthouse Accessibility: ≥ 95
- Lighthouse SEO: ≥ 95
- First Contentful Paint: ≤ 1.5s
- Largest Contentful Paint: ≤ 2.5s
- Cumulative Layout Shift: ≤ 0.1

## Platform-Specific Deployment

### Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Configure Environment Variables:**
   ```bash
   # Set environment variables in Vercel dashboard
   # or use CLI:
   vercel env add NEXT_PUBLIC_BASE_URL
   vercel env add NEXT_PUBLIC_CHAIN_ID
   vercel env add NEXT_PUBLIC_RPC_URL
   ```

3. **Deploy:**
   ```bash
   # Deploy to production
   vercel --prod
   ```

4. **Custom Domain:**
   ```bash
   # Add custom domain
   vercel domains add primebody.app
   ```

### Netlify

1. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`

2. **Environment Variables:**
   Set in Netlify dashboard under Site settings > Environment variables

3. **Deploy:**
   ```bash
   # Using Netlify CLI
   npm i -g netlify-cli
   netlify deploy --prod --dir=.next
   ```

### Cloudflare Pages

1. **Configure Build:**
   - Build command: `npm run build:cloudflare`
   - Output directory: `.next`

2. **Environment Variables:**
   Set in Cloudflare Pages dashboard

3. **Deploy:**
   ```bash
   # Build for Cloudflare
   npm run build:cloudflare
   
   # Deploy using Wrangler
   npx wrangler pages deploy .next
   ```

### AWS Amplify

1. **Connect Repository:**
   Connect your GitHub repository in AWS Amplify console

2. **Build Settings:**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

3. **Environment Variables:**
   Set in Amplify console under App settings > Environment variables

### Docker Deployment

1. **Create Dockerfile:**
   ```dockerfile
   FROM node:18-alpine AS deps
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production

   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY . .
   COPY --from=deps /app/node_modules ./node_modules
   RUN npm run build

   FROM node:18-alpine AS runner
   WORKDIR /app
   ENV NODE_ENV production
   
   COPY --from=builder /app/public ./public
   COPY --from=builder /app/.next/standalone ./
   COPY --from=builder /app/.next/static ./.next/static

   EXPOSE 3000
   ENV PORT 3000

   CMD ["node", "server.js"]
   ```

2. **Build and Run:**
   ```bash
   # Build Docker image
   docker build -t primebody-landing .
   
   # Run container
   docker run -p 3000:3000 primebody-landing
   ```

## Post-Deployment Verification

### 1. Functional Testing

```bash
# Test all critical paths
curl -I https://primebody.app
curl -I https://primebody.app/robots.txt
curl -I https://primebody.app/sitemap.xml
```

### 2. Performance Monitoring

- Monitor Core Web Vitals in Google Search Console
- Set up alerts for performance degradation
- Monitor error rates and response times

### 3. SEO Verification

- Submit sitemap to Google Search Console
- Verify meta tags and structured data
- Test social media sharing

### 4. Analytics Setup

- Verify Google Analytics tracking
- Test conversion tracking
- Set up custom events and goals

## Monitoring & Maintenance

### Performance Monitoring

1. **Set up monitoring tools:**
   - Google Analytics for user behavior
   - Google Search Console for SEO
   - Lighthouse CI for performance regression
   - Error tracking (Sentry, LogRocket, etc.)

2. **Key metrics to monitor:**
   - Page load times
   - Core Web Vitals
   - Conversion rates
   - Error rates
   - User engagement

### Regular Maintenance

1. **Weekly:**
   - Review performance metrics
   - Check for console errors
   - Monitor conversion rates

2. **Monthly:**
   - Update dependencies
   - Run security audits
   - Review and optimize images
   - Check for broken links

3. **Quarterly:**
   - Performance audit
   - SEO review
   - Accessibility audit
   - User experience review

## Troubleshooting

### Common Issues

1. **Build Failures:**
   ```bash
   # Clear cache and rebuild
   rm -rf .next node_modules
   npm install
   npm run build
   ```

2. **Environment Variable Issues:**
   ```bash
   # Check environment variables
   npm run optimize:env
   ```

3. **Performance Issues:**
   ```bash
   # Analyze bundle size
   npm run analyze
   
   # Check Core Web Vitals
   npm run optimize:vitals
   ```

4. **SEO Issues:**
   ```bash
   # Validate SEO configuration
   npm run optimize:seo
   ```

### Rollback Procedure

1. **Immediate Rollback:**
   - Revert to previous deployment in platform dashboard
   - Or deploy previous Git commit

2. **Database Rollback (if applicable):**
   - Restore from backup
   - Run migration rollback scripts

3. **DNS Rollback:**
   - Update DNS records if needed
   - Clear CDN cache

## Security Considerations

### SSL/TLS Configuration

- Ensure HTTPS is enforced
- Configure security headers
- Set up Content Security Policy
- Enable HSTS

### Environment Security

- Never commit secrets to Git
- Use environment variables for sensitive data
- Rotate API keys regularly
- Monitor for security vulnerabilities

### Content Security

- Sanitize user inputs
- Validate all data
- Implement rate limiting
- Monitor for suspicious activity

## Performance Optimization

### Image Optimization

- Use WebP format with fallbacks
- Implement lazy loading
- Optimize image sizes
- Use responsive images

### Code Optimization

- Enable code splitting
- Minimize bundle size
- Use tree shaking
- Implement caching strategies

### CDN Configuration

- Set up CDN for static assets
- Configure cache headers
- Enable compression
- Use edge locations

## Support & Documentation

### Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Lighthouse Performance Guide](https://web.dev/lighthouse-performance/)
- [Core Web Vitals](https://web.dev/vitals/)

### Getting Help

- Check the troubleshooting section above
- Review deployment logs
- Contact the development team
- Submit issues on GitHub

---

## Deployment Checklist Summary

- [ ] Environment variables configured
- [ ] Tests passing
- [ ] Performance targets met
- [ ] Security headers configured
- [ ] SEO optimization complete
- [ ] Analytics configured
- [ ] Monitoring set up
- [ ] Backup strategy in place
- [ ] Rollback plan documented
- [ ] Team notified of deployment

**Ready to deploy? Run `npm run deploy:ready` to verify everything is configured correctly.**