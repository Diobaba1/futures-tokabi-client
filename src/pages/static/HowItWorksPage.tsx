// src/pages/static/HowItWorksPage.tsx
// How Tokabi Works - Theme-aware with glassmorphism effects
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageSquare, Cpu, FileText, Target, CheckCircle2, ArrowRight } from 'lucide-react';

// Glassmorphism Card Component
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hover = true }) => (
  <div
    className={`
      relative overflow-hidden
      bg-white/70 dark:bg-white/5
      backdrop-blur-xl
      border border-white/20 dark:border-white/10
      shadow-glass dark:shadow-glass-lg
      rounded-2xl
      ${hover ? 'hover:bg-white/80 dark:hover:bg-white/10 hover:shadow-glass-lg dark:hover:shadow-glass-cyan hover:border-cyan-500/20 dark:hover:border-cyan-400/30 transition-all duration-300' : ''}
      ${className}
    `}
  >
    <div className="absolute inset-0 bg-glass-gradient dark:bg-glass-gradient-dark pointer-events-none" />
    <div className="relative z-10">{children}</div>
  </div>
);

const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      number: '01',
      icon: MessageSquare,
      title: 'Connect Your Workflow',
      description: 'Set up your Telegram notifications and connect your exchange API (read-only). Tokabi integrates seamlessly with your existing trading routine.',
      details: [
        'Instant Telegram alerts for new opportunities',
        'Read-only API connection—we never execute trades',
        'Works with major exchanges: Binance, Bybit, and more',
        'Mobile-first design for traders on the go'
      ]
    },
    {
      number: '02',
      icon: Cpu,
      title: 'Receive AI-Validated Signals',
      description: 'Our spatial intelligence engine continuously monitors markets, identifying high-probability zones where institutional activity clusters.',
      details: [
        'Multi-timeframe confluence analysis',
        'Support/resistance zone identification',
        'Volume profile and order flow insights',
        'Expert validation before delivery'
      ]
    },
    {
      number: '03',
      icon: FileText,
      title: 'Get Complete Context',
      description: 'Each signal comes with everything you need: entry zones, targets, stop losses, and the reasoning behind the analysis.',
      details: [
        'Clear entry, target, and stop levels',
        'Risk-reward ratio calculations',
        'Market structure explanation',
        'Confidence level assessment'
      ]
    },
    {
      number: '04',
      icon: Target,
      title: 'Execute with Discipline',
      description: 'Make informed decisions based on validated analysis. Our structured approach helps you maintain discipline in volatile markets.',
      details: [
        'Pre-defined risk parameters',
        'Position sizing guidance',
        'Trade management suggestions',
        'Performance tracking dashboard'
      ]
    }
  ];

  const signalParts = [
    { num: 1, title: 'Asset & Direction', desc: 'Clear identification of the trading pair and whether it\'s a long or short setup.' },
    { num: 2, title: 'Entry Zone', desc: 'Precise price levels or ranges for optimal entry, often with multiple entry tiers.' },
    { num: 3, title: 'Take Profit Targets', desc: 'Multiple TP levels to help you scale out of positions systematically.' },
    { num: 4, title: 'Stop Loss', desc: 'Pre-calculated invalidation level to protect your capital.' },
    { num: 5, title: 'Analysis & Reasoning', desc: 'Detailed explanation of the market structure and why this setup has edge.' },
  ];

  return (
    <div className="bg-white dark:bg-dark-base min-h-screen transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white dark:from-dark-elevated dark:to-dark-base overflow-hidden">
        <div className="absolute inset-0 bg-mesh-gradient dark:opacity-30" />
        <div className="absolute inset-0 bg-cyan-gradient-radial opacity-20 dark:opacity-10" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-tokabi-primary dark:text-white mb-6">
              How <span className="bg-gradient-to-r from-cyan-500 to-cyan-700 dark:from-cyan-400 dark:to-cyan-500 bg-clip-text text-transparent">Tokabi</span> Works
            </h1>
            <p className="text-lg text-tokabi-secondary dark:text-gray-400 max-w-2xl mx-auto">
              A streamlined process that delivers institutional-grade intelligence
              directly to your trading workflow.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Process Overview */}
      <section className="py-16 lg:py-24 bg-white dark:bg-dark-base">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl lg:text-4xl font-bold text-tokabi-primary dark:text-white mb-4"
            >
              Four Steps to Disciplined Trading
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-tokabi-secondary dark:text-gray-400 max-w-2xl mx-auto"
            >
              From setup to execution, Tokabi provides everything you need to trade
              with confidence and discipline.
            </motion.p>
          </div>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`flex flex-col lg:flex-row gap-8 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-5xl font-bold bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 dark:from-cyan-400/20 dark:to-cyan-500/20 bg-clip-text text-transparent">
                      {step.number}
                    </span>
                    <h3 className="text-2xl lg:text-3xl font-bold text-tokabi-primary dark:text-white">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-lg text-tokabi-secondary dark:text-gray-400 mb-6">
                    {step.description}
                  </p>
                  <ul className="space-y-3">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-cyan-500 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span className="text-tokabi-secondary dark:text-gray-400">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual */}
                <div className="flex-1 w-full max-w-md">
                  <GlassCard className="p-8 aspect-video flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center mx-auto mb-4 shadow-glass-cyan">
                        <step.icon className="w-10 h-10 text-white" />
                      </div>
                      <p className="text-sm font-medium text-tokabi-secondary dark:text-gray-400">
                        {step.title}
                      </p>
                    </div>
                  </GlassCard>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Signal Anatomy */}
      <section className="relative py-16 lg:py-24 bg-gray-50/80 dark:bg-dark-elevated/50 overflow-hidden">
        <div className="absolute inset-0 bg-mesh-gradient opacity-30 dark:opacity-20" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-tokabi-primary dark:text-white mb-4">
              Anatomy of a Tokabi Signal
            </h2>
            <p className="text-lg text-tokabi-secondary dark:text-gray-400">
              Every signal delivers complete context for confident decision-making.
            </p>
          </motion.div>

          <GlassCard className="p-6 lg:p-8" hover={false}>
            <div className="space-y-6">
              {signalParts.map((part, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-start gap-4 ${index < signalParts.length - 1 ? 'pb-6 border-b border-gray-200/50 dark:border-dark-border' : ''}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-glass-cyan">
                    <span className="text-white font-semibold">{part.num}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-tokabi-primary dark:text-white mb-1">{part.title}</h4>
                    <p className="text-tokabi-secondary dark:text-gray-400">{part.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-16 lg:py-24 bg-white dark:bg-dark-base">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-tokabi-primary dark:text-white mb-4">
              What Makes Tokabi Different
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: 'Not Just Signals', desc: 'We don\'t just tell you what to trade—we explain why, giving you the context to make confident decisions and learn along the way.' },
              { title: 'AI + Human Validation', desc: 'Every signal passes through both AI analysis and expert review, combining computational power with market experience.' },
              { title: 'Quality Over Quantity', desc: 'We don\'t flood you with signals. We wait for high-probability setups and only alert when there\'s genuine opportunity.' },
              { title: 'Built for Discipline', desc: 'Our platform is designed to reinforce good habits—pre-defined risk, clear invalidation, and structured trade management.' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-6 h-full">
                  <h3 className="text-xl font-bold text-tokabi-primary dark:text-white mb-3">{item.title}</h3>
                  <p className="text-tokabi-secondary dark:text-gray-400">{item.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-br from-cyan-600 via-cyan-700 to-cyan-800 dark:from-dark-surface dark:via-dark-elevated dark:to-dark-base overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/50 to-transparent dark:from-dark-base/50" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-cyan-100 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Join Tokabi today and experience what disciplined trading feels like.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/pricing">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-8 py-4 bg-white dark:bg-gradient-to-r dark:from-cyan-500 dark:to-cyan-600 text-cyan-700 dark:text-white font-semibold rounded-xl shadow-glass-lg hover:shadow-glow-cyan transition-all duration-300 flex items-center gap-2"
                >
                  Start with Alpha
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link to="/spatial-intelligence">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-8 py-4 bg-white/10 backdrop-blur-glass text-white font-semibold rounded-xl border border-white/30 hover:bg-white/20 hover:border-white/50 shadow-glass transition-all duration-300 flex items-center gap-2"
                >
                  Explore Spatial Intelligence
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;
