// src/pages/pageComponents/SignalsPage.tsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "../../components/contexts/AuthContext";
import { signalService } from "../../api/services/signalsService";
import {
  SignalResponse,
  SignalDetailResponse,
  GetSignalsParams,
  SignalStatsResponse,
  AvailableSymbolsResponse,
} from "../../types/signals.types";
import {
  Filter,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  BarChart3,
  Eye,
  Download,
  Share2,
  Zap,
  Shield,
  Target,
  Clock,
  AlertTriangle,
  CheckCircle2,
  PieChart,
} from "lucide-react";

interface SignalStatsDisplay extends SignalStatsResponse {
  win_rate?: number;
  avg_holding_period?: number;
}

const SignalsPage: React.FC = () => {
  const { user } = useAuth();
  const [signals, setSignals] = useState<SignalResponse[]>([]);
  const [stats, setStats] = useState<SignalStatsDisplay | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSignal, setSelectedSignal] =
    useState<SignalDetailResponse | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Filter states
  const [filters, setFilters] = useState<GetSignalsParams>({
    limit: 20,
    offset: 0,
    symbol: "",
    decision: undefined,
    start_date: "",
    end_date: "",
  });
  const [availableSymbols, setAvailableSymbols] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const loadSignals = useCallback(
    async (showRefreshSpinner = false) => {
      if (!user) return;
      try {
        if (showRefreshSpinner) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }
        setError(null);

        const response = (await signalService.getSignals(filters)) || {
          trades: [],
          pagination: {},
        };
        const signalList: SignalResponse[] = response.trades;
        setSignals(signalList);
        setTotalCount(signalList.length);
      } catch (err: any) {
        setError("Failed to load trading signals");
        console.error("Error loading signals:", err);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [filters, user]
  );

  const loadStats = useCallback(async () => {
    try {
      const statsData: SignalStatsResponse = await signalService.getSignalStats(
        "24h"
      );
      setStats({
        ...statsData,
        win_rate: 72.5, // Mock data - replace with actual calculation
        avg_holding_period: 4.2, // Mock data - replace with actual calculation
      });
    } catch (err: any) {
      console.error("Error loading stats:", err);
    }
  }, []);

  const loadSymbols = useCallback(async () => {
    try {
      const response: AvailableSymbolsResponse =
        (await signalService.getAvailableSymbols()) || { symbols: [] };
      setAvailableSymbols(response.symbols);
    } catch (err: any) {
      console.error("Error loading symbols:", err);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadSymbols();
      loadStats();
      loadSignals();
    }
  }, [user, loadSignals, loadSymbols, loadStats]);

  const handleFilterChange = (
    key: keyof GetSignalsParams,
    value: string | number | undefined
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value, offset: 0 }));
  };

  const handleViewDetail = async (signalId: string) => {
    try {
      const detail: SignalDetailResponse = await signalService.getSignalDetail(
        signalId
      );
      setSelectedSignal(detail);
      setShowDetailModal(true);
    } catch (err: any) {
      setError("Failed to load signal details");
    }
  };

  const closeModal = () => {
    setShowDetailModal(false);
    setSelectedSignal(null);
  };

  const handleRefresh = async () => {
    await Promise.all([loadSignals(true), loadStats(), loadSymbols()]);
  };

  const clearFilters = () => {
    setFilters({
      limit: 20,
      offset: 0,
      symbol: "",
      decision: undefined,
      start_date: "",
      end_date: "",
    });
    setSearchTerm("");
  };

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case "long":
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case "short":
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      case "hold":
        return <Minus className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case "long":
        return "text-green-400 bg-green-500/10 border-green-500/20";
      case "short":
        return "text-red-400 bg-red-500/10 border-red-500/20";
      case "hold":
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
      default:
        return "text-gray-500 bg-gray-500/10";
    }
  };

  const getConsensusStrengthColor = (strength: number) => {
    if (strength >= 80) return "text-green-400";
    if (strength >= 60) return "text-yellow-400";
    if (strength >= 40) return "text-orange-400";
    return "text-red-400";
  };

  const getConsensusStrengthBg = (strength: number) => {
    if (strength >= 80) return "bg-green-500/10";
    if (strength >= 60) return "bg-yellow-500/10";
    if (strength >= 40) return "bg-orange-500/10";
    return "bg-red-500/10";
  };

  const filteredSignals = useMemo(() => {
    if (!searchTerm) return signals;
    return signals.filter(
      (signal) =>
        signal.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        signal.final_decision.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [signals, searchTerm]);

  const hasActiveFilters =
    filters.symbol ||
    filters.decision ||
    filters.start_date ||
    filters.end_date;

  if (isLoading && signals.length === 0) {
    return (
      <div className="min-h-96 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700/50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg font-medium mb-2">
            Loading Trading Signals
          </p>
          <p className="text-gray-500 text-sm">Analyzing market data...</p>
        </div>
      </div>
    );
  }

  if (error && signals.length === 0) {
    return (
      <div className="min-h-96 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700/50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">
            Connection Issue
          </h3>
          <p className="text-gray-300 mb-6 leading-relaxed">{error}</p>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-600 text-gray-900 font-bold rounded-2xl hover:from-yellow-400 hover:to-amber-500 transition-all duration-300 disabled:opacity-50 flex items-center mx-auto shadow-lg shadow-yellow-500/25"
          >
            {isLoading && <RefreshCw className="w-5 h-5 animate-spin mr-3" />}
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Trading Signals
              </h1>
              <p className="text-gray-400 text-lg mt-1">
                AI-powered market analysis and trading recommendations
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-4">
            {stats && (
              <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-800/50 px-3 py-1.5 rounded-full">
                <Clock className="w-4 h-4" />
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Export Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-400 hover:text-white hover:border-gray-600 transition-all duration-300">
            <Download className="w-4 h-4" />
            Export
          </button>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl border border-gray-600 text-white hover:from-gray-700 hover:to-gray-600 transition-all duration-300 disabled:opacity-50 shadow-lg"
          >
            <RefreshCw
              className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 border border-gray-700/50 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500/10 rounded-xl">
                <Target className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-white">
                {stats.total_signals}
              </span>
            </div>
            <p className="text-gray-400 text-sm font-medium">Total Signals</p>
            <p className="text-xs text-gray-500 mt-1">{stats.timeframe}</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 border border-gray-700/50 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-500/10 rounded-xl">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-2xl font-bold text-green-400">
                {stats.decisions.long}
              </span>
            </div>
            <p className="text-gray-400 text-sm font-medium">Long Signals</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 border border-gray-700/50 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-red-500/10 rounded-xl">
                <TrendingDown className="w-5 h-5 text-red-400" />
              </div>
              <span className="text-2xl font-bold text-red-400">
                {stats.decisions.short}
              </span>
            </div>
            <p className="text-gray-400 text-sm font-medium">Short Signals</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 border border-gray-700/50 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-500/10 rounded-xl">
                <PieChart className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-2xl font-bold text-purple-400">
                {stats.win_rate}%
              </span>
            </div>
            <p className="text-gray-400 text-sm font-medium">Win Rate</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 border border-gray-700/50 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-amber-500/10 rounded-xl">
                <Zap className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-2xl font-bold text-amber-400">
                {stats.avg_holding_period}h
              </span>
            </div>
            <p className="text-gray-400 text-sm font-medium">Avg Duration</p>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-700/50 shadow-xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
          <h3 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl">
              <Filter className="w-6 h-6 text-white" />
            </div>
            Signal Filters
          </h3>

          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search signals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none w-64"
              />
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-3 py-2 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 hover:bg-red-500/20 transition-all duration-300"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3">
              Symbol
            </label>
            <select
              value={filters.symbol || ""}
              onChange={(e) => handleFilterChange("symbol", e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:border-yellow-500 focus:outline-none transition-colors duration-300"
            >
              <option value="">All Symbols</option>
              {availableSymbols.map((symbol) => (
                <option key={symbol} value={symbol}>
                  {symbol}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3">
              Decision
            </label>
            <select
              value={filters.decision || ""}
              onChange={(e) =>
                handleFilterChange(
                  "decision",
                  e.target.value === ""
                    ? undefined
                    : (e.target.value as "long" | "short" | "hold")
                )
              }
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:border-yellow-500 focus:outline-none transition-colors duration-300"
            >
              <option value="">All Decisions</option>
              <option value="long">Long</option>
              <option value="short">Short</option>
              <option value="hold">Hold</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3">
              Start Date
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="date"
                value={filters.start_date || ""}
                onChange={(e) =>
                  handleFilterChange("start_date", e.target.value)
                }
                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:border-yellow-500 focus:outline-none transition-colors duration-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3">
              End Date
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="date"
                value={filters.end_date || ""}
                onChange={(e) => handleFilterChange("end_date", e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:border-yellow-500 focus:outline-none transition-colors duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Signals List */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl border border-gray-700/50 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="px-8 py-6 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Symbol
                </th>
                <th className="px-8 py-6 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Decision
                </th>
                <th className="px-8 py-6 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Consensus
                </th>
                <th className="px-8 py-6 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-8 py-6 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {filteredSignals.map((signal) => (
                <tr
                  key={signal.id}
                  className="hover:bg-gray-700/20 transition-all duration-300 group cursor-pointer"
                  onClick={() => handleViewDetail(signal.id)}
                >
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-700/50 rounded-xl group-hover:bg-gray-600/50 transition-colors">
                        <Target className="w-4 h-4 text-yellow-400" />
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors">
                          {signal.symbol}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold ${getDecisionColor(
                        signal.final_decision
                      )}`}
                    >
                      {getDecisionIcon(signal.final_decision)}
                      {signal.final_decision.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getConsensusStrengthBg(
                        signal.consensus_strength
                      )} ${getConsensusStrengthColor(
                        signal.consensus_strength
                      )}`}
                    >
                      {signal.consensus_strength.toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {new Date(signal.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(signal.created_at).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetail(signal.id);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-xl border border-gray-600 hover:bg-yellow-500/10 hover:text-yellow-400 hover:border-yellow-500/30 transition-all duration-300"
                    >
                      <Eye className="w-4 h-4" />
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredSignals.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              No signals found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your filters or search terms
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-yellow-500/10 text-yellow-400 rounded-xl border border-yellow-500/20 hover:bg-yellow-500/20 transition-all duration-300"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedSignal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl border border-gray-700/50 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gray-800/80 backdrop-blur-sm p-8 border-b border-gray-700/50 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Signal Analysis
                  </h3>
                  <p className="text-gray-400">
                    Detailed market analysis and recommendations
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">
              {/* Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-gray-700/30 rounded-2xl p-6 border border-gray-600/30">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-400 font-medium">Symbol</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {selectedSignal.symbol}
                  </p>
                </div>

                <div className="bg-gray-700/30 rounded-2xl p-6 border border-gray-600/30">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <span className="text-gray-400 font-medium">Decision</span>
                  </div>
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-lg font-bold ${getDecisionColor(
                      selectedSignal.final_decision
                    )}`}
                  >
                    {getDecisionIcon(selectedSignal.final_decision)}
                    {selectedSignal.final_decision.toUpperCase()}
                  </div>
                </div>

                <div className="bg-gray-700/30 rounded-2xl p-6 border border-gray-600/30">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-400 font-medium">Consensus</span>
                  </div>
                  <div
                    className={`text-2xl font-bold ${getConsensusStrengthColor(
                      selectedSignal.consensus_strength
                    )}`}
                  >
                    {selectedSignal.consensus_strength.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Analysis Summary */}
              {selectedSignal.analysis_summary && (
                <div className="bg-gray-700/30 rounded-2xl p-6 border border-gray-600/30">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-yellow-400" />
                    Analysis Summary
                  </h4>
                  <p className="text-gray-300 leading-relaxed">
                    {selectedSignal.analysis_summary}
                  </p>
                </div>
              )}

              {/* Trading Parameters */}
              {(selectedSignal.entry_price ||
                selectedSignal.take_profit_price ||
                selectedSignal.stop_loss_price) && (
                <div className="bg-gray-700/30 rounded-2xl p-6 border border-gray-600/30">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-green-400" />
                    Trading Parameters
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedSignal.entry_price && (
                      <div>
                        <span className="text-gray-400 text-sm">
                          Entry Price
                        </span>
                        <p className="text-white font-semibold">
                          ${selectedSignal.entry_price.toFixed(2)}
                        </p>
                      </div>
                    )}
                    {selectedSignal.take_profit_price && (
                      <div>
                        <span className="text-gray-400 text-sm">
                          Take Profit
                        </span>
                        <p className="text-green-400 font-semibold">
                          ${selectedSignal.take_profit_price.toFixed(2)}
                        </p>
                      </div>
                    )}
                    {selectedSignal.stop_loss_price && (
                      <div>
                        <span className="text-gray-400 text-sm">Stop Loss</span>
                        <p className="text-red-400 font-semibold">
                          ${selectedSignal.stop_loss_price.toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Technical Indicators */}
              {selectedSignal.technical_indicators && (
                <div className="bg-gray-700/30 rounded-2xl p-6 border border-gray-600/30">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-purple-400" />
                    Technical Indicators
                  </h4>
                  <pre className="text-sm text-gray-300 bg-gray-800/50 p-4 rounded-xl overflow-auto max-h-60">
                    {JSON.stringify(
                      selectedSignal.technical_indicators,
                      null,
                      2
                    )}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignalsPage;
