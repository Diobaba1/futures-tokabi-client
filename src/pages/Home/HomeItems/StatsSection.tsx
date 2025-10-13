// src/components/home/HomeItems/StatsSection.tsx
import React from 'react';

const StatsSection: React.FC = () => {
  const stats = [
    { number: '85%', label: 'Average Accuracy Rate', suffix: '+' },
    { number: '150', label: 'Millisecond Execution', prefix: '<' },
    { number: '10K', label: 'Active Traders', suffix: '+' },
    { number: '99.8', label: 'Platform Uptime', suffix: '%' }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                {stat.prefix && <span className="text-blue-300">{stat.prefix}</span>}
                {stat.number}
                {stat.suffix && <span className="text-blue-300">{stat.suffix}</span>}
              </div>
              <div className="text-gray-300 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;