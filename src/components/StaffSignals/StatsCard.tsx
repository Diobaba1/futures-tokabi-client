// ============================================================================
// FILE: src/components/StaffSignals/StatsCard.tsx
// ============================================================================

import React from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Shield,
  Activity,
  Clock,
} from "lucide-react";
import { StaffSignalStatsResponse } from "../../types/staffSignals.types";

interface StatsCardProps {
  stats: StaffSignalStatsResponse | null;
  isLoading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ stats, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-900/80 border border-gray-800 rounded-xl p-5 animate-pulse"
          >
            <div className="h-4 w-20 bg-gray-800 rounded mb-3" />
            <div className="h-8 w-16 bg-gray-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 text-center">
        <BarChart3 size={32} className="text-gray-600 mx-auto mb-2" />
        <p className="text-gray-500">No statistics available</p>
      </div>
    );
  }

  const statItems = [
    {
      label: "Total Signals",
      value: stats.total_signals,
      icon: Activity,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20",
    },
    {
      label: "TP Hit Rate",
      value: `${stats.tp_hit_rate}%`,
      icon: Target,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      subtitle: `${stats.hit_tps}/${stats.total_tps}`,
    },
    {
      label: "SL Hit Rate",
      value: `${stats.sl_hit_rate}%`,
      icon: Shield,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
      subtitle: `${stats.sl_hits} hits`,
    },
    {
      label: "Period",
      value: `${stats.period_days}d`,
      icon: Clock,
      color: "text-gray-400",
      bgColor: "bg-gray-500/10",
      borderColor: "border-gray-500/20",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item, index) => (
          <div
            key={index}
            className={`${item.bgColor} border ${item.borderColor} rounded-xl p-5 transition-all duration-300 hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500 font-medium">
                {item.label}
              </span>
              <item.icon size={18} className={item.color} />
            </div>
            <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
            {item.subtitle && (
              <p className="text-xs text-gray-600 mt-1">{item.subtitle}</p>
            )}
          </div>
        ))}
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* By Status */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-5">
          <h4 className="text-sm font-semibold text-gray-400 mb-4 flex items-center gap-2">
            <Activity size={14} /> By Status
          </h4>
          <div className="space-y-2">
            {Object.entries(stats.by_status).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-xs text-gray-500 capitalize">
                  {status}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        status === "active"
                          ? "bg-cyan-500"
                          : status === "executed"
                          ? "bg-green-500"
                          : status === "inactive"
                          ? "bg-gray-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${(count / stats.total_signals) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-400 w-8 text-right">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By Position */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-5">
          <h4 className="text-sm font-semibold text-gray-400 mb-4 flex items-center gap-2">
            <TrendingUp size={14} /> By Position
          </h4>
          <div className="space-y-3">
            {Object.entries(stats.by_position).map(([position, count]) => {
              const isBuy = position.toLowerCase() === "buy";
              const percentage = ((count / stats.total_signals) * 100).toFixed(
                1
              );
              return (
                <div key={position}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {isBuy ? (
                        <TrendingUp size={14} className="text-green-400" />
                      ) : (
                        <TrendingDown size={14} className="text-red-400" />
                      )}
                      <span className="text-xs text-gray-400 uppercase">
                        {position}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-gray-400">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isBuy ? "bg-green-500" : "bg-red-500"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Symbols */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-5">
          <h4 className="text-sm font-semibold text-gray-400 mb-4 flex items-center gap-2">
            <BarChart3 size={14} /> Top Symbols
          </h4>
          <div className="space-y-2">
            {Object.entries(stats.by_symbol)
              .slice(0, 5)
              .map(([symbol, count], index) => (
                <div
                  key={symbol}
                  className="flex items-center justify-between py-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 w-4">
                      {index + 1}.
                    </span>
                    <span className="text-sm text-white font-medium">
                      {symbol}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-cyan-400">
                    {count} signals
                  </span>
                </div>
              ))}
            {Object.keys(stats.by_symbol).length === 0 && (
              <p className="text-xs text-gray-600 text-center py-4">
                No symbol data
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;