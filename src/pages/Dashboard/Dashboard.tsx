// src/pages/Dashboard/Dashboard.tsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../components/contexts/AuthContext';
import { useAnalytics } from '../../components/contexts/AnalyticsContext';
import { useNavigate } from 'react-router-dom';
import PortfolioAnalyticsComponent from '../analytics/PortfolioAnalytics';
import { Zap } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { fetchPortfolio, fetchSystem, loading: analyticsLoading } = useAnalytics();
  const navigate = useNavigate();

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
      <PortfolioAnalyticsComponent />
    </div>
  );
};

export default Dashboard;
