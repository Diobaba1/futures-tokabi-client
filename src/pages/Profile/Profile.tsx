// src/pages/Profile.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../components/contexts/AuthContext';
import { userService } from '../../api/services';
import { APIKeyAdd, APIKeyResponse } from '../../types/user.types';

const Profile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [apiKeys, setApiKeys] = useState<APIKeyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'api-keys'>('profile');
  const [showAddForm, setShowAddForm] = useState(false);

  // API Key Form State
  const [newKey, setNewKey] = useState<APIKeyAdd>({
    api_key: '',
    api_secret: '',
    label: '',
    testnet: false,
    exchange_type: 'binance'
  });

  useEffect(() => {
    if (user) {
      loadApiKeys();
    }
  }, [user]);

  const loadApiKeys = async () => {
    setLoading(true);
    try {
      const { api_keys } = await userService.getApiKeys();
      setApiKeys(api_keys);
    } catch (error) {
      console.error('Failed to load API keys:', error);
      setError('Failed to load API keys');
    } finally {
      setLoading(false);
    }
  };

  const addApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      await userService.addApiKey({
        ...newKey,
        label: newKey.label || `API Key ${new Date().toLocaleDateString()}`
      });
      
      setSuccess('API key added successfully!');
      setNewKey({ api_key: '', api_secret: '', label: '', testnet: false, exchange_type: 'binance' });
      setShowAddForm(false);
      loadApiKeys();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to add API key');
    } finally {
      setUpdating(false);
    }
  };

  const deleteApiKey = async (keyId: string) => {
    if (!window.confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }

    try {
      await userService.deleteApiKey(keyId);
      setSuccess('API key deleted successfully!');
      loadApiKeys();
    } catch (error) {
      console.error('Failed to delete API key:', error);
      setError('Failed to delete API key');
    }
  };

  const toggleSubscription = async () => {
    setUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      await userService.updateSubscription({ is_subscribed: !user?.is_subscribed });
      await refreshUser();
      setSuccess(`Subscription ${!user?.is_subscribed ? 'activated' : 'cancelled'} successfully!`);
    } catch (error) {
      console.error('Failed to update subscription:', error);
      setError('Failed to update subscription');
    } finally {
      setUpdating(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'valid': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'invalid': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-cyan-800 bg-cyan-800/10 border-cyan-800/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'valid': return 'Valid';
      case 'invalid': return 'Invalid';
      default: return 'Pending Validation';
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-cyan-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Account Settings</h1>
        <p className="text-gray-400 text-lg">Manage your profile and API keys</p>
      </div>

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

      {/* Tab Navigation */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-1 backdrop-blur-sm">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === 'profile'
                ? 'bg-cyan-900/10 text-cyan-800 border border-cyan-900/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Profile</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('api-keys')}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === 'api-keys'
                ? 'bg-cyan-900/10 text-cyan-800 border border-cyan-900/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <span>API Keys ({apiKeys.length})</span>
            </div>
          </button>
        </div>
      </div>

      {/* Profile Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm"
          >
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <div className="p-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white">
                  {user?.email}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Account Status</label>
                <div className="p-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white">
                  {user?.is_subscribed ? 'Premium' : 'Free Tier'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <div className="p-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white">
                  {user?.full_name || 'Not set'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Member Since</label>
                <div className="p-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Subscription Management</h3>
              <div className="flex items-center justify-between p-4 bg-gray-700/30 border border-gray-600/30 rounded-xl">
                <div>
                  <div className="text-white font-semibold">
                    {user?.is_subscribed ? 'Premium Plan' : 'Free Plan'}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {user?.is_subscribed 
                      ? 'Full access to all trading features' 
                      : 'Upgrade to unlock advanced features'
                    }
                  </div>
                </div>
                <motion.button
                  onClick={toggleSubscription}
                  disabled={updating}
                  whileHover={{ scale: updating ? 1 : 1.02 }}
                  whileTap={{ scale: updating ? 1 : 0.98 }}
                  className={`px-6 py-2 font-semibold rounded-xl transition-all duration-200 ${
                    user?.is_subscribed
                      ? 'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20'
                      : 'bg-cyan-900/10 border border-cyan-900/20 text-cyan-800 hover:bg-cyan-900/20'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {updating ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : user?.is_subscribed ? (
                    'Cancel Subscription'
                  ) : (
                    'Upgrade to Premium'
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* API Keys Tab Content */}
        {activeTab === 'api-keys' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Add API Key Button */}
            {!showAddForm && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setShowAddForm(true)}
                className="w-full p-6 bg-gray-800/50 border border-gray-700/50 rounded-2xl hover:border-gray-600/50 transition-all duration-200 group"
              >
                <div className="flex items-center justify-center space-x-3 text-gray-400 group-hover:text-cyan-800">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="text-lg font-semibold">Add New API Key</span>
                </div>
              </motion.button>
            )}

            {/* Add API Key Form */}
            <AnimatePresence>
              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">Add New API Key</h3>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <form onSubmit={addApiKey} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Label (Optional)
                      </label>
                      <input
                        type="text"
                        value={newKey.label}
                        onChange={(e) => setNewKey({ ...newKey, label: e.target.value })}
                        placeholder="e.g., Binance Main Account"
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-900/50 focus:border-cyan-900/50 transition-all duration-200"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="testnet"
                        checked={newKey.testnet}
                        onChange={(e) => setNewKey({ ...newKey, testnet: e.target.checked })}
                        className="w-4 h-4 text-cyan-900 bg-gray-700 border-gray-600 rounded focus:ring-cyan-900/50 focus:ring-2"
                      />
                      <label htmlFor="testnet" className="ml-2 text-sm text-gray-300">
                        Testnet/Sandbox Key
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        API Key *
                      </label>
                      <input
                        type="text"
                        required
                        value={newKey.api_key}
                        onChange={(e) => setNewKey({ ...newKey, api_key: e.target.value })}
                        placeholder="Enter your API Key"
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
                        value={newKey.api_secret}
                        onChange={(e) => setNewKey({ ...newKey, api_secret: e.target.value })}
                        placeholder="Enter your API Secret"
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-900/50 focus:border-cyan-900/50 transition-all duration-200 font-mono"
                      />
                    </div>

                    <div className="flex space-x-4 pt-4">
                      <motion.button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-3 bg-gray-700/50 border border-gray-600/50 text-gray-300 rounded-xl hover:bg-gray-600/50 hover:text-white transition-all duration-200"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        type="submit"
                        disabled={updating}
                        whileHover={{ scale: updating ? 1 : 1.02 }}
                        whileTap={{ scale: updating ? 1 : 0.98 }}
                        className="flex-1 py-3 bg-gradient-to-r from-cyan-900 to-cyan-900 text-gray-900 font-bold rounded-xl hover:from-cyan-800 hover:to-cyan-900 disabled:from-gray-600 disabled:to-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-cyan-900/25"
                      >
                        {updating ? 'Adding API Key...' : 'Add API Key'}
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* API Keys List */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl backdrop-blur-sm">
              <div className="p-6 border-b border-gray-700/50">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <svg className="w-6 h-6 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  Managed API Keys ({apiKeys.length})
                </h3>
              </div>

              {apiKeys.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <p className="text-lg">No API keys configured</p>
                  <p className="text-sm mt-2">Add your first API key to start automated trading</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-700/50">
                  {apiKeys.map((key) => (
                    <motion.div
                      key={key.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-6 hover:bg-gray-700/20 transition-colors duration-150"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-white font-semibold truncate">{key.label}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(key.validation_status)}`}>
                              {getStatusText(key.validation_status)}
                            </span>
                            {key.is_testnet && (
                              <span className="px-2 py-1 text-xs font-medium text-blue-400 bg-blue-400/10 border border-blue-400/20 rounded-full">
                                Testnet
                              </span>
                            )}
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                              key.is_active 
                                ? 'text-green-400 bg-green-400/10 border-green-400/20' 
                                : 'text-gray-400 bg-gray-400/10 border-gray-400/20'
                            }`}>
                              {key.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span>Created: {new Date(key.created_at).toLocaleDateString()}</span>
                            <span>ID: {key.id.slice(0, 8)}...</span>
                          </div>
                        </div>
                        <motion.button
                          onClick={() => deleteApiKey(key.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="ml-4 p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all duration-200"
                          title="Delete API Key"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;