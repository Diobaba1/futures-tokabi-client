// src/pages/Home/HomeItems/FeaturesSection.tsx
import React, { useState, useRef } from 'react';
import { motion, Variants, useInView } from 'framer-motion';

const FeaturesSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Trading',
      description: 'Multiple AI models analyzing 50+ indicators with 85%+ accuracy for consistent profits.',
      color: '',
      bgColor: '',
      borderColor: 'border-blue-500/20',
      stats: { value: '85%+', label: 'Accuracy' },
      badge: 'Advanced'
    },
    {
      icon: '⚡',
      title: 'Lightning Execution',
      description: 'Sub-150ms order execution optimized for scalping and high-frequency trading.',
      color: '',
      bgColor: '',
      borderColor: 'border-emerald-500/20',
      stats: { value: '<150ms', label: 'Execution' },
      badge: 'Performance'
    },
    {
      icon: '🛡️',
      title: 'Risk Management',
      description: 'Auto stop-loss, position sizing, and cool-down periods to protect your capital.',
      color: '',
      bgColor: '',
      borderColor: 'border-amber-500/20',
      stats: { value: '24/7', label: 'Protection' },
      badge: 'Essential'
    },
    {
      icon: '📊',
      title: 'Multi-Exchange',
      description: 'Trade on Binance and Bybit with unified portfolio tracking and analytics.',
      color: '',
      bgColor: '',
      borderColor: 'border-purple-500/20',
      stats: { value: '2+', label: 'Exchanges' },
      badge: 'Versatile'
    },
    {
      icon: '🔒',
      title: 'Bank-Grade Security',
      description: 'AES-256 encrypted API keys, 2FA protection, and secure cloud infrastructure.',
      color: '',
      bgColor: '',
      borderColor: 'border-indigo-500/20',
      stats: { value: 'AES-256', label: 'Encryption' },
      badge: 'Secure'
    },
    {
      icon: '📈',
      title: 'Real-Time Analytics',
      description: 'Live portfolio tracking, performance metrics, and AI-driven insights.',
      color: '',
      bgColor: '',
      borderColor: 'border-cyan-500/20',
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
      y: 40,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
        duration: 0.8
      }
    }
  };

  const handleVideoLoad = () => {
    setVideoLoaded(true);
  };

  return (
    <section id="features" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gray-950" ref={ref}>
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={handleVideoLoad}
          className="w-full h-full object-cover opacity-40"
        >
          <source src="https://res.cloudinary.com/deioo5lrm/video/upload/v1761905222/60452-495582510_qdpvu4.mp4" type="video/mp4" />
          <source src="/videos/features-background.mp4" type="video/mp4" />
          <source src="/videos/features-background.webm" type="video/webm" />
        </video>
        
        {/* Video Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950/95 via-gray-900/90 to-gray-950/95"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-gray-950/80"></div>
      </div>

      {/* Subtle Background Elements */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.03, 0.05, 0.03],
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute top-20 right-10 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ 
          scale: [1.1, 1, 1.1],
          opacity: [0.04, 0.06, 0.04],
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1
        }}
        className="absolute bottom-20 left-10 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          {/* Subtle Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm mb-8"
          >
            <span className="text-cyan-400 text-sm font-light tracking-wider">PROFESSIONAL TOOLS</span>
          </motion.div>

          {/* Refined Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light mb-6 leading-tight">
            <span className="text-white">Institutional-Grade</span>
            <br />
            <motion.span 
              className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent font-normal"
              animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: '200% auto' }}
            >
              Trading Infrastructure
            </motion.span>
          </h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Advanced trading systems designed for professional investors and institutional clients 
            seeking consistent alpha generation.
          </motion.p>
        </motion.div>
        
        {/* Features Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              whileHover={{ y: -4 }}
              className="relative group cursor-pointer"
            >
              {/* Main Card */}
              <div className={`relative p-6 ${feature.bgColor} rounded-xl backdrop-blur-lg border ${feature.borderColor} group-hover:border-opacity-40 transition-all duration-500 h-full overflow-hidden`}>
                
                {/* Badge */}
                <div className="absolute top-4 right-4">
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className={`inline-block px-2 py-1 rounded text-xs font-medium bg-gray-800/80 text-gray-300 backdrop-blur-sm border border-gray-700/50`}
                  >
                    {feature.badge}
                  </motion.span>
                </div>

                {/* Icon */}
                <motion.div 
                  className={`relative w-14 h-14 mb-5 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center text-xl shadow-lg`}
                  whileHover={{ 
                    scale: 1.05,
                    rotate: 5
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {feature.icon}
                </motion.div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white tracking-tight">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm leading-relaxed font-light">
                    {feature.description}
                  </p>

                  {/* Stats */}
                  <div className="pt-3 border-t border-gray-700/30 group-hover:border-gray-600/40 transition-colors duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`text-xl font-semibold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                          {feature.stats.value}
                        </div>
                        <div className="text-xs text-gray-500 font-light tracking-wide">
                          {feature.stats.label}
                        </div>
                      </div>
                      
                      {/* Subtle Arrow */}
                      <motion.div
                        animate={hoveredIndex === index ? { x: [0, 3, 0] } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="text-gray-600 group-hover:text-gray-400 transition-colors duration-300"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Hover Shimmer */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={hoveredIndex === index ? { x: '100%' } : { x: '-100%' }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-gray-400 mb-6 text-sm font-light tracking-wide">
            Ready to transform your trading strategy?
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative px-8 py-4 bg-gray-800/60 border border-gray-700/50 rounded-lg font-medium text-white transition-all duration-300 backdrop-blur-sm overflow-hidden group hover:border-gray-600/60"
          >
            <span className="relative z-10 flex items-center gap-2 text-sm tracking-wide">
              Explore All Capabilities
              <motion.span
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </span>
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-gray-700/50 to-gray-800/50"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
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

export default FeaturesSection;