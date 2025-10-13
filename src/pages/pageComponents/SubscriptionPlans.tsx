import React from 'react';

const SubscriptionPlans = () => {
  const plans = [
    {
      name: "Basic",
      price: "$50",
      period: "month",
      description: "Perfect for beginners starting their trading journey",
      minDeposit: "$200",
      maxDeposit: "$999",
      features: [
        "2% hourly profit",
        "Basic analytics dashboard",
        "Email support",
        "Mobile app access",
        "24/7 trading"
      ],
      popular: false
    },
    {
      name: "Advanced",
      price: "$200",
      period: "month",
      description: "For serious traders looking to maximize returns",
      minDeposit: "$200",
      maxDeposit: "$10,000",
      features: [
        "2% hourly profit",
        "Advanced analytics & reports",
        "Priority support",
        "Custom trading strategies",
        "Risk management tools",
        "Higher profit potential"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "$2000",
      period: "month",
      description: "For professional traders and large portfolios",
      minDeposit: "$200",
      maxDeposit: "Unlimited",
      features: [
        "2% hourly profit",
        "Premium analytics dashboard",
        "24/7 dedicated support",
        "Custom trading algorithms",
        "API access",
        "White-label solutions",
        "Personal account manager"
      ],
      popular: false
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {plans.map((plan, index) => (
        <div 
          key={index} 
          className={`relative rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
            plan.popular 
              ? 'bg-gradient-to-b from-gray-900 to-gray-800 border-2 border-yellow-500 shadow-2xl shadow-yellow-500/20 transform -translate-y-2' 
              : 'bg-gray-900 border border-gray-700 hover:border-yellow-400/50'
          }`}
        >
          {plan.popular && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-6 py-2 rounded-full text-sm font-bold shadow-lg">
              MOST POPULAR
            </div>
          )}
          
          {/* Plan Header */}
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
            <div className="mb-2">
              <span className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                {plan.price}
              </span>
              <span className="text-gray-400">/{plan.period}</span>
            </div>
            <p className="text-gray-400 text-sm">{plan.description}</p>
          </div>
          
          {/* Deposit Info */}
          <div className="mb-6 p-4 bg-gray-800 rounded-xl border border-gray-700">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-400">Min. Deposit:</span>
              <span className="font-bold text-emerald-400">{plan.minDeposit}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Max. Deposit:</span>
              <span className="font-bold text-emerald-400">{plan.maxDeposit}</span>
            </div>
          </div>
          
          {/* Features List */}
          <ul className="mb-8 space-y-3">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>
          
          {/* CTA Button */}
          <button className={`w-full py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
            plan.popular
              ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-600 hover:to-yellow-700 hover:shadow-lg hover:shadow-yellow-500/40'
              : 'bg-gradient-to-r from-gray-700 to-gray-800 text-white border border-yellow-500/30 hover:bg-gradient-to-r hover:from-yellow-500/10 hover:to-yellow-600/10 hover:border-yellow-500'
          }`}>
            Start Trading Now
          </button>

          {/* Additional Badge for Popular Plan */}
          {plan.popular && (
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-black px-3 py-1 rounded-full text-xs font-semibold">
              Best Value
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SubscriptionPlans;