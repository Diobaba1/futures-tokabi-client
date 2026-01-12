// src/api/services/authService.ts
import axiosInstance from '../axiosConfig';
import { API_ENDPOINTS } from '../endpoints';
import { LoginRequest, RegisterRequest, TokenResponse, UserResponse } from '../../types/auth.types';

export const authService = {
  async login(data: LoginRequest): Promise<TokenResponse & { user: UserResponse }> {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, data);
    return response.data;
  },

  async register(data: RegisterRequest): Promise<TokenResponse & { user: UserResponse }> {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },

  async getProfile(): Promise<UserResponse> {
    const response = await axiosInstance.get(API_ENDPOINTS.USERS.ME);
    return response.data;
  },

  async logout(): Promise<void> {
    // No explicit logout endpoint, just clear tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};