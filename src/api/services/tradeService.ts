// src/api/services/tradeService.ts
import axiosInstance from '../axiosConfig';
import { API_ENDPOINTS } from '../endpoints';
import type { 
  TradeListResponse, 
  TradeDetailResponse, 
  CreateTradeRequest, 
  UpdateTradeRequest 
} from '../../types/trades.types';

export const tradeService = {
  getTrades: async (params?: {
    status?: string;
    symbol?: string;
    limit?: number;
    offset?: number;
  }): Promise<TradeListResponse> => {
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
};