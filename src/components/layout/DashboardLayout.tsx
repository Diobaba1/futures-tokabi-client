// src/components/Layout/DashboardLayout.tsx
import React, { useState } from 'react';
import DashboardMenu from './Authlayout/DashboardMenu';
import { RefreshCw, Plus } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-950 flex">
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
        <div className="lg:hidden sticky top-0 z-20 flex items-center justify-between p-4 border-b border-gray-800/30 bg-gray-950/95 backdrop-blur-xl">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 rounded-lg bg-gray-800/30 border border-gray-700/30 text-gray-300 hover:text-white hover:bg-gray-700/30 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-white text-sm font-light bg-gradient-to-r from-cyan-800 to-blue-400 bg-clip-text text-transparent">
                TOKABI
              </div>
              <div className="text-gray-400 text-xs font-light">Algorithmic Trading</div>
            </div>
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
          </div>
        </div>

        {/* Desktop Header with Collapse Toggle */}
        <div className="hidden lg:flex sticky top-0 z-20 items-center justify-between p-6 border-b border-gray-800/30 bg-gray-950/95 backdrop-blur-xl">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleToggleCollapse}
              className="p-2 rounded-lg bg-gray-800/30 border border-gray-700/30 text-gray-300 hover:text-white hover:bg-gray-700/30 transition-all duration-200"
              title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg 
                className={`w-4 h-4 transform transition-transform duration-300 ${
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
              <h1 className="text-2xl lg:text-3xl font-light text-white">
                Trading Portal
              </h1>
              <p className="text-gray-400 mt-1 text-sm font-light">
                Real-time algorithmic trading performance and analytics
              </p>
            </div>
          </div>
          
          {/* Quick Action Buttons */}
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-gray-800/30 border border-gray-700/30 rounded-lg text-gray-300 hover:text-white hover:border-gray-600/50 transition-all duration-200 flex items-center space-x-2 text-sm font-medium">
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-cyan-900/10 to-blue-500/10 border border-cyan-900/20 text-cyan-800 rounded-lg hover:bg-cyan-900/20 transition-all duration-200 flex items-center space-x-2 text-sm font-medium">
              <Plus className="w-4 h-4" />
              <span>New Model</span>
            </button>
          </div>
        </div>

        {/* Enhanced Page content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6 max-w-7xl mx-auto w-full">
            {/* Optional: Add a breadcrumb or page header here for mobile */}
            <div className="lg:hidden mb-6">
              <div>
                <h1 className="text-2xl font-light text-white">
                  Trading Portal
                </h1>
                <p className="text-gray-400 mt-2 text-sm font-light">
                  Real-time algorithmic trading performance and analytics
                </p>
              </div>
            </div>
            
            
            
            {/* Children content with enhanced styling */}
            <div className="bg-gray-800/20 backdrop-blur-sm border border-gray-700/30 rounded-xl overflow-hidden">
              {children}
            </div>

            {/* System Status Footer */}
            <div className="mt-6 flex items-center justify-between text-xs text-gray-500 font-light">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                  <span>All Systems Operational</span>
                </div>
                <span>•</span>
                <span>Last updated: Just now</span>
              </div>
              <div className="flex items-center space-x-4">
                <span>API Latency: &lt;50ms</span>
                <span>•</span>
                <span>Data Feed: Live</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;