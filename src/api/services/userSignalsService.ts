// =============================================================================
// FILE: src/api/services/userSignalsService.ts
// =============================================================================
// Signals Service - User Access
// 
// BACKEND AUTO-FILTERING:
// - No HOLD signals (only LONG and SHORT)
// - Only signals from the last 24 hours
// =============================================================================

import axiosInstance from "../axiosConfig";
import axios, { AxiosError } from "axios";
import { API_ENDPOINTS, buildQueryString } from "../endpoints";

import type {
  UserSignal,
  UserSignalDetail,
  UserSignalListResponse,
  UserSignalStats,
  UserSignalFilters,
  SignalStatus,
  StatusUpdateResponse,
  LeverageRecommendation,
} from "../../types/signals.types";

/**
 * Extract error message from Axios error
 * Handles nested detail objects from FastAPI errors
 */
function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError<{ detail?: string | { message?: string; error_code?: string }; message?: string }>;

    // Handle FastAPI detail response (can be string or object)
    const detail = axiosErr.response?.data?.detail;
    if (detail) {
      // If detail is an object with a message property
      if (typeof detail === 'object' && detail !== null && 'message' in detail) {
        return detail.message || "An error occurred";
      }
      // If detail is a string
      if (typeof detail === 'string') {
        return detail;
      }
    }

    // Fallback to other error formats
    return (
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
 * Transform backend response to UserSignal
 */
function transformToUserSignal(backendSignal: any): UserSignal {
  return {
    id: backendSignal.id,
    symbol: backendSignal.symbol,
    decision: backendSignal.decision || backendSignal.final_decision || 'long',
    source: backendSignal.source,
    
    // Consensus & Confidence
    consensus_strength: backendSignal.consensus_strength || 0,
    avg_confidence: backendSignal.avg_confidence || 0,
    
    // Price Levels
    entry_price: backendSignal.entry_price,
    stop_loss_price: backendSignal.stop_loss_price || backendSignal.stop_loss,
    take_profit_price: backendSignal.take_profit_price || backendSignal.take_profit,
    take_profits: backendSignal.take_profits || [],
    current_price: backendSignal.current_price,
    
    // Risk Metrics
    risk_reward_ratio: backendSignal.risk_reward_ratio,
    suggested_leverage: backendSignal.suggested_leverage,
    stop_loss_percent: backendSignal.stop_loss_percent || backendSignal.estimated_sl_percent,
    take_profit_percent: backendSignal.take_profit_percent || backendSignal.estimated_tp_percent,
    
    // Model Information
    active_providers: backendSignal.active_providers || backendSignal.available_llms || 0,
    models_used: backendSignal.models_used || [],
    provider_decisions: backendSignal.provider_decisions || {},
    
    // Status & Timing
    status: backendSignal.status,
    created_at: backendSignal.created_at,
    expires_at: backendSignal.expires_at,
    
    // Additional Info
    reasoning_summary: backendSignal.reasoning_summary,
    timeframes_analyzed: backendSignal.timeframes_analyzed,
    decision_method: backendSignal.decision_method,
    high_confidence_votes: backendSignal.high_confidence_votes,
    analysis_duration_ms: backendSignal.analysis_duration_ms,
  };
}

/**
 * Transform backend response to UserSignalDetail
 */
function transformToUserSignalDetail(backendSignal: any): UserSignalDetail {
  return {
    ...transformToUserSignal(backendSignal),
    model_responses: backendSignal.model_responses,
    providers: backendSignal.providers,
    market_data: backendSignal.market_data,
    indicators: backendSignal.indicators,
    custom_context: backendSignal.custom_context,
    admin_notes: backendSignal.admin_notes,
    updated_at: backendSignal.updated_at,
    executed_at: backendSignal.executed_at,
    is_executed: backendSignal.is_executed,
    user_id: backendSignal.user_id,
    created_by_admin_id: backendSignal.created_by_admin_id,
  };
}

/**
 * Signals Service (User Access)
 * 
 * NOTE: Backend automatically filters:
 * - No HOLD signals (only LONG/SHORT)
 * - Only signals from last 24 hours
 */
export const signalsService = {
  // ==========================================================================
  // GET /signals/ - List signals
  // Backend auto-filters: No HOLD, last 24h only
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
      if (filters.source) params.source = filters.source;
      if (filters.min_consensus) params.min_consensus = filters.min_consensus;
      if (filters.min_leverage) params.min_leverage = filters.min_leverage;
      if (filters.max_leverage) params.max_leverage = filters.max_leverage;

      const url = API_ENDPOINTS.SIGNALS.LIST + buildQueryString(params);
      const response = await axiosInstance.get(url);

      // Backend already filters out HOLD and old signals
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
  // GET /signals/active - Active LONG/SHORT signals only
  // Backend auto-filters: No HOLD, last 24h only, active status
  // ==========================================================================
  async getActiveSignals(
    symbol?: string,
    page: number = 1,
    pageSize: number = 20,
  ): Promise<{
    items: UserSignal[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  }> {
    try {
      const params: Record<string, any> = { page, page_size: pageSize };
      if (symbol) params.symbol = symbol.toUpperCase();

      const url = API_ENDPOINTS.SIGNALS.ACTIVE + buildQueryString(params);
      const response = await axiosInstance.get(url);

      return {
        items: (response.data.items || []).map(transformToUserSignal),
        total: response.data.total,
        page: response.data.page,
        page_size: response.data.page_size,
        total_pages: response.data.total_pages,
        has_next: response.data.has_next,
        has_prev: response.data.has_prev,
      };
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
        avg_consensus_strength: response.data.avg_consensus_strength,
        avg_leverage: response.data.avg_leverage,
        most_active_symbols: response.data.most_active_symbols || [],
        by_source: response.data.by_source,
        by_model: response.data.by_model,
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
  // GET /signals/:id - Get detailed signal
  // ==========================================================================
  async getSignalById(signalId: string): Promise<UserSignalDetail | null> {
    try {
      const url = API_ENDPOINTS.SIGNALS.DETAIL(signalId);
      const response = await axiosInstance.get(url);

      return transformToUserSignalDetail(response.data);
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

  // ==========================================================================
  // GET /signals/leverage-recommendations
  // ==========================================================================
  async getLeverageRecommendations(
    symbol?: string,
    minConsensus: number = 80,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<{
    items: LeverageRecommendation[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  }> {
    try {
      const params: Record<string, any> = {
        min_consensus: minConsensus,
        page,
        page_size: pageSize,
      };
      if (symbol) params.symbol = symbol.toUpperCase();

      const url = API_ENDPOINTS.SIGNALS.LEVERAGE_RECOMMENDATIONS + buildQueryString(params);
      const response = await axiosInstance.get(url);

      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
};

export default signalsService;
