#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ProductionOptimizer {
  constructor() {
    this.projectRoot = process.cwd();
    this.optimizations = [];
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
      progress: '🔄'
    }[type] || 'ℹ️';
    
    console.log(`${prefix} [${timestamp}] ${message}`);
    
    if (type === 'warning') this.warnings.push(message);
    if (type === 'error') this.errors.push(message);
  }

  // Check environment variables
  checkEnvironmentVariables() {
    this.log('Checking environment variables...', 'progress');
    
    const requiredVars = [
      'NEXT_PUBLIC_BASE_URL',
      'NEXT_PUBLIC_CHAIN_ID',
      'NEXT_PUBLIC_RPC_URL'
    ];

    const recommendedVars = [
      'NEXT_PUBLIC_GA_ID',
      'NEXT_PUBLIC_MIXPANEL_TOKEN',
      'SUPPORT_EMAIL'
    ];

    let hasErrors = false;

    requiredVars.forEach(varName => {
      if (!process.env[varName]) {
        this.log(`Missing required environment variable: ${varName}`, 'error');
        hasErrors = true;
      } else {
        this.log(`✓ ${varName} is set`, 'success');
      }
    });

    recommendedVars.forEach(varName => {
      if (!process.env[varName]) {
        this.log(`Recommended environment variable not set: ${varName}`, 'warning');
      } else {
        this.log(`✓ ${varName} is set`, 'success');
      }
    });

    // Validate URLs
    const urlVars = ['NEXT_PUBLIC_BASE_URL', 'NEXT_PUBLIC_RPC_URL'];
    urlVars.forEach(varName => {
      const url = process.env[varName];
      if (url) {
        try {
          new URL(url);
          this.log(`✓ ${varName} is a valid URL`, 'success');
        } catch {
          this.log(`Invalid URL format for ${varName}: ${url}`, 'error');
          hasErrors = true;
        }
      }
    });

    // Check production-specific settings
    if (process.env.NODE_ENV === 'production') {
      if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== 'true') {
        this.log('Analytics should be enabled in production', 'warning');
      }

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      if (baseUrl && !baseUrl.startsWith('https://')) {
        this.log('Base URL should use HTTPS in production', 'error');
        hasErrors = true;
      }
    }

    return !hasErrors;
  }

  // Analyze bundle size
  analyzeBundleSize() {
    this.log('Analyzing bundle size...', 'progress');
    
    try {
      // Check if .next directory exists
      const nextDir = path.join(this.projectRoot, '.next');
      if (!fs.existsSync(nextDir)) {
        this.log('No build found. Run npm run build first.', 'warning');
        return false;
      }

      // Analyze static files
      const staticDir = path.join(nextDir, 'static');
      if (fs.existsSync(staticDir)) {
        const analyzeDirectory = (dir, prefix = '') => {
          const files = fs.readdirSync(dir);
          let totalSize = 0;

          files.forEach(file => {
            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath);
            
            if (stats.isDirectory()) {
              totalSize += analyzeDirectory(filePath, `${prefix}${file}/`);
            } else {
              const sizeKB = (stats.size / 1024).toFixed(2);
              if (stats.size > 500 * 1024) { // > 500KB
                this.log(`Large file detected: ${prefix}${file} (${sizeKB} KB)`, 'warning');
              }
              totalSize += stats.size;
            }
          });

          return totalSize;
        };

        const totalSize = analyzeDirectory(staticDir);
        const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
        
        this.log(`Total static assets size: ${totalSizeMB} MB`, 'info');
        
        if (totalSize > 10 * 1024 * 1024) { // > 10MB
          this.log('Static assets are quite large. Consider optimization.', 'warning');
        }
      }

      this.optimizations.push('Bundle size analysis completed');
      return true;
    } catch (error) {
      this.log(`Bundle analysis failed: ${error.message}`, 'error');
      return false;
    }
  }

  // Check Core Web Vitals configuration
  checkCoreWebVitals() {
    this.log('Checking Core Web Vitals configuration...', 'progress');
    
    // Check if web-vitals is configured
    const webVitalsPath = path.join(this.projectRoot, 'src/lib/web-vitals.ts');
    if (fs.existsSync(webVitalsPath)) {
      this.log('✓ Web Vitals tracking is configured', 'success');
    } else {
      this.log('Web Vitals tracking not found', 'warning');
    }

    // Check for performance monitoring
    const performancePath = path.join(this.projectRoot, 'src/lib/performance.ts');
    if (fs.existsSync(performancePath)) {
      this.log('✓ Performance monitoring is configured', 'success');
    } else {
      this.log('Performance monitoring not found', 'warning');
    }

    // Check Next.js config for performance optimizations
    const nextConfigPath = path.join(this.projectRoot, 'next.config.js');
    if (fs.existsSync(nextConfigPath)) {
      const configContent = fs.readFileSync(nextConfigPath, 'utf8');
      
      if (configContent.includes('compress')) {
        this.log('✓ Compression is enabled', 'success');
      } else {
        this.log('Consider enabling compression in next.config.js', 'warning');
      }

      if (configContent.includes('images')) {
        this.log('✓ Image optimization is configured', 'success');
      } else {
        this.log('Consider configuring image optimization', 'warning');
      }
    }

    this.optimizations.push('Core Web Vitals configuration checked');
    return true;
  }

  // Optimize images
  optimizeImages() {
    this.log('Checking image optimization...', 'progress');
    
    const publicDir = path.join(this.projectRoot, 'public');
    if (!fs.existsSync(publicDir)) {
      this.log('No public directory found', 'info');
      return true;
    }

    const checkImages = (dir, prefix = '') => {
      const files = fs.readdirSync(dir);
      
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
          checkImages(filePath, `${prefix}${file}/`);
        } else if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)) {
          const sizeKB = (stats.size / 1024).toFixed(2);
          
          if (stats.size > 1024 * 1024) { // > 1MB
            this.log(`Large image: ${prefix}${file} (${sizeKB} KB)`, 'warning');
          }
          
          // Check for WebP alternatives
          if (/\.(jpg|jpeg|png)$/i.test(file)) {
            const webpFile = file.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            const webpPath = path.join(dir, webpFile);
            if (!fs.existsSync(webpPath)) {
              this.log(`Consider creating WebP version: ${prefix}${file}`, 'warning');
            }
          }
        }
      });
    };

    checkImages(publicDir);
    this.optimizations.push('Image optimization checked');
    return true;
  }

  // Check accessibility
  checkAccessibility() {
    this.log('Checking accessibility configuration...', 'progress');
    
    // Check for accessibility CSS
    const accessibilityCssPath = path.join(this.projectRoot, 'src/styles/accessibility.css');
    if (fs.existsSync(accessibilityCssPath)) {
      this.log('✓ Accessibility styles are configured', 'success');
    } else {
      this.log('Accessibility styles not found', 'warning');
    }

    // Check for accessibility utilities
    const accessibilityLibPath = path.join(this.projectRoot, 'src/lib/accessibility.ts');
    if (fs.existsSync(accessibilityLibPath)) {
      this.log('✓ Accessibility utilities are configured', 'success');
    } else {
      this.log('Accessibility utilities not found', 'warning');
    }

    // Check package.json for accessibility testing tools
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const devDeps = packageJson.devDependencies || {};
      
      if (devDeps['@testing-library/jest-dom']) {
        this.log('✓ Accessibility testing tools are installed', 'success');
      } else {
        this.log('Consider installing accessibility testing tools', 'warning');
      }
    }

    this.optimizations.push('Accessibility configuration checked');
    return true;
  }

  // Check SEO configuration
  checkSEO() {
    this.log('Checking SEO configuration...', 'progress');
    
    // Check for SEO utilities
    const seoUtilsPath = path.join(this.projectRoot, 'src/lib/seo-utils.ts');
    if (fs.existsSync(seoUtilsPath)) {
      this.log('✓ SEO utilities are configured', 'success');
    } else {
      this.log('SEO utilities not found', 'warning');
    }

    // Check for robots.txt
    const robotsPath = path.join(this.projectRoot, 'public/robots.txt');
    if (fs.existsSync(robotsPath)) {
      this.log('✓ robots.txt exists', 'success');
    } else {
      this.log('robots.txt not found', 'warning');
    }

    // Check for sitemap
    const sitemapPath = path.join(this.projectRoot, 'public/sitemap.xml');
    if (fs.existsSync(sitemapPath)) {
      this.log('✓ sitemap.xml exists', 'success');
    } else {
      this.log('sitemap.xml not found', 'warning');
    }

    // Check for favicon
    const faviconPath = path.join(this.projectRoot, 'public/favicon.ico');
    if (fs.existsSync(faviconPath)) {
      this.log('✓ favicon.ico exists', 'success');
    } else {
      this.log('favicon.ico not found', 'warning');
    }

    this.optimizations.push('SEO configuration checked');
    return true;
  }

  // Check security headers
  checkSecurity() {
    this.log('Checking security configuration...', 'progress');
    
    // Check Next.js config for security headers
    const nextConfigPath = path.join(this.projectRoot, 'next.config.js');
    if (fs.existsSync(nextConfigPath)) {
      const configContent = fs.readFileSync(nextConfigPath, 'utf8');
      
      if (configContent.includes('headers')) {
        this.log('✓ Custom headers are configured', 'success');
      } else {
        this.log('Consider adding security headers in next.config.js', 'warning');
      }

      if (configContent.includes('contentSecurityPolicy')) {
        this.log('✓ Content Security Policy is configured', 'success');
      } else {
        this.log('Consider adding Content Security Policy', 'warning');
      }
    }

    // Check for environment variable security
    if (process.env.NEXTAUTH_SECRET) {
      this.log('✓ NextAuth secret is configured', 'success');
    } else {
      this.log('NextAuth secret not found (if using auth)', 'info');
    }

    this.optimizations.push('Security configuration checked');
    return true;
  }

  // Run type checking
  runTypeCheck() {
    this.log('Running TypeScript type check...', 'progress');
    
    try {
      execSync('npx tsc --noEmit', { 
        stdio: 'pipe',
        cwd: this.projectRoot 
      });
      this.log('✓ TypeScript type check passed', 'success');
      this.optimizations.push('TypeScript type check passed');
      return true;
    } catch (error) {
      this.log('TypeScript type check failed', 'error');
      this.log(error.stdout?.toString() || error.message, 'error');
      return false;
    }
  }

  // Run linting
  runLinting() {
    this.log('Running ESLint...', 'progress');
    
    try {
      execSync('npm run lint', { 
        stdio: 'pipe',
        cwd: this.projectRoot 
      });
      this.log('✓ ESLint check passed', 'success');
      this.optimizations.push('ESLint check passed');
      return true;
    } catch (error) {
      this.log('ESLint check failed', 'error');
      this.log(error.stdout?.toString() || error.message, 'error');
      return false;
    }
  }

  // Test build
  testBuild() {
    this.log('Testing production build...', 'progress');
    
    try {
      execSync('npm run build', { 
        stdio: 'pipe',
        cwd: this.projectRoot 
      });
      this.log('✓ Production build successful', 'success');
      this.optimizations.push('Production build successful');
      return true;
    } catch (error) {
      this.log('Production build failed', 'error');
      this.log(error.stdout?.toString() || error.message, 'error');
      return false;
    }
  }

  // Generate deployment checklist
  generateDeploymentChecklist() {
    this.log('Generating deployment checklist...', 'progress');
    
    const checklist = `# PrimeBody Deployment Checklist

## Pre-Deployment Checks

### Environment Configuration
- [ ] All required environment variables are set
- [ ] Production URLs use HTTPS
- [ ] Analytics are enabled for production
- [ ] API endpoints are configured correctly
- [ ] Database connections are secure

### Performance Optimization
- [ ] Bundle size is optimized (< 10MB total)
- [ ] Images are optimized and WebP versions exist
- [ ] Code splitting is implemented
- [ ] Lazy loading is configured
- [ ] Compression is enabled

### SEO & Accessibility
- [ ] robots.txt is configured
- [ ] sitemap.xml is generated
- [ ] Meta tags are optimized
- [ ] Open Graph tags are set
- [ ] Accessibility standards are met (WCAG 2.1 AA)
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility

### Security
- [ ] Security headers are configured
- [ ] Content Security Policy is set
- [ ] HTTPS is enforced
- [ ] Sensitive data is not exposed
- [ ] API keys are secured

### Testing
- [ ] All tests pass
- [ ] TypeScript compilation succeeds
- [ ] ESLint checks pass
- [ ] Lighthouse scores meet targets (90+)
- [ ] Cross-browser testing completed
- [ ] Mobile responsiveness verified

### Monitoring & Analytics
- [ ] Error tracking is configured
- [ ] Performance monitoring is set up
- [ ] Analytics are working
- [ ] Core Web Vitals tracking is active
- [ ] Uptime monitoring is configured

### Deployment
- [ ] Build process is automated
- [ ] Rollback strategy is defined
- [ ] Environment-specific configs are ready
- [ ] DNS settings are configured
- [ ] CDN is set up (if applicable)

## Post-Deployment Verification

### Functionality
- [ ] All pages load correctly
- [ ] Navigation works properly
- [ ] Forms submit successfully
- [ ] CTAs function as expected
- [ ] Theme switching works
- [ ] Responsive design is intact

### Performance
- [ ] Page load times are acceptable (< 3s)
- [ ] Core Web Vitals are within targets
- [ ] Images load properly
- [ ] No console errors
- [ ] Memory usage is reasonable

### SEO & Social
- [ ] Search engines can crawl the site
- [ ] Social media previews work
- [ ] Structured data is valid
- [ ] Meta tags are correct
- [ ] Canonical URLs are set

### Analytics & Monitoring
- [ ] Analytics are tracking correctly
- [ ] Error monitoring is active
- [ ] Performance metrics are being collected
- [ ] User interactions are tracked
- [ ] Conversion funnels are working

## Optimization Recommendations

${this.optimizations.map(opt => `- ✅ ${opt}`).join('\n')}

## Warnings to Address

${this.warnings.map(warning => `- ⚠️ ${warning}`).join('\n')}

## Errors to Fix

${this.errors.map(error => `- ❌ ${error}`).join('\n')}

---

Generated on: ${new Date().toISOString()}
Environment: ${process.env.NODE_ENV || 'development'}
`;

    const checklistPath = path.join(this.projectRoot, 'DEPLOYMENT_CHECKLIST.md');
    fs.writeFileSync(checklistPath, checklist);
    
    this.log(`✓ Deployment checklist generated: ${checklistPath}`, 'success');
    return true;
  }

  // Run all optimizations
  async runAll() {
    this.log('🚀 Starting PrimeBody production optimization...', 'info');
    
    const checks = [
      { name: 'Environment Variables', fn: () => this.checkEnvironmentVariables() },
      { name: 'TypeScript Check', fn: () => this.runTypeCheck() },
      { name: 'ESLint Check', fn: () => this.runLinting() },
      { name: 'Production Build', fn: () => this.testBuild() },
      { name: 'Bundle Analysis', fn: () => this.analyzeBundleSize() },
      { name: 'Core Web Vitals', fn: () => this.checkCoreWebVitals() },
      { name: 'Image Optimization', fn: () => this.optimizeImages() },
      { name: 'Accessibility', fn: () => this.checkAccessibility() },
      { name: 'SEO Configuration', fn: () => this.checkSEO() },
      { name: 'Security', fn: () => this.checkSecurity() },
    ];

    let allPassed = true;

    for (const check of checks) {
      try {
        const result = check.fn();
        if (!result) {
          allPassed = false;
        }
      } catch (error) {
        this.log(`${check.name} failed: ${error.message}`, 'error');
        allPassed = false;
      }
    }

    // Generate deployment checklist
    this.generateDeploymentChecklist();

    // Summary
    this.log('\n📊 Optimization Summary', 'info');
    this.log(`✅ Optimizations completed: ${this.optimizations.length}`, 'success');
    this.log(`⚠️ Warnings: ${this.warnings.length}`, 'warning');
    this.log(`❌ Errors: ${this.errors.length}`, 'error');

    if (allPassed && this.errors.length === 0) {
      this.log('\n🎉 All checks passed! Ready for deployment.', 'success');
      return true;
    } else {
      this.log('\n⚠️ Some issues need attention before deployment.', 'warning');
      return false;
    }
  }
}

// CLI interface
if (require.main === module) {
  const optimizer = new ProductionOptimizer();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'env':
      optimizer.checkEnvironmentVariables();
      break;
    case 'build':
      optimizer.testBuild();
      break;
    case 'bundle':
      optimizer.analyzeBundleSize();
      break;
    case 'vitals':
      optimizer.checkCoreWebVitals();
      break;
    case 'images':
      optimizer.optimizeImages();
      break;
    case 'a11y':
      optimizer.checkAccessibility();
      break;
    case 'seo':
      optimizer.checkSEO();
      break;
    case 'security':
      optimizer.checkSecurity();
      break;
    case 'types':
      optimizer.runTypeCheck();
      break;
    case 'lint':
      optimizer.runLinting();
      break;
    case 'checklist':
      optimizer.generateDeploymentChecklist();
      break;
    default:
      optimizer.runAll().then(success => {
        process.exit(success ? 0 : 1);
      });
  }
}

module.exports = ProductionOptimizer;