// src/services/signalService.ts
import axiosInstance from "../axiosConfig";
import {
  GetSignalsParams,
  SignalResponse,
  SignalDetailResponse,
  SignalStatsResponse,
  AvailableSymbolsResponse,
} from "../../types/signals.types";
import { API_ENDPOINTS } from "../endpoints";

export const signalService = {
  /**
   * Get paginated list of trading signals with filtering options
   */
  getSignals: async (params: GetSignalsParams = {}): Promise<{ trades: SignalResponse[]; pagination: any }> => {
    const response = await axiosInstance.get(API_ENDPOINTS.SIGNALS.LIST, { params });
    return response.data;
  },

  /**
   * Get detailed information for a specific signal
   */
  getSignalDetail: async (signalId: string): Promise<SignalDetailResponse> => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.SIGNALS.DETAIL.replace('{signal_id}', signalId)}`);
    return response.data;
  },

  /**
   * Get list of all available symbols that have signals
   */
  getAvailableSymbols: async (): Promise<AvailableSymbolsResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.SIGNALS.SYMBOLS);
    return response.data;
  },

  /**
   * Get signal statistics for the specified timeframe
   */
  getSignalStats: async (timeframe: string = '24h'): Promise<SignalStatsResponse> => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.SIGNALS.STATS}?timeframe=${timeframe}`);
    return response.data;
  },
};