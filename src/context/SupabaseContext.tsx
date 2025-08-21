import React, { createContext, useContext, ReactNode } from 'react'
import { useAuth } from '../hooks/useSupabase'

// Define a simpler User type since we're not using Supabase
type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  isEmailVerified: boolean;
}

interface SupabaseContextType {
  user: User | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, userData: { name: string; phone?: string }) => Promise<void>
  signOut: () => Promise<void>
  isAuthenticated: boolean
}

const SupabaseContext = createContext<SupabaseContextType | null>(null)

export const SupabaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuth()

  return (
    <SupabaseContext.Provider value={auth}>
      {children}
    </SupabaseContext.Provider>
  )
}

export const useSupabaseAuth = () => {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error('useSupabaseAuth must be used within a SupabaseProvider')
  }
  return context
}