// src/pages/Home/HomeItems/PricingSection.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Shield, Bot, Phone, Bell, TrendingUp } from 'lucide-react';

const PricingSection: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Alpha',
      monthlyPrice: '19.99',
      yearlyPrice: '16.59',
      description: 'Perfect for traders starting with automated signals',
      features: [
        'Get signals from Tokabi trading portal',
        '24 hours dedicated support',
        '6 high-quality signals per day',
        'Basic trading analytics',
        'Email support',
        'Mobile app access'
      ],
      popular: false,
      gradient: 'from-gray-900 to-gray-800',
      color: 'text-gray-400',
      badge: 'ALPHA',
      icon: Bell,
      ctaText: 'Start with Alpha',
      highlight: false
    },
    {
      name: 'Edge',
      monthlyPrice: '29.99',
      yearlyPrice: '24.89',
      description: 'Enhanced with instant notifications and AI analysis',
      features: [
        'Everything in Alpha',
        'Instant Telegram notifications',
        'AI asset analysis for any futures asset',
        '2 assets analysis per 4 hours',
        'Priority email support',
        'Advanced analytics dashboard',
        'Custom trading insights'
      ],
      popular: true,
      gradient: 'from-blue-900/80 via-purple-900/80 to-indigo-900/80',
      color: 'text-blue-400',
      badge: 'RECOMMENDED',
      icon: TrendingUp,
      ctaText: 'Upgrade to Edge',
      highlight: true
    },
    {
      name: 'Zenith',
      monthlyPrice: '99.99',
      yearlyPrice: '82.99',
      description: 'Complete automated trading with expert access',
      features: [
        'Everything in Edge',
        'System auto-trades your assets',
        'Increased asset search limit (5 per 4 hours)',
        'Direct call with AI crypto expert',
        '24/7 priority support',
        'Custom trading strategies',
        'White-label solutions available',
        'API access for integration'
      ],
      popular: false,
      gradient: 'from-amber-900/80 via-orange-900/80 to-red-900/80',
      color: 'text-amber-400',
      badge: 'PREMIUM',
      icon: Shield,
      ctaText: 'Go Zenith',
      highlight: false
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-dark-base relative overflow-hidden">
      {/* Enhanced Static Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-slate-950 to-blue-950/30">
        {/* Animated Gradient Orbs */}
        <motion.div 
          className="absolute top-20 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Additional subtle orb */}
        <motion.div 
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-dark-elevated/60 border border-gray-700/50 text-gray-300 text-sm font-light tracking-wider mb-8 backdrop-blur-sm"
          >
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
            AI TRADING SIGNALS
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light mb-6 text-white">
            Smart Trading Plans
            <motion.span 
              className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent font-normal mt-2"
              animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: '200% auto' }}
            >
              Powered by Tokabi AI
            </motion.span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
            Choose the perfect plan to enhance your trading with Tokabi AI. 
            From basic signals to fully automated trading and expert access.
          </p>

          {/* Billing Toggle */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex items-center justify-center gap-4 mt-12"
          >
            <span className={`text-base font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-500'}`}>
              Monthly Billing
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-14 h-7 bg-gray-700 rounded-full transition-colors duration-300 focus:outline-none border border-gray-600 hover:border-gray-500"
            >
              <motion.div
                className={`absolute top-1 w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg ${
                  billingCycle === 'yearly' ? 'left-8' : 'left-1'
                }`}
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-base font-medium ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-500'}`}>
                Annual Billing
              </span>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded">
                SAVE 17%
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
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
            const annualSavings = plan.popular ? "MOST POPULAR" : `Save $${(parseFloat(plan.monthlyPrice) * 12 - parseFloat(plan.yearlyPrice) * 12).toFixed(2)}/year`;

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, scale: plan.popular ? 1.02 : 1.01 }}
                className={`relative group ${
                  plan.popular ? 'lg:scale-105 z-10' : ''
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
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-medium tracking-wide flex items-center gap-2 shadow-lg shadow-blue-500/25">
                      <Star className="w-4 h-4" fill="currentColor" />
                      {plan.badge}
                    </div>
                  </motion.div>
                )}

                {/* Plan Badge */}
                {!plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <div className={`px-4 py-1.5 ${plan.color} bg-dark-elevated/80 backdrop-blur-sm rounded-full text-xs font-medium tracking-wide border border-gray-700`}>
                      {plan.badge}
                    </div>
                  </div>
                )}
                
                {/* Main Card */}
                <div className={`relative h-full bg-dark-elevated/40 backdrop-blur-lg rounded-2xl border-2 ${
                  plan.popular 
                    ? 'border-blue-500/40 shadow-2xl shadow-blue-500/20' 
                    : 'border-gray-700/30 hover:border-gray-600/50'
                } transition-all duration-500 overflow-hidden`}>
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  {/* Animated Border Glow */}
                  {plan.popular && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-20 blur-sm group-hover:opacity-30 transition-opacity duration-500" />
                  )}
                  
                  <div className="relative z-10 p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                      <div className="flex justify-center mb-4">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${
                          plan.popular 
                            ? 'from-blue-500 to-purple-500 shadow-lg shadow-blue-500/25' 
                            : 'from-gray-700 to-gray-600'
                        } flex items-center justify-center shadow-lg`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <h3 className={`text-2xl font-semibold ${plan.popular ? 'text-white' : 'text-gray-200'} mb-3 tracking-tight`}>
                        {plan.name}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed mb-6 font-light">
                        {plan.description}
                      </p>
                      
                      {/* Price */}
                      <div className="flex items-baseline justify-center gap-2 mb-2">
                        <span className="text-5xl font-light text-white">
                          ${price}
                        </span>
                        <span className="text-gray-400 text-lg">/month</span>
                      </div>
                      {billingCycle === 'yearly' && (
                        <p className="text-green-400 text-sm font-medium">
                          {annualSavings}
                        </p>
                      )}
                    </div>
                    
                    {/* Features List */}
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <motion.li 
                          key={featureIndex}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 * featureIndex }}
                          className="flex items-start text-gray-300 group/item"
                        >
                          <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
                            plan.popular
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-gray-700 text-gray-400'
                          }`}>
                            <Check className="w-3 h-3" />
                          </div>
                          <span className="text-sm leading-relaxed font-light group-hover/item:text-gray-200 transition-colors">
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
                        className={`block w-full text-center py-4 rounded-xl font-medium transition-all duration-300 text-sm tracking-wide ${
                          plan.popular 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:from-blue-600 hover:to-purple-600' 
                            : 'bg-gray-700/50 text-white hover:bg-gray-600/50 border border-gray-600/30 hover:border-gray-500/50'
                        }`}
                      >
                        {plan.ctaText}
                      </Link>
                    </motion.div>
                  </div>
                </div>

                {/* Value Indicator */}
                {plan.popular && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
                  >
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                      ⚡ Best Value
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
        
        {/* Enterprise Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-20"
        >
          <div className="bg-dark-elevated/30 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/30 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Bot className="w-6 h-6 text-blue-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">Custom Enterprise Solutions</h3>
            </div>
            <p className="text-gray-300 mb-6 text-sm font-light max-w-md mx-auto">
              Need a tailored solution for your trading team or institution? 
              We offer custom AI trading configurations and dedicated support.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-gray-700/50 border border-gray-600/50 text-white font-medium rounded-lg hover:bg-gray-600/50 transition-all duration-300 text-sm"
              >
                Contact Sales
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-blue-500/10 border border-blue-500/30 text-blue-400 font-medium rounded-lg hover:bg-blue-500/20 transition-all duration-300 text-sm"
              >
                Schedule AI Demo
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Shield, label: 'Secure & Encrypted', value: '100%' },
              { icon: Zap, label: 'Signal Accuracy', value: '95%+' },
              { icon: Phone, label: 'Support Response', value: '< 5min' },
              { icon: TrendingUp, label: 'Active Users', value: '10K+' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="text-white"
              >
                <div className="flex justify-center mb-2">
                  <item.icon className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{item.value}</div>
                <div className="text-gray-400 text-sm font-light">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;