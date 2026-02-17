// src/pages/Dashboard/Dashboard.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../components/contexts/AuthContext';
import { useAnalytics } from '../../components/contexts/AnalyticsContext';
import { useNavigate } from 'react-router-dom';
import PortfolioAnalyticsComponent from '../analytics/PortfolioAnalytics';
import { Zap, Shield } from 'lucide-react';

const DISCLAIMER_KEY = 'tokabi_disclaimer_accepted';

const Dashboard: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { fetchPortfolio, fetchSystem, loading: analyticsLoading } = useAnalytics();
  const navigate = useNavigate();

  const [showDisclaimer, setShowDisclaimer] = useState(() => {
    return !localStorage.getItem(DISCLAIMER_KEY);
  });
  const [checkIntelligence, setCheckIntelligence] = useState(false);
  const [checkRisk, setCheckRisk] = useState(false);
  const [checkResponsibility, setCheckResponsibility] = useState(false);
  const allChecked = useMemo(
    () => checkIntelligence && checkRisk && checkResponsibility,
    [checkIntelligence, checkRisk, checkResponsibility]
  );

  const handleAcceptDisclaimer = () => {
    localStorage.setItem(DISCLAIMER_KEY, 'true');
    setShowDisclaimer(false);
  };

  useEffect(() => {
    if (!user && !authLoading) {
      navigate('/login');
    } else if (user) {
      fetchPortfolio();
      fetchSystem();
    }
  }, [user, authLoading, navigate, fetchPortfolio, fetchSystem]);

  const isLoading = authLoading || analyticsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl animate-pulse" />
            <div className="relative w-20 h-20 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap className="w-8 h-8 text-cyan-400" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Loading Dashboard</h3>
          <p className="text-gray-500">Preparing your trading environment...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* First-login disclaimer overlay */}
      <AnimatePresence>
        {showDisclaimer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-900 border border-cyan-500/20 rounded-2xl p-8 max-w-lg w-full shadow-2xl shadow-cyan-500/10"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Welcome to Tokabi</h2>
                  <p className="text-gray-400 text-sm">Before you begin, please confirm:</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={checkIntelligence}
                    onChange={(e) => setCheckIntelligence(e.target.checked)}
                    className="mt-1 w-4 h-4 text-cyan-500 focus:ring-cyan-500 border-cyan-500/30 rounded bg-gray-700/50"
                  />
                  <span className="text-sm text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                    I understand Tokabi provides market intelligence software, not investment advice
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={checkRisk}
                    onChange={(e) => setCheckRisk(e.target.checked)}
                    className="mt-1 w-4 h-4 text-cyan-500 focus:ring-cyan-500 border-cyan-500/30 rounded bg-gray-700/50"
                  />
                  <span className="text-sm text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                    I understand trading involves substantial risk of loss
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={checkResponsibility}
                    onChange={(e) => setCheckResponsibility(e.target.checked)}
                    className="mt-1 w-4 h-4 text-cyan-500 focus:ring-cyan-500 border-cyan-500/30 rounded bg-gray-700/50"
                  />
                  <span className="text-sm text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                    I am responsible for my own trading decisions
                  </span>
                </label>
              </div>

              <button
                onClick={handleAcceptDisclaimer}
                disabled={!allChecked}
                className={`w-full py-3.5 px-6 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                  allChecked
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                I Understand — Enter Dashboard
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <PortfolioAnalyticsComponent />
    </div>
  );
};

export default Dashboard;
