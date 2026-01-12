// FILE: src/components/SymbolSearchPage.tsx
import React, { useState, useEffect } from 'react';
import {
  SearchIcon,
  PlusIcon,
  XIcon,
  HistoryIcon,
//   TrendingUpIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  InfoIcon,
  ArrowLeftIcon,
  BarChart3Icon,
  DownloadIcon,
  ShareIcon,
//   SparklesIcon,
} from 'lucide-react';
import { useSymbolSearch } from '../../components/hooks/useSymbolSearch';
import { SymbolAnalysisCard } from './SymbolAnalysisCard';
import { SearchHistoryPanel } from './SearchHistoryPanel';

// Enhanced TabPanel with better accessibility
function TabPanel(props: { children?: React.ReactNode; value: number; index: number }) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`symbol-search-tabpanel-${index}`}
      aria-labelledby={`symbol-search-tab-${index}`}
      className="p-6"
      {...other}
    >
      {value === index && children}
    </div>
  );
}

export const SymbolSearchPage: React.FC = () => {
  const [inputSymbol, setInputSymbol] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const {
    symbols,
    isLoading,
    error,
    currentSearch,
    searchHistory,
    rateLimit,
    selectedSearchDetail,
    viewMode,
    analyzeSymbols,
    fetchSearchHistory,
    fetchRateLimit,
    addSymbol,
    removeSymbol,
    clearAllSymbols,
    clearError,
    clearCurrentSearch,
    selectSearchFromHistory,
    navigateToHistory,
    // navigateToSearch,
  } = useSymbolSearch();

  useEffect(() => {
    fetchSearchHistory();
    fetchRateLimit();
  }, [fetchSearchHistory, fetchRateLimit]);

  // Reset expanded cards when new analysis comes in
  useEffect(() => {
    if (currentSearch?.analysis_results) {
      setExpandedCards(new Set());
    }
  }, [currentSearch]);

  const handleAddSymbol = () => {
    if (inputSymbol.trim()) {
      addSymbol(inputSymbol.toUpperCase());
      setInputSymbol('');
    }
  };

  const handleAnalyze = async () => {
    if (symbols.length === 0) return;
    
    try {
      await analyzeSymbols(symbols);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleAddSymbol();
    }
  };

  const handleSearchSelect = async (search: any) => {
    try {
      await selectSearchFromHistory(search);
    } catch (error) {
      console.error('Failed to load search details:', error);
    }
  };

  const handleToggleCard = (symbol: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(symbol)) {
        newSet.delete(symbol);
      } else {
        newSet.add(symbol);
      }
      return newSet;
    });
  };

  const formatResetTime = (resetTime: string) => {
    return new Date(resetTime).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Render detailed view when a search is selected
  if (viewMode === 'detail' && selectedSearchDetail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={navigateToHistory}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 rounded-lg transition-all duration-200 mb-4 backdrop-blur-sm hover:shadow-lg"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to History
            </button>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">
                    Analysis Details
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>Symbols: {selectedSearchDetail.symbols.join(', ')}</span>
                    <span>•</span>
                    <span>Created: {new Date(selectedSearchDetail.created_at).toLocaleString()}</span>
                    <span>•</span>
                    <span>Search ID: {selectedSearchDetail.search_id}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="inline-flex items-center gap-2 px-4 py-2 text-gray-300 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600 rounded-lg transition-all duration-200 hover:shadow-lg">
                    <DownloadIcon className="w-4 h-4" />
                    Export
                  </button>
                  <button className="inline-flex items-center gap-2 px-4 py-2 text-gray-300 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600 rounded-lg transition-all duration-200 hover:shadow-lg">
                    <ShareIcon className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Results */}
          <div className="space-y-6">
            {selectedSearchDetail.analysis_results?.map((result, index) => (
              <SymbolAnalysisCard
                key={`${result.symbol}-${index}`}
                analysis={result}
                expanded={expandedCards.has(result.symbol)}
                onToggleExpand={() => handleToggleCard(result.symbol)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Main view (search or history)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        

        {/* Rate Limit Info */}
        {rateLimit && (
          <div className="mb-6">
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/30 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <ClockIcon className="w-4 h-4 text-blue-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-300">
                      {rateLimit.searches_remaining} search{rateLimit.searches_remaining !== 1 ? 'es' : ''} remaining
                    </p>
                    <p className="text-xs text-blue-400">
                      Resets at {formatResetTime(rateLimit.reset_time)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={fetchRateLimit}
                  className="text-blue-300 hover:text-blue-200 text-sm font-medium transition-colors duration-200"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6">
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircleIcon className="w-5 h-5 text-red-400" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
                <button
                  onClick={clearError}
                  className="text-red-400 hover:text-red-300 transition-colors duration-200"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Notification */}
        {showSuccess && (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
            <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-4 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
                <p className="text-sm font-medium text-emerald-300">
                  Analysis started successfully!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 mb-8">
          {/* Tabs */}
          <div className="border-b border-gray-700">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab(0)}
                className={`flex items-center gap-2 py-4 border-b-2 font-medium text-sm transition-all duration-200 ${
                  activeTab === 0
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <SearchIcon className="w-4 h-4" />
                New Analysis
              </button>
              <button
                onClick={() => {
                  setActiveTab(1);
                  fetchSearchHistory();
                }}
                className={`flex items-center gap-2 py-4 border-b-2 font-medium text-sm transition-all duration-200 ${
                  activeTab === 1
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <HistoryIcon className="w-4 h-4" />
                Search History
                {searchHistory.length > 0 && (
                  <span className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full text-xs">
                    {searchHistory.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Tab Panels */}
          <TabPanel value={activeTab} index={0}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Symbol Input */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    Add Symbols (Max 2 assets/4hrs)
                  </label>
                  
                  {/* Input Group */}
                  <div className="flex gap-3 mb-4">
                    <input
                      type="text"
                      placeholder="Enter symbol (e.g., BTCUSDT, ETHUSDT)"
                      value={inputSymbol}
                      onChange={(e) => setInputSymbol(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isLoading || symbols.length >= 5}
                      className="flex-1 px-4 py-3 border border-gray-600 rounded-xl bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm transition-all duration-200"
                    />
                    <button
                      onClick={handleAddSymbol}
                      disabled={isLoading || symbols.length >= 5 || !inputSymbol.trim()}
                      className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed flex items-center gap-2 hover:shadow-lg hover:shadow-blue-500/20"
                    >
                      <PlusIcon className="w-4 h-4" />
                      Add
                    </button>
                  </div>

                  {/* Selected Symbols */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {symbols.map((symbol) => (
                      <div
                        key={symbol}
                        className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-3 py-2 rounded-lg border border-blue-500/30 backdrop-blur-sm"
                      >
                        <span className="text-sm font-medium">{symbol}</span>
                        <button
                          onClick={() => removeSymbol(symbol)}
                          disabled={isLoading}
                          className="text-blue-400 hover:text-blue-300 transition-colors duration-200 disabled:opacity-50"
                        >
                          <XIcon className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {symbols.length > 0 && (
                      <button
                        onClick={clearAllSymbols}
                        className="text-sm text-gray-400 hover:text-gray-300 underline transition-colors duration-200"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  {/* Analyze Button */}
                  <button
                    onClick={handleAnalyze}
                    disabled={isLoading || symbols.length === 0}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-700 disabled:to-gray-800 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-2xl hover:shadow-2xl hover:shadow-blue-500/30 disabled:shadow-none backdrop-blur-sm"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <BarChart3Icon className="w-5 h-5" />
                        Analyze {symbols.length} Symbol{symbols.length !== 1 ? 's' : ''}
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column - Instructions */}
              <div>
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <InfoIcon className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      How to Use
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-gray-400">
                        Enter cryptocurrency symbols in the format: <strong className="text-white">BTCUSDT</strong>, <strong className="text-white">ETHUSDT</strong>
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-gray-400">
                        Maximum <strong className="text-white">5 symbols</strong> per analysis
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-gray-400">
                        Limited to <strong className="text-white">2 analyses</strong> per 4-hour window
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-gray-400">
                        Analysis includes: <strong className="text-white">Technical signals</strong>, <strong className="text-white">Risk metrics</strong>, <strong className="text-white">Leverage recommendations</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <SearchHistoryPanel 
              history={searchHistory}
              onRefresh={fetchSearchHistory}
              onSearchSelect={handleSearchSelect}
              isLoading={isLoading}
            />
          </TabPanel>
        </div>

        {/* Current Search Results */}
        {currentSearch && viewMode === 'search' && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Analysis Results
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const allSymbols = currentSearch.analysis_results?.map(r => r.symbol) || [];
                    setExpandedCards(new Set(allSymbols));
                  }}
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Expand All
                </button>
                <button
                  onClick={() => setExpandedCards(new Set())}
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Collapse All
                </button>
                <button
                  onClick={clearCurrentSearch}
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm font-medium"
                >
                  Clear Results
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {currentSearch.analysis_results?.map((result, index) => (
                <div key={`${result.symbol}-${index}`}>
                  <SymbolAnalysisCard 
                    analysis={result}
                    expanded={expandedCards.has(result.symbol)}
                    onToggleExpand={() => handleToggleCard(result.symbol)}
                  />
                </div>
              ))}

              {currentSearch.analysis_results?.length === 0 && (
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <ClockIcon className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-blue-300 font-medium">
                        Analysis in progress...
                      </p>
                      <p className="text-blue-400 text-sm mt-1">
                        Results will appear here when complete.
                        {currentSearch.celery_task_id && (
                          <span className="block mt-1 font-mono text-xs text-blue-300">
                            Task ID: {currentSearch.celery_task_id}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};