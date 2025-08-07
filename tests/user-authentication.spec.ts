import { test, expect } from '@playwright/test';
import { HomePage } from '@pages/home-page';
import { LoginPage } from '@pages/login-page';
import { RegisterPage } from '@pages/register-page';
import { TestDataGenerator, CustomAssertions, DataValidation } from '@utils/test-helpers';

test.describe('DemoQA Form Validation Tests', () => {
  let homePage: HomePage;
  let loginPage: LoginPage;
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    registerPage = new RegisterPage(page);
  });

  test.describe('Form Validation', () => {
    test('should validate practice form fields', async ({ page }) => {
      await homePage.navigateToHome();
      await homePage.navigateToCategory('Forms');
      await homePage.waitForPageLoad();
      
      await page.locator('span:text("Practice Form")').click();
      await homePage.waitForPageLoad();
      
      // Try to submit without filling required fields
      await page.locator('#submit').click();
      
      // Verify validation messages
      await expect(page.locator('#firstName')).toHaveAttribute('class', /.*was-validated.*/);
    });

    test('should validate email format in practice form', async ({ page }) => {
      await homePage.navigateToHome();
      await homePage.navigateToCategory('Forms');
      await homePage.waitForPageLoad();
      
      await page.locator('span:text("Practice Form")').click();
      await homePage.waitForPageLoad();
      
      // Fill form with invalid email
      await page.locator('#firstName').fill('John');
      await page.locator('#lastName').fill('Doe');
      await page.locator('#userEmail').fill('invalid-email');
      await page.locator('#userNumber').fill('1234567890');
      
      await page.locator('#submit').click();
      
      // Verify validation
      await expect(page.locator('#userEmail')).toHaveAttribute('class', /.*was-validated.*/);
    });

    test('should validate phone number format', async ({ page }) => {
      await homePage.navigateToHome();
      await homePage.navigateToCategory('Forms');
      await homePage.waitForPageLoad();
      
      await page.locator('span:text("Practice Form")').click();
      await homePage.waitForPageLoad();
      
      // Fill form with invalid phone
      await page.locator('#firstName').fill('John');
      await page.locator('#lastName').fill('Doe');
      await page.locator('#userEmail').fill('john@example.com');
      await page.locator('#userNumber').fill('123'); // Too short
      
      await page.locator('#submit').click();
      
      // Verify validation
      await expect(page.locator('#userNumber')).toHaveAttribute('class', /.*was-validated.*/);
    });
  });

  test.describe('Text Box Validation', () => {
    test('should validate text box form', async ({ page }) => {
      await homePage.navigateToHome();
      await homePage.navigateToCategory('Elements');
      await homePage.waitForPageLoad();
      
      await page.locator('span:text("Text Box")').click();
      await homePage.waitForPageLoad();
      
      // Fill form with valid data
      await page.locator('#userName').fill('Test User');
      await page.locator('#userEmail').fill('test@example.com');
      await page.locator('#currentAddress').fill('123 Test Street');
      await page.locator('#permanentAddress').fill('456 Permanent Street');
      
      await page.locator('#submit').click();
      
      // Verify output
      await expect(page.locator('#output')).toBeVisible();
      await expect(page.locator('#name')).toContainText('Test User');
      await expect(page.locator('#email')).toContainText('test@example.com');
    });

    test('should validate email format in text box', async ({ page }) => {
      await homePage.navigateToHome();
      await homePage.navigateToCategory('Elements');
      await homePage.waitForPageLoad();
      
      await page.locator('span:text("Text Box")').click();
      await homePage.waitForPageLoad();
      
      // Fill form with invalid email
      await page.locator('#userName').fill('Test User');
      await page.locator('#userEmail').fill('invalid-email');
      await page.locator('#currentAddress').fill('123 Test Street');
      await page.locator('#permanentAddress').fill('456 Permanent Street');
      
      await page.locator('#submit').click();
      
      // Verify email validation
      await expect(page.locator('#userEmail')).toHaveAttribute('class', /.*was-validated.*/);
    });
  });

  test.describe('Check Box Validation', () => {
    test('should validate check box selections', async ({ page }) => {
      await homePage.navigateToHome();
      await homePage.navigateToCategory('Elements');
      await homePage.waitForPageLoad();
      
      await page.locator('span:text("Check Box")').click();
      await homePage.waitForPageLoad();
      
      // Expand and check items
      await page.locator('.rct-collapse-btn').click();
      await page.locator('span:text("Desktop")').click();
      await page.locator('span:text("Documents")').click();
      
      // Verify selections
      await expect(page.locator('#result')).toContainText('desktop');
      await expect(page.locator('#result')).toContainText('documents');
    });

    test('should validate check box parent-child relationships', async ({ page }) => {
      await homePage.navigateToHome();
      await homePage.navigateToCategory('Elements');
      await homePage.waitForPageLoad();
      
      await page.locator('span:text("Check Box")').click();
      await homePage.waitForPageLoad();
      
      // Expand and check parent
      await page.locator('.rct-collapse-btn').click();
      await page.locator('span:text("Desktop")').click();
      
      // Verify child items are also selected
      await expect(page.locator('span:text("Notes")')).toHaveAttribute('class', /.*rct-checked.*/);
      await expect(page.locator('span:text("Commands")')).toHaveAttribute('class', /.*rct-checked.*/);
    });
  });

  test.describe('Radio Button Validation', () => {
    test('should validate radio button selection', async ({ page }) => {
      await homePage.navigateToHome();
      await homePage.navigateToCategory('Elements');
      await homePage.waitForPageLoad();
      
      await page.locator('span:text("Radio Button")').click();
      await homePage.waitForPageLoad();
      
      // Select radio button
      await page.locator('input[name="like"][value="yes"]').click();
      
      // Verify selection
      await expect(page.locator('.text-success')).toContainText('Yes');
    });

    test('should validate radio button group behavior', async ({ page }) => {
      await homePage.navigateToHome();
      await homePage.navigateToCategory('Elements');
      await homePage.waitForPageLoad();
      
      await page.locator('span:text("Radio Button")').click();
      await homePage.waitForPageLoad();
      
      // Select first option
      await page.locator('input[name="like"][value="yes"]').click();
      await expect(page.locator('.text-success')).toContainText('Yes');
      
      // Select second option
      await page.locator('input[name="like"][value="no"]').click();
      await expect(page.locator('.text-success')).toContainText('No');
      
      // Verify only one can be selected at a time
      await expect(page.locator('input[name="like"][value="yes"]')).not.toBeChecked();
    });
  });

  test.describe('Form Submission', () => {
    test('should submit practice form successfully', async ({ page }) => {
      await homePage.navigateToHome();
      await homePage.navigateToCategory('Forms');
      await homePage.waitForPageLoad();
      
      await page.locator('span:text("Practice Form")').click();
      await homePage.waitForPageLoad();
      
      // Fill the form
      await page.locator('#firstName').fill('John');
      await page.locator('#lastName').fill('Doe');
      await page.locator('#userEmail').fill('john.doe@example.com');
      await page.locator('input[name="gender"][value="Male"]').click();
      await page.locator('#userNumber').fill('1234567890');
      
      // Submit form
      await page.locator('#submit').click();
      
      // Verify submission
      await expect(page.locator('.modal-content')).toBeVisible();
      await expect(page.locator('.modal-body')).toContainText('John');
      await expect(page.locator('.modal-body')).toContainText('Doe');
    });

    test('should submit text box form successfully', async ({ page }) => {
      await homePage.navigateToHome();
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
      await expect(page.locator('#name')).toContainText('Test User');
      await expect(page.locator('#email')).toContainText('test@example.com');
      await expect(page.locator('#currentAddress')).toContainText('123 Test Street');
      await expect(page.locator('#permanentAddress')).toContainText('456 Permanent Street');
    });
  });

  test.describe('Error Handling', () => {
    test('should handle form submission with missing required fields', async ({ page }) => {
      await homePage.navigateToHome();
      await homePage.navigateToCategory('Forms');
      await homePage.waitForPageLoad();
      
      await page.locator('span:text("Practice Form")').click();
      await homePage.waitForPageLoad();
      
      // Submit without filling required fields
      await page.locator('#submit').click();
      
      // Verify validation messages
      await expect(page.locator('#firstName')).toHaveAttribute('class', /.*was-validated.*/);
      await expect(page.locator('#lastName')).toHaveAttribute('class', /.*was-validated.*/);
      await expect(page.locator('#userEmail')).toHaveAttribute('class', /.*was-validated.*/);
      await expect(page.locator('#userNumber')).toHaveAttribute('class', /.*was-validated.*/);
    });

    test('should handle invalid input formats', async ({ page }) => {
      await homePage.navigateToHome();
      await homePage.navigateToCategory('Forms');
      await homePage.waitForPageLoad();
      
      await page.locator('span:text("Practice Form")').click();
      await homePage.waitForPageLoad();
      
      // Fill with invalid data
      await page.locator('#firstName').fill('John');
      await page.locator('#lastName').fill('Doe');
      await page.locator('#userEmail').fill('invalid-email');
      await page.locator('#userNumber').fill('abc123'); // Invalid phone
      
      await page.locator('#submit').click();
      
      // Verify validation
      await expect(page.locator('#userEmail')).toHaveAttribute('class', /.*was-validated.*/);
      await expect(page.locator('#userNumber')).toHaveAttribute('class', /.*was-validated.*/);
    });
  });

  test.describe('Performance Tests', () => {
    test('should load forms within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await homePage.navigateToHome();
      await homePage.navigateToCategory('Forms');
      await homePage.waitForPageLoad();
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(5000);
    });

    test('should handle rapid form interactions', async ({ page }) => {
      await homePage.navigateToHome();
      await homePage.navigateToCategory('Elements');
      await homePage.waitForPageLoad();
      
      await page.locator('span:text("Text Box")').click();
      await homePage.waitForPageLoad();
      
      // Rapid interactions
      await page.locator('#userName').fill('Test1');
      await page.locator('#userName').fill('Test2');
      await page.locator('#userName').fill('Test3');
      
      // Verify page is still responsive
      await expect(page.locator('#submit')).toBeVisible();
    });
  });
}); 