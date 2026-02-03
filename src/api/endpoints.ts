// ============================================================================
// FILE: src/api/endpoints.ts (UPDATED - Fixed Billing Endpoints)
// ============================================================================

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/auth/login/",
    REGISTER: "/auth/register/",
    LOGOUT: "/auth/logout/",
    PROFILE: "/auth/profile/",

    // Password Reset & Management
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VALIDATE_RESET_TOKEN: "/auth/validate-reset-token",
    CHANGE_PASSWORD: "/auth/change-password",

    // Referral Code Management (NEW)
    CREATE_REFERRAL_CODE: "/auth/referral-codes",
    VALIDATE_REFERRAL_CODE: (code: string) => `/auth/referral/validate/${code}`,
  },

  // Users
  USERS: {
    ME: "/users/me/",
    UPDATE: "/users/me/",

    API_KEYS: "/users/api-keys",
    API_KEYS_ID: (keyId: string) => `/users/api-keys/${keyId}`,
    SUBSCRIPTION: "/users/subscription",

    // Telegram Config
    TELEGRAM: "/tg/telegram-config",
    TELEGRAM_ID: (configId: string) => `/tg/telegram-config/${configId}`,
  },

  // Portfolio
  PORTFOLIO: {
    GET: "/portfolio/portfolio/",
  },

  USER_SEARCH_SYMBOL: {
    ANALYZE: "/search_symbol/analyze-symbols",
    DETAIL: (search_id: string) => `/search_symbol/search/${search_id}`,
    HISTORY: "/search_symbol/search-history",
    RATE_LIMITS: "/search_symbol/rate-limit",
  },

  // WebSocket
  WEBSOCKET: {
    CHAT: "/ws/chat",
  },

  // ============================================================================
  // BILLING SYSTEM
  // ============================================================================
  BILLING: {
    // ========================================
    // Plans (under /subscriptions router)
    // Backend: subscriptions.router prefix="/subscriptions"
    // ========================================
    PLANS: {
      LIST: "/subscriptions/plans",                              // GET /api/subscriptions/plans
      FEATURED: "/subscriptions/plans/featured",                 // GET /api/subscriptions/plans/featured
    },

    // ========================================
    // Subscriptions
    // Backend: subscriptions.router prefix="/subscriptions"
    // ========================================
    SUBSCRIPTIONS: {
      CURRENT: "/subscriptions/me",                              // GET /api/subscriptions/me
      CREATE: "/subscriptions/",                                 // POST /api/subscriptions/
      CREATE_EMAIL: "/subscriptions/email",                      // POST /api/subscriptions/email
      HISTORY: "/subscriptions/history",                         // GET /api/subscriptions/history
      CANCEL: (subscriptionId: string) => 
        `/subscriptions/${subscriptionId}/cancel`,               // POST /api/subscriptions/{id}/cancel
      RENEW: (subscriptionId: string) => 
        `/subscriptions/${subscriptionId}/renew`,                // POST /api/subscriptions/{id}/renew
    },

    // ========================================
    // Payments
    // Backend: payments.router prefix="/payments"
    // ========================================
    PAYMENTS: {
      LIST: "/payments/",                                        // GET /api/payments/
      DETAIL: (paymentId: string) => `/payments/${paymentId}`,   // GET /api/payments/{id}
      STATUS: (paymentId: string) => 
        `/payments/${paymentId}/status`,                         // GET /api/payments/{id}/status
      CREATE_INVOICE: "/payments/create-invoice",                // POST /api/payments/create-invoice
    },

    // ========================================
    // Invoices
    // Backend: invoices.router prefix="/invoices"
    // ========================================
    INVOICES: {
      LIST: "/invoices/",                                        // GET /api/invoices/
      UNPAID: "/invoices/unpaid",                                // GET /api/invoices/unpaid
      DETAIL: (invoiceId: string) => `/invoices/${invoiceId}`,   // GET /api/invoices/{id}
      PAY: (invoiceId: string) => `/invoices/${invoiceId}/pay`,  // POST /api/invoices/{id}/pay
    },

    // ========================================
    // Webhooks (internal use)
    // Backend: nowpayments_webhooks.router prefix="/billing/webhooks"
    // ========================================
    WEBHOOKS: {
      NOWPAYMENTS_IPN: "/billing/webhooks/nowpayments",          // POST /api/billing/webhooks/nowpayments
      NOWPAYMENTS_TEST: "/billing/webhooks/nowpayments/test",    // GET /api/billing/webhooks/nowpayments/test
      RESYNC: (paymentId: string) => 
        `/billing/webhooks/nowpayments/resync/${paymentId}`,     // POST /api/billing/webhooks/nowpayments/resync/{id}
    },
  },

  // ============================================================================
  // REFERRAL & AFFILIATE SYSTEM
  // ============================================================================
  REFERAL_SYSTEM: {
    // ========================================
    // Affiliate Endpoints (User)
    // ========================================
    APPLY: "/affiliates/apply",
    APPLICATION: "/affiliates/application",
    PROFILE: "/affiliates/profile",
    REFERRAL_URL: "/affiliates/referral-url",
    STATS: "/affiliates/stats",
    COMMISSIONS: "/affiliates/commissions",

    // ========================================
    // Referral Endpoints (General)
    // ========================================
    REFERRAL_CODES: "/referrals/codes",
    REFERRAL_STATS: "/referrals/stats",
    REFERRALS_LIST: "/referrals/referrals",
    REFERRAL_REWARDS: "/referrals/rewards",
    MY_REFERALS: "/referrals/my-referrals",  // FIXED: Removed duplicate "referrals"
    REFERRAL_SUMMARY: "/referrals/summary",  // NEW: Comprehensive referral summary

    // ========================================
    // Webhook Integration
    // ========================================
    WEBHOOK_PAYMENT_SUBSCRIPTION: "/webhooks/payment/subscription",
    WEBHOOK_ADMIN_MANUAL_PROCESS: "/webhooks/admin/subscription/manual-process",
  },

  // ============================================================================
  // STAFF SIGNALS SYSTEM
  // ============================================================================
  STAFF_SIGNALS: {
    // Base CRUD
    LIST: "/staff-signals/",
    CREATE: "/staff-signals/",
    DETAIL: (signalId: string) => `/staff-signals/${signalId}`,
    UPDATE: (signalId: string) => `/staff-signals/${signalId}`,

    // Active signals
    ACTIVE: "/staff-signals/active",

    // Status management
    UPDATE_STATUS: (signalId: string) => `/staff-signals/${signalId}/status`,
    DEACTIVATE: (signalId: string) => `/staff-signals/${signalId}/deactivate`,
    ACTIVATE: (signalId: string) => `/staff-signals/${signalId}/activate`,

    // Execution tracking
    MARK_TP_HIT: (signalId: string) => `/staff-signals/${signalId}/tp-hit`,
    MARK_SL_HIT: (signalId: string) => `/staff-signals/${signalId}/sl-hit`,

    // Statistics
    STATS_SUMMARY: "/staff-signals/stats/summary",
  },

  // Trades
  TRADES: {
    LIST: "/trades/",
    DETAIL: "/trades/{id}",
    CREATE: "/trades/",
    UPDATE: "/trades/{id}",
    DELETE: "/trades/{id}",
    STATS: "/trades/stats/summary",
    // Exchange history - fetches directly from connected exchange
    EXCHANGE_HISTORY: "/trades/exchange/history",
    EXCHANGE_ORDERS: "/trades/exchange/orders",
  },

  // Analytics
  ANALYTICS: {
    PORTFOLIO: "/analytics/portfolio/",
    PERFORMANCE: "/analytics/performance/",
    HISTORY: "/analytics/history/",
    SYSTEM: "/analytics/system/",
  },

  SIGNALS: {
    // GET /signals/ - List signals with filters
    LIST: "/signals/",

    // GET /signals/active - Get active signals
    ACTIVE: "/signals/active",

    // GET /signals/stats - Get signal statistics
    STATS: "/signals/stats",

    // GET /signals/symbols - Get available symbols
    SYMBOLS: "/signals/symbols",

    // GET /signals/leverage-recommendations - Get leverage recommendations
    LEVERAGE_RECOMMENDATIONS: "/signals/leverage-recommendations",

    // GET /signals/{signal_id} - Get signal detail
    DETAIL: (signalId: string) => `/signals/${signalId}`,

    // PATCH /signals/{signal_id}/status - Update signal status
    UPDATE_STATUS: (signalId: string) => `/signals/${signalId}/status`,
  },

  // Binance Stream
  BINANCE: {
    STREAM: "/binance/stream",
  },

  // Root and Health
  ROOT: "/",
  HEALTH: "/health",
  METRICS: "/metrics",
} as const;

/**
 * Build query string from params object
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, String(v)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}
