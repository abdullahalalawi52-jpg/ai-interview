import { test, expect } from '@playwright/test';

test.describe('Interview Flow', () => {
  test('should complete the interview setup and enter the chat phase', async ({ page }) => {
    // Navigate to interview page
    await page.goto('http://localhost:3000/interview');

    // Wait for the setup phase to load
    // The setup phase has the Company input, Job title input, etc.
    const companyInput = page.locator('input[placeholder="e.g., Google, Amazon, etc."]').or(page.locator('input[placeholder="مثال: Google, Aramco, STC"]')).first();
    await expect(companyInput).toBeVisible({ timeout: 10000 });

    const jobTitleInput = page.locator('input[placeholder="e.g., Software Engineer"]').or(page.locator('input[placeholder="مثال: مهندس برمجيات، مدير مشروع"]')).first();
    const specializationInput = page.locator('input[placeholder="e.g., Frontend, Backend"]').or(page.locator('input[placeholder="مثال: تطوير الويب، التسويق الرقمي"]')).first();

    // Fill the form
    await companyInput.fill('Google');
    await jobTitleInput.fill('Frontend Engineer');
    await specializationInput.fill('React');

    // Submit the setup form
    const saveButton = page.locator('button', { hasText: 'Save and Continue' }).or(page.locator('button', { hasText: 'حفظ والمتابعة' })).first();
    await saveButton.click();

    // Click Start button
    const startBtn = page.locator('button', { hasText: 'Start' }).or(page.locator('button', { hasText: 'بدء' })).first();
    await expect(startBtn).toBeVisible({ timeout: 15000 });

    let requestCount = 0;
    // Mock the API response to avoid hitting the actual Gemini API during testing
    await page.route('/api/interview', async route => {
      requestCount++;
      const headers = { 
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Vercel-AI-Data-Stream': 'v1'
      };
      // First request (start message) -> return normal response
      // Second request -> return [END_INTERVIEW] to finish
      const responseBody = requestCount === 1 
        ? '0:"Mocked AI Response"\n'
        : '0:"Mocked AI Response [END_INTERVIEW]"\n';

      await route.fulfill({
        status: 200,
        headers,
        body: responseBody
      });
    });

    await startBtn.click();

    // Verify chat UI is visible
    const chatInput = page.locator('textarea[placeholder="Type your answer..."]').or(page.locator('textarea[placeholder="اكتب إجابتك هنا أو استخدم المايكروفون..."]')).first();
    await expect(chatInput).toBeVisible({ timeout: 15000 });

    // Send a message
    await chatInput.fill('This is a test answer.');
    const sendButton = page.locator('button[type="submit"]').first();
    await sendButton.click();

    // Verify input is cleared (meaning the message was submitted)
    await expect(chatInput).toHaveValue('');
  });
});
