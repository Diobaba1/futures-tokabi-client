import React, { useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Users, 
  TrendingUp, 
  Shield, 
  Zap, 
  Star,
  Calendar,
  Award,
  Clock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Activity,
  Bell,
  Target,
  BarChart3,
  Lock,
  Play,
  Lightbulb,
  Brain,
  DollarSign,
  ChartLine,
  Users2
} from 'lucide-react';

const CommunityPage = () => {
  const [membersCount, setMembersCount] = useState(12500);
  const [activeTraders, setActiveTraders] = useState(8500);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMembersCount(prev => prev + Math.floor(Math.random() * 10));
      setActiveTraders(prev => prev + Math.floor(Math.random() * 5));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: TrendingUp,
      title: "AI-Powered Signals",
      description: "Advanced machine learning algorithms analyze market patterns, volume spikes, and sentiment data 24/7 to deliver high-probability trading signals with detailed entry/exit points and risk-reward ratios.",
      color: "",
      badge: "85% Win Rate",
      details: [
        "Multi-timeframe analysis",
        "Sentiment integration",
        "Backtested strategies"
      ]
    },
    {
      icon: Shield,
      title: "Risk Protection",
      description: "Real-time risk alerts with automated stop-loss recommendations, position sizing calculators, and volatility-adjusted alerts to protect your capital during volatile market conditions.",
      color: "",
      badge: "Auto-Alerts",
      details: [
        "Volatility-based stops",
        "Drawdown protection",
        "Portfolio monitoring"
      ]
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Signals delivered in under 30 seconds via Telegram and push notifications, giving you the competitive edge in fast-moving crypto markets with low-latency execution guidance.",
      color: "",
      badge: "<30s Delivery",
      details: [
        "Low-latency servers",
        "Push + Telegram",
        "Mobile optimized"
      ]
    },
    {
      icon: Users,
      title: "Elite Network",
      description: "Connect with verified traders making 6-7 figures annually through private channels, live trading sessions, and collaborative strategy development in a supportive environment.",
      color: "",
      badge: "12.5K+ Members",
      details: [
        "Verified traders only",
        "Live sessions weekly",
        "Strategy sharing"
      ]
    }
  ];

  const benefits = [
    {
      icon: Star,
      title: "Premium Trading Strategies",
      description: "Weekly deep-dives into winning strategies from top performers, including case studies, backtesting results, and live implementation walkthroughs.",
      highlight: "NEW"
    },
    {
      icon: Calendar,
      title: "Daily Market Breakdown",
      description: "Morning and evening analysis with key levels, support/resistance zones, economic calendar highlights, and high-probability opportunity identification.",
      highlight: "DAILY"
    },
    {
      icon: Award,
      title: "1-on-1 Mentorship",
      description: "Direct access to professional traders for personalized guidance, portfolio reviews, and custom strategy development tailored to your risk profile.",
      highlight: "VIP"
    },
    {
      icon: Clock,
      title: "Round-the-Clock Support",
      description: "Active community and moderators available 24/7/365, with dedicated help channels for technical issues, strategy questions, and emotional trading support.",
      highlight: "24/7"
    },
    {
      icon: BarChart3,
      title: "Performance Tracking",
      description: "Track your progress with detailed analytics, win/loss ratios, Sharpe ratio calculations, and comparative leaderboards against community averages.",
      highlight: "PRO"
    },
    {
      icon: Bell,
      title: "Priority Notifications",
      description: "Never miss a high-impact trade with instant push alerts, customizable filters, and escalation notifications for major market events.",
      highlight: "FAST"
    },
    {
      icon: Brain,
      title: "AI Insights",
      description: "Exclusive access to our proprietary AI models providing predictive analytics, market regime detection, and anomaly alerts.",
      highlight: "AI"
    },
    {
      icon: DollarSign,
      title: "Profit Sharing Tips",
      description: "Learn from members' live trades with optional profit-sharing discussions and collaborative position management.",
      highlight: "SHARE"
    }
  ];

  const testimonials = [
    {
      name: "Marcus Chen",
      role: "Full-Time Trader",
      message: "Went from breaking even to consistent 6-figure months. The signal accuracy and community support changed everything for me. The mentorship sessions alone were worth the join.",
      profit: "+$142K",
      timeframe: "Last 3 months",
      verified: true
    },
    {
      name: "Sarah Martinez",
      role: "Hedge Fund Analyst",
      message: "I've been in finance for 12 years. This is hands-down the best trading community I've encountered. The AI insights and daily breakdowns keep me ahead of institutional moves. Worth every penny.",
      profit: "+$287K",
      timeframe: "Since joining",
      verified: true
    },
    {
      name: "Alex Thompson",
      role: "Software Engineer",
      message: "Started with $5K as a complete beginner. Now managing a $50K portfolio with confidence. The education here is priceless – from basic TA to advanced risk management.",
      profit: "+$45K",
      timeframe: "6 months",
      verified: true
    },
    {
      name: "Emma Rodriguez",
      role: "Day Trader",
      message: "The risk protection features saved me during the last crash. Combined with the elite network, it's like having a trading desk at my fingertips.",
      profit: "+$89K",
      timeframe: "4 months",
      verified: true
    }
  ];

  const stats = [
    { 
      value: membersCount.toLocaleString() + "+", 
      label: "Active Members", 
      description: "Growing daily with new verified traders",
      trend: "+847 this week"
    },
    { 
      value: "85%", 
      label: "Signal Accuracy", 
      description: "Verified through independent audits",
      trend: "Third-party validated"
    },
    { 
      value: activeTraders.toLocaleString() + "+", 
      label: "Online Now", 
      description: "Trading live across global markets",
      trend: "24/7 global activity"
    },
    { 
      value: "<30s", 
      label: "Signal Speed", 
      description: "End-to-end delivery optimization",
      trend: "Sub-second processing"
    },
    { 
      value: "$2.4M+", 
      label: "Monthly Profits", 
      description: "Community-wide achievements",
      trend: "Aggregated member gains"
    }
  ];

  const socialProof = useMemo(() => [
    "🔥 Sarah just made +$2,847 on BTCUSDT short",
    "✅ Marcus closed +$1,932 on ETHUSDT long with 3:1 RR",
    "💎 Alex hit +$4,156 on SOLUSDT breakout trade",
    "🚀 Emma secured +$3,421 on BNBUSDT during volatility spike",
    "⚡ New member David +$1,234 first trade following AI signal"
  ], []);

  const [currentProof, setCurrentProof] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProof((prev) => (prev + 1) % socialProof.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [socialProof]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const howItWorksSteps = [
    {
      step: "1",
      title: "Join Instantly",
      description: "Click join and get immediate access to all channels and resources. No waiting, no hassle.",
      icon: Users2,
      color: ""
    },
    {
      step: "2",
      title: "Receive Signals",
      description: "Get AI-powered alerts with entry points, targets, and stops delivered straight to your phone.",
      icon: TrendingUp,
      color: ""
    },
    {
      step: "3",
      title: "Connect & Learn",
      description: "Engage with experts, share trades, and refine your skills in live sessions and discussions.",
      icon: Lightbulb,
      color: ""
    },
    {
      step: "4",
      title: "Scale Profits",
      description: "Track performance, adjust strategies, and grow your portfolio with community-backed insights.",
      icon: ChartLine,
      color: ""
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster=""
        >
          <source src="" type="video/mp4" />
          {/* Fallback gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-cyan-900/20 to-gray-900"></div>
        </video>
        {/* Video overlay */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]"></div>
      </div>

      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-900/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Subtle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(251,191,36,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Social Proof Ticker */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProof}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-700 font-medium backdrop-blur-sm tracking-wide"
            >
              <Activity className="w-4 h-4 animate-pulse" />
              {socialProof[currentProof]}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          style={{ opacity, scale }}
          className="text-center mb-16 sm:mb-24"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500/15 to-cyan-900/15 border border-cyan-500/25 text-cyan-700 font-medium mb-8 backdrop-blur-xl shadow-2xl shadow-cyan-500/10 tracking-wider"
          >
            <div className="relative">
              <div className="w-2 h-2 bg-cyan-700 rounded-full animate-ping absolute"></div>
              <div className="w-2 h-2 bg-cyan-700 rounded-full"></div>
            </div>
            <Sparkles className="w-4 h-4" />
            JOIN 12,500+ PROFESSIONAL TRADERS
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-light mb-6 leading-tigh text-slate-600 tracking-tight"
          >
            Elevate Your Trading With
            <motion.span 
              className="block bg-gradient-to-r from-cyan-700 via-cyan-700 to-cyan-700 bg-clip-text text-transparent font-normal"
              animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              Our Professional Network
            </motion.span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light tracking-wide"
          >
            Transition from solitary trading to collaborative success. Join thousands of professional traders receiving 
            <span className="text-cyan-700 font-normal"> institutional-grade signals</span>, 
            <span className="text-cyan-800 font-normal"> expert market analysis</span>, and 
            <span className="text-cyan-900 font-normal"> comprehensive support systems</span>.
          </motion.p>

          {/* Stats Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 max-w-6xl mx-auto mb-12"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/15 to-cyan-900/15 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative p-6 bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/30 group-hover:border-cyan-500/30 transition-all duration-300">
                  <div className="text-3xl font-light text-transparent bg-clip-text bg-gradient-to-br from-cyan-700 to-cyan-700 mb-2 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-gray-200 font-medium text-sm mb-1 tracking-wide">{stat.label}</div>
                  <div className="text-gray-400 text-xs mb-2 font-light tracking-wide">{stat.description}</div>
                  <div className="text-cyan-700 text-xs font-medium flex items-center justify-center gap-1 tracking-wide">
                    <TrendingUp className="w-3 h-3" />
                    {stat.trend}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <a
              href="https://t.me/yourcommunity"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-full sm:w-auto"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-cyan-900 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative px-8 sm:px-12 py-5 bg-gradient-to-r from-cyan-500 to-cyan-900 rounded-2xl font-medium text-lg sm:text-xl text-white shadow-2xl backdrop-blur-sm"
              >
                <span className="flex items-center justify-center gap-3 tracking-wide">
                  <MessageCircle className="w-6 h-6" />
                  Join Professional Network
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.div>
            </a>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-8 py-5 bg-gray-800/50 border-2 border-gray-600/30 rounded-2xl font-medium text-lg text-white hover:border-cyan-500/30 hover:bg-gray-800/60 transition-all duration-300 backdrop-blur-xl tracking-wide"
            >
              <Play className="w-5 h-5 inline mr-2" />
              View Platform Overview
            </motion.button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 text-gray-400 text-sm flex items-center justify-center gap-2 flex-wrap font-light tracking-wide"
          >
            <CheckCircle2 className="w-4 h-4 text-cyan-700" />
            <span>Complimentary access</span>
            <span className="text-gray-500">•</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-700" />
            <span>No commitment required</span>
            <span className="text-gray-500">•</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-700" />
            <span>Immediate onboarding</span>
          </motion.p>
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-5xl font-light text-white mb-4 tracking-tight">
                Operational Framework
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light tracking-wide leading-relaxed">
                Streamlined four-phase methodology designed for immediate integration and sustainable growth
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="absolute left-1/2 top-1/4 w-full h-px bg-gradient-to-r from-cyan-500/15 to-transparent transform -translate-x-1/2"></div>
            {howItWorksSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-cyan-500/30 to-cyan-900/30 rounded-3xl blur opacity-0 group-hover:opacity-30 transition-opacity"></div>
                  <div className="relative h-full bg-gray-800/40 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/30 group-hover:border-cyan-500/30 transition-all duration-300 text-center">
                    <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${step.color} shadow-2xl mb-4 group-hover:scale-105 transition-transform duration-300 mx-auto backdrop-blur-sm`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-light text-cyan-700 mb-2 tracking-tight">{step.step}</div>
                    <h3 className="text-xl font-normal text-white mb-3 tracking-wide">{step.title}</h3>
                    <p className="text-gray-300 leading-relaxed text-sm mb-4 font-light tracking-wide">{step.description}</p>
                    <ul className="text-xs text-gray-400 space-y-1 font-light">
                      {features[0].details.slice(0,2).map((detail, dIndex) => (
                        <li key={dIndex} className="flex items-center gap-1 justify-center">
                          <CheckCircle2 className="w-3 h-3 text-cyan-700" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-5xl font-light text-white mb-4 tracking-tight">
                Comprehensive Trading Infrastructure
                <span className="block bg-gradient-to-r from-cyan-700 to-cyan-700 bg-clip-text text-transparent font-normal mt-2">
                  For Consistent Performance
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light tracking-wide leading-relaxed">
                Institutional-grade tools and analytical frameworks, democratized for individual traders seeking professional outcomes
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-cyan-500/30 to-cyan-900/30 rounded-3xl blur opacity-0 group-hover:opacity-30 transition-opacity"></div>
                  <div className="relative h-full bg-gray-800/40 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/30 group-hover:border-cyan-500/30 transition-all duration-300">
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-cyan-500/15 border border-cyan-500/25 rounded-full text-cyan-700 text-xs font-medium tracking-wide">
                        {feature.badge}
                      </span>
                    </div>
                    
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} shadow-2xl mb-6 group-hover:scale-105 transition-transform duration-300 backdrop-blur-sm`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-normal text-white mb-3 tracking-wide">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed text-sm mb-4 font-light tracking-wide">{feature.description}</p>
                    <ul className="text-xs text-gray-400 space-y-1 font-light">
                      {feature.details.map((detail, dIndex) => (
                        <li key={dIndex} className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-cyan-700" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="relative overflow-hidden bg-gradient-to-br from-cyan-500/8 via-cyan-900/4 to-cyan-500/8 rounded-3xl p-8 sm:p-12 border border-cyan-500/15 backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
            
            <div className="relative">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-light text-white mb-4 tracking-tight">
                  Comprehensive Member Benefits
                </h2>
                <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto font-light tracking-wide leading-relaxed">
                  Access the complete suite of professional trading tools, educational resources, and community support systems
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {benefits.slice(0, 4).map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.03 }}
                      className="relative group"
                    >
                      <div className="h-full bg-gray-900/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30 group-hover:border-cyan-500/30 transition-all duration-300">
                        <div className="flex items-start gap-4 mb-3">
                          <div className="flex-shrink-0 p-3 bg-cyan-500/15 rounded-xl group-hover:bg-cyan-500/20 transition-colors backdrop-blur-sm">
                            <Icon className="w-5 h-5 text-cyan-700" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-normal text-white tracking-wide">{benefit.title}</h3>
                              <span className="px-2 py-0.5 bg-cyan-500/15 border border-cyan-500/25 rounded text-cyan-700 text-xs font-medium">
                                {benefit.highlight}
                              </span>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed font-light tracking-wide">{benefit.description}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 pt-8 border-t border-gray-700/30">
                {benefits.slice(4).map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <motion.div
                      key={index + 4}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: (index + 4) * 0.05 }}
                      whileHover={{ scale: 1.03 }}
                      className="relative group"
                    >
                      <div className="h-full bg-gray-900/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30 group-hover:border-cyan-500/30 transition-all duration-300">
                        <div className="flex items-start gap-4 mb-3">
                          <div className="flex-shrink-0 p-3 bg-cyan-500/15 rounded-xl group-hover:bg-cyan-500/20 transition-colors backdrop-blur-sm">
                            <Icon className="w-5 h-5 text-cyan-700" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-normal text-white tracking-wide">{benefit.title}</h3>
                              <span className="px-2 py-0.5 bg-cyan-500/15 border border-cyan-500/25 rounded text-cyan-700 text-xs font-medium">
                                {benefit.highlight}
                              </span>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed font-light tracking-wide">{benefit.description}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-light text-white mb-4 tracking-tight">
              Verified Member Experiences
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto font-light tracking-wide leading-relaxed">
              Professional traders sharing their journey toward consistent profitability and sustainable growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -5 }}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-br from-cyan-500/20 to-cyan-900/20 rounded-3xl blur opacity-0 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative h-full bg-gray-800/40 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/30 group-hover:border-cyan-500/30 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-900 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm">
                        <span className="text-white font-medium text-xl">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                      {testimonial.verified && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-gray-800/50">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-normal text-white text-lg tracking-wide">{testimonial.name}</h3>
                      <p className="text-gray-400 text-sm font-light tracking-wide">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-6 leading-relaxed italic font-light tracking-wide">"{testimonial.message}"</p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-gray-700/30">
                    <div>
                      <div className="text-2xl font-light text-transparent bg-clip-text bg-gradient-to-r from-cyan-700 to-cyan-700 tracking-tight">
                        {testimonial.profit}
                      </div>
                      <div className="text-gray-400 text-xs mt-1 font-light tracking-wide">{testimonial.timeframe}</div>
                    </div>
                    <div className="flex text-cyan-900">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="relative overflow-hidden bg-gradient-to-br from-cyan-500/8 via-cyan-900/4 to-cyan-500/8 rounded-3xl p-12 sm:p-16 border border-cyan-500/15 backdrop-blur-xl">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.08),transparent_50%)]"></div>
            
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block mb-6"
              >
                <Sparkles className="w-16 h-16 text-cyan-700" />
              </motion.div>
              
              <h2 className="text-3xl sm:text-5xl font-light text-white mb-6 tracking-tight">
                Begin Your Professional Journey
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-light tracking-wide leading-relaxed">
                Join our network of <span className="text-cyan-700 font-normal">{membersCount.toLocaleString()}+</span> professional traders 
                achieving consistent results. Access institutional-grade tools within a supportive community framework.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-10">
                <a
                  href="https://t.me/yourcommunity"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-full sm:w-auto"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-cyan-900 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative px-12 py-6 bg-gradient-to-r from-cyan-500 to-cyan-900 rounded-2xl font-medium text-xl text-white shadow-2xl backdrop-blur-sm"
                  >
                    <span className="flex items-center justify-center gap-3 tracking-wide">
                      <MessageCircle className="w-6 h-6" />
                      Join Professional Network
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </span>
                  </motion.div>
                </a>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
                {[
                  { icon: Target, text: "AI Signals" },
                  { icon: Shield, text: "Risk Management" },
                  { icon: Users, text: "Expert Community" },
                  { icon: Lock, text: "Complimentary Access" }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col items-center gap-2 text-gray-300"
                  >
                    <item.icon className="w-5 h-5 text-cyan-700 animate-bounce" />
                    <span className="text-sm font-normal tracking-wide">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CommunityPage;