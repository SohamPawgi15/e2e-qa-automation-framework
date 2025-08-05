import { test, expect } from '@playwright/test';

test('simple test', async ({ page }) => {
  // Navigate directly to example.com
  await page.goto('https://example.com');
  
  // Wait for the page to load
  await page.waitForLoadState('domcontentloaded');
  
  // Get the title
  const title = await page.title();
  console.log('Page title:', title);
  
  // Check the title
  expect(title).toContain('Example Domain');
}); 