// src/components/home/HomeItems/SecuritySection.tsx
import React from 'react';

const SecuritySection: React.FC = () => {
  const securityFeatures = [
    {
      title: 'AES-256 Encryption',
      description: 'Military-grade encryption for all API keys and sensitive data.',
      icon: '🔐'
    },
    {
      title: 'Two-Factor Authentication',
      description: 'Mandatory 2FA for all trading actions and withdrawals.',
      icon: '📱'
    },
    {
      title: 'Risk Management',
      description: 'Max 10% position size, auto cool-down after 3 consecutive losses.',
      icon: '⚖️'
    },
    {
      title: 'Secure Infrastructure',
      description: 'Bank-level security with regular penetration testing.',
      icon: '🏦'
    },
    {
      title: 'Funds Protection',
      description: 'We never hold your funds. All capital remains in your exchange account.',
      icon: '💎'
    },
    {
      title: '24/7 Monitoring',
      description: 'Continuous system monitoring and anomaly detection.',
      icon: '👁️'
    }
  ];

  return (
    <section id="security" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Enterprise-Grade
            <span className="block bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Security & Protection
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Your security is our top priority. We implement multiple layers of protection 
            to ensure your funds and data are always safe.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {securityFeatures.map((feature, index) => (
            <div 
              key={index}
              className="p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-green-500/30 transition-all duration-300"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 px-6 py-4 bg-green-500/10 border border-green-500/20 rounded-2xl">
            <div className="text-2xl">🛡️</div>
            <div className="text-left">
              <div className="font-semibold text-green-400">Your Funds Are Always Safe</div>
              <div className="text-sm text-gray-400">We never have access to withdraw your funds</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;