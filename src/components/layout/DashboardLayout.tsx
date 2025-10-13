// src/components/Layout/DashboardLayout.tsx
import React, { useState } from 'react';
import DashboardMenu from './Authlayout/DashboardMenu';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleToggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <DashboardMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)}
        onOpen={() => setIsMenuOpen(true)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      
      {/* Main content area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-80'
      }`}>
        {/* Enhanced Mobile header */}
        <div className="lg:hidden sticky top-0 z-20 flex items-center justify-between p-4 border-b border-gray-800/50 bg-gray-900/95 backdrop-blur-sm">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 rounded-xl bg-gray-800/80 border border-gray-700/50 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200 shadow-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-white text-sm font-semibold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                TOKABI
              </div>
              <div className="text-gray-400 text-xs">Trading Dashboard</div>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Desktop Header with Collapse Toggle */}
        <div className="hidden lg:flex sticky top-0 z-20 items-center justify-between p-4 lg:p-6 border-b border-gray-800/50 bg-gray-900/95 backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleToggleCollapse}
              className="p-2 rounded-xl bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
              title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg 
                className={`w-5 h-5 transform transition-transform duration-300 ${
                  isSidebarCollapsed ? 'rotate-180' : ''
                }`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">
                Trading Dashboard
              </h1>
              <p className="text-gray-400 mt-1">
                Monitor your AI trading performance and analytics
              </p>
            </div>
          </div>
          
          {/* Add quick action buttons or filters here */}
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-300 hover:text-white hover:border-gray-600/50 transition-all duration-200">
              Refresh Data
            </button>
            <button className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-xl hover:bg-yellow-500/20 transition-all duration-200">
              New Strategy
            </button>
          </div>
        </div>

        {/* Enhanced Page content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6 max-w-7xl mx-auto w-full">
            {/* Optional: Add a breadcrumb or page header here for mobile */}
            <div className="lg:hidden mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Trading Dashboard
                </h1>
                <p className="text-gray-400 mt-2">
                  Monitor your AI trading performance and analytics
                </p>
              </div>
            </div>
            
            {/* Children content with enhanced styling */}
            <div className="bg-gray-800/20 border border-gray-700/30 rounded-2xl backdrop-blur-sm">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;