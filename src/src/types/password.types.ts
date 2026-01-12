// ============================================================================
// FILE: src/types/password.types.ts
// ============================================================================

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
  confirm_password: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  confirm_password?: string;
}

export interface PasswordResetResponse {
  success: boolean;
  message: string;
  reset_at?: string | null;
}

export interface ValidateResetTokenResponse {
  valid: boolean;
  expires_at?: string;
  email?: string | null;
}

export interface PasswordStrength {
  score: number; // 0-4
  label: string;
  meetsRequirements: boolean;
  tips: string[];
}

export enum PasswordErrorCodes {
  INVALID_TOKEN = 'INVALID_TOKEN',
  EXPIRED_TOKEN = 'EXPIRED_TOKEN',
  WEAK_PASSWORD = 'WEAK_PASSWORD',
  PASSWORD_MISMATCH = 'PASSWORD_MISMATCH',
  SAME_AS_OLD = 'SAME_AS_OLD',
  RATE_LIMITED = 'RATE_LIMITED',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
}

export interface PasswordError {
  code: PasswordErrorCodes;
  message: string;
  suggestions?: string[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: PasswordError;
  status: number;
}

export type ForgotPasswordResponse = ApiResponse<PasswordResetResponse>;
export type ResetPasswordResponse = ApiResponse<PasswordResetResponse>;
export type ChangePasswordResponse = ApiResponse<PasswordResetResponse>;
export type ValidateTokenResponse = ApiResponse<ValidateResetTokenResponse>;

// Helper function
export const validatePasswordStrength = (password: string): PasswordStrength => {
  let score = 0;
  const tips: string[] = [];

  // Length
  if (password.length >= 12) score += 2;
  else if (password.length >= 8) score += 1;
  else tips.push('Use at least 8 characters');

  // Character variety
  if (/[A-Z]/.test(password)) score += 1;
  else tips.push('Add uppercase letters');

  if (/[a-z]/.test(password)) score += 1;
  else tips.push('Add lowercase letters');

  if (/[0-9]/.test(password)) score += 1;
  else tips.push('Add numbers');

  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  else tips.push('Add special characters');

  // Determine label
  let label: string;
  if (score >= 6) label = 'Strong';
  else if (score >= 4) label = 'Good';
  else if (score >= 3) label = 'Fair';
  else if (score >= 2) label = 'Weak';
  else label = 'Very Weak';

  const meetsRequirements = password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password);

  return { score, label, meetsRequirements, tips };
};