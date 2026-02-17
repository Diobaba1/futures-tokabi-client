// =============================================================================
// FILE: src/api/axiosConfig.ts
// =============================================================================
// Axios Instance with Enhanced Error Handling & Toast Integration
// =============================================================================

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { isSubscriptionError } from '../types/billings.types';
import { handleSubscriptionError } from '../utils/subscriptionErrorHandler';
import { logError, parseError } from '../utils/errorHandler';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL!;

// =============================================================================
// Auth State Tracking
// =============================================================================

// Only show "Session Expired" if the user was previously authenticated.
// Prevents false toasts on public pages when the initial auth check returns 401.
let wasAuthenticated = false;

export function setWasAuthenticated(value: boolean) {
  wasAuthenticated = value;
}

// =============================================================================
// Notification Debounce - Prevent duplicate toasts
// =============================================================================

const notificationDebounce: Record<string, number> = {};
const DEBOUNCE_MS = 3000; // 3 seconds between same notifications

function shouldShowNotification(key: string): boolean {
  const now = Date.now();
  const lastShown = notificationDebounce[key];

  if (!lastShown || now - lastShown > DEBOUNCE_MS) {
    notificationDebounce[key] = now;
    return true;
  }
  return false;
}

// =============================================================================
// Axios Instance Configuration
// =============================================================================

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  withCredentials: true,  // Send httpOnly cookies with every request
});

// =============================================================================
// Request Interceptor
// =============================================================================

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Cookies are sent automatically via withCredentials.
    // No manual Authorization header needed.
    return config;
  },
  (error: AxiosError) => {
    logError(error, 'Request Interceptor');
    return Promise.reject(error);
  }
);

// =============================================================================
// Response Interceptor with Enhanced Error Handling
// =============================================================================

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;

    // Log error in development
    logError(error, `API Error ${status || 'Network'}`);

    // Handle 401 Unauthorized
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Dispatch auth logout event so UI resets.
      window.dispatchEvent(new CustomEvent('auth:logout'));

      // Only show "Session Expired" if the user was previously authenticated.
      // A 401 during the initial auth check (no prior session) is expected — not an expiry.
      if (wasAuthenticated && shouldShowNotification('session-expired')) {
        dispatchNotification('warning', 'Session Expired', 'Your session has expired. Please log in again.');
      }

      wasAuthenticated = false;

      // Navigation is handled by ProtectedRoute — no forced redirect here.
      // This prevents unauthenticated users on public pages from being kicked to /login.

      return Promise.reject(error);
    }

    // Handle 403 Forbidden - Check for subscription errors
    if (status === 403 && isSubscriptionError(error)) {
      handleSubscriptionError(error);
      // Use debounced notification to prevent multiple toasts from parallel API calls
      if (shouldShowNotification('subscription-required')) {
        dispatchNotification('warning', 'Subscription Required', 'Please upgrade your subscription to access this feature.');
      }
      return Promise.reject(error);
    }

    // Note: General errors are NOT toasted here to avoid duplicates.
    // Components should handle their own error toasts with context-specific messages.
    // Only session expiry (401) and subscription errors (403) are handled here.

    return Promise.reject(error);
  }
);

// =============================================================================
// Notification Dispatcher
// =============================================================================

function dispatchNotification(
  type: 'error' | 'warning' | 'info' | 'success',
  title: string,
  message: string
) {
  window.dispatchEvent(
    new CustomEvent('notification:show', {
      detail: { type, title, message },
    })
  );
}

// =============================================================================
// Exports
// =============================================================================

export default axiosInstance;

// Re-export error utilities for convenience
export { parseError, getErrorMessage, getUserFriendlyError, isRetryableError } from '../utils/errorHandler';

// Legacy API Error interface (backwards compatibility)
export interface ApiError {
  message: string;
  detail?: string | Record<string, unknown>;
  status: number;
}

// Legacy error extraction (backwards compatibility)
export const extractErrorMessage = (error: unknown): string => {
  return parseError(error).message;
};
