// src/pages/analytics/PortfolioAnalytics.tsx
import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Sparkles,
  Layers,
  Zap,
  Eye,
  EyeOff,
  AlertCircle,
  ChevronDown,
  Clock,
  Scale,
  LineChart,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Circle,
} from "lucide-react";

// Asset icon mapping with enhanced styling
const ASSET_ICONS: { [key: string]: React.ElementType } = {
  BTC: Bitcoin,
  ETH: Sparkles,
  USDT: DollarSign,
  USDC: Coins,
  SOL: Zap,
  ADA: Layers,
};

// Asset colors for visual distinction
const ASSET_COLORS: { [key: string]: { gradient: string; border: string; text: string } } = {
  BTC: { gradient: "from-orange-500 to-amber-500", border: "border-orange-500/30", text: "text-orange-400" },
  ETH: { gradient: "from-violet-500 to-purple-500", border: "border-violet-500/30", text: "text-violet-400" },
  USDT: { gradient: "from-emerald-500 to-green-500", border: "border-emerald-500/30", text: "text-emerald-400" },
  USDC: { gradient: "from-blue-500 to-cyan-500", border: "border-blue-500/30", text: "text-blue-400" },
  SOL: { gradient: "from-purple-500 to-pink-500", border: "border-purple-500/30", text: "text-purple-400" },
  ADA: { gradient: "from-blue-600 to-indigo-500", border: "border-blue-500/30", text: "text-blue-400" },
  default: { gradient: "from-gray-500 to-gray-600", border: "border-gray-500/30", text: "text-gray-400" },
};

interface PositionMetrics {
  totalNotional: number;
  winningPositions: number;
  losingPositions: number;
  largestPosition: string;
  averageLeverage: number;
}

// Animated Counter Component
const AnimatedCounter: React.FC<{
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}> = ({ value, prefix = "", suffix = "", decimals = 2, className = "" }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(value, increment * step);
      setDisplayValue(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span className={className}>
      {prefix}
      {displayValue.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
};

// Progress Ring Component
const ProgressRing: React.FC<{
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}> = ({ progress, size = 60, strokeWidth = 6, color = "text-cyan-400" }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-white/5"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className={color}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{ strokeDasharray: circumference }}
      />
    </svg>
  );
};

const PortfolioAnalyticsComponent: React.FC = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showAllAssets, setShowAllAssets] = useState(false);
  const [showAllPositions, setShowAllPositions] = useState(false);
  const hasLoadedRef = useRef(false);

  const loadData = useCallback(async (isRetry = false) => {
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
  }, []);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    if (user) {
      loadData();
    }
  }, [loadData, user]);

  useEffect(() => {
    if (!autoRefresh || !user) return;
    const interval = setInterval(() => loadData(), 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, user, loadData]);

  // Calculate position metrics
  const positionMetrics = useMemo((): PositionMetrics => {
    if (!portfolio?.positions || !Array.isArray(portfolio.positions)) {
      return {
        totalNotional: 0,
        winningPositions: 0,
        losingPositions: 0,
        largestPosition: "N/A",
        averageLeverage: 0,
      };
    }

    const positions = portfolio.positions;
    const totalNotional = positions.reduce(
      (sum: number, pos: any) => sum + (parseFloat(pos.notional) || 0),
      0
    );

    const winningPositions = positions.filter(
      (pos: any) => (parseFloat(pos.unRealizedProfit) || 0) > 0
    ).length;
    const losingPositions = positions.filter(
      (pos: any) => (parseFloat(pos.unRealizedProfit) || 0) < 0
    ).length;

    const largestPosition = positions.reduce(
      (largest: any, pos: any) =>
        (parseFloat(pos.notional) || 0) > (parseFloat(largest.notional) || 0)
          ? pos
          : largest,
      positions[0] || {}
    );

    const averageLeverage =
      positions.length > 0
        ? positions.reduce((sum: number, pos: any) => {
            const leverage =
              parseFloat(pos.leverage) ||
              (parseFloat(pos.initialMargin) > 0
                ? parseFloat(pos.notional) / parseFloat(pos.initialMargin)
                : 0);
            return sum + leverage;
          }, 0) / positions.length
        : 0;

    return {
      totalNotional,
      winningPositions,
      losingPositions,
      largestPosition: largestPosition.symbol || "N/A",
      averageLeverage,
    };
  }, [portfolio?.positions]);

  // Calculate asset allocation
  const assetAllocation = useMemo(() => {
    if (!portfolio?.assets || !Array.isArray(portfolio.assets)) return [];

    return portfolio.assets
      .map((asset: any) => ({
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
        percentage:
          portfolio.total_wallet_balance > 0
            ? (parseFloat(asset.walletBalance) / portfolio.total_wallet_balance) * 100
            : 0,
      }))
      .filter((asset) => asset.walletBalance > 0)
      .sort((a, b) => b.walletBalance - a.walletBalance);
  }, [portfolio?.assets, portfolio?.total_wallet_balance]);

  // Calculate risk metrics
  const riskMetrics = useMemo(() => {
    if (!portfolio) return null;

    const marginUtilization =
      portfolio.total_margin_balance > 0
        ? (portfolio.total_initial_margin / portfolio.total_margin_balance) * 100
        : 0;
    const availableLeverage = portfolio.leverage || 0;
    const pnlPercentage =
      portfolio.total_wallet_balance > 0
        ? (portfolio.total_unrealized_profit / portfolio.total_wallet_balance) * 100
        : 0;

    return {
      marginUtilization,
      availableLeverage,
      pnlPercentage,
      riskLevel:
        marginUtilization > 80 ? "Critical" : marginUtilization > 50 ? "Elevated" : "Normal",
      riskColor:
        marginUtilization > 80 ? "text-red-400" : marginUtilization > 50 ? "text-amber-400" : "text-emerald-400",
    };
  }, [portfolio]);

  const getPnLColor = (value: number) =>
    value >= 0 ? "text-emerald-400" : "text-red-400";

  const getPnLBgColor = (value: number) =>
    value >= 0 ? "bg-emerald-500/10 border-emerald-500/20" : "bg-red-500/10 border-red-500/20";

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

  const getAssetColor = (asset: string) => ASSET_COLORS[asset] || ASSET_COLORS.default;
  const getAssetIcon = (asset: string) => ASSET_ICONS[asset] || Coins;

  const handleRefresh = async () => {
    await loadData(true);
  };

  // Loading State
  if (isLoading && !portfolio) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl animate-pulse" />
            <div className="relative w-20 h-20 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Loading Portfolio</h3>
          <p className="text-gray-500">Fetching your trading data...</p>
        </motion.div>
      </div>
    );
  }

  // Error State
  if (error && !portfolio) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Connection Issue</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <motion.button
            onClick={handleRefresh}
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-xl hover:from-cyan-400 hover:to-blue-400 transition-all disabled:opacity-50 flex items-center gap-2 mx-auto shadow-lg shadow-cyan-500/25"
          >
            {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
            Retry Connection
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Empty State
  if (!portfolio) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gray-800/50 border border-white/5 flex items-center justify-center">
            <Database className="w-10 h-10 text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Portfolio Data</h3>
          <p className="text-gray-500">Connect your exchange to view your portfolio.</p>
        </motion.div>
      </div>
    );
  }

  const unrealized_pnl_percent =
    portfolio.total_wallet_balance > 0
      ? (portfolio.total_unrealized_profit / portfolio.total_wallet_balance) * 100
      : 0;

  return (
    <div className="min-h-full">
      {/* Hero Section */}
      <div className="relative overflow-hidden mb-8">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[80px] translate-y-1/2" />

        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="relative px-6 py-10 lg:py-14">
          <div className="max-w-6xl mx-auto">
            {/* Header Row */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border border-cyan-500/30 flex items-center justify-center"
                  >
                    <BarChart3 className="w-6 h-6 text-cyan-400" />
                  </motion.div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-white">
                      Portfolio Overview
                    </h1>
                    <p className="text-gray-500 text-sm">
                      Real-time portfolio monitoring and analytics
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Controls */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-wrap items-center gap-3"
              >
                {/* Last Updated */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-400">
                    {lastRefresh?.toLocaleTimeString() || "Never"}
                  </span>
                </div>

                {/* Auto Refresh Toggle */}
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                    autoRefresh
                      ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                      : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  {autoRefresh ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">Live</span>
                </button>

                {/* Refresh Button */}
                <motion.button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl text-white font-medium text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                  Refresh
                </motion.button>
              </motion.div>
            </div>

            {/* Portfolio Value Hero Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-gray-900/80 backdrop-blur-xl border border-white/10"
            >
              {/* Inner glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-cyan-500/10 rounded-full blur-[80px]" />

              <div className="relative p-8 lg:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Main Value */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-gray-400 text-sm font-medium">Total Portfolio Value</span>
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getPnLBgColor(portfolio.total_unrealized_profit)}`}>
                        {portfolio.total_unrealized_profit >= 0 ? (
                          <ArrowUp className="w-3 h-3" />
                        ) : (
                          <ArrowDown className="w-3 h-3" />
                        )}
                        <span className={getPnLColor(portfolio.total_unrealized_profit)}>
                          {formatPercent(unrealized_pnl_percent)}
                        </span>
                      </div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4"
                    >
                      <AnimatedCounter
                        value={portfolio.total_wallet_balance}
                        prefix="$"
                        decimals={2}
                      />
                    </motion.div>

                    {/* Quick Stats */}
                    <div className="flex flex-wrap gap-6">
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Unrealized P&L</p>
                        <p className={`text-lg font-semibold ${getPnLColor(portfolio.total_unrealized_profit)}`}>
                          {formatCurrency(portfolio.total_unrealized_profit)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Available Balance</p>
                        <p className="text-lg font-semibold text-white">
                          {formatCurrency(portfolio.available_balance)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Active Positions</p>
                        <p className="text-lg font-semibold text-white">
                          {portfolio.positions?.length || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Risk Gauge */}
                  <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/5">
                    <div className="relative">
                      <ProgressRing
                        progress={Math.min(riskMetrics?.marginUtilization || 0, 100)}
                        size={100}
                        strokeWidth={8}
                        color={
                          (riskMetrics?.marginUtilization || 0) > 80
                            ? "text-red-400"
                            : (riskMetrics?.marginUtilization || 0) > 50
                            ? "text-amber-400"
                            : "text-emerald-400"
                        }
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-xl font-bold ${riskMetrics?.riskColor || "text-white"}`}>
                          {(riskMetrics?.marginUtilization || 0).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mt-3">Margin Used</p>
                    <p className={`text-xs font-medium mt-1 ${riskMetrics?.riskColor || "text-gray-400"}`}>
                      {riskMetrics?.riskLevel || "Unknown"} Risk
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-10">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Key Metrics Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              Key Metrics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Wallet Balance */}
              <MetricCard
                icon={Wallet}
                iconColor="text-cyan-400"
                iconBg="from-cyan-500/20 to-blue-500/20"
                borderColor="border-cyan-500/20"
                title="Wallet Balance"
                value={formatCurrency(portfolio.total_wallet_balance)}
                subtitle={`Available: ${formatCurrency(portfolio.available_balance)}`}
                trend={unrealized_pnl_percent}
                delay={0}
              />

              {/* Margin Balance */}
              <MetricCard
                icon={Shield}
                iconColor="text-emerald-400"
                iconBg="from-emerald-500/20 to-green-500/20"
                borderColor="border-emerald-500/20"
                title="Margin Balance"
                value={formatCurrency(portfolio.total_margin_balance)}
                subtitle={`Initial: ${formatCurrency(portfolio.total_initial_margin)}`}
                delay={0.05}
              />

              {/* Unrealized P&L */}
              <MetricCard
                icon={LineChart}
                iconColor={getPnLColor(portfolio.total_unrealized_profit)}
                iconBg={
                  portfolio.total_unrealized_profit >= 0
                    ? "from-emerald-500/20 to-green-500/20"
                    : "from-red-500/20 to-rose-500/20"
                }
                borderColor={
                  portfolio.total_unrealized_profit >= 0
                    ? "border-emerald-500/20"
                    : "border-red-500/20"
                }
                title="Unrealized P&L"
                value={formatPercent(unrealized_pnl_percent)}
                valueColor={getPnLColor(portfolio.total_unrealized_profit)}
                subtitle={formatCurrency(portfolio.total_unrealized_profit)}
                delay={0.1}
              />

              {/* Leverage */}
              <MetricCard
                icon={Scale}
                iconColor="text-violet-400"
                iconBg="from-violet-500/20 to-purple-500/20"
                borderColor="border-violet-500/20"
                title="Portfolio Leverage"
                value={portfolio.leverage ? `${portfolio.leverage.toFixed(1)}x` : "0x"}
                subtitle={
                  positionMetrics.averageLeverage > 10 ? "High Exposure" : "Moderate Exposure"
                }
                delay={0.15}
              />
            </div>
          </motion.div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Asset Allocation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-white/5 overflow-hidden"
            >
              <div className="p-5 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-cyan-400" />
                    Asset Allocation
                  </h3>
                  <span className="text-xs text-gray-500">
                    {assetAllocation.length} assets
                  </span>
                </div>
              </div>

              <div className="p-5">
                {assetAllocation.length > 0 ? (
                  <>
                    <div className="space-y-3">
                      {(showAllAssets ? assetAllocation : assetAllocation.slice(0, 4)).map(
                        (asset, index) => (
                          <AssetRow
                            key={asset.asset}
                            asset={asset}
                            index={index}
                            formatCurrency={formatCurrency}
                            getAssetColor={getAssetColor}
                            getAssetIcon={getAssetIcon}
                            getPnLColor={getPnLColor}
                          />
                        )
                      )}
                    </div>

                    {assetAllocation.length > 4 && (
                      <button
                        onClick={() => setShowAllAssets(!showAllAssets)}
                        className="w-full mt-4 py-2 text-sm text-gray-400 hover:text-white flex items-center justify-center gap-2 transition-colors"
                      >
                        {showAllAssets ? (
                          <>
                            Show Less <ChevronDown className="w-4 h-4 rotate-180" />
                          </>
                        ) : (
                          <>
                            Show All ({assetAllocation.length}) <ChevronDown className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Wallet className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No assets found</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Active Positions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-white/5 overflow-hidden"
            >
              <div className="p-5 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-violet-400" />
                    Active Positions
                  </h3>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Circle className="w-2 h-2 fill-current" />
                      {positionMetrics.winningPositions} winning
                    </span>
                    <span className="flex items-center gap-1 text-red-400">
                      <Circle className="w-2 h-2 fill-current" />
                      {positionMetrics.losingPositions} losing
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5">
                {portfolio.positions && portfolio.positions.length > 0 ? (
                  <>
                    <div className="space-y-3">
                      {(showAllPositions
                        ? portfolio.positions
                        : portfolio.positions.slice(0, 4)
                      ).map((position: any, index: number) => (
                        <PositionRow
                          key={position.symbol || index}
                          position={position}
                          index={index}
                          formatCurrency={formatCurrency}
                          formatNumber={formatNumber}
                          getPnLColor={getPnLColor}
                        />
                      ))}
                    </div>

                    {portfolio.positions.length > 4 && (
                      <button
                        onClick={() => setShowAllPositions(!showAllPositions)}
                        className="w-full mt-4 py-2 text-sm text-gray-400 hover:text-white flex items-center justify-center gap-2 transition-colors"
                      >
                        {showAllPositions ? (
                          <>
                            Show Less <ChevronDown className="w-4 h-4 rotate-180" />
                          </>
                        ) : (
                          <>
                            Show All ({portfolio.positions.length}){" "}
                            <ChevronDown className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No active positions</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Risk Assessment & Position Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Position Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-white/5 overflow-hidden"
            >
              <div className="p-5 border-b border-white/5">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-400" />
                  Position Summary
                </h3>
              </div>

              <div className="p-5 space-y-4">
                <StatRow
                  label="Total Notional"
                  value={formatCurrency(positionMetrics.totalNotional)}
                />
                <StatRow
                  label="Winning Positions"
                  value={positionMetrics.winningPositions.toString()}
                  valueColor="text-emerald-400"
                />
                <StatRow
                  label="Losing Positions"
                  value={positionMetrics.losingPositions.toString()}
                  valueColor="text-red-400"
                />
                <StatRow
                  label="Largest Position"
                  value={positionMetrics.largestPosition}
                />
                <StatRow
                  label="Average Leverage"
                  value={`${positionMetrics.averageLeverage.toFixed(1)}x`}
                  valueColor="text-cyan-400"
                />
              </div>
            </motion.div>

            {/* Risk Assessment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="rounded-2xl bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-gray-900/80 backdrop-blur-xl border border-white/5 overflow-hidden"
            >
              <div className="p-5 border-b border-white/5">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  Risk Assessment
                </h3>
              </div>

              <div className="p-5 space-y-5">
                {/* Margin Utilization */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Margin Utilization</span>
                    <span className={`text-sm font-medium ${riskMetrics?.riskColor || "text-white"}`}>
                      {(riskMetrics?.marginUtilization || 0).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(riskMetrics?.marginUtilization || 0, 100)}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        (riskMetrics?.marginUtilization || 0) > 80
                          ? "bg-gradient-to-r from-red-500 to-red-400"
                          : (riskMetrics?.marginUtilization || 0) > 50
                          ? "bg-gradient-to-r from-amber-500 to-amber-400"
                          : "bg-gradient-to-r from-emerald-500 to-emerald-400"
                      }`}
                    />
                  </div>
                </div>

                {/* Risk Level */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          riskMetrics?.riskLevel === "Critical"
                            ? "bg-red-500/20"
                            : riskMetrics?.riskLevel === "Elevated"
                            ? "bg-amber-500/20"
                            : "bg-emerald-500/20"
                        }`}
                      >
                        {riskMetrics?.riskLevel === "Critical" ? (
                          <AlertCircle className="w-5 h-5 text-red-400" />
                        ) : riskMetrics?.riskLevel === "Elevated" ? (
                          <AlertTriangle className="w-5 h-5 text-amber-400" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        )}
                      </div>
                      <div>
                        <p className={`font-semibold ${riskMetrics?.riskColor || "text-white"}`}>
                          {riskMetrics?.riskLevel || "Unknown"} Risk
                        </p>
                        <p className="text-xs text-gray-500">
                          {riskMetrics?.riskLevel === "Critical"
                            ? "Reduce exposure immediately"
                            : riskMetrics?.riskLevel === "Elevated"
                            ? "Monitor positions closely"
                            : "Portfolio within safe limits"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                    <p className="text-2xl font-bold text-white">
                      {portfolio.leverage ? `${portfolio.leverage.toFixed(1)}x` : "0x"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Portfolio Leverage</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                    <p className={`text-2xl font-bold ${getPnLColor(portfolio.total_unrealized_profit)}`}>
                      {formatPercent(unrealized_pnl_percent)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">P&L Percentage</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Error Notice */}
          {error && portfolio && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <p className="text-amber-400 text-sm">
                Using cached data - {error}. Last updated: {lastRefresh?.toLocaleTimeString()}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

// Metric Card Component
interface MetricCardProps {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  borderColor: string;
  title: string;
  value: string;
  valueColor?: string;
  subtitle: string;
  trend?: number;
  delay?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({
  icon: Icon,
  iconColor,
  iconBg,
  borderColor,
  title,
  value,
  valueColor = "text-white",
  subtitle,
  trend,
  delay = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -2 }}
    className={`relative overflow-hidden p-5 rounded-2xl bg-gray-900/50 backdrop-blur-xl border ${borderColor} hover:border-white/20 transition-all group`}
  >
    {/* Hover glow */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${iconBg} flex items-center justify-center border border-white/5 group-hover:scale-105 transition-transform`}
        >
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
              trend >= 0
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {trend >= 0 ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>{trend >= 0 ? "+" : ""}{trend.toFixed(2)}%</span>
          </div>
        )}
      </div>

      <h4 className="text-gray-400 text-sm mb-1">{title}</h4>
      <p className={`text-2xl font-bold ${valueColor} mb-1`}>{value}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  </motion.div>
);

// Asset Row Component
interface AssetRowProps {
  asset: any;
  index: number;
  formatCurrency: (value: number) => string;
  getAssetColor: (asset: string) => { gradient: string; border: string; text: string };
  getAssetIcon: (asset: string) => React.ElementType;
  getPnLColor: (value: number) => string;
}

const AssetRow: React.FC<AssetRowProps> = ({
  asset,
  index,
  formatCurrency,
  getAssetColor,
  getAssetIcon,
  getPnLColor,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const colors = getAssetColor(asset.asset);
  const IconComponent = getAssetIcon(asset.asset);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all ${
        isExpanded ? "ring-1 ring-cyan-500/20" : ""
      }`}
    >
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white shadow-lg`}
          >
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-white">{asset.asset}</p>
            <p className="text-xs text-gray-500">{asset.percentage.toFixed(1)}% allocation</p>
          </div>
        </div>

        <div className="text-right">
          <p className="font-semibold text-white">{formatCurrency(asset.walletBalance)}</p>
          <p className={`text-xs ${getPnLColor(asset.unrealizedProfit)}`}>
            {formatCurrency(asset.unrealizedProfit)}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-4 border-t border-white/5 grid grid-cols-2 gap-3 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Margin Balance</span>
                <span className="text-white">{formatCurrency(asset.marginBalance)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Available</span>
                <span className="text-white">{formatCurrency(asset.availableBalance)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Initial Margin</span>
                <span className="text-white">{formatCurrency(asset.initialMargin)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Max Withdraw</span>
                <span className="text-white">{formatCurrency(asset.maxWithdrawAmount)}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Position Row Component
interface PositionRowProps {
  position: any;
  index: number;
  formatCurrency: (value: number) => string;
  formatNumber: (value: number, decimals?: number) => string;
  getPnLColor: (value: number) => string;
}

const PositionRow: React.FC<PositionRowProps> = ({
  position,
  index,
  formatCurrency,
  formatNumber,
  getPnLColor,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const pnl = parseFloat(position.unRealizedProfit) || 0;
  const isLong = position.positionSide === "LONG" || position.positionSide === "Long";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all ${
        isExpanded ? "ring-1 ring-violet-500/20" : ""
      }`}
    >
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              isLong
                ? "bg-emerald-500/20 border border-emerald-500/30"
                : "bg-red-500/20 border border-red-500/30"
            }`}
          >
            {isLong ? (
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-400" />
            )}
          </div>
          <div>
            <p className="font-semibold text-white">{position.symbol}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className={position.positionSide === "LONG" ? "text-emerald-400" : "text-red-400"}>
                {position.positionSide}
              </span>
              <span>•</span>
              <span>{position.positionAmt} units</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className={`font-semibold ${getPnLColor(pnl)}`}>{formatCurrency(pnl)}</p>
          <p className="text-xs text-gray-500">{formatCurrency(parseFloat(position.notional))}</p>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-4 border-t border-white/5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Entry Price</span>
                  <span className="text-white font-mono">
                    {formatNumber(parseFloat(position.entryPrice))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Mark Price</span>
                  <span className="text-white font-mono">
                    {formatNumber(parseFloat(position.markPrice))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Break Even</span>
                  <span className="text-white font-mono">
                    {formatNumber(parseFloat(position.breakEvenPrice))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Liquidation</span>
                  <span className="text-red-400 font-mono">
                    {formatNumber(parseFloat(position.liquidationPrice))}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 grid grid-cols-2 gap-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Initial Margin</span>
                  <span className="text-white">{formatCurrency(parseFloat(position.initialMargin))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Leverage</span>
                  <span className="text-cyan-400">
                    {position.leverage
                      ? `${position.leverage}x`
                      : parseFloat(position.initialMargin) > 0
                      ? `${(parseFloat(position.notional) / parseFloat(position.initialMargin)).toFixed(1)}x`
                      : "0x"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Stat Row Component
interface StatRowProps {
  label: string;
  value: string;
  valueColor?: string;
}

const StatRow: React.FC<StatRowProps> = ({ label, value, valueColor = "text-white" }) => (
  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
    <span className="text-gray-400 text-sm">{label}</span>
    <span className={`font-medium ${valueColor}`}>{value}</span>
  </div>
);

export default PortfolioAnalyticsComponent;
