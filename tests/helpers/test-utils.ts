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

