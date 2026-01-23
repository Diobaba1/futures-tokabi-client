// ============================================================================
// FILE: src/api/services/UserAffiliateService.ts (UPDATED)
// ============================================================================

import axiosInstance from "../axiosConfig";
import { API_ENDPOINTS } from "../endpoints";

// Import types
import type {
  AffiliateApplicationCreate,
  AffiliateApplicationResponse,
  ApplicationStatusResponse,
  // AffiliateProfileResponse,
  ProfileStatusResponse,
  AffiliateStatsResponse,
  ReferralUrlResponse,
  AffiliateCommissionResponse,
  AffiliateCommissionParams,
  ReferralCodeResponse,
  ReferralStats,
  ReferralResponse,
  ReferralRewardResponse,
  ReferredUserParams,
  MyReferralsResponse,
  ReferralSummary,
} from "../../types/userAffiliate.types";

export const UserAffiliateService = {
  // ============================================================================
  // USER AFFILIATE ENDPOINTS
  // ============================================================================

  /**
   * Apply to become an affiliate
   * POST /affiliates/apply
   */
  applyForAffiliate: async (
    data: AffiliateApplicationCreate
  ): Promise<AffiliateApplicationResponse> => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.REFERAL_SYSTEM.APPLY,
      data
    );
    return response.data;
  },

  /**
   * Get current user's affiliate application
   * GET /affiliates/application
   * Returns structured response indicating if application exists
   */
  getApplication: async (): Promise<ApplicationStatusResponse> => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.REFERAL_SYSTEM.APPLICATION
    );
    return response.data;
  },

  /**
   * Get current user's affiliate profile
   * GET /affiliates/profile
   * Returns structured response indicating if profile exists
   */
  getProfile: async (): Promise<ProfileStatusResponse> => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.REFERAL_SYSTEM.PROFILE
    );
    return response.data;
  },

  /**
   * Get detailed list of users you referred
   * GET /referrals/my-referrals
   *
   * Returns structured response with:
   * - has_referrals: boolean indicating if user has any referrals
   * - message: user-friendly message about referral status
   * - referrals: array of ReferredUser objects (empty if none)
   * - total: total count before filters
   * - filtered: count after filters
   * - showing: count in current response
   */
  getMyReferals: async (
    params?: ReferredUserParams
  ): Promise<MyReferralsResponse> => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.REFERAL_SYSTEM.MY_REFERALS,
      { params }
    );
    return response.data;
  },

  /**
   * Get referral URL and commission info
   * GET /affiliates/referral-url
   */
  getReferralUrl: async (): Promise<ReferralUrlResponse> => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.REFERAL_SYSTEM.REFERRAL_URL
    );
    return response.data;
  },

  /**
   * Get comprehensive affiliate statistics
   * GET /affiliates/stats
   * Works for both regular users and affiliates
   */
  getStats: async (): Promise<AffiliateStatsResponse> => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.REFERAL_SYSTEM.STATS
    );
    return response.data;
  },

  /**
   * Get commission history with optional filters
   * GET /affiliates/commissions
   * Returns empty array if user is not an affiliate
   */
  getCommissions: async (
    params?: AffiliateCommissionParams
  ): Promise<AffiliateCommissionResponse[]> => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.REFERAL_SYSTEM.COMMISSIONS,
      { params }
    );
    return response.data;
  },

  // ============================================================================
  // REFERRAL ENDPOINTS (General referral system, not affiliate-specific)
  // ============================================================================

  /**
   * Get all referral codes for current user
   * GET /referrals/codes
   */
  getReferralCodes: async (): Promise<ReferralCodeResponse[]> => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.REFERAL_SYSTEM.REFERRAL_CODES
    );
    return response.data;
  },

  /**
   * Get referral statistics
   * GET /referrals/stats
   */
  getReferralStats: async (): Promise<ReferralStats> => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.REFERAL_SYSTEM.REFERRAL_STATS
    );
    return response.data;
  },

  /**
   * Get referrals made by current user
   * GET /referrals/referrals
   */
  getReferrals: async (params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<ReferralResponse[]> => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.REFERAL_SYSTEM.REFERRALS_LIST,
      { params }
    );
    return response.data;
  },

  /**
   * Get referral rewards
   * GET /referrals/rewards
   */
  getReferralRewards: async (params?: {
    limit?: number;
    offset?: number;
  }): Promise<ReferralRewardResponse[]> => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.REFERAL_SYSTEM.REFERRAL_REWARDS,
      { params }
    );
    return response.data;
  },

  /**
   * Get comprehensive referral summary
   * GET /referrals/summary
   *
   * Returns:
   * - Total statistics (total_referrals, active_users, subscribed_users, etc.)
   * - Reward summary (total_earned, pending, processed)
   * - Recent referrals (last 5)
   * - Referral code performance
   */
  getReferralSummary: async (): Promise<ReferralSummary> => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.REFERAL_SYSTEM.REFERRAL_SUMMARY
    );
    return response.data;
  },
};
