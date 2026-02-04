// ============================================================================
// FILE: src/pages/billing2/PricingPage.tsx
// ============================================================================

/**
 * Pricing Page - Modern Glassmorphism Design
 *
 * Features frosted glass effects, subtle gradients, floating cards with depth,
 * and premium micro-interactions for an elevated user experience.
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
  Users,
  Award,
  ArrowRight,
  Sparkles,
  Diamond,
  Gem,
  CircleDollarSign,
  BadgeCheck,
  Infinity,
  Gift,
} from 'lucide-react';
import { usePlans, useCurrentSubscription, useCreateSubscription } from '../../components/hooks/useBilling';
import type { SubscriptionPlan } from '../../types/billings.types';

// Plan tier configuration with glassmorphism styling
const tierConfig: Record<string, {
  icon: React.ReactNode;
  gradient: string;
  glowColor: string;
  borderColor: string;
  accentColor: string;
}> = {
  ESSENTIAL: {
    icon: <Bell className="w-6 h-6" />,
    gradient: 'from-slate-400/20 to-gray-500/20',
    glowColor: 'rgba(148, 163, 184, 0.15)',
    borderColor: 'border-slate-500/30',
    accentColor: 'text-slate-300',
  },
  STARTER: {
    icon: <Rocket className="w-6 h-6" />,
    gradient: 'from-blue-500/20 to-cyan-500/20',
    glowColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: 'border-blue-500/30',
    accentColor: 'text-blue-400',
  },
  PROFESSIONAL: {
    icon: <TrendingUp className="w-6 h-6" />,
    gradient: 'from-violet-500/20 to-purple-500/20',
    glowColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: 'border-violet-500/40',
    accentColor: 'text-violet-400',
  },
  PREMIUM: {
    icon: <Crown className="w-6 h-6" />,
    gradient: 'from-amber-500/20 to-orange-500/20',
    glowColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: 'border-amber-500/30',
    accentColor: 'text-amber-400',
  },
  ENTERPRISE: {
    icon: <Diamond className="w-6 h-6" />,
    gradient: 'from-rose-500/20 to-pink-500/20',
    glowColor: 'rgba(244, 63, 94, 0.15)',
    borderColor: 'border-rose-500/30',
    accentColor: 'text-rose-400',
  },
  RECOMMENDED: {
    icon: <Gem className="w-6 h-6" />,
    gradient: 'from-emerald-500/25 to-teal-500/25',
    glowColor: 'rgba(16, 185, 129, 0.25)',
    borderColor: 'border-emerald-500/50',
    accentColor: 'text-emerald-400',
  },
};

// Crypto currencies with glass effect styling
const CRYPTO_OPTIONS = [
  { code: 'btc', name: 'Bitcoin', symbol: '₿', gradient: 'from-orange-500 to-amber-400' },
  { code: 'eth', name: 'Ethereum', symbol: 'Ξ', gradient: 'from-blue-500 to-indigo-400' },
  { code: 'usdttrc20', name: 'USDT TRC20', symbol: '₮', gradient: 'from-emerald-500 to-green-400' },
  { code: 'usdterc20', name: 'USDT ERC20', symbol: '₮', gradient: 'from-teal-500 to-cyan-400' },
  { code: 'ltc', name: 'Litecoin', symbol: 'Ł', gradient: 'from-gray-400 to-slate-300' },
  { code: 'bnbbsc', name: 'BNB Chain', symbol: 'B', gradient: 'from-yellow-500 to-amber-300' },
  { code: 'trx', name: 'TRON', symbol: 'T', gradient: 'from-red-500 to-rose-400' },
  { code: 'sol', name: 'Solana', symbol: 'S', gradient: 'from-purple-500 to-violet-400' },
];

// Trust indicators
const trustIndicators = [
  { icon: <Shield className="w-5 h-5" />, label: '256-bit SSL' },
  { icon: <BadgeCheck className="w-5 h-5" />, label: 'Verified Platform' },
  { icon: <Users className="w-5 h-5" />, label: '50K+ Traders' },
  { icon: <Award className="w-5 h-5" />, label: '7-Day Guarantee' },
];

// FAQ content
const faqs = [
  {
    q: 'How does the free trial work?',
    a: 'Start with full premium access. No card required. Cancel anytime before trial ends to avoid any charges.',
  },
  {
    q: 'Can I switch plans anytime?',
    a: 'Absolutely! Upgrade instantly with prorated billing. Downgrades take effect at your next billing cycle.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major cryptocurrencies: BTC, ETH, USDT, LTC, BNB, TRX, and SOL for maximum privacy and flexibility.',
  },
  {
    q: 'Is there a refund policy?',
    a: 'Yes! 7-day money-back guarantee on all plans. Not satisfied? Contact us for a full refund, no questions asked.',
  },
];

// Glassmorphism Plan Card
interface PlanCardProps {
  plan: SubscriptionPlan;
  isCurrentPlan: boolean;
  onSelect: (plan: SubscriptionPlan) => void;
  isLoading: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, isCurrentPlan, onSelect, isLoading }) => {
  const metadata = plan.features?.metadata;
  const tier = metadata?.badge || plan.tier?.toUpperCase() || 'STARTER';
  const config = tierConfig[tier] || tierConfig.STARTER;
  const isPopular = metadata?.highlight || plan.is_featured;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -12, transition: { duration: 0.4 } }}
      className={`relative group ${isPopular ? 'lg:-mt-4 lg:mb-4' : ''}`}
    >
      {/* Glow effect */}
      <div
        className={`absolute -inset-1 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
        style={{ background: config.glowColor }}
      />

      {/* Popular indicator */}
      {isPopular && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute -top-5 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/30">
            <Star className="w-3.5 h-3.5 fill-current" />
            MOST POPULAR
          </div>
        </motion.div>
      )}

      {/* Glass Card */}
      <div
        className={`relative h-full rounded-3xl overflow-hidden ${config.borderColor} border backdrop-blur-xl transition-all duration-500 ${
          isPopular
            ? 'bg-gradient-to-b from-white/[0.12] to-white/[0.04] shadow-2xl'
            : 'bg-gradient-to-b from-white/[0.08] to-white/[0.02] hover:from-white/[0.12] hover:to-white/[0.04]'
        }`}
      >
        {/* Subtle top highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        {/* Content */}
        <div className="relative p-8">
          {/* Header */}
          <div className="text-center mb-8">
            {/* Icon */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-gradient-to-br ${config.gradient} backdrop-blur-sm border border-white/10 ${config.accentColor}`}
            >
              {config.icon}
            </motion.div>

            {/* Tier Badge */}
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider mb-3 bg-gradient-to-r ${config.gradient} backdrop-blur-sm border border-white/10 ${config.accentColor}`}>
              {tier}
            </div>

            {/* Plan Name */}
            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
            <p className="text-sm text-white/50 leading-relaxed">{plan.description}</p>
          </div>

          {/* Price Section */}
          <div className="text-center mb-8">
            <div className="flex items-baseline justify-center">
              <span className="text-lg text-white/40 font-medium mr-1">$</span>
              <span className="text-6xl font-bold text-white tracking-tight">
                {plan.price_amount?.toFixed(0) || '0'}
              </span>
              <span className="text-white/40 ml-2">
                /{plan.interval_days === 30 ? 'month' : `${plan.interval_days} days`}
              </span>
            </div>

            {plan.trial_days && plan.trial_days > 0 && !isCurrentPlan && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30"
              >
                <Gift className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-xs font-medium text-violet-300">{plan.trial_days}-day free trial</span>
              </motion.div>
            )}
          </div>

          {/* Features */}
          <div className="space-y-3 mb-8">
            {plan.features?.features_list?.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="flex items-start gap-3"
              >
                <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-gradient-to-br ${config.gradient} border border-white/10`}>
                  <Check className={`w-3 h-3 ${config.accentColor}`} />
                </div>
                <span className="text-sm text-white/70">{feature}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.button
            onClick={() => onSelect(plan)}
            disabled={isCurrentPlan || isLoading}
            whileHover={!isCurrentPlan ? { scale: 1.02 } : {}}
            whileTap={!isCurrentPlan ? { scale: 0.98 } : {}}
            className={`w-full py-4 px-6 rounded-2xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
              isCurrentPlan
                ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10'
                : isPopular
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40'
                : 'bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/30'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : isCurrentPlan ? (
              'Current Plan'
            ) : (
              <>
                Get Started
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Glassmorphism Currency Modal
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
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md rounded-3xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Glass background */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.12] to-white/[0.04] backdrop-blur-2xl border border-white/20 rounded-3xl" />

          {/* Content */}
          <div className="relative p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 backdrop-blur-sm border border-violet-500/30 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Choose Payment</h3>
                  <p className="text-xs text-white/50">Select cryptocurrency</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>

            {/* Plan Summary */}
            {selectedPlan && (
              <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/40 mb-1">Selected Plan</p>
                    <p className="text-white font-semibold">{selectedPlan.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/40 mb-1">Total</p>
                    <p className="text-2xl font-bold text-white">${selectedPlan.price_amount?.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Currency Options */}
            {isLoading ? (
              <div className="py-16 flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-2 border-white/10 border-t-violet-500 animate-spin" />
                  <CircleDollarSign className="absolute inset-0 m-auto w-6 h-6 text-violet-400" />
                </div>
                <p className="text-white/60 text-sm">Creating subscription...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 mb-6">
                {CRYPTO_OPTIONS.map((crypto) => (
                  <motion.button
                    key={crypto.code}
                    onClick={() => onSelect(crypto.code)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group"
                  >
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${crypto.gradient} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                      {crypto.symbol}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-white group-hover:text-white/90">{crypto.code.toUpperCase()}</p>
                      <p className="text-[10px] text-white/40">{crypto.name}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 text-white/30 text-xs">
              <Lock className="w-3.5 h-3.5" />
              <span>End-to-end encrypted payment</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// FAQ Accordion
const FAQItem: React.FC<{ faq: { q: string; a: string }; isOpen: boolean; onClick: () => void }> = ({
  faq,
  isOpen,
  onClick,
}) => (
  <motion.div
    className="rounded-2xl overflow-hidden bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors"
  >
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-5 text-left"
    >
      <span className="text-white font-medium pr-4">{faq.q}</span>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"
      >
        <ChevronDown className="w-4 h-4 text-white/50" />
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
          <div className="px-5 pb-5 text-white/50 text-sm leading-relaxed">
            {faq.a}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

// Main Page Component
const PricingPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const { data: plans, isLoading: plansLoading } = usePlans();
  const { data: currentSubscription } = useCurrentSubscription();
  const createSubscription = useCreateSubscription();

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const handleSelectCurrency = async (currency: string) => {
    if (!selectedPlan) return;
    await createSubscription.mutateAsync({
      plan_id: selectedPlan.id,
      pay_currency: currency,
    });
    setShowModal(false);
  };

  const sortedPlans = plans ? [...plans].sort((a, b) => (a.price_amount || 0) - (b.price_amount || 0)) : [];

  return (
    <div className="min-h-screen bg-[#0a0a0f] overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-500/[0.08] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/[0.06] rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/[0.04] rounded-full blur-[150px]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />

        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 backdrop-blur-sm mb-8"
          >
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-medium text-violet-300">Simple & Transparent Pricing</span>
          </motion.div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="text-white">Choose Your</span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Trading Edge
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-white/50 max-w-xl mx-auto leading-relaxed">
            Join thousands of traders using AI-powered signals. Start with a free trial,
            upgrade when you're ready.
          </p>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mb-20"
        >
          {trustIndicators.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-white/40 text-sm">
              <span className="text-emerald-400">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Plans Grid */}
        {plansLoading ? (
          <div className="flex items-center justify-center py-32">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-2 border-white/5 border-t-violet-500 animate-spin" />
              <Infinity className="absolute inset-0 m-auto w-8 h-8 text-violet-400" />
            </div>
          </div>
        ) : sortedPlans.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-white/40">No plans available at the moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto mb-24">
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

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto mb-20"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-white/40 text-sm mb-4">
              <HelpCircle className="w-4 h-4" />
              <span className="uppercase tracking-wider font-medium">FAQ</span>
            </div>
            <h2 className="text-3xl font-bold text-white">Common Questions</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <FAQItem
                key={idx}
                faq={faq}
                isOpen={openFaq === idx}
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              />
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-white/30 text-sm mb-4">
            Secure payments via cryptocurrency. Cancel anytime.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <a href="/faq" className="text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              Help Center
            </a>
            <a href="/contact" className="text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              Contact Us
            </a>
          </div>
        </motion.div>
      </div>

      {/* Currency Modal */}
      <CurrencyModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
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
