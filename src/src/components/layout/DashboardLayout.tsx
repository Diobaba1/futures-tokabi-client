// src/components/Layout/DashboardLayout.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardMenu from './Authlayout/DashboardMenu';
import { useAuth } from '../../components/contexts/AuthContext';
import { RefreshCw, TrendingUp, Sparkles, Zap, Activity, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GoogleTranslator from '../GoogleTranslator';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isTranslatorOpen, setIsTranslatorOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

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
    // Simulate refresh action
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const systemStatus = {
    operational: true,
    latency: "<32ms",
    lastUpdated: "Just now",
    dataFeed: "Live"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-cyan-950/20 to-gray-900 flex">
      <DashboardMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)}
        onOpen={() => setIsMenuOpen(true)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      
      {/* Main content area */}
      <div className={`flex-1 flex flex-col transition-all duration-500 ease-out ${
        isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-80'
      }`}>
        {/* Enhanced Mobile header */}
        <div className="lg:hidden sticky top-0 z-20 flex items-center justify-between p-4 border-b border-cyan-500/10 bg-gradient-to-r from-cyan-950/40 to-gray-900/80 backdrop-blur-2xl">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(true)}
            className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-400/80 hover:text-cyan-300 hover:bg-cyan-500/20 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
          
          <div className="flex items-center space-x-3">
            {/* Mobile Translator */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsTranslatorOpen(!isTranslatorOpen)}
                className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-400/80 hover:text-cyan-300 hover:bg-cyan-500/20 transition-all duration-300"
              >
                <Globe className="w-4 h-4" />
              </motion.button>
              
              <AnimatePresence>
                {isTranslatorOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-72 bg-gray-900/95 backdrop-blur-2xl border border-cyan-500/20 rounded-xl shadow-2xl shadow-cyan-500/20 p-4"
                  >
                    <GoogleTranslator />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="text-right">
              <div className="text-white text-sm font-light bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
                {user?.full_name}
              </div>
              <div className="text-cyan-400/60 text-xs font-light">Algorithmic Trading</div>
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50"
            />
          </div>
        </div>

        {/* Enhanced Desktop Header */}
        <div className="hidden lg:flex sticky top-0 z-20 items-center justify-between p-6 border-b border-cyan-500/10 bg-gradient-to-r from-cyan-950/40 to-gray-900/80 backdrop-blur-2xl">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(6, 182, 212, 0.1)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleCollapse}
              className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-400/70 hover:text-cyan-300 transition-all duration-300"
              title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg 
                className={`w-4 h-4 transform transition-transform duration-300 ${
                  isSidebarCollapsed ? 'rotate-180' : ''
                }`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </motion.button>
            
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                
              </motion.div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-light text-white">
                  Trading <span className="bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">Portal</span>
                </h1>
                <p className="text-cyan-400/60 mt-1 text-sm font-light">
                  Real-time algorithmic trading performance and analytics
                </p>
              </div>
            </div>
          </div>
          
          {/* Enhanced Quick Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Desktop Translator */}
            <div className="relative mr-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsTranslatorOpen(!isTranslatorOpen)}
                className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-400/70 hover:text-cyan-300 hover:bg-cyan-500/20 transition-all duration-300 flex items-center space-x-2"
                title="Translate content"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium text-cyan-400/80">Translate</span>
              </motion.button>
              
              <AnimatePresence>
                {isTranslatorOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-2xl border border-cyan-500/20 rounded-xl shadow-2xl shadow-cyan-500/20 p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white text-sm font-semibold flex items-center gap-2">
                        <Globe className="w-4 h-4 text-cyan-400" />
                        Language Translator
                      </h3>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsTranslatorOpen(false)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </motion.button>
                    </div>
                    <GoogleTranslator />
                    <div className="mt-3 pt-3 border-t border-cyan-500/20">
                      <p className="text-cyan-400/60 text-xs">
                        Translate dashboard content to your preferred language
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={affiliate}
              className="relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-500" />
              <div className="relative px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-cyan-600/10 text-white font-medium rounded-xl border border-cyan-400/30 hover:border-cyan-400/50 backdrop-blur-sm transition-all duration-300 flex items-center space-x-2 text-sm">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span className="bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
                  Affiliate
                </span>
              </div>
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={analyzeAssets}
              className="relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-500" />
              <div className="relative px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-cyan-600/10 text-white font-medium rounded-xl border border-cyan-400/30 hover:border-cyan-400/50 backdrop-blur-sm transition-all duration-300 flex items-center space-x-2 text-sm">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span className="bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
                  Analyze Assets
                </span>
              </div>
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.05, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-400/70 hover:text-cyan-300 hover:bg-cyan-500/20 transition-all duration-300"
              title="Refresh data"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>
        </div>

        {/* Enhanced Page content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6 max-w-7xl mx-auto w-full">
            {/* Mobile Page Header */}
            <div className="lg:hidden mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400/20 to-cyan-600/30 rounded-xl flex items-center justify-center border border-cyan-400/30">
                  <Zap className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-light text-white">
                    Trading <span className="bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">Portal</span>
                  </h1>
                  <p className="text-cyan-400/60 mt-1 text-sm font-light">
                    Real-time algorithmic trading performance
                  </p>
                </div>
              </div>
              
              {/* Mobile Quick Actions */}
              <div className="flex space-x-3 mb-4">
                {/* Mobile Translator Button */}
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsTranslatorOpen(!isTranslatorOpen)}
                  className="px-3 py-2 bg-gradient-to-r from-cyan-500/10 to-cyan-600/10 rounded-xl border border-cyan-400/20 text-cyan-400 text-sm font-medium flex items-center justify-center space-x-2"
                >
                  <Globe className="w-4 h-4" />
                  <span>Translate</span>
                </motion.button>
                
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={affiliate}
                  className="flex-1 px-3 py-2 bg-gradient-to-r from-cyan-500/10 to-cyan-600/10 rounded-xl border border-cyan-400/20 text-cyan-400 text-sm font-medium flex items-center justify-center space-x-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Affiliate</span>
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={analyzeAssets}
                  className="flex-1 px-3 py-2 bg-gradient-to-r from-cyan-500/10 to-cyan-600/10 rounded-xl border border-cyan-400/20 text-cyan-400 text-sm font-medium flex items-center justify-center space-x-2"
                >
                  <Activity className="w-4 h-4" />
                  <span>Analyze</span>
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
                    <div className="bg-gray-900/95 backdrop-blur-2xl border border-cyan-500/20 rounded-xl p-4">
                      <GoogleTranslator />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Enhanced Children Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-cyan-950/20 via-gray-900/40 to-cyan-950/10 backdrop-blur-2xl border border-cyan-500/20 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/10"
            >
              {children}
            </motion.div>

            {/* Enhanced System Status Footer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs font-light space-y-2 sm:space-y-0"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`w-1.5 h-1.5 rounded-full shadow-lg ${
                      systemStatus.operational 
                        ? 'bg-emerald-400 shadow-emerald-400/50' 
                        : 'bg-amber-400 shadow-amber-400/50'
                    }`}
                  />
                  <span className="text-cyan-400/70">
                    {systemStatus.operational ? 'All Systems Operational' : 'System Degraded'}
                  </span>
                </div>
                <span className="text-cyan-400/30 hidden sm:inline">•</span>
                <span className="text-cyan-400/60">Last updated: {systemStatus.lastUpdated}</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-cyan-400/60">API Latency: {systemStatus.latency}</span>
                <span className="text-cyan-400/30 hidden sm:inline">•</span>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-3 h-3 text-cyan-400/60" />
                  <span className="text-cyan-400/60">Data Feed: {systemStatus.dataFeed}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;