import { test, expect } from '@playwright/test';
import { HomePage } from '@pages/home-page';
import { CustomAssertions } from '@utils/test-helpers';

test.describe('DemoQA Tests', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigateToHome();
  });

  test.describe('Page Elements', () => {
    test('should display main page elements correctly', async ({ page }) => {
      await homePage.verifyHomePageLoaded();
      await expect(page).toHaveTitle(/DEMOQA/);
    });

    test('should display category cards', async ({ page: _page }) => {
      const productsCount = await homePage.getFeaturedProductsCount();
      CustomAssertions.assertElementCountGreaterThan(productsCount, 0);
    });

    test('should navigate to elements page', async ({ page: _page }) => {
      await homePage.navigateToCategory('Elements');
      await homePage.waitForPageLoad();
      await homePage.assertUrl(/.*elements.*/);
    });

    test('should navigate to forms page', async ({ page: _page }) => {
      await homePage.navigateToCategory('Forms');
      await homePage.waitForPageLoad();
      await homePage.assertUrl(/.*forms.*/);
    });
  });

  test.describe('Form Elements', () => {
    test('should navigate to text box form', async ({ page }) => {
      await homePage.navigateToCategory('Elements');
      await homePage.waitForPageLoad();
      
      // Click on Text Box
      await page.locator('span:text("Text Box")').click();
      await homePage.waitForPageLoad();
      await homePage.assertUrl(/.*text-box.*/);
    });

    test('should fill text box form', async ({ page }) => {
      await homePage.navigateToCategory('Elements');
      await homePage.waitForPageLoad();
      
      await page.locator('span:text("Text Box")').click();
      await homePage.waitForPageLoad();
      
      // Fill the form
      await page.locator('#userName').fill('Test User');
      await page.locator('#userEmail').fill('test@example.com');
      await page.locator('#currentAddress').fill('123 Test Street');
      await page.locator('#permanentAddress').fill('456 Permanent Street');
      
      await page.locator('#submit').click();
      
      // Verify output
      await expect(page.locator('#output')).toBeVisible();
    });
  });

  test.describe('Search Functionality', () => {
    test('should search for elements', async ({ page: _page }) => {
      const searchTerm = 'Elements';
      await homePage.searchProduct(searchTerm);
      await homePage.waitForPageLoad();
    });

    test('should handle search with no results', async ({ page: _page }) => {
      const searchTerm = 'NonExistentElement12345';
      await homePage.searchProduct(searchTerm);
      await homePage.waitForPageLoad();
    });
  });

  test.describe('Navigation', () => {
    test('should navigate to different sections', async ({ page: _page }) => {
      const sections = ['Elements', 'Forms', 'Alerts, Frame & Windows', 'Widgets'];
      
      for (const section of sections) {
        await homePage.navigateToCategory(section);
        await homePage.waitForPageLoad();
        await homePage.assertUrl(/.*demoqa.*/);
        await homePage.navigateToHome();
      }
    });
  });

  test.describe('Performance Tests', () => {
    test('should load page within acceptable time', async ({ page: _page }) => {
      const startTime = Date.now();
      await homePage.navigateToHome();
      await homePage.waitForPageLoad();
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(5000);
    });
  });

  test.describe('Responsive Design', () => {
    test('should display correctly on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await homePage.verifyHomePageLoaded();
    });

    test('should display correctly on desktop viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await homePage.verifyHomePageLoaded();
    });
  });
}); 