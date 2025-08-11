import { expect } from '@playwright/test';

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Test data generator utilities
 */
export class TestDataGenerator {
  /**
   * Generate random email address
   */
  static generateRandomEmail(): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    return `testuser${timestamp}${randomString}@example.com`;
  }

  /**
   * Generate random phone number
   */
  static generateRandomPhone(): string {
    const areaCode = Math.floor(Math.random() * 900) + 100;
    const prefix = Math.floor(Math.random() * 900) + 100;
    const lineNumber = Math.floor(Math.random() * 9000) + 1000;
    return `${areaCode}-${prefix}-${lineNumber}`;
  }

  /**
   * Generate random password
   */
  static generateRandomPassword(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  /**
   * Generate random name
   */
  static generateRandomName(): string {
    const names = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Lisa', 'Tom', 'Emma', 'Chris', 'Anna'];
    return names[Math.floor(Math.random() * names.length)];
  }

  /**
   * Generate random last name
   */
  static generateRandomLastName(): string {
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
    return lastNames[Math.floor(Math.random() * lastNames.length)];
  }

  /**
   * Generate random product name
   */
  static generateRandomProductName(): string {
    const products = ['iPhone', 'Samsung Galaxy', 'MacBook Pro', 'Dell Laptop', 'iPad', 'Sony Camera'];
    return products[Math.floor(Math.random() * products.length)];
  }

  /**
   * Generate random address
   */
  static generateRandomAddress(): {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    } {
    const streets = ['Main St', 'Oak Ave', 'Pine Rd', 'Elm St', 'Maple Dr'];
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
    const states = ['NY', 'CA', 'IL', 'TX', 'AZ'];
    const countries = ['United States', 'Canada', 'United Kingdom', 'Australia'];

    return {
      street: `${Math.floor(Math.random() * 9999) + 1} ${streets[Math.floor(Math.random() * streets.length)]}`,
      city: cities[Math.floor(Math.random() * cities.length)],
      state: states[Math.floor(Math.random() * states.length)],
      zipCode: `${Math.floor(Math.random() * 90000) + 10000}`,
      country: countries[Math.floor(Math.random() * countries.length)],
    };
  }
}

/**
 * Custom assertion utilities
 */
export class CustomAssertions {
  /**
   * Assert price format is valid
   */
  static assertPriceFormat(price: string): void {
    expect(price).toMatch(/^\$[\d,]+\.\d{2}$/);
  }

  /**
   * Assert email format is valid
   */
  static assertEmailFormat(email: string): void {
    expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  }

  /**
   * Assert phone format is valid
   */
  static assertPhoneFormat(phone: string): void {
    expect(phone).toMatch(/^\d{3}-\d{3}-\d{4}$/);
  }

  /**
   * Assert quantity is positive
   */
  static assertPositiveQuantity(quantity: number): void {
    expect(quantity).toBeGreaterThan(0);
  }

  /**
   * Assert text contains substring
   */
  static assertTextContains(text: string, substring: string): void {
    expect(text).toContain(substring);
  }

  /**
   * Assert URL contains path
   */
  static assertUrlContains(url: string, path: string): void {
    expect(url).toContain(path);
  }

  /**
   * Assert element count is greater than
   */
  static assertElementCountGreaterThan(count: number, minCount: number): void {
    expect(count).toBeGreaterThan(minCount);
  }

  /**
   * Assert element count equals
   */
  static assertElementCountEquals(count: number, expectedCount: number): void {
    expect(count).toBe(expectedCount);
  }
}

/**
 * Test setup utilities
 */
export class TestSetup {
  /**
   * Wait for page to be fully loaded
   */
  static async waitForPageLoad(page: any): Promise<void> {
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');
  }

  /**
   * Take screenshot on test failure
   */
  static async takeScreenshotOnFailure(page: any, testName: string): Promise<void> {
    try {
      await page.screenshot({
        path: `test-results/screenshots/failure-${testName}-${Date.now()}.png`,
        fullPage: true,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to take screenshot:', error);
    }
  }

  /**
   * Clear browser storage
   */
  static async clearBrowserStorage(page: any): Promise<void> {
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }

  /**
   * Set viewport size
   */
  static async setViewport(page: any, width: number, height: number): Promise<void> {
    await page.setViewportSize({ width, height });
  }

  /**
   * Mock network requests
   */
  static async mockNetworkRequests(page: any, mockData: Record<string, any>): Promise<void> {
    await page.route('**/*', (route: any) => {
      const url = route.request().url();
      if (mockData[url]) {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockData[url]),
        });
      } else {
        route.continue();
      }
    });
  }
}

/**
 * Performance utilities
 */
export class PerformanceUtils {
  /**
   * Measure page load time
   */
  static async measurePageLoadTime(page: any): Promise<number> {
    const startTime = Date.now();
    await page.waitForLoadState('networkidle');
    const endTime = Date.now();
    return endTime - startTime;
  }

  /**
   * Assert page load time is within acceptable range
   */
  static assertPageLoadTime(loadTime: number, maxTime: number = 5000): void {
    expect(loadTime).toBeLessThan(maxTime);
  }

  /**
   * Get memory usage
   */
  static async getMemoryUsage(page: any): Promise<any> {
    return await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory;
      }
      return null;
    });
  }
}

/**
 * Data validation utilities
 */
export class DataValidation {
  /**
   * Validate product data structure
   */
  static validateProductData(product: any): void {
    expect(product).toHaveProperty('name');
    expect(product).toHaveProperty('price');
    expect(typeof product.name).toBe('string');
    expect(product.name.length).toBeGreaterThan(0);
  }

  /**
   * Validate user data structure
   */
  static validateUserData(user: any): void {
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('password');
    expect(typeof user.email).toBe('string');
    expect(typeof user.password).toBe('string');
    CustomAssertions.assertEmailFormat(user.email);
  }

  /**
   * Validate cart data structure
   */
  static validateCartData(cart: any): void {
    expect(cart).toHaveProperty('itemsCount');
    expect(cart).toHaveProperty('total');
    expect(typeof cart.itemsCount).toBe('number');
    expect(cart.itemsCount).toBeGreaterThanOrEqual(0);
  }
} 