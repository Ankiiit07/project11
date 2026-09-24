import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { useQuery, useMutation, useQueryClient, QueryClient } from 'react-query';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
apiClient.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
  (error: AxiosError) => {
    // Handle common errors
        if (typeof error === 'object' && error !== null) {
      const errorObj = error as { response?: { status?: number; data?: unknown } };
      if (errorObj.response?.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
      
      if (errorObj.response?.status === 403) {
        // Forbidden
        console.error('Access forbidden');
      }
      
      if (errorObj.response?.status && errorObj.response.status >= 500) {
        // Server error
        console.error('Server error:', errorObj.response.data);
      }
    }
        
        return Promise.reject(error);
      }
    );

import { 
  ApiResponse, 
  PaginatedResponse, 
  User, 
  Product, 
  Cart, 
  Order, 
  Subscription, 
  ContactMessage,
  ApiError,
  LoginRequest,
  RegisterRequest,
  CreateOrderRequest,
  UpdateProfileRequest,
  QueryOptions
} from '../types/api';

// Error handling utility
export const handleApiError = (error: unknown): string => {
  if (typeof error === 'object' && error !== null) {
    const errorObj = error as { response?: { data?: { message?: string } }; message?: string };
    if (errorObj.response?.data?.message) {
      return errorObj.response.data.message;
    }
    if (errorObj.message) {
      return errorObj.message;
    }
  }
  return 'An unexpected error occurred';
};

// Generic API functions
export const api = {
  // GET request
  get: async <T>(url: string, params?: any): Promise<ApiResponse<T>> => {
    const response = await apiClient.get(url, { params });
    return response.data;
  },

  // POST request
  post: async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
    const response = await apiClient.post(url, data);
    return response.data;
  },

  // PUT request
  put: async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
    const response = await apiClient.put(url, data);
    return response.data;
  },

  // PATCH request
  patch: async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
    const response = await apiClient.patch(url, data);
    return response.data;
  },

  // DELETE request
  delete: async <T>(url: string): Promise<ApiResponse<T>> => {
    const response = await apiClient.delete(url);
    return response.data;
  },
};

// React Query hooks
export const useApiQuery = <T>(
  key: string | string[],
  url: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    cacheTime?: number;
    refetchOnWindowFocus?: boolean;
    retry?: number;
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
  }
) => {
  return useQuery(
    key,
    async () => {
      const response = await api.get<T>(url);
      if (response.status !== 'success') {
        throw new Error(response.message || 'Request failed');
      }
      return response.data;
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 3,
      onError: (error) => {
        const message = handleApiError(error);
        console.error('API Error:', message);
        options?.onError?.(error);
      },
      onSuccess: options?.onSuccess,
      ...options,
    }
  );
};

export const useApiMutation = <T, V>(
  url: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST',
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
    invalidateQueries?: string[];
  }
) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (variables: V) => {
      let response: ApiResponse<T>;
      
      switch (method) {
        case 'POST':
          response = await api.post<T>(url, variables);
          break;
        case 'PUT':
          response = await api.put<T>(url, variables);
          break;
        case 'PATCH':
          response = await api.patch<T>(url, variables);
          break;
        case 'DELETE':
          response = await api.delete<T>(url);
          break;
        default:
          throw new Error('Invalid HTTP method');
      }

      if (response.status !== 'success') {
        throw new Error(response.message || 'Request failed');
      }
      
      return response.data;
    },
    {
      onSuccess: (data) => {
        options?.onSuccess?.(data);
        
        // Invalidate related queries
        if (options?.invalidateQueries) {
          options.invalidateQueries.forEach(queryKey => {
            queryClient.invalidateQueries(queryKey);
          });
        }
      },
      onError: (error) => {
        const message = handleApiError(error);
        console.error('API Error:', message);
        options?.onError?.(error);
      },
    }
  );
};

// Specific API hooks for different resources
export const useProducts = (filters?: {
    category?: string;
    search?: string;
  minPrice?: number;
  maxPrice?: number;
    page?: number;
    limit?: number;
  sortBy?: string;
}) => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });
  }

  return useApiQuery<PaginatedResponse<any>>(
    ['products', filters],
    `/products?${params.toString()}`,
    {
      staleTime: 2 * 60 * 1000, // 2 minutes for products
    }
  );
};

export const useProduct = (id: string) => {
  return useApiQuery<any>(
    ['product', id],
    `/products/${id}`,
    {
      enabled: !!id,
    }
  );
};

export const useFeaturedProducts = () => {
  return useApiQuery<any[]>(
    ['featured-products'],
    '/products/featured',
    {
      staleTime: 10 * 60 * 1000, // 10 minutes for featured products
    }
  );
};

export const useUser = () => {
  return useApiQuery<any>(
    ['user'],
    '/auth/me',
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

export const useOrders = (filters?: {
  status?: string;
  page?: number;
  limit?: number;
}) => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });
  }

  return useApiQuery<PaginatedResponse<any>>(
    ['orders', filters],
    `/orders?${params.toString()}`,
    {
      staleTime: 1 * 60 * 1000, // 1 minute for orders
    }
  );
};

export const useOrder = (id: string) => {
  return useApiQuery<any>(
    ['order', id],
    `/orders/${id}`,
    {
      enabled: !!id,
    }
  );
};

// Mutation hooks
export const useLogin = () => {
  return useApiMutation<any, { email: string; password: string }>(
    '/auth/login',
    'POST',
    {
      onSuccess: (data) => {
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
      },
    }
  );
};

export const useRegister = () => {
  return useApiMutation<any, { name: string; email: string; password: string; phone?: string }>(
    '/auth/register',
    'POST',
    {
      onSuccess: (data) => {
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
      },
    }
  );
};

export const useAddToCart = () => {
  return useApiMutation<any, { productId: string; quantity: number }>(
    '/cart/add',
    'POST',
    {
      invalidateQueries: ['cart'],
    }
  );
};

export const useUpdateCartItem = () => {
  return useApiMutation<any, { itemId: string; quantity: number }>(
    '/cart/update',
    'PATCH',
    {
      invalidateQueries: ['cart'],
    }
  );
};

export const useRemoveFromCart = () => {
  return useApiMutation<any, { itemId: string }>(
    '/cart/remove',
    'DELETE',
    {
      invalidateQueries: ['cart'],
    }
  );
};

export const useCreateOrder = () => {
  return useApiMutation<any, any>(
    '/orders',
    'POST',
    {
      invalidateQueries: ['orders', 'cart'],
    }
  );
};

export const useUpdateProfile = () => {
  return useApiMutation<any, any>(
    '/users/profile',
    'PUT',
    {
      invalidateQueries: ['user'],
    }
  );
};

// Query client configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Legacy apiService export for backward compatibility
export const apiService = {
  get: api.get,
  post: api.post,
  put: api.put,
  patch: api.patch,
  delete: api.delete,
  // Add other methods as needed for backward compatibility
};

export default api;