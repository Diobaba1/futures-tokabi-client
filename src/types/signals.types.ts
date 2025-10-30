export interface SignalResponse {
  id: string;
  symbol: string;
  final_decision: 'long' | 'short' | 'hold';
  consensus_strength: number;
  signal_quality: 'divine' | 'excellent' | 'very_good' | 'good' | 'caution' | null;
  is_futures_ready: boolean | null;
  entry_price: number | null;
  stop_loss_price: number | null;
  take_profit_1: number | null;
  take_profit_2: number | null;
  take_profit_3: number | null;
  risk_reward_ratio: number | null;
  suggested_leverage: number | null;
  risk_per_trade: number | null;
  max_position_size: number | null;
  estimated_tp_percent: number | null;
  estimated_sl_percent: number | null;
  created_at: string;
  analysis_duration_ms: number | null;
  expires_at: string | null;
}

export interface SignalDetailResponse extends SignalResponse {
  market_data: Record<string, any>;
  indicators: Record<string, any>;
  fear_greed_data: Record<string, any> | null;
  anthropic_decision: SignalDecision | null;
  groq_decision: SignalDecision | null;
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
    hold: number;
  };
  avg_consensus_strength: number;
  avg_leverage: number | null;
  signal_quality_distribution: {
    divine: number;
    excellent: number;
    very_good: number;
    good: number;
    caution: number;
  };
  most_active_symbols: Array<{
    symbol: string;
    signal_count: number;
  }>;
  total_futures_ready: number;
  success_rate: number | null;
}

export interface SignalFilters {
  symbol?: string;
  decision?: 'long' | 'short' | 'hold';
  signal_quality?: 'divine' | 'excellent' | 'very_good' | 'good' | 'caution';
  futures_ready?: boolean;
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