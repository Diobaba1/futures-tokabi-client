// =============================================================================
// FILE: src/api/axiosConfig.ts
// =============================================================================
// Axios Instance with Enhanced Error Handling & Toast Integration
// =============================================================================

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { isSubscriptionError } from '../types/billings.types';
import { handleSubscriptionError } from '../utils/subscriptionErrorHandler';
import { parseError, requiresReAuth, formatErrorForToast, logError } from '../utils/errorHandler';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

// =============================================================================
// Axios Instance Configuration
// =============================================================================

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// =============================================================================
// Request Interceptor
// =============================================================================

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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

    // Handle 401 Unauthorized - Session Expired
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      // Dispatch auth logout event
      window.dispatchEvent(new CustomEvent('auth:logout'));

      // Show user-friendly notification
      dispatchNotification('warning', 'Session Expired', 'Your session has expired. Please log in again.');

      // Redirect to login
      if (window.location.pathname !== '/login') {
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      }

      return Promise.reject(error);
    }

    // Handle 403 Forbidden - Check for subscription errors
    if (status === 403 && isSubscriptionError(error)) {
      handleSubscriptionError(error);
      dispatchNotification('warning', 'Subscription Required', 'Please upgrade your subscription to access this feature.');
      return Promise.reject(error);
    }

    // Handle other errors with user-friendly messages
    if (status && !originalRequest._retry) {
      const parsed = parseError(error);

      // Only show toast for errors that aren't handled above
      if (!requiresReAuth(error) && !isSubscriptionError(error)) {
        const toast = formatErrorForToast(error);
        dispatchNotification(toast.type, parsed.title, toast.message);
      }
    }

    // Handle network errors
    if (!error.response) {
      const parsed = parseError(error);
      dispatchNotification('error', parsed.title, parsed.message);
    }

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
