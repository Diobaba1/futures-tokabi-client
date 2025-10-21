// src/types/signals.types.ts
export interface SignalBase {
  symbol: string;
  final_decision: 'long' | 'short' | 'hold';
  consensus_strength: number;
  created_at: string;
  analysis_summary?: string;
  technical_indicators?: Record<string, any>;
}

export interface SignalResponse extends SignalBase {
  id: string;
  user_id: string;
}

export interface SignalDetailResponse extends SignalResponse {
  anthropic_decision?: string;
  groq_decision?: string;
  deepseek_decision?: string;
  grok_decision?: string;
  anthropic_confidence?: number;
  groq_confidence?: number;
  deepseek_confidence?: number;
  grok_confidence?: number;
  anthropic_reasoning?: string;
  groq_reasoning?: string;
  deepseek_reasoning?: string;
  grok_reasoning?: string;
  market_data?: Record<string, any>;
  indicators?: Record<string, any>;
  entry_price?: number;
  take_profit_price?: number;
  stop_loss_price?: number;
  estimated_tp_percent?: number;
  estimated_sl_percent?: number;
  risk_reward_ratio?: number;
  analysis_duration_ms?: number;
}

export interface GetSignalsParams {
  limit?: number;
  offset?: number;
  symbol?: string;
  decision?: 'long' | 'short' | 'hold';
  start_date?: string;
  end_date?: string;
}

export interface SignalStatsResponse {
  total_signals: number;
  decisions: {
    long: number;
    short: number;
    hold: number;
  };
  timeframe: string;
  accuracy?: number;
  avg_consensus_strength?: number;
}

export interface AvailableSymbolsResponse {
  symbols: string[];
}