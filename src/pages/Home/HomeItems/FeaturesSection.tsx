// src/pages/Home/HomeItems/FeaturesSection.tsx
import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const FeaturesSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Trading',
      description: 'Multiple AI models analyzing 50+ indicators with 85%+ accuracy for consistent profits.',
      color: 'from-blue-500 to-cyan-500',
      bgGlow: 'bg-blue-500/20',
      stats: { value: '85%+', label: 'Accuracy' },
      badge: 'Most Popular'
    },
    {
      icon: '⚡',
      title: 'Lightning Fast Execution',
      description: 'Sub-150ms order execution optimized for scalping and high-frequency trading.',
      color: 'from-green-500 to-emerald-500',
      bgGlow: 'bg-green-500/20',
      stats: { value: '<150ms', label: 'Execution' },
      badge: 'Performance'
    },
    {
      icon: '🛡️',
      title: 'Advanced Risk Management',
      description: 'Auto stop-loss, position sizing, and cool-down periods to protect your capital.',
      color: 'from-orange-500 to-red-500',
      bgGlow: 'bg-orange-500/20',
      stats: { value: '24/7', label: 'Protection' },
      badge: 'Essential'
    },
    {
      icon: '📊',
      title: 'Multi-Exchange Support',
      description: 'Trade on Binance and Bybit with unified portfolio tracking and analytics.',
      color: 'from-purple-500 to-pink-500',
      bgGlow: 'bg-purple-500/20',
      stats: { value: '2+', label: 'Exchanges' },
      badge: 'Versatile'
    },
    {
      icon: '🔒',
      title: 'Bank-Grade Security',
      description: 'AES-256 encrypted API keys, 2FA protection, and secure cloud infrastructure.',
      color: 'from-indigo-500 to-blue-500',
      bgGlow: 'bg-indigo-500/20',
      stats: { value: 'AES-256', label: 'Encryption' },
      badge: 'Secure'
    },
    {
      icon: '📈',
      title: 'Real-Time Analytics',
      description: 'Live portfolio tracking, performance metrics, and AI-driven insights.',
      color: 'from-yellow-500 to-orange-500',
      bgGlow: 'bg-yellow-500/20',
      stats: { value: 'Live', label: 'Data' },
      badge: 'Insights'
    }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 50, 
      scale: 0.9 
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <section id="features" className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gray-950" ref={ref}>
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900"></div>
      
      {/* Animated Background Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute top-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1
        }}
        className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          {/* Subtitle Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 backdrop-blur-sm mb-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="mr-3"
            >
              ⚙️
            </motion.div>
            <span className="text-blue-400 font-semibold">Professional Trading Tools</span>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight">
            <span className="text-white">Powerful Features for</span>
            <motion.span 
              className="block bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
              animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: '200% auto' }}
            >
              Professional Traders
            </motion.span>
          </h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            Everything you need to automate your futures trading and maximize profits 
            with <span className="text-white font-semibold">institutional-grade technology</span>.
          </motion.p>
        </motion.div>
        
        {/* Features Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              whileHover={{ y: -10 }}
              className="relative group cursor-pointer"
            >
              {/* Card Glow Effect */}
              <motion.div
                className={`absolute -inset-0.5 ${feature.bgGlow} rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                animate={hoveredIndex === index ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              {/* Main Card */}
              <div className="relative p-8 bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl backdrop-blur-xl border border-gray-700/50 group-hover:border-gray-600/80 transition-all duration-300 h-full overflow-hidden">
                {/* Badge */}
                <div className="absolute top-4 right-4">
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${feature.color} text-white shadow-lg`}
                  >
                    {feature.badge}
                  </motion.span>
                </div>

                {/* Icon Container */}
                <motion.div 
                  className={`relative w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-3xl shadow-xl`}
                  whileHover={{ 
                    rotate: [0, -10, 10, -10, 0],
                    scale: 1.1
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {feature.icon}
                  
                  {/* Icon Glow */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ boxShadow: `0 0 30px ${feature.color}` }}
                  />
                </motion.div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>

                  {/* Stats */}
                  <div className="pt-4 border-t border-gray-700/50 group-hover:border-gray-600/50 transition-colors duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`text-2xl font-black bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                          {feature.stats.value}
                        </div>
                        <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                          {feature.stats.label}
                        </div>
                      </div>
                      
                      {/* Animated Arrow */}
                      <motion.div
                        animate={hoveredIndex === index ? { x: [0, 5, 0] } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="text-gray-500 group-hover:text-gray-300 transition-colors duration-300"
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Shimmer Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={hoveredIndex === index ? { x: '100%' } : { x: '-100%' }}
                  transition={{ duration: 0.8 }}
                />

                {/* Corner Accent */}
                <div className={`absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-tl-full`} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-center mt-20"
        >
          <p className="text-gray-400 mb-6 text-lg">
            Ready to experience professional trading?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="relative px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl font-bold text-lg text-white transition-all duration-300 shadow-2xl shadow-blue-500/30 overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-3">
              Explore All Features
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </span>
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-950 to-transparent pointer-events-none"></div>
    </section>
  );
};

export default FeaturesSection;