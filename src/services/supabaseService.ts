// This is a mock service that simulates Supabase functionality
// but actually uses the local data or falls back to the API service
import { products } from '../data/products';
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://vyomoroogtpvdwspfhsd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5b21vcm9vZ3RwdmR3c3BmaHNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MTk1MzQsImV4cCI6MjA2NzM5NTUzNH0.Z6z47R6aO6dPLkBN1iOc7EyvcGbPVVKEPXh_aNJWyWY';
export const supabase = createClient(supabaseUrl, supabaseKey);
// Mock types to maintain compatibility
type Product = any;
type User = any;
type Order = any;
type Subscription = any;
type Cart = any;


export class SupabaseService {
  // Authentication - Mock implementation
  async signUp(email: string, password: string, userData: { name: string; phone?: string }) {
    // Mock implementation - in real app, this would call the backend
    console.log('Mock signup:', { email, userData });
    return { success: true, message: 'User registered successfully' };
  }

  async signIn(email: string, password: string) {
    // Mock implementation - in real app, this would call the backend
    console.log('Mock signin:', { email });
    return { success: true, message: 'User signed in successfully' };
  }

  async signOut() {
    // Mock implementation - in real app, this would call the backend
    console.log('Mock signout');
    return { success: true, message: 'User signed out successfully' };
  }

  async getCurrentUser() {
    // Mock implementation - return null for now
    return null;
  }

  async getUserProfile(userId: string) {
    // Mock implementation - return null for now
    return null;
  }

  async updateUserProfile(userId: string, updates: any) {
    // Mock implementation - in real app, this would call the backend
    console.log('Mock update profile:', { userId, updates });
    return { success: true, message: 'Profile updated successfully' };
  }

  // Products
  async getProducts(params?: {
    category?: string
    search?: string
    page?: number
    limit?: number
    minPrice?: number
    maxPrice?: number
    sort?: string
  }) {
    try {
      // Use local data for now
      let filteredProducts = [...products];
      
      // Apply filters
      if (params?.category && params.category !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === params.category);
      }
      
      if (params?.search) {
        const searchLower = params.search.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(searchLower) || 
          p.description.toLowerCase().includes(searchLower)
        );
      }
      
      // Apply sorting
      if (params?.sort) {
        filteredProducts.sort((a, b) => {
          switch (params.sort) {
            case 'price-low':
              return a.price - b.price;
            case 'price-high':
              return b.price - a.price;
            case 'rating':
              return b.rating - a.rating;
            case 'name':
            default:
              return a.name.localeCompare(b.name);
          }
        });
      }
      
      // Calculate pagination
      const page = params?.page || 1;
      const limit = params?.limit || 12;
      const totalResults = filteredProducts.length;
      const totalPages = Math.ceil(totalResults / limit);
      
      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
      
      return {
        products: paginatedProducts,
        totalResults,
        page,
        totalPages,
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getProduct(id: string) {
    // Use local data
    const product = products.find(p => p.id === id);
    if (product) return product;
    
    // Return null if not found
    return null;
  }

  async getFeaturedProducts() {
    // Use local data
    const featuredProducts = products.filter(p => p.isFeatured);
    return featuredProducts.slice(0, 8);
  }

  async getProductsByCategory(category: string) {
    // Use local data
    return products.filter(p => p.category === category);
  }

  // Contact/Support
  async sendContactMessage(messageData: {
    name: string
    email: string
    subject: string
    message: string
    category: string
  }) {
    try {
      // Insert contact message into Supabase
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: messageData.name.trim(),
            email: messageData.email.trim().toLowerCase(),
            subject: messageData.subject.trim(),
            message: messageData.message.trim(),
            category: messageData.category,
            status: 'new'
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase error saving contact message:', error);
        throw new Error('Failed to save contact message');
      }

      console.log('Contact message saved successfully:', data);
      return data;
    } catch (error) {
      console.error('Error saving contact message:', error);
      throw error;
    }
  }
}

export const supabaseService = new SupabaseService()