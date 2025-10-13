// src/endpoints.ts
const AUTH = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
};

const USERS = {
  ME: '/users/me',
  API_KEYS: '/users/api-keys',
  API_KEYS_ID: (keyId: string) => `/users/api-keys/${keyId}`,
  SUBSCRIPTION: '/users/subscription',
};

const TRADES = {
  LIST: '/trades',
  DETAIL: (tradeId: string) => `/trades/${tradeId}`,
};

const ANALYTICS = {
  PORTFOLIO: '/analytics/portfolio',
  SYSTEM: '/analytics/system',
};

const STREAM = {
  WS_PORTFOLIO: (userId: string) => `/stream/ws/portfolio/${userId}`,
};

const GENERAL = {
  ROOT: '/',
  HEALTH: '/health',
  METRICS: '/metrics',
  PROTECTED_TEST: '/protected-test',
};

// Legacy for walletService compatibility (backend may not support, but for compile)
const WALLETS = {
  LIST: '/wallets/',
  CREATE: '/wallets/',
  DETAIL: (walletId: string) => `/wallets/${walletId}/`,
  UPDATE: (walletId: string) => `/wallets/${walletId}/`,
  DELETE: (walletId: string) => `/wallets/${walletId}/`,
  TASK_STATUS: (taskId: string) => `/tasks/${taskId}/`,
};

const PRICES = {
  LIVE: '/live-prices/',
};

export const API = {
  AUTH,
  USERS,
  TRADES,
  ANALYTICS,
  STREAM,
  GENERAL,
  WALLETS,
  PRICES,
} as const;