// ============================================================================
// FILE: src/api/services/UserAffiliateService.ts (UPDATED)
// ============================================================================

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
  AffiliateCommissionParams,
  AffiliateApplicationReview,
  ReferralCodeResponse,
  ReferralStats,
  ReferralResponse,
  ReferralRewardResponse
} from '../../types/userAffiliate.types';

export const UserAffiliateService = {
  // ============================================================================
  // USER AFFILIATE ENDPOINTS
  // ============================================================================

  /**
   * Apply to become an affiliate
   * POST /affiliates/apply
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
   * GET /affiliates/application
   */
  getApplication: async (): Promise<AffiliateApplicationResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.REFERAL_SYSTEM.APPLICATION);
    return response.data;
  },

  /**
   * Get current user's affiliate profile
   * GET /affiliates/profile
   */
  getProfile: async (): Promise<AffiliateProfileResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.REFERAL_SYSTEM.PROFILE);
    return response.data;
  },

  /**
   * Get referral URL and commission info
   * GET /affiliates/referral-url
   */
  getReferralUrl: async (): Promise<ReferralUrlResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.REFERAL_SYSTEM.REFERRAL_URL);
    return response.data;
  },

  /**
   * Get comprehensive affiliate statistics
   * GET /affiliates/stats
   */
  getStats: async (): Promise<AffiliateStatsResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.REFERAL_SYSTEM.STATS);
    return response.data;
  },

  /**
   * Get commission history with optional filters
   * GET /affiliates/commissions
   */
  getCommissions: async (params?: AffiliateCommissionParams): Promise<AffiliateCommissionResponse[]> => {
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
    const response = await axiosInstance.get(API_ENDPOINTS.REFERAL_SYSTEM.REFERRAL_CODES);
    return response.data;
  },

  /**
   * Get referral statistics
   * GET /referrals/stats
   */
  getReferralStats: async (): Promise<ReferralStats> => {
    const response = await axiosInstance.get(API_ENDPOINTS.REFERAL_SYSTEM.REFERRAL_STATS);
    return response.data;
  },

  /**
   * Get referrals made by current user
   * GET /referrals/referrals
   */
  getReferrals: async (params?: { status?: string; limit?: number; offset?: number }): Promise<ReferralResponse[]> => {
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
  getReferralRewards: async (params?: { limit?: number; offset?: number }): Promise<ReferralRewardResponse[]> => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.REFERAL_SYSTEM.REFERRAL_REWARDS,
      { params }
    );
    return response.data;
  },

  // ============================================================================
  // ADMIN ENDPOINTS
  // ============================================================================

  /**
   * Get all affiliate applications (Admin only)
   * GET /affiliates/admin/applications
   */
  getAdminApplications: async (params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<AffiliateApplicationResponse[]> => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.REFERAL_SYSTEM.ADMIN_APPLICATIONS,
      { params }
    );
    return response.data;
  },

  /**
   * Review affiliate application (Admin only)
   * POST /affiliates/admin/applications/{application_id}/review
   */
  reviewApplication: async (
    applicationId: string,
    data: AffiliateApplicationReview
  ): Promise<AffiliateApplicationResponse> => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.REFERAL_SYSTEM.ADMIN_APPLICATION_REVIEW(applicationId),
      data
    );
    return response.data;
  },

  /**
   * Approve commission for payment (Admin only)
   * POST /affiliates/admin/commissions/{commission_id}/approve
   */
  approveCommission: async (commissionId: string): Promise<{ message: string; commission_id: string }> => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.REFERAL_SYSTEM.ADMIN_COMMISSION_APPROVE(commissionId)
    );
    return response.data;
  },

  /**
   * Mark commission as paid (Admin only)
   * POST /affiliates/admin/commissions/{commission_id}/pay
   */
  markCommissionPaid: async (commissionId: string): Promise<{ message: string; commission_id: string }> => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.REFERAL_SYSTEM.ADMIN_COMMISSION_PAY(commissionId)
    );
    return response.data;
  },
};