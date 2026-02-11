// src/App.tsx
import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/contexts/AuthContext";
import { AnalyticsProvider } from "./components/contexts/AnalyticsContext";
import { ToastProvider } from "./components/ui/Toast";
import { QueryProvider } from "./providers/QueryProvider";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import PublicLayout from "./components/layout/PublicLayout";
import DashboardLayout from "./components/layout/DashboardLayout";
import ErrorBoundary from "./components/ErrorBoundary";
import "./App.css";

// --------------------------------------------------------------------------
// Critical pages (keep static for instant load)
// --------------------------------------------------------------------------
import HomePage from "./pages/Home/Home";
import Login from "./pages/Auth/Login/Login";
import Register from "./pages/Auth/Register";

// --------------------------------------------------------------------------
// Lazy-loaded pages (code-split for smaller initial bundle)
// --------------------------------------------------------------------------
const FeaturesSection = React.lazy(
  () => import("./pages/pageComponents/FeaturesSection")
);
const Dashboard = React.lazy(() => import("./pages/Dashboard/Dashboard"));
const Trades = React.lazy(() => import("./pages/pageComponents/Trades"));
const Profile = React.lazy(() => import("./pages/Profile"));
const CommunityPage = React.lazy(
  () => import("./pages/pageComponents/Community")
);
const APIKeyManager = React.lazy(
  () => import("./pages/walletpages/APIKeyManager")
);
const TgConfigPage = React.lazy(
  () => import("./pages/config/tgConfigPage")
);
const SymbolSearchPage = React.lazy(() =>
  import("./pages/analytics/SymbolSearchPage").then((m) => ({
    default: m.SymbolSearchPage,
  }))
);
const AffiliatePage = React.lazy(
  () => import("./pages/Users/AffiliatePage")
);
const ForgotPasswordPage = React.lazy(
  () => import("./pages/Auth/settings/password/ForgotPasswordPage")
);
const SecuritySettingsPage = React.lazy(
  () => import("./pages/Auth/settings/SecuritySettingsPage")
);
const ChangePasswordPage = React.lazy(
  () => import("./pages/Auth/settings/password/ChangePasswordPage")
);
const ResetPasswordPage = React.lazy(
  () => import("./pages/Auth/settings/password/ResetPasswordPage")
);
const SignalsDashboard = React.lazy(() =>
  import("./pages/signals").then((m) => ({ default: m.SignalsDashboard }))
);
const ReferredUsersList = React.lazy(
  () => import("./pages/Users/ReferredUsersList")
);
const TradingConfigPage = React.lazy(
  () => import("./pages/trading/TradingConfigPage")
);

// Static pages
const AboutPage = React.lazy(() =>
  import("./pages/static").then((m) => ({ default: m.AboutPage }))
);
const HowItWorksPage = React.lazy(() =>
  import("./pages/static").then((m) => ({ default: m.HowItWorksPage }))
);
const SpatialIntelligencePage = React.lazy(() =>
  import("./pages/static").then((m) => ({
    default: m.SpatialIntelligencePage,
  }))
);
const FAQPage = React.lazy(() =>
  import("./pages/static").then((m) => ({ default: m.FAQPage }))
);

// Staff Signals
const StaffSignalsPage = React.lazy(() =>
  import("./pages/StaffSignals").then((m) => ({
    default: m.StaffSignalsPage,
  }))
);
const ActiveSignalsPage = React.lazy(() =>
  import("./pages/StaffSignals").then((m) => ({
    default: m.ActiveSignalsPage,
  }))
);

// Billing
const PricingPage = React.lazy(() =>
  import("./pages/billing2").then((m) => ({ default: m.PricingPage }))
);
const BillingDashboard = React.lazy(() =>
  import("./pages/billing2").then((m) => ({ default: m.BillingDashboard }))
);
const SubscriptionPage = React.lazy(() =>
  import("./pages/billing2").then((m) => ({ default: m.SubscriptionPage }))
);
const PaymentsPage = React.lazy(() =>
  import("./pages/billing2").then((m) => ({ default: m.PaymentsPage }))
);
const InvoicesPage = React.lazy(() =>
  import("./pages/billing2").then((m) => ({ default: m.InvoicesPage }))
);
const PaymentSuccess = React.lazy(() =>
  import("./pages/billing2").then((m) => ({ default: m.PaymentSuccess }))
);
const PaymentFailed = React.lazy(() =>
  import("./pages/billing2").then((m) => ({ default: m.PaymentFailed }))
);
const PaymentPartial = React.lazy(() =>
  import("./pages/billing2").then((m) => ({ default: m.PaymentPartial }))
);
const PaymentPending = React.lazy(() =>
  import("./pages/billing2").then((m) => ({ default: m.PaymentPending }))
);

// --------------------------------------------------------------------------
// Loading fallback for lazy-loaded routes
// --------------------------------------------------------------------------
function RouteLoader() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f172a",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          border: "3px solid #1e293b",
          borderTopColor: "#06b6d4",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// --------------------------------------------------------------------------
// Route definitions
// --------------------------------------------------------------------------
interface RouteConfig {
  path: string;
  element: React.ReactNode;
  layout: React.ComponentType<{ children: React.ReactNode }>;
  protected?: boolean;
  requireAuth?: boolean;
  requireStaff?: boolean;
}

const publicRoutes: RouteConfig[] = [
  { path: "/", element: <HomePage />, layout: PublicLayout },
  {
    path: "/login",
    element: <Login />,
    layout: PublicLayout,
    protected: true,
    requireAuth: false,
  },
  {
    path: "/register",
    element: <Register />,
    layout: PublicLayout,
    protected: true,
    requireAuth: false,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
    layout: PublicLayout,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
    layout: PublicLayout,
  },
  {
    path: "/features",
    element: <FeaturesSection />,
    layout: PublicLayout,
  },
  {
    path: "/community",
    element: <CommunityPage />,
    layout: PublicLayout,
  },
  // Static Pages
  { path: "/about", element: <AboutPage />, layout: PublicLayout },
  {
    path: "/how-it-works",
    element: <HowItWorksPage />,
    layout: PublicLayout,
  },
  {
    path: "/spatial-intelligence",
    element: <SpatialIntelligencePage />,
    layout: PublicLayout,
  },
  { path: "/faq", element: <FAQPage />, layout: PublicLayout },
  // Public Billing
  { path: "/pricing", element: <PricingPage />, layout: PublicLayout },
  {
    path: "/billing/success",
    element: <PaymentSuccess />,
    layout: PublicLayout,
  },
  {
    path: "/billing/failed",
    element: <PaymentFailed />,
    layout: PublicLayout,
  },
  {
    path: "/billing/partial",
    element: <PaymentPartial />,
    layout: PublicLayout,
  },
  {
    path: "/billing/pending",
    element: <PaymentPending />,
    layout: PublicLayout,
  },
];

const dashboardRoutes: RouteConfig[] = [
  {
    path: "/dashboard",
    element: <Dashboard />,
    layout: DashboardLayout,
    protected: true,
  },
  {
    path: "/dashboard/api-key",
    element: <APIKeyManager />,
    layout: DashboardLayout,
    protected: true,
  },
  {
    path: "/dashboard/notifications",
    element: <TgConfigPage />,
    layout: DashboardLayout,
    protected: true,
  },
  // Billing
  {
    path: "/dashboard/billing",
    element: <BillingDashboard />,
    layout: DashboardLayout,
    protected: true,
  },
  {
    path: "/dashboard/billing/subscription",
    element: <SubscriptionPage />,
    layout: DashboardLayout,
    protected: true,
  },
  {
    path: "/dashboard/billing/payments",
    element: <PaymentsPage />,
    layout: DashboardLayout,
    protected: true,
  },
  {
    path: "/dashboard/billing/invoices",
    element: <InvoicesPage />,
    layout: DashboardLayout,
    protected: true,
  },
  // Trading
  {
    path: "/dashboard/trading",
    element: <Trades />,
    layout: DashboardLayout,
    protected: true,
  },
  {
    path: "/dashboard/trading-config",
    element: <TradingConfigPage />,
    layout: DashboardLayout,
    protected: true,
  },
  // Settings
  {
    path: "/dashboard/settings",
    element: <Profile />,
    layout: DashboardLayout,
    protected: true,
  },
  {
    path: "/dashboard/settings/security",
    element: <SecuritySettingsPage />,
    layout: DashboardLayout,
    protected: true,
  },
  {
    path: "/dashboard/settings/change-password",
    element: <ChangePasswordPage />,
    layout: DashboardLayout,
    protected: true,
  },
  // Signals
  {
    path: "/dashboard/signals",
    element: <SignalsDashboard />,
    layout: DashboardLayout,
    protected: true,
  },
  {
    path: "/dashboard/symbol-analysis",
    element: <SymbolSearchPage />,
    layout: DashboardLayout,
    protected: true,
  },
  {
    path: "/dashboard/performance",
    element: <div>Performance Page</div>,
    layout: DashboardLayout,
    protected: true,
  },
  // Affiliate & Referrals
  {
    path: "/dashboard/affiliate-dashboard",
    element: <AffiliatePage />,
    layout: DashboardLayout,
    protected: true,
  },
  {
    path: "/dashboard/referals",
    element: <ReferredUsersList />,
    layout: DashboardLayout,
    protected: true,
  },
  // Staff Signals
  {
    path: "/dashboard/staff-signals",
    element: <StaffSignalsPage />,
    layout: DashboardLayout,
    protected: true,
    requireStaff: true,
  },
  {
    path: "/dashboard/professional-signals",
    element: <ActiveSignalsPage />,
    layout: DashboardLayout,
    protected: true,
  },
];

function renderRoute({
  path,
  element,
  layout: Layout,
  protected: isProtected,
  requireAuth,
  requireStaff,
}: RouteConfig) {
  const content = <Layout>{element}</Layout>;

  if (isProtected) {
    return (
      <Route
        key={path}
        path={path}
        element={
          <ProtectedRoute requireAuth={requireAuth} requireStaff={requireStaff}>
            {content}
          </ProtectedRoute>
        }
      />
    );
  }

  return <Route key={path} path={path} element={content} />;
}

function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <AuthProvider>
          <ToastProvider>
            <AnalyticsProvider>
              <Router>
                <Suspense fallback={<RouteLoader />}>
                  <div className="relative">
                    <Routes>
                      {publicRoutes.map(renderRoute)}
                      {dashboardRoutes.map(renderRoute)}

                      {/* 404 Page */}
                      <Route
                        path="*"
                        element={
                          <PublicLayout>
                            <div className="min-h-screen flex items-center justify-center bg-tokabi-light">
                              <div className="text-center px-4">
                                <h1 className="text-6xl font-bold text-tokabi-accent mb-4">
                                  404
                                </h1>
                                <h2 className="text-2xl font-semibold text-tokabi-primary mb-4">
                                  Page not found
                                </h2>
                                <p className="text-tokabi-secondary mb-8">
                                  The page you're looking for doesn't exist or
                                  has been moved.
                                </p>
                                <a
                                  href="/"
                                  className="inline-flex items-center justify-center px-6 py-3 bg-tokabi-accent text-white font-semibold rounded-btn hover:bg-tokabi-accent-hover transition-colors"
                                >
                                  Back to Home
                                </a>
                              </div>
                            </div>
                          </PublicLayout>
                        }
                      />
                    </Routes>
                  </div>
                </Suspense>
              </Router>
            </AnalyticsProvider>
          </ToastProvider>
        </AuthProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}

export default App;
