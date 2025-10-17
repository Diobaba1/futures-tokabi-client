// src/components/contexts/AuthContext.tsx
import React, {
  useState,
  useContext,
  createContext,
  ReactNode,
  useEffect,
  useRef,
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

  useEffect(() => {
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

    // Cleanup on unmount
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      websocketService.disconnect();
    };
  }, []);

  const connectWebSocket = (userId: string, token: string) => {
    try {
      // Prevent duplicate connection attempts
      if (isConnectingRef.current || websocketService.isConnected()) {
        return;
      }

      isConnectingRef.current = true;

      // Clean up previous connection and listeners
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }

      websocketService.disconnect();

      // Use the correct WebSocket path that matches your backend
      const wsPath = `/ws/portfolio/${userId}`;
      
      // Subscribe to connection status changes
      unsubscribeRef.current = websocketService.onConnectionChange((status) => {
        console.log("WebSocket connection status changed:", status);
        setWebsocketStatus(status);
        
        // Reset connecting flag when connection is established or failed
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

      // Connect to WebSocket with a small delay to ensure auth is fully processed
      setTimeout(() => {
        websocketService.connect(wsPath, token);
      }, 100);

    } catch (error) {
      console.error("Error connecting WebSocket:", error);
      setWebsocketStatus("error");
      isConnectingRef.current = false;
    }
  };

  const reconnectWebSocket = () => {
    if (user?.id) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        console.log("🔄 Manually reconnecting WebSocket...");
        connectWebSocket(user.id, token);
      }
    }
  };

  const clearAuth = async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
    setWebsocketStatus("idle");
    isConnectingRef.current = false;
    
    // Clean up WebSocket connection
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    websocketService.disconnect();
  };

  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      localStorage.setItem("accessToken", response.access_token);
      localStorage.setItem("refreshToken", response.refresh_token);
      await refreshUser();
    } catch (error) {
      await clearAuth();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      localStorage.setItem("accessToken", response.access_token);
      localStorage.setItem("refreshToken", response.refresh_token);
      await refreshUser();
    } catch (error) {
      await clearAuth();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      await clearAuth();
    }
  };

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token available");
      }

      const fetchedUser = await authService.getProfile();
      setUser(fetchedUser);
      setIsAuthenticated(true);
      
      // Connect WebSocket with user ID and token
      if (fetchedUser.id) {
        console.log("🔄 Setting up WebSocket for user:", fetchedUser.id);
        connectWebSocket(fetchedUser.id, token);
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
      await clearAuth();
      throw error;
    }
  };

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