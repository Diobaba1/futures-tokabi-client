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
  Clock,
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
  CreditCard,
  Scale,
  Zap,
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

  if (!portfolio) {
    return (
      <div className="min-h-96 bg-gray-800/20 backdrop-blur-sm rounded-xl border border-gray-700/30 flex items-center justify-center">
        <div className="text-center">
          <Database className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No Portfolio Data
          </h3>
          <p className="text-gray-400 mb-4 text-sm font-light">
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
          <h2 className="text-2xl lg:text-3xl font-light text-white mb-2">
            Portfolio Analytics
          </h2>
          <p className="text-gray-400 text-sm font-light">
            Real-time portfolio monitoring and risk assessment
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-2">
            {lastRefresh && (
              <p className="text-xs text-gray-500 font-light">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </p>
            )}
            {portfolio.last_synced && (
              <p className="text-xs text-gray-500 font-light">
                System sync: {new Date(portfolio.last_synced).toLocaleString()}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
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
        {/* Total Wallet Balance */}
        <div className="bg-gray-800/20 backdrop-blur-sm rounded-xl p-5 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center border border-cyan-500/30">
              <Wallet className="w-5 h-5 text-cyan-400" />
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
          <h3 className="text-2xl font-light text-white mb-1">
            {formatCurrency(portfolio.total_wallet_balance)}
          </h3>
          <p className="text-gray-400 text-sm font-light">Total Wallet Balance</p>
          <div className="mt-2 text-xs text-gray-500 font-light">
            Available: {formatCurrency(portfolio.available_balance)}
          </div>
        </div>

        {/* Margin Balance */}
        <div className="bg-gray-800/20 backdrop-blur-sm rounded-xl p-5 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-lg flex items-center justify-center border border-emerald-500/30">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <Gauge className="w-4 h-4 text-blue-400" />
          </div>
          <h3 className="text-2xl font-light text-white mb-1">
            {formatCurrency(portfolio.total_margin_balance)}
          </h3>
          <p className="text-gray-400 text-sm font-light">Margin Balance</p>
          <div className="mt-2 text-xs text-gray-500 font-light">
            Initial Margin: {formatCurrency(portfolio.total_initial_margin)}
          </div>
        </div>

        {/* Unrealized Profit */}
        <div className="bg-gray-800/20 backdrop-blur-sm rounded-xl p-5 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-violet-500/30">
              <Activity className="w-5 h-5 text-violet-400" />
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
          <h3 className={`text-2xl font-light mb-1 ${getPnLColor(portfolio.total_unrealized_profit)}`}>
            {formatPercent(unrealized_pnl_percent)}
          </h3>
          <p className="text-gray-400 text-sm font-light">Unrealized P&L</p>
          <div className="mt-2 text-xs text-gray-500 font-light">
            {portfolio.total_unrealized_profit >= 0 ? "Profitable" : "Drawdown"}
          </div>
        </div>

        {/* Leverage */}
        <div className="bg-gray-800/20 backdrop-blur-sm rounded-xl p-5 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
              <BarChart3 className="w-5 h-5 text-blue-400" />
            </div>
            <Target className="w-4 h-4 text-cyan-400" />
          </div>
          <h3 className="text-2xl font-light text-white mb-1">
            {portfolio.leverage ? `${portfolio.leverage.toFixed(1)}x` : '0x'}
          </h3>
          <p className="text-gray-400 text-sm font-light">Portfolio Leverage</p>
          <div className="mt-2 text-xs text-gray-500 font-light">
            {positionMetrics.averageLeverage > 10 ? "Aggressive" : "Conservative"}
          </div>
        </div>
      </div>

      {/* Assets & Positions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assets Details */}
        <div className="bg-gray-800/20 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-cyan-400" />
            Asset Details ({assetAllocation.length})
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {assetAllocation.map((asset, index) => (
              <div key={asset.asset} className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-700/50 rounded-lg flex items-center justify-center border border-gray-600/30">
                      {getAssetIcon(asset.asset)}
                    </div>
                    <div>
                      <div className="font-medium text-white text-sm">
                        {asset.asset}
                      </div>
                      <div className="text-xs text-gray-400 font-light">
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
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Margin Balance:</span>
                    <span className="text-white">{formatCurrency(asset.marginBalance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Available:</span>
                    <span className="text-white">{formatCurrency(asset.availableBalance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Initial Margin:</span>
                    <span className="text-white">{formatCurrency(asset.initialMargin)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Max Withdraw:</span>
                    <span className="text-white">{formatCurrency(asset.maxWithdrawAmount)}</span>
                  </div>
                </div>
                
                {asset.maintMargin > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-600/20">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Maintenance Margin:</span>
                      <span className="text-amber-400">{formatCurrency(asset.maintMargin)}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Active Positions */}
        <div className="bg-gray-800/20 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-violet-400" />
            Active Positions ({portfolio.positions?.length || 0})
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {portfolio.positions && portfolio.positions.length > 0 ? (
              portfolio.positions.map((position: any, index: number) => (
                <div
                  key={position.symbol || index}
                  className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/20 hover:border-gray-500/30 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-1.5 rounded ${
                          parseFloat(position.unRealizedProfit) >= 0
                            ? "bg-emerald-500/20 border border-emerald-500/30"
                            : "bg-red-500/20 border border-red-500/30"
                        }`}
                      >
                        {parseFloat(position.unRealizedProfit) >= 0 ? (
                          <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 text-red-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-white text-sm">
                          {position.symbol}
                        </div>
                        <div className="text-xs text-gray-400 font-light">
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
                      <div className="text-xs text-gray-400 font-light">
                        {formatCurrency(parseFloat(position.notional))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Entry Price:</span>
                      <span className="text-white">{formatNumber(parseFloat(position.entryPrice))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Mark Price:</span>
                      <span className="text-white">{formatNumber(parseFloat(position.markPrice))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Break Even:</span>
                      <span className="text-white">{formatNumber(parseFloat(position.breakEvenPrice))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Liquidation:</span>
                      <span className="text-red-400">{formatNumber(parseFloat(position.liquidationPrice))}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-600/20">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Initial Margin:</span>
                      <span className="text-white">{formatCurrency(parseFloat(position.initialMargin))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Isolated Margin:</span>
                      <span className="text-white">{formatCurrency(parseFloat(position.isolatedMargin))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Maintenance Margin:</span>
                      <span className="text-amber-400">{formatCurrency(parseFloat(position.maintMargin))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Leverage:</span>
                      <span className="text-cyan-400">
                        {position.leverage ? `${position.leverage}x` : 
                         parseFloat(position.initialMargin) > 0 ? 
                         `${(parseFloat(position.notional) / parseFloat(position.initialMargin)).toFixed(1)}x` : '0x'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm font-light">
                No active positions
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Risk Management & Position Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Position Overview */}
        <div className="bg-gray-800/20 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-400" />
            Position Overview
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-700/20 rounded-lg">
              <span className="text-gray-400 text-sm font-light">Total Notional Value</span>
              <span className="font-medium text-white text-sm">
                {formatCurrency(positionMetrics.totalNotional)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-700/20 rounded-lg">
              <span className="text-gray-400 text-sm font-light">Winning Positions</span>
              <span className="font-medium text-emerald-400 text-sm">
                {positionMetrics.winningPositions}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-700/20 rounded-lg">
              <span className="text-gray-400 text-sm font-light">Losing Positions</span>
              <span className="font-medium text-red-400 text-sm">
                {positionMetrics.losingPositions}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-700/20 rounded-lg">
              <span className="text-gray-400 text-sm font-light">Largest Position</span>
              <span className="font-medium text-white text-sm">
                {positionMetrics.largestPosition}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-700/20 rounded-lg">
              <span className="text-gray-400 text-sm font-light">Average Leverage</span>
              <span className="font-medium text-cyan-400 text-sm">
                {positionMetrics.averageLeverage.toFixed(1)}x
              </span>
            </div>
          </div>
        </div>

        {/* Risk Management Status */}
        <div className="bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-xl p-6 border border-cyan-500/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            Risk Assessment
          </h3>
          <div className="space-y-4">
            <div className="text-center p-4 bg-gray-800/20 rounded-lg border border-gray-700/30">
              <div className="text-xl font-light text-cyan-400 mb-1">
                {formatCurrency(portfolio.total_initial_margin)}
              </div>
              <div className="text-sm text-gray-300 font-light">Total Initial Margin</div>
              <div className="text-xs text-gray-400 mt-1 font-light">
                Required collateral across all positions
              </div>
            </div>
            <div className="text-center p-4 bg-gray-800/20 rounded-lg border border-gray-700/30">
              <div className="text-xl font-light text-violet-400 mb-1">
                {portfolio.leverage ? `${portfolio.leverage.toFixed(1)}x` : '0x'}
              </div>
              <div className="text-sm text-gray-300 font-light">Portfolio Leverage</div>
              <div className="text-xs text-gray-400 mt-1 font-light">
                {portfolio.leverage && portfolio.leverage > 5 ? "Elevated Risk" : "Within Limits"}
              </div>
            </div>
            <div className="text-center p-4 bg-gray-800/20 rounded-lg border border-gray-700/30">
              <div className={`text-xl font-light mb-1 ${getPnLColor(portfolio.total_unrealized_profit)}`}>
                {formatPercent(unrealized_pnl_percent)}
              </div>
              <div className="text-sm text-gray-300 font-light">Portfolio Performance</div>
              <div className="text-xs text-gray-400 mt-1 font-light">
                {Math.abs(unrealized_pnl_percent) > 5 ? "Monitor Positions" : "Stable"}
              </div>
            </div>
            <div className="text-center p-4 bg-gray-800/20 rounded-lg border border-gray-700/30">
              <div className={`text-xl font-light mb-1 ${
                riskMetrics?.riskLevel === 'High' ? 'text-red-400' : 
                riskMetrics?.riskLevel === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {riskMetrics?.riskLevel}
              </div>
              <div className="text-sm text-gray-300 font-light">Risk Level</div>
              <div className="text-xs text-gray-400 mt-1 font-light">
                {riskMetrics?.marginUtilization?.toFixed(1)}% margin utilized
              </div>
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