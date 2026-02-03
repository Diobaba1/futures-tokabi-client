// src/components/Layout/DashboardLayout.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardMenu from './Authlayout/DashboardMenu';
import {
  RefreshCw,
  TrendingUp,
  Activity,
  Globe,
  Search,
  Bell,
  ChevronRight,
  Wifi,
  WifiOff,
  Menu,
  Command,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GoogleTranslator from '../GoogleTranslator';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Page title mapping for breadcrumb
const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Overview', subtitle: 'Your trading dashboard at a glance' },
  '/dashboard/trading': { title: 'Live Trading', subtitle: 'Real-time positions and orders' },
  '/dashboard/trading-config': { title: 'Trade Settings', subtitle: 'Configure your trading parameters' },
  '/dashboard/symbol-analysis': { title: 'Market Analysis', subtitle: 'Technical analysis and insights' },
  '/dashboard/signals': { title: 'AI Signals', subtitle: 'AI-powered trading signals' },
  '/dashboard/professional-signals': { title: 'Pro Signals', subtitle: 'Professional trading signals' },
  '/dashboard/api-key': { title: 'Connect Exchange', subtitle: 'Manage your exchange connections' },
  '/dashboard/notifications': { title: 'Notifications', subtitle: 'Your alerts and updates' },
  '/dashboard/billing': { title: 'Billing Overview', subtitle: 'Manage your subscription' },
  '/dashboard/billing/subscription': { title: 'Subscription', subtitle: 'Your plan details' },
  '/dashboard/billing/payments': { title: 'Payments', subtitle: 'Payment history' },
  '/dashboard/billing/invoices': { title: 'Invoices', subtitle: 'Download your invoices' },
  '/dashboard/affiliate-dashboard': { title: 'Affiliate Program', subtitle: 'Earn rewards by referring' },
  '/dashboard/referals': { title: 'My Referrals', subtitle: 'Track your referrals' },
  '/dashboard/settings': { title: 'Profile Settings', subtitle: 'Manage your account' },
  '/dashboard/settings/security': { title: 'Security', subtitle: 'Security settings and 2FA' },
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isTranslatorOpen, setIsTranslatorOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const navigate = useNavigate();
  const location = useLocation();

  // Get current page info
  const currentPage = pageTitles[location.pathname] || { title: 'Dashboard', subtitle: '' };

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const analyzeAssets = () => {
    navigate("/dashboard/symbol-analysis");
  };

  const affiliate = () => {
    navigate("/dashboard/affiliate-dashboard");
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
    window.location.reload();
  };

  const systemStatus = {
    operational: true,
    latency: "<32ms",
    lastUpdated: "Just now",
    dataFeed: "Live"
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(6,182,212,0.05),transparent_50%)]" />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <DashboardMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onOpen={() => setIsMenuOpen(true)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4"
            onClick={() => setIsSearchOpen(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-xl bg-gray-900/95 backdrop-blur-2xl rounded-2xl border border-cyan-500/20 shadow-2xl shadow-black/50 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 px-4 py-4 border-b border-white/5">
                <Search size={20} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-lg"
                  autoFocus
                />
                <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 rounded bg-gray-800 text-gray-500 text-xs font-mono">
                  ESC
                </kbd>
              </div>
              <div className="p-4 text-center text-gray-500 text-sm">
                Start typing to search...
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className={`relative flex-1 flex flex-col transition-all duration-300 ease-out ${
        isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-[280px]'
      }`}>
        {/* Mobile Header - Redesigned */}
        <header className="lg:hidden sticky top-0 z-20">
          <div className="relative">
            {/* Background */}
            <div className="absolute inset-0 bg-gray-950/90 backdrop-blur-xl border-b border-white/5" />

            {/* Content */}
            <div className="relative flex items-center justify-between px-4 py-3">
              {/* Left: Menu & Title */}
              <div className="flex items-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMenuOpen(true)}
                  className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white border border-white/5 transition-all"
                >
                  <Menu size={20} />
                </motion.button>
                <div>
                  <h1 className="text-base font-semibold text-white">{currentPage.title}</h1>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2">
                {/* Connection Status */}
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${
                  isOnline ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
                </div>

                {/* Refresh */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleRefresh}
                  className="p-2 rounded-xl bg-white/5 text-gray-400 border border-white/5"
                >
                  <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
                </motion.button>
              </div>
            </div>
          </div>
        </header>

        {/* Desktop Header - Redesigned */}
        <header className="hidden lg:block sticky top-0 z-20">
          <div className="relative">
            {/* Background */}
            <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-xl border-b border-white/5" />

            {/* Content */}
            <div className="relative flex items-center justify-between px-6 py-4">
              {/* Left: Breadcrumb & Title */}
              <div className="flex items-center gap-6">
                {/* Page Title */}
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <span>Dashboard</span>
                    <ChevronRight size={14} />
                    <span className="text-cyan-400">{currentPage.title}</span>
                  </div>
                  <h1 className="text-xl font-semibold text-white">{currentPage.title}</h1>
                </div>
              </div>

              {/* Center: Search Bar */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all w-80 group"
              >
                <Search size={18} className="text-gray-500 group-hover:text-gray-400" />
                <span className="text-gray-500 text-sm flex-1 text-left">Search anything...</span>
                <kbd className="flex items-center gap-1 px-2 py-0.5 rounded bg-gray-800 text-gray-500 text-xs font-mono">
                  <Command size={10} />K
                </kbd>
              </motion.button>

              {/* Right: Actions */}
              <div className="flex items-center gap-3">
                {/* Language Translator */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsTranslatorOpen(!isTranslatorOpen)}
                    className={`p-2.5 rounded-xl border transition-all ${
                      isTranslatorOpen
                        ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
                        : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                    title="Translate"
                  >
                    <Globe size={18} />
                  </motion.button>

                  <AnimatePresence>
                    {isTranslatorOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full right-0 mt-2 w-80 bg-gray-900/98 backdrop-blur-2xl border border-cyan-500/20 rounded-2xl shadow-2xl shadow-black/50 p-4 z-50"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-white text-sm font-semibold flex items-center gap-2">
                            <Globe className="w-4 h-4 text-cyan-400" />
                            Translate
                          </h3>
                          <button
                            onClick={() => setIsTranslatorOpen(false)}
                            className="text-gray-500 hover:text-white transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <GoogleTranslator />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Quick Actions */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={analyzeAssets}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-300 hover:text-white hover:bg-white/10 hover:border-cyan-500/20 transition-all text-sm font-medium"
                >
                  <Activity size={16} className="text-cyan-400" />
                  <span>Analyze</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={affiliate}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/10 to-cyan-600/10 border border-cyan-500/20 text-cyan-400 hover:border-cyan-400/40 transition-all text-sm font-medium"
                >
                  <TrendingUp size={16} />
                  <span>Affiliate</span>
                </motion.button>

                {/* Divider */}
                <div className="w-px h-8 bg-white/10" />

                {/* Notifications */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/dashboard/notifications')}
                  className="relative p-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <Bell size={18} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                </motion.button>

                {/* Refresh */}
                <motion.button
                  whileHover={{ scale: 1.05, rotate: isRefreshing ? 0 : 180 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRefresh}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                  title="Refresh page"
                >
                  <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
                </motion.button>

                {/* Connection Status */}
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
                  isOnline
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/10 border border-red-500/20 text-red-400'
                }`}>
                  {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
                  <span className="text-xs font-medium">{isOnline ? 'Online' : 'Offline'}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area - Redesigned */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6">
            {/* Mobile: Page subtitle & Quick Actions */}
            <div className="lg:hidden mb-4">
              {currentPage.subtitle && (
                <p className="text-gray-500 text-sm mb-4">{currentPage.subtitle}</p>
              )}

              {/* Mobile Quick Actions */}
              <div className="flex gap-2 mb-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsTranslatorOpen(!isTranslatorOpen)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    isTranslatorOpen
                      ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
                      : 'bg-white/5 border-white/5 text-gray-400'
                  }`}
                >
                  <Globe size={16} />
                  <span>Translate</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={analyzeAssets}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-400 text-sm font-medium"
                >
                  <Activity size={16} />
                  <span>Analyze</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={affiliate}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium"
                >
                  <TrendingUp size={16} />
                  <span>Affiliate</span>
                </motion.button>
              </div>

              {/* Mobile Translator Dropdown */}
              <AnimatePresence>
                {isTranslatorOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 overflow-hidden"
                  >
                    <div className="bg-gray-900/95 backdrop-blur-xl border border-white/5 rounded-xl p-4">
                      <GoogleTranslator />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Content Container - Clean, minimal */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-900/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden"
            >
              {children}
            </motion.div>

            {/* Footer Status Bar - Redesigned */}
            <motion.footer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
            >
              {/* Left: System Status */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className={`w-2 h-2 rounded-full ${
                      systemStatus.operational ? 'bg-emerald-400' : 'bg-amber-400'
                    }`} />
                    {systemStatus.operational && (
                      <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-50" />
                    )}
                  </div>
                  <span className={systemStatus.operational ? 'text-emerald-400' : 'text-amber-400'}>
                    {systemStatus.operational ? 'All Systems Operational' : 'Degraded Performance'}
                  </span>
                </div>

                <span className="text-gray-700 hidden sm:inline">|</span>

                <span className="text-gray-500">
                  Updated {systemStatus.lastUpdated}
                </span>
              </div>

              {/* Right: Metrics */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-500">
                  <span>Latency</span>
                  <span className="text-cyan-400 font-mono">{systemStatus.latency}</span>
                </div>

                <span className="text-gray-700 hidden sm:inline">|</span>

                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-gray-500">Data Feed: </span>
                  <span className="text-cyan-400">{systemStatus.dataFeed}</span>
                </div>
              </div>
            </motion.footer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;