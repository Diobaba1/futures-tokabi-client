// src/pages/analytics/PortfolioAnalytics.tsx
import React, { useEffect, useState } from 'react';
import { useAnalytics } from '../../components/contexts/AnalyticsContext';
import { PortfolioAnalytics as PortfolioAnalyticsType, TradeSummary } from '../../types/analytics.types';
import { websocketService } from '../../api/services/websocketService';
import { PortfolioUpdateMessage } from '../../types/websocket.types';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Shield, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface PartialPortfolioUpdate {
  available_balance: number;
  total_wallet_balance: number;
  total_unrealized_profit: number;
  leverage: number;
}

const PortfolioAnalyticsComponent: React.FC = () => {
  const { portfolio, fetchPortfolio } = useAnalytics();
  const [wsUpdate, setWsUpdate] = useState<PartialPortfolioUpdate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await fetchPortfolio();
      } catch (err: any) {
        setError('Failed to load portfolio data');
        console.error('Portfolio analytics error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    const handleUpdate = (e: CustomEvent<PortfolioUpdateMessage>) => {
      setWsUpdate({
        available_balance: e.detail.data.available_balance,
        total_wallet_balance: e.detail.data.total_wallet_balance,
        total_unrealized_profit: e.detail.data.total_unrealized_profit,
        leverage: e.detail.data.leverage,
      });
      // Refetch full analytics for comprehensive update
      fetchPortfolio().catch((err: any) => {
        console.error('Error refetching portfolio:', err);
      });
    };

    window.addEventListener('portfolioUpdate', handleUpdate as EventListener);
    
    return () => {
      window.removeEventListener('portfolioUpdate', handleUpdate as EventListener);
    };
  }, [fetchPortfolio]);

  const combinedPortfolio = portfolio ? {
    ...portfolio,
    balance: wsUpdate ? {
      ...portfolio.balance,
      current_balance_usd: wsUpdate.available_balance,
      total_balance_usd: wsUpdate.total_wallet_balance,
      unrealized_pnl_usd: wsUpdate.total_unrealized_profit,
      unrealized_pnl_percent: wsUpdate.total_wallet_balance > 0 ? 
        (wsUpdate.total_unrealized_profit / wsUpdate.total_wallet_balance * 100) : 0,
    } : portfolio.balance,
    risk: wsUpdate ? {
      ...portfolio.risk,
      leverage: wsUpdate.leverage,
      current_drawdown_percent: wsUpdate.total_wallet_balance > 0 ? 
        (wsUpdate.total_unrealized_profit / wsUpdate.total_wallet_balance * 100) : 0,
    } : portfolio.risk,
  } : null;

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await fetchPortfolio();
    } catch (err: any) {
      setError('Failed to refresh portfolio data');
      console.error('Portfolio refresh error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-96 bg-gray-900 rounded-2xl border border-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg font-medium">Loading Portfolio Analytics...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !combinedPortfolio) {
    return (
      <div className="min-h-96 bg-gray-900 rounded-2xl border border-gray-800 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Unable to Load Data</h3>
          <p className="text-gray-400 mb-4">
            {error || 'No portfolio data available'}
          </p>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-bold rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { balance, performance, risk, recent_trades } = combinedPortfolio;

  const getPnLColor = (value: number) => 
    value >= 0 ? 'text-green-400' : 'text-red-400';

  const getPnLIcon = (value: number) => 
    value >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />;

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  const formatPercent = (value: number) => 
    `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Portfolio Analytics</h2>
          <p className="text-gray-400">Real-time performance and risk metrics</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-xl border border-gray-700">
            <div className={`w-2 h-2 rounded-full ${wsUpdate ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
            <span className="text-sm text-gray-400">
              {wsUpdate ? 'Live Updates' : 'Last Snapshot'}
            </span>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 transition-all duration-300 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Balance */}
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-yellow-400" />
            <div className={`flex items-center gap-1 ${getPnLColor(balance.unrealized_pnl_usd)}`}>
              {getPnLIcon(balance.unrealized_pnl_usd)}
              <span className="text-sm font-medium">
                {formatPercent(balance.unrealized_pnl_percent)}
              </span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {formatCurrency(balance.total_balance_usd)}
          </h3>
          <p className="text-gray-400 text-sm">Total Portfolio Value</p>
          <div className="mt-2 text-xs text-gray-500">
            Available: {formatCurrency(balance.current_balance_usd)}
          </div>
        </div>

        {/* Performance */}
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-green-400" />
            <Target className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {performance.win_rate}%
          </h3>
          <p className="text-gray-400 text-sm">Win Rate</p>
          <div className="mt-2 text-xs text-gray-500">
            Profit Factor: {performance.profit_factor.toFixed(2)}
          </div>
        </div>

        {/* Risk Metrics */}
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <Shield className="w-8 h-8 text-red-400" />
            <AlertTriangle className="w-5 h-5 text-orange-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {risk.max_drawdown_percent.toFixed(1)}%
          </h3>
          <p className="text-gray-400 text-sm">Max Drawdown</p>
          <div className="mt-2 text-xs text-gray-500">
            Leverage: {risk.leverage}x
          </div>
        </div>

        {/* Active Protection */}
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle2 className="w-8 h-8 text-blue-400" />
            <Clock className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {risk.consecutive_losses}
          </h3>
          <p className="text-gray-400 text-sm">Consecutive Losses</p>
          <div className="mt-2 text-xs text-gray-500">
            {risk.consecutive_losses >= 2 ? 'Risk Protection Active' : 'Normal Operation'}
          </div>
        </div>
      </div>

      {/* Detailed Metrics & Recent Trades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Details */}
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-400" />
            Performance Details
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-700/50">
              <span className="text-gray-400">Total Return</span>
              <span className={`font-semibold ${getPnLColor(balance.unrealized_pnl_usd)}`}>
                {formatCurrency(balance.unrealized_pnl_usd)}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-700/50">
              <span className="text-gray-400">Return Percentage</span>
              <span className={`font-semibold ${getPnLColor(balance.unrealized_pnl_percent)}`}>
                {formatPercent(balance.unrealized_pnl_percent)}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-700/50">
              <span className="text-gray-400">Sharpe Ratio</span>
              <span className="font-semibold text-white">
                {performance.sharpe_ratio?.toFixed(2) || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-400">Total Trades</span>
              <span className="font-semibold text-white">
                {performance.total_trades}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Trades */}
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-400" />
            Recent Trades
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {recent_trades.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No recent trades
              </div>
            ) : (
              recent_trades.map((trade: TradeSummary) => (
                <div
                  key={trade.id}
                  className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl border border-gray-600/30 hover:border-gray-500/50 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      trade.side === 'LONG' ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                      {trade.side === 'LONG' ? 
                        <ArrowUpRight className="w-4 h-4 text-green-400" /> : 
                        <ArrowDownRight className="w-4 h-4 text-red-400" />
                      }
                    </div>
                    <div>
                      <div className="font-semibold text-white">{trade.symbol}</div>
                      <div className="text-xs text-gray-400 capitalize">{trade.side.toLowerCase()}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${getPnLColor(trade.pnl_usd)}`}>
                      {formatCurrency(trade.pnl_usd)}
                    </div>
                    <div className={`text-xs ${getPnLColor(trade.pnl_percent)}`}>
                      {formatPercent(trade.pnl_percent)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Risk Management Status */}
      <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl p-6 border border-yellow-500/20">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-yellow-400" />
          Risk Management Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-black/20 rounded-xl">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {risk.consecutive_losses}/3
            </div>
            <div className="text-sm text-gray-300">Consecutive Losses</div>
            <div className="text-xs text-gray-400 mt-1">
              {risk.consecutive_losses >= 2 ? 'Approaching Limit' : 'Within Limits'}
            </div>
          </div>
          <div className="text-center p-4 bg-black/20 rounded-xl">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {risk.leverage}x
            </div>
            <div className="text-sm text-gray-300">Current Leverage</div>
            <div className="text-xs text-gray-400 mt-1">
              {risk.leverage > 5 ? 'High Leverage' : 'Normal'}
            </div>
          </div>
          <div className="text-center p-4 bg-black/20 rounded-xl">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {risk.max_drawdown_percent.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-300">Drawdown Protection</div>
            <div className="text-xs text-gray-400 mt-1">
              {risk.current_drawdown_percent > 10 ? 'Monitor Closely' : 'Healthy'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioAnalyticsComponent;