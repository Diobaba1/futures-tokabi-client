// ============================================================================
// FILE: src/hooks/useBilling.ts
// ============================================================================

/**
 * Billing React Query Hooks
 * 
 * Custom hooks for billing operations using React Query.
 * Aligned with backend API routes.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  planService,
  subscriptionService,
  paymentService,
  invoiceService,
  billingService,
} from '../../api/services/billingService';
import type {
  SubscriptionPlan,
  Subscription,
  SubscriptionCreateRequest,
  SubscriptionCancelRequest,
  Payment,
  Invoice,
  InvoiceListParams,
  BillingStats,
} from '../../types/billings.types';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const billingKeys = {
  all: ['billing'] as const,
  
  // Plans
  plans: () => [...billingKeys.all, 'plans'] as const,
  plansList: () => [...billingKeys.plans(), 'list'] as const,
  plansFeatured: () => [...billingKeys.plans(), 'featured'] as const,
  
  // Subscriptions
  subscriptions: () => [...billingKeys.all, 'subscriptions'] as const,
  subscriptionCurrent: () => [...billingKeys.subscriptions(), 'current'] as const,
  subscriptionHistory: () => [...billingKeys.subscriptions(), 'history'] as const,
  
  // Payments
  payments: () => [...billingKeys.all, 'payments'] as const,
  paymentsList: () => [...billingKeys.payments(), 'list'] as const,
  paymentDetail: (id: string) => [...billingKeys.payments(), 'detail', id] as const,
  paymentStatus: (id: string) => [...billingKeys.payments(), 'status', id] as const,
  
  // Invoices
  invoices: () => [...billingKeys.all, 'invoices'] as const,
  invoicesList: (params?: InvoiceListParams) => [...billingKeys.invoices(), 'list', params] as const,
  invoicesUnpaid: () => [...billingKeys.invoices(), 'unpaid'] as const,
  invoiceDetail: (id: string) => [...billingKeys.invoices(), 'detail', id] as const,
  
  // Stats
  stats: () => [...billingKeys.all, 'stats'] as const,
};

// ============================================================================
// PLAN HOOKS
// ============================================================================

/**
 * Get all available subscription plans
 * Backend: GET /api/subscriptions/plans
 */
export function usePlans() {
  return useQuery({
    queryKey: billingKeys.plansList(),
    queryFn: () => planService.getPlans(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get featured plans
 * Backend: GET /api/subscriptions/plans/featured
 */
export function useFeaturedPlans() {
  return useQuery({
    queryKey: billingKeys.plansFeatured(),
    queryFn: () => planService.getFeaturedPlans(),
    staleTime: 5 * 60 * 1000,
  });
}

// ============================================================================
// SUBSCRIPTION HOOKS
// ============================================================================

/**
 * Get current user's subscription
 * Backend: GET /api/subscriptions/me
 */
export function useCurrentSubscription() {
  return useQuery({
    queryKey: billingKeys.subscriptionCurrent(),
    queryFn: () => subscriptionService.getCurrentSubscription(),
    staleTime: 60 * 1000, // 1 minute
    retry: false,
  });
}

/**
 * Get subscription history
 * Backend: GET /api/subscriptions/history
 */
export function useSubscriptionHistory(page = 1, pageSize = 20, includeInactive = false) {
  return useQuery({
    queryKey: [...billingKeys.subscriptionHistory(), page, pageSize, includeInactive],
    queryFn: () => subscriptionService.getSubscriptionHistory(page, pageSize, includeInactive),
  });
}

/**
 * Create a new subscription
 * Backend: POST /api/subscriptions/
 */
export function useCreateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubscriptionCreateRequest) =>
      subscriptionService.createSubscription(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: billingKeys.subscriptions() });
      toast.success('Subscription created! Redirecting to payment...');
      
      // Redirect to payment URL if provided
      if (data.payment_url) {
        window.location.href = data.payment_url;
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to create subscription');
    },
  });
}

/**
 * Cancel a subscription
 * Backend: POST /api/subscriptions/{id}/cancel
 */
export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      subscriptionId,
      data,
    }: {
      subscriptionId: string;
      data?: SubscriptionCancelRequest;
    }) => subscriptionService.cancelSubscription(subscriptionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.subscriptions() });
      toast.success('Subscription cancelled successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to cancel subscription');
    },
  });
}

/**
 * Renew a subscription
 * Backend: POST /api/subscriptions/{id}/renew
 */
export function useRenewSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      subscriptionId,
      payCurrency,
    }: {
      subscriptionId: string;
      payCurrency?: string;
    }) => subscriptionService.renewSubscription(subscriptionId, payCurrency),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: billingKeys.subscriptions() });
      toast.success('Renewal initiated! Redirecting to payment...');
      
      if (data.payment_url) {
        window.location.href = data.payment_url;
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to renew subscription');
    },
  });
}

// ============================================================================
// PAYMENT HOOKS
// ============================================================================

/**
 * Get payment history
 * Backend: GET /api/payments/
 */
export function usePayments(page = 1, pageSize = 20, status?: string) {
  return useQuery({
    queryKey: [...billingKeys.paymentsList(), page, pageSize, status],
    queryFn: () => paymentService.getPayments(page, pageSize, status),
  });
}

/**
 * Get payment by ID
 * Backend: GET /api/payments/{id}
 */
export function usePayment(paymentId: string) {
  return useQuery({
    queryKey: billingKeys.paymentDetail(paymentId),
    queryFn: () => paymentService.getPaymentById(paymentId),
    enabled: !!paymentId,
  });
}

/**
 * Get payment status (with polling)
 * Backend: GET /api/payments/{id}/status
 */
export function usePaymentStatus(paymentId: string, pollInterval?: number) {
  return useQuery({
    queryKey: billingKeys.paymentStatus(paymentId),
    queryFn: () => paymentService.getPaymentStatus(paymentId, true),
    enabled: !!paymentId,
    refetchInterval: pollInterval, // Poll for status updates
  });
}

/**
 * Create invoice payment (redirects to NOWPayments hosted page)
 * Backend: POST /api/payments/create-invoice
 */
export function useCreateInvoicePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      amount, 
      currency, 
      description 
    }: { 
      amount: number; 
      currency?: string; 
      description?: string; 
    }) => paymentService.createInvoicePayment(amount, currency, description),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: billingKeys.payments() });
      toast.success('Payment created! Redirecting...');
      
      if (data.invoice_url) {
        window.location.href = data.invoice_url;
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to create payment');
    },
  });
}

// ============================================================================
// INVOICE HOOKS
// ============================================================================

/**
 * Get invoice list
 * Backend: GET /api/invoices/
 */
export function useInvoices(params?: InvoiceListParams) {
  return useQuery({
    queryKey: billingKeys.invoicesList(params),
    queryFn: () => invoiceService.getInvoices(params),
  });
}

/**
 * Get unpaid invoices
 * Backend: GET /api/invoices/unpaid
 */
export function useUnpaidInvoices() {
  return useQuery({
    queryKey: billingKeys.invoicesUnpaid(),
    queryFn: () => invoiceService.getUnpaidInvoices(),
  });
}

/**
 * Get invoice by ID
 * Backend: GET /api/invoices/{id}
 */
export function useInvoice(invoiceId: string) {
  return useQuery({
    queryKey: billingKeys.invoiceDetail(invoiceId),
    queryFn: () => invoiceService.getInvoiceById(invoiceId),
    enabled: !!invoiceId,
  });
}

/**
 * Pay an invoice
 * Backend: POST /api/invoices/{id}/pay
 */
export function usePayInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      invoiceId,
      payCurrency,
    }: {
      invoiceId: string;
      payCurrency: string;
    }) => invoiceService.payInvoice(invoiceId, payCurrency),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: billingKeys.invoices() });
      queryClient.invalidateQueries({ queryKey: billingKeys.payments() });
      toast.success('Payment initiated!');
      
      // If there's a hosted invoice URL, redirect there
      if (data.invoice_url) {
        window.location.href = data.invoice_url;
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to pay invoice');
    },
  });
}

// ============================================================================
// BILLING STATS HOOK
// ============================================================================

/**
 * Get billing overview stats
 */
export function useBillingStats() {
  return useQuery({
    queryKey: billingKeys.stats(),
    queryFn: () => billingService.getBillingStats(),
    staleTime: 60 * 1000, // 1 minute
  });
}

// ============================================================================
// COMBINED HOOK FOR BILLING DASHBOARD
// ============================================================================

/**
 * Get all data needed for billing dashboard
 */
export function useBillingDashboard() {
  const subscription = useCurrentSubscription();
  const plans = usePlans();
  const stats = useBillingStats();
  const recentPayments = usePayments(1, 5);
  const recentInvoices = useInvoices({ page: 1, page_size: 5 });

  return {
    subscription,
    plans,
    stats,
    recentPayments,
    recentInvoices,
    isLoading:
      subscription.isLoading ||
      plans.isLoading ||
      stats.isLoading ||
      recentPayments.isLoading ||
      recentInvoices.isLoading,
    isError:
      subscription.isError ||
      plans.isError ||
      stats.isError,
  };
}

// ============================================================================
// SUBSCRIPTION STATUS HELPERS
// ============================================================================

/**
 * Check if user has an active subscription
 */
export function useHasActiveSubscription() {
  const { data: subscription, isLoading } = useCurrentSubscription();
  
  return {
    hasSubscription: subscription?.status === 'active' || subscription?.status === 'trial',
    isLoading,
    subscription,
  };
}

/**
 * Check if user can access a feature based on their plan
 */
export function useCanAccessFeature(feature: keyof import('../../types/billings.types').PlanFeatures) {
  const { data: subscription, isLoading } = useCurrentSubscription();
  
  if (isLoading) return { canAccess: false, isLoading: true };
  if (!subscription?.plan?.features) return { canAccess: false, isLoading: false };
  
  const featureValue = subscription.plan.features[feature];
  
  // Boolean features
  if (typeof featureValue === 'boolean') {
    return { canAccess: featureValue, isLoading: false };
  }
  
  // Numeric features (-1 = unlimited, 0 = disabled, >0 = limited)
  if (typeof featureValue === 'number') {
    return { canAccess: featureValue !== 0, isLoading: false };
  }
  
  return { canAccess: !!featureValue, isLoading: false };
}
