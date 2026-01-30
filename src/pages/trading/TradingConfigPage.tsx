// src/pages/trading/TradingConfigPage.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  TrendingUp,
  Shield,
  Zap,
  Save,
  RotateCcw,
  Pause,
  Play,
  AlertCircle,
  CheckCircle,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import tradingConfigService, {
  TradingConfig,
  TradingConfigUpdate,
} from '../../api/services/tradingConfigService';

const TradingConfigPage: React.FC = () => {
  const [config, setConfig] = useState<TradingConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [expandedSection, setExpandedSection] = useState<string | null>('position');

  // Form state
  const [formData, setFormData] = useState<TradingConfigUpdate>({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await tradingConfigService.getMyConfig();
      setConfig(data);
      setFormData({
        max_position_per_signal_percent: data.max_position_per_signal_percent,
        max_total_exposure_percent: data.max_total_exposure_percent,
        max_position_size_usdt: data.max_position_size_usdt,
        min_position_size_usdt: data.min_position_size_usdt,
        risk_per_trade_percent: data.risk_per_trade_percent,
        max_leverage: data.max_leverage,
        daily_loss_limit_percent: data.daily_loss_limit_percent,
        weekly_loss_limit_percent: data.weekly_loss_limit_percent,
        max_concurrent_positions: data.max_concurrent_positions,
        max_trades_per_day: data.max_trades_per_day,
        auto_copy_enabled: data.auto_copy_enabled,
        min_consensus_for_auto_copy: data.min_consensus_for_auto_copy,
        position_size_multiplier: data.position_size_multiplier,
        use_risk_based_sizing: data.use_risk_based_sizing,
        enable_breakeven_sl: data.enable_breakeven_sl,
        breakeven_after_tp_level: data.breakeven_after_tp_level,
        enable_trailing_sl: data.enable_trailing_sl,
        trailing_stop_percent: data.trailing_stop_percent,
        trailing_activation_percent: data.trailing_activation_percent,
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load trading configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof TradingConfigUpdate, value: number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      const updated = await tradingConfigService.updateMyConfig(formData);
      setConfig(updated);
      setSuccess('Trading configuration saved successfully!');
      setHasChanges(false);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      setSaving(true);
      const data = await tradingConfigService.resetConfig();
      setConfig(data);
      setFormData({
        max_position_per_signal_percent: data.max_position_per_signal_percent,
        max_total_exposure_percent: data.max_total_exposure_percent,
        max_position_size_usdt: data.max_position_size_usdt,
        min_position_size_usdt: data.min_position_size_usdt,
        risk_per_trade_percent: data.risk_per_trade_percent,
        max_leverage: data.max_leverage,
        daily_loss_limit_percent: data.daily_loss_limit_percent,
        weekly_loss_limit_percent: data.weekly_loss_limit_percent,
        max_concurrent_positions: data.max_concurrent_positions,
        max_trades_per_day: data.max_trades_per_day,
        auto_copy_enabled: data.auto_copy_enabled,
        min_consensus_for_auto_copy: data.min_consensus_for_auto_copy,
        position_size_multiplier: data.position_size_multiplier,
        use_risk_based_sizing: data.use_risk_based_sizing,
        enable_breakeven_sl: data.enable_breakeven_sl,
        breakeven_after_tp_level: data.breakeven_after_tp_level,
        enable_trailing_sl: data.enable_trailing_sl,
        trailing_stop_percent: data.trailing_stop_percent,
        trailing_activation_percent: data.trailing_activation_percent,
      });
      setSuccess('Configuration reset to defaults');
      setHasChanges(false);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to reset configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleTrading = async () => {
    try {
      setSaving(true);
      if (config?.trading_paused) {
        const data = await tradingConfigService.resumeTrading();
        setConfig(data);
        setSuccess('Trading resumed!');
      } else {
        const data = await tradingConfigService.pauseTrading('User requested pause');
        setConfig(data);
        setSuccess('Trading paused');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to toggle trading');
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Settings className="text-cyan-400" size={28} />
              Trading Configuration
            </h1>
            <p className="text-gray-400 mt-1">
              Customize your trading parameters, risk management, and auto-copy settings
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Trading Status */}
            <button
              onClick={handleToggleTrading}
              disabled={saving}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                config?.trading_paused
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                  : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30'
              }`}
            >
              {config?.trading_paused ? <Play size={18} /> : <Pause size={18} />}
              {config?.trading_paused ? 'Resume Trading' : 'Pause Trading'}
            </button>
          </div>
        </div>

        {/* Status Banner */}
        {config?.trading_paused && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-center gap-3"
          >
            <AlertCircle className="text-yellow-400" size={20} />
            <div>
              <p className="text-yellow-400 font-medium">Trading is currently paused</p>
              {config.pause_reason && (
                <p className="text-gray-400 text-sm">Reason: {config.pause_reason}</p>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Alerts */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3"
        >
          <AlertCircle className="text-red-400" size={20} />
          <p className="text-red-400">{error}</p>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-3"
        >
          <CheckCircle className="text-green-400" size={20} />
          <p className="text-green-400">{success}</p>
        </motion.div>
      )}

      {/* Daily Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Daily P&L</p>
          <p className={`text-xl font-bold ${(config?.daily_pnl_usd || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${config?.daily_pnl_usd?.toFixed(2) || '0.00'}
          </p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Trades Today</p>
          <p className="text-xl font-bold text-white">{config?.daily_trade_count || 0}</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Auto Copy</p>
          <p className={`text-xl font-bold ${config?.auto_copy_enabled ? 'text-cyan-400' : 'text-gray-500'}`}>
            {config?.auto_copy_enabled ? 'Enabled' : 'Disabled'}
          </p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Max Leverage</p>
          <p className="text-xl font-bold text-white">{config?.max_leverage || 0}x</p>
        </div>
      </div>

      {/* Configuration Sections */}
      <div className="space-y-4">
        {/* Position Sizing */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('position')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-700/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="text-cyan-400" size={20} />
              <span className="text-white font-medium">Position Sizing</span>
            </div>
            {expandedSection === 'position' ? (
              <ChevronUp className="text-gray-400" size={20} />
            ) : (
              <ChevronDown className="text-gray-400" size={20} />
            )}
          </button>
          {expandedSection === 'position' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-gray-400 text-sm mb-1">Max Position Per Signal (%)</label>
                <input
                  type="number"
                  value={formData.max_position_per_signal_percent || ''}
                  onChange={(e) => handleInputChange('max_position_per_signal_percent', parseFloat(e.target.value))}
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Max Total Exposure (%)</label>
                <input
                  type="number"
                  value={formData.max_total_exposure_percent || ''}
                  onChange={(e) => handleInputChange('max_total_exposure_percent', parseFloat(e.target.value))}
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Max Position Size (USDT)</label>
                <input
                  type="number"
                  value={formData.max_position_size_usdt || ''}
                  onChange={(e) => handleInputChange('max_position_size_usdt', parseFloat(e.target.value))}
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Min Position Size (USDT)</label>
                <input
                  type="number"
                  value={formData.min_position_size_usdt || ''}
                  onChange={(e) => handleInputChange('min_position_size_usdt', parseFloat(e.target.value))}
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Position Size Multiplier</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.position_size_multiplier || ''}
                  onChange={(e) => handleInputChange('position_size_multiplier', parseFloat(e.target.value))}
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.use_risk_based_sizing || false}
                    onChange={(e) => handleInputChange('use_risk_based_sizing', e.target.checked)}
                    className="w-5 h-5 rounded border-gray-600 bg-gray-900 text-cyan-500 focus:ring-cyan-500"
                  />
                  <span className="text-white">Use Risk-Based Sizing</span>
                </label>
              </div>
            </motion.div>
          )}
        </div>

        {/* Risk Management */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('risk')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-700/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Shield className="text-cyan-400" size={20} />
              <span className="text-white font-medium">Risk Management</span>
            </div>
            {expandedSection === 'risk' ? (
              <ChevronUp className="text-gray-400" size={20} />
            ) : (
              <ChevronDown className="text-gray-400" size={20} />
            )}
          </button>
          {expandedSection === 'risk' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-gray-400 text-sm mb-1">Risk Per Trade (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.risk_per_trade_percent || ''}
                  onChange={(e) => handleInputChange('risk_per_trade_percent', parseFloat(e.target.value))}
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Max Leverage</label>
                <input
                  type="number"
                  value={formData.max_leverage || ''}
                  onChange={(e) => handleInputChange('max_leverage', parseInt(e.target.value))}
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Daily Loss Limit (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.daily_loss_limit_percent || ''}
                  onChange={(e) => handleInputChange('daily_loss_limit_percent', parseFloat(e.target.value))}
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Weekly Loss Limit (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weekly_loss_limit_percent || ''}
                  onChange={(e) => handleInputChange('weekly_loss_limit_percent', parseFloat(e.target.value))}
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Max Concurrent Positions</label>
                <input
                  type="number"
                  value={formData.max_concurrent_positions || ''}
                  onChange={(e) => handleInputChange('max_concurrent_positions', parseInt(e.target.value))}
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Max Trades Per Day</label>
                <input
                  type="number"
                  value={formData.max_trades_per_day || ''}
                  onChange={(e) => handleInputChange('max_trades_per_day', parseInt(e.target.value))}
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Auto Copy Settings */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('autocopy')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-700/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Zap className="text-cyan-400" size={20} />
              <span className="text-white font-medium">Auto Copy Settings</span>
            </div>
            {expandedSection === 'autocopy' ? (
              <ChevronUp className="text-gray-400" size={20} />
            ) : (
              <ChevronDown className="text-gray-400" size={20} />
            )}
          </button>
          {expandedSection === 'autocopy' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="p-4 pt-0 space-y-4"
            >
              <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">Enable Auto Copy</p>
                  <p className="text-gray-400 text-sm">Automatically copy signals when consensus is met</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.auto_copy_enabled || false}
                    onChange={(e) => handleInputChange('auto_copy_enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Min Consensus for Auto Copy</label>
                  <input
                    type="number"
                    value={formData.min_consensus_for_auto_copy || ''}
                    onChange={(e) => handleInputChange('min_consensus_for_auto_copy', parseInt(e.target.value))}
                    className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Advanced Settings */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('advanced')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-700/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Settings className="text-cyan-400" size={20} />
              <span className="text-white font-medium">Advanced Settings</span>
            </div>
            {expandedSection === 'advanced' ? (
              <ChevronUp className="text-gray-400" size={20} />
            ) : (
              <ChevronDown className="text-gray-400" size={20} />
            )}
          </button>
          {expandedSection === 'advanced' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="p-4 pt-0 space-y-4"
            >
              {/* Breakeven SL */}
              <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">Enable Breakeven Stop Loss</p>
                  <p className="text-gray-400 text-sm">Move SL to breakeven after hitting TP level</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enable_breakeven_sl || false}
                    onChange={(e) => handleInputChange('enable_breakeven_sl', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>
              {formData.enable_breakeven_sl && (
                <div className="pl-4">
                  <label className="block text-gray-400 text-sm mb-1">Breakeven After TP Level</label>
                  <input
                    type="number"
                    value={formData.breakeven_after_tp_level || ''}
                    onChange={(e) => handleInputChange('breakeven_after_tp_level', parseInt(e.target.value))}
                    className="w-full md:w-1/2 bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              )}

              {/* Trailing SL */}
              <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">Enable Trailing Stop Loss</p>
                  <p className="text-gray-400 text-sm">Automatically trail your stop loss as price moves</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enable_trailing_sl || false}
                    onChange={(e) => handleInputChange('enable_trailing_sl', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>
              {formData.enable_trailing_sl && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Trailing Stop (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.trailing_stop_percent || ''}
                      onChange={(e) => handleInputChange('trailing_stop_percent', parseFloat(e.target.value))}
                      className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Trailing Activation (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.trailing_activation_percent || ''}
                      onChange={(e) => handleInputChange('trailing_activation_percent', parseFloat(e.target.value))}
                      className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-80 bg-gray-900/95 border-t border-gray-700 p-4 z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            {hasChanges && (
              <span className="text-yellow-400 text-sm flex items-center gap-1">
                <Info size={16} />
                You have unsaved changes
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
            >
              <RotateCcw size={18} />
              Reset to Defaults
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl font-medium transition-all ${
                hasChanges
                  ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              {saving ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <Save size={18} />
              )}
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingConfigPage;
