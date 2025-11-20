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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const hasInitialized = useRef(false);

  const clearAuth = useCallback(async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token available");
      }

      const fetchedUser = await authService.getProfile();
      setUser(fetchedUser);
      setIsAuthenticated(true);
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

    const initializeAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          await refreshUser();
        } catch (error) {
          console.error("Failed to refresh user on init:", error);
          await clearAuth();
        }
      } else {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [refreshUser, clearAuth]);

  const login = useCallback(async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      localStorage.setItem("accessToken", response.access_token);
      localStorage.setItem("refreshToken", response.refresh_token);
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
      localStorage.setItem("accessToken", response.access_token);
      localStorage.setItem("refreshToken", response.refresh_token);
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