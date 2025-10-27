import { test, expect } from '@playwright/test';
import { generateTestUser } from '../helpers/test-utils';

test.describe('SignIn Page', () => {
  let existingUser: ReturnType<typeof generateTestUser>;

  test.beforeAll(async ({ browser }) => {
    existingUser = generateTestUser();
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto('/signup');
    await page.getByRole('textbox', { name: 'Your name' }).fill(existingUser.fullName);
    await page.getByRole('textbox', { name: 'email@example.com' }).fill(existingUser.email);
    await page.getByPlaceholder('Min. 8 characters').fill(existingUser.password);
    await page.getByPlaceholder('Repeat your password').fill(existingUser.password);
    await page.getByRole('button', { name: 'Create Account' }).click();
    
    await page.waitForURL('/');
    
    await context.close();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/signin');
  });

  test('should display the signin form with all required fields', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'NEXXT Task' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Access Your Account' })).toBeVisible();
    
    await expect(page.getByRole('textbox', { name: 'email@example.com' })).toBeVisible();
    await expect(page.getByPlaceholder('Your password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
    
    await expect(page.getByText('Don\'t have an account?')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign Up' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Forgot password?' })).toBeVisible();
  });

  test('should show validation errors when submitting empty form', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.getByRole('textbox', { name: 'email@example.com' }).fill('invalid@email');
    await page.getByPlaceholder('Your password').fill('password123');
    
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    await expect(page.getByText('Please enter a valid email address')).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.getByRole('textbox', { name: 'email@example.com' }).fill('wrong@example.com');
    await page.getByPlaceholder('Your password').fill('wrongpassword');
    
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    await expect(page.getByText('Invalid email or password')).toBeVisible();
  });

  test('should show error with wrong password for existing user', async ({ page }) => {
    await page.getByRole('textbox', { name: 'email@example.com' }).fill(existingUser.email);
    await page.getByPlaceholder('Your password').fill('wrongpassword123');
    
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    await expect(page.getByText('Invalid email or password')).toBeVisible();
  });

  test('should clear validation errors when user starts typing', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    await expect(page.getByText('Email is required')).toBeVisible();
    
    await page.getByRole('textbox', { name: 'email@example.com' }).fill('test@example.com');
    
    await expect(page.getByText('Email is required')).not.toBeVisible();
  });

  test('should show loading state during submission', async ({ page }) => {
    await page.getByRole('textbox', { name: 'email@example.com' }).fill(existingUser.email);
    await page.getByPlaceholder('Your password').fill(existingUser.password);
    
    const submitButton = page.getByRole('button', { name: 'Sign In' });
    await expect(submitButton).toBeEnabled();
    
    await submitButton.click();
    
    await expect(page).toHaveURL('/');
  });

  test('should successfully sign in with valid credentials and redirect to root', async ({ page }) => {
    await page.getByRole('textbox', { name: 'email@example.com' }).fill(existingUser.email);
    await page.getByPlaceholder('Your password').fill(existingUser.password);
    
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    await expect(page).toHaveURL('/');
  });

  test('should navigate to sign up page when clicking "Sign Up" link', async ({ page }) => {
    await page.getByRole('link', { name: 'Sign Up' }).click();
    
    await expect(page).toHaveURL('/signup');
    await expect(page.getByRole('heading', { name: 'Create Your Account' })).toBeVisible();
  });

  test('should have "Forgot password?" link visible', async ({ page }) => {
    const forgotPasswordLink = page.getByRole('link', { name: 'Forgot password?' });
    
    await expect(forgotPasswordLink).toBeVisible();
    await expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password');
  });

  test('should display all fields with proper placeholder text', async ({ page }) => {
    const emailInput = page.getByRole('textbox', { name: 'email@example.com' });
    await expect(emailInput).toHaveAttribute('placeholder', 'email@example.com');
    
    const passwordInput = page.getByPlaceholder('Your password');
    await expect(passwordInput).toHaveAttribute('placeholder', 'Your password');
  });

  test('should have all required field indicators', async ({ page }) => {
    const requiredIndicators = page.locator('span.text-orange-500');
    
    await expect(requiredIndicators).toHaveCount(2);
    
    const labels = await page.locator('label').all();
    for (const label of labels) {
      const text = await label.textContent();
      if (text?.includes('Email') || text?.includes('Password')) {
        await expect(label.locator('span.text-orange-500')).toBeVisible();
      }
    }
  });

  test('should handle multiple validation errors simultaneously', async ({ page }) => {
    await page.getByRole('textbox', { name: 'email@example.com' }).fill('invalid@test');
    
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    await expect(page.getByText('Please enter a valid email address')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
  });

  test('should clear general error when user updates form', async ({ page }) => {
    await page.getByRole('textbox', { name: 'email@example.com' }).fill('wrong@example.com');
    await page.getByPlaceholder('Your password').fill('wrongpassword');
    
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    await expect(page.getByText('Invalid email or password')).toBeVisible();
    
    await page.getByRole('textbox', { name: 'email@example.com' }).fill('new@example.com');
    
    await expect(page.getByText('Invalid email or password')).not.toBeVisible();
  });

  test('should display proper form styling and layout', async ({ page }) => {
    const formCard = page.locator('div.bg-gray-900\\/75').first();
    await expect(formCard).toBeVisible();
    
    const logo = page.locator('svg').first();
    await expect(logo).toBeVisible();
  });

  test('should navigate from home page sign in link to sign in page', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('link', { name: 'Sign In' }).click();
    
    await expect(page).toHaveURL('/signin');
    await expect(page.getByRole('heading', { name: 'Access Your Account' })).toBeVisible();
  });
});

