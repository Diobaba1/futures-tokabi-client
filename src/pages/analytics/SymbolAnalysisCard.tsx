// =============================================================================
// FILE: src/pages/analytics/SymbolAnalysisCard.tsx
// =============================================================================
// Enhanced Symbol Analysis Card with improved UI/UX
// Aligned with backend signal response structure
// =============================================================================

import React, { useState } from "react";
import {
  TrendingUpIcon,
  TrendingDownIcon,
  HelpCircleIcon,
  ClockIcon,
  AlertCircleIcon,
  DollarSignIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ShieldIcon,
  TargetIcon,
  ActivityIcon,
  ZapIcon,
} from "lucide-react";
import { SymbolAnalysisResult } from "../../types/userSymbolSearch.types";

interface SymbolAnalysisCardProps {
  analysis: SymbolAnalysisResult;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

// =============================================================================
// Utility Functions
// =============================================================================

const formatPrice = (price?: number | null): string => {
  if (price === null || price === undefined || isNaN(price)) return "—";
  if (price >= 1000) {
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `$${price.toFixed(price >= 1 ? 2 : 6)}`;
};

const formatPercentage = (value?: number | null): string => {
  if (value === null || value === undefined || isNaN(value)) return "—";
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
};

const formatNumber = (value?: number | null, decimals: number = 2): string => {
  if (value === null || value === undefined || isNaN(value)) return "—";
  return value.toFixed(decimals);
};

const getDecisionBgClass = (decision?: string | null): string => {
  switch (decision?.toLowerCase()) {
    case "long":
      return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
    case "short":
      return "bg-rose-500/10 border-rose-500/30 text-rose-400";
    default:
      return "bg-slate-500/10 border-slate-500/30 text-gray-400";
  }
};

// =============================================================================
// Main Component
// =============================================================================

export const SymbolAnalysisCard: React.FC<SymbolAnalysisCardProps> = ({
  analysis,
  expanded = false,
  onToggleExpand,
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded);

  const { symbol, status, final_decision, consensus_strength, risk_metrics, market_data_summary, indicators_summary } = analysis;

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    onToggleExpand?.();
  };

  // =========================================================================
  // Loading State
  // =========================================================================
  if (status === "pending") {
    return (
      <div className="bg-dark-elevated backdrop-blur-sm border border-dark-border rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-500/20 rounded-xl flex items-center justify-center">
            <ClockIcon className="w-7 h-7 text-amber-400 animate-pulse" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-xl font-bold text-white">{symbol}</h3>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Analyzing...
              </span>
            </div>
            <div className="w-full bg-dark-surface rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-amber-400 h-2 rounded-full animate-pulse w-2/3"></div>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              AI models are analyzing market data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // Error State
  // =========================================================================
  if (status === "error") {
    return (
      <div className="bg-dark-elevated backdrop-blur-sm border border-rose-500/30 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-rose-500/20 rounded-xl flex items-center justify-center">
            <AlertCircleIcon className="w-7 h-7 text-rose-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-white">{symbol}</h3>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Error
              </span>
            </div>
            <p className="text-sm text-rose-300">{analysis.error || "Analysis failed"}</p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // Success State
  // =========================================================================
  const decision = final_decision?.toLowerCase() || "hold";

  const getDecisionIcon = () => {
    switch (decision) {
      case "long":
        return <TrendingUpIcon className="w-5 h-5" />;
      case "short":
        return <TrendingDownIcon className="w-5 h-5" />;
      default:
        return <HelpCircleIcon className="w-5 h-5" />;
    }
  };

  const getConsensusColor = (strength?: number | null) => {
    if (!strength) return "text-gray-400";
    if (strength >= 85) return "text-emerald-400";
    if (strength >= 70) return "text-amber-400";
    return "text-rose-400";
  };

  const getLeverageColor = (leverage?: number | null) => {
    if (!leverage) return "text-gray-400";
    if (leverage >= 5) return "text-rose-400";
    if (leverage >= 3) return "text-amber-400";
    return "text-emerald-400";
  };

  const getRRColor = (rr?: number | null) => {
    if (!rr) return "text-gray-400";
    if (rr >= 2) return "text-emerald-400";
    if (rr >= 1.5) return "text-amber-400";
    return "text-gray-400";
  };

  return (
    <div className="bg-dark-elevated backdrop-blur-sm border border-dark-border rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:border-dark-border">
      {/* Header - Always Visible */}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            {/* Symbol Icon */}
            <div className="w-14 h-14 bg-gradient-to-br from-sky-500/20 to-sky-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <DollarSignIcon className="w-7 h-7 text-sky-400" />
            </div>

            <div className="flex-1 min-w-0">
              {/* Symbol & Decision */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <h2 className="text-2xl font-bold text-white">{symbol}</h2>
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold border ${getDecisionBgClass(decision)}`}
                >
                  {getDecisionIcon()}
                  {decision.toUpperCase()}
                </div>
                {consensus_strength !== undefined && consensus_strength !== null && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-surface/50 border border-dark-border">
                    <ShieldIcon className="w-4 h-4 text-gray-400" />
                    <span className={`font-semibold ${getConsensusColor(consensus_strength)}`}>
                      {consensus_strength.toFixed(0)}%
                    </span>
                  </div>
                )}
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <QuickStat
                  label="Current Price"
                  value={formatPrice(market_data_summary?.current_price)}
                />
                <QuickStat
                  label="24h Change"
                  value={formatPercentage(market_data_summary?.price_change_24h)}
                  valueClass={
                    market_data_summary?.price_change_24h && market_data_summary.price_change_24h >= 0
                      ? "text-emerald-400"
                      : "text-rose-400"
                  }
                />
                <QuickStat
                  label="Leverage"
                  value={risk_metrics?.suggested_leverage ? `${risk_metrics.suggested_leverage}x` : "—"}
                  valueClass={getLeverageColor(risk_metrics?.suggested_leverage)}
                />
                <QuickStat
                  label="R:R Ratio"
                  value={risk_metrics?.risk_reward_ratio ? `1:${risk_metrics.risk_reward_ratio.toFixed(1)}` : "—"}
                  valueClass={getRRColor(risk_metrics?.risk_reward_ratio)}
                />
              </div>
            </div>
          </div>

          {/* Expand Toggle */}
          <button
            onClick={handleToggle}
            className="p-2 text-gray-400 hover:text-white hover:bg-dark-surface/50 rounded-lg transition-colors ml-4"
          >
            {isExpanded ? (
              <ChevronUpIcon className="w-6 h-6" />
            ) : (
              <ChevronDownIcon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Expandable Details */}
      {isExpanded && (
        <div className="border-t border-dark-border p-6 space-y-6 bg-dark-elevated/30">
          {/* Price Levels */}
          {risk_metrics && (
            <Section title="Price Levels" icon={<TargetIcon className="w-4 h-4" />}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <PriceCard
                  title="Entry"
                  value={risk_metrics.entry_price}
                  color="sky"
                />
                <PriceCard
                  title="Stop Loss"
                  value={risk_metrics.stop_loss_price}
                  color="rose"
                  percent={risk_metrics.estimated_sl_percent ? -Math.abs(risk_metrics.estimated_sl_percent) : undefined}
                />
                <PriceCard
                  title="Take Profit"
                  value={risk_metrics.take_profit_price}
                  color="emerald"
                  percent={risk_metrics.estimated_tp_percent ?? undefined}
                />
              </div>
            </Section>
          )}

          {/* Risk Metrics */}
          {risk_metrics && (
            <Section title="Risk Analysis" icon={<ShieldIcon className="w-4 h-4" />}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <MetricBox
                  label="Stop Loss %"
                  value={risk_metrics.estimated_sl_percent ? `-${Math.abs(risk_metrics.estimated_sl_percent).toFixed(2)}%` : "—"}
                  color="rose"
                />
                <MetricBox
                  label="Take Profit %"
                  value={risk_metrics.estimated_tp_percent ? `+${risk_metrics.estimated_tp_percent.toFixed(2)}%` : "—"}
                  color="emerald"
                />
                <MetricBox
                  label="Risk/Reward"
                  value={risk_metrics.risk_reward_ratio ? `1:${risk_metrics.risk_reward_ratio.toFixed(2)}` : "—"}
                  color={risk_metrics.risk_reward_ratio && risk_metrics.risk_reward_ratio >= 2 ? "emerald" : risk_metrics.risk_reward_ratio && risk_metrics.risk_reward_ratio >= 1.5 ? "amber" : "slate"}
                />
                <MetricBox
                  label="Suggested Leverage"
                  value={risk_metrics.suggested_leverage ? `${risk_metrics.suggested_leverage}x` : "—"}
                  color={risk_metrics.suggested_leverage && risk_metrics.suggested_leverage >= 5 ? "rose" : risk_metrics.suggested_leverage && risk_metrics.suggested_leverage >= 3 ? "amber" : "emerald"}
                />
              </div>
            </Section>
          )}

          {/* Technical Indicators */}
          {indicators_summary && (
            <Section title="Technical Indicators" icon={<ActivityIcon className="w-4 h-4" />}>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                <IndicatorBox
                  label="RSI"
                  value={formatNumber(indicators_summary.rsi)}
                  status={
                    indicators_summary.rsi > 70 ? "overbought" :
                    indicators_summary.rsi < 30 ? "oversold" : "neutral"
                  }
                />
                <IndicatorBox
                  label="MACD"
                  value={formatNumber(indicators_summary.macd, 4)}
                />
                <IndicatorBox
                  label="Signal Line"
                  value={formatNumber(indicators_summary.signal_line, 4)}
                />
                <IndicatorBox
                  label="ATR"
                  value={formatNumber(indicators_summary.atr, 4)}
                />
                <IndicatorBox
                  label="Trend"
                  value={indicators_summary.trend?.toUpperCase() || "—"}
                  status={indicators_summary.trend}
                />
              </div>
            </Section>
          )}

          {/* Market Data */}
          {market_data_summary && (
            <Section title="Market Data" icon={<ZapIcon className="w-4 h-4" />}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <MetricBox
                  label="Current Price"
                  value={formatPrice(market_data_summary.current_price)}
                  color="sky"
                />
                <MetricBox
                  label="24h Change"
                  value={formatPercentage(market_data_summary.price_change_24h)}
                  color={market_data_summary.price_change_24h >= 0 ? "emerald" : "rose"}
                />
                <MetricBox
                  label="24h Volume"
                  value={market_data_summary.volume_24h ? `$${(market_data_summary.volume_24h / 1e6).toFixed(1)}M` : "—"}
                  color="slate"
                />
                {market_data_summary.high_24h && market_data_summary.low_24h && (
                  <MetricBox
                    label="24h Range"
                    value={`${formatPrice(market_data_summary.low_24h)} - ${formatPrice(market_data_summary.high_24h)}`}
                    color="slate"
                  />
                )}
              </div>
            </Section>
          )}

          {/* Timestamp */}
          <div className="pt-4 border-t border-dark-border/50 flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4" />
              <span>Analysis completed</span>
            </div>
            <span>{analysis.timestamp ? new Date(analysis.timestamp).toLocaleString() : "—"}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// Helper Components
// =============================================================================

const Section: React.FC<{
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <div>
    <div className="flex items-center gap-2 mb-4">
      {icon && <span className="text-gray-400">{icon}</span>}
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">{title}</h3>
    </div>
    {children}
  </div>
);

const QuickStat: React.FC<{
  label: string;
  value: string;
  valueClass?: string;
}> = ({ label, value, valueClass = "text-white" }) => (
  <div>
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className={`text-sm font-semibold ${valueClass}`}>{value}</p>
  </div>
);

const PriceCard: React.FC<{
  title: string;
  value?: number | null;
  color: "sky" | "rose" | "emerald";
  percent?: number;
}> = ({ title, value, color, percent }) => {
  const colorClasses = {
    sky: "bg-sky-500/10 border-sky-500/30 text-sky-400",
    rose: "bg-rose-500/10 border-rose-500/30 text-rose-400",
    emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
  };

  return (
    <div className={`p-4 rounded-xl border ${colorClasses[color]}`}>
      <p className="text-xs opacity-70 mb-1">{title}</p>
      <p className="text-xl font-bold font-mono">{formatPrice(value)}</p>
      {percent !== undefined && (
        <p className="text-xs opacity-70 mt-1">{formatPercentage(percent)}</p>
      )}
    </div>
  );
};

const MetricBox: React.FC<{
  label: string;
  value: string;
  color?: "emerald" | "rose" | "amber" | "sky" | "slate";
}> = ({ label, value, color = "slate" }) => {
  const colorClasses = {
    emerald: "text-emerald-400",
    rose: "text-rose-400",
    amber: "text-amber-400",
    sky: "text-sky-400",
    slate: "text-gray-300",
  };

  return (
    <div className="p-3 bg-dark-surface/30 rounded-xl border border-dark-border/50">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-sm font-semibold ${colorClasses[color]}`}>{value}</p>
    </div>
  );
};

const IndicatorBox: React.FC<{
  label: string;
  value: string;
  status?: string;
}> = ({ label, value, status }) => {
  const getStatusColor = () => {
    switch (status) {
      case "bullish":
        return "text-emerald-400";
      case "bearish":
        return "text-rose-400";
      case "overbought":
        return "text-rose-400";
      case "oversold":
        return "text-emerald-400";
      default:
        return "text-gray-300";
    }
  };

  return (
    <div className="p-3 bg-dark-surface/30 rounded-xl border border-dark-border/50">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-sm font-semibold ${getStatusColor()}`}>{value}</p>
      {status && (status === "overbought" || status === "oversold") && (
        <p className="text-xs mt-1 opacity-70 capitalize">{status}</p>
      )}
    </div>
  );
};

export default SymbolAnalysisCard;
