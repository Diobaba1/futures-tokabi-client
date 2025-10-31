// src/pages/Home/HomeItems/PricingSection.tsx
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Shield, TrendingUp, Users } from 'lucide-react';

const PricingSection: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const handleVideoLoad = () => {
    setVideoLoaded(true);
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8;
    }
  };

  const plans = [
    {
      name: 'Professional',
      monthlyPrice: '299',
      yearlyPrice: '249',
      description: 'Advanced trading tools for active professional traders',
      features: [
        'Up to $50,000 trading capital',
        'Advanced AI models with machine learning',
        '25 simultaneous trades',
        'Priority 24/7 support',
        'Advanced analytics dashboard',
        '87.3% accuracy target',
        'Custom risk parameters',
        'Advanced technical indicators',
        'API access included',
        'Real-time trading signals',
        'Portfolio optimization',
        'Risk management tools'
      ],
      popular: true,
      gradient: '',
      color: 'text-cyan-400',
      badge: 'RECOMMENDED',
      icon: TrendingUp
    },
    {
      name: 'Institutional',
      monthlyPrice: '799',
      yearlyPrice: '649',
      description: 'Enterprise-grade solutions for funds and institutions',
      features: [
        'Unlimited trading capital',
        'All AI models + custom training',
        'Unlimited simultaneous trades',
        '24/7 dedicated account manager',
        'Institutional-grade analytics',
        '89% accuracy target',
        'Custom strategy development',
        'White-label solutions',
        '99.9% SLA guarantee',
        'Advanced risk management',
        'Multi-exchange support',
        'Custom API integrations',
        'Dedicated infrastructure',
        'Compliance reporting'
      ],
      popular: false,
      gradient: '',
      color: 'text-violet-400',
      badge: 'ENTERPRISE',
      icon: Users
    },
    {
      name: 'Elite',
      monthlyPrice: '1,499',
      yearlyPrice: '1,199',
      description: 'Premium solution for hedge funds and proprietary firms',
      features: [
        'Unlimited capital + leverage',
        'Custom AI model development',
        'High-frequency trading enabled',
        'Dedicated engineering support',
        'Real-time market data feeds',
        '90%+ accuracy target',
        'Strategy backtesting suite',
        'Custom risk frameworks',
        'Co-location services',
        'Low-latency execution',
        'Regulatory compliance suite',
        'Custom reporting dashboards',
        'Training and onboarding',
        'Quarterly strategy reviews'
      ],
      popular: false,
      gradient: '',
      color: 'text-amber-400',
      badge: 'PREMIUM',
      icon: Shield
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
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-950 relative overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={handleVideoLoad}
          className="w-full h-full object-cover opacity-20"
        >
          <source src="" type="video/mp4" />
          <source src="/videos/pricing-background.mp4" type="video/mp4" />
          <source src="/videos/pricing-background.webm" type="video/webm" />
        </video>
        
        {/* Video Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950/95 via-blue-950/30 to-gray-950/95"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-gray-950/80"></div>
      </div>

      {/* Subtle Background Elements */}
      <div className="absolute top-20 left-10 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

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
            className="inline-flex items-center px-4 py-2 rounded-full bg-gray-800/60 border border-gray-700/50 text-gray-300 text-sm font-light tracking-wider mb-8 backdrop-blur-sm"
          >
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2"></div>
            ENTERPRISE PRICING
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light mb-6 text-white">
            Institutional Plans
            <motion.span 
              className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent font-normal mt-2"
              animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: '200% auto' }}
            >
              For Professional Traders
            </motion.span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
            Scalable pricing designed for professional traders and institutional clients 
            seeking advanced algorithmic trading solutions.
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
              className="relative w-14 h-7 bg-gray-700 rounded-full transition-colors duration-300 focus:outline-none border border-gray-600"
            >
              <motion.div
                className={`absolute top-1 w-5 h-5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-lg ${
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
              <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-medium rounded">
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
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className={`relative group ${
                  plan.popular ? 'lg:scale-[1.02]' : ''
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20"
                  >
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-1.5 rounded-full text-xs font-medium tracking-wide flex items-center gap-1 shadow-lg shadow-cyan-500/25">
                      <Star className="w-3 h-3" />
                      {plan.badge}
                    </div>
                  </motion.div>
                )}

                {/* Plan Badge */}
                {!plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <div className={`px-3 py-1 ${plan.color} bg-gray-800/80 backdrop-blur-sm rounded-full text-xs font-medium tracking-wide border border-gray-700`}>
                      {plan.badge}
                    </div>
                  </div>
                )}
                
                {/* Main Card */}
                <div className={`relative h-full bg-gray-800/30 backdrop-blur-lg rounded-xl border ${
                  plan.popular 
                    ? 'border-cyan-500/30 shadow-lg shadow-cyan-500/10' 
                    : 'border-gray-700/30 hover:border-gray-600/50'
                } transition-all duration-300 overflow-hidden`}>
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-3 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  <div className="relative z-10 p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                      <div className="flex justify-center mb-4">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-lg`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <h3 className={`text-xl font-semibold ${plan.popular ? 'text-white' : 'text-gray-200'} mb-3 tracking-tight`}>
                        {plan.name}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed mb-6 font-light">
                        {plan.description}
                      </p>
                      
                      {/* Price */}
                      <div className="flex items-baseline justify-center gap-2 mb-2">
                        <span className="text-4xl font-light text-white">
                          ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                        </span>
                        <span className="text-gray-400 text-base">/month</span>
                      </div>
                      {billingCycle === 'yearly' && (
                        <p className="text-cyan-400 text-sm font-light">
                          Annually: ${parseInt(plan.yearlyPrice.replace(',', '')) * 12}
                        </p>
                      )}
                    </div>
                    
                    {/* Features List */}
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <motion.li 
                          key={featureIndex}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 * featureIndex }}
                          className="flex items-start text-gray-300 group/item"
                        >
                          <div className="flex-shrink-0 w-4 h-4 bg-cyan-500/20 rounded flex items-center justify-center mr-3 mt-0.5">
                            <Check className="w-2.5 h-2.5 text-cyan-400" />
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
                        className={`block w-full text-center py-3 rounded-lg font-medium transition-all duration-300 text-sm tracking-wide ${
                          plan.popular 
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40' 
                            : 'bg-gray-700/50 text-white hover:bg-gray-600/50 border border-gray-600/30'
                        }`}
                      >
                        {plan.popular ? 'Start Professional Trial' : 'Request Demo'}
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
        
        {/* Enterprise Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-16"
        >
          <div className="bg-gray-800/30 backdrop-blur-lg rounded-xl p-8 border border-gray-700/30 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Zap className="w-5 h-5 text-cyan-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">Custom Enterprise Solutions</h3>
            </div>
            <p className="text-gray-300 mb-6 text-sm font-light max-w-md mx-auto">
              Need a tailored solution for your organization? Our team can build custom 
              trading infrastructure to meet your specific requirements.
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
                className="px-6 py-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-medium rounded-lg hover:bg-cyan-500/20 transition-all duration-300 text-sm"
              >
                Schedule Technical Review
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Compliance Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-500 text-xs font-light max-w-2xl mx-auto leading-relaxed">
            All trading involves substantial risk. Past performance does not guarantee future results. 
            Professional clients only. Minimum capital requirements may apply.
          </p>
        </motion.div>
      </div>

      {/* Video Loading State */}
      {!videoLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: videoLoaded ? 0 : 1 }}
          className="absolute inset-0 bg-gray-950 flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full"
          />
        </motion.div>
      )}
    </section>
  );
};

export default PricingSection;