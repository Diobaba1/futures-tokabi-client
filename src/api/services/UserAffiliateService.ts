// src/services/UserAffiliateService.ts
import axiosInstance from '../axiosConfig';
import { API_ENDPOINTS } from '../endpoints';

// Import types
import type {
  AffiliateApplicationCreate,
  AffiliateApplicationResponse,
  AffiliateProfileResponse,
  AffiliateStatsResponse,
  ReferralUrlResponse,
  AffiliateCommissionResponse,
  AffiliateCommissionParams
} from '../../types/userAffiliate.types';

export const UserAffiliateService = {
  /**
   * Apply to become an affiliate
   */
  applyForAffiliate: async (data: AffiliateApplicationCreate): Promise<AffiliateApplicationResponse> => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.REFERAL_SYSTEM.APPLY,
      data
    );
    return response.data;
  },

  /**
   * Get current user's affiliate application
   */
  getApplication: async (): Promise<AffiliateApplicationResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.REFERAL_SYSTEM.APPLICATION);
    return response.data;
  },

  /**
   * Get current user's affiliate profile
   */
  getProfile: async (): Promise<AffiliateProfileResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.REFERAL_SYSTEM.PROFILE);
    return response.data;
  },

  /**
   * Get referral URL and commission info
   */
  getReferralUrl: async (): Promise<ReferralUrlResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.REFERAL_SYSTEM.REFERRAL_URL);
    return response.data;
  },

  /**
   * Get comprehensive affiliate statistics
   */
  getStats: async (): Promise<AffiliateStatsResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.REFERAL_SYSTEM.STATS);
    return response.data;
  },

  /**
   * Get commission history with optional filters
   */
  getCommissions: async (params?: AffiliateCommissionParams): Promise<AffiliateCommissionResponse[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.REFERAL_SYSTEM.COMMISSIONS, { params });
    return response.data;
  },
};