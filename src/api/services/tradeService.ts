// src/api/services/tradeService.ts
import axiosInstance from '../axiosConfig';
import { API_ENDPOINTS } from '../endpoints';
import type {
  TradeDetailResponse,
  CreateTradeRequest,
  UpdateTradeRequest,
  ExchangeHistoryResponse,
  ExchangeOpenOrdersResponse
} from '../../types/trades.types';

export const tradeService = {
  // Platform trades
  getTrades: async (params?: {
    status?: string;
    symbol?: string;
    page?: number;
    page_size?: number;
    start_date?: string;
    end_date?: string;
  }): Promise<{
    items: any[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  }> => {
    const response = await axiosInstance.get(API_ENDPOINTS.TRADES.LIST, { params });
    return response.data;
  },

  getTrade: async (id: string): Promise<TradeDetailResponse> => {
    const url = API_ENDPOINTS.TRADES.DETAIL.replace('{id}', id);
    const response = await axiosInstance.get(url);
    return response.data;
  },

  createTrade: async (data: CreateTradeRequest): Promise<TradeDetailResponse> => {
    const response = await axiosInstance.post(API_ENDPOINTS.TRADES.CREATE, data);
    return response.data;
  },

  updateTrade: async (id: string, data: UpdateTradeRequest): Promise<TradeDetailResponse> => {
    const url = API_ENDPOINTS.TRADES.UPDATE.replace('{id}', id);
    const response = await axiosInstance.patch(url, data);
    return response.data;
  },

  deleteTrade: async (id: string): Promise<void> => {
    const url = API_ENDPOINTS.TRADES.DELETE.replace('{id}', id);
    await axiosInstance.delete(url);
  },

  // Exchange history - fetches directly from connected exchange
  getExchangeHistory: async (params?: {
    symbol?: string;
    limit?: number;
    start_date?: string;
    end_date?: string;
  }): Promise<ExchangeHistoryResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.TRADES.EXCHANGE_HISTORY, { params });
    return response.data;
  },

  getExchangeOpenOrders: async (params?: {
    symbol?: string;
  }): Promise<ExchangeOpenOrdersResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.TRADES.EXCHANGE_ORDERS, { params });
    return response.data;
  },

  // Get trade stats
  getTradeStats: async (timeframe?: string): Promise<any> => {
    const response = await axiosInstance.get(API_ENDPOINTS.TRADES.STATS, {
      params: { timeframe: timeframe || 'all' }
    });
    return response.data;
  },
};