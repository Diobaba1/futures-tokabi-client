// =============================================================================
// FILE: src/components/signals/index.tsx
// =============================================================================
// User Signal Display Components
// Users can only see: Symbol, Entry, SL, Active Status, Created Time
// =============================================================================

import React from "react";
import { UserSignal, SignalStatus } from "../../types/signals.types";
import { Card, Badge, Spinner, Button, EmptyState } from "../ui/index";

// =============================================================================
// Signal Card (Limited User View)
// =============================================================================

interface SignalCardProps {
  signal: UserSignal;
  onClick?: () => void;
}

export const SignalCard: React.FC<SignalCardProps> = ({ signal, onClick }) => {
  const formatPrice = (price: number | null) => {
    if (price === null || price === undefined) return "—";
    return price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case "long":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
      case "short":
        return "text-rose-400 bg-rose-500/10 border-rose-500/30";
      default:
        return "text-slate-400 bg-slate-500/10 border-slate-500/30";
    }
  };

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case "long":
        return "↑";
      case "short":
        return "↓";
      default:
        return "→";
    }
  };

  const isActive = signal.status === SignalStatus.ACTIVE || signal.status === "active";

  return (
    <Card className="p-5" hover onClick={onClick}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-white">{signal.symbol}</span>
          <span
            className={`
              inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border font-bold text-sm
              ${getDecisionColor(signal.decision as string)}
            `}
          >
            <span>{getDecisionIcon(signal.decision as string)}</span>
            {(signal.decision as string).toUpperCase()}
          </span>
        </div>
        <Badge
          variant={isActive ? "success" : "warning"}
          dot
          pulse={isActive}
          size="sm"
        >
          {isActive ? "Active" : (signal.status as string).charAt(0).toUpperCase() + (signal.status as string).slice(1)}
        </Badge>
      </div>

      {/* Price Info - Only Entry and SL visible to users */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-slate-800/50 rounded-xl">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
            Entry Price
          </p>
          <p className="text-lg font-semibold text-white font-mono">
            {formatPrice(signal.entry_price)}
          </p>
        </div>
        <div className="p-3 bg-slate-800/50 rounded-xl">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
            Stop Loss
          </p>
          <p className="text-lg font-semibold text-rose-400 font-mono">
            {formatPrice(signal.stop_loss_price)}
          </p>
        </div>
      </div>

      {/* Created Time */}
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>Created</span>
        <span>{formatDate(signal.created_at)}</span>
      </div>
    </Card>
  );
};

// =============================================================================
// Signal List
// =============================================================================

interface SignalListProps {
  signals: UserSignal[];
  isLoading: boolean;
  error: string | null;
  onSignalClick?: (signal: UserSignal) => void;
  onRetry?: () => void;
}

export const SignalList: React.FC<SignalListProps> = ({
  signals,
  isLoading,
  error,
  onSignalClick,
  onRetry,
}) => {
  if (isLoading && signals.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8">
        <EmptyState
          icon={
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          }
          title="Failed to Load Signals"
          description={error}
          action={
            onRetry && (
              <Button variant="secondary" onClick={onRetry}>
                Try Again
              </Button>
            )
          }
        />
      </Card>
    );
  }

  if (signals.length === 0) {
    return (
      <Card className="p-8">
        <EmptyState
          icon={
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          }
          title="No Signals Available"
          description="Check back later for new trading signals"
        />
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {signals.map((signal) => (
        <SignalCard
          key={signal.id}
          signal={signal}
          onClick={() => onSignalClick?.(signal)}
        />
      ))}
    </div>
  );
};

// =============================================================================
// Signal Filters
// =============================================================================

interface SignalFiltersProps {
  symbols: string[];
  selectedSymbol: string;
  selectedDecision: string;
  onSymbolChange: (symbol: string) => void;
  onDecisionChange: (decision: string) => void;
  onClear: () => void;
  onRefresh: () => void;
}

export const SignalFilters: React.FC<SignalFiltersProps> = ({
  symbols,
  selectedSymbol,
  selectedDecision,
  onSymbolChange,
  onDecisionChange,
  onClear,
  onRefresh,
}) => {
  const hasFilters = selectedSymbol || selectedDecision;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Symbol Filter */}
      <select
        value={selectedSymbol}
        onChange={(e) => onSymbolChange(e.target.value)}
        className="px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
      >
        <option value="">All Symbols</option>
        {symbols.map((symbol) => (
          <option key={symbol} value={symbol}>
            {symbol}
          </option>
        ))}
      </select>

      {/* Decision Filter */}
      <select
        value={selectedDecision}
        onChange={(e) => onDecisionChange(e.target.value)}
        className="px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
      >
        <option value="">All Decisions</option>
        <option value="long">Long</option>
        <option value="short">Short</option>
      </select>

      {/* Clear Filters */}
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear
        </Button>
      )}

      {/* Refresh */}
      <Button variant="secondary" size="sm" onClick={onRefresh}>
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        Refresh
      </Button>
    </div>
  );
};