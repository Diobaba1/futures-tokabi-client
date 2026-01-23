// ============================================================================
// FILE: src/components/common/UpgradePrompt.tsx
// ============================================================================
/**
 * UpgradePrompt Component
 *
 * A reusable component that displays subscription upgrade prompts when users
 * attempt to access features that require a subscription or higher tier.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Lock, Crown, ArrowRight } from 'lucide-react';
import {
  SubscriptionErrorCode,
  SUBSCRIPTION_ERROR_MESSAGES,
  SubscriptionTier,
} from '../../types/billings.types';
import {
  getSubscriptionCTA,
  onSubscriptionError,
  SubscriptionErrorEvent,
} from '../../utils/subscriptionErrorHandler';

// ============================================================================
// TYPES
// ============================================================================

interface UpgradePromptProps {
  /** Error code from the backend */
  errorCode?: SubscriptionErrorCode;
  /** Custom message to display (overrides default message) */
  message?: string;
  /** Feature name that requires upgrade */
  feature?: string;
  /** Required tier for the feature */
  requiredTier?: SubscriptionTier | string;
  /** Current user's tier */
  currentTier?: SubscriptionTier | string;
  /** Custom URL to redirect to (defaults to /pricing) */
  upgradeUrl?: string;
  /** Whether to show as a full-page prompt or inline */
  variant?: 'page' | 'inline' | 'modal';
  /** Callback when user clicks the CTA */
  onUpgradeClick?: () => void;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  errorCode = SubscriptionErrorCode.NO_SUBSCRIPTION,
  message,
  feature,
  requiredTier,
  currentTier,
  upgradeUrl = '/pricing',
  variant = 'inline',
  onUpgradeClick,
  className = '',
}) => {
  const navigate = useNavigate();
  const cta = getSubscriptionCTA(errorCode);

  const displayMessage =
    message ||
    SUBSCRIPTION_ERROR_MESSAGES[errorCode] ||
    'A subscription is required to access this feature.';

  const handleUpgradeClick = () => {
    if (onUpgradeClick) {
      onUpgradeClick();
    } else {
      navigate(upgradeUrl);
    }
  };

  // Get icon based on error type
  const getIcon = () => {
    switch (errorCode) {
      case SubscriptionErrorCode.TIER_INSUFFICIENT:
      case SubscriptionErrorCode.FEATURE_NOT_AVAILABLE:
        return <Crown className="h-8 w-8 text-yellow-500" />;
      case SubscriptionErrorCode.NO_SUBSCRIPTION:
      case SubscriptionErrorCode.SUBSCRIPTION_EXPIRED:
      case SubscriptionErrorCode.TRIAL_EXPIRED:
        return <Lock className="h-8 w-8 text-blue-500" />;
      default:
        return <AlertCircle className="h-8 w-8 text-orange-500" />;
    }
  };

  // Get background color based on variant
  const getBgClass = () => {
    if (variant === 'page') {
      return 'bg-slate-900 min-h-[60vh] flex items-center justify-center';
    }
    return 'bg-slate-800/50 border border-slate-700';
  };

  // Inline variant (compact)
  if (variant === 'inline') {
    return (
      <div
        className={`rounded-lg p-4 ${getBgClass()} ${className}`}
        role="alert"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">{getIcon()}</div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white mb-1">
              {errorCode === SubscriptionErrorCode.TIER_INSUFFICIENT
                ? 'Upgrade Required'
                : 'Subscription Required'}
            </h3>
            <p className="text-slate-300 text-sm mb-3">{displayMessage}</p>
            {feature && (
              <p className="text-slate-400 text-xs mb-3">
                Feature: <span className="text-slate-300">{feature}</span>
                {requiredTier && (
                  <>
                    {' '}
                    · Required:{' '}
                    <span className="text-yellow-400 capitalize">
                      {requiredTier}
                    </span>
                  </>
                )}
                {currentTier && (
                  <>
                    {' '}
                    · Current:{' '}
                    <span className="text-slate-300 capitalize">
                      {currentTier}
                    </span>
                  </>
                )}
              </p>
            )}
            <button
              onClick={handleUpgradeClick}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all"
            >
              {cta.text}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Page variant (full-page centered)
  return (
    <div className={`${getBgClass()} ${className}`}>
      <div className="text-center max-w-md mx-auto px-6 py-12">
        <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 border border-slate-700">
          {getIcon()}
        </div>

        <h2 className="text-2xl font-bold text-white mb-3">
          {errorCode === SubscriptionErrorCode.TIER_INSUFFICIENT
            ? 'Upgrade Your Plan'
            : 'Subscription Required'}
        </h2>

        <p className="text-slate-300 mb-4">{displayMessage}</p>

        {feature && (
          <div className="bg-slate-800 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-slate-400 mb-2">Feature Access</p>
            <div className="flex items-center justify-between">
              <span className="text-white capitalize">{feature}</span>
              {requiredTier && (
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full capitalize">
                  {requiredTier}+ required
                </span>
              )}
            </div>
            {currentTier && (
              <p className="text-xs text-slate-500 mt-2">
                Your current plan:{' '}
                <span className="text-slate-400 capitalize">{currentTier}</span>
              </p>
            )}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleUpgradeClick}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all"
          >
            {cta.text}
            <ArrowRight className="h-5 w-5" />
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full px-6 py-3 text-slate-400 hover:text-white text-sm transition-colors"
          >
            Go Back
          </button>
        </div>

        <p className="text-xs text-slate-500 mt-6">
          Unlock premium features with our subscription plans. Cancel anytime.
        </p>
      </div>
    </div>
  );
};

export default UpgradePrompt;

// ============================================================================
// HOOK FOR GLOBAL SUBSCRIPTION ERROR HANDLING
// ============================================================================

/**
 * Hook to listen for subscription errors globally
 */
export function useSubscriptionError() {
  const [subscriptionError, setSubscriptionError] = useState<{
    errorCode: SubscriptionErrorCode;
    message: string;
    requiredTier?: string;
    currentTier?: string;
    feature?: string;
    upgradeUrl: string;
  } | null>(null);

  useEffect(() => {
    const unsubscribe = onSubscriptionError((event: SubscriptionErrorEvent) => {
      setSubscriptionError(event.detail);
    });

    return unsubscribe;
  }, []);

  const clearError = () => setSubscriptionError(null);

  return { subscriptionError, clearError };
}
