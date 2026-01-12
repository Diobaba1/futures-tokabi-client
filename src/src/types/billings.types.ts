// ============================================================================
// FILE: src/types/billings.types.ts
// ============================================================================

/**
 * Billing System Types
 * 
 * TypeScript interfaces for the Tokabi billing system.
 */

// ============================================================================
// ENUMS
// ============================================================================

export enum SubscriptionStatus {
  PENDING = 'pending',
  TRIAL = 'trial',
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  SUSPENDED = 'suspended',
}

export enum SubscriptionTier {
  BASIC = 'basic',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
}

export enum PaymentStatus {
  WAITING = 'waiting',
  CONFIRMING = 'confirming',
  CONFIRMED = 'confirmed',
  SENDING = 'sending',
  PARTIALLY_PAID = 'partially_paid',
  FINISHED = 'finished',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  EXPIRED = 'expired',
}

export enum InvoiceStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  PAID = 'paid',
  PARTIALLY_PAID = 'partially_paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

// ============================================================================
// PLAN TYPES
// ============================================================================

export interface PlanFeatures {
  signals_per_day: number;
  support_type: string;
  support_hours: string;
  analytics: string;
  mobile_app: boolean;
  telegram_notifications: boolean;
  ai_analysis: boolean;
  assets_per_4_hours: number;
  auto_trading: boolean;
  priority_support: boolean;
  custom_strategies: boolean;
  white_label: boolean;
  api_access: boolean;
  expert_calls: boolean;
  custom_insights?: boolean;
  features_list?: string[];
  limits?: {
    signals_per_day: number;
    assets_analysis_per_4_hours: number;
  };
  metadata?: {
    badge: string;
    badge_text?: string;
    icon: string;
    button_text: string;
    button_style: string;
    highlight?: boolean;
  };
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  tier: SubscriptionTier;
  price_amount: number;
  price_currency: string;
  interval_days: number;
  trial_days: number;
  is_active: boolean;
  is_featured: boolean;
  max_trades_per_day: number;
  max_open_positions: number;
  features: PlanFeatures;
  nowpayments_plan_id?: string;
  created_at: string;
  updated_at?: string;
}

export interface PlanListResponse {
  plans: SubscriptionPlan[];
  total: number;
}

// ============================================================================
// SUBSCRIPTION TYPES
// ============================================================================

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  start_date: string;
  end_date: string;
  trial_end_date?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  cancel_at_period_end: boolean;
  last_payment_date?: string;
  next_payment_date?: string;
  failed_payment_count: number;
  current_period_start: string;
  current_period_end: string;
  nowpayments_subscription_id?: string;
  created_at: string;
  updated_at?: string;
}

export interface SubscriptionCreateRequest {
  plan_id: string;
  pay_currency?: string;  // Crypto currency for payment (e.g., 'btc', 'usdttrc20')
  referral_code?: string;
}

export interface SubscriptionCreateResponse {
  subscription: Subscription;
  payment_id?: string;
  payment_url?: string;       // NOWPayments hosted payment page URL
  invoice_url?: string;       // Same as payment_url
  nowpayments_payment_id?: string;
  expires_at?: string;
  trial?: boolean;            // True if trial was activated
  trial_end?: string;         // Trial end date if trial
}

export interface SubscriptionCancelRequest {
  reason?: string;
  immediate?: boolean;
  feedback?: string;
}

export interface SubscriptionUpgradeRequest {
  new_plan_id: string;
  payment_currency?: string;
  prorate?: boolean;
}

// ============================================================================
// PAYMENT TYPES
// ============================================================================

export interface Payment {
  id: string;
  user_id: string;
  subscription_id?: string;
  invoice_id?: string;
  status: PaymentStatus;
  provider: string;
  price_amount: number;
  price_currency: string;
  pay_amount?: number;
  pay_currency?: string;
  actually_paid: number;
  outcome_amount?: number;
  outcome_currency?: string;
  pay_address?: string;
  payment_url?: string;
  invoice_url?: string;
  transaction_hash?: string;
  network?: string;
  expiration_estimate_date?: string;
  order_description?: string;
  nowpayments_payment_id?: string;
  nowpayments_invoice_id?: string;
  error_message?: string;
  created_at: string;
  updated_at?: string;
  confirmed_at?: string;
  finished_at?: string;
}

export interface PaymentCreateRequest {
  subscription_id?: string;
  invoice_id?: string;
  amount: number;
  currency?: string;
  pay_currency: string;
  order_description?: string;
}

export interface PaymentCreateResponse {
  payment: Payment;
  payment_url: string;
  pay_address: string;
  pay_amount: number;
  pay_currency: string;
  expiration_estimate_date: string;
}

export interface PaymentStatusResponse {
  payment_id: string;
  status: PaymentStatus;
  actually_paid: number;
  pay_amount: number;
  pay_currency: string;
  is_complete: boolean;
  transaction_hash?: string;
}

export interface PaymentEstimateRequest {
  amount: number;
  currency_from: string;
  currency_to: string;
}

export interface PaymentEstimateResponse {
  estimated_amount: number;
  currency_from: string;
  currency_to: string;
  rate: number;
}

export interface CryptoCurrency {
  code: string;
  name: string;
  network?: string;
  min_amount: number;
  max_amount?: number;
  logo_url?: string;
  is_available: boolean;
}

// ============================================================================
// INVOICE TYPES
// ============================================================================

export interface Invoice {
  id: string;
  invoice_number: string;
  user_id: string;
  subscription_id?: string;
  status: InvoiceStatus;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  amount_paid: number;
  amount_remaining: number;
  currency: string;
  period_start?: string;
  period_end?: string;
  due_date?: string;
  description?: string;
  line_items?: InvoiceLineItem[];
  customer_email?: string;
  customer_name?: string;
  notes?: string;
  invoice_url?: string;
  created_at: string;
  updated_at?: string;
  paid_at?: string;
  cancelled_at?: string;
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface InvoiceListParams {
  page?: number;
  page_size?: number;
  status?: InvoiceStatus;
  start_date?: string;
  end_date?: string;
}

export interface InvoiceListResponse {
  invoices: Invoice[];
  total: number;
  page: number;
  page_size: number;
}

// ============================================================================
// BILLING STATS TYPES
// ============================================================================

export interface BillingStats {
  total_spent: number;
  currency: string;
  active_subscription: boolean;
  current_plan?: string;
  days_remaining?: number;
  next_billing_date?: string;
  payment_count: number;
  invoice_count: number;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
