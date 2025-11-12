// FILE: src/components/SymbolAnalysisCard.tsx
import React, { useState } from "react";
import {
  TrendingUpIcon,
  TrendingDownIcon,
  HelpCircleIcon,
  ClockIcon,
  AlertCircleIcon,
  DollarSignIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BarChart3Icon,
  ActivityIcon,
  ShieldIcon,
  TargetIcon,
} from "lucide-react";
import { SymbolAnalysisResult } from "../../types/userSymbolSearch.types";
import { userSymbolSearchService } from "../../api/services/userSymbolSearchService";

interface SymbolAnalysisCardProps {
  analysis: SymbolAnalysisResult;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

// Safe formatting functions
const formatPrice = (price?: number | null): string => {
  if (price === null || price === undefined || isNaN(price))
    return "Not provided";
  if (price >= 1000) {
    return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  }
  return `$${price.toFixed(4)}`;
};

const formatPercentage = (value?: number | null): string => {
  if (value === null || value === undefined || isNaN(value))
    return "Not provided";
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
};

const formatNumber = (value?: number | null, decimals: number = 4): string => {
  if (value === null || value === undefined || isNaN(value))
    return "Not provided";
  return value.toFixed(decimals);
};

export const SymbolAnalysisCard: React.FC<SymbolAnalysisCardProps> = ({
  analysis,
  expanded = false,
  onToggleExpand,
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded);

  const { symbol, status } = analysis;

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    onToggleExpand?.();
  };

  // Loading state
  if (status === "pending") {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gray-800/70">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <ClockIcon className="w-6 h-6 text-amber-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-white">{symbol}</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Processing
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-amber-500 h-2 rounded-full animate-pulse shadow-lg shadow-amber-500/25"></div>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Analysis in progress... This may take a few moments.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (status === "error") {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-red-500/30 rounded-xl p-6 mb-4 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <AlertCircleIcon className="w-6 h-6 text-red-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-white">{symbol}</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30">
                Error
              </span>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-red-300 text-sm">
                {analysis.error || "Unknown error occurred"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state - with proper null checks
  const {
    final_decision,
    confidence_score,
    risk_metrics,
    market_data_summary,
    indicators_summary,
    time_analysis,
  } = analysis;

  const decisionColor = userSymbolSearchService.getDecisionColor(
    final_decision || "hold"
  );

  const getDecisionIcon = () => {
    const iconClass = "w-5 h-5";
    switch (final_decision) {
      case "long":
        return <TrendingUpIcon className={`${iconClass} text-emerald-400`} />;
      case "short":
        return <TrendingDownIcon className={`${iconClass} text-red-400`} />;
      default:
        return <HelpCircleIcon className={`${iconClass} text-gray-400`} />;
    }
  };

  const getTrendIcon = (trend?: string) => {
    const iconClass = "w-4 h-4";
    if (trend === "bullish")
      return <ArrowUpIcon className={`${iconClass} text-emerald-400`} />;
    if (trend === "bearish")
      return <ArrowDownIcon className={`${iconClass} text-red-400`} />;
    return <HelpCircleIcon className={`${iconClass} text-gray-400`} />;
  };

  const getPercentageColor = (value?: number | null) => {
    if (value === undefined || value === null) return "text-gray-400";
    return value >= 0 ? "text-emerald-400" : "text-red-400";
  };

  const getRSIColor = (rsi?: number | null) => {
    if (rsi === undefined || rsi === null) return "text-gray-400";
    return rsi > 70
      ? "text-red-400"
      : rsi < 30
      ? "text-emerald-400"
      : "text-gray-400";
  };

  // Add Risk Assessment section if risk metrics are available
  

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mb-6 hover:bg-gray-800/70">
      {/* Header - Always Visible */}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <DollarSignIcon className="w-6 h-6 text-blue-400" />
            </div>

            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-3">
                <h2 className="text-xl font-bold text-white">{symbol}</h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-white font-semibold backdrop-blur-sm shadow-lg"
                    style={{ backgroundColor: decisionColor }}
                  >
                    {getDecisionIcon()}
                    {final_decision?.toUpperCase() || "HOLD"}
                  </div>

                  {confidence_score !== undefined &&
                    confidence_score !== null && (
                      <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-gray-700 text-gray-300 text-sm font-medium border border-gray-600">
                        <ShieldIcon className="w-4 h-4" />
                        {confidence_score}% Confidence
                      </div>
                    )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Current Price</span>
                  <div className="font-semibold text-white">
                    {formatPrice(market_data_summary?.current_price)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">24h Change</span>
                  <div
                    className={`font-semibold ${getPercentageColor(
                      market_data_summary?.price_change_24h
                    )}`}
                  >
                    {formatPercentage(market_data_summary?.price_change_24h)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Risk/Reward</span>
                  <div className="font-semibold text-white">
                    {risk_metrics?.risk_reward_ratio
                      ? `${risk_metrics.risk_reward_ratio.toFixed(2)}:1`
                      : "Not provided"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Leverage</span>
                  <div className="font-semibold text-white">
                    {risk_metrics?.suggested_leverage
                      ? `${risk_metrics.suggested_leverage}x`
                      : "Not provided"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Expand Button */}
          <button
            onClick={handleToggle}
            className="flex-shrink-0 ml-4 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200 hover:shadow-lg"
          >
            {isExpanded ? (
              <ChevronUpIcon className="w-5 h-5" />
            ) : (
              <ChevronDownIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="border-t border-gray-700">
          <div className="p-6 space-y-6">
            {/* Market Data & Indicators */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Market Data */}
              <Section
                title="Market Data"
                icon={<BarChart3Icon className="w-4 h-4" />}
              >
                <Metric
                  label="Current Price"
                  value={formatPrice(market_data_summary?.current_price)}
                />
                <Metric
                  label="24h Change"
                  value={formatPercentage(
                    market_data_summary?.price_change_24h
                  )}
                  valueClass={getPercentageColor(
                    market_data_summary?.price_change_24h
                  )}
                />
                <Metric
                  label="7d Change"
                  value={formatPercentage(market_data_summary?.price_change_7d)}
                  valueClass={getPercentageColor(
                    market_data_summary?.price_change_7d
                  )}
                />
                <Metric
                  label="24h Volume"
                  value={formatPrice(market_data_summary?.volume_24h)}
                />
                <Metric
                  label="Market Cap"
                  value={formatPrice(market_data_summary?.market_cap)}
                />
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-700">
                  <div>
                    <span className="text-xs text-gray-400">24h High</span>
                    <div className="text-sm font-semibold text-white">
                      {market_data_summary?.high_24h
                        ? formatPrice(market_data_summary.high_24h)
                        : "Not provided"}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">24h Low</span>
                    <div className="text-sm font-semibold text-white">
                      {market_data_summary?.low_24h
                        ? formatPrice(market_data_summary.low_24h)
                        : "Not provided"}
                    </div>
                  </div>
                </div>
              </Section>

              {/* Technical Indicators */}
              <Section
                title="Technical Indicators"
                icon={<ActivityIcon className="w-4 h-4" />}
              >
                <Metric
                  label="RSI"
                  value={formatNumber(indicators_summary?.rsi, 2)}
                  valueClass={getRSIColor(indicators_summary?.rsi)}
                />
                <Metric
                  label="MACD"
                  value={formatNumber(indicators_summary?.macd)}
                />
                <Metric
                  label="Signal Line"
                  value={formatNumber(indicators_summary?.signal_line)}
                />
                <Metric
                  label="ATR"
                  value={formatNumber(indicators_summary?.atr)}
                />
                <Metric
                  label="Trend"
                  value={
                    indicators_summary?.trend
                      ? indicators_summary.trend.toUpperCase()
                      : "Not provided"
                  }
                  icon={getTrendIcon(indicators_summary?.trend)}
                  valueClass={
                    indicators_summary?.trend === "bullish"
                      ? "text-emerald-400"
                      : indicators_summary?.trend === "bearish"
                      ? "text-red-400"
                      : "text-gray-400"
                  }
                />
                <Metric
                  label="Momentum"
                  value={
                    indicators_summary?.momentum
                      ? indicators_summary.momentum.toUpperCase()
                      : "Not provided"
                  }
                  valueClass={
                    indicators_summary?.momentum === "strong"
                      ? "text-emerald-400"
                      : indicators_summary?.momentum === "moderate"
                      ? "text-amber-400"
                      : "text-gray-400"
                  }
                />
              </Section>
            </div>

            

            {/* Price Levels */}
            {risk_metrics && (
              <Section
                title="Price Levels"
                icon={<TargetIcon className="w-4 h-4" />}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  <PriceCard
                    title="Entry"
                    color="blue"
                    value={risk_metrics.entry_price}
                  />
                  <PriceCard
                    title="Stop Loss"
                    color="red"
                    value={risk_metrics.stop_loss_price}
                  />
                  <PriceCard
                    title="TP 1"
                    color="emerald"
                    value={risk_metrics.take_profit_1}
                  />
                  <PriceCard
                    title="TP 2"
                    color="emerald"
                    value={risk_metrics.take_profit_2}
                  />
                  <PriceCard
                    title="TP 3"
                    color="emerald"
                    value={risk_metrics.take_profit_3}
                  />
                </div>
              </Section>
            )}

            {/* Time Analysis */}
            {time_analysis && time_analysis.length > 0 && (
              <Section
                title="Timeframe Analysis"
                icon={<ClockIcon className="w-4 h-4" />}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {time_analysis.map((timeframe, index) => (
                    <div
                      key={index}
                      className="bg-gray-700/50 rounded-lg p-4 backdrop-blur-sm border border-gray-600"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">
                          {timeframe.timeframe}
                        </span>
                        <div
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            timeframe.score >= 7
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : timeframe.score >= 4
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : "bg-red-500/20 text-red-300 border border-red-500/30"
                          }`}
                        >
                          Score: {timeframe.score}/10
                        </div>
                      </div>
                      <p className="text-sm text-gray-300">
                        {timeframe.recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable Components with proper typing
const Section: React.FC<{
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}> = ({ title, icon, children, className = "" }) => (
  <div className={className}>
    <div className="flex items-center gap-2 mb-4">
      {icon}
      <h3 className="text-lg font-semibold text-white">{title}</h3>
    </div>
    {children}
  </div>
);

const Metric: React.FC<{
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  valueClass?: string;
  className?: string;
}> = ({ label, value, icon, valueClass = "text-white", className = "" }) => {
  const displayValue = value === "N/A" ? "Not provided" : value;

  return (
    <div
      className={`flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0 ${className}`}
    >
      <span className="text-sm text-gray-400">{label}</span>
      <div className="flex items-center gap-1">
        {icon}
        <span className={`text-sm font-semibold ${valueClass}`}>
          {displayValue}
        </span>
      </div>
    </div>
  );
};

// New RiskCard component to replace the unused RiskMetric
const RiskCard: React.FC<{
  label: string;
  value: string;
  color: "blue" | "red" | "emerald" | "amber" | "purple" | "gray";
  className?: string;
}> = ({ label, value, color, className = "" }) => {
  const colorClasses = {
    blue: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    red: "bg-red-500/20 text-red-300 border-red-500/30",
    emerald: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    amber: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    purple: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    gray: "bg-gray-700 text-gray-300 border-gray-600",
  };

  const displayValue = value === "N/A" ? "Not provided" : value;

  return (
    <div
      className={`border rounded-lg p-3 text-center backdrop-blur-sm ${colorClasses[color]} ${className}`}
    >
      <div className="text-xs font-medium mb-1">{label}</div>
      <div className="text-lg font-bold">{displayValue}</div>
    </div>
  );
};

// Enhanced PriceCard component
const PriceCard: React.FC<{
  title: string;
  color: string;
  value?: number | null;
  className?: string;
}> = ({ title, color, value, className = "" }) => {
  const displayValue =
    value === null || value === undefined ? "Not provided" : formatPrice(value);

  const colorClasses = {
    blue: "bg-blue-500/20 border-blue-500/30 text-blue-300",
    red: "bg-red-500/20 border-red-500/30 text-red-300",
    emerald: "bg-emerald-500/20 border-emerald-500/30 text-emerald-300",
  };

  return (
    <div
      className={`border rounded-lg p-4 text-center backdrop-blur-sm ${
        colorClasses[color as keyof typeof colorClasses]
      } ${className}`}
    >
      <div className="text-sm font-medium mb-2">{title}</div>
      <div className="text-xl font-bold">{displayValue}</div>
    </div>
  );
};