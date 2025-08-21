import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(
  apiCall: () => Promise<any>,
  dependencies: any[] = []
): UseApiState<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const response = await apiCall();
        
        if (isMounted) {
          setState({
            data: response.data,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        if (isMounted) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error.message : 'An error occurred',
          });
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return state;
}

export function useAsyncOperation<T>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = async (apiCall: () => Promise<any>) => {
    try {
      setState({ data: null, loading: true, error: null });
      const response = await apiCall();
      setState({
        data: response.data,
        loading: false,
        error: null,
      });
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
      throw error;
    }
  };

  return { ...state, execute };
}

// Specific hooks for common operations
export function useProducts(params?: any) {
  return useApi(() => apiService.getProducts(params), [JSON.stringify(params)]);
}

export function useProduct(id: string) {
  return useApi(() => apiService.getProduct(id), [id]);
}

export function useFeaturedProducts() {
  return useApi(() => apiService.getFeaturedProducts(), []);
}

export function useOrders() {
  return useApi(() => apiService.getOrders(), []);
}