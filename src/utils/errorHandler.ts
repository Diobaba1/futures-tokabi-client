// =============================================================================
// FILE: src/utils/errorHandler.ts
// =============================================================================
// Centralized Error Handling Utility
// Provides user-friendly error messages for all API responses
// =============================================================================

import axios, { AxiosError } from "axios";

// =============================================================================
// Error Types & Interfaces
// =============================================================================

export type ErrorSeverity = "info" | "warning" | "error" | "critical";

export interface ApiErrorResponse {
  success?: boolean;
  message?: string;
  detail?: string | Record<string, unknown> | Array<{ loc: string[]; msg: string; type: string }>;
  error_type?: string;
  error_code?: string;
  action_required?: string;
  errors?: Record<string, string[]>;
}

export interface ParsedError {
  message: string;
  title: string;
  severity: ErrorSeverity;
  code: string;
  actionRequired?: string;
  retryable: boolean;
  details?: string;
}

// =============================================================================
// Error Code Mappings - User-Friendly Messages
// =============================================================================

const ERROR_MESSAGES: Record<string, { title: string; message: string; severity: ErrorSeverity; retryable: boolean }> = {
  // Authentication Errors
  "auth_invalid_credentials": {
    title: "Login Failed",
    message: "Invalid email or password. Please check your credentials and try again.",
    severity: "error",
    retryable: true,
  },
  "auth_token_expired": {
    title: "Session Expired",
    message: "Your session has expired. Please log in again to continue.",
    severity: "warning",
    retryable: false,
  },
  "auth_token_invalid": {
    title: "Authentication Error",
    message: "Your authentication token is invalid. Please log in again.",
    severity: "error",
    retryable: false,
  },
  "auth_unauthorized": {
    title: "Unauthorized",
    message: "You need to be logged in to access this resource.",
    severity: "warning",
    retryable: false,
  },
  "auth_forbidden": {
    title: "Access Denied",
    message: "You don't have permission to perform this action.",
    severity: "error",
    retryable: false,
  },

  // User Errors
  "user_not_found": {
    title: "User Not Found",
    message: "The requested user could not be found.",
    severity: "error",
    retryable: false,
  },
  "user_already_exists": {
    title: "Account Exists",
    message: "An account with this email already exists. Try logging in instead.",
    severity: "warning",
    retryable: false,
  },
  "user_inactive": {
    title: "Account Inactive",
    message: "Your account has been deactivated. Please contact support.",
    severity: "error",
    retryable: false,
  },

  // API Key Errors
  "invalid_api_key": {
    title: "Invalid API Key",
    message: "Your Binance API credentials are invalid or expired. Please update them in settings.",
    severity: "error",
    retryable: false,
  },
  "api_key_not_found": {
    title: "API Key Not Found",
    message: "No API key found. Please add your Binance API credentials to start trading.",
    severity: "warning",
    retryable: false,
  },
  "api_key_permissions": {
    title: "Insufficient Permissions",
    message: "Your API key doesn't have the required permissions. Enable Futures trading in Binance.",
    severity: "error",
    retryable: false,
  },
  "api_key_exists": {
    title: "API Key Exists",
    message: "An API key with this label already exists. Please use a different name.",
    severity: "warning",
    retryable: true,
  },

  // Trading Errors
  "insufficient_balance": {
    title: "Insufficient Balance",
    message: "You don't have enough balance to execute this trade.",
    severity: "warning",
    retryable: false,
  },
  "trading_disabled": {
    title: "Trading Disabled",
    message: "Trading is currently disabled. Please check your subscription status.",
    severity: "error",
    retryable: false,
  },
  "position_exists": {
    title: "Position Exists",
    message: "You already have an open position for this symbol.",
    severity: "warning",
    retryable: false,
  },
  "order_failed": {
    title: "Order Failed",
    message: "Failed to place the order. Please check your settings and try again.",
    severity: "error",
    retryable: true,
  },

  // Signal Errors
  "signal_not_found": {
    title: "Signal Not Found",
    message: "The requested signal could not be found or may have expired.",
    severity: "error",
    retryable: false,
  },
  "signal_expired": {
    title: "Signal Expired",
    message: "This signal has expired and is no longer available.",
    severity: "warning",
    retryable: false,
  },

  // Subscription Errors
  "subscription_expired": {
    title: "Subscription Expired",
    message: "Your subscription has expired. Renew to continue using premium features.",
    severity: "warning",
    retryable: false,
  },
  "subscription_required": {
    title: "Subscription Required",
    message: "This feature requires an active subscription. Upgrade to access it.",
    severity: "warning",
    retryable: false,
  },
  "payment_failed": {
    title: "Payment Failed",
    message: "Your payment could not be processed. Please try again or use a different method.",
    severity: "error",
    retryable: true,
  },
  "payment_pending": {
    title: "Payment Pending",
    message: "Your payment is being processed. Please wait for confirmation.",
    severity: "info",
    retryable: false,
  },

  // Binance API Errors
  "binance_api_error": {
    title: "Exchange Error",
    message: "There was an issue communicating with Binance. Please try again.",
    severity: "error",
    retryable: true,
  },
  "binance_rate_limit": {
    title: "Rate Limited",
    message: "Too many requests to Binance. Please wait a moment and try again.",
    severity: "warning",
    retryable: true,
  },

  // Network & Server Errors
  "network_error": {
    title: "Connection Error",
    message: "Unable to connect to the server. Please check your internet connection.",
    severity: "error",
    retryable: true,
  },
  "timeout_error": {
    title: "Request Timeout",
    message: "The request took too long. Please try again.",
    severity: "warning",
    retryable: true,
  },
  "server_error": {
    title: "Server Error",
    message: "Something went wrong on our end. Please try again later.",
    severity: "error",
    retryable: true,
  },
  "service_unavailable": {
    title: "Service Unavailable",
    message: "The service is temporarily unavailable. Please try again later.",
    severity: "warning",
    retryable: true,
  },

  // Rate Limiting
  "rate_limited": {
    title: "Too Many Requests",
    message: "You've made too many requests. Please wait before trying again.",
    severity: "warning",
    retryable: true,
  },

  // Validation Errors
  "validation_error": {
    title: "Invalid Input",
    message: "Please check your input and try again.",
    severity: "warning",
    retryable: true,
  },

  // Referral Errors
  "invalid_referral_code": {
    title: "Invalid Referral Code",
    message: "The referral code you entered is invalid or expired.",
    severity: "warning",
    retryable: true,
  },

  // Generic Fallback
  "unknown_error": {
    title: "Something Went Wrong",
    message: "An unexpected error occurred. Please try again.",
    severity: "error",
    retryable: true,
  },
};

// =============================================================================
// HTTP Status Code Mappings
// =============================================================================

const HTTP_STATUS_ERRORS: Record<number, string> = {
  400: "validation_error",
  401: "auth_unauthorized",
  403: "auth_forbidden",
  404: "not_found",
  408: "timeout_error",
  409: "conflict",
  422: "validation_error",
  429: "rate_limited",
  500: "server_error",
  502: "service_unavailable",
  503: "service_unavailable",
  504: "timeout_error",
};

// =============================================================================
// Error Parsing Functions
// =============================================================================

function parseValidationErrors(detail: Array<{ loc: string[]; msg: string; type: string }>): string {
  if (!Array.isArray(detail) || detail.length === 0) {
    return "Please check your input and try again.";
  }

  const errors = detail.map((err) => {
    const field = err.loc[err.loc.length - 1];
    const fieldName = field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return `${fieldName}: ${err.msg}`;
  });

  return errors.length === 1 ? errors[0] : `Please fix the following:\n${errors.join("\n")}`;
}

function extractErrorCode(response: ApiErrorResponse | undefined, status: number): string {
  if (response?.error_code) return response.error_code;
  if (response?.error_type) return response.error_type;

  const message = (response?.message || response?.detail || "").toString().toLowerCase();

  // Auth patterns
  if (message.includes("invalid credentials") || message.includes("incorrect password")) {
    return "auth_invalid_credentials";
  }
  if (message.includes("token") && (message.includes("expired") || message.includes("invalid"))) {
    return "auth_token_expired";
  }

  // API Key patterns
  if (message.includes("api key") && message.includes("invalid")) {
    return "invalid_api_key";
  }
  if (message.includes("api key") && message.includes("exist")) {
    return "api_key_exists";
  }

  // Balance patterns
  if (message.includes("insufficient") && message.includes("balance")) {
    return "insufficient_balance";
  }

  // Subscription patterns
  if (message.includes("subscription") && message.includes("expired")) {
    return "subscription_expired";
  }
  if (message.includes("subscription") && message.includes("required")) {
    return "subscription_required";
  }

  // Referral patterns
  if (message.includes("referral") && message.includes("invalid")) {
    return "invalid_referral_code";
  }

  // Binance patterns
  if (message.includes("binance") || message.includes("exchange")) {
    return "binance_api_error";
  }

  return HTTP_STATUS_ERRORS[status] || "unknown_error";
}

/**
 * Main error parsing function
 */
export function parseError(error: unknown): ParsedError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const status = axiosError.response?.status || 0;
    const responseData = axiosError.response?.data;

    // Network errors
    if (!axiosError.response) {
      if (axiosError.code === "ECONNABORTED" || axiosError.message.includes("timeout")) {
        return getErrorByCode("timeout_error");
      }
      return getErrorByCode("network_error");
    }

    // Validation errors (422)
    if (status === 422 && responseData && Array.isArray(responseData.detail)) {
      const validationMessage = parseValidationErrors(responseData.detail as Array<{ loc: string[]; msg: string; type: string }>);
      return {
        ...ERROR_MESSAGES["validation_error"],
        message: validationMessage,
        code: "validation_error",
        details: validationMessage,
      };
    }

    const errorCode = extractErrorCode(responseData, status);
    const errorConfig = ERROR_MESSAGES[errorCode] || ERROR_MESSAGES["unknown_error"];

    let message = errorConfig.message;
    if (responseData?.message && responseData.message !== "Request failed") {
      message = responseData.message;
    } else if (typeof responseData?.detail === "string" && responseData.detail.length < 200) {
      message = responseData.detail;
    }

    return {
      ...errorConfig,
      message,
      code: errorCode,
      actionRequired: responseData?.action_required,
      details: typeof responseData?.detail === "string" ? responseData.detail : undefined,
    };
  }

  if (error instanceof Error) {
    if (error.message.includes("Network Error") || error.message.includes("Failed to fetch")) {
      return getErrorByCode("network_error");
    }
    if (error.message.includes("timeout")) {
      return getErrorByCode("timeout_error");
    }

    return {
      ...ERROR_MESSAGES["unknown_error"],
      message: error.message,
      code: "unknown_error",
    };
  }

  if (typeof error === "string") {
    return {
      ...ERROR_MESSAGES["unknown_error"],
      message: error,
      code: "unknown_error",
    };
  }

  return getErrorByCode("unknown_error");
}

export function getErrorByCode(code: string): ParsedError {
  const config = ERROR_MESSAGES[code] || ERROR_MESSAGES["unknown_error"];
  return {
    ...config,
    code,
  };
}

export function getErrorMessage(error: unknown): string {
  return parseError(error).message;
}

export function getUserFriendlyError(error: unknown): string {
  return parseError(error).message;
}

export function formatErrorForToast(error: unknown): {
  type: "error" | "warning" | "info";
  message: string;
  title?: string;
} {
  const parsed = parseError(error);
  return {
    type: parsed.severity === "critical" ? "error" : parsed.severity === "warning" ? "warning" : "error",
    message: parsed.message,
    title: parsed.title,
  };
}

export function isRetryableError(error: unknown): boolean {
  return parseError(error).retryable;
}

export function requiresReAuth(error: unknown): boolean {
  const code = parseError(error).code;
  return ["auth_token_expired", "auth_token_invalid", "auth_unauthorized"].includes(code);
}

export function logError(error: unknown, context?: string): void {
  if (process.env.NODE_ENV === "development") {
    const parsed = parseError(error);
    console.group(`[Error${context ? `: ${context}` : ""}]`);
    console.error("Code:", parsed.code);
    console.error("Message:", parsed.message);
    console.error("Severity:", parsed.severity);
    console.error("Raw Error:", error);
    console.groupEnd();
  }
}

const errorHandler = {
  parseError,
  getErrorMessage,
  getUserFriendlyError,
  formatErrorForToast,
  isRetryableError,
  requiresReAuth,
  logError,
  getErrorByCode,
};

export default errorHandler;
