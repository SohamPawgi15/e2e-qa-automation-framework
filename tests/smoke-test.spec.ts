import { test, expect } from '@playwright/test';

test.describe('Smoke Test', () => {
  test('should load demo site successfully', async ({ page }) => {
    // Navigate to the demo site
    await page.goto('https://demoqa.com');
    
    // Wait for the page to load
    await page.waitForLoadState('domcontentloaded');
    
    // Verify the page title contains expected text
    await expect(page).toHaveTitle(/DEMOQA/);
    
    // Verify basic elements are present
    await expect(page.locator('.banner-image')).toBeVisible();
    await expect(page.locator('.category-cards')).toBeVisible();
    
    // Verify at least one category card is present
    const categoryCards = page.locator('.card');
    await expect(categoryCards.first()).toBeVisible();
    
    // Verify the page has the expected content
    await expect(page.locator('h5:text("Elements")')).toBeVisible();
    await expect(page.locator('h5:text("Forms")')).toBeVisible();
    
    console.log('✅ Demo site is accessible and basic elements are present');
  });
}); 