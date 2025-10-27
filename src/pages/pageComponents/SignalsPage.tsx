import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  SignalResponse,
  SignalDetailResponse,
  SignalFilters
} from '../../types/signals.types';
import { signalsService } from '../../api/services/signalsService';

// Components
const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-amber-500 border-t-transparent ${sizeClasses[size]}`} />
  );
};

const ErrorMessage: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-center">
    <div className="text-red-400 text-lg mb-2">⚠️</div>
    <p className="text-red-200 text-sm mb-3">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
      >
        Try Again
      </button>
    )}
  </div>
);

const EmptyState: React.FC<{ title: string; description: string; icon?: string }> = ({ 
  title, 
  description, 
  icon = "📊" 
}) => (
  <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-700/50">
    <div className="text-amber-400 text-4xl mb-4">{icon}</div>
    <h3 className="text-gray-300 text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-500 text-sm">{description}</p>
  </div>
);

const SignalPage: React.FC = () => {
  const [allSignals, setAllSignals] = useState<SignalResponse[]>([]);
  const [selectedSignal, setSelectedSignal] = useState<SignalDetailResponse | null>(null);
  const [availableSymbols, setAvailableSymbols] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SignalFilters>({
    symbol: undefined,
    decision: undefined,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const signalsPerPage = 10;

  // Memoized calculations
  const filteredSignals = useMemo(() => {
    let filtered = allSignals;

    if (filters.symbol) {
      filtered = filtered.filter(signal => 
        signal.symbol.toLowerCase().includes(filters.symbol!.toLowerCase())
      );
    }

    if (filters.decision) {
      filtered = filtered.filter(signal => signal.final_decision === filters.decision);
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
    
    const recentSignals = allSignals.filter(signal => 
      new Date(signal.created_at) >= twentyFourHoursAgo
    );

    const longSignals = recentSignals.filter(s => s.final_decision === 'long').length;
    const shortSignals = recentSignals.filter(s => s.final_decision === 'short').length;
    const totalActiveSignals = longSignals + shortSignals;
    
    let avgConsensus = 0;
    if (recentSignals.length > 0) {
      const totalConsensus = recentSignals.reduce((sum, signal) => sum + signal.consensus_strength, 0);
      avgConsensus = totalConsensus / recentSignals.length;
    }

    const symbolCounts = recentSignals
      .filter(s => s.final_decision !== 'hold')
      .reduce((acc, signal) => {
        acc[signal.symbol] = (acc[signal.symbol] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const mostActiveSymbols = Object.entries(symbolCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([symbol, count]) => ({ symbol, signal_count: count }));

    return {
      timeframe: "24h",
      total_signals: totalActiveSignals,
      decisions: {
        long: longSignals,
        short: shortSignals,
        hold: 0
      },
      avg_consensus_strength: avgConsensus,
      most_active_symbols: mostActiveSymbols
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
      const activeSignals = allSignalsData.filter(signal => signal.final_decision !== 'hold');
      
      setAllSignals(activeSignals);
      setAvailableSymbols(Array.from(new Set(activeSignals.map(signal => signal.symbol))).sort());
      
    } catch (err) {
      setError('Failed to load trading signals. Please try again.');
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = useCallback((newFilters: Partial<SignalFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const handleSignalSelect = async (signalId: string) => {
    try {
      const signalDetail = await signalsService.getSignal(signalId);
      setSelectedSignal(signalDetail);
    } catch (err) {
      console.error('Failed to load signal details:', err);
    }
  };

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    if (window.innerWidth < 1024) {
      const signalsSection = document.getElementById('signals-list');
      signalsSection?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Utility functions
  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  const getDecisionColor = useCallback((decision: string) => {
    const colors = {
      long: 'text-emerald-400 bg-emerald-900/20 border border-emerald-600/30',
      short: 'text-rose-400 bg-rose-900/20 border border-rose-600/30',
      default: 'text-gray-400 bg-gray-900/20 border border-gray-600/30'
    };
    return colors[decision as keyof typeof colors] || colors.default;
  }, []);

  const getPriceChangeColor = useCallback((value: number | null) => {
    if (!value) return 'text-gray-300';
    return value >= 0 ? 'text-emerald-400' : 'text-rose-400';
  }, []);

  const getConsensusStrengthColor = useCallback((strength: number) => {
    if (strength >= 80) return 'text-emerald-400';
    if (strength >= 60) return 'text-amber-400';
    return 'text-rose-400';
  }, []);

  const calculatePercentageChange = useCallback((currentPrice: number, entryPrice: number): number => {
    return ((currentPrice - entryPrice) / entryPrice) * 100;
  }, []);

  const calculateProgressWidth = useCallback((numerator: number, denominator: number): number => {
    return denominator === 0 ? 0 : (numerator / denominator) * 100;
  }, []);

  const getPageNumbers = useCallback(() => {
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }, [currentPage, totalPages]);

  // Loading state
  if (loading && allSignals.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-amber-400 text-lg mt-4">Loading trading signals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800/50 border-b border-gray-700/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-8 bg-gradient-to-b from-amber-500 to-amber-600 rounded-full"></div>
              <div>
                <h1 className="text-2xl font-bold text-white">Trading Signals</h1>
                <p className="text-gray-400 text-sm">Real-time actionable trading opportunities</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">Last Updated</div>
              <div className="text-sm text-amber-400">{new Date().toLocaleTimeString()}</div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700/50 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Active Signals</h3>
                  <p className="text-3xl font-bold text-amber-400">{clientStats.total_signals}</p>
                </div>
                <div className="text-amber-400 text-2xl">⚡</div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Last 24 hours</p>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700/50 shadow-lg">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Long Positions</h3>
              <p className="text-3xl font-bold text-emerald-400">{clientStats.decisions.long}</p>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${calculateProgressWidth(clientStats.decisions.long, clientStats.total_signals)}%` }}
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700/50 shadow-lg">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Short Positions</h3>
              <p className="text-3xl font-bold text-rose-400">{clientStats.decisions.short}</p>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                <div 
                  className="bg-gradient-to-r from-rose-500 to-rose-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${calculateProgressWidth(clientStats.decisions.short, clientStats.total_signals)}%` }}
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700/50 shadow-lg">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Avg Consensus</h3>
              <p className={`text-3xl font-bold ${getConsensusStrengthColor(clientStats.avg_consensus_strength)}`}>
                {clientStats.avg_consensus_strength.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 mt-2">Signal Strength</p>
            </div>
          </div>
        </section>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Filters */}
            <section className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700/50 shadow-lg mb-6">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Filter Signals</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Symbol
                    </label>
                    <select
                      value={filters.symbol || ''}
                      onChange={(e) => handleFilterChange({ symbol: e.target.value || undefined })}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                    >
                      <option value="">All Symbols</option>
                      {availableSymbols.map(symbol => (
                        <option key={symbol} value={symbol}>{symbol}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Position Type
                    </label>
                    <select
                      value={filters.decision || ''}
                      onChange={(e) => handleFilterChange({ decision: e.target.value as 'long' | 'short' | undefined })}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                    >
                      <option value="">All Positions</option>
                      <option value="long">Long Only</option>
                      <option value="short">Short Only</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Results
                    </label>
                    <div className="bg-gray-700/30 rounded-lg px-4 py-3 text-sm text-gray-400">
                      Page {currentPage} of {totalPages} • {filteredSignals.length} signals
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Signals List */}
            <section id="signals-list">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-gray-800/30 rounded-xl p-6 animate-pulse">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-2">
                          <div className="h-6 bg-gray-700 rounded w-24"></div>
                          <div className="h-4 bg-gray-700 rounded w-32"></div>
                        </div>
                        <div className="h-4 bg-gray-700 rounded w-20"></div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, j) => (
                          <div key={j} className="space-y-2">
                            <div className="h-4 bg-gray-700 rounded w-16"></div>
                            <div className="h-6 bg-gray-700 rounded w-20"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : paginatedSignals.length > 0 ? (
                <div className="space-y-4">
                  {paginatedSignals.map(signal => {
                    const tpPercentage = signal.entry_price && signal.take_profit_price 
                      ? calculatePercentageChange(signal.take_profit_price, signal.entry_price)
                      : null;
                    
                    const slPercentage = signal.entry_price && signal.stop_loss_price 
                      ? calculatePercentageChange(signal.stop_loss_price, signal.entry_price)
                      : null;

                    return (
                      <div
                        key={signal.id}
                        className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 cursor-pointer transition-all duration-300 border-2 ${
                          selectedSignal?.id === signal.id 
                            ? 'border-amber-500 shadow-lg shadow-amber-500/20' 
                            : 'border-gray-700/50 hover:border-amber-500/30 hover:shadow-lg'
                        }`}
                        onClick={() => handleSignalSelect(signal.id)}
                      >
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 gap-3">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <div className="text-2xl font-bold text-white">
                              {signal.symbol}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${getDecisionColor(signal.final_decision)}`}>
                                {signal.final_decision.toUpperCase()}
                              </span>
                              <div className={`text-sm font-semibold ${getConsensusStrengthColor(signal.consensus_strength)}`}>
                                {signal.consensus_strength}% Consensus
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-400">
                              {formatDate(signal.created_at)}
                            </div>
                            {signal.analysis_duration_ms && (
                              <div className="text-xs text-amber-400">
                                Analyzed in {signal.analysis_duration_ms}ms
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          {signal.entry_price && (
                            <div>
                              <span className="text-gray-400 text-sm">Entry Price</span>
                              <div className="text-lg font-semibold text-white">
                                ${signal.entry_price}
                              </div>
                            </div>
                          )}
                          {signal.take_profit_price && tpPercentage !== null && (
                            <div>
                              <span className="text-gray-400 text-sm">Take Profit</span>
                              <div className="text-lg font-semibold text-emerald-400">
                                ${signal.take_profit_price}
                                <span className="text-sm ml-2">(+{tpPercentage.toFixed(2)}%)</span>
                              </div>
                            </div>
                          )}
                          {signal.stop_loss_price && slPercentage !== null && (
                            <div>
                              <span className="text-gray-400 text-sm">Stop Loss</span>
                              <div className="text-lg font-semibold text-rose-400">
                                ${signal.stop_loss_price}
                                <span className="text-sm ml-2">({slPercentage.toFixed(2)}%)</span>
                              </div>
                            </div>
                          )}
                          {signal.risk_reward_ratio && (
                            <div>
                              <span className="text-gray-400 text-sm">Risk/Reward</span>
                              <div className={`text-lg font-semibold ${getPriceChangeColor(signal.risk_reward_ratio)}`}>
                                {signal.risk_reward_ratio.toFixed(2)}:1
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  title="No signals found"
                  description="Try adjusting your filters to see more results"
                  icon="🔍"
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
                    className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-all flex items-center"
                  >
                    <span>←</span>
                    <span className="ml-2">Previous</span>
                  </button>
                  
                  <div className="flex space-x-1">
                    {getPageNumbers().map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg transition-all ${
                          currentPage === page
                            ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-all flex items-center"
                  >
                    <span className="mr-2">Next</span>
                    <span>→</span>
                  </button>
                </div>
              </section>
            )}
          </div>

          {/* Details Panel */}
          <div className={`lg:col-span-1 ${!selectedSignal ? 'hidden lg:block' : ''}`}>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700/50 shadow-lg lg:sticky lg:top-24">
              {selectedSignal ? (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">
                      {selectedSignal.symbol}
                    </h3>
                    <button
                      onClick={() => setSelectedSignal(null)}
                      className="lg:hidden text-gray-400 hover:text-white transition-colors p-1"
                      aria-label="Close details"
                    >
                      ✕
                    </button>
                    <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${getDecisionColor(selectedSignal.final_decision)}`}>
                      {selectedSignal.final_decision.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Consensus & Timing */}
                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-400">Consensus Strength</span>
                        <span className={`text-lg font-bold ${getConsensusStrengthColor(selectedSignal.consensus_strength)}`}>
                          {selectedSignal.consensus_strength}%
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Signal Generated</span>
                        <span className="text-white">{formatDate(selectedSignal.created_at)}</span>
                      </div>
                      
                      {selectedSignal.analysis_duration_ms && (
                        <div className="flex justify-between text-sm mt-2">
                          <span className="text-gray-400">Analysis Speed</span>
                          <span className="text-amber-400">{selectedSignal.analysis_duration_ms}ms</span>
                        </div>
                      )}
                    </div>

                    {/* Price Levels */}
                    {(selectedSignal.entry_price || selectedSignal.take_profit_price || selectedSignal.stop_loss_price) && (
                      <div>
                        <h4 className="font-semibold text-white mb-4 text-lg border-b border-gray-700 pb-2">
                          Price Levels
                        </h4>
                        <div className="space-y-3">
                          {selectedSignal.entry_price && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Entry Price</span>
                              <span className="text-lg font-bold text-white">
                                ${selectedSignal.entry_price}
                              </span>
                            </div>
                          )}
                          {selectedSignal.take_profit_price && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Take Profit</span>
                              <div className="text-right">
                                <div className="text-lg font-bold text-emerald-400">
                                  ${selectedSignal.take_profit_price}
                                </div>
                              </div>
                            </div>
                          )}
                          {selectedSignal.stop_loss_price && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Stop Loss</span>
                              <div className="text-right">
                                <div className="text-lg font-bold text-rose-400">
                                  ${selectedSignal.stop_loss_price}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Risk Metrics */}
                    {(selectedSignal.estimated_tp_percent || selectedSignal.estimated_sl_percent || selectedSignal.risk_reward_ratio) && (
                      <div>
                        <h4 className="font-semibold text-white mb-4 text-lg border-b border-gray-700 pb-2">
                          Risk Metrics
                        </h4>
                        <div className="space-y-3">
                          {selectedSignal.estimated_tp_percent && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Target Profit</span>
                              <span className="text-lg font-bold text-emerald-400">
                                +{selectedSignal.estimated_tp_percent.toFixed(2)}%
                              </span>
                            </div>
                          )}
                          {selectedSignal.estimated_sl_percent && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Stop Loss</span>
                              <span className="text-lg font-bold text-rose-400">
                                -{selectedSignal.estimated_sl_percent.toFixed(2)}%
                              </span>
                            </div>
                          )}
                          {selectedSignal.risk_reward_ratio && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Risk/Reward Ratio</span>
                              <span className={`text-lg font-bold ${getPriceChangeColor(selectedSignal.risk_reward_ratio)}`}>
                                {selectedSignal.risk_reward_ratio.toFixed(2)}:1
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <EmptyState
                  title="Select a Signal"
                  description="Choose a trading signal from the list to view detailed analysis"
                  icon="📈"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignalPage;