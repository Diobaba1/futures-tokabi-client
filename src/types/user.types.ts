// src/types/user.types.ts
import { UserResponse } from './auth.types';

export type ExchangeType = 'binance' | 'bybit';

export interface APIKeyAdd {
  api_key: string;
  api_secret: string;
  label?: string;
  testnet?: boolean;
  exchange_type?: ExchangeType;
}

export interface APIKeyResponse {
  id: string;
  label: string;
  is_testnet: boolean;
  is_active: boolean;
  validation_status: 'pending' | 'valid' | 'invalid';
  exchange_type: ExchangeType;
  created_at: string;
}

export interface SubscriptionUpdate {
  is_subscribed: boolean;
}

export interface UserProfileResponse extends UserResponse {
  api_keys?: APIKeyResponse[];
}

// Stubs for missing types
export type User = UserResponse;

export interface UserUpdateRequest {
  full_name?: string;
  email?: string;
}