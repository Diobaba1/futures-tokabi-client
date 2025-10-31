// src/pages/walletpages/APIKeyManager.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { userService } from '../../api/services/userService';
import { APIKeyAdd, APIKeyResponse } from '../../types/user.types';

interface APIKeyManagerProps {
  onKeysUpdate?: (keys: APIKeyResponse[]) => void;
}

const APIKeyManager: React.FC<APIKeyManagerProps> = ({ onKeysUpdate }) => {
  const [apiKeys, setApiKeys] = useState<APIKeyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState<APIKeyAdd>({
    api_key: '',
    api_secret: '',
    label: '',
    testnet: false,
  });

  // Load API keys with useCallback to prevent infinite re-renders
  const loadApiKeys = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await userService.getApiKeys();
      setApiKeys(response.api_keys);
      onKeysUpdate?.(response.api_keys);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load API keys');
    } finally {
      setIsLoading(false);
    }
  }, [onKeysUpdate]);

  // Load API keys on component mount
  useEffect(() => {
    loadApiKeys();
  }, [loadApiKeys]);

  const handleAddKey = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.api_key.trim() || !formData.api_secret.trim()) {
      setError('Both API Key and Secret are required');
      return;
    }

    try {
      setIsAdding(true);
      setError(null);
      setSuccess(null);

      await userService.addApiKey({
        ...formData,
        label: formData.label?.trim() || `API Key ${new Date().toLocaleDateString()}`,
      });

      setSuccess('API key added successfully!');
      setFormData({
        api_key: '',
        api_secret: '',
        label: '',
        testnet: false,
      });
      setShowAddForm(false);
      
      // Reload the keys list
      await loadApiKeys();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add API key');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteKey = async (keyId: string) => {
    if (!window.confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(keyId);
      setError(null);
      
      await userService.deleteApiKey(keyId);
      setSuccess('API key deleted successfully!');
      
      // Reload the keys list
      await loadApiKeys();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete API key');
    } finally {
      setIsDeleting(null);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const resetForm = () => {
    setFormData({
      api_key: '',
      api_secret: '',
      label: '',
      testnet: false,
    });
    setShowAddForm(false);
    clearMessages();
  };

  // Auto-clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(clearMessages, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          API Key Management
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Securely manage your Binance API keys for trading automation. 
          Keys are encrypted and stored securely.
        </p>
      </div>

      {/* Instructions */}
      <BinanceAPIInstructions />

      {/* Add API Key Button */}
      {!showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <motion.button
            onClick={() => setShowAddForm(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-cyan-900 to-cyan-900 text-gray-900 font-bold rounded-xl hover:from-cyan-800 hover:to-cyan-900 transition-all duration-300 shadow-lg shadow-cyan-900/25 flex items-center justify-center space-x-3 mx-auto"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-lg">Add New API Key</span>
          </motion.button>
          <p className="text-gray-400 text-sm mt-3">
            Click to add your Binance API keys securely
          </p>
        </motion.div>
      )}

      {/* Add API Key Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <svg className="w-6 h-6 mr-2 text-cyan-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Add New API Key
              </h2>
              <button
                onClick={resetForm}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <SecurityWarning />

            <form onSubmit={handleAddKey} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Label (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="e.g., Main Trading Account"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-900/50 focus:border-cyan-900/50 transition-all duration-200"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="testnet"
                    checked={formData.testnet}
                    onChange={(e) => setFormData({ ...formData, testnet: e.target.checked })}
                    className="w-4 h-4 text-cyan-900 bg-gray-700 border-gray-600 rounded focus:ring-cyan-900/50 focus:ring-2"
                  />
                  <label htmlFor="testnet" className="ml-2 text-sm text-gray-300">
                    Testnet/Sandbox Key
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  API Key *
                </label>
                <input
                  type="text"
                  required
                  value={formData.api_key}
                  onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                  placeholder="Enter your Binance API Key"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-900/50 focus:border-cyan-900/50 transition-all duration-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  API Secret *
                </label>
                <input
                  type="password"
                  required
                  value={formData.api_secret}
                  onChange={(e) => setFormData({ ...formData, api_secret: e.target.value })}
                  placeholder="Enter your Binance API Secret"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-900/50 focus:border-cyan-900/50 transition-all duration-200 font-mono"
                />
              </div>

              <div className="flex space-x-4">
                <motion.button
                  type="button"
                  onClick={resetForm}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-4 bg-gray-700/50 border border-gray-600/50 text-gray-300 font-bold rounded-xl hover:bg-gray-600/50 hover:text-white transition-all duration-300"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={isAdding}
                  whileHover={{ scale: isAdding ? 1 : 1.02 }}
                  whileTap={{ scale: isAdding ? 1 : 0.98 }}
                  className="flex-1 py-4 bg-gradient-to-r from-cyan-900 to-cyan-900 text-gray-900 font-bold rounded-xl hover:from-cyan-800 hover:to-cyan-900 disabled:from-gray-600 disabled:to-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-cyan-900/25 flex items-center justify-center space-x-2"
                >
                  {isAdding ? (
                    <>
                      <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                      <span>Adding API Key...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Add API Key</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
            <button onClick={clearMessages} className="text-red-400 hover:text-red-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{success}</span>
            </div>
            <button onClick={clearMessages} className="text-green-400 hover:text-green-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* API Keys List */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            Managed API Keys ({apiKeys.length})
          </h2>
          
          {apiKeys.length > 0 && !showAddForm && (
            <motion.button
              onClick={() => setShowAddForm(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-cyan-900/10 border border-cyan-900/20 text-cyan-800 rounded-xl hover:bg-cyan-900/20 hover:border-cyan-900/30 transition-all duration-200 flex items-center space-x-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Another</span>
            </motion.button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-2 border-cyan-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : apiKeys.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            <p className="text-lg mb-4">No API keys configured</p>
            <p className="text-sm mb-6">Add your first API key to start automated trading</p>
            <motion.button
              onClick={() => setShowAddForm(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-cyan-900 to-cyan-900 text-gray-900 font-bold rounded-xl hover:from-cyan-800 hover:to-cyan-900 transition-all duration-300 shadow-lg shadow-cyan-900/25 flex items-center justify-center space-x-2 mx-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Your First API Key</span>
            </motion.button>
          </div>
        ) : (
          <div className="grid gap-4">
            {apiKeys.map((apiKey) => (
              <APIKeyCard
                key={apiKey.id}
                apiKey={apiKey}
                onDelete={handleDeleteKey}
                isDeleting={isDeleting === apiKey.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Security Warning Component
const SecurityWarning: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="mb-6 p-4 bg-cyan-900/10 border border-cyan-900/20 rounded-xl"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-cyan-800 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <h3 className="text-cyan-800 font-semibold">Security Notice</h3>
            <p className="text-cyan-600/80 text-sm mt-1">
              Your API keys will be encrypted and stored securely. However, for security reasons:
            </p>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.ul
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 space-y-1 text-cyan-600/70 text-sm"
                >
                  <li>• You will not be able to view your API secret after submission</li>
                  <li>• Ensure you have saved your API secret securely before adding</li>
                  <li>• Only enable necessary permissions (Read, Trade, Futures)</li>
                  <li>• Never share your API keys with anyone</li>
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-cyan-800 hover:text-cyan-600 transition-colors duration-200 flex-shrink-0"
        >
          <svg 
            className={`w-5 h-5 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

// API Key Card Component
interface APIKeyCardProps {
  apiKey: APIKeyResponse;
  onDelete: (keyId: string) => void;
  isDeleting: boolean;
}

const APIKeyCard: React.FC<APIKeyCardProps> = ({ apiKey, onDelete, isDeleting }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'invalid': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-cyan-800 bg-cyan-800/10 border-cyan-800/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'valid': return 'Valid';
      case 'invalid': return 'Invalid';
      default: return 'Pending Validation';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="p-4 bg-gray-700/30 border border-gray-600/30 rounded-xl hover:border-gray-500/50 transition-all duration-200 group"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-white font-semibold truncate">{apiKey.label}</h3>
            
            {apiKey.is_testnet && (
              <span className="px-2 py-1 text-xs font-medium text-blue-400 bg-blue-400/10 border border-blue-400/20 rounded-full">
                Testnet
              </span>
            )}
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
              apiKey.is_active 
                ? 'text-green-400 bg-green-400/10 border-green-400/20' 
                : 'text-gray-400 bg-gray-400/10 border-gray-400/20'
            }`}>
              {apiKey.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>Created: {new Date(apiKey.created_at).toLocaleDateString()}</span>
            <span>ID: {apiKey.id.slice(0, 8)}...</span>
          </div>
        </div>

        <motion.button
          onClick={() => onDelete(apiKey.id)}
          disabled={isDeleting}
          whileHover={{ scale: isDeleting ? 1 : 1.05 }}
          whileTap={{ scale: isDeleting ? 1 : 0.95 }}
          className="ml-4 p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100"
          title="Delete API Key"
        >
          {isDeleting ? (
            <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

// Binance API Instructions Component
const BinanceAPIInstructions: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const steps = [
    {
      title: "1. Log into Binance",
      description: "Go to Binance.com and log into your account"
    },
    {
      title: "2. Access API Management",
      description: "Click on your profile icon → API Management"
    },
    {
      title: "3. Create New API Key",
      description: "Click 'Create API', complete security verification"
    },
    {
      title: "4. Configure Permissions",
      description: "Enable ONLY these permissions:",
      permissions: ["Read Info", "Enable Trading", "Enable Futures"]
    },
    {
      title: "5. Restrict Access",
      description: "Enable 'Restrict access to trusted IPs only' (recommended)"
    },
    {
      title: "6. Save Your Secret",
      description: "Copy and securely save your API Key and Secret immediately"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 backdrop-blur-sm"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <svg className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-blue-400 font-semibold text-lg mb-2">
              How to Get Your Binance API Keys
            </h3>
            <p className="text-blue-300/80">
              Follow these steps to create secure API keys for automated trading
            </p>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-3"
                >
                  {steps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center text-blue-400 text-sm font-semibold mt-0.5 flex-shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="text-blue-300 font-semibold">{step.title}</h4>
                        <p className="text-blue-300/70 text-sm mt-1">{step.description}</p>
                        {step.permissions && (
                          <ul className="text-blue-300/60 text-sm mt-1 space-y-1">
                            {step.permissions.map((permission, permIndex) => (
                              <li key={permIndex}>• {permission}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-4 p-3 bg-cyan-900/10 border border-cyan-900/20 rounded-lg">
                    <p className="text-cyan-800 text-sm font-semibold">⚠️ Important Security Notes:</p>
                    <ul className="text-cyan-600/70 text-sm mt-1 space-y-1">
                      <li>• Never enable "Withdraw" permission for trading bots</li>
                      <li>• Use IP whitelisting for enhanced security</li>
                      <li>• Store your API Secret securely - you won't see it again</li>
                      <li>• Regularly rotate your API keys</li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-400 hover:text-blue-300 transition-colors duration-200 flex-shrink-0 ml-4"
        >
          <svg 
            className={`w-6 h-6 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {!isExpanded && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsExpanded(true)}
          className="mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center space-x-1 transition-colors duration-200"
        >
          <span>Show detailed instructions</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.button>
      )}
    </motion.div>
  );
};

export default APIKeyManager;