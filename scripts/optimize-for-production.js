#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Optimizing FitCast Landing Page for Production...\n');

// Check if required files exist
const requiredFiles = [
  'public/og-image.jpg',
  'public/twitter-image.jpg',
  'public/favicon-16x16.png',
  'public/favicon-32x32.png',
  'public/apple-touch-icon.png',
  'public/android-chrome-192x192.png',
  'public/android-chrome-512x512.png',
];

console.log('📁 Checking required files...');
const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));

if (missingFiles.length > 0) {
  console.log('❌ Missing required files:');
  missingFiles.forEach(file => console.log(`   - ${file}`));
  console.log('\n📝 Please add these files before deployment.');
} else {
  console.log('✅ All required files present');
}

// Check environment variables
console.log('\n🔧 Checking environment variables...');
const requiredEnvVars = [
  'NEXT_PUBLIC_APP_NAME',
  'NEXT_PUBLIC_APP_URL',
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.log('⚠️  Missing environment variables:');
  missingEnvVars.forEach(envVar => console.log(`   - ${envVar}`));
  console.log('\n📝 Add these to your .env.local file');
} else {
  console.log('✅ Required environment variables present');
}

// Run linting
console.log('\n🔍 Running linting...');
try {
  execSync('npm run lint', { stdio: 'inherit' });
  console.log('✅ Linting passed');
} catch (error) {
  console.log('❌ Linting failed');
  process.exit(1);
}

// Run type checking
console.log('\n📝 Running type checking...');
try {
  execSync('npm run type-check', { stdio: 'inherit' });
  console.log('✅ Type checking passed');
} catch (error) {
  console.log('❌ Type checking failed');
  process.exit(1);
}

// Build for production
console.log('\n🏗️  Building for production...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Production build successful');
} catch (error) {
  console.log('❌ Production build failed');
  process.exit(1);
}

// Analyze bundle size
console.log('\n📊 Analyzing bundle size...');
try {
  execSync('npm run build:analyze', { stdio: 'inherit' });
  console.log('✅ Bundle analysis complete');
  console.log('📝 Check bundle-analyzer-report.html for details');
} catch (error) {
  console.log('⚠️  Bundle analysis failed (optional)');
}

// Check bundle size
const buildManifest = path.join('.next', 'static', 'chunks', 'pages');
if (fs.existsSync(buildManifest)) {
  console.log('\n📦 Bundle size check...');
  
  // Get build info
  const buildId = fs.readFileSync('.next/BUILD_ID', 'utf8').trim();
  console.log(`Build ID: ${buildId}`);
  
  // Check if bundle is reasonable size
  const nextDir = '.next';
  const staticDir = path.join(nextDir, 'static');
  
  if (fs.existsSync(staticDir)) {
    const getDirectorySize = (dirPath) => {
      let totalSize = 0;
      const files = fs.readdirSync(dirPath);
      
      files.forEach(file => {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
          totalSize += getDirectorySize(filePath);
        } else {
          totalSize += stats.size;
        }
      });
      
      return totalSize;
    };
    
    const totalSize = getDirectorySize(staticDir);
    const sizeInMB = (totalSize / 1024 / 1024).toFixed(2);
    
    console.log(`Total static assets: ${sizeInMB} MB`);
    
    if (totalSize > 5 * 1024 * 1024) { // 5MB
      console.log('⚠️  Bundle size is large, consider optimization');
    } else {
      console.log('✅ Bundle size is reasonable');
    }
  }
}

// Final checklist
console.log('\n📋 Final Production Checklist:');
console.log('   - [ ] Environment variables configured in Vercel');
console.log('   - [ ] All required images uploaded to /public');
console.log('   - [ ] Google Analytics ID configured (optional)');
console.log('   - [ ] WalletConnect Project ID configured (optional)');
console.log('   - [ ] Domain configured in Vercel');
console.log('   - [ ] SSL certificate active');

console.log('\n🎉 Production optimization complete!');
console.log('🚀 Ready for deployment to Vercel');

// Create deployment summary
const deploymentSummary = {
  timestamp: new Date().toISOString(),
  buildId: fs.existsSync('.next/BUILD_ID') ? fs.readFileSync('.next/BUILD_ID', 'utf8').trim() : 'unknown',
  missingFiles: missingFiles,
  missingEnvVars: missingEnvVars,
  status: missingFiles.length === 0 && missingEnvVars.length === 0 ? 'ready' : 'needs-attention'
};

fs.writeFileSync('deployment-summary.json', JSON.stringify(deploymentSummary, null, 2));
console.log('\n📄 Deployment summary saved to deployment-summary.json');