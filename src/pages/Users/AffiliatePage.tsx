// ============================================================================
// FILE: src/pages/Users/AffiliatePage.tsx (COMPLETE)
// ============================================================================

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Share2, 
  Award,
  Copy,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  ExternalLink,
  Plus,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { UserAffiliateService } from '../../api/services/UserAffiliateService';
import { useAuth } from '../../components/contexts/AuthContext';
import type {
  ApplicationStatusResponse,
  ProfileStatusResponse,
  AffiliateStatsResponse,
  ReferralUrlResponse,
  AffiliateCommissionResponse
} from '../../types/userAffiliate.types';

type TabType = 'overview' | 'application' | 'referral' | 'commissions' | 'profile';

const AffiliatePage: React.FC = () => {
  useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for different data
  const [stats, setStats] = useState<AffiliateStatsResponse | null>(null);
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatusResponse | null>(null);
  const [profileStatus, setProfileStatus] = useState<ProfileStatusResponse | null>(null);
  const [referralUrl, setReferralUrl] = useState<ReferralUrlResponse | null>(null);
  const [commissions, setCommissions] = useState<AffiliateCommissionResponse[]>([]);
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Always load stats and referral URL (these work for all users)
      const [statsData, refUrlData, appStatusData, profStatusData] = await Promise.all([
        UserAffiliateService.getStats(),
        UserAffiliateService.getReferralUrl(),
        UserAffiliateService.getApplication(),
        UserAffiliateService.getProfile()
      ]);
      
      setStats(statsData);
      setReferralUrl(refUrlData);
      setApplicationStatus(appStatusData);
      setProfileStatus(profStatusData);

    } catch (err: any) {
      console.error('Error loading initial data:', err);
      setError(err.response?.data?.detail || 'Failed to load affiliate data');
    } finally {
      setLoading(false);
    }
  };

  const loadCommissions = async () => {
    try {
      const data = await UserAffiliateService.getCommissions({ limit: 50 });
      setCommissions(data);
    } catch (error: any) {
      console.error('Error loading commissions:', error);
      // Empty array is fine - handled gracefully
    }
  };

  useEffect(() => {
    if (activeTab === 'commissions') {
      loadCommissions();
    }
  }, [activeTab]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'paid':
        return 'text-emerald-400';
      case 'pending':
        return 'text-amber-400';
      case 'rejected':
      case 'cancelled':
        return 'text-red-400';
      case 'suspended':
        return 'text-orange-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'rejected':
      case 'cancelled':
      case 'suspended':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // Determine what actions to show based on user status
  const canApply = !applicationStatus?.has_application && !profileStatus?.is_affiliate;
  const hasApplication = applicationStatus?.has_application || false;
  const isAffiliate = profileStatus?.is_affiliate || false;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading affiliate data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Failed to Load</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={loadInitialData}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Affiliate Program
            </h1>
            <p className="text-gray-400 mt-1">
              {isAffiliate
                ? `Earn ${stats?.initial_commission_rate}% on new signups + ${stats?.renewal_commission_rate}% on renewals`
                : 'Earn 10% commission by referring new users'
              }
            </p>
          </div>
          {canApply && (
            <button
              onClick={() => setShowApplicationModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              Become an Affiliate
            </button>
          )}
          {isAffiliate && (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Approved Affiliate</span>
            </div>
          )}
        </div>

        {/* Info Banner for non-affiliates with application */}
        {hasApplication && !isAffiliate && applicationStatus?.application && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-400 mb-1">Application Pending</h3>
              <p className="text-gray-300 text-sm">
                Your affiliate application is under review. We'll notify you once it's been processed.
                Current status: <span className="capitalize font-medium">{applicationStatus.application.status}</span>
              </p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<Users className="w-6 h-6" />}
              title="Total Referrals"
              value={stats.total_referrals}
              color="cyan"
            />
            <StatCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Active Referrals"
              value={stats.active_referrals}
              subtitle={`${stats.conversion_rate.toFixed(1)}% conversion`}
              color="emerald"
            />
            <StatCard
              icon={<DollarSign className="w-6 h-6" />}
              title="Total Earnings"
              value={formatCurrency(stats.total_earnings)}
              subtitle={`${formatCurrency(stats.pending_earnings)} pending`}
              color="blue"
            />
            <StatCard
              icon={<Award className="w-6 h-6" />}
              title="Commission Rate"
              value={`${stats.initial_commission_rate}%`}
              subtitle={isAffiliate ? 'Approved Affiliate' : 'Standard User'}
              color="purple"
            />
          </div>
        )}

        {/* Tabs */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden">
          <div className="border-b border-slate-800 overflow-x-auto">
            <div className="flex">
              <Tab
                active={activeTab === 'overview'}
                onClick={() => setActiveTab('overview')}
                icon={<TrendingUp className="w-4 h-4" />}
                label="Overview"
              />
              <Tab
                active={activeTab === 'referral'}
                onClick={() => setActiveTab('referral')}
                icon={<Share2 className="w-4 h-4" />}
                label="Referral Link"
              />
              <Tab
                active={activeTab === 'commissions'}
                onClick={() => setActiveTab('commissions')}
                icon={<DollarSign className="w-4 h-4" />}
                label="Commissions"
              />
              {hasApplication && (
                <Tab
                  active={activeTab === 'application'}
                  onClick={() => setActiveTab('application')}
                  icon={<FileText className="w-4 h-4" />}
                  label="Application"
                />
              )}
              {isAffiliate && profileStatus?.profile && (
                <Tab
                  active={activeTab === 'profile'}
                  onClick={() => setActiveTab('profile')}
                  icon={<Award className="w-4 h-4" />}
                  label="Profile"
                />
              )}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && <OverviewTab stats={stats} />}
            {activeTab === 'application' && (
              <ApplicationTab
                applicationStatus={applicationStatus}
                onApply={() => setShowApplicationModal(true)}
                getStatusIcon={getStatusIcon}
              />
            )}
            {activeTab === 'referral' && (
              <ReferralTab
                referralUrl={referralUrl}
                copiedUrl={copiedUrl}
                onCopy={copyToClipboard}
              />
            )}
            {activeTab === 'commissions' && (
              <CommissionsTab
                commissions={commissions}
                formatCurrency={formatCurrency}
                getStatusColor={getStatusColor}
                getStatusIcon={getStatusIcon}
                isAffiliate={isAffiliate}
              />
            )}
            {activeTab === 'profile' && (
              <ProfileTab 
                profileStatus={profileStatus} 
                stats={stats} 
              />
            )}
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <ApplicationModal
          onClose={() => setShowApplicationModal(false)}
          onSuccess={() => {
            setShowApplicationModal(false);
            loadInitialData();
          }}
        />
      )}
    </div>
  );
};

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

const StatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  color: 'cyan' | 'emerald' | 'blue' | 'purple';
}> = ({ icon, title, value, subtitle, color }) => {
  const colorClasses = {
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-400',
    emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-400',
    blue: 'from-blue-500/20 to-blue-500/5 border-blue-500/30 text-blue-400',
    purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-400'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-6`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={colorClasses[color].split(' ')[3]}>{icon}</div>
        <h3 className="text-gray-400 text-sm">{title}</h3>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
};

const Tab: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
      active
        ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/5'
        : 'text-gray-400 hover:text-gray-300 hover:bg-slate-800/50'
    }`}
  >
    {icon}
    {label}
  </button>
);

// ============================================================================
// TAB COMPONENTS
// ============================================================================

const OverviewTab: React.FC<{ stats: AffiliateStatsResponse | null }> = ({ stats }) => {
  if (!stats) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-8 h-8 text-gray-600 mx-auto mb-4 animate-spin" />
        <p className="text-gray-400">Loading stats...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
          <div className="text-gray-400 text-sm mb-1">Pending Earnings</div>
          <div className="text-2xl font-bold text-amber-400">
            ${(stats.pending_earnings / 100).toFixed(2)}
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
          <div className="text-gray-400 text-sm mb-1">Paid Earnings</div>
          <div className="text-2xl font-bold text-emerald-400">
            ${(stats.paid_earnings / 100).toFixed(2)}
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
          <div className="text-gray-400 text-sm mb-1">Commission Rates</div>
          <div className="text-lg font-bold text-cyan-400">
            {stats.initial_commission_rate}% / {stats.renewal_commission_rate}%
          </div>
          <div className="text-xs text-gray-500 mt-1">Initial / Renewal</div>
        </div>
      </div>

      {stats.total_referrals === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Referrals Yet</h3>
          <p className="text-gray-400">
            Share your referral link to start earning commissions!
          </p>
        </div>
      )}
    </div>
  );
};

const ApplicationTab: React.FC<{
  applicationStatus: ApplicationStatusResponse | null;
  onApply: () => void;
  getStatusIcon: (status: string) => React.ReactNode;
}> = ({ applicationStatus, onApply, getStatusIcon }) => {
  if (!applicationStatus?.has_application || !applicationStatus.application) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Application Yet</h3>
        <p className="text-gray-400 mb-2">{applicationStatus?.message}</p>
        <p className="text-gray-500 text-sm mb-6">
          Apply to earn 25% commission on initial subscriptions + 10% on renewals
        </p>
        <button
          onClick={onApply}
          className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-medium transition-colors"
        >
          Apply Now
        </button>
      </div>
    );
  }

  const application = applicationStatus.application;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Application Status</h3>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
          application.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
          application.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
          application.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
          'bg-orange-500/20 text-orange-400'
        }`}>
          {getStatusIcon(application.status)}
          <span className="capitalize font-medium">{application.status}</span>
        </div>
      </div>

      <div className="bg-slate-800/30 rounded-lg p-6 space-y-4">
        <div>
          <div className="text-sm text-gray-400 mb-2">Social Links</div>
          <div className="space-y-2">
            {application.social_links.map((link, index) => (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 break-all"
              >
                <ExternalLink className="w-4 h-4 flex-shrink-0" />
                {link}
              </a>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-400 mb-1">Reason for Joining</div>
          <p className="text-gray-300">{application.reason}</p>
        </div>

        <div>
          <div className="text-sm text-gray-400 mb-1">How You Found Us</div>
          <p className="text-gray-300">{application.how_found}</p>
        </div>

        {application.rejection_reason && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <div className="text-sm text-red-400 font-medium mb-1">Rejection Reason</div>
            <p className="text-red-300">{application.rejection_reason}</p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 border-t border-slate-700 pt-4">
          <span>Applied: {new Date(application.created_at).toLocaleDateString()}</span>
          {application.reviewed_at && (
            <span>Reviewed: {new Date(application.reviewed_at).toLocaleDateString()}</span>
          )}
        </div>
      </div>
    </div>
  );
};

const ReferralTab: React.FC<{
  referralUrl: ReferralUrlResponse | null;
  copiedUrl: boolean;
  onCopy: (text: string) => void;
}> = ({ referralUrl, copiedUrl, onCopy }) => {
  if (!referralUrl) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-8 h-8 text-gray-600 mx-auto mb-4 animate-spin" />
        <p className="text-gray-400">Loading referral link...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Your Referral Link</h3>
        <div className="bg-slate-800/30 rounded-lg p-4 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={referralUrl.referral_url}
              readOnly
              className="w-full bg-transparent text-cyan-400 focus:outline-none truncate"
            />
          </div>
          <button
            onClick={() => onCopy(referralUrl.referral_url)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors flex-shrink-0"
          >
            {copiedUrl ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border border-cyan-500/30 rounded-lg p-6">
          <div className="text-gray-400 text-sm mb-1">Referral Code</div>
          <div className="text-2xl font-bold text-cyan-400 font-mono">{referralUrl.referral_code}</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/30 rounded-lg p-6">
          <div className="text-gray-400 text-sm mb-1">Affiliate Status</div>
          <div className="text-xl font-bold">
            {referralUrl.is_affiliate ? (
              <span className="text-emerald-400">✓ Approved Affiliate</span>
            ) : (
              <span className="text-amber-400">Standard User</span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-800/30 rounded-lg p-6">
        <h4 className="font-semibold mb-4">Your Commission Rates</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-3 border-b border-slate-700">
            <div>
              <div className="font-medium">Initial Subscription</div>
              <div className="text-sm text-gray-400">One-time commission on first purchase</div>
            </div>
            <span className="text-2xl font-bold text-cyan-400">
              {referralUrl.commission_rates.initial}%
            </span>
          </div>
          <div className="flex justify-between items-center py-3">
            <div>
              <div className="font-medium">Renewal Subscriptions</div>
              <div className="text-sm text-gray-400">
                {referralUrl.commission_rates.renewal > 0 
                  ? 'Recurring commission on renewals'
                  : 'Upgrade to affiliate for renewal commissions'
                }
              </div>
            </div>
            <span className={`text-2xl font-bold ${
              referralUrl.commission_rates.renewal > 0 ? 'text-blue-400' : 'text-gray-500'
            }`}>
              {referralUrl.commission_rates.renewal}%
            </span>
          </div>
        </div>
      </div>

      {!referralUrl.is_affiliate && (
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-6">
          <h4 className="font-semibold text-cyan-400 mb-3">Become an Affiliate</h4>
          <p className="text-gray-300 mb-4">
            Upgrade to our affiliate program to earn <strong>25%</strong> on initial subscriptions and{' '}
            <strong>10%</strong> recurring commission on all renewals!
          </p>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-cyan-400" />
              Higher initial commission (10% → 25%)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-cyan-400" />
              Earn 10% on all subscription renewals
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-cyan-400" />
              Access to exclusive marketing materials
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

const CommissionsTab: React.FC<{
  commissions: AffiliateCommissionResponse[];
  formatCurrency: (cents: number) => string;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  isAffiliate: boolean;
}> = ({ commissions, formatCurrency, getStatusColor, getStatusIcon, isAffiliate }) => {
  if (!isAffiliate) {
    return (
      <div className="text-center py-12">
        <DollarSign className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Affiliate-Only Feature</h3>
        <p className="text-gray-400">
          Apply to become an affiliate to start earning commissions and track your earnings here.
        </p>
      </div>
    );
  }

  if (commissions.length === 0) {
    return (
      <div className="text-center py-12">
        <DollarSign className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Commissions Yet</h3>
        <p className="text-gray-400">
          Start referring users to earn commissions. Share your referral link to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Commission History</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Type</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium">Subscription</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium">Rate</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium">Commission</th>
              <th className="text-center py-3 px-4 text-gray-400 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {commissions.map((commission) => (
              <tr key={commission.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                <td className="py-4 px-4 text-sm">
                  {new Date(commission.created_at).toLocaleDateString()}
                </td>
                <td className="py-4 px-4">
                  <span className="capitalize text-sm font-medium">{commission.commission_type}</span>
                </td>
                <td className="py-4 px-4 text-right text-sm">
                  {formatCurrency(commission.subscription_amount)}
                </td>
                <td className="py-4 px-4 text-right text-sm text-cyan-400 font-medium">
                  {commission.commission_rate}%
                </td>
                <td className="py-4 px-4 text-right font-bold text-cyan-400">
                  {formatCurrency(commission.commission_amount)}
                </td>
                <td className="py-4 px-4">
                  <div className={`flex items-center justify-center gap-2 ${getStatusColor(commission.status)}`}>
                    {getStatusIcon(commission.status)}
                    <span className="capitalize text-sm font-medium">{commission.status}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ProfileTab: React.FC<{
  profileStatus: ProfileStatusResponse | null;
  stats: AffiliateStatsResponse | null;
}> = ({ profileStatus, stats }) => {
  if (!profileStatus?.has_profile || !profileStatus.profile) {
    return (
      <div className="text-center py-12">
        <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Affiliate Profile</h3>
        <p className="text-gray-400 mb-2">{profileStatus?.message}</p>
        <p className="text-gray-500 text-sm">
          Apply to become an affiliate to unlock your profile and earn higher commissions
        </p>
      </div>
    );
  }

  const profile = profileStatus.profile;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center">
            <Award className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Affiliate Profile</h3>
            <p className="text-gray-400">Member since {new Date(profile.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-gray-400 mb-1">Status</div>
            <div className={`font-semibold ${profile.is_active ? 'text-emerald-400' : 'text-red-400'}`}>
              {profile.is_active ? '✓ Active' : '✗ Inactive'}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-1">Total Referrals</div>
            <div className="text-xl font-bold">{profile.total_referrals}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-1">Initial Rate</div>
            <div className="text-xl font-bold text-cyan-400">{profile.initial_commission_rate}%</div>
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-1">Renewal Rate</div>
            <div className="text-xl font-bold text-blue-400">{profile.renewal_commission_rate}%</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700">
          <div className="text-sm text-gray-400 mb-1">Total Earnings</div>
          <div className="text-2xl font-bold text-cyan-400">
            ${(profile.total_earnings / 100).toFixed(2)}
          </div>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700">
          <div className="text-sm text-gray-400 mb-1">Pending</div>
          <div className="text-2xl font-bold text-amber-400">
            ${(profile.pending_earnings / 100).toFixed(2)}
          </div>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700">
          <div className="text-sm text-gray-400 mb-1">Paid Out</div>
          <div className="text-2xl font-bold text-emerald-400">
            ${(profile.paid_earnings / 100).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// APPLICATION MODAL
// ============================================================================

const ApplicationModal: React.FC<{
  onClose: () => void;
  onSuccess: () => void;
}> = ({ onClose, onSuccess }) => {
  const [socialLinks, setSocialLinks] = useState<string[]>(['']);
  const [reason, setReason] = useState('');
  const [howFound, setHowFound] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addSocialLink = () => {
    if (socialLinks.length < 10) {
      setSocialLinks([...socialLinks, '']);
    }
  };

  const removeSocialLink = (index: number) => {
    if (socialLinks.length > 1) {
      setSocialLinks(socialLinks.filter((_, i) => i !== index));
    }
  };

  const updateSocialLink = (index: number, value: string) => {
    const newLinks = [...socialLinks];
    newLinks[index] = value;
    setSocialLinks(newLinks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validLinks = socialLinks.filter(link => link.trim() && link.startsWith('http'));
    if (validLinks.length === 0) {
      setError('Please add at least one valid social link (must start with http:// or https://)');
      return;
    }

    if (reason.length < 50) {
      setError(`Reason must be at least 50 characters (currently ${reason.length})`);
      return;
    }

    if (howFound.length < 10) {
      setError(`"How you found us" must be at least 10 characters (currently ${howFound.length})`);
      return;
    }

    setLoading(true);
    try {
      await UserAffiliateService.applyForAffiliate({
        social_links: validLinks,
        reason,
        how_found: howFound
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Apply for Affiliate Program
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Social Links */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Social Media Links <span className="text-red-400">*</span>
            </label>
            <p className="text-sm text-gray-400 mb-3">
              Add your social media profiles (Twitter, Instagram, YouTube, TikTok, etc.)
            </p>
            <div className="space-y-2">
              {socialLinks.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => updateSocialLink(index, e.target.value)}
                    placeholder="https://twitter.com/username"
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                  />
                  {socialLinks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSocialLink(index)}
                      className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {socialLinks.length < 10 && (
              <button
                type="button"
                onClick={addSocialLink}
                className="mt-2 flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add another link
              </button>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Why do you want to join our affiliate program? <span className="text-red-400">*</span>
            </label>
            <p className="text-sm text-gray-400 mb-3">
              Minimum 50 characters. Tell us about your audience and why you'd be a great fit.
            </p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={5}
              placeholder="I have a dedicated audience of crypto traders who would benefit from Tokabi's automated trading features..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 resize-none"
            />
            <div className={`text-xs mt-1 ${reason.length >= 50 ? 'text-emerald-400' : 'text-gray-500'}`}>
              {reason.length} / 50 characters {reason.length >= 50 && '✓'}
            </div>
          </div>

          {/* How Found */}
          <div>
            <label className="block text-sm font-medium mb-2">
              How did you find out about Tokabi? <span className="text-red-400">*</span>
            </label>
            <p className="text-sm text-gray-400 mb-3">
              Minimum 10 characters
            </p>
            <textarea
              value={howFound}
              onChange={(e) => setHowFound(e.target.value)}
              rows={3}
              placeholder="I discovered Tokabi through..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 resize-none"
            />
            <div className={`text-xs mt-1 ${howFound.length >= 10 ? 'text-emerald-400' : 'text-gray-500'}`}>
              {howFound.length} / 10 characters {howFound.length >= 10 && '✓'}
            </div>
          </div>

          {/* Benefits Info */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-400 mb-2">Affiliate Benefits</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>Earn <strong className="text-cyan-400">25%</strong> commission on initial subscriptions</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>Earn <strong className="text-blue-400">10%</strong> recurring commission on renewals</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>Access to exclusive marketing materials</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>Dedicated affiliate dashboard and analytics</span>
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AffiliatePage;