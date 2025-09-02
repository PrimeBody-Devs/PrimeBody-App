#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Content management CLI utility for PrimeBody
class ContentManager {
  constructor() {
    this.contentPath = path.join(process.cwd(), 'src/config/content.ts');
    this.envPath = path.join(process.cwd(), '.env.local');
  }

  // Validate content structure
  validateContent() {
    console.log('🔍 Validating content structure...');
    
    try {
      // Check if content file exists
      if (!fs.existsSync(this.contentPath)) {
        console.error('❌ Content file not found:', this.contentPath);
        return false;
      }

      // Read and parse content file
      const contentFile = fs.readFileSync(this.contentPath, 'utf8');
      
      // Basic validation checks
      const requiredSections = ['hero', 'features', 'demo', 'cta', 'footer'];
      const missingSection = requiredSections.find(section => !contentFile.includes(`${section}:`));
      
      if (missingSection) {
        console.error(`❌ Missing required section: ${missingSection}`);
        return false;
      }

      console.log('✅ Content structure is valid');
      return true;
    } catch (error) {
      console.error('❌ Error validating content:', error.message);
      return false;
    }
  }

  // Check environment configuration
  checkEnvironment() {
    console.log('🔍 Checking environment configuration...');
    
    const requiredVars = [
      'NEXT_PUBLIC_BASE_URL',
      'NEXT_PUBLIC_CHAIN_ID',
      'NEXT_PUBLIC_RPC_URL'
    ];

    const optionalVars = [
      'NEXT_PUBLIC_GA_ID',
      'NEXT_PUBLIC_MIXPANEL_TOKEN',
      'SUPPORT_EMAIL'
    ];

    let hasErrors = false;
    let hasWarnings = false;

    // Check required variables
    requiredVars.forEach(varName => {
      if (!process.env[varName]) {
        console.error(`❌ Missing required environment variable: ${varName}`);
        hasErrors = true;
      } else {
        console.log(`✅ ${varName} is set`);
      }
    });

    // Check optional variables
    optionalVars.forEach(varName => {
      if (!process.env[varName]) {
        console.warn(`⚠️  Optional environment variable not set: ${varName}`);
        hasWarnings = true;
      } else {
        console.log(`✅ ${varName} is set`);
      }
    });

    if (hasErrors) {
      console.log('\n❌ Environment configuration has errors');
      return false;
    } else if (hasWarnings) {
      console.log('\n⚠️  Environment configuration has warnings but is functional');
      return true;
    } else {
      console.log('\n✅ Environment configuration is complete');
      return true;
    }
  }

  // Generate content template
  generateTemplate() {
    console.log('📝 Generating content template...');
    
    const template = `import { LandingPageContent } from '@/types/content';

export const landingPageContent: LandingPageContent = {
  hero: {
    title: "Your App Title Here",
    subtitle: "Your compelling subtitle that explains the value proposition",
    ctaText: "Get Started",
    backgroundImage: "/images/hero-bg.jpg"
  },
  features: [
    {
      id: "feature-1",
      icon: "Icon1",
      title: "Feature 1",
      description: "Description of your first feature",
      highlight: "Key benefit"
    },
    {
      id: "feature-2", 
      icon: "Icon2",
      title: "Feature 2",
      description: "Description of your second feature",
      highlight: "Key benefit"
    }
  ],
  demo: {
    title: "See It In Action",
    description: "Watch how our app works",
    screenshots: [
      {
        id: "screen-1",
        url: "/images/demo/screen1.jpg",
        alt: "Screenshot 1",
        title: "Main Screen"
      }
    ]
  },
  cta: {
    title: "Ready to Get Started?",
    description: "Join thousands of users already using our app",
    primaryText: "Start Now",
    secondaryText: "Learn More"
  },
  footer: {
    links: [
      {
        category: "Product",
        items: [
          { label: "Features", href: "#features" },
          { label: "Pricing", href: "/pricing" }
        ]
      }
    ],
    socialLinks: [
      {
        platform: "twitter",
        url: "https://twitter.com/yourapp",
        label: "Follow us on Twitter"
      }
    ],
    copyright: "© 2025 Your App. All rights reserved."
  }
};`;

    const templatePath = path.join(process.cwd(), 'content-template.ts');
    fs.writeFileSync(templatePath, template);
    console.log(`✅ Template generated at: ${templatePath}`);
  }

  // Generate environment template
  generateEnvTemplate() {
    console.log('📝 Generating environment template...');
    
    const template = `# App Configuration
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_BASE_URL=http://localhost:3000
SUPPORT_EMAIL=support@yourapp.com

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
NEXT_PUBLIC_ENABLE_DARK_MODE=true`;

    const templatePath = path.join(process.cwd(), '.env.template');
    fs.writeFileSync(templatePath, template);
    console.log(`✅ Environment template generated at: ${templatePath}`);
  }

  // Show content statistics
  showStats() {
    console.log('📊 Content Statistics');
    console.log('====================');
    
    try {
      const contentFile = fs.readFileSync(this.contentPath, 'utf8');
      
      // Count features
      const featureMatches = contentFile.match(/{\s*id:/g);
      const featureCount = featureMatches ? featureMatches.length : 0;
      
      // Count screenshots
      const screenshotMatches = contentFile.match(/url:/g);
      const screenshotCount = screenshotMatches ? screenshotMatches.length : 0;
      
      // Count footer links
      const linkMatches = contentFile.match(/href:/g);
      const linkCount = linkMatches ? linkMatches.length : 0;
      
      console.log(`Features: ${featureCount}`);
      console.log(`Screenshots: ${screenshotCount}`);
      console.log(`Footer Links: ${linkCount}`);
      
      // File size
      const stats = fs.statSync(this.contentPath);
      console.log(`Content File Size: ${(stats.size / 1024).toFixed(2)} KB`);
      
    } catch (error) {
      console.error('❌ Error reading content file:', error.message);
    }
  }

  // Run all checks
  runHealthCheck() {
    console.log('🏥 Running Content Health Check');
    console.log('================================\n');
    
    const contentValid = this.validateContent();
    const envValid = this.checkEnvironment();
    
    console.log('\n📊 Health Check Summary');
    console.log('=======================');
    console.log(`Content Structure: ${contentValid ? '✅ Valid' : '❌ Invalid'}`);
    console.log(`Environment Config: ${envValid ? '✅ Valid' : '❌ Invalid'}`);
    
    if (contentValid && envValid) {
      console.log('\n🎉 All checks passed! Your content management setup is ready.');
    } else {
      console.log('\n⚠️  Some issues found. Please fix them before proceeding.');
      process.exit(1);
    }
  }
}

// CLI interface
const command = process.argv[2];
const contentManager = new ContentManager();

switch (command) {
  case 'validate':
    contentManager.validateContent();
    break;
  case 'check-env':
    contentManager.checkEnvironment();
    break;
  case 'generate-template':
    contentManager.generateTemplate();
    break;
  case 'generate-env':
    contentManager.generateEnvTemplate();
    break;
  case 'stats':
    contentManager.showStats();
    break;
  case 'health-check':
    contentManager.runHealthCheck();
    break;
  default:
    console.log('PrimeBody Content Manager');
    console.log('========================');
    console.log('');
    console.log('Available commands:');
    console.log('  validate          - Validate content structure');
    console.log('  check-env         - Check environment configuration');
    console.log('  generate-template - Generate content template');
    console.log('  generate-env      - Generate environment template');
    console.log('  stats            - Show content statistics');
    console.log('  health-check     - Run complete health check');
    console.log('');
    console.log('Usage: node scripts/content-manager.js <command>');
}

module.exports = ContentManager;