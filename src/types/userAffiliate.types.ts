// ============================================================================
// FILE: src/types/userAffiliate.types.ts (CLEANED)
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

// Wrapper response for application endpoint
export interface ApplicationStatusResponse {
  has_application: boolean;
  message: string;
  application: AffiliateApplicationResponse | null;
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

// Wrapper response for profile endpoint
export interface ProfileStatusResponse {
  has_profile: boolean;
  is_affiliate: boolean;
  message: string;
  profile: AffiliateProfileResponse | null;
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
  affiliate_id: string | null; // null for non-affiliates
  is_affiliate: boolean;
  total_referrals: number;
  active_referrals: number;
  converted_referrals: number;
  conversion_rate: number; // Percentage as decimal (e.g., 80.5 for 80.5%)
  total_earnings: number; // In cents
  pending_earnings: number; // In cents
  paid_earnings: number; // In cents
  total_commissions: number;
  pending_commissions: number;
  approved_commissions: number;
  paid_commissions: number;
  current_month_earnings: number; // In cents
  current_month_referrals: number;
  last_payout_date: string | null; // ISO date string
  next_payout_date: string | null; // ISO date string
  initial_commission_rate: number; // Percentage
  renewal_commission_rate: number; // Percentage
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

/**
 * Comprehensive information about a referred user
 * Returned by GET /referrals/referred-users AND GET /referrals/my-referrals
 */
export interface ReferredUser {
  // Referral Information
  referral_id: string;
  
  // User Information
  user_id: string;
  email: string;
  full_name: string | null;
  
  // Referral Status
  status: 'pending' | 'completed' | 'rewarded';
  conversion_stage: string;
  
  // User Account Status
  is_active: boolean;
  is_verified: boolean;
  is_subscribed: boolean;
  
  // Subscription Details
  subscription_status: 'active' | 'inactive' | 'expired';
  subscription_end: string | null;
  
  // Reward Information
  reward_given: boolean;
  reward_amount: number;  // in cents
  reward_given_at: string | null;
  
  // Time Tracking
  referred_at: string;
  days_since_referral: number;
  last_login: string | null;
  days_since_login: number | null;
  completed_at: string | null;
}

/**
 * Query parameters for filtering referred users
 * Used with GET /referrals/referred-users
 */
export interface ReferredUserParams {
  status?: 'pending' | 'completed' | 'rewarded';
  is_active?: boolean;
  is_subscribed?: boolean;
  search?: string;
  sort_by?: 'created_at' | 'email' | 'status';
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

/**
 * Structured response for my-referrals endpoint
 * Always returns 200 with clear messaging about referral status
 */
export interface MyReferralsResponse {
  has_referrals: boolean;
  message: string;
  referrals: ReferredUser[];
  total: number;
  filtered: number;
  showing: number;
}

/**
 * Summary of referral activity
 * Returned by GET /referrals/summary
 */
export interface ReferralSummary {
  statistics: {
    total_referrals: number;
    active_users: number;
    subscribed_users: number;
    completed_referrals: number;
    pending_referrals: number;
    conversion_rate: number;
    subscription_rate: number;
  };
  rewards: {
    total_earned: number;
    pending: number;
    processed: number;
    total_count: number;
  };
  recent_referrals: Array<{
    email: string;
    status: string;
    referred_at: string;
    is_subscribed: boolean;
  }>;
  referral_code_performance: Array<{
    code_id: string;
    total_uses: number;
    successful_conversions: number;
    conversion_rate: number;
  }>;
}