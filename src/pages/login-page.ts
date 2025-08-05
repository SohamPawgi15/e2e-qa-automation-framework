import { Page, Locator } from '@playwright/test';
import { BasePage } from '@utils/base-page';

export class LoginPage extends BasePage {
  // Form locators
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly registerLink: Locator;

  // Error message locators
  readonly errorMessage: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;

  // Success message locators
  readonly successMessage: Locator;

  // Remember me checkbox
  readonly rememberMeCheckbox: Locator;

  constructor(page: Page) {
    super(page);
    
    // Form locators
    this.emailInput = page.locator('#input-email');
    this.passwordInput = page.locator('#input-password');
    this.loginButton = page.locator('input[type="submit"]');
    this.forgotPasswordLink = page.locator('a:text("Forgotten Password")');
    this.registerLink = page.locator('a:text("Continue")');

    // Error message locators
    this.errorMessage = page.locator('.alert-danger');
    this.emailError = page.locator('#input-email-error');
    this.passwordError = page.locator('#input-password-error');

    // Success message locators
    this.successMessage = page.locator('.alert-success');

    // Remember me checkbox
    this.rememberMeCheckbox = page.locator('input[name="remember"]');
  }

  /**
   * Navigate to login page
   */
  async navigateToLogin(): Promise<void> {
    await this.navigateTo('/index.php?route=account/login');
    await this.waitForPageLoad();
  }

  /**
   * Fill login form
   */
  async fillLoginForm(email: string, password: string): Promise<void> {
    await this.fillInput(this.emailInput, email);
    await this.fillInput(this.passwordInput, password);
  }

  /**
   * Login with credentials
   */
  async login(email: string, password: string): Promise<void> {
    await this.fillLoginForm(email, password);
    await this.clickElement(this.loginButton);
  }

  /**
   * Login with remember me option
   */
  async loginWithRememberMe(email: string, password: string): Promise<void> {
    await this.fillLoginForm(email, password);
    await this.clickElement(this.rememberMeCheckbox);
    await this.clickElement(this.loginButton);
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    await this.clickElement(this.forgotPasswordLink);
  }

  /**
   * Click register link
   */
  async clickRegister(): Promise<void> {
    await this.clickElement(this.registerLink);
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }

  /**
   * Get email error message
   */
  async getEmailError(): Promise<string> {
    return await this.getText(this.emailError);
  }

  /**
   * Get password error message
   */
  async getPasswordError(): Promise<string> {
    return await this.getText(this.passwordError);
  }

  /**
   * Get success message text
   */
  async getSuccessMessage(): Promise<string> {
    return await this.getText(this.successMessage);
  }

  /**
   * Check if error message is visible
   */
  async isErrorMessageVisible(): Promise<boolean> {
    return await this.isElementVisible(this.errorMessage);
  }

  /**
   * Check if success message is visible
   */
  async isSuccessMessageVisible(): Promise<boolean> {
    return await this.isElementVisible(this.successMessage);
  }

  /**
   * Verify login page is loaded
   */
  async verifyLoginPageLoaded(): Promise<void> {
    await this.assertElementVisible(this.emailInput);
    await this.assertElementVisible(this.passwordInput);
    await this.assertElementVisible(this.loginButton);
  }

  /**
   * Verify login form validation
   */
  async verifyLoginFormValidation(): Promise<void> {
    // Try to login with empty fields
    await this.clickElement(this.loginButton);
    
    // Verify error messages are displayed
    await this.assertElementVisible(this.errorMessage);
  }

  /**
   * Verify successful login
   */
  async verifySuccessfulLogin(): Promise<void> {
    // Verify redirect to account page
    await this.waitForUrl(/.*account.*/);
    await this.assertUrl(/.*account.*/);
  }

  /**
   * Verify failed login
   */
  async verifyFailedLogin(): Promise<void> {
    await this.assertElementVisible(this.errorMessage);
  }

  /**
   * Clear login form
   */
  async clearLoginForm(): Promise<void> {
    await this.emailInput.clear();
    await this.passwordInput.clear();
  }
} 