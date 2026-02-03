// src/pages/static/AboutPage.tsx
// About Tokabi - Theme-aware with glassmorphism effects
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Target, Shield, BarChart3, Zap, Users, Brain, ArrowRight } from 'lucide-react';

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

const AboutPage: React.FC = () => {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  const values = [
    { icon: Target, title: 'Precision', description: 'We value quality over quantity. Fewer, better-validated opportunities outperform high-volume noise.' },
    { icon: Shield, title: 'Protection', description: 'Capital preservation is paramount. We help you avoid bad trades as much as we help you find good ones.' },
    { icon: BarChart3, title: 'Transparency', description: 'Every signal includes complete reasoning. You always understand the "why" behind each recommendation.' },
  ];

  const approaches = [
    { icon: Brain, title: 'AI-Powered Analysis', description: 'Our spatial intelligence engine processes market structure, identifying high-probability zones before they become obvious to the crowd.' },
    { icon: Users, title: 'Expert Validation', description: 'Every AI-generated insight is reviewed and validated by experienced traders, ensuring you receive actionable context—not just data.' },
    { icon: Shield, title: 'Disciplined Framework', description: 'Built-in guardrails and structured workflows help you maintain discipline during volatile markets when emotions run highest.' },
    { icon: Zap, title: 'Real-Time Intelligence', description: 'Instant notifications when high-probability setups emerge, delivered through Telegram so you never miss critical opportunities.' },
  ];

  return (
    <div className="bg-white dark:bg-dark-base min-h-screen transition-colors duration-300">
      {/* Hero Section */}
      <section ref={heroRef} className="relative py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white dark:from-dark-elevated dark:to-dark-base overflow-hidden">
        <div className="absolute inset-0 bg-mesh-gradient dark:opacity-30" />
        <div className="absolute inset-0 bg-cyan-gradient-radial opacity-20 dark:opacity-10" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-tokabi-primary dark:text-white mb-6">
              About <span className="bg-gradient-to-r from-cyan-500 to-cyan-700 dark:from-cyan-400 dark:to-cyan-500 bg-clip-text text-transparent">Tokabi</span>
            </h1>
            <p className="text-lg text-tokabi-secondary dark:text-gray-400 max-w-2xl mx-auto">
              We're building the intelligence layer that transforms how traders
              interact with financial markets—replacing impulse with discipline.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 lg:py-24 bg-white dark:bg-dark-base">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-tokabi-primary dark:text-white mb-6">
              Our Mission
            </h2>
            <div className="space-y-6 text-lg text-tokabi-secondary dark:text-gray-400">
              <p>
                The financial markets have become a casino for most retail participants.
                Social media pumps, FOMO-driven entries, and the gamification of trading
                apps have turned disciplined investing into impulse gambling.
              </p>
              <p className="font-semibold text-tokabi-primary dark:text-white">
                Tokabi exists to change this.
              </p>
              <p>
                We believe that profitable trading isn't about predictions—it's about
                preparation, patience, and process. Our platform provides the intelligence
                infrastructure that helps traders wait for the right moments and execute
                with conviction.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Problem We Solve */}
      <section className="relative py-16 lg:py-24 bg-gray-50/80 dark:bg-dark-elevated/50 overflow-hidden">
        <div className="absolute inset-0 bg-mesh-gradient opacity-30 dark:opacity-20" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-tokabi-primary dark:text-white mb-8">
              The Problem We Solve
            </h2>

            <div className="space-y-6">
              {[
                { title: 'Information Overload', description: 'Traders are drowning in charts, indicators, news feeds, and social media noise. More information hasn\'t led to better decisions—it\'s led to analysis paralysis and reactive trading.' },
                { title: 'Emotional Decision-Making', description: 'Fear and greed drive most retail trading decisions. Without proper context and validation, traders enter positions too early, exit too late, and size incorrectly.' },
                { title: 'Lack of Professional Context', description: 'Institutional traders have teams, tools, and processes that retail traders lack. This information asymmetry creates systematic disadvantages for individual participants.' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <GlassCard className="p-6">
                    <h3 className="text-xl font-bold text-tokabi-primary dark:text-white mb-3">{item.title}</h3>
                    <p className="text-tokabi-secondary dark:text-gray-400">{item.description}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-16 lg:py-24 bg-white dark:bg-dark-base">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-tokabi-primary dark:text-white mb-8">
              Our Approach
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {approaches.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <GlassCard className="p-6 h-full">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-cyan-500/20 dark:from-cyan-400/10 dark:to-cyan-500/10 flex items-center justify-center mb-4 border border-cyan-500/20">
                      <item.icon className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-bold text-tokabi-primary dark:text-white mb-3">{item.title}</h3>
                    <p className="text-tokabi-secondary dark:text-gray-400">{item.description}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Values */}
      <section className="relative py-16 lg:py-24 bg-gray-50/80 dark:bg-dark-elevated/50 overflow-hidden">
        <div className="absolute inset-0 bg-cyan-gradient-radial opacity-20 dark:opacity-10" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-tokabi-primary dark:text-white mb-8 text-center">
              Our Values
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <GlassCard className="p-6 h-full">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-4 border border-cyan-500/20 shadow-glow-cyan-sm">
                      <value.icon className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-bold text-tokabi-primary dark:text-white mb-2">{value.title}</h3>
                    <p className="text-sm text-tokabi-secondary dark:text-gray-400">{value.description}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
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
              Ready to Trade with Discipline?
            </h2>
            <p className="text-lg text-cyan-100 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Join traders who have replaced impulse with intelligence. Start your
              journey toward disciplined, profitable trading.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/pricing">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-8 py-4 bg-white dark:bg-gradient-to-r dark:from-cyan-500 dark:to-cyan-600 text-cyan-700 dark:text-white font-semibold rounded-xl shadow-glass-lg hover:shadow-glow-cyan transition-all duration-300 flex items-center gap-2"
                >
                  View Pricing
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link to="/how-it-works">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-8 py-4 bg-white/10 backdrop-blur-glass text-white font-semibold rounded-xl border border-white/30 hover:bg-white/20 hover:border-white/50 shadow-glass transition-all duration-300 flex items-center gap-2"
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

export default AboutPage;
