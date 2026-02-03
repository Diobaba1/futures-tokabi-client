// src/components/Layout/PublicLayout.tsx
import React from 'react';
import LandingHeader from './LandingHeader';
import LandingFooter from './LandingFooter';
import { ThemeProvider } from '../contexts/ThemeContext';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-white dark:bg-dark-base transition-colors duration-300">
        <LandingHeader />
        <main className="flex-1">
          {children}
        </main>
        <LandingFooter />
      </div>
    </ThemeProvider>
  );
};

export default PublicLayout;
