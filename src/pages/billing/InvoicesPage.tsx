// ============================================================================
// FILE: src/pages/billing/InvoicesPage.tsx
// ============================================================================

/**
 * Invoices Page
 * 
 * Displays invoice history with payment options.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Calendar,
} from 'lucide-react';
import { useInvoices, usePayInvoice } from '../../components/hooks/useBilling';
import { InvoiceStatus, type Invoice } from '../../types/billings.types';

// Supported crypto currencies for payment
const SUPPORTED_CURRENCIES = [
  { code: 'btc', name: 'Bitcoin' },
  { code: 'eth', name: 'Ethereum' },
  { code: 'usdttrc20', name: 'USDT (TRC20)' },
  { code: 'usdterc20', name: 'USDT (ERC20)' },
  { code: 'ltc', name: 'Litecoin' },
  { code: 'bnbbsc', name: 'BNB (BSC)' },
  { code: 'trx', name: 'TRON' },
  { code: 'sol', name: 'Solana' },
];

// Invoice status config
const statusConfig: Record<InvoiceStatus, { color: string; icon: React.ReactNode; label: string }> = {
  [InvoiceStatus.DRAFT]: {
    color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    icon: <FileText className="w-4 h-4" />,
    label: 'Draft',
  },
  [InvoiceStatus.PENDING]: {
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    icon: <Clock className="w-4 h-4" />,
    label: 'Pending',
  },
  [InvoiceStatus.PAID]: {
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
    icon: <CheckCircle className="w-4 h-4" />,
    label: 'Paid',
  },
  [InvoiceStatus.PARTIALLY_PAID]: {
    color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    icon: <AlertTriangle className="w-4 h-4" />,
    label: 'Partial',
  },
  [InvoiceStatus.OVERDUE]: {
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    icon: <AlertTriangle className="w-4 h-4" />,
    label: 'Overdue',
  },
  [InvoiceStatus.CANCELLED]: {
    color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    icon: <XCircle className="w-4 h-4" />,
    label: 'Cancelled',
  },
  [InvoiceStatus.REFUNDED]: {
    color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    icon: <CreditCard className="w-4 h-4" />,
    label: 'Refunded',
  },
};

// Status Badge Component
const InvoiceStatusBadge: React.FC<{ status: InvoiceStatus }> = ({ status }) => {
  const config = statusConfig[status] || statusConfig[InvoiceStatus.PENDING];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
      {config.icon}
      {config.label}
    </span>
  );
};

// Invoice Card Component
interface InvoiceCardProps {
  invoice: Invoice;
  onPay: () => void;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice, onPay }) => {
  const isPending = invoice.status === 'pending' || invoice.status === 'overdue';
  const isOverdue = invoice.status === 'overdue';

  return (
    <div className={`bg-dark-elevated border rounded-xl p-5 transition-all hover:border-dark-border ${
      isOverdue ? 'border-red-500/50' : 'border-dark-border'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-white font-semibold">{invoice.invoice_number}</h3>
            <InvoiceStatusBadge status={invoice.status as InvoiceStatus} />
          </div>
          <p className="text-gray-400 text-sm mt-1">
            {invoice.description || 'Subscription Invoice'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">
            ${invoice.total_amount?.toFixed(2) || '0.00'}
          </p>
          <p className="text-gray-400 text-xs uppercase">
            {invoice.currency || 'USD'}
          </p>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="text-gray-500">Created</p>
          <p className="text-gray-300">
            {invoice.created_at ? new Date(invoice.created_at).toLocaleDateString() : 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Due Date</p>
          <p className={isOverdue ? 'text-red-400' : 'text-gray-300'}>
            {invoice.due_date
              ? new Date(invoice.due_date).toLocaleDateString()
              : 'N/A'}
          </p>
        </div>
        {invoice.period_start && invoice.period_end && (
          <>
            <div>
              <p className="text-gray-500">Period Start</p>
              <p className="text-gray-300">
                {new Date(invoice.period_start).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Period End</p>
              <p className="text-gray-300">
                {new Date(invoice.period_end).toLocaleDateString()}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Amount Breakdown */}
      {((invoice.discount_amount && invoice.discount_amount > 0) || (invoice.tax_amount && invoice.tax_amount > 0)) && (
        <div className="border-t border-dark-border pt-3 mb-4 space-y-1 text-sm">
          <div className="flex justify-between text-gray-400">
            <span>Subtotal</span>
            <span>${invoice.subtotal?.toFixed(2) || '0.00'}</span>
          </div>
          {invoice.discount_amount && invoice.discount_amount > 0 && (
            <div className="flex justify-between text-green-400">
              <span>Discount</span>
              <span>-${invoice.discount_amount.toFixed(2)}</span>
            </div>
          )}
          {invoice.tax_amount && invoice.tax_amount > 0 && (
            <div className="flex justify-between text-gray-400">
              <span>Tax</span>
              <span>${invoice.tax_amount.toFixed(2)}</span>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {isPending && (
          <button
            onClick={onPay}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 text-white rounded-lg transition-colors text-sm ${
              isOverdue
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Pay Now
          </button>
        )}
        {!isPending && (
          <div className="flex-1 flex items-center justify-center py-2 px-4 text-gray-500 text-sm">
            {invoice.status === 'paid' ? 'Payment Complete' : invoice.status}
          </div>
        )}
      </div>
    </div>
  );
};

// Pay Invoice Modal
interface PayInvoiceModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  onPay: (currency: string) => void;
  isLoading: boolean;
}

const PayInvoiceModal: React.FC<PayInvoiceModalProps> = ({
  invoice,
  isOpen,
  onClose,
  onPay,
  isLoading,
}) => {
  if (!isOpen || !invoice) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-dark-elevated border border-dark-border rounded-2xl p-6 max-w-md w-full">
        <h3 className="text-xl font-bold text-white mb-2">
          Pay Invoice {invoice.invoice_number}
        </h3>
        <p className="text-gray-400 text-sm mb-6">
          Select your preferred cryptocurrency to pay ${invoice.total_amount?.toFixed(2) || '0.00'}
        </p>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {SUPPORTED_CURRENCIES.map((currency) => (
              <button
                key={currency.code}
                onClick={() => onPay(currency.code)}
                className="flex items-center gap-3 p-3 bg-dark-surface/50 hover:bg-dark-surface border border-dark-border rounded-lg transition-all"
              >
                <div className="text-left">
                  <p className="text-white font-medium">{currency.code.toUpperCase()}</p>
                  <p className="text-gray-400 text-xs">{currency.name}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2 text-gray-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const InvoicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const pageSize = 9;
  const { data, isLoading } = useInvoices({
    page,
    page_size: pageSize,
    status: statusFilter as InvoiceStatus || undefined,
  });
  const payInvoice = usePayInvoice();

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  const handlePay = async (currency: string) => {
    if (!selectedInvoice) return;
    await payInvoice.mutateAsync({
      invoiceId: selectedInvoice.id,
      payCurrency: currency,
    });
    setSelectedInvoice(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Invoices</h1>
            <p className="text-gray-400 mt-1">
              View and pay your billing invoices
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard/billing')}
            className="text-purple-400 hover:text-purple-300 text-sm"
          >
            ← Back to Billing
          </button>
        </div>

        {/* Filters */}
        <div className="bg-dark-elevated border border-dark-border rounded-xl p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Filter by status:</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Invoices Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        ) : !data?.invoices?.length ? (
          <div className="bg-dark-elevated border border-dark-border rounded-xl p-20 text-center">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No invoices found</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {data.invoices.map((invoice) => (
                <InvoiceCard
                  key={invoice.id}
                  invoice={invoice}
                  onPay={() => setSelectedInvoice(invoice)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">
                  Showing {(page - 1) * pageSize + 1} to{' '}
                  {Math.min(page * pageSize, data.total)} of {data.total} invoices
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

      {/* Pay Invoice Modal */}
      <PayInvoiceModal
        invoice={selectedInvoice}
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        onPay={handlePay}
        isLoading={payInvoice.isPending}
      />
    </div>
  );
};

export default InvoicesPage;
