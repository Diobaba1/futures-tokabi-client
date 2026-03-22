// src/components/home/HomeItems/SecuritySection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Smartphone, 
  Scale, 
  Building2, 
  Gem, 
  Eye,
  Cpu,
  Network,
  FileLock2
} from 'lucide-react';

const SecuritySection: React.FC = () => {
  const securityFeatures = [
    {
      title: 'AES-256 Encryption',
      description: 'Military-grade encryption protocols for all API keys and sensitive financial data with zero-knowledge architecture.',
      icon: Lock,
      gradient: '',
      delay: 0.1
    },
    {
      title: 'Multi-Factor Authentication',
      description: 'Mandatory 2FA with hardware key support for all trading actions and account modifications.',
      icon: Smartphone,
      gradient: '',
      delay: 0.2
    },
    {
      title: 'Advanced Risk Management',
      description: 'Dynamic position sizing, auto cool-down protocols, and real-time exposure monitoring.',
      icon: Scale,
      gradient: '',
      delay: 0.3
    },
    {
      title: 'Bank-Grade Infrastructure',
      description: 'Tier-4 data centers with regular penetration testing and security audits.',
      icon: Building2,
      gradient: '',
      delay: 0.4
    },
    {
      title: 'Fund Segregation',
      description: 'Client funds remain in exchange accounts. We never hold or control capital.',
      icon: Gem,
      gradient: '',
      delay: 0.5
    },
    {
      title: 'Continuous Monitoring',
      description: '24/7 system surveillance with AI-powered anomaly detection and response.',
      icon: Eye,
      gradient: '',
      delay: 0.6
    },
    {
      title: 'Secure API Architecture',
      description: 'Zero-trust API design with IP whitelisting and request rate limiting.',
      icon: Cpu,
      gradient: '',
      delay: 0.7
    },
    {
      title: 'Distributed Infrastructure',
      description: 'Multi-region deployment with automatic failover and disaster recovery.',
      icon: Network,
      gradient: '',
      delay: 0.8
    },
    {
      title: 'Compliance & Auditing',
      description: 'SOC 2 Type II compliant with comprehensive audit trails and reporting.',
      icon: FileLock2,
      gradient: '',
      delay: 0.9
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
    hidden: { opacity: 0, y: 30 },
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
    <section id="security" className="py-24 px-4 sm:px-6 lg:px-8 bg-dark-base relative overflow-hidden">
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
        className="absolute top-20 left-10 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl"
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
        className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"
      />
      
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
            className="inline-flex items-center px-4 py-2 rounded-full bg-dark-elevated/60 border border-gray-700/50 text-gray-300 text-sm font-light tracking-wider mb-8 backdrop-blur-sm"
          >
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2"></div>
            ENTERPRISE SECURITY
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light mb-6 text-white">
            Institutional-Grade
            <motion.span 
              className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent font-normal mt-2"
              animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: '200% auto' }}
            >
              Security Framework
            </motion.span>
          </h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed font-light"
          >
            Multi-layered security architecture designed to protect institutional assets 
            and ensure operational integrity in all market conditions.
          </motion.p>
        </motion.div>
        
        {/* Security Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {securityFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                custom={feature.delay}
                whileHover={{ y: -4 }}
                className="group relative"
              >
                <div className="relative p-6 bg-dark-elevated/30 backdrop-blur-lg rounded-xl border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300 h-full">
                  
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`w-12 h-12 mb-4 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}
                  >
                    <IconComponent className="w-5 h-5 text-white" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-white mb-3 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed font-light">
                    {feature.description}
                  </p>

                  {/* Hover Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Security Assurance */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <div className="bg-dark-elevated/30 backdrop-blur-lg rounded-xl p-8 border border-gray-700/30 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 mr-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-white mb-1">Funds Protection Guarantee</h3>
                <p className="text-gray-400 text-sm font-light">
                  Client capital remains securely in exchange accounts under your control
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-700/30">
              {[
                { value: 'AES-256', label: 'Encryption' },
                { value: 'SOC 2', label: 'Compliant' },
                { value: '99.9%', label: 'Uptime SLA' },
                { value: '24/7', label: 'Monitoring' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-cyan-400 font-semibold text-sm">{item.value}</div>
                  <div className="text-gray-500 text-xs font-light mt-1">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Compliance Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-500 text-xs font-light max-w-2xl mx-auto leading-relaxed">
            All security protocols are regularly audited and updated to meet institutional standards. 
            Comprehensive insurance coverage for operational risks.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default SecuritySection;