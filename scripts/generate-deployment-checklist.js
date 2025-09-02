#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class DeploymentChecklistGenerator {
  constructor() {
    this.projectRoot = process.cwd();
    this.checklist = [];
    this.warnings = [];
    this.errors = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: '📋',
      success: '✅',
      warning: '⚠️',
      error: '❌',
    }[type] || 'ℹ️';
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  checkFile(filePath, description) {
    const fullPath = path.join(this.projectRoot, filePath);
    const exists = fs.existsSync(fullPath);
    
    this.checklist.push({
      category: 'Files',
      item: description,
      status: exists ? 'pass' : 'fail',
      path: filePath,
      required: true
    });

    if (!exists) {
      this.errors.push(`Missing file: ${filePath}`);
    }

    return exists;
  }

  checkOptionalFile(filePath, description) {
    const fullPath = path.join(this.projectRoot, filePath);
    const exists = fs.existsSync(fullPath);
    
    this.checklist.push({
      category: 'Optional Files',
      item: description,
      status: exists ? 'pass' : 'warning',
      path: filePath,
      required: false
    });

    if (!exists) {
      this.warnings.push(`Optional file missing: ${filePath}`);
    }

    return exists;
  }

  checkEnvironmentVariable(varName, description, required = true) {
    const exists = !!process.env[varName];
    
    this.checklist.push({
      category: 'Environment Variables',
      item: description,
      status: exists ? 'pass' : (required ? 'fail' : 'warning'),
      variable: varName,
      required
    });

    if (!exists && required) {
      this.errors.push(`Missing required environment variable: ${varName}`);
    } else if (!exists && !required) {
      this.warnings.push(`Optional environment variable not set: ${varName}`);
    }

    return exists;
  }

  checkPackageScript(scriptName, description) {
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
      this.errors.push('package.json not found');
      return false;
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const exists = !!(packageJson.scripts && packageJson.scripts[scriptName]);
    
    this.checklist.push({
      category: 'Package Scripts',
      item: description,
      status: exists ? 'pass' : 'warning',
      script: scriptName,
      required: false
    });

    if (!exists) {
      this.warnings.push(`Package script not found: ${scriptName}`);
    }

    return exists;
  }

  checkDependency(depName, description, devDep = false) {
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
      return false;
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const deps = devDep ? packageJson.devDependencies : packageJson.dependencies;
    const exists = !!(deps && deps[depName]);
    
    this.checklist.push({
      category: devDep ? 'Dev Dependencies' : 'Dependencies',
      item: description,
      status: exists ? 'pass' : 'warning',
      dependency: depName,
      required: false
    });

    if (!exists) {
      this.warnings.push(`${devDep ? 'Dev d' : 'D'}ependency not found: ${depName}`);
    }

    return exists;
  }

  runAllChecks() {
    this.log('Generating deployment checklist...', 'info');

    // Essential Files
    this.checkFile('package.json', 'Package configuration');
    this.checkFile('next.config.js', 'Next.js configuration');
    this.checkFile('tailwind.config.js', 'Tailwind CSS configuration');
    this.checkFile('tsconfig.json', 'TypeScript configuration');
    this.checkFile('.gitignore', 'Git ignore file');
    this.checkFile('README.md', 'Project documentation');

    // Source Files
    this.checkFile('src/app/layout.tsx', 'Root layout component');
    this.checkFile('src/app/page.tsx', 'Home page component');
    this.checkFile('src/app/globals.css', 'Global styles');

    // Configuration Files
    this.checkOptionalFile('.env.example', 'Environment variables example');
    this.checkOptionalFile('.env.production', 'Production environment template');
    this.checkOptionalFile('lighthouse.config.js', 'Lighthouse configuration');
    this.checkOptionalFile('jest.config.js', 'Jest configuration');
    this.checkOptionalFile('jest.setup.js', 'Jest setup file');

    // SEO Files
    this.checkFile('public/robots.txt', 'Robots.txt for SEO');
    this.checkFile('public/sitemap.xml', 'Sitemap for SEO');
    this.checkOptionalFile('public/favicon.ico', 'Favicon');
    this.checkOptionalFile('public/manifest.json', 'Web app manifest');

    // Required Environment Variables
    this.checkEnvironmentVariable('NEXT_PUBLIC_BASE_URL', 'Base URL for the application');
    this.checkEnvironmentVariable('NEXT_PUBLIC_CHAIN_ID', 'Blockchain chain ID');
    this.checkEnvironmentVariable('NEXT_PUBLIC_RPC_URL', 'RPC endpoint URL');

    // Optional Environment Variables
    this.checkEnvironmentVariable('NEXT_PUBLIC_GA_ID', 'Google Analytics ID', false);
    this.checkEnvironmentVariable('NEXT_PUBLIC_MIXPANEL_TOKEN', 'Mixpanel token', false);
    this.checkEnvironmentVariable('SUPPORT_EMAIL', 'Support email address', false);

    // Package Scripts
    this.checkPackageScript('build', 'Production build script');
    this.checkPackageScript('start', 'Production start script');
    this.checkPackageScript('test', 'Test script');
    this.checkPackageScript('lint', 'Linting script');
    this.checkPackageScript('type-check', 'TypeScript checking script');
    this.checkPackageScript('optimize', 'Production optimization script');

    // Essential Dependencies
    this.checkDependency('next', 'Next.js framework');
    this.checkDependency('react', 'React library');
    this.checkDependency('react-dom', 'React DOM');
    this.checkDependency('tailwindcss', 'Tailwind CSS', true);
    this.checkDependency('typescript', 'TypeScript', true);

    // Optional Dependencies
    this.checkDependency('framer-motion', 'Animation library', false);
    this.checkDependency('lucide-react', 'Icon library', false);
    this.checkDependency('next-themes', 'Theme management', false);
    this.checkDependency('web-vitals', 'Performance monitoring', true);
    this.checkDependency('@testing-library/react', 'Testing utilities', true);

    this.generateReport();
  }

  generateReport() {
    const timestamp = new Date().toISOString();
    const totalChecks = this.checklist.length;
    const passedChecks = this.checklist.filter(item => item.status === 'pass').length;
    const failedChecks = this.checklist.filter(item => item.status === 'fail').length;
    const warningChecks = this.checklist.filter(item => item.status === 'warning').length;

    const report = `# PrimeBody Deployment Checklist

Generated on: ${timestamp}
Environment: ${process.env.NODE_ENV || 'development'}

## Summary

- **Total Checks**: ${totalChecks}
- **Passed**: ${passedChecks} ✅
- **Failed**: ${failedChecks} ❌
- **Warnings**: ${warningChecks} ⚠️

## Pre-Deployment Checklist

### 🏗️ Build & Configuration

${this.generateChecklistSection('Files')}
${this.generateChecklistSection('Optional Files')}

### 🔧 Environment & Configuration

${this.generateChecklistSection('Environment Variables')}

### 📦 Dependencies & Scripts

${this.generateChecklistSection('Dependencies')}
${this.generateChecklistSection('Dev Dependencies')}
${this.generateChecklistSection('Package Scripts')}

### 🚀 Deployment Steps

- [ ] Run \`npm run optimize\` to check production readiness
- [ ] Run \`npm run test\` to ensure all tests pass
- [ ] Run \`npm run build\` to create production build
- [ ] Run \`npm run lighthouse:ci\` to check performance scores
- [ ] Verify all environment variables are set for production
- [ ] Test the production build locally with \`npm run start\`
- [ ] Check cross-browser compatibility
- [ ] Verify responsive design on different devices
- [ ] Test all interactive elements and forms
- [ ] Validate SEO meta tags and structured data
- [ ] Ensure analytics and monitoring are configured
- [ ] Set up error tracking and logging
- [ ] Configure CDN and caching if applicable
- [ ] Set up SSL certificate and HTTPS redirect
- [ ] Configure domain and DNS settings
- [ ] Set up monitoring and alerting
- [ ] Prepare rollback plan
- [ ] Document deployment process
- [ ] Schedule deployment during low-traffic period
- [ ] Notify team members about deployment

### 🔍 Post-Deployment Verification

- [ ] Verify homepage loads correctly
- [ ] Test all navigation links
- [ ] Check responsive design on mobile and desktop
- [ ] Verify theme switching functionality
- [ ] Test form submissions and CTAs
- [ ] Check analytics tracking
- [ ] Verify SEO meta tags in browser
- [ ] Test social media sharing
- [ ] Check Core Web Vitals scores
- [ ] Monitor error logs for issues
- [ ] Verify SSL certificate is working
- [ ] Test from different geographic locations
- [ ] Check search engine indexing
- [ ] Monitor performance metrics
- [ ] Verify backup and monitoring systems

### 🎯 Performance Targets

- [ ] Lighthouse Performance Score: ≥ 90
- [ ] Lighthouse Accessibility Score: ≥ 95
- [ ] Lighthouse Best Practices Score: ≥ 90
- [ ] Lighthouse SEO Score: ≥ 95
- [ ] First Contentful Paint (FCP): ≤ 1.5s
- [ ] Largest Contentful Paint (LCP): ≤ 2.5s
- [ ] Cumulative Layout Shift (CLS): ≤ 0.1
- [ ] First Input Delay (FID): ≤ 100ms
- [ ] Time to First Byte (TTFB): ≤ 800ms

### 🔒 Security Checklist

- [ ] HTTPS is enforced
- [ ] Security headers are configured
- [ ] Content Security Policy is set
- [ ] No sensitive data in client-side code
- [ ] API keys are properly secured
- [ ] Input validation is implemented
- [ ] XSS protection is enabled
- [ ] CSRF protection is configured
- [ ] Rate limiting is implemented
- [ ] Error messages don't leak sensitive info

### 📊 Monitoring & Analytics

- [ ] Google Analytics is configured
- [ ] Error tracking is set up (Sentry, etc.)
- [ ] Performance monitoring is active
- [ ] Uptime monitoring is configured
- [ ] Log aggregation is set up
- [ ] Alerting rules are defined
- [ ] Dashboard for key metrics
- [ ] Backup and recovery procedures

## Issues to Address

### ❌ Critical Issues (Must Fix)

${this.errors.map(error => `- ${error}`).join('\n')}

### ⚠️ Warnings (Should Fix)

${this.warnings.map(warning => `- ${warning}`).join('\n')}

## Deployment Commands

\`\`\`bash
# Pre-deployment checks
npm run optimize
npm run test
npm run lighthouse:ci

# Build for production
npm run build

# Start production server (for testing)
npm run start

# Deploy (platform-specific)
# For Vercel: vercel --prod
# For Netlify: netlify deploy --prod
# For Cloudflare Pages: npm run deploy:cloudflare
\`\`\`

## Environment Variables Checklist

Copy the following to your production environment:

\`\`\`bash
# Required
NEXT_PUBLIC_BASE_URL=https://primebody.app
NEXT_PUBLIC_CHAIN_ID=8453
NEXT_PUBLIC_RPC_URL=https://mainnet.base.org

# Optional but recommended
NEXT_PUBLIC_GA_ID=your-ga-id
NEXT_PUBLIC_MIXPANEL_TOKEN=your-mixpanel-token
SUPPORT_EMAIL=support@primebody.app
NEXT_PUBLIC_ANALYTICS_ENABLED=true
\`\`\`

---

**Status**: ${failedChecks === 0 ? '🟢 Ready for deployment' : '🔴 Issues need to be resolved'}

${failedChecks === 0 ? 
  '✅ All critical checks passed! The application is ready for production deployment.' : 
  `❌ ${failedChecks} critical issue(s) found. Please resolve before deploying.`}
`;

    // Write the report
    const reportPath = path.join(this.projectRoot, 'DEPLOYMENT_CHECKLIST.md');
    fs.writeFileSync(reportPath, report);

    this.log(`Deployment checklist generated: ${reportPath}`, 'success');
    this.log(`Status: ${failedChecks === 0 ? 'Ready for deployment' : 'Issues need resolution'}`, 
             failedChecks === 0 ? 'success' : 'error');

    return {
      totalChecks,
      passedChecks,
      failedChecks,
      warningChecks,
      ready: failedChecks === 0
    };
  }

  generateChecklistSection(category) {
    const items = this.checklist.filter(item => item.category === category);
    if (items.length === 0) return '';

    return items.map(item => {
      const status = item.status === 'pass' ? '✅' : 
                    item.status === 'fail' ? '❌' : '⚠️';
      const required = item.required ? ' (Required)' : ' (Optional)';
      return `- [${item.status === 'pass' ? 'x' : ' '}] ${item.item}${required} ${status}`;
    }).join('\n');
  }
}

// CLI interface
if (require.main === module) {
  const generator = new DeploymentChecklistGenerator();
  const result = generator.runAllChecks();
  
  process.exit(result.ready ? 0 : 1);
}

module.exports = DeploymentChecklistGenerator;