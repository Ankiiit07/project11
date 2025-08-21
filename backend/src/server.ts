import dotenv from 'dotenv';

// Load environment variables FIRST, before any other imports
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

import { connectDB } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
// import { performanceMonitor } from './middleware/performance';
// import { sanitizeInput } from './middleware/validation';
import { getPerformanceMetrics } from './middleware/performance';
import logger from './utils/logger';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import paymentRoutes from './routes/payments';
import cartRoutes from './routes/cart';
import subscriptionRoutes from './routes/subscriptions';
import contactRoutes from './routes/contact';
import emailRoutes from './routes/email';
import newsletterRoutes from './routes/newsletter';
import adminRoutes from './routes/admin';
import analyticsRoutes from './routes/analytics';

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all requests
app.use('/api/', limiter);

// Performance monitoring
// app.use(performanceMonitor);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:5177',
    'http://localhost:5178',
    process.env.FRONTEND_URL || '',
    process.env.FRONTEND_PROD_URL || ''
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization
// app.use(sanitizeInput);

// Cookie parser
app.use(cookieParser());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'cafe-at-once-session-secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    touchAfter: 24 * 3600, // lazy session update
    // Don't crash if MongoDB is not available
    clientPromise: new Promise<MongoClient>((resolve, reject) => {
      if (mongoose.connection.readyState === 1) {
        // If already connected, resolve with the client
        resolve(mongoose.connection.getClient() as MongoClient);
      } else {
        // Wait for connection
        mongoose.connection.once('connected', () => {
          resolve(mongoose.connection.getClient() as MongoClient);
        });
        mongoose.connection.once('error', (err: Error) => {
          console.warn('⚠️ Session store: MongoDB connection failed, using memory store');
          reject(err);
        });
      }
    }).catch((err: Error) => {
        console.warn('⚠️ Session store: MongoDB connection failed, using memory store');
        throw err;
    }),
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
}));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev', { stream: { write: (message: string) => logger.http(message.trim()) } }));
} else {
  app.use(morgan('combined', { stream: { write: (message: string) => logger.http(message.trim()) } }));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    database: {
      connected: mongoose.connection.readyState === 1,
      state: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown'
    }
  });
});

// Test endpoint for debugging payments
app.post('/test-payment', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Test payment endpoint working',
    body: req.body
  });
});

// Performance metrics endpoint (protected in production)
app.get('/metrics', (req, res): void => {
  if (process.env.NODE_ENV === 'production' && req.headers.authorization !== `Bearer ${process.env.METRICS_TOKEN}`) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  
  const metrics = getPerformanceMetrics();
  
  res.status(200).json({
    timestamp: new Date().toISOString(),
    metrics,
    system: {
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      uptime: process.uptime(),
    }
  });
});

// API routes
const API_PREFIX = `/api/${process.env.API_VERSION || 'v1'}`;

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/products`, productRoutes);
app.use(`${API_PREFIX}/orders`, orderRoutes);
app.use(`${API_PREFIX}/payments`, paymentRoutes);
app.use(`${API_PREFIX}/cart`, cartRoutes);
app.use(`${API_PREFIX}/subscriptions`, subscriptionRoutes);
app.use(`${API_PREFIX}/contact`, contactRoutes);
app.use(`${API_PREFIX}/email`, emailRoutes);
app.use(`${API_PREFIX}/newsletter`, newsletterRoutes);
app.use(`${API_PREFIX}/admin`, adminRoutes);
app.use(`${API_PREFIX}/analytics`, analyticsRoutes);

// Serve static files
app.use('/uploads', express.static('uploads'));

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  logger.info(`📱 API available at http://localhost:${PORT}${API_PREFIX}`);
  logger.info(`🏥 Health check at http://localhost:${PORT}/health`);
  logger.info(`📊 Metrics available at http://localhost:${PORT}/metrics`);
});

export default app;