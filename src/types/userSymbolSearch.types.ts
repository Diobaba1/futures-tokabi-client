// FILE: src/types/userSymbolSearch.types.ts

export interface UserSymbolSearchRequest {
  symbols: string[];
}

export interface RateLimitInfo {
  searches_remaining: number;
  reset_time: string;
  limit_per_4h: number;
}

export type AnalysisStatus = 'pending' | 'success' | 'error';
export type ViewMode = 'search' | 'history' | 'detail';
export type SearchStatus = 'pending' | 'processing' | 'completed' | 'failed';

// Simplified analysis result matching backend changes
export interface SymbolAnalysisResult {
  symbol: string;
  status: AnalysisStatus;
  final_decision?: 'long' | 'short' | 'hold' | null;
  consensus_strength?: number | null;
  risk_metrics?: {
    entry_price: number | null;
    stop_loss_price: number | null;
    take_profit_price: number | null;  // Single TP only
    estimated_sl_percent: number | null;
    estimated_tp_percent: number | null;
    risk_reward_ratio: number | null;
    suggested_leverage: number | null;
  } | null;
  market_data_summary?: {
    current_price: number;
    price_change_24h: number;
    volume_24h: number;
    high_24h?: number;
    low_24h?: number;
  };
  indicators_summary?: {
    rsi: number;
    macd: number;
    signal_line: number;
    atr: number;
    trend: 'bullish' | 'bearish' | 'neutral';
  };
  error?: string;
  timestamp: string;
}

export interface UserSymbolSearchDetail {
  search_id: string;
  user_id: string | null;
  symbols: string[];
  analysis_results: SymbolAnalysisResult[];
  celery_task_id: string | null;
  search_count: number;
  created_at: string;
  status: SearchStatus;
  has_results: boolean;
  rate_limit_info: RateLimitInfo;
}

export interface UserSymbolSearchResponse {
  search_id: string;
  user_id: string | null;
  symbols: string[];
  analysis_results: SymbolAnalysisResult[] | null;
  celery_task_id: string | null;
  search_count: number;
  created_at: string;
  rate_limit_info: RateLimitInfo;
}

export interface SearchHistoryItem {
  id: string;
  symbols: string[];
  search_count: number;
  created_at: string;
  analysis_results: SymbolAnalysisResult[] | null;
  has_results: boolean;
}

export interface SearchHistoryResponse {
  user_id: string;
  search_history: SearchHistoryItem[];
  total_searches: number;
}

export interface SymbolSearchState {
  symbols: string[];
  isLoading: boolean;
  error: string | null;
  currentSearch: UserSymbolSearchResponse | null;
  searchHistory: SearchHistoryItem[];
  rateLimit: RateLimitInfo | null;
  selectedSearchDetail: UserSymbolSearchDetail | null;
  viewMode: ViewMode;
}