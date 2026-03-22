// ============================================================================
// FILE: src/pages/billing/PaymentsPage.tsx
// ============================================================================

/**
 * Payment History Page
 * 
 * Displays payment history with status and transaction details.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { usePayments, usePaymentStatus } from '../../components/hooks/useBilling';
import { PaymentStatus, type Payment } from '../../types/billings.types';
import { sanitizeUrl } from '../../utils/urlSanitizer';

// Payment status config
const statusConfig: Record<PaymentStatus, { color: string; icon: React.ReactNode; label: string }> = {
  [PaymentStatus.WAITING]: {
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    icon: <Clock className="w-4 h-4" />,
    label: 'Waiting',
  },
  [PaymentStatus.CONFIRMING]: {
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    icon: <Clock className="w-4 h-4 animate-pulse" />,
    label: 'Confirming',
  },
  [PaymentStatus.CONFIRMED]: {
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
    icon: <CheckCircle className="w-4 h-4" />,
    label: 'Confirmed',
  },
  [PaymentStatus.SENDING]: {
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    icon: <Clock className="w-4 h-4 animate-spin" />,
    label: 'Sending',
  },
  [PaymentStatus.PARTIALLY_PAID]: {
    color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    icon: <AlertTriangle className="w-4 h-4" />,
    label: 'Partial',
  },
  [PaymentStatus.FINISHED]: {
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
    icon: <CheckCircle className="w-4 h-4" />,
    label: 'Complete',
  },
  [PaymentStatus.FAILED]: {
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    icon: <XCircle className="w-4 h-4" />,
    label: 'Failed',
  },
  [PaymentStatus.REFUNDED]: {
    color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    icon: <CreditCard className="w-4 h-4" />,
    label: 'Refunded',
  },
  [PaymentStatus.EXPIRED]: {
    color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    icon: <XCircle className="w-4 h-4" />,
    label: 'Expired',
  },
};

// Status Badge Component
const PaymentStatusBadge: React.FC<{ status: PaymentStatus }> = ({ status }) => {
  const config = statusConfig[status] || statusConfig[PaymentStatus.WAITING];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
      {config.icon}
      {config.label}
    </span>
  );
};

// Payment Row Component
interface PaymentRowProps {
  payment: Payment;
  onClick: () => void;
}

const PaymentRow: React.FC<PaymentRowProps> = ({ payment, onClick }) => {
  return (
    <tr
      onClick={onClick}
      className="border-b border-dark-border hover:bg-gray-700/30 cursor-pointer transition-colors"
    >
      <td className="px-4 py-4">
        <div className="font-mono text-sm text-gray-300">
          {payment.id.slice(0, 8)}...
        </div>
        <div className="text-xs text-gray-500">
          {new Date(payment.created_at).toLocaleString()}
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="text-white font-medium">
          ${payment.price_amount.toFixed(2)} {payment.price_currency.toUpperCase()}
        </div>
        {payment.pay_amount && (
          <div className="text-xs text-gray-400">
            {payment.pay_amount} {payment.pay_currency?.toUpperCase()}
          </div>
        )}
      </td>
      <td className="px-4 py-4">
        <PaymentStatusBadge status={payment.status as PaymentStatus} />
      </td>
      <td className="px-4 py-4">
        <div className="text-sm text-gray-400">
          {payment.order_description || 'Subscription Payment'}
        </div>
      </td>
      <td className="px-4 py-4">
        {payment.payment_url && (
          <a
            href={sanitizeUrl(payment.payment_url) || '#'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-purple-400 hover:text-purple-300"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </td>
    </tr>
  );
};

// Payment Detail Modal
interface PaymentDetailModalProps {
  payment: Payment | null;
  isOpen: boolean;
  onClose: () => void;
}

const PaymentDetailModal: React.FC<PaymentDetailModalProps> = ({
  payment,
  isOpen,
  onClose,
}) => {
  const { data: statusData } = usePaymentStatus(
    payment?.id || '',
    payment?.status === 'waiting' || payment?.status === 'confirming' ? 30000 : undefined
  );

  if (!isOpen || !payment) return null;

  const currentStatus = statusData?.status || payment.status;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-dark-elevated border border-dark-border rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Payment Details</h3>
          <PaymentStatusBadge status={currentStatus as PaymentStatus} />
        </div>

        {/* Amount */}
        <div className="bg-gray-700/50 rounded-lg p-4 mb-4 text-center">
          <p className="text-gray-400 text-sm mb-1">Amount</p>
          <p className="text-3xl font-bold text-white">
            ${payment.price_amount.toFixed(2)}
          </p>
          <p className="text-gray-400 text-sm">
            {payment.price_currency.toUpperCase()}
          </p>
        </div>

        {/* Details Grid */}
        <div className="space-y-3 mb-6">
          <DetailRow label="Payment ID" value={payment.id} mono />
          <DetailRow
            label="Created"
            value={new Date(payment.created_at).toLocaleString()}
          />
          {payment.pay_currency && (
            <DetailRow
              label="Crypto Amount"
              value={`${payment.pay_amount} ${payment.pay_currency.toUpperCase()}`}
            />
          )}
          {payment.actually_paid > 0 && (
            <DetailRow
              label="Actually Paid"
              value={`${payment.actually_paid} ${payment.pay_currency?.toUpperCase() || ''}`}
            />
          )}
          {payment.pay_address && (
            <DetailRow label="Pay Address" value={payment.pay_address} mono small />
          )}
          {payment.transaction_hash && (
            <DetailRow label="Transaction Hash" value={payment.transaction_hash} mono small />
          )}
          {payment.network && (
            <DetailRow label="Network" value={payment.network} />
          )}
          {payment.confirmed_at && (
            <DetailRow
              label="Confirmed At"
              value={new Date(payment.confirmed_at).toLocaleString()}
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {payment.payment_url && (currentStatus === 'waiting' || currentStatus === 'confirming') && (
            <a
              href={sanitizeUrl(payment.payment_url) || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-center flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View Payment Page
            </a>
          )}
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Detail Row Helper
const DetailRow: React.FC<{
  label: string;
  value: string;
  mono?: boolean;
  small?: boolean;
}> = ({ label, value, mono, small }) => (
  <div className="flex justify-between items-start">
    <span className="text-gray-400 text-sm">{label}</span>
    <span
      className={`text-white text-right max-w-[60%] break-all ${
        mono ? 'font-mono' : ''
      } ${small ? 'text-xs' : 'text-sm'}`}
    >
      {value}
    </span>
  </div>
);

const PaymentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const pageSize = 10;
  const { data, isLoading } = usePayments(page, pageSize, statusFilter || undefined);

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Payment History</h1>
            <p className="text-gray-400 mt-1">
              View all your payment transactions
            </p>
          </div>
          <button
            onClick={() => navigate('/billing/subscription')}
            className="text-purple-400 hover:text-purple-300 text-sm"
          >
            ← Back to Subscription
          </button>
        </div>

        {/* Filters */}
        <div className="bg-dark-elevated border border-dark-border rounded-xl p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400">
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filter by status:</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Statuses</option>
              <option value="finished">Completed</option>
              <option value="waiting">Waiting</option>
              <option value="confirming">Confirming</option>
              <option value="failed">Failed</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-dark-elevated border border-dark-border rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
          ) : !data?.payments?.length ? (
            <div className="text-center py-20">
              <CreditCard className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No payments found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-700/50 text-left">
                      <th className="px-4 py-3 text-sm font-medium text-gray-400">ID / Date</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-400">Amount</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-400">Status</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-400">Description</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-400">Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.payments.map((payment) => (
                      <PaymentRow
                        key={payment.id}
                        payment={payment}
                        onClick={() => setSelectedPayment(payment)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-dark-border">
                  <p className="text-sm text-gray-400">
                    Showing {(page - 1) * pageSize + 1} to{' '}
                    {Math.min(page * pageSize, data.total)} of {data.total} payments
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-gray-400 text-sm">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Payment Detail Modal */}
      <PaymentDetailModal
        payment={selectedPayment}
        isOpen={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
      />
    </div>
  );
};

export default PaymentsPage;
