"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import type { UserProfile } from "../services/api";

export type AuthUser = UserProfile | Record<string, unknown> | null;

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser;
  login: (token: string, userData: AuthUser) => void;
  logout: () => void;
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => hasAccessToken());
  const [user, setUser] = useState<AuthUser>(() => readStoredUser());

  const login = (token: string, userData: AuthUser) => {
    setIsAuthenticated(true);
    setUser(userData);
    document.cookie = `access_token=${token}; path=/; max-age=86400`; // 1 day
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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
