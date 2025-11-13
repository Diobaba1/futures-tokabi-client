// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/contexts/AuthContext";
import { AnalyticsProvider } from "./components/contexts/AnalyticsContext";
import { ToastProvider } from "./components/ui/Toast";
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
import Billing from "./pages/Billing/Billing";
import SignalsPage from "./pages/pageComponents/SignalsPage";
import TgConfigPage from "./pages/config/tgConfigPage";
import { SymbolSearchPage } from "./pages/analytics/SymbolSearchPage";
import AffiliatePage from "./pages/Users/AffiliatePage";

interface RouteConfig {
  path: string;
  element: React.ReactNode;
  layout: React.ComponentType<{ children: React.ReactNode }>;
  protected?: boolean;
  requireAuth?: boolean;
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
    path: "/features",
    element: <FeaturesSection />,
    layout: PublicLayout,
    protected: true,
    requireAuth: false,
  },

  {
    path: "/community",
    element: <CommunityPage />,
    layout: PublicLayout,
    protected: true,
    requireAuth: false,
  },
];

//APIKeyManager
const dashboardRoutes: RouteConfig[] = [
  { path: "/dashboard", element: <Dashboard />, layout: DashboardLayout, protected: true },
  { path: "/dashboard/api-key", element: <APIKeyManager />, layout: DashboardLayout, protected: true },
  { path: "/dashboard/notifications", element: <TgConfigPage />, layout: DashboardLayout, protected: true },
  { path: "/dashboard/billing", element: <Billing />, layout: DashboardLayout, protected: true },
  { path: "/dashboard/trading", element: <Trades />, layout: DashboardLayout, protected: true },
  { path: "/dashboard/settings", element: <Profile />, layout: DashboardLayout, protected: true },
  { path: "/dashboard/signals", element: <SignalsPage />, layout: DashboardLayout, protected: true },
  { path: "/dashboard/symbol-analysis", element: <SymbolSearchPage />, layout: DashboardLayout, protected: true },
  { path: "/dashboard/performance", element: <div>Performance Page</div>, layout: DashboardLayout, protected: true }, 
  { path: "/dashboard/affiliate-dashboard", element: <AffiliatePage />, layout: DashboardLayout, protected: true }, 
];

function renderRoute({ path, element, layout: Layout, protected: isProtected, requireAuth }: RouteConfig) {
  const content = <Layout>{element}</Layout>;

  if (isProtected) {
    return (
      <Route
        key={path}
        path={path}
        element={
          <ProtectedRoute requireAuth={requireAuth}>
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
    <AuthProvider>
      <ToastProvider>
        <AnalyticsProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              {publicRoutes.map(renderRoute)}

              {/* Dashboard Routes */}
              {dashboardRoutes.map(renderRoute)}

              {/* 404 Page */}
              <Route
                path="*"
                element={
                  <PublicLayout>
                    <div className="min-h-screen flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-4xl font-bold text-white mb-4">404</h1>
                        <p className="text-gray-400 text-lg">Page not found</p>
                      </div>
                    </div>
                  </PublicLayout>
                }
              />
            </Routes>
          </Router>
        </AnalyticsProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;