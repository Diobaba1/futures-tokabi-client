// =============================================================================
// FILE: src/pages/pageComponents/Trades.tsx
// =============================================================================
// Enterprise-Grade Trade History Page with Professional Data Table
// =============================================================================

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../components/contexts/AuthContext";
import { tradeService } from "../../api/services";
import { TradeDetailResponse, TradeListResponse } from "../../types/trades.types";
import {
  MetricCard,
  StatusBadge,
  SectionHeader,
  PnLDisplay,
  DataTable,
} from "../../components/ui/enterprise";
import { Card, Button } from "../../components/ui";

type SortField = "symbol" | "side" | "status" | "quantity" | "entry_price" | "realized_pnl_usd" | "created_at";
type SortOrder = "asc" | "desc";

const Trades: React.FC = () => {
  const { user } = useAuth();
  const [trades, setTrades] = useState<TradeDetailResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedTrade, setSelectedTrade] = useState<TradeDetailResponse | null>(null);

  const loadTrades = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const params = status ? { status } : {};
        const data: TradeListResponse = await tradeService.getTrades(params);
        setTrades(data.trades || []);
      } catch (error) {
        console.error("Failed to load trades:", error);
        setError("Failed to load trades. Please try again.");
        setTrades([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [status]
  );

  useEffect(() => {
    if (user) {
      loadTrades();
    }
  }, [user, loadTrades]);

  // Calculate trade statistics
  const tradeStats = useMemo(() => {
    const total = trades.length;
    const openTrades = trades.filter((t) => t.status.toLowerCase() === "open").length;
    const closedTrades = trades.filter((t) => t.status.toLowerCase() === "closed").length;
    const cancelledTrades = trades.filter((t) => t.status.toLowerCase() === "cancelled").length;
    const totalPnL = trades.reduce((sum, trade) => sum + (trade.realized_pnl_usd || 0), 0);
    const winningTrades = trades.filter((t) => (t.realized_pnl_usd || 0) > 0).length;
    const losingTrades = trades.filter((t) => (t.realized_pnl_usd || 0) < 0).length;
    const winRate = closedTrades > 0 ? (winningTrades / closedTrades) * 100 : 0;
    const avgPnL = closedTrades > 0 ? totalPnL / closedTrades : 0;

    return {
      total,
      openTrades,
      closedTrades,
      cancelledTrades,
      totalPnL,
      winningTrades,
      losingTrades,
      winRate,
      avgPnL,
    };
  }, [trades]);

  // Filter and sort trades
  const filteredTrades = useMemo(() => {
    let result = trades.filter(
      (trade) =>
        trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trade.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort
    result = [...result].sort((a, b) => {
      let aVal: string | number = "";
      let bVal: string | number = "";

      switch (sortField) {
        case "symbol":
          aVal = a.symbol;
          bVal = b.symbol;
          break;
        case "side":
          aVal = a.side;
          bVal = b.side;
          break;
        case "status":
          aVal = a.status;
          bVal = b.status;
          break;
        case "quantity":
          aVal = a.quantity || 0;
          bVal = b.quantity || 0;
          break;
        case "entry_price":
          aVal = a.entry_price || 0;
          bVal = b.entry_price || 0;
          break;
        case "realized_pnl_usd":
          aVal = a.realized_pnl_usd || 0;
          bVal = b.realized_pnl_usd || 0;
          break;
        case "created_at":
          aVal = new Date(a.created_at).getTime();
          bVal = new Date(b.created_at).getTime();
          break;
      }

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortOrder === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });

    return result;
  }, [trades, searchTerm, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 1000) return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (price >= 1) return price.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 });
    return price.toLocaleString("en-US", { minimumFractionDigits: 6, maximumFractionDigits: 8 });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusType = (status: string): "active" | "success" | "warning" | "error" | "inactive" => {
    switch (status.toLowerCase()) {
      case "open":
        return "active";
      case "closed":
        return "success";
      case "cancelled":
        return "warning";
      case "failed":
        return "error";
      default:
        return "inactive";
    }
  };

  // Table columns
  const columns = [
    {
      key: "symbol",
      header: "Symbol",
      sortable: true,
      render: (trade: TradeDetailResponse) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center">
            <span className="text-sm font-bold text-indigo-400">{trade.symbol.slice(0, 2)}</span>
          </div>
          <div>
            <p className="font-semibold text-white">{trade.symbol}</p>
            <p className="text-xs text-slate-500 font-mono">{trade.id.slice(0, 8)}...</p>
          </div>
        </div>
      ),
    },
    {
      key: "side",
      header: "Side",
      sortable: true,
      render: (trade: TradeDetailResponse) => (
        <StatusBadge
          status={trade.side === "long" ? "success" : "error"}
          label={trade.side.toUpperCase()}
          size="sm"
        />
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (trade: TradeDetailResponse) => (
        <StatusBadge status={getStatusType(trade.status)} label={trade.status.toUpperCase()} size="sm" />
      ),
    },
    {
      key: "quantity",
      header: "Quantity",
      align: "right" as const,
      sortable: true,
      render: (trade: TradeDetailResponse) => (
        <span className="font-medium text-white font-mono">
          {trade.quantity ? trade.quantity.toFixed(4) : "—"}
        </span>
      ),
    },
    {
      key: "entry_price",
      header: "Entry Price",
      align: "right" as const,
      sortable: true,
      render: (trade: TradeDetailResponse) => (
        <span className="text-slate-300 font-mono">${trade.entry_price ? formatPrice(trade.entry_price) : "—"}</span>
      ),
    },
    {
      key: "leverage",
      header: "Leverage",
      align: "center" as const,
      render: (trade: TradeDetailResponse) => (
        <span className="px-2 py-1 rounded-lg bg-slate-700/50 text-slate-300 text-sm font-medium">
          {trade.leverage || 1}x
        </span>
      ),
    },
    {
      key: "realized_pnl_usd",
      header: "P&L",
      align: "right" as const,
      sortable: true,
      render: (trade: TradeDetailResponse) => <PnLDisplay value={trade.realized_pnl_usd || 0} size="sm" />,
    },
    {
      key: "created_at",
      header: "Date",
      align: "right" as const,
      sortable: true,
      render: (trade: TradeDetailResponse) => (
        <span className="text-slate-400 text-sm">{formatDate(trade.created_at)}</span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-6" />
          <p className="text-slate-400 text-lg font-medium">Loading trades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[96px]" />
      </div>

      <div className="relative max-w-[1600px] mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Trade History</h1>
              <p className="text-slate-400">Monitor and analyze your trading performance</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => loadTrades(true)}
                disabled={refreshing}
              >
                {refreshing ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                )}
                {refreshing ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-rose-400 text-sm">{error}</p>
                </div>
                <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-300 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <MetricCard
            title="Total Trades"
            value={tradeStats.total}
            subtitle={`${tradeStats.openTrades} open, ${tradeStats.closedTrades} closed`}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            }
            variant="default"
          />
          <MetricCard
            title="Total P&L"
            value={`${tradeStats.totalPnL >= 0 ? "+" : ""}$${Math.abs(tradeStats.totalPnL).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            subtitle={`Avg: $${tradeStats.avgPnL.toFixed(2)} per trade`}
            change={tradeStats.totalPnL !== 0 ? (tradeStats.totalPnL > 0 ? 100 : -100) : 0}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
            variant={tradeStats.totalPnL >= 0 ? "success" : "danger"}
          />
          <MetricCard
            title="Win Rate"
            value={`${tradeStats.winRate.toFixed(1)}%`}
            subtitle={`${tradeStats.winningTrades}W / ${tradeStats.losingTrades}L`}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                />
              </svg>
            }
            variant={tradeStats.winRate >= 50 ? "success" : "warning"}
          />
          <MetricCard
            title="Open Positions"
            value={tradeStats.openTrades}
            subtitle={tradeStats.openTrades > 0 ? "Active trades" : "No open trades"}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            variant={tradeStats.openTrades > 0 ? "info" : "default"}
          />
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Search</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by symbol or ID..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                  />
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Status</label>
                <select
                  value={status || ""}
                  onChange={(e) => setStatus(e.target.value || undefined)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="">All Statuses</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Sort By</label>
                <div className="flex gap-2">
                  <select
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value as SortField)}
                    className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="created_at">Date</option>
                    <option value="symbol">Symbol</option>
                    <option value="realized_pnl_usd">P&L</option>
                    <option value="quantity">Quantity</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all"
                  >
                    {sortOrder === "asc" ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Trades Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="overflow-hidden">
            <div className="p-6 border-b border-slate-700/50">
              <SectionHeader
                title="Trade History"
                subtitle={`${filteredTrades.length} trade${filteredTrades.length !== 1 ? "s" : ""} found`}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                }
              />
            </div>

            {filteredTrades.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700/50 bg-slate-800/30">
                      {columns.map((column) => (
                        <th
                          key={String(column.key)}
                          className={`px-6 py-4 text-${column.align || "left"} text-xs font-semibold text-slate-400 uppercase tracking-wider ${
                            column.sortable ? "cursor-pointer hover:text-white transition-colors" : ""
                          }`}
                          onClick={() => column.sortable && handleSort(column.key as SortField)}
                        >
                          <div className="flex items-center gap-2">
                            {column.header}
                            {column.sortable && sortField === column.key && (
                              <span className="text-emerald-400">
                                {sortOrder === "asc" ? "↑" : "↓"}
                              </span>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/30">
                    <AnimatePresence>
                      {filteredTrades.map((trade, index) => (
                        <motion.tr
                          key={trade.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: index * 0.02 }}
                          onClick={() => setSelectedTrade(trade)}
                          className="hover:bg-slate-800/30 cursor-pointer transition-colors"
                        >
                          {columns.map((column) => (
                            <td
                              key={String(column.key)}
                              className={`px-6 py-4 text-${column.align || "left"}`}
                            >
                              {column.render(trade)}
                            </td>
                          ))}
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-300 mb-2">No Trades Found</h3>
                <p className="text-sm text-slate-500">
                  {searchTerm || status
                    ? "Try adjusting your filters"
                    : "Your trade history will appear here"}
                </p>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Trade Detail Modal */}
        <AnimatePresence>
          {selectedTrade && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedTrade(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-slate-900 border border-slate-700/50 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center">
                        <span className="text-lg font-bold text-indigo-400">{selectedTrade.symbol.slice(0, 2)}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{selectedTrade.symbol}</h3>
                        <p className="text-sm text-slate-500 font-mono">{selectedTrade.id}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedTrade(null)}
                      className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-800/50">
                      <p className="text-xs text-slate-500 mb-1">Side</p>
                      <StatusBadge
                        status={selectedTrade.side === "long" ? "success" : "error"}
                        label={selectedTrade.side.toUpperCase()}
                      />
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/50">
                      <p className="text-xs text-slate-500 mb-1">Status</p>
                      <StatusBadge status={getStatusType(selectedTrade.status)} label={selectedTrade.status.toUpperCase()} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-800/50">
                      <p className="text-xs text-slate-500 mb-1">Quantity</p>
                      <p className="text-lg font-semibold text-white font-mono">
                        {selectedTrade.quantity?.toFixed(4) || "—"}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/50">
                      <p className="text-xs text-slate-500 mb-1">Leverage</p>
                      <p className="text-lg font-semibold text-white">{selectedTrade.leverage || 1}x</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-800/50">
                      <p className="text-xs text-slate-500 mb-1">Entry Price</p>
                      <p className="text-lg font-semibold text-white font-mono">
                        ${selectedTrade.entry_price ? formatPrice(selectedTrade.entry_price) : "—"}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/50">
                      <p className="text-xs text-slate-500 mb-1">Quantity</p>
                      <p className="text-lg font-semibold text-white font-mono">
                        {selectedTrade.quantity ? selectedTrade.quantity.toFixed(4) : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-800/50">
                    <p className="text-xs text-slate-500 mb-2">Realized P&L</p>
                    <PnLDisplay value={selectedTrade.realized_pnl_usd || 0} size="lg" />
                  </div>

                  {(selectedTrade.stop_loss_price || selectedTrade.take_profit_price) && (
                    <div className="grid grid-cols-2 gap-4">
                      {selectedTrade.stop_loss_price && (
                        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                          <p className="text-xs text-rose-400 mb-1">Stop Loss</p>
                          <p className="text-lg font-semibold text-white font-mono">
                            ${formatPrice(selectedTrade.stop_loss_price)}
                          </p>
                        </div>
                      )}
                      {selectedTrade.take_profit_price && (
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                          <p className="text-xs text-emerald-400 mb-1">Take Profit</p>
                          <p className="text-lg font-semibold text-white font-mono">
                            ${formatPrice(selectedTrade.take_profit_price)}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-4 rounded-xl bg-slate-800/50">
                    <p className="text-xs text-slate-500 mb-1">Created</p>
                    <p className="text-sm text-white">
                      {new Date(selectedTrade.created_at).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </div>

                <div className="p-6 border-t border-slate-700/50">
                  <Button variant="secondary" className="w-full" onClick={() => setSelectedTrade(null)}>
                    Close
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Trades;
