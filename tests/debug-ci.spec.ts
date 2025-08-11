import { test, expect } from '@playwright/test';

/**
 * Minimal Debug Test Suite for CI Environment
 * This test helps identify the exact issue causing timeouts
 */
test.describe('CI Debug Tests', () => {
  
  test('minimal connectivity test', async ({ page }) => {
    console.log('🚀 Starting minimal connectivity test...');
    console.log('📊 Environment:', {
      BASE_URL: process.env.BASE_URL || 'https://demoqa.com',
      CI: process.env.CI,
      NODE_ENV: process.env.NODE_ENV
    });
    
    try {
      // Test basic page load with shorter timeout
      console.log('🌐 Attempting to navigate to demoqa.com...');
      await page.goto('https://demoqa.com', { timeout: 30000 });
      console.log('✅ Page navigation successful');
      
      // Wait for page to be ready
      console.log('⏳ Waiting for DOM content...');
      await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
      console.log('✅ DOM content loaded');
      
      // Basic assertion
      const title = await page.title();
      console.log('📄 Page title:', title);
      expect(title).toBeTruthy();
      
      console.log('🎉 Minimal connectivity test completed successfully');
    } catch (error) {
      console.error('❌ Test failed with error:', error);
      throw error;
    }
  });

  test('basic element test', async ({ page }) => {
    console.log('🔍 Starting basic element test...');
    
    try {
      await page.goto('https://demoqa.com', { timeout: 30000 });
      await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
      
      // Test basic element visibility
      const body = page.locator('body');
      await expect(body).toBeVisible({ timeout: 10000 });
      console.log('✅ Body element is visible');
      
      console.log('🎉 Basic element test completed successfully');
    } catch (error) {
      console.error('❌ Element test failed with error:', error);
      throw error;
    }
  });
});
