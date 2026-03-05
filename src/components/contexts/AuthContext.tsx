// src/components/contexts/AuthContext.tsx
import React, {
  useState,
  useContext,
  createContext,
  ReactNode,
  useEffect,
  useRef,
  useCallback,
} from "react";
import axiosInstance, { setWasAuthenticated } from "../../api/axiosConfig";
import { authService } from "../../api/services";
import {
  LoginRequest,
  RegisterRequest,
  UserResponse,
} from "../../types/auth.types";

interface AuthContextType {
  user: UserResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Set in-memory Bearer token as fallback for browsers that block cross-site cookies.
 * The backend accepts both httpOnly cookies and Authorization headers (header wins).
 * This token lives only in memory — a page refresh clears it, which is acceptable:
 * the user just logs in again (same as "session expired").
 */
function setBearerToken(token: string | null) {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const hasInitialized = useRef(false);

  const clearAuth = useCallback(async () => {
    setBearerToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
    setWasAuthenticated(false);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const fetchedUser = await authService.getProfile();
      setUser(fetchedUser);
      setIsAuthenticated(true);
      setWasAuthenticated(true);
    } catch (error) {
      console.error("Failed to refresh user:", error);
      await clearAuth();
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [clearAuth]);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Clean up stale localStorage tokens from the old auth flow.
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    const initializeAuth = async () => {
      // Try to load profile — cookie is sent automatically.
      // If no valid cookie exists the API returns 401 and we stay logged out.
      try {
        await refreshUser();
      } catch {
        // No valid session — stay logged out.
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [refreshUser, clearAuth]);

  // Listen for auth:logout events dispatched by the axios interceptor
  // when both access_token and refresh_token have expired mid-session.
  useEffect(() => {
    const handleAuthLogout = () => { clearAuth(); };
    window.addEventListener('auth:logout', handleAuthLogout);
    return () => window.removeEventListener('auth:logout', handleAuthLogout);
  }, [clearAuth]);

  const login = useCallback(async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      // Server returns tokens in body AND sets httpOnly cookies.
      // We capture the token as a Bearer fallback for browsers that block
      // cross-site cookies (tokabi.io → api.tokabi.org).
      const response = await authService.login(data);
      if (response?.access_token) {
        setBearerToken(response.access_token);
      }
      await refreshUser();
    } catch (error) {
      await clearAuth();
      throw error;
    }
  }, [refreshUser, clearAuth]);

  const register = useCallback(async (data: RegisterRequest): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      if (response?.access_token) {
        setBearerToken(response.access_token);
      }
      await refreshUser();
    } catch (error) {
      await clearAuth();
      throw error;
    }
  }, [refreshUser, clearAuth]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      await clearAuth();
    }
  }, [clearAuth]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
