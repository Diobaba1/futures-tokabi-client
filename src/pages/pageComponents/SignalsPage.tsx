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
    limit: 50
  });

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

    // Apply limit
    if (filters.limit) {
      filtered = filtered.slice(0, filters.limit);
    }

    return filtered;
  }, [allSignals, filters]);

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
    const avgConsensus = recentSignals.length > 0 
      ? recentSignals.reduce((sum, signal) => sum + signal.consensus_strength, 0) / recentSignals.length
      : 0;

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
      avg_consensus_strength: Math.round(avgConsensus * 100) / 100,
      most_active_symbols: mostActiveSymbols
    };
  }, [allSignals]);

  useEffect(() => {
    loadInitialData();
  }, []);

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

  if (loading && allSignals.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-amber-400 text-lg">Loading trading signals...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-3 h-8 bg-amber-500 rounded-full"></div>
            <h1 className="text-3xl font-bold text-white">Trading Signals</h1>
          </div>
          <p className="text-gray-400 ml-5">Real-time actionable trading opportunities</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Active Signals</h3>
            <p className="text-3xl font-bold text-amber-400">{clientStats.total_signals}</p>
            <p className="text-xs text-gray-500 mt-1">Last 24 hours</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Long Positions</h3>
            <p className="text-3xl font-bold text-emerald-400">{clientStats.decisions.long}</p>
            <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
              <div 
                className="bg-emerald-500 h-1 rounded-full transition-all duration-500"
                style={{ 
                  width: `${clientStats.total_signals > 0 ? (clientStats.decisions.long / clientStats.total_signals) * 100 : 0}%` 
                }}
              ></div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Short Positions</h3>
            <p className="text-3xl font-bold text-rose-400">{clientStats.decisions.short}</p>
            <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
              <div 
                className="bg-rose-500 h-1 rounded-full transition-all duration-500"
                style={{ 
                  width: `${clientStats.total_signals > 0 ? (clientStats.decisions.short / clientStats.total_signals) * 100 : 0}%` 
                }}
              ></div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Avg Consensus</h3>
            <p className={`text-3xl font-bold ${getConsensusStrengthColor(clientStats.avg_consensus_strength)}`}>
              {clientStats.avg_consensus_strength}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Signal Strength</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Signals List */}
          <div className="lg:col-span-2">
            {/* Filters */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Symbol
                  </label>
                  <select
                    value={filters.symbol || ''}
                    onChange={(e) => handleFilterChange({ 
                      symbol: e.target.value || undefined 
                    })}
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
                    onChange={(e) => handleFilterChange({ 
                      decision: e.target.value as 'long' | 'short' | undefined 
                    })}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  >
                    <option value="">All Positions</option>
                    <option value="long">Long Only</option>
                    <option value="short">Short Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Show Results
                  </label>
                  <select
                    value={filters.limit}
                    onChange={(e) => handleFilterChange({ 
                      limit: parseInt(e.target.value) 
                    })}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  >
                    <option value={10}>10 signals</option>
                    <option value={20}>20 signals</option>
                    <option value={50}>50 signals</option>
                    <option value={100}>100 signals</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-400">
                Showing {filteredSignals.length} of {allSignals.length} active signals
              </div>
            </div>

            {/* Signals Grid */}
            <div className="space-y-4">
              {filteredSignals.map(signal => (
                <div
                  key={signal.id}
                  className={`bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 cursor-pointer transition-all duration-300 hover:bg-gray-800/50 hover:border-amber-500/30 border-2 ${
                    selectedSignal?.id === signal.id 
                      ? 'border-amber-500 bg-gray-800/60 shadow-lg shadow-amber-500/10' 
                      : 'border-transparent hover:shadow-lg'
                  }`}
                  onClick={() => handleSignalSelect(signal.id)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl font-bold text-white">
                        {signal.symbol}
                      </div>
                      <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${getDecisionColor(signal.final_decision)}`}>
                        {signal.final_decision.toUpperCase()}
                      </span>
                      <div className={`text-sm font-semibold ${getConsensusStrengthColor(signal.consensus_strength)}`}>
                        {signal.consensus_strength}% Consensus
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

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {signal.entry_price && (
                      <div>
                        <span className="text-gray-400 text-sm">Entry Price</span>
                        <div className="text-lg font-semibold text-white">
                          ${signal.entry_price.toFixed(2)}
                        </div>
                      </div>
                    )}
                    {signal.take_profit_price && signal.entry_price && (
                      <div>
                        <span className="text-gray-400 text-sm">Take Profit</span>
                        <div className="text-lg font-semibold text-emerald-400">
                          ${signal.take_profit_price.toFixed(2)}
                          <span className="text-sm ml-2">
                            (+{(((signal.take_profit_price - signal.entry_price) / signal.entry_price) * 100).toFixed(2)}%)
                          </span>
                        </div>
                      </div>
                    )}
                    {signal.stop_loss_price && signal.entry_price && (
                      <div>
                        <span className="text-gray-400 text-sm">Stop Loss</span>
                        <div className="text-lg font-semibold text-rose-400">
                          ${signal.stop_loss_price.toFixed(2)}
                          <span className="text-sm ml-2">
                            ({(((signal.stop_loss_price - signal.entry_price) / signal.entry_price) * 100).toFixed(2)}%)
                          </span>
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
              ))}

              {filteredSignals.length === 0 && !loading && (
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-12 text-center border border-gray-700/50">
                  <div className="text-amber-400 text-6xl mb-4">⚡</div>
                  <p className="text-gray-400 text-lg">No active trading signals found</p>
                  <p className="text-gray-500 mt-2">Try adjusting your filters</p>
                </div>
              )}
            </div>
          </div>

          {/* Signal Details Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 sticky top-6">
              {selectedSignal ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">
                      {selectedSignal.symbol}
                    </h3>
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
                                ${selectedSignal.entry_price.toFixed(2)}
                              </span>
                            </div>
                          )}
                          {selectedSignal.take_profit_price && selectedSignal.entry_price && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Take Profit</span>
                              <div className="text-right">
                                <div className="text-lg font-bold text-emerald-400">
                                  ${selectedSignal.take_profit_price.toFixed(2)}
                                </div>
                                <div className="text-sm text-emerald-400">
                                  +{(((selectedSignal.take_profit_price - selectedSignal.entry_price) / selectedSignal.entry_price) * 100).toFixed(2)}%
                                </div>
                              </div>
                            </div>
                          )}
                          {selectedSignal.stop_loss_price && selectedSignal.entry_price && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Stop Loss</span>
                              <div className="text-right">
                                <div className="text-lg font-bold text-rose-400">
                                  ${selectedSignal.stop_loss_price.toFixed(2)}
                                </div>
                                <div className="text-sm text-rose-400">
                                  {(((selectedSignal.stop_loss_price - selectedSignal.entry_price) / selectedSignal.entry_price) * 100).toFixed(2)}%
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

                    {/* Market Data */}
                    <div>
                      <h4 className="font-semibold text-white mb-3 text-lg border-b border-gray-700 pb-2">
                        Market Analysis
                      </h4>
                      <div className="text-gray-400 text-sm">
                        <p>Comprehensive market data and technical indicators analyzed for this signal</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-amber-400 text-6xl mb-4">📊</div>
                  <p className="text-gray-400 text-lg">Select a signal</p>
                  <p className="text-gray-500 mt-2">Choose a trading signal to view detailed analysis</p>
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