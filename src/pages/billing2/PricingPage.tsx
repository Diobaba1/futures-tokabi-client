// ============================================================================
// FILE: src/pages/billing/PricingPage.tsx
// ============================================================================

/**
 * Pricing Page
 * 
 * Displays available subscription plans with pricing and features.
 * Allows users to select and subscribe to a plan.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  TrendingUp,
  Shield,
  Check,
  Star,
  Zap,
  Loader2,
} from 'lucide-react';
import { usePlans, useCurrentSubscription, useCreateSubscription } from '../../components/hooks/useBilling';
import type { SubscriptionPlan } from '../../types/billings.types';

// Icon mapping for plans
const planIcons: Record<string, React.ReactNode> = {
  bell: <Bell className="w-8 h-8" />,
  'trending-up': <TrendingUp className="w-8 h-8" />,
  shield: <Shield className="w-8 h-8" />,
};

// Badge styles
const badgeStyles: Record<string, string> = {
  ESSENTIAL: 'bg-gray-600 text-gray-100',
  RECOMMENDED: 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white',
  PREMIUM: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white',
};

// Supported crypto currencies for payment
const SUPPORTED_CURRENCIES = [
  { code: 'btc', name: 'Bitcoin' },
  { code: 'eth', name: 'Ethereum' },
  { code: 'usdttrc20', name: 'USDT (TRC20)' },
  { code: 'usdterc20', name: 'USDT (ERC20)' },
  { code: 'ltc', name: 'Litecoin' },
  { code: 'bnbbsc', name: 'BNB (BSC)' },
  { code: 'trx', name: 'TRON' },
  { code: 'sol', name: 'Solana' },
];

interface PlanCardProps {
  plan: SubscriptionPlan;
  isCurrentPlan: boolean;
  onSelect: (plan: SubscriptionPlan) => void;
  isLoading: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  isCurrentPlan,
  onSelect,
  isLoading,
}) => {
  const metadata = plan.features?.metadata;
  const badge = metadata?.badge || plan.tier?.toUpperCase() || 'BASIC';
  const isHighlighted = metadata?.highlight || plan.is_featured;
  const icon = metadata?.icon || 'bell';
  const buttonText = isCurrentPlan 
    ? 'Current Plan' 
    : metadata?.button_text || 'Get Started';

  return (
    <div
      className={`relative bg-gray-800/50 backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 hover:scale-105 ${
        isHighlighted
          ? 'border-purple-500 shadow-lg shadow-purple-500/20'
          : 'border-gray-700 hover:border-gray-600'
      }`}
    >
      {/* Badge */}
      {isHighlighted && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className={`px-4 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${badgeStyles[badge] || badgeStyles.ESSENTIAL}`}>
            {badge === 'RECOMMENDED' && <Star className="w-3 h-3" />}
            {badge === 'PREMIUM' && <Zap className="w-3 h-3" />}
            {badge}
          </span>
        </div>
      )}

      {/* Plan Icon */}
      <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 ${
        isHighlighted ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-700 text-gray-400'
      }`}>
        {planIcons[icon] || <Bell className="w-8 h-8" />}
      </div>

      {/* Plan Name */}
      <h3 className="text-xl font-bold text-white text-center mb-2">
        {plan.name}
      </h3>

      {/* Description */}
      <p className="text-gray-400 text-sm text-center mb-4">
        {plan.description}
      </p>

      {/* Price */}
      <div className="text-center mb-6">
        <span className="text-4xl font-bold text-white">
          ${plan.price_amount?.toFixed(2) || '0.00'}
        </span>
        <span className="text-gray-400 text-sm">
          /{plan.interval_days === 30 ? 'month' : `${plan.interval_days} days`}
        </span>
      </div>

      {/* Features List */}
      <ul className="space-y-3 mb-6">
        {plan.features?.features_list?.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
              isHighlighted ? 'text-purple-400' : 'text-green-400'
            }`} />
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <button
        onClick={() => onSelect(plan)}
        disabled={isCurrentPlan || isLoading}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
          isCurrentPlan
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : isHighlighted
            ? 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white'
            : 'bg-gray-700 hover:bg-gray-600 text-white'
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing...
          </>
        ) : (
          buttonText
        )}
      </button>

      {/* Trial Badge */}
      {plan.trial_days && plan.trial_days > 0 && !isCurrentPlan && (
        <p className="text-center text-xs text-purple-400 mt-3">
          {plan.trial_days} day free trial included
        </p>
      )}
    </div>
  );
};

// Currency Selection Modal
interface CurrencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (currency: string) => void;
  isLoading: boolean;
}

const CurrencyModal: React.FC<CurrencyModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-white mb-4">
          Select Payment Currency
        </h3>
        <p className="text-gray-400 text-sm mb-6">
          Choose which cryptocurrency you'd like to pay with.
        </p>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {SUPPORTED_CURRENCIES.map((currency) => (
              <button
                key={currency.code}
                onClick={() => onSelect(currency.code)}
                className="flex items-center gap-3 p-3 bg-gray-700/50 hover:bg-gray-700 border border-gray-600 rounded-lg transition-all"
              >
                <div className="text-left">
                  <p className="text-white font-medium">{currency.code.toUpperCase()}</p>
                  <p className="text-gray-400 text-xs">{currency.name}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-6 py-2 text-gray-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const PricingPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  const { data: plans, isLoading: plansLoading } = usePlans();
  const { data: currentSubscription } = useCurrentSubscription();
  const createSubscription = useCreateSubscription();

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowCurrencyModal(true);
  };

  const handleSelectCurrency = async (currency: string) => {
    if (!selectedPlan) return;

    setShowCurrencyModal(false);
    
    await createSubscription.mutateAsync({
      plan_id: selectedPlan.id,
      pay_currency: currency,
    });
  };

  // Sort plans by price
  const sortedPlans = plans ? [...plans].sort((a, b) => (a.price_amount || 0) - (b.price_amount || 0)) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Select the perfect plan for your trading needs. All plans include
            access to our core features with additional benefits as you upgrade.
          </p>
        </div>

        {/* Plans Grid */}
        {plansLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
          </div>
        ) : sortedPlans.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400">No plans available at the moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {sortedPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isCurrentPlan={currentSubscription?.plan_id === plan.id}
                onSelect={handleSelectPlan}
                isLoading={createSubscription.isPending && selectedPlan?.id === plan.id}
              />
            ))}
          </div>
        )}

        {/* FAQ or Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-gray-400">
            All payments are processed securely via cryptocurrency.{' '}
            <a href="/faq" className="text-purple-400 hover:text-purple-300">
              Learn more
            </a>
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Need help choosing?{' '}
            <a href="/contact" className="text-purple-400 hover:text-purple-300">
              Contact our team
            </a>
          </p>
        </div>
      </div>

      {/* Currency Selection Modal */}
      <CurrencyModal
        isOpen={showCurrencyModal}
        onClose={() => {
          setShowCurrencyModal(false);
          setSelectedPlan(null);
        }}
        onSelect={handleSelectCurrency}
        isLoading={createSubscription.isPending}
      />
    </div>
  );
};

export default PricingPage;