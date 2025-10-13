// src/components/home/HomeItems/HowItWorks.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const HowItWorks: React.FC = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const steps = [
    {
      step: '01',
      title: 'Register & Choose Plan',
      description: 'Create your account and select a trading plan that matches your capital and risk tolerance.',
      icon: '👤',
      gradient: 'from-yellow-500 to-yellow-600',
      color: 'text-yellow-400'
    },
    {
      step: '02',
      title: 'Secure API Connection',
      description: 'Connect your Binance account with encrypted API keys. We never store your funds.',
      icon: '🔑',
      gradient: 'from-green-500 to-green-600',
      color: 'text-green-400'
    },
    {
      step: '03',
      title: 'Fund Your Account',
      description: 'Deposit funds to your Binance wallet. Our AI will trade with proper risk management.',
      icon: '💰',
      gradient: 'from-blue-500 to-blue-600',
      color: 'text-blue-400'
    },
    {
      step: '04',
      title: 'AI Starts Trading',
      description: 'Our AI analyzes markets 24/7 and executes trades with 87.3% accuracy.',
      icon: '🤖',
      gradient: 'from-purple-500 to-purple-600',
      color: 'text-purple-400'
    },
    {
      step: '05',
      title: 'Monitor & Withdraw',
      description: 'Track performance in real-time and withdraw profits anytime from your Binance account.',
      icon: '📊',
      gradient: 'from-cyan-500 to-cyan-600',
      color: 'text-cyan-400'
    }
  ];

  // Properly typed variants for Framer Motion
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

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 15,
        duration: 0.8
      }
    }
  };

  const lineVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: {
        duration: 1.5,
        delay: 0.5
      }
    }
  };

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-yellow-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-20"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-semibold mb-6"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            SIMPLE PROCESS
          </motion.div>
          
          <motion.h2
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
          >
            Start Trading in
            <span className="block bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
              5 Simple Steps
            </span>
          </motion.h2>
          
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Get started with institutional-grade AI trading in minutes. 
            <span className="text-yellow-400 font-semibold"> No technical knowledge required.</span>
          </motion.p>
        </motion.div>
        
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="relative"
        >
          {/* Animated Connecting Line */}
          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={lineVariants}
            className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent transform -translate-y-1/2 origin-left"
          />
          
          {/* Mobile Vertical Line */}
          <div className="lg:hidden absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-yellow-500/30 to-transparent transform -translate-x-1/2"></div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative group"
              >
                {/* Step Number Background */}
                <motion.div
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                  variants={iconVariants}
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 border border-yellow-500/20 rounded-full flex items-center justify-center z-20 group-hover:scale-110 group-hover:border-yellow-500/40 transition-all duration-300"
                >
                  <span className="text-yellow-400 font-bold text-sm">{step.step}</span>
                </motion.div>

                {/* Main Card */}
                <motion.div
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                  variants={itemVariants}
                  whileHover={{ 
                    y: -8,
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                  className="relative bg-gray-800/40 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 group-hover:border-yellow-500/30 transition-all duration-300 h-full flex flex-col"
                >
                  {/* Gradient Top Bar */}
                  <div className={`w-12 h-1 bg-gradient-to-r ${step.gradient} rounded-full mb-6 mx-auto`}></div>
                  
                  {/* Icon */}
                  <motion.div
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={iconVariants}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center text-3xl shadow-lg`}
                  >
                    {step.icon}
                  </motion.div>

                  {/* Content */}
                  <div className="text-center flex-1">
                    <div className={`text-sm font-bold ${step.color} mb-3 tracking-wider`}>
                      STEP {step.step}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4 leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </motion.div>

                {/* Connecting Dots */}
                {index < steps.length - 1 && (
                  <>
                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-6 bg-yellow-500 rounded-full border-4 border-gray-900 z-10 transform -translate-y-1/2"></div>
                    <div className="lg:hidden absolute -bottom-4 left-1/2 w-6 h-6 bg-yellow-500 rounded-full border-4 border-gray-900 z-10 transform -translate-x-1/2"></div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-yellow-500/10 to-green-500/10 border border-yellow-500/20 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Start Your Trading Journey?
            </h3>
            <p className="text-gray-300 mb-6">
              Join thousands of successful traders using our AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-bold rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-yellow-500/25">
                Get Started Now
              </button>
              <button className="px-8 py-4 bg-gray-800 border border-gray-700 text-white font-semibold rounded-xl hover:bg-gray-700 transition-all duration-300">
                Watch Demo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;