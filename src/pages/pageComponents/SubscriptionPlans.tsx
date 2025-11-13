import React, { useState } from 'react';
import { Check, Star, Zap, Shield, Bot, Phone, Bell } from 'lucide-react';

interface PlanFeature {
  text: string;
  icon: React.ReactNode;
  highlight?: boolean;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: PlanFeature[];
  popular: boolean;
  ctaText: string;
  badge?: string;
  gradient: string;
  borderColor: string;
}

const SubscriptionPlans: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    setIsLoading(planId);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(null);
    setSelectedPlan(planId);
    // Here you would integrate with your payment processor
    console.log(`Subscribing to plan: ${planId}`);
  };

  const plans: SubscriptionPlan[] = [
    {
      id: "tier-1",
      name: "Essential Signals",
      price: "$19.99",
      period: "month",
      description: "Perfect for traders starting with automated signals",
      features: [
        {
          text: "Get signals from Tokabi trading portal",
          icon: <Zap className="w-4 h-4" />
        },
        {
          text: "24/7 dedicated support",
          icon: <Shield className="w-4 h-4" />
        },
        {
          text: "6 high-quality signals per day",
          icon: <Check className="w-4 h-4" />,
          highlight: true
        }
      ],
      popular: false,
      ctaText: "Start with Signals",
      gradient: "from-gray-900 to-gray-800",
      borderColor: "border-gray-700"
    },
    {
      id: "tier-2",
      name: "Pro Analytics",
      price: "$29.99",
      period: "month",
      description: "Enhanced with instant notifications and AI analysis",
      features: [
        {
          text: "Everything in Essential Signals",
          icon: <Check className="w-4 h-4" />
        },
        {
          text: "Instant Telegram notifications",
          icon: <Bell className="w-4 h-4" />,
          highlight: true
        },
        {
          text: "AI asset analysis for any futures asset",
          icon: <Bot className="w-4 h-4" />
        },
        {
          text: "2 assets analysis per 4 hours",
          icon: <Star className="w-4 h-4" />,
          highlight: true
        }
      ],
      popular: true,
      ctaText: "Upgrade to Pro",
      badge: "MOST POPULAR",
      gradient: "from-blue-900/80 via-purple-900/80 to-indigo-900/80",
      borderColor: "border-purple-500"
    },
    {
      id: "tier-3",
      name: "Enterprise AI",
      price: "$99.99",
      period: "month",
      description: "Complete automated trading with expert access",
      features: [
        {
          text: "Everything in Pro Analytics",
          icon: <Check className="w-4 h-4" />
        },
        {
          text: "System auto-trades your assets",
          icon: <Bot className="w-4 h-4" />,
          highlight: true
        },
        {
          text: "Increased asset search limit (5 per 4 hours)",
          icon: <Zap className="w-4 h-4" />
        },
        {
          text: "Direct call with AI crypto expert",
          icon: <Phone className="w-4 h-4" />,
          highlight: true
        },
        {
          text: "Priority 24/7 support",
          icon: <Shield className="w-4 h-4" />
        }
      ],
      popular: false,
      ctaText: "Go Enterprise",
      badge: "PREMIUM",
      gradient: "from-amber-900/80 via-orange-900/80 to-red-900/80",
      borderColor: "border-amber-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">Enterprise Trading Solutions</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
            Choose Your Trading Edge
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Leverage Tokabi AI's advanced trading intelligence. Scale from manual signals to fully automated execution with expert guidance.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl backdrop-blur-sm
                ${plan.popular 
                  ? 'shadow-2xl shadow-purple-500/20 transform -translate-y-4' 
                  : 'hover:shadow-blue-500/10'
                } 
                bg-gradient-to-b ${plan.gradient} border ${plan.borderColor}`}
            >
              
              {/* Popular Badge */}
              {plan.badge && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className={`px-6 py-3 rounded-full font-bold text-sm shadow-lg ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'bg-gradient-to-r from-amber-600 to-orange-600 text-white'
                  }`}>
                    {plan.badge}
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8 pt-4">
                <h3 className="text-2xl font-bold text-white mb-3">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-2 mb-3">
                  <span className="text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {plan.price}
                  </span>
                  <span className="text-gray-400 text-lg">/{plan.period}</span>
                </div>
                <p className="text-gray-300 leading-relaxed">{plan.description}</p>
              </div>

              {/* Features List */}
              <div className="mb-8 space-y-4">
                {plan.features.map((feature, index) => (
                  <div
                    key={index}
                    className={`flex items-start p-3 rounded-xl transition-all duration-300 ${
                      feature.highlight 
                        ? 'bg-white/5 border border-white/10 shadow-lg' 
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
                      feature.highlight
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}>
                      {feature.icon}
                    </div>
                    <span className={`flex-1 ${feature.highlight ? 'text-white font-semibold' : 'text-gray-300'}`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={isLoading === plan.id}
                className={`w-full py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 hover:shadow-2xl hover:shadow-purple-500/40'
                    : 'bg-gradient-to-r from-gray-800 to-gray-900 text-white border border-gray-600 hover:border-blue-500 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10'
                }`}
              >
                {isLoading === plan.id ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  plan.ctaText
                )}
              </button>

              {/* Additional Value Indicator */}
              {plan.popular && (
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg">
                  ⚡ Best Value for Active Traders
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Enterprise Features Footer */}
        <div className="mt-16 text-center">
          <div className="inline-grid grid-cols-1 sm:grid-cols-3 gap-8 p-8 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-3">
              <Shield className="w-6 h-6 text-green-400" />
              <span className="text-gray-300">Bank-level Security</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Zap className="w-6 h-6 text-yellow-400" />
              <span className="text-gray-300">99.9% Uptime Guarantee</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Bot className="w-6 h-6 text-blue-400" />
              <span className="text-gray-300">AI-Powered Analytics</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;