// src/api/services/authService.ts
import axiosInstance from '../axiosConfig';
import { API_ENDPOINTS } from '../endpoints';
import { LoginRequest, RegisterRequest, TokenResponse, UserResponse } from '../../types/auth.types';

export interface ReferralCodeResponse {
  id: string;
  code: string;
  name: string;
  max_uses: number | null;
  uses_count: number;
  is_active: boolean;
  is_expired: boolean;
  is_usable: boolean;
  expires_at: string | null;
  reward_type: string;
  referral_url: string;
  created_at: string;
}

export interface ReferralValidationResponse {
  valid: boolean;
  message: string;
  code: string;
}

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
    // Server clears httpOnly cookies and blacklists the token.
    await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  /**
   * Create a new referral code for the current user
   * POST /auth/referral-codes
   */
  async createReferralCode(): Promise<ReferralCodeResponse> {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.CREATE_REFERRAL_CODE);
    return response.data;
  },

  /**
   * Validate a referral code before registration
   * GET /auth/referral/validate/{code}
   */
  async validateReferralCode(code: string): Promise<ReferralValidationResponse> {
    const response = await axiosInstance.get(API_ENDPOINTS.AUTH.VALIDATE_REFERRAL_CODE(code));
    return response.data;
  },
};