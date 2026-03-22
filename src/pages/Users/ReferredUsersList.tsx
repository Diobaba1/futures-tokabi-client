// ============================================================================
// FILE: src/components/referrals/ReferredUsersList.tsx
// Component to display users you have referred with structured response handling
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Calendar,
  DollarSign,
  Search,
  Filter,
  Award,
  Share2,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { MyReferralsResponse, ReferralUrlResponse } from '../../types/userAffiliate.types';
import { UserAffiliateService } from '../../api/services/UserAffiliateService';

const ReferredUsersList: React.FC = () => {
  const [response, setResponse] = useState<MyReferralsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy] = useState('created_at');
  const [sortOrder] = useState('desc');
  
  // Referral URL
  const [referralUrl, setReferralUrl] = useState<ReferralUrlResponse | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadReferredUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, subscriptionFilter, sortBy, sortOrder]);

  const loadReferredUsers = async () => {
    setLoading(true);
    try {
      const params: any = {
        sort_by: sortBy,
        sort_order: sortOrder,
        limit: 100
      };

      if (statusFilter) params.status = statusFilter;
      if (subscriptionFilter === 'subscribed') params.is_subscribed = true;
      if (subscriptionFilter === 'not_subscribed') params.is_subscribed = false;
      if (searchTerm) params.search = searchTerm;

      // Load both referrals and referral URL in parallel
      const [data, refUrlData] = await Promise.all([
        UserAffiliateService.getMyReferals(params),
        UserAffiliateService.getReferralUrl()
      ]);

      setResponse(data);
      setReferralUrl(refUrlData);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load referred users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadReferredUsers();
  };

  const handleCopyReferralUrl = async () => {
    if (!referralUrl?.referral_url) return;

    try {
      await navigator.clipboard.writeText(referralUrl.referral_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
      pending: { color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: <Clock className="w-4 h-4" />, label: 'Pending' },
      completed: { color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: <CheckCircle className="w-4 h-4" />, label: 'Completed' },
      rewarded: { color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', icon: <Award className="w-4 h-4" />, label: 'Rewarded' }
    };

    const badge = badges[status] || { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: null, label: status };

    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${badge.color}`}>
        {badge.icon}
        <span className="text-sm font-medium">{badge.label}</span>
      </div>
    );
  };

  const getSubscriptionBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      inactive: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      expired: 'bg-red-500/20 text-red-400 border-red-500/30'
    };

    return (
      <span className={`px-2 py-1 rounded text-xs border ${colors[status] || colors.inactive}`}>
        {status}
      </span>
    );
  };

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading referred users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
        <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <p className="text-red-400">{error}</p>
        <button
          onClick={loadReferredUsers}
          className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="bg-gray-500/10 border border-gray-500/30 rounded-lg p-6 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-400">No data available</p>
      </div>
    );
  }

  const users = response.referrals;
  const hasFilters = statusFilter || subscriptionFilter || searchTerm;

  return (
    <div className="space-y-6 p-5">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-7 h-7 text-cyan-400" />
            Referred Users
          </h2>
          <p className="text-gray-400 mt-1">
            {response.has_referrals 
              ? `${response.total} total ${response.total === 1 ? 'referral' : 'referrals'}`
              : 'No referrals yet'
            }
            {hasFilters && response.filtered !== response.total && (
              <span className="text-cyan-400"> • Showing {response.filtered} filtered</span>
            )}
          </p>
        </div>
      </div>

      {/* Info Banner for no referrals */}
      {!response.has_referrals && (
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <Share2 className="w-8 h-8 text-cyan-400 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                Start Referring Users
              </h3>
              <p className="text-gray-300 mb-4">
                {response.message}
              </p>
              
              {/* Referral URL Display */}
              {referralUrl && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 bg-dark-elevated border border-dark-border rounded-lg p-3">
                    <input
                      type="text"
                      readOnly
                      value={referralUrl.referral_url}
                      className="flex-1 bg-transparent text-gray-300 text-sm focus:outline-none"
                    />
                    <button
                      onClick={handleCopyReferralUrl}
                      className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 rounded transition-colors text-white text-sm font-medium"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              <button 
                onClick={handleCopyReferralUrl}
                disabled={!referralUrl}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-500 disabled:cursor-not-allowed rounded-lg transition-colors text-white font-medium"
              >
                {copied ? 'Copied!' : 'Copy Referral Link'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Show filters only if user has referrals */}
      {response.has_referrals && (
        <>
          {/* Filters */}
          <div className="bg-dark-elevated border border-dark-border rounded-xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Search
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search by email or name..."
                    className="flex-1 bg-dark-elevated border border-dark-border rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-dark-elevated border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="rewarded">Rewarded</option>
                </select>
              </div>

              {/* Subscription Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Subscription
                </label>
                <select
                  value={subscriptionFilter}
                  onChange={(e) => setSubscriptionFilter(e.target.value)}
                  className="w-full bg-dark-elevated border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="">All</option>
                  <option value="subscribed">Subscribed</option>
                  <option value="not_subscribed">Not Subscribed</option>
                </select>
              </div>
            </div>
          </div>

          {/* User Cards or No Results */}
          {users.length === 0 ? (
            <div className="text-center py-12 bg-dark-elevated border border-dark-border rounded-xl">
              <Filter className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No Matching Referrals
              </h3>
              <p className="text-gray-400 mb-4">{response.message}</p>
              {hasFilters && (
                <button
                  onClick={() => {
                    setStatusFilter('');
                    setSubscriptionFilter('');
                    setSearchTerm('');
                  }}
                  className="px-4 py-2 bg-dark-elevated hover:bg-dark-surface rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {users.map((user) => (
                <div
                  key={user.referral_id}
                  className="bg-dark-elevated border border-dark-border rounded-xl p-6 hover:border-dark-border transition-colors"
                >
                  {/* User Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-white font-medium">{user.email}</span>
                      </div>
                      {user.full_name && (
                        <p className="text-gray-400 text-sm ml-6">{user.full_name}</p>
                      )}
                    </div>
                    {user.is_active ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {getStatusBadge(user.status)}
                    {getSubscriptionBadge(user.subscription_status)}
                    {user.is_verified && (
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded text-xs">
                        Verified
                      </span>
                    )}
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Referred</div>
                      <div className="flex items-center gap-1 text-sm text-gray-300">
                        <Calendar className="w-3 h-3" />
                        {user.days_since_referral} days ago
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Last Login</div>
                      <div className="text-sm text-gray-300">
                        {user.days_since_login !== null
                          ? `${user.days_since_login} days ago`
                          : 'Never'}
                      </div>
                    </div>
                  </div>

                  {/* Reward Info */}
                  {user.reward_given && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm text-emerald-400 font-medium">
                          Reward Earned
                        </span>
                      </div>
                      <span className="text-emerald-400 font-bold">
                        {formatCurrency(user.reward_amount)}
                      </span>
                    </div>
                  )}

                  {/* Conversion Stage */}
                  <div className="mt-4 pt-4 border-t border-dark-border">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Conversion Stage:</span>
                      <span className="text-gray-400 font-medium capitalize">
                        {user.conversion_stage}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReferredUsersList;