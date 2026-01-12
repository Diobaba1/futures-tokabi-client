// src/pages/analytics/PortfolioAnalytics.tsx
import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useAuth } from "../../components/contexts/AuthContext";
import { portfolioService } from "../../api/services/portfolioService";
import { PortfolioResponse } from "../../types/portfolio.types";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Shield,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  RefreshCw,
  BarChart3,
  Cpu,
  Database,
  Bitcoin,
  Coins,
  Wallet,
  PieChart,
  Target,
  Gauge,
  Sparkles,
  Layers,
  Zap,
  Eye,
  AlertCircle,
} from 'lucide-react';

// Asset icon mapping
const ASSET_ICONS: { [key: string]: React.ElementType } = {
  BTC: Bitcoin,
  ETH: Sparkles,
  USDT: DollarSign,
  USDC: Coins,
  SOL: Zap,
  ADA: Layers,
};

interface PositionMetrics {
  totalNotional: number;
  winningPositions: number;
  losingPositions: number;
  largestPosition: string;
  averageLeverage: number;
}

const PortfolioAnalyticsComponent: React.FC = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const hasLoadedRef = useRef(false);

  const loadData = useCallback(
    async (isRetry = false) => {
      try {
        setIsLoading(true);
        if (!isRetry) setError(null);
        const portfolioData = await portfolioService.getPortfolio();
        setPortfolio(portfolioData);
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

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh || !user) return;
    
    const interval = setInterval(() => {
      loadData();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, user, loadData]);

  // Calculate position metrics from actual positions array
  const positionMetrics = useMemo((): PositionMetrics => {
    if (!portfolio?.positions || !Array.isArray(portfolio.positions)) {
      return {
        totalNotional: 0,
        winningPositions: 0,
        losingPositions: 0,
        largestPosition: 'N/A',
        averageLeverage: 0,
      };
    }

    const positions = portfolio.positions;
    const totalNotional = positions.reduce((sum: number, pos: any) => sum + (parseFloat(pos.notional) || 0), 0);
    
    const winningPositions = positions.filter((pos: any) => (parseFloat(pos.unRealizedProfit) || 0) > 0).length;
    const losingPositions = positions.filter((pos: any) => (parseFloat(pos.unRealizedProfit) || 0) < 0).length;
    
    const largestPosition = positions.reduce((largest: any, pos: any) => 
      (parseFloat(pos.notional) || 0) > (parseFloat(largest.notional) || 0) ? pos : largest, positions[0] || {}
    );
    
    const averageLeverage = positions.length > 0 ? 
      positions.reduce((sum: number, pos: any) => {
        const leverage = parseFloat(pos.leverage) || 
                        (parseFloat(pos.initialMargin) > 0 ? 
                         (parseFloat(pos.notional) / parseFloat(pos.initialMargin)) : 0);
        return sum + leverage;
      }, 0) / positions.length : 0;

    return {
      totalNotional,
      winningPositions,
      losingPositions,
      largestPosition: largestPosition.symbol || 'N/A',
      averageLeverage,
    };
  }, [portfolio?.positions]);

  // Calculate asset allocation from assets array
  const assetAllocation = useMemo(() => {
    if (!portfolio?.assets || !Array.isArray(portfolio.assets)) return [];
    
    return portfolio.assets.map((asset: any) => ({
      asset: asset.asset,
      walletBalance: parseFloat(asset.walletBalance) || 0,
      unrealizedProfit: parseFloat(asset.unrealizedProfit) || 0,
      marginBalance: parseFloat(asset.marginBalance) || 0,
      maintMargin: parseFloat(asset.maintMargin) || 0,
      initialMargin: parseFloat(asset.initialMargin) || 0,
      positionInitialMargin: parseFloat(asset.positionInitialMargin) || 0,
      openOrderInitialMargin: parseFloat(asset.openOrderInitialMargin) || 0,
      maxWithdrawAmount: parseFloat(asset.maxWithdrawAmount) || 0,
      crossWalletBalance: parseFloat(asset.crossWalletBalance) || 0,
      crossUnPnl: parseFloat(asset.crossUnPnl) || 0,
      availableBalance: parseFloat(asset.availableBalance) || 0,
      marginAvailable: asset.marginAvailable,
      updateTime: asset.updateTime,
      percentage: portfolio.total_wallet_balance > 0 ? 
        (parseFloat(asset.walletBalance) / portfolio.total_wallet_balance) * 100 : 0,
    })).filter(asset => asset.walletBalance > 0);
  }, [portfolio?.assets, portfolio?.total_wallet_balance]);

  // Calculate risk metrics
  const riskMetrics = useMemo(() => {
    if (!portfolio) return null;
    
    const marginUtilization = portfolio.total_margin_balance > 0 ? 
      (portfolio.total_initial_margin / portfolio.total_margin_balance) * 100 : 0;
    const availableLeverage = portfolio.leverage || 0;
    const pnlPercentage = portfolio.total_wallet_balance > 0 ? 
      (portfolio.total_unrealized_profit / portfolio.total_wallet_balance) * 100 : 0;
    
    return {
      marginUtilization,
      availableLeverage,
      pnlPercentage,
      riskLevel: marginUtilization > 80 ? 'High' : marginUtilization > 50 ? 'Medium' : 'Low',
    };
  }, [portfolio]);

  const getPnLColor = (value: number) =>
    value >= 0 ? "text-cyan-300" : "text-rose-400";

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

  const formatNumber = (value: number, decimals: number = 8) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: decimals,
    }).format(value);

  const getAssetIcon = (asset: string) => {
    const IconComponent = ASSET_ICONS[asset] || Coins;
    return <IconComponent className="w-4 h-4" />;
  };

  const handleRefresh = async () => {
    await loadData(true);
  };

  if (isLoading && !portfolio) {
    return (
      <div className="min-h-96 bg-cyan-900/10 backdrop-blur-xl rounded-2xl border border-cyan-500/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-200/80 text-lg font-light">
            Loading Institutional Analytics...
          </p>
        </div>
      </div>
    );
  }

  if (error && !portfolio) {
    return (
      <div className="min-h-96 bg-cyan-900/10 backdrop-blur-xl rounded-2xl border border-cyan-500/20 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-rose-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Data Connection Issue
          </h3>
          <p className="text-cyan-200/60 mb-4 max-w-md text-sm font-light">{error}</p>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-xl hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 disabled:opacity-50 flex items-center mx-auto text-sm shadow-lg shadow-cyan-500/25"
          >
            {isLoading && <RefreshCw className="w-4 h-4 animate-spin mr-2" />}
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-96 bg-cyan-900/10 backdrop-blur-xl rounded-2xl border border-cyan-500/20 flex items-center justify-center">
        <div className="text-center">
          <Database className="w-16 h-16 text-cyan-500/50 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No Portfolio Data
          </h3>
          <p className="text-cyan-200/60 mb-4 text-sm font-light">
            Portfolio data is not available at the moment.
          </p>
        </div>
      </div>
    );
  }

  const unrealized_pnl_percent = portfolio.total_wallet_balance > 0 ? 
    (portfolio.total_unrealized_profit / portfolio.total_wallet_balance) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-light bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent">
              Portfolio Analytics
            </h2>
          </div>
          <p className="text-cyan-200/60 text-sm font-light">
            Real-time portfolio monitoring and risk assessment
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-2">
            {lastRefresh && (
              <p className="text-xs text-cyan-300/50 font-light">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </p>
            )}
            {portfolio.last_synced && (
              <p className="text-xs text-cyan-300/50 font-light">
                System sync: {new Date(portfolio.last_synced).toLocaleString()}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 text-sm font-medium ${
              autoRefresh 
                ? 'bg-cyan-500/20 border-cyan-400/30 text-cyan-300' 
                : 'bg-gray-800/30 border-gray-700/30 text-cyan-200/60 hover:text-cyan-300'
            }`}
          >
            <Eye className="w-4 h-4" />
            Auto-refresh {autoRefresh ? 'On' : 'Off'}
          </button>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 rounded-xl border border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/20 transition-all duration-300 disabled:opacity-50 text-sm font-medium"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Wallet Balance */}
        <div className="bg-cyan-900/10 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center border border-cyan-400/30 group-hover:border-cyan-400/50 transition-all duration-300">
              <Wallet className="w-6 h-6 text-cyan-300" />
            </div>
            <div
              className={`flex items-center gap-1 text-sm font-medium ${getPnLColor(
                portfolio.total_unrealized_profit
              )}`}
            >
              {getPnLIcon(portfolio.total_unrealized_profit)}
              <span>{formatPercent(unrealized_pnl_percent)}</span>
            </div>
          </div>
          <h3 className="text-2xl font-light text-white mb-2">
            {formatCurrency(portfolio.total_wallet_balance)}
          </h3>
          <p className="text-cyan-200/60 text-sm font-light">Total Wallet Balance</p>
          <div className="mt-3 text-xs text-cyan-300/50 font-light bg-cyan-500/10 rounded-lg px-3 py-2">
            Available: {formatCurrency(portfolio.available_balance)}
          </div>
        </div>

        {/* Margin Balance */}
        <div className="bg-cyan-900/10 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center border border-emerald-400/30 group-hover:border-emerald-400/50 transition-all duration-300">
              <Shield className="w-6 h-6 text-emerald-300" />
            </div>
            <Gauge className="w-5 h-5 text-cyan-300" />
          </div>
          <h3 className="text-2xl font-light text-white mb-2">
            {formatCurrency(portfolio.total_margin_balance)}
          </h3>
          <p className="text-cyan-200/60 text-sm font-light">Margin Balance</p>
          <div className="mt-3 text-xs text-cyan-300/50 font-light bg-cyan-500/10 rounded-lg px-3 py-2">
            Initial Margin: {formatCurrency(portfolio.total_initial_margin)}
          </div>
        </div>

        {/* Unrealized Profit */}
        <div className="bg-cyan-900/10 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center border border-violet-400/30 group-hover:border-violet-400/50 transition-all duration-300">
              <Activity className="w-6 h-6 text-violet-300" />
            </div>
            <div
              className={`flex items-center gap-1 text-sm font-medium ${getPnLColor(
                portfolio.total_unrealized_profit
              )}`}
            >
              {getPnLIcon(portfolio.total_unrealized_profit)}
              <span>{formatCurrency(portfolio.total_unrealized_profit)}</span>
            </div>
          </div>
          <h3 className={`text-2xl font-light mb-2 ${getPnLColor(portfolio.total_unrealized_profit)}`}>
            {formatPercent(unrealized_pnl_percent)}
          </h3>
          <p className="text-cyan-200/60 text-sm font-light">Unrealized P&L</p>
          <div className="mt-3 text-xs text-cyan-300/50 font-light bg-cyan-500/10 rounded-lg px-3 py-2">
            {portfolio.total_unrealized_profit >= 0 ? "Profitable" : "Drawdown"}
          </div>
        </div>

        {/* Leverage */}
        <div className="bg-cyan-900/10 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center border border-blue-400/30 group-hover:border-blue-400/50 transition-all duration-300">
              <BarChart3 className="w-6 h-6 text-blue-300" />
            </div>
            <Target className="w-5 h-5 text-cyan-300" />
          </div>
          <h3 className="text-2xl font-light text-white mb-2">
            {portfolio.leverage ? `${portfolio.leverage.toFixed(1)}x` : '0x'}
          </h3>
          <p className="text-cyan-200/60 text-sm font-light">Portfolio Leverage</p>
          <div className="mt-3 text-xs text-cyan-300/50 font-light bg-cyan-500/10 rounded-lg px-3 py-2">
            {positionMetrics.averageLeverage > 10 ? "Aggressive" : "Conservative"}
          </div>
        </div>
      </div>

      {/* Assets & Positions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assets Details */}
        <div className="bg-cyan-900/10 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-cyan-300" />
              Asset Details ({assetAllocation.length})
            </h3>
            <div className="text-xs text-cyan-300/50 font-light">
              Total: {formatCurrency(portfolio.total_wallet_balance)}
            </div>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
            {assetAllocation.map((asset, index) => (
              <div 
                key={asset.asset} 
                className="p-4 bg-cyan-800/10 rounded-xl border border-cyan-500/10 hover:border-cyan-400/30 transition-all duration-200 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-700/20 rounded-lg flex items-center justify-center border border-cyan-500/20 group-hover:border-cyan-400/30 transition-all duration-200">
                      {getAssetIcon(asset.asset)}
                    </div>
                    <div>
                      <div className="font-medium text-white text-sm">
                        {asset.asset}
                      </div>
                      <div className="text-xs text-cyan-200/60 font-light">
                        Allocation: {asset.percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-white">
                      {formatCurrency(asset.walletBalance)}
                    </div>
                    <div className={`text-xs font-light ${getPnLColor(asset.unrealizedProfit)}`}>
                      {formatCurrency(asset.unrealizedProfit)}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-cyan-200/60">Margin Balance:</span>
                    <span className="text-white">{formatCurrency(asset.marginBalance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cyan-200/60">Available:</span>
                    <span className="text-white">{formatCurrency(asset.availableBalance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cyan-200/60">Initial Margin:</span>
                    <span className="text-white">{formatCurrency(asset.initialMargin)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cyan-200/60">Max Withdraw:</span>
                    <span className="text-white">{formatCurrency(asset.maxWithdrawAmount)}</span>
                  </div>
                </div>
                
                {asset.maintMargin > 0 && (
                  <div className="mt-3 pt-3 border-t border-cyan-500/10">
                    <div className="flex justify-between text-xs">
                      <span className="text-cyan-200/60">Maintenance Margin:</span>
                      <span className="text-amber-300">{formatCurrency(asset.maintMargin)}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Active Positions */}
        <div className="bg-cyan-900/10 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-violet-300" />
              Active Positions ({portfolio.positions?.length || 0})
            </h3>
            <div className="text-xs text-cyan-300/50 font-light">
              Total: {formatCurrency(positionMetrics.totalNotional)}
            </div>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
            {portfolio.positions && portfolio.positions.length > 0 ? (
              portfolio.positions.map((position: any, index: number) => (
                <div
                  key={position.symbol || index}
                  className="p-4 bg-cyan-800/10 rounded-xl border border-cyan-500/10 hover:border-cyan-400/30 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          parseFloat(position.unRealizedProfit) >= 0
                            ? "bg-cyan-500/20 border border-cyan-400/30"
                            : "bg-rose-500/20 border border-rose-400/30"
                        }`}
                      >
                        {parseFloat(position.unRealizedProfit) >= 0 ? (
                          <ArrowUpRight className="w-3 h-3 text-cyan-300" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 text-rose-300" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-white text-sm">
                          {position.symbol}
                        </div>
                        <div className="text-xs text-cyan-200/60 font-light">
                          {position.positionSide} • {position.positionAmt} units
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-semibold text-sm ${getPnLColor(parseFloat(position.unRealizedProfit))}`}
                      >
                        {formatCurrency(parseFloat(position.unRealizedProfit))}
                      </div>
                      <div className="text-xs text-cyan-200/60 font-light">
                        {formatCurrency(parseFloat(position.notional))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                    <div className="flex justify-between">
                      <span className="text-cyan-200/60">Entry Price:</span>
                      <span className="text-white">{formatNumber(parseFloat(position.entryPrice))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cyan-200/60">Mark Price:</span>
                      <span className="text-white">{formatNumber(parseFloat(position.markPrice))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cyan-200/60">Break Even:</span>
                      <span className="text-white">{formatNumber(parseFloat(position.breakEvenPrice))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cyan-200/60">Liquidation:</span>
                      <span className="text-rose-300">{formatNumber(parseFloat(position.liquidationPrice))}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-cyan-500/10">
                    <div className="flex justify-between">
                      <span className="text-cyan-200/60">Initial Margin:</span>
                      <span className="text-white">{formatCurrency(parseFloat(position.initialMargin))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cyan-200/60">Isolated Margin:</span>
                      <span className="text-white">{formatCurrency(parseFloat(position.isolatedMargin))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cyan-200/60">Maintenance Margin:</span>
                      <span className="text-amber-300">{formatCurrency(parseFloat(position.maintMargin))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cyan-200/60">Leverage:</span>
                      <span className="text-cyan-300">
                        {position.leverage ? `${position.leverage}x` : 
                         parseFloat(position.initialMargin) > 0 ? 
                         `${(parseFloat(position.notional) / parseFloat(position.initialMargin)).toFixed(1)}x` : '0x'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-cyan-200/40 text-sm font-light">
                No active positions
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Risk Management & Position Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Position Overview */}
        <div className="bg-cyan-900/10 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-300" />
            Position Overview
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-4 bg-cyan-800/10 rounded-xl border border-cyan-500/10">
              <span className="text-cyan-200/60 text-sm font-light">Total Notional Value</span>
              <span className="font-medium text-white text-sm">
                {formatCurrency(positionMetrics.totalNotional)}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-cyan-800/10 rounded-xl border border-cyan-500/10">
              <span className="text-cyan-200/60 text-sm font-light">Winning Positions</span>
              <span className="font-medium text-cyan-300 text-sm">
                {positionMetrics.winningPositions}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-cyan-800/10 rounded-xl border border-cyan-500/10">
              <span className="text-cyan-200/60 text-sm font-light">Losing Positions</span>
              <span className="font-medium text-rose-300 text-sm">
                {positionMetrics.losingPositions}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-cyan-800/10 rounded-xl border border-cyan-500/10">
              <span className="text-cyan-200/60 text-sm font-light">Largest Position</span>
              <span className="font-medium text-white text-sm">
                {positionMetrics.largestPosition}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-cyan-800/10 rounded-xl border border-cyan-500/10">
              <span className="text-cyan-200/60 text-sm font-light">Average Leverage</span>
              <span className="font-medium text-cyan-300 text-sm">
                {positionMetrics.averageLeverage.toFixed(1)}x
              </span>
            </div>
          </div>
        </div>

        {/* Risk Management Status */}
        <div className="bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-cyan-500/10 backdrop-blur-xl rounded-2xl p-6 border border-cyan-400/30">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-300" />
            Risk Assessment
          </h3>
          <div className="space-y-4">
            <div className="text-center p-4 bg-cyan-800/20 rounded-xl border border-cyan-500/20">
              <div className="text-xl font-light text-cyan-300 mb-1">
                {formatCurrency(portfolio.total_initial_margin)}
              </div>
              <div className="text-sm text-cyan-200 font-light">Total Initial Margin</div>
              <div className="text-xs text-cyan-200/60 mt-1 font-light">
                Required collateral across all positions
              </div>
            </div>
            <div className="text-center p-4 bg-cyan-800/20 rounded-xl border border-cyan-500/20">
              <div className="text-xl font-light text-violet-300 mb-1">
                {portfolio.leverage ? `${portfolio.leverage.toFixed(1)}x` : '0x'}
              </div>
              <div className="text-sm text-cyan-200 font-light">Portfolio Leverage</div>
              <div className="text-xs text-cyan-200/60 mt-1 font-light">
                {portfolio.leverage && portfolio.leverage > 5 ? "Elevated Risk" : "Within Limits"}
              </div>
            </div>
            <div className="text-center p-4 bg-cyan-800/20 rounded-xl border border-cyan-500/20">
              <div className={`text-xl font-light mb-1 ${getPnLColor(portfolio.total_unrealized_profit)}`}>
                {formatPercent(unrealized_pnl_percent)}
              </div>
              <div className="text-sm text-cyan-200 font-light">Portfolio Performance</div>
              <div className="text-xs text-cyan-200/60 mt-1 font-light">
                {Math.abs(unrealized_pnl_percent) > 5 ? "Monitor Positions" : "Stable"}
              </div>
            </div>
            <div className="text-center p-4 bg-cyan-800/20 rounded-xl border border-cyan-500/20">
              <div className={`text-xl font-light mb-1 ${
                riskMetrics?.riskLevel === 'High' ? 'text-rose-300' : 
                riskMetrics?.riskLevel === 'Medium' ? 'text-amber-300' : 'text-emerald-300'
              }`}>
                {riskMetrics?.riskLevel}
              </div>
              <div className="text-sm text-cyan-200 font-light">Risk Level</div>
              <div className="text-xs text-cyan-200/60 mt-1 font-light">
                {riskMetrics?.marginUtilization?.toFixed(1)}% margin utilized
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fallback Notice if Error but Data Available */}
      {error && portfolio && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-300 flex-shrink-0" />
            <div>
              <p className="text-amber-300 text-sm font-light">
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