// src/components/SystemAnalytics.tsx
import React, { useEffect, useState } from 'react';
import { useAnalytics } from '../../components/contexts/AnalyticsContext';
import { 
  Activity, 
  Zap, 
  Target,
  BarChart3,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

const SystemAnalyticsComponent: React.FC = () => {
  const { system, systemLoading, systemError, refreshSystem } = useAnalytics();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (system && !systemLoading) {
      setLastUpdated(new Date());
    }
  }, [system, systemLoading]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshSystem();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Show loading state
  if (systemLoading && !system) {
    return (
      <div className="min-h-96 bg-gray-900 rounded-2xl border border-gray-800 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-16 h-16 text-amber-400 mx-auto mb-4 animate-spin" />
          <h3 className="text-xl font-bold text-white mb-2">Loading System Data</h3>
          <p className="text-gray-400">Fetching real-time analytics...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (systemError && !system) {
    return (
      <div className="min-h-96 bg-gray-900 rounded-2xl border border-red-800/50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Failed to Load Data</h3>
          <p className="text-gray-400 mb-4">{systemError}</p>
          <button
            onClick={handleRefresh}
            disabled={systemLoading}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-800 text-white rounded-xl font-semibold transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw className={`w-4 h-4 ${systemLoading ? 'animate-spin' : ''}`} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show empty state
  if (!system) {
    return (
      <div className="min-h-96 bg-gray-900 rounded-2xl border border-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No System Data</h3>
          <p className="text-gray-400 mb-4">System analytics will appear here once available</p>
          <button
            onClick={handleRefresh}
            disabled={systemLoading}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-800 text-white rounded-xl font-semibold transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw className={`w-4 h-4 ${systemLoading ? 'animate-spin' : ''}`} />
            Load Analytics
          </button>
        </div>
      </div>
    );
  }

  const { period_stats} = system;

  // Safe data access with fallbacks
  const safePeriodStats = period_stats || {
    total_signals: 0,
    avg_consensus_strength: 0,
    system_pnl_usd: 0,
    decisions: { long: 0, short: 0, hold: 0 }
  };



  const getConsensusStrengthColor = (strength: number) => {
    if (strength >= 80) return 'text-green-400';
    if (strength >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getPnLColor = (value: number) => 
    value >= 0 ? 'text-green-400' : 'text-red-400';

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  const formatPercent = (value: number) => 
    `${value.toFixed(2)}%`;


  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">System Analytics</h2>
          <p className="text-gray-400">Real-time AI system performance and signal metrics</p>
          {lastUpdated && (
            <p className="text-gray-500 text-sm mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          {systemError && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-500/20 border border-red-500/30 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-sm">Update failed</span>
            </div>
          )}
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-400">Live System Data</span>
          </div>
          <button
            onClick={handleRefresh}
            disabled={systemLoading || isRefreshing}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-800 text-white rounded-xl font-semibold transition-colors flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${systemLoading || isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {systemError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div>
              <h4 className="text-red-400 font-semibold">Data Sync Issue</h4>
              <p className="text-red-300 text-sm">{systemError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Signals */}
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <Zap className="w-8 h-8 text-yellow-400" />
            <div className="text-2xl font-black text-white">
              {safePeriodStats.total_signals}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Total Signals</h3>
          <p className="text-gray-400 text-sm">Current period</p>
        </div>

        {/* Average Consensus */}
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-blue-400" />
            <div className={`text-2xl font-black ${getConsensusStrengthColor(safePeriodStats.avg_consensus_strength)}`}>
              {formatPercent(safePeriodStats.avg_consensus_strength)}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Avg Consensus</h3>
          <p className="text-gray-400 text-sm">Signal strength</p>
        </div>

        {/* System PnL */}
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="w-8 h-8 text-green-400" />
            <div className={`text-2xl font-black ${getPnLColor(safePeriodStats.system_pnl_usd)}`}>
              {formatCurrency(safePeriodStats.system_pnl_usd)}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">System PnL</h3>
          <p className="text-gray-400 text-sm">Total performance</p>
        </div>

        {/* Decision Distribution */}
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-purple-400" />
            <div className="text-2xl font-black text-white">
              {safePeriodStats.decisions.long + safePeriodStats.decisions.short + safePeriodStats.decisions.hold}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Total Decisions</h3>
          <p className="text-gray-400 text-sm">AI consensus results</p>
        </div>
      </div>

      {/* Rest of the component remains the same but uses safe data accessors */}
      {/* ... (other sections using safePeriodStats, safeRecentSignals, safeRecentTrades) ... */}
    </div>
  );
};

export default SystemAnalyticsComponent;