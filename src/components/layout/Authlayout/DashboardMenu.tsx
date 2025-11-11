// src/components/Layout/DashboardMenu.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { 
  BarChart3, 
  FileText, 
  Shield, 
  Key, 
  CreditCard, 
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  TrendingUp,
  Cpu,
  Activity,
  Database,
  User,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface DashboardMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const DashboardMenu: React.FC<DashboardMenuProps> = ({ 
  isOpen, 
  onClose, 
  onOpen,
  isCollapsed,
  onToggleCollapse 
}) => {
  const [activePath, setActivePath] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  const menuItems = [
    {
      category: 'Trading',
      items: [
        { 
          name: 'Dashboard', 
          href: '/dashboard', 
          icon: BarChart3,
          description: 'Portfolio overview & analytics'
        },
        { 
          name: 'Analyze Asset', 
          href: '/dashboard/symbol-analysis', 
          icon: TrendingUp,
          description: 'Analyze any Asset of Choice'
        },
        { 
          name: 'Live Trading', 
          href: '/dashboard/trading', 
          icon: Activity,
          description: 'Real-time execution'
        },
        { 
          name: 'AI Signals', 
          href: '/dashboard/signals', 
          icon: Cpu,
          description: 'Machine learning insights'
        },
      ]
    },
    {
      category: 'Analytics',
      items: [
        { 
          name: 'Reports', 
          href: '/dashboard/reports', 
          icon: FileText,
          description: 'Performance analysis'
        },
        { 
          name: 'Risk Metrics', 
          href: '/dashboard/risk', 
          icon: Shield,
          description: 'Risk management'
        },
        { 
          name: 'Market Data', 
          href: '/dashboard/market-data', 
          icon: Database,
          description: 'Real-time feeds'
        },
      ]
    },
    {
      category: 'Account',
      items: [
        { 
          name: 'API Keys', 
          href: '/dashboard/api-key', 
          icon: Key,
          description: 'Exchange connections'
        },
        { 
          name: 'Notifications', 
          href: '/dashboard/notifications', 
          icon: Bell,
          description: 'Alerts & updates'
        },
        { 
          name: 'Billing', 
          href: '/dashboard/billing', 
          icon: CreditCard,
          description: 'Subscription & billing'
        },
        { 
          name: 'Settings', 
          href: '/dashboard/settings', 
          icon: Settings,
          description: 'Platform configuration'
        },
      ]
    }
  ];

  const quickStats = [
    { label: 'Daily P&L', value: '+2.4%', color: 'text-cyan-800' },
    { label: 'Active Models', value: '3/5', color: 'text-cyan-800' },
    { label: 'Win Rate', value: '87.3%', color: 'text-cyan-800' },
  ];

  const handleConnectExchange = () => {
    navigate("/dashboard/api-key");
  };

  const handleNavigation = (href: string) => {
    navigate(href);
    onClose();
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getUserInitial = () => {
    return user?.full_name?.charAt(0).toUpperCase() || 'U';
  };

  const getUserName = () => {
    return user?.full_name || 'User';
  };

  const getUserEmail = () => {
    return user?.email || 'user@example.com';
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Menu Panel */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className={`fixed top-0 left-0 h-full bg-gray-900/95 backdrop-blur-xl border-r border-gray-800/30 z-50 flex flex-col ${
          isCollapsed ? 'w-20' : 'w-80'
        } transition-all duration-300 ease-in-out`}
      >
        {/* Header */}
        <div className={`p-6 border-b border-gray-800/30 ${isCollapsed ? 'px-4' : ''}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-6`}>
            <Link 
              to="/dashboard" 
              className={`flex items-center group ${isCollapsed ? 'justify-center' : 'space-x-3'}`}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-900 to-cyan-900 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-900/25">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="text-white font-light text-xl">TOKABI</span>
                  <span className="text-cyan-800 text-xs font-medium tracking-wider">DASHBOARD</span>
                </div>
              )}
            </Link>
            
            {!isCollapsed && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-gray-800/30 border border-gray-700/30 text-gray-400 hover:text-white transition-colors duration-200 lg:hidden"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Quick Stats */}
          {!isCollapsed && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              {quickStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-2 bg-gray-800/20 rounded-lg border border-gray-700/30 hover:border-gray-600/50 transition-colors duration-200"
                >
                  <div className={`text-sm font-semibold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-gray-400 font-light">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Connect Exchange Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleConnectExchange}
            className={`w-full py-3 bg-gradient-to-r from-cyan-900 to-cyan-900 text-white font-medium rounded-lg hover:from-cyan-800 hover:to-cyan-800 transition-all duration-300 shadow-lg shadow-cyan-900/25 flex items-center justify-center ${
              isCollapsed ? 'px-2' : 'space-x-2 text-sm'
            }`}
          >
            {isCollapsed ? (
              <Key className="w-4 h-4" />
            ) : (
              <>
                <Key className="w-4 h-4" />
                <span>Connect Exchange</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className={`p-4 space-y-6 ${isCollapsed ? 'px-2' : ''}`}>
            {menuItems.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                {!isCollapsed && (
                  <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-3 px-2 font-light">
                    {category.category}
                  </h3>
                )}
                <div className="space-y-1">
                  {category.items.map((item) => {
                    const isActive = activePath === item.href;
                    const Icon = item.icon;
                    return (
                      <motion.button
                        key={item.name}
                        whileHover={{ x: isCollapsed ? 0 : 4 }}
                        onClick={() => handleNavigation(item.href)}
                        className={`w-full text-left rounded-lg transition-all duration-200 group border ${
                          isCollapsed ? 'p-3 justify-center' : 'p-3'
                        } ${
                          isActive
                            ? 'bg-cyan-900/10 border-cyan-900/30 text-cyan-800 shadow-lg shadow-cyan-900/10'
                            : 'text-gray-300 hover:bg-gray-800/30 hover:text-white border-transparent hover:border-gray-700/30'
                        }`}
                      >
                        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
                          <Icon className={`transition-transform duration-200 group-hover:scale-110 ${
                            isCollapsed ? 'w-4 h-4' : 'w-4 h-4'
                          }`} />
                          {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm">{item.name}</div>
                              <div className={`text-xs transition-colors duration-200 font-light ${
                                isActive ? 'text-cyan-300/70' : 'text-gray-400 group-hover:text-gray-300'
                              }`}>
                                {item.description}
                              </div>
                            </div>
                          )}
                          {!isCollapsed && isActive && (
                            <motion.div
                              layoutId="activeMenuIndicator"
                              className="w-1.5 h-1.5 bg-cyan-800 rounded-full shadow-lg shadow-cyan-800/50"
                            />
                          )}
                        </div>
                        {isCollapsed && isActive && (
                          <motion.div
                            layoutId="activeMenuIndicatorCollapsed"
                            className="w-1 h-1 bg-cyan-800 rounded-full mx-auto mt-2 shadow-lg shadow-cyan-800/50"
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t border-gray-800/30 ${isCollapsed ? 'px-2' : ''}`}>
          <div className="space-y-3">
            {/* User Profile */}
            <div className={`flex items-center rounded-lg bg-gray-800/20 border border-gray-700/30 ${
              isCollapsed ? 'p-2 justify-center' : 'p-3 space-x-3'
            }`}>
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-900 to-cyan-900 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">{getUserName()}</div>
                  <div className="text-gray-400 text-xs font-light truncate">{getUserEmail()}</div>
                </div>
              )}
              {!isCollapsed && (
                <div className="w-1.5 h-1.5 bg-cyan-800 rounded-full"></div>
              )}
            </div>

            {/* Support & Logout */}
            <div className={`grid gap-2 ${isCollapsed ? 'grid-cols-1' : 'grid-cols-2'}`}>
              <button 
                onClick={() => {
                  window.open('https://support.tokabi.com', '_blank');
                  onClose();
                }}
                className={`text-gray-400 hover:text-cyan-800 transition-colors duration-200 text-sm font-medium rounded-lg border border-gray-700/30 hover:border-cyan-900/30 hover:bg-cyan-900/5 ${
                  isCollapsed ? 'p-2 flex justify-center' : 'p-2'
                }`}
                title={isCollapsed ? "Support" : undefined}
              >
                {isCollapsed ? (
                  <HelpCircle className="w-4 h-4" />
                ) : (
                  'Support'
                )}
              </button>
              <button 
                onClick={handleLogout}
                className={`text-gray-400 hover:text-red-400 transition-colors duration-200 text-sm font-medium rounded-lg border border-gray-700/30 hover:border-red-500/30 hover:bg-red-500/5 ${
                  isCollapsed ? 'p-2 flex justify-center' : 'p-2'
                }`}
                title={isCollapsed ? "Logout" : undefined}
              >
                {isCollapsed ? (
                  <LogOut className="w-4 h-4" />
                ) : (
                  'Logout'
                )}
              </button>
            </div>

            {/* Collapse Toggle Button - Desktop Only */}
            <div className="hidden lg:block pt-2 border-t border-gray-800/30">
              <button
                onClick={onToggleCollapse}
                className="w-full p-2 text-gray-400 hover:text-white hover:bg-gray-800/30 rounded-lg transition-all duration-200 flex items-center justify-center"
                title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Desktop Sidebar */}
      <div className={`hidden lg:flex lg:flex-shrink-0 lg:flex-col lg:fixed lg:inset-y-0 lg:z-30 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'lg:w-20' : 'lg:w-80'
      }`}>
        <div className="flex-1 flex flex-col min-h-0 bg-gray-900/95 backdrop-blur-xl border-r border-gray-800/30">
          {/* Same content as mobile menu but always visible */}
          {/* Header */}
          <div className={`p-6 border-b border-gray-800/30 ${isCollapsed ? 'px-4' : ''}`}>
            <Link 
              to="/dashboard" 
              className={`flex items-center group ${isCollapsed ? 'justify-center' : 'space-x-3'}`}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-900 to-cyan-900 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-900/25">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="text-white font-light text-xl">TOKABI</span>
                  <span className="text-cyan-800 text-xs font-medium tracking-wider">DASHBOARD</span>
                </div>
              )}
            </Link>

            {/* Quick Stats */}
            {!isCollapsed && (
              <div className="grid grid-cols-3 gap-3 mb-4">
                {quickStats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className="text-center p-2 bg-gray-800/20 rounded-lg border border-gray-700/30 hover:border-gray-600/50 transition-colors duration-200"
                  >
                    <div className={`text-sm font-semibold ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs text-gray-400 font-light">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Connect Exchange Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConnectExchange}
              className={`w-full py-3 bg-gradient-to-r from-cyan-900 to-cyan-900 text-white font-medium rounded-lg hover:from-cyan-800 hover:to-cyan-800 transition-all duration-300 shadow-lg shadow-cyan-900/25 flex items-center justify-center ${
                isCollapsed ? 'px-2' : 'space-x-2 text-sm'
              }`}
            >
              {isCollapsed ? (
                <Key className="w-4 h-4" />
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span>Connect Exchange</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className={`p-4 space-y-6 ${isCollapsed ? 'px-2' : ''}`}>
              {menuItems.map((category) => (
                <div key={category.category}>
                  {!isCollapsed && (
                    <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-3 px-2 font-light">
                      {category.category}
                    </h3>
                  )}
                  <div className="space-y-1">
                    {category.items.map((item) => {
                      const isActive = activePath === item.href;
                      const Icon = item.icon;
                      return (
                        <motion.button
                          key={item.name}
                          whileHover={{ x: isCollapsed ? 0 : 4 }}
                          onClick={() => handleNavigation(item.href)}
                          className={`w-full text-left rounded-lg transition-all duration-200 group border ${
                            isCollapsed ? 'p-3 justify-center' : 'p-3'
                          } ${
                            isActive
                              ? 'bg-cyan-900/10 border-cyan-900/30 text-cyan-800 shadow-lg shadow-cyan-900/10'
                              : 'text-gray-300 hover:bg-gray-800/30 hover:text-white border-transparent hover:border-gray-700/30'
                          }`}
                        >
                          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
                            <Icon className={`transition-transform duration-200 group-hover:scale-110 ${
                              isCollapsed ? 'w-4 h-4' : 'w-4 h-4'
                            }`} />
                            {!isCollapsed && (
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm">{item.name}</div>
                                <div className={`text-xs transition-colors duration-200 font-light ${
                                  isActive ? 'text-cyan-300/70' : 'text-gray-400 group-hover:text-gray-300'
                                }`}>
                                  {item.description}
                                </div>
                              </div>
                            )}
                            {!isCollapsed && isActive && (
                              <motion.div
                                layoutId="activeMenuIndicator"
                                className="w-1.5 h-1.5 bg-cyan-800 rounded-full shadow-lg shadow-cyan-800/50"
                              />
                            )}
                          </div>
                          {isCollapsed && isActive && (
                            <motion.div
                              layoutId="activeMenuIndicatorCollapsed"
                              className="w-1 h-1 bg-cyan-800 rounded-full mx-auto mt-2 shadow-lg shadow-cyan-800/50"
                            />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className={`p-4 border-t border-gray-800/30 ${isCollapsed ? 'px-2' : ''}`}>
            <div className="space-y-3">
              {/* User Profile */}
              <div className={`flex items-center rounded-lg bg-gray-800/20 border border-gray-700/30 ${
                isCollapsed ? 'p-2 justify-center' : 'p-3 space-x-3'
              }`}>
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-900 to-cyan-900 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{getUserName()}</div>
                    <div className="text-gray-400 text-xs font-light truncate">{getUserEmail()}</div>
                  </div>
                )}
                {!isCollapsed && (
                  <div className="w-1.5 h-1.5 bg-cyan-800 rounded-full"></div>
                )}
              </div>

              {/* Support & Logout */}
              <div className={`grid gap-2 ${isCollapsed ? 'grid-cols-1' : 'grid-cols-2'}`}>
                <button 
                  onClick={() => window.open('https://support.tokabi.com', '_blank')}
                  className={`text-gray-400 hover:text-cyan-800 transition-colors duration-200 text-sm font-medium rounded-lg border border-gray-700/30 hover:border-cyan-900/30 hover:bg-cyan-900/5 ${
                    isCollapsed ? 'p-2 flex justify-center' : 'p-2'
                  }`}
                  title={isCollapsed ? "Support" : undefined}
                >
                  {isCollapsed ? (
                    <HelpCircle className="w-4 h-4" />
                  ) : (
                    'Support'
                  )}
                </button>
                <button 
                  onClick={handleLogout}
                  className={`text-gray-400 hover:text-red-400 transition-colors duration-200 text-sm font-medium rounded-lg border border-gray-700/30 hover:border-red-500/30 hover:bg-red-500/5 ${
                    isCollapsed ? 'p-2 flex justify-center' : 'p-2'
                  }`}
                  title={isCollapsed ? "Logout" : undefined}
                >
                  {isCollapsed ? (
                    <LogOut className="w-4 h-4" />
                  ) : (
                    'Logout'
                  )}
                </button>
              </div>

              {/* Collapse Toggle Button */}
              <div className="pt-2 border-t border-gray-800/30">
                <button
                  onClick={onToggleCollapse}
                  className="w-full p-2 text-gray-400 hover:text-white hover:bg-gray-800/30 rounded-lg transition-all duration-200 flex items-center justify-center"
                  title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  {isCollapsed ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : (
                    <ChevronLeft className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu button for dashboard header - Only show when menu is closed */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="lg:hidden fixed top-4 left-4 z-30"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpen}
              className="p-2 rounded-lg bg-gray-800/80 backdrop-blur-sm border border-gray-700/30 text-gray-300 hover:text-white transition-all duration-200 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardMenu;