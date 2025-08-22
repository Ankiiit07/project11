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

  // ✅ refresh user and ensure profile row exists
  const refreshUser = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // check if profile exists
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (!profile) {
          // 🔹 create a profile row if it doesn't exist
          const { data: newProfile, error: insertError } = await supabase
            .from("profiles")
            .insert([{ id: user.id, email: user.email, role: "customer" }])
            .select()
            .single();

          if (insertError) {
            console.error("Profile insert error:", insertError);
            // fallback: set minimal user
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
      setLoading(false);
    }
  };

  // ✅ Load user session + profile on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Handle email verification redirect with hash
        if (window.location.hash.includes("access_token")) {
          const { error } = await supabase.auth.getSessionFromUrl({
            storeSession: true,
          });
          if (error) {
            console.error("Error restoring session:", error);
          }
          await refreshUser();

          // Clear hash from URL so it doesn’t trigger again
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
        } else {
          await refreshUser();
        }
      } catch (error) {
        console.error("Error loading user:", error);
        setStoreUser(null);
        setStoreAuthenticated(false);
      }
    };

    loadUser();

  const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
    await refreshUser();
  }
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
