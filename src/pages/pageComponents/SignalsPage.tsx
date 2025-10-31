import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  SignalResponse,
  SignalDetailResponse,
  SignalFilters,
} from "../../types/signals.types";
import { signalsService } from "../../api/services/signalsService";
import {
  TrendingUp,
  TrendingDown,
  Target,
  BarChart3,
  Shield,
  Zap,
  Clock,
  AlertTriangle,
  CheckCircle,
  X,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Cpu,
  Database
} from 'lucide-react';

// Components
const LoadingSpinner: React.FC<{ size?: "sm" | "md" | "lg" }> = ({
  size = "md",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div
      className={`animate-spin rounded-full border-2 border-cyan-500 border-t-transparent ${sizeClasses[size]}`}
    />
  );
};

const ErrorMessage: React.FC<{ message: string; onRetry?: () => void }> = ({
  message,
  onRetry,
}) => (
  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
    <div className="flex items-center justify-center mb-3">
      <AlertTriangle className="w-6 h-6 text-red-400" />
    </div>
    <p className="text-red-200 text-sm mb-3 font-light">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg transition-all hover:bg-red-500/30 text-sm font-medium"
      >
        Retry Connection
      </button>
    )}
  </div>
);

const EmptyState: React.FC<{
  title: string;
  description: string;
}> = ({ title, description }) => (
  <div className="bg-gray-800/20 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-700/30">
    <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/20">
      <Database className="w-8 h-8 text-cyan-400" />
    </div>
    <h3 className="text-gray-300 text-lg font-light mb-2">{title}</h3>
    <p className="text-gray-500 text-sm font-light">{description}</p>
  </div>
);

// Signal Detail Modal Component
const SignalDetailModal: React.FC<{
  signal: SignalDetailResponse | null;
  onClose: () => void;
  formatDate: (dateString: string) => string;
  getDecisionColor: (decision: string) => string;
  getSignalQualityColor: (quality: string | null) => string;
  getConsensusStrengthColor: (strength: number) => string;
  getLeverageColor: (leverage: number | null) => string;
  getPriceChangeColor: (value: number | null) => string;
}> = ({
  signal,
  onClose,
  formatDate,
  getDecisionColor,
  getSignalQualityColor,
  getConsensusStrengthColor,
  getLeverageColor,
  getPriceChangeColor,
}) => {
  if (!signal) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800/20 backdrop-blur-sm rounded-xl border border-gray-700/30 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-light text-white">
              Signal Analysis: {signal.symbol}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-all p-2 hover:bg-gray-700/30 rounded-lg"
              aria-label="Close details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${getDecisionColor(
                signal.final_decision
              )}`}
            >
              {signal.final_decision.toUpperCase()}
            </span>
            {signal.is_futures_ready && (
              <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs font-medium border border-cyan-500/30">
                <Zap className="w-3 h-3 inline mr-1" />
                Futures Ready
              </span>
            )}
          </div>

          <div className="space-y-6">
            {/* Signal Quality & Consensus */}
            <div className="bg-gray-700/20 rounded-lg p-4 border border-gray-600/20">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-400 text-sm font-light">Signal Quality</span>
                <span
                  className={`px-2 py-1 rounded text-sm font-medium ${getSignalQualityColor(
                    signal.signal_quality
                  )}`}
                >
                  {signal.signal_quality?.toUpperCase()}
                </span>
              </div>

              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-400 text-sm font-light">Consensus Strength</span>
                <span
                  className={`text-lg font-light ${getConsensusStrengthColor(
                    signal.consensus_strength
                  )}`}
                >
                  {signal.consensus_strength}%
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-light">Signal Generated</span>
                <span className="text-white font-light">
                  {formatDate(signal.created_at)}
                </span>
              </div>

              {signal.analysis_duration_ms && (
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-400 font-light">Analysis Speed</span>
                  <span className="text-cyan-400 font-light">
                    {signal.analysis_duration_ms}ms
                  </span>
                </div>
              )}
            </div>

            {/* Leverage & Risk */}
            {(signal.suggested_leverage ||
              signal.risk_per_trade ||
              signal.max_position_size) && (
              <div>
                <h4 className="font-medium text-white mb-4 text-lg border-b border-gray-700/30 pb-2">
                  Risk Parameters
                </h4>
                <div className="space-y-3">
                  {signal.suggested_leverage && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm font-light">Suggested Leverage</span>
                      <span
                        className={`text-lg font-light ${getLeverageColor(
                          signal.suggested_leverage
                        )}`}
                      >
                        {signal.suggested_leverage}x
                      </span>
                    </div>
                  )}
                  {signal.risk_per_trade && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm font-light">Risk per Trade</span>
                      <span className="text-lg font-light text-amber-400">
                        {signal.risk_per_trade}%
                      </span>
                    </div>
                  )}
                  {signal.max_position_size && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm font-light">Max Position Size</span>
                      <span className="text-lg font-light text-blue-400">
                        {signal.max_position_size.toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Price Levels */}
            {(signal.entry_price ||
              signal.take_profit_1 ||
              signal.stop_loss_price) && (
              <div>
                <h4 className="font-medium text-white mb-4 text-lg border-b border-gray-700/30 pb-2">
                  Price Levels
                </h4>
                <div className="space-y-3">
                  {signal.entry_price && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm font-light">Entry Price</span>
                      <span className="text-lg font-light text-white">
                        ${signal.entry_price.toFixed(8)}
                      </span>
                    </div>
                  )}
                  {signal.take_profit_1 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm font-light">Take Profit 1</span>
                      <div className="text-right">
                        <div className="text-lg font-light text-emerald-400">
                          ${signal.take_profit_1.toFixed(8)}
                        </div>
                      </div>
                    </div>
                  )}
                  {signal.take_profit_2 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm font-light">Take Profit 2</span>
                      <div className="text-right">
                        <div className="text-lg font-light text-emerald-400">
                          ${signal.take_profit_2.toFixed(8)}
                        </div>
                      </div>
                    </div>
                  )}
                  {signal.take_profit_3 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm font-light">Take Profit 3</span>
                      <div className="text-right">
                        <div className="text-lg font-light text-emerald-400">
                          ${signal.take_profit_3.toFixed(8)}
                        </div>
                      </div>
                    </div>
                  )}
                  {signal.stop_loss_price && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm font-light">Stop Loss</span>
                      <div className="text-right">
                        <div className="text-lg font-light text-red-400">
                          ${signal.stop_loss_price.toFixed(8)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Risk Metrics */}
            {(signal.estimated_tp_percent ||
              signal.estimated_sl_percent ||
              signal.risk_reward_ratio) && (
              <div>
                <h4 className="font-medium text-white mb-4 text-lg border-b border-gray-700/30 pb-2">
                  Performance Metrics
                </h4>
                <div className="space-y-3">
                  {signal.estimated_tp_percent && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm font-light">Target Profit</span>
                      <span className="text-lg font-light text-emerald-400">
                        +{signal.estimated_tp_percent.toFixed(2)}%
                      </span>
                    </div>
                  )}
                  {signal.estimated_sl_percent && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm font-light">Stop Loss</span>
                      <span className="text-lg font-light text-red-400">
                        -{signal.estimated_sl_percent.toFixed(2)}%
                      </span>
                    </div>
                  )}
                  {signal.risk_reward_ratio && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm font-light">Risk/Reward Ratio</span>
                      <span
                        className={`text-lg font-light ${getPriceChangeColor(
                          signal.risk_reward_ratio
                        )}`}
                      >
                        {signal.risk_reward_ratio.toFixed(2)}:1
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Expiration */}
            {signal.expires_at && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-amber-400 font-light">Valid Until</span>
                  <span className="text-amber-300 font-light">
                    {formatDate(signal.expires_at.toString())}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Close Button */}
          <div className="mt-8 pt-6 border-t border-gray-700/30">
            <button
              onClick={onClose}
              className="w-full px-4 py-3 bg-gray-700/30 hover:bg-gray-700/50 text-white rounded-lg transition-all font-medium border border-gray-600/30"
            >
              Close Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SignalPage: React.FC = () => {
  const [allSignals, setAllSignals] = useState<SignalResponse[]>([]);
  const [selectedSignal, setSelectedSignal] = useState<SignalDetailResponse | null>(null);
  const [availableSymbols, setAvailableSymbols] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SignalFilters>({
    symbol: undefined,
    decision: undefined,
    signal_quality: undefined,
    futures_ready: undefined,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const signalsPerPage = 10;

  // Memoized calculations
  const filteredSignals = useMemo(() => {
    let filtered = allSignals;

    if (filters.symbol) {
      filtered = filtered.filter((signal) =>
        signal.symbol.toLowerCase().includes(filters.symbol!.toLowerCase())
      );
    }

    if (filters.decision) {
      filtered = filtered.filter(
        (signal) => signal.final_decision === filters.decision
      );
    }

    if (filters.signal_quality) {
      filtered = filtered.filter(
        (signal) => signal.signal_quality === filters.signal_quality
      );
    }

    if (filters.futures_ready !== undefined) {
      filtered = filtered.filter(
        (signal) => signal.is_futures_ready === filters.futures_ready
      );
    }

    return filtered;
  }, [allSignals, filters]);

  const paginatedSignals = useMemo(() => {
    const startIndex = (currentPage - 1) * signalsPerPage;
    return filteredSignals.slice(startIndex, startIndex + signalsPerPage);
  }, [filteredSignals, currentPage]);

  const totalPages = Math.ceil(filteredSignals.length / signalsPerPage);

  const clientStats = useMemo(() => {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const recentSignals = allSignals.filter(
      (signal) => new Date(signal.created_at) >= twentyFourHoursAgo
    );

    const longSignals = recentSignals.filter(
      (s) => s.final_decision === "long"
    ).length;
    const shortSignals = recentSignals.filter(
      (s) => s.final_decision === "short"
    ).length;
    const totalActiveSignals = longSignals + shortSignals;

    let avgConsensus = 0;
    let avgLeverage = 0;
    if (recentSignals.length > 0) {
      const totalConsensus = recentSignals.reduce(
        (sum, signal) => sum + signal.consensus_strength,
        0
      );
      avgConsensus = totalConsensus / recentSignals.length;

      const signalsWithLeverage = recentSignals.filter(
        (s) => s.suggested_leverage
      );
      if (signalsWithLeverage.length > 0) {
        const totalLeverage = signalsWithLeverage.reduce(
          (sum, signal) => sum + (signal.suggested_leverage || 0),
          0
        );
        avgLeverage = totalLeverage / signalsWithLeverage.length;
      }
    }

    // Signal quality distribution
    const qualityDistribution = {
      divine: recentSignals.filter((s) => s.signal_quality === "divine").length,
      excellent: recentSignals.filter((s) => s.signal_quality === "excellent")
        .length,
      very_good: recentSignals.filter((s) => s.signal_quality === "very_good")
        .length,
      good: recentSignals.filter((s) => s.signal_quality === "good").length,
      caution: recentSignals.filter((s) => s.signal_quality === "caution")
        .length,
    };

    const futuresReadySignals = recentSignals.filter(
      (s) => s.is_futures_ready
    ).length;

    const symbolCounts = recentSignals
      .filter((s) => s.final_decision !== "hold")
      .reduce((acc, signal) => {
        acc[signal.symbol] = (acc[signal.symbol] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const mostActiveSymbols = Object.entries(symbolCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([symbol, count]) => ({ symbol, signal_count: count }));

    return {
      timeframe: "24h",
      total_signals: totalActiveSignals,
      decisions: {
        long: longSignals,
        short: shortSignals,
        hold: 0,
      },
      avg_consensus_strength: avgConsensus,
      avg_leverage: avgLeverage,
      signal_quality_distribution: qualityDistribution,
      most_active_symbols: mostActiveSymbols,
      total_futures_ready: futuresReadySignals,
    };
  }, [allSignals]);

  // Effects
  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Event handlers
  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const signalsResponse = await signalsService.getSignals({ limit: 100 });
      const allSignalsData = signalsResponse.signals;
      const activeSignals = allSignalsData.filter(
        (signal) => signal.final_decision !== "hold"
      );

      setAllSignals(activeSignals);
      setAvailableSymbols(
        Array.from(new Set(activeSignals.map((signal) => signal.symbol))).sort()
      );
    } catch (err) {
      setError("Failed to load trading signals. Please try again.");
      console.error("Failed to load initial data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = useCallback(
    (newFilters: Partial<SignalFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    []
  );

  const handleSignalSelect = async (signalId: string) => {
    try {
      const signalDetail = await signalsService.getSignal(signalId);
      setSelectedSignal(signalDetail);
    } catch (err) {
      console.error("Failed to load signal details:", err);
    }
  };

  const handleCloseModal = () => {
    setSelectedSignal(null);
  };

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    if (window.innerWidth < 1024) {
      const signalsSection = document.getElementById("signals-list");
      signalsSection?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Utility functions
  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const getDecisionColor = useCallback((decision: string) => {
    const colors = {
      long: "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20",
      short: "text-red-400 bg-red-500/10 border border-red-500/20",
      default: "text-gray-400 bg-gray-500/10 border border-gray-500/20",
    };
    return colors[decision as keyof typeof colors] || colors.default;
  }, []);

  const getSignalQualityColor = useCallback((quality: string | null) => {
    const colors = {
      divine: "text-amber-400 bg-amber-500/10 border border-amber-500/20",
      excellent: "text-violet-400 bg-violet-500/10 border border-violet-500/20",
      very_good: "text-blue-400 bg-blue-500/10 border border-blue-500/20",
      good: "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20",
      caution: "text-orange-400 bg-orange-500/10 border border-orange-500/20",
      default: "text-gray-400 bg-gray-500/10 border border-gray-500/20",
    };
    return colors[quality as keyof typeof colors] || colors.default;
  }, []);

  const getPriceChangeColor = useCallback((value: number | null) => {
    if (!value) return "text-gray-300";
    return value >= 0 ? "text-emerald-400" : "text-red-400";
  }, []);

  const getConsensusStrengthColor = useCallback((strength: number) => {
    if (strength >= 90) return "text-emerald-400";
    if (strength >= 80) return "text-cyan-400";
    if (strength >= 70) return "text-amber-400";
    return "text-red-400";
  }, []);

  const getLeverageColor = useCallback((leverage: number | null) => {
    if (!leverage) return "text-gray-300";
    if (leverage >= 5) return "text-red-400";
    if (leverage >= 3) return "text-amber-400";
    return "text-emerald-400";
  }, []);

  const calculatePercentageChange = useCallback(
    (currentPrice: number, entryPrice: number): number => {
      return ((currentPrice - entryPrice) / entryPrice) * 100;
    },
    []
  );

  const calculateProgressWidth = useCallback(
    (numerator: number, denominator: number): number => {
      return denominator === 0 ? 0 : (numerator / denominator) * 100;
    },
    []
  );

  const getPageNumbers = useCallback(() => {
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  }, [currentPage, totalPages]);

  // Loading state
  if (loading && allSignals.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-cyan-400 text-lg mt-4 font-light">
            Loading algorithmic signals...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900/80 border-b border-gray-800/30 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-light text-white">
                  Algorithmic Signals
                </h1>
                <p className="text-gray-400 text-sm font-light">
                  Institutional-grade trading opportunities with AI analysis
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400 font-light">Last Updated</div>
              <div className="text-sm text-cyan-400 font-light">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        {/* Error State */}
        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onRetry={loadInitialData} />
          </div>
        )}

        {/* Stats Overview */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-gray-800/20 backdrop-blur-sm p-5 rounded-xl border border-gray-700/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2 font-light">
                    Active Signals
                  </h3>
                  <p className="text-2xl font-light text-cyan-400">
                    {clientStats.total_signals}
                  </p>
                </div>
                <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center border border-cyan-500/20">
                  <Zap className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 font-light">Last 24 hours</p>
            </div>

            <div className="bg-gray-800/20 backdrop-blur-sm p-5 rounded-xl border border-gray-700/30">
              <h3 className="text-sm font-medium text-gray-400 mb-2 font-light">
                Long Positions
              </h3>
              <p className="text-2xl font-light text-emerald-400">
                {clientStats.decisions.long}
              </p>
              <div className="w-full bg-gray-700/30 rounded-full h-1.5 mt-3">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${calculateProgressWidth(
                      clientStats.decisions.long,
                      clientStats.total_signals
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="bg-gray-800/20 backdrop-blur-sm p-5 rounded-xl border border-gray-700/30">
              <h3 className="text-sm font-medium text-gray-400 mb-2 font-light">
                Short Positions
              </h3>
              <p className="text-2xl font-light text-red-400">
                {clientStats.decisions.short}
              </p>
              <div className="w-full bg-gray-700/30 rounded-full h-1.5 mt-3">
                <div
                  className="bg-gradient-to-r from-red-500 to-red-400 h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${calculateProgressWidth(
                      clientStats.decisions.short,
                      clientStats.total_signals
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="bg-gray-800/20 backdrop-blur-sm p-5 rounded-xl border border-gray-700/30">
              <h3 className="text-sm font-medium text-gray-400 mb-2 font-light">
                Avg Consensus
              </h3>
              <p
                className={`text-2xl font-light ${getConsensusStrengthColor(
                  clientStats.avg_consensus_strength
                )}`}
              >
                {clientStats.avg_consensus_strength.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 mt-2 font-light">Signal Strength</p>
            </div>

            <div className="bg-gray-800/20 backdrop-blur-sm p-5 rounded-xl border border-gray-700/30">
              <h3 className="text-sm font-medium text-gray-400 mb-2 font-light">
                Avg Leverage
              </h3>
              <p
                className={`text-2xl font-light ${getLeverageColor(
                  clientStats.avg_leverage
                )}`}
              >
                {clientStats.avg_leverage.toFixed(1)}x
              </p>
              <p className="text-xs text-gray-500 mt-2 font-light">Risk Level</p>
            </div>
          </div>

          {/* Quality Distribution */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2">
            {Object.entries(clientStats.signal_quality_distribution).map(
              ([quality, count]) => (
                <div
                  key={quality}
                  className="bg-gray-800/30 rounded-lg p-3 text-center border border-gray-700/30"
                >
                  <div className={`text-sm font-medium capitalize mb-1 ${getSignalQualityColor(quality)}`}>
                    {quality.replace('_', ' ')}
                  </div>
                  <div className="text-white text-lg font-light">{count}</div>
                </div>
              )
            )}
          </div>
        </section>

        {/* Main Content */}
        <div className="flex flex-col">
          {/* Filters */}
          <section className="bg-gray-800/20 backdrop-blur-sm rounded-xl border border-gray-700/30 mb-6">
            <div className="p-5">
              <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4 text-cyan-400" />
                Filter Signals
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 font-light">
                    Instrument
                  </label>
                  <select
                    value={filters.symbol || ""}
                    onChange={(e) =>
                      handleFilterChange({
                        symbol: e.target.value || undefined,
                      })
                    }
                    className="w-full bg-gray-700/30 border border-gray-600/30 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-sm font-light"
                  >
                    <option value="">All Instruments</option>
                    {availableSymbols.map((symbol) => (
                      <option key={symbol} value={symbol}>
                        {symbol}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 font-light">
                    Position Type
                  </label>
                  <select
                    value={filters.decision || ""}
                    onChange={(e) =>
                      handleFilterChange({
                        decision: e.target.value as
                          | "long"
                          | "short"
                          | undefined,
                      })
                    }
                    className="w-full bg-gray-700/30 border border-gray-600/30 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-sm font-light"
                  >
                    <option value="">All Positions</option>
                    <option value="long">Long Only</option>
                    <option value="short">Short Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 font-light">
                    Signal Quality
                  </label>
                  <select
                    value={filters.signal_quality || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleFilterChange({
                        signal_quality:
                          value === ""
                            ? undefined
                            : (value as
                                | "divine"
                                | "excellent"
                                | "very_good"
                                | "good"
                                | "caution"),
                      });
                    }}
                    className="w-full bg-gray-700/30 border border-gray-600/30 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-sm font-light"
                  >
                    <option value="">All Qualities</option>
                    <option value="divine">Divine</option>
                    <option value="excellent">Excellent</option>
                    <option value="very_good">Very Good</option>
                    <option value="good">Good</option>
                    <option value="caution">Caution</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 font-light">
                    Results
                  </label>
                  <div className="bg-gray-700/20 rounded-lg px-3 py-2.5 text-sm text-gray-400 font-light border border-gray-600/30">
                    Page {currentPage} of {totalPages} •{" "}
                    {filteredSignals.length} signals
                  </div>
                </div>
              </div>

              {/* Advanced Filters */}
              <div className="mt-4 flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.futures_ready || false}
                    onChange={(e) =>
                      handleFilterChange({
                        futures_ready: e.target.checked || undefined,
                      })
                    }
                    className="rounded border-gray-600 bg-gray-700/30 text-cyan-500 focus:ring-cyan-500"
                  />
                  <span className="text-sm text-gray-300 font-light">
                    Futures Ready Only
                  </span>
                </label>
              </div>
            </div>
          </section>

          {/* Signals List */}
          <section id="signals-list">
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-800/20 rounded-xl p-5 animate-pulse border border-gray-700/30"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-2">
                        <div className="h-6 bg-gray-700/30 rounded w-24"></div>
                        <div className="h-4 bg-gray-700/30 rounded w-32"></div>
                      </div>
                      <div className="h-4 bg-gray-700/30 rounded w-20"></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[...Array(4)].map((_, j) => (
                        <div key={j} className="space-y-2">
                          <div className="h-4 bg-gray-700/30 rounded w-16"></div>
                          <div className="h-6 bg-gray-700/30 rounded w-20"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : paginatedSignals.length > 0 ? (
              <div className="space-y-4">
                {paginatedSignals.map((signal) => {
                  const tp1Percentage =
                    signal.entry_price && signal.take_profit_1
                      ? calculatePercentageChange(
                          signal.take_profit_1,
                          signal.entry_price
                        )
                      : null;

                  const slPercentage =
                    signal.entry_price && signal.stop_loss_price
                      ? calculatePercentageChange(
                          signal.stop_loss_price,
                          signal.entry_price
                        )
                      : null;

                  return (
                    <div
                      key={signal.id}
                      className={`bg-gray-800/20 backdrop-blur-sm rounded-xl p-5 cursor-pointer transition-all duration-300 border ${
                        selectedSignal?.id === signal.id
                          ? "border-cyan-500 shadow-lg shadow-cyan-500/20"
                          : "border-gray-700/30 hover:border-cyan-500/30 hover:shadow-lg"
                      } ${
                        signal.is_futures_ready
                          ? "ring-1 ring-cyan-500/20"
                          : ""
                      }`}
                      onClick={() => handleSignalSelect(signal.id)}
                    >
                      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 gap-3">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          <div className="text-xl font-light text-white">
                            {signal.symbol}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getDecisionColor(
                                signal.final_decision
                              )}`}
                            >
                              {signal.final_decision === 'long' ? (
                                <ArrowUpRight className="w-3 h-3 inline mr-1" />
                              ) : (
                                <ArrowDownRight className="w-3 h-3 inline mr-1" />
                              )}
                              {signal.final_decision.toUpperCase()}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-sm font-medium ${getSignalQualityColor(
                                signal.signal_quality
                              )}`}
                            >
                              {signal.signal_quality?.toUpperCase()}
                            </span>
                            <div
                              className={`text-sm font-medium ${getConsensusStrengthColor(
                                signal.consensus_strength
                              )}`}
                            >
                              {signal.consensus_strength}% Consensus
                            </div>
                            {signal.is_futures_ready && (
                              <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs font-medium border border-cyan-500/30">
                                <Zap className="w-3 h-3 inline mr-1" />
                                Futures Ready
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400 font-light">
                            {formatDate(signal.created_at)}
                          </div>
                          {signal.analysis_duration_ms && (
                            <div className="text-xs text-cyan-400 font-light">
                              Analyzed in {signal.analysis_duration_ms}ms
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
                        {signal.entry_price && (
                          <div>
                            <span className="text-gray-400 text-sm font-light">
                              Entry Price
                            </span>
                            <div className="text-lg font-light text-white">
                              ${signal.entry_price.toFixed(8)}
                            </div>
                          </div>
                        )}
                        {signal.take_profit_1 && tp1Percentage !== null && (
                          <div>
                            <span className="text-gray-400 text-sm font-light">
                              Take Profit 1
                            </span>
                            <div className="text-lg font-light text-emerald-400">
                              ${signal.take_profit_1.toFixed(8)}
                              <span className="text-sm ml-2 font-light">
                                (+{tp1Percentage.toFixed(2)}%)
                              </span>
                            </div>
                          </div>
                        )}
                        {signal.stop_loss_price && slPercentage !== null && (
                          <div>
                            <span className="text-gray-400 text-sm font-light">
                              Stop Loss
                            </span>
                            <div className="text-lg font-light text-red-400">
                              ${signal.stop_loss_price.toFixed(8)}
                              <span className="text-sm ml-2 font-light">
                                ({slPercentage.toFixed(2)}%)
                              </span>
                            </div>
                          </div>
                        )}
                        {signal.risk_reward_ratio && (
                          <div>
                            <span className="text-gray-400 text-sm font-light">
                              Risk/Reward
                            </span>
                            <div
                              className={`text-lg font-light ${getPriceChangeColor(
                                signal.risk_reward_ratio
                              )}`}
                            >
                              {signal.risk_reward_ratio.toFixed(2)}:1
                            </div>
                          </div>
                        )}
                        {signal.suggested_leverage && (
                          <div>
                            <span className="text-gray-400 text-sm font-light">
                              Leverage
                            </span>
                            <div
                              className={`text-lg font-light ${getLeverageColor(
                                signal.suggested_leverage
                              )}`}
                            >
                              {signal.suggested_leverage}x
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Additional Take Profit Levels */}
                      {(signal.take_profit_2 || signal.take_profit_3) && (
                        <div className="mt-4 pt-4 border-t border-gray-700/30">
                          <div className="text-sm text-gray-400 mb-2 font-light">
                            Additional Take Profits:
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {signal.take_profit_2 && (
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400 font-light">TP2:</span>
                                <span className="text-emerald-400 font-light">
                                  ${signal.take_profit_2.toFixed(8)}
                                </span>
                              </div>
                            )}
                            {signal.take_profit_3 && (
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400 font-light">TP3:</span>
                                <span className="text-emerald-400 font-light">
                                  ${signal.take_profit_3.toFixed(8)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title="No signals found"
                description="Try adjusting your filters to see more results"
              />
            )}
          </section>

          {/* Pagination */}
          {totalPages > 1 && (
            <section className="mt-6">
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-800/30 border border-gray-600/30 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/30 transition-all flex items-center text-sm font-medium"
                >
                  <span>←</span>
                  <span className="ml-2">Previous</span>
                </button>

                <div className="flex space-x-1">
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                        currentPage === page
                          ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/25"
                          : "bg-gray-800/30 text-gray-300 hover:bg-gray-700/30 border border-gray-600/30"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-800/30 border border-gray-600/30 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/30 transition-all flex items-center text-sm font-medium"
                >
                  <span className="mr-2">Next</span>
                  <span>→</span>
                </button>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Signal Detail Modal */}
      <SignalDetailModal
        signal={selectedSignal}
        onClose={handleCloseModal}
        formatDate={formatDate}
        getDecisionColor={getDecisionColor}
        getSignalQualityColor={getSignalQualityColor}
        getConsensusStrengthColor={getConsensusStrengthColor}
        getLeverageColor={getLeverageColor}
        getPriceChangeColor={getPriceChangeColor}
      />
    </div>
  );
};

export default SignalPage;