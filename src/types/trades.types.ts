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

// ============================================================================
// EXCHANGE TRADE HISTORY TYPES
// ============================================================================

export interface ExchangeTrade {
  id: string;
  order_id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  position_side?: string;
  price: number;
  quantity: number;
  quote_quantity: number;
  commission: number;
  commission_asset: string;
  realized_pnl: number;
  time: string;
  is_maker: boolean;
  exchange: 'binance' | 'bybit';
}

export interface ExchangeOrder {
  order_id: string;
  client_order_id?: string;
  symbol: string;
  side: string;
  position_side?: string;
  type: string;
  status: string;
  price: number;
  avg_price: number;
  stop_price?: number;
  quantity: number;
  filled_quantity: number;
  reduce_only: boolean;
  time: string;
  update_time?: string;
  exchange: 'binance' | 'bybit';
}

export interface ExchangeHistorySummary {
  total_pnl: number;
  total_fees: number;
  total_volume: number;
  unique_symbols: number;
}

export interface ExchangeHistoryResponse {
  trades: ExchangeTrade[];
  orders: ExchangeOrder[];
  total_trades: number;
  total_orders: number;
  exchange: string;
  is_testnet: boolean;
  fetched_at: string;
  summary: ExchangeHistorySummary;
}

export interface ExchangeOpenOrdersResponse {
  orders: ExchangeOrder[];
  total: number;
  exchange: string;
  is_testnet: boolean;
  fetched_at: string;
}