import { test, expect, Page } from '@playwright/test';

test.describe('Visual Implementation Testing', () => {
  const baseURL = 'http://localhost:3000';

  // Test data for comprehensive image checking
  const imageTests = [
    // Brand logos
    { path: '/transparent/agents11-logo-primary-horizontal.png', description: 'Primary logo' },
    { path: '/transparent/agents11-logo-icon-only.png', description: 'Icon-only logo' },
    { path: '/transparent/agents11-logo-stacked-vertical.png', description: 'Stacked logo' },
    
    // Hero illustrations
    { path: '/illustrations/hero-solopreneur-with-ai-agents.png', description: 'Hero illustration' },
    { path: '/illustrations/marketplace-coordination.png', description: 'Marketplace illustration' },
    { path: '/illustrations/roi-timeline-visualization.png', description: 'ROI illustration' },
    
    // Background patterns
    { path: '/backgrounds/geometric-grid-subtle.png', description: 'Geometric pattern' },
    { path: '/backgrounds/circuit-board-pattern.png', description: 'Circuit pattern' },
    { path: '/backgrounds/dot-matrix-pattern.png', description: 'Dot matrix pattern' },
    { path: '/backgrounds/wave-pattern-flow.png', description: 'Wave pattern' },
    { path: '/backgrounds/hero-gradient-background.png', description: 'Hero gradient' },
    
    // Agent-11 icons
    { path: '/agents/agent11-strategist-product-vision.png', description: 'Strategist agent' },
    { path: '/agents/agent11-architect-system-design.png', description: 'Architect agent' },
    { path: '/agents/agent11-developer-ship-code.png', description: 'Developer agent' },
    { path: '/agents/agent11-tester-quality-assurance.png', description: 'Tester agent' },
    { path: '/agents/agent11-designer-ui-ux.png', description: 'Designer agent' },
    { path: '/agents/agent11-documenter-knowledge-capture.png', description: 'Documenter agent' },
    { path: '/agents/agent11-operator-devops.png', description: 'Operator agent' },
    { path: '/agents/agent11-support-customer-support.png', description: 'Support agent' },
    { path: '/agents/agent11-analyst-data-analytics.png', description: 'Analyst agent' },
    { path: '/agents/agent11-marketer-growth-marketing.png', description: 'Marketer agent' },
    { path: '/agents/agent11-coordinator-mission-commander.png', description: 'Coordinator agent' },
    
    // Empire-11 icons
    { path: '/agents/empire11-sage-strategy-agent.png', description: 'Sage agent' },
    { path: '/agents/empire11-nova-sales-agent.png', description: 'Nova agent' },
    { path: '/agents/empire11-astra-marketing-agent.png', description: 'Astra agent' },
    { path: '/agents/empire11-phoenix-operations-agent.png', description: 'Phoenix agent' },
    { path: '/agents/empire11-rex-legal-agent.png', description: 'Rex agent' },
    { path: '/agents/empire11-zara-finance-agent.png', description: 'Zara agent' },
  ];

  const pages = [
    { path: '/', name: 'Homepage' },
    { path: '/library', name: 'Library' },
    { path: '/pricing', name: 'Pricing' },
    { path: '/login', name: 'Login' },
    { path: '/signup', name: 'Signup' },
  ];

  // Test 1: Image Loading Tests
  test.describe('Image Loading Tests', () => {
    imageTests.forEach(({ path, description }) => {
      test(`should load ${description}`, async ({ page }) => {
        const response = await page.goto(`${baseURL}${path}`);
        expect(response?.status()).toBe(200);
        
        // Additional check for image dimensions (basic validation)
        const contentType = response?.headers()['content-type'];
        expect(contentType).toMatch(/image\/(png|jpg|jpeg|webp)/);
      });
    });
  });

  // Test 2: Visual Rendering Tests
  test.describe('Visual Rendering Tests', () => {
    pages.forEach(({ path, name }) => {
      test(`${name} - should load and render correctly`, async ({ page }) => {
        await page.goto(`${baseURL}${path}`);
        
        // Basic page load check
        await expect(page).toHaveTitle(/Agents-11/);
        
        // Check for header brand logo
        const logo = page.locator('img[alt="Agents-11 Logo"]');
        await expect(logo).toBeVisible();
        await expect(logo).toHaveAttribute('src', /_next\/image\?url=%2Ftransparent%2Fagents11-logo-primary-horizontal.png/);
        
        // Wait for images to load
        await page.waitForLoadState('networkidle');
        
        // Check that no images have broken (404) sources
        const images = page.locator('img');
        const imageCount = await images.count();
        
        for (let i = 0; i < imageCount; i++) {
          const img = images.nth(i);
          const src = await img.getAttribute('src');
          
          if (src && src.startsWith('/_next/image') || src?.startsWith('/')) {
            // Check that the image element is visible and has loaded
            await expect(img).toBeVisible();
            
            // Check image natural dimensions to ensure it loaded
            const hasSize = await img.evaluate((el) => {
              const imgEl = el as HTMLImageElement;
              return imgEl.naturalWidth > 0 && imgEl.naturalHeight > 0;
            });
            
            expect(hasSize).toBe(true);
          }
        }
      });
    });
  });

  // Test 3: Responsive Design Tests
  test.describe('Responsive Design Tests', () => {
    const viewports = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1440, height: 900, name: 'Desktop' },
    ];

    viewports.forEach(({ width, height, name }) => {
      test(`Homepage - ${name} (${width}x${height})`, async ({ page }) => {
        await page.setViewportSize({ width, height });
        await page.goto(baseURL);
        
        // Check hero section loads
        const heroSection = page.locator('.hero-section');
        await expect(heroSection).toBeVisible();
        
        // Check hero illustration loads and is visible
        const heroIllustration = page.locator('img[alt="Hero illustration"]');
        await expect(heroIllustration).toBeVisible();
        
        // Check agent icons are visible
        const agentIcons = page.locator('img[alt*="agent"]');
        const iconCount = await agentIcons.count();
        expect(iconCount).toBeGreaterThan(0);
        
        // Verify images scale properly - no overflow
        await page.waitForLoadState('networkidle');
        
        const images = page.locator('img');
        const imageCount = await images.count();
        
        for (let i = 0; i < imageCount; i++) {
          const img = images.nth(i);
          const boundingBox = await img.boundingBox();
          
          if (boundingBox) {
            expect(boundingBox.width).toBeLessThanOrEqual(width);
          }
        }
      });
    });
  });

  // Test 4: Performance and Optimization Tests
  test.describe('Performance Tests', () => {
    test('Homepage - should load quickly with optimized images', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto(baseURL);
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      // Should load within reasonable time (5 seconds for development)
      expect(loadTime).toBeLessThan(5000);
      
      // Check for Next.js image optimization
      const optimizedImages = page.locator('img[src*="_next/image"]');
      const optimizedCount = await optimizedImages.count();
      
      expect(optimizedCount).toBeGreaterThan(0);
    });

    test('should use lazy loading for below-fold images', async ({ page }) => {
      await page.goto(baseURL);
      
      // Check for loading="lazy" attribute on images not marked as priority
      const lazyImages = page.locator('img[loading="lazy"]');
      const lazyCount = await lazyImages.count();
      
      // Should have some lazy-loaded images
      expect(lazyCount).toBeGreaterThan(0);
    });
  });

  // Test 5: Accessibility Tests
  test.describe('Accessibility Tests', () => {
    test('Images should have proper alt text', async ({ page }) => {
      await page.goto(baseURL);
      
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        
        // All images should have alt text
        expect(alt).not.toBeNull();
        expect(alt).not.toBe('');
        expect(alt!.length).toBeGreaterThan(2);
      }
    });
  });

  // Test 6: Cross-Page Navigation Tests
  test.describe('Cross-Page Navigation', () => {
    test('should maintain image loading across pages', async ({ page }) => {
      // Start at homepage
      await page.goto(baseURL);
      await page.waitForLoadState('networkidle');
      
      // Navigate to library
      await page.click('a[href="/library"]');
      await page.waitForLoadState('networkidle');
      
      // Check images load on library page
      const libraryImages = page.locator('img');
      const libraryImageCount = await libraryImages.count();
      expect(libraryImageCount).toBeGreaterThan(0);
      
      // Navigate to pricing
      await page.click('a[href="/pricing"]');
      await page.waitForLoadState('networkidle');
      
      // Check images load on pricing page
      const pricingImages = page.locator('img');
      const pricingImageCount = await pricingImages.count();
      expect(pricingImageCount).toBeGreaterThan(0);
    });
  });

  // Test 7: Error Handling
  test.describe('Error Handling', () => {
    test('should handle missing images gracefully', async ({ page }) => {
      // Test a non-existent image endpoint
      const response = await page.goto(`${baseURL}/agents/non-existent-agent.png`);
      expect(response?.status()).toBe(404);
    });
  });
});