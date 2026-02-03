// ============================================================================
// FILE: src/pages/billing/PricingPage.tsx
// ============================================================================

/**
 * Pricing Page - Enterprise Grade
 *
 * Displays available subscription plans with premium UI/UX.
 * Features animated cards, comparison table, trust badges, and seamless checkout.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  TrendingUp,
  Shield,
  Check,
  Star,
  Zap,
  Loader2,
  Crown,
  Rocket,
  X,
  HelpCircle,
  ChevronDown,
  Lock,
  CreditCard,
  Clock,
  Users,
  Award,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { usePlans, useCurrentSubscription, useCreateSubscription } from '../../components/hooks/useBilling';
import type { SubscriptionPlan } from '../../types/billings.types';

// Icon mapping for plans
const planIcons: Record<string, React.ReactNode> = {
  bell: <Bell className="w-7 h-7" />,
  'trending-up': <TrendingUp className="w-7 h-7" />,
  shield: <Shield className="w-7 h-7" />,
  rocket: <Rocket className="w-7 h-7" />,
  crown: <Crown className="w-7 h-7" />,
};

// Badge configurations
const badgeConfig: Record<string, { gradient: string; icon: React.ReactNode; glow: string }> = {
  ESSENTIAL: {
    gradient: 'from-gray-500 to-gray-600',
    icon: <Bell className="w-3.5 h-3.5" />,
    glow: 'shadow-gray-500/20',
  },
  STARTER: {
    gradient: 'from-blue-500 to-blue-600',
    icon: <Rocket className="w-3.5 h-3.5" />,
    glow: 'shadow-blue-500/30',
  },
  RECOMMENDED: {
    gradient: 'from-purple-500 to-indigo-600',
    icon: <Star className="w-3.5 h-3.5" />,
    glow: 'shadow-purple-500/30',
  },
  PROFESSIONAL: {
    gradient: 'from-cyan-500 to-blue-600',
    icon: <TrendingUp className="w-3.5 h-3.5" />,
    glow: 'shadow-cyan-500/30',
  },
  PREMIUM: {
    gradient: 'from-amber-500 to-orange-500',
    icon: <Crown className="w-3.5 h-3.5" />,
    glow: 'shadow-amber-500/30',
  },
  ENTERPRISE: {
    gradient: 'from-rose-500 to-pink-600',
    icon: <Zap className="w-3.5 h-3.5" />,
    glow: 'shadow-rose-500/30',
  },
};

// Supported crypto currencies for payment
const SUPPORTED_CURRENCIES = [
  { code: 'btc', name: 'Bitcoin', symbol: '₿', color: 'from-orange-500 to-amber-500' },
  { code: 'eth', name: 'Ethereum', symbol: 'Ξ', color: 'from-blue-500 to-indigo-500' },
  { code: 'usdttrc20', name: 'USDT (TRC20)', symbol: '₮', color: 'from-green-500 to-emerald-500' },
  { code: 'usdterc20', name: 'USDT (ERC20)', symbol: '₮', color: 'from-green-500 to-teal-500' },
  { code: 'ltc', name: 'Litecoin', symbol: 'Ł', color: 'from-gray-400 to-gray-500' },
  { code: 'bnbbsc', name: 'BNB (BSC)', symbol: 'B', color: 'from-yellow-500 to-amber-500' },
  { code: 'trx', name: 'TRON', symbol: 'T', color: 'from-red-500 to-rose-500' },
  { code: 'sol', name: 'Solana', symbol: 'S', color: 'from-purple-500 to-violet-500' },
];

// Trust badges data
const trustBadges = [
  { icon: <Lock className="w-5 h-5" />, text: 'Secure Payments' },
  { icon: <Clock className="w-5 h-5" />, text: 'Instant Activation' },
  { icon: <Users className="w-5 h-5" />, text: '10,000+ Users' },
  { icon: <Award className="w-5 h-5" />, text: 'Money-Back Guarantee' },
];

// FAQ data
const faqData = [
  {
    question: 'How does the free trial work?',
    answer: 'Start your free trial with full access to all features. No payment required until your trial ends. Cancel anytime before the trial period to avoid charges.',
  },
  {
    question: 'Which cryptocurrencies do you accept?',
    answer: 'We accept Bitcoin (BTC), Ethereum (ETH), USDT (TRC20 & ERC20), Litecoin (LTC), BNB (BSC), TRON (TRX), and Solana (SOL) for maximum flexibility.',
  },
  {
    question: 'Can I upgrade or downgrade my plan?',
    answer: 'Yes! You can upgrade anytime and the price difference will be prorated. Downgrades take effect at the end of your current billing cycle.',
  },
  {
    question: 'Is there a money-back guarantee?',
    answer: 'Absolutely. We offer a 7-day money-back guarantee on all plans. If you\'re not satisfied, contact support for a full refund.',
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};

// Plan Card Component
interface PlanCardProps {
  plan: SubscriptionPlan;
  isCurrentPlan: boolean;
  onSelect: (plan: SubscriptionPlan) => void;
  isLoading: boolean;
  index: number;
}

const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  isCurrentPlan,
  onSelect,
  isLoading,
  index,
}) => {
  const metadata = plan.features?.metadata;
  const badge = metadata?.badge || plan.tier?.toUpperCase() || 'STARTER';
  const isHighlighted = metadata?.highlight || plan.is_featured;
  const icon = metadata?.icon || 'bell';
  const buttonText = isCurrentPlan
    ? 'Current Plan'
    : metadata?.button_text || 'Get Started';

  const badgeStyle = badgeConfig[badge] || badgeConfig.STARTER;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className={`relative group ${isHighlighted ? 'z-10' : ''}`}
    >
      {/* Glow effect for highlighted plan */}
      {isHighlighted && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
      )}

      <div
        className={`relative h-full bg-gradient-to-b from-gray-800/90 to-gray-900/90 backdrop-blur-xl border rounded-3xl p-8 transition-all duration-300 ${
          isHighlighted
            ? 'border-purple-500/50 shadow-2xl shadow-purple-500/20'
            : 'border-gray-700/50 hover:border-gray-600/50'
        }`}
      >
        {/* Popular Badge */}
        {isHighlighted && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className={`px-5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 bg-gradient-to-r ${badgeStyle.gradient} text-white shadow-lg ${badgeStyle.glow}`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              MOST POPULAR
            </motion.div>
          </div>
        )}

        {/* Plan Icon */}
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform duration-300 group-hover:scale-110 ${
          isHighlighted
            ? 'bg-gradient-to-br from-purple-500/20 to-indigo-500/20 text-purple-400'
            : 'bg-gray-700/50 text-gray-400 group-hover:text-cyan-400'
        }`}>
          {planIcons[icon] || <Bell className="w-7 h-7" />}
        </div>

        {/* Plan Name & Badge */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 bg-gradient-to-r ${badgeStyle.gradient} text-white`}>
            {badgeStyle.icon}
            {badge}
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {plan.name}
          </h3>
          <p className="text-gray-400 text-sm">
            {plan.description}
          </p>
        </div>

        {/* Price */}
        <div className="text-center mb-8">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-lg text-gray-400">$</span>
            <span className={`text-5xl font-bold ${isHighlighted ? 'text-white' : 'text-white'}`}>
              {plan.price_amount?.toFixed(0) || '0'}
            </span>
            <span className="text-gray-400">
              /{plan.interval_days === 30 ? 'mo' : `${plan.interval_days}d`}
            </span>
          </div>
          {plan.trial_days && plan.trial_days > 0 && !isCurrentPlan && (
            <p className="text-sm text-purple-400 mt-2 flex items-center justify-center gap-1">
              <Clock className="w-4 h-4" />
              {plan.trial_days}-day free trial
            </p>
          )}
        </div>

        {/* Features List */}
        <ul className="space-y-4 mb-8">
          {plan.features?.features_list?.map((feature, idx) => (
            <motion.li
              key={idx}
              className="flex items-start gap-3 text-sm"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * idx }}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                isHighlighted
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'bg-cyan-500/20 text-cyan-400'
              }`}>
                <Check className="w-3 h-3" />
              </div>
              <span className="text-gray-300">{feature}</span>
            </motion.li>
          ))}
        </ul>

        {/* CTA Button */}
        <motion.button
          onClick={() => onSelect(plan)}
          disabled={isCurrentPlan || isLoading}
          whileHover={!isCurrentPlan ? { scale: 1.02 } : {}}
          whileTap={!isCurrentPlan ? { scale: 0.98 } : {}}
          className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
            isCurrentPlan
              ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
              : isHighlighted
              ? 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/25'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              {buttonText}
              {!isCurrentPlan && <ArrowRight className="w-4 h-4" />}
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

// Currency Selection Modal
interface CurrencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (currency: string) => void;
  isLoading: boolean;
  selectedPlan: SubscriptionPlan | null;
}

const CurrencyModal: React.FC<CurrencyModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  isLoading,
  selectedPlan,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700/50 rounded-3xl p-8 max-w-lg w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20">
                <CreditCard className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Select Payment Method</h3>
                <p className="text-sm text-gray-400">Choose your preferred cryptocurrency</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Selected Plan Summary */}
          {selectedPlan && (
            <div className="bg-gray-700/30 border border-gray-600/30 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Selected Plan</p>
                  <p className="text-white font-semibold">{selectedPlan.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">Amount</p>
                  <p className="text-2xl font-bold text-white">
                    ${selectedPlan.price_amount?.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Currency Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
                <p className="text-gray-400">Creating your subscription...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 mb-6">
              {SUPPORTED_CURRENCIES.map((currency) => (
                <motion.button
                  key={currency.code}
                  onClick={() => onSelect(currency.code)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 p-4 bg-gray-700/30 hover:bg-gray-700/50 border border-gray-600/30 hover:border-gray-500/50 rounded-xl transition-all group"
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${currency.color} flex items-center justify-center text-white font-bold text-lg`}>
                    {currency.symbol}
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                      {currency.code.toUpperCase()}
                    </p>
                    <p className="text-gray-500 text-xs">{currency.name}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          )}

          {/* Security Note */}
          <div className="flex items-center gap-2 text-gray-500 text-xs justify-center">
            <Lock className="w-4 h-4" />
            <span>Secured by industry-leading encryption</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// FAQ Accordion Item
const FAQItem: React.FC<{ question: string; answer: string; isOpen: boolean; onClick: () => void }> = ({
  question,
  answer,
  isOpen,
  onClick,
}) => (
  <motion.div
    className="border border-gray-700/50 rounded-xl overflow-hidden"
    initial={false}
  >
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-800/50 transition-colors"
    >
      <span className="text-white font-medium pr-4">{question}</span>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <ChevronDown className="w-5 h-5 text-gray-400" />
      </motion.div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-5 pb-5 text-gray-400">
            {answer}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

const PricingPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const { data: plans, isLoading: plansLoading } = usePlans();
  const { data: currentSubscription } = useCurrentSubscription();
  const createSubscription = useCreateSubscription();

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowCurrencyModal(true);
  };

  const handleSelectCurrency = async (currency: string) => {
    if (!selectedPlan) return;

    await createSubscription.mutateAsync({
      plan_id: selectedPlan.id,
      pay_currency: currency,
    });

    setShowCurrencyModal(false);
  };

  // Sort plans by price
  const sortedPlans = plans ? [...plans].sort((a, b) => (a.price_amount || 0) - (b.price_amount || 0)) : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black py-16 px-4 overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Choose Your Trading Edge
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Simple, Transparent{' '}
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Pricing
            </span>
          </h1>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Unlock the power of AI-driven trading signals. All plans include a free trial
            so you can experience the difference before committing.
          </p>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-6 mb-16"
        >
          {trustBadges.map((badge, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-gray-400 text-sm"
            >
              <div className="text-cyan-400">{badge.icon}</div>
              <span>{badge.text}</span>
            </div>
          ))}
        </motion.div>

        {/* Plans Grid */}
        {plansLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-700 border-t-purple-500" />
                <Zap className="absolute inset-0 m-auto text-purple-400" size={24} />
              </div>
              <p className="text-gray-400">Loading plans...</p>
            </div>
          </div>
        ) : sortedPlans.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400">No plans available at the moment.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20"
          >
            {sortedPlans.map((plan, index) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isCurrentPlan={currentSubscription?.plan_id === plan.id}
                onSelect={handleSelectPlan}
                isLoading={createSubscription.isPending && selectedPlan?.id === plan.id}
                index={index}
              />
            ))}
          </motion.div>
        )}

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-cyan-400 mb-4">
              <HelpCircle className="w-5 h-5" />
              <span className="text-sm font-medium uppercase tracking-wider">FAQ</span>
            </div>
            <h2 className="text-3xl font-bold text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqData.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFaqIndex === index}
                onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
              />
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center"
        >
          <p className="text-gray-400 mb-4">
            All payments are processed securely via cryptocurrency.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <a href="/faq" className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
              <HelpCircle className="w-4 h-4" />
              Learn more
            </a>
            <a href="/contact" className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
              <Users className="w-4 h-4" />
              Contact support
            </a>
          </div>
        </motion.div>
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
        selectedPlan={selectedPlan}
      />
    </div>
  );
};

export default PricingPage;
