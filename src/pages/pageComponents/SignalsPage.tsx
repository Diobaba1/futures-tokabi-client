import React, { useState, useEffect, useMemo } from 'react';
import {
  SignalResponse,
  SignalDetailResponse,
  SignalStats,
  SignalFilters
} from '../../types/signals.types';
import { signalsService } from '../../api/services/signalsService';

const SignalPage: React.FC = () => {
  const [allSignals, setAllSignals] = useState<SignalResponse[]>([]);
  const [selectedSignal, setSelectedSignal] = useState<SignalDetailResponse | null>(null);
  const [availableSymbols, setAvailableSymbols] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SignalFilters>({
    symbol: undefined,
    decision: undefined,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const signalsPerPage = 5;

  // Client-side filtered signals
  const filteredSignals = useMemo(() => {
    let filtered = allSignals;

    // Filter by symbol
    if (filters.symbol) {
      filtered = filtered.filter(signal => 
        signal.symbol.toLowerCase().includes(filters.symbol!.toLowerCase())
      );
    }

    // Filter by decision (excluding 'hold')
    if (filters.decision) {
      filtered = filtered.filter(signal => signal.final_decision === filters.decision);
    }

    return filtered;
  }, [allSignals, filters]);

  // Paginated signals
  const paginatedSignals = useMemo(() => {
    const startIndex = (currentPage - 1) * signalsPerPage;
    return filteredSignals.slice(startIndex, startIndex + signalsPerPage);
  }, [filteredSignals, currentPage]);

  // Total pages calculation
  const totalPages = Math.ceil(filteredSignals.length / signalsPerPage);

  // Client-side stats calculation
  const clientStats = useMemo(() => {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const recentSignals = allSignals.filter(signal => 
      new Date(signal.created_at) >= twentyFourHoursAgo
    );

    const longSignals = recentSignals.filter(s => s.final_decision === 'long').length;
    const shortSignals = recentSignals.filter(s => s.final_decision === 'short').length;
    
    const totalActiveSignals = longSignals + shortSignals;
    
    // Calculate exact average consensus
    let avgConsensus = 0;
    if (recentSignals.length > 0) {
      const totalConsensus = recentSignals.reduce((sum, signal) => sum + signal.consensus_strength, 0);
      avgConsensus = totalConsensus / recentSignals.length;
    }

    // Most active symbols (excluding hold signals)
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

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [filters]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // Load all signals without backend filtering
      const signalsResponse = await signalsService.getSignals({ limit: 100 });
      const allSignalsData = signalsResponse.signals;
      
      // Filter out hold signals on client side
      const activeSignals = allSignalsData.filter(signal => signal.final_decision !== 'hold');
      
      setAllSignals(activeSignals);
      
      // Get available symbols from filtered signals
      const symbols = Array.from(new Set(activeSignals.map(signal => signal.symbol))).sort();
      setAvailableSymbols(symbols);
      
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<SignalFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSignalSelect = async (signalId: string) => {
    try {
      const signalDetail = await signalsService.getSignal(signalId);
      setSelectedSignal(signalDetail);
    } catch (error) {
      console.error('Failed to load signal details:', error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of signals list on mobile
    if (window.innerWidth < 1024) {
      const signalsSection = document.getElementById('signals-list');
      if (signalsSection) {
        signalsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'long': 
        return 'text-emerald-400 bg-emerald-900/50 border border-emerald-600/50';
      case 'short': 
        return 'text-rose-400 bg-rose-900/50 border border-rose-600/50';
      default: 
        return 'text-gray-400 bg-gray-900/50 border border-gray-600/50';
    }
  };

  const getPriceChangeColor = (value: number | null) => {
    if (!value) return 'text-gray-300';
    return value >= 0 ? 'text-emerald-400' : 'text-rose-400';
  };

  const getConsensusStrengthColor = (strength: number) => {
    if (strength >= 80) return 'text-emerald-400';
    if (strength >= 60) return 'text-amber-400';
    return 'text-rose-400';
  };

  // Calculate exact percentage change
  const calculatePercentageChange = (currentPrice: number, entryPrice: number): number => {
    return ((currentPrice - entryPrice) / entryPrice) * 100;
  };

  // Calculate exact progress bar width
  const calculateProgressWidth = (numerator: number, denominator: number): number => {
    if (denominator === 0) return 0;
    return (numerator / denominator) * 100;
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (loading && allSignals.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-amber-400 text-lg">Loading trading signals...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-3 h-6 lg:h-8 bg-amber-500 rounded-full"></div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Trading Signals</h1>
          </div>
          <p className="text-gray-400 ml-5 text-sm lg:text-base">Real-time actionable trading opportunities</p>
        </div>

        {/* Stats Overview - Responsive Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm p-4 lg:p-6 rounded-xl border border-gray-700/50">
            <h3 className="text-xs lg:text-sm font-medium text-gray-400 mb-1 lg:mb-2">Active Signals</h3>
            <p className="text-xl lg:text-3xl font-bold text-amber-400">{clientStats.total_signals}</p>
            <p className="text-xs text-gray-500 mt-1">Last 24 hours</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm p-4 lg:p-6 rounded-xl border border-gray-700/50">
            <h3 className="text-xs lg:text-sm font-medium text-gray-400 mb-1 lg:mb-2">Long Positions</h3>
            <p className="text-xl lg:text-3xl font-bold text-emerald-400">{clientStats.decisions.long}</p>
            <div className="w-full bg-gray-700 rounded-full h-1 mt-1 lg:mt-2">
              <div 
                className="bg-emerald-500 h-1 rounded-full transition-all duration-500"
                style={{ 
                  width: `${calculateProgressWidth(clientStats.decisions.long, clientStats.total_signals)}%` 
                }}
              ></div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm p-4 lg:p-6 rounded-xl border border-gray-700/50">
            <h3 className="text-xs lg:text-sm font-medium text-gray-400 mb-1 lg:mb-2">Short Positions</h3>
            <p className="text-xl lg:text-3xl font-bold text-rose-400">{clientStats.decisions.short}</p>
            <div className="w-full bg-gray-700 rounded-full h-1 mt-1 lg:mt-2">
              <div 
                className="bg-rose-500 h-1 rounded-full transition-all duration-500"
                style={{ 
                  width: `${calculateProgressWidth(clientStats.decisions.short, clientStats.total_signals)}%` 
                }}
              ></div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm p-4 lg:p-6 rounded-xl border border-gray-700/50">
            <h3 className="text-xs lg:text-sm font-medium text-gray-400 mb-1 lg:mb-2">Avg Consensus</h3>
            <p className={`text-xl lg:text-3xl font-bold ${getConsensusStrengthColor(clientStats.avg_consensus_strength)}`}>
              {clientStats.avg_consensus_strength.toFixed(2)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Signal Strength</p>
          </div>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* Filters */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-4 lg:p-6 rounded-xl border border-gray-700/50 mb-4 lg:mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 lg:mb-2">
                    Symbol
                  </label>
                  <select
                    value={filters.symbol || ''}
                    onChange={(e) => handleFilterChange({ 
                      symbol: e.target.value || undefined 
                    })}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 lg:px-4 py-2 lg:py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-sm lg:text-base"
                  >
                    <option value="">All Symbols</option>
                    {availableSymbols.map(symbol => (
                      <option key={symbol} value={symbol}>{symbol}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 lg:mb-2">
                    Position Type
                  </label>
                  <select
                    value={filters.decision || ''}
                    onChange={(e) => handleFilterChange({ 
                      decision: e.target.value as 'long' | 'short' | undefined 
                    })}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 lg:px-4 py-2 lg:py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-sm lg:text-base"
                  >
                    <option value="">All Positions</option>
                    <option value="long">Long Only</option>
                    <option value="short">Short Only</option>
                  </select>
                </div>
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-300 mb-1 lg:mb-2">
                    Results Info
                  </label>
                  <div className="bg-gray-700/30 rounded-lg px-3 lg:px-4 py-2 lg:py-3 text-sm text-gray-400">
                    Page {currentPage} of {totalPages} • {filteredSignals.length} total signals
                  </div>
                </div>
              </div>
            </div>

            {/* Signals Grid */}
            <div id="signals-list" className="space-y-3 lg:space-y-4 mb-6">
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
                    className={`bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 lg:p-6 cursor-pointer transition-all duration-300 hover:bg-gray-800/50 hover:border-amber-500/30 border-2 ${
                      selectedSignal?.id === signal.id 
                        ? 'border-amber-500 bg-gray-800/60 shadow-lg shadow-amber-500/10' 
                        : 'border-transparent hover:shadow-lg'
                    }`}
                    onClick={() => handleSignalSelect(signal.id)}
                  >
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-3 lg:mb-4 gap-2 lg:gap-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:gap-4">
                        <div className="text-xl lg:text-2xl font-bold text-white">
                          {signal.symbol}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-semibold ${getDecisionColor(signal.final_decision)}`}>
                            {signal.final_decision.toUpperCase()}
                          </span>
                          <div className={`text-xs lg:text-sm font-semibold ${getConsensusStrengthColor(signal.consensus_strength)}`}>
                            {signal.consensus_strength.toFixed(2)}% Consensus
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs lg:text-sm text-gray-400">
                          {formatDate(signal.created_at)}
                        </div>
                        {signal.analysis_duration_ms && (
                          <div className="text-xs text-amber-400">
                            Analyzed in {signal.analysis_duration_ms}ms
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 text-sm">
                      {signal.entry_price && (
                        <div>
                          <span className="text-gray-400 text-xs lg:text-sm">Entry Price</span>
                          <div className="text-base lg:text-lg font-semibold text-white">
                            ${signal.entry_price}
                          </div>
                        </div>
                      )}
                      {signal.take_profit_price && tpPercentage !== null && (
                        <div>
                          <span className="text-gray-400 text-xs lg:text-sm">Take Profit</span>
                          <div className="text-base lg:text-lg font-semibold text-emerald-400">
                            ${signal.take_profit_price}
                            <span className="text-xs lg:text-sm ml-1 lg:ml-2">
                              (+{tpPercentage.toFixed(2)}%)
                            </span>
                          </div>
                        </div>
                      )}
                      {signal.stop_loss_price && slPercentage !== null && (
                        <div>
                          <span className="text-gray-400 text-xs lg:text-sm">Stop Loss</span>
                          <div className="text-base lg:text-lg font-semibold text-rose-400">
                            ${signal.stop_loss_price}
                            <span className="text-xs lg:text-sm ml-1 lg:ml-2">
                              ({slPercentage.toFixed(2)}%)
                            </span>
                          </div>
                        </div>
                      )}
                      {signal.risk_reward_ratio && (
                        <div>
                          <span className="text-gray-400 text-xs lg:text-sm">Risk/Reward</span>
                          <div className={`text-base lg:text-lg font-semibold ${getPriceChangeColor(signal.risk_reward_ratio)}`}>
                            {signal.risk_reward_ratio.toFixed(2)}:1
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {paginatedSignals.length === 0 && !loading && (
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 lg:p-12 text-center border border-gray-700/50">
                  <div className="text-amber-400 text-4xl lg:text-6xl mb-3 lg:mb-4">⚡</div>
                  <p className="text-gray-400 text-base lg:text-lg">No active trading signals found</p>
                  <p className="text-gray-500 mt-1 lg:mt-2 text-sm lg:text-base">Try adjusting your filters</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 lg:space-x-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 lg:px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/50 transition-all text-sm lg:text-base"
                >
                  Previous
                </button>
                
                <div className="flex space-x-1 lg:space-x-2">
                  {getPageNumbers().map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 lg:px-4 py-2 rounded-lg transition-all text-sm lg:text-base ${
                        currentPage === page
                          ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25'
                          : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 lg:px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/50 transition-all text-sm lg:text-base"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Signal Details Panel - Hidden on mobile when no signal selected */}
          <div className={`lg:col-span-1 ${!selectedSignal ? 'hidden lg:block' : ''}`}>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-gray-700/50 lg:sticky lg:top-6">
              {selectedSignal ? (() => {
                const tpPercentage = selectedSignal.entry_price && selectedSignal.take_profit_price 
                  ? calculatePercentageChange(selectedSignal.take_profit_price, selectedSignal.entry_price)
                  : null;
                
                const slPercentage = selectedSignal.entry_price && selectedSignal.stop_loss_price 
                  ? calculatePercentageChange(selectedSignal.stop_loss_price, selectedSignal.entry_price)
                  : null;

                return (
                  <>
                    <div className="flex items-center justify-between mb-4 lg:mb-6">
                      <h3 className="text-lg lg:text-xl font-bold text-white">
                        {selectedSignal.symbol}
                      </h3>
                      <button
                        onClick={() => setSelectedSignal(null)}
                        className="lg:hidden text-gray-400 hover:text-white transition-colors"
                      >
                        ✕
                      </button>
                      <span className={`px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-semibold ${getDecisionColor(selectedSignal.final_decision)}`}>
                        {selectedSignal.final_decision.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="space-y-4 lg:space-y-6">
                      {/* Consensus & Timing */}
                      <div className="bg-gray-700/30 rounded-lg p-3 lg:p-4">
                        <div className="flex justify-between items-center mb-2 lg:mb-3">
                          <span className="text-gray-400 text-sm lg:text-base">Consensus Strength</span>
                          <span className={`text-base lg:text-lg font-bold ${getConsensusStrengthColor(selectedSignal.consensus_strength)}`}>
                            {selectedSignal.consensus_strength.toFixed(2)}%
                          </span>
                        </div>
                        
                        <div className="flex justify-between text-xs lg:text-sm">
                          <span className="text-gray-400">Signal Generated</span>
                          <span className="text-white">{formatDate(selectedSignal.created_at)}</span>
                        </div>
                        
                        {selectedSignal.analysis_duration_ms && (
                          <div className="flex justify-between text-xs lg:text-sm mt-1 lg:mt-2">
                            <span className="text-gray-400">Analysis Speed</span>
                            <span className="text-amber-400">{selectedSignal.analysis_duration_ms}ms</span>
                          </div>
                        )}
                      </div>

                      {/* Price Levels */}
                      {(selectedSignal.entry_price || selectedSignal.take_profit_price || selectedSignal.stop_loss_price) && (
                        <div>
                          <h4 className="font-semibold text-white mb-3 lg:mb-4 text-base lg:text-lg border-b border-gray-700 pb-2">
                            Price Levels
                          </h4>
                          <div className="space-y-2 lg:space-y-3">
                            {selectedSignal.entry_price && (
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm lg:text-base">Entry Price</span>
                                <span className="text-base lg:text-lg font-bold text-white">
                                  ${selectedSignal.entry_price}
                                </span>
                              </div>
                            )}
                            {selectedSignal.take_profit_price && tpPercentage !== null && (
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm lg:text-base">Take Profit</span>
                                <div className="text-right">
                                  <div className="text-base lg:text-lg font-bold text-emerald-400">
                                    ${selectedSignal.take_profit_price}
                                  </div>
                                  <div className="text-xs lg:text-sm text-emerald-400">
                                    +{tpPercentage.toFixed(2)}%
                                  </div>
                                </div>
                              </div>
                            )}
                            {selectedSignal.stop_loss_price && slPercentage !== null && (
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm lg:text-base">Stop Loss</span>
                                <div className="text-right">
                                  <div className="text-base lg:text-lg font-bold text-rose-400">
                                    ${selectedSignal.stop_loss_price}
                                  </div>
                                  <div className="text-xs lg:text-sm text-rose-400">
                                    {slPercentage.toFixed(2)}%
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
                          <h4 className="font-semibold text-white mb-3 lg:mb-4 text-base lg:text-lg border-b border-gray-700 pb-2">
                            Risk Metrics
                          </h4>
                          <div className="space-y-2 lg:space-y-3">
                            {selectedSignal.estimated_tp_percent && (
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm lg:text-base">Target Profit</span>
                                <span className="text-base lg:text-lg font-bold text-emerald-400">
                                  +{selectedSignal.estimated_tp_percent.toFixed(2)}%
                                </span>
                              </div>
                            )}
                            {selectedSignal.estimated_sl_percent && (
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm lg:text-base">Stop Loss</span>
                                <span className="text-base lg:text-lg font-bold text-rose-400">
                                  -{selectedSignal.estimated_sl_percent.toFixed(2)}%
                                </span>
                              </div>
                            )}
                            {selectedSignal.risk_reward_ratio && (
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm lg:text-base">Risk/Reward Ratio</span>
                                <span className={`text-base lg:text-lg font-bold ${getPriceChangeColor(selectedSignal.risk_reward_ratio)}`}>
                                  {selectedSignal.risk_reward_ratio.toFixed(2)}:1
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Market Data */}
                      <div>
                        <h4 className="font-semibold text-white mb-2 lg:mb-3 text-base lg:text-lg border-b border-gray-700 pb-2">
                          Market Analysis
                        </h4>
                        <div className="text-gray-400 text-xs lg:text-sm">
                          <p>Comprehensive market data and technical indicators analyzed for this signal</p>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })() : (
                <div className="text-center py-8 lg:py-12">
                  <div className="text-amber-400 text-4xl lg:text-6xl mb-3 lg:mb-4">📊</div>
                  <p className="text-gray-400 text-base lg:text-lg">Select a signal</p>
                  <p className="text-gray-500 mt-1 lg:mt-2 text-sm lg:text-base">Choose a trading signal to view detailed analysis</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignalPage;