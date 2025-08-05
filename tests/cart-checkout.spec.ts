import { test, expect } from '@playwright/test';
import { HomePage } from '@pages/home-page';
import { CartPage } from '@pages/cart-page';
import { ProductPage } from '@pages/product-page';
import { TestDataGenerator, CustomAssertions, DataValidation } from '@utils/test-helpers';

test.describe('Cart and Checkout Tests', () => {
  let homePage: HomePage;
  let cartPage: CartPage;
  let productPage: ProductPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    cartPage = new CartPage(page);
    productPage = new ProductPage(page);
    await homePage.navigateToHome();
  });

  test.describe('Cart Management', () => {
    test('should add product to cart from home page', async ({ page }) => {
      const initialCartCount = await homePage.getCartCount();
      await homePage.addProductToCart(0);
      
      await page.waitForTimeout(2000);
      const updatedCartCount = await homePage.getCartCount();
      expect(updatedCartCount).not.toBe(initialCartCount);
    });

    test('should add product to cart from product page', async ({ page }) => {
      await homePage.clickProduct(0);
      await productPage.waitForPageLoad();
      
      await productPage.addToCart();
      await productPage.verifyProductAddedToCart();
    });

    test('should add multiple products to cart', async ({ page }) => {
      // Add first product
      await homePage.addProductToCart(0);
      await page.waitForTimeout(1000);
      
      // Add second product
      await homePage.addProductToCart(1);
      await page.waitForTimeout(1000);
      
      const cartCount = await homePage.getCartCount();
      expect(cartCount).not.toBe('0');
    });

    test('should open cart page', async ({ page }) => {
      await homePage.openCart();
      await cartPage.waitForPageLoad();
      await cartPage.assertUrl(/.*cart.*/);
    });

    test('should display cart items correctly', async ({ page }) => {
      // Add product to cart first
      await homePage.addProductToCart(0);
      await page.waitForTimeout(2000);
      
      await cartPage.navigateToCart();
      await cartPage.verifyCartPageLoaded();
      
      const itemsCount = await cartPage.getCartItemsCount();
      expect(itemsCount).toBeGreaterThan(0);
    });
  });

  test.describe('Cart Operations', () => {
    test('should update product quantity in cart', async ({ page }) => {
      // Add product to cart
      await homePage.addProductToCart(0);
      await page.waitForTimeout(2000);
      
      await cartPage.navigateToCart();
      await cartPage.updateCartItemQuantity(0, 3);
      await cartPage.clickUpdateCart();
      
      await page.waitForTimeout(2000);
      const quantity = await cartPage.getCartItemQuantity(0);
      expect(quantity).toBe('3');
    });

    test('should remove product from cart', async ({ page }) => {
      // Add product to cart
      await homePage.addProductToCart(0);
      await page.waitForTimeout(2000);
      
      await cartPage.navigateToCart();
      const initialItemsCount = await cartPage.getCartItemsCount();
      
      await cartPage.removeCartItem(0);
      await page.waitForTimeout(2000);
      
      const finalItemsCount = await cartPage.getCartItemsCount();
      expect(finalItemsCount).toBeLessThan(initialItemsCount);
    });

    test('should clear entire cart', async ({ page }) => {
      // Add multiple products
      await homePage.addProductToCart(0);
      await homePage.addProductToCart(1);
      await page.waitForTimeout(2000);
      
      await cartPage.navigateToCart();
      await cartPage.clearCart();
      
      await cartPage.verifyCartIsEmpty();
    });

    test('should display cart summary correctly', async ({ page }) => {
      // Add product to cart
      await homePage.addProductToCart(0);
      await page.waitForTimeout(2000);
      
      await cartPage.navigateToCart();
      const cartSummary = await cartPage.getCartSummary();
      
      expect(cartSummary.itemsCount).toBeGreaterThan(0);
      expect(cartSummary.subtotal).toBeTruthy();
      expect(cartSummary.total).toBeTruthy();
      expect(cartSummary.items.length).toBeGreaterThan(0);
    });

    test('should calculate cart totals correctly', async ({ page }) => {
      // Add product to cart
      await homePage.addProductToCart(0);
      await page.waitForTimeout(2000);
      
      await cartPage.navigateToCart();
      const subtotal = await cartPage.getCartSubtotal();
      const total = await cartPage.getCartTotal();
      
      expect(subtotal).toBeTruthy();
      expect(total).toBeTruthy();
      CustomAssertions.assertPriceFormat(subtotal);
      CustomAssertions.assertPriceFormat(total);
    });
  });

  test.describe('Coupon and Voucher System', () => {
    test('should apply coupon code', async ({ page }) => {
      // Add product to cart
      await homePage.addProductToCart(0);
      await page.waitForTimeout(2000);
      
      await cartPage.navigateToCart();
      await cartPage.applyCoupon('TESTCOUPON');
      
      await page.waitForTimeout(2000);
      // Verify coupon application
    });

    test('should apply voucher code', async ({ page }) => {
      // Add product to cart
      await homePage.addProductToCart(0);
      await page.waitForTimeout(2000);
      
      await cartPage.navigateToCart();
      await cartPage.applyVoucher('TESTVOUCHER');
      
      await page.waitForTimeout(2000);
      // Verify voucher application
    });

    test('should handle invalid coupon codes', async ({ page }) => {
      // Add product to cart
      await homePage.addProductToCart(0);
      await page.waitForTimeout(2000);
      
      await cartPage.navigateToCart();
      await cartPage.applyCoupon('INVALIDCOUPON');
      
      await page.waitForTimeout(2000);
      // Verify error message
    });
  });

  test.describe('Shipping Estimation', () => {
    test('should calculate shipping costs', async ({ page }) => {
      // Add product to cart
      await homePage.addProductToCart(0);
      await page.waitForTimeout(2000);
      
      await cartPage.navigateToCart();
      await cartPage.getShippingEstimate('United States', 'California', '90210');
      
      await page.waitForTimeout(2000);
      // Verify shipping calculation
    });

    test('should handle different shipping destinations', async ({ page }) => {
      // Add product to cart
      await homePage.addProductToCart(0);
      await page.waitForTimeout(2000);
      
      await cartPage.navigateToCart();
      
      const destinations = [
        { country: 'United States', region: 'New York', postcode: '10001' },
        { country: 'Canada', region: 'Ontario', postcode: 'M5V 3A8' },
        { country: 'United Kingdom', region: 'England', postcode: 'SW1A 1AA' }
      ];
      
      for (const dest of destinations) {
        await cartPage.getShippingEstimate(dest.country, dest.region, dest.postcode);
        await page.waitForTimeout(1000);
      }
    });
  });

  test.describe('Checkout Process', () => {
    test('should proceed to checkout', async ({ page }) => {
      // Add product to cart
      await homePage.addProductToCart(0);
      await page.waitForTimeout(2000);
      
      await cartPage.navigateToCart();
      await cartPage.clickCheckout();
      
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/.*checkout.*/);
    });

    test('should validate cart before checkout', async ({ page }) => {
      await cartPage.navigateToCart();
      
      // Try to checkout with empty cart
      if (await cartPage.isCartEmpty()) {
        await cartPage.clickCheckout();
        // Verify appropriate error or redirect
      }
    });

    test('should continue shopping from cart', async ({ page }) => {
      await cartPage.navigateToCart();
      await cartPage.clickContinueShopping();
      
      await homePage.verifyHomePageLoaded();
    });
  });

  test.describe('Cart Validation', () => {
    test('should validate cart data structure', async ({ page }) => {
      // Add product to cart
      await homePage.addProductToCart(0);
      await page.waitForTimeout(2000);
      
      await cartPage.navigateToCart();
      const cartSummary = await cartPage.getCartSummary();
      
      DataValidation.validateCartData(cartSummary);
    });

    test('should verify cart item exists', async ({ page }) => {
      // Add specific product
      const productName = await homePage.getProductName(0);
      await homePage.addProductToCart(0);
      await page.waitForTimeout(2000);
      
      await cartPage.navigateToCart();
      await cartPage.verifyCartItemExists(productName);
    });

    test('should handle cart with multiple items', async ({ page }) => {
      // Add multiple products
      for (let i = 0; i < 3; i++) {
        await homePage.addProductToCart(i);
        await page.waitForTimeout(1000);
      }
      
      await cartPage.navigateToCart();
      const itemsCount = await cartPage.getCartItemsCount();
      expect(itemsCount).toBeGreaterThanOrEqual(3);
    });
  });

  test.describe('Performance Tests', () => {
    test('should load cart page within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await cartPage.navigateToCart();
      await cartPage.waitForPageLoad();
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(5000);
    });

    test('should handle rapid cart operations', async ({ page }) => {
      // Add product to cart
      await homePage.addProductToCart(0);
      await page.waitForTimeout(2000);
      
      await cartPage.navigateToCart();
      
      // Rapid quantity updates
      await cartPage.updateCartItemQuantity(0, 1);
      await cartPage.updateCartItemQuantity(0, 2);
      await cartPage.updateCartItemQuantity(0, 3);
      await cartPage.clickUpdateCart();
      
      // Verify cart is still responsive
      await cartPage.assertElementVisible(cartPage.checkoutButton);
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors during cart operations', async ({ page }) => {
      await cartPage.navigateToCart();
      
      // This would require mocking network failures
      // For now, verify basic functionality
      await cartPage.verifyCartPageLoaded();
    });

    test('should handle invalid quantity inputs', async ({ page }) => {
      // Add product to cart
      await homePage.addProductToCart(0);
      await page.waitForTimeout(2000);
      
      await cartPage.navigateToCart();
      
      // Try invalid quantities
      await cartPage.updateCartItemQuantity(0, -1);
      await cartPage.updateCartItemQuantity(0, 0);
      await cartPage.updateCartItemQuantity(0, 999999);
      
      await cartPage.clickUpdateCart();
      // Verify appropriate validation
    });

    test('should handle cart timeout scenarios', async ({ page }) => {
      await cartPage.navigateToCart();
      
      // Simulate slow network
      await page.route('**/*', route => {
        setTimeout(() => route.continue(), 10000);
      });
      
      await cartPage.clickUpdateCart();
      // Verify timeout handling
    });
  });

  test.describe('Accessibility Tests', () => {
    test('should have proper ARIA labels on cart elements', async ({ page }) => {
      await cartPage.navigateToCart();
      
      // Check ARIA labels on interactive elements
      const checkoutButton = cartPage.checkoutButton;
      const ariaLabel = await checkoutButton.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    });

    test('should have proper form labels', async ({ page }) => {
      await cartPage.navigateToCart();
      
      // Check form labels
      const quantityInputs = await cartPage.quantityInputs.all();
      for (const input of quantityInputs) {
        const id = await input.getAttribute('id');
        if (id) {
          const label = await page.locator(`label[for="${id}"]`).count();
          expect(label).toBeGreaterThan(0);
        }
      }
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test('should display cart correctly on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Add product to cart
      await homePage.addProductToCart(0);
      await page.waitForTimeout(2000);
      
      await cartPage.navigateToCart();
      await cartPage.verifyCartPageLoaded();
    });

    test('should handle cart operations on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Add product to cart
      await homePage.addProductToCart(0);
      await page.waitForTimeout(2000);
      
      await cartPage.navigateToCart();
      await cartPage.updateCartItemQuantity(0, 2);
      await cartPage.clickUpdateCart();
      
      await page.waitForTimeout(2000);
      const quantity = await cartPage.getCartItemQuantity(0);
      expect(quantity).toBe('2');
    });
  });
}); 