// src/services/userService.ts
import { supabase } from "../supabaseClient";

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role: "customer" | "admin";
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

class UserService {
  // Register user
  async register(email: string, password: string, name?: string): Promise<UserProfile> {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (authError) throw authError;

    if (!authData.user) {
    return { message: "Check your email for a confirmation link." };
  }

    const user = authData.user;
    if (!user) throw new Error("User not created");

    // Create profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .insert([{ id: user.id, email: user.email, name, role: "customer" }])
      .select()
      .single();

    if (profileError) throw profileError;
    return profile as UserProfile;
  }

  // Login
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data.user;
  }

  // Logout
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  // Get current logged-in user profile
  async getProfile(): Promise<UserProfile | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) throw error;
    return profile as UserProfile;
  }

  // Promote user to admin (only from backend/SQL ideally)
  async makeAdmin(userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .update({ role: "admin" })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data as UserProfile;
  }
}

export const userService = new UserService();
