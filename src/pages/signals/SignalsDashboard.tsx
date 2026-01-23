// =============================================================================
// FILE: src/pages/signals/SignalsDashboard.tsx
// =============================================================================
// Trading Signals Dashboard - Clean, Professional UI
// =============================================================================

import React, { useState, useCallback, useEffect } from "react";
import {
  useSignals,
  useActiveSignals,
  useSignalStats,
  useAvailableSymbols,
} from "../../components/hooks";
import { UserSignal, UserSignalDetail } from "../../types/signals.types";
import { signalsService } from "../../api/services/userSignalsService";
import { Card, Spinner } from "../../components/ui";
import { SignalCard, SignalFilters, SignalDetailModal } from "../../components/signals";
import UpgradePrompt from "../../components/common/UpgradePrompt";
import { SubscriptionErrorCode } from "../../types/billings.types";

// =============================================================================
// Stat Card Component
// =============================================================================

interface QuickStatProps {
  label: string;
  value: string | number;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  accent?: "emerald" | "rose" | "sky" | "amber" | "slate";
}

const QuickStat: React.FC<QuickStatProps> = ({ 
  label, 
  value, 
  trend, 
  trendValue,
  accent = "slate" 
}) => {
  const accentColors = {
    emerald: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20",
    rose: "from-rose-500/20 to-rose-500/5 border-rose-500/20",
    sky: "from-sky-500/20 to-sky-500/5 border-sky-500/20",
    amber: "from-amber-500/20 to-amber-500/5 border-amber-500/20",
    slate: "from-slate-500/20 to-slate-500/5 border-slate-700/50",
  };

  const textColors = {
    emerald: "text-emerald-400",
    rose: "text-rose-400",
    sky: "text-sky-400",
    amber: "text-amber-400",
    slate: "text-white",
  };

  return (
    <div className={`
      relative overflow-hidden rounded-2xl border p-4
      bg-gradient-to-br ${accentColors[accent]}
    `}>
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
        {label}
      </p>
      <div className="flex items-end gap-2">
        <span className={`text-2xl font-bold ${textColors[accent]}`}>
          {value}
        </span>
        {trend && trendValue && (
          <span className={`
            text-xs font-medium pb-1
            ${trend === "up" ? "text-emerald-400" : trend === "down" ? "text-rose-400" : "text-slate-400"}
          `}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : ""} {trendValue}
          </span>
        )}
      </div>
    </div>
  );
};

// =============================================================================
// Tab Button Component
// =============================================================================

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children, count }) => (
  <button
    onClick={onClick}
    className={`
      relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
      ${active
        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25"
        : "text-slate-400 hover:text-white hover:bg-slate-800/70"
      }
    `}
  >
    <span className="flex items-center gap-2">
      {children}
      {count !== undefined && (
        <span className={`
          text-xs px-1.5 py-0.5 rounded-full
          ${active ? "bg-white/20" : "bg-slate-700"}
        `}>
          {count}
        </span>
      )}
    </span>
  </button>
);

// =============================================================================
// Empty State Component
// =============================================================================

const EmptySignals: React.FC<{ hasFilters: boolean }> = ({ hasFilters }) => (
  <div className="flex flex-col items-center justify-center py-20">
    <div className="w-20 h-20 mb-6 rounded-full bg-slate-800/50 flex items-center justify-center">
      <svg
        className="w-10 h-10 text-slate-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-slate-300 mb-2">
      {hasFilters ? "No Matching Signals" : "No Active Signals"}
    </h3>
    <p className="text-sm text-slate-500 text-center max-w-sm">
      {hasFilters
        ? "Try adjusting your filters to see more results"
        : "New trading opportunities will appear here when available"}
    </p>
  </div>
);

// =============================================================================
// Main Dashboard
// =============================================================================

const SignalsDashboard: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<"active" | "all">("active");
  const [symbolFilter, setSymbolFilter] = useState<string>("");
  const [decisionFilter, setDecisionFilter] = useState<string>("");
  const [selectedSignal, setSelectedSignal] = useState<UserSignalDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

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

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === "active") {
        refetchActive();
      } else {
        fetchSignals();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [activeTab, refetchActive, fetchSignals]);

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

  const handleSignalClick = useCallback(async (signal: UserSignal) => {
    setIsModalOpen(true);
    setIsLoadingDetail(true);
    
    try {
      const detail = await signalsService.getSignalById(signal.id);
      setSelectedSignal(detail);
    } catch (error) {
      console.error("Failed to load signal detail:", error);
      setSelectedSignal(signal as UserSignalDetail);
    } finally {
      setIsLoadingDetail(false);
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedSignal(null);
  }, []);

  // Determine which signals to show
  const displayedSignals = activeTab === "active" ? activeSignals : allSignals;
  const displayedLoading = activeTab === "active" ? isLoadingActive : isLoadingAll;
  const displayedError = activeTab === "active" ? errorActive : errorAll;

  // Filter signals locally
  const filteredSignals = displayedSignals.filter((signal) => {
    if (symbolFilter && signal.symbol !== symbolFilter) return false;
    if (decisionFilter && signal.decision !== decisionFilter) return false;
    return true;
  });

  // Calculate percentages
  const totalDecisions = (stats?.decisions?.long || 0) + (stats?.decisions?.short || 0);
  const longPercent = totalDecisions > 0 
    ? Math.round(((stats?.decisions?.long || 0) / totalDecisions) * 100) 
    : 0;
  const shortPercent = totalDecisions > 0 
    ? Math.round(((stats?.decisions?.short || 0) / totalDecisions) * 100) 
    : 0;

  const hasFilters = !!(symbolFilter || decisionFilter);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pointer-events-none" />
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-emerald-500/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-sky-500/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Trading Signals
              </h1>
              <p className="text-slate-500 mt-1 text-sm">
                Real-time trading opportunities with entry, stop-loss, and take-profit levels
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Live
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <QuickStat
            label="Total (24h)"
            value={isLoadingStats ? "—" : stats?.total_signals || 0}
            accent="slate"
          />
          <QuickStat
            label="Long"
            value={isLoadingStats ? "—" : stats?.decisions?.long || 0}
            trend="up"
            trendValue={`${longPercent}%`}
            accent="emerald"
          />
          <QuickStat
            label="Short"
            value={isLoadingStats ? "—" : stats?.decisions?.short || 0}
            trend="down"
            trendValue={`${shortPercent}%`}
            accent="rose"
          />
          <QuickStat
            label="Avg Strength"
            value={isLoadingStats ? "—" : `${stats?.avg_consensus_strength?.toFixed(0) || 0}%`}
            accent="sky"
          />
        </div>

        {/* Tabs and Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          {/* Tabs */}
          <div className="flex items-center gap-2 p-1 bg-slate-900/50 rounded-2xl border border-slate-800">
            <TabButton
              active={activeTab === "active"}
              onClick={() => setActiveTab("active")}
              count={activeSignals.length}
            >
              Active
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

        {/* Results Info */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-500">
            {filteredSignals.length} {filteredSignals.length === 1 ? "signal" : "signals"}
            {hasFilters && " matching filters"}
          </p>
          {displayedLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Spinner size="sm" />
              Updating...
            </div>
          )}
        </div>

        {/* Signal List */}
        {displayedLoading && filteredSignals.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Spinner size="lg" />
              <p className="text-sm text-slate-500 mt-4">Loading signals...</p>
            </div>
          </div>
        ) : displayedError ? (
          // Check if this is a subscription error
          displayedError.toLowerCase().includes('subscription') ||
          displayedError.toLowerCase().includes('upgrade') ? (
            <UpgradePrompt
              errorCode={SubscriptionErrorCode.NO_SUBSCRIPTION}
              feature="Trading Signals"
              variant="page"
            />
          ) : (
            <Card className="p-8 text-center bg-slate-900/50 border-slate-800">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-rose-400 mb-4">{displayedError}</p>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm transition-colors"
              >
                Try Again
              </button>
            </Card>
          )
        ) : filteredSignals.length === 0 ? (
          <EmptySignals hasFilters={hasFilters} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredSignals.map((signal) => (
              <SignalCard 
                key={signal.id} 
                signal={signal} 
                onClick={() => handleSignalClick(signal)}
              />
            ))}
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-10 pt-6 border-t border-slate-800/50">
          <p className="text-xs text-slate-600 text-center">
            Signals are for informational purposes only. Always conduct your own research and use proper risk management.
          </p>
        </div>
      </div>

      {/* Signal Detail Modal */}
      <SignalDetailModal
        signal={selectedSignal}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isLoading={isLoadingDetail}
      />
    </div>
  );
};

export default SignalsDashboard;
