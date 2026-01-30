// src/pages/Dashboard/Dashboard.tsx
import React, { useEffect } from 'react';
import { useAuth } from '../../components/contexts/AuthContext';
import { useAnalytics } from '../../components/contexts/AnalyticsContext';
import { useNavigate } from 'react-router-dom';
import PortfolioAnalyticsComponent from '../analytics/PortfolioAnalytics';
import { useTradingWebSocket } from '../../components/hooks';
import { OpenPositions } from '../../components/trading/OpenPositions';


const Dashboard: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { fetchPortfolio, fetchSystem, loading: analyticsLoading } = useAnalytics();
  const navigate = useNavigate();

  // Real-time trading data
  const {
    isConnected: isTradingConnected,
    isConnecting,
    hasApiKey,
    positions,
    portfolio: tradingPortfolio,
    lastSync,
    error: tradingError,
    syncPositions,
    refreshPositions,
  } = useTradingWebSocket(true);

  // Debug logging for WebSocket state
  useEffect(() => {
    console.log('[Dashboard] WebSocket state:', {
      isConnected: isTradingConnected,
      isConnecting,
      hasApiKey,
      positionsCount: positions.length,
      lastSync,
      error: tradingError,
      portfolio: tradingPortfolio ? 'present' : 'null'
    });
  }, [isTradingConnected, isConnecting, hasApiKey, positions, lastSync, tradingError, tradingPortfolio]);

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

        {/* WebSocket Connection Status Banner */}
        <div className={`mb-4 p-3 rounded-lg border ${
          isTradingConnected
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : isConnecting
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
              isTradingConnected ? 'bg-emerald-500 animate-pulse' : isConnecting ? 'bg-amber-500 animate-pulse' : 'bg-rose-500'
            }`} />
            <span className="text-sm font-medium">
              {isTradingConnected
                ? `Live Stream Connected${hasApiKey ? ' - API Key Active' : ' - No API Key'}`
                : isConnecting
                  ? 'Connecting to trading stream...'
                  : 'Not connected to trading stream'}
            </span>
            {tradingError && (
              <span className="text-xs text-rose-400 ml-2">Error: {tradingError}</span>
            )}
            {positions.length > 0 && (
              <span className="ml-auto text-xs">{positions.length} position(s)</span>
            )}
          </div>
        </div>
        
        {/* Real-time Open Positions */}
        <div className="mb-8">
          <OpenPositions
            positions={positions}
            isConnected={isTradingConnected}
            lastSync={lastSync}
            error={tradingError}
            onSync={syncPositions}
            onRefresh={refreshPositions}
          />
        </div>

        <div className="space-y-8">
          <PortfolioAnalyticsComponent />
          {/* <SystemAnalyticsComponent /> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;