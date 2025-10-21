// src/pages/Trades.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../components/contexts/AuthContext';
import { tradeService } from '../../api/services';
import { TradeDetailResponse, TradeListResponse } from '../../types/trades.types';

const Trades: React.FC = () => {
  const { user } = useAuth();
  const [trades, setTrades] = useState<TradeDetailResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadTrades = useCallback(async (isRefresh = false) => {
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
      console.error('Failed to load trades:', error);
      setError('Failed to load trades. Please try again.');
      setTrades([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [status]);

  useEffect(() => {
    if (user) {
      loadTrades();
    }
  }, [user, loadTrades]);

  const filteredTrades = (trades || []).filter(trade =>
    trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trade.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'closed': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'cancelled': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getSideColor = (side: 'long' | 'short') => {
    return side === 'long' 
      ? 'text-green-400 bg-green-400/10 border-green-400/20' 
      : 'text-red-400 bg-red-400/10 border-red-400/20';
  };

  const getPnlColor = (pnl: number) => {
    return pnl >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    }).format(price);
  };

  const formatQuantity = (quantity: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 8
    }).format(quantity);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your trades...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Trade History</h1>
          <p className="text-gray-400">Monitor and analyze your trading performance</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <motion.button
            onClick={() => loadTrades(true)}
            disabled={refreshing}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-xl hover:bg-gray-700/50 hover:text-white transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
          >
            {refreshing ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </motion.button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search Trades
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by symbol or trade ID..."
                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all duration-200"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Filter by Status
            </label>
            <select
              value={status || ''}
              onChange={(e) => setStatus(e.target.value || undefined)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all duration-200"
            >
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-white mb-1">{(trades || []).length}</div>
          <div className="text-gray-400 text-sm">Total Trades</div>
        </div>
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-green-400 mb-1">
            {(trades || []).filter(t => t.status.toLowerCase() === 'open').length}
          </div>
          <div className="text-gray-400 text-sm">Open Trades</div>
        </div>
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-400 mb-1">
            {(trades || []).filter(t => t.status.toLowerCase() === 'closed').length}
          </div>
          <div className="text-gray-400 text-sm">Closed Trades</div>
        </div>
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400 mb-1">
            {formatCurrency((trades || []).reduce((sum, trade) => sum + (trade.realized_pnl_usd || 0), 0))}
          </div>
          <div className="text-gray-400 text-sm">Total P&L</div>
        </div>
      </div>

      {/* Trades Table */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl backdrop-blur-sm overflow-hidden">
        <div className="p-6 border-b border-gray-700/50">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <svg className="w-6 h-6 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Trade History ({filteredTrades.length})
          </h2>
        </div>

        {filteredTrades.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-lg mb-2">No trades found</p>
            <p className="text-sm">Your trades will appear here once you start trading</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Symbol</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Side</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Status</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Quantity</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Entry Price</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">P&L</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Created</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredTrades.map((trade, index) => (
                    <motion.tr
                      key={trade.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors duration-150"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {trade.symbol.substring(0, 2)}
                            </span>
                          </div>
                          <div>
                            <div className="text-white font-semibold">{trade.symbol}</div>
                            <div className="text-gray-400 text-xs">{trade.id.slice(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSideColor(trade.side)}`}>
                          {trade.side.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(trade.status)}`}>
                          {trade.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-white font-medium">
                        {trade.quantity ? formatQuantity(trade.quantity) : 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-white">
                        {trade.entry_price ? formatPrice(trade.entry_price) : 'N/A'}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`font-bold ${getPnlColor(trade.realized_pnl_usd || 0)}`}>
                          {formatCurrency(trade.realized_pnl_usd || 0)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-400 text-sm">
                        {formatDate(trade.created_at)}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Trades;