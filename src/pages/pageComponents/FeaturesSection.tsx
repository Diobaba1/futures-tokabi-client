import React, { useState } from 'react';
import { Shield, Brain, Zap, Rocket, TrendingUp, Clock, Target, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';

const FeaturesSection = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      category: "Risk Management",
      icon: Shield,
      title: "Advanced Risk Protection",
      description: "Professional-grade risk management systems to protect your capital",
      features: [
        "Auto-stop after 3 consecutive losses",
        "Dynamic position sizing",
        "Maximum drawdown protection",
        "Real-time risk monitoring",
        "Circuit breaker mechanisms"
      ],
      gradient: "",
      color: "text-cyan-700",
      bgGlow: "bg-cyan-800/10"
    },
    {
      category: "AI Analysis Engine",
      icon: Brain,
      title: "Multi-Dimensional Market Analysis",
      description: "Comprehensive market analysis using multiple data sources and methodologies",
      features: [
        "Fundamental analysis integration",
        "Technical indicator processing",
        "Real-time data science models",
        "Sentiment analysis algorithms",
        "Pattern recognition systems"
      ],
      gradient: "",
      color: "text-blue-400",
      bgGlow: "bg-blue-500/10"
    },
    {
      category: "Trading Systems",
      icon: Zap,
      title: "4 Independent AI Systems",
      description: "Multiple specialized AI systems working in consensus for optimal decisions",
      features: [
        "4 independent trading models",
        "23+ technical indicators",
        "Real-time historical data analysis",
        "Consensus-based signal generation",
        "Automated execution system"
      ],
      gradient: "",
      color: "text-green-400",
      bgGlow: "bg-green-500/10"
    },
    {
      category: "Execution Engine",
      icon: Rocket,
      title: "24/7 Automated Trading",
      description: "Non-stop trading execution with precision and speed",
      features: [
        "24/7 continuous operation",
        "Sub-50ms execution speed",
        "Automated SL/TP management",
        "Multi-exchange compatibility",
        "Real-time performance monitoring"
      ],
      gradient: "",
      color: "text-purple-400",
      bgGlow: "bg-purple-500/10"
    }
  ];

  const tradingProcess = [
    {
      step: "01",
      title: "Market Analysis",
      description: "All 4 AI systems analyze markets using 23+ indicators and real-time data",
      details: "Fundamental + Technical + Data Science analysis running simultaneously",
      icon: TrendingUp
    },
    {
      step: "02",
      title: "Consensus Decision",
      description: "Highest voted signal is automatically triggered for execution",
      details: "Majority consensus ensures highest probability trades",
      icon: CheckCircle2
    },
    {
      step: "03",
      title: "Signal Generation",
      description: "Each system votes LONG or SHORT based on its analysis",
      details: "Independent decision making with weighted confidence scores",
      icon: Target
    },
    {
      step: "04",
      title: "Risk-Managed Execution",
      description: "Trades executed with tight SL/TP and risk parameters",
      details: "Auto-stop loss, take profit, and position sizing applied",
      icon: Shield
    },
    {
      step: "05",
      title: "Continuous Monitoring",
      description: "24/7 performance tracking and risk management",
      details: "Real-time adjustments and protective measures",
      icon: Clock
    }
  ];

  const stats = [
    { value: "4", label: "AI Systems", description: "Working in consensus", gradient: "from-purple-500 to-pink-500" },
    { value: "23+", label: "Indicators", description: "Technical & fundamental", gradient: "from-blue-500 to-cyan-500" },
    { value: "24/7", label: "Operation", description: "Non-stop trading", gradient: "from-green-500 to-emerald-500" },
    { value: "<50ms", label: "Execution", description: "Lightning fast", gradient: "from-yellow-500 to-orange-500" },
    { value: "3-Stop", label: "Risk Rule", description: "Auto-stop protection", gradient: "from-cyan-800 to-orange-500" },
    { value: "87.3%", label: "Accuracy", description: "Verified performance", gradient: "from-purple-400 to-blue-400" }
  ];

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-data-screen-while-numbers-float-43259-large.mp4" type="video/mp4" />
          {/* Fallback gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900"></div>
        </video>
        {/* Video overlay */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]"></div>
      </div>

      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-purple-950/30 to-black/90"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '1s'}}></div>
      
      {/* Subtle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Sophisticated Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600/15 to-blue-600/15 border border-purple-500/20 backdrop-blur-sm mb-8">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-500"></span>
            </div>
            <span className="text-sm font-medium bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent tracking-wider">
              INSTITUTIONAL-GRADE TECHNOLOGY
            </span>
          </div>
          
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-light mb-8 leading-tight tracking-tight">
            <span className="text-white font-light">Advanced AI</span>
            <br />
            <span className="bg-gradient-to-r from-purple-200 via-cyan-200 to-blue-200 bg-clip-text text-transparent font-normal">
              Trading Systems
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light tracking-wide">
            Sophisticated algorithmic trading infrastructure combining multi-dimensional analysis, 
            enterprise-grade risk protocols, and continuous automation for institutional-level performance.
          </p>
        </div>

        {/* Refined Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 mb-24">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/15 to-blue-600/15 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative text-center p-6 bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/15 group-hover:border-purple-500/30 transition-all duration-300 h-full">
                <div className={`text-3xl font-light bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-3 tracking-tight`}>
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-white mb-2 tracking-wide">{stat.label}</div>
                <div className="text-xs text-gray-400 font-light tracking-wide">{stat.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Sophisticated Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                {/* Glow Effect */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-3xl opacity-0 group-hover:opacity-15 blur-xl transition-all duration-500`}></div>
                
                <div className="relative h-full bg-black/30 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/15 group-hover:border-purple-500/30 transition-all duration-500">
                  {/* Animated Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-3 rounded-3xl transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start gap-6 mb-8">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-2xl group-hover:scale-105 transition-transform duration-500 backdrop-blur-sm`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className={`text-xs font-medium ${feature.color} mb-3 uppercase tracking-widest font-light`}>
                          {feature.category}
                        </div>
                        <h3 className="text-2xl font-normal text-white mb-4 tracking-wide">{feature.title}</h3>
                        <p className="text-gray-300 leading-relaxed font-light tracking-wide">{feature.description}</p>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-4">
                      {feature.features.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex items-start gap-4 group/item"
                        >
                          <div className={`mt-2 w-1.5 h-1.5 rounded-full bg-gradient-to-r ${feature.gradient} shadow-lg flex-shrink-0`}></div>
                          <span className="text-gray-300 group-hover/item:text-white transition-colors leading-relaxed font-light tracking-wide text-sm">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Corner Accent */}
                  <div className={`absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl ${feature.gradient} opacity-3 rounded-tl-full`}></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Refined Trading Process */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h3 className="text-4xl sm:text-5xl font-light text-white mb-6 tracking-tight">
              Operational Framework
            </h3>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed tracking-wide">
              A systematic five-phase methodology ensuring precision execution with comprehensive risk oversight
            </p>
          </div>

          <div className="relative">
            {/* Desktop Connecting Line */}
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5">
              <div className="h-full bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              {tradingProcess.map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <div
                    key={index}
                    className="relative group"
                  >
                    {/* Step Number Badge */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity"></div>
                        <div className="relative w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center border-4 border-black/50 shadow-2xl group-hover:scale-105 transition-transform duration-300 backdrop-blur-sm">
                          <span className="text-white font-medium text-sm tracking-tight">{step.step}</span>
                        </div>
                      </div>
                    </div>

                    {/* Step Card */}
                    <div className="relative bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/15 group-hover:border-purple-500/30 transition-all duration-300 h-full pt-12">
                      <div className="flex justify-center mb-5">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600/15 to-blue-600/15 group-hover:scale-105 transition-transform backdrop-blur-sm">
                          <StepIcon className="w-6 h-6 text-purple-300" />
                        </div>
                      </div>
                      <h4 className="text-lg font-normal text-white mb-4 text-center tracking-wide">{step.title}</h4>
                      <p className="text-gray-300 mb-4 leading-relaxed text-sm text-center font-light tracking-wide">{step.description}</p>
                      <div className="text-xs text-gray-400 bg-purple-500/3 rounded-lg p-3 border border-purple-500/10 text-center font-light leading-snug">
                        {step.details}
                      </div>
                    </div>

                    {/* Arrow */}
                    {index < tradingProcess.length - 1 && (
                      <div className="hidden lg:flex absolute top-24 -right-4 z-10">
                        <ChevronRight className="w-6 h-6 text-purple-500/30" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sophisticated Risk Management Section */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/15 to-orange-600/15 rounded-3xl blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
          <div className="relative bg-gradient-to-br from-cyan-800/8 via-orange-500/4 to-transparent border border-cyan-800/20 rounded-3xl p-10 backdrop-blur-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-cyan-800/15 border border-cyan-800/20 text-cyan-900 text-sm font-medium mb-8 tracking-wide">
                  <AlertCircle className="w-4 h-4" />
                  ENTERPRISE RISK PROTOCOLS
                </div>
                <h3 className="text-4xl font-light text-white mb-6 tracking-tight">
                  Comprehensive Risk Mitigation
                </h3>
                <p className="text-lg text-gray-300 mb-8 leading-relaxed font-light tracking-wide">
                  Our algorithmic framework incorporates multi-layered protection mechanisms, 
                  automatically suspending operations after three consecutive losses to preserve capital. 
                  Integrated with dynamic position management and real-time exposure monitoring.
                </p>
                <div className="grid grid-cols-2 gap-5">
                  {['Auto Stop-Loss', '3-Loss Protection', 'Position Sizing', 'Drawdown Control'].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full shadow-lg shadow-green-400/30"></div>
                      <span className="text-white font-normal text-sm tracking-wide">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/15 to-orange-600/15 rounded-2xl blur-2xl"></div>
                <div className="relative bg-black/30 backdrop-blur-xl rounded-2xl p-10 border border-cyan-800/20 text-center">
                  <div className="inline-flex p-6 rounded-2xl bg-gradient-to-br from-cyan-900/15 to-orange-600/15 mb-6 backdrop-blur-sm">
                    <Shield className="w-16 h-16 text-cyan-900" />
                  </div>
                  <h4 className="text-2xl font-normal text-white mb-4 tracking-wide">Capital Preservation</h4>
                  <p className="text-gray-300 leading-relaxed font-light tracking-wide">
                    Multi-tiered safety architecture ensuring investment protection through systematic controls
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;