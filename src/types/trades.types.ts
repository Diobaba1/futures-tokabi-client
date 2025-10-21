// src/types/trades.types.ts
export interface TradeBase {
  symbol: string;
  side: 'long' | 'short';
  entry_price: number;
  quantity: number;
  leverage: number;
  take_profit_price?: number;
  stop_loss_price?: number;
  status: 'open' | 'closed';
  exit_reason?: string;
  realized_pnl_usd?: number;
  realized_pnl_percent?: number;
}

export interface CreateTradeRequest extends TradeBase {
  // Additional fields for creation if needed
}

export interface UpdateTradeRequest {
  take_profit_price?: number;
  stop_loss_price?: number;
  status?: 'open' | 'closed';
  exit_reason?: string;
}

export interface TradeDetailResponse extends TradeBase {
  id: string;
  user_id: string;
  created_at: string;
  opened_at?: string;
  closed_at?: string;
}

export interface TradeListResponse {
  trades: TradeDetailResponse[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
  };
}