// src/pages/trading/TradingConfigPage.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  HelpCircle,
  Target,
  Scale,
  Gauge,
  Layers,
  Activity,
  Lock,
  AlertTriangle,
  Timer,
} from 'lucide-react';
import tradingConfigService, {
  TradingConfig,
  TradingConfigUpdate,
} from '../../api/services/tradingConfigService';

type RiskPreset = 'conservative' | 'moderate' | 'aggressive';

// ============================================================================
// Tooltip
// ============================================================================
const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-flex items-center">
      <div onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} className="cursor-help">
        {children}
      </div>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl text-sm text-gray-300 whitespace-nowrap max-w-xs"
          >
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
              <div className="border-8 border-transparent border-t-gray-900" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// SliderInput — supports read-only mode for conservative/moderate
// ============================================================================
interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  tooltip?: string;
  recommended?: { min: number; max: number };
  color?: 'cyan' | 'green' | 'yellow' | 'red';
  disabled?: boolean;
}

const SliderInput: React.FC<SliderInputProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = '',
  tooltip,
  recommended,
  color = 'cyan',
  disabled = false,
}) => {
  const safeMax = max > 0 ? max : 1;
  const safeMin = min ?? 0;
  const percentage = Math.min(100, Math.max(0, ((value - safeMin) / (safeMax - safeMin)) * 100));

  const colorClasses = {
    cyan: 'from-cyan-500 to-cyan-400',
    green: 'from-green-500 to-green-400',
    yellow: 'from-yellow-500 to-yellow-400',
    red: 'from-red-500 to-red-400',
  };

  if (disabled) {
    return (
      <div className="space-y-2 opacity-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm font-medium">{label}</span>
            {tooltip && (
              <Tooltip text={tooltip}>
                <HelpCircle size={14} className="text-gray-600" />
              </Tooltip>
            )}
          </div>
          <span className="text-gray-400 text-sm font-mono">
            {value}{unit}
          </span>
        </div>
        <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${colorClasses[color]} rounded-full opacity-40`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }

  const isInRecommendedRange = recommended ? value >= recommended.min && value <= recommended.max : true;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-gray-300 text-sm font-medium">{label}</span>
          {tooltip && (
            <Tooltip text={tooltip}>
              <HelpCircle size={14} className="text-gray-500 hover:text-gray-400" />
            </Tooltip>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            step={step}
            className="w-20 bg-gray-800/50 border border-gray-600 rounded-lg px-2 py-1 text-white text-right text-sm focus:border-cyan-500 focus:outline-none"
          />
          {unit && <span className="text-gray-400 text-sm min-w-[30px]">{unit}</span>}
        </div>
      </div>
      <div className="relative">
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${colorClasses[color]} rounded-full`}
            initial={false}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
        <input
          type="range"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          min={safeMin}
          max={safeMax}
          step={step}
          className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
        />
      </div>
      {recommended && (
        <div className="flex items-center gap-1 text-xs">
          <span className={isInRecommendedRange ? 'text-green-400' : 'text-yellow-400'}>
            {isInRecommendedRange ? '✓' : '⚠'}
          </span>
          <span className="text-gray-500">
            Recommended: {recommended.min}{unit} – {recommended.max}{unit}
          </span>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// ToggleSwitch — supports read-only mode
// ============================================================================
interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  enabled,
  onChange,
  label,
  description,
  icon,
  disabled = false,
}) => (
  <div
    onClick={() => !disabled && onChange(!enabled)}
    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
      disabled
        ? 'opacity-50 cursor-not-allowed bg-gray-800/20 border-gray-700/30'
        : enabled
        ? 'bg-cyan-500/10 border-cyan-500/30 cursor-pointer'
        : 'bg-gray-800/30 border-gray-700/50 hover:border-gray-600 cursor-pointer'
    }`}
  >
    <div className="flex items-center gap-3">
      {icon && (
        <div className={`p-2 rounded-lg ${enabled && !disabled ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-700/50 text-gray-400'}`}>
          {icon}
        </div>
      )}
      <div>
        <p className={`font-medium ${enabled && !disabled ? 'text-white' : 'text-gray-300'}`}>{label}</p>
        {description && <p className="text-gray-500 text-sm">{description}</p>}
      </div>
    </div>
    <div className="flex items-center gap-3">
      <span className={`text-sm font-medium ${enabled && !disabled ? 'text-cyan-400' : 'text-gray-500'}`}>
        {enabled ? 'ON' : 'OFF'}
      </span>
      <div className={`relative w-12 h-6 rounded-full transition-colors ${enabled && !disabled ? 'bg-cyan-500' : 'bg-gray-600'}`}>
        <motion.div
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
          initial={false}
          animate={{ left: enabled ? '28px' : '4px' }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </div>
    </div>
  </div>
);

// ============================================================================
// Aggressive Warning Banner — stays for at least 3 minutes
// ============================================================================
const AggressiveWarningBanner: React.FC<{ secondsLeft: number }> = ({ secondsLeft }) => {
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const countdown = `${mins}:${secs.toString().padStart(2, '0')}`;
  const isCountingDown = secondsLeft > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="mb-6 rounded-2xl border-2 border-red-500/60 bg-gradient-to-br from-red-950/80 to-orange-950/60 overflow-hidden shadow-2xl shadow-red-900/30"
    >
      {/* Top stripe */}
      <div className="h-1.5 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 animate-pulse" />

      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 p-3 rounded-xl bg-red-500/20 border border-red-500/30">
            <AlertTriangle className="text-red-400" size={28} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
              <h3 className="text-red-300 font-bold text-lg tracking-wide uppercase">
                ⚠ Aggressive Strategy — High Risk Warning
              </h3>
              {isCountingDown && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-900/60 border border-red-500/40 rounded-lg">
                  <Timer className="text-red-400" size={16} />
                  <span className="text-red-300 font-mono font-bold text-sm">{countdown}</span>
                  <span className="text-red-400 text-xs">remaining</span>
                </div>
              )}
            </div>

            <div className="space-y-2 text-sm text-red-200/80 mb-4">
              <p className="font-semibold text-red-200">
                You have switched to Aggressive mode. Please read this warning carefully before proceeding.
              </p>
              <ul className="space-y-1.5 list-none">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5 flex-shrink-0">▸</span>
                  <span>Aggressive settings allow <strong className="text-red-300">high leverage, large position sizes, and wide loss limits</strong> that can lead to rapid account drawdown.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5 flex-shrink-0">▸</span>
                  <span>There are <strong className="text-red-300">no enforced limits</strong> on this mode. You are solely responsible for the values you set.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5 flex-shrink-0">▸</span>
                  <span>A single losing trade at high leverage can wipe out a significant portion of your account or trigger liquidation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5 flex-shrink-0">▸</span>
                  <span>Tokabi and its staff are <strong className="text-red-300">not liable for losses</strong> incurred while using Aggressive mode.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5 flex-shrink-0">▸</span>
                  <span>Only use this mode if you fully understand the risks of leveraged crypto trading and can afford to lose your invested capital.</span>
                </li>
              </ul>
            </div>

            <div className={`px-4 py-2 rounded-lg text-xs font-medium ${isCountingDown ? 'bg-red-900/40 text-red-300' : 'bg-orange-900/40 text-orange-300'}`}>
              {isCountingDown
                ? `This warning will remain visible for ${countdown} to ensure you have read and understood the risks.`
                : 'You have had sufficient time to review this warning. Proceed with extreme caution.'}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// Risk Meter
// ============================================================================
const RiskMeter: React.FC<{ riskLevel: number }> = ({ riskLevel }) => {
  const getRiskInfo = (level: number) => {
    if (level <= 30) return { label: 'Conservative', color: 'text-green-400', bg: 'bg-green-500' };
    if (level <= 60) return { label: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-500' };
    return { label: 'Aggressive', color: 'text-red-400', bg: 'bg-red-500' };
  };
  const riskInfo = getRiskInfo(riskLevel);
  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Gauge className="text-cyan-400" size={20} />
          <span className="text-white font-medium">Risk Profile</span>
        </div>
        <span className={`text-sm font-bold ${riskInfo.color}`}>{riskInfo.label}</span>
      </div>
      <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
        <div className="absolute inset-0 flex">
          <div className="w-1/3 bg-gradient-to-r from-green-600 to-green-500 opacity-30" />
          <div className="w-1/3 bg-gradient-to-r from-yellow-600 to-yellow-500 opacity-30" />
          <div className="w-1/3 bg-gradient-to-r from-red-600 to-red-500 opacity-30" />
        </div>
        <motion.div
          className={`absolute top-0 left-0 h-full ${riskInfo.bg} rounded-full`}
          initial={false}
          animate={{ width: `${riskLevel}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>Low Risk</span>
        <span>High Risk</span>
      </div>
    </div>
  );
};

// ============================================================================
// Preset Button
// ============================================================================
interface PresetButtonProps {
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  borderColor: string;
  onClick: () => void;
  isActive?: boolean;
  locked?: boolean;
}

const PresetButton: React.FC<PresetButtonProps> = ({
  label, description, icon, color, borderColor, onClick, isActive, locked,
}) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`flex-1 p-4 rounded-xl border transition-all text-left relative overflow-hidden ${
      isActive
        ? `bg-${color}-500/20 border-${borderColor}`
        : 'bg-gray-800/30 border-gray-700/50 hover:border-gray-600'
    }`}
  >
    {locked && isActive && (
      <div className="absolute top-2 right-2">
        <Lock size={14} className="text-gray-400" />
      </div>
    )}
    <div className={`inline-flex p-2 rounded-lg mb-2 ${isActive ? `bg-${color}-500/20` : 'bg-gray-700/50'}`}>
      <span className={isActive ? `text-${color}-400` : 'text-gray-400'}>{icon}</span>
    </div>
    <p className={`font-medium ${isActive ? 'text-white' : 'text-gray-300'}`}>{label}</p>
    <p className="text-gray-500 text-xs mt-1">{description}</p>
    {locked && (
      <p className="text-gray-600 text-xs mt-1 flex items-center gap-1">
        <Lock size={10} /> Fixed preset — read only
      </p>
    )}
  </motion.button>
);

// ============================================================================
// Stat Card
// ============================================================================
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, trend, color = 'cyan' }) => {
  const trendColors = { up: 'text-green-400', down: 'text-red-400', neutral: 'text-gray-400' };
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-gradient-to-br from-gray-800/80 to-gray-800/40 border border-gray-700/50 rounded-2xl p-5 backdrop-blur-sm"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{label}</p>
          <p className={`text-2xl font-bold ${trend ? trendColors[trend] : `text-${color}-400`}`}>
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-xl bg-${color}-500/10`}>
          <span className={`text-${color}-400`}>{icon}</span>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// Section Card
// ============================================================================
interface SectionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  color?: string;
  locked?: boolean;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, description, icon, children, color = 'cyan', locked }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-gradient-to-br from-gray-800/60 to-gray-900/60 border rounded-2xl overflow-hidden backdrop-blur-sm ${
      locked ? 'border-gray-700/30' : 'border-gray-700/50'
    }`}
  >
    <div className={`px-6 py-4 border-b border-gray-700/50 bg-gradient-to-r from-${color}-500/5 to-transparent`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl bg-${color}-500/10`}>
            <span className={`text-${color}-400`}>{icon}</span>
          </div>
          <div>
            <h3 className="text-white font-semibold">{title}</h3>
            <p className="text-gray-500 text-sm">{description}</p>
          </div>
        </div>
        {locked && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-700/50 rounded-lg">
            <Lock size={12} className="text-gray-400" />
            <span className="text-gray-400 text-xs">Read only</span>
          </div>
        )}
      </div>
    </div>
    <div className={`p-6 ${locked ? 'bg-gray-900/20' : ''}`}>{children}</div>
  </motion.div>
);

// ============================================================================
// Main Page
// ============================================================================
const AGGRESSIVE_WARNING_SECONDS = 180; // 3 minutes

const PRESETS = {
  conservative: {
    max_position_per_signal_percent: 2,
    max_total_exposure_percent: 10,
    risk_per_trade_percent: 1,
    max_leverage: 5,
    daily_loss_limit_percent: 3,
    weekly_loss_limit_percent: 10,
    max_concurrent_positions: 3,
    max_trades_per_day: 5,
  },
  moderate: {
    max_position_per_signal_percent: 5,
    max_total_exposure_percent: 25,
    risk_per_trade_percent: 2,
    max_leverage: 10,
    daily_loss_limit_percent: 5,
    weekly_loss_limit_percent: 15,
    max_concurrent_positions: 5,
    max_trades_per_day: 10,
  },
  aggressive: {
    max_position_per_signal_percent: 10,
    max_total_exposure_percent: 50,
    risk_per_trade_percent: 5,
    max_leverage: 20,
    daily_loss_limit_percent: 10,
    weekly_loss_limit_percent: 25,
    max_concurrent_positions: 10,
    max_trades_per_day: 20,
  },
};

function computeRiskLevelFromValues(leverage: number, exposure: number, riskPerTrade: number): number {
  const leverageScore = Math.min((leverage / 20) * 40, 40);
  const exposureScore = Math.min((exposure / 50) * 30, 30);
  const riskScore = Math.min((riskPerTrade / 5) * 30, 30);
  return Math.round(leverageScore + exposureScore + riskScore);
}

function detectPreset(level: number): RiskPreset {
  if (level <= 30) return 'conservative';
  if (level <= 60) return 'moderate';
  return 'aggressive';
}

const TradingConfigPage: React.FC = () => {
  const [config, setConfig] = useState<TradingConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [formData, setFormData] = useState<TradingConfigUpdate>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Preset / read-only state
  const [activePreset, setActivePreset] = useState<RiskPreset>('conservative');
  const [warningSecondsLeft, setWarningSecondsLeft] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const warningStartRef = useRef<number | null>(null);

  const isReadOnly = activePreset !== 'aggressive';

  // Warning countdown effect
  useEffect(() => {
    if (!showWarning) return;
    warningStartRef.current = Date.now();
    setWarningSecondsLeft(AGGRESSIVE_WARNING_SECONDS);

    const interval = setInterval(() => {
      const elapsed = (Date.now() - (warningStartRef.current ?? Date.now())) / 1000;
      const remaining = Math.max(0, AGGRESSIVE_WARNING_SECONDS - elapsed);
      setWarningSecondsLeft(Math.ceil(remaining));
    }, 500);

    return () => clearInterval(interval);
  }, [showWarning]);

  // Auto-clear success/error
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => { setSuccess(''); setError(''); }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await tradingConfigService.getMyConfig();
      setConfig(data);
      const fd: TradingConfigUpdate = {
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
      };
      setFormData(fd);

      // Detect which preset the loaded config corresponds to
      const level = computeRiskLevelFromValues(
        data.max_leverage,
        data.max_total_exposure_percent,
        data.risk_per_trade_percent,
      );
      setActivePreset(detectPreset(level));
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      setError(e.response?.data?.detail || 'Failed to load trading configuration');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchConfig(); }, []);

  const handleInputChange = useCallback((field: keyof TradingConfigUpdate, value: number | boolean) => {
    if (isReadOnly) return;
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  }, [isReadOnly]);

  const applyPreset = (preset: RiskPreset) => {
    if (preset === 'aggressive') {
      setActivePreset('aggressive');
      setShowWarning(true);
    } else {
      setActivePreset(preset);
      setShowWarning(false);
    }
    setFormData(prev => ({ ...prev, ...PRESETS[preset] }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      const updated = await tradingConfigService.updateMyConfig({
        ...formData,
        risk_level: activePreset,
      } as TradingConfigUpdate);
      setConfig(updated);
      setSuccess('Trading configuration saved successfully!');
      setHasChanges(false);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      setError(e.response?.data?.detail || 'Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      setSaving(true);
      const data = await tradingConfigService.resetConfig();
      setConfig(data);
      const fd: TradingConfigUpdate = {
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
      };
      setFormData(fd);
      const level = computeRiskLevelFromValues(
        data.max_leverage, data.max_total_exposure_percent, data.risk_per_trade_percent,
      );
      setActivePreset(detectPreset(level));
      setShowWarning(false);
      setSuccess('Configuration reset to defaults');
      setHasChanges(false);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      setError(e.response?.data?.detail || 'Failed to reset configuration');
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
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      setError(e.response?.data?.detail || 'Failed to toggle trading');
    } finally {
      setSaving(false);
    }
  };

  const calculateRiskLevel = (): number =>
    computeRiskLevelFromValues(
      formData.max_leverage || 1,
      formData.max_total_exposure_percent || 0,
      formData.risk_per_trade_percent || 0,
    );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-700 border-t-cyan-500" />
            <Settings className="absolute inset-0 m-auto text-cyan-400" size={24} />
          </div>
          <p className="text-gray-400">Loading configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                <Settings className="text-cyan-400" size={28} />
              </div>
              Trading Configuration
            </h1>
            <p className="text-gray-400 mt-2 max-w-xl">
              Customize your trading parameters, risk management, and automation settings.
              {isReadOnly && (
                <span className="ml-2 text-yellow-400 text-sm">
                  Switch to <strong>Aggressive</strong> to edit individual parameters.
                </span>
              )}
            </p>
          </div>
          <motion.button
            onClick={handleToggleTrading}
            disabled={saving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all shadow-lg ${
              config?.trading_paused
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
                : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600'
            }`}
          >
            {config?.trading_paused ? <Play size={20} /> : <Pause size={20} />}
            {config?.trading_paused ? 'Resume Trading' : 'Pause Trading'}
          </motion.button>
        </div>

        <AnimatePresence>
          {config?.trading_paused && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl flex items-center gap-3"
            >
              <AlertCircle className="text-yellow-400 flex-shrink-0" size={24} />
              <div>
                <p className="text-yellow-400 font-semibold">Trading is currently paused</p>
                {config.pause_reason && (
                  <p className="text-gray-400 text-sm">Reason: {config.pause_reason}</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Aggressive Warning Banner */}
      <AnimatePresence>
        {showWarning && (
          <AggressiveWarningBanner secondsLeft={warningSecondsLeft} />
        )}
      </AnimatePresence>

      {/* Alerts */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3"
          >
            <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
            <p className="text-red-400">{error}</p>
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-3"
          >
            <CheckCircle className="text-green-400 flex-shrink-0" size={20} />
            <p className="text-green-400">{success}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Daily P&L"
          value={`$${config?.daily_pnl_usd?.toFixed(2) || '0.00'}`}
          icon={<TrendingUp size={20} />}
          trend={(config?.daily_pnl_usd || 0) >= 0 ? 'up' : 'down'}
        />
        <StatCard
          label="Trades Today"
          value={config?.daily_trade_count || 0}
          icon={<Activity size={20} />}
          color="blue"
        />
        <StatCard
          label="Auto Copy"
          value={config?.auto_copy_enabled ? 'Active' : 'Off'}
          icon={<Zap size={20} />}
          color={config?.auto_copy_enabled ? 'green' : 'gray'}
        />
        <StatCard
          label="Max Leverage"
          value={`${config?.max_leverage || 0}x`}
          icon={<Scale size={20} />}
          color="yellow"
        />
      </div>

      {/* Risk Meter & Presets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1">
          <RiskMeter riskLevel={calculateRiskLevel()} />
        </div>
        <div className="lg:col-span-2 bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="text-cyan-400" size={20} />
            <span className="text-white font-medium">Strategy Presets</span>
            <Tooltip text="Conservative and Moderate are fixed presets. Only Aggressive can be customized.">
              <HelpCircle size={14} className="text-gray-500" />
            </Tooltip>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <PresetButton
              label="Conservative"
              description="Lower risk, steady growth"
              icon={<Shield size={18} />}
              color="green"
              borderColor="green-500/50"
              onClick={() => applyPreset('conservative')}
              isActive={activePreset === 'conservative'}
              locked
            />
            <PresetButton
              label="Moderate"
              description="Balanced risk / reward"
              icon={<Scale size={18} />}
              color="yellow"
              borderColor="yellow-500/50"
              onClick={() => applyPreset('moderate')}
              isActive={activePreset === 'moderate'}
              locked
            />
            <PresetButton
              label="Aggressive"
              description="Custom — high risk, max potential"
              icon={<Zap size={18} />}
              color="red"
              borderColor="red-500/50"
              onClick={() => applyPreset('aggressive')}
              isActive={activePreset === 'aggressive'}
            />
          </div>

          {isReadOnly && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 flex items-center gap-2 p-3 bg-gray-700/30 border border-gray-600/30 rounded-xl"
            >
              <Lock size={14} className="text-gray-400 flex-shrink-0" />
              <p className="text-gray-400 text-sm">
                <strong className="text-gray-300">{activePreset === 'conservative' ? 'Conservative' : 'Moderate'}</strong> is a fixed preset.
                Individual parameters are read-only. Select <strong className="text-red-400">Aggressive</strong> to unlock custom values.
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Configuration Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Position Sizing */}
        <SectionCard
          title="Position Sizing"
          description="Control your position sizes and exposure"
          icon={<TrendingUp size={20} />}
          color="cyan"
          locked={isReadOnly}
        >
          <div className="space-y-6">
            <SliderInput
              label="Max Position Per Signal"
              value={formData.max_position_per_signal_percent || 0}
              onChange={(v) => handleInputChange('max_position_per_signal_percent', v)}
              min={0.1}
              max={isReadOnly ? 100 : 9999}
              step={0.5}
              unit="%"
              tooltip="Maximum percentage of your balance to use per signal"
              recommended={isReadOnly ? undefined : { min: 2, max: 5 }}
              disabled={isReadOnly}
            />
            <SliderInput
              label="Max Total Exposure"
              value={formData.max_total_exposure_percent || 0}
              onChange={(v) => handleInputChange('max_total_exposure_percent', v)}
              min={1}
              max={isReadOnly ? 100 : 9999}
              step={5}
              unit="%"
              tooltip="Maximum total exposure across all open positions"
              recommended={isReadOnly ? undefined : { min: 20, max: 50 }}
              disabled={isReadOnly}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-gray-300 text-sm mb-2">
                  Max Position (USDT)
                  <Tooltip text="Maximum USDT amount per position">
                    <HelpCircle size={14} className="text-gray-500" />
                  </Tooltip>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.max_position_size_usdt || ''}
                    onChange={(e) => handleInputChange('max_position_size_usdt', parseFloat(e.target.value))}
                    readOnly={isReadOnly}
                    className={`w-full border rounded-xl px-4 py-3 text-white focus:outline-none pr-16 ${
                      isReadOnly
                        ? 'bg-gray-800/20 border-gray-700/30 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-800/50 border-gray-600 focus:border-cyan-500'
                    }`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">USDT</span>
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-gray-300 text-sm mb-2">
                  Min Position (USDT)
                  <Tooltip text="Minimum USDT amount per position">
                    <HelpCircle size={14} className="text-gray-500" />
                  </Tooltip>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.min_position_size_usdt || ''}
                    onChange={(e) => handleInputChange('min_position_size_usdt', parseFloat(e.target.value))}
                    readOnly={isReadOnly}
                    className={`w-full border rounded-xl px-4 py-3 text-white focus:outline-none pr-16 ${
                      isReadOnly
                        ? 'bg-gray-800/20 border-gray-700/30 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-800/50 border-gray-600 focus:border-cyan-500'
                    }`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">USDT</span>
                </div>
              </div>
            </div>
            <SliderInput
              label="Position Size Multiplier"
              value={formData.position_size_multiplier || 1}
              onChange={(v) => handleInputChange('position_size_multiplier', v)}
              min={0.1}
              max={isReadOnly ? 3 : 9999}
              step={0.1}
              unit="x"
              tooltip="Multiply the calculated position size by this factor"
              color="green"
              disabled={isReadOnly}
            />
            <ToggleSwitch
              enabled={formData.use_risk_based_sizing || false}
              onChange={(v) => handleInputChange('use_risk_based_sizing', v)}
              label="Risk-Based Sizing"
              description="Calculate position size based on stop loss distance"
              icon={<Target size={18} />}
              disabled={isReadOnly}
            />
          </div>
        </SectionCard>

        {/* Risk Management */}
        <SectionCard
          title="Risk Management"
          description="Define your risk parameters and limits"
          icon={<Shield size={20} />}
          color="yellow"
          locked={isReadOnly}
        >
          <div className="space-y-6">
            <SliderInput
              label="Risk Per Trade"
              value={formData.risk_per_trade_percent || 0}
              onChange={(v) => handleInputChange('risk_per_trade_percent', v)}
              min={0.1}
              max={isReadOnly ? 10 : 9999}
              step={0.5}
              unit="%"
              tooltip="Maximum percentage of balance to risk per trade"
              recommended={isReadOnly ? undefined : { min: 1, max: 2 }}
              color="yellow"
              disabled={isReadOnly}
            />
            <SliderInput
              label="Max Leverage"
              value={formData.max_leverage || 1}
              onChange={(v) => handleInputChange('max_leverage', v)}
              min={1}
              max={isReadOnly ? 125 : 9999}
              step={1}
              unit="x"
              tooltip="Maximum leverage to use for positions"
              recommended={isReadOnly ? undefined : { min: 5, max: 10 }}
              color={!isReadOnly && formData.max_leverage && formData.max_leverage > 20 ? 'red' : 'yellow'}
              disabled={isReadOnly}
            />
            <div className="grid grid-cols-2 gap-4">
              <SliderInput
                label="Daily Loss Limit"
                value={formData.daily_loss_limit_percent || 0}
                onChange={(v) => handleInputChange('daily_loss_limit_percent', v)}
                min={1}
                max={isReadOnly ? 100 : 9999}
                step={1}
                unit="%"
                tooltip="Stop trading when daily loss exceeds this"
                color="red"
                disabled={isReadOnly}
              />
              <SliderInput
                label="Weekly Loss Limit"
                value={formData.weekly_loss_limit_percent || 0}
                onChange={(v) => handleInputChange('weekly_loss_limit_percent', v)}
                min={1}
                max={isReadOnly ? 100 : 9999}
                step={5}
                unit="%"
                tooltip="Stop trading when weekly loss exceeds this"
                color="red"
                disabled={isReadOnly}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-gray-300 text-sm mb-2">
                  Max Concurrent Positions
                  <Tooltip text="Maximum number of open positions at once">
                    <HelpCircle size={14} className="text-gray-500" />
                  </Tooltip>
                </label>
                <input
                  type="number"
                  value={formData.max_concurrent_positions || ''}
                  onChange={(e) => handleInputChange('max_concurrent_positions', parseInt(e.target.value))}
                  readOnly={isReadOnly}
                  className={`w-full border rounded-xl px-4 py-3 text-white focus:outline-none ${
                    isReadOnly
                      ? 'bg-gray-800/20 border-gray-700/30 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-800/50 border-gray-600 focus:border-cyan-500'
                  }`}
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-gray-300 text-sm mb-2">
                  Max Trades Per Day
                  <Tooltip text="Maximum number of trades allowed per day">
                    <HelpCircle size={14} className="text-gray-500" />
                  </Tooltip>
                </label>
                <input
                  type="number"
                  value={formData.max_trades_per_day || ''}
                  onChange={(e) => handleInputChange('max_trades_per_day', parseInt(e.target.value))}
                  readOnly={isReadOnly}
                  className={`w-full border rounded-xl px-4 py-3 text-white focus:outline-none ${
                    isReadOnly
                      ? 'bg-gray-800/20 border-gray-700/30 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-800/50 border-gray-600 focus:border-cyan-500'
                  }`}
                />
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Auto Copy Settings */}
        <SectionCard
          title="Auto Copy Trading"
          description="Configure automatic signal copying"
          icon={<Zap size={20} />}
          color="green"
          locked={isReadOnly}
        >
          <div className="space-y-6">
            <ToggleSwitch
              enabled={formData.auto_copy_enabled || false}
              onChange={(v) => handleInputChange('auto_copy_enabled', v)}
              label="Enable Auto Copy"
              description="Automatically copy signals when consensus is met"
              icon={<Zap size={18} />}
              disabled={isReadOnly}
            />
            <AnimatePresence>
              {formData.auto_copy_enabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <SliderInput
                    label="Min Consensus Required"
                    value={formData.min_consensus_for_auto_copy || 2}
                    onChange={(v) => handleInputChange('min_consensus_for_auto_copy', v)}
                    min={1}
                    max={isReadOnly ? 10 : 9999}
                    step={1}
                    unit=" signals"
                    tooltip="Minimum number of matching signals before auto-copying"
                    color="green"
                    disabled={isReadOnly}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </SectionCard>

        {/* Advanced Settings */}
        <SectionCard
          title="Advanced Settings"
          description="Fine-tune your trading automation"
          icon={<Settings size={20} />}
          color="purple"
          locked={isReadOnly}
        >
          <div className="space-y-6">
            <ToggleSwitch
              enabled={formData.enable_breakeven_sl || false}
              onChange={(v) => handleInputChange('enable_breakeven_sl', v)}
              label="Breakeven Stop Loss"
              description="Move SL to entry after hitting a TP level"
              icon={<Target size={18} />}
              disabled={isReadOnly}
            />
            <AnimatePresence>
              {formData.enable_breakeven_sl && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pl-4 border-l-2 border-cyan-500/30"
                >
                  <SliderInput
                    label="Move to Breakeven After TP"
                    value={formData.breakeven_after_tp_level || 1}
                    onChange={(v) => handleInputChange('breakeven_after_tp_level', v)}
                    min={1}
                    max={isReadOnly ? 5 : 9999}
                    step={1}
                    unit=""
                    tooltip="TP level that triggers breakeven SL"
                    disabled={isReadOnly}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <ToggleSwitch
              enabled={formData.enable_trailing_sl || false}
              onChange={(v) => handleInputChange('enable_trailing_sl', v)}
              label="Trailing Stop Loss"
              description="Automatically trail SL as price moves in your favor"
              icon={<TrendingUp size={18} />}
              disabled={isReadOnly}
            />
            <AnimatePresence>
              {formData.enable_trailing_sl && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pl-4 border-l-2 border-cyan-500/30 space-y-4"
                >
                  <SliderInput
                    label="Trailing Stop Distance"
                    value={formData.trailing_stop_percent || 1}
                    onChange={(v) => handleInputChange('trailing_stop_percent', v)}
                    min={0.1}
                    max={isReadOnly ? 20 : 9999}
                    step={0.5}
                    unit="%"
                    tooltip="Distance from current price for trailing stop"
                    disabled={isReadOnly}
                  />
                  <SliderInput
                    label="Activation Threshold"
                    value={formData.trailing_activation_percent || 1}
                    onChange={(v) => handleInputChange('trailing_activation_percent', v)}
                    min={0.1}
                    max={isReadOnly ? 50 : 9999}
                    step={0.5}
                    unit="%"
                    tooltip="Minimum profit % before trailing stop activates"
                    disabled={isReadOnly}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </SectionCard>
      </div>

      {/* Fixed Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-80 bg-gray-900/95 backdrop-blur-md border-t border-gray-700/50 p-4 z-20">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {hasChanges && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center gap-2 text-yellow-400 text-sm"
                >
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                  <Info size={16} />
                  <span>You have unsaved changes</span>
                </motion.div>
              )}
            </AnimatePresence>
            {isReadOnly && (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Lock size={14} />
                <span>Read-only — switch to Aggressive to edit</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              onClick={handleReset}
              disabled={saving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
            >
              <RotateCcw size={18} />
              Reset Defaults
            </motion.button>
            <motion.button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              whileHover={hasChanges ? { scale: 1.02 } : {}}
              whileTap={hasChanges ? { scale: 0.98 } : {}}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all shadow-lg ${
                hasChanges
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              {saving ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <Save size={18} />
              )}
              Save Changes
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingConfigPage;
