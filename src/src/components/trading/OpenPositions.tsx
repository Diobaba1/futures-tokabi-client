// =============================================================================
// FILE: src/components/trading/OpenPositions.tsx
// =============================================================================
// Component for displaying open positions with real-time updates
// =============================================================================

import React from "react";
import { Position } from "../../api/services/tradingWebSocketService";
import { Card, Badge, Spinner, Button } from "../ui";

interface OpenPositionsProps {
  positions: Position[];
  isLoading?: boolean;
  isConnected?: boolean;
  lastSync?: string | null;
  error?: string | null;
  onSync?: () => void;
  onRefresh?: () => void;
  compact?: boolean;
}

export const OpenPositions: React.FC<OpenPositionsProps> = ({
  positions,
  isLoading = false,
  isConnected = false,
  lastSync,
  error,
  onSync,
  onRefresh,
  compact = false,
}) => {
  const formatPrice = (price: number): string => {
    if (price >= 1000) return price.toFixed(2);
    if (price >= 1) return price.toFixed(4);
    return price.toFixed(6);
  };

  const formatPnL = (pnl: number): string => {
    const prefix = pnl >= 0 ? "+" : "";
    return `${prefix}$${pnl.toFixed(2)}`;
  };

  const formatPercentage = (pnl: number, entryPrice: number, leverage: number): string => {
    if (entryPrice === 0) return "0%";
    const pct = (pnl / (entryPrice * 100)) * 100 * leverage;
    const prefix = pct >= 0 ? "+" : "";
    return `${prefix}${pct.toFixed(2)}%`;
  };

  const getTimeAgo = (isoString: string | null): string => {
    if (!isoString) return "Never";
    const diff = Date.now() - new Date(isoString).getTime();
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  if (compact) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Open Positions
          </h3>
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-emerald-500 animate-pulse" : "bg-slate-500"
              }`}
            />
            <span className="text-xs text-slate-500">
              {isConnected ? "Live" : "Offline"}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-3 p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg">
            <p className="text-xs text-rose-400">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-6">
            <Spinner size="sm" />
          </div>
        ) : positions.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-slate-500">No open positions</p>
          </div>
        ) : (
          <div className="space-y-2">
            {positions.slice(0, 5).map((pos, index) => (
              <div
                key={`${pos.symbol}-${index}`}
                className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Badge
                    variant={pos.side === "long" ? "success" : "danger"}
                    size="sm"
                  >
                    {pos.side.toUpperCase()}
                  </Badge>
                  <span className="text-sm font-medium text-white">
                    {pos.symbol}
                  </span>
                </div>
                <span
                  className={`text-sm font-medium ${
                    pos.unrealized_pnl >= 0 ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {formatPnL(pos.unrealized_pnl)}
                </span>
              </div>
            ))}
            {positions.length > 5 && (
              <p className="text-xs text-slate-500 text-center pt-1">
                +{positions.length - 5} more positions
              </p>
            )}
          </div>
        )}
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-white">Open Positions</h2>
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-emerald-500 animate-pulse" : "bg-slate-500"
              }`}
            />
            <span className="text-xs text-slate-400">
              {isConnected ? "Live" : "Offline"}
            </span>
          </div>
          {lastSync && (
            <span className="text-xs text-slate-500">
              Updated {getTimeAgo(lastSync)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button variant="ghost" size="sm" onClick={onRefresh}>
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </Button>
          )}
          {onSync && (
            <Button variant="secondary" size="sm" onClick={onSync}>
              Sync from Binance
            </Button>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-3 bg-rose-500/10 border-b border-rose-500/20">
          <p className="text-sm text-rose-400">{error}</p>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="md" />
        </div>
      ) : positions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <svg
            className="w-12 h-12 text-slate-600 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="text-slate-400 font-medium mb-1">No Open Positions</h3>
          <p className="text-sm text-slate-500">
            Your positions will appear here in real-time
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3 text-left font-medium">Symbol</th>
                <th className="px-4 py-3 text-left font-medium">Side</th>
                <th className="px-4 py-3 text-right font-medium">Size</th>
                <th className="px-4 py-3 text-right font-medium">Entry Price</th>
                <th className="px-4 py-3 text-right font-medium">Mark Price</th>
                <th className="px-4 py-3 text-right font-medium">PnL (USD)</th>
                <th className="px-4 py-3 text-right font-medium">PnL %</th>
                <th className="px-4 py-3 text-center font-medium">Leverage</th>
                {positions.some((p) => p.liquidation_price) && (
                  <th className="px-4 py-3 text-right font-medium">Liq. Price</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {positions.map((pos, index) => (
                <tr
                  key={`${pos.symbol}-${index}`}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="font-medium text-white">{pos.symbol}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={pos.side === "long" ? "success" : "danger"}
                      size="sm"
                    >
                      {pos.side.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-slate-300">
                      {Math.abs(pos.position_amount).toFixed(4)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-slate-300">
                      ${formatPrice(pos.entry_price)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-slate-300">
                      ${formatPrice(pos.mark_price)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`font-medium ${
                        pos.unrealized_pnl >= 0
                          ? "text-emerald-400"
                          : "text-rose-400"
                      }`}
                    >
                      {formatPnL(pos.unrealized_pnl)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`text-sm ${
                        pos.unrealized_pnl >= 0
                          ? "text-emerald-400"
                          : "text-rose-400"
                      }`}
                    >
                      {formatPercentage(
                        pos.unrealized_pnl,
                        pos.entry_price,
                        pos.leverage
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant="default" size="sm">
                      {pos.leverage}x
                    </Badge>
                  </td>
                  {positions.some((p) => p.liquidation_price) && (
                    <td className="px-4 py-3 text-right">
                      {pos.liquidation_price ? (
                        <span className="text-amber-400 text-sm">
                          ${formatPrice(pos.liquidation_price)}
                        </span>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer Stats */}
      {positions.length > 0 && (
        <div className="p-4 border-t border-slate-700/50 bg-slate-800/30">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">
              {positions.length} position{positions.length !== 1 ? "s" : ""}
            </span>
            <div className="flex items-center gap-6">
              <div>
                <span className="text-slate-500 mr-2">Total PnL:</span>
                <span
                  className={`font-medium ${
                    positions.reduce((sum, p) => sum + p.unrealized_pnl, 0) >= 0
                      ? "text-emerald-400"
                      : "text-rose-400"
                  }`}
                >
                  {formatPnL(
                    positions.reduce((sum, p) => sum + p.unrealized_pnl, 0)
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default OpenPositions;
