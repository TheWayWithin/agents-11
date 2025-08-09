import { Page } from '@playwright/test';
import { testUsers } from './test-data';

export async function signUp(page: Page, user: typeof testUsers.new) {
  await page.goto('/signup');
  
  await page.fill('[name="fullName"]', user.fullName);
  await page.fill('[name="email"]', user.email);
  await page.fill('[name="password"]', user.password);
  await page.fill('[name="confirmPassword"]', user.password);
  
  await page.click('button[type="submit"]');
  
  // Wait for success message or redirect
  await page.waitForSelector('text=Check your email for the confirmation link', { timeout: 10000 });
}

export async function signIn(page: Page, email: string, password: string) {
  await page.goto('/login');
  
  await page.fill('[name="email"]', email);
  await page.fill('[name="password"]', password);
  
  await page.click('button[type="submit"]');
  
  // Wait for redirect to dashboard
  await page.waitForURL('**/dashboard', { timeout: 10000 });
}

export async function signOut(page: Page) {
  // Look for sign out button/link - this might be in a dropdown or header
  // This is a placeholder - actual implementation depends on UI structure
  await page.click('[data-testid="user-menu"]', { timeout: 5000 });
  await page.click('text=Sign Out');
  
  // Wait for redirect to home or login
  await page.waitForURL(/\/(login|$)/, { timeout: 10000 });
}