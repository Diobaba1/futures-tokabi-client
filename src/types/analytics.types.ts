export interface PortfolioAnalytics {
  balance: {
    current_balance_usd: number;
    total_balance_usd: number;
    unrealized_pnl_usd: number;
    unrealized_pnl_percent: number;
  };
  performance: {
    total_trades: number;
    winning_trades: number;
    losing_trades: number;
    sharpe_ratio: number;
    win_rate: number;
    avg_win_percent: number;
    avg_loss_percent: number;
    profit_factor: number;
  };
  risk: {
    max_drawdown_percent: number;
    current_drawdown_percent: number;
    consecutive_losses: number;
    consecutive_wins: number;
    leverage: number;
    is_paused: boolean;
    pause_reason?: string;
  };
  recent_trades: TradeSummary[];
}

export interface TradeSummary {
  id: string;
  symbol: string;
  side: string;
  pnl_usd: number;
  pnl_percent: number;
  status: string;
  created_at: string;
}

export interface SystemAnalytics {
  recent_signals: SignalSummary[];
  period_stats: SystemStats;
  recent_trades: SystemTradeSummary[];
  analytics_summary: AnalyticsSummary;
}

export interface SystemStats {
  timeframe: string;
  total_signals: number;
  decisions: {
    long: number;
    short: number;
    hold: number;
  };
  avg_consensus_strength: number;
  avg_leverage: number;
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
  success_rate: number;
  system_pnl_usd: number;
}

export interface AnalyticsSummary {
  total_analyzed_period: number;
  high_quality_signals: number;
  avg_risk_reward: number;
  leverage_distribution: {
    low_risk: number;
    medium_risk: number;
    high_risk: number;
  };
}

export interface SignalSummary {
  id: string;
  symbol: string;
  decision: string;
  consensus_strength: number;
  signal_quality: string;
  entry_price?: number;
  stop_loss_price?: number;
  take_profit_1?: number;
  take_profit_2?: number;
  take_profit_3?: number;
  risk_reward_ratio?: number;
  suggested_leverage?: number;
  is_futures_signal: boolean;
  created_at: string;
}

export interface SystemTradeSummary {
  id: string;
  user_id: string;
  symbol: string;
  side: string;
  pnl_usd: number;
  status: string;
  entry_price?: number;
  exit_price?: number;
  leverage_used?: number;
  created_at: string;
}