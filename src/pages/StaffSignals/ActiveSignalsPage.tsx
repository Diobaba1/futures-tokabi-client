// ============================================================================
// FILE: src/pages/StaffSignals/ActiveSignalsPage.tsx
// ============================================================================
// This page is for regular users to view active signals created by staff

import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  Search,
  TrendingUp,
  TrendingDown,
  Target,
  Shield,
  Clock,
  AlertCircle,
  Zap,
  Filter,
} from "lucide-react";
import { useStaffSignals } from "../../components/hooks/useStaffSignals";
import {
  StaffSignalResponse,
  TakeProfit,
} from "../../types/staffSignals.types";

const ActiveSignalsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState<string>("");

  const { activeSignals, isLoading, error, fetchActiveSignals } =
    useStaffSignals();

  useEffect(() => {
    fetchActiveSignals();
  }, []);

  const handleRefresh = () => {
    fetchActiveSignals(searchQuery || undefined);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchActiveSignals(searchQuery || undefined);
  };

  const filteredSignals = activeSignals.filter((signal) => {
    if (positionFilter && signal.position_type !== positionFilter) {
      return false;
    }
    return true;
  });

  const formatPrice = (price: number) => {
    if (price >= 1000) return price.toLocaleString();
    if (price >= 1) return price.toFixed(2);
    return price.toFixed(6);
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return "Just now";
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-medium mb-4">
            <Zap size={16} />
            Live Trading Signals
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            Active Signals
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Professional trading signals from our expert analysts. Always do your
            own research before trading.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by symbol (e.g., BTCUSDT)"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </form>

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setPositionFilter("")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    positionFilter === ""
                      ? "bg-gray-700 text-white"
                      : "text-gray-500 hover:text-white"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setPositionFilter("buy")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${
                    positionFilter === "buy"
                      ? "bg-green-500/20 text-green-400"
                      : "text-gray-500 hover:text-white"
                  }`}
                >
                  <TrendingUp size={14} /> Buy
                </button>
                <button
                  onClick={() => setPositionFilter("sell")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${
                    positionFilter === "sell"
                      ? "bg-red-500/20 text-red-400"
                      : "text-gray-500 hover:text-white"
                  }`}
                >
                  <TrendingDown size={14} /> Sell
                </button>
              </div>

              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-cyan-500/50 transition-all"
              >
                <RefreshCw
                  size={18}
                  className={isLoading ? "animate-spin" : ""}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Signals */}
        {isLoading && filteredSignals.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 animate-pulse"
              >
                <div className="h-6 w-32 bg-gray-800 rounded mb-4" />
                <div className="space-y-3">
                  <div className="h-16 bg-gray-800 rounded-xl" />
                  <div className="h-16 bg-gray-800 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredSignals.length === 0 ? (
          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-16 text-center">
            <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap size={40} className="text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              No Active Signals
            </h3>
            <p className="text-gray-600">
              Check back later for new trading signals from our analysts.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSignals.map((signal) => (
              <SignalDisplayCard key={signal.id} signal={signal} />
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 p-6 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
          <div className="flex items-start gap-4">
            <AlertCircle className="text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-yellow-500 mb-1">
                Risk Disclaimer
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Trading cryptocurrencies involves significant risk and can result
                in the loss of your capital. The signals provided are for
                informational purposes only and should not be considered as
                financial advice. Always conduct your own research and consider
                your risk tolerance before making any trading decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Signal Display Card Component
const SignalDisplayCard: React.FC<{ signal: StaffSignalResponse }> = ({
  signal,
}) => {
  const isBuy = signal.position_type.toLowerCase() === "buy";

  const formatPrice = (price: number) => {
    if (price >= 1000) return price.toLocaleString();
    if (price >= 1) return price.toFixed(2);
    return price.toFixed(6);
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return "Just now";
  };

  const hitTps = signal.take_profits.filter((tp) => tp.hit).length;
  const totalTps = signal.take_profits.length;

  return (
    <div
      className={`bg-gray-900/80 backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 hover:shadow-lg ${
        isBuy
          ? "border-green-500/20 hover:border-green-500/40 hover:shadow-green-500/5"
          : "border-red-500/20 hover:border-red-500/40 hover:shadow-red-500/5"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl ${
              isBuy ? "bg-green-500/20" : "bg-red-500/20"
            }`}
          >
            {isBuy ? (
              <TrendingUp size={22} className="text-green-400" />
            ) : (
              <TrendingDown size={22} className="text-red-400" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{signal.symbol}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded ${
                  isBuy
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {signal.position_type.toUpperCase()}
              </span>
              <span className="text-xs text-gray-500">
                {signal.order_type.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Clock size={12} />
            {formatTimeAgo(signal.created_at)}
          </span>
          {signal.leverage > 1 && (
            <span className="text-xs font-bold text-yellow-400 mt-1 block">
              {signal.leverage}x Leverage
            </span>
          )}
        </div>
      </div>

      {/* Price Info */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-gray-800/50 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Entry Price</p>
          <p className="text-lg font-bold text-white">
            ${formatPrice(signal.entry_price)}
          </p>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4">
          <p className="text-xs text-cyan-400 mb-1">Current Price</p>
          <p className="text-lg font-bold text-cyan-400">
            ${formatPrice(signal.current_price)}
          </p>
        </div>
      </div>

      {/* Stop Loss */}
      <div
        className={`flex items-center justify-between p-4 rounded-xl mb-4 ${
          signal.sl_hit
            ? "bg-red-500/20 border border-red-500/30"
            : "bg-red-500/10 border border-red-500/20"
        }`}
      >
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-red-400" />
          <span className="text-sm text-gray-400">Stop Loss</span>
        </div>
        <span className="text-base font-bold text-red-400">
          ${formatPrice(signal.stop_loss)}
        </span>
      </div>

      {/* Take Profits */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-cyan-400" />
            <span className="text-sm text-gray-400">Take Profits</span>
          </div>
          <span className="text-xs text-cyan-400 font-medium">
            {hitTps}/{totalTps} Hit
          </span>
        </div>

        <div className="space-y-2">
          {signal.take_profits.map((tp: TakeProfit) => (
            <div
              key={tp.level}
              className={`flex items-center justify-between p-3 rounded-lg ${
                tp.hit
                  ? "bg-green-500/10 border border-green-500/30"
                  : "bg-gray-800/50 border border-gray-700/50"
              }`}
            >
              <span
                className={`text-sm font-medium ${
                  tp.hit ? "text-green-400" : "text-gray-500"
                }`}
              >
                TP{tp.level}
              </span>
              <span
                className={`text-sm font-bold ${
                  tp.hit ? "text-green-400" : "text-white"
                }`}
              >
                ${formatPrice(tp.price)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Risk/Reward */}
      {signal.risk_reward_ratio && (
        <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
          <span className="text-xs text-gray-500">Risk : Reward</span>
          <span className="text-sm font-bold text-cyan-400">
            1 : {signal.risk_reward_ratio}
          </span>
        </div>
      )}

      {/* Notes */}
      {signal.notes && (
        <div className="mt-4 pt-4 border-t border-gray-800">
          <p className="text-xs text-gray-500 leading-relaxed">{signal.notes}</p>
        </div>
      )}
    </div>
  );
};

export default ActiveSignalsPage;