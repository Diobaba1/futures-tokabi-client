// src/pages/Home/HomePage.tsx
import React from 'react';
import HeroSection from './HomeItems/HeroSection';
import FeaturesSection from './HomeItems/FeaturesSection';
import HowItWorks from './HomeItems/HowItWorks';
import SecuritySection from './HomeItems/SecuritySection';
import PricingSection from './HomeItems/PricingSection';
import CTASection from './HomeItems/CTASection';
import { PricingPage } from '../billing2';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <HeroSection />
      <FeaturesSection />
      <div className="#pricing">
      <PricingPage />
      </div>
      <HowItWorks />
      <SecuritySection />
      
      <CTASection />
    </div>
  );
};

export default HomePage;