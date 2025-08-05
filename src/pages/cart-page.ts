import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '@utils/base-page';

export class CartPage extends BasePage {
  // Cart items locators
  readonly cartItems: Locator;
  readonly cartItemNames: Locator;
  readonly cartItemPrices: Locator;
  readonly cartItemQuantities: Locator;
  readonly cartItemTotals: Locator;
  readonly removeButtons: Locator;

  // Cart summary locators
  readonly cartSubtotal: Locator;
  readonly cartTotal: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly updateCartButton: Locator;

  // Empty cart locators
  readonly emptyCartMessage: Locator;
  readonly emptyCartContinueButton: Locator;

  // Quantity update locators
  readonly quantityInputs: Locator;
  readonly quantityIncreaseButtons: Locator;
  readonly quantityDecreaseButtons: Locator;

  // Coupon and voucher locators
  readonly couponInput: Locator;
  readonly applyCouponButton: Locator;
  readonly voucherInput: Locator;
  readonly applyVoucherButton: Locator;

  // Shipping estimate locators
  readonly countrySelect: Locator;
  readonly regionSelect: Locator;
  readonly postcodeInput: Locator;
  readonly getQuotesButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // Cart items locators
    this.cartItems = page.locator('.table-responsive tbody tr');
    this.cartItemNames = page.locator('.table-responsive tbody tr td.text-left a');
    this.cartItemPrices = page.locator('.table-responsive tbody tr td.text-right:nth-child(3)');
    this.cartItemQuantities = page.locator('.table-responsive tbody tr td input[type="text"]');
    this.cartItemTotals = page.locator('.table-responsive tbody tr td.text-right:nth-child(5)');
    this.removeButtons = page.locator('.table-responsive tbody tr td button[onclick*="cart.remove"]');

    // Cart summary locators
    this.cartSubtotal = page.locator('.table-responsive tbody tr:last-child td.text-right:nth-child(2)');
    this.cartTotal = page.locator('.table-responsive tbody tr:last-child td.text-right:nth-child(3)');
    this.checkoutButton = page.locator('a:text("Checkout")');
    this.continueShoppingButton = page.locator('a:text("Continue Shopping")');
    this.updateCartButton = page.locator('button[onclick*="cart.update"]');

    // Empty cart locators
    this.emptyCartMessage = page.locator('p:text("Your shopping cart is empty!")');
    this.emptyCartContinueButton = page.locator('a:text("Continue")');

    // Quantity update locators
    this.quantityInputs = page.locator('.table-responsive tbody tr td input[type="text"]');
    this.quantityIncreaseButtons = page.locator('.table-responsive tbody tr td button[onclick*="cart.update"]');
    this.quantityDecreaseButtons = page.locator('.table-responsive tbody tr td button[onclick*="cart.update"]');

    // Coupon and voucher locators
    this.couponInput = page.locator('#input-coupon');
    this.applyCouponButton = page.locator('#button-coupon');
    this.voucherInput = page.locator('#input-voucher');
    this.applyVoucherButton = page.locator('#button-voucher');

    // Shipping estimate locators
    this.countrySelect = page.locator('#input-country');
    this.regionSelect = page.locator('#input-zone');
    this.postcodeInput = page.locator('#input-postcode');
    this.getQuotesButton = page.locator('#button-quote');
  }

  /**
   * Navigate to cart page
   */
  async navigateToCart(): Promise<void> {
    await this.navigateTo('/index.php?route=checkout/cart');
    await this.waitForPageLoad();
  }

  /**
   * Get number of items in cart
   */
  async getCartItemsCount(): Promise<number> {
    return await this.cartItems.count();
  }

  /**
   * Get cart item name by index
   */
  async getCartItemName(index: number = 0): Promise<string> {
    const itemName = this.cartItemNames.nth(index);
    return await this.getText(itemName);
  }

  /**
   * Get cart item price by index
   */
  async getCartItemPrice(index: number = 0): Promise<string> {
    const itemPrice = this.cartItemPrices.nth(index);
    return await this.getText(itemPrice);
  }

  /**
   * Get cart item quantity by index
   */
  async getCartItemQuantity(index: number = 0): Promise<string> {
    const itemQuantity = this.cartItemQuantities.nth(index);
    return await this.getAttribute(itemQuantity, 'value') || '';
  }

  /**
   * Get cart item total by index
   */
  async getCartItemTotal(index: number = 0): Promise<string> {
    const itemTotal = this.cartItemTotals.nth(index);
    return await this.getText(itemTotal);
  }

  /**
   * Update cart item quantity by index
   */
  async updateCartItemQuantity(index: number, quantity: number): Promise<void> {
    const quantityInput = this.quantityInputs.nth(index);
    await this.fillInput(quantityInput, quantity.toString());
  }

  /**
   * Remove cart item by index
   */
  async removeCartItem(index: number = 0): Promise<void> {
    const removeButton = this.removeButtons.nth(index);
    await this.clickElement(removeButton);
  }

  /**
   * Click checkout button
   */
  async clickCheckout(): Promise<void> {
    await this.clickElement(this.checkoutButton);
  }

  /**
   * Click continue shopping button
   */
  async clickContinueShopping(): Promise<void> {
    await this.clickElement(this.continueShoppingButton);
  }

  /**
   * Click update cart button
   */
  async clickUpdateCart(): Promise<void> {
    await this.clickElement(this.updateCartButton);
  }

  /**
   * Get cart subtotal
   */
  async getCartSubtotal(): Promise<string> {
    return await this.getText(this.cartSubtotal);
  }

  /**
   * Get cart total
   */
  async getCartTotal(): Promise<string> {
    return await this.getText(this.cartTotal);
  }

  /**
   * Check if cart is empty
   */
  async isCartEmpty(): Promise<boolean> {
    return await this.isElementVisible(this.emptyCartMessage);
  }

  /**
   * Click empty cart continue button
   */
  async clickEmptyCartContinue(): Promise<void> {
    await this.clickElement(this.emptyCartContinueButton);
  }

  /**
   * Apply coupon code
   */
  async applyCoupon(couponCode: string): Promise<void> {
    await this.fillInput(this.couponInput, couponCode);
    await this.clickElement(this.applyCouponButton);
  }

  /**
   * Apply voucher code
   */
  async applyVoucher(voucherCode: string): Promise<void> {
    await this.fillInput(this.voucherInput, voucherCode);
    await this.clickElement(this.applyVoucherButton);
  }

  /**
   * Get shipping estimate
   */
  async getShippingEstimate(country: string, region: string, postcode: string): Promise<void> {
    await this.selectOption(this.countrySelect, country);
    await this.selectOption(this.regionSelect, region);
    await this.fillInput(this.postcodeInput, postcode);
    await this.clickElement(this.getQuotesButton);
  }

  /**
   * Verify cart page is loaded
   */
  async verifyCartPageLoaded(): Promise<void> {
    await this.assertElementVisible(this.cartItems.first());
    await this.assertElementVisible(this.checkoutButton);
  }

  /**
   * Verify cart is empty
   */
  async verifyCartIsEmpty(): Promise<void> {
    await this.assertElementVisible(this.emptyCartMessage);
  }

  /**
   * Verify cart has items
   */
  async verifyCartHasItems(): Promise<void> {
    const itemsCount = await this.getCartItemsCount();
    expect(itemsCount).toBeGreaterThan(0);
  }

  /**
   * Verify cart item exists
   */
  async verifyCartItemExists(productName: string): Promise<void> {
    const itemsCount = await this.getCartItemsCount();
    let itemFound = false;
    
    for (let i = 0; i < itemsCount; i++) {
      const itemName = await this.getCartItemName(i);
      if (itemName.includes(productName)) {
        itemFound = true;
        break;
      }
    }
    
    expect(itemFound).toBe(true);
  }

  /**
   * Clear cart
   */
  async clearCart(): Promise<void> {
    const itemsCount = await this.getCartItemsCount();
    
    for (let i = itemsCount - 1; i >= 0; i--) {
      await this.removeCartItem(i);
      await this.waitForPageLoad();
    }
  }

  /**
   * Update all cart items quantities
   */
  async updateAllCartItemsQuantities(quantities: number[]): Promise<void> {
    for (let i = 0; i < quantities.length; i++) {
      await this.updateCartItemQuantity(i, quantities[i]);
    }
    await this.clickUpdateCart();
  }

  /**
   * Get cart summary
   */
  async getCartSummary(): Promise<{
    itemsCount: number;
    subtotal: string;
    total: string;
    items: Array<{
      name: string;
      price: string;
      quantity: string;
      total: string;
    }>;
  }> {
    const itemsCount = await this.getCartItemsCount();
    const subtotal = await this.getCartSubtotal();
    const total = await this.getCartTotal();
    
    const items = [];
    for (let i = 0; i < itemsCount; i++) {
      items.push({
        name: await this.getCartItemName(i),
        price: await this.getCartItemPrice(i),
        quantity: await this.getCartItemQuantity(i),
        total: await this.getCartItemTotal(i),
      });
    }
    
    return {
      itemsCount,
      subtotal,
      total,
      items,
    };
  }
} 