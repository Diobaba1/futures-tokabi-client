// ============================================================================
// FILE: src/pages/billing/index.ts
// ============================================================================

/**
 * Billing Pages Index
 * 
 * Exports all billing-related pages and provides router configuration.
 */

// Main Pages
export { default as PricingPage } from './PricingPage';
export { default as SubscriptionPage } from './SubscriptionPage';
export { default as PaymentsPage } from './PaymentsPage';
export { default as InvoicesPage } from './InvoicesPage';
export { default as BillingDashboard } from './BillingDashboard';

// Payment Status Pages
export { default as PaymentSuccess } from './PaymentSuccess';
export { default as PaymentFailed } from './PaymentFailed';
export { default as PaymentPartial } from './PaymentPartial';
export { default as PaymentPending } from './PaymentPending';


// ============================================================================
// ROUTER CONFIGURATION
// ============================================================================
/**
 * Add these routes to your React Router configuration:
 * 
 * ```tsx
 * import {
 *   PricingPage,
 *   SubscriptionPage,
 *   PaymentsPage,
 *   InvoicesPage,
 *   BillingDashboard,
 *   PaymentSuccess,
 *   PaymentFailed,
 *   PaymentPartial,
 *   PaymentPending,
 * } from '@/pages/billing';
 * import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
 * 
 * // In your router config:
 * <Routes>
 *   {/* Public Routes *\/}
 *   <Route path="/pricing" element={<PricingPage />} />
 *   
 *   {/* Payment Status Pages (public - users redirected from NOWPayments) *\/}
 *   <Route path="/billing/success" element={<PaymentSuccess />} />
 *   <Route path="/billing/failed" element={<PaymentFailed />} />
 *   <Route path="/billing/partial" element={<PaymentPartial />} />
 *   <Route path="/billing/pending" element={<PaymentPending />} />
 *   
 *   {/* Protected Billing Routes *\/}
 *   <Route path="/billing" element={<ProtectedRoute />}>
 *     <Route index element={<BillingDashboard />} />
 *     <Route path="subscription" element={<SubscriptionPage />} />
 *     <Route path="payments" element={<PaymentsPage />} />
 *     <Route path="invoices" element={<InvoicesPage />} />
 *   </Route>
 *   
 *   {/* Alternative: Dashboard nested routes *\/}
 *   <Route path="/dashboard" element={<ProtectedRoute />}>
 *     <Route path="billing" element={<BillingDashboard />} />
 *     <Route path="subscription" element={<SubscriptionPage />} />
 *   </Route>
 * </Routes>
 * ```
 */


// ============================================================================
// SIDEBAR / NAVIGATION CONFIGURATION
// ============================================================================
/**
 * Add billing links to your sidebar:
 * 
 * ```tsx
 * const billingNavItems = [
 *   {
 *     label: 'Billing',
 *     icon: CreditCard,
 *     path: '/billing',
 *     children: [
 *       { label: 'Overview', path: '/billing' },
 *       { label: 'Subscription', path: '/billing/subscription' },
 *       { label: 'Payments', path: '/billing/payments' },
 *       { label: 'Invoices', path: '/billing/invoices' },
 *     ],
 *   },
 * ];
 * ```
 */


// ============================================================================
// PROTECTED ROUTE EXAMPLE
// ============================================================================
/**
 * Example ProtectedRoute component:
 * 
 * ```tsx
 * // src/components/auth/ProtectedRoute.tsx
 * import { Navigate, Outlet, useLocation } from 'react-router-dom';
 * import { useAuth } from '@/hooks/useAuth';
 * 
 * export const ProtectedRoute: React.FC = () => {
 *   const { isAuthenticated, isLoading } = useAuth();
 *   const location = useLocation();
 * 
 *   if (isLoading) {
 *     return <LoadingSpinner />;
 *   }
 * 
 *   if (!isAuthenticated) {
 *     return <Navigate to="/login" state={{ from: location }} replace />;
 *   }
 * 
 *   return <Outlet />;
 * };
 * ```
 */
