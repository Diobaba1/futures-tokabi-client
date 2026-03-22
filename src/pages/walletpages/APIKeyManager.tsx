// src/pages/walletpages/APIKeyManager.tsx
/**
 * Exchange API Key Manager Component
 *
 * This component manages exchange connections with a single connection policy:
 * - Users can only connect ONE exchange at a time
 * - All other exchanges are disabled when one is connected
 * - Users must disconnect the current exchange to connect a different one
 */
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { userService } from '../../api/services/userService';
import { APIKeyAdd, APIKeyResponse, ExchangeType } from '../../types/user.types';
import { useToast } from '../../components/ui/Toast';
import { getUserFriendlyError } from '../../utils/errorHandler';
import {
  Link2,
  Shield,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  X,
  Eye,
  EyeOff,
  ExternalLink,
  ChevronDown,
  Lock,
  Key,
  Zap,
  RefreshCw,
  Info,
  AlertTriangle,
  Ban,
} from 'lucide-react';

interface APIKeyManagerProps {
  onKeysUpdate?: (keys: APIKeyResponse[]) => void;
}

// Exchange configuration
const EXCHANGES = {
  binance: {
    name: 'Binance',
    description: 'World\'s largest crypto exchange',
    color: 'yellow',
    gradient: 'from-yellow-500 to-amber-500',
    bgGradient: 'from-yellow-500/10 to-amber-500/10',
    borderColor: 'border-yellow-500/30',
    textColor: 'text-yellow-400',
    hoverBorder: 'hover:border-yellow-500/50',
    features: ['Futures Trading', 'Spot Trading', 'Margin'],
    docUrl: 'https://www.binance.com/en/my/settings/api-management',
    logo: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1.5L5.5 8l2.25 2.25L12 6l4.25 4.25L18.5 8 12 1.5zm-6.5 9L3.25 12.75 5.5 15l2.25-2.25L5.5 10.5zm13 0l-2.25 2.25L18.5 15l2.25-2.25L18.5 10.5zM12 9l-3 3 3 3 3-3-3-3zm0 13.5l6.5-6.5-2.25-2.25L12 18l-4.25-4.25L5.5 16 12 22.5z"/>
      </svg>
    ),
  },
  bybit: {
    name: 'Bybit',
    description: 'Fast & reliable derivatives',
    color: 'orange',
    gradient: 'from-orange-500 to-red-500',
    bgGradient: 'from-orange-500/10 to-red-500/10',
    borderColor: 'border-orange-500/30',
    textColor: 'text-orange-400',
    hoverBorder: 'hover:border-orange-500/50',
    features: ['USDT Perpetual', 'Inverse Contracts', 'Options'],
    docUrl: 'https://www.bybit.com/app/user/api-management',
    logo: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    ),
  },
} as const;

const APIKeyManager: React.FC<APIKeyManagerProps> = ({ onKeysUpdate }) => {
  const { showSuccess, showError } = useToast();
  const [apiKeys, setApiKeys] = useState<APIKeyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState<ExchangeType | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showApiSecret, setShowApiSecret] = useState(false);

  // Single exchange connection state
  const [hasActiveConnection, setHasActiveConnection] = useState(false);
  const [connectedExchange, setConnectedExchange] = useState<ExchangeType | null>(null);

  // Form state
  const [formData, setFormData] = useState<APIKeyAdd>({
    api_key: '',
    api_secret: '',
    label: '',
    testnet: false,
    exchange_type: 'binance',
  });

  // Load API keys
  const loadApiKeys = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await userService.getApiKeys();
      setApiKeys(response.api_keys);
      setHasActiveConnection(response.has_active_connection);
      setConnectedExchange(response.connected_exchange);
      onKeysUpdate?.(response.api_keys);
    } catch (err: unknown) {
      showError(getUserFriendlyError(err), { title: 'Failed to Load' });
    } finally {
      setIsLoading(false);
    }
  }, [onKeysUpdate, showError]);

  useEffect(() => {
    loadApiKeys();
  }, [loadApiKeys]);

  // Get keys by exchange
  const getKeysByExchange = (exchange: ExchangeType) => {
    return apiKeys.filter((key) => key.exchange_type === exchange);
  };

  // Check if an exchange can be connected (only if no active connection exists)
  const canConnect = (exchange: ExchangeType): boolean => {
    return !hasActiveConnection;
  };

  // Open connect modal (only if allowed)
  const openConnectModal = (exchange: ExchangeType) => {
    if (!canConnect(exchange)) {
      showError(
        `You already have ${connectedExchange?.toUpperCase()} connected. ` +
        'Please disconnect it first before connecting another exchange.',
        { title: 'Connection Limit Reached' }
      );
      return;
    }
    setSelectedExchange(exchange);
    setFormData({
      api_key: '',
      api_secret: '',
      label: '',
      testnet: false,
      exchange_type: exchange,
    });
    setShowConnectModal(true);
  };

  // Handle form submission
  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.api_key.trim() || !formData.api_secret.trim()) {
      showError('Both API Key and Secret are required', { title: 'Validation Error' });
      return;
    }

    try {
      setIsAdding(true);
      const result = await userService.addApiKey({
        ...formData,
        label: formData.label?.trim() || `${EXCHANGES[formData.exchange_type as ExchangeType].name} Key`,
      });

      if (result.validation?.valid) {
        showSuccess('Exchange connected and verified! Trades will be executed automatically.', { title: 'Connected & Verified' });
        setShowConnectModal(false);
        setSelectedExchange(null);
        setFormData({
          api_key: '',
          api_secret: '',
          label: '',
          testnet: false,
          exchange_type: 'binance',
        });
      } else {
        showError(
          result.validation?.error || 'API key saved but could not be verified. Please check your credentials and try reconnecting.',
          { title: 'Verification Failed' }
        );
        // Key was saved but invalid — close modal so user can see the status
        // and disconnect/reconnect with correct credentials
        setShowConnectModal(false);
        setSelectedExchange(null);
        setFormData({
          api_key: '',
          api_secret: '',
          label: '',
          testnet: false,
          exchange_type: 'binance',
        });
      }
      await loadApiKeys();
    } catch (err: unknown) {
      showError(getUserFriendlyError(err), { title: 'Connection Failed' });
    } finally {
      setIsAdding(false);
    }
  };

  // Handle delete
  const handleDelete = async (keyId: string) => {
    try {
      setIsDeleting(keyId);
      await userService.deleteApiKey(keyId);
      showSuccess('API key removed successfully', { title: 'Disconnected' });
      setShowDeleteConfirm(null);
      await loadApiKeys();
    } catch (err: unknown) {
      showError(getUserFriendlyError(err), { title: 'Failed to Remove' });
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="min-h-full">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative px-6 py-10 lg:py-12">
          <div className="max-w-4xl mx-auto text-center">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 15 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border border-cyan-500/30 mb-6"
            >
              <Link2 className="w-8 h-8 text-cyan-400" />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-3xl lg:text-4xl font-bold text-white mb-4"
            >
              Connect Your Exchange
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-lg max-w-2xl mx-auto mb-8"
            >
              Connect your preferred exchange to enable automated trading. You can have
              <strong className="text-white"> one active connection</strong> at a time.
              Your API keys are encrypted with AES-256.
            </motion.p>

            {/* Security badges */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-emerald-400">Bank-grade Encryption</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                <Lock className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-cyan-400">No Withdrawal Access</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20">
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-purple-400">Trade Only</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-10">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Exchange Cards */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <span>Supported Exchanges</span>
                {hasActiveConnection && connectedExchange && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {connectedExchange.charAt(0).toUpperCase() + connectedExchange.slice(1)} Connected
                  </span>
                )}
              </h2>
              {hasActiveConnection && (
                <span className="text-xs text-gray-500">
                  Single exchange connection active
                </span>
              )}
            </div>

            {/* Single Exchange Policy Notice */}
            {!hasActiveConnection && (
              <div className="mb-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-400/80">
                  You can connect <strong>one exchange</strong> at a time. Choose the exchange you want to use for trading.
                </p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {(Object.keys(EXCHANGES) as ExchangeType[]).map((exchangeKey) => {
                const exchange = EXCHANGES[exchangeKey];
                const connectedKeys = getKeysByExchange(exchangeKey);
                const isConnected = connectedKeys.length > 0;
                const isDisabled = hasActiveConnection && !isConnected;

                return (
                  <ExchangeCard
                    key={exchangeKey}
                    exchangeKey={exchangeKey}
                    exchange={exchange}
                    connectedKeys={connectedKeys}
                    isConnected={isConnected}
                    isDisabled={isDisabled}
                    isLoading={isLoading}
                    isDeleting={isDeleting}
                    showDeleteConfirm={showDeleteConfirm}
                    onConnect={() => openConnectModal(exchangeKey)}
                    onDelete={handleDelete}
                    onShowDeleteConfirm={setShowDeleteConfirm}
                  />
                );
              })}
            </div>
          </motion.div>

          {/* Setup Guide */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <SetupGuide />
          </motion.div>

          {/* Security Info */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <SecurityInfo />
          </motion.div>
        </div>
      </div>

      {/* Connect Modal */}
      <AnimatePresence>
        {showConnectModal && selectedExchange && (
          <ConnectModal
            exchange={EXCHANGES[selectedExchange]}
            formData={formData}
            setFormData={setFormData}
            isAdding={isAdding}
            showApiSecret={showApiSecret}
            setShowApiSecret={setShowApiSecret}
            onSubmit={handleConnect}
            onClose={() => {
              setShowConnectModal(false);
              setSelectedExchange(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Exchange Card Component
interface ExchangeCardProps {
  exchangeKey: ExchangeType;
  exchange: typeof EXCHANGES[ExchangeType];
  connectedKeys: APIKeyResponse[];
  isConnected: boolean;
  isDisabled: boolean;
  isLoading: boolean;
  isDeleting: string | null;
  showDeleteConfirm: string | null;
  onConnect: () => void;
  onDelete: (id: string) => void;
  onShowDeleteConfirm: (id: string | null) => void;
}

const ExchangeCard: React.FC<ExchangeCardProps> = ({
  exchangeKey,
  exchange,
  connectedKeys,
  isConnected,
  isDisabled,
  isLoading,
  isDeleting,
  showDeleteConfirm,
  onConnect,
  onDelete,
  onShowDeleteConfirm,
}) => {
  const [isExpanded, setIsExpanded] = useState(isConnected);

  return (
    <motion.div
      layout
      className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
        isConnected
          ? `bg-gradient-to-br ${exchange.bgGradient} ${exchange.borderColor}`
          : isDisabled
          ? 'bg-dark-elevated/30 border-white/5 opacity-60'
          : 'bg-dark-elevated/50 border-white/5 hover:border-white/10'
      }`}
    >
      {/* Disabled Overlay */}
      {isDisabled && (
        <div className="absolute inset-0 bg-dark-elevated/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-elevated/80 border border-white/10">
            <Ban className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Disconnect other exchange first</span>
          </div>
        </div>
      )}

      {/* Card Header */}
      <div className="p-5">
        <div className="flex items-start justify-between">
          {/* Exchange Info */}
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${exchange.gradient} flex items-center justify-center text-white shadow-lg ${isDisabled ? 'grayscale' : ''}`}>
              {exchange.logo}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                {exchange.name}
                {isConnected && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    Connected
                  </span>
                )}
              </h3>
              <p className="text-gray-400 text-sm">{exchange.description}</p>
            </div>
          </div>

          {/* Action Button - Only show Connect for non-connected exchanges */}
          {!isConnected && (
            <motion.button
              whileHover={!isDisabled ? { scale: 1.02 } : {}}
              whileTap={!isDisabled ? { scale: 0.98 } : {}}
              onClick={onConnect}
              disabled={isLoading || isDisabled}
              className={`px-4 py-2 rounded-xl bg-gradient-to-r ${exchange.gradient} text-white font-medium text-sm shadow-lg transition-all hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Connect
            </motion.button>
          )}
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mt-4">
          {exchange.features.map((feature) => (
            <span
              key={feature}
              className={`px-2.5 py-1 rounded-lg bg-white/5 text-xs ${isDisabled ? 'text-gray-500' : 'text-gray-400'}`}
            >
              {feature}
            </span>
          ))}
        </div>
      </div>

      {/* Connected Keys */}
      {isConnected && (
        <>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full px-5 py-3 border-t border-white/5 flex items-center justify-between text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <span>{connectedKeys.length} API key{connectedKeys.length !== 1 ? 's' : ''} connected</span>
            <motion.span animate={{ rotate: isExpanded ? 180 : 0 }}>
              <ChevronDown className="w-4 h-4" />
            </motion.span>
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 space-y-3">
                  {connectedKeys.map((key) => (
                    <div
                      key={key.id}
                      className="relative p-4 rounded-xl bg-black/20 border border-white/5 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Key className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-white truncate">{key.label}</span>
                            {key.is_testnet && (
                              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs">
                                Testnet
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <StatusIndicator status={key.validation_status} />
                              {key.validation_status === 'valid' ? 'Verified' : key.validation_status === 'invalid' ? 'Invalid' : 'Pending'}
                            </span>
                            <span>Added {new Date(key.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Delete Button */}
                        {showDeleteConfirm === key.id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onShowDeleteConfirm(null)}
                              className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 text-sm hover:bg-white/10 transition-all"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => onDelete(key.id)}
                              disabled={isDeleting === key.id}
                              className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30 transition-all flex items-center gap-1 disabled:opacity-50"
                            >
                              {isDeleting === key.id ? (
                                <RefreshCw className="w-3 h-3 animate-spin" />
                              ) : (
                                <Trash2 className="w-3 h-3" />
                              )}
                              Remove
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => onShowDeleteConfirm(key.id)}
                            className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );
};

// Status Indicator
const StatusIndicator: React.FC<{ status: string }> = ({ status }) => {
  const config = {
    valid: { color: 'bg-emerald-400', icon: CheckCircle2 },
    invalid: { color: 'bg-red-400', icon: AlertCircle },
    pending: { color: 'bg-yellow-400', icon: Clock },
  }[status] || { color: 'bg-gray-400', icon: Clock };

  return (
    <span className={`w-2 h-2 rounded-full ${config.color}`} />
  );
};

// Connect Modal
interface ConnectModalProps {
  exchange: typeof EXCHANGES[ExchangeType];
  formData: APIKeyAdd;
  setFormData: (data: APIKeyAdd) => void;
  isAdding: boolean;
  showApiSecret: boolean;
  setShowApiSecret: (show: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const ConnectModal: React.FC<ConnectModalProps> = ({
  exchange,
  formData,
  setFormData,
  isAdding,
  showApiSecret,
  setShowApiSecret,
  onSubmit,
  onClose,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-lg bg-dark-elevated rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`relative px-6 py-5 bg-gradient-to-r ${exchange.bgGradient} border-b border-white/5`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-black/20 text-white/60 hover:text-white hover:bg-black/30 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${exchange.gradient} flex items-center justify-center text-white shadow-lg`}>
              {exchange.logo}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Connect {exchange.name}</h2>
              <p className="text-white/60 text-sm">Enter your API credentials</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-6 space-y-5">
          {/* Security Notice */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-amber-400 font-medium">Security Reminder</p>
              <p className="text-amber-400/70 mt-1">
                Only enable <strong>Read</strong> and <strong>Trade</strong> permissions. Never enable withdrawals.
              </p>
            </div>
          </div>

          {/* Label */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Label <span className="text-gray-500">(optional)</span>
            </label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder={`My ${exchange.name} Account`}
              className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
            />
          </div>

          {/* API Key */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              API Key <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.api_key}
              onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
              placeholder="Enter your API key"
              className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all font-mono text-sm"
            />
          </div>

          {/* API Secret */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              API Secret <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showApiSecret ? 'text' : 'password'}
                required
                value={formData.api_secret}
                onChange={(e) => setFormData({ ...formData, api_secret: e.target.value })}
                placeholder="Enter your API secret"
                className="w-full px-4 py-3 pr-12 rounded-xl bg-black/30 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all font-mono text-sm"
              />
              <button
                type="button"
                onClick={() => setShowApiSecret(!showApiSecret)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all"
              >
                {showApiSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Testnet Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Testnet Mode</p>
                <p className="text-gray-500 text-xs">Use sandbox environment for testing</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, testnet: !formData.testnet })}
              className={`relative w-12 h-6 rounded-full transition-all ${
                formData.testnet ? 'bg-blue-500' : 'bg-gray-700'
              }`}
            >
              <motion.div
                animate={{ x: formData.testnet ? 24 : 4 }}
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
              />
            </button>
          </div>

          {/* Help Link */}
          <a
            href={exchange.docUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>How to get your {exchange.name} API key</span>
          </a>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-medium hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={isAdding}
              whileHover={{ scale: isAdding ? 1 : 1.01 }}
              whileTap={{ scale: isAdding ? 1 : 0.99 }}
              className={`flex-1 px-4 py-3 rounded-xl bg-gradient-to-r ${exchange.gradient} text-white font-medium shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              {isAdding ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Connecting & Verifying...</span>
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4" />
                  <span>Connect Exchange</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Setup Guide Component
const SetupGuide: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'binance' | 'bybit'>('binance');

  const steps = {
    binance: [
      { title: 'Log into Binance', desc: 'Go to binance.com and sign in' },
      { title: 'Open API Management', desc: 'Profile → API Management' },
      { title: 'Create New API Key', desc: 'Click "Create API" and verify' },
      { title: 'Set Permissions', desc: 'Enable Read, Trade, Futures only' },
      { title: 'Copy Credentials', desc: 'Save your key and secret securely' },
    ],
    bybit: [
      { title: 'Log into Bybit', desc: 'Go to bybit.com and sign in' },
      { title: 'Open API Management', desc: 'Account → API Management' },
      { title: 'Create New API Key', desc: 'Choose "System-generated"' },
      { title: 'Set Permissions', desc: 'Enable Read-Write, Contracts' },
      { title: 'Copy Credentials', desc: 'Save your key and secret securely' },
    ],
  };

  return (
    <div className="rounded-2xl border border-white/5 bg-dark-elevated/30 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Info className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-left">
            <h3 className="text-white font-medium">API Key Setup Guide</h3>
            <p className="text-gray-500 text-sm">Step-by-step instructions</p>
          </div>
        </div>
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-4">
              {/* Tabs */}
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('binance')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'binance'
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      : 'bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10'
                  }`}
                >
                  Binance
                </button>
                <button
                  onClick={() => setActiveTab('bybit')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'bybit'
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      : 'bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10'
                  }`}
                >
                  Bybit
                </button>
              </div>

              {/* Steps */}
              <div className="space-y-3">
                {steps[activeTab].map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                      activeTab === 'binance'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-orange-500/20 text-orange-400'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-white font-medium">{step.title}</p>
                      <p className="text-gray-500 text-sm">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Security Info Component
const SecurityInfo: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'AES-256 Encryption',
      desc: 'Your API keys are encrypted with military-grade encryption before storage',
    },
    {
      icon: Lock,
      title: 'No Withdrawal Access',
      desc: 'We never request or store withdrawal permissions',
    },
    {
      icon: Key,
      title: 'Secret Not Stored',
      desc: 'API secrets are hashed and cannot be retrieved after submission',
    },
  ];

  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
      <div className="flex items-center gap-3 mb-4">
        <Shield className="w-6 h-6 text-emerald-400" />
        <h3 className="text-white font-semibold">Security Measures</h3>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <feature.icon className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white text-sm font-medium">{feature.title}</p>
              <p className="text-emerald-400/60 text-xs mt-0.5">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default APIKeyManager;
