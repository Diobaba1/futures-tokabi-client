// ============================================================================
// FILE: src/pages/billing/BillingDashboard.tsx
// ============================================================================

/**
 * Billing Dashboard
 * 
 * Overview page showing subscription status, recent payments, and quick actions.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  FileText,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Loader2,
  DollarSign,
  Zap,
} from 'lucide-react';
import { useBillingDashboard } from '../../components/hooks/useBilling';
import { SubscriptionStatus, PaymentStatus } from '../../types/billings.types';

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  onClick,
}) => (
  <div
    onClick={onClick}
    className={`bg-dark-elevated border border-dark-border rounded-xl p-5 ${
      onClick ? 'cursor-pointer hover:border-gray-600 transition-colors' : ''
    }`}
  >
    <div className="flex items-start justify-between mb-3">
      <div className="p-2 bg-dark-border/50 rounded-lg text-purple-400">
        {icon}
      </div>
      {trend && (
        <TrendingUp
          className={`w-4 h-4 ${
            trend === 'up'
              ? 'text-green-400'
              : trend === 'down'
              ? 'text-red-400 rotate-180'
              : 'text-gray-400'
          }`}
        />
      )}
    </div>
    <p className="text-gray-400 text-sm mb-1">{title}</p>
    <p className="text-2xl font-bold text-white">{value}</p>
    {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
  </div>
);

// Recent Payment Row
interface RecentPaymentProps {
  payment: {
    id: string;
    price_amount: number;
    price_currency: string;
    status: string;
    created_at: string;
  };
}

const RecentPayment: React.FC<RecentPaymentProps> = ({ payment }) => {
  const isSuccess = payment.status === 'finished' || payment.status === 'confirmed';
  const isPending = payment.status === 'waiting' || payment.status === 'confirming';

  return (
    <div className="flex items-center justify-between py-3 border-b border-dark-border last:border-0">
      <div className="flex items-center gap-3">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isSuccess
              ? 'bg-green-500/20 text-green-400'
              : isPending
              ? 'bg-yellow-500/20 text-yellow-400'
              : 'bg-red-500/20 text-red-400'
          }`}
        >
          {isSuccess ? (
            <CheckCircle className="w-4 h-4" />
          ) : isPending ? (
            <Clock className="w-4 h-4" />
          ) : (
            <AlertTriangle className="w-4 h-4" />
          )}
        </div>
        <div>
          <p className="text-white text-sm font-medium">
            ${payment.price_amount.toFixed(2)}
          </p>
          <p className="text-gray-500 text-xs">
            {new Date(payment.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
      <span
        className={`text-xs px-2 py-1 rounded-full ${
          isSuccess
            ? 'bg-green-500/20 text-green-400'
            : isPending
            ? 'bg-yellow-500/20 text-yellow-400'
            : 'bg-red-500/20 text-red-400'
        }`}
      >
        {isSuccess ? 'Paid' : isPending ? 'Pending' : 'Failed'}
      </span>
    </div>
  );
};

// Recent Invoice Row
interface RecentInvoiceProps {
  invoice: {
    id: string;
    invoice_number: string;
    total_amount: number;
    status: string;
    created_at: string;
  };
  onClick: () => void;
}

const RecentInvoice: React.FC<RecentInvoiceProps> = ({ invoice, onClick }) => {
  const isPaid = invoice.status === 'paid';
  const isOverdue = invoice.status === 'overdue';

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between py-3 border-b border-dark-border last:border-0 cursor-pointer hover:bg-dark-surface/20 -mx-2 px-2 rounded transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-dark-surface flex items-center justify-center text-gray-400">
          <FileText className="w-4 h-4" />
        </div>
        <div>
          <p className="text-white text-sm font-medium">{invoice.invoice_number}</p>
          <p className="text-gray-500 text-xs">
            {new Date(invoice.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-white text-sm">${invoice.total_amount.toFixed(2)}</p>
        <span
          className={`text-xs ${
            isPaid
              ? 'text-green-400'
              : isOverdue
              ? 'text-red-400'
              : 'text-yellow-400'
          }`}
        >
          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
        </span>
      </div>
    </div>
  );
};

const BillingDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    subscription,
    stats,
    recentPayments,
    recentInvoices,
    isLoading,
  } = useBillingDashboard();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
      </div>
    );
  }

  const hasSubscription = subscription.data?.status === 'active' || subscription.data?.status === 'trial';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Billing Overview</h1>
            <p className="text-gray-400 mt-1">
              Manage your subscription and payments
            </p>
          </div>
          {!hasSubscription && (
            <button
              onClick={() => navigate('/pricing')}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
            >
              <Zap className="w-4 h-4" />
              Subscribe Now
            </button>
          )}
        </div>

        {/* Current Subscription Card */}
        {subscription.data && (
          <div
            onClick={() => navigate('/billing/subscription')}
            className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border border-purple-500/30 rounded-2xl p-6 mb-8 cursor-pointer hover:border-purple-500/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      subscription.data.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : subscription.data.status === 'trial'
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {subscription.data.status.charAt(0).toUpperCase() +
                      subscription.data.status.slice(1)}
                  </span>
                  {subscription.data.cancel_at_period_end && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
                      Cancelling
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {subscription.data.plan?.name || 'Current Plan'}
                </h2>
                <p className="text-gray-400 text-sm">
                  {subscription.data.plan?.description}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">
                  ${subscription.data.plan?.price_amount?.toFixed(2) || '0.00'}
                </p>
                <p className="text-gray-400 text-sm">per month</p>
              </div>
            </div>

            <div className="flex items-center gap-6 mt-6 pt-4 border-t border-purple-500/20">
              <div>
                <p className="text-gray-400 text-xs">Days Remaining</p>
                <p className="text-white font-semibold">
                  {stats.data?.days_remaining || 0} days
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Next Billing</p>
                <p className="text-white font-semibold">
                  {subscription.data.next_payment_date
                    ? new Date(subscription.data.next_payment_date).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
              <div className="ml-auto flex items-center gap-1 text-purple-400 text-sm">
                Manage <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Spent"
            value={`$${stats.data?.total_spent?.toFixed(2) || '0.00'}`}
            subtitle="All time"
            icon={<DollarSign className="w-5 h-5" />}
          />
          <StatCard
            title="Current Plan"
            value={stats.data?.current_plan || 'No Plan'}
            subtitle={hasSubscription ? 'Active' : 'Inactive'}
            icon={<CreditCard className="w-5 h-5" />}
            onClick={() => navigate('/billing/subscription')}
          />
          <StatCard
            title="Payments"
            value={stats.data?.payment_count || 0}
            subtitle="Total transactions"
            icon={<TrendingUp className="w-5 h-5" />}
            onClick={() => navigate('/billing/payments')}
          />
          <StatCard
            title="Invoices"
            value={stats.data?.invoice_count || 0}
            subtitle="View all"
            icon={<FileText className="w-5 h-5" />}
            onClick={() => navigate('/billing/invoices')}
          />
        </div>

        {/* Recent Activity */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Payments */}
          <div className="bg-dark-elevated border border-dark-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Recent Payments</h3>
              <button
                onClick={() => navigate('/billing/payments')}
                className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1"
              >
                View All <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {recentPayments.data?.payments?.length ? (
              <div>
                {recentPayments.data.payments.slice(0, 5).map((payment) => (
                  <RecentPayment key={payment.id} payment={payment} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No recent payments</p>
              </div>
            )}
          </div>

          {/* Recent Invoices */}
          <div className="bg-dark-elevated border border-dark-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Recent Invoices</h3>
              <button
                onClick={() => navigate('/billing/invoices')}
                className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1"
              >
                View All <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {recentInvoices.data?.invoices?.length ? (
              <div>
                {recentInvoices.data.invoices.slice(0, 5).map((invoice) => (
                  <RecentInvoice
                    key={invoice.id}
                    invoice={invoice}
                    onClick={() => navigate('/billing/invoices')}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No invoices yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-dark-elevated/30 border border-dark-border rounded-xl p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/pricing')}
              className="px-4 py-2 bg-dark-surface hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
            >
              View Plans
            </button>
            <button
              onClick={() => navigate('/billing/payments')}
              className="px-4 py-2 bg-dark-surface hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
            >
              Payment History
            </button>
            <button
              onClick={() => navigate('/billing/invoices')}
              className="px-4 py-2 bg-dark-surface hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
            >
              Download Invoices
            </button>
            <a
              href="/contact"
              className="px-4 py-2 bg-dark-surface hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingDashboard;
