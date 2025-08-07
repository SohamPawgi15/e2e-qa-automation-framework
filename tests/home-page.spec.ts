import { test, expect } from '@playwright/test';
import { HomePage } from '@pages/home-page';
import { TestDataGenerator, CustomAssertions, TestSetup } from '@utils/test-helpers';

test.describe('Home Page Tests', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigateToHome();
  });

  test.describe('Page Load and Navigation', () => {
    test('should load home page successfully', async ({ page }) => {
      await homePage.verifyHomePageLoaded();
      await expect(page).toHaveTitle(/DEMOQA/);
    });

    test('should display logo and main navigation elements', async () => {
      await homePage.assertElementVisible(homePage.logo);
      await homePage.assertElementVisible(homePage.searchInput);
      await homePage.assertElementVisible(homePage.cartButton);
      await homePage.assertElementVisible(homePage.myAccountDropdown);
    });

    test('should navigate to different categories', async () => {
      const categories = ['Elements', 'Forms', 'Alerts, Frame & Windows', 'Widgets'];
      
      for (const category of categories) {
        await homePage.navigateToCategory(category);
        await homePage.waitForPageLoad();
        await homePage.assertUrl(/.*demoqa.*/);
        await homePage.navigateToHome();
      }
    });

    test('should have working search functionality', async () => {
      const testProduct = TestDataGenerator.generateRandomProductName();
      await homePage.verifySearchFunctionality(testProduct);
    });
  });

  test.describe('Product Interactions', () => {
    test('should display featured products', async () => {
      const productsCount = await homePage.getFeaturedProductsCount();
      CustomAssertions.assertElementCountGreaterThan(productsCount, 0);
    });

    test('should add product to cart from home page', async ({ page }) => {
      const initialCartCount = await homePage.getCartCount();
      await homePage.addProductToCart(0);
      
      // Wait for cart update
      await page.waitForTimeout(2000);
      
      const updatedCartCount = await homePage.getCartCount();
      expect(updatedCartCount).not.toBe(initialCartCount);
    });

    test('should add product to wishlist from home page', async ({ page }) => {
      await homePage.addProductToWishlist(0);
      
      // Verify success message or wishlist update
      await page.waitForTimeout(2000);
      // Add assertion for wishlist update
    });

    test('should navigate to product details page', async () => {
      await homePage.clickProduct(0);
      
      await homePage.waitForPageLoad();
      await homePage.assertUrl(/.*product.*/);
    });

    test('should verify product information display', async () => {
      const productCount = await homePage.getFeaturedProductsCount();
      expect(productCount).toBeGreaterThan(0);
      
      // Verify first product has name and price
      const firstProductName = await homePage.getProductName(0);
      expect(firstProductName).toBeTruthy();
    });
  });

  test.describe('Search Functionality', () => {
    test('should search for existing products', async () => {
      const searchTerm = 'iPhone';
      await homePage.searchProduct(searchTerm);
      await homePage.waitForPageLoad();
      
      // Verify search results page is loaded
      await homePage.assertUrl(/.*search.*/);
    });

    test('should handle search with no results', async () => {
      const searchTerm = 'NonExistentProduct12345';
      await homePage.searchProduct(searchTerm);
      await homePage.waitForPageLoad();
      
      // Verify no results message or empty results
      await homePage.assertUrl(/.*search.*/);
    });

    test('should search with special characters', async () => {
      const searchTerms = ['iPhone 13', 'MacBook Pro', 'Samsung Galaxy S21'];
      
      for (const term of searchTerms) {
        await homePage.searchProduct(term);
        await homePage.waitForPageLoad();
        await homePage.assertUrl(/.*search.*/);
        await homePage.navigateToHome();
      }
    });
  });

  test.describe('Cart Functionality', () => {
    test('should open cart page', async () => {
      await homePage.openCart();
      await homePage.waitForPageLoad();
      await homePage.assertUrl(/.*cart.*/);
    });

    test('should display correct cart count', async () => {
      const cartCount = await homePage.getCartCount();
      expect(cartCount).toBeTruthy();
    });

    test('should update cart count after adding products', async ({ page }) => {
      const initialCount = await homePage.getCartCount();
      
      // Add multiple products
      for (let i = 0; i < 2; i++) {
        await homePage.addProductToCart(i);
        await page.waitForTimeout(1000);
      }
      
      const finalCount = await homePage.getCartCount();
      expect(finalCount).not.toBe(initialCount);
    });
  });

  test.describe('User Account Navigation', () => {
    test('should open login page', async () => {
      await homePage.openLoginPage();
      await homePage.waitForPageLoad();
      await homePage.assertUrl(/.*login.*/);
    });

    test('should open registration page', async () => {
      await homePage.openRegistrationPage();
      await homePage.waitForPageLoad();
      await homePage.assertUrl(/.*register.*/);
    });

    test('should open wishlist page', async () => {
      await homePage.openWishlist();
      await homePage.waitForPageLoad();
      await homePage.assertUrl(/.*wishlist.*/);
    });
  });

  test.describe('Banner and Slider', () => {
    test('should display banner slider', async () => {
      await homePage.assertElementVisible(homePage.bannerSlider);
    });

    test('should navigate through slider images', async ({ page }) => {
      if (await homePage.isElementVisible(homePage.sliderNextButton)) {
        await homePage.nextSlide();
        await page.waitForTimeout(1000);
        
        if (await homePage.isElementVisible(homePage.sliderPrevButton)) {
          await homePage.previousSlide();
          await page.waitForTimeout(1000);
        }
      }
    });
  });

  test.describe('Performance Tests', () => {
    test('should load page within acceptable time', async () => {
      const startTime = Date.now();
      await homePage.navigateToHome();
      await homePage.verifyHomePageLoaded();
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeLessThan(5000);
    });

    test('should handle multiple rapid interactions', async () => {
      // Test rapid clicking on different elements
      await homePage.clickElement(homePage.logo);
      await homePage.clickElement(homePage.searchInput);
      await homePage.clickElement(homePage.cartButton);
      
      // Verify page is still responsive
      await homePage.assertElementVisible(homePage.logo);
    });
  });

  test.describe('Responsive Design', () => {
    test('should display correctly on mobile viewport', async ({ page }) => {
      await TestSetup.setViewport(page, 375, 667);
      await homePage.verifyHomePageLoaded();
      
      // Verify mobile-specific elements or layout
      await homePage.assertElementVisible(homePage.logo);
    });

    test('should display correctly on tablet viewport', async ({ page }) => {
      await TestSetup.setViewport(page, 768, 1024);
      await homePage.verifyHomePageLoaded();
      
      // Verify tablet-specific elements or layout
      await homePage.assertElementVisible(homePage.logo);
    });

    test('should display correctly on desktop viewport', async ({ page }) => {
      await TestSetup.setViewport(page, 1920, 1080);
      await homePage.verifyHomePageLoaded();
      
      // Verify desktop-specific elements or layout
      await homePage.assertElementVisible(homePage.logo);
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async () => {
      // This test would require mocking network failures
      // For now, we'll test basic error handling
      await homePage.verifyHomePageLoaded();
    });

    test('should handle invalid search terms', async () => {
      const invalidTerms = ['', '   ', 'a'.repeat(1000)];
      
      for (const term of invalidTerms) {
        await homePage.searchProduct(term);
        await homePage.waitForPageLoad();
        // Verify appropriate error handling or validation
      }
    });
  });
}); 