// src/types/userAffiliate.types.ts
export interface AffiliateApplicationCreate {
  social_links: string[]; // List of social media URLs
  reason: string; // Why they want to become an affiliate
  how_found: string; // How they found Tokabi
}

export interface AffiliateApplicationResponse {
  id: string;
  user_id: string;
  social_links: string[];
  reason: string;
  how_found: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  reviewed_at?: string; // ISO date string
  rejection_reason?: string;
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
  initial_commission_rate: number; // Percentage
  renewal_commission_rate: number; // Percentage
  created_at: string; // ISO date string
}

export interface AffiliateStatsResponse {
  total_referrals: number;
  active_referrals: number;
  total_earnings: number;
  pending_earnings: number;
  paid_earnings: number;
  conversion_rate: number; // Percentage as decimal (e.g., 80.0 for 80%)
  initial_commission_rate: number;
  renewal_commission_rate: number;
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

export interface AffiliateCommissionResponse {
  id: string;
  commission_type: 'initial' | 'renewal';
  commission_rate: number; // Percentage
  subscription_amount: number; // In cents
  commission_amount: number; // In cents
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  created_at: string; // ISO date string
  paid_at?: string; // ISO date string
}

// Params for getCommissions
export interface AffiliateCommissionParams {
  status?: 'pending' | 'approved' | 'paid' | 'cancelled';
  limit?: number; // Default 50, max 100
  offset?: number; // Default 0
}