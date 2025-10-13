// src/api/services/tradeService.ts
import axiosInstance from '../axiosConfig';
import { API } from '../endpoints';
import { TradeResponse } from '../../types/trades.types';

export const tradeService = {
  async getTrades(status?: string, limit: number = 50, offset: number = 0): Promise<TradeResponse[]> {
    let url = API.TRADES.LIST;
    if (status) url += `?status=${status}`;
    if (limit !== 50) url += `${url.includes('?') ? '&' : '?'}limit=${limit}`;
    if (offset > 0) url += `${url.includes('?') ? '&' : '?'}offset=${offset}`;
    const response = await axiosInstance.get(url);
    return response.data;
  },

  async getTrade(tradeId: string): Promise<TradeResponse> {
    const response = await axiosInstance.get(API.TRADES.DETAIL(tradeId));
    return response.data;
  },
};