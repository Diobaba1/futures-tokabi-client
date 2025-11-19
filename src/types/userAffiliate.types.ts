// ============================================================================
// FILE: src/types/userAffiliate.types.ts (UPDATED)
// ============================================================================

export interface AffiliateApplicationCreate {
  social_links: string[]; // List of social media URLs
  reason: string; // Why they want to become an affiliate (min 50 chars)
  how_found: string; // How they found Tokabi (min 10 chars)
}

export interface AffiliateApplicationResponse {
  id: string;
  user_id: string;
  social_links: string[];
  reason: string;
  how_found: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  reviewed_at: string | null; // ISO date string
  rejection_reason: string | null;
  created_at: string; // ISO date string
}

export interface AffiliateProfileResponse {
  id: string;
  user_id: string;
  is_active: boolean;
  total_referrals: number;
  total_earnings: number; // In cents
  pending_earnings: number; // In cents
  paid_earnings: number; // In cents
  initial_commission_rate: number; // Percentage (e.g., 25 for 25%)
  renewal_commission_rate: number; // Percentage (e.g., 10 for 10%)
  created_at: string; // ISO date string
}

export interface AffiliateCommissionResponse {
  id: string;
  commission_type: 'initial' | 'renewal';
  commission_rate: number; // Percentage (e.g., 25 for 25%)
  subscription_amount: number; // In cents
  commission_amount: number; // In cents
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  created_at: string; // ISO date string
  paid_at: string | null; // ISO date string
}

export interface AffiliateStatsResponse {
  is_affiliate: boolean;
  total_referrals: number;
  active_referrals: number;
  total_earnings: number; // In cents
  pending_earnings: number; // In cents
  paid_earnings: number; // In cents
  conversion_rate: number; // Percentage as decimal (e.g., 80.5 for 80.5%)
  initial_commission_rate: number; // Percentage
  renewal_commission_rate: number; // Percentage
  recent_commissions: AffiliateCommissionResponse[];
}

export interface ReferralUrlResponse {
  referral_code: string;
  referral_url: string;
  is_affiliate: boolean;
  commission_rates: {
    initial: number; // Percentage
    renewal: number; // Percentage
  };
}

// Params for getCommissions
export interface AffiliateCommissionParams {
  status?: 'pending' | 'approved' | 'paid' | 'cancelled';
  limit?: number; // Default 50, max 100
  offset?: number; // Default 0
}

// Admin types
export interface AffiliateApplicationReview {
  status: 'approved' | 'rejected';
  rejection_reason?: string; // Required if status is 'rejected'
}

// Referral System Types (from /referrals endpoints)
export interface ReferralCodeResponse {
  id: string;
  code: string;
  name: string | null;
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

export interface ReferralStats {
  total_referrals: number;
  completed_referrals: number;
  pending_referrals: number;
  total_rewards: number;
  total_reward_amount: number;
  conversion_rate: number;
}

export interface ReferralResponse {
  id: string;
  referee_email: string;
  status: string;
  conversion_stage: string;
  reward_given: boolean;
  reward_amount: number;
  created_at: string;
  completed_at: string | null;
}

export interface ReferralRewardResponse {
  id: string;
  reward_type: string;
  reward_amount: number;
  reward_currency: string;
  status: string;
  created_at: string;
  processed_at: string | null;
}