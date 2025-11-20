// src/pages/walletpages/Billing.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
interface BillingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  popular?: boolean;
  current?: boolean;
}
interface BillingHistory {
  id: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  description: string;
  invoice_url?: string;
}
// Mock billing history data
const mockBillingHistory: BillingHistory[] = [
  {
    id: 'inv_001',
    date: '2024-01-15',
    amount: 79,
    status: 'completed',
    description: 'Professional Plan - January 2024',
    invoice_url: '#'
  },
  {
    id: 'inv_002',
    date: '2023-12-15',
    amount: 79,
    status: 'completed',
    description: 'Professional Plan - December 2023',
    invoice_url: '#'
  },
  {
    id: 'inv_003',
    date: '2023-11-15',
    amount: 29,
    status: 'completed',
    description: 'Starter Plan - November 2023',
    invoice_url: '#'
  }
];
const Billing: React.FC = () => {
  const [currentPlan, setCurrentPlan] = useState<string>('pro');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const billingPlans: BillingPlan[] = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for beginners',
      price: 29,
      interval: 'month',
      features: [
        'Up to 3 trading bots',
        'Basic AI strategies',
        'Email support',
        'Real-time market data',
        'Portfolio tracking'
      ]
    },
    {
      id: 'pro',
      name: 'Professional',
      description: 'For serious traders',
      price: 79,
      interval: 'month',
      popular: true,
      current: true,
      features: [
        'Up to 10 trading bots',
        'Advanced AI strategies',
        'Priority support',
        'Advanced analytics',
        'Custom indicators',
        'API access',
        'Multi-exchange support'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For institutional traders',
      price: 199,
      interval: 'month',
      features: [
        'Unlimited trading bots',
        'Custom AI strategies',
        '24/7 dedicated support',
        'White-label solutions',
        'Advanced risk management',
        'Custom integrations',
        'SLA guarantee'
      ]
    }
  ];
  const loadBillingData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
     
      // Mock loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBillingHistory(mockBillingHistory);
     
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load billing information');
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    loadBillingData();
  }, [loadBillingData]);
  const handlePlanChange = async (planId: string) => {
    if (planId === currentPlan) return;
    try {
      setIsUpdating(true);
      setError(null);
      setSuccess(null);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
     
      setCurrentPlan(planId);
      setSuccess(`Successfully upgraded to ${billingPlans.find(p => p.id === planId)?.name} plan!`);
     
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update subscription');
    } finally {
      setIsUpdating(false);
    }
  };
  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      return;
    }
    try {
      setIsUpdating(true);
      setError(null);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
     
      setCurrentPlan('starter');
      setSuccess('Your subscription has been cancelled. You will retain access until the end of your billing period.');
     
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to cancel subscription');
    } finally {
      setIsUpdating(false);
    }
  };
  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };
  // Auto-clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(clearMessages, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'failed': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading billing information...</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
          Billing & Subscription
        </h1>
        <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto px-2">
          Manage your subscription plan and billing information
        </p>
      </div>
      {/* Status Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center justify-between"
          >
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm sm:text-base truncate">{error}</span>
            </div>
            <button onClick={clearMessages} className="text-red-400 hover:text-red-300 ml-2 flex-shrink-0">
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
            className="p-3 sm:p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 flex items-center justify-between"
          >
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm sm:text-base truncate">{success}</span>
            </div>
            <button onClick={clearMessages} className="text-green-400 hover:text-green-300 ml-2 flex-shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Current Plan Summary & Billing Info - Stack on mobile, side by side on larger screens */}
        <div className="xl:col-span-1 space-y-6 lg:space-y-8">
          {/* Current Plan Summary */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Current Plan
            </h2>
            <div className="space-y-4">
              <div className="text-center p-4 sm:p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">
                  {billingPlans.find(p => p.id === currentPlan)?.name}
                </div>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-400 mb-2">
                  {formatCurrency(billingPlans.find(p => p.id === currentPlan)?.price || 0)}
                  <span className="text-gray-400 text-sm sm:text-lg">/month</span>
                </div>
                <div className="text-gray-400 text-xs sm:text-sm">
                  {billingPlans.find(p => p.id === currentPlan)?.description}
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Status</span>
                  <span className="text-green-400 font-semibold">Active</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Next Billing</span>
                  <span className="text-white text-right">Feb 15, 2024</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Payment Method</span>
                  <span className="text-white">Visa **** 4242</span>
                </div>
              </div>
              {currentPlan !== 'starter' && (
                <motion.button
                  onClick={handleCancelSubscription}
                  disabled={isUpdating}
                  whileHover={{ scale: isUpdating ? 1 : 1.02 }}
                  whileTap={{ scale: isUpdating ? 1 : 0.98 }}
                  className="w-full py-2 sm:py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/20 hover:border-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm sm:text-base"
                >
                  {isUpdating ? 'Cancelling...' : 'Cancel Subscription'}
                </motion.button>
              )}
            </div>
          </div>
          {/* Billing Information */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Billing Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Card Number
                </label>
                <div className="flex items-center space-x-3 p-3 bg-gray-700/50 border border-gray-600/50 rounded-xl">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">V</span>
                  </div>
                  <span className="text-white font-mono text-sm sm:text-base">•••• •••• •••• 4242</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Expiry Date
                  </label>
                  <div className="p-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white text-sm sm:text-base">
                    12/2025
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    CVV
                  </label>
                  <div className="p-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white text-sm sm:text-base">
                    •••
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2 sm:py-3 bg-gray-700/50 border border-gray-600/50 text-gray-300 rounded-xl hover:bg-gray-600/50 hover:text-white transition-all duration-200 text-sm sm:text-base"
              >
                Update Payment Method
              </motion.button>
            </div>
          </div>
        </div>
        {/* Pricing Plans & Billing History */}
        <div className="xl:col-span-2 space-y-6 lg:space-y-8">
          {/* Pricing Plans */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Choose Your Plan
              </h2>
              <div className="flex flex-col xs:flex-row items-start xs:items-center space-y-2 xs:space-y-0 xs:space-x-2">
                <span className="text-gray-400 text-xs sm:text-sm">Save 20% with annual billing</span>
                <button className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-lg text-xs sm:text-sm hover:bg-yellow-500/20 transition-colors duration-200 whitespace-nowrap">
                  Switch to Yearly
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {billingPlans.map((plan) => (
                <PricingCard
                  key={plan.id}
                  plan={plan}
                  currentPlan={currentPlan}
                  isUpdating={isUpdating}
                  onPlanChange={handlePlanChange}
                />
              ))}
            </div>
          </div>
          {/* Billing History */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Billing History
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {billingHistory.map((invoice) => (
                <motion.div
                  key={invoice.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-700/30 border border-gray-600/30 rounded-xl hover:border-gray-500/50 transition-all duration-200 gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col xs:flex-row xs:items-center space-y-2 xs:space-y-0 xs:space-x-3 mb-2">
                      <h3 className="text-white font-semibold text-sm sm:text-base truncate">
                        {invoice.description}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(invoice.status)} self-start xs:self-auto`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs sm:text-sm">{formatDate(invoice.date)}</p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end space-x-4">
                    <span className="text-white font-semibold text-sm sm:text-base whitespace-nowrap">
                      {formatCurrency(invoice.amount)}
                    </span>
                    <button
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-600/50 rounded-lg transition-all duration-200 flex-shrink-0"
                      title="Download Invoice"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// Pricing Card Component
interface PricingCardProps {
  plan: BillingPlan;
  currentPlan: string;
  isUpdating: boolean;
  onPlanChange: (planId: string) => void;
}
const PricingCard: React.FC<PricingCardProps> = ({ plan, currentPlan, isUpdating, onPlanChange }) => {
  const isCurrentPlan = plan.id === currentPlan;
  const isPopular = plan.popular;
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`relative p-4 sm:p-6 rounded-2xl border-2 backdrop-blur-sm transition-all duration-300 ${
        isPopular
          ? 'bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-yellow-500/30 lg:scale-105'
          : isCurrentPlan
          ? 'bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/30'
          : 'bg-gray-700/30 border-gray-600/30'
      }`}
    >
      {isPopular && (
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
          <span className="px-2 py-1 bg-yellow-500 text-gray-900 text-xs font-bold rounded-full whitespace-nowrap">
            MOST POPULAR
          </span>
        </div>
      )}
      {isCurrentPlan && (
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
          <span className="px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded-full whitespace-nowrap">
            CURRENT PLAN
          </span>
        </div>
      )}
      <div className="text-center mb-4 sm:mb-6">
        <h3 className={`text-lg sm:text-xl lg:text-2xl font-bold mb-2 ${
          isPopular ? 'text-yellow-400' : 'text-white'
        }`}>
          {plan.name}
        </h3>
        <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">{plan.description}</p>
       
        <div className="mb-3 sm:mb-4">
          <span className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${
            isPopular ? 'text-yellow-400' : 'text-white'
          }`}>
            ${plan.price}
          </span>
          <span className="text-gray-400 text-sm sm:text-lg">/month</span>
        </div>
      </div>
      <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start space-x-2">
            <svg className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 ${
              isPopular ? 'text-yellow-400' : 'text-green-400'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-300 text-xs sm:text-sm leading-relaxed">{feature}</span>
          </li>
        ))}
      </ul>
      <motion.button
        onClick={() => onPlanChange(plan.id)}
        disabled={isCurrentPlan || isUpdating}
        whileHover={{ scale: isCurrentPlan || isUpdating ? 1 : 1.05 }}
        whileTap={{ scale: isCurrentPlan || isUpdating ? 1 : 0.95 }}
        className={`w-full py-2 sm:py-3 font-bold rounded-xl transition-all duration-300 text-sm sm:text-base ${
          isCurrentPlan
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : isPopular
            ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 hover:from-yellow-400 hover:to-yellow-500'
            : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-400 hover:to-blue-500'
        } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isUpdating ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span className="text-xs sm:text-sm">Processing...</span>
          </div>
        ) : isCurrentPlan ? (
          'Current Plan'
        ) : (
          'Upgrade Plan'
        )}
      </motion.button>
    </motion.div>
  );
};
export default Billing;