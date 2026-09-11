"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { UserProfile } from "../services/api";

export type AuthUser = (UserProfile & { is_admin?: boolean }) | Record<string, unknown> | null;

export interface PendingCartProduct {
  _id?: string | number;
  id?: string | number;
  product_title?: string;
  name?: string;
  product_price?: number | string;
  price?: number | string;
  product_main_image?: string;
  image_url?: string;
  quantity?: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: AuthUser;
  loading: boolean;
  login: (token: string, userData: AuthUser) => void;
  logout: () => void;
  showLoginModal: boolean;
  loginModalMessage: string;
  pendingCartProduct: PendingCartProduct | null;
  openLoginModal: (product?: PendingCartProduct, message?: string) => void;
  closeLoginModal: () => void;
  clearPendingCartProduct: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function hasAccessToken(): boolean {
  if (typeof document === "undefined") {
    return false;
  }

  return document.cookie.includes("access_token=");
}

function readStoredUser(): AuthUser {
  if (typeof window === "undefined") {
    return null;
  }

  const storedUser = window.localStorage.getItem("user");
  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Login Modal & Cart Protection state
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [loginModalMessage, setLoginModalMessage] = useState<string>("Please log in to add items to your cart.");
  const [pendingCartProduct, setPendingCartProduct] = useState<PendingCartProduct | null>(null);

  useEffect(() => {
    const authed = hasAccessToken() || Boolean(window.localStorage.getItem("authToken"));
    const storedUser = readStoredUser();
    setIsAuthenticated(authed);
    setUser(storedUser);
    setLoading(false);

    try {
      const storedPending = window.sessionStorage.getItem("pending_cart_product");
      if (storedPending) {
        setPendingCartProduct(JSON.parse(storedPending));
      }
    } catch {
      // ignore JSON parse errors
    }
  }, []);

  const isAdmin = Boolean(user && typeof user === "object" && (user as Record<string, unknown>).is_admin === true);

  const openLoginModal = (product?: PendingCartProduct, message?: string) => {
    if (product) {
      setPendingCartProduct(product);
      try {
        window.sessionStorage.setItem("pending_cart_product", JSON.stringify(product));
      } catch {
        // ignore storage errors
      }
    }
    if (message) {
      setLoginModalMessage(message);
    } else {
      setLoginModalMessage("Please log in to add items to your cart.");
    }
    setShowLoginModal(true);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  const clearPendingCartProduct = () => {
    setPendingCartProduct(null);
    try {
      window.sessionStorage.removeItem("pending_cart_product");
    } catch {
      // ignore
    }
  };

  const login = (token: string, userData: AuthUser) => {
    setIsAuthenticated(true);
    setUser(userData);
    document.cookie = `access_token=${token}; path=/; max-age=86400; SameSite=Lax`;
    localStorage.setItem("authToken", token);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax";
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAdmin,
        user,
        loading,
        login,
        logout,
        showLoginModal,
        loginModalMessage,
        pendingCartProduct,
        openLoginModal,
        closeLoginModal,
        clearPendingCartProduct,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

