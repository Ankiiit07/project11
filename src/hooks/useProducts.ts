import { useState, useEffect } from 'react';
import { useProducts as useSupabaseProducts, useProduct as useSupabaseProduct, useFeaturedProducts as useSupabaseFeaturedProducts } from './useSupabase';
import { Product } from '../data/products';
import { supabaseService } from '../services/supabaseService';

interface UseProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  totalResults: number;
  page: number;
  totalPages: number;
}

interface UseProductsParams {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

export function useProducts(params: UseProductsParams = {}) {
  // Use Supabase hook directly
  return useSupabaseProducts(params);
}

export function useProduct(id: string) {
  // Use Supabase hook directly
  return useSupabaseProduct(id);
}

export function useFeaturedProducts() {
  // Use Supabase hook directly
  return useSupabaseFeaturedProducts();
}

export function useProductsByCategory(category: string) {
  const [state, setState] = useState<{
    products: Product[];
    loading: boolean;
    error: string | null;
  }>({
    products: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchProductsByCategory = async () => {
      if (!category) return;

      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        const response = await supabaseService.getProductsByCategory(category);
        
        if (isMounted) {
          setState({
            products: response || [],
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        if (isMounted) {
          setState({
            products: [],
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch products by category',
          });
        }
      }
    };

    fetchProductsByCategory();

    return () => {
      isMounted = false;
    };
  }, [category]);

  return state;
}