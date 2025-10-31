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
  RefreshCw,
  BarChart3,
  Cpu,
  Database,
  Zap,
} from 'lucide-react';

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
      <div className="min-h-96 bg-gray-800/20 backdrop-blur-sm rounded-xl border border-gray-700/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg font-light">
            Loading Institutional Analytics...
          </p>
        </div>
      </div>
    );
  }

  if (error && !portfolio) {
    return (
      <div className="min-h-96 bg-gray-800/20 backdrop-blur-sm rounded-xl border border-gray-700/30 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Data Connection Issue
          </h3>
          <p className="text-gray-400 mb-4 max-w-md text-sm font-light">{error}</p>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-lg hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 disabled:opacity-50 flex items-center mx-auto text-sm"
          >
            {isLoading && <RefreshCw className="w-4 h-4 animate-spin mr-2" />}
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const getPnLColor = (value: number) =>
    value >= 0 ? "text-emerald-400" : "text-red-400";

  const getPnLIcon = (value: number) =>
    value >= 0 ? (
      <TrendingUp className="w-4 h-4" />
    ) : (
      <TrendingDown className="w-4 h-4" />
    );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
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
          <h2 className="text-2xl lg:text-3xl font-light text-white mb-2">
            Portfolio Analytics
          </h2>
          <p className="text-gray-400 text-sm font-light">
            Institutional-grade performance monitoring and risk assessment
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-2">
            {lastRefresh && (
              <p className="text-xs text-gray-500 font-light">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800/30 rounded-lg border border-gray-700/30 text-gray-400 hover:text-white hover:border-gray-600/50 transition-all duration-300 disabled:opacity-50 text-sm font-medium"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Balance */}
        <div className="bg-gray-800/20 backdrop-blur-sm rounded-xl p-5 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center border border-cyan-500/30">
              <DollarSign className="w-5 h-5 text-cyan-400" />
            </div>
            <div
              className={`flex items-center gap-1 text-sm font-medium ${getPnLColor(
                portfolio?.total_unrealized_profit || 0
              )}`}
            >
              {getPnLIcon(portfolio?.total_unrealized_profit || 0)}
              <span>{formatPercent(unrealized_pnl_percent)}</span>
            </div>
          </div>
          <h3 className="text-2xl font-light text-white mb-1">
            {formatCurrency(portfolio?.total_wallet_balance || 0)}
          </h3>
          <p className="text-gray-400 text-sm font-light">Portfolio Value</p>
          <div className="mt-2 text-xs text-gray-500 font-light">
            Available: {formatCurrency(portfolio?.available_balance || 0)}
          </div>
        </div>

        {/* Unrealized Profit */}
        <div className="bg-gray-800/20 backdrop-blur-sm rounded-xl p-5 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-lg flex items-center justify-center border border-emerald-500/30">
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
            <Shield className="w-4 h-4 text-blue-400" />
          </div>
          <h3 className={`text-2xl font-light mb-1 ${getPnLColor(portfolio?.total_unrealized_profit || 0)}`}>
            {formatCurrency(portfolio?.total_unrealized_profit || 0)}
          </h3>
          <p className="text-gray-400 text-sm font-light">Unrealized P&L</p>
          <div className="mt-2 text-xs text-gray-500 font-light">
            Margin: {formatCurrency(portfolio?.total_margin_balance || 0)}
          </div>
        </div>

        {/* Leverage */}
        <div className="bg-gray-800/20 backdrop-blur-sm rounded-xl p-5 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-violet-500/30">
              <TrendingUp className="w-5 h-5 text-violet-400" />
            </div>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <h3 className="text-2xl font-light text-white mb-1">
            {portfolio?.leverage ? `${portfolio.leverage.toFixed(1)}x` : '0x'}
          </h3>
          <p className="text-gray-400 text-sm font-light">Leverage</p>
          <div className="mt-2 text-xs text-gray-500 font-light">
            Initial Margin: {formatCurrency(portfolio?.total_initial_margin || 0)}
          </div>
        </div>

        {/* Performance */}
        <div className="bg-gray-800/20 backdrop-blur-sm rounded-xl p-5 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
              <BarChart3 className="w-5 h-5 text-blue-400" />
            </div>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <h3 className="text-2xl font-light text-white mb-1">
            {formatPercent(unrealized_pnl_percent)}
          </h3>
          <p className="text-gray-400 text-sm font-light">Performance</p>
          <div className="mt-2 text-xs text-gray-500 font-light">
            {Math.abs(unrealized_pnl_percent) > 5 ? "High Volatility" : "Stable"}
          </div>
        </div>
      </div>

      {/* Detailed Metrics & Recent Trades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Details */}
        <div className="bg-gray-800/20 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            Portfolio Metrics
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Total Wallet Balance', value: formatCurrency(portfolio?.total_wallet_balance || 0) },
              { label: 'Available Balance', value: formatCurrency(portfolio?.available_balance || 0) },
              { label: 'Total Margin Balance', value: formatCurrency(portfolio?.total_margin_balance || 0) },
              { label: 'Initial Margin', value: formatCurrency(portfolio?.total_initial_margin || 0) },
              { label: 'Last Synced', value: portfolio?.last_synced ? new Date(portfolio.last_synced).toLocaleString() : 'N/A' },
            ].map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700/30 last:border-b-0">
                <span className="text-gray-400 text-sm font-light">{item.label}</span>
                <span className="font-medium text-white text-sm">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Trades */}
        <div className="bg-gray-800/20 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            Recent Activity
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {(recentTrades || []).length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm font-light">
                No trading activity
              </div>
            ) : (
              recentTrades.map((trade) => (
                <div
                  key={trade.id}
                  className="flex items-center justify-between p-3 bg-gray-700/20 rounded-lg border border-gray-600/20 hover:border-gray-500/30 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-1.5 rounded ${
                        trade.side === "long"
                          ? "bg-emerald-500/20 border border-emerald-500/30"
                          : "bg-red-500/20 border border-red-500/30"
                      }`}
                    >
                      {trade.side === "long" ? (
                        <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 text-red-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-white text-sm">
                        {trade.symbol}
                      </div>
                      <div className="text-xs text-gray-400 capitalize font-light">
                        {trade.side} • {trade.quantity} units
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-semibold text-sm ${getPnLColor(trade.realized_pnl_usd || 0)}`}
                    >
                      {formatCurrency(trade.realized_pnl_usd || 0)}
                    </div>
                    <div
                      className={`text-xs font-light ${getPnLColor(
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
      <div className="bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-xl p-6 border border-cyan-500/20">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          Risk Assessment
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-800/20 rounded-lg border border-gray-700/30">
            <div className="text-xl font-light text-cyan-400 mb-1">
              {formatCurrency(portfolio?.total_initial_margin || 0)}
            </div>
            <div className="text-sm text-gray-300 font-light">Initial Margin</div>
            <div className="text-xs text-gray-400 mt-1 font-light">
              Required collateral
            </div>
          </div>
          <div className="text-center p-4 bg-gray-800/20 rounded-lg border border-gray-700/30">
            <div className="text-xl font-light text-violet-400 mb-1">
              {portfolio?.leverage ? `${portfolio.leverage.toFixed(1)}x` : '0x'}
            </div>
            <div className="text-sm text-gray-300 font-light">Leverage</div>
            <div className="text-xs text-gray-400 mt-1 font-light">
              {portfolio?.leverage && portfolio.leverage > 5 ? "Elevated Risk" : "Within Limits"}
            </div>
          </div>
          <div className="text-center p-4 bg-gray-800/20 rounded-lg border border-gray-700/30">
            <div className={`text-xl font-light mb-1 ${getPnLColor(portfolio?.total_unrealized_profit || 0)}`}>
              {formatPercent(unrealized_pnl_percent)}
            </div>
            <div className="text-sm text-gray-300 font-light">Performance</div>
            <div className="text-xs text-gray-400 mt-1 font-light">
              {Math.abs(unrealized_pnl_percent) > 5 ? "Monitor Positions" : "Stable"}
            </div>
          </div>
        </div>
      </div>

      {/* Fallback Notice if Error but Data Available */}
      {error && portfolio && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-amber-400 text-sm font-light">
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