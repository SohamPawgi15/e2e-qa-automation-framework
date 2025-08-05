import { Page, Locator } from '@playwright/test';
import { BasePage } from '@utils/base-page';

export class HomePage extends BasePage {
  // Header locators
  readonly logo: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly cartButton: Locator;
  readonly cartCount: Locator;
  readonly myAccountDropdown: Locator;
  readonly loginLink: Locator;
  readonly registerLink: Locator;
  readonly wishlistLink: Locator;

  // Navigation locators
  readonly desktopMenu: Locator;
  readonly laptopsNotebooksMenu: Locator;
  readonly componentsMenu: Locator;
  readonly tabletsMenu: Locator;
  readonly softwareMenu: Locator;
  readonly phonesPDAsMenu: Locator;
  readonly camerasMenu: Locator;
  readonly mp3PlayersMenu: Locator;

  // Featured products locators
  readonly featuredProductsSection: Locator;
  readonly productCards: Locator;
  readonly addToCartButtons: Locator;
  readonly addToWishlistButtons: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;

  // Banner and slider locators
  readonly bannerSlider: Locator;
  readonly sliderNextButton: Locator;
  readonly sliderPrevButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // Header locators
    this.logo = page.locator('#logo');
    this.searchInput = page.locator('#search input[name="search"]');
    this.searchButton = page.locator('#search button');
    this.cartButton = page.locator('#cart');
    this.cartCount = page.locator('#cart-total');
    this.myAccountDropdown = page.locator('.dropdown-toggle');
    this.loginLink = page.locator('a:text("Login")');
    this.registerLink = page.locator('a:text("Register")');
    this.wishlistLink = page.locator('#wishlist-total');

    // Navigation locators
    this.desktopMenu = page.locator('a:text("Desktops")');
    this.laptopsNotebooksMenu = page.locator('a:text("Laptops & Notebooks")');
    this.componentsMenu = page.locator('a:text("Components")');
    this.tabletsMenu = page.locator('a:text("Tablets")');
    this.softwareMenu = page.locator('a:text("Software")');
    this.phonesPDAsMenu = page.locator('a:text("Phones & PDAs")');
    this.camerasMenu = page.locator('a:text("Cameras")');
    this.mp3PlayersMenu = page.locator('a:text("MP3 Players")');

    // Featured products locators
    this.featuredProductsSection = page.locator('#content .row');
    this.productCards = page.locator('.product-thumb');
    this.addToCartButtons = page.locator('button[onclick*="cart.add"]');
    this.addToWishlistButtons = page.locator('button[onclick*="wishlist.add"]');
    this.productNames = page.locator('.product-thumb h4 a');
    this.productPrices = page.locator('.product-thumb .price');

    // Banner and slider locators
    this.bannerSlider = page.locator('#slideshow0');
    this.sliderNextButton = page.locator('.swiper-button-next');
    this.sliderPrevButton = page.locator('.swiper-button-prev');
  }

  /**
   * Navigate to home page
   */
  async navigateToHome(): Promise<void> {
    await this.navigateTo('/');
    await this.waitForPageLoad();
  }

  /**
   * Search for a product
   */
  async searchProduct(productName: string): Promise<void> {
    await this.fillInput(this.searchInput, productName);
    await this.clickElement(this.searchButton);
  }

  /**
   * Click on cart button
   */
  async openCart(): Promise<void> {
    await this.clickElement(this.cartButton);
  }

  /**
   * Get cart items count
   */
  async getCartCount(): Promise<string> {
    return await this.getText(this.cartCount);
  }

  /**
   * Open login page
   */
  async openLoginPage(): Promise<void> {
    await this.clickElement(this.myAccountDropdown);
    await this.clickElement(this.loginLink);
  }

  /**
   * Open registration page
   */
  async openRegistrationPage(): Promise<void> {
    await this.clickElement(this.myAccountDropdown);
    await this.clickElement(this.registerLink);
  }

  /**
   * Open wishlist
   */
  async openWishlist(): Promise<void> {
    await this.clickElement(this.wishlistLink);
  }

  /**
   * Navigate to category
   */
  async navigateToCategory(categoryName: string): Promise<void> {
    const categoryLocator = this.page.locator(`a:text("${categoryName}")`);
    await this.clickElement(categoryLocator);
  }

  /**
   * Add product to cart by index
   */
  async addProductToCart(productIndex: number = 0): Promise<void> {
    const addToCartButton = this.addToCartButtons.nth(productIndex);
    await this.clickElement(addToCartButton);
  }

  /**
   * Add product to wishlist by index
   */
  async addProductToWishlist(productIndex: number = 0): Promise<void> {
    const addToWishlistButton = this.addToWishlistButtons.nth(productIndex);
    await this.clickElement(addToWishlistButton);
  }

  /**
   * Get product name by index
   */
  async getProductName(productIndex: number = 0): Promise<string> {
    const productName = this.productNames.nth(productIndex);
    return await this.getText(productName);
  }

  /**
   * Get product price by index
   */
  async getProductPrice(productIndex: number = 0): Promise<string> {
    const productPrice = this.productPrices.nth(productIndex);
    return await this.getText(productPrice);
  }

  /**
   * Click on product by index
   */
  async clickProduct(productIndex: number = 0): Promise<void> {
    const productName = this.productNames.nth(productIndex);
    await this.clickElement(productName);
  }

  /**
   * Get number of featured products
   */
  async getFeaturedProductsCount(): Promise<number> {
    return await this.productCards.count();
  }

  /**
   * Navigate slider to next slide
   */
  async nextSlide(): Promise<void> {
    await this.clickElement(this.sliderNextButton);
  }

  /**
   * Navigate slider to previous slide
   */
  async previousSlide(): Promise<void> {
    await this.clickElement(this.sliderPrevButton);
  }

  /**
   * Verify home page is loaded
   */
  async verifyHomePageLoaded(): Promise<void> {
    await this.assertElementVisible(this.logo);
    await this.assertElementVisible(this.searchInput);
    await this.assertElementVisible(this.cartButton);
  }

  /**
   * Verify search functionality
   */
  async verifySearchFunctionality(productName: string): Promise<void> {
    await this.searchProduct(productName);
    await this.waitForPageLoad();
    // Verify search results page is loaded
    await this.assertUrl(/.*search.*/);
  }
} 