// ============================================================================
// FILE: src/api/services/billingService.ts
// ============================================================================

/**
 * Billing API Service
 * 
 * Handles all billing-related API calls matching backend routes:
 * - Plans: /api/subscriptions/plans
 * - Subscriptions: /api/subscriptions/...
 * - Payments: /api/payments/...
 * - Invoices: /api/invoices/...
 */

import axiosInstance from '../axiosConfig';
import { API_ENDPOINTS, buildQueryString } from '../endpoints';
import type {
  SubscriptionPlan,
  Subscription,
  SubscriptionCreateRequest,
  SubscriptionCreateResponse,
  SubscriptionCancelRequest,
  Payment,
  PaymentStatusResponse,
  Invoice,
  InvoiceListParams,
  InvoiceListResponse,
  BillingStats,
} from '../../types/billings.types';

// ============================================================================
// PLANS SERVICE
// ============================================================================

export const planService = {
  /**
   * Get all available subscription plans
   * Backend: GET /api/subscriptions/plans
   */
  async getPlans(): Promise<SubscriptionPlan[]> {
    const response = await axiosInstance.get(API_ENDPOINTS.BILLING.PLANS.LIST);
    return response.data.items || response.data.plans || response.data;
  },

  /**
   * Get featured plans
   * Backend: GET /api/subscriptions/plans/featured
   */
  async getFeaturedPlans(): Promise<SubscriptionPlan[]> {
    const response = await axiosInstance.get(API_ENDPOINTS.BILLING.PLANS.FEATURED);
    return response.data;
  },
};

// ============================================================================
// SUBSCRIPTIONS SERVICE
// ============================================================================

export const subscriptionService = {
  /**
   * Get current user's active subscription
   * Backend: GET /api/subscriptions/me
   */
  async getCurrentSubscription(): Promise<Subscription | null> {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.BILLING.SUBSCRIPTIONS.CURRENT
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Create a new subscription
   * Backend: POST /api/subscriptions/
   */
  async createSubscription(
    data: SubscriptionCreateRequest
  ): Promise<SubscriptionCreateResponse> {
    const response = await axiosInstance.post(
      API_ENDPOINTS.BILLING.SUBSCRIPTIONS.CREATE,
      data
    );
    return response.data;
  },

  /**
   * Create subscription via email payment links
   * Backend: POST /api/subscriptions/email
   */
  async createEmailSubscription(planId: string): Promise<Subscription> {
    const response = await axiosInstance.post(
      API_ENDPOINTS.BILLING.SUBSCRIPTIONS.CREATE_EMAIL,
      null,
      { params: { plan_id: planId } }
    );
    return response.data;
  },

  /**
   * Cancel a subscription
   * Backend: POST /api/subscriptions/{id}/cancel
   */
  async cancelSubscription(
    subscriptionId: string,
    data?: SubscriptionCancelRequest
  ): Promise<Subscription> {
    const response = await axiosInstance.post(
      API_ENDPOINTS.BILLING.SUBSCRIPTIONS.CANCEL(subscriptionId),
      data || {}
    );
    return response.data;
  },

  /**
   * Renew a subscription
   * Backend: POST /api/subscriptions/{id}/renew
   */
  async renewSubscription(
    subscriptionId: string,
    payCurrency?: string
  ): Promise<SubscriptionCreateResponse> {
    const response = await axiosInstance.post(
      API_ENDPOINTS.BILLING.SUBSCRIPTIONS.RENEW(subscriptionId),
      payCurrency ? { pay_currency: payCurrency } : null
    );
    return response.data;
  },

  /**
   * Get subscription history
   * Backend: GET /api/subscriptions/history
   */
  async getSubscriptionHistory(
    page = 1,
    pageSize = 20,
    includeInactive = false
  ): Promise<{ subscriptions: Subscription[]; total: number }> {
    const params = { page, page_size: pageSize, include_inactive: includeInactive };
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.BILLING.SUBSCRIPTIONS.HISTORY}${buildQueryString(params)}`
    );
    return {
      subscriptions: response.data.items || response.data,
      total: response.data.total || response.data.length,
    };
  },
};

// ============================================================================
// PAYMENTS SERVICE
// ============================================================================

export const paymentService = {
  /**
   * Get payment history
   * Backend: GET /api/payments/
   */
  async getPayments(
    page = 1,
    pageSize = 20,
    status?: string
  ): Promise<{ payments: Payment[]; total: number }> {
    const params = { page, page_size: pageSize, status };
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.BILLING.PAYMENTS.LIST}${buildQueryString(params)}`
    );
    return {
      payments: response.data.items || response.data,
      total: response.data.total || response.data.length,
    };
  },

  /**
   * Get payment by ID
   * Backend: GET /api/payments/{id}
   */
  async getPaymentById(paymentId: string): Promise<Payment> {
    const response = await axiosInstance.get(
      API_ENDPOINTS.BILLING.PAYMENTS.DETAIL(paymentId)
    );
    return response.data;
  },

  /**
   * Check payment status
   * Backend: GET /api/payments/{id}/status
   */
  async getPaymentStatus(paymentId: string, refresh = false): Promise<PaymentStatusResponse> {
    const params = refresh ? { refresh: true } : {};
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.BILLING.PAYMENTS.STATUS(paymentId)}${buildQueryString(params)}`
    );
    return response.data;
  },

  /**
   * Create payment via invoice (redirects to NOWPayments hosted page)
   * Backend: POST /api/payments/create-invoice
   */
  async createInvoicePayment(
    amount: number,
    currency = 'usd',
    description?: string
  ): Promise<{ invoice_url: string; payment_id: string }> {
    const response = await axiosInstance.post(
      API_ENDPOINTS.BILLING.PAYMENTS.CREATE_INVOICE,
      null,
      { params: { amount, currency, description } }
    );
    return response.data;
  },
};

// ============================================================================
// INVOICES SERVICE
// ============================================================================

export const invoiceService = {
  /**
   * Get invoice list
   * Backend: GET /api/invoices/
   */
  async getInvoices(params?: InvoiceListParams): Promise<InvoiceListResponse> {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.BILLING.INVOICES.LIST}${buildQueryString(params || {})}`
    );
    return {
      invoices: response.data.items || response.data,
      total: response.data.total || response.data.length,
      page: params?.page || 1,
      page_size: params?.page_size || 20,
    };
  },

  /**
   * Get unpaid invoices
   * Backend: GET /api/invoices/unpaid
   */
  async getUnpaidInvoices(): Promise<Invoice[]> {
    const response = await axiosInstance.get(API_ENDPOINTS.BILLING.INVOICES.UNPAID);
    return response.data.items || response.data;
  },

  /**
   * Get invoice by ID
   * Backend: GET /api/invoices/{id}
   */
  async getInvoiceById(invoiceId: string): Promise<Invoice> {
    const response = await axiosInstance.get(
      API_ENDPOINTS.BILLING.INVOICES.DETAIL(invoiceId)
    );
    return response.data;
  },

  /**
   * Pay an invoice
   * Backend: POST /api/invoices/{id}/pay
   */
  async payInvoice(
    invoiceId: string,
    payCurrency: string
  ): Promise<{
    payment_id: string;
    pay_address: string;
    pay_amount: number;
    pay_currency: string;
    invoice_url?: string;
  }> {
    const response = await axiosInstance.post(
      API_ENDPOINTS.BILLING.INVOICES.PAY(invoiceId),
      { pay_currency: payCurrency }
    );
    return response.data;
  },
};

// ============================================================================
// COMBINED BILLING SERVICE
// ============================================================================

export const billingService = {
  plans: planService,
  subscriptions: subscriptionService,
  payments: paymentService,
  invoices: invoiceService,

  /**
   * Get billing overview/stats for current user
   */
  async getBillingStats(): Promise<BillingStats> {
    const [subscription, payments, invoices] = await Promise.all([
      subscriptionService.getCurrentSubscription().catch(() => null),
      paymentService.getPayments(1, 100).catch(() => ({ payments: [], total: 0 })),
      invoiceService.getInvoices({ page_size: 100 }).catch(() => ({ invoices: [], total: 0 })),
    ]);

    const totalSpent = payments.payments
      .filter((p) => p.status === 'finished' || p.status === 'confirmed')
      .reduce((sum, p) => sum + p.price_amount, 0);

    const daysRemaining = subscription?.end_date
      ? Math.max(0, Math.ceil((new Date(subscription.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
      : undefined;

    return {
      total_spent: totalSpent,
      currency: 'USD',
      active_subscription: subscription?.status === 'active' || subscription?.status === 'trial',
      current_plan: subscription?.plan?.name,
      days_remaining: daysRemaining,
      next_billing_date: subscription?.next_payment_date,
      payment_count: payments.total,
      invoice_count: invoices.total,
    };
  },
};

export default billingService;
