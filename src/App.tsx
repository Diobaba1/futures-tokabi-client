// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/contexts/AuthContext";
import { AnalyticsProvider } from "./components/contexts/AnalyticsContext";
import { ToastProvider } from "./components/ui/Toast";
import { QueryProvider } from "./providers/QueryProvider";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import PublicLayout from "./components/layout/PublicLayout";
import DashboardLayout from "./components/layout/DashboardLayout";

import HomePage from "./pages/Home/Home";
import Login from "./pages/Auth/Login/Login";
import Register from "./pages/Auth/Register";
import FeaturesSection from "./pages/pageComponents/FeaturesSection";
import Dashboard from "./pages/Dashboard/Dashboard";
import Trades from "./pages/pageComponents/Trades";
import Profile from "./pages/Profile";
import "./App.css";
import CommunityPage from "./pages/pageComponents/Community";
import APIKeyManager from "./pages/walletpages/APIKeyManager";
import TgConfigPage from "./pages/config/tgConfigPage";
import { SymbolSearchPage } from "./pages/analytics/SymbolSearchPage";
import AffiliatePage from "./pages/Users/AffiliatePage";

import ForgotPasswordPage from "./pages/Auth/settings/password/ForgotPasswordPage";
import SecuritySettingsPage from "./pages/Auth/settings/SecuritySettingsPage";
import ChangePasswordPage from "./pages/Auth/settings/password/ChangePasswordPage";
import ResetPasswordPage from "./pages/Auth/settings/password/ResetPasswordPage";
import { SignalsDashboard } from "./pages/signals";
import ReferredUsersList from "./pages/Users/ReferredUsersList";

// Static Pages
import {
  AboutPage,
  HowItWorksPage,
  SpatialIntelligencePage,
  FAQPage,
} from "./pages/static";

// Staff Signals Pages
import { StaffSignalsPage, ActiveSignalsPage } from "./pages/StaffSignals";

// Trading Config Page
import TradingConfigPage from "./pages/trading/TradingConfigPage";

// =========================================================================
// Billing Pages
// =========================================================================
import {
  PricingPage,
  BillingDashboard,
  SubscriptionPage,
  PaymentsPage,
  InvoicesPage,
  PaymentSuccess,
  PaymentFailed,
  PaymentPartial,
  PaymentPending,
} from "./pages/billing2";

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
  // =========================================================================
  // Static Pages (About, How It Works, etc.)
  // =========================================================================
  {
    path: "/about",
    element: <AboutPage />,
    layout: PublicLayout,
  },
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
  {
    path: "/faq",
    element: <FAQPage />,
    layout: PublicLayout,
  },
  // =========================================================================
  // Public Billing Routes
  // =========================================================================
  {
    path: "/pricing",
    element: <PricingPage />,
    layout: PublicLayout,
  },
  // Payment Status Pages (users redirected from NOWPayments)
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
  // =========================================================================
  // Billing Dashboard Routes
  // =========================================================================
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
  // =========================================================================
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
  // =========================================================================
  // Staff Signals Routes
  // =========================================================================
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
    <QueryProvider>
      <AuthProvider>
        <ToastProvider>
          <AnalyticsProvider>
            <Router>
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
                              The page you're looking for doesn't exist or has been moved.
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
            </Router>
          </AnalyticsProvider>
        </ToastProvider>
      </AuthProvider>
    </QueryProvider>
  );
}

export default App;
