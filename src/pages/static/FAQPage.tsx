// src/pages/static/FAQPage.tsx
// FAQ Page - Theme-aware with glassmorphism effects
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, MessageCircle, Mail, ArrowRight } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

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

const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const faqs: FAQItem[] = [
    { category: 'Getting Started', question: 'What is Tokabi?', answer: 'Tokabi is a market intelligence platform that combines AI-powered spatial analysis with expert validation to deliver high-probability trading signals. We help traders replace impulsive decisions with disciplined, data-driven execution.' },
    { category: 'Getting Started', question: 'How do I get started with Tokabi?', answer: 'Getting started is simple: 1) Create an account and choose your subscription plan. 2) Connect your Telegram for instant signal delivery. 3) Optionally connect your exchange API (read-only) for portfolio tracking. 4) Start receiving AI-validated trading signals directly to your device.' },
    { category: 'Getting Started', question: 'Do I need trading experience to use Tokabi?', answer: 'While Tokabi is designed for traders of all experience levels, having basic understanding of trading concepts (entries, exits, stop losses) will help you get the most value. Each signal comes with detailed explanations to help you learn and improve.' },
    { category: 'Signals & Trading', question: 'How many signals do you send per day?', answer: 'Quality over quantity is our philosophy. We typically send 2-5 signals per day depending on market conditions. We only alert when our AI and expert team identify genuine high-probability setups—not to fill a quota.' },
    { category: 'Signals & Trading', question: 'What markets do you cover?', answer: 'Tokabi currently covers cryptocurrency markets including major pairs (BTC, ETH) and selected altcoins on Binance and Bybit. We focus on liquid markets where our spatial intelligence can identify clear structure and institutional activity.' },
    { category: 'Signals & Trading', question: 'What information is included in each signal?', answer: 'Every signal includes: 1) Asset and direction (long/short). 2) Entry zone with specific price levels. 3) Multiple take-profit targets. 4) Stop-loss level. 5) Risk-reward ratio. 6) Detailed market structure analysis explaining why this setup has edge.' },
    { category: 'Signals & Trading', question: 'Do you execute trades automatically?', answer: 'Yes on the highest tier only. Tokabi is an intelligence platform—on other tiers, analysis and insights are given which you maintain full control over on any exchange of your choice.' },
    { category: 'Spatial Intelligence', question: 'What is Spatial Intelligence?', answer: 'Spatial Intelligence is our proprietary AI engine that analyzes market structure the way professional traders do. It identifies key price zones—order blocks, fair value gaps, liquidity pools—where institutional activity clusters and price is likely to react.' },
    { category: 'Spatial Intelligence', question: 'How is this different from traditional technical analysis?', answer: 'Traditional TA often relies on lagging indicators and pattern recognition. Spatial Intelligence focuses on market structure and order flow—understanding where large players are positioned and where price is likely to move next, not where it\'s been.' },
    { category: 'Account & Billing', question: 'What subscription plans are available?', answer: 'We offer three tiers: Essential (basic signals and Telegram alerts), Professional (priority signals, advanced analytics, and API access), and VIP (personalized support, exclusive insights, and direct analyst access). Visit our pricing page for current rates.' },
    { category: 'Account & Billing', question: 'Do you offer refunds?', answer: 'We offer a 7-day satisfaction guarantee for new subscribers. If you\'re not satisfied with the service within the first week, contact support for a full refund. After the initial period, subscriptions are non-refundable but can be cancelled anytime.' },
    { category: 'Security & Privacy', question: 'Is my exchange API connection safe?', answer: 'Absolutely. We only request read-only API permissions—we cannot execute trades, withdraw funds, or modify your account in any way. Your API keys are encrypted and stored securely. Many users choose not to connect their API at all and simply use Telegram signals.' },
  ];

  const categories = ['all', ...Array.from(new Set(faqs.map(faq => faq.category)))];
  const filteredFaqs = activeCategory === 'all' ? faqs : faqs.filter(faq => faq.category === activeCategory);

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
              Frequently Asked <span className="bg-gradient-to-r from-cyan-500 to-cyan-700 dark:from-cyan-400 dark:to-cyan-500 bg-clip-text text-transparent">Questions</span>
            </h1>
            <p className="text-lg text-tokabi-secondary dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to know about Tokabi, our signals, and how we help
              you trade with discipline.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-gray-100 dark:border-dark-border sticky top-16 lg:top-20 bg-white/95 dark:bg-dark-base/95 backdrop-blur-lg z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-glass-cyan'
                    : 'bg-white/50 dark:bg-white/5 text-tokabi-secondary dark:text-gray-400 hover:bg-cyan-500/10 dark:hover:bg-cyan-400/10 border border-transparent hover:border-cyan-500/20'
                }`}
              >
                {category === 'all' ? 'All Questions' : category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-16 lg:py-24 bg-white dark:bg-dark-base">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard className="overflow-hidden" hover={false}>
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/50 dark:hover:bg-white/5 transition-colors"
                  >
                    <span className="text-lg font-medium text-tokabi-primary dark:text-white pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-cyan-500 dark:text-cyan-400 flex-shrink-0 transition-transform duration-300 ${
                        openIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 border-t border-gray-100 dark:border-dark-border pt-4">
                          <p className="text-tokabi-secondary dark:text-gray-400 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="relative py-16 lg:py-24 bg-gray-50/80 dark:bg-dark-elevated/50 overflow-hidden">
        <div className="absolute inset-0 bg-mesh-gradient opacity-30 dark:opacity-20" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-tokabi-primary dark:text-white mb-6">
              Still Have Questions?
            </h2>
            <p className="text-lg text-tokabi-secondary dark:text-gray-400 mb-8 max-w-xl mx-auto">
              Can't find what you're looking for? Our team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://t.me/tokabi_support"
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-xl shadow-glass-cyan hover:shadow-glass-cyan-lg transition-all duration-300 flex items-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Contact on Telegram
                </motion.button>
              </a>
              <a href="mailto:support@tokabi.io">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-8 py-4 bg-white/50 dark:bg-white/5 backdrop-blur-glass text-tokabi-primary dark:text-white font-semibold rounded-xl border border-cyan-500/30 dark:border-cyan-400/30 hover:bg-white/80 dark:hover:bg-white/10 shadow-glass transition-all duration-300 flex items-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  Email Support
                </motion.button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-white dark:bg-dark-base">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-tokabi-primary dark:text-white mb-6">
              Ready to Trade with Discipline?
            </h2>
            <p className="text-lg text-tokabi-secondary dark:text-gray-400 mb-8 max-w-xl mx-auto">
              Join traders who have replaced impulse with intelligence.
            </p>
            <Link to="/pricing">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-xl shadow-glass-cyan hover:shadow-glass-cyan-lg transition-all duration-300 flex items-center gap-2 mx-auto"
              >
                View Pricing Plans
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
