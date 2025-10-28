import { Page } from '@playwright/test';

/**
 * Generate a unique email address for testing
 */
export function generateUniqueEmail(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `test-${timestamp}-${random}@example.com`;
}

/**
 * Generate test user data
 */
export function generateTestUser() {
  return {
    fullName: 'Test User',
    email: generateUniqueEmail(),
    password: 'password123',
  };
}

/**
 * Wait for a specific amount of time
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create and authenticate a user for testing
 * This creates a new user account and signs them in
 */
export async function createAuthenticatedUser(
  page: Page,
  user: { fullName: string; email: string; password: string }
): Promise<void> {
  // Navigate to signup page
  await page.goto('/signup');
  
  // Fill in signup form
  await page.getByRole('textbox', { name: 'Your name' }).fill(user.fullName);
  await page.getByRole('textbox', { name: 'email@example.com' }).fill(user.email);
  await page.getByPlaceholder('Min. 8 characters').fill(user.password);
  await page.getByPlaceholder('Repeat your password').fill(user.password);
  
  // Submit form
  await page.getByRole('button', { name: 'Create Account' }).click();
  
  // Wait for redirect to home page (successful signup)
  await page.waitForURL('/', { timeout: 10000 });
  
  // User is now authenticated
}

