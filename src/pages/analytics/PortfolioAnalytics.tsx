// src/pages/analytics/PortfolioAnalytics.tsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "../../components/contexts/AuthContext";
import { portfolioService } from "../../api/services/portfolioService";
import { tradeService } from "../../api/services/tradeService";
import { PortfolioResponse } from "../../types/portfolio.types";
import { TradeDetailResponse } from "../../types/trades.types";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Shield,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

const PortfolioAnalyticsComponent: React.FC = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null);
  const [recentTrades, setRecentTrades] = useState<TradeDetailResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const hasLoadedRef = useRef(false);

  const loadData = useCallback(
    async (isRetry = false) => {
      try {
        setIsLoading(true);
        if (!isRetry) setError(null);
        const portfolioData = await portfolioService.getPortfolio();
        setPortfolio(portfolioData);
        const tradesData = await tradeService.getTrades({ limit: 10 });
        setRecentTrades(tradesData.trades || []);
        setLastRefresh(new Date());
      } catch (err: any) {
        const errorMsg = isRetry
          ? "Failed to load portfolio data (retry failed)"
          : "Failed to load portfolio data";
        setError(errorMsg);
        console.error("Portfolio analytics error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    if (user) {
      loadData();
    }
  }, [loadData, user]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (lastRefresh) {
        const now = Date.now();
        const lastUpdateTime = lastRefresh.getTime();
        if (now - lastUpdateTime > 60000) {  // Poll every 60 seconds
          loadData(true).catch((err: any) => {
            console.error("Polling error:", err);
          });
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [lastRefresh, loadData]);

  const handleRefresh = async () => {
    await loadData(true);
  };

  if (isLoading && !portfolio) {
    return (
      <div className="min-h-96 bg-gray-900 rounded-2xl border border-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg font-medium">
            Loading Portfolio Analytics...
          </p>
        </div>
      </div>
    );
  }

  if (error && !portfolio) {
    return (
      <div className="min-h-96 bg-gray-900 rounded-2xl border border-gray-800 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            Unable to Load Data
          </h3>
          <p className="text-gray-400 mb-2">{error}</p>
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

  const getPnLColor = (value: number) =>
    value >= 0 ? "text-green-400" : "text-red-400";

  const getPnLIcon = (value: number) =>
    value >= 0 ? (
      <TrendingUp className="w-5 h-5" />
    ) : (
      <TrendingDown className="w-5 h-5" />
    );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  const formatPercent = (value: number) =>
    `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;

  const unrealized_pnl_percent = portfolio
    ? (portfolio.total_unrealized_profit / portfolio.total_wallet_balance) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Portfolio Analytics
          </h2>
          <p className="text-gray-400">
            Real-time performance and risk metrics
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-2">
            {lastRefresh && (
              <p className="text-xs text-gray-500">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 transition-all duration-300 disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Balance */}
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-yellow-400" />
            <div
              className={`flex items-center gap-1 ${getPnLColor(
                portfolio?.total_unrealized_profit || 0
              )}`}
            >
              {getPnLIcon(portfolio?.total_unrealized_profit || 0)}
              <span className="text-sm font-medium">
                {formatPercent(unrealized_pnl_percent)}
              </span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {formatCurrency(portfolio?.total_wallet_balance || 0)}
          </h3>
          <p className="text-gray-400 text-sm">Total Wallet Balance</p>
          <div className="mt-2 text-xs text-gray-500">
            Available: {formatCurrency(portfolio?.available_balance || 0)}
          </div>
        </div>

        {/* Unrealized Profit */}
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-green-400" />
            <Shield className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className={`text-2xl font-bold mb-1 ${getPnLColor(portfolio?.total_unrealized_profit || 0)}`}>
            {formatCurrency(portfolio?.total_unrealized_profit || 0)}
          </h3>
          <p className="text-gray-400 text-sm">Unrealized P&L</p>
          <div className="mt-2 text-xs text-gray-500">
            Margin Balance: {formatCurrency(portfolio?.total_margin_balance || 0)}
          </div>
        </div>

        {/* Leverage */}
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-purple-400" />
            <AlertTriangle className="w-5 h-5 text-orange-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {portfolio?.leverage ? `${portfolio.leverage.toFixed(1)}x` : '0x'}
          </h3>
          <p className="text-gray-400 text-sm">Leverage</p>
          <div className="mt-2 text-xs text-gray-500">
            Initial Margin: {formatCurrency(portfolio?.total_initial_margin || 0)}
          </div>
        </div>
      </div>

      {/* Detailed Metrics & Recent Trades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Details */}
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-400" />
            Portfolio Details
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-700/50">
              <span className="text-gray-400">Total Wallet Balance</span>
              <span className="font-semibold text-white">
                {formatCurrency(portfolio?.total_wallet_balance || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-700/50">
              <span className="text-gray-400">Available Balance</span>
              <span className="font-semibold text-white">
                {formatCurrency(portfolio?.available_balance || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-700/50">
              <span className="text-gray-400">Total Margin Balance</span>
              <span className="font-semibold text-white">
                {formatCurrency(portfolio?.total_margin_balance || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-400">Last Synced</span>
              <span className="font-semibold text-white">
                {portfolio?.last_synced ? new Date(portfolio.last_synced).toLocaleString() : 'N/A'}
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
            {(recentTrades || []).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No recent trades
              </div>
            ) : (
              recentTrades.map((trade) => (
                <div
                  key={trade.id}
                  className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl border border-gray-600/30 hover:border-gray-500/50 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        trade.side === "long"
                          ? "bg-green-500/20"
                          : "bg-red-500/20"
                      }`}
                    >
                      {trade.side === "long" ? (
                        <ArrowUpRight className="w-4 h-4 text-green-400" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-white">
                        {trade.symbol}
                      </div>
                      <div className="text-xs text-gray-400 capitalize">
                        {trade.side}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-bold ${getPnLColor(trade.realized_pnl_usd || 0)}`}
                    >
                      {formatCurrency(trade.realized_pnl_usd || 0)}
                    </div>
                    <div
                      className={`text-xs ${getPnLColor(
                        trade.realized_pnl_percent || 0
                      )}`}
                    >
                      {formatPercent(trade.realized_pnl_percent || 0)}
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
          Portfolio Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-black/20 rounded-xl">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {formatCurrency(portfolio?.total_initial_margin || 0)}
            </div>
            <div className="text-sm text-gray-300">Initial Margin</div>
            <div className="text-xs text-gray-400 mt-1">
              Required margin for positions
            </div>
          </div>
          <div className="text-center p-4 bg-black/20 rounded-xl">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {portfolio?.leverage ? `${portfolio.leverage.toFixed(1)}x` : '0x'}
            </div>
            <div className="text-sm text-gray-300">Leverage</div>
            <div className="text-xs text-gray-400 mt-1">
              {portfolio?.leverage && portfolio.leverage > 5 ? "High Leverage" : "Normal"}
            </div>
          </div>
          <div className="text-center p-4 bg-black/20 rounded-xl">
            <div className={`text-2xl font-bold mb-1 ${getPnLColor(portfolio?.total_unrealized_profit || 0)}`}>
              {formatPercent(unrealized_pnl_percent)}
            </div>
            <div className="text-sm text-gray-300">P&L %</div>
            <div className="text-xs text-gray-400 mt-1">
              {Math.abs(unrealized_pnl_percent) > 5 ? "Monitor Closely" : "Stable"}
            </div>
          </div>
        </div>
      </div>

      {/* Fallback Notice if Error but Data Available */}
      {error && portfolio && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <div>
              <p className="text-yellow-400 text-sm">
                Partial data loaded - {error}. Refreshed at{" "}
                {lastRefresh?.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioAnalyticsComponent;