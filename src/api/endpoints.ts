// src/services/endpoints.ts
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/auth/login/",
    REGISTER: "/auth/register/",
    LOGOUT: "/auth/logout/",
    PROFILE: "/auth/profile/",
  },

  // Users
  USERS: {
    ME: "/users/me/",
    UPDATE: "/users/me/",

    API_KEYS: "/users/api-keys",
    API_KEYS_ID: (keyId: string) => `/users/api-keys/${keyId}`,
    SUBSCRIPTION: "/users/subscription",
  },

  // Portfolio
  PORTFOLIO: {
    GET: "/portfolio/portfolio/",
  },

  // Trades
  TRADES: {
    LIST: "/trades/",
    DETAIL: "/trades/{id}",
    CREATE: "/trades/",
    UPDATE: "/trades/{id}",
    DELETE: "/trades/{id}",
  },

  // Analytics
  ANALYTICS: {
    PORTFOLIO: "/analytics/portfolio/",
    PERFORMANCE: "/analytics/performance/",
    HISTORY: "/analytics/history/",
    SYSTEM: "/analytics/system/"
  },

  // Signals (open endpoints)
  SIGNALS: {
    LIST: "/signals/",
    DETAIL: "/signals/{signal_id}",
    SYMBOLS: "/signals/symbols/",
    STATS: "/signals/stats/summary",
  },

  // Binance Stream (assumed)
  BINANCE: {
    STREAM: "/binance/stream",
  },

  // Root and Health
  ROOT: "/",
  HEALTH: "/health",
  METRICS: "/metrics",
} as const;
