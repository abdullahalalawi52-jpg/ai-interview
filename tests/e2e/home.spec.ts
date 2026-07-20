import { test, expect } from '@playwright/test';

test.describe('Home Page and Navigation', () => {
  test('should navigate to the home page successfully', async ({ page }) => {
    // Assuming local server runs on port 3000
    await page.goto('http://localhost:3000/');
    
    // Expect the title or hero text to be visible
    const title = page.locator('h1').first();
    await expect(title).toBeVisible();
    
    // Check if the "Start" or login button exists
    const startBtn = page.locator('a[href="/interview"]');
    await expect(startBtn).toBeVisible();
  });
});
