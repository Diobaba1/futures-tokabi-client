// =============================================================================
// FILE: src/pages/Dashboard/Dashboard.tsx
// =============================================================================
// Enterprise-Grade Trading Dashboard with Real-time Data
// =============================================================================

import React, { useEffect, useMemo } from "react";
import { useAuth } from "../../components/contexts/AuthContext";
import { useAnalytics } from "../../components/contexts/AnalyticsContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTradingWebSocket } from "../../components/hooks";
import {
  MetricCard,
  LiveIndicator,
  QuickActionCard,
  SectionHeader,
  PnLDisplay,
  StatusBadge,
  ProgressRing,
  DataTable,
} from "../../components/ui/enterprise";
import { Card, Button } from "../../components/ui";

const Dashboard: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { portfolio: analyticsPortfolio, fetchPortfolio, fetchSystem, loading: analyticsLoading } = useAnalytics();
  const navigate = useNavigate();

  // Real-time trading data
  const {
    isConnected: isTradingConnected,
    isConnecting,
    hasApiKey,
    positions,
    portfolio: tradingPortfolio,
    balances,
    lastSync,
    error: tradingError,
    syncPositions,
    refreshPositions,
  } = useTradingWebSocket(true);

  useEffect(() => {
    if (!user && !authLoading) {
      navigate("/login");
    } else if (user) {
      fetchPortfolio();
      fetchSystem();
    }
  }, [user, authLoading, navigate, fetchPortfolio, fetchSystem]);

  // Calculate portfolio metrics
  const portfolioMetrics = useMemo(() => {
    const totalPnL = positions.reduce((sum, p) => sum + (p.unrealized_pnl || 0), 0);
    const winningPositions = positions.filter((p) => (p.unrealized_pnl || 0) > 0).length;
    const losingPositions = positions.filter((p) => (p.unrealized_pnl || 0) < 0).length;
    const totalNotional = positions.reduce((sum, p) => sum + Math.abs(p.position_amount || 0) * (p.mark_price || 0), 0);
    const walletBalance = tradingPortfolio?.total_wallet_balance || analyticsPortfolio?.balance?.total_balance_usd || 0;
    const marginBalance = tradingPortfolio?.total_margin_balance || analyticsPortfolio?.balance?.current_balance_usd || 0;
    const availableBalance = tradingPortfolio?.available_balance || analyticsPortfolio?.balance?.current_balance_usd || 0;

    return {
      totalPnL,
      winningPositions,
      losingPositions,
      totalNotional,
      walletBalance,
      marginBalance,
      availableBalance,
      winRate: positions.length > 0 ? (winningPositions / positions.length) * 100 : 0,
    };
  }, [positions, tradingPortfolio, analyticsPortfolio]);

  // Position table columns
  const positionColumns = [
    {
      key: "symbol",
      header: "Symbol",
      render: (item: typeof positions[0]) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
            <span className="text-sm font-bold text-white">{item.symbol.slice(0, 2)}</span>
          </div>
          <div>
            <p className="font-semibold text-white">{item.symbol}</p>
            <p className="text-xs text-slate-500">{item.leverage}x Leverage</p>
          </div>
        </div>
      ),
    },
    {
      key: "side",
      header: "Side",
      render: (item: typeof positions[0]) => (
        <StatusBadge
          status={item.side === "long" ? "success" : "error"}
          label={item.side?.toUpperCase()}
          size="sm"
        />
      ),
    },
    {
      key: "position_amount",
      header: "Size",
      align: "right" as const,
      render: (item: typeof positions[0]) => (
        <span className="font-medium text-white">
          {Math.abs(item.position_amount || 0).toFixed(4)}
        </span>
      ),
    },
    {
      key: "entry_price",
      header: "Entry",
      align: "right" as const,
      render: (item: typeof positions[0]) => (
        <span className="text-slate-300">${(item.entry_price || 0).toLocaleString()}</span>
      ),
    },
    {
      key: "mark_price",
      header: "Mark",
      align: "right" as const,
      render: (item: typeof positions[0]) => (
        <span className="text-slate-300">${(item.mark_price || 0).toLocaleString()}</span>
      ),
    },
    {
      key: "unrealized_pnl",
      header: "Unrealized PnL",
      align: "right" as const,
      render: (item: typeof positions[0]) => (
        <PnLDisplay value={item.unrealized_pnl || 0} size="sm" />
      ),
    },
  ];

  const isLoading = authLoading || analyticsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-6" />
          <p className="text-slate-400 text-lg font-medium">Loading Dashboard...</p>
          <p className="text-slate-600 text-sm mt-2">Fetching your portfolio data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-sky-500/5 rounded-full blur-[96px]" />
      </div>

      <div className="relative max-w-[1600px] mx-auto px-6 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">
                  Welcome back, {user?.full_name?.split(" ")[0]}
                </h1>
                <LiveIndicator
                  isLive={isTradingConnected}
                  isConnecting={isConnecting}
                  label={isTradingConnected ? "Live Data" : isConnecting ? "Connecting..." : "Offline"}
                />
              </div>
              <p className="text-slate-400">
                {lastSync
                  ? `Last synced ${new Date(lastSync).toLocaleTimeString()}`
                  : "Monitor your portfolio performance in real-time"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={refreshPositions}
                disabled={!isTradingConnected}
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={syncPositions}
                disabled={!hasApiKey}
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Sync from Binance
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Error Banner */}
        {tradingError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-rose-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-rose-400 text-sm">{tradingError}</p>
            </div>
          </motion.div>
        )}

        {/* Portfolio Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <MetricCard
            title="Wallet Balance"
            value={`$${portfolioMetrics.walletBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            subtitle="Total USDT in wallet"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            }
            variant="default"
          />
          <MetricCard
            title="Unrealized P&L"
            value={`${portfolioMetrics.totalPnL >= 0 ? "+" : ""}$${Math.abs(portfolioMetrics.totalPnL).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            subtitle={`${positions.length} open position${positions.length !== 1 ? "s" : ""}`}
            change={portfolioMetrics.walletBalance > 0 ? (portfolioMetrics.totalPnL / portfolioMetrics.walletBalance) * 100 : 0}
            changeLabel="of balance"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
            variant={portfolioMetrics.totalPnL >= 0 ? "success" : "danger"}
          />
          <MetricCard
            title="Available Balance"
            value={`$${portfolioMetrics.availableBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            subtitle="Ready to trade"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            variant="info"
          />
          <MetricCard
            title="Margin Balance"
            value={`$${portfolioMetrics.marginBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            subtitle="Total margin"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            variant="default"
          />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Positions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="xl:col-span-2"
          >
            <Card className="overflow-hidden">
              <div className="p-6 border-b border-slate-700/50">
                <SectionHeader
                  title="Open Positions"
                  subtitle={`${positions.length} active position${positions.length !== 1 ? "s" : ""}`}
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  }
                  action={
                    <LiveIndicator isLive={isTradingConnected} isConnecting={isConnecting} />
                  }
                />
              </div>
              {positions.length > 0 ? (
                <DataTable
                  data={positions}
                  columns={positionColumns}
                  keyExtractor={(item) => `${item.symbol}-${item.position_side}`}
                  compact
                  emptyMessage="No open positions"
                />
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-300 mb-2">No Open Positions</h3>
                  <p className="text-sm text-slate-500 mb-6">
                    Start trading to see your positions here in real-time
                  </p>
                  <Button variant="primary" onClick={() => navigate("/dashboard/signals")}>
                    View Trading Signals
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Right Column - Quick Stats & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Position Summary */}
            <Card className="p-6">
              <SectionHeader
                title="Position Summary"
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                }
              />
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <ProgressRing
                      value={portfolioMetrics.winningPositions}
                      max={Math.max(positions.length, 1)}
                      size="md"
                      color="emerald"
                      label="Win"
                    />
                    <div>
                      <p className="text-sm text-slate-400">Win Rate</p>
                      <p className="text-lg font-bold text-white">
                        {portfolioMetrics.winRate.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-emerald-400">{portfolioMetrics.winningPositions} winning</p>
                    <p className="text-sm text-rose-400">{portfolioMetrics.losingPositions} losing</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-xs text-emerald-400 mb-1">Total Notional</p>
                    <p className="text-lg font-bold text-white">
                      ${portfolioMetrics.totalNotional.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/20">
                    <p className="text-xs text-sky-400 mb-1">Positions</p>
                    <p className="text-lg font-bold text-white">{positions.length}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <SectionHeader
                title="Quick Actions"
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                }
              />
              <div className="space-y-3">
                <QuickActionCard
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  }
                  title="AI Trading Signals"
                  description="View latest signals"
                  onClick={() => navigate("/dashboard/signals")}
                  variant="primary"
                />
                <QuickActionCard
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  }
                  title="Trading Config"
                  description="Adjust risk settings"
                  onClick={() => navigate("/dashboard/trading-config")}
                />
                <QuickActionCard
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  }
                  title="Trade History"
                  description="View all trades"
                  onClick={() => navigate("/dashboard/trading")}
                />
                <QuickActionCard
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  }
                  title="API Keys"
                  description="Manage Binance keys"
                  onClick={() => navigate("/dashboard/settings/api-keys")}
                  variant={!hasApiKey ? "warning" : "default"}
                />
              </div>
            </Card>

            {/* Connection Status */}
            <Card className="p-6">
              <SectionHeader
                title="Connection Status"
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                  </svg>
                }
              />
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50">
                  <span className="text-sm text-slate-400">WebSocket</span>
                  <StatusBadge
                    status={isTradingConnected ? "active" : isConnecting ? "pending" : "inactive"}
                    label={isTradingConnected ? "Connected" : isConnecting ? "Connecting" : "Disconnected"}
                    pulse={isTradingConnected || isConnecting}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50">
                  <span className="text-sm text-slate-400">API Key</span>
                  <StatusBadge
                    status={hasApiKey ? "active" : "warning"}
                    label={hasApiKey ? "Configured" : "Not Set"}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50">
                  <span className="text-sm text-slate-400">Live Stream</span>
                  <StatusBadge
                    status={isTradingConnected && hasApiKey ? "active" : "inactive"}
                    label={isTradingConnected && hasApiKey ? "Active" : "Inactive"}
                    pulse={isTradingConnected && hasApiKey}
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
