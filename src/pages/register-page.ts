import { Page, Locator } from '@playwright/test';
import { BasePage } from '@utils/base-page';

export class RegisterPage extends BasePage {
  // Personal details locators
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly telephoneInput: Locator;

  // Password locators
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;

  // Newsletter subscription
  readonly newsletterCheckbox: Locator;

  // Privacy policy
  readonly privacyPolicyCheckbox: Locator;

  // Form buttons
  readonly continueButton: Locator;
  readonly backButton: Locator;

  // Error message locators
  readonly errorMessage: Locator;
  readonly firstNameError: Locator;
  readonly lastNameError: Locator;
  readonly emailError: Locator;
  readonly telephoneError: Locator;
  readonly passwordError: Locator;
  readonly confirmPasswordError: Locator;

  // Success message locators
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    
    // Personal details locators
    this.firstNameInput = page.locator('#input-firstname');
    this.lastNameInput = page.locator('#input-lastname');
    this.emailInput = page.locator('#input-email');
    this.telephoneInput = page.locator('#input-telephone');

    // Password locators
    this.passwordInput = page.locator('#input-password');
    this.confirmPasswordInput = page.locator('#input-confirm');

    // Newsletter subscription
    this.newsletterCheckbox = page.locator('input[name="newsletter"]');

    // Privacy policy
    this.privacyPolicyCheckbox = page.locator('input[name="agree"]');

    // Form buttons
    this.continueButton = page.locator('input[type="submit"]');
    this.backButton = page.locator('a:text("Back")');

    // Error message locators
    this.errorMessage = page.locator('.alert-danger');
    this.firstNameError = page.locator('#input-firstname-error');
    this.lastNameError = page.locator('#input-lastname-error');
    this.emailError = page.locator('#input-email-error');
    this.telephoneError = page.locator('#input-telephone-error');
    this.passwordError = page.locator('#input-password-error');
    this.confirmPasswordError = page.locator('#input-confirm-error');

    // Success message locators
    this.successMessage = page.locator('.alert-success');
  }

  /**
   * Navigate to registration page
   */
  async navigateToRegister(): Promise<void> {
    await this.navigateTo('/index.php?route=account/register');
    await this.waitForPageLoad();
  }

  /**
   * Fill personal details
   */
  async fillPersonalDetails(firstName: string, lastName: string, email: string, telephone: string): Promise<void> {
    await this.fillInput(this.firstNameInput, firstName);
    await this.fillInput(this.lastNameInput, lastName);
    await this.fillInput(this.emailInput, email);
    await this.fillInput(this.telephoneInput, telephone);
  }

  /**
   * Fill password fields
   */
  async fillPasswordFields(password: string, confirmPassword: string): Promise<void> {
    await this.fillInput(this.passwordInput, password);
    await this.fillInput(this.confirmPasswordInput, confirmPassword);
  }

  /**
   * Complete registration form
   */
  async fillRegistrationForm(
    firstName: string,
    lastName: string,
    email: string,
    telephone: string,
    password: string,
    confirmPassword: string
  ): Promise<void> {
    await this.fillPersonalDetails(firstName, lastName, email, telephone);
    await this.fillPasswordFields(password, confirmPassword);
  }

  /**
   * Register with newsletter subscription
   */
  async registerWithNewsletter(
    firstName: string,
    lastName: string,
    email: string,
    telephone: string,
    password: string,
    confirmPassword: string
  ): Promise<void> {
    await this.fillRegistrationForm(firstName, lastName, email, telephone, password, confirmPassword);
    await this.clickElement(this.newsletterCheckbox);
    await this.clickElement(this.privacyPolicyCheckbox);
    await this.clickElement(this.continueButton);
  }

  /**
   * Register without newsletter subscription
   */
  async registerWithoutNewsletter(
    firstName: string,
    lastName: string,
    email: string,
    telephone: string,
    password: string,
    confirmPassword: string
  ): Promise<void> {
    await this.fillRegistrationForm(firstName, lastName, email, telephone, password, confirmPassword);
    await this.clickElement(this.privacyPolicyCheckbox);
    await this.clickElement(this.continueButton);
  }

  /**
   * Click continue button
   */
  async clickContinue(): Promise<void> {
    await this.clickElement(this.continueButton);
  }

  /**
   * Click back button
   */
  async clickBack(): Promise<void> {
    await this.clickElement(this.backButton);
  }

  /**
   * Toggle newsletter subscription
   */
  async toggleNewsletter(): Promise<void> {
    await this.clickElement(this.newsletterCheckbox);
  }

  /**
   * Accept privacy policy
   */
  async acceptPrivacyPolicy(): Promise<void> {
    await this.clickElement(this.privacyPolicyCheckbox);
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }

  /**
   * Get specific field error message
   */
  async getFieldError(fieldName: string): Promise<string> {
    const errorLocator = this.page.locator(`#input-${fieldName}-error`);
    return await this.getText(errorLocator);
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
   * Verify registration page is loaded
   */
  async verifyRegistrationPageLoaded(): Promise<void> {
    await this.assertElementVisible(this.firstNameInput);
    await this.assertElementVisible(this.lastNameInput);
    await this.assertElementVisible(this.emailInput);
    await this.assertElementVisible(this.telephoneInput);
    await this.assertElementVisible(this.passwordInput);
    await this.assertElementVisible(this.confirmPasswordInput);
  }

  /**
   * Verify registration form validation
   */
  async verifyRegistrationFormValidation(): Promise<void> {
    // Try to submit with empty fields
    await this.clickElement(this.continueButton);
    
    // Verify error messages are displayed
    await this.assertElementVisible(this.errorMessage);
  }

  /**
   * Verify successful registration
   */
  async verifySuccessfulRegistration(): Promise<void> {
    // Verify redirect to success page
    await this.waitForUrl(/.*success.*/);
    await this.assertUrl(/.*success.*/);
  }

  /**
   * Verify failed registration
   */
  async verifyFailedRegistration(): Promise<void> {
    await this.assertElementVisible(this.errorMessage);
  }

  /**
   * Clear registration form
   */
  async clearRegistrationForm(): Promise<void> {
    await this.firstNameInput.clear();
    await this.lastNameInput.clear();
    await this.emailInput.clear();
    await this.telephoneInput.clear();
    await this.passwordInput.clear();
    await this.confirmPasswordInput.clear();
  }

  /**
   * Generate random email for testing
   */
  generateRandomEmail(): string {
    const timestamp = Date.now();
    return `testuser${timestamp}@example.com`;
  }
} 