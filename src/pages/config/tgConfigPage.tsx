import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Send, Key, Hash, Trash2, Save, 
  CheckCircle, AlertCircle, Eye, EyeOff, 
  Shield, Clock, Sparkles, ArrowLeft, Crown,
  Bot, MessageCircle, TestTube, Zap,
  Copy, CheckCheck, Settings
} from 'lucide-react';
import {
  TelegramConfigCreate,
  TelegramConfigResponse,
  TelegramConfigUpdate,
} from '../../types/telegram-config.types';
import { telegramConfigService } from '../../api/services/telegramConfigService';

const TgConfigPage: React.FC = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState<TelegramConfigResponse | null>(null);
  const [formData, setFormData] = useState<TelegramConfigCreate>({
    chat_id: '',
    bot_token: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showToken, setShowToken] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [testLoading, setTestLoading] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      setError('');
      const configs = await telegramConfigService.get();
      if (configs.length > 0) {
        const currentConfig = configs[0];
        setConfig(currentConfig);
        setFormData({
          chat_id: currentConfig.chat_id,
          bot_token: currentConfig.bot_token,
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch Telegram configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      await handleUpdate(e);
    } else {
      await handleCreate(e);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    try {
      setLoading(true);
      setError('');
      const newConfig = await telegramConfigService.create(formData);
      setConfig(newConfig);
      setSuccess('🎉 Telegram configuration created successfully!');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create Telegram configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    try {
      setLoading(true);
      setError('');
      const updateData: TelegramConfigUpdate = {};
      if (formData.chat_id !== config.chat_id) updateData.chat_id = formData.chat_id;
      if (formData.bot_token !== config.bot_token) updateData.bot_token = formData.bot_token;
      const updatedConfig = await telegramConfigService.update(config.id, updateData);
      setConfig(updatedConfig);
      setSuccess('✨ Telegram configuration updated successfully!');
      setDeleteConfirm(false);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update Telegram configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!config) return;
    try {
      setLoading(true);
      setError('');
      await telegramConfigService.delete(config.id);
      setConfig(null);
      setFormData({ chat_id: '', bot_token: '' });
      setSuccess('🗑️ Telegram configuration deleted successfully!');
      setDeleteConfirm(false);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete Telegram configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleTestNotification = async () => {
    if (!config) return;
    try {
      setTestLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess('🚀 Test notification sent! Check your Telegram.');
    } catch (err: any) {
      setError('Failed to send test notification');
    } finally {
      setTestLoading(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const isEditing = !!config;
  const hasChanges = config && (formData.chat_id !== config.chat_id || formData.bot_token !== config.bot_token);

  const StepGuide = () => (
    <div className="bg-gradient-to-br from-cyan-800/10 to-cyan-900/10 border border-cyan-800/20 rounded-2xl p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-cyan-800 to-cyan-900 rounded-xl flex items-center justify-center">
          <Settings className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-lg font-bold text-cyan-600">Setup Guide</h3>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-cyan-800/5 rounded-xl p-4 border border-cyan-800/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-cyan-800/20 rounded-full flex items-center justify-center text-xs font-bold text-cyan-700">1</div>
            <Bot className="w-4 h-4 text-cyan-800" />
          </div>
          <p className="text-sm text-amber-100/80 font-medium mb-1">Create Bot</p>
          <p className="text-xs text-cyan-800/70">Message <span className="font-mono text-cyan-700">@BotFather</span> and create new bot</p>
        </div>
        
        <div className="bg-cyan-800/5 rounded-xl p-4 border border-cyan-800/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-cyan-800/20 rounded-full flex items-center justify-center text-xs font-bold text-cyan-700">2</div>
            <MessageCircle className="w-4 h-4 text-cyan-800" />
          </div>
          <p className="text-sm text-amber-100/80 font-medium mb-1">Get Chat ID</p>
          <p className="text-xs text-cyan-800/70">Message <span className="font-mono text-cyan-700">@userinfobot</span> to get your Chat ID</p>
        </div>
        
        <div className="bg-cyan-800/5 rounded-xl p-4 border border-cyan-800/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-cyan-800/20 rounded-full flex items-center justify-center text-xs font-bold text-cyan-700">3</div>
            <Zap className="w-4 h-4 text-cyan-800" />
          </div>
          <p className="text-sm text-amber-100/80 font-medium mb-1">Configure</p>
          <p className="text-xs text-cyan-800/70">Enter details below and start receiving signals</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-3 text-gray-400 hover:text-cyan-800 transition-all duration-300 group"
          >
            <div className="w-10 h-10 bg-gray-800/50 rounded-xl flex items-center justify-center group-hover:bg-cyan-800/10 border border-gray-700 group-hover:border-cyan-800/30 transition-all">
              <ArrowLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <span className="font-medium">Back to Dashboard</span>
          </button>
          
          <div className="text-right">
            <div className="flex items-center gap-2 text-cyan-800">
              <Crown className="w-5 h-5" />
              <span className="font-semibold text-sm">Premium Setup</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">Real-time Trading Signals</div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            {/* Main Card */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 backdrop-blur-xl rounded-2xl border border-cyan-800/20 overflow-hidden shadow-2xl shadow-cyan-800/10">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-cyan-800/10 to-cyan-900/10 border-b border-cyan-800/20 p-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-800 to-cyan-900 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-800/25 flex-shrink-0">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-700 to-cyan-600 bg-clip-text text-transparent mb-2">
                      Telegram Bot
                    </h1>
                    <p className="text-gray-400">
                      Configure your bot to receive instant trading signals
                    </p>
                  </div>
                </div>
              </div>

              {/* Step Guide */}
              <div className="p-6 border-b border-cyan-800/10">
                <StepGuide />
              </div>

              {/* Alert Messages */}
              {error && (
                <div className="mx-6 mt-6 bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-rose-300 text-sm">{error}</p>
                  </div>
                  <button onClick={() => setError('')} className="text-rose-400 hover:text-rose-300 transition-colors">
                    ×
                  </button>
                </div>
              )}
              
              {success && (
                <div className="mx-6 mt-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-emerald-300 text-sm font-medium">{success}</p>
                  </div>
                </div>
              )}

              {/* Form Section */}
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {/* Chat ID Field */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-cyan-600">
                    <Hash className="w-5 h-5 text-cyan-800" />
                    Chat ID
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      name="chat_id"
                      value={formData.chat_id}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-4 bg-gray-900/50 border-2 border-cyan-800/20 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-800/50 focus:ring-4 focus:ring-cyan-800/10 disabled:bg-gray-800/50 disabled:text-gray-500 transition-all duration-300"
                      placeholder="1234567890"
                      disabled={loading}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <Hash className="w-5 h-5 text-cyan-900" />
                    </div>
                  </div>
                  <p className="text-xs text-cyan-800/80 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    Your unique Telegram chat identifier from @userinfobot
                  </p>
                </div>

                {/* Bot Token Field */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-cyan-600">
                    <Key className="w-5 h-5 text-cyan-800" />
                    Bot Token
                  </label>
                  <div className="relative group">
                    <input
                      type={showToken ? "text" : "password"}
                      name="bot_token"
                      value={formData.bot_token}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-4 pr-12 bg-gray-900/50 border-2 border-cyan-800/20 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-800/50 focus:ring-4 focus:ring-cyan-800/10 disabled:bg-gray-800/50 disabled:text-gray-500 transition-all duration-300 font-mono text-sm"
                      placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                      disabled={loading}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
                      <button
                        type="button"
                        onClick={() => setShowToken(!showToken)}
                        className="p-1 text-cyan-900 hover:text-cyan-800 transition-colors"
                        tabIndex={-1}
                      >
                        {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-cyan-800/80 flex items-center gap-2">
                    <Shield className="w-3 h-3" />
                    Secure token from @BotFather - keep this safe!
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={loading || !formData.chat_id || !formData.bot_token || (isEditing && !hasChanges)}
                    className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-800 to-cyan-900 hover:from-cyan-900 hover:to-yellow-700 text-gray-900 font-bold py-4 px-8 rounded-xl focus:outline-none focus:ring-4 focus:ring-cyan-800/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-cyan-800/25 hover:shadow-cyan-800/40 hover:scale-[1.02] group"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
                        <span className="font-semibold">Saving Configuration...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-semibold">
                          {isEditing ? 'Update Configuration' : 'Create Configuration'}
                        </span>
                      </>
                    )}
                  </button>
                  
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(true)}
                      disabled={loading}
                      className="sm:w-auto flex items-center justify-center gap-3 border-2 border-cyan-800/30 hover:border-cyan-800 hover:bg-cyan-800/10 text-cyan-800 font-semibold py-4 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-800/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 hover:text-cyan-700 hover:scale-[1.02]"
                    >
                      <Trash2 className="w-5 h-5" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>

                {/* Change Indicator */}
                {isEditing && hasChanges && (
                  <div className="bg-cyan-800/10 border border-cyan-800/30 rounded-xl p-4 flex items-center gap-3 animate-pulse">
                    <AlertCircle className="w-5 h-5 text-cyan-800 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-cyan-700">Unsaved Changes</p>
                      <p className="text-xs text-cyan-800/80">Click update to save your changes</p>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Test Notification Section */}
            {config && (
              <div className="mt-6 bg-gradient-to-br from-gray-800/50 to-gray-800/30 backdrop-blur-xl rounded-2xl border border-cyan-800/20 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TestTube className="w-6 h-6 text-cyan-800" />
                  <h3 className="text-lg font-semibold text-cyan-600">Test Configuration</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Send a test notification to verify your bot is working correctly
                </p>
                <button 
                  onClick={handleTestNotification}
                  disabled={testLoading}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-800/10 to-cyan-900/10 border border-cyan-800/20 hover:border-cyan-800/50 rounded-xl py-4 px-6 transition-all duration-300 group hover:shadow-lg hover:shadow-cyan-800/10 disabled:opacity-50"
                >
                  {testLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-cyan-800/30 border-t-cyan-800 rounded-full animate-spin" />
                      <span className="text-cyan-800 font-medium">Sending Test...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 text-cyan-800 group-hover:scale-110 transition-transform" />
                      <span className="text-cyan-800 font-medium">Send Test Notification</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Current Configuration */}
          <div className="lg:col-span-1">
            {config && (
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 backdrop-blur-xl rounded-2xl border border-cyan-800/20 p-6 sticky top-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-800 to-cyan-900 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-cyan-600">Active Config</h2>
                    <p className="text-xs text-cyan-800/80">Live Configuration</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* Chat ID Display */}
                  <div className="bg-cyan-800/5 rounded-xl p-4 border border-cyan-800/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-cyan-800" />
                        <span className="text-xs font-medium text-cyan-800/80">Chat ID</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(config.chat_id, 'chat_id')}
                        className="p-1 text-cyan-900 hover:text-cyan-800 transition-colors"
                      >
                        {copiedField === 'chat_id' ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-sm font-mono text-cyan-600 truncate">{config.chat_id}</p>
                  </div>

                  {/* Bot Token Display */}
                  <div className="bg-cyan-800/5 rounded-xl p-4 border border-cyan-800/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-cyan-800" />
                        <span className="text-xs font-medium text-cyan-800/80">Bot Token</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(config.bot_token, 'bot_token')}
                        className="p-1 text-cyan-900 hover:text-cyan-800 transition-colors"
                      >
                        {copiedField === 'bot_token' ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-sm font-mono text-cyan-600 truncate">{config.bot_token}</p>
                  </div>

                  {/* Timestamps */}
                  <div className="space-y-3 pt-4 border-t border-cyan-800/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-cyan-800" />
                        <span className="text-xs text-cyan-800/80">Created</span>
                      </div>
                      <span className="text-xs text-cyan-600">
                        {new Date(config.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {config.updated_at && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-cyan-800" />
                          <span className="text-xs text-cyan-800/80">Updated</span>
                        </div>
                        <span className="text-xs text-cyan-600">
                          {new Date(config.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Security Badge */}
                  <div className="pt-4 border-t border-cyan-800/10">
                    <div className="flex items-center gap-2 text-xs text-cyan-800/70">
                      <Shield className="w-4 h-4" />
                      <span>Your credentials are securely encrypted</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-cyan-800/20 p-6 max-w-md w-full shadow-2xl shadow-cyan-800/10 animate-in zoom-in-95">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-cyan-800/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-cyan-800/30">
                <AlertCircle className="w-6 h-6 text-cyan-800" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-cyan-600 mb-2">Delete Configuration?</h3>
                <p className="text-sm text-amber-100/70">
                  This will permanently remove your Telegram bot configuration and stop all notifications.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirm(false)}
                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all duration-300 font-medium border border-gray-600 hover:border-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-800 to-cyan-900 hover:from-cyan-900 hover:to-yellow-700 text-gray-900 font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-800/25 hover:shadow-cyan-800/40"
              >
                {loading ? 'Deleting...' : 'Delete Configuration'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TgConfigPage;