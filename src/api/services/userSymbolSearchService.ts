// FILE: src/services/userSymbolSearchService.ts
import {
  UserSymbolSearchRequest,
  UserSymbolSearchResponse,
  SearchHistoryResponse,
  RateLimitInfo,
  SymbolAnalysisResult,
  AnalysisStatus,
  UserSymbolSearchDetail
} from '../../types/userSymbolSearch.types';

import axiosInstance from '../axiosConfig';
import { API_ENDPOINTS } from '../endpoints';

/**
 * Transform API response to frontend expected structure.
 * The API returns data in a nested `signal` object, but frontend expects
 * `final_decision`, `risk_metrics`, `market_data_summary`, etc.
 */
function transformAnalysisResult(apiResult: any): SymbolAnalysisResult {
  // If already in expected format or is an error/pending, return as-is with minimal transform
  if (!apiResult.signal && apiResult.status !== 'success') {
    return {
      symbol: apiResult.symbol,
      status: apiResult.status || 'pending',
      error: apiResult.error,
      timestamp: apiResult.timestamp || apiResult.created_at || new Date().toISOString(),
    };
  }

  const signal = apiResult.signal || {};
  const marketData = signal.market_data || {};
  const indicators = signal.indicators || marketData.indicators || {};

  return {
    symbol: apiResult.symbol || signal.symbol,
    status: apiResult.status as AnalysisStatus,
    final_decision: signal.decision || null,
    consensus_strength: signal.consensus_strength || null,
    risk_metrics: signal.entry_price ? {
      entry_price: signal.entry_price || null,
      stop_loss_price: signal.stop_loss_price || null,
      take_profit_price: signal.take_profit_price || null,
      estimated_sl_percent: signal.stop_loss_percent || null,
      estimated_tp_percent: signal.take_profit_percent || null,
      risk_reward_ratio: signal.risk_reward_ratio || null,
      suggested_leverage: signal.suggested_leverage || null,
    } : null,
    market_data_summary: {
      current_price: signal.current_price || marketData.current_price || 0,
      price_change_24h: marketData.price_change_24h || marketData.priceChangePercent || 0,
      volume_24h: marketData.volume_24h || marketData.volume || 0,
      high_24h: marketData.high_24h || marketData.highPrice,
      low_24h: marketData.low_24h || marketData.lowPrice,
    },
    indicators_summary: indicators.rsi ? {
      rsi: indicators.rsi || 0,
      macd: indicators.macd || 0,
      signal_line: indicators.signal_line || indicators.macd_signal || 0,
      atr: indicators.atr || 0,
      trend: indicators.trend || 'neutral',
    } : undefined,
    error: apiResult.error,
    timestamp: apiResult.timestamp || signal.created_at || new Date().toISOString(),
  };
}

/**
 * Transform array of API results to frontend format
 */
function transformAnalysisResults(apiResults: any[] | null): SymbolAnalysisResult[] {
  if (!apiResults || !Array.isArray(apiResults)) {
    return [];
  }
  return apiResults.map(transformAnalysisResult);
}

class UserSymbolSearchService {
  async analyzeSymbols(request: UserSymbolSearchRequest): Promise<UserSymbolSearchResponse> {
    try {
      const response = await axiosInstance.post<any>(
        API_ENDPOINTS.USER_SEARCH_SYMBOL.ANALYZE,
        request
      );
      const data = response.data;
      // Transform analysis_results if present
      return {
        ...data,
        analysis_results: transformAnalysisResults(data.analysis_results),
      };
    } catch (error: any) {
      if (error.response?.status === 429) {
        const detail = error.response.data.detail;
        throw new Error(
          `Rate limit exceeded. ${detail.searches_remaining} searches remaining. ` +
          `Resets at ${new Date(detail.reset_time).toLocaleTimeString()}`
        );
      }
      throw new Error(error.response?.data?.detail || 'Failed to analyze symbols');
    }
  }

  async getSearchDetail(searchId: string): Promise<UserSymbolSearchDetail> {
    try {
      const response = await axiosInstance.get<any>(
        API_ENDPOINTS.USER_SEARCH_SYMBOL.DETAIL(searchId)
      );
      const data = response.data;
      // Transform analysis_results
      return {
        ...data,
        analysis_results: transformAnalysisResults(data.analysis_results),
      };
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error(`Search not found with ID: ${searchId}`);
      }
      throw new Error(error.response?.data?.detail || 'Failed to fetch search details');
    }
  }

  async getSearchHistory(limit: number = 10): Promise<SearchHistoryResponse> {
    const response = await axiosInstance.get<any>(
      API_ENDPOINTS.USER_SEARCH_SYMBOL.HISTORY,
      { params: { limit } }
    );
    const data = response.data;
    // Transform analysis_results in each history item
    return {
      ...data,
      search_history: (data.search_history || []).map((item: any) => ({
        ...item,
        analysis_results: transformAnalysisResults(item.analysis_results),
      })),
    };
  }

  async getRateLimit(): Promise<RateLimitInfo> {
    const response = await axiosInstance.get<RateLimitInfo>(
      API_ENDPOINTS.USER_SEARCH_SYMBOL.RATE_LIMITS
    );
    return response.data;
  }

  isAnalysisComplete(results: SymbolAnalysisResult[] | null): boolean {
    if (!results || results.length === 0) return false;
    return results.every(result => result.status !== 'pending');
  }

  hasAnalysisResults(results: SymbolAnalysisResult[] | null): boolean {
    if (!results) return false;
    return results.some(result => result.status === 'success' || result.status === 'error');
  }

  getSuccessfulAnalyses(results: SymbolAnalysisResult[] | null): SymbolAnalysisResult[] {
    if (!results) return [];
    return results.filter(result => result.status === 'success');
  }

  getDecisionColor(decision: string): string {
    const colors = {
      long: '#10B981',
      short: '#EF4444',
      hold: '#6B7280',
    };
    return colors[decision as keyof typeof colors] || '#6B7280';
  }

  getStatusColor(status: AnalysisStatus): string {
    const colors = {
      pending: '#F59E0B',
      success: '#10B981',
      error: '#EF4444',
    };
    return colors[status];
  }

  formatPrice(price: number | undefined): string {
    if (price === undefined || price === null) return 'N/A';
    if (price >= 1000) {
      return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    }
    return `$${price.toFixed(4)}`;
  }

  formatPercentage(value: number | undefined): string {
    if (value === undefined || value === null) return 'N/A';
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  }

  getLeverageColor(leverage: number | undefined): string {
    if (!leverage) return '#6B7280';
    if (leverage >= 5) return '#EF4444';
    if (leverage >= 3) return '#F59E0B';
    return '#10B981';
  }

  getConsensusColor(consensus: number | undefined): string {
    if (!consensus) return '#6B7280';
    if (consensus >= 90) return '#10B981';
    if (consensus >= 80) return '#3B82F6';
    if (consensus >= 70) return '#F59E0B';
    return '#EF4444';
  }
}

export const userSymbolSearchService = new UserSymbolSearchService();