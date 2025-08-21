"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testUtils = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
let mongoServer;
beforeAll(async () => {
    mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose_1.default.connect(mongoUri);
    console.log('✅ Test database connected');
});
afterAll(async () => {
    await mongoose_1.default.disconnect();
    await mongoServer.stop();
    console.log('✅ Test database disconnected');
});
afterEach(async () => {
    const collections = mongoose_1.default.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
});
exports.testUtils = {
    createTestUser: async (userData = {}) => {
        const defaultUser = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'TestPassword123!',
            phone: '+1234567890',
        };
        const user = { ...defaultUser, ...userData };
        const response = await (0, supertest_1.default)(server_1.default)
            .post('/api/v1/auth/register')
            .send(user);
        return response.body.data;
    },
    createTestProduct: async (productData = {}) => {
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
        const response = await (0, supertest_1.default)(server_1.default)
            .post('/api/v1/products')
            .send(product);
        return response.body.data;
    },
    loginAndGetToken: async (email, password) => {
        const response = await (0, supertest_1.default)(server_1.default)
            .post('/api/v1/auth/login')
            .send({ email, password });
        return response.body.data.token;
    },
    authenticatedRequest: (token) => {
        return (0, supertest_1.default)(server_1.default).set('Authorization', `Bearer ${token}`);
    },
    generateTestData: {
        user: (overrides = {}) => ({
            name: `Test User ${Date.now()}`,
            email: `test${Date.now()}@example.com`,
            password: 'TestPassword123!',
            phone: '+1234567890',
            ...overrides,
        }),
        product: (overrides = {}) => ({
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
        order: (overrides = {}) => ({
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
    db: {
        clearCollection: async (collectionName) => {
            const collection = mongoose_1.default.connection.collection(collectionName);
            await collection.deleteMany({});
        },
        insertTestData: async (collectionName, data) => {
            const collection = mongoose_1.default.connection.collection(collectionName);
            return await collection.insertMany(data);
        },
        getCollectionCount: async (collectionName) => {
            const collection = mongoose_1.default.connection.collection(collectionName);
            return await collection.countDocuments();
        },
        findDocuments: async (collectionName, query = {}) => {
            const collection = mongoose_1.default.connection.collection(collectionName);
            return await collection.find(query).toArray();
        },
    },
    validation: {
        testRequiredFields: async (endpoint, data, requiredFields) => {
            for (const field of requiredFields) {
                const testData = { ...data };
                delete testData[field];
                const response = await (0, supertest_1.default)(server_1.default)
                    .post(endpoint)
                    .send(testData);
                expect(response.status).toBe(400);
                expect(response.body.success).toBe(false);
                expect(response.body.message).toContain(field);
            }
        },
        testFieldValidation: async (endpoint, data, fieldTests) => {
            for (const test of fieldTests) {
                const testData = { ...data, [test.field]: test.value };
                const response = await (0, supertest_1.default)(server_1.default)
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
    performance: {
        measureResponseTime: async (requestFn) => {
            const startTime = Date.now();
            const response = await requestFn();
            const endTime = Date.now();
            return {
                response,
                duration: endTime - startTime,
            };
        },
        testResponseTime: async (requestFn, maxTime = 1000) => {
            const { response, duration } = await exports.testUtils.performance.measureResponseTime(requestFn);
            expect(duration).toBeLessThan(maxTime);
            return { response, duration };
        },
    },
};
expect.extend({
    toBeValidObjectId(received) {
        const pass = mongoose_1.default.Types.ObjectId.isValid(received);
        if (pass) {
            return {
                message: () => `expected ${received} not to be a valid ObjectId`,
                pass: true,
            };
        }
        else {
            return {
                message: () => `expected ${received} to be a valid ObjectId`,
                pass: false,
            };
        }
    },
    toHaveValidApiResponse(received) {
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
        }
        else {
            return {
                message: () => `expected response to have valid API structure (success, message, timestamp, path)`,
                pass: false,
            };
        }
    },
});
jest.setTimeout(30000);
exports.default = exports.testUtils;
//# sourceMappingURL=setup.js.map