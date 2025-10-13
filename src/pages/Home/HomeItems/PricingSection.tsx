// src/pages/Home/HomeItems/PricingSection.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PricingSection: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Starter',
      monthlyPrice: '49',
      yearlyPrice: '39',
      description: 'Perfect for beginners starting their trading journey',
      features: [
        'Up to $1,000 trading capital',
        'Basic AI trading models',
        '3 simultaneous trades',
        'Standard email support',
        'Basic performance analytics',
        '85% accuracy target',
        'Mobile app access',
        '7-day free trial'
      ],
      popular: false,
      gradient: 'from-gray-600 to-gray-800',
      color: 'text-gray-400',
      badge: 'BEGINNER'
    },
    {
      name: 'Professional',
      monthlyPrice: '99',
      yearlyPrice: '79',
      description: 'Most popular choice for active traders',
      features: [
        'Up to $10,000 trading capital',
        'Advanced AI models + ML',
        '10 simultaneous trades',
        'Priority 24/7 support',
        'Advanced analytics dashboard',
        '87% accuracy target',
        'Custom risk parameters',
        'Advanced indicators',
        'API access',
        'Trading signals'
      ],
      popular: true,
      gradient: 'from-yellow-500 to-orange-600',
      color: 'text-yellow-400',
      badge: 'POPULAR'
    },
    {
      name: 'Institutional',
      monthlyPrice: '299',
      yearlyPrice: '249',
      description: 'For professional traders & hedge funds',
      features: [
        'Unlimited trading capital',
        'All AI models + custom training',
        'Unlimited simultaneous trades',
        '24/7 dedicated account manager',
        'Institutional-grade analytics',
        '89% accuracy target',
        'Custom strategy development',
        'White-label solutions',
        'SLA guarantee',
        'Advanced risk management',
        'Multi-exchange support',
        'Custom integrations'
      ],
      popular: false,
      gradient: 'from-green-500 to-cyan-600',
      color: 'text-green-400',
      badge: 'ELITE'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-yellow-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-semibold mb-6"
          >
            <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></div>
            TRANSPARENT PRICING
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Choose Your
            <span className="block bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
              Trading Plan
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Scale your trading with our AI-powered platform. All plans include our 
            <span className="text-yellow-400 font-semibold"> 85%+ accuracy guarantee</span> and advanced risk management.
          </p>

          {/* Billing Toggle */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex items-center justify-center gap-4 mt-8"
          >
            <span className={`text-lg font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-16 h-8 bg-gray-700 rounded-full transition-colors duration-300 focus:outline-none"
            >
              <motion.div
                className={`absolute top-1 w-6 h-6 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full shadow-lg ${
                  billingCycle === 'yearly' ? 'left-9' : 'left-1'
                }`}
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-medium ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-500'}`}>
                Yearly
              </span>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full">
                SAVE 20%
              </span>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Pricing Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -10,
                transition: { type: "spring", stiffness: 300 }
              }}
              className={`relative group ${
                plan.popular ? 'lg:scale-105 lg:-translate-y-4' : ''
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20"
                >
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-yellow-500/25">
                    ⭐ {plan.badge}
                  </div>
                </motion.div>
              )}

              {/* Plan Badge */}
              {!plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <div className={`px-4 py-1 ${plan.color} bg-gray-800/80 backdrop-blur-sm rounded-full text-xs font-semibold border border-gray-700`}>
                    {plan.badge}
                  </div>
                </div>
              )}
              
              {/* Main Card */}
              <div className={`relative h-full bg-gray-800/40 backdrop-blur-lg rounded-3xl border-2 ${
                plan.popular 
                  ? 'border-yellow-500/50 shadow-2xl shadow-yellow-500/20' 
                  : 'border-gray-700/50 hover:border-gray-600/70'
              } transition-all duration-300 overflow-hidden`}>
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
                
                <div className="relative z-10 p-8">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <h3 className={`text-2xl font-bold ${plan.popular ? 'text-white' : 'text-gray-200'} mb-3`}>
                      {plan.name}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                      {plan.description}
                    </p>
                    
                    {/* Price */}
                    <div className="flex items-baseline justify-center gap-2 mb-2">
                      <span className="text-5xl font-black text-white">
                        ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                      </span>
                      <span className="text-gray-400 text-lg">/month</span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <p className="text-green-400 text-sm font-medium">
                        Billed annually (${parseInt(plan.yearlyPrice) * 12})
                      </p>
                    )}
                  </div>
                  
                  {/* Features List */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.li 
                        key={featureIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * featureIndex }}
                        className="flex items-start text-gray-300 group/item"
                      >
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          className="flex-shrink-0 w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center mr-3 mt-0.5"
                        >
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                        </motion.div>
                        <span className="text-sm leading-relaxed group-hover/item:text-white transition-colors">
                          {feature}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                  
                  {/* CTA Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link 
                      to="/register"
                      className={`block w-full text-center py-4 rounded-xl font-bold transition-all duration-300 ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 hover:from-yellow-400 hover:to-yellow-500 shadow-lg shadow-yellow-500/25' 
                          : 'bg-gray-700/50 text-white hover:bg-gray-600/50 border border-gray-600/50 hover:border-gray-500/50'
                      }`}
                    >
                      {plan.popular ? 'Start Free Trial' : 'Get Started'}
                    </Link>
                  </motion.div>
                </div>

                {/* Hover Shine Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-12"
        >
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 max-w-2xl mx-auto">
            <p className="text-gray-300 text-lg">
              <span className="text-yellow-400 font-semibold">All plans include a 7-day free trial.</span>{' '}
              No credit card required. Cancel anytime.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mt-4 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                No setup fees
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Cancel anytime
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Priority support
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;