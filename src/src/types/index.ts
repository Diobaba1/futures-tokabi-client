// src/types/index.ts
export type {
  LoginRequest,
  RegisterRequest,
  UserResponse,
  TokenResponse,
  LoginResponse,
  ChangePasswordRequest,
  AuthError,
} from './auth.types';

export type {
  User,
  UserUpdateRequest,
  APIKeyAdd,
  APIKeyResponse,
  SubscriptionUpdate,
  UserProfileResponse,
} from './user.types';

export type {
  TradeDetailResponse,
  TradeListResponse
} from './trades.types';

export type {
  PortfolioAnalytics,
  SystemAnalytics,
  TradeSummary,
  SignalSummary,
  SystemTradeSummary,
} from './analytics.types';

// Stub for TokenPrice
export interface TokenPrice {
  symbol: string;
  price: number;
  change_24h?: number;
}


export type {
  TelegramConfigCreate,
  TelegramConfigUpdate,

  TelegramConfigResponse

} from './telegram-config.types'


export type {
  AffiliateApplicationCreate,
  AffiliateApplicationResponse,
  AffiliateProfileResponse,
  AffiliateStatsResponse,
  ReferralUrlResponse,
  AffiliateCommissionResponse,
  AffiliateCommissionParams
} from './userAffiliate.types'