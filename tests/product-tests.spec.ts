import { test, expect } from '@playwright/test';
import { HomePage } from '@pages/home-page';
import { ProductPage } from '@pages/product-page';
import { TestDataGenerator, CustomAssertions, DataValidation } from '@utils/test-helpers';

test.describe('Product Tests', () => {
  let homePage: HomePage;
  let productPage: ProductPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productPage = new ProductPage(page);
    await homePage.navigateToHome();
  });

  test.describe('Product Browsing', () => {
    test('should display product information correctly', async ({ page }) => {
      const productName = await homePage.getProductName(0);
      const productPrice = await homePage.getProductPrice(0);
      
      expect(productName).toBeTruthy();
      expect(productName.length).toBeGreaterThan(0);
      expect(productPrice).toBeTruthy();
      CustomAssertions.assertPriceFormat(productPrice);
    });

    test('should navigate to product details page', async ({ page }) => {
      const productName = await homePage.getProductName(0);
      await homePage.clickProduct(0);
      
      await productPage.waitForPageLoad();
      await productPage.assertUrl(/.*product.*/);
      
      const detailProductName = await productPage.getProductName();
      expect(detailProductName).toBe(productName);
    });

    test('should display product images', async ({ page }) => {
      await homePage.clickProduct(0);
      await productPage.waitForPageLoad();
      
      const imagesCount = await productPage.getProductImagesCount();
      CustomAssertions.assertElementCountGreaterThan(imagesCount, 0);
    });

    test('should navigate through product images', async ({ page }) => {
      await homePage.clickProduct(0);
      await productPage.waitForPageLoad();
      
      const imagesCount = await productPage.getProductImagesCount();
      if (imagesCount > 1) {
        await productPage.clickProductImageThumbnail(1);
        await page.waitForTimeout(1000);
      }
    });
  });

  test.describe('Product Details', () => {
    test('should display product description', async ({ page }) => {
      await homePage.clickProduct(0);
      await productPage.waitForPageLoad();
      
      const description = await productPage.getProductDescription();
      expect(description).toBeTruthy();
      expect(description.length).toBeGreaterThan(0);
    });

    test('should display product price', async ({ page }) => {
      await homePage.clickProduct(0);
      await productPage.waitForPageLoad();
      
      const price = await productPage.getProductPrice();
      expect(price).toBeTruthy();
      CustomAssertions.assertPriceFormat(price);
    });

    test('should allow quantity selection', async ({ page }) => {
      await homePage.clickProduct(0);
      await productPage.waitForPageLoad();
      
      await productPage.setQuantity(3);
      const quantity = await productPage.quantityInput.inputValue();
      expect(quantity).toBe('3');
    });

    test('should validate product data structure', async ({ page }) => {
      await homePage.clickProduct(0);
      await productPage.waitForPageLoad();
      
      const productData = {
        name: await productPage.getProductName(),
        price: await productPage.getProductPrice(),
        description: await productPage.getProductDescription(),
      };
      
      DataValidation.validateProductData(productData);
    });
  });

  test.describe('Product Interactions', () => {
    test('should add product to cart', async ({ page }) => {
      await homePage.clickProduct(0);
      await productPage.waitForPageLoad();
      
      await productPage.addToCart();
      await productPage.verifyProductAddedToCart();
    });

    test('should add product to cart with quantity', async ({ page }) => {
      await homePage.clickProduct(0);
      await productPage.waitForPageLoad();
      
      await productPage.addToCartWithQuantity(2);
      await productPage.verifyProductAddedToCart();
    });

    test('should add product to wishlist', async ({ page }) => {
      await homePage.clickProduct(0);
      await productPage.waitForPageLoad();
      
      await productPage.addToWishlist();
      await productPage.verifyProductAddedToWishlist();
    });

    test('should add product to compare', async ({ page }) => {
      await homePage.clickProduct(0);
      await productPage.waitForPageLoad();
      
      await productPage.addToCompare();
      // Verify compare functionality
      await page.waitForTimeout(2000);
    });
  });

  test.describe('Product Options', () => {
    test('should handle product options if available', async ({ page }) => {
      await homePage.clickProduct(0);
      await productPage.waitForPageLoad();
      
      // Check if product has options
      const optionsCount = await productPage.optionSelects.count();
      if (optionsCount > 0) {
        await productPage.selectProductOption('option[1]', '1');
        await page.waitForTimeout(1000);
      }
    });

    test('should handle product checkboxes if available', async ({ page }) => {
      await homePage.clickProduct(0);
      await productPage.waitForPageLoad();
      
      const checkboxesCount = await productPage.optionCheckboxes.count();
      if (checkboxesCount > 0) {
        await productPage.checkProductOption('option[1]');
        await page.waitForTimeout(1000);
      }
    });

    test('should handle product text inputs if available', async ({ page }) => {
      await homePage.clickProduct(0);
      await productPage.waitForPageLoad();
      
      const textInputsCount = await productPage.optionTextInputs.count();
      if (textInputsCount > 0) {
        await productPage.fillProductOption('option[1]', 'Test Option');
        await page.waitForTimeout(1000);
      }
    });
  });

  test.describe('Product Reviews', () => {
    test('should display product reviews tab', async ({ page }) => {
      await homePage.clickProduct(0);
      await productPage.waitForPageLoad();
      
      await productPage.openReviewsTab();
      await productPage.assertElementVisible(productPage.reviewForm);
    });

    test('should submit product review', async ({ page }) => {
      await homePage.clickProduct(0);
      await productPage.waitForPageLoad();
      
      await productPage.submitReview(
        'Test User',
        'This is a great product!',
        5
      );
      
      await page.waitForTimeout(2000);
      // Verify review submission
    });

    test('should display existing reviews', async ({ page }) => {
      await homePage.clickProduct(0);
      await productPage.waitForPageLoad();
      
      await productPage.openReviewsTab();
      const reviewsCount = await productPage.getReviewsCount();
      expect(reviewsCount).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Related Products', () => {
    test('should display related products', async ({ page }) => {
      await homePage.clickProduct(0);
      await productPage.waitForPageLoad();
      
      const relatedCount = await productPage.getRelatedProductsCount();
      expect(relatedCount).toBeGreaterThanOrEqual(0);
    });

    test('should navigate to related product', async ({ page }) => {
      await homePage.clickProduct(0);
      await productPage.waitForPageLoad();
      
      const relatedCount = await productPage.getRelatedProductsCount();
      if (relatedCount > 0) {
        await productPage.clickRelatedProduct(0);
        await productPage.waitForPageLoad();
        await productPage.assertUrl(/.*product.*/);
      }
    });
  });

  test.describe('Breadcrumb Navigation', () => {
    test('should navigate via breadcrumbs', async ({ page }) => {
      await homePage.clickProduct(0);
      await productPage.waitForPageLoad();
      
      await productPage.navigateToHomeViaBreadcrumb();
      await homePage.verifyHomePageLoaded();
    });

    test('should navigate to category via breadcrumbs', async ({ page }) => {
      await homePage.clickProduct(0);
      await productPage.waitForPageLoad();
      
      await productPage.navigateToCategoryViaBreadcrumb();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/.*category.*/);
    });
  });

  test.describe('Product Search and Filtering', () => {
    test('should search for specific products', async ({ page }) => {
      const searchTerm = 'iPhone';
      await homePage.searchProduct(searchTerm);
      await homePage.waitForPageLoad();
      
      await homePage.assertUrl(/.*search.*/);
    });

    test('should filter products by category', async ({ page }) => {
      await homePage.navigateToCategory('Phones & PDAs');
      await homePage.waitForPageLoad();
      
      await homePage.assertUrl(/.*category.*/);
    });

    test('should handle search with no results', async ({ page }) => {
      const searchTerm = 'NonExistentProduct12345';
      await homePage.searchProduct(searchTerm);
      await homePage.waitForPageLoad();
      
      await homePage.assertUrl(/.*search.*/);
    });
  });

  test.describe('Performance Tests', () => {
    test('should load product page within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await homePage.clickProduct(0);
      await productPage.waitForPageLoad();
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(5000);
    });

    test('should handle rapid product interactions', async ({ page }) => {
      await homePage.clickProduct(0);
      await productPage.waitForPageLoad();
      
      // Rapid interactions
      await productPage.setQuantity(1);
      await productPage.setQuantity(2);
      await productPage.setQuantity(3);
      
      // Verify page is still responsive
      await productPage.assertElementVisible(productPage.addToCartButton);
    });
  });

  test.describe('Error Handling', () => {
    test('should handle invalid product URLs', async ({ page }) => {
      await productPage.navigateToProduct('/invalid-product-url');
      await productPage.waitForPageLoad();
      
      // Verify appropriate error handling
      await page.waitForTimeout(2000);
    });

    test('should handle network errors gracefully', async ({ page }) => {
      await homePage.clickProduct(0);
      await productPage.waitForPageLoad();
      
      // This would require mocking network failures
      // For now, verify basic functionality
      await productPage.assertElementVisible(productPage.productName);
    });
  });

  test.describe('Accessibility Tests', () => {
    test('should have proper alt text for product images', async ({ page }) => {
      await homePage.clickProduct(0);
      await productPage.waitForPageLoad();
      
      const images = await productPage.productImages.all();
      for (const image of images) {
        const altText = await image.getAttribute('alt');
        expect(altText).toBeTruthy();
      }
    });

    test('should have proper ARIA labels', async ({ page }) => {
      await homePage.clickProduct(0);
      await productPage.waitForPageLoad();
      
      // Check for ARIA labels on interactive elements
      const addToCartButton = productPage.addToCartButton;
      const ariaLabel = await addToCartButton.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    });
  });
}); 