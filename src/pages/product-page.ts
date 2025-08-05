import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '@utils/base-page';

export class ProductPage extends BasePage {
  // Product information locators
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly productDescription: Locator;
  readonly productImages: Locator;
  readonly mainProductImage: Locator;
  readonly thumbnailImages: Locator;

  // Product options locators
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly addToWishlistButton: Locator;
  readonly compareButton: Locator;

  // Product attributes
  readonly productOptions: Locator;
  readonly optionSelects: Locator;
  readonly optionCheckboxes: Locator;
  readonly optionTextInputs: Locator;

  // Reviews section
  readonly reviewsTab: Locator;
  readonly reviewForm: Locator;
  readonly reviewNameInput: Locator;
  readonly reviewTextInput: Locator;
  readonly reviewRatingInputs: Locator;
  readonly submitReviewButton: Locator;
  readonly reviewList: Locator;

  // Related products
  readonly relatedProductsSection: Locator;
  readonly relatedProductCards: Locator;

  // Breadcrumb navigation
  readonly breadcrumbHome: Locator;
  readonly breadcrumbCategory: Locator;
  readonly breadcrumbProduct: Locator;

  // Success/Error messages
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    
    // Product information locators
    this.productName = page.locator('h1');
    this.productPrice = page.locator('.price-new, .price');
    this.productDescription = page.locator('#tab-description');
    this.productImages = page.locator('.thumbnails img');
    this.mainProductImage = page.locator('.thumbnails img').first();
    this.thumbnailImages = page.locator('.thumbnails img');

    // Product options locators
    this.quantityInput = page.locator('#input-quantity');
    this.addToCartButton = page.locator('#button-cart');
    this.addToWishlistButton = page.locator('button[onclick*="wishlist.add"]');
    this.compareButton = page.locator('button[onclick*="compare.add"]');

    // Product attributes
    this.productOptions = page.locator('.form-group');
    this.optionSelects = page.locator('select[name*="option"]');
    this.optionCheckboxes = page.locator('input[type="checkbox"][name*="option"]');
    this.optionTextInputs = page.locator('input[type="text"][name*="option"]');

    // Reviews section
    this.reviewsTab = page.locator('a[href="#tab-review"]');
    this.reviewForm = page.locator('#form-review');
    this.reviewNameInput = page.locator('#input-name');
    this.reviewTextInput = page.locator('#input-review');
    this.reviewRatingInputs = page.locator('input[name="rating"]');
    this.submitReviewButton = page.locator('#button-review');
    this.reviewList = page.locator('#tab-review .review-list');

    // Related products
    this.relatedProductsSection = page.locator('.product-related');
    this.relatedProductCards = page.locator('.product-related .product-thumb');

    // Breadcrumb navigation
    this.breadcrumbHome = page.locator('.breadcrumb a:text("Home")');
    this.breadcrumbCategory = page.locator('.breadcrumb a').nth(1);
    this.breadcrumbProduct = page.locator('.breadcrumb .active');

    // Success/Error messages
    this.successMessage = page.locator('.alert-success');
    this.errorMessage = page.locator('.alert-danger');
  }

  /**
   * Navigate to product page by URL
   */
  async navigateToProduct(productUrl: string): Promise<void> {
    await this.navigateTo(productUrl);
    await this.waitForPageLoad();
  }

  /**
   * Get product name
   */
  async getProductName(): Promise<string> {
    return await this.getText(this.productName);
  }

  /**
   * Get product price
   */
  async getProductPrice(): Promise<string> {
    return await this.getText(this.productPrice);
  }

  /**
   * Get product description
   */
  async getProductDescription(): Promise<string> {
    return await this.getText(this.productDescription);
  }

  /**
   * Set product quantity
   */
  async setQuantity(quantity: number): Promise<void> {
    await this.fillInput(this.quantityInput, quantity.toString());
  }

  /**
   * Add product to cart
   */
  async addToCart(): Promise<void> {
    await this.clickElement(this.addToCartButton);
  }

  /**
   * Add product to cart with quantity
   */
  async addToCartWithQuantity(quantity: number): Promise<void> {
    await this.setQuantity(quantity);
    await this.addToCart();
  }

  /**
   * Add product to wishlist
   */
  async addToWishlist(): Promise<void> {
    await this.clickElement(this.addToWishlistButton);
  }

  /**
   * Add product to compare
   */
  async addToCompare(): Promise<void> {
    await this.clickElement(this.compareButton);
  }

  /**
   * Select product option by value
   */
  async selectProductOption(optionName: string, value: string): Promise<void> {
    const optionSelect = this.page.locator(`select[name="${optionName}"]`);
    await this.selectOption(optionSelect, value);
  }

  /**
   * Check product option checkbox
   */
  async checkProductOption(optionName: string): Promise<void> {
    const optionCheckbox = this.page.locator(`input[name="${optionName}"]`);
    await this.clickElement(optionCheckbox);
  }

  /**
   * Fill product option text input
   */
  async fillProductOption(optionName: string, value: string): Promise<void> {
    const optionInput = this.page.locator(`input[name="${optionName}"]`);
    await this.fillInput(optionInput, value);
  }

  /**
   * Open reviews tab
   */
  async openReviewsTab(): Promise<void> {
    await this.clickElement(this.reviewsTab);
  }

  /**
   * Submit product review
   */
  async submitReview(name: string, review: string, rating: number): Promise<void> {
    await this.openReviewsTab();
    await this.fillInput(this.reviewNameInput, name);
    await this.fillInput(this.reviewTextInput, review);
    
    // Select rating (1-5 stars)
    const ratingInput = this.reviewRatingInputs.nth(rating - 1);
    await this.clickElement(ratingInput);
    
    await this.clickElement(this.submitReviewButton);
  }

  /**
   * Get number of reviews
   */
  async getReviewsCount(): Promise<number> {
    return await this.reviewList.locator('.review-item').count();
  }

  /**
   * Get related products count
   */
  async getRelatedProductsCount(): Promise<number> {
    return await this.relatedProductCards.count();
  }

  /**
   * Click on related product by index
   */
  async clickRelatedProduct(index: number): Promise<void> {
    const relatedProduct = this.relatedProductCards.nth(index);
    await this.clickElement(relatedProduct);
  }

  /**
   * Navigate to home via breadcrumb
   */
  async navigateToHomeViaBreadcrumb(): Promise<void> {
    await this.clickElement(this.breadcrumbHome);
  }

  /**
   * Navigate to category via breadcrumb
   */
  async navigateToCategoryViaBreadcrumb(): Promise<void> {
    await this.clickElement(this.breadcrumbCategory);
  }

  /**
   * Get success message
   */
  async getSuccessMessage(): Promise<string> {
    return await this.getText(this.successMessage);
  }

  /**
   * Get error message
   */
  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }

  /**
   * Check if success message is visible
   */
  async isSuccessMessageVisible(): Promise<boolean> {
    return await this.isElementVisible(this.successMessage);
  }

  /**
   * Check if error message is visible
   */
  async isErrorMessageVisible(): Promise<boolean> {
    return await this.isElementVisible(this.errorMessage);
  }

  /**
   * Verify product page is loaded
   */
  async verifyProductPageLoaded(): Promise<void> {
    await this.assertElementVisible(this.productName);
    await this.assertElementVisible(this.productPrice);
    await this.assertElementVisible(this.addToCartButton);
  }

  /**
   * Verify product added to cart
   */
  async verifyProductAddedToCart(): Promise<void> {
    await this.assertElementVisible(this.successMessage);
    const message = await this.getSuccessMessage();
    expect(message).toContain('Success');
  }

  /**
   * Verify product added to wishlist
   */
  async verifyProductAddedToWishlist(): Promise<void> {
    await this.assertElementVisible(this.successMessage);
    const message = await this.getSuccessMessage();
    expect(message).toContain('Success');
  }

  /**
   * Take screenshot of product
   */
  async takeProductScreenshot(): Promise<void> {
    await this.takeScreenshot(`product-${await this.getProductName()}`);
  }

  /**
   * Get product images count
   */
  async getProductImagesCount(): Promise<number> {
    return await this.thumbnailImages.count();
  }

  /**
   * Click on product image thumbnail
   */
  async clickProductImageThumbnail(index: number): Promise<void> {
    const thumbnail = this.thumbnailImages.nth(index);
    await this.clickElement(thumbnail);
  }
} 