// API Response Types
export interface ApiResponse<T = unknown> {
  status: 'success' | 'fail' | 'error';
  message?: string;
  data?: T;
  error?: string;
  timestamp?: string;
  path?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  isEmailVerified: boolean;
  addresses?: Address[];
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  tags: string[];
  inStock: boolean;
  stockQuantity: number;
  rating: number;
  reviewCount: number;
  nutrition: {
    calories: number;
    caffeine: number;
    sugar: number;
  };
  benefits: string[];
  instructions: string[];
  type: 'single' | 'subscription';
  createdAt: string;
  updatedAt: string;
}

// Cart Types
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  type: 'single' | 'subscription';
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

// Order Types
export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  type: 'single' | 'subscription';
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'online' | 'cod';
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: Address;
  billingAddress?: Address;
  estimatedDelivery: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Payment Types
export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed';
  paymentMethod: string;
  createdAt: string;
}

// Subscription Types
export interface Subscription {
  id: string;
  userId: string;
  productId: string;
  status: 'active' | 'paused' | 'cancelled';
  frequency: 'weekly' | 'bi-weekly' | 'monthly';
  quantity: number;
  nextDelivery: string;
  lastDelivery?: string;
  totalDeliveries: number;
  completedDeliveries: number;
  createdAt: string;
  updatedAt: string;
}

// Contact Types
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  category: string;
  status: 'new' | 'read' | 'replied' | 'closed';
  createdAt: string;
  updatedAt: string;
}

// Error Types
export interface ApiError {
  message: string;
  statusCode: number;
  code?: string;
  details?: Record<string, unknown>;
}

// Request Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface CreateOrderRequest {
  items: Array<{
    productId: string;
    quantity: number;
    type: 'single' | 'subscription';
  }>;
  shippingAddress: Address;
  paymentMethod: 'online' | 'cod';
  notes?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  addresses?: Address[];
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface QueryOptions {
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
  refetchOnWindowFocus?: boolean;
  retry?: number;
  onSuccess?: (data: unknown) => void;
  onError?: (error: ApiError) => void;
} 