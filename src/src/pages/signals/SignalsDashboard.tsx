// =============================================================================
// FILE: src/pages/SignalsDashboard.tsx
// =============================================================================
// User Signals Dashboard Page
// Users can only see: Symbol, Entry, SL, Active Status, Created Time
// =============================================================================

import React, { useState, useCallback } from "react";
import {
  useSignals,
  useActiveSignals,
  useSignalStats,
  useAvailableSymbols,
} from "../../components/hooks";
import { UserSignal } from "../../types/signals.types";
import {
  Card,
  StatCard,
  Button,
  Spinner,
} from "../../components/ui";
import { SignalCard, SignalFilters } from "../../components/signals";

// =============================================================================
// Tab Button Component
// =============================================================================

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
      active
        ? "bg-emerald-500 text-white"
        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
    }`}
  >
    {children}
  </button>
);

// =============================================================================
// Main Dashboard
// =============================================================================

const SignalsDashboard: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<"active" | "all">("active");
  const [symbolFilter, setSymbolFilter] = useState<string>("");
  const [decisionFilter, setDecisionFilter] = useState<string>("");

  // Hooks
  const {
    signals: allSignals,
    isLoading: isLoadingAll,
    error: errorAll,
    fetchSignals,
    updateFilters,
    resetFilters,
  } = useSignals();

  const {
    signals: activeSignals,
    isLoading: isLoadingActive,
    error: errorActive,
    refetch: refetchActive,
  } = useActiveSignals();

  const { stats, isLoading: isLoadingStats } = useSignalStats("24h");
  const { symbols } = useAvailableSymbols();

  // Handlers
  const handleSymbolChange = useCallback(
    (value: string) => {
      setSymbolFilter(value);
      if (activeTab === "all") {
        updateFilters({ symbol: value || undefined });
      }
    },
    [activeTab, updateFilters]
  );

  const handleDecisionChange = useCallback(
    (value: string) => {
      setDecisionFilter(value);
      if (activeTab === "all") {
        updateFilters({ decision: value || undefined });
      }
    },
    [activeTab, updateFilters]
  );

  const handleClearFilters = useCallback(() => {
    setSymbolFilter("");
    setDecisionFilter("");
    resetFilters();
  }, [resetFilters]);

  const handleRefresh = useCallback(() => {
    if (activeTab === "active") {
      refetchActive();
    } else {
      fetchSignals();
    }
  }, [activeTab, refetchActive, fetchSignals]);

  // Determine which signals to show
  const displayedSignals = activeTab === "active" ? activeSignals : allSignals;
  const displayedLoading = activeTab === "active" ? isLoadingActive : isLoadingAll;
  const displayedError = activeTab === "active" ? errorActive : errorAll;

  // Filter signals locally (for active tab that doesn't use server-side filtering)
  const filteredSignals = displayedSignals.filter((signal) => {
    if (symbolFilter && signal.symbol !== symbolFilter) return false;
    if (decisionFilter && signal.decision !== decisionFilter) return false;
    return true;
  });

  // Calculate stats percentages
  const longPercent =
    stats?.total_signals && stats.decisions.long
      ? Math.round((stats.decisions.long / stats.total_signals) * 100)
      : 0;
  const shortPercent =
    stats?.total_signals && stats.decisions.short
      ? Math.round((stats.decisions.short / stats.total_signals) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Trading Signals
          </h1>
          <p className="text-slate-400 mt-1">
            AI-powered trading signals with entry and stop-loss levels
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Signals (24h)"
            value={isLoadingStats ? "..." : stats?.total_signals || 0}
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            }
          />
          <StatCard
            label="Long Signals"
            value={isLoadingStats ? "..." : stats?.decisions?.long || 0}
            trend="up"
            trendValue={`${longPercent}%`}
            icon={
              <svg
                className="w-6 h-6 text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            }
          />
          <StatCard
            label="Short Signals"
            value={isLoadingStats ? "..." : stats?.decisions?.short || 0}
            trend="down"
            trendValue={`${shortPercent}%`}
            icon={
              <svg
                className="w-6 h-6 text-rose-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            }
          />
          <StatCard
            label="Active Now"
            value={activeSignals.length}
            icon={
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            }
          />
        </div>

        {/* Tabs and Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-slate-800/50 rounded-xl p-1 w-fit">
            <TabButton
              active={activeTab === "active"}
              onClick={() => setActiveTab("active")}
            >
              Active Signals
            </TabButton>
            <TabButton
              active={activeTab === "all"}
              onClick={() => setActiveTab("all")}
            >
              All Signals
            </TabButton>
          </div>

          {/* Filters */}
          <SignalFilters
            symbols={symbols}
            selectedSymbol={symbolFilter}
            selectedDecision={decisionFilter}
            onSymbolChange={handleSymbolChange}
            onDecisionChange={handleDecisionChange}
            onClear={handleClearFilters}
            onRefresh={handleRefresh}
          />
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-slate-500">
          Showing {filteredSignals.length} signal
          {filteredSignals.length !== 1 ? "s" : ""}
        </div>

        {/* Signal List */}
        {displayedLoading && filteredSignals.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : displayedError ? (
          <Card className="p-8 text-center">
            <p className="text-rose-400 mb-4">{displayedError}</p>
            <Button variant="secondary" onClick={handleRefresh}>
              Try Again
            </Button>
          </Card>
        ) : filteredSignals.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-slate-600 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-300 mb-2">
              No Signals Available
            </h3>
            <p className="text-sm text-slate-500">
              {symbolFilter || decisionFilter
                ? "No signals match your filters"
                : "Check back later for new trading signals"}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSignals.map((signal) => (
              <SignalCard key={signal.id} signal={signal} />
            ))}
          </div>
        )}

        {/* Info Note */}
        <Card className="mt-8 p-4 bg-slate-800/30 border-slate-700/50">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-sky-500/10 rounded-lg">
              <svg
                className="w-5 h-5 text-sky-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-300 font-medium">
                Signal Information
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Signals show the trading direction, entry price, and stop-loss
                level. Always use proper risk management and never invest more
                than you can afford to lose.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SignalsDashboard;