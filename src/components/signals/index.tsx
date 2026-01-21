// =============================================================================
// FILE: src/components/signals/index.tsx
// =============================================================================
// Signal Display Components - Clean, Professional UI
// =============================================================================

import React from "react";
import { 
  UserSignal, 
  UserSignalDetail,
  SignalStatus,
  formatPrice,
  formatPercent,
  getDecisionColor,
  getDecisionBgColor,
  getConsensusColor,
  getLeverageColor,
} from "../../types/signals.types";
import { Card, Spinner, Button, EmptyState } from "../ui/index";

// =============================================================================
// Signal Card Component
// =============================================================================

interface SignalCardProps {
  signal: UserSignal;
  onClick?: () => void;
  showDetails?: boolean;
}

export const SignalCard: React.FC<SignalCardProps> = ({ signal, onClick, showDetails = true }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isActive = signal.status === SignalStatus.ACTIVE || signal.status === "active";
  const decision = (signal.decision as string)?.toLowerCase() || "hold";

  return (
    <div 
      onClick={onClick}
      className={`
        group relative overflow-hidden rounded-2xl border border-slate-800/80
        bg-gradient-to-br from-slate-900/90 to-slate-900/50
        backdrop-blur-sm cursor-pointer
        transition-all duration-300 ease-out
        hover:border-slate-700 hover:shadow-xl hover:shadow-slate-900/50
        hover:-translate-y-1
      `}
    >
      {/* Accent gradient based on decision */}
      <div className={`
        absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
        ${decision === "long" 
          ? "bg-gradient-to-br from-emerald-500/5 to-transparent" 
          : "bg-gradient-to-br from-rose-500/5 to-transparent"
        }
      `} />

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-white tracking-tight">{signal.symbol}</span>
            <span
              className={`
                inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border font-bold text-sm
                ${getDecisionBgColor(decision)} ${getDecisionColor(decision)}
              `}
            >
              {decision === "long" ? (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              {decision.toUpperCase()}
            </span>
          </div>
          {isActive && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Live
            </span>
          )}
        </div>

        {/* Strength & Confidence Bar */}
        {showDetails && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-500">Signal Strength</span>
              <span className={`font-semibold ${getConsensusColor(signal.consensus_strength)}`}>
                {signal.consensus_strength?.toFixed(0) || 0}%
              </span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  signal.consensus_strength >= 80 ? "bg-emerald-500" :
                  signal.consensus_strength >= 60 ? "bg-amber-500" : "bg-rose-500"
                }`}
                style={{ width: `${Math.min(signal.consensus_strength || 0, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Price Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/30">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Entry</p>
            <p className="text-sm font-semibold text-white font-mono">
              {formatPrice(signal.entry_price)}
            </p>
          </div>
          <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/30">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Stop Loss</p>
            <p className="text-sm font-semibold text-rose-400 font-mono">
              {formatPrice(signal.stop_loss_price)}
            </p>
            {signal.stop_loss_percent && (
              <p className="text-[10px] text-rose-400/60 font-mono">
                {formatPercent(-Math.abs(signal.stop_loss_percent))}
              </p>
            )}
          </div>
          <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/30">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Take Profit</p>
            <p className="text-sm font-semibold text-emerald-400 font-mono">
              {formatPrice(signal.take_profit_price)}
            </p>
            {signal.take_profit_percent && (
              <p className="text-[10px] text-emerald-400/60 font-mono">
                {formatPercent(signal.take_profit_percent)}
              </p>
            )}
          </div>
        </div>

        {/* Risk/Reward & Leverage */}
        {showDetails && (
          <div className="flex items-center gap-4 text-sm">
            {signal.risk_reward_ratio && (
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-xs">R:R</span>
                <span className={`font-semibold ${
                  signal.risk_reward_ratio >= 2 ? 'text-emerald-400' : 
                  signal.risk_reward_ratio >= 1.5 ? 'text-amber-400' : 'text-slate-400'
                }`}>
                  1:{signal.risk_reward_ratio.toFixed(1)}
                </span>
              </div>
            )}
            {signal.suggested_leverage && (
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-xs">Leverage</span>
                <span className={`font-semibold ${getLeverageColor(signal.suggested_leverage)}`}>
                  {signal.suggested_leverage}x
                </span>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-3 mt-3 border-t border-slate-800/50">
          <span>{formatDate(signal.created_at)}</span>
          <svg className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// Signal Detail Modal
// =============================================================================

interface SignalDetailModalProps {
  signal: UserSignalDetail | null;
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
}

export const SignalDetailModal: React.FC<SignalDetailModalProps> = ({
  signal,
  isOpen,
  onClose,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const decision = (signal?.decision as string)?.toLowerCase() || "hold";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-4">
            {signal && (
              <>
                <span className="text-xl font-bold text-white">{signal.symbol}</span>
                <span
                  className={`
                    inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-bold text-sm
                    ${getDecisionBgColor(decision)} ${getDecisionColor(decision)}
                  `}
                >
                  {decision === "long" ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  )}
                  {decision.toUpperCase()}
                </span>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-5">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner size="lg" />
            </div>
          ) : signal ? (
            <div className="space-y-6">
              {/* Signal Strength */}
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-400">Signal Strength</span>
                  <span className={`font-bold ${getConsensusColor(signal.consensus_strength)}`}>
                    {signal.consensus_strength?.toFixed(0) || 0}%
                  </span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      signal.consensus_strength >= 80 ? "bg-emerald-500" :
                      signal.consensus_strength >= 60 ? "bg-amber-500" : "bg-rose-500"
                    }`}
                    style={{ width: `${Math.min(signal.consensus_strength || 0, 100)}%` }}
                  />
                </div>
              </div>

              {/* Price Levels */}
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-3">Price Levels</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <PriceCard label="Entry" value={signal.entry_price} color="slate" />
                  <PriceCard 
                    label="Stop Loss" 
                    value={signal.stop_loss_price} 
                    color="rose" 
                    percent={signal.stop_loss_percent ? -Math.abs(signal.stop_loss_percent) : undefined}
                  />
                  <PriceCard 
                    label="Take Profit" 
                    value={signal.take_profit_price} 
                    color="emerald"
                    percent={signal.take_profit_percent ?? undefined}
                  />
                  {signal.current_price && (
                    <PriceCard label="Current" value={signal.current_price} color="sky" />
                  )}
                </div>
              </div>

              {/* Risk Metrics */}
              {(signal.risk_reward_ratio || signal.suggested_leverage) && (
                <div>
                  <h3 className="text-sm font-medium text-slate-400 mb-3">Risk Analysis</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {signal.risk_reward_ratio && (
                      <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Risk/Reward</p>
                        <p className={`text-xl font-bold ${
                          signal.risk_reward_ratio >= 2 ? 'text-emerald-400' : 
                          signal.risk_reward_ratio >= 1.5 ? 'text-amber-400' : 'text-slate-400'
                        }`}>
                          1:{signal.risk_reward_ratio.toFixed(2)}
                        </p>
                      </div>
                    )}
                    {signal.suggested_leverage && (
                      <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Suggested Leverage</p>
                        <p className={`text-xl font-bold ${getLeverageColor(signal.suggested_leverage)}`}>
                          {signal.suggested_leverage}x
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Reasoning */}
              {signal.reasoning_summary && (
                <div>
                  <h3 className="text-sm font-medium text-slate-400 mb-3">Analysis Summary</h3>
                  <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {signal.reasoning_summary}
                    </p>
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
                <MetaItem 
                  label="Created" 
                  value={new Date(signal.created_at).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })} 
                />
                {signal.expires_at && (
                  <MetaItem 
                    label="Expires" 
                    value={new Date(signal.expires_at).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })} 
                  />
                )}
                <MetaItem label="Status" value={signal.status as string} />
                {signal.timeframes_analyzed && signal.timeframes_analyzed.length > 0 && (
                  <MetaItem label="Timeframes" value={signal.timeframes_analyzed.join(', ')} />
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500">
              Signal not found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// Helper Components
// =============================================================================

const PriceCard: React.FC<{
  label: string;
  value: number | null | undefined;
  color: 'slate' | 'sky' | 'rose' | 'emerald';
  percent?: number;
}> = ({ label, value, color, percent }) => {
  const colorClasses = {
    slate: 'text-white',
    sky: 'text-sky-400',
    rose: 'text-rose-400',
    emerald: 'text-emerald-400',
  };

  return (
    <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-base font-semibold font-mono ${colorClasses[color]}`}>
        {formatPrice(value)}
      </p>
      {percent !== undefined && (
        <p className={`text-xs font-mono ${color === 'rose' ? 'text-rose-400/60' : 'text-emerald-400/60'}`}>
          {formatPercent(percent)}
        </p>
      )}
    </div>
  );
};

const MetaItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">{label}</p>
    <p className="text-sm text-slate-300 capitalize">{value}</p>
  </div>
);

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
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          }
          title="No Signals Available"
          description="New trading opportunities will appear here when available"
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
    <div className="flex flex-wrap items-center gap-2">
      {/* Symbol Filter */}
      <select
        value={selectedSymbol}
        onChange={(e) => onSymbolChange(e.target.value)}
        className="px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
      >
        <option value="">All Pairs</option>
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
        className="px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
      >
        <option value="">All Types</option>
        <option value="long">Long</option>
        <option value="short">Short</option>
      </select>

      {/* Clear Filters */}
      {hasFilters && (
        <button 
          onClick={onClear}
          className="px-3 py-2 text-slate-400 hover:text-white text-sm transition-colors"
        >
          Clear
        </button>
      )}

      {/* Refresh */}
      <button 
        onClick={onRefresh}
        className="flex items-center gap-1.5 px-3 py-2 bg-slate-800/50 border border-slate-700 hover:border-slate-600 rounded-xl text-slate-300 hover:text-white text-sm transition-all"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        Refresh
      </button>
    </div>
  );
};
