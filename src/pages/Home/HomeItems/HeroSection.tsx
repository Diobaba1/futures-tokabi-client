// src/pages/Home/HomeItems/HeroSection.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [displayText, setDisplayText] = useState('');
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fullText = 'AI Trading';

  // Smooth mouse tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Typing animation effect
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 150);

    return () => clearInterval(timer);
  }, []);

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8; // Slow down slightly for more cinematic feel
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden bg-gray-950">
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
          className="w-full h-full object-cover"
        >
          <source src="https://res.cloudinary.com/deioo5lrm/video/upload/v1761902627/9135-217588604_btsdqc.mp4" type="video/mp4" />
          {/* Fallback video sources */}
          <source src="/videos/hero-background.mp4" type="video/mp4" />
          <source src="/videos/hero-background.webm" type="video/webm" />
        </video>
        
        {/* Video overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950/80 via-blue-950/40 to-gray-950/80"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-transparent to-gray-950/90"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-gray-950/50 to-gray-950/90"></div>
      </div>

      {/* Enhanced Animated Orbs with Parallax */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
        style={{
          x: mousePosition.x * 0.5,
          y: mousePosition.y * 0.5,
        }}
        className="absolute top-20 left-10 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"
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
          delay: 1,
          ease: "easeInOut"
        }}
        style={{
          x: mousePosition.x * -0.3,
          y: mousePosition.y * 0.3,
        }}
        className="absolute top-1/3 right-20 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-3xl"
      />

      {/* Enhanced Grid Pattern with Subtle Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      
      {/* Floating Particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -80, 0],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut"
          }}
          className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
          style={{
            left: `${10 + i * 7}%`,
            bottom: '10%',
          }}
        />
      ))}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-6xl mx-auto text-center"
      >
        {/* Sophisticated Trust Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 100 }}
          className="mb-12"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="inline-flex items-center px-6 py-3 rounded-full bg-gray-900/60 border border-emerald-500/30 text-emerald-200 text-sm font-light tracking-wide backdrop-blur-md cursor-default mt-5"
          >
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-emerald-400 rounded-full mr-2"
            />
            Trusted by 10,000+ professional traders worldwide
          </motion.div>
        </motion.div>
        
        {/* Refined Main Heading with Sophisticated Typography */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-10"
        >
          {/* Brand Name - Subtle and Elegant */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-6"
          >
            <h2 className="text-sm uppercase tracking-[0.3em] text-gray-400 font-light mb-4">
              Powered by
            </h2>
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight mb-2"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              TOKABI
            </motion.h1>
          </motion.div>
          
          {/* Main Value Proposition */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mb-6"
          >
            <div className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-white mb-4 leading-relaxed">
              Advanced{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-amber-200 via-emerald-200 to-cyan-200 bg-clip-text text-transparent font-normal">
                  {displayText}
                </span>
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="inline-block w-px h-12 sm:h-14 bg-emerald-400 ml-1 align-middle"
                />
              </span>
            </div>
            
            <div className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-300">
              for Modern Markets
            </div>
          </motion.div>
        </motion.div>
        
        {/* Refined Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-lg sm:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light tracking-wide px-4"
        >
          Institutional-grade futures trading with{' '}
          <motion.span 
            className="relative inline-block font-normal"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-amber-300">87.3%</span>
            <motion.span
              className="absolute -inset-1 bg-amber-400/10 rounded-lg -z-10"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.span>
          {' '}accuracy. Deploy our AI systems and achieve consistent returns with enterprise-grade security.
        </motion.p>
        
        {/* Refined CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-20"
        >
          <Link 
            to="/register"
            className="group relative"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative px-10 py-4 bg-gradient-to-r  rounded-xl font-medium text-lg text-gray-200 transition-all duration-300 shadow-lg  overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2 tracking-wide">
                Start Trading
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </Link>
          
          <Link 
            to="/demo"
            className="group relative"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative px-10 py-4 bg-gray-900/60 border border-gray-600/30 rounded-xl font-medium text-lg text-white hover:border-gray-500/50 transition-all duration-300 backdrop-blur-md overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2 tracking-wide">
                View Live Demo
                <span className="text-emerald-400 text-sm">▶</span>
              </span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-gray-800/50 to-gray-700/50"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </Link>
        </motion.div>
        
        {/* Sophisticated Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto px-4"
        >
          {[
            { 
              value: '87.3%', 
              label: 'Accuracy Rate', 
              description: 'Verified performance across all market conditions',
              icon: '↗',
              color: 'from-emerald-400 to-emerald-500'
            },
            { 
              value: '<50ms', 
              label: 'Execution Speed', 
              description: 'Average order execution latency',
              icon: '⚡',
              color: 'from-amber-400 to-amber-500'
            },
            { 
              value: '24/7', 
              label: 'Market Monitoring', 
              description: 'Continuous AI surveillance',
              icon: '🛡️',
              color: 'from-blue-400 to-cyan-500'
            }
          ].map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 + index * 0.1, duration: 0.5 }}
              whileHover={{ 
                y: -4,
                transition: { type: "spring", stiffness: 400 }
              }}
              className="relative group cursor-default"
            >
              <div className="relative text-center p-8 bg-gray-900/40 rounded-2xl backdrop-blur-lg border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300 overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                
                <div className="relative z-10">
                  <div className="text-2xl mb-3 text-gray-400">{stat.icon}</div>
                  <motion.div 
                    className={`text-3xl font-light bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-gray-200 font-medium text-sm mb-2 tracking-wide">{stat.label}</div>
                  <div className="text-gray-400 text-xs font-light leading-relaxed">{stat.description}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Refined Security Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400"
        >
          {[
            { icon: '🔒', text: 'Bank-Level Security', color: 'emerald' },
            { icon: '🔑', text: 'API-Only Access', color: 'blue' },
            { icon: '✓', text: 'SOC 2 Certified', color: 'amber' }
          ].map((badge, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 + i * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900/30 rounded-lg border border-gray-700/30 backdrop-blur-sm hover:border-gray-600/40 transition-all"
            >
              <span className="text-xs">{badge.icon}</span>
              <span className="font-light tracking-wide">{badge.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Enhanced Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent pointer-events-none"></div>
      
      {/* Elegant Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-1 text-gray-500 cursor-pointer"
        >
          <span className="text-xs font-light tracking-widest">EXPLORE</span>
          <div className="w-px h-8 bg-gray-600 rounded-full flex items-start justify-center">
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-px h-3 bg-gray-400 rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Video Loading State */}
      {!isVideoLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: isVideoLoaded ? 0 : 1 }}
          className="absolute inset-0 bg-gray-950 flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full"
          />
        </motion.div>
      )}
    </section>
  );
};

export default HeroSection;