import dotenv from 'dotenv';
import Joi from 'joi';

// Load environment variables
dotenv.config();

// Environment validation schema
const envSchema = Joi.object({
  // Node environment
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  // Server configuration
  PORT: Joi.number().default(5001),
  API_VERSION: Joi.string().default('v1'),

  // Database configuration
  MONGODB_URI: Joi.string().required(),
  MONGODB_URI_TEST: Joi.string().optional(),

  // JWT configuration
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('7d'),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('30d'),

  // Session configuration
  SESSION_SECRET: Joi.string().min(32).required(),

  // CORS configuration
  FRONTEND_URL: Joi.string().uri().optional(),
  FRONTEND_PROD_URL: Joi.string().uri().optional(),

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: Joi.number().default(900000), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: Joi.number().default(100),

  // Email configuration
  EMAIL_HOST: Joi.string().optional(),
  EMAIL_PORT: Joi.number().optional(),
  EMAIL_USER: Joi.string().optional(),
  EMAIL_PASS: Joi.string().optional(),
  EMAIL_FROM: Joi.string().email().optional(),

  // Payment configuration
  RAZORPAY_KEY_ID: Joi.string().optional(),
  RAZORPAY_KEY_SECRET: Joi.string().optional(),

  // File upload configuration
  CLOUDINARY_CLOUD_NAME: Joi.string().optional(),
  CLOUDINARY_API_KEY: Joi.string().optional(),
  CLOUDINARY_API_SECRET: Joi.string().optional(),
  MAX_FILE_SIZE: Joi.number().default(5 * 1024 * 1024), // 5MB

  // Cache configuration
  REDIS_URL: Joi.string().optional(),
  CACHE_TTL: Joi.number().default(300), // 5 minutes

  // Logging configuration
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'http', 'debug')
    .default('info'),

  // Security configuration
  BCRYPT_ROUNDS: Joi.number().default(12),
  PASSWORD_MIN_LENGTH: Joi.number().default(8),
  METRICS_TOKEN: Joi.string().optional(),

  // Monitoring configuration
  ENABLE_METRICS: Joi.boolean().default(true),
  ENABLE_HEALTH_CHECK: Joi.boolean().default(true),

  // Feature flags
  ENABLE_CACHE: Joi.boolean().default(true),
  ENABLE_RATE_LIMITING: Joi.boolean().default(true),
  ENABLE_COMPRESSION: Joi.boolean().default(true),
  ENABLE_LOGGING: Joi.boolean().default(true),

  // Development configuration
  ENABLE_SWAGGER: Joi.boolean().default(false),
  ENABLE_DEBUG_MODE: Joi.boolean().default(false),
}).unknown();

// Validate environment variables
const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Environment validation error: ${error.message}`);
}

// Environment configuration object
export const config = {
  // Node environment
  nodeEnv: envVars.NODE_ENV,
  isDevelopment: envVars.NODE_ENV === 'development',
  isProduction: envVars.NODE_ENV === 'production',
  isTest: envVars.NODE_ENV === 'test',

  // Server configuration
  server: {
    port: envVars.PORT,
    apiVersion: envVars.API_VERSION,
    apiPrefix: `/api/${envVars.API_VERSION}`,
  },

  // Database configuration
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

  // JWT configuration
  jwt: {
    secret: envVars.JWT_SECRET,
    expiresIn: envVars.JWT_EXPIRES_IN,
    refreshSecret: envVars.JWT_REFRESH_SECRET,
    refreshExpiresIn: envVars.JWT_REFRESH_EXPIRES_IN,
  },

  // Session configuration
  session: {
    secret: envVars.SESSION_SECRET,
    cookie: {
      secure: envVars.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  },

  // CORS configuration
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

  // Rate limiting configuration
  rateLimit: {
    windowMs: envVars.RATE_LIMIT_WINDOW_MS,
    maxRequests: envVars.RATE_LIMIT_MAX_REQUESTS,
  },

  // Email configuration
  email: {
    host: envVars.EMAIL_HOST,
    port: envVars.EMAIL_PORT,
    user: envVars.EMAIL_USER,
    pass: envVars.EMAIL_PASS,
    from: envVars.EMAIL_FROM,
  },

  // Payment configuration
  payment: {
    razorpay: {
      keyId: envVars.RAZORPAY_KEY_ID,
      keySecret: envVars.RAZORPAY_KEY_SECRET,
    },
  },

  // File upload configuration
  upload: {
    cloudinary: {
      cloudName: envVars.CLOUDINARY_CLOUD_NAME,
      apiKey: envVars.CLOUDINARY_API_KEY,
      apiSecret: envVars.CLOUDINARY_API_SECRET,
    },
    maxFileSize: envVars.MAX_FILE_SIZE,
  },

  // Cache configuration
  cache: {
    redisUrl: envVars.REDIS_URL,
    ttl: envVars.CACHE_TTL,
  },

  // Logging configuration
  logging: {
    level: envVars.LOG_LEVEL,
    enable: envVars.ENABLE_LOGGING,
  },

  // Security configuration
  security: {
    bcryptRounds: envVars.BCRYPT_ROUNDS,
    passwordMinLength: envVars.PASSWORD_MIN_LENGTH,
    metricsToken: envVars.METRICS_TOKEN,
  },

  // Monitoring configuration
  monitoring: {
    enableMetrics: envVars.ENABLE_METRICS,
    enableHealthCheck: envVars.ENABLE_HEALTH_CHECK,
  },

  // Feature flags
  features: {
    enableCache: envVars.ENABLE_CACHE,
    enableRateLimiting: envVars.ENABLE_RATE_LIMITING,
    enableCompression: envVars.ENABLE_COMPRESSION,
    enableLogging: envVars.ENABLE_LOGGING,
  },

  // Development configuration
  development: {
    enableSwagger: envVars.ENABLE_SWAGGER,
    enableDebugMode: envVars.ENABLE_DEBUG_MODE,
  },
};

// Export individual configurations for convenience
export const {
  nodeEnv,
  isDevelopment,
  isProduction,
  isTest,
} = config;

export default config; 