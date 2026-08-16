import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Some features may not work.')
}

export const supabase = createClient(
  supabaseUrl || 'https://xqdfwqwdpedrbfaqtklq.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxZGZ3cXdkcGVkcmJmYXF0a2xxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDYzMjQsImV4cCI6MjA3MTI4MjMyNH0.mf6cjCA2gTTG_ie8qFl0yaoDf_0DtemvBw0oLx4uBx4'
)

export type Database = any;