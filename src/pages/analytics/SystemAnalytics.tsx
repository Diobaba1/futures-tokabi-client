// src/components/SystemAnalytics.tsx
import React from 'react';
import { useAnalytics } from '../../components/contexts/AnalyticsContext';
import { SystemAnalytics as SystemAnalyticsType, SignalSummary, SystemTradeSummary } from '../../types/analytics.types';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Pause, 
  Users, 
  Zap, 
  Target,
  Clock,
  BarChart3,
  Shield,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

const SystemAnalyticsComponent: React.FC = () => {
  const { system } = useAnalytics();

  if (!system) {
    return (
      <div className="min-h-96 bg-gray-900 rounded-2xl border border-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No System Data</h3>
          <p className="text-gray-400">System analytics will appear here once available</p>
        </div>
      </div>
    );
  }

  const { period_stats, recent_signals, recent_trades } = system;

  const getDecisionColor = (type: 'long' | 'short' | 'hold') => {
    switch (type) {
      case 'long': return 'text-green-400';
      case 'short': return 'text-red-400';
      case 'hold': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getDecisionIcon = (type: 'long' | 'short' | 'hold') => {
    switch (type) {
      case 'long': return <TrendingUp className="w-4 h-4" />;
      case 'short': return <TrendingDown className="w-4 h-4" />;
      case 'hold': return <Pause className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
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
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">System Analytics</h2>
          <p className="text-gray-400">Real-time AI system performance and signal metrics</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-xl border border-gray-700">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-400">Live System Data</span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Signals */}
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <Zap className="w-8 h-8 text-yellow-400" />
            <div className="text-2xl font-black text-white">
              {period_stats.total_signals}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Total Signals</h3>
          <p className="text-gray-400 text-sm">Current period</p>
        </div>

        {/* Average Consensus */}
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-blue-400" />
            <div className={`text-2xl font-black ${getConsensusStrengthColor(period_stats.avg_consensus_strength)}`}>
              {formatPercent(period_stats.avg_consensus_strength)}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Avg Consensus</h3>
          <p className="text-gray-400 text-sm">Signal strength</p>
        </div>

        {/* System PnL */}
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="w-8 h-8 text-green-400" />
            <div className={`text-2xl font-black ${getPnLColor(period_stats.system_pnl_usd)}`}>
              {formatCurrency(period_stats.system_pnl_usd)}
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
              {period_stats.decisions.long + period_stats.decisions.short + period_stats.decisions.hold}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Total Decisions</h3>
          <p className="text-gray-400 text-sm">AI consensus results</p>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Decision Breakdown */}
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            Decision Distribution
          </h3>
          <div className="space-y-4">
            {[
              { type: 'long' as const, label: 'Long Signals', value: period_stats.decisions.long },
              { type: 'short' as const, label: 'Short Signals', value: period_stats.decisions.short },
              { type: 'hold' as const, label: 'Hold Signals', value: period_stats.decisions.hold }
            ].map((decision, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-700/50 last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getDecisionColor(decision.type)} bg-opacity-20`}>
                    {getDecisionIcon(decision.type)}
                  </div>
                  <span className="text-gray-300">{decision.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold">{decision.value}</span>
                  <span className="text-gray-500 text-sm">
                    ({((decision.value / period_stats.total_signals) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Signals */}
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Recent Signals
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {recent_signals.slice(0, 10).map((signal: SignalSummary) => (
              <div
                key={signal.id}
                className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl border border-gray-600/30 hover:border-gray-500/50 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    signal.decision === 'LONG' ? 'bg-green-500/20' : 
                    signal.decision === 'SHORT' ? 'bg-red-500/20' : 'bg-yellow-500/20'
                  }`}>
                    {signal.decision === 'LONG' ? 
                      <TrendingUp className="w-4 h-4 text-green-400" /> : 
                      signal.decision === 'SHORT' ? 
                      <TrendingDown className="w-4 h-4 text-red-400" /> :
                      <Pause className="w-4 h-4 text-yellow-400" />
                    }
                  </div>
                  <div>
                    <div className="font-semibold text-white">{signal.symbol}</div>
                    <div className="text-xs text-gray-400 capitalize">{signal.decision.toLowerCase()}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${getConsensusStrengthColor(signal.consensus_strength)}`}>
                    {signal.consensus_strength.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-400">Strength</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Trades */}
      <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Users className="w-5 h-5 text-green-400" />
          Recent System Trades
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left py-4 px-4 text-gray-400 font-semibold">User</th>
                <th className="text-left py-4 px-4 text-gray-400 font-semibold">Symbol</th>
                <th className="text-left py-4 px-4 text-gray-400 font-semibold">Direction</th>
                <th className="text-right py-4 px-4 text-gray-400 font-semibold">PnL</th>
                <th className="text-right py-4 px-4 text-gray-400 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent_trades.slice(0, 10).map((trade: SystemTradeSummary) => (
                <tr key={trade.id} className="border-b border-gray-700/30 last:border-b-0 hover:bg-gray-700/20 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">U</span>
                      </div>
                      <span className="text-white font-medium">#{trade.user_id.slice(0, 8)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-white font-semibold">{trade.symbol}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      trade.side === 'LONG' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {trade.side === 'LONG' ? 
                        <TrendingUp className="w-3 h-3" /> : 
                        <TrendingDown className="w-3 h-3" />
                      }
                      {trade.side}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className={`font-bold ${getPnLColor(trade.pnl_usd)}`}>
                      {formatCurrency(trade.pnl_usd)}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className={`inline-flex items-center gap-1 ${
                      trade.pnl_usd >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {trade.pnl_usd >= 0 ? 
                        <CheckCircle2 className="w-4 h-4" /> : 
                        <AlertTriangle className="w-4 h-4" />
                      }
                      <span className="text-sm font-medium">
                        {trade.pnl_usd >= 0 ? 'Profitable' : 'Loss'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-gradient-to-r from-yellow-500/10 to-green-500/10 rounded-2xl p-6 border border-yellow-500/20">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-yellow-400" />
          System Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-black/20 rounded-xl">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {period_stats.total_signals}
            </div>
            <div className="text-sm text-gray-300">Signals Processed</div>
            <div className="text-xs text-gray-400 mt-1">Current Period</div>
          </div>
          <div className="text-center p-4 bg-black/20 rounded-xl">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {formatPercent(period_stats.avg_consensus_strength)}
            </div>
            <div className="text-sm text-gray-300">Avg Consensus</div>
            <div className="text-xs text-gray-400 mt-1">
              {period_stats.avg_consensus_strength >= 70 ? 'Strong' : 'Moderate'}
            </div>
          </div>
          <div className="text-center p-4 bg-black/20 rounded-xl">
            <div className={`text-2xl font-bold ${getPnLColor(period_stats.system_pnl_usd)} mb-1`}>
              {formatCurrency(period_stats.system_pnl_usd)}
            </div>
            <div className="text-sm text-gray-300">System PnL</div>
            <div className="text-xs text-gray-400 mt-1">
              {period_stats.system_pnl_usd >= 0 ? 'Profitable' : 'Monitoring'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemAnalyticsComponent;