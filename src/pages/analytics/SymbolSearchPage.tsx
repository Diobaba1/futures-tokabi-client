// ============================================================================
// FILE: src/pages/analytics/SymbolSearchPage.tsx
// Chat-like symbol search page with real-time WebSocket updates
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  ArrowLeftIcon,
  DownloadIcon,
  ShareIcon,
  MessageSquareIcon,
  HistoryIcon,
} from 'lucide-react';
import { ChatContainer } from '../../components/chat';
import { useSymbolSearch } from '../../components/hooks/useSymbolSearch';
import { SymbolAnalysisCard } from './SymbolAnalysisCard';
import { SearchHistoryPanel } from './SearchHistoryPanel';

type ViewMode = 'chat' | 'history' | 'detail';

export const SymbolSearchPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('chat');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const {
    isLoading,
    searchHistory,
    selectedSearchDetail,
    viewMode: hookViewMode,
    fetchSearchHistory,
    fetchSearchDetail,
    selectSearchFromHistory,
    navigateToHistory,
  } = useSymbolSearch();

  // Fetch search history on mount
  useEffect(() => {
    fetchSearchHistory();
  }, [fetchSearchHistory]);

  // Sync with hook's view mode when viewing details
  useEffect(() => {
    if (hookViewMode === 'detail' && selectedSearchDetail) {
      setViewMode('detail');
    }
  }, [hookViewMode, selectedSearchDetail]);

  const handleViewHistory = () => {
    fetchSearchHistory();
    setViewMode('history');
  };

  const handleBackToChat = () => {
    setViewMode('chat');
  };

  const handleSearchSelect = async (search: any) => {
    try {
      await selectSearchFromHistory(search);
      setViewMode('detail');
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

  // Detailed view when a search is selected from history
  if (viewMode === 'detail' && selectedSearchDetail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => setViewMode('history')}
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
                    <span>
                      Symbols: {selectedSearchDetail.symbols.join(', ')}
                    </span>
                    <span>.</span>
                    <span>
                      Created:{' '}
                      {new Date(
                        selectedSearchDetail.created_at
                      ).toLocaleString()}
                    </span>
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

  // History view
  if (viewMode === 'history') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={handleBackToChat}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 rounded-lg transition-all duration-200 mb-4 backdrop-blur-sm hover:shadow-lg"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Chat
            </button>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                  <HistoryIcon className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Search History
                  </h1>
                  <p className="text-gray-400">
                    View your previous symbol analyses
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* History Panel */}
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 p-6">
            <SearchHistoryPanel
              history={searchHistory}
              onRefresh={fetchSearchHistory}
              onSearchSelect={handleSearchSelect}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    );
  }

  // Main chat view (default)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <ChatContainer
          onViewHistory={handleViewHistory}
          searchHistory={searchHistory}
        />
      </div>
    </div>
  );
};
