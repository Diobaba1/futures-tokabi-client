import React, { useEffect, useState } from 'react';
import { useAnalytics } from '../../components/contexts/AnalyticsContext';
import { 
  Activity, 
  Zap, 
  Target,
  BarChart3,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Award,
  Shield,
  Rocket,
  Cpu,
  Database,
  LineChart,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface SignalQualityDistribution {
  divine: number;
  excellent: number;
  very_good: number;
  good: number;
  caution: number;
}

interface MostActiveSymbol {
  symbol: string;
  signal_count: number;
}

interface SignalSummary {
  id: string;
  symbol: string;
  decision: string;
  consensus_strength: number;
  signal_quality: string;
  created_at: string;
}

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
      <div className="min-h-96 bg-gray-800/20 backdrop-blur-sm rounded-xl border border-gray-700/30 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-cyan-400 mx-auto mb-4 animate-spin" />
          <h3 className="text-xl font-light text-white mb-2">Loading System Analytics</h3>
          <p className="text-gray-400 text-sm font-light">Initializing institutional data streams...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (systemError && !system) {
    return (
      <div className="min-h-96 bg-gray-800/20 backdrop-blur-sm rounded-xl border border-red-500/20 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-light text-white mb-2">Data Connection Issue</h3>
          <p className="text-gray-400 text-sm mb-4 font-light max-w-md">{systemError}</p>
          <button
            onClick={handleRefresh}
            disabled={systemLoading}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-lg hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 flex items-center gap-2 mx-auto text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${systemLoading ? 'animate-spin' : ''}`} />
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // Show empty state
  if (!system) {
    return (
      <div className="min-h-96 bg-gray-800/20 backdrop-blur-sm rounded-xl border border-gray-700/30 flex items-center justify-center">
        <div className="text-center">
          <Database className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-light text-white mb-2">No Analytics Data</h3>
          <p className="text-gray-400 text-sm mb-4 font-light">System performance metrics will appear here</p>
          <button
            onClick={handleRefresh}
            disabled={systemLoading}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-lg hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 flex items-center gap-2 mx-auto text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${systemLoading ? 'animate-spin' : ''}`} />
            Initialize Analytics
          </button>
        </div>
      </div>
    );
  }

  const { period_stats, analytics_summary, recent_signals, recent_trades } = system;

  // Safe data access with fallbacks
  const safePeriodStats = period_stats || {
    timeframe: "7d",
    total_signals: 0,
    avg_consensus_strength: 0,
    avg_leverage: 0,
    system_pnl_usd: 0,
    success_rate: 0,
    total_futures_ready: 0,
    decisions: { long: 0, short: 0, hold: 0 },
    signal_quality_distribution: { divine: 0, excellent: 0, very_good: 0, good: 0, caution: 0 },
    most_active_symbols: []
  };

  const safeAnalyticsSummary = analytics_summary || {
    total_analyzed_period: 0,
    high_quality_signals: 0,
    avg_risk_reward: 0,
    leverage_distribution: { low_risk: 0, medium_risk: 0, high_risk: 0 }
  };

  const safeRecentSignals: SignalSummary[] = recent_signals || [];
  const safeRecentTrades = recent_trades || [];

  const getConsensusStrengthColor = (strength: number) => {
    if (strength >= 80) return 'text-emerald-400';
    if (strength >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const getPnLColor = (value: number) => 
    value >= 0 ? 'text-emerald-400' : 'text-red-400';

  const getSignalQualityColor = (quality: string) => {
    const colors = {
      divine: 'text-amber-400',
      excellent: 'text-violet-400',
      very_good: 'text-blue-400',
      good: 'text-emerald-400',
      caution: 'text-orange-400'
    };
    return colors[quality as keyof typeof colors] || 'text-gray-400';
  };

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    }).format(value);

  const formatPercent = (value: number) => 
    `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;

  const formatNumber = (value: number) => 
    value.toFixed(2);

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-light text-white mb-2">System Analytics</h2>
          <p className="text-gray-400 text-sm font-light">Institutional-grade AI performance monitoring and signal intelligence</p>
          {lastUpdated && (
            <p className="text-gray-500 text-xs mt-1 font-light">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {systemError && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-sm font-light">Sync issue</span>
            </div>
          )}
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-800/30 rounded-lg border border-gray-700/30">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
            <span className="text-sm text-gray-400 font-light">Live Data</span>
          </div>
          <button
            onClick={handleRefresh}
            disabled={systemLoading || isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800/30 border border-gray-700/30 rounded-lg text-gray-400 hover:text-white hover:border-gray-600/50 transition-all duration-300 disabled:opacity-50 text-sm font-medium"
          >
            <RefreshCw className={`w-4 h-4 ${systemLoading || isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {systemError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <div>
              <h4 className="text-red-400 font-medium text-sm">Data Synchronization Issue</h4>
              <p className="text-red-300 text-xs font-light">{systemError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Signals */}
        <div className="bg-gray-800/20 backdrop-blur-sm rounded-xl p-5 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center border border-cyan-500/30">
              <Zap className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="text-2xl font-light text-white">
              {safePeriodStats.total_signals}
            </div>
          </div>
          <h3 className="text-sm font-medium text-white mb-1">Total Signals</h3>
          <p className="text-gray-400 text-xs font-light">{safePeriodStats.timeframe} period</p>
        </div>

        {/* Average Consensus */}
        <div className="bg-gray-800/20 backdrop-blur-sm rounded-xl p-5 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-violet-500/30">
              <Target className="w-5 h-5 text-violet-400" />
            </div>
            <div className={`text-2xl font-light ${getConsensusStrengthColor(safePeriodStats.avg_consensus_strength)}`}>
              {formatPercent(safePeriodStats.avg_consensus_strength)}
            </div>
          </div>
          <h3 className="text-sm font-medium text-white mb-1">Avg Consensus</h3>
          <p className="text-gray-400 text-xs font-light">Signal confidence</p>
        </div>

        {/* System PnL */}
        <div className="bg-gray-800/20 backdrop-blur-sm rounded-xl p-5 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-lg flex items-center justify-center border border-emerald-500/30">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
            </div>
            <div className={`text-2xl font-light ${getPnLColor(safePeriodStats.system_pnl_usd)}`}>
              {formatCurrency(safePeriodStats.system_pnl_usd)}
            </div>
          </div>
          <h3 className="text-sm font-medium text-white mb-1">System P&L</h3>
          <p className="text-gray-400 text-xs font-light">Net performance</p>
        </div>

        {/* Success Rate */}
        <div className="bg-gray-800/20 backdrop-blur-sm rounded-xl p-5 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-lg flex items-center justify-center border border-amber-500/30">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div className={`text-2xl font-light ${safePeriodStats.success_rate >= 50 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {formatPercent(safePeriodStats.success_rate)}
            </div>
          </div>
          <h3 className="text-sm font-medium text-white mb-1">Success Rate</h3>
          <p className="text-gray-400 text-xs font-light">Trade accuracy</p>
        </div>
      </div>

      {/* Secondary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Average Leverage */}
        <div className="bg-gray-800/20 rounded-lg p-4 border border-gray-700/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded flex items-center justify-center border border-blue-500/30">
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h4 className="text-white font-medium text-sm">Avg Leverage</h4>
              <p className="text-xl font-light text-blue-400">
                {formatNumber(safePeriodStats.avg_leverage)}x
              </p>
            </div>
          </div>
        </div>

        {/* Futures Ready */}
        <div className="bg-gray-800/20 rounded-lg p-4 border border-gray-700/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded flex items-center justify-center border border-emerald-500/30">
              <Rocket className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-white font-medium text-sm">Active Models</h4>
              <p className="text-xl font-light text-emerald-400">
                {safePeriodStats.total_futures_ready}
              </p>
            </div>
          </div>
        </div>

        {/* High Quality Signals */}
        <div className="bg-gray-800/20 rounded-lg p-4 border border-gray-700/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded flex items-center justify-center border border-violet-500/30">
              <Shield className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <h4 className="text-white font-medium text-sm">Premium Signals</h4>
              <p className="text-xl font-light text-violet-400">
                {safeAnalyticsSummary.high_quality_signals}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Signal Quality Distribution */}
      <div className="bg-gray-800/20 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <LineChart className="w-5 h-5 text-cyan-400" />
          Signal Quality Distribution
        </h3>
        <div className="grid grid-cols-2 md:grid-c-5 gap-4">
          {Object.entries(safePeriodStats.signal_quality_distribution).map(([quality, count]) => (
            <div key={quality} className="text-center p-3 bg-gray-700/20 rounded-lg border border-gray-600/20">
              <div className={`text-xl font-light ${getSignalQualityColor(quality)} mb-1`}>
                {count as number}
              </div>
              <div className="text-xs font-medium text-white capitalize font-light">
                {quality.replace('_', ' ')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Most Active Symbols */}
      {safePeriodStats.most_active_symbols.length > 0 && (
        <div className="bg-gray-800/20 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-400" />
            Most Active Instruments
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {safePeriodStats.most_active_symbols.map(({ symbol, signal_count }: MostActiveSymbol) => (
              <div key={symbol} className="text-center p-3 bg-gray-700/20 rounded-lg border border-gray-600/20">
                <div className="text-xl font-light text-white mb-1">
                  {signal_count}
                </div>
                <div className="text-xs font-medium text-cyan-400 font-light">
                  {symbol}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Signals */}
      {safeRecentSignals.length > 0 && (
        <div className="bg-gray-800/20 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-400" />
            Recent Signal Activity
          </h3>
          <div className="space-y-2">
            {safeRecentSignals.slice(0, 5).map((signal: SignalSummary) => (
              <div key={signal.id} className="flex items-center justify-between p-3 bg-gray-700/20 rounded-lg border border-gray-600/20 hover:border-gray-500/30 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    signal.decision === 'long' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                    signal.decision === 'short' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                    'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                    {signal.decision.toUpperCase()}
                  </span>
                  <span className="text-white font-medium text-sm">{signal.symbol}</span>
                  <span className={`text-xs font-light ${getSignalQualityColor(signal.signal_quality)}`}>
                    {signal.signal_quality}
                  </span>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${getConsensusStrengthColor(signal.consensus_strength)}`}>
                    {formatPercent(signal.consensus_strength)}
                  </div>
                  <div className="text-xs text-gray-400 font-light">
                    {new Date(signal.created_at).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemAnalyticsComponent;