// =============================================================================
// FILE: src/types/index.ts
// =============================================================================
// TypeScript type definitions for User Signal Frontend
// Users can only see: Symbol, Entry, SL, Active Status, Created Time
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

// =============================================================================
// User Signal Types (Limited Fields Only)
// =============================================================================

/**
 * User-visible signal fields only
 * Users can ONLY see: Symbol, Entry, SL, Active Status, Created Time
 */
export interface UserSignal {
  id: string;
  symbol: string;
  decision: SignalDecision | string;
  entry_price: number | null;
  stop_loss_price: number | null;
  status: SignalStatus | string;
  created_at: string;
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
 * User signal stats (limited view)
 */
export interface UserSignalStats {
  timeframe: string;
  total_signals: number;
  decisions: {
    long: number;
    short: number;
    hold?: number;
  };
  most_active_symbols: Array<{
    symbol: string;
    count: number;
  }>;
}

/**
 * User signal filters
 */
export interface UserSignalFilters {
  symbol?: string;
  decision?: SignalDecision | string;
  status?: SignalStatus | string;
  limit?: number;
  offset?: number;
  start_date?: string;
  end_date?: string;
}

// =============================================================================
// API Response Types
// =============================================================================

export interface StatusUpdateResponse {
  message: string;
  signal: UserSignal;
}

// =============================================================================
// UI State Types
// =============================================================================

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}