// src/context/UserContext.tsx
import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useAppStore, useAppActions } from "../store";
import { User } from "../store"; // local type
import { supabase } from "../supabaseClient";
import { userService } from "../services/userService"; // helper we built for supabase

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    phone?: string
  ) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  console.log("UserProvider component is rendering");
  const { user, isLoading, setUser, setLoading, setAuthenticated } = useAppStore((state) => ({
  user: state.user,
  isLoading: state.isLoading,
  setUser: state.setUser,
  setLoading: state.setLoading,
  setAuthenticated: state.setAuthenticated,
}));
  console.log("UserContext render - isLoading:", isLoading); // Add this
console.log("UserContext render - user:", user); // Add this
  const {
    setUser: setStoreUser,
    setAuthenticated: setStoreAuthenticated,
    logout: clearStore,
  } = useAppActions();

  // ✅ refresh user and ensure profile row exists
  // Around line 35, replace the entire refreshUser function:
const refreshUser = async () => {
  console.log("refreshUser START"); // Add this
  setLoading(true);
  
  // Add timeout to prevent infinite loading
  const timeoutId = setTimeout(() => {
    console.log("refreshUser TIMEOUT - forcing loading to false");
    setLoading(false);
  }, 5000); // 5 second timeout
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    console.log("supabase user:", user); // Add this

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      console.log("profile data:", profile); // Add this

      if (!profile) {
        const { data: newProfile, error: insertError } = await supabase
          .from("profiles")
          .insert([{ id: user.id, email: user.email, role: "customer" }])
          .select()
          .single();

        if (insertError) {
          console.error("Profile insert error:", insertError);
          setStoreUser({ id: user.id, email: user.email, name: "" });
        } else {
          setStoreUser(newProfile);
        }
      } else {
        setStoreUser(profile);
      }

      setStoreAuthenticated(true);
    } else {
      setStoreUser(null);
      setStoreAuthenticated(false);
    }
  } catch (error) {
    console.error("Refresh user error:", error);
    setStoreUser(null);
    setStoreAuthenticated(false);
  } finally {
    clearTimeout(timeoutId); // Clear timeout if completed normally
    console.log("refreshUser END - setting loading to false"); // Add this
    setLoading(false);
  }
};

  // ✅ Load user session + profile on mount
 useEffect(() => {
  console.log("UserContext useEffect running");
  
  const initUser = async () => {
    try {
      await refreshUser();
    } catch (error) {
      console.error("Error loading user:", error);
      setStoreUser(null);
      setStoreAuthenticated(false);
      setLoading(false);
    }
  };

  initUser();

  const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
    console.log("Auth state change:", event, session?.user?.id);
    if (session?.user) {
      setStoreUser({ id: session.user.id, email: session.user.email || "", name: "" });
      setStoreAuthenticated(true);
    } else {
      setStoreUser(null);
      setStoreAuthenticated(false);
    }
    setLoading(false);
  });

  return () => {
    listener?.subscription.unsubscribe();
  };
}, []); // Changed from [refreshUser, setStoreUser, setStoreAuthenticated] to []

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await userService.login(email, password);
      await refreshUser();
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await userService.logout();
      clearStore();
      setStoreAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    phone?: string
  ) => {
    setLoading(true);
    try {
      // create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, phone },
        },
      });
      if (error) throw error;

      const authUser = data.user;
      if (authUser) {
        // immediately insert profile row
        const { error: insertError } = await supabase.from("profiles").insert([
          {
            id: authUser.id,
            email: authUser.email,
            name,
            phone,
            role: "customer",
          },
        ]);
        if (insertError) {
          console.error("Profile insert during register failed:", insertError);
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      // just update in local state, skip supabase call
      setStoreUser((prev) => ({ ...prev, ...userData }));
      return { success: true };
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading: isLoading,
        login,
        logout,
        register,
        updateProfile,
        refreshUser,
        isAuthenticated: !!(user && user.id),
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
