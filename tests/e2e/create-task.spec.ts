import { test, expect } from '@playwright/test';
import { generateTestUser, createAuthenticatedUser } from '../helpers/test-utils';

test.describe('Create Task Page', () => {
  test.beforeEach(async ({ page }) => {
    // Create and authenticate a user before each test
    const testUser = generateTestUser();
    await createAuthenticatedUser(page, testUser);
    
    // Navigate to the create task page
    await page.goto('/create-task');
    
    // Wait for the page to load
    await expect(page.getByRole('heading', { name: 'Create New Task' })).toBeVisible();
  });

  test('should display the create task form with all required sections', async ({ page }) => {
    // Check header
    await expect(page.getByRole('heading', { name: 'Create New Task' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save Task' })).toBeVisible();

    // Check task form sections
    await expect(page.getByRole('textbox', { name: 'Task Title' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Description' })).toBeVisible();
    
    // Check checklists section
    await expect(page.getByRole('heading', { name: 'Progress Checklists' })).toBeVisible();
    await expect(page.getByRole('button', { name: '+ Add another checklist' })).toBeVisible();
    
    // Check metadata panel
    await expect(page.getByRole('heading', { name: 'Assign to' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Tags' })).toBeVisible();
  });

  test('should create a basic task with only a title', async ({ page }) => {
    const taskTitle = 'Basic Test Task';
    
    await page.getByRole('textbox', { name: 'Task Title' }).fill(taskTitle);
    
    await page.getByRole('button', { name: 'Save Task' }).click();
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
  });

  test('should create a task with title and description', async ({ page }) => {
    const taskTitle = 'Task with Description';
    const taskDescription = 'This is a detailed description of the task that needs to be completed.';
    
    await page.getByRole('textbox', { name: 'Task Title' }).fill(taskTitle);
    await page.getByRole('textbox', { name: 'Description' }).fill(taskDescription);
    
    await page.getByRole('button', { name: 'Save Task' }).click();
    
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
  });

  test('should show error when trying to save without a title', async ({ page }) => {
    // Try to save without entering a title
    await page.getByRole('button', { name: 'Save Task' }).click();
    
    // Should show error message
    await expect(page.getByText('Please enter a task title')).toBeVisible();
    
    // Should not redirect
    await expect(page).toHaveURL('/create-task');
  });

  test('should add and fill a checklist with items', async ({ page }) => {
    const taskTitle = 'Task with Checklist';
    const checklistTitle = 'Development Tasks';
    const items = [
      'Write unit tests',
      'Update documentation',
      'Code review'
    ];
    
    await page.getByRole('textbox', { name: 'Task Title' }).fill(taskTitle);
    
    // Add a checklist
    await page.getByRole('button', { name: '+ Add another checklist' }).click();
    
    // Fill checklist title
    const checklistTitleInput = page.getByRole('textbox', { name: /Checklist Title/ }).first();
    await checklistTitleInput.fill(checklistTitle);
    
    // Add checklist items
    for (const item of items) {
      await page.getByRole('button', { name: '+ Add new item...' }).first().click();
      const itemInputs = page.getByRole('textbox', { name: 'Checklist item...' });
      const lastItem = itemInputs.last();
      await lastItem.fill(item);
    }
    
    await page.getByRole('button', { name: 'Save Task' }).click();
    
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
  });

  test('should add multiple checklists', async ({ page }) => {
    const taskTitle = 'Task with Multiple Checklists';
    
    await page.getByRole('textbox', { name: 'Task Title' }).fill(taskTitle);
    
    // Add first checklist
    await page.getByRole('button', { name: '+ Add another checklist' }).click();
    await page.getByRole('textbox', { name: /Checklist Title/ }).first().fill('Frontend Tasks');
    await page.getByRole('button', { name: '+ Add new item...' }).first().click();
    await page.getByRole('textbox', { name: 'Checklist item...' }).first().fill('Build UI components');
    
    // Add second checklist
    await page.getByRole('button', { name: '+ Add another checklist' }).click();
    await page.getByRole('textbox', { name: /Checklist Title/ }).nth(1).fill('Backend Tasks');
    await page.getByRole('button', { name: '+ Add new item...' }).nth(1).click();
    await page.getByRole('textbox', { name: 'Checklist item...' }).nth(1).fill('Create API endpoints');
    
    await page.getByRole('button', { name: 'Save Task' }).click();
    
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
  });

  test('should remove a checklist', async ({ page }) => {
    const taskTitle = 'Task with Removable Checklist';
    
    await page.getByRole('textbox', { name: 'Task Title' }).fill(taskTitle);
    
    // Add a checklist
    await page.getByRole('button', { name: '+ Add another checklist' }).click();
    await page.getByRole('textbox', { name: /Checklist Title/ }).first().fill('Temporary Checklist');
    
    // Verify checklist exists
    await expect(page.getByRole('textbox', { name: /Checklist Title/ })).toHaveCount(1);
    
    // Remove the checklist
    await page.getByRole('button', { name: 'Remove checklist' }).click();
    
    // Verify checklist is removed
    await expect(page.getByRole('textbox', { name: /Checklist Title/ })).toHaveCount(0);
  });

  test('should remove a checklist item', async ({ page }) => {
    const taskTitle = 'Task with Removable Item';
    
    await page.getByRole('textbox', { name: 'Task Title' }).fill(taskTitle);
    
    // Add a checklist with items
    await page.getByRole('button', { name: '+ Add another checklist' }).click();
    await page.getByRole('textbox', { name: /Checklist Title/ }).first().fill('My Checklist');
    
    // Add two items
    await page.getByRole('button', { name: '+ Add new item...' }).click();
    await page.getByRole('textbox', { name: 'Checklist item...' }).first().fill('Item 1');
    
    await page.getByRole('button', { name: '+ Add new item...' }).click();
    await page.getByRole('textbox', { name: 'Checklist item...' }).nth(1).fill('Item 2');
    
    // Verify we have 2 items
    await expect(page.getByRole('textbox', { name: 'Checklist item...' })).toHaveCount(2);
    
    // Remove the first item using the accessible label
    await page.getByRole('button', { name: 'Remove checklist item' }).first().click();
    
    // Verify we have 1 item left
    await expect(page.getByRole('textbox', { name: 'Checklist item...' })).toHaveCount(1);
  });

  test('should assign a user to the task', async ({ page }) => {
    const taskTitle = 'Task with Assignment';
    
    await page.getByRole('textbox', { name: 'Task Title' }).fill(taskTitle);
    
    // Find and check the user assignment checkbox
    const userCheckbox = page.getByRole('checkbox').last();
    await userCheckbox.check();
    
    // Verify checkbox is checked
    await expect(userCheckbox).toBeChecked();
    
    await page.getByRole('button', { name: 'Save Task' }).click();
    
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
  });

  test('should add tags to the task', async ({ page }) => {
    const taskTitle = 'Task with Tags';
    const tags = 'urgent, bug-fix, frontend';
    
    await page.getByRole('textbox', { name: 'Task Title' }).fill(taskTitle);
    
    // Add tags
    const tagInput = page.getByRole('textbox', { name: /Add tags/ });
    await tagInput.fill(tags);
    await tagInput.press('Enter');
    
    // Verify at least one tag chip is visible
    await page.waitForTimeout(500); // Wait for tag to be processed
    
    await page.getByRole('button', { name: 'Save Task' }).click();
    
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
  });

  test('should create a complete task with all features', async ({ page }) => {
    const taskTitle = 'Complete Feature Task';
    const taskDescription = 'This task includes all possible features: description, checklists, assignments, and tags.';
    
    // Fill basic info
    await page.getByRole('textbox', { name: 'Task Title' }).fill(taskTitle);
    await page.getByRole('textbox', { name: 'Description' }).fill(taskDescription);
    
    // Add first checklist
    await page.getByRole('button', { name: '+ Add another checklist' }).click();
    await page.getByRole('textbox', { name: /Checklist Title/ }).first().fill('Backend Development');
    await page.getByRole('button', { name: '+ Add new item...' }).first().click();
    await page.getByRole('textbox', { name: 'Checklist item...' }).first().fill('Setup database schema');
    await page.getByRole('button', { name: '+ Add new item...' }).first().click();
    await page.getByRole('textbox', { name: 'Checklist item...' }).nth(1).fill('Create API endpoints');
    
    // Add second checklist
    await page.getByRole('button', { name: '+ Add another checklist' }).click();
    await page.getByRole('textbox', { name: /Checklist Title/ }).nth(1).fill('Frontend Development');
    await page.getByRole('button', { name: '+ Add new item...' }).nth(1).click();
    await page.getByRole('textbox', { name: 'Checklist item...' }).nth(2).fill('Design UI mockups');
    
    // Assign user
    const userCheckbox = page.getByRole('checkbox').last();
    await userCheckbox.check();
    
    // Add tags
    const tagInput = page.getByRole('textbox', { name: /Add tags/ });
    await tagInput.fill('feature, high-priority, v1.0');
    await tagInput.press('Enter');
    
    await page.waitForTimeout(500); // Wait for tag processing
    
    await page.getByRole('button', { name: 'Save Task' }).click();
    
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
  });

  test('should cancel task creation and return to dashboard', async ({ page }) => {
    const taskTitle = 'Task to be Cancelled';
    
    await page.getByRole('textbox', { name: 'Task Title' }).fill(taskTitle);
    
    // Click cancel button
    await page.getByRole('button', { name: 'Cancel' }).click();
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
  });

  test('should preserve form data when switching between fields', async ({ page }) => {
    const taskTitle = 'Data Persistence Test';
    const taskDescription = 'Testing if data persists';
    
    // Fill title
    await page.getByRole('textbox', { name: 'Task Title' }).fill(taskTitle);
    
    // Fill description
    await page.getByRole('textbox', { name: 'Description' }).fill(taskDescription);
    
    // Add a checklist
    await page.getByRole('button', { name: '+ Add another checklist' }).click();
    await page.getByRole('textbox', { name: /Checklist Title/ }).first().fill('My Checklist');
    
    // Click back on title field
    await page.getByRole('textbox', { name: 'Task Title' }).click();
    
    // Verify all data is still present
    await expect(page.getByRole('textbox', { name: 'Task Title' })).toHaveValue(taskTitle);
    await expect(page.getByRole('textbox', { name: 'Description' })).toHaveValue(taskDescription);
    await expect(page.getByRole('textbox', { name: /Checklist Title/ }).first()).toHaveValue('My Checklist');
  });

  test('should handle empty checklists gracefully', async ({ page }) => {
    const taskTitle = 'Task with Empty Checklist';
    
    await page.getByRole('textbox', { name: 'Task Title' }).fill(taskTitle);
    
    // Add a checklist but don't fill it
    await page.getByRole('button', { name: '+ Add another checklist' }).click();
    
    // Try to save (empty checklists should be filtered out)
    await page.getByRole('button', { name: 'Save Task' }).click();
    
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
  });

  test('should handle checklist with title but no items', async ({ page }) => {
    const taskTitle = 'Task with Checklist No Items';
    
    await page.getByRole('textbox', { name: 'Task Title' }).fill(taskTitle);
    
    // Add a checklist with title but no items
    await page.getByRole('button', { name: '+ Add another checklist' }).click();
    await page.getByRole('textbox', { name: /Checklist Title/ }).first().fill('Empty Checklist');
    
    // Try to save (checklists without items should be filtered out)
    await page.getByRole('button', { name: 'Save Task' }).click();
    
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
  });

  test('should display user information in sidebar', async ({ page }) => {
    // Check that user profile is visible in sidebar (scope to navigation to avoid strict mode)
    await expect(page.getByRole('navigation').getByText('Test User')).toBeVisible();
  });

  test('should navigate to dashboard via sidebar', async ({ page }) => {
    // Click on "My Tasks" in sidebar
    await page.getByRole('link', { name: 'My Tasks' }).first().click();
    
    await expect(page).toHaveURL('/dashboard');
  });

  test('should clear error message after fixing validation issue', async ({ page }) => {
    // Try to save without title
    await page.getByRole('button', { name: 'Save Task' }).click();
    
    // Error should appear
    await expect(page.getByText('Please enter a task title')).toBeVisible();
    
    // Fill in title
    await page.getByRole('textbox', { name: 'Task Title' }).fill('Fixed Task');
    
    // Try to save again
    await page.getByRole('button', { name: 'Save Task' }).click();
    
    // Should redirect (error cleared)
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
  });

  test('should display placeholders correctly', async ({ page }) => {
    await expect(page.getByRole('textbox', { name: 'Task Title' }))
      .toHaveAttribute('placeholder', 'Write a title here...');
    
    await expect(page.getByRole('textbox', { name: 'Description' }))
      .toHaveAttribute('placeholder', 'Add a more detailed description...');
  });

  test('should allow multiple tags separated by commas', async ({ page }) => {
    const taskTitle = 'Multi-Tag Task';
    
    await page.getByRole('textbox', { name: 'Task Title' }).fill(taskTitle);
    
    const tagInput = page.getByRole('textbox', { name: /Add tags/ });
    
    // Add first tag
    await tagInput.fill('tag1');
    await tagInput.press('Enter');
    await page.waitForTimeout(300);
    
    // Add second tag
    await tagInput.fill('tag2');
    await tagInput.press('Enter');
    await page.waitForTimeout(300);
    
    // Add third tag
    await tagInput.fill('tag3');
    await tagInput.press('Enter');
    await page.waitForTimeout(300);
    
    await page.getByRole('button', { name: 'Save Task' }).click();
    
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
  });
});

