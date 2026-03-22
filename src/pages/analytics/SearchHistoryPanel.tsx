// FILE: src/components/SearchHistoryPanel.tsx
import React, { useState, useMemo } from 'react';
import {
  HistoryIcon,
  EyeIcon,
  RefreshCwIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  SearchIcon,
  FilterIcon,
  CalendarIcon,
  DownloadIcon,
  ShareIcon,
  ChevronDownIcon,
} from 'lucide-react';
import { SearchHistoryItem } from '../../types/userSymbolSearch.types';

interface SearchHistoryPanelProps {
  history: SearchHistoryItem[];
  onRefresh: () => void;
  onSearchSelect: (search: SearchHistoryItem) => void;
  isLoading?: boolean;
}

type FilterType = 'all' | 'completed' | 'processing' | 'failed';
type SortType = 'newest' | 'oldest' | 'symbols';

export const SearchHistoryPanel: React.FC<SearchHistoryPanelProps> = ({
  history,
  onRefresh,
  onSearchSelect,
  isLoading = false,
}) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const getStatusStats = (search: SearchHistoryItem) => {
    if (!search.analysis_results) return { success: 0, pending: 0, error: 0, total: 0 };
    
    return {
      success: search.analysis_results.filter(r => r.status === 'success').length,
      pending: search.analysis_results.filter(r => r.status === 'pending').length,
      error: search.analysis_results.filter(r => r.status === 'error').length,
      total: search.analysis_results.length
    };
  };

  const getStatusIcon = (search: SearchHistoryItem) => {
    const stats = getStatusStats(search);
    
    if (stats.pending > 0) {
      return <ClockIcon className="w-4 h-4 text-amber-400" />;
    }
    if (stats.error === stats.total) {
      return <XCircleIcon className="w-4 h-4 text-red-400" />;
    }
    if (stats.success === stats.total) {
      return <CheckCircleIcon className="w-4 h-4 text-emerald-400" />;
    }
    return <CheckCircleIcon className="w-4 h-4 text-emerald-400" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const getStatusText = (search: SearchHistoryItem) => {
    const stats = getStatusStats(search);
    
    if (stats.pending > 0) {
      return `${stats.pending} processing`;
    }
    if (stats.error > 0 && stats.success > 0) {
      return `${stats.success}/${stats.total} completed`;
    }
    if (stats.error === stats.total) {
      return 'All failed';
    }
    return 'Completed';
  };

  const getStatusColor = (search: SearchHistoryItem) => {
    const stats = getStatusStats(search);
    
    if (stats.pending > 0) {
      return 'border-l-amber-500';
    }
    if (stats.error === stats.total) {
      return 'border-l-red-500';
    }
    if (stats.success === stats.total) {
      return 'border-l-emerald-500';
    }
    return 'border-l-emerald-400';
  };

  const getStatusBadgeColor = (search: SearchHistoryItem) => {
    const stats = getStatusStats(search);
    
    if (stats.pending > 0) {
      return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    }
    if (stats.error === stats.total) {
      return 'bg-red-500/20 text-red-300 border-red-500/30';
    }
    if (stats.success === stats.total) {
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    }
    return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  };

  // Memoized filter and sort logic
  const filteredAndSortedHistory = useMemo(() => 
    history
      .filter(search => {
        const stats = getStatusStats(search);
        if (filter === 'completed' && (stats.pending > 0 || stats.error > 0)) return false;
        if (filter === 'processing' && stats.pending === 0) return false;
        if (filter === 'failed' && stats.error === 0) return false;
        
        if (searchTerm && !search.symbols.some(symbol => 
          symbol.toLowerCase().includes(searchTerm.toLowerCase())
        )) return false;
        
        return true;
      })
      .sort((a, b) => {
        switch (sort) {
          case 'oldest':
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          case 'symbols':
            return a.symbols[0].localeCompare(b.symbols[0]);
          case 'newest':
          default:
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
      }),
    [history, filter, sort, searchTerm]
  );

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center mb-5 backdrop-blur-sm">
          <HistoryIcon className="w-10 h-10 text-blue-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-3">
          No search history yet
        </h3>
        <p className="text-gray-400 max-w-sm text-lg">
          Your symbol analysis searches will appear here once you start analyzing symbols.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Search History
          </h2>
          <p className="text-gray-400 mt-2">
            {filteredAndSortedHistory.length} of {history.length} search{history.length !== 1 ? 'es' : ''}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative">
            <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search symbols..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-dark-elevated border border-dark-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all duration-200"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-dark-elevated border border-dark-border rounded-lg hover:bg-gray-750 text-white transition-colors duration-200"
            >
              <FilterIcon className="w-4 h-4" />
              <span className="capitalize">{filter}</span>
              <ChevronDownIcon className="w-4 h-4" />
            </button>
            
            {isFilterOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-dark-elevated border border-dark-border rounded-lg shadow-lg z-10 backdrop-blur-sm">
                {(['all', 'completed', 'processing', 'failed'] as FilterType[]).map((filterOption) => (
                  <button
                    key={filterOption}
                    onClick={() => {
                      setFilter(filterOption);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 capitalize hover:bg-gray-750 transition-colors duration-150 ${
                      filter === filterOption ? 'text-blue-400 bg-blue-500/20' : 'text-white'
                    }`}
                  >
                    {filterOption}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortType)}
            className="px-4 py-2 bg-dark-elevated border border-dark-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition-all duration-200"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="symbols">By Symbol</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 text-blue-400 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/10"
          >
            <RefreshCwIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Search List */}
      <div className="space-y-3">
        {filteredAndSortedHistory.map((search) => {
          const stats = getStatusStats(search);
          const isProcessing = stats.pending > 0;
          const statusColor = getStatusColor(search);
          const statusBadgeColor = getStatusBadgeColor(search);
          
          return (
            <div
              key={search.id}
              className={`bg-dark-elevated backdrop-blur-sm border border-dark-border rounded-xl p-6 hover:shadow-xl transition-all duration-300 border-l-4 ${statusColor} group hover:bg-dark-elevated/70 hover:border-gray-600`}
            >
              <div className="flex items-start justify-between">
                {/* Left Content */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <HistoryIcon className="w-6 h-6 text-blue-400" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {/* Symbols and Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-white truncate">
                        {search.symbols.join(', ')}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {search.search_count} symbol{search.search_count !== 1 ? 's' : ''}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusBadgeColor}`}>
                          {getStatusIcon(search)}
                          {getStatusText(search)}
                        </span>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm">
                      <div className="flex items-center gap-1 text-gray-400">
                        <CalendarIcon className="w-4 h-4" />
                        {formatDate(search.created_at)}
                      </div>
                      
                      {/* Results Summary */}
                      {search.analysis_results && search.analysis_results.length > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                          <span className="text-gray-400">
                            {stats.success} successful
                            {stats.error > 0 && ` • ${stats.error} failed`}
                            {stats.pending > 0 && ` • ${stats.pending} processing`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex-shrink-0 ml-4 flex items-center gap-2">
                  <button
                    onClick={() => onSearchSelect(search)}
                    disabled={!search.has_results || isProcessing}
                    className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      !search.has_results || isProcessing
                        ? 'text-gray-500 bg-dark-surface cursor-not-allowed'
                        : 'text-blue-400 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10'
                    }`}
                  >
                    <EyeIcon className="w-4 h-4" />
                    View Details
                  </button>
                  
                  {/* Additional actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-dark-surface rounded-lg transition-all duration-200">
                      <DownloadIcon className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-dark-surface rounded-lg transition-all duration-200">
                      <ShareIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress Bar for Processing Items */}
              {isProcessing && (
                <div className="mt-4 pt-4 border-t border-dark-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">
                      Processing symbols...
                    </span>
                    <span className="text-sm text-gray-400">
                      {stats.success + stats.error}/{stats.total}
                    </span>
                  </div>
                  <div className="w-full bg-dark-surface rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out shadow-lg shadow-blue-500/25"
                      style={{ 
                        width: `${((stats.success + stats.error) / stats.total) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State for Filters */}
      {filteredAndSortedHistory.length === 0 && (
        <div className="text-center py-12">
          <FilterIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No results found</h3>
          <p className="text-gray-400">
            Try adjusting your filters or search term to see more results.
          </p>
        </div>
      )}
    </div>
  );
};