# Cafe at Once - Enterprise E-commerce Platform

A production-ready, enterprise-level e-commerce platform for coffee and tea products, built with modern technologies and best practices.

## 🚀 Features

### Backend (Node.js/Express)
- **Security**: Helmet, rate limiting, secure session/cookie settings
- **Validation**: Strong input validation with Joi schemas
- **Error Handling**: Centralized error handler with structured logging
- **Performance**: Async/await, optimized DB queries, caching
- **API Structure**: RESTful, versioned, consistent response shapes
- **Environment**: Comprehensive environment configuration with validation
- **CORS**: Trusted origins only
- **Code Quality**: ESLint, Prettier, TypeScript best practices
- **Monitoring**: Performance metrics, health checks, logging
- **Testing**: Jest setup with comprehensive test utilities

### Frontend (React + Vite)
- **State Management**: Zustand with persistence and middleware
- **API Calls**: React Query for data fetching with caching
- **UI/UX**: Framer Motion animations, skeleton loaders, toast notifications
- **Performance**: Code splitting, lazy loading, image optimization
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation
- **Testing**: React Testing Library setup
- **Responsive Design**: Mobile-first approach

### Meta/Big Tech-Style Algorithms
- **Cart**: Efficient data structures for cart operations
- **Checkout**: Debounced input validation, optimistic UI updates
- **Payments**: Secure, robust payment flow
- **Animations**: Smooth transitions and micro-interactions

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with refresh tokens
- **Validation**: Joi schemas
- **Logging**: Winston with structured logging
- **Caching**: In-memory cache with Redis support
- **Testing**: Jest with supertest
- **Documentation**: OpenAPI/Swagger ready

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand with Immer
- **Data Fetching**: React Query
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Testing**: Vitest with React Testing Library

### Infrastructure
- **Database**: MongoDB Atlas
- **File Storage**: Cloudinary
- **Payments**: Razorpay
- **Email**: Nodemailer
- **Monitoring**: Custom metrics and health checks

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

### Frontend Setup
```bash
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

## 🔧 Environment Configuration

### Backend (.env)
   ```env
# Node Environment
NODE_ENV=development
PORT=5001
API_VERSION=v1

# Database
MONGODB_URI=mongodb://localhost:27017/cafe-at-once
MONGODB_URI_TEST=mongodb://localhost:27017/cafe-at-once-test

# JWT
JWT_SECRET=your-super-secret-jwt-key-32-chars-min
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-32-chars-min
JWT_REFRESH_EXPIRES_IN=30d

# Session
SESSION_SECRET=your-super-secret-session-key-32-chars-min

# CORS
FRONTEND_URL=http://localhost:5173
FRONTEND_PROD_URL=https://yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=cafeatonce@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=cafeatonce@gmail.com

# Payments
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret

# File Upload
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
MAX_FILE_SIZE=5242880

# Cache
REDIS_URL=redis://localhost:6379
CACHE_TTL=300

# Logging
LOG_LEVEL=info

# Security
BCRYPT_ROUNDS=12
PASSWORD_MIN_LENGTH=8
METRICS_TOKEN=your-metrics-token

# Monitoring
ENABLE_METRICS=true
ENABLE_HEALTH_CHECK=true

# Feature Flags
ENABLE_CACHE=true
ENABLE_RATE_LIMITING=true
ENABLE_COMPRESSION=true
ENABLE_LOGGING=true

# Development
ENABLE_SWAGGER=false
ENABLE_DEBUG_MODE=false
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5001/api/v1
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_RAZORPAY_KEY_ID=your-razorpay-key
```

## 🏗 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   └── environment.ts
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── productController.ts
│   │   │   └── ...
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── errorHandler.ts
│   │   │   ├── validation.ts
│   │   │   └── performance.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Product.ts
│   │   │   └── ...
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── products.ts
│   │   │   └── ...
│   │   ├── services/
│   │   │   └── emailService.ts
│   │   ├── utils/
│   │   │   ├── logger.ts
│   │   │   ├── cache.ts
│   │   │   ├── apiResponse.ts
│   │   │   └── queryOptimizer.ts
│   │   ├── tests/
│   │   │   └── setup.ts
│   │   └── server.ts
│   ├── jest.config.js
│   └── package.json
├── src/
│   ├── components/
│   │   ├── NotificationSystem.tsx
│   │   ├── LoadingSystem.tsx
│   │   └── ...
│   ├── store/
│   │   └── index.ts
│   ├── services/
│   │   └── apiService.ts
│   ├── hooks/
│   │   └── ...
│   ├── pages/
│   │   └── ...
│   └── ...
├── supabase/
│   └── migrations/
└── package.json
```

## 🔒 Security Features

### Backend Security
- **Helmet**: Security headers
- **Rate Limiting**: Request throttling
- **Input Validation**: Joi schemas with sanitization
- **CORS**: Trusted origins only
- **JWT**: Secure token-based authentication
- **Password Hashing**: bcrypt with configurable rounds
- **Session Security**: Secure cookies, CSRF protection
- **Error Handling**: No sensitive data leakage

### Frontend Security
- **Input Sanitization**: XSS prevention
- **Token Management**: Secure storage and handling
- **HTTPS**: Production-only secure connections
- **Content Security Policy**: XSS and injection protection

## 📊 Performance Features

### Backend Performance
- **Caching**: In-memory and Redis support
- **Database Optimization**: Indexed queries, connection pooling
- **Compression**: Gzip compression
- **Query Optimization**: Efficient database queries
- **Memory Management**: Proper cleanup and monitoring

### Frontend Performance
- **Code Splitting**: Lazy loading of components
- **Image Optimization**: WebP support, lazy loading
- **Caching**: React Query caching
- **Bundle Optimization**: Tree shaking, minification
- **Virtual Scrolling**: For large lists

## 🧪 Testing

### Backend Testing
   ```bash
cd backend
npm test
npm run test:coverage
```

### Frontend Testing
   ```bash
npm test
npm run test:coverage
```

## 📈 Monitoring & Analytics

### Health Checks
- `/health` - Basic health check
- `/metrics` - Performance metrics (protected)

### Logging
- Structured logging with Winston
- Different log levels (error, warn, info, debug)
- File and console output
- Error tracking and monitoring

### Performance Monitoring
- Response time tracking
- Memory usage monitoring
- Database query performance
- Custom metrics collection

## 🚀 Deployment

### Backend Deployment
   ```bash
cd backend
npm run build
npm start
   ```

### Frontend Deployment
   ```bash
    npm run build
# Deploy dist/ folder to your hosting service
```

### Docker Support
```bash
# Backend
docker build -t cafe-at-once-backend ./backend
docker run -p 5001:5001 cafe-at-once-backend

# Frontend
docker build -t cafe-at-once-frontend .
docker run -p 5173:5173 cafe-at-once-frontend
```

## 🔧 Development

### Code Quality
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type safety
- **Husky**: Git hooks
- **Commitlint**: Conventional commits

### Development Scripts
```bash
# Backend
npm run dev          # Development server
npm run build        # Build for production
npm run test         # Run tests
npm run lint         # Lint code
npm run migrate      # Run database migrations
npm run seed         # Seed database

# Frontend
npm run dev          # Development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run lint         # Lint code
```

## 📚 API Documentation

### Authentication
```
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

### Products
```
GET    /api/v1/products
GET    /api/v1/products/:id
GET    /api/v1/products/featured
POST   /api/v1/products (admin)
PUT    /api/v1/products/:id (admin)
DELETE /api/v1/products/:id (admin)
```

### Orders
```
GET    /api/v1/orders
GET    /api/v1/orders/:id
POST   /api/v1/orders
PUT    /api/v1/orders/:id/status
```

### Cart
```
GET    /api/v1/cart
POST   /api/v1/cart/add
PATCH  /api/v1/cart/update
DELETE /api/v1/cart/remove
DELETE /api/v1/cart/clear
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run linting and tests
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email cafeatonce@gmail.com or create an issue in the repository.

## 🔄 Changelog

### v2.0.0 - Enterprise Release
- ✨ Added comprehensive state management with Zustand
- ✨ Implemented React Query for data fetching
- ✨ Added Framer Motion animations
- ✨ Enhanced security with input validation
- ✨ Added performance monitoring
- ✨ Implemented comprehensive testing setup
- ✨ Added caching and optimization
- ✨ Enhanced error handling and logging
- ✨ Added accessibility features
- ✨ Implemented responsive design improvements

### v1.0.0 - Initial Release
- Basic e-commerce functionality
- Product catalog
- Shopping cart
- User authentication
- Payment integration