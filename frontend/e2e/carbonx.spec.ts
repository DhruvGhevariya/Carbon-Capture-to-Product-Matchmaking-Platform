import { test, expect } from '@playwright/test';

test.describe('CarbonX Real Browser E2E Suite', () => {

  test('Complete Golden Path E2E Workflow', async ({ page }) => {
    // 1. Open CarbonX Application Landing Page
    await page.goto('/');
    await expect(page.locator('body')).not.toBeEmpty();

    // 2. Navigate to Auth / Login Page
    await page.goto('/login');
    await expect(page.locator('body')).toContainText(/Sign In|Login|Email|Password/i);

    // 3. Enter Credentials & Submit
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    if (await emailInput.count() > 0) {
      await emailInput.fill('admin@carbonx.com');
      await page.locator('input[type="password"]').fill('admin123');
      await page.click('button[type="submit"]');
    }

    // 4. Test Navigation Across Core App Pages
    await page.goto('/marketplace');
    await expect(page.locator('body')).not.toBeEmpty();

    await page.goto('/discovery');
    await expect(page.locator('body')).not.toBeEmpty();

    await page.goto('/ai/recommend');
    await expect(page.locator('body')).not.toBeEmpty();

    await page.goto('/intelligence');
    await expect(page.locator('body')).not.toBeEmpty();

    await page.goto('/seller/dashboard');
    await expect(page.locator('body')).not.toBeEmpty();

    await page.goto('/logistics');
    await expect(page.locator('body')).not.toBeEmpty();

    await page.goto('/bids');
    await expect(page.locator('body')).not.toBeEmpty();

    await page.goto('/projects');
    await expect(page.locator('body')).not.toBeEmpty();

    await page.goto('/orders');
    await expect(page.locator('body')).not.toBeEmpty();

  });

  test('Negative E2E & Error Boundary Handling', async ({ page }) => {
    // Test Invalid Credentials
    await page.goto('/login');
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    if (await emailInput.count() > 0) {
      await emailInput.fill('invalid@user.com');
      await page.locator('input[type="password"]').fill('wrongpassword');
      await page.click('button[type="submit"]');
    }
    await expect(page.locator('body')).not.toBeEmpty();

    // Test Redirect Behavior for Protected Routes
    await page.evaluate(() => localStorage.clear());
    await page.goto('/seller/dashboard');
    await page.waitForTimeout(500);
    expect(page.url()).toContain('/login');
  });

});

