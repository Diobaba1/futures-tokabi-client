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
import { websocketService } from "../../api/services/websocketService";

interface AuthContextType {
  user: UserResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  websocketStatus: string;
  reconnectWebSocket: () => void;
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
  const [websocketStatus, setWebsocketStatus] = useState<string>("idle");
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const isConnectingRef = useRef(false);
  const hasInitialized = useRef(false);

  const connectWebSocket = useCallback((userId: string, token: string) => {
    try {
      if (isConnectingRef.current || websocketService.isConnected()) {
        return;
      }

      isConnectingRef.current = true;

      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }

      websocketService.disconnect();

      const wsPath = `/ws/portfolio/${userId}`;
      
      unsubscribeRef.current = websocketService.onConnectionChange((status) => {
        console.log("WebSocket connection status changed:", status);
        setWebsocketStatus(status);
        
        if (status === "connected" || status === "error" || status === "disconnected") {
          isConnectingRef.current = false;
        }

        if (status === "error") {
          console.error("WebSocket connection failed. Possible issues:");
          console.error("1. Server WebSocket endpoint availability");
          console.error("2. CORS configuration");
          console.error("3. Token validity");
          console.error("4. Network connectivity");
        }

        if (status === "connected") {
          console.log("✅ WebSocket connected successfully for user:", userId);
        }
      });

      setTimeout(() => {
        websocketService.connect(wsPath, token);
      }, 100);

    } catch (error) {
      console.error("Error connecting WebSocket:", error);
      setWebsocketStatus("error");
      isConnectingRef.current = false;
    }
  }, []);

  const reconnectWebSocket = useCallback(() => {
    if (user?.id) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        console.log("🔄 Manually reconnecting WebSocket...");
        connectWebSocket(user.id, token);
      }
    }
  }, [user?.id, connectWebSocket]);

  const clearAuth = useCallback(async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
    setWebsocketStatus("idle");
    isConnectingRef.current = false;
    
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    websocketService.disconnect();
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
      
      if (fetchedUser.id && !websocketService.isConnected()) {
        console.log("🔄 Setting up WebSocket for user:", fetchedUser.id);
        connectWebSocket(fetchedUser.id, token);
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
      await clearAuth();
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [connectWebSocket, clearAuth]);

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

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      websocketService.disconnect();
    };
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
    websocketStatus,
    reconnectWebSocket,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};