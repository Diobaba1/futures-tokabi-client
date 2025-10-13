// src/pages/Dashboard/Dashboard.tsx
import React, { useEffect } from 'react';
import { useAuth } from '../../components/contexts/AuthContext';
import { useAnalytics } from '../../components/contexts/AnalyticsContext';
import { useNavigate } from 'react-router-dom';
import PortfolioAnalyticsComponent from '../analytics/PortfolioAnalytics';
import SystemAnalyticsComponent from '../analytics/SystemAnalytics';

const Dashboard: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { fetchPortfolio, fetchSystem, loading: analyticsLoading } = useAnalytics();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !authLoading) {
      navigate('/login');
    } else if (user) {
      // Fetch analytics data when user is available
      fetchPortfolio();
      fetchSystem();
    }
  }, [user, authLoading, navigate, fetchPortfolio, fetchSystem]);

  const isLoading = authLoading || analyticsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user?.full_name}!
          </h1>
          <p className="text-gray-400">Here's your trading performance overview</p>
        </div>
        
        <div className="space-y-8">
          <PortfolioAnalyticsComponent />
          <SystemAnalyticsComponent />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;