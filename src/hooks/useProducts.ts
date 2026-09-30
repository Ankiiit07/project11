import { useMemo } from 'react';
import { products, getProductById, type Product } from '../data/products';

// Products are defined in src/data/products.ts, so these hooks are synchronous.
// `loading` and `error` are kept so pages can stay agnostic about the source.

interface ProductResult {
  product: Product | null;
  loading: false;
  error: string | null;
}

interface ProductsResult {
  products: Product[];
  loading: false;
  error: null;
}

export function useProduct(id: string): ProductResult {
  return useMemo(() => {
    const product = getProductById(id) || null;
    return { product, loading: false, error: product ? null : 'Product not found' };
  }, [id]);
}

export function useFeaturedProducts(): ProductsResult {
  return useMemo(() => ({ products: products.filter((p) => p.isFeatured).slice(0, 8), loading: false, error: null }), []);
}

export function useProductsByCategory(category: string): ProductsResult {
  return useMemo(
    () => ({ products: category ? products.filter((p) => p.category === category) : [], loading: false, error: null }),
    [category]
  );
}
