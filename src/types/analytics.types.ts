// src/types/analytics.types.ts (remove PortfolioUpdateMessage from here)
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
  period_stats: {
    total_signals: number;
    decisions: {
      long: number;
      short: number;
      hold: number;
    };
    avg_consensus_strength: number;
    system_pnl_usd: number;
  };
  recent_trades: SystemTradeSummary[];
}

export interface SignalSummary {
  id: string;
  symbol: string;
  decision: string;
  consensus_strength: number;
  entry_price?: number;
  take_profit_price?: number;
  stop_loss_price?: number;
  created_at: string;
}

export interface SystemTradeSummary {
  id: string;
  user_id: string;
  symbol: string;
  side: string;
  pnl_usd: number;
  status: string;
  created_at: string;
}