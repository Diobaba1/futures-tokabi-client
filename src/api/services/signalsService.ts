import axiosInstance from '../axiosConfig';
import {
  SignalResponse,
  SignalDetailResponse,
  SignalStats,
  SignalFilters,
  SignalsResponse
} from '../../types/signals.types';

class SignalsService {
  private basePath = '/signals';

  async getSignals(filters: SignalFilters = {}): Promise<SignalsResponse> {
    const {
      symbol,
      decision,
      limit = 50,
      offset = 0,
      start_date,
      end_date
    } = filters;

    const params: Record<string, any> = {
      limit,
      offset
    };

    if (symbol) params.symbol = symbol;
    if (decision) params.decision = decision;
    if (start_date) params.start_date = start_date;
    if (end_date) params.end_date = end_date;

    const response = await axiosInstance.get<SignalResponse[]>(this.basePath + '/', { params });
    
    // Note: The backend doesn't return total in response, so we'd need to handle pagination differently
    // For now, we'll assume if we get less than limit, there are no more signals
    const hasMore = response.data.length === limit;
    
    return {
      signals: response.data,
      total: offset + response.data.length, // This is approximate
      hasMore
    };
  }

  async getSignal(signalId: string): Promise<SignalDetailResponse> {
    const response = await axiosInstance.get<SignalDetailResponse>(
      `${this.basePath}/${signalId}`
    );
    return response.data;
  }

  async getAvailableSymbols(): Promise<string[]> {
    const response = await axiosInstance.get<string[]>(this.basePath + '/symbols/');
    return response.data;
  }

  async getSignalStats(timeframe: '1h' | '24h' | '7d' | '30d' | 'all' = '24h'): Promise<SignalStats> {
    const response = await axiosInstance.get<SignalStats>(this.basePath + '/stats/summary', {
      params: { timeframe }
    });
    return response.data;
  }
}

export const signalsService = new SignalsService();