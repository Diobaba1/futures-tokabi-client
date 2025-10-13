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
  TradeResponse,
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