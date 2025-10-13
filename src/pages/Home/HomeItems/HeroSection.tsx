// src/pages/Home/HomeItems/HeroSection.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
  const [displayText, setDisplayText] = useState('');
  const fullText = 'AI Trading';
  
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

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden bg-gray-950">
      {/* Dynamic Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-blue-950/20 to-gray-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      </div>
      
      {/* Enhanced Animated Orbs with Parallax */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
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
        className="absolute top-20 left-10 w-96 h-96 bg-yellow-500/15 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.3, 0.2],
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
        className="absolute top-1/3 right-20 w-[500px] h-[500px] bg-green-500/15 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ 
          duration: 12,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 2,
          ease: "easeInOut"
        }}
        style={{
          x: mousePosition.x * 0.4,
          y: mousePosition.y * -0.4,
        }}
        className="absolute bottom-20 left-1/4 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl"
      />
      
      {/* Enhanced Grid Pattern with Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      
      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut"
          }}
          className="absolute w-1 h-1 bg-blue-400/40 rounded-full"
          style={{
            left: `${10 + i * 6}%`,
            bottom: '10%',
          }}
        />
      ))}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-7xl mx-auto text-center"
      >
        {/* Enhanced Trust Badge with Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 100 }}
          className="mb-10"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-green-900/40 to-emerald-900/40 border border-green-500/40 text-green-300 text-base font-semibold backdrop-blur-md shadow-lg shadow-green-500/20 cursor-default"
          >
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2.5 h-2.5 bg-green-400 rounded-full mr-3"
            />
            🚀 Trusted by 10,000+ professional traders
          </motion.div>
        </motion.div>
        
        {/* Enhanced Main Heading with Stagger Effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black mb-4 leading-tight tracking-tight"
          >
            <motion.span 
              className="inline-block text-white drop-shadow-2xl"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              TokaBi
            </motion.span>
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black mb-4 leading-tight"
          >
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                {displayText}
              </span>
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-1 h-16 sm:h-20 lg:h-24 xl:h-28 bg-green-400 ml-1 align-middle"
              />
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight"
          >
            <span className="text-white drop-shadow-2xl">Platform</span>
          </motion.h1>
        </motion.div>
        
        {/* Enhanced Subtitle with Highlights */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-5xl mx-auto leading-relaxed px-4"
        >
          Institutional-grade futures trading with{' '}
          <motion.span 
            className="relative inline-block"
            whileHover={{ scale: 1.1 }}
          >
            <span className="text-yellow-400 font-bold text-2xl sm:text-3xl">87.3%</span>
            <motion.span
              className="absolute -inset-1 bg-yellow-400/20 rounded-lg blur-sm -z-10"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.span>
          {' '}accuracy. Connect your exchange, deploy our AI, and achieve consistent returns with military-grade security.
        </motion.p>
        
        {/* Enhanced CTA Buttons with Better Hover Effects */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20"
        >
          <Link 
            to="/register"
            className="group relative"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="relative px-12 py-6 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 rounded-2xl font-bold text-xl text-gray-900 transition-all duration-300 shadow-2xl shadow-yellow-500/30 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                Start Trading Now
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-200"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl blur-lg opacity-50 -z-10"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </Link>
          
          <Link 
            to="/demo"
            className="group relative"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="relative px-12 py-6 bg-gray-800/90 border-2 border-gray-600/50 rounded-2xl font-bold text-xl text-white hover:border-gray-500 transition-all duration-300 backdrop-blur-md overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                View Live Demo
                <span className="text-green-400">▶</span>
              </span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </Link>
        </motion.div>
        
        {/* Enhanced Stats Grid with Better Hover Effects */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-4"
        >
          {[
            { 
              value: '87.3%', 
              label: 'Accuracy Rate', 
              color: 'from-green-400 to-emerald-500',
              icon: '📈',
              description: 'Verified performance',
              gradient: 'from-green-500/20 to-emerald-500/20'
            },
            { 
              value: '<50ms', 
              label: 'Execution Speed', 
              color: 'from-yellow-400 to-orange-500',
              icon: '⚡',
              description: 'Lightning fast',
              gradient: 'from-yellow-500/20 to-orange-500/20'
            },
            { 
              value: '24/7/365', 
              label: 'AI Monitoring', 
              color: 'from-blue-400 to-cyan-500',
              icon: '🛡️',
              description: 'Always active',
              gradient: 'from-blue-500/20 to-cyan-500/20'
            }
          ].map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 + index * 0.1, duration: 0.5 }}
              whileHover={{ 
                y: -8,
                transition: { type: "spring", stiffness: 300 }
              }}
              className="relative group cursor-default"
            >
              <div className="relative text-center p-10 bg-gray-800/60 rounded-3xl backdrop-blur-lg border border-gray-700/50 hover:border-gray-600 transition-all duration-300 overflow-hidden">
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />
                
                <div className="relative z-10">
                  <motion.div 
                    className="text-5xl mb-4"
                    animate={{ 
                      rotateY: [0, 360],
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    {stat.icon}
                  </motion.div>
                  <motion.div 
                    className={`text-4xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-3`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-gray-200 font-bold text-lg mb-2">{stat.label}</div>
                  <div className="text-gray-400 text-sm font-medium">{stat.description}</div>
                </div>

                {/* Shimmer effect on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Security Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400"
        >
          {[
            { icon: '🔒', text: 'Bank-level encryption', color: 'green' },
            { icon: '🔑', text: 'API-only access', color: 'blue' },
            { icon: '✓', text: 'SOC 2 Type II Certified', color: 'yellow' }
          ].map((badge, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 + i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 px-5 py-3 bg-gray-800/50 rounded-full border border-gray-700/50 backdrop-blur-sm hover:border-gray-600/50 transition-all"
            >
              <motion.div 
                className={`w-2 h-2 bg-${badge.color}-400 rounded-full`}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              />
              <span className="font-medium">{badge.icon} {badge.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Enhanced Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent pointer-events-none"></div>
      
      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-gray-500 cursor-pointer"
        >
          <span className="text-xs font-semibold">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-gray-500 rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;