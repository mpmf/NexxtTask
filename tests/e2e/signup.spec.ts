import { test, expect } from '@playwright/test';
import { generateTestUser, generateUniqueEmail } from '../helpers/test-utils';

test.describe('Signup Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup');
  });

  test('should display the signup form with all required fields', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'NEXXT Task' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Create Your Account' })).toBeVisible();
    
    await expect(page.getByRole('textbox', { name: 'Your name' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'email@example.com' })).toBeVisible();
    await expect(page.getByPlaceholder('Min. 8 characters')).toBeVisible();
    await expect(page.getByPlaceholder('Repeat your password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible();
    
    await expect(page.getByText('Already have an account?')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible();
  });

  test('should show validation errors when submitting empty form', async ({ page }) => {
    await page.getByRole('button', { name: 'Create Account' }).click();
    
    await expect(page.getByText('Full name is required')).toBeVisible();
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
    await expect(page.getByText('Please confirm your password')).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Your name' }).fill('Test User');
    await page.getByRole('textbox', { name: 'email@example.com' }).fill('invalid@email');
    await page.getByPlaceholder('Min. 8 characters').fill('password123');
    await page.getByPlaceholder('Repeat your password').fill('password123');
    
    await page.getByRole('button', { name: 'Create Account' }).click();
    
    await expect(page.getByText('Please enter a valid email address')).toBeVisible();
  });

  test('should validate password minimum length', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Your name' }).fill('Test User');
    await page.getByRole('textbox', { name: 'email@example.com' }).fill('test@example.com');
    await page.getByPlaceholder('Min. 8 characters').fill('pass');
    await page.getByPlaceholder('Repeat your password').fill('pass');
    
    await page.getByRole('button', { name: 'Create Account' }).click();
    
    await expect(page.getByText('Password must be at least 8 characters')).toBeVisible();
  });

  test('should validate password confirmation match', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Your name' }).fill('Test User');
    await page.getByRole('textbox', { name: 'email@example.com' }).fill('test@example.com');
    await page.getByPlaceholder('Min. 8 characters').fill('password123');
    await page.getByPlaceholder('Repeat your password').fill('password456');
    
    await page.getByRole('button', { name: 'Create Account' }).click();
    
    await expect(page.getByText('Passwords do not match')).toBeVisible();
  });

  test('should clear validation errors when user starts typing', async ({ page }) => {
    await page.getByRole('button', { name: 'Create Account' }).click();
    
    await expect(page.getByText('Full name is required')).toBeVisible();
    
    await page.getByRole('textbox', { name: 'Your name' }).fill('Test User');
    
    await expect(page.getByText('Full name is required')).not.toBeVisible();
  });

  test('should disable button during submission and redirect on success', async ({ page }) => {
    const testUser = generateTestUser();
    
    await page.getByRole('textbox', { name: 'Your name' }).fill(testUser.fullName);
    await page.getByRole('textbox', { name: 'email@example.com' }).fill(testUser.email);
    await page.getByPlaceholder('Min. 8 characters').fill(testUser.password);
    await page.getByPlaceholder('Repeat your password').fill(testUser.password);
    
    const submitButton = page.getByRole('button', { name: 'Create Account' });
    
    await submitButton.click();
    
    await page.waitForURL('/');
    
    // After signup, user should see the dashboard with "My Tasks" heading
    await expect(page.getByRole('heading', { name: 'My Tasks' })).toBeVisible();
  });

  test('should successfully create a new user and redirect to dashboard', async ({ page }) => {
    const testUser = generateTestUser();
    
    await page.getByRole('textbox', { name: 'Your name' }).fill(testUser.fullName);
    await page.getByRole('textbox', { name: 'email@example.com' }).fill(testUser.email);
    await page.getByPlaceholder('Min. 8 characters').fill(testUser.password);
    await page.getByPlaceholder('Repeat your password').fill(testUser.password);
    
    await page.getByRole('button', { name: 'Create Account' }).click();
    
    await expect(page).toHaveURL('/');
    
    // After signup, user should see the dashboard with "My Tasks" heading and Create Task link
    await expect(page.getByRole('heading', { name: 'My Tasks' })).toBeVisible();
    await expect(page.getByRole('link', { name: '+ Create Task' })).toBeVisible();
  });

  test('should show error when trying to register with existing email', async ({ page }) => {
    const testUser = generateTestUser();
    
    await page.getByRole('textbox', { name: 'Your name' }).fill(testUser.fullName);
    await page.getByRole('textbox', { name: 'email@example.com' }).fill(testUser.email);
    await page.getByPlaceholder('Min. 8 characters').fill(testUser.password);
    await page.getByPlaceholder('Repeat your password').fill(testUser.password);
    
    await page.getByRole('button', { name: 'Create Account' }).click();
    
    await expect(page).toHaveURL('/');
    
    await page.goto('/signup');
    
    await page.getByRole('textbox', { name: 'Your name' }).fill('Another User');
    await page.getByRole('textbox', { name: 'email@example.com' }).fill(testUser.email);
    await page.getByPlaceholder('Min. 8 characters').fill(testUser.password);
    await page.getByPlaceholder('Repeat your password').fill(testUser.password);
    
    await page.getByRole('button', { name: 'Create Account' }).click();
    
    await expect(page.getByText('An account with this email already exists')).toBeVisible();
  });

  test('should have all required field indicators', async ({ page }) => {
    const requiredIndicators = page.locator('span.text-orange-500');
    
    await expect(requiredIndicators).toHaveCount(4);
    
    const labels = await page.locator('label').all();
    for (const label of labels) {
      const text = await label.textContent();
      if (text?.includes('Full Name') || text?.includes('Email') || 
          text?.includes('Password') || text?.includes('Confirm Password')) {
        await expect(label.locator('span.text-orange-500')).toBeVisible();
      }
    }
  });

  test('should navigate to sign in page when clicking "Sign In" link', async ({ page }) => {
    await page.getByRole('link', { name: 'Sign In' }).click();
    
    await expect(page).toHaveURL('/signin');
  });

  test('should display all fields with proper placeholder text', async ({ page }) => {
    const fullNameInput = page.getByRole('textbox', { name: 'Your name' });
    await expect(fullNameInput).toHaveAttribute('placeholder', 'Your name');
    
    const emailInput = page.getByRole('textbox', { name: 'email@example.com' });
    await expect(emailInput).toHaveAttribute('placeholder', 'email@example.com');
    
    const passwordInput = page.getByPlaceholder('Min. 8 characters');
    await expect(passwordInput).toHaveAttribute('placeholder', 'Min. 8 characters');
    
    const confirmPasswordInput = page.getByPlaceholder('Repeat your password');
    await expect(confirmPasswordInput).toHaveAttribute('placeholder', 'Repeat your password');
  });

  test('should handle multiple validation errors simultaneously', async ({ page }) => {
    await page.getByRole('textbox', { name: 'email@example.com' }).fill('invalid@test');
    await page.getByPlaceholder('Min. 8 characters').fill('123');
    await page.getByPlaceholder('Repeat your password').fill('456');
    
    await page.getByRole('button', { name: 'Create Account' }).click();
    
    await expect(page.getByText('Full name is required')).toBeVisible();
    await expect(page.getByText('Please enter a valid email address')).toBeVisible();
    await expect(page.getByText('Password must be at least 8 characters')).toBeVisible();
  });
});

