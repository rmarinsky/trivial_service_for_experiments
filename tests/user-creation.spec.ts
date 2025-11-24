import {expect, test} from '@playwright/test';
import {faker} from '@faker-js/faker';

test.describe('User Creation Response Handling', () => {
  test.beforeEach(async ({page}) => {
    // Navigate to the page before each test
    await page.goto('http://localhost:3000');
  });

  test('Approach 1: Sequential await (click then wait)', async ({page}) => {
    console.log('\n=== APPROACH 1: Sequential await ===');
    console.log('This approach clicks first, then waits for response');

    // Generate random user data
    const username = faker.internet.username();
    const email = faker.internet.email();
    console.log(`Generated username: ${username}, email: ${email}`);

    // Fill in the form
    await page.getByTestId('username-input').fill(username);
    await page.getByTestId('email-input').fill(email);

    // Click the button first, then wait for response
    const startTime = Date.now();
    console.log(`[${new Date().toISOString()}] TEST: Clicking button...`);

    await page.getByTestId('submit-button').click();

    console.log(`[${new Date().toISOString()}] TEST: Waiting for response...`);
    const response = await page.waitForResponse('**/api/users');

    const endTime = Date.now();
    console.log(`[${new Date().toISOString()}] TEST: Response received after ${endTime - startTime}ms`);

    // Verify response
    expect(response.status()).toBe(201);
    const responseData = await response.json();
    console.log('Response data:', responseData);

    expect(responseData.success).toBe(true);
    expect(responseData.user.username).toBe(username);
    expect(responseData.user.email).toBe(email);

    // Verify UI update
    await expect(page.getByTestId('success-message')).toBeVisible();
    await expect(page.getByTestId('username-value')).toHaveText(username);
  });

  test('Approach 2: Promise-first (classic race condition safe)', async ({page}) => {
    console.log('\n=== APPROACH 2: Promise-first ===');
    console.log('This approach sets up waitForResponse before clicking');

    // Generate random user data
    const username = faker.internet.username();
    const email = faker.internet.email();
    console.log(`Generated username: ${username}, email: ${email}`);

    // Fill in the form
    await page.getByTestId('username-input').fill(username);
    await page.getByTestId('email-input').fill(email);

    // Set up response promise BEFORE clicking
    const startTime = Date.now();
    console.log(`[${new Date().toISOString()}] TEST: Setting up response promise...`);

    const responsePromise = page.waitForResponse('**/api/users');

    console.log(`[${new Date().toISOString()}] TEST: Clicking button...`);
    await page.getByTestId('submit-button').click();

    console.log(`[${new Date().toISOString()}] TEST: Awaiting response promise...`);
    const response = await responsePromise;

    const endTime = Date.now();
    console.log(`[${new Date().toISOString()}] TEST: Response received after ${endTime - startTime}ms`);

    // Verify response
    expect(response.status()).toBe(201);
    const responseData = await response.json();
    console.log('Response data:', responseData);

    expect(responseData.success).toBe(true);
    expect(responseData.user.username).toBe(username);
    expect(responseData.user.email).toBe(email);

    // Verify UI update
    await expect(page.getByTestId('success-message')).toBeVisible();
    await expect(page.getByTestId('username-value')).toHaveText(username);
  });

  test('Stress test: Multiple rapid submissions with sequential await', async ({page}) => {
    console.log('\n=== STRESS TEST: Sequential await approach ===');
    console.log('Testing 3 rapid submissions to see if any responses are missed');

    for (let i = 1; i <= 3; i++) {
      console.log(`\n--- Submission ${i} ---`);

      // Generate random user data for each iteration
      const username = faker.internet.username();
      const email = faker.internet.email();
      console.log(`Generated username: ${username}, email: ${email}`);

      await page.getByTestId('username-input').fill(username);
      await page.getByTestId('email-input').fill(email);

      const startTime = Date.now();
      await page.getByTestId('submit-button').click();
      const response = await page.waitForResponse('**/api/users');
      const endTime = Date.now();

      console.log(`Submission ${i} completed in ${endTime - startTime}ms`);

      const responseData = await response.json();
      expect(responseData.success).toBe(true);
      expect(responseData.user.username).toBe(username);

      // Wait a bit to see the UI update
      await page.waitForTimeout(100);
    }

    console.log('\nAll submissions completed successfully!');
  });

  test('Edge case: Very slow network simulation', async ({page, context}) => {
    console.log('\n=== EDGE CASE: Slow network ===');

    // Simulate slower network
    await context.route('**/api/users', async (route) => {
      // Add extra delay before letting the request through
      await new Promise(resolve => setTimeout(resolve, 300));
      await route.continue();
    });

    // Generate random user data
    const username = faker.internet.username();
    const email = faker.internet.email();
    console.log(`Generated username: ${username}, email: ${email}`);

    await page.getByTestId('username-input').fill(username);
    await page.getByTestId('email-input').fill(email);

    const startTime = Date.now();
    console.log(`[${new Date().toISOString()}] TEST: Clicking with slow network...`);

    // Try sequential approach with slow network
    await page.getByTestId('submit-button').click();
    const response = await page.waitForResponse('**/api/users');

    const endTime = Date.now();
    console.log(`[${new Date().toISOString()}] TEST: Slow response received after ${endTime - startTime}ms`);

    expect(response.status()).toBe(201);
    const responseData = await response.json();
    expect(responseData.success).toBe(true);

    await expect(page.getByTestId('success-message')).toBeVisible();
  });

  test('Verify response headers (X-Request-ID)', async ({page}) => {
    console.log('\n=== VERIFY CUSTOM HEADERS ===');

    // Generate random user data
    const username = faker.internet.username();
    const email = faker.internet.email();
    console.log(`Generated username: ${username}, email: ${email}`);

    await page.getByTestId('username-input').fill(username);
    await page.getByTestId('email-input').fill(email);

    await page.getByTestId('submit-button').click();
    const response = await page.waitForResponse('**/api/users');

    // Check for custom header
    const requestId = response.headers()['x-request-id'];
    console.log('X-Request-ID header:', requestId);

    expect(requestId).toBeTruthy();
    expect(requestId).toMatch(/^req-\d+-[a-z0-9]+$/);
  });


  test("Server side rendering example",
    async ({page}) => {
      const username = faker.internet.username();
      const email = faker.internet.email();
      console.log(`Generated username: ${username}, email: ${email}`);

      await page.goto("http://localhost:3000/ssr")
      await page.getByTestId('username-input').fill(username);
      await page.getByTestId('email-input').fill(email);

      await page.getByTestId('submit-button').click();

      const response = await page.waitForResponse('**/ssr');
      expect(response.status()).toBe(303)
    }
  );
});
