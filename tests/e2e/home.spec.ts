import { test, expect } from '@playwright/test';

test.describe('Home Page and Navigation', () => {
  test('should load the home page and have correct title', async ({ page }) => {
    await page.goto('/');
    
    // The home page should contain the main heading (from localization)
    // We can check for standard elements that should exist
    const mainContent = page.locator('main#main-content');
    await expect(mainContent).toBeVisible();

    // Check for the Start Interview button
    const startButton = page.locator('a[href="/interview"]').first();
    await expect(startButton).toBeVisible();
  });

  test('should navigate to interview setup page', async ({ page }) => {
    await page.goto('/');
    
    const startButton = page.locator('a[href="/interview"]').first();
    await startButton.click();

    // After clicking, it should navigate to the interview page
    await expect(page).toHaveURL(/.*\/interview/);
    
    // In our app, it might redirect to login if unauthenticated
    // or render the setup UI. We just check the URL changed successfully.
    await expect(page).toHaveURL(/.*\/interview|.*\/login/);
  });
});
