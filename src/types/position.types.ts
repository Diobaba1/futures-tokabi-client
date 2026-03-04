export interface ActivePosition {
  execution_id: string;
  execution_type: 'signal' | 'ai_signal';
  signal_id: string;
  api_key_id: string | null;
  exchange_type: string;
  is_testnet: boolean | null;
  symbol: string;
  side: string;
  entry_price: number | null;
  quantity: number | null;
  remaining_quantity: number | null;
  leverage: number;
  position_size_usdt: number | null;
  stop_loss_price: number | null;
  stop_loss_order_id: string | null;
  take_profit_orders: any[] | null;
  sl_moved_to_breakeven: boolean;
  tp_hits: Record<string, any> | null;
  current_price: number | null;
  unrealized_pnl: number | null;
  unrealized_pnl_percent: number | null;
  position_exists_on_exchange: boolean | null;
  created_at: string | null;
  executed_at: string | null;
}

export interface ActivePositionsResponse {
  items: ActivePosition[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
  total_positions: number;
  total_exposure_usdt: number;
  total_unrealized_pnl: number;
}

export interface ClosePositionResult {
  success: boolean;
  execution_id: string;
  symbol: string;
  close_side?: string;
  quantity?: number;
  exit_price?: number;
  exit_order_id?: string;
  realized_pnl?: number;
  orders_cancelled?: number;
  error: string | null;
}
