# E2E QA Automation Framework

A robust, scalable end-to-end testing framework built with Playwright and TypeScript for web application testing.

## 🚀 Features

- **Modern Tech Stack**: Playwright + TypeScript + Node.js
- **Page Object Model**: Maintainable and reusable test structure
- **Multi-Browser Support**: Chrome, Firefox, Safari, Edge
- **Comprehensive Reporting**: HTML reports, Allure reports, screenshots, videos
- **CI/CD Ready**: GitHub Actions integration
- **Environment Management**: Configurable for different environments
- **Performance Testing**: Built-in performance monitoring
- **Security Testing**: Basic security test templates

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd e2e-qa-automation-framework
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npm run install:browsers
   ```

4. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

## 🏃‍♂️ Quick Start

### Run Quick Smoke Tests
```bash
npm run test:quick
```

### Run All Tests
```bash
npm test
```

### Run Tests in Headed Mode
```bash
npm run test:headed
```

### Run Tests with UI
```bash
npm run test:ui
```

## 📁 Project Structure

```
├── src/
│   ├── config/
│   │   └── environment.ts          # Environment configuration
│   ├── pages/
│   │   ├── home-page.ts            # Home page object
│   │   ├── login-page.ts           # Login page object
│   │   ├── register-page.ts        # Register page object
│   │   ├── product-page.ts         # Product page object
│   │   └── cart-page.ts            # Cart page object
│   └── utils/
│       ├── base-page.ts            # Base page class
│       └── test-helpers.ts         # Test utilities
├── tests/
│   ├── quick-smoke.spec.ts         # Quick smoke tests
│   ├── home-page.spec.ts           # Home page tests
│   ├── user-authentication.spec.ts # Authentication tests
│   ├── product-tests.spec.ts       # Product tests
│   └── cart-checkout.spec.ts       # Cart & checkout tests
├── playwright.config.ts            # Playwright configuration
├── package.json                    # Dependencies and scripts
└── README.md                       # This file
```

## 🧪 Test Categories

### Smoke Tests
- Basic page loading
- Navigation elements
- Content validation
- Responsive design

### Functional Tests
- User registration and login
- Product browsing and search
- Shopping cart operations
- Checkout process

### Performance Tests
- Page load times
- Memory usage monitoring
- Network performance

### Security Tests
- SQL injection attempts
- XSS vulnerability checks
- Input validation

## ⚙️ Configuration

### Environment Variables
Create a `.env` file based on `env.example`:

```env
BASE_URL=https://demoqa.com
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=testpassword123
HEADLESS=true
SLOW_MO=1000
```

### Playwright Configuration
Key settings in `playwright.config.ts`:

```typescript
{
  workers: 2,                    // Parallel test execution
  timeout: 30000,               // Test timeout
  retries: 1,                   // Retry failed tests
  use: {
    baseURL: 'https://demoqa.com',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  }
}
```

## 📊 Reporting

### HTML Reports
```bash
npm run test:report
# Open: playwright-report/index.html
```

### Allure Reports
```bash
npm run test:allure
npx allure serve allure-results
```

### Test Results
- Screenshots on failure
- Video recordings
- Console logs
- Performance metrics

## 🔄 CI/CD Integration

### GitHub Actions
The framework includes a complete CI/CD pipeline:

```yaml
# .github/workflows/ci.yml
- Multi-browser testing
- Parallel execution
- Automated reporting
- Slack notifications
```

### Local Development
```bash
# Run tests locally
npm run test:quick

# Debug tests
npm run test:debug

# Generate code
npm run codegen
```

## 🛠️ Development

### Adding New Tests
1. Create page object in `src/pages/`
2. Extend `BasePage` class
3. Add test file in `tests/`
4. Use Page Object Model pattern

### Example Test Structure
```typescript
import { test, expect } from '@playwright/test';
import { HomePage } from '@pages/home-page';

test.describe('Home Page Tests', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
  });

  test('should load homepage', async () => {
    await homePage.navigateToHome();
    await homePage.verifyHomePageLoaded();
  });
});
```

## 🐛 Debugging

### Debug Mode
```bash
npm run test:debug
```

### UI Mode
```bash
npm run test:ui
```

### Code Generation
```bash
npm run codegen
```

## 📈 Performance Monitoring

The framework includes performance utilities:

```typescript
import { PerformanceUtils } from '@utils/test-helpers';

const loadTime = await PerformanceUtils.measurePageLoadTime(page);
expect(loadTime).toBeLessThan(3000); // 3 seconds
```

## 🔒 Security Testing

Basic security test templates included:

```typescript
test('should prevent SQL injection', async ({ page }) => {
  // Test SQL injection attempts
  await page.fill('#search', "'; DROP TABLE users; --");
  // Verify no database errors
});
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit a pull request

## 📝 Best Practices

- **Page Object Model**: Keep page logic separate from test logic
- **Descriptive Names**: Use clear, descriptive test and variable names
- **Data Management**: Use test data generators for dynamic data
- **Error Handling**: Implement proper error handling and logging
- **Performance**: Monitor test execution times
- **Maintenance**: Regular updates and dependency management

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Create an issue in the repository
- Check the documentation
- Review test examples

## 🗺️ Roadmap

- [ ] Mobile app testing support
- [ ] API testing integration
- [ ] Visual regression testing
- [ ] Load testing capabilities
- [ ] Cross-browser compatibility matrix
- [ ] Advanced reporting features

---

**Built with ❤️ for quality assurance** 