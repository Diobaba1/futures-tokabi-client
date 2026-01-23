// ============================================================================
// FILE: src/utils/subscriptionErrorHandler.ts
// ============================================================================
/**
 * Subscription Error Handler
 *
 * Utility for handling subscription-related errors across the application.
 * Provides event-based notifications for subscription errors.
 */

import {
  SubscriptionErrorCode,
  SubscriptionErrorResponse,
  SUBSCRIPTION_ERROR_MESSAGES,
  isSubscriptionError,
} from '../types/billings.types';

// ============================================================================
// SUBSCRIPTION ERROR EVENT
// ============================================================================

export type SubscriptionErrorEvent = CustomEvent<{
  errorCode: SubscriptionErrorCode;
  message: string;
  requiredTier?: string;
  currentTier?: string;
  feature?: string;
  upgradeUrl: string;
}>;

/**
 * Event name for subscription errors
 */
export const SUBSCRIPTION_ERROR_EVENT = 'subscription-error';

/**
 * Dispatch a subscription error event
 */
export function dispatchSubscriptionError(error: SubscriptionErrorResponse): void {
  const event = new CustomEvent(SUBSCRIPTION_ERROR_EVENT, {
    detail: {
      errorCode: error.error_code,
      message: error.message || SUBSCRIPTION_ERROR_MESSAGES[error.error_code],
      requiredTier: error.required_tier,
      currentTier: error.current_tier,
      feature: error.feature,
      upgradeUrl: error.upgrade_url || '/pricing',
    },
  });
  window.dispatchEvent(event);
}

/**
 * Subscribe to subscription error events
 */
export function onSubscriptionError(
  callback: (event: SubscriptionErrorEvent) => void
): () => void {
  const handler = (event: Event) => callback(event as SubscriptionErrorEvent);
  window.addEventListener(SUBSCRIPTION_ERROR_EVENT, handler);
  return () => window.removeEventListener(SUBSCRIPTION_ERROR_EVENT, handler);
}

// ============================================================================
// ERROR PROCESSING
// ============================================================================

/**
 * Process an API error and check if it's a subscription error
 * Returns true if it was a subscription error and was handled
 */
export function handleSubscriptionError(error: unknown): boolean {
  if (isSubscriptionError(error)) {
    const errorData = error.response.data;
    dispatchSubscriptionError(errorData);
    return true;
  }
  return false;
}

/**
 * Get user-friendly message for a subscription error code
 */
export function getSubscriptionErrorMessage(errorCode: SubscriptionErrorCode): string {
  return SUBSCRIPTION_ERROR_MESSAGES[errorCode] || 'A subscription error occurred.';
}

/**
 * Check if user should be redirected to pricing page
 */
export function shouldRedirectToPricing(errorCode: SubscriptionErrorCode): boolean {
  return [
    SubscriptionErrorCode.NO_SUBSCRIPTION,
    SubscriptionErrorCode.SUBSCRIPTION_EXPIRED,
    SubscriptionErrorCode.TIER_INSUFFICIENT,
    SubscriptionErrorCode.FEATURE_NOT_AVAILABLE,
    SubscriptionErrorCode.TRIAL_EXPIRED,
  ].includes(errorCode);
}

/**
 * Get call-to-action text based on error code
 */
export function getSubscriptionCTA(errorCode: SubscriptionErrorCode): {
  text: string;
  variant: 'subscribe' | 'upgrade' | 'renew' | 'contact';
} {
  switch (errorCode) {
    case SubscriptionErrorCode.NO_SUBSCRIPTION:
    case SubscriptionErrorCode.TRIAL_EXPIRED:
      return { text: 'Subscribe Now', variant: 'subscribe' };
    case SubscriptionErrorCode.TIER_INSUFFICIENT:
    case SubscriptionErrorCode.FEATURE_NOT_AVAILABLE:
    case SubscriptionErrorCode.RATE_LIMIT_EXCEEDED:
      return { text: 'Upgrade Plan', variant: 'upgrade' };
    case SubscriptionErrorCode.SUBSCRIPTION_EXPIRED:
    case SubscriptionErrorCode.SUBSCRIPTION_CANCELLED:
    case SubscriptionErrorCode.SUBSCRIPTION_PAST_DUE:
      return { text: 'Renew Subscription', variant: 'renew' };
    case SubscriptionErrorCode.SUBSCRIPTION_SUSPENDED:
      return { text: 'Contact Support', variant: 'contact' };
    default:
      return { text: 'View Plans', variant: 'subscribe' };
  }
}
