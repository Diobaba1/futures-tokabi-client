// src/pages/static/SpatialIntelligencePage.tsx
// Spatial Intelligence - Theme-aware with glassmorphism effects
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BarChart3, Flame, TrendingUp, Clock, Shield, Lightbulb, ArrowRight, Sparkles } from 'lucide-react';

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

const SpatialIntelligencePage: React.FC = () => {
  const features = [
    { icon: BarChart3, title: 'Multi-Timeframe', description: 'Analyzes structure across all relevant timeframes' },
    { icon: Flame, title: 'Liquidity Mapping', description: 'Identifies where major orders are likely positioned' },
    { icon: TrendingUp, title: 'Structure Recognition', description: 'Detects market structure shifts in real-time' },
  ];

  const howItWorks = [
    { num: 1, title: 'Data Collection', desc: 'Continuously ingests price, volume, and order flow data across multiple exchanges and timeframes. Processes millions of data points per second.' },
    { num: 2, title: 'Structure Analysis', desc: 'Identifies key market structure elements: swing highs/lows, order blocks, fair value gaps, and liquidity pools. Maps the "spatial" landscape of price.' },
    { num: 3, title: 'Confluence Detection', desc: 'Finds zones where multiple factors align: timeframe confluence, institutional positioning, and technical significance. These overlaps indicate highest-probability setups.' },
    { num: 4, title: 'Expert Validation', desc: 'AI-identified setups are reviewed by experienced traders who add context, filter false positives, and ensure each signal meets our quality standards.' },
  ];

  const keyConcepts = [
    { title: 'Order Blocks', desc: 'Zones where institutional buying or selling initiated significant price moves. These areas often act as future support or resistance as institutions defend their positions.' },
    { title: 'Fair Value Gaps', desc: 'Price imbalances where rapid movement created "gaps" in the market structure. These inefficiencies often get filled as price seeks equilibrium.' },
    { title: 'Liquidity Pools', desc: 'Clusters of stop losses and pending orders that attract price. Understanding where liquidity sits helps anticipate price targets and potential reversals.' },
    { title: 'Market Structure Shifts', desc: 'Changes in the pattern of higher highs/lows or lower highs/lows that signal potential trend changes. Early detection of these shifts provides significant trading edge.' },
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
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-cyan-500/10 dark:bg-cyan-400/10 border border-cyan-500/20 dark:border-cyan-400/20 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span className="text-sm font-medium text-cyan-700 dark:text-cyan-300">Core Technology</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-tokabi-primary dark:text-white mb-6">
              <span className="bg-gradient-to-r from-cyan-500 to-cyan-700 dark:from-cyan-400 dark:to-cyan-500 bg-clip-text text-transparent">Spatial</span> Intelligence
            </h1>
            <p className="text-lg text-tokabi-secondary dark:text-gray-400 max-w-2xl mx-auto">
              Our proprietary AI engine that reads market structure the way professionals
              do—identifying where price is likely to react before it happens.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What is Spatial Intelligence */}
      <section className="py-16 lg:py-24 bg-white dark:bg-dark-base">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-tokabi-primary dark:text-white mb-6">
                What is Spatial Intelligence?
              </h2>
              <div className="space-y-6 text-lg text-tokabi-secondary dark:text-gray-400">
                <p>
                  Markets aren't random—they move through space in predictable patterns.
                  Professional traders have always known this, using concepts like support/resistance,
                  order blocks, and liquidity zones to anticipate price movement.
                </p>
                <p>
                  <span className="font-bold text-tokabi-primary dark:text-white">Spatial Intelligence</span> is our
                  AI-powered system that identifies these critical price zones automatically,
                  analyzing multiple timeframes and market conditions to find high-probability
                  reaction points.
                </p>
                <p>
                  Think of it as having a professional technical analyst watching every chart,
                  every timeframe, 24/7—and alerting you only when genuine opportunity emerges.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <GlassCard className="p-8">
                <div className="space-y-6">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-cyan-500/20 flex items-center justify-center border border-cyan-500/20">
                        <feature.icon className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-tokabi-primary dark:text-white">{feature.title}</h4>
                        <p className="text-sm text-tokabi-secondary dark:text-gray-400">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
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
              How Spatial Intelligence Works
            </h2>
            <p className="text-lg text-tokabi-secondary dark:text-gray-400 max-w-2xl mx-auto">
              A four-stage process that transforms raw market data into actionable intelligence.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-6 h-full">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center font-bold text-white mb-4 shadow-glass-cyan">
                    {step.num}
                  </div>
                  <h3 className="text-xl font-bold text-tokabi-primary dark:text-white mb-3">{step.title}</h3>
                  <p className="text-tokabi-secondary dark:text-gray-400">{step.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Concepts */}
      <section className="py-16 lg:py-24 bg-white dark:bg-dark-base">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-tokabi-primary dark:text-white mb-4">
              Key Concepts We Analyze
            </h2>
          </motion.div>

          <div className="space-y-8">
            {keyConcepts.map((concept, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="border-l-4 border-cyan-500 dark:border-cyan-400 pl-6"
              >
                <h3 className="text-xl font-bold text-tokabi-primary dark:text-white mb-2">{concept.title}</h3>
                <p className="text-lg text-tokabi-secondary dark:text-gray-400">{concept.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-br from-cyan-600 via-cyan-700 to-cyan-800 dark:from-dark-surface dark:via-dark-elevated dark:to-dark-base overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/50 to-transparent dark:from-dark-base/50" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Why Spatial Intelligence Matters
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: 'Be Early', desc: 'Identify setups before they become obvious to the crowd. Position yourself ahead of the move, not chasing it.' },
              { icon: Shield, title: 'Reduce Risk', desc: 'Tight, logical stop losses based on structure rather than arbitrary percentages. Know exactly where your trade is invalidated.' },
              { icon: Lightbulb, title: 'Trade Smarter', desc: 'Understand the "why" behind every setup. Build real market intuition while benefiting from AI-powered analysis.' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 border border-white/20">
                  <item.icon className="w-8 h-8 text-cyan-300" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-cyan-100 dark:text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
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
              Experience Spatial Intelligence
            </h2>
            <p className="text-lg text-tokabi-secondary dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              See how AI-powered market structure analysis can transform your trading.
              Start with our Alpha plan and experience the difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/pricing">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-xl shadow-glass-cyan hover:shadow-glass-cyan-lg transition-all duration-300 flex items-center gap-2"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link to="/how-it-works">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-8 py-4 bg-white/50 dark:bg-white/5 backdrop-blur-glass text-tokabi-primary dark:text-white font-semibold rounded-xl border border-cyan-500/30 dark:border-cyan-400/30 hover:bg-white/80 dark:hover:bg-white/10 shadow-glass transition-all duration-300 flex items-center gap-2"
                >
                  See How It Works
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

export default SpatialIntelligencePage;
