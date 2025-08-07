import { test, expect } from '@playwright/test';
import { HomePage } from '@pages/home-page';

test.describe('DemoQA Form Tests', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigateToHome();
  });

  test.describe('Form Interactions', () => {
    test('should navigate to practice form', async ({ page }) => {
      await homePage.navigateToCategory('Forms');
      await homePage.waitForPageLoad();
      
      await page.locator('span:text("Practice Form")').click();
      await homePage.waitForPageLoad();
      await homePage.assertUrl(/.*automation-practice-form.*/);
    });

    test('should fill practice form', async ({ page }) => {
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
    });

    test('should validate form fields', async ({ page }) => {
      await homePage.navigateToCategory('Forms');
      await homePage.waitForPageLoad();
      
      await page.locator('span:text("Practice Form")').click();
      await homePage.waitForPageLoad();
      
      // Try to submit without filling required fields
      await page.locator('#submit').click();
      
      // Verify validation messages
      await expect(page.locator('#firstName')).toHaveAttribute('class', /.*was-validated.*/);
    });
  });

  test.describe('Element Interactions', () => {
    test('should test text box functionality', async ({ page }) => {
      await homePage.navigateToCategory('Elements');
      await homePage.waitForPageLoad();
      
      await page.locator('span:text("Text Box")').click();
      await homePage.waitForPageLoad();
      
      // Fill text box
      await page.locator('#userName').fill('Test User');
      await page.locator('#userEmail').fill('test@example.com');
      await page.locator('#currentAddress').fill('123 Test Street');
      await page.locator('#permanentAddress').fill('456 Permanent Street');
      
      await page.locator('#submit').click();
      
      // Verify output
      await expect(page.locator('#output')).toBeVisible();
      await expect(page.locator('#name')).toContainText('Test User');
    });

    test('should test check box functionality', async ({ page }) => {
      await homePage.navigateToCategory('Elements');
      await homePage.waitForPageLoad();
      
      await page.locator('span:text("Check Box")').click();
      await homePage.waitForPageLoad();
      
      // Expand and check items
      await page.locator('.rct-collapse-btn').click();
      await page.locator('span:text("Desktop")').click();
      
      // Verify selection
      await expect(page.locator('#result')).toContainText('desktop');
    });

    test('should test radio button functionality', async ({ page }) => {
      await homePage.navigateToCategory('Elements');
      await homePage.waitForPageLoad();
      
      await page.locator('span:text("Radio Button")').click();
      await homePage.waitForPageLoad();
      
      // Select radio button
      await page.locator('input[name="like"][value="yes"]').click();
      
      // Verify selection
      await expect(page.locator('.text-success')).toContainText('Yes');
    });
  });

  test.describe('Widget Interactions', () => {
    test('should test date picker', async ({ page }) => {
      await homePage.navigateToCategory('Widgets');
      await homePage.waitForPageLoad();
      
      await page.locator('span:text("Date Picker")').click();
      await homePage.waitForPageLoad();
      
      // Select date
      await page.locator('#datePickerMonthYearInput').click();
      await page.locator('.react-datepicker__day--selected').click();
      
      // Verify date is selected
      await expect(page.locator('#datePickerMonthYearInput')).not.toHaveValue('');
    });

    test('should test select dropdown', async ({ page }) => {
      await homePage.navigateToCategory('Widgets');
      await homePage.waitForPageLoad();
      
      await page.locator('span:text("Select Menu")').click();
      await homePage.waitForPageLoad();
      
      // Select option
      await page.locator('#oldSelectMenu').selectOption('1');
      
      // Verify selection
      await expect(page.locator('#oldSelectMenu')).toHaveValue('1');
    });
  });

  test.describe('Alert and Frame Tests', () => {
    test('should handle simple alert', async ({ page }) => {
      await homePage.navigateToCategory('Alerts, Frame & Windows');
      await homePage.waitForPageLoad();
      
      await page.locator('span:text("Alerts")').click();
      await homePage.waitForPageLoad();
      
      // Handle alert
      page.on('dialog', dialog => dialog.accept());
      await page.locator('#alertButton').click();
    });

    test('should handle confirm alert', async ({ page }) => {
      await homePage.navigateToCategory('Alerts, Frame & Windows');
      await homePage.waitForPageLoad();
      
      await page.locator('span:text("Alerts")').click();
      await homePage.waitForPageLoad();
      
      // Handle confirm dialog
      page.on('dialog', dialog => dialog.accept());
      await page.locator('#confirmButton').click();
      
      // Verify result
      await expect(page.locator('#confirmResult')).toContainText('Ok');
    });
  });

  test.describe('Performance Tests', () => {
    test('should load forms page within acceptable time', async ({ page: _page }) => {
      const startTime = Date.now();
      await homePage.navigateToCategory('Forms');
      await homePage.waitForPageLoad();
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(5000);
    });

    test('should handle rapid form interactions', async ({ page }) => {
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

  test.describe('Responsive Design', () => {
    test('should display forms correctly on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      await homePage.navigateToCategory('Forms');
      await homePage.waitForPageLoad();
      
      await page.locator('span:text("Practice Form")').click();
      await homePage.waitForPageLoad();
      
      await expect(page.locator('#firstName')).toBeVisible();
    });

    test('should display elements correctly on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      await homePage.navigateToCategory('Elements');
      await homePage.waitForPageLoad();
      
      await page.locator('span:text("Text Box")').click();
      await homePage.waitForPageLoad();
      
      await expect(page.locator('#userName')).toBeVisible();
    });
  });
}); 