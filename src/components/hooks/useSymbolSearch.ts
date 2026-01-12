// FILE: src/hooks/useSymbolSearch.ts
import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
  SymbolSearchState,
  UserSymbolSearchRequest,
  SearchHistoryItem
} from '../../types/userSymbolSearch.types';
import { userSymbolSearchService } from '../../api/services/userSymbolSearchService';

export const useSymbolSearch = () => {
  const [state, setState] = useState<SymbolSearchState>({
    symbols: [],
    isLoading: false,
    error: null,
    currentSearch: null,
    searchHistory: [],
    rateLimit: null,
    selectedSearchDetail: null,
    viewMode: 'search', // 'search' | 'history' | 'detail'
  });

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const fetchSearchHistory = useCallback(async (limit: number = 10) => {
    try {
      const history = await userSymbolSearchService.getSearchHistory(limit);
      setState((prev) => ({
        ...prev,
        searchHistory: history.search_history || [],
      }));
    } catch (error: any) {
      console.error('Failed to fetch search history:', error);
      // Don't throw - just log and continue with empty history
      setState((prev) => ({
        ...prev,
        searchHistory: [],
      }));
    }
  }, []);

  const fetchRateLimit = useCallback(async () => {
    try {
      const rateLimit = await userSymbolSearchService.getRateLimit();
      setState((prev) => ({
        ...prev,
        rateLimit,
      }));
    } catch (error: any) {
      console.error('Failed to fetch rate limit:', error);
      // Don't throw - set default rate limit
      setState((prev) => ({
        ...prev,
        rateLimit: {
          searches_remaining: 2,
          reset_time: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
          limit_per_4h: 2
        },
      }));
    }
  }, []);

  const fetchSearchDetail = useCallback(async (searchId: string) => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null
    }));
   
    try {
      const detail = await userSymbolSearchService.getSearchDetail(searchId);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        selectedSearchDetail: detail,
        error: null,
        viewMode: 'detail',
      }));
      return detail;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message,
        selectedSearchDetail: null,
      }));
      throw error;
    }
  }, []);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  // Memoize hasPendingResults to avoid unnecessary re-runs
  const hasPendingResults = useMemo(() => {
    return (
      state.currentSearch?.analysis_results?.some(
        (result) => result.status === 'pending'
      ) ||
      state.selectedSearchDetail?.analysis_results?.some(
        (result) => result.status === 'pending'
      )
    );
  }, [
    state.currentSearch?.analysis_results,
    state.selectedSearchDetail?.analysis_results,
  ]);

  // Poll for updated results when we have pending analyses
  useEffect(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }
    if (hasPendingResults) {
      pollingRef.current = setInterval(async () => {
        try {
          // Refresh current detail if viewing one
          if (state.selectedSearchDetail) {
            await fetchSearchDetail(state.selectedSearchDetail.search_id);
          }
          // Refresh history to get updates
          await fetchSearchHistory(10);
        } catch (error) {
          console.error('Failed to poll for results:', error);
        }
      }, 3000); // Poll every 3 seconds for better UX
    }
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [hasPendingResults, state.selectedSearchDetail, fetchSearchDetail, fetchSearchHistory]);

  const analyzeSymbols = useCallback(async (symbols: string[]) => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      viewMode: 'search'
    }));
   
    try {
      const request: UserSymbolSearchRequest = { symbols };
      const response = await userSymbolSearchService.analyzeSymbols(request);
     
      setState((prev) => ({
        ...prev,
        isLoading: false,
        currentSearch: response,
        symbols: [],
        error: null,
        selectedSearchDetail: null,
      }));
      await Promise.all([fetchSearchHistory(10), fetchRateLimit()]);
      return response;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
      throw error;
    }
  }, [fetchSearchHistory, fetchRateLimit]);

  const selectSearchFromHistory = useCallback(async (search: SearchHistoryItem) => {
    try {
      await fetchSearchDetail(search.id);
    } catch (error) {
      console.error('Failed to fetch search details:', error);
      throw error;
    }
  }, [fetchSearchDetail]);

  const navigateToHistory = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedSearchDetail: null,
      viewMode: 'history'
    }));
  }, []);

  const navigateToSearch = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedSearchDetail: null,
      currentSearch: null,
      viewMode: 'search'
    }));
  }, []);

  const addSymbol = useCallback((symbol: string) => {
    const normalizedSymbol = symbol.toUpperCase().trim();
    if (!normalizedSymbol) return;
    setState((prev) => {
      if (prev.symbols.includes(normalizedSymbol)) {
        return {
          ...prev,
          error: 'Symbol already added',
          viewMode: 'search'
        };
      }
      if (prev.symbols.length >= 5) { // Increased limit for better UX
        return {
          ...prev,
          error: 'Maximum 5 symbols allowed',
          viewMode: 'search'
        };
      }
      return {
        ...prev,
        symbols: [...prev.symbols, normalizedSymbol],
        error: null,
        viewMode: 'search',
      };
    });
  }, []);

  const removeSymbol = useCallback((symbol: string) => {
    setState((prev) => ({
      ...prev,
      symbols: prev.symbols.filter((s) => s !== symbol),
      error: null,
    }));
  }, []);

  const clearAllSymbols = useCallback(() => {
    setState((prev) => ({
      ...prev,
      symbols: [],
      error: null,
    }));
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const clearCurrentSearch = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentSearch: null,
      selectedSearchDetail: null,
      viewMode: 'search',
    }));
  }, []);

  return {
    ...state,
    analyzeSymbols,
    fetchSearchHistory,
    fetchRateLimit,
    fetchSearchDetail,
    selectSearchFromHistory,
    navigateToHistory,
    navigateToSearch,
    addSymbol,
    removeSymbol,
    clearAllSymbols,
    clearError,
    clearCurrentSearch,
  };
};