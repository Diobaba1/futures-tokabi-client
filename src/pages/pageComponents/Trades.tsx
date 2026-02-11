// src/pages/pageComponents/Trades.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../components/contexts/AuthContext';
import { tradeService } from '../../api/services';
import Pagination from '../../components/common/Pagination';
import {
  TradeDetailResponse,
  ExchangeHistoryResponse,
  ExchangeTrade,
} from '../../types/trades.types';
import {
  RefreshCw,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  AlertCircle,
  BarChart3,
  Activity,
  DollarSign,
  Target,
  Layers,
  History,
  Wallet,
  Award,
  Link2,
} from 'lucide-react';

// Tab types
type TabType = 'platform' | 'exchange';

const Trades: React.FC = () => {
  const { user } = useAuth();

  // Tab state
  const [activeTab, setActiveTab] = useState<TabType>('exchange');

  // Platform trades state
  const [platformTrades, setPlatformTrades] = useState<TradeDetailResponse[]>([]);
  const [platformLoading, setPlatformLoading] = useState(true);
  const [platformPage, setPlatformPage] = useState(1);
  const [platformPageSize, setPlatformPageSize] = useState(20);
  const [platformTotal, setPlatformTotal] = useState(0);
  const [platformTotalPages, setPlatformTotalPages] = useState(1);
  const [platformHasNext, setPlatformHasNext] = useState(false);
  const [platformHasPrev, setPlatformHasPrev] = useState(false);

  // Exchange history state
  const [exchangeData, setExchangeData] = useState<ExchangeHistoryResponse | null>(null);
  const [exchangeLoading, setExchangeLoading] = useState(true);
  const [exchangeError, setExchangeError] = useState<string | null>(null);

  // Common state
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  // Load platform trades
  const loadPlatformTrades = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setPlatformLoading(true);

    try {
      const params: any = { page: platformPage, page_size: platformPageSize };
      if (statusFilter) params.status = statusFilter;
      const data = await tradeService.getTrades(params);
      setPlatformTrades(data.items || []);
      setPlatformTotal(data.total || 0);
      setPlatformTotalPages(data.total_pages || 1);
      setPlatformHasNext(data.has_next || false);
      setPlatformHasPrev(data.has_prev || false);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to load platform trades:', error);
      setPlatformTrades([]);
    } finally {
      setPlatformLoading(false);
      setRefreshing(false);
    }
  }, [statusFilter, platformPage, platformPageSize]);

  // Load exchange history
  const loadExchangeHistory = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setExchangeLoading(true);
    setExchangeError(null);

    try {
      const data = await tradeService.getExchangeHistory({ limit: 200 });
      setExchangeData(data);
      setLastRefresh(new Date());
    } catch (error: any) {
      console.error('Failed to load exchange history:', error);
      const errorMsg = error?.response?.data?.detail || 'Failed to fetch exchange history. Please connect your exchange.';
      setExchangeError(errorMsg);
      setExchangeData(null);
    } finally {
      setExchangeLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (user) {
      if (activeTab === 'platform') {
        loadPlatformTrades();
      } else {
        loadExchangeHistory();
      }
    }
  }, [user, activeTab, loadPlatformTrades, loadExchangeHistory]);

  // Refresh handler
  const handleRefresh = async () => {
    if (activeTab === 'platform') {
      await loadPlatformTrades(true);
    } else {
      await loadExchangeHistory(true);
    }
  };

  // Filter platform trades
  const filteredPlatformTrades = useMemo(() => {
    return (platformTrades || []).filter(
      (trade) =>
        trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trade.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [platformTrades, searchTerm]);

  // Filter exchange trades
  const filteredExchangeTrades = useMemo(() => {
    if (!exchangeData?.trades) return [];
    return exchangeData.trades.filter(
      (trade) =>
        trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trade.order_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [exchangeData, searchTerm]);

  // Calculate stats for platform trades
  const platformStats = useMemo(() => {
    const trades = platformTrades || [];
    const total = trades.length;
    const open = trades.filter((t) => t.status?.toLowerCase() === 'open').length;
    const closed = trades.filter((t) => t.status?.toLowerCase() === 'closed').length;
    const totalPnl = trades.reduce((sum, t) => sum + (t.realized_pnl_usd || 0), 0);
    const winningTrades = trades.filter((t) => (t.realized_pnl_usd || 0) > 0).length;
    const winRate = closed > 0 ? (winningTrades / closed) * 100 : 0;

    return { total, open, closed, totalPnl, winRate };
  }, [platformTrades]);

  // Calculate stats for exchange trades
  const exchangeStats = useMemo(() => {
    if (!exchangeData) return { total: 0, totalPnl: 0, totalFees: 0, totalVolume: 0, winRate: 0 };

    const trades = exchangeData.trades || [];
    const total = trades.length;
    const totalPnl = exchangeData.summary?.total_pnl || 0;
    const totalFees = exchangeData.summary?.total_fees || 0;
    const totalVolume = exchangeData.summary?.total_volume || 0;
    const winningTrades = trades.filter((t) => t.realized_pnl > 0).length;
    const closedTrades = trades.filter((t) => t.realized_pnl !== 0).length;
    const winRate = closedTrades > 0 ? (winningTrades / closedTrades) * 100 : 0;

    return { total, totalPnl, totalFees, totalVolume, winRate };
  }, [exchangeData]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(price);

  const formatQuantity = (quantity: number) =>
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 8,
    }).format(quantity);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const getPnLColor = (pnl: number) => (pnl >= 0 ? 'text-emerald-400' : 'text-red-400');

  const isLoading = activeTab === 'platform' ? platformLoading : exchangeLoading;

  // Loading State
  if (isLoading && !refreshing) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-xl animate-pulse" />
            <div className="relative w-20 h-20 border-4 border-violet-500/30 border-t-violet-400 rounded-full animate-spin" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Loading Trade History</h3>
          <p className="text-gray-500">Fetching your trading data...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      {/* Hero Section */}
      <div className="relative overflow-hidden mb-8">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-cyan-500/5" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[100px] -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[80px] translate-y-1/2" />

        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="relative px-6 py-10 lg:py-14">
          <div className="max-w-6xl mx-auto">
            {/* Header Row */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 border border-violet-500/30 flex items-center justify-center"
                  >
                    <History className="w-6 h-6 text-violet-400" />
                  </motion.div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-white">Trade History</h1>
                    <p className="text-gray-500 text-sm">Monitor and analyze your trading performance</p>
                  </div>
                </div>
              </motion.div>

              {/* Controls */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-wrap items-center gap-3"
              >
                {/* Last Updated */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-400">
                    {lastRefresh?.toLocaleTimeString() || 'Never'}
                  </span>
                </div>

                {/* Refresh Button */}
                <motion.button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl text-white font-medium text-sm shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </motion.button>
              </motion.div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8">
              <button
                onClick={() => setActiveTab('exchange')}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all ${
                  activeTab === 'exchange'
                    ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/20'
                    : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Link2 className="w-4 h-4" />
                Exchange History
                {exchangeData && (
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs">
                    {exchangeData.total_trades}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('platform')}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all ${
                  activeTab === 'platform'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20'
                    : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Layers className="w-4 h-4" />
                Platform Trades
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs">
                  {platformTrades.length}
                </span>
              </button>
            </div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {activeTab === 'exchange' ? (
                <>
                  <StatCard
                    icon={Activity}
                    iconColor="text-violet-400"
                    iconBg="from-violet-500/20 to-purple-500/20"
                    title="Total Trades"
                    value={exchangeStats.total.toString()}
                  />
                  <StatCard
                    icon={DollarSign}
                    iconColor={getPnLColor(exchangeStats.totalPnl)}
                    iconBg={
                      exchangeStats.totalPnl >= 0
                        ? 'from-emerald-500/20 to-green-500/20'
                        : 'from-red-500/20 to-rose-500/20'
                    }
                    title="Total P&L"
                    value={formatCurrency(exchangeStats.totalPnl)}
                    valueColor={getPnLColor(exchangeStats.totalPnl)}
                  />
                  <StatCard
                    icon={Wallet}
                    iconColor="text-amber-400"
                    iconBg="from-amber-500/20 to-orange-500/20"
                    title="Total Volume"
                    value={formatCurrency(exchangeStats.totalVolume)}
                  />
                  <StatCard
                    icon={Award}
                    iconColor="text-cyan-400"
                    iconBg="from-cyan-500/20 to-blue-500/20"
                    title="Win Rate"
                    value={`${exchangeStats.winRate.toFixed(1)}%`}
                  />
                </>
              ) : (
                <>
                  <StatCard
                    icon={Activity}
                    iconColor="text-cyan-400"
                    iconBg="from-cyan-500/20 to-blue-500/20"
                    title="Total Trades"
                    value={platformStats.total.toString()}
                  />
                  <StatCard
                    icon={Target}
                    iconColor="text-emerald-400"
                    iconBg="from-emerald-500/20 to-green-500/20"
                    title="Open"
                    value={platformStats.open.toString()}
                  />
                  <StatCard
                    icon={DollarSign}
                    iconColor={getPnLColor(platformStats.totalPnl)}
                    iconBg={
                      platformStats.totalPnl >= 0
                        ? 'from-emerald-500/20 to-green-500/20'
                        : 'from-red-500/20 to-rose-500/20'
                    }
                    title="Total P&L"
                    value={formatCurrency(platformStats.totalPnl)}
                    valueColor={getPnLColor(platformStats.totalPnl)}
                  />
                  <StatCard
                    icon={Award}
                    iconColor="text-amber-400"
                    iconBg="from-amber-500/20 to-orange-500/20"
                    title="Win Rate"
                    value={`${platformStats.winRate.toFixed(1)}%`}
                  />
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-10">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row gap-4"
          >
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by symbol or order ID..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-900/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
              />
            </div>

            {/* Status Filter (Platform trades only) */}
            {activeTab === 'platform' && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 rounded-xl bg-gray-900/50 border border-white/10 text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
              >
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            )}

            {/* Exchange info badge */}
            {activeTab === 'exchange' && exchangeData && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
                <div
                  className={`w-2 h-2 rounded-full ${
                    exchangeData.is_testnet ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}
                />
                <span className="text-sm text-violet-400 capitalize">{exchangeData.exchange}</span>
                {exchangeData.is_testnet && (
                  <span className="text-xs text-amber-400">(Testnet)</span>
                )}
              </div>
            )}
          </motion.div>

          {/* Error State for Exchange */}
          {activeTab === 'exchange' && exchangeError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-center"
            >
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Unable to Fetch Exchange History</h3>
              <p className="text-red-400/80 mb-4">{exchangeError}</p>
              <motion.button
                onClick={() => loadExchangeHistory(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 hover:bg-red-500/30 transition-all"
              >
                Retry
              </motion.button>
            </motion.div>
          )}

          {/* Trades List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-white/5 overflow-hidden"
          >
            <div className="p-5 border-b border-white/5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-violet-400" />
                  {activeTab === 'exchange' ? 'Exchange Fills' : 'Platform Trades'}
                </h3>
                <span className="text-sm text-gray-500">
                  {activeTab === 'exchange'
                    ? `${filteredExchangeTrades.length} trades`
                    : `${filteredPlatformTrades.length} trades`}
                </span>
              </div>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'exchange' ? (
              <ExchangeTradesList
                trades={filteredExchangeTrades}
                formatCurrency={formatCurrency}
                formatPrice={formatPrice}
                formatQuantity={formatQuantity}
                formatDate={formatDate}
                getPnLColor={getPnLColor}
              />
            ) : (
              <>
                <PlatformTradesList
                  trades={filteredPlatformTrades}
                  formatCurrency={formatCurrency}
                  formatPrice={formatPrice}
                  formatQuantity={formatQuantity}
                  formatDate={formatDate}
                  getPnLColor={getPnLColor}
                />
                {platformTotal > 0 && (
                  <Pagination
                    page={platformPage}
                    pageSize={platformPageSize}
                    total={platformTotal}
                    totalPages={platformTotalPages}
                    hasNext={platformHasNext}
                    hasPrev={platformHasPrev}
                    onPageChange={setPlatformPage}
                    onPageSizeChange={(size) => { setPlatformPageSize(size); setPlatformPage(1); }}
                  />
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
interface StatCardProps {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  title: string;
  value: string;
  valueColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  iconColor,
  iconBg,
  title,
  value,
  valueColor = 'text-white',
}) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="p-4 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-white/5 hover:border-white/10 transition-all"
  >
    <div className="flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${iconBg} flex items-center justify-center`}
      >
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <p className={`text-lg font-bold ${valueColor}`}>{value}</p>
      </div>
    </div>
  </motion.div>
);

// Exchange Trades List Component
interface ExchangeTradesListProps {
  trades: ExchangeTrade[];
  formatCurrency: (amount: number) => string;
  formatPrice: (price: number) => string;
  formatQuantity: (qty: number) => string;
  formatDate: (date: string) => string;
  getPnLColor: (pnl: number) => string;
}

const ExchangeTradesList: React.FC<ExchangeTradesListProps> = ({
  trades,
  formatCurrency,
  formatPrice,
  formatQuantity,
  formatDate,
  getPnLColor,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (trades.length === 0) {
    return (
      <div className="text-center py-16">
        <History className="w-16 h-16 text-gray-700 mx-auto mb-4" />
        <h4 className="text-lg font-medium text-white mb-2">No Exchange Trades Found</h4>
        <p className="text-gray-500 text-sm">
          Your exchange trade history will appear here once you make trades.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-white/5">
      {trades.map((trade, index) => (
        <motion.div
          key={trade.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.02 }}
          className="p-4 hover:bg-white/5 transition-colors cursor-pointer"
          onClick={() => setExpandedId(expandedId === trade.id ? null : trade.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Side indicator */}
              <div
                className={`p-2 rounded-lg ${
                  trade.side === 'BUY'
                    ? 'bg-emerald-500/20 border border-emerald-500/30'
                    : 'bg-red-500/20 border border-red-500/30'
                }`}
              >
                {trade.side === 'BUY' ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-400" />
                )}
              </div>

              {/* Trade info */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{trade.symbol}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      trade.side === 'BUY'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {trade.side}
                  </span>
                  {trade.is_maker && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                      Maker
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                  <span>{formatQuantity(trade.quantity)} @ {formatPrice(trade.price)}</span>
                  <span>•</span>
                  <span>{formatDate(trade.time)}</span>
                </div>
              </div>
            </div>

            {/* P&L */}
            <div className="text-right">
              <p className={`font-semibold ${getPnLColor(trade.realized_pnl)}`}>
                {trade.realized_pnl >= 0 ? '+' : ''}
                {formatCurrency(trade.realized_pnl)}
              </p>
              <p className="text-xs text-gray-500">
                Vol: {formatCurrency(trade.quote_quantity)}
              </p>
            </div>
          </div>

          {/* Expanded details */}
          <AnimatePresence>
            {expandedId === trade.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">Order ID</p>
                    <p className="text-white font-mono text-xs">{trade.order_id}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Commission</p>
                    <p className="text-amber-400">
                      {formatPrice(trade.commission)} {trade.commission_asset}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Position Side</p>
                    <p className="text-white">{trade.position_side || 'BOTH'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Exchange</p>
                    <p className="text-violet-400 capitalize">{trade.exchange}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

// Platform Trades List Component
interface PlatformTradesListProps {
  trades: TradeDetailResponse[];
  formatCurrency: (amount: number) => string;
  formatPrice: (price: number) => string;
  formatQuantity: (qty: number) => string;
  formatDate: (date: string) => string;
  getPnLColor: (pnl: number) => string;
}

const PlatformTradesList: React.FC<PlatformTradesListProps> = ({
  trades,
  formatCurrency,
  formatPrice,
  formatQuantity,
  formatDate,
  getPnLColor,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'closed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (trades.length === 0) {
    return (
      <div className="text-center py-16">
        <Layers className="w-16 h-16 text-gray-700 mx-auto mb-4" />
        <h4 className="text-lg font-medium text-white mb-2">No Platform Trades Found</h4>
        <p className="text-gray-500 text-sm">
          Trades executed through our AI signals will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-white/5">
      {trades.map((trade, index) => (
        <motion.div
          key={trade.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.02 }}
          className="p-4 hover:bg-white/5 transition-colors cursor-pointer"
          onClick={() => setExpandedId(expandedId === trade.id ? null : trade.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Side indicator */}
              <div
                className={`p-2 rounded-lg ${
                  trade.side === 'long'
                    ? 'bg-emerald-500/20 border border-emerald-500/30'
                    : 'bg-red-500/20 border border-red-500/30'
                }`}
              >
                {trade.side === 'long' ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-400" />
                )}
              </div>

              {/* Trade info */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{trade.symbol}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      trade.side === 'long'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {trade.side.toUpperCase()}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(
                      trade.status
                    )}`}
                  >
                    {trade.status?.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                  <span>
                    {trade.quantity ? formatQuantity(trade.quantity) : 'N/A'} @{' '}
                    {trade.entry_price ? formatPrice(trade.entry_price) : 'N/A'}
                  </span>
                  <span>•</span>
                  <span>{formatDate(trade.created_at)}</span>
                </div>
              </div>
            </div>

            {/* P&L */}
            <div className="text-right">
              <p className={`font-semibold ${getPnLColor(trade.realized_pnl_usd || 0)}`}>
                {(trade.realized_pnl_usd || 0) >= 0 ? '+' : ''}
                {formatCurrency(trade.realized_pnl_usd || 0)}
              </p>
              {trade.realized_pnl_percent !== undefined && (
                <p
                  className={`text-xs ${getPnLColor(trade.realized_pnl_percent)}`}
                >
                  {trade.realized_pnl_percent >= 0 ? '+' : ''}
                  {trade.realized_pnl_percent.toFixed(2)}%
                </p>
              )}
            </div>
          </div>

          {/* Expanded details */}
          <AnimatePresence>
            {expandedId === trade.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">Leverage</p>
                    <p className="text-cyan-400">{trade.leverage}x</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Take Profit</p>
                    <p className="text-emerald-400">
                      {trade.take_profit_price ? formatPrice(trade.take_profit_price) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Stop Loss</p>
                    <p className="text-red-400">
                      {trade.stop_loss_price ? formatPrice(trade.stop_loss_price) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Exit Reason</p>
                    <p className="text-white">{trade.exit_reason || 'N/A'}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

export default Trades;
