import { test, expect } from '@playwright/test';

/**
 * Quick Smoke Test Suite for DEMOQA
 * These tests verify basic functionality and page structure
 * Run with: npm run test:quick
 */
test.describe('DEMOQA Smoke Tests', () => {
  
  test('homepage should load successfully', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Verify page title
    const pageTitle = await page.title();
    console.log('Page title:', pageTitle);
    expect(pageTitle).toContain('DEMOQA');
  });

  test('page should contain headings', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Check for presence of headings
    const allHeadings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await allHeadings.count();
    expect(headingCount).toBeGreaterThan(0);
  });

  test('navigation elements should be present', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Look for navigation components
    const navigationElements = page.locator('nav, header, .navbar, .menu, .navigation');
    const navCount = await navigationElements.count();
    expect(navCount).toBeGreaterThan(0);
  });

  test('page should have content', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Verify page has text content
    const pageContent = await page.textContent('body');
    expect(pageContent).toBeTruthy();
    expect(pageContent?.length).toBeGreaterThan(0);
  });

  test('basic HTML structure should be intact', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Verify essential HTML elements
    await expect(page.locator('html')).toBeVisible();
    await expect(page.locator('body')).toBeVisible();
  });

  test('page should load without errors', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Basic validation that page loaded
    const pageTitle = await page.title();
    expect(pageTitle).toBeTruthy();
    expect(pageTitle.length).toBeGreaterThan(0);
  });

  test('footer should be visible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Check footer presence
    await expect(page.locator('footer')).toBeVisible();
  });

  test('page should contain links', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Count and verify links exist
    const allLinks = page.locator('a');
    const linkCount = await allLinks.count();
    expect(linkCount).toBeGreaterThan(0);
  });

  test('images should be present', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Verify images are loaded
    const allImages = page.locator('img');
    const imageCount = await allImages.count();
    expect(imageCount).toBeGreaterThan(0);
  });

  test('page should be responsive', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Test different screen sizes
    const viewports = [
      { width: 1920, height: 1080 }, // Desktop
      { width: 768, height: 1024 },  // Tablet
      { width: 375, height: 667 },    // Mobile
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('page should handle refresh', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Test page refresh functionality
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    
    const pageTitle = await page.title();
    expect(pageTitle).toContain('DEMOQA');
  });

  test('meta tags should be present', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Check for SEO meta tags
    const metaTags = page.locator('meta');
    const metaCount = await metaTags.count();
    expect(metaCount).toBeGreaterThan(0);
  });
}); 