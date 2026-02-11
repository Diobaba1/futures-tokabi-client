// =============================================================================
// FILE: src/types/signals.types.ts
// =============================================================================
// TypeScript type definitions for User Signal Frontend
// UPDATED: Aligned with backend SignalResponse structure
// =============================================================================

// =============================================================================
// Enums
// =============================================================================

export enum SignalDecision {
  LONG = "long",
  SHORT = "short",
  HOLD = "hold",
}

export enum SignalStatus {
  ACTIVE = "active",
  EXPIRED = "expired",
  EXECUTED = "executed",
  CANCELLED = "cancelled",
}

export enum SignalSource {
  AUTO_ANALYSIS = "auto_analysis",
  ADMIN_TRIGGERED = "admin_triggered",
  USER_REQUEST = "user_request",
  MANUAL = "manual",
}

// =============================================================================
// Take Profit Level (for multiple TPs)
// =============================================================================

export interface SignalTakeProfit {
  level: number;
  price: number;
  percentage?: number | null;
}

// =============================================================================
// Model Decision (from LLM models)
// =============================================================================

export interface ModelDecision {
  model_id?: string;
  display_name?: string;
  openrouter_model_id?: string;
  provider?: string;
  decision?: string;
  confidence?: number;
  reasoning?: string;
  entry_price?: number;
  stop_loss_price?: number;
  take_profit_price?: number;
  suggested_leverage?: number;
  response_time_ms?: number;
}

// =============================================================================
// User Signal Types (Full Backend Response)
// =============================================================================

/**
 * Complete signal response matching backend SignalResponse
 */
export interface UserSignal {
  id: string;
  symbol: string;
  decision: SignalDecision | string;
  source?: SignalSource | string;
  
  // Consensus & Confidence
  consensus_strength: number;
  avg_confidence: number;
  
  // Price Levels
  entry_price: number | null;
  stop_loss_price: number | null;
  take_profit_price: number | null;  // Primary TP price
  take_profits: SignalTakeProfit[];  // Multiple TP levels (auto-generated if single TP provided)
  current_price?: number | null;
  
  // Risk Metrics
  risk_reward_ratio?: number | null;
  suggested_leverage?: number | null;
  stop_loss_percent?: number | null;
  take_profit_percent?: number | null;
  
  // Model Information
  active_providers?: number;
  models_used?: string[];
  provider_decisions?: Record<string, string>;
  
  // Status & Timing
  status: SignalStatus | string;
  created_at: string;
  expires_at?: string | null;
  
  // Additional Info
  reasoning_summary?: string;
  timeframes_analyzed?: string[];
  decision_method?: string;
  high_confidence_votes?: number;
  analysis_duration_ms?: number;
}

/**
 * Detailed signal response with model responses
 */
export interface UserSignalDetail extends UserSignal {
  model_responses?: Record<string, ModelDecision>;
  providers?: Record<string, ModelDecision>;
  market_data?: Record<string, any>;
  indicators?: Record<string, any>;
  custom_context?: string;
  admin_notes?: string;
  updated_at?: string;
  executed_at?: string;
  is_executed?: boolean;
  user_id?: string;
  created_by_admin_id?: string;
}

/**
 * User signal list response
 */
export interface UserSignalListResponse {
  signals: UserSignal[];
  total: number;
  hasMore: boolean;
}

/**
 * User signal stats
 */
export interface UserSignalStats {
  timeframe: string;
  total_signals: number;
  decisions: {
    long: number;
    short: number;
    hold?: number;
  };
  avg_consensus_strength?: number;
  avg_leverage?: number;
  most_active_symbols: Array<{
    symbol: string;
    count: number;
  }>;
  by_source?: Record<string, number>;
  by_model?: Record<string, any>;
}

/**
 * User signal filters
 */
export interface UserSignalFilters {
  symbol?: string;
  decision?: SignalDecision | string;
  status?: SignalStatus | string;
  source?: SignalSource | string;
  min_consensus?: number;
  max_consensus?: number;
  min_leverage?: number;
  max_leverage?: number;
  page?: number;
  limit?: number;
  offset?: number;
  start_date?: string;
  end_date?: string;
  include_hold?: boolean;
}

// =============================================================================
// API Response Types
// =============================================================================

export interface StatusUpdateResponse {
  message: string;
  signal: UserSignal;
}

export interface LeverageRecommendation {
  symbol: string;
  decision: string;
  consensus_strength: number;
  suggested_leverage: number;
  rationale: string;
}

// =============================================================================
// UI State Types
// =============================================================================

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// =============================================================================
// Helper Functions
// =============================================================================

export const getDecisionColor = (decision: string): string => {
  switch (decision?.toLowerCase()) {
    case 'long':
      return 'text-emerald-400';
    case 'short':
      return 'text-rose-400';
    default:
      return 'text-slate-400';
  }
};

export const getDecisionBgColor = (decision: string): string => {
  switch (decision?.toLowerCase()) {
    case 'long':
      return 'bg-emerald-500/10 border-emerald-500/30';
    case 'short':
      return 'bg-rose-500/10 border-rose-500/30';
    default:
      return 'bg-slate-500/10 border-slate-500/30';
  }
};

export const getConsensusColor = (consensus: number): string => {
  if (consensus >= 85) return 'text-emerald-400';
  if (consensus >= 70) return 'text-amber-400';
  return 'text-rose-400';
};

export const getLeverageColor = (leverage: number | null | undefined): string => {
  if (!leverage) return 'text-slate-400';
  if (leverage >= 5) return 'text-rose-400';
  if (leverage >= 3) return 'text-amber-400';
  return 'text-emerald-400';
};

export const formatPrice = (price: number | null | undefined): string => {
  if (price === null || price === undefined) return '—';
  if (price >= 1000) {
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `$${price.toFixed(price >= 1 ? 2 : 6)}`;
};

export const formatPercent = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '—';
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};

export const formatConfidence = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '—';
  return `${(value * 100).toFixed(0)}%`;
};
