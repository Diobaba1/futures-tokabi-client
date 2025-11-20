// src/types/auth.types.ts
export interface UserResponse {
  id: string;
  email: string;
  full_name: string;
  is_subscribed: boolean;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  full_name: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface LoginResponse extends TokenResponse {
  user: UserResponse;
}

// Stubs for missing types
export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface AuthError {
  code: string;
  message: string;
}