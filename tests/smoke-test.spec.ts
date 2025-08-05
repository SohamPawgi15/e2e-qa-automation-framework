import { test, expect } from '@playwright/test';

test.describe('Smoke Test', () => {
  test('should load demo site successfully', async ({ page }) => {
    // Navigate to the demo site
    await page.goto('https://demo.opencart.com');
    
    // Wait for the page to load
    await page.waitForLoadState('domcontentloaded');
    
    // Verify the page title contains expected text
    await expect(page).toHaveTitle(/Your Store/);
    
    // Verify basic elements are present
    await expect(page.locator('#logo')).toBeVisible();
    await expect(page.locator('#search')).toBeVisible();
    await expect(page.locator('#cart')).toBeVisible();
    
    console.log('✅ Demo site is accessible and basic elements are present');
  });
}); 