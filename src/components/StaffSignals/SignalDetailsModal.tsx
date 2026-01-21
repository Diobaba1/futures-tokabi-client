// ============================================================================
// FILE: src/components/StaffSignals/SignalDetailsModal.tsx
// ============================================================================

import React from "react";
import {
  X,
  TrendingUp,
  TrendingDown,
  Target,
  Shield,
  Clock,
  User,
  History,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  StaffSignalDetailResponse,
  TakeProfit,
  UpdateHistoryEntry,
} from "../../types/staffSignals.types";

interface SignalDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  signal: StaffSignalDetailResponse | null;
  isLoading?: boolean;
}

const SignalDetailsModal: React.FC<SignalDetailsModalProps> = ({
  isOpen,
  onClose,
  signal,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    if (price >= 1000) return price.toLocaleString();
    if (price >= 1) return price.toFixed(2);
    return price.toFixed(6);
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
      case "executed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "inactive":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "expired":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  if (isLoading || !signal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <div className="flex items-center gap-3 text-gray-400">
            <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            Loading signal details...
          </div>
        </div>
      </div>
    );
  }

  const isBuy = signal.position_type.toLowerCase() === "buy";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl m-4">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div
              className={`p-2 rounded-lg ${
                isBuy
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {isBuy ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{signal.symbol}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    isBuy
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {signal.position_type.toUpperCase()}
                </span>
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-700 text-gray-300">
                  {signal.order_type.toUpperCase()}
                </span>
                <span
                  className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${getStatusColor(
                    signal.status
                  )}`}
                >
                  {signal.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Price Overview */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
              <p className="text-xs text-gray-500 mb-1">Current Price</p>
              <p className="text-lg font-bold text-cyan-400">
                ${formatPrice(signal.current_price)}
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
              <p className="text-xs text-gray-500 mb-1">Entry Price</p>
              <p className="text-lg font-bold text-white">
                ${formatPrice(signal.entry_price)}
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
              <p className="text-xs text-gray-500 mb-1">Leverage</p>
              <p className="text-lg font-bold text-yellow-400">
                {signal.leverage}x
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
              <p className="text-xs text-gray-500 mb-1">Risk:Reward</p>
              <p className="text-lg font-bold text-cyan-400">
                {signal.risk_reward_ratio || "N/A"}
              </p>
            </div>
          </div>

          {/* Stop Loss */}
          <div
            className={`p-4 rounded-xl border ${
              signal.sl_hit
                ? "bg-red-500/10 border-red-500/30"
                : "bg-gray-800/50 border-gray-700/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield
                  size={20}
                  className={signal.sl_hit ? "text-red-500" : "text-red-400"}
                />
                <div>
                  <p className="text-sm text-gray-400">Stop Loss</p>
                  <p
                    className={`text-lg font-bold ${
                      signal.sl_hit ? "text-red-500" : "text-red-400"
                    }`}
                  >
                    ${formatPrice(signal.stop_loss)}
                  </p>
                </div>
              </div>
              {signal.sl_hit ? (
                <div className="flex items-center gap-2 text-red-500">
                  <XCircle size={20} />
                  <span className="text-sm font-medium">HIT</span>
                </div>
              ) : (
                <span className="text-xs text-gray-500">Not triggered</span>
              )}
            </div>
          </div>

          {/* Take Profits */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target size={18} className="text-cyan-400" />
              <h3 className="text-sm font-semibold text-gray-300">
                Take Profit Levels
              </h3>
              <span className="text-xs text-cyan-400 ml-auto">
                {signal.tps_hit}/{signal.take_profits.length} Hit
              </span>
            </div>
            <div className="space-y-2">
              {signal.take_profits.map((tp: TakeProfit, index: number) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    tp.hit
                      ? "bg-green-500/10 border-green-500/30"
                      : "bg-gray-800/50 border-gray-700/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-medium w-8 ${
                        tp.hit ? "text-green-400" : "text-gray-500"
                      }`}
                    >
                      TP{tp.level}
                    </span>
                    <span
                      className={`text-base font-semibold ${
                        tp.hit ? "text-green-400" : "text-white"
                      }`}
                    >
                      ${formatPrice(tp.price)}
                    </span>
                    {tp.percentage && (
                      <span className="text-xs text-gray-500">
                        ({tp.percentage}%)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {tp.hit ? (
                      <>
                        <CheckCircle size={16} className="text-green-500" />
                        {tp.hit_at && (
                          <span className="text-xs text-gray-500">
                            {formatDateTime(tp.hit_at)}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-gray-600">Pending</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {signal.notes && (
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={16} className="text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-300">Notes</h3>
              </div>
              <p className="text-sm text-gray-400 whitespace-pre-wrap">
                {signal.notes}
              </p>
            </div>
          )}

          {/* Execution Notes */}
          {signal.execution_notes && (
            <div className="bg-cyan-500/10 rounded-xl p-4 border border-cyan-500/20">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={16} className="text-cyan-400" />
                <h3 className="text-sm font-semibold text-cyan-400">
                  Execution Notes
                </h3>
              </div>
              <p className="text-sm text-gray-300">{signal.execution_notes}</p>
            </div>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
              <div className="flex items-center gap-2 mb-3">
                <User size={16} className="text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-300">
                  Created By
                </h3>
              </div>
              <p className="text-sm text-white">
                {signal.created_by_name || signal.created_by_id}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatDateTime(signal.created_at)}
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={16} className="text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-300">
                  Expiration
                </h3>
              </div>
              {signal.expires_at ? (
                <>
                  <p className="text-sm text-white">
                    {formatDateTime(signal.expires_at)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(signal.expires_at) > new Date()
                      ? "Active"
                      : "Expired"}
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-500">No expiration</p>
              )}
            </div>
          </div>

          {/* Update History */}
          {signal.update_history && signal.update_history.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <History size={16} className="text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-300">
                  Update History
                </h3>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {signal.update_history.map(
                  (entry: UpdateHistoryEntry, index: number) => (
                    <div
                      key={index}
                      className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500">
                          {formatDateTime(entry.updated_at)}
                        </span>
                        <span className="text-xs text-gray-600">
                          by {entry.updated_by}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {Object.entries(entry.changes).map(
                          ([field, value]) => {
                            // Handle both formats:
                            // 1. Direct value: { "sl_hit": true }
                            // 2. Old/New format: { "field": { "old": x, "new": y } }
                            const isOldNewFormat = value !== null && 
                              typeof value === 'object' && 
                              'old' in value && 
                              'new' in value;
                            
                            if (isOldNewFormat) {
                              const change = value as { old: any; new: any };
                              return (
                                <div
                                  key={field}
                                  className="text-xs text-gray-400 flex items-center gap-2"
                                >
                                  <span className="text-gray-500">{field}:</span>
                                  <span className="text-red-400 line-through">
                                    {JSON.stringify(change.old)}
                                  </span>
                                  <span className="text-gray-600">→</span>
                                  <span className="text-green-400">
                                    {JSON.stringify(change.new)}
                                  </span>
                                </div>
                              );
                            }
                            
                            // Direct value format - just show the new value
                            return (
                              <div
                                key={field}
                                className="text-xs text-gray-400 flex items-center gap-2"
                              >
                                <span className="text-gray-500">{field}:</span>
                                <span className="text-cyan-400">
                                  {value === null ? 'null' : JSON.stringify(value)}
                                </span>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-6 py-4 border-t border-gray-800 bg-gray-900/95 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">
              Signal ID: {signal.id}
            </span>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 font-medium hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignalDetailsModal;