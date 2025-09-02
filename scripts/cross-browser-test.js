#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class CrossBrowserTester {
  constructor() {
    this.results = [];
    this.testUrl = process.env.TEST_URL || 'http://localhost:3000';
    this.outputDir = path.join(process.cwd(), 'test-results');
  }

  async init() {
    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
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

  async testBrowser(browserName, launchOptions = {}) {
    this.log(`Testing ${browserName}...`, 'info');
    
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: true,
        ...launchOptions
      });

      const page = await browser.newPage();
      
      // Set viewport for consistent testing
      await page.setViewport({ width: 1920, height: 1080 });
      
      const testResult = {
        browser: browserName,
        timestamp: new Date().toISOString(),
        tests: [],
        screenshots: [],
        errors: [],
        performance: {},
      };

      // Test 1: Page Load
      await this.testPageLoad(page, testResult);
      
      // Test 2: Responsive Design
      await this.testResponsiveDesign(page, testResult);
      
      // Test 3: Interactive Elements
      await this.testInteractiveElements(page, testResult);
      
      // Test 4: Theme Switching
      await this.testThemeSwitching(page, testResult);
      
      // Test 5: Form Functionality
      await this.testFormFunctionality(page, testResult);
      
      // Test 6: Navigation
      await this.testNavigation(page, testResult);
      
      // Test 7: Performance Metrics
      await this.testPerformanceMetrics(page, testResult);
      
      // Test 8: Accessibility
      await this.testAccessibility(page, testResult);

      this.results.push(testResult);
      this.log(`${browserName} testing completed`, 'success');
      
    } catch (error) {
      this.log(`${browserName} testing failed: ${error.message}`, 'error');
      this.results.push({
        browser: browserName,
        timestamp: new Date().toISOString(),
        error: error.message,
        tests: [],
        screenshots: [],
        errors: [error.message],
        performance: {},
      });
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  async testPageLoad(page, testResult) {
    try {
      const startTime = Date.now();
      
      // Navigate to the page
      const response = await page.goto(this.testUrl, { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });
      
      const loadTime = Date.now() - startTime;
      
      testResult.tests.push({
        name: 'Page Load',
        status: response.ok() ? 'pass' : 'fail',
        loadTime,
        statusCode: response.status(),
        details: `Page loaded in ${loadTime}ms with status ${response.status()}`
      });

      // Take screenshot
      const screenshotPath = path.join(this.outputDir, `${testResult.browser}-page-load.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      testResult.screenshots.push(screenshotPath);

      // Check for console errors
      const errors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      // Wait a bit to catch any delayed errors
      await page.waitForTimeout(2000);
      
      if (errors.length > 0) {
        testResult.errors.push(...errors);
      }

    } catch (error) {
      testResult.tests.push({
        name: 'Page Load',
        status: 'fail',
        error: error.message
      });
    }
  }

  async testResponsiveDesign(page, testResult) {
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1920, height: 1080 },
    ];

    for (const viewport of viewports) {
      try {
        await page.setViewport(viewport);
        await page.waitForTimeout(1000);

        // Check if content is visible and properly laid out
        const isContentVisible = await page.evaluate(() => {
          const hero = document.querySelector('h1');
          const nav = document.querySelector('nav');
          return hero && nav && 
                 hero.offsetWidth > 0 && hero.offsetHeight > 0 &&
                 nav.offsetWidth > 0 && nav.offsetHeight > 0;
        });

        // Take screenshot
        const screenshotPath = path.join(this.outputDir, `${testResult.browser}-${viewport.name.toLowerCase()}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        testResult.screenshots.push(screenshotPath);

        testResult.tests.push({
          name: `Responsive Design - ${viewport.name}`,
          status: isContentVisible ? 'pass' : 'fail',
          viewport: viewport,
          details: isContentVisible ? 'Content properly displayed' : 'Content layout issues detected'
        });

      } catch (error) {
        testResult.tests.push({
          name: `Responsive Design - ${viewport.name}`,
          status: 'fail',
          error: error.message
        });
      }
    }

    // Reset to desktop viewport
    await page.setViewport({ width: 1920, height: 1080 });
  }

  async testInteractiveElements(page, testResult) {
    try {
      // Test CTA buttons
      const ctaButtons = await page.$$('[data-testid*="cta"], button:contains("Comenzar")');
      
      for (let i = 0; i < ctaButtons.length; i++) {
        const button = ctaButtons[i];
        const isClickable = await button.evaluate(el => {
          return el.offsetWidth > 0 && el.offsetHeight > 0 && !el.disabled;
        });

        if (isClickable) {
          await button.hover();
          await page.waitForTimeout(500);
        }
      }

      testResult.tests.push({
        name: 'Interactive Elements',
        status: 'pass',
        details: `Found ${ctaButtons.length} interactive elements`
      });

    } catch (error) {
      testResult.tests.push({
        name: 'Interactive Elements',
        status: 'fail',
        error: error.message
      });
    }
  }

  async testThemeSwitching(page, testResult) {
    try {
      // Look for theme toggle button
      const themeToggle = await page.$('[data-testid="theme-toggle"], button[aria-label*="theme"]');
      
      if (themeToggle) {
        // Get initial theme
        const initialTheme = await page.evaluate(() => {
          return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        });

        // Click theme toggle
        await themeToggle.click();
        await page.waitForTimeout(1000);

        // Check if theme changed
        const newTheme = await page.evaluate(() => {
          return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        });

        const themeChanged = initialTheme !== newTheme;

        testResult.tests.push({
          name: 'Theme Switching',
          status: themeChanged ? 'pass' : 'fail',
          details: `Theme switched from ${initialTheme} to ${newTheme}`
        });

        // Take screenshot of dark theme
        if (newTheme === 'dark') {
          const screenshotPath = path.join(this.outputDir, `${testResult.browser}-dark-theme.png`);
          await page.screenshot({ path: screenshotPath, fullPage: true });
          testResult.screenshots.push(screenshotPath);
        }

      } else {
        testResult.tests.push({
          name: 'Theme Switching',
          status: 'skip',
          details: 'Theme toggle not found'
        });
      }

    } catch (error) {
      testResult.tests.push({
        name: 'Theme Switching',
        status: 'fail',
        error: error.message
      });
    }
  }

  async testFormFunctionality(page, testResult) {
    try {
      // Look for forms (newsletter, contact, etc.)
      const forms = await page.$$('form');
      
      if (forms.length > 0) {
        const form = forms[0];
        
        // Find input fields
        const inputs = await form.$$('input[type="email"], input[type="text"]');
        
        if (inputs.length > 0) {
          const input = inputs[0];
          
          // Test input functionality
          await input.click();
          await input.type('test@example.com');
          
          const inputValue = await input.evaluate(el => el.value);
          
          testResult.tests.push({
            name: 'Form Functionality',
            status: inputValue === 'test@example.com' ? 'pass' : 'fail',
            details: `Input field accepts text: ${inputValue}`
          });
        } else {
          testResult.tests.push({
            name: 'Form Functionality',
            status: 'skip',
            details: 'No input fields found'
          });
        }
      } else {
        testResult.tests.push({
          name: 'Form Functionality',
          status: 'skip',
          details: 'No forms found'
        });
      }

    } catch (error) {
      testResult.tests.push({
        name: 'Form Functionality',
        status: 'fail',
        error: error.message
      });
    }
  }

  async testNavigation(page, testResult) {
    try {
      // Test anchor links
      const anchorLinks = await page.$$('a[href^="#"]');
      
      if (anchorLinks.length > 0) {
        const link = anchorLinks[0];
        const href = await link.evaluate(el => el.getAttribute('href'));
        
        await link.click();
        await page.waitForTimeout(1000);
        
        // Check if page scrolled to the target
        const scrollPosition = await page.evaluate(() => window.pageYOffset);
        
        testResult.tests.push({
          name: 'Navigation',
          status: scrollPosition > 0 ? 'pass' : 'fail',
          details: `Anchor navigation to ${href}, scroll position: ${scrollPosition}`
        });
      } else {
        testResult.tests.push({
          name: 'Navigation',
          status: 'skip',
          details: 'No anchor links found'
        });
      }

    } catch (error) {
      testResult.tests.push({
        name: 'Navigation',
        status: 'fail',
        error: error.message
      });
    }
  }

  async testPerformanceMetrics(page, testResult) {
    try {
      // Get performance metrics
      const metrics = await page.metrics();
      
      const performanceData = {
        JSHeapUsedSize: Math.round(metrics.JSHeapUsedSize / 1024 / 1024), // MB
        JSHeapTotalSize: Math.round(metrics.JSHeapTotalSize / 1024 / 1024), // MB
        ScriptDuration: Math.round(metrics.ScriptDuration * 1000), // ms
        TaskDuration: Math.round(metrics.TaskDuration * 1000), // ms
      };

      testResult.performance = performanceData;

      // Check performance thresholds
      const issues = [];
      if (performanceData.JSHeapUsedSize > 50) {
        issues.push(`High memory usage: ${performanceData.JSHeapUsedSize}MB`);
      }
      if (performanceData.ScriptDuration > 1000) {
        issues.push(`Long script duration: ${performanceData.ScriptDuration}ms`);
      }

      testResult.tests.push({
        name: 'Performance Metrics',
        status: issues.length === 0 ? 'pass' : 'warning',
        details: issues.length === 0 ? 'Performance within acceptable limits' : issues.join(', '),
        metrics: performanceData
      });

    } catch (error) {
      testResult.tests.push({
        name: 'Performance Metrics',
        status: 'fail',
        error: error.message
      });
    }
  }

  async testAccessibility(page, testResult) {
    try {
      // Basic accessibility checks
      const accessibilityIssues = await page.evaluate(() => {
        const issues = [];
        
        // Check for images without alt text
        const images = document.querySelectorAll('img');
        images.forEach((img, index) => {
          if (!img.alt && !img.getAttribute('aria-label')) {
            issues.push(`Image ${index + 1} missing alt text`);
          }
        });
        
        // Check for buttons without accessible names
        const buttons = document.querySelectorAll('button');
        buttons.forEach((button, index) => {
          if (!button.textContent?.trim() && !button.getAttribute('aria-label')) {
            issues.push(`Button ${index + 1} missing accessible name`);
          }
        });
        
        // Check for proper heading hierarchy
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        if (headings.length === 0) {
          issues.push('No headings found');
        } else {
          const h1Count = document.querySelectorAll('h1').length;
          if (h1Count === 0) {
            issues.push('No H1 heading found');
          } else if (h1Count > 1) {
            issues.push('Multiple H1 headings found');
          }
        }
        
        return issues;
      });

      testResult.tests.push({
        name: 'Accessibility',
        status: accessibilityIssues.length === 0 ? 'pass' : 'warning',
        details: accessibilityIssues.length === 0 ? 'No accessibility issues found' : accessibilityIssues.join(', '),
        issues: accessibilityIssues
      });

    } catch (error) {
      testResult.tests.push({
        name: 'Accessibility',
        status: 'fail',
        error: error.message
      });
    }
  }

  async runAllTests() {
    await this.init();
    
    this.log('Starting cross-browser compatibility tests...', 'info');
    
    // Test Chrome (default Puppeteer browser)
    await this.testBrowser('Chrome');
    
    // You can add more browsers here if you have them installed
    // await this.testBrowser('Firefox', { product: 'firefox' });
    // await this.testBrowser('Safari'); // Requires additional setup
    
    // Generate report
    this.generateReport();
    
    this.log('Cross-browser testing completed!', 'success');
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      testUrl: this.testUrl,
      summary: {
        totalBrowsers: this.results.length,
        passedBrowsers: this.results.filter(r => !r.error).length,
        failedBrowsers: this.results.filter(r => r.error).length,
      },
      results: this.results
    };

    // Generate JSON report
    const jsonReportPath = path.join(this.outputDir, 'cross-browser-report.json');
    fs.writeFileSync(jsonReportPath, JSON.stringify(report, null, 2));

    // Generate HTML report
    const htmlReport = this.generateHTMLReport(report);
    const htmlReportPath = path.join(this.outputDir, 'cross-browser-report.html');
    fs.writeFileSync(htmlReportPath, htmlReport);

    this.log(`Reports generated:`, 'success');
    this.log(`  JSON: ${jsonReportPath}`, 'info');
    this.log(`  HTML: ${htmlReportPath}`, 'info');
  }

  generateHTMLReport(report) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cross-Browser Compatibility Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .summary { display: flex; gap: 20px; margin-bottom: 20px; }
        .summary-card { background: #fff; border: 1px solid #ddd; padding: 15px; border-radius: 8px; flex: 1; }
        .browser-result { border: 1px solid #ddd; margin-bottom: 20px; border-radius: 8px; }
        .browser-header { background: #f8f9fa; padding: 15px; border-bottom: 1px solid #ddd; }
        .test-result { padding: 10px 15px; border-bottom: 1px solid #eee; }
        .test-result:last-child { border-bottom: none; }
        .status-pass { color: #28a745; }
        .status-fail { color: #dc3545; }
        .status-warning { color: #ffc107; }
        .status-skip { color: #6c757d; }
        .screenshots { margin-top: 10px; }
        .screenshots img { max-width: 200px; margin: 5px; border: 1px solid #ddd; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Cross-Browser Compatibility Report</h1>
        <p><strong>Test URL:</strong> ${report.testUrl}</p>
        <p><strong>Generated:</strong> ${report.timestamp}</p>
    </div>

    <div class="summary">
        <div class="summary-card">
            <h3>Total Browsers</h3>
            <p>${report.summary.totalBrowsers}</p>
        </div>
        <div class="summary-card">
            <h3>Passed</h3>
            <p class="status-pass">${report.summary.passedBrowsers}</p>
        </div>
        <div class="summary-card">
            <h3>Failed</h3>
            <p class="status-fail">${report.summary.failedBrowsers}</p>
        </div>
    </div>

    ${report.results.map(result => `
        <div class="browser-result">
            <div class="browser-header">
                <h2>${result.browser}</h2>
                <p><strong>Timestamp:</strong> ${result.timestamp}</p>
                ${result.error ? `<p class="status-fail"><strong>Error:</strong> ${result.error}</p>` : ''}
            </div>
            ${result.tests.map(test => `
                <div class="test-result">
                    <h4>${test.name} <span class="status-${test.status}">[${test.status.toUpperCase()}]</span></h4>
                    <p>${test.details || test.error || 'No details available'}</p>
                    ${test.metrics ? `<pre>${JSON.stringify(test.metrics, null, 2)}</pre>` : ''}
                </div>
            `).join('')}
            ${result.screenshots.length > 0 ? `
                <div class="screenshots">
                    <h4>Screenshots</h4>
                    ${result.screenshots.map(screenshot => `
                        <img src="${path.basename(screenshot)}" alt="Screenshot" />
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `).join('')}
</body>
</html>
    `;
  }
}

// CLI interface
if (require.main === module) {
  const tester = new CrossBrowserTester();
  tester.runAllTests().catch(console.error);
}

module.exports = CrossBrowserTester;