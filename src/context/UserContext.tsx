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
  const { user, isLoading, setUser, setLoading, setAuthenticated } =
    useAppStore();
  const {
    setUser: setStoreUser,
    setAuthenticated: setStoreAuthenticated,
    logout: clearStore,
  } = useAppActions();

  // Load user session + profile on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const profile = await userService.getProfile();
          if (profile) {
            setStoreUser(profile);
            setStoreAuthenticated(true);
          }
        } else {
          setStoreUser(null);
          setStoreAuthenticated(false);
        }
      } catch (error) {
        console.error("Error loading user:", error);
        setStoreUser(null);
        setStoreAuthenticated(false);
      }
    };

    loadUser();

    // 🔄 listen to supabase auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [setStoreUser, setStoreAuthenticated]);

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
      await userService.register(email, password, name, phone);
      await refreshUser();
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

  const refreshUser = async () => {
    setLoading(true);
    try {
      const profile = await userService.getProfile();
      if (profile) {
        setStoreUser(profile);
        setStoreAuthenticated(true);
      } else {
        setStoreUser(null);
        setStoreAuthenticated(false);
      }
    } catch (error) {
      console.error("Refresh user error:", error);
    } finally {
      setLoading(false);
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
        isAuthenticated: !!(user && user.id),,
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
