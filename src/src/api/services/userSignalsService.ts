// =============================================================================
// FILE: src/api/services/signalsService.ts
// =============================================================================
// Signals Service - Limited Access for Regular Users
// Users can only see: Symbol, Entry, SL, Active Status, Created Time
// =============================================================================

import axiosInstance from "../axiosConfig";
import axios, { AxiosError } from "axios";
import { API_ENDPOINTS, buildQueryString } from "../endpoints";

import type {
  UserSignal,
  UserSignalListResponse,
  UserSignalStats,
  UserSignalFilters,
  SignalStatus,
  StatusUpdateResponse,
} from "../../types/signals.types";

/**
 * Extract error message from Axios error (LOCAL COPY)
 */
function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError<{ detail?: string; message?: string }>;
    return (
      axiosErr.response?.data?.detail ||
      axiosErr.response?.data?.message ||
      axiosErr.message ||
      "An error occurred"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unknown error occurred";
}

/**
 * Transform backend response -> user-visible fields
 */
function transformToUserSignal(backendSignal: any): UserSignal {
  return {
    id: backendSignal.id,
    symbol: backendSignal.symbol,
    decision: backendSignal.decision || backendSignal.final_decision,
    entry_price: backendSignal.entry_price,
    stop_loss_price: backendSignal.stop_loss_price || backendSignal.stop_loss,
    status: backendSignal.status,
    created_at: backendSignal.created_at,
  };
}

/**
 * Signals Service (User Access)
 */
export const signalsService = {
  // ==========================================================================
  // GET /signals/ - List signals (filtered)
  // ==========================================================================
  async getSignals(filters: UserSignalFilters = {}): Promise<UserSignalListResponse> {
    try {
      const params: Record<string, any> = {
        limit: filters.limit || 50,
        offset: filters.offset || 0,
      };

      if (filters.symbol) params.symbol = filters.symbol.toUpperCase();
      if (filters.decision) params.decision = filters.decision;
      if (filters.status) params.status = filters.status;
      if (filters.start_date) params.start_date = filters.start_date;
      if (filters.end_date) params.end_date = filters.end_date;

      const url = API_ENDPOINTS.SIGNALS.LIST + buildQueryString(params);
      const response = await axiosInstance.get(url);

      const signals: UserSignal[] = response.data.map(transformToUserSignal);

      return {
        signals,
        total: (filters.offset || 0) + signals.length,
        hasMore: signals.length === (filters.limit || 50),
      };
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  // ==========================================================================
  // GET /signals/active
  // ==========================================================================
  async getActiveSignals(symbol?: string, limit: number = 50): Promise<UserSignal[]> {
    try {
      const params: Record<string, any> = { limit };
      if (symbol) params.symbol = symbol.toUpperCase();

      const url = API_ENDPOINTS.SIGNALS.ACTIVE + buildQueryString(params);
      const response = await axiosInstance.get(url);

      return response.data.map(transformToUserSignal);
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  // ==========================================================================
  // GET /signals/stats
  // ==========================================================================
  async getStats(
    timeframe: "1h" | "24h" | "7d" | "30d" | "all" = "24h"
  ): Promise<UserSignalStats> {
    try {
      const url = API_ENDPOINTS.SIGNALS.STATS + buildQueryString({ timeframe });
      const response = await axiosInstance.get(url);

      return {
        timeframe: response.data.timeframe,
        total_signals: response.data.total_signals,
        decisions: response.data.decisions,
        most_active_symbols: response.data.most_active_symbols || [],
      };
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  // ==========================================================================
  // GET /signals/symbols
  // ==========================================================================
  async getSymbols(): Promise<string[]> {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.SIGNALS.SYMBOLS);
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  // ==========================================================================
  // GET /signals/:id
  // ==========================================================================
  async getSignalById(signalId: string): Promise<UserSignal | null> {
    try {
      const url = API_ENDPOINTS.SIGNALS.DETAIL(signalId);
      const response = await axiosInstance.get(url);

      return transformToUserSignal(response.data);
    } catch (error: any) {
      if (error?.response?.status === 404) return null;
      throw new Error(extractErrorMessage(error));
    }
  },

  // ==========================================================================
  // PATCH /signals/:id/status
  // ==========================================================================
  async updateSignalStatus(
    signalId: string,
    status: SignalStatus | string
  ): Promise<StatusUpdateResponse> {
    try {
      const url =
        API_ENDPOINTS.SIGNALS.UPDATE_STATUS(signalId) +
        buildQueryString({ new_status: status });

      const response = await axiosInstance.patch(url);

      return {
        message: response.data.message,
        signal: transformToUserSignal(response.data.signal),
      };
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
};

export default signalsService;
