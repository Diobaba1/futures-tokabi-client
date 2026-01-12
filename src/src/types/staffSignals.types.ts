// ============================================================================
// FILE: src/types/staffSignals.types.ts
// ============================================================================

/**
 * Order type enumeration
 */
export type OrderType = "limit" | "market";

/**
 * Position type enumeration
 */
export type PositionType = "buy" | "sell";

/**
 * Staff signal status enumeration
 */
export type StaffSignalStatus =
  | "active"
  | "inactive"
  | "executed"
  | "cancelled"
  | "expired";

// =============================================================================
// Take Profit Types
// =============================================================================

export interface TakeProfit {
  level: number;
  price: number;
  percentage?: number | null;
  hit: boolean;
  hit_at?: string | null;
}

// =============================================================================
// Request Types
// =============================================================================

export interface StaffSignalCreateRequest {
  symbol: string;
  position_type: PositionType;
  order_type: OrderType;
  current_price: number;
  entry_price: number;
  stop_loss: number;
  take_profits: number[];
  leverage?: number;
  notes?: string;
  expires_in_hours?: number;
  risk_percentage?: number;
}

export interface StaffSignalUpdateRequest {
  symbol?: string;
  position_type?: PositionType;
  order_type?: OrderType;
  current_price?: number;
  entry_price?: number;
  stop_loss?: number;
  take_profits?: number[];
  leverage?: number;
  notes?: string;
  status?: StaffSignalStatus;
  expires_at?: string;
  risk_percentage?: number;
}

export interface StaffSignalStatusUpdateRequest {
  status: StaffSignalStatus;
  reason?: string;
}

export interface MarkTakeProfitHitRequest {
  tp_level: number;
  hit_price?: number;
}

// =============================================================================
// Response Types
// =============================================================================

export interface StaffSignalResponse {
  id: string;
  symbol: string;
  position_type: string;
  order_type: string;
  current_price: number;
  entry_price: number;
  stop_loss: number;
  take_profits: TakeProfit[];
  leverage: number;
  notes?: string | null;
  status: string;
  risk_percentage?: number | null;
  risk_reward_ratio?: number | null;
  created_by_id: string;
  created_by_name?: string | null;
  updated_by_id?: string | null;
  created_at: string;
  updated_at?: string | null;
  expires_at?: string | null;
  tps_hit: number;
  sl_hit: boolean;
}

export interface StaffSignalDetailResponse extends StaffSignalResponse {
  update_history?: UpdateHistoryEntry[] | null;
  execution_notes?: string | null;
}

export interface UpdateHistoryEntry {
  updated_by: string;
  updated_at: string;
  changes: Record<string, any>; // Can be direct values or { old, new } format
}

export interface StaffSignalListResponse {
  signals: StaffSignalResponse[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface StaffSignalStatsResponse {
  period_days: number;
  total_signals: number;
  by_status: Record<string, number>;
  by_position: Record<string, number>;
  by_symbol: Record<string, number>;
  tp_hit_rate: number;
  sl_hit_rate: number;
  total_tps: number;
  hit_tps: number;
  sl_hits: number;
}

// =============================================================================
// Filter Types
// =============================================================================

export interface StaffSignalFilterParams {
  symbol?: string;
  position_type?: PositionType;
  order_type?: OrderType;
  status?: StaffSignalStatus;
  created_by_id?: string;
  start_date?: string;
  end_date?: string;
  active_only?: boolean;
  page?: number;
  page_size?: number;
}

// =============================================================================
// Form Types (for UI)
// =============================================================================

export interface StaffSignalFormData {
  symbol: string;
  position_type: PositionType;
  order_type: OrderType;
  current_price: string;
  entry_price: string;
  stop_loss: string;
  tp1: string;
  tp2: string;
  tp3: string;
  tp4: string;
  tp5?: string;
  leverage: string;
  notes: string;
  expires_in_hours: string;
  risk_percentage: string;
}

// =============================================================================
// UI Helper Types
// =============================================================================

export interface SignalCardProps {
  signal: StaffSignalResponse;
  onEdit?: (signal: StaffSignalResponse) => void;
  onDeactivate?: (signalId: string) => void;
  onActivate?: (signalId: string) => void;
  onMarkTpHit?: (signalId: string, tpLevel: number) => void;
  onMarkSlHit?: (signalId: string) => void;
  onViewDetails?: (signalId: string) => void;
}

export type SignalActionType =
  | "create"
  | "edit"
  | "deactivate"
  | "activate"
  | "mark_tp"
  | "mark_sl"
  | "view";