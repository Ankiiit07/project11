import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import app from '../server';
import { config } from '../config/environment';

// Global test setup
let mongoServer: MongoMemoryServer;

// Setup before all tests
beforeAll(async () => {
  // Create in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Connect to test database
  await mongoose.connect(mongoUri);

  console.log('✅ Test database connected');
});

// Cleanup after all tests
afterAll(async () => {
  // Disconnect from test database
  await mongoose.disconnect();
  
  // Stop MongoDB server
  await mongoServer.stop();
  
  console.log('✅ Test database disconnected');
});

// Cleanup after each test
afterEach(async () => {
  // Clear all collections after each test
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Test utilities
export const testUtils = {
  // Create test user
  createTestUser: async (userData: any = {}) => {
    const defaultUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'TestPassword123!',
      phone: '+1234567890',
    };

    const user = { ...defaultUser, ...userData };
    
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(user);

    return response.body.data;
  },

  // Create test product
  createTestProduct: async (productData: any = {}) => {
    const defaultProduct = {
      name: 'Test Coffee',
      description: 'A delicious test coffee',
      price: 19.99,
      category: 'coffee',
      stock: 100,
      images: ['https://example.com/image.jpg'],
      tags: ['test', 'coffee'],
      isActive: true,
    };

    const product = { ...defaultProduct, ...productData };
    
    const response = await request(app)
      .post('/api/v1/products')
      .send(product);

    return response.body.data;
  },

  // Login and get token
  loginAndGetToken: async (email: string, password: string) => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email, password });

    return response.body.data.token;
  },

  // Make authenticated request
  authenticatedRequest: (token: string) => {
    return request(app).set('Authorization', `Bearer ${token}`);
  },

  // Generate test data
  generateTestData: {
    user: (overrides: any = {}) => ({
      name: `Test User ${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      password: 'TestPassword123!',
      phone: '+1234567890',
      ...overrides,
    }),

    product: (overrides: any = {}) => ({
      name: `Test Product ${Date.now()}`,
      description: 'A test product description',
      price: Math.random() * 100 + 10,
      category: ['coffee', 'tea', 'accessories'][Math.floor(Math.random() * 3)],
      stock: Math.floor(Math.random() * 100) + 1,
      images: [`https://example.com/image${Date.now()}.jpg`],
      tags: ['test'],
      isActive: true,
      ...overrides,
    }),

    order: (overrides: any = {}) => ({
      items: [
        {
          productId: 'test-product-id',
          quantity: 2,
          price: 19.99,
        },
      ],
      shippingAddress: {
        street: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        country: 'Test Country',
      },
      paymentMethod: 'razorpay',
      ...overrides,
    }),
  },

  // Database helpers
  db: {
    // Clear specific collection
    clearCollection: async (collectionName: string) => {
      const collection = mongoose.connection.collection(collectionName);
      await collection.deleteMany({});
    },

    // Insert test data
    insertTestData: async (collectionName: string, data: any[]) => {
      const collection = mongoose.connection.collection(collectionName);
      return await collection.insertMany(data);
    },

    // Get collection count
    getCollectionCount: async (collectionName: string) => {
      const collection = mongoose.connection.collection(collectionName);
      return await collection.countDocuments();
    },

    // Find documents
    findDocuments: async (collectionName: string, query: any = {}) => {
      const collection = mongoose.connection.collection(collectionName);
      return await collection.find(query).toArray();
    },
  },

  // Validation helpers
  validation: {
    // Test required fields
    testRequiredFields: async (endpoint: string, data: any, requiredFields: string[]) => {
      for (const field of requiredFields) {
        const testData = { ...data };
        delete testData[field];

        const response = await request(app)
          .post(endpoint)
          .send(testData);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain(field);
      }
    },

    // Test field validation
    testFieldValidation: async (endpoint: string, data: any, fieldTests: any[]) => {
      for (const test of fieldTests) {
        const testData = { ...data, [test.field]: test.value };

        const response = await request(app)
          .post(endpoint)
          .send(testData);

        expect(response.status).toBe(test.expectedStatus || 400);
        expect(response.body.success).toBe(false);
        
        if (test.expectedMessage) {
          expect(response.body.message).toContain(test.expectedMessage);
        }
      }
    },
  },

  // Performance helpers
  performance: {
    // Measure response time
    measureResponseTime: async (requestFn: () => Promise<any>) => {
      const startTime = Date.now();
      const response = await requestFn();
      const endTime = Date.now();
      
      return {
        response,
        duration: endTime - startTime,
      };
    },

    // Test response time threshold
    testResponseTime: async (requestFn: () => Promise<any>, maxTime: number = 1000) => {
      const { response, duration } = await testUtils.performance.measureResponseTime(requestFn);
      
      expect(duration).toBeLessThan(maxTime);
      return { response, duration };
    },
  },
};

// Custom Jest matchers
expect.extend({
  toBeValidObjectId(received: any) {
    const pass = mongoose.Types.ObjectId.isValid(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid ObjectId`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid ObjectId`,
        pass: false,
      };
    }
  },

  toHaveValidApiResponse(received: any) {
    const hasSuccess = typeof received.success === 'boolean';
    const hasMessage = typeof received.message === 'string';
    const hasTimestamp = typeof received.timestamp === 'string';
    const hasPath = typeof received.path === 'string';

    const pass = hasSuccess && hasMessage && hasTimestamp && hasPath;
    
    if (pass) {
      return {
        message: () => `expected response not to have valid API structure`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected response to have valid API structure (success, message, timestamp, path)`,
        pass: false,
      };
    }
  },
});

// Global test timeout
jest.setTimeout(30000);

// Export test utilities
export default testUtils; 