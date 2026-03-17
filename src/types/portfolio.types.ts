// src/types/portfolio.types.ts
export interface PortfolioBase {
  total_wallet_balance: number;
  total_margin_balance: number;
  total_unrealized_profit: number;
  total_initial_margin: number;
  available_balance: number;
  leverage?: number;
  assets?: Record<string, any> | null;
  positions?: Record<string, any> | null;
}

export interface PortfolioResponse extends PortfolioBase {
  id: string;
  user_id: string;
  last_synced: string;
  exchange_type?: 'binance' | 'bybit' | null;
  is_testnet?: boolean;
}