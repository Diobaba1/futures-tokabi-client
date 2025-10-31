// src/components/home/HomeItems/HowItWorks.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Import Lucide React icons for more professional look
import { 
  UserCheck, 
  Wallet, 
  BarChart3,
  Shield,
  Cpu,
  Zap,
  Settings
} from 'lucide-react';

const HowItWorks: React.FC = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const steps = [
    {
      step: '01',
      title: 'Account Setup',
      description: 'Create your institutional account with advanced security protocols and compliance verification.',
      icon: UserCheck,
      gradient: '',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20'
    },
    {
      step: '02',
      title: 'Secure Integration',
      description: 'Connect your exchange accounts with encrypted API keys and institutional-grade security measures.',
      icon: Shield,
      gradient: '',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20'
    },
    {
      step: '03',
      title: 'Capital Allocation',
      description: 'Deposit funds to your secured trading accounts with real-time risk assessment and monitoring.',
      icon: Wallet,
      gradient: '',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      step: '04',
      title: 'AI Deployment',
      description: 'Deploy our advanced machine learning models with real-time market analysis and strategy optimization.',
      icon: Cpu,
      gradient: '',
      color: 'text-violet-400',
      bgColor: 'bg-violet-500/10',
      borderColor: 'border-violet-500/20'
    },
    {
      step: '05',
      title: 'Performance Monitoring',
      description: 'Track real-time performance analytics, risk metrics, and portfolio optimization insights.',
      icon: BarChart3,
      gradient: '',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20'
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

  const iconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 150,
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
        duration: 2,
        ease: "easeOut" as const
      }
    }
  };

  const progressVariants = {
    hidden: { width: 0 },
    visible: {
      width: '100%',
      transition: {
        delay: 1,
        duration: 1,
        ease: "easeOut" as const
      }
    }
  };

  const dotVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 1.5,
        duration: 0.5,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-blue-950/10 to-gray-950"></div>
      
      {/* Subtle Background Orbs */}
      <div className="absolute top-20 left-10 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-20"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center px-4 py-2 rounded-full bg-gray-800/60 border border-gray-700/50 text-gray-300 text-sm font-light tracking-wider mb-8 backdrop-blur-sm"
          >
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2"></div>
            PROCESS OVERVIEW
          </motion.div>
          
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl lg:text-5xl font-light mb-6 text-white"
          >
            Institutional Onboarding
            <motion.span 
              className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent font-normal mt-2"
              animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: '200% auto' }}
            >
              In Five Steps
            </motion.span>
          </motion.h2>
          
          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Streamlined integration process designed for professional traders and institutional clients 
            seeking advanced algorithmic trading solutions.
          </motion.p>
        </motion.div>
        
        {/* Steps Process */}
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
            className="hidden lg:block absolute top-24 left-10 right-10 h-0.5 bg-gradient-to-r from-cyan-500/20 via-blue-500/30 to-violet-500/20 transform origin-left rounded-full"
          />
          
          {/* Mobile Vertical Line */}
          <div className="lg:hidden absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500/20 via-blue-500/30 to-violet-500/20 transform rounded-full"></div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-4">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="relative group"
                >
                  {/* Step Number */}
                  <motion.div
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={iconVariants}
                    className="absolute -top-2 lg:top-16 lg:-left-2 w-8 h-8 bg-gray-900 border border-gray-700 rounded-full flex items-center justify-center z-20 group-hover:border-cyan-400/50 transition-colors duration-300"
                  >
                    <span className="text-cyan-400 font-medium text-xs">{step.step}</span>
                  </motion.div>

                  {/* Main Card */}
                  <motion.div
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={itemVariants}
                    whileHover={{ 
                      y: -4,
                    }}
                    className={`relative ${step.bgColor} backdrop-blur-lg rounded-xl p-6 border ${step.borderColor} group-hover:border-opacity-50 transition-all duration-500 h-full flex flex-col`}
                  >
                    {/* Icon Container */}
                    <motion.div
                      initial="hidden"
                      animate={inView ? "visible" : "hidden"}
                      variants={iconVariants}
                      whileHover={{ scale: 1.05 }}
                      className={`w-14 h-14 mb-5 rounded-lg bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg`}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className={`text-xs font-medium ${step.color} mb-3 tracking-widest uppercase`}>
                        Step {step.step}
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-3 leading-tight tracking-tight">
                        {step.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed font-light">
                        {step.description}
                      </p>
                    </div>

                    {/* Progress Indicator */}
                    <div className="mt-4 pt-4 border-t border-gray-700/30">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Progress</span>
                        <span>{step.step}/05</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-1 mt-2">
                        <motion.div 
                          className={`h-1 rounded-full bg-gradient-to-r ${step.gradient}`}
                          initial="hidden"
                          animate={inView ? "visible" : "hidden"}
                          variants={progressVariants}
                          custom={index}
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Connecting Dots */}
                  {index < steps.length - 1 && (
                    <>
                      <motion.div 
                        initial="hidden"
                        animate={inView ? "visible" : "hidden"}
                        variants={dotVariants}
                        className="hidden lg:block absolute top-24 -right-2 w-3 h-3 bg-cyan-400 rounded-full border-2 border-gray-950 z-10"
                      />
                      <motion.div 
                        initial="hidden"
                        animate={inView ? "visible" : "hidden"}
                        variants={dotVariants}
                        className="lg:hidden absolute -bottom-4 left-6 w-3 h-3 bg-cyan-400 rounded-full border-2 border-gray-950 z-10 transform -translate-x-1/2"
                      />
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Enhanced CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="text-center mt-20"
        >
          <div className="bg-gray-800/30 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-cyan-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">
                Ready to Deploy Advanced Trading?
              </h3>
            </div>
            <p className="text-gray-300 mb-6 text-sm font-light max-w-md mx-auto">
              Join institutional traders leveraging our AI-powered platform for consistent alpha generation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-lg transition-all duration-300 shadow-lg shadow-cyan-500/25 flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                Begin Onboarding
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-gray-700/50 border border-gray-600/50 text-white font-medium rounded-lg hover:bg-gray-600/50 transition-all duration-300 flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Technical Details
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 2 }}
          className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-3xl mx-auto"
        >
          {[
            { value: '5min', label: 'Average Setup', icon: Zap },
            { value: '99.9%', label: 'Uptime', icon: Shield },
            { value: '256-bit', label: 'Encryption', icon: Shield },
            { value: '24/7', label: 'Support', icon: Cpu }
          ].map((stat, index) => {
            const StatIcon = stat.icon;
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 2.2 + index * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-2">
                  <StatIcon className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="text-2xl font-light text-white mb-1">{stat.value}</div>
                <div className="text-xs text-gray-400 font-light tracking-wide">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;