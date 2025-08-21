import { useState, useEffect } from 'react'
import { supabaseService } from '../services/supabaseService'

// Define simpler types since we're not using Supabase
type Product = any;
type Order = any;
type User = any;

// Products hooks
export function useProducts(params?: {
  category?: string
  search?: string
  page?: number
  limit?: number
  minPrice?: number
  maxPrice?: number
  sort?: string
}) {
  const [state, setState] = useState<{
    products: Product[]
    loading: boolean
    error: string | null
    totalResults: number
    page: number
    totalPages: number
  }>({
    products: [],
    loading: true,
    error: null,
    totalResults: 0,
    page: 1,
    totalPages: 0,
  })

  useEffect(() => {
    let isMounted = true

    const fetchProducts = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }))
        
        const result = await supabaseService.getProducts(params)
        
        if (isMounted) {
          setState({
            products: result.products,
            loading: false,
            error: null,
            totalResults: result.totalResults,
            page: result.page,
            totalPages: result.totalPages,
          })
        }
      } catch (error) {
        if (isMounted) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch products',
          }))
        }
      }
    }

    fetchProducts()

    return () => {
      isMounted = false
    }
  }, [JSON.stringify(params)])

  return state
}

export function useProduct(id: string) {
  const [state, setState] = useState<{
    product: Product | null
    loading: boolean
    error: string | null
  }>({
    product: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let isMounted = true

    const fetchProduct = async () => {
      if (!id) return

      try {
        setState(prev => ({ ...prev, loading: true, error: null }))
        
        const product = await supabaseService.getProduct(id)
        
        if (isMounted) {
          setState({
            product,
            loading: false,
            error: null,
          })
        }
      } catch (error) {
        if (isMounted) {
          setState({
            product: null,
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch product',
          })
        }
      }
    }

    fetchProduct()

    return () => {
      isMounted = false
    }
  }, [id])

  return state
}

export function useFeaturedProducts() {
  const [state, setState] = useState<{
    products: Product[]
    loading: boolean
    error: string | null
  }>({
    products: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    let isMounted = true

    const fetchFeaturedProducts = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }))
        
        const products = await supabaseService.getFeaturedProducts()
        
        if (isMounted) {
          setState({
            products,
            loading: false,
            error: null,
          })
        }
      } catch (error) {
        if (isMounted) {
          setState({
            products: [],
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch featured products',
          })
        }
      }
    }

    fetchFeaturedProducts()

    return () => {
      isMounted = false
    }
  }, [])

  return state
}

// Orders hooks
export function useOrders(userId?: string) {
  const [state, setState] = useState<{
    orders: Order[]
    loading: boolean
    error: string | null
  }>({
    orders: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    let isMounted = true

    const fetchOrders = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }))
        
        const orders = await supabaseService.getOrders(userId)
        
        if (isMounted) {
          setState({
            orders,
            loading: false,
            error: null,
          })
        }
      } catch (error) {
        if (isMounted) {
          setState({
            orders: [],
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch orders',
          })
        }
      }
    }

    fetchOrders()

    return () => {
      isMounted = false
    }
  }, [userId])

  const refetch = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const orders = await supabaseService.getOrders(userId)
      
      setState({
        orders,
        loading: false,
        error: null,
      })
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch orders',
      }))
    }
  }

  return { ...state, refetch }
}

// Auth hooks
export function useAuth() {
  const [state, setState] = useState<{
    user: User | null
    loading: boolean
    error: string | null
  }>({
    user: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let isMounted = true

    const getUser = async () => {
      try {
        const authUser = await supabaseService.getCurrentUser()
        
        if (authUser && isMounted) {
          const userProfile = await supabaseService.getUserProfile(authUser.id)
          setState({
            user: userProfile,
            loading: false,
            error: null,
          })
        } else if (isMounted) {
          setState({
            user: null,
            loading: false,
            error: null,
          })
        }
      } catch (error) {
        if (isMounted) {
          setState({
            user: null,
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to get user',
          })
        }
      }
    }

    getUser()

    return () => {
      isMounted = false
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      await supabaseService.signIn(email, password)
      
      // Refresh user data
      const authUser = await supabaseService.getCurrentUser()
      if (authUser) {
        const userProfile = await supabaseService.getUserProfile(authUser.id)
        setState({
          user: userProfile,
          loading: false,
          error: null,
        })
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Sign in failed',
      }))
      throw error
    }
  }

  const signUp = async (email: string, password: string, userData: { name: string; phone?: string }) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      await supabaseService.signUp(email, password, userData)
      
      // Note: User might need to verify email before they can sign in
      setState(prev => ({ ...prev, loading: false }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Sign up failed',
      }))
      throw error
    }
  }

  const signOut = async () => {
    try {
      await supabaseService.signOut()
      setState({
        user: null,
        loading: false,
        error: null,
      })
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Sign out failed',
      }))
    }
  }

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!state.user,
  }
}