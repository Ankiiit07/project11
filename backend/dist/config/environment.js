"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTest = exports.isProduction = exports.isDevelopment = exports.nodeEnv = exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const joi_1 = __importDefault(require("joi"));
dotenv_1.default.config();
const envSchema = joi_1.default.object({
    NODE_ENV: joi_1.default.string()
        .valid('development', 'production', 'test')
        .default('development'),
    PORT: joi_1.default.number().default(5001),
    API_VERSION: joi_1.default.string().default('v1'),
    MONGODB_URI: joi_1.default.string().required(),
    MONGODB_URI_TEST: joi_1.default.string().optional(),
    JWT_SECRET: joi_1.default.string().min(32).required(),
    JWT_EXPIRES_IN: joi_1.default.string().default('7d'),
    JWT_REFRESH_SECRET: joi_1.default.string().min(32).required(),
    JWT_REFRESH_EXPIRES_IN: joi_1.default.string().default('30d'),
    SESSION_SECRET: joi_1.default.string().min(32).required(),
    FRONTEND_URL: joi_1.default.string().uri().optional(),
    FRONTEND_PROD_URL: joi_1.default.string().uri().optional(),
    RATE_LIMIT_WINDOW_MS: joi_1.default.number().default(900000),
    RATE_LIMIT_MAX_REQUESTS: joi_1.default.number().default(100),
    EMAIL_HOST: joi_1.default.string().optional(),
    EMAIL_PORT: joi_1.default.number().optional(),
    EMAIL_USER: joi_1.default.string().optional(),
    EMAIL_PASS: joi_1.default.string().optional(),
    EMAIL_FROM: joi_1.default.string().email().optional(),
    RAZORPAY_KEY_ID: joi_1.default.string().optional(),
    RAZORPAY_KEY_SECRET: joi_1.default.string().optional(),
    CLOUDINARY_CLOUD_NAME: joi_1.default.string().optional(),
    CLOUDINARY_API_KEY: joi_1.default.string().optional(),
    CLOUDINARY_API_SECRET: joi_1.default.string().optional(),
    MAX_FILE_SIZE: joi_1.default.number().default(5 * 1024 * 1024),
    REDIS_URL: joi_1.default.string().optional(),
    CACHE_TTL: joi_1.default.number().default(300),
    LOG_LEVEL: joi_1.default.string()
        .valid('error', 'warn', 'info', 'http', 'debug')
        .default('info'),
    BCRYPT_ROUNDS: joi_1.default.number().default(12),
    PASSWORD_MIN_LENGTH: joi_1.default.number().default(8),
    METRICS_TOKEN: joi_1.default.string().optional(),
    ENABLE_METRICS: joi_1.default.boolean().default(true),
    ENABLE_HEALTH_CHECK: joi_1.default.boolean().default(true),
    ENABLE_CACHE: joi_1.default.boolean().default(true),
    ENABLE_RATE_LIMITING: joi_1.default.boolean().default(true),
    ENABLE_COMPRESSION: joi_1.default.boolean().default(true),
    ENABLE_LOGGING: joi_1.default.boolean().default(true),
    ENABLE_SWAGGER: joi_1.default.boolean().default(false),
    ENABLE_DEBUG_MODE: joi_1.default.boolean().default(false),
}).unknown();
const { error, value: envVars } = envSchema.validate(process.env);
if (error) {
    throw new Error(`Environment validation error: ${error.message}`);
}
exports.config = {
    nodeEnv: envVars.NODE_ENV,
    isDevelopment: envVars.NODE_ENV === 'development',
    isProduction: envVars.NODE_ENV === 'production',
    isTest: envVars.NODE_ENV === 'test',
    server: {
        port: envVars.PORT,
        apiVersion: envVars.API_VERSION,
        apiPrefix: `/api/${envVars.API_VERSION}`,
    },
    database: {
        uri: envVars.MONGODB_URI,
        uriTest: envVars.MONGODB_URI_TEST,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            bufferMaxEntries: 0,
        },
    },
    jwt: {
        secret: envVars.JWT_SECRET,
        expiresIn: envVars.JWT_EXPIRES_IN,
        refreshSecret: envVars.JWT_REFRESH_SECRET,
        refreshExpiresIn: envVars.JWT_REFRESH_EXPIRES_IN,
    },
    session: {
        secret: envVars.SESSION_SECRET,
        cookie: {
            secure: envVars.NODE_ENV === 'production',
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        },
    },
    cors: {
        origins: [
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:5175',
            'http://localhost:5176',
            'http://localhost:5177',
            'http://localhost:5178',
            envVars.FRONTEND_URL,
            envVars.FRONTEND_PROD_URL,
        ].filter(Boolean),
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    },
    rateLimit: {
        windowMs: envVars.RATE_LIMIT_WINDOW_MS,
        maxRequests: envVars.RATE_LIMIT_MAX_REQUESTS,
    },
    email: {
        host: envVars.EMAIL_HOST,
        port: envVars.EMAIL_PORT,
        user: envVars.EMAIL_USER,
        pass: envVars.EMAIL_PASS,
        from: envVars.EMAIL_FROM,
    },
    payment: {
        razorpay: {
            keyId: envVars.RAZORPAY_KEY_ID,
            keySecret: envVars.RAZORPAY_KEY_SECRET,
        },
    },
    upload: {
        cloudinary: {
            cloudName: envVars.CLOUDINARY_CLOUD_NAME,
            apiKey: envVars.CLOUDINARY_API_KEY,
            apiSecret: envVars.CLOUDINARY_API_SECRET,
        },
        maxFileSize: envVars.MAX_FILE_SIZE,
    },
    cache: {
        redisUrl: envVars.REDIS_URL,
        ttl: envVars.CACHE_TTL,
    },
    logging: {
        level: envVars.LOG_LEVEL,
        enable: envVars.ENABLE_LOGGING,
    },
    security: {
        bcryptRounds: envVars.BCRYPT_ROUNDS,
        passwordMinLength: envVars.PASSWORD_MIN_LENGTH,
        metricsToken: envVars.METRICS_TOKEN,
    },
    monitoring: {
        enableMetrics: envVars.ENABLE_METRICS,
        enableHealthCheck: envVars.ENABLE_HEALTH_CHECK,
    },
    features: {
        enableCache: envVars.ENABLE_CACHE,
        enableRateLimiting: envVars.ENABLE_RATE_LIMITING,
        enableCompression: envVars.ENABLE_COMPRESSION,
        enableLogging: envVars.ENABLE_LOGGING,
    },
    development: {
        enableSwagger: envVars.ENABLE_SWAGGER,
        enableDebugMode: envVars.ENABLE_DEBUG_MODE,
    },
};
exports.nodeEnv = exports.config.nodeEnv, exports.isDevelopment = exports.config.isDevelopment, exports.isProduction = exports.config.isProduction, exports.isTest = exports.config.isTest;
exports.default = exports.config;
//# sourceMappingURL=environment.js.map