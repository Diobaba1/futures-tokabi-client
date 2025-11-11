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
  // Use the endpoints from your config
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

  /**
   * Get detailed information about a specific search by ID
   */
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

  // Helper method to check if analysis is complete (now works with the correct type)
  isAnalysisComplete(results: SymbolAnalysisResult[] | null): boolean {
    if (!results || results.length === 0) return false;
    return results.every(result => result.status !== 'pending');
  }

  // Helper method to check if analysis has any results
  hasAnalysisResults(results: SymbolAnalysisResult[] | null): boolean {
    if (!results) return false;
    return results.some(result => result.status === 'success' || result.status === 'error');
  }

  // Helper method to get successful analyses
  getSuccessfulAnalyses(results: SymbolAnalysisResult[] | null): SymbolAnalysisResult[] {
    if (!results) return [];
    return results.filter(result => result.status === 'success');
  }

  // Helper method to format signal quality with colors
  getSignalQualityColor(quality: string): string {
    const colors = {
      divine: '#10B981', // green
      excellent: '#3B82F6', // blue
      very_good: '#8B5CF6', // purple
      good: '#F59E0B', // amber
      caution: '#EF4444', // red
    };
    return colors[quality as keyof typeof colors] || '#6B7280';
  }

  // Helper method to format decision with colors
  getDecisionColor(decision: string): string {
    const colors = {
      long: '#10B981', // green
      short: '#EF4444', // red
      hold: '#6B7280', // gray
    };
    return colors[decision as keyof typeof colors] || '#6B7280';
  }

  // Helper method to get status color
  getStatusColor(status: AnalysisStatus): string {
    const colors = {
      pending: '#F59E0B', // amber
      success: '#10B981', // green
      error: '#EF4444', // red
    };
    return colors[status];
  }

  // Helper to format price for display
  formatPrice(price: number | undefined): string {
    if (price === undefined || price === null) return 'N/A';
    if (price >= 1000) {
      return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    }
    return `$${price.toFixed(4)}`;
  }

  // Helper to format percentage
  formatPercentage(value: number | undefined): string {
    if (value === undefined || value === null) return 'N/A';
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  }
}

export const userSymbolSearchService = new UserSymbolSearchService();