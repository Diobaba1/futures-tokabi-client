// FILE: src/types/signals.types.ts

export interface SignalResponse {
  id: string;
  symbol: string;
  final_decision: 'long' | 'short' | 'hold';
  consensus_strength: number;
  entry_price: number | null;
  stop_loss_price: number | null;
  take_profit_price: number | null;  // Simplified to single TP
  risk_reward_ratio: number | null;
  suggested_leverage: number | null;
  created_at: string;
  analysis_duration_ms: number | null;
  expires_at: string | null;
}

export interface SignalDetailResponse extends SignalResponse {
  market_data: Record<string, any>;
  indicators: Record<string, any>;
  estimated_tp_percent: number | null;
  estimated_sl_percent: number | null;
  anthropic_decision: SignalDecision | null;
  qwen_decision: SignalDecision | null;
  deepseek_decision: SignalDecision | null;
  grok_decision: SignalDecision | null;
}

export interface SignalDecision {
  decision: string | null;
  confidence: number | null;
  reasoning: string | null;
}

export interface SignalStats {
  timeframe: string;
  total_signals: number;
  decisions: {
    long: number;
    short: number;
  };
  avg_consensus_strength: number;
  avg_leverage: number | null;
  most_active_symbols: Array<{
    symbol: string;
    signal_count: number;
  }>;
  success_rate: number | null;
}

export interface SignalFilters {
  symbol?: string;
  decision?: 'long' | 'short' | 'hold';
  min_leverage?: number;
  max_leverage?: number;
  min_consensus?: number;
  limit?: number;
  offset?: number;
  start_date?: string;
  end_date?: string;
}

export interface SignalsResponse {
  signals: SignalResponse[];
  total: number;
  hasMore: boolean;
}