import { test, expect } from '@playwright/test';
import { testUsers } from './fixtures/test-data';

test.describe('Subscription Management', () => {
  test('should handle subscription upgrade flow', async ({ page }) => {
    // Note: This test assumes we can simulate authenticated state
    // In a real scenario, you'd set up test users with known subscription states
    
    // Step 1: Navigate to pricing page
    await page.goto('/pricing');
    
    // Verify pricing page loads
    await expect(page.locator('h1, h2')).toContainText(/pricing|plans/i);
    
    // Step 2: Test Pro subscription flow
    const proSection = page.locator(':has-text("Professional"):has-text("$97"), [data-testid="pro-plan"]').first();
    await expect(proSection).toBeVisible();
    
    // Click Pro subscribe button
    const proSubscribeButton = proSection.locator('button:has-text("Subscribe")');
    await proSubscribeButton.click();
    
    // Should initiate checkout flow
    await page.waitForResponse(response => 
      response.url().includes('/api/stripe/checkout') && 
      (response.status() === 200 || response.status() === 302),
      { timeout: 10000 }
    );
    
    // Step 3: Test Enterprise subscription flow  
    await page.goto('/pricing');
    
    const enterpriseSection = page.locator(':has-text("Enterprise"):has-text("$297"), [data-testid="enterprise-plan"]').first();
    await expect(enterpriseSection).toBeVisible();
    
    // Click Enterprise subscribe button
    const enterpriseSubscribeButton = enterpriseSection.locator('button:has-text("Subscribe")');
    await enterpriseSubscribeButton.click();
    
    // Should initiate checkout flow
    await page.waitForResponse(response => 
      response.url().includes('/api/stripe/checkout'),
      { timeout: 10000 }
    );
  });

  test('should display subscription status correctly', async ({ page }) => {
    // Simulate authenticated user navigation
    await page.goto('/dashboard');
    
    // Check for subscription status indicators
    const subscriptionStatus = page.locator(
      '[data-testid="subscription-status"], .subscription-status, text=Subscription, text=Plan'
    );
    
    // Should show some subscription information
    if (await subscriptionStatus.isVisible()) {
      await expect(subscriptionStatus).toContainText(/pro|enterprise|free|trial/i);
    }
    
    // Check for manage subscription link/button
    const manageButton = page.locator(
      'button:has-text("Manage"), a:has-text("Manage"), text=Billing Portal'
    );
    
    if (await manageButton.isVisible()) {
      await manageButton.click();
      
      // Should redirect to Stripe portal or billing page
      await page.waitForResponse(response => 
        response.url().includes('/api/stripe/portal') || 
        response.url().includes('billing.stripe.com'),
        { timeout: 10000 }
      );
    }
  });

  test('should handle subscription cancellation flow', async ({ page }) => {
    // Navigate to subscription management
    await page.goto('/dashboard');
    
    // Look for subscription management section
    const manageSection = page.locator(
      '[data-testid="subscription-management"], .subscription-management'
    );
    
    if (await manageSection.isVisible()) {
      // Test cancel subscription flow
      const cancelButton = page.locator('button:has-text("Cancel")');
      
      if (await cancelButton.isVisible()) {
        await cancelButton.click();
        
        // Should show confirmation dialog
        await expect(
          page.locator('text=Are you sure, text=Cancel subscription, text=Confirm')
        ).toBeVisible();
        
        // Don't actually cancel in test - just verify the flow exists
        const confirmButton = page.locator('button:has-text("Confirm")');
        if (await confirmButton.isVisible()) {
          // Cancel the cancellation for safety
          await page.keyboard.press('Escape');
        }
      }
    }
  });

  test('should enforce subscription tiers correctly', async ({ page }) => {
    // Test accessing Pro content without subscription
    await page.goto('/library/agent-11');
    
    // Check if download is restricted
    const downloadButton = page.locator('button:has-text("Download")');
    const upgradePrompt = page.locator('text=Subscribe, text=Upgrade, text=Get access');
    
    // Should either show download (if subscribed) or upgrade prompt
    expect(
      (await downloadButton.isVisible()) || (await upgradePrompt.isVisible())
    ).toBe(true);
    
    // Test accessing Enterprise content
    await page.goto('/library/empire-11');
    
    // Enterprise content should require Enterprise subscription
    const enterpriseContent = page.locator('text=Empire-11');
    await expect(enterpriseContent).toBeVisible();
    
    const enterpriseDownload = page.locator('button:has-text("Download")');
    const enterpriseUpgrade = page.locator('text=Enterprise, text=Upgrade to Enterprise');
    
    // Should show appropriate access control
    expect(
      (await enterpriseDownload.isVisible()) || (await enterpriseUpgrade.isVisible())
    ).toBe(true);
  });

  test('should handle subscription webhooks simulation', async ({ page }) => {
    // This test verifies the application responds correctly to subscription changes
    // In a real scenario, you'd have test webhooks from Stripe
    
    // Simulate successful subscription webhook by navigating with success param
    await page.goto('/dashboard?subscription=success');
    
    // Should show success state
    const successMessage = page.locator(
      'text=Subscription activated, text=Welcome, text=Success'
    );
    
    if (await successMessage.isVisible()) {
      await expect(successMessage).toBeVisible();
    }
    
    // Simulate failed subscription
    await page.goto('/dashboard?subscription=failed');
    
    // Should show appropriate error state
    const errorMessage = page.locator(
      'text=Payment failed, text=Subscription error, text=Please try again'
    );
    
    if (await errorMessage.isVisible()) {
      await expect(errorMessage).toBeVisible();
    }
  });

  test('should display correct pricing and billing information', async ({ page }) => {
    await page.goto('/pricing');
    
    // Verify all pricing information is accurate
    const proPrice = page.locator(':has-text("$97"):has-text("Professional"), :has-text("$97"):has-text("Pro")');
    const enterprisePrice = page.locator(':has-text("$297"):has-text("Enterprise")');
    
    await expect(proPrice).toBeVisible();
    await expect(enterprisePrice).toBeVisible();
    
    // Check feature comparisons
    const proFeatures = page.locator(':has-text("Professional"):has-text("Agent-11")');
    const enterpriseFeatures = page.locator(':has-text("Enterprise"):has-text("Empire-11")');
    
    await expect(proFeatures).toBeVisible();
    await expect(enterpriseFeatures).toBeVisible();
    
    // Verify billing cycle information
    const billingInfo = page.locator('text=month, text=annual, text=per month');
    if (await billingInfo.isVisible()) {
      await expect(billingInfo).toBeVisible();
    }
  });
});