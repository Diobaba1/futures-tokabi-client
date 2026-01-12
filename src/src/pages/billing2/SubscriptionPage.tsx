// ============================================================================
// FILE: src/pages/billing/SubscriptionPage.tsx
// ============================================================================

/**
 * Subscription Management Page
 * 
 * Displays current subscription details and management options.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  ArrowUpRight,
  Loader2,
  Shield,
  Zap,
} from 'lucide-react';
import {
  useCurrentSubscription,
  useCancelSubscription,
  useRenewSubscription,
  usePlans,
} from '../../components/hooks/useBilling';
import { SubscriptionStatus } from '../../types/billings.types';

// Status badge component
const StatusBadge: React.FC<{ status: SubscriptionStatus }> = ({ status }) => {
  const config: Record<SubscriptionStatus, { color: string; icon: React.ReactNode; label: string }> = {
    [SubscriptionStatus.ACTIVE]: {
      color: 'bg-green-500/20 text-green-400 border-green-500/30',
      icon: <CheckCircle className="w-4 h-4" />,
      label: 'Active',
    },
    [SubscriptionStatus.TRIAL]: {
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      icon: <Zap className="w-4 h-4" />,
      label: 'Trial',
    },
    [SubscriptionStatus.PENDING]: {
      color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      icon: <Clock className="w-4 h-4" />,
      label: 'Pending',
    },
    [SubscriptionStatus.PAST_DUE]: {
      color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      icon: <AlertTriangle className="w-4 h-4" />,
      label: 'Past Due',
    },
    [SubscriptionStatus.CANCELLED]: {
      color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      icon: <XCircle className="w-4 h-4" />,
      label: 'Cancelled',
    },
    [SubscriptionStatus.EXPIRED]: {
      color: 'bg-red-500/20 text-red-400 border-red-500/30',
      icon: <XCircle className="w-4 h-4" />,
      label: 'Expired',
    },
    [SubscriptionStatus.SUSPENDED]: {
      color: 'bg-red-500/20 text-red-400 border-red-500/30',
      icon: <Shield className="w-4 h-4" />,
      label: 'Suspended',
    },
  };

  const { color, icon, label } = config[status] || config[SubscriptionStatus.PENDING];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${color}`}>
      {icon}
      {label}
    </span>
  );
};

// Cancel Modal
interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string, immediate?: boolean) => void;
  isLoading: boolean;
  endDate?: string;
}

const CancelModal: React.FC<CancelModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  endDate,
}) => {
  const [reason, setReason] = useState('');
  const [immediate, setImmediate] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 max-w-md w-full">
        <h3 className="text-xl font-bold text-white mb-4">
          Cancel Subscription
        </h3>
        
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-400 font-medium">Are you sure?</p>
              <p className="text-sm text-gray-400 mt-1">
                {immediate
                  ? "Your access will be terminated immediately."
                  : `You'll keep access until ${endDate ? new Date(endDate).toLocaleDateString() : 'the end of your billing period'}.`}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">
            Reason for cancellation (optional)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Help us improve by sharing your feedback..."
            rows={3}
          />
        </div>

        <label className="flex items-center gap-2 mb-6 cursor-pointer">
          <input
            type="checkbox"
            checked={immediate}
            onChange={(e) => setImmediate(e.target.checked)}
            className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500"
          />
          <span className="text-sm text-gray-300">Cancel immediately (lose remaining access)</span>
        </label>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Keep Subscription
          </button>
          <button
            onClick={() => onConfirm(reason, immediate)}
            disabled={isLoading}
            className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Cancelling...
              </>
            ) : (
              'Cancel Subscription'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const SubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const { data: subscription, isLoading, refetch } = useCurrentSubscription();
  const { data: plans } = usePlans();
  const cancelSubscription = useCancelSubscription();
  const renewSubscription = useRenewSubscription();

  const handleCancel = async (reason?: string, immediate?: boolean) => {
    if (!subscription) return;

    await cancelSubscription.mutateAsync({
      subscriptionId: subscription.id,
      data: { reason, immediate },
    });

    setShowCancelModal(false);
    refetch();
  };

  const handleRenew = async () => {
    if (!subscription) return;
    await renewSubscription.mutateAsync({
      subscriptionId: subscription.id,
    });
  };

  // Calculate days remaining
  const daysRemaining = subscription?.end_date
    ? Math.max(0, Math.ceil((new Date(subscription.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
      </div>
    );
  }

  // No subscription
  if (!subscription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <CreditCard className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            No Active Subscription
          </h1>
          <p className="text-gray-400 mb-8">
            You don't have an active subscription. Subscribe to a plan to unlock premium features.
          </p>
          <button
            onClick={() => navigate('/pricing')}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-all"
          >
            View Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">My Subscription</h1>
          <StatusBadge status={subscription.status as SubscriptionStatus} />
        </div>

        {/* Main Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 mb-6">
          {/* Plan Info */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {subscription.plan?.name || 'Unknown Plan'}
              </h2>
              <p className="text-gray-400">
                {subscription.plan?.description}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-white">
                ${subscription.plan?.price_amount?.toFixed(2)}
              </p>
              <p className="text-gray-400 text-sm">
                per {subscription.plan?.interval_days === 30 ? 'month' : `${subscription.plan?.interval_days} days`}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                <Calendar className="w-4 h-4" />
                Start Date
              </div>
              <p className="text-white font-medium">
                {subscription.start_date
                  ? new Date(subscription.start_date).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                <Clock className="w-4 h-4" />
                Days Remaining
              </div>
              <p className={`font-medium ${daysRemaining <= 7 ? 'text-yellow-400' : 'text-white'}`}>
                {daysRemaining} days
              </p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                <RefreshCw className="w-4 h-4" />
                Next Billing
              </div>
              <p className="text-white font-medium">
                {subscription.next_payment_date
                  ? new Date(subscription.next_payment_date).toLocaleDateString()
                  : subscription.cancel_at_period_end
                  ? 'Cancelling'
                  : 'N/A'}
              </p>
            </div>
          </div>

          {/* Cancellation Notice */}
          {subscription.cancel_at_period_end && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <p className="text-yellow-400">
                  Your subscription will end on{' '}
                  {subscription.end_date
                    ? new Date(subscription.end_date).toLocaleDateString()
                    : 'the end of your billing period'}
                  . You'll continue to have access until then.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {subscription.status === 'active' && !subscription.cancel_at_period_end && (
              <>
                <button
                  onClick={() => navigate('/pricing')}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  Upgrade Plan
                </button>
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel Subscription
                </button>
              </>
            )}

            {(subscription.status === 'expired' || subscription.status === 'cancelled') && (
              <button
                onClick={() => navigate('/pricing')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-lg transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Resubscribe
              </button>
            )}

            {subscription.status === 'past_due' && (
              <button
                onClick={handleRenew}
                disabled={renewSubscription.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
              >
                {renewSubscription.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CreditCard className="w-4 h-4" />
                )}
                Pay Now
              </button>
            )}
          </div>
        </div>

        {/* Features Card */}
        {subscription.plan?.features?.features_list && (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Plan Features
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {subscription.plan.features.features_list.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <button
            onClick={() => navigate('/billing/payments')}
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            View Payment History →
          </button>
          <button
            onClick={() => navigate('/billing/invoices')}
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            View Invoices →
          </button>
        </div>
      </div>

      {/* Cancel Modal */}
      <CancelModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancel}
        isLoading={cancelSubscription.isPending}
        endDate={subscription.end_date}
      />
    </div>
  );
};

export default SubscriptionPage;
