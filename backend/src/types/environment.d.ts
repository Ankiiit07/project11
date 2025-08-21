declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT: string;
      API_VERSION: string;
      
      // Database
      MONGODB_URI: string;
      MONGODB_TEST_URI: string;
      
      // JWT Configuration
      JWT_SECRET: string;
      JWT_EXPIRE: string;
      JWT_REFRESH_SECRET: string;
      JWT_REFRESH_EXPIRE: string;
      
      // Razorpay Configuration
      RAZORPAY_KEY_ID: string;
      RAZORPAY_SECRET: string;
      
      // Email Configuration
      EMAIL_HOST: string;
      EMAIL_PORT: string;
      EMAIL_USER: string;
      EMAIL_PASS: string;
      EMAIL_FROM: string;
      
      // WhatsApp Configuration
      WHATSAPP_BUSINESS_NUMBER: string;
      WHATSAPP_API_TOKEN: string;
      
      // Cloudinary Configuration
      CLOUDINARY_CLOUD_NAME: string;
      CLOUDINARY_API_KEY: string;
      CLOUDINARY_API_SECRET: string;
      
      // Frontend URLs
      FRONTEND_URL: string;
      FRONTEND_PROD_URL: string;
      
      // Session Configuration
      SESSION_SECRET: string;
      
      // Rate Limiting
      RATE_LIMIT_WINDOW_MS: string;
      RATE_LIMIT_MAX_REQUESTS: string;
      
      // File Upload
      MAX_FILE_SIZE: string;
      UPLOAD_PATH: string;
      
      // Encryption
      ENCRYPTION_KEY: string;
      
      // Admin Configuration
      ADMIN_EMAIL: string;
      ADMIN_PASSWORD: string;
      
      // Payment Configuration
      PAYMENT_SUCCESS_URL: string;
      PAYMENT_CANCEL_URL: string;
      
      // Shipping Configuration
      FREE_SHIPPING_THRESHOLD: string;
      COD_CHARGES: string;
      EXPRESS_DELIVERY_CHARGES: string;
      
      // Tax Configuration
      GST_RATE: string;
    }
  }
}

export {};