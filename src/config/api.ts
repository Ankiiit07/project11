// API configuration and base setup
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// API endpoints
export const endpoints = {
  // Auth endpoints
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    logout: '/auth/logout',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email',
    updatePassword: '/auth/update-password',
  },
  
  // User endpoints
  users: {
    profile: '/users/profile',
    updateProfile: '/users/profile',
    addresses: '/users/addresses',
  },
  
  // Product endpoints
  products: {
    list: '/products',
    detail: '/products',
    featured: '/products/featured',
    category: '/products/category',
    search: '/products/search',
  },
  
  // Order endpoints
  orders: {
    list: '/orders',
    create: '/orders',
    detail: '/orders',
    track: '/orders/track',
  },
  
  // Payment endpoints
  payments: {
    createOrder: '/payments/create-order',
    verify: '/payments/verify',
    createOrderFromCart: '/payments/create-order-from-cart',
    status: '/payments/status',
  },
  
  // Cart endpoints
  cart: {
    get: '/cart',
    add: '/cart/add',
    update: '/cart/update',
    remove: '/cart/remove',
    clear: '/cart/clear',
  },
  
  // Contact endpoints
  contact: {
    send: '/contact/send',
  },
};

export default apiConfig;