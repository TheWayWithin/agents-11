import { test, expect } from '@playwright/test';
import { testUsers, subscriptionTiers } from './fixtures/test-data';

test.describe('New User Complete Journey', () => {
  test('should complete signup → subscription → download flow', async ({ page }) => {
    const newUser = {
      ...testUsers.new,
      email: `test+${Date.now()}@example.com`, // Ensure unique email
    };

    // Step 1: Navigate to signup
    await page.goto('/signup');
    
    // Verify signup page loads
    await expect(page.locator('h2')).toContainText('Create your account');
    
    // Step 2: Complete signup form
    await page.fill('[name="fullName"]', newUser.fullName);
    await page.fill('[name="email"]', newUser.email);
    await page.fill('[name="password"]', newUser.password);
    await page.fill('[name="confirmPassword"]', newUser.password);
    
    // Submit signup
    await page.click('button[type="submit"]');
    
    // Wait for success message
    await expect(page.locator('text=Check your email for the confirmation link')).toBeVisible({ timeout: 10000 });
    
    // Step 3: Navigate to pricing (simulating email confirmation)
    await page.goto('/pricing');
    
    // Verify pricing page loads
    await expect(page.locator('h1')).toContainText(/pricing|plans/i);
    
    // Step 4: Select Pro subscription
    const proSection = page.locator('[data-testid="pro-plan"], :has-text("Professional"):has-text("$97")').first();
    await expect(proSection).toBeVisible();
    
    // Click subscribe button for Pro plan
    await proSection.locator('button:has-text("Subscribe")').click();
    
    // Step 5: Handle Stripe checkout redirect
    // Note: In a real test, you'd mock Stripe or use test mode
    // For now, we'll check that the checkout API is called
    await page.waitForResponse(response => 
      response.url().includes('/api/stripe/checkout') && response.status() === 200,
      { timeout: 10000 }
    );
    
    // Simulate successful payment (would normally be handled by Stripe)
    await page.goto('/dashboard?success=true');
    
    // Step 6: Verify dashboard access
    await expect(page.locator('h1, h2')).toContainText(/dashboard|welcome/i);
    
    // Step 7: Navigate to library
    await page.goto('/library');
    
    // Verify library page loads
    await expect(page.locator('h1')).toContainText('Agent Library');
    
    // Step 8: Select Agent-11 for download
    const agent11Card = page.locator('[data-testid="agent-11-card"], :has-text("Agent-11")').first();
    await agent11Card.locator('a:has-text("View Details"), button:has-text("View Details")').click();
    
    // Step 9: Verify agent details page
    await expect(page.locator('h1, h2')).toContainText('Agent-11');
    
    // Step 10: Attempt download
    const downloadButton = page.locator('button:has-text("Download"), [data-testid="download-button"]');
    await downloadButton.click();
    
    // Verify download initiated (could be a file download or success message)
    await expect(
      page.locator('text=Download started, text=Download complete, text=Access granted')
    ).toBeVisible({ timeout: 10000 });
  });

  test('should handle signup validation errors', async ({ page }) => {
    await page.goto('/signup');
    
    // Test password mismatch
    await page.fill('[name="fullName"]', 'Test User');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.fill('[name="confirmPassword"]', 'different123');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Passwords do not match')).toBeVisible();
    
    // Test short password
    await page.fill('[name="password"]', '123');
    await page.fill('[name="confirmPassword"]', '123');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Password must be at least 6 characters')).toBeVisible();
  });

  test('should redirect unauthenticated users from protected pages', async ({ page }) => {
    // Try to access dashboard without authentication
    await page.goto('/dashboard');
    
    // Should redirect to login or show access denied
    await expect(page).toHaveURL(/\/login|\/signup|\/$/);
    
    // Try to access library
    await page.goto('/library');
    
    // Library might be public, but download should require auth
    // This tests the basic navigation flow
    await expect(page.locator('h1')).toContainText('Agent Library');
  });
});