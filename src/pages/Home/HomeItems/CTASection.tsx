// src/pages/Home/HomeItems/CTASection.tsx
import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, ArrowRight, Shield, Zap, Clock } from 'lucide-react';

const CTASection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const handleVideoLoad = () => {
    setVideoLoaded(true);
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8;
    }
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-dark-base relative overflow-hidden">
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
          className="w-full h-full object-cover opacity-30"
        >
          <source src="https://res.cloudinary.com/deioo5lrm/video/upload/v1761904309/76602-559745298_gudipg.mp4" type="video/mp4" />
          <source src="/videos/cta-background.mp4" type="video/mp4" />
          <source src="/videos/cta-background.webm" type="video/webm" />
        </video>
        
        {/* Video Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950/95 via-blue-950/40 to-gray-950/95"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-gray-950/80"></div>
      </div>

      {/* Subtle Background Elements */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.03, 0.05, 0.03],
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute top-10 left-10 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.04, 0.06, 0.04],
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 2,
        }}
        className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"
      />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Professional Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center px-5 py-2.5 rounded-full bg-dark-elevated/60 border border-gray-700/50 text-gray-300 text-sm font-light tracking-wider mb-8 backdrop-blur-sm"
          >
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2"
            />
            TRUSTED BY INSTITUTIONAL TRADERS
          </motion.div>

          {/* Refined Heading */}
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-light mb-6 leading-tight text-white"
          >
            Ready to Elevate Your
            <motion.span 
              className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent font-normal mt-2"
              animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: '200% auto' }}
            >
              Trading Strategy?
            </motion.span>
          </motion.h2>
          
          {/* Sophisticated Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Deploy institutional-grade AI trading systems with proven performance metrics. 
            Join professional traders achieving consistent alpha generation in volatile markets.
          </motion.p>
          
          {/* Refined CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            {/* Primary CTA */}
            <Link 
              to="/register"
              className="group relative"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-medium text-white transition-all duration-300 shadow-lg shadow-cyan-500/25 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2 text-sm tracking-wide">
                  Begin Institutional Onboarding
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </Link>
            
            {/* Secondary CTA */}
            <Link 
              to="/demo"
              className="group relative"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative px-10 py-4 bg-dark-elevated/60 border border-gray-600/50 rounded-xl font-medium text-white hover:border-gray-500/50 transition-all duration-300 backdrop-blur-sm overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2 text-sm tracking-wide">
                  <Play className="w-4 h-4 text-cyan-400" />
                  View Platform Demo
                </span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-gray-700/50 to-gray-800/50 opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </Link>
          </motion.div>

          {/* Professional Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto mb-12"
          >
            {[
              {
                icon: Shield,
                title: 'Enterprise Security',
                description: 'Bank-grade encryption protocols'
              },
              {
                icon: Zap,
                title: 'Instant Setup',
                description: 'Deploy in under 5 minutes'
              },
              {
                icon: Clock,
                title: 'Flexible Terms',
                description: 'No long-term commitments'
              }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                  whileHover={{ y: -2 }}
                  className="flex flex-col items-center text-center p-6 bg-dark-elevated/30 backdrop-blur-sm rounded-xl border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300"
                >
                  <motion.div 
                    className="w-12 h-12 mb-4 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <IconComponent className="w-5 h-5 text-cyan-400" />
                  </motion.div>
                  <h3 className="text-white font-medium text-sm mb-2 tracking-wide">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-xs font-light">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Performance Metrics */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="pt-8 border-t border-gray-700/30"
          >
            <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-400">
              {[
                { value: '87.3%', label: 'Accuracy Rate', icon: '↗' },
                { value: '<50ms', label: 'Execution Speed', icon: '⚡' },
                { value: '24/7', label: 'Market Monitoring', icon: '📈' },
                { value: 'AES-256', label: 'Security', icon: '🔒' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-2 px-3 py-2 bg-dark-elevated/20 rounded-lg border border-gray-700/20 backdrop-blur-sm"
                >
                  <span className="text-cyan-400 text-xs">{item.icon}</span>
                  <div className="text-right">
                    <div className="text-white font-medium text-sm">{item.value}</div>
                    <div className="text-gray-500 text-xs font-light">{item.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Compliance Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="mt-8"
          >
            <p className="text-gray-500 text-xs font-light max-w-md mx-auto leading-relaxed">
              All trading involves risk. Past performance does not guarantee future results. 
              Professional clients only. Capital at risk.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Video Loading State */}
      {!videoLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: videoLoaded ? 0 : 1 }}
          className="absolute inset-0 bg-dark-base flex items-center justify-center"
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

export default CTASection;