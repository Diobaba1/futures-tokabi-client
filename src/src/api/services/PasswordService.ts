// ============================================================================
// FILE: src/api/services/PasswordService.ts
// ============================================================================

import axiosInstance from "../axiosConfig";
import { API_ENDPOINTS } from "../endpoints";
import {
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  ChangePasswordResponse,
  ValidateTokenResponse,
  PasswordResetResponse,
  ValidateResetTokenResponse,
  PasswordErrorCodes,
  validatePasswordStrength,
} from "../../types/password.types";

class PasswordService {
  async forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    try {
      const response = await axiosInstance.post<PasswordResetResponse>(
        API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
        data
      );

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    try {
      // Validate password strength
      const strength = validatePasswordStrength(data.new_password);
      if (!strength.meetsRequirements) {
        return {
          success: false,
          error: {
            code: PasswordErrorCodes.WEAK_PASSWORD,
            message: "Password does not meet security requirements",
            suggestions: strength.tips,
          },
          status: 400,
        };
      }

      // Check passwords match
      if (data.new_password !== data.confirm_password) {
        return {
          success: false,
          error: {
            code: PasswordErrorCodes.PASSWORD_MISMATCH,
            message: "Passwords do not match",
          },
          status: 400,
        };
      }

      const response = await axiosInstance.post<PasswordResetResponse>(
        API_ENDPOINTS.AUTH.RESET_PASSWORD,
        data
      );

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    try {
      // Validate password strength
      const strength = validatePasswordStrength(data.new_password);
      if (!strength.meetsRequirements) {
        return {
          success: false,
          error: {
            code: PasswordErrorCodes.WEAK_PASSWORD,
            message: "Password does not meet security requirements",
            suggestions: strength.tips,
          },
          status: 400,
        };
      }

      const response = await axiosInstance.post<PasswordResetResponse>(
        API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
        null,
        {
          params: {
            old_password: data.old_password,
            new_password: data.new_password,
          },
        }
      );

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async validateResetToken(token: string): Promise<ValidateTokenResponse> {
    try {
      const response = await axiosInstance.post<ValidateResetTokenResponse>(
        API_ENDPOINTS.AUTH.VALIDATE_RESET_TOKEN,
        null,
        { params: { token } }
      );

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  analyzePasswordStrength(password: string) {
    return validatePasswordStrength(password);
  }

  generateSecurePassword(length: number = 12): string {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    
    let password = "";
    // Ensure at least one of each type
    password += this.getRandomChar("abcdefghijklmnopqrstuvwxyz");
    password += this.getRandomChar("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    password += this.getRandomChar("0123456789");
    password += this.getRandomChar("!@#$%^&*");

    // Fill the rest
    for (let i = password.length; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    // Shuffle
    return this.shuffleString(password);
  }

  validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  getRateLimitStatus(operation: string) {
    const key = `password_${operation}_attempts`;
    const now = Date.now();
    const attempts = JSON.parse(localStorage.getItem(key) || "[]");

    const recentAttempts = attempts.filter(
      (time: number) => now - time < 15 * 60 * 1000
    );

    return {
      limited: recentAttempts.length >= 5,
      attempts: recentAttempts.length,
      remainingTime: Math.max(0, 15 * 60 - Math.floor((now - (recentAttempts[0] || now)) / 1000)),
    };
  }

  clearRateLimit(operation: string): void {
    localStorage.removeItem(`password_${operation}_attempts`);
  }

  storeResetToken(token: string, expiresAt: string): void {
    sessionStorage.setItem(
      "password_reset_token",
      JSON.stringify({ token, expiresAt, storedAt: new Date().toISOString() })
    );
  }

  getStoredResetToken(): { token: string; expiresAt: string } | null {
    const data = sessionStorage.getItem("password_reset_token");
    if (!data) return null;

    const parsed = JSON.parse(data);
    if (new Date() > new Date(parsed.expiresAt)) {
      this.clearStoredResetToken();
      return null;
    }

    return parsed;
  }

  clearStoredResetToken(): void {
    sessionStorage.removeItem("password_reset_token");
  }

  private handleError(error: any): any {
    console.error("PasswordService error:", error);

    if (error.response) {
      const { status, data } = error.response;

      const errorMap: Record<number, PasswordErrorCodes> = {
        400: PasswordErrorCodes.INVALID_TOKEN,
        401: PasswordErrorCodes.EXPIRED_TOKEN,
        403: PasswordErrorCodes.ACCOUNT_LOCKED,
        429: PasswordErrorCodes.RATE_LIMITED,
      };

      return {
        success: false,
        error: {
          code: errorMap[status] || PasswordErrorCodes.INVALID_TOKEN,
          message: data.detail || "An error occurred",
        },
        status,
      };
    }

    return {
      success: false,
      error: {
        code: PasswordErrorCodes.INVALID_TOKEN,
        message: "Network error. Please check your connection.",
      },
      status: 0,
    };
  }

  private getRandomChar(charset: string): string {
    return charset.charAt(Math.floor(Math.random() * charset.length));
  }

  private shuffleString(str: string): string {
    const array = str.split("");
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join("");
  }
}

export const passwordService = new PasswordService();
export default PasswordService;