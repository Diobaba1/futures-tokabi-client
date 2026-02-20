// =============================================================================
// FILE: src/api/services/tradingConfigService.ts
// =============================================================================
// Service for managing user's own trading configuration

import axiosInstance from '../axiosConfig';

export interface TradingConfig {
  id: string;
  user_id: string;
  // Position Sizing
  max_position_per_signal_percent: number;
  max_total_exposure_percent: number;
  max_position_size_usdt: number;
  min_position_size_usdt: number;
  // Risk Management
  risk_per_trade_percent: number;
  max_leverage: number;
  daily_loss_limit_percent: number;
  weekly_loss_limit_percent: number;
  max_concurrent_positions: number;
  max_trades_per_day: number;
  // Copy Trading
  auto_copy_enabled: boolean;
  min_consensus_for_auto_copy: number;
  position_size_multiplier: number;
  excluded_symbols: string[];
  included_symbols_only: string[];
  // Advanced
  use_risk_based_sizing: boolean;
  enable_breakeven_sl: boolean;
  breakeven_after_tp_level: number;
  breakeven_buffer_percent: number;
  enable_trailing_sl: boolean;
  trailing_stop_percent: number;
  trailing_activation_percent: number;
  // Status
  is_active: boolean;
  trading_paused: boolean;
  pause_reason: string | null;
  // Daily Stats
  daily_pnl_usd: number;
  daily_trade_count: number;
}

export interface TradingConfigUpdate {
  // Position Sizing
  max_position_per_signal_percent?: number;
  max_total_exposure_percent?: number;
  max_position_size_usdt?: number;
  min_position_size_usdt?: number;
  // Risk Management
  risk_per_trade_percent?: number;
  max_leverage?: number;
  daily_loss_limit_percent?: number;
  weekly_loss_limit_percent?: number;
  max_concurrent_positions?: number;
  max_trades_per_day?: number;
  // Copy Trading
  auto_copy_enabled?: boolean;
  min_consensus_for_auto_copy?: number;
  position_size_multiplier?: number;
  excluded_symbols?: string[];
  included_symbols_only?: string[];
  // Advanced
  use_risk_based_sizing?: boolean;
  enable_breakeven_sl?: boolean;
  breakeven_after_tp_level?: number;
  breakeven_buffer_percent?: number;
  enable_trailing_sl?: boolean;
  trailing_stop_percent?: number;
  trailing_activation_percent?: number;
}

export interface DailyPerformanceSnapshot {
  id: string;
  date: string;
  trades_executed: number;
  signals_received: number;
  realized_pnl_usd: number;
  unrealized_pnl_usd: number;
  fees_paid_usd: number;
  total_volume_usd: number;
  starting_balance_usd: number | null;
  ending_balance_usd: number | null;
  balance_change_percent: number | null;
  winning_trades: number;
  losing_trades: number;
  max_drawdown_percent: number | null;
}

const tradingConfigService = {
  /**
   * Get current user's trading configuration
   */
  async getMyConfig(): Promise<TradingConfig> {
    const response = await axiosInstance.get('/trading-config/');
    return response.data;
  },

  /**
   * Update current user's trading configuration
   */
  async updateMyConfig(data: TradingConfigUpdate): Promise<TradingConfig> {
    const response = await axiosInstance.put('/trading-config/', data);
    return response.data;
  },

  /**
   * Reset trading configuration to defaults
   */
  async resetConfig(): Promise<TradingConfig> {
    const response = await axiosInstance.post('/trading-config/reset');
    return response.data;
  },

  /**
   * Pause trading
   */
  async pauseTrading(reason?: string): Promise<TradingConfig> {
    const response = await axiosInstance.post('/trading-config/pause', null, {
      params: { reason: reason || 'User requested pause' }
    });
    return response.data;
  },

  /**
   * Resume trading
   */
  async resumeTrading(): Promise<TradingConfig> {
    const response = await axiosInstance.post('/trading-config/resume');
    return response.data;
  },

  /**
   * Get daily performance history
   */
  async getDailyPerformance(days: number = 30): Promise<DailyPerformanceSnapshot[]> {
    const response = await axiosInstance.get('/trading-config/performance/daily', {
      params: { days }
    });
    return response.data;
  },

  /**
   * Calculate position size preview based on current config
   */
  async calculatePositionSize(params: {
    entry_price: number;
    stop_loss_price: number;
    leverage?: number;
    available_balance?: number;
  }): Promise<{
    suggested_position_size: number;
    risk_amount: number;
    effective_leverage: number;
    quantity: number;
  }> {
    const response = await axiosInstance.post('/trading-config/calculate-position', params);
    return response.data;
  },
};

export default tradingConfigService;
