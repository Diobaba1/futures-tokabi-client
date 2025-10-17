// src/pages/analytics/PortfolioAnalytics.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useAnalytics } from '../../components/contexts/AnalyticsContext';
import { useAuth } from '../../components/contexts/AuthContext';
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
  RefreshCw,
  Wifi,
  WifiOff,
  Signal
} from 'lucide-react';

interface PartialPortfolioUpdate {
  available_balance: number;
  total_wallet_balance: number;
  total_unrealized_profit: number;
  leverage: number;
}

const PortfolioAnalyticsComponent: React.FC = () => {
  const { portfolio, fetchPortfolio } = useAnalytics();
  const { websocketStatus } = useAuth(); // Get WebSocket status from auth context
  const [wsUpdate, setWsUpdate] = useState<PartialPortfolioUpdate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [lastWsUpdate, setLastWsUpdate] = useState<Date | null>(null);

  const loadData = useCallback(async (isRetry = false) => {
    try {
      setIsLoading(true);
      if (!isRetry) setError(null);
      await fetchPortfolio();
      setLastRefresh(new Date());
    } catch (err: any) {
      const errorMsg = isRetry ? 'Failed to load portfolio data (retry failed)' : 'Failed to load portfolio data';
      setError(errorMsg);
      console.error('Portfolio analytics error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchPortfolio]);

  useEffect(() => {
    loadData();

    const handleUpdate = (e: CustomEvent<PortfolioUpdateMessage>) => {
      try {
        // Validate event data
        if (!e.detail || !e.detail.data) {
          console.warn("Invalid portfolioUpdate event data");
          return;
        }
        const { available_balance, total_wallet_balance, total_unrealized_profit, leverage } = e.detail.data;
        if (typeof available_balance !== 'number' || typeof total_wallet_balance !== 'number' || 
            typeof total_unrealized_profit !== 'number' || typeof leverage !== 'number') {
          console.warn("Invalid types in portfolioUpdate event data");
          return;
        }

        setWsUpdate({
          available_balance,
          total_wallet_balance,
          total_unrealized_profit,
          leverage,
        });
        
        setLastWsUpdate(new Date());
        setLastRefresh(new Date());
        
        // Clear any previous errors on successful update
        if (error) {
          setError(null);
        }
      } catch (error) {
        console.error("Error handling portfolioUpdate:", error);
      }
    };

    const handleWebSocketError = (e: CustomEvent) => {
      console.error("WebSocket error received:", e.detail);
      if (!error) {
        setError("WebSocket connection issue - using fallback data");
      }
    };

    window.addEventListener('portfolioUpdate', handleUpdate as EventListener);
    window.addEventListener('websocketError', handleWebSocketError as EventListener);
    
    return () => {
      window.removeEventListener('portfolioUpdate', handleUpdate as EventListener);
      window.removeEventListener('websocketError', handleWebSocketError as EventListener);
    };
  }, [loadData, error]);

  // Fallback polling if WS disconnected for too long
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const lastUpdateTime = lastRefresh?.getTime() || 0;
      
      // If WebSocket is disconnected and it's been more than 2 minutes since last update
      if (websocketStatus === 'disconnected' && (now - lastUpdateTime) > 120000) {
        loadData(true).catch((err: any) => {
          console.error('Fallback polling error:', err);
        });
      }
      
      // If WebSocket has error status, try to reload data
      if (websocketStatus === 'error' && (now - lastUpdateTime) > 60000) {
        loadData(true).catch((err: any) => {
          console.error('Error status polling error:', err);
        });
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [lastRefresh, loadData, websocketStatus]);

  const combinedPortfolio = portfolio ? {
    ...portfolio,
    balance: wsUpdate ? {
      ...portfolio.balance,
      current_balance_usd: Math.max(0, wsUpdate.available_balance),
      total_balance_usd: Math.max(0, wsUpdate.total_wallet_balance),
      unrealized_pnl_usd: wsUpdate.total_unrealized_profit,
      unrealized_pnl_percent: wsUpdate.total_wallet_balance > 0 ? 
        (wsUpdate.total_unrealized_profit / wsUpdate.total_wallet_balance * 100) : 0,
    } : portfolio.balance,
    risk: wsUpdate ? {
      ...portfolio.risk,
      leverage: Math.max(0, wsUpdate.leverage),
      current_drawdown_percent: wsUpdate.total_wallet_balance > 0 ? 
        (wsUpdate.total_unrealized_profit / wsUpdate.total_wallet_balance * 100) : 0,
    } : portfolio.risk,
  } : null;

  const handleRefresh = async () => {
    await loadData(true);
  };

  const handleManualSync = async () => {
    try {
      const success = websocketService.send({ type: "sync_request" });
      if (success) {
        console.log("Manual sync request sent");
      } else {
        console.warn("Could not send sync request - WebSocket not connected");
        // Fallback to regular refresh if WebSocket is not available
        await loadData(true);
      }
    } catch (err) {
      console.error("Error sending manual sync:", err);
      await loadData(true);
    }
  };

  // Get connection status display
  const getConnectionStatus = () => {
    switch (websocketStatus) {
      case 'connected':
        return { 
          text: 'Live Updates', 
          color: 'bg-green-400', 
          icon: <Wifi className="w-3 h-3" />,
          pulse: true,
          description: 'Real-time data streaming'
        };
      case 'connecting':
        return { 
          text: 'Connecting...', 
          color: 'bg-yellow-400', 
          icon: <Signal className="w-3 h-3 animate-pulse" />,
          pulse: true,
          description: 'Establishing connection'
        };
      case 'error':
        return { 
          text: 'Connection Failed', 
          color: 'bg-red-400', 
          icon: <WifiOff className="w-3 h-3" />,
          pulse: false,
          description: 'WebSocket connection failed'
        };
      case 'disconnected':
        return { 
          text: 'Disconnected', 
          color: 'bg-gray-500', 
          icon: <WifiOff className="w-3 h-3" />,
          pulse: false,
          description: 'WebSocket disconnected'
        };
      default:
        return { 
          text: 'Offline', 
          color: 'bg-gray-500', 
          icon: <WifiOff className="w-3 h-3" />,
          pulse: false,
          description: 'No active connection'
        };
    }
  };

  const connectionStatus = getConnectionStatus();

  // Loading State
  if (isLoading && !portfolio) {
    return (
      <div className="min-h-96 bg-gray-900 rounded-2xl border border-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg font-medium">Loading Portfolio Analytics...</p>
          <p className="text-gray-500 text-sm mt-2">Establishing WebSocket connection...</p>
        </div>
      </div>
    );
  }

  // Error State (with fallback to cached data if available)
  if (error && !combinedPortfolio) {
    return (
      <div className="min-h-96 bg-gray-900 rounded-2xl border border-gray-800 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Unable to Load Data</h3>
          <p className="text-gray-400 mb-2">
            {error}
          </p>
          <p className="text-gray-500 text-sm mb-4">
            WebSocket Status: {websocketStatus}
          </p>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-bold rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 disabled:opacity-50 flex items-center mx-auto"
          >
            {isLoading && <RefreshCw className="w-4 h-4 animate-spin mr-2" />}
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const { balance, performance, risk, recent_trades } = combinedPortfolio || portfolio || { balance: {}, performance: {}, risk: {}, recent_trades: [] };

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
          <div className="flex flex-wrap items-center gap-4 mt-2">
            {lastRefresh && (
              <p className="text-xs text-gray-500">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </p>
            )}
            {lastWsUpdate && websocketStatus === 'connected' && (
              <p className="text-xs text-green-500">
                Live update: {lastWsUpdate.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Connection Status */}
          <div 
            className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-xl border border-gray-700 hover:bg-gray-700/50 transition-colors cursor-help"
            title={connectionStatus.description}
          >
            <div className={`w-2 h-2 rounded-full ${connectionStatus.color} ${connectionStatus.pulse ? 'animate-pulse' : ''}`}></div>
            <div className="flex items-center gap-1.5">
              {connectionStatus.icon}
              <span className="text-sm text-gray-300">
                {connectionStatus.text}
              </span>
            </div>
          </div>
          
          {/* Manual Sync Button */}
          <button
            onClick={handleManualSync}
            disabled={isLoading || websocketStatus !== 'connected'}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 rounded-xl border border-blue-500/30 text-blue-400 hover:text-blue-300 hover:border-blue-400/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            title={websocketStatus === 'connected' ? "Request latest data from server" : "WebSocket not connected"}
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm">Sync</span>
          </button>

          {/* Refresh Button */}
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

      {/* Connection Warning Banner */}
      {websocketStatus === 'error' && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div>
              <p className="text-red-400 font-medium">WebSocket Connection Failed</p>
              <p className="text-red-400/80 text-sm">
                Real-time updates unavailable. Data will refresh every 30 seconds.
                {websocketService.getReconnectAttempts() > 0 && (
                  <span> Reconnect attempts: {websocketService.getReconnectAttempts()}</span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {websocketStatus === 'disconnected' && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <div>
              <p className="text-yellow-400 font-medium">WebSocket Disconnected</p>
              <p className="text-yellow-400/80 text-sm">
                Real-time updates paused. Attempting to reconnect automatically...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Rest of your component remains the same */}
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Balance */}
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-yellow-400" />
            <div className={`flex items-center gap-1 ${getPnLColor(balance.unrealized_pnl_usd || 0)}`}>
              {getPnLIcon(balance.unrealized_pnl_usd || 0)}
              <span className="text-sm font-medium">
                {formatPercent(balance.unrealized_pnl_percent || 0)}
              </span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {formatCurrency(balance.total_balance_usd || 0)}
          </h3>
          <p className="text-gray-400 text-sm">Total Portfolio Value</p>
          <div className="mt-2 text-xs text-gray-500">
            Available: {formatCurrency(balance.current_balance_usd || 0)}
          </div>
        </div>

        {/* Performance */}
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-green-400" />
            <Target className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {performance.win_rate || 0}%
          </h3>
          <p className="text-gray-400 text-sm">Win Rate</p>
          <div className="mt-2 text-xs text-gray-500">
            Profit Factor: {(performance.profit_factor || 0).toFixed(2)}
          </div>
        </div>

        {/* Risk Metrics */}
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <Shield className="w-8 h-8 text-red-400" />
            <AlertTriangle className="w-5 h-5 text-orange-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {(risk.max_drawdown_percent || 0).toFixed(1)}%
          </h3>
          <p className="text-gray-400 text-sm">Max Drawdown</p>
          <div className="mt-2 text-xs text-gray-500">
            Leverage: {(risk.leverage || 0).toFixed(1)}x
          </div>
        </div>

        {/* Active Protection */}
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle2 className="w-8 h-8 text-blue-400" />
            <Clock className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {risk.consecutive_losses || 0}
          </h3>
          <p className="text-gray-400 text-sm">Consecutive Losses</p>
          <div className="mt-2 text-xs text-gray-500">
            { (risk.consecutive_losses || 0) >= 2 ? 'Risk Protection Active' : 'Normal Operation'}
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
              <span className={`font-semibold ${getPnLColor(balance.unrealized_pnl_usd || 0)}`}>
                {formatCurrency(balance.unrealized_pnl_usd || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-700/50">
              <span className="text-gray-400">Return Percentage</span>
              <span className={`font-semibold ${getPnLColor(balance.unrealized_pnl_percent || 0)}`}>
                {formatPercent(balance.unrealized_pnl_percent || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-700/50">
              <span className="text-gray-400">Sharpe Ratio</span>
              <span className="font-semibold text-white">
                {(performance.sharpe_ratio || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-400">Total Trades</span>
              <span className="font-semibold text-white">
                {performance.total_trades || 0}
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
                      <div className="text-xs text-gray-400 capitalize">{trade.side?.toLowerCase() || 'unknown'}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${getPnLColor(trade.pnl_usd || 0)}`}>
                      {formatCurrency(trade.pnl_usd || 0)}
                    </div>
                    <div className={`text-xs ${getPnLColor(trade.pnl_percent || 0)}`}>
                      {formatPercent(trade.pnl_percent || 0)}
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
              {(risk.consecutive_losses || 0)}/3
            </div>
            <div className="text-sm text-gray-300">Consecutive Losses</div>
            <div className="text-xs text-gray-400 mt-1">
              {(risk.consecutive_losses || 0) >= 2 ? 'Approaching Limit' : 'Within Limits'}
            </div>
          </div>
          <div className="text-center p-4 bg-black/20 rounded-xl">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {(risk.leverage || 0).toFixed(1)}x
            </div>
            <div className="text-sm text-gray-300">Current Leverage</div>
            <div className="text-xs text-gray-400 mt-1">
              {(risk.leverage || 0) > 5 ? 'High Leverage' : 'Normal'}
            </div>
          </div>
          <div className="text-center p-4 bg-black/20 rounded-xl">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {(risk.max_drawdown_percent || 0).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-300">Drawdown Protection</div>
            <div className="text-xs text-gray-400 mt-1">
              {(risk.current_drawdown_percent || 0) > 10 ? 'Monitor Closely' : 'Healthy'}
            </div>
          </div>
        </div>
      </div>

      {/* Fallback Notice if Error but Data Available */}
      {error && combinedPortfolio && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <div>
              <p className="text-yellow-400 text-sm">
                Partial data loaded - {error}. Refreshed at {lastRefresh?.toLocaleTimeString()}
              </p>
              <p className="text-yellow-400/80 text-xs mt-1">
                WebSocket Status: {websocketStatus} | Reconnect attempts: {websocketService.getReconnectAttempts()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioAnalyticsComponent;