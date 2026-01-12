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

class UserSymbolSearchService {
  async analyzeSymbols(request: UserSymbolSearchRequest): Promise<UserSymbolSearchResponse> {
    try {
      const response = await axiosInstance.post<UserSymbolSearchResponse>(
        API_ENDPOINTS.USER_SEARCH_SYMBOL.ANALYZE,
        request
      );
      return response.data;
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
      const response = await axiosInstance.get<UserSymbolSearchDetail>(
        API_ENDPOINTS.USER_SEARCH_SYMBOL.DETAIL(searchId)
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error(`Search not found with ID: ${searchId}`);
      }
      throw new Error(error.response?.data?.detail || 'Failed to fetch search details');
    }
  }

  async getSearchHistory(limit: number = 10): Promise<SearchHistoryResponse> {
    const response = await axiosInstance.get<SearchHistoryResponse>(
      API_ENDPOINTS.USER_SEARCH_SYMBOL.HISTORY,
      { params: { limit } }
    );
    return response.data;
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