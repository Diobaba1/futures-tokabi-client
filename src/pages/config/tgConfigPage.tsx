import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
   Send, Key, Hash, Trash2, Save, 
  CheckCircle, AlertCircle, Eye, EyeOff, 
  Shield, Clock, Sparkles, ArrowLeft, Crown
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
      setSuccess('Telegram configuration created successfully!');
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
      setSuccess('Telegram configuration updated successfully!');
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
      setSuccess('Telegram configuration deleted successfully!');
      setDeleteConfirm(false);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete Telegram configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleTestNotification = async () => {
    if (!config) return;
    try {
      setSuccess('Test notification sent! Check your Telegram.');
    } catch (err: any) {
      setError('Failed to send test notification');
    }
  };

  const isEditing = !!config;
  const hasChanges = config && (formData.chat_id !== config.chat_id || formData.bot_token !== config.bot_token);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header with back button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-amber-400 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back</span>
        </button>

        {/* Main Card */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 backdrop-blur-xl rounded-2xl border border-amber-500/20 overflow-hidden shadow-2xl shadow-amber-500/10">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-b border-amber-500/20 p-6 lg:p-8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/25 flex-shrink-0">
                <Crown className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent mb-2">
                  Telegram Notifications
                </h1>
                <p className="text-gray-400 text-sm lg:text-base">
                  Configure your Telegram bot to receive premium trading signals
                </p>
              </div>
            </div>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="mx-6 mt-6 bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-rose-300 text-sm">{error}</p>
              </div>
              <button onClick={() => setError('')} className="text-rose-400 hover:text-rose-300">
                <span className="sr-only">Close</span>
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

          {/* Premium Info Box */}
          <div className="mx-6 mt-6 bg-gradient-to-r from-amber-500/5 to-yellow-500/5 border border-amber-500/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Crown className="w-3 h-3 text-white" />
              </div>
              <div className="text-sm text-amber-100/80 space-y-2">
                <p className="font-semibold text-amber-300">Premium Setup Guide</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Create a bot via <span className="text-amber-300 font-mono">@BotFather</span> on Telegram</li>
                  <li>Get your chat ID from <span className="text-amber-300 font-mono">@userinfobot</span></li>
                  <li>Enter both values below to receive real-time signals</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-6">
            {/* Chat ID Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-amber-200">
                <Hash className="w-4 h-4 text-amber-400" />
                Chat ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="chat_id"
                  value={formData.chat_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-900/50 border border-amber-500/30 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 disabled:bg-gray-800/50 disabled:text-gray-500 transition-all"
                  placeholder="e.g., 123456789"
                  disabled={loading}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Hash className="w-4 h-4 text-amber-600" />
                </div>
              </div>
              <p className="text-xs text-amber-500/80 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Your unique Telegram chat identifier
              </p>
            </div>

            {/* Bot Token Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-amber-200">
                <Key className="w-4 h-4 text-amber-400" />
                Bot Token
              </label>
              <div className="relative">
                <input
                  type={showToken ? "text" : "password"}
                  name="bot_token"
                  value={formData.bot_token}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 pr-12 bg-gray-900/50 border border-amber-500/30 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 disabled:bg-gray-800/50 disabled:text-gray-500 transition-all font-mono text-sm"
                  placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-amber-600 hover:text-amber-400 transition-colors"
                  tabIndex={-1}
                >
                  {showToken ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-amber-500/80 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Secure token from @BotFather
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                disabled={loading || !formData.chat_id || !formData.bot_token || (isEditing && !hasChanges)}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-gray-900 font-bold py-3 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] group"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>{isEditing ? 'Update Configuration' : 'Create Configuration'}</span>
                  </>
                )}
              </button>
              
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(true)}
                  disabled={loading}
                  className="sm:w-auto flex items-center justify-center gap-2 border-2 border-amber-500/50 hover:border-amber-500 hover:bg-amber-500/10 text-amber-400 font-semibold py-3 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:text-amber-300"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              )}
            </div>

            {/* Change Indicator */}
            {isEditing && hasChanges && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <p className="text-xs text-amber-300">You have unsaved changes</p>
              </div>
            )}
          </form>

          {/* Current Configuration Display */}
          {config && (
            <div className="mx-6 mb-6 lg:mx-8 lg:mb-8 bg-gradient-to-br from-amber-500/5 to-yellow-500/5 rounded-xl border border-amber-500/20 p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-amber-500/20">
                <div className="w-5 h-5 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full flex items-center justify-center">
                  <Crown className="w-3 h-3 text-white" />
                </div>
                <h2 className="text-base font-semibold text-amber-200">
                  Active Configuration
                </h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center border border-amber-500/20">
                      <Hash className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xs text-amber-500/80">Telegram Coniguration</p>
                      <p className="text-sm text-amber-200 font-mono">{config.chat_id}</p>
                      <p className="text-sm text-amber-200 font-mono">{config.bot_token}</p>
                    </div>
                  </div>
                </div>

                

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center border border-amber-500/20">
                      <Clock className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xs text-amber-500/80">Created</p>
                      <p className="text-sm text-amber-200">
                        {new Date(config.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {config.updated_at && (
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center border border-amber-500/20">
                        <Clock className="w-4 h-4 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-xs text-amber-500/80">Last Updated</p>
                        <p className="text-sm text-amber-200">
                          {new Date(config.updated_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-amber-500/20">
                  <div className="flex items-center gap-2 text-xs text-amber-500/80">
                    <Shield className="w-3 h-3" />
                    <span>Your bot token is securely encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Test Notification Button */}
        {config && (
          <div className="mt-4">
            <button 
              onClick={handleTestNotification}
              className="w-full bg-gradient-to-r from-amber-500/5 to-yellow-500/5 backdrop-blur-xl border border-amber-500/20 hover:border-amber-500/50 rounded-xl p-4 transition-all group hover:shadow-lg hover:shadow-amber-500/10"
            >
              <div className="flex items-center justify-center gap-2 text-amber-400 group-hover:text-amber-300 transition-colors">
                <Send className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Send Test Notification</span>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-amber-500/20 p-6 max-w-md w-full shadow-2xl shadow-amber-500/10 animate-in zoom-in-95">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-amber-500/30">
                <AlertCircle className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-200 mb-1">Delete Configuration?</h3>
                <p className="text-sm text-amber-100/70">
                  This will permanently remove your Telegram bot configuration. You'll stop receiving premium notifications.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors font-medium border border-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-gray-900 font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/25"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TgConfigPage;