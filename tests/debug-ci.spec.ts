import { test, expect } from '@playwright/test';

/**
 * Debug Test Suite for CI Environment
 * This test helps identify issues specific to the CI environment
 */
test.describe('CI Debug Tests', () => {
  
  test('basic connectivity test', async ({ page }) => {
    console.log('Starting basic connectivity test...');
    console.log('Base URL:', process.env.BASE_URL || 'https://demoqa.com');
    console.log('CI Environment:', process.env.CI);
    
    // Test basic page load
    await page.goto('https://demoqa.com');
    console.log('Page loaded successfully');
    
    // Wait for page to be ready
    await page.waitForLoadState('domcontentloaded');
    console.log('DOM content loaded');
    
    // Basic assertion
    const title = await page.title();
    console.log('Page title:', title);
    expect(title).toBeTruthy();
    
    console.log('Basic connectivity test completed successfully');
  });

  test('element visibility test', async ({ page }) => {
    console.log('Starting element visibility test...');
    
    await page.goto('https://demoqa.com');
    await page.waitForLoadState('domcontentloaded');
    
    // Test basic element visibility
    const body = page.locator('body');
    await expect(body).toBeVisible();
    console.log('Body element is visible');
    
    // Test if page has content
    const textContent = await page.textContent('body');
    expect(textContent).toBeTruthy();
    console.log('Page has text content');
    
    console.log('Element visibility test completed successfully');
  });

  test('screenshot test', async ({ page }) => {
    console.log('Starting screenshot test...');
    
    await page.goto('https://demoqa.com');
    await page.waitForLoadState('domcontentloaded');
    
    // Take a screenshot
    await page.screenshot({ path: 'test-results/screenshots/debug-test.png' });
    console.log('Screenshot taken successfully');
    
    console.log('Screenshot test completed successfully');
  });
});
