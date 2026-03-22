// src/pages/Home/LandingPage.tsx
// Tokabi Landing Page - Ultra Modern Design with Cutting-Edge UI
// Bento grids, animated borders, dramatic animations, 3D depth effects
import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Brain,
  Users,
  Target,
  Shield,
  AlertTriangle,
  Zap,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Activity,
  Eye,
  BarChart3,
  Sparkles,
  Layers,
  LineChart,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { ParticleBackground } from '../../components/effects';

// ============================================================================
// ANIMATED GRADIENT BORDER CARD
// ============================================================================
interface AnimatedBorderCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'purple' | 'orange';
}

const AnimatedBorderCard: React.FC<AnimatedBorderCardProps> = ({
  children,
  className = '',
  glowColor = 'cyan'
}) => {
  const glowClasses = {
    cyan: 'from-cyan-500 via-cyan-300 to-cyan-600',
    purple: 'from-purple-500 via-pink-400 to-purple-600',
    orange: 'from-orange-500 via-amber-400 to-orange-600',
  };

  return (
    <div className={`relative group ${className}`}>
      {/* Animated gradient border */}
      <div className={`absolute -inset-[1px] bg-gradient-to-r ${glowClasses[glowColor]} rounded-3xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500 animate-gradient-xy`} />
      <div className={`absolute -inset-[1px] bg-gradient-to-r ${glowClasses[glowColor]} rounded-3xl opacity-20 group-hover:opacity-40 transition-all duration-500`} />

      {/* Card content */}
      <div className="relative bg-white/80 dark:bg-dark-surface/90 backdrop-blur-2xl rounded-3xl border border-white/20 dark:border-white/5 overflow-hidden">
        {/* Inner shine */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-transparent dark:from-white/5 pointer-events-none" />
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
};

// ============================================================================
// MODERN GLASS CARD
// ============================================================================
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hover = true, gradient = false }) => (
  <div
    className={`
      relative overflow-hidden
      ${gradient
        ? 'bg-gradient-to-br from-white/90 via-white/70 to-cyan-50/50 dark:from-white/10 dark:via-white/5 dark:to-cyan-900/10'
        : 'bg-white/70 dark:bg-white/5'}
      backdrop-blur-2xl
      border border-white/30 dark:border-white/10
      shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]
      rounded-3xl
      ${hover ? 'hover:bg-white/90 dark:hover:bg-white/10 hover:shadow-[0_20px_60px_rgba(14,116,144,0.15)] dark:hover:shadow-[0_20px_60px_rgba(14,116,144,0.2)] hover:border-cyan-500/30 dark:hover:border-cyan-400/30 hover:-translate-y-1 transition-all duration-500' : ''}
      ${className}
    `}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent dark:from-white/5 pointer-events-none" />
    <div className="relative z-10">{children}</div>
  </div>
);

// ============================================================================
// FLOATING BADGE COMPONENT
// ============================================================================
interface BadgeProps {
  children: React.ReactNode;
  icon?: React.ElementType;
  variant?: 'default' | 'glow';
}

const Badge: React.FC<BadgeProps> = ({ children, icon: Icon, variant = 'default' }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`
      inline-flex items-center gap-2 px-5 py-2.5 rounded-full
      ${variant === 'glow'
        ? 'bg-gradient-to-r from-cyan-500/20 via-cyan-400/20 to-cyan-500/20 border border-cyan-400/30 shadow-[0_0_20px_rgba(34,211,238,0.3)]'
        : 'bg-white/60 dark:bg-white/10 border border-white/30 dark:border-white/10'}
      backdrop-blur-xl
    `}
  >
    {Icon && <Icon className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />}
    <span className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">{children}</span>
  </motion.div>
);

// ============================================================================
// SECTION 1: HERO - IMMERSIVE FULL-SCREEN
// ============================================================================
const HeroSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Complex layered background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-cyan-50/30 to-white dark:from-[#030712] dark:via-[#0a1628] dark:to-[#030712]" />

      {/* TS Particles */}
      <ParticleBackground preset="hero" className="z-[1]" />

      {/* Animated mesh gradient */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 z-[2]"
      >
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-cyan-400/30 via-cyan-500/10 to-transparent dark:from-cyan-400/15 dark:via-cyan-500/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-600/20 via-cyan-400/10 to-transparent dark:from-cyan-600/10 dark:via-cyan-400/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-gradient-to-r from-cyan-500/10 to-purple-500/10 dark:from-cyan-500/5 dark:to-purple-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse-slow" />
      </motion.div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,116,144,0.02)_2px,transparent_2px),linear-gradient(90deg,rgba(14,116,144,0.02)_2px,transparent_2px)] dark:bg-[linear-gradient(rgba(14,116,144,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(14,116,144,0.05)_1px,transparent_1px)] bg-[size:80px_80px] z-[3]" />

      {/* Main content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-6xl mx-auto px-6 py-32 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-10"
          >
            <Badge icon={Sparkles} variant="glow">AI-Powered Market Intelligence</Badge>
          </motion.div>

          {/* Main headline with gradient animation */}
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-black text-slate-900 dark:text-white mb-8 leading-[0.95] tracking-tighter">
            <span className="block">Tokabi.</span>
            <span className="block mt-2 bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-600 dark:from-cyan-300 dark:via-cyan-400 dark:to-cyan-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Market Intelligence
            </span>
            <span className="block text-4xl md:text-5xl lg:text-6xl font-bold text-gray-600 dark:text-gray-400 mt-4">
              for disciplined execution.
            </span>
          </h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed font-medium"
          >
            Replace impulse with intelligence. Spatial awareness powered by AI that tells you{' '}
            <span className="text-cyan-600 dark:text-cyan-400 font-semibold">when to act</span>,{' '}
            <span className="text-cyan-600 dark:text-cyan-400 font-semibold">when to wait</span>, and{' '}
            <span className="text-cyan-600 dark:text-cyan-400 font-semibold">when to walk away</span>.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-5 justify-center items-center"
          >
            <Link to="/pricing">
              <motion.button
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="group relative px-10 py-5 bg-gradient-to-r from-cyan-500 via-cyan-500 to-cyan-600 text-white font-bold text-lg rounded-2xl shadow-[0_10px_40px_rgba(14,116,144,0.4)] hover:shadow-[0_20px_60px_rgba(14,116,144,0.5)] transition-all duration-500 flex items-center gap-3 overflow-hidden"
              >
                <span className="relative z-10">Explore the intelligence</span>
                <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </motion.button>
            </Link>

            <Link to="/how-it-works">
              <motion.button
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="group px-10 py-5 bg-white/70 dark:bg-white/5 backdrop-blur-2xl text-slate-800 dark:text-white font-bold text-lg rounded-2xl border-2 border-slate-200 dark:border-white/10 hover:border-cyan-500/50 dark:hover:border-cyan-400/50 shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_50px_rgba(14,116,144,0.15)] transition-all duration-500 flex items-center gap-3"
              >
                See how Tokabi thinks
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-8 h-14 border-2 border-cyan-500/40 dark:border-cyan-400/30 rounded-full flex justify-center pt-3 backdrop-blur-sm bg-white/20 dark:bg-white/5"
          >
            <motion.div
              animate={{ y: [0, 16, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-2 h-2 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

// ============================================================================
// SECTION 2: THE PROBLEM - DRAMATIC STATEMENT
// ============================================================================
const ProblemSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-32 md:py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-white dark:from-dark-base dark:via-dark-elevated dark:to-dark-base" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(14,116,144,0.1),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(14,116,144,0.15),transparent)]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
        >
          <AnimatedBorderCard className="max-w-4xl mx-auto">
            <div className="p-10 md:p-16 text-center space-y-10">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tight"
              >
                Markets do not punish
                <br />
                <span className="text-gray-400 dark:text-gray-500">lack of information.</span>
              </motion.p>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="w-32 h-1 bg-gradient-to-r from-cyan-500 to-cyan-400 mx-auto rounded-full"
              />

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-600 bg-clip-text text-transparent leading-tight"
              >
                They punish lack of discipline.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="space-y-4 pt-6"
              >
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
                  Most participants fail not because they lack data, but because they act on emotion.
                  Poor timing. Impulsive entries. Holding losers too long.
                </p>
                <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                  Tokabi removes these failure points.
                </p>
              </motion.div>
            </div>
          </AnimatedBorderCard>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================================================
// SECTION 3: BENTO GRID FEATURES
// ============================================================================
const BentoSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-32 md:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50 dark:from-dark-base dark:to-dark-elevated" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <Badge icon={Layers} variant="glow">How It Works</Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mt-8 mb-6 tracking-tight">
            Intelligence delivered
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A three-pillar system that transforms raw data into actionable insight.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Large card - AI Processing */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 lg:row-span-2"
          >
            <GlassCard className="h-full p-8 md:p-12" gradient>
              <div className="flex flex-col h-full">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center mb-8 shadow-[0_10px_40px_rgba(14,116,144,0.3)]">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                  AI-Powered Processing
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                  Continuous data streams analyzed across multiple time horizons. Pattern recognition.
                  Momentum tracking. Structural positioning. Our AI never sleeps.
                </p>
                <div className="mt-auto grid grid-cols-2 gap-4">
                  {[
                    { icon: LineChart, label: 'Real-time Analysis' },
                    { icon: Layers, label: 'Multi-Timeframe' },
                    { icon: Activity, label: 'Pattern Detection' },
                    { icon: Clock, label: '24/7 Monitoring' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/30 dark:border-white/10">
                      <item.icon className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Expert Validation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GlassCard className="h-full p-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-6 shadow-[0_10px_40px_rgba(147,51,234,0.3)]">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Expert Validation
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Human traders filter noise, identify edge cases, and apply judgment. Every signal passes review.
              </p>
            </GlassCard>
          </motion.div>

          {/* Precise Insight */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <GlassCard className="h-full p-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mb-6 shadow-[0_10px_40px_rgba(251,146,60,0.3)]">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Precise Insight
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Structured frameworks for decision-making. Not predictions—clarity.
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// SECTION 4: SPATIAL INTELLIGENCE
// ============================================================================
const SpatialSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-32 md:py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 dark:from-[#030712] dark:via-[#0a1628] dark:to-[#0c2744]" />
      <ParticleBackground preset="network" className="z-[1] opacity-30" />

      {/* Glowing orbs */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[120px] z-[2]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] z-[2]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <Badge icon={Eye}>Core Technology</Badge>

          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mt-10 mb-8 leading-[1.1] tracking-tight">
            Most traders see
            <br />
            <span className="text-gray-400">price movement.</span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 bg-clip-text text-transparent">
              Tokabi sees position.
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Spatial intelligence means understanding markets across structure, time, momentum,
            and participant behavior—<span className="text-cyan-400 font-semibold">simultaneously</span>.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-16">
            {[
              { icon: BarChart3, title: 'Structure Analysis', desc: 'Understanding where you are in the broader market context' },
              { icon: TrendingUp, title: 'Momentum Tracking', desc: 'Real-time assessment of directional strength' },
              { icon: Users, title: 'Participant Behavior', desc: 'Reading institutional footprints and positioning' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              >
                <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-cyan-400/30 transition-all duration-500">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-cyan-600/20 flex items-center justify-center mb-6 border border-cyan-400/20">
                    <item.icon className="w-7 h-7 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-16"
          >
            <Link
              to="/spatial-intelligence"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white font-semibold text-lg hover:bg-white/20 hover:border-cyan-400/40 transition-all duration-300 group"
            >
              Learn about spatial intelligence
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================================================
// SECTION 5: PROTECTION
// ============================================================================
const ProtectionSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const protections = [
    { icon: AlertTriangle, text: 'Emotional entries', color: 'from-red-400 to-red-600' },
    { icon: Activity, text: 'Overtrading', color: 'from-orange-400 to-orange-600' },
    { icon: XCircle, text: 'Missed exits', color: 'from-yellow-400 to-yellow-600' },
    { icon: TrendingUp, text: 'Capital erosion', color: 'from-pink-400 to-pink-600' },
    { icon: Zap, text: 'Decision fatigue', color: 'from-purple-400 to-purple-600' },
  ];

  return (
    <section ref={ref} className="relative py-32 md:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white dark:from-dark-elevated dark:to-dark-base" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(14,116,144,0.08),transparent)] dark:bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(14,116,144,0.1),transparent)]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge icon={Shield}>Protection System</Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mt-8 tracking-tight">
            What Tokabi protects you from
          </h2>
        </motion.div>

        <div className="grid gap-4 mb-16">
          {protections.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GlassCard className="flex items-center gap-6 p-6 group" hover>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">{item.text}</span>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <AnimatedBorderCard className="inline-block">
            <div className="p-10 md:p-12">
              <p className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                A system of{' '}
                <span className="bg-gradient-to-r from-cyan-500 to-cyan-400 bg-clip-text text-transparent">restraint</span>
                {' '}as much as intelligence.
              </p>
            </div>
          </AnimatedBorderCard>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================================================
// SECTION 6: WHO IT'S FOR
// ============================================================================
const AudienceSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-32 md:py-40 bg-white dark:bg-dark-base">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Built for disciplined market participants who value{' '}
            <span className="font-bold text-slate-900 dark:text-white">process over excitement</span>,{' '}
            <span className="font-bold text-slate-900 dark:text-white">consistency over thrill</span>, and{' '}
            <span className="font-bold text-slate-900 dark:text-white">survival over speculation</span>.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GlassCard className="p-8 h-full" gradient>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">This is for you if:</h3>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                You measure success by consistency rather than adrenaline. You understand that the best trade
                is often no trade. <span className="font-semibold text-green-600 dark:text-green-400">Tokabi will serve you.</span>
              </p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative h-full p-8 rounded-3xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200/50 dark:border-red-500/20 backdrop-blur-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg">
                  <XCircle className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">This is NOT for you if:</h3>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                You treat trading as speculation rather than strategy. You chase excitement over edge.
                <span className="font-semibold text-red-600 dark:text-red-400"> Tokabi will frustrate you.</span>
              </p>
            </div>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white text-center mt-16"
        >
          We designed it that way.
        </motion.p>
      </div>
    </section>
  );
};

// ============================================================================
// SECTION 7: PHILOSOPHY
// ============================================================================
const PhilosophySection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-32 md:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white dark:from-dark-elevated dark:to-dark-base" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400">
            Tokabi does not promise guaranteed outcomes.
          </p>
          <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400">
            No platform can. Markets remain uncertain.
          </p>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300">
            What Tokabi <span className="font-bold text-slate-900 dark:text-white">does</span> guarantee:
            improved decision quality and risk discipline.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-8"
          >
            <AnimatedBorderCard>
              <div className="p-10 md:p-14">
                <p className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                  Markets remain uncertain.
                  <br />
                  <span className="bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                    Your process does not have to be.
                  </span>
                </p>
              </div>
            </AnimatedBorderCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================================================
// SECTION 8: FINAL CTA
// ============================================================================
const FinalCTASection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-32 md:py-40 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 via-cyan-700 to-cyan-800 dark:from-[#0c2744] dark:via-[#0a1628] dark:to-[#030712]" />

      {/* Particles */}
      <ParticleBackground preset="floating" className="z-[1] opacity-40" />

      {/* Glowing orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-400/30 dark:bg-cyan-400/10 rounded-full blur-[150px] z-[2]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/30 dark:bg-cyan-500/10 rounded-full blur-[120px] z-[2]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-8 tracking-tight">
            Ready to enforce
            <br />
            <span className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
              discipline?
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-cyan-100 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            See how Tokabi structures the next trade decision—before emotion enters the equation.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link to="/pricing">
              <motion.button
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="group relative px-10 py-5 bg-white dark:bg-gradient-to-r dark:from-cyan-500 dark:to-cyan-600 text-cyan-700 dark:text-white font-bold text-lg rounded-2xl shadow-[0_10px_50px_rgba(255,255,255,0.3)] dark:shadow-[0_10px_50px_rgba(14,116,144,0.4)] hover:shadow-[0_20px_60px_rgba(255,255,255,0.4)] dark:hover:shadow-[0_20px_60px_rgba(14,116,144,0.5)] transition-all duration-500 flex items-center gap-3 overflow-hidden"
              >
                <span className="relative z-10">Start with Alpha — $19.99/month</span>
                <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-100 to-transparent dark:via-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </motion.button>
            </Link>

            <Link to="/demo">
              <motion.button
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="group px-10 py-5 bg-white/10 backdrop-blur-2xl text-white font-bold text-lg rounded-2xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all duration-500 flex items-center gap-3"
              >
                Watch live analysis
                <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================================================
// MAIN LANDING PAGE
// ============================================================================
const LandingPage: React.FC = () => {
  return (
    <div className="bg-white dark:bg-dark-base min-h-screen transition-colors duration-300 overflow-x-hidden">
      <HeroSection />
      <ProblemSection />
      <BentoSection />
      <SpatialSection />
      <ProtectionSection />
      <AudienceSection />
      <PhilosophySection />
      <FinalCTASection />
    </div>
  );
};

export default LandingPage;
