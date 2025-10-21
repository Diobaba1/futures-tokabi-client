export interface SignalResponse {
  id: string;
  symbol: string;
  final_decision: 'long' | 'short' | 'hold';
  consensus_strength: number;
  entry_price: number | null;
  take_profit_price: number | null;
  stop_loss_price: number | null;
  estimated_tp_percent: number | null;
  estimated_sl_percent: number | null;
  risk_reward_ratio: number | null;
  created_at: string;
  analysis_duration_ms: number | null;
}

export interface SignalDetailResponse extends SignalResponse {
  market_data: Record<string, any>;
  indicators: Record<string, any>;
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
  most_active_symbols: Array<{
    symbol: string;
    signal_count: number;
  }>;
}

export interface SignalFilters {
  symbol?: string;
  decision?: 'long' | 'short' | 'hold';
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