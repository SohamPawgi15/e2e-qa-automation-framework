import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export interface EnvironmentConfig {
  baseUrl: string;
  testUser: {
    email: string;
    password: string;
  };
  adminUser: {
    username: string;
    password: string;
  };
  testData: {
    productName: string;
    category: string;
  };
  browser: {
    headless: boolean;
    slowMo: number;
  };
  timeouts: {
    default: number;
    navigation: number;
    action: number;
  };
  reporting: {
    allureResultsDir: string;
    testResultsDir: string;
  };
}

export class Environment {
  private static instance: Environment;
  private config: EnvironmentConfig;

  private constructor() {
    this.config = {
      baseUrl: process.env.BASE_URL || 'https://demoqa.com',
      testUser: {
        email: process.env.TEST_USER_EMAIL || 'test@example.com',
        password: process.env.TEST_USER_PASSWORD || 'testpassword123',
      },
      adminUser: {
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD || 'admin123',
      },
      testData: {
        productName: process.env.TEST_PRODUCT_NAME || 'iPhone',
        category: process.env.TEST_CATEGORY || 'Phones & PDAs',
      },
      browser: {
        headless: process.env.HEADLESS === 'true',
        slowMo: parseInt(process.env.SLOW_MO || '1000'),
      },
      timeouts: {
        default: parseInt(process.env.DEFAULT_TIMEOUT || '30000'),
        navigation: parseInt(process.env.NAVIGATION_TIMEOUT || '30000'),
        action: parseInt(process.env.ACTION_TIMEOUT || '10000'),
      },
      reporting: {
        allureResultsDir: process.env.ALLURE_RESULTS_DIR || 'allure-results',
        testResultsDir: process.env.TEST_RESULTS_DIR || 'test-results',
      },
    };
  }

  public static getInstance(): Environment {
    if (!Environment.instance) {
      Environment.instance = new Environment();
    }
    return Environment.instance;
  }

  public getConfig(): EnvironmentConfig {
    return this.config;
  }

  public getBaseUrl(): string {
    return this.config.baseUrl;
  }

  public getTestUser() {
    return this.config.testUser;
  }

  public getAdminUser() {
    return this.config.adminUser;
  }

  public getTestData() {
    return this.config.testData;
  }

  public getTimeouts() {
    return this.config.timeouts;
  }
} 