// ============================================================================
// FILE: src/components/StaffSignals/SignalCard.tsx
// ============================================================================

import React from "react";
import {
  StaffSignalResponse,
  TakeProfit,
} from "../../types/staffSignals.types";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Shield,
  Clock,
  User,
  MoreVertical,
  CheckCircle,
  XCircle,
  Edit,
  Eye,
  Power,
  PowerOff,
} from "lucide-react";

interface SignalCardProps {
  signal: StaffSignalResponse;
  onEdit?: (signal: StaffSignalResponse) => void;
  onDeactivate?: (signalId: string) => void;
  onActivate?: (signalId: string) => void;
  onMarkTpHit?: (signalId: string, tpLevel: number) => void;
  onMarkSlHit?: (signalId: string) => void;
  onViewDetails?: (signalId: string) => void;
}

const SignalCard: React.FC<SignalCardProps> = ({
  signal,
  onEdit,
  onDeactivate,
  onActivate,
  onMarkTpHit,
  onMarkSlHit,
  onViewDetails,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const isBuy = signal.position_type.toLowerCase() === "buy";
  const isActive = signal.status === "active";

  const formatPrice = (price: number) => {
    if (price >= 1000) return price.toLocaleString();
    if (price >= 1) return price.toFixed(2);
    return price.toFixed(6);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
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

  const getTpProgress = () => {
    const totalTps = signal.take_profits.length;
    const hitTps = signal.tps_hit;
    return { hit: hitTps, total: totalTps };
  };

  const tpProgress = getTpProgress();

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl p-5 hover:border-cyan-500/30 transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              isBuy
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {isBuy ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{signal.symbol}</h3>
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
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full border ${getStatusColor(
              signal.status
            )}`}
          >
            {signal.status.toUpperCase()}
          </span>

          {/* Actions Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
            >
              <MoreVertical size={18} />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10 py-1">
                <button
                  onClick={() => {
                    onViewDetails?.(signal.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                >
                  <Eye size={14} /> View Details
                </button>
                <button
                  onClick={() => {
                    onEdit?.(signal);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                >
                  <Edit size={14} /> Edit Signal
                </button>
                {isActive ? (
                  <button
                    onClick={() => {
                      onDeactivate?.(signal.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-gray-700 flex items-center gap-2"
                  >
                    <PowerOff size={14} /> Deactivate
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onActivate?.(signal.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-green-400 hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Power size={14} /> Activate
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Price Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gray-800/50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Entry Price</p>
          <p className="text-sm font-semibold text-white">
            ${formatPrice(signal.entry_price)}
          </p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Current</p>
          <p className="text-sm font-semibold text-cyan-400">
            ${formatPrice(signal.current_price)}
          </p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Leverage</p>
          <p className="text-sm font-semibold text-yellow-400">
            {signal.leverage}x
          </p>
        </div>
      </div>

      {/* Stop Loss */}
      <div className="flex items-center justify-between mb-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-red-400" />
          <span className="text-sm text-gray-400">Stop Loss</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-red-400">
            ${formatPrice(signal.stop_loss)}
          </span>
          {signal.sl_hit ? (
            <XCircle size={16} className="text-red-500" />
          ) : isActive ? (
            <button
              onClick={() => onMarkSlHit?.(signal.id)}
              className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
            >
              Mark Hit
            </button>
          ) : null}
        </div>
      </div>

      {/* Take Profits */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-cyan-400" />
            <span className="text-sm text-gray-400">Take Profits</span>
          </div>
          <span className="text-xs text-cyan-400">
            {tpProgress.hit}/{tpProgress.total} Hit
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {signal.take_profits.map((tp: TakeProfit, index: number) => (
            <div
              key={index}
              className={`flex items-center justify-between p-2 rounded-lg border ${
                tp.hit
                  ? "bg-green-500/10 border-green-500/30"
                  : "bg-gray-800/50 border-gray-700"
              }`}
            >
              <span className="text-xs text-gray-400">TP{tp.level}</span>
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-xs font-semibold ${
                    tp.hit ? "text-green-400" : "text-gray-300"
                  }`}
                >
                  ${formatPrice(tp.price)}
                </span>
                {tp.hit ? (
                  <CheckCircle size={12} className="text-green-500" />
                ) : isActive ? (
                  <button
                    onClick={() => onMarkTpHit?.(signal.id, tp.level)}
                    className="text-[10px] px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30 transition-colors"
                  >
                    Hit
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-800">
        <div className="flex items-center gap-1.5 text-gray-500">
          <User size={12} />
          <span className="text-xs">
            {signal.created_by_name || "Staff"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-500">
          <Clock size={12} />
          <span className="text-xs">{formatDate(signal.created_at)}</span>
        </div>
        {signal.risk_reward_ratio && (
          <span className="text-xs text-cyan-400">
            R:R {signal.risk_reward_ratio}
          </span>
        )}
      </div>
    </div>
  );
};

export default SignalCard;