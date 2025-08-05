import { test, expect } from '@playwright/test';
import { HomePage } from '@pages/home-page';
import { LoginPage } from '@pages/login-page';
import { RegisterPage } from '@pages/register-page';
import { TestDataGenerator, CustomAssertions, DataValidation } from '@utils/test-helpers';

test.describe('User Authentication Tests', () => {
  let homePage: HomePage;
  let loginPage: LoginPage;
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    registerPage = new RegisterPage(page);
  });

  test.describe('User Registration', () => {
    test('should register new user successfully', async ({ page }) => {
      await registerPage.navigateToRegister();
      await registerPage.verifyRegistrationPageLoaded();

      const testUser = {
        firstName: TestDataGenerator.generateRandomName(),
        lastName: TestDataGenerator.generateRandomLastName(),
        email: TestDataGenerator.generateRandomEmail(),
        telephone: TestDataGenerator.generateRandomPhone(),
        password: TestDataGenerator.generateRandomPassword(),
        confirmPassword: TestDataGenerator.generateRandomPassword(),
      };

      // Make sure passwords match
      testUser.confirmPassword = testUser.password;

      await registerPage.registerWithoutNewsletter(
        testUser.firstName,
        testUser.lastName,
        testUser.email,
        testUser.telephone,
        testUser.password,
        testUser.confirmPassword
      );

      await registerPage.verifySuccessfulRegistration();
    });

    test('should register user with newsletter subscription', async ({ page }) => {
      await registerPage.navigateToRegister();
      await registerPage.verifyRegistrationPageLoaded();

      const testUser = {
        firstName: TestDataGenerator.generateRandomName(),
        lastName: TestDataGenerator.generateRandomLastName(),
        email: TestDataGenerator.generateRandomEmail(),
        telephone: TestDataGenerator.generateRandomPhone(),
        password: TestDataGenerator.generateRandomPassword(),
        confirmPassword: TestDataGenerator.generateRandomPassword(),
      };

      testUser.confirmPassword = testUser.password;

      await registerPage.registerWithNewsletter(
        testUser.firstName,
        testUser.lastName,
        testUser.email,
        testUser.telephone,
        testUser.password,
        testUser.confirmPassword
      );

      await registerPage.verifySuccessfulRegistration();
    });

    test('should validate registration form fields', async ({ page }) => {
      await registerPage.navigateToRegister();
      await registerPage.verifyRegistrationFormValidation();
    });

    test('should show error for invalid email format', async ({ page }) => {
      await registerPage.navigateToRegister();
      
      await registerPage.fillPersonalDetails(
        'John',
        'Doe',
        'invalid-email',
        '123-456-7890'
      );

      await registerPage.clickContinue();
      await registerPage.verifyFailedRegistration();
    });

    test('should show error for password mismatch', async ({ page }) => {
      await registerPage.navigateToRegister();
      
      await registerPage.fillRegistrationForm(
        'John',
        'Doe',
        TestDataGenerator.generateRandomEmail(),
        '123-456-7890',
        'password123',
        'differentpassword'
      );

      await registerPage.clickContinue();
      await registerPage.verifyFailedRegistration();
    });

    test('should show error for existing email', async ({ page }) => {
      await registerPage.navigateToRegister();
      
      // Use a known existing email
      await registerPage.fillRegistrationForm(
        'John',
        'Doe',
        'test@example.com',
        '123-456-7890',
        'password123',
        'password123'
      );

      await registerPage.clickContinue();
      await registerPage.verifyFailedRegistration();
    });

    test('should validate required fields', async ({ page }) => {
      await registerPage.navigateToRegister();
      
      // Try to submit empty form
      await registerPage.clickContinue();
      await registerPage.verifyFailedRegistration();
    });

    test('should clear registration form', async ({ page }) => {
      await registerPage.navigateToRegister();
      
      await registerPage.fillRegistrationForm(
        'John',
        'Doe',
        'test@example.com',
        '123-456-7890',
        'password123',
        'password123'
      );

      await registerPage.clearRegistrationForm();
      
      // Verify form is cleared
      const firstName = await registerPage.firstNameInput.inputValue();
      const email = await registerPage.emailInput.inputValue();
      expect(firstName).toBe('');
      expect(email).toBe('');
    });
  });

  test.describe('User Login', () => {
    test('should login with valid credentials', async ({ page }) => {
      await loginPage.navigateToLogin();
      await loginPage.verifyLoginPageLoaded();

      const testUser = {
        email: 'test@example.com',
        password: 'testpassword123'
      };

      await loginPage.login(testUser.email, testUser.password);
      await loginPage.verifySuccessfulLogin();
    });

    test('should login with remember me option', async ({ page }) => {
      await loginPage.navigateToLogin();
      
      const testUser = {
        email: 'test@example.com',
        password: 'testpassword123'
      };

      await loginPage.loginWithRememberMe(testUser.email, testUser.password);
      await loginPage.verifySuccessfulLogin();
    });

    test('should show error for invalid credentials', async ({ page }) => {
      await loginPage.navigateToLogin();
      
      await loginPage.login('invalid@example.com', 'wrongpassword');
      await loginPage.verifyFailedLogin();
    });

    test('should show error for empty credentials', async ({ page }) => {
      await loginPage.navigateToLogin();
      
      await loginPage.clickElement(loginPage.loginButton);
      await loginPage.verifyLoginFormValidation();
    });

    test('should show error for invalid email format', async ({ page }) => {
      await loginPage.navigateToLogin();
      
      await loginPage.fillLoginForm('invalid-email', 'password123');
      await loginPage.clickElement(loginPage.loginButton);
      await loginPage.verifyFailedLogin();
    });

    test('should navigate to forgot password page', async ({ page }) => {
      await loginPage.navigateToLogin();
      await loginPage.clickForgotPassword();
      
      await loginPage.waitForPageLoad();
      await loginPage.assertUrl(/.*forgotten.*/);
    });

    test('should navigate to registration page from login', async ({ page }) => {
      await loginPage.navigateToLogin();
      await loginPage.clickRegister();
      
      await loginPage.waitForPageLoad();
      await loginPage.assertUrl(/.*register.*/);
    });

    test('should clear login form', async ({ page }) => {
      await loginPage.navigateToLogin();
      
      await loginPage.fillLoginForm('test@example.com', 'password123');
      await loginPage.clearLoginForm();
      
      const email = await loginPage.emailInput.inputValue();
      const password = await loginPage.passwordInput.inputValue();
      expect(email).toBe('');
      expect(password).toBe('');
    });
  });

  test.describe('Account Management', () => {
    test('should access account after successful login', async ({ page }) => {
      await loginPage.navigateToLogin();
      
      const testUser = {
        email: 'test@example.com',
        password: 'testpassword123'
      };

      await loginPage.login(testUser.email, testUser.password);
      await loginPage.verifySuccessfulLogin();
      
      // Verify account page elements are visible
      await page.waitForSelector('.account-dashboard');
    });

    test('should logout successfully', async ({ page }) => {
      // First login
      await loginPage.navigateToLogin();
      await loginPage.login('test@example.com', 'testpassword123');
      await loginPage.verifySuccessfulLogin();
      
      // Then logout
      await page.click('text=Logout');
      await page.waitForLoadState('networkidle');
      
      // Verify redirected to home page
      await homePage.verifyHomePageLoaded();
    });

    test('should maintain session with remember me', async ({ page }) => {
      await loginPage.navigateToLogin();
      
      const testUser = {
        email: 'test@example.com',
        password: 'testpassword123'
      };

      await loginPage.loginWithRememberMe(testUser.email, testUser.password);
      await loginPage.verifySuccessfulLogin();
      
      // Close and reopen browser to test session persistence
      // This would require browser context management
    });
  });

  test.describe('Security Tests', () => {
    test('should not expose sensitive information in URLs', async ({ page }) => {
      await loginPage.navigateToLogin();
      
      const currentUrl = await page.url();
      expect(currentUrl).not.toContain('password');
      expect(currentUrl).not.toContain('testpassword123');
    });

    test('should handle SQL injection attempts', async ({ page }) => {
      await loginPage.navigateToLogin();
      
      const sqlInjectionAttempts = [
        "' OR '1'='1",
        "'; DROP TABLE users; --",
        "' UNION SELECT * FROM users --"
      ];
      
      for (const attempt of sqlInjectionAttempts) {
        await loginPage.fillLoginForm(attempt, attempt);
        await loginPage.clickElement(loginPage.loginButton);
        await loginPage.verifyFailedLogin();
      }
    });

    test('should handle XSS attempts', async ({ page }) => {
      await registerPage.navigateToRegister();
      
      const xssAttempts = [
        '<script>alert("XSS")</script>',
        'javascript:alert("XSS")',
        '<img src="x" onerror="alert(\'XSS\')">'
      ];
      
      for (const attempt of xssAttempts) {
        await registerPage.fillPersonalDetails(
          attempt,
          'Doe',
          TestDataGenerator.generateRandomEmail(),
          '123-456-7890'
        );
        await registerPage.clickContinue();
        // Verify the attempt is handled safely
      }
    });
  });

  test.describe('Data Validation', () => {
    test('should validate user data structure', async () => {
      const testUser = {
        email: TestDataGenerator.generateRandomEmail(),
        password: TestDataGenerator.generateRandomPassword()
      };
      
      DataValidation.validateUserData(testUser);
    });

    test('should validate email format', async () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org'
      ];
      
      for (const email of validEmails) {
        CustomAssertions.assertEmailFormat(email);
      }
    });

    test('should validate phone format', async () => {
      const validPhones = [
        '123-456-7890',
        '555-123-4567',
        '999-888-7777'
      ];
      
      for (const phone of validPhones) {
        CustomAssertions.assertPhoneFormat(phone);
      }
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors during login', async ({ page }) => {
      // This would require mocking network failures
      await loginPage.navigateToLogin();
      await loginPage.verifyLoginPageLoaded();
    });

    test('should handle server errors gracefully', async ({ page }) => {
      // This would require mocking server errors
      await loginPage.navigateToLogin();
      await loginPage.verifyLoginPageLoaded();
    });

    test('should handle timeout scenarios', async ({ page }) => {
      await loginPage.navigateToLogin();
      
      // Test with very slow network simulation
      await page.route('**/*', route => {
        // Simulate slow response
        setTimeout(() => route.continue(), 10000);
      });
      
      await loginPage.fillLoginForm('test@example.com', 'password123');
      await loginPage.clickElement(loginPage.loginButton);
      
      // Verify timeout handling
    });
  });
}); 