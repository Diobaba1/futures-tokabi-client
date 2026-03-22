import React, { useEffect, useState, useCallback } from 'react';
import { positionService } from '../../api/services/positionService';
import type {
  ActivePosition,
  ActivePositionsResponse,
  ClosePositionResult,
} from '../../types/position.types';
import {
  Activity,
  RefreshCw,
  Search,
  AlertTriangle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Shield,
  Clock,
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckCircle2,
  X,
  DollarSign,
  BarChart3,
} from 'lucide-react';

type SortField = 'symbol' | 'unrealized_pnl' | 'position_size_usdt' | 'created_at';
type SortDir = 'asc' | 'desc';

const LiveTradingPage: React.FC = () => {
  const [data, setData] = useState<ActivePositionsResponse>({
    items: [],
    total: 0,
    page: 1,
    page_size: 20,
    total_pages: 1,
    has_next: false,
    has_prev: false,
    total_positions: 0,
    total_exposure_usdt: 0,
    total_unrealized_pnl: 0,
  });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [symbolFilter, setSymbolFilter] = useState('');
  const [exchangeFilter, setExchangeFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Sorting
  const [sortField, setSortField] = useState<SortField>('position_size_usdt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  // Close dialog
  const [closeTarget, setCloseTarget] = useState<ActivePosition | null>(null);
  const [closing, setClosing] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const params: Record<string, string | number> = { page, page_size: pageSize };
      if (symbolFilter) params.symbol = symbolFilter;
      if (exchangeFilter) params.exchange_type = exchangeFilter;

      const positionsRes = await positionService.getActivePositions(params as any);
      setData(positionsRes);
    } catch (error) {
      console.error('Failed to load positions:', error);
      showToast('error', 'Failed to load active positions');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [symbolFilter, exchangeFilter, page, pageSize]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-refresh every 30s
  useEffect(() => {
    const interval = setInterval(() => loadData(true), 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  const handleClosePosition = async () => {
    if (!closeTarget) return;
    setClosing(true);
    try {
      const result: ClosePositionResult = await positionService.closePosition(
        closeTarget.execution_id,
        closeTarget.execution_type
      );
      if (result.success) {
        showToast(
          'success',
          `Closed ${closeTarget.symbol} — Exit: $${result.exit_price?.toFixed(2) ?? 'N/A'}, PnL: $${result.realized_pnl?.toFixed(4) ?? 'N/A'}`
        );
        loadData(true);
      } else {
        showToast('error', result.error || 'Failed to close position');
      }
    } catch (error: any) {
      showToast('error', error?.response?.data?.detail || 'Failed to close position');
    } finally {
      setClosing(false);
      setCloseTarget(null);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  // Get unique symbols for filter chips
  const uniqueSymbols = Array.from(new Set(data.items.map(p => p.symbol)));

  const filteredPositions = data.items
    .filter((p) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          p.symbol.toLowerCase().includes(q) ||
          p.execution_id.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      switch (sortField) {
        case 'symbol':
          return dir * a.symbol.localeCompare(b.symbol);
        case 'unrealized_pnl':
          return dir * ((a.unrealized_pnl ?? 0) - (b.unrealized_pnl ?? 0));
        case 'position_size_usdt':
          return dir * ((a.position_size_usdt ?? 0) - (b.position_size_usdt ?? 0));
        case 'created_at':
          return dir * ((a.created_at ?? '').localeCompare(b.created_at ?? ''));
        default:
          return 0;
      }
    });

  const formatAge = (dateStr: string | null) => {
    if (!dateStr) return '—';
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    if (hours > 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronDown size={14} className="text-gray-600" />;
    return sortDir === 'asc' ? (
      <ChevronUp size={14} className="text-cyan-400" />
    ) : (
      <ChevronDown size={14} className="text-cyan-400" />
    );
  };

  return (
    <div className="min-h-screen bg-dark-base">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pointer-events-none" />

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-xl transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          <span className="text-sm font-medium max-w-md">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Activity className="text-cyan-400" size={24} />
              Live Positions
            </h1>
            <p className="text-gray-500 mt-1 text-sm">Monitor and manage your active trades in real-time</p>
          </div>

          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-dark-elevated border border-dark-border rounded-xl text-sm text-gray-300 hover:bg-dark-surface/50 hover:text-white transition-all disabled:opacity-50"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-dark-elevated backdrop-blur-sm rounded-2xl border border-dark-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 rounded-xl">
                <Activity size={20} className="text-cyan-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Active Positions</p>
                <p className="text-2xl font-bold text-white mt-0.5">{data.total_positions}</p>
              </div>
            </div>
          </div>

          <div className="bg-dark-elevated backdrop-blur-sm rounded-2xl border border-dark-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-xl">
                <DollarSign size={20} className="text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Total Exposure</p>
                <p className="text-2xl font-bold text-white mt-0.5">
                  ${data.total_exposure_usdt.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-dark-elevated backdrop-blur-sm rounded-2xl border border-dark-border p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${data.total_unrealized_pnl >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                <BarChart3 size={20} className={data.total_unrealized_pnl >= 0 ? 'text-emerald-400' : 'text-red-400'} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Unrealized PnL</p>
                <p className={`text-2xl font-bold mt-0.5 ${
                  data.total_unrealized_pnl >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {data.total_unrealized_pnl >= 0 ? '+' : ''}${data.total_unrealized_pnl.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Symbol Chips */}
        {uniqueSymbols.length > 1 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSymbolFilter('')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                !symbolFilter
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-dark-elevated text-gray-400 border border-dark-border hover:border-dark-border'
              }`}
            >
              All
            </button>
            {uniqueSymbols.map((sym) => (
              <button
                key={sym}
                onClick={() => setSymbolFilter(symbolFilter === sym ? '' : sym)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  symbolFilter === sym
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'bg-dark-elevated text-gray-400 border border-dark-border hover:border-dark-border'
                }`}
              >
                {sym}
              </button>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search by symbol or execution ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-dark-elevated border border-dark-border rounded-xl text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/30 text-white"
            />
          </div>
          <select
            value={exchangeFilter}
            onChange={(e) => setExchangeFilter(e.target.value)}
            className="px-4 py-2.5 bg-dark-elevated border border-dark-border rounded-xl text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
          >
            <option value="">All Exchanges</option>
            <option value="binance">Binance</option>
            <option value="bybit">Bybit</option>
          </select>
        </div>

        {/* Positions Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-cyan-400" />
            <span className="ml-3 text-gray-500">Loading positions...</span>
          </div>
        ) : filteredPositions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Shield size={48} className="mb-4 text-slate-700" />
            <p className="text-lg font-medium text-gray-400">No active positions</p>
            <p className="text-sm mt-1 text-gray-600">You don't have any open trades right now</p>
          </div>
        ) : (
          <div className="bg-dark-elevated backdrop-blur-xl rounded-2xl border border-dark-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-border bg-dark-elevated/30">
                    <th
                      className="text-left px-4 py-3 text-gray-500 font-medium cursor-pointer select-none"
                      onClick={() => handleSort('symbol')}
                    >
                      <div className="flex items-center gap-1">
                        Symbol <SortIcon field="symbol" />
                      </div>
                    </th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Exchange</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Side</th>
                    <th className="text-right px-4 py-3 text-gray-500 font-medium">Entry</th>
                    <th className="text-right px-4 py-3 text-gray-500 font-medium">Current</th>
                    <th className="text-right px-4 py-3 text-gray-500 font-medium">Qty</th>
                    <th className="text-center px-4 py-3 text-gray-500 font-medium">Lev</th>
                    <th
                      className="text-right px-4 py-3 text-gray-500 font-medium cursor-pointer select-none"
                      onClick={() => handleSort('position_size_usdt')}
                    >
                      <div className="flex items-center justify-end gap-1">
                        Size <SortIcon field="position_size_usdt" />
                      </div>
                    </th>
                    <th
                      className="text-right px-4 py-3 text-gray-500 font-medium cursor-pointer select-none"
                      onClick={() => handleSort('unrealized_pnl')}
                    >
                      <div className="flex items-center justify-end gap-1">
                        PnL <SortIcon field="unrealized_pnl" />
                      </div>
                    </th>
                    <th className="text-right px-4 py-3 text-gray-500 font-medium">SL</th>
                    <th className="text-center px-4 py-3 text-gray-500 font-medium">TPs</th>
                    <th
                      className="text-right px-4 py-3 text-gray-500 font-medium cursor-pointer select-none"
                      onClick={() => handleSort('created_at')}
                    >
                      <div className="flex items-center justify-end gap-1">
                        Age <SortIcon field="created_at" />
                      </div>
                    </th>
                    <th className="text-center px-4 py-3 text-gray-500 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPositions.map((pos) => {
                    const pnl = pos.unrealized_pnl ?? 0;
                    const pnlPct = pos.unrealized_pnl_percent ?? 0;
                    const isLong = pos.side?.toUpperCase() === 'BUY' || pos.side?.toUpperCase() === 'LONG';

                    return (
                      <tr
                        key={pos.execution_id}
                        className="border-b border-dark-border/50 hover:bg-dark-elevated/30 transition-colors"
                      >
                        {/* Symbol */}
                        <td className="px-4 py-3">
                          <span className="text-white font-medium">{pos.symbol}</span>
                          {pos.is_testnet && (
                            <span className="ml-1 text-[10px] text-yellow-400 bg-yellow-400/10 px-1 rounded">TEST</span>
                          )}
                        </td>

                        {/* Exchange */}
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              pos.exchange_type === 'binance'
                                ? 'bg-yellow-500/10 text-yellow-400'
                                : 'bg-orange-500/10 text-orange-400'
                            }`}
                          >
                            {pos.exchange_type}
                          </span>
                        </td>

                        {/* Side */}
                        <td className="px-4 py-3">
                          <span
                            className={`flex items-center gap-1 text-xs font-medium ${
                              isLong ? 'text-emerald-400' : 'text-red-400'
                            }`}
                          >
                            {isLong ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {isLong ? 'LONG' : 'SHORT'}
                          </span>
                        </td>

                        {/* Entry Price */}
                        <td className="px-4 py-3 text-right text-gray-300 font-mono text-xs">
                          {pos.entry_price != null ? `$${pos.entry_price.toLocaleString()}` : '—'}
                        </td>

                        {/* Current Price */}
                        <td className="px-4 py-3 text-right font-mono text-xs">
                          {pos.current_price != null ? (
                            <span className="text-white">${pos.current_price.toLocaleString()}</span>
                          ) : (
                            <span className="text-gray-600">—</span>
                          )}
                        </td>

                        {/* Quantity */}
                        <td className="px-4 py-3 text-right text-gray-300 font-mono text-xs">
                          {pos.remaining_quantity ?? pos.quantity ?? '—'}
                        </td>

                        {/* Leverage */}
                        <td className="px-4 py-3 text-center">
                          <span className="text-xs text-cyan-400 font-medium">{pos.leverage}x</span>
                        </td>

                        {/* Size */}
                        <td className="px-4 py-3 text-right text-gray-300 font-mono text-xs">
                          {pos.position_size_usdt != null
                            ? `$${pos.position_size_usdt.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                            : '—'}
                        </td>

                        {/* PnL */}
                        <td className="px-4 py-3 text-right">
                          <div>
                            <span
                              className={`font-mono text-xs font-medium ${
                                pnl >= 0 ? 'text-emerald-400' : 'text-red-400'
                              }`}
                            >
                              {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                            </span>
                            <p
                              className={`text-[10px] ${
                                pnlPct >= 0 ? 'text-emerald-400/60' : 'text-red-400/60'
                              }`}
                            >
                              {pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(2)}%
                            </p>
                          </div>
                        </td>

                        {/* Stop Loss */}
                        <td className="px-4 py-3 text-right font-mono text-xs">
                          {pos.stop_loss_price != null ? (
                            <span className="text-red-400/80">${pos.stop_loss_price.toLocaleString()}</span>
                          ) : (
                            <span className="text-slate-700">—</span>
                          )}
                          {pos.sl_moved_to_breakeven && (
                            <span className="ml-1 text-[10px] text-blue-400" title="Moved to breakeven">
                              BE
                            </span>
                          )}
                        </td>

                        {/* TPs */}
                        <td className="px-4 py-3 text-center">
                          {pos.take_profit_orders && pos.take_profit_orders.length > 0 ? (
                            <span className="text-xs text-gray-300">
                              {pos.take_profit_orders.length}
                            </span>
                          ) : (
                            <span className="text-slate-700">—</span>
                          )}
                        </td>

                        {/* Age */}
                        <td className="px-4 py-3 text-right">
                          <span className="flex items-center justify-end gap-1 text-xs text-gray-500">
                            <Clock size={10} />
                            {formatAge(pos.executed_at || pos.created_at)}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => setCloseTarget(pos)}
                            className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium rounded-lg border border-red-500/20 hover:border-red-500/40 transition-all"
                          >
                            Close
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data.total_pages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-dark-border">
                <p className="text-xs text-gray-500">
                  Page {data.page} of {data.total_pages} ({data.total} positions)
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={!data.has_prev}
                    className="px-3 py-1.5 text-xs bg-dark-elevated text-gray-300 rounded-lg disabled:opacity-30 hover:bg-dark-surface transition-all"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={!data.has_next}
                    className="px-3 py-1.5 text-xs bg-dark-elevated text-gray-300 rounded-lg disabled:opacity-30 hover:bg-dark-surface transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Auto-refresh indicator */}
        <div className="text-center">
          <p className="text-xs text-slate-700">Auto-refreshes every 30 seconds</p>
        </div>
      </div>

      {/* Close Position Confirmation Dialog */}
      {closeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-dark-elevated border border-dark-border rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-red-500/10 border-b border-red-500/20">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-red-400" size={24} />
                <div>
                  <h3 className="text-lg font-bold text-white">Close Position</h3>
                  <p className="text-sm text-gray-400">This will close the position on the exchange</p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="px-6 py-4 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Symbol</span>
                  <p className="text-white font-medium">{closeTarget.symbol}</p>
                </div>
                <div>
                  <span className="text-gray-500">Side</span>
                  <p className={closeTarget.side?.toUpperCase().includes('BUY') || closeTarget.side?.toUpperCase() === 'LONG' ? 'text-emerald-400 font-medium' : 'text-red-400 font-medium'}>
                    {closeTarget.side?.toUpperCase().includes('BUY') || closeTarget.side?.toUpperCase() === 'LONG' ? 'LONG' : 'SHORT'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Exchange</span>
                  <p className="text-white">{closeTarget.exchange_type}{closeTarget.is_testnet ? ' (Testnet)' : ''}</p>
                </div>
                <div>
                  <span className="text-gray-500">Leverage</span>
                  <p className="text-cyan-400 font-medium">{closeTarget.leverage}x</p>
                </div>
                <div>
                  <span className="text-gray-500">Entry Price</span>
                  <p className="text-white font-mono">${closeTarget.entry_price?.toLocaleString() ?? '—'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Current Price</span>
                  <p className="text-white font-mono">${closeTarget.current_price?.toLocaleString() ?? '—'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Quantity</span>
                  <p className="text-white font-mono">{closeTarget.remaining_quantity ?? closeTarget.quantity ?? '—'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Position Size</span>
                  <p className="text-white font-mono">
                    ${closeTarget.position_size_usdt?.toLocaleString(undefined, { maximumFractionDigits: 0 }) ?? '—'}
                  </p>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Unrealized PnL</span>
                  <p
                    className={`font-mono font-medium ${
                      (closeTarget.unrealized_pnl ?? 0) >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {(closeTarget.unrealized_pnl ?? 0) >= 0 ? '+' : ''}${closeTarget.unrealized_pnl?.toFixed(4) ?? '—'}
                    {closeTarget.unrealized_pnl_percent != null && (
                      <span className="ml-2 text-xs opacity-70">
                        ({closeTarget.unrealized_pnl_percent >= 0 ? '+' : ''}{closeTarget.unrealized_pnl_percent.toFixed(2)}%)
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-sm text-red-300 font-medium flex items-center gap-2">
                  <AlertTriangle size={14} />
                  This will cancel all open TP/SL orders and place a market close order on {closeTarget.exchange_type}.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 border-t border-dark-border flex gap-3 justify-end">
              <button
                onClick={() => setCloseTarget(null)}
                disabled={closing}
                className="px-4 py-2 bg-dark-elevated hover:bg-dark-surface text-gray-300 rounded-xl text-sm font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleClosePosition}
                disabled={closing}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50"
              >
                {closing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Closing...
                  </>
                ) : (
                  'Confirm Close'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveTradingPage;
