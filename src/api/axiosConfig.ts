// src/api/services/axiosConfig.ts
import axios from 'axios';
import { isSubscriptionError } from '../types/billings.types';
import { handleSubscriptionError } from '../utils/subscriptionErrorHandler';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          // Note: FastAPI doesn't have /auth/token/refresh, so simulate or implement backend endpoint
          // For now, assume logout on 401
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject(error);
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden - Check for subscription errors
    if (error.response?.status === 403 && isSubscriptionError(error)) {
      // Dispatch subscription error event for UI handling
      handleSubscriptionError(error);
      // Still reject the promise so the calling code can handle it
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;