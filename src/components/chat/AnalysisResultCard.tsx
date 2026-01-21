// ============================================================================
// FILE: src/components/chat/AnalysisResultCard.tsx
// Compact analysis result card for chat display
// ============================================================================

import React, { useState } from 'react';
import {
  TrendingUpIcon,
  TrendingDownIcon,
  MinusIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  AlertCircleIcon,
} from 'lucide-react';
import { SymbolAnalysisResult } from '../../types/userSymbolSearch.types';

interface AnalysisResultCardProps {
  result: SymbolAnalysisResult;
}

export const AnalysisResultCard: React.FC<AnalysisResultCardProps> = ({
  result,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getDecisionColor = (decision?: string | null) => {
    switch (decision) {
      case 'long':
        return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      case 'short':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getDecisionIcon = (decision?: string | null) => {
    switch (decision) {
      case 'long':
        return <TrendingUpIcon className="w-4 h-4" />;
      case 'short':
        return <TrendingDownIcon className="w-4 h-4" />;
      default:
        return <MinusIcon className="w-4 h-4" />;
    }
  };

  const formatPrice = (price?: number | null) => {
    if (!price) return 'N/A';
    if (price >= 1000) {
      return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    }
    return `$${price.toFixed(4)}`;
  };

  const formatPercent = (value?: number | null) => {
    if (!value) return 'N/A';
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  // Handle error state
  if (result.status === 'error') {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <AlertCircleIcon className="w-5 h-5 text-red-400" />
          <div>
            <span className="font-semibold text-white">{result.symbol}</span>
            <p className="text-sm text-red-300 mt-1">
              {result.error || 'Analysis failed'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Handle pending state
  if (result.status === 'pending') {
    return (
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          <span className="font-semibold text-white">{result.symbol}</span>
          <span className="text-sm text-yellow-300">Processing...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-700/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          {/* Symbol */}
          <span className="font-bold text-white text-lg">{result.symbol}</span>

          {/* Decision Badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${getDecisionColor(
              result.final_decision
            )}`}
          >
            {getDecisionIcon(result.final_decision)}
            <span className="text-sm font-semibold uppercase">
              {result.final_decision || 'Hold'}
            </span>
          </div>

          {/* Consensus */}
          {result.consensus_strength && (
            <span className="text-sm text-gray-400">
              {result.consensus_strength}% consensus
            </span>
          )}
        </div>

        {/* Expand/Collapse */}
        <div className="flex items-center gap-3">
          {/* Price Preview */}
          {result.market_data_summary?.current_price && (
            <span className="text-gray-300 font-medium">
              {formatPrice(result.market_data_summary.current_price)}
            </span>
          )}
          {isExpanded ? (
            <ChevronUpIcon className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-gray-700 p-4 space-y-4">
          {/* Market Data */}
          {result.market_data_summary && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Market Data
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <span className="text-xs text-gray-500">Price</span>
                  <p className="text-white font-semibold">
                    {formatPrice(result.market_data_summary.current_price)}
                  </p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <span className="text-xs text-gray-500">24h Change</span>
                  <p
                    className={`font-semibold ${
                      (result.market_data_summary.price_change_24h || 0) >= 0
                        ? 'text-emerald-400'
                        : 'text-red-400'
                    }`}
                  >
                    {formatPercent(result.market_data_summary.price_change_24h)}
                  </p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <span className="text-xs text-gray-500">24h High</span>
                  <p className="text-white font-semibold">
                    {formatPrice(result.market_data_summary.high_24h)}
                  </p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <span className="text-xs text-gray-500">24h Low</span>
                  <p className="text-white font-semibold">
                    {formatPrice(result.market_data_summary.low_24h)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Risk Metrics */}
          {result.risk_metrics && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Risk Metrics
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <span className="text-xs text-gray-500">Entry</span>
                  <p className="text-white font-semibold">
                    {formatPrice(result.risk_metrics.entry_price)}
                  </p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <span className="text-xs text-gray-500">Stop Loss</span>
                  <p className="text-red-400 font-semibold">
                    {formatPrice(result.risk_metrics.stop_loss_price)}
                  </p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <span className="text-xs text-gray-500">Take Profit</span>
                  <p className="text-emerald-400 font-semibold">
                    {formatPrice(result.risk_metrics.take_profit_price)}
                  </p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <span className="text-xs text-gray-500">R:R Ratio</span>
                  <p className="text-cyan-400 font-semibold">
                    {result.risk_metrics.risk_reward_ratio?.toFixed(2) || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Leverage */}
              {result.risk_metrics.suggested_leverage && (
                <div className="mt-3 bg-gray-900/50 rounded-lg p-3 inline-block">
                  <span className="text-xs text-gray-500">
                    Suggested Leverage:{' '}
                  </span>
                  <span
                    className={`font-bold ${
                      result.risk_metrics.suggested_leverage >= 5
                        ? 'text-red-400'
                        : result.risk_metrics.suggested_leverage >= 3
                        ? 'text-yellow-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {result.risk_metrics.suggested_leverage}x
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Technical Indicators */}
          {result.indicators_summary && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Technical Indicators
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <span className="text-xs text-gray-500">RSI</span>
                  <p
                    className={`font-semibold ${
                      result.indicators_summary.rsi > 70
                        ? 'text-red-400'
                        : result.indicators_summary.rsi < 30
                        ? 'text-emerald-400'
                        : 'text-white'
                    }`}
                  >
                    {result.indicators_summary.rsi?.toFixed(1)}
                  </p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <span className="text-xs text-gray-500">MACD</span>
                  <p className="text-white font-semibold">
                    {result.indicators_summary.macd?.toFixed(4)}
                  </p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <span className="text-xs text-gray-500">Signal</span>
                  <p className="text-white font-semibold">
                    {result.indicators_summary.signal_line?.toFixed(4)}
                  </p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <span className="text-xs text-gray-500">ATR</span>
                  <p className="text-white font-semibold">
                    {result.indicators_summary.atr?.toFixed(4)}
                  </p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <span className="text-xs text-gray-500">Trend</span>
                  <p
                    className={`font-semibold capitalize ${
                      result.indicators_summary.trend === 'bullish'
                        ? 'text-emerald-400'
                        : result.indicators_summary.trend === 'bearish'
                        ? 'text-red-400'
                        : 'text-gray-400'
                    }`}
                  >
                    {result.indicators_summary.trend}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
