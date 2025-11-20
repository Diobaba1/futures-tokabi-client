// src/components/Layout/DashboardMenu.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { 
  BarChart3, 
  FileText, 
  Key, 
  CreditCard, 
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  TrendingUp,
  Cpu,
  User,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
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
  const [isHovered, setIsHovered] = useState(false);
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
          description: 'Portfolio overview & analytics',
          badge: null
        },
        { 
          name: 'Analyze Assets', 
          href: '/dashboard/symbol-analysis', 
          icon: TrendingUp,
          description: 'Analyze any Asset of Choice',
          badge: null
        },
        { 
          name: 'AI Signals', 
          href: '/dashboard/signals', 
          icon: Cpu,
          description: 'Machine learning insights',
          badge: 'NEW'
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
          description: 'Performance analysis',
          badge: null
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
          description: 'Exchange connections',
          badge: null
        },
        { 
          name: 'Notifications', 
          href: '/dashboard/notifications', 
          icon: Bell,
          description: 'Alerts & updates',
          badge: '3'
        },
        { 
          name: 'Billing', 
          href: '/dashboard/billing', 
          icon: CreditCard,
          description: 'Subscription & billing',
          badge: null
        },
        { 
          name: 'Settings', 
          href: '/dashboard/settings', 
          icon: Settings,
          description: 'Platform configuration',
          badge: null
        },
      ]
    }
  ];

  const quickStats = [
    { label: 'Daily P&L', value: '+2.4%', color: 'text-emerald-400', trend: 'up' },
    { label: 'Active Models', value: '3/5', color: 'text-cyan-400', trend: 'neutral' },
    { label: 'Win Rate', value: '87.3%', color: 'text-emerald-400', trend: 'up' },
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

  const getUserName = () => {
    return user?.full_name || 'User';
  };

  const getUserEmail = () => {
    return user?.email || 'user@example.com';
  };

  return (
    <>
      {/* Enhanced Overlay with Glass Effect */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-cyan-950/20 backdrop-blur-xl z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Enhanced Glass Menu Panel */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-cyan-950/30 via-slate-900/40 to-cyan-950/20 backdrop-blur-2xl border-r border-cyan-500/20 z-50 flex flex-col ${
          isCollapsed ? 'w-20' : 'w-80'
        } transition-all duration-500 ease-out shadow-2xl shadow-cyan-500/10`}
        style={{
          backgroundImage: `
            linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(8, 145, 178, 0.05) 50%, rgba(6, 182, 212, 0.1) 100%),
            radial-gradient(circle at 20% 80%, rgba(6, 182, 212, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)
          `
        }}
      >
        {/* Glass Header with Enhanced Effects */}
        <div className={`p-6 border-b border-cyan-500/10 ${isCollapsed ? 'px-4' : ''}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-6`}>
            <Link 
              to="/dashboard" 
              className={`flex items-center group ${isCollapsed ? 'justify-center' : 'space-x-3'}`}
            >
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="relative"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400/20 via-cyan-500/30 to-cyan-600/40 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
                  <Zap className="w-5 h-5 text-cyan-400" />
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-1 bg-gradient-to-r from-cyan-400/30 to-cyan-600/30 rounded-2xl blur-sm opacity-50 -z-10"
                />
              </motion.div>
              {!isCollapsed && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col"
                >
                  <span className="text-white font-light text-xl bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
                    TOKABI
                  </span>
                  <span className="text-cyan-400/70 text-xs font-medium tracking-wider">DASHBOARD</span>
                </motion.div>
              )}
            </Link>
            
            {!isCollapsed && (
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(6, 182, 212, 0.1)' }}
                onClick={onClose}
                className="p-2 rounded-xl bg-cyan-500/5 border border-cyan-400/20 text-cyan-400/70 hover:text-cyan-300 transition-all duration-300 lg:hidden"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            )}
          </div>

          {/* Enhanced Quick Stats */}
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-3 gap-3 mb-4"
            >
              {quickStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="text-center p-3 bg-cyan-500/5 backdrop-blur-sm rounded-xl border border-cyan-400/10 hover:border-cyan-400/30 transition-all duration-300 group cursor-pointer"
                >
                  <div className={`text-sm font-semibold ${stat.color} flex items-center justify-center space-x-1`}>
                    <span>{stat.value}</span>
                    {stat.trend === 'up' && (
                      <motion.div
                        animate={{ y: [0, -2, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Sparkles className="w-3 h-3" />
                      </motion.div>
                    )}
                  </div>
                  <div className="text-xs text-cyan-400/60 font-light group-hover:text-cyan-400/80 transition-colors">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Enhanced Connect Exchange Button */}
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleConnectExchange}
            className={`relative overflow-hidden group ${
              isCollapsed ? 'px-2' : 'space-x-2 text-sm'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-cyan-400/30 to-cyan-500/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-500" />
            <div className={`relative w-full py-3 bg-gradient-to-r from-cyan-500/10 to-cyan-600/10 text-white font-medium rounded-xl border border-cyan-400/30 hover:border-cyan-400/50 backdrop-blur-sm transition-all duration-300 flex items-center justify-center ${
              isCollapsed ? 'px-2' : 'space-x-2'
            }`}>
              {isCollapsed ? (
                <Key className="w-4 h-4 text-cyan-400" />
              ) : (
                <>
                  <Key className="w-4 h-4 text-cyan-400" />
                  <span className="bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
                    Connect Exchange
                  </span>
                </>
              )}
              <motion.div
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-1 bg-cyan-400 rounded-full ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </motion.button>
        </div>

        {/* Enhanced Navigation */}
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
                  <motion.h3 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-cyan-400/60 text-xs uppercase tracking-wider mb-3 px-2 font-light"
                  >
                    {category.category}
                  </motion.h3>
                )}
                <div className="space-y-2">
                  {category.items.map((item) => {
                    const isActive = activePath === item.href;
                    const Icon = item.icon;
                    return (
                      <motion.button
                        key={item.name}
                        whileHover={{ x: isCollapsed ? 0 : 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleNavigation(item.href)}
                        className={`relative w-full text-left rounded-xl transition-all duration-300 group overflow-hidden ${
                          isCollapsed ? 'p-3 justify-center' : 'p-3'
                        } ${
                          isActive
                            ? 'bg-cyan-500/10 backdrop-blur-sm border border-cyan-400/30 shadow-lg shadow-cyan-500/10'
                            : 'text-cyan-100/80 hover:bg-cyan-500/5 border border-transparent hover:border-cyan-400/20'
                        }`}
                      >
                        {/* Animated background gradient */}
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-cyan-400/10 to-cyan-500/5"
                          />
                        )}
                        
                        <div className={`flex items-center relative z-10 ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
                          <div className="relative">
                            <Icon className={`transition-all duration-300 ${
                              isCollapsed ? 'w-4 h-4' : 'w-4 h-4'
                            } ${
                              isActive 
                                ? 'text-cyan-400 scale-110' 
                                : 'text-cyan-400/70 group-hover:text-cyan-400 group-hover:scale-110'
                            }`} />
                            {isActive && (
                              <motion.div
                                layoutId="activeIconGlow"
                                className="absolute inset-0 bg-cyan-400 rounded-full blur-sm"
                              />
                            )}
                          </div>
                          
                          {!isCollapsed && (
                            <div className="flex-1 min-w-0 flex items-center justify-between">
                              <div>
                                <div className={`font-medium text-sm transition-colors duration-300 ${
                                  isActive ? 'text-cyan-50' : 'text-cyan-100/90 group-hover:text-cyan-50'
                                }`}>
                                  {item.name}
                                </div>
                                <div className={`text-xs transition-colors duration-300 font-light ${
                                  isActive ? 'text-cyan-400/80' : 'text-cyan-400/60 group-hover:text-cyan-400/70'
                                }`}>
                                  {item.description}
                                </div>
                              </div>
                              
                              {item.badge && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className={`px-2 py-1 text-xs rounded-full ${
                                    item.badge === 'NEW' 
                                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/30'
                                      : 'bg-cyan-500/10 text-cyan-300 border border-cyan-400/20'
                                  }`}
                                >
                                  {item.badge}
                                </motion.span>
                              )}
                            </div>
                          )}
                          
                          {!isCollapsed && isActive && (
                            <motion.div
                              layoutId="activeMenuIndicator"
                              className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"
                            />
                          )}
                        </div>
                        
                        {isCollapsed && isActive && (
                          <motion.div
                            layoutId="activeMenuIndicatorCollapsed"
                            className="w-1 h-1 bg-cyan-400 rounded-full mx-auto mt-2 shadow-lg shadow-cyan-400/50"
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

        {/* Enhanced Footer */}
        <div className={`p-4 border-t border-cyan-500/10 ${isCollapsed ? 'px-2' : ''}`}>
          <div className="space-y-3">
            {/* Enhanced User Profile */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className={`flex items-center rounded-xl bg-cyan-500/5 backdrop-blur-sm border border-cyan-400/10 hover:border-cyan-400/30 transition-all duration-300 ${
                isCollapsed ? 'p-2 justify-center' : 'p-3 space-x-3'
              }`}
            >
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400/20 to-cyan-600/30 rounded-full flex items-center justify-center border border-cyan-400/30">
                  <User className="w-4 h-4 text-cyan-400" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -inset-1 bg-cyan-400/20 rounded-full blur-sm"
                />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="text-cyan-50 text-sm font-medium truncate">{getUserName()}</div>
                  <div className="text-cyan-400/60 text-xs font-light truncate">{getUserEmail()}</div>
                </div>
              )}
              {!isCollapsed && (
                <motion.div 
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"
                />
              )}
            </motion.div>

            {/* Enhanced Action Buttons */}
            <div className={`grid gap-2 ${isCollapsed ? 'grid-cols-1' : 'grid-cols-2'}`}>
              <motion.button 
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  window.open('https://support.tokabi.com', '_blank');
                  onClose();
                }}
                className={`text-cyan-400/80 hover:text-cyan-300 transition-all duration-300 text-sm font-medium rounded-xl border border-cyan-400/20 hover:border-cyan-400/40 bg-cyan-500/5 hover:bg-cyan-500/10 backdrop-blur-sm ${
                  isCollapsed ? 'p-2 flex justify-center' : 'p-2'
                }`}
                title={isCollapsed ? "Support" : undefined}
              >
                {isCollapsed ? (
                  <HelpCircle className="w-4 h-4" />
                ) : (
                  'Support'
                )}
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className={`text-cyan-400/80 hover:text-rose-400 transition-all duration-300 text-sm font-medium rounded-xl border border-cyan-400/20 hover:border-rose-400/40 bg-cyan-500/5 hover:bg-rose-500/10 backdrop-blur-sm ${
                  isCollapsed ? 'p-2 flex justify-center' : 'p-2'
                }`}
                title={isCollapsed ? "Logout" : undefined}
              >
                {isCollapsed ? (
                  <LogOut className="w-4 h-4" />
                ) : (
                  'Logout'
                )}
              </motion.button>
            </div>

            {/* Enhanced Collapse Toggle Button */}
            <div className="hidden lg:block pt-2 border-t border-cyan-500/10">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(6, 182, 212, 0.1)' }}
                whileTap={{ scale: 0.95 }}
                onClick={onToggleCollapse}
                className="w-full p-2 text-cyan-400/70 hover:text-cyan-300 hover:bg-cyan-500/5 rounded-xl transition-all duration-300 flex items-center justify-center backdrop-blur-sm border border-transparent hover:border-cyan-400/20"
                title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Desktop Sidebar */}
      <div className={`hidden lg:flex lg:flex-shrink-0 lg:flex-col lg:fixed lg:inset-y-0 lg:z-30 transition-all duration-500 ease-out ${
        isCollapsed ? 'lg:w-20' : 'lg:w-80'
      }`}>
        <div 
          className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-cyan-950/30 via-slate-900/40 to-cyan-950/20 backdrop-blur-2xl border-r border-cyan-500/20 shadow-2xl shadow-cyan-500/10"
          style={{
            backgroundImage: `
              linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(8, 145, 178, 0.05) 50%, rgba(6, 182, 212, 0.1) 100%),
              radial-gradient(circle at 20% 80%, rgba(6, 182, 212, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)
            `
          }}
        >
          {/* Same enhanced content as mobile menu but always visible */}
          {/* Header */}
          <div className={`p-6 border-b border-cyan-500/10 ${isCollapsed ? 'px-4' : ''}`}>
            <Link 
              to="/dashboard" 
              className={`flex items-center group ${isCollapsed ? 'justify-center' : 'space-x-3'}`}
            >
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="relative"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400/20 via-cyan-500/30 to-cyan-600/40 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
                  <Zap className="w-5 h-5 text-cyan-400" />
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-1 bg-gradient-to-r from-cyan-400/30 to-cyan-600/30 rounded-2xl blur-sm opacity-50 -z-10"
                />
              </motion.div>
              {!isCollapsed && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col"
                >
                  <span className="text-white font-light text-xl bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
                    {user?.full_name}
                  </span>
                </motion.div>
              )}
            </Link>

            
            <br /><br />

            {/* Connect Exchange Button */}
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConnectExchange}
              className={`relative overflow-hidden group ${
                isCollapsed ? 'px-2' : 'space-x-2 text-sm'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-cyan-400/30 to-cyan-500/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-500" />
              <div className={`relative w-full py-3 bg-gradient-to-r from-cyan-500/10 to-cyan-600/10 text-white font-medium rounded-xl border border-cyan-400/30 hover:border-cyan-400/50 backdrop-blur-sm transition-all duration-300 flex items-center justify-center ${
                isCollapsed ? 'px-2' : 'space-x-2'
              }`}>
                {isCollapsed ? (
                  <Key className="w-4 h-4 text-cyan-400" />
                ) : (
                  <>
                    <Key className="w-4 h-4 text-cyan-400" />
                    <span className="bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
                      Connect Exchange
                    </span>
                  </>
                )}
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1 h-1 bg-cyan-400 rounded-full ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </motion.button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className={`p-4 space-y-6 ${isCollapsed ? 'px-2' : ''}`}>
              {menuItems.map((category) => (
                <div key={category.category}>
                  {!isCollapsed && (
                    <h3 className="text-cyan-400/60 text-xs uppercase tracking-wider mb-3 px-2 font-light">
                      {category.category}
                    </h3>
                  )}
                  <div className="space-y-2">
                    {category.items.map((item) => {
                      const isActive = activePath === item.href;
                      const Icon = item.icon;
                      return (
                        <motion.button
                          key={item.name}
                          whileHover={{ x: isCollapsed ? 0 : 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleNavigation(item.href)}
                          className={`relative w-full text-left rounded-xl transition-all duration-300 group overflow-hidden ${
                            isCollapsed ? 'p-3 justify-center' : 'p-3'
                          } ${
                            isActive
                              ? 'bg-cyan-500/10 backdrop-blur-sm border border-cyan-400/30 shadow-lg shadow-cyan-500/10'
                              : 'text-cyan-100/80 hover:bg-cyan-500/5 border border-transparent hover:border-cyan-400/20'
                          }`}
                        >
                          {isActive && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-cyan-400/10 to-cyan-500/5"
                            />
                          )}
                          
                          <div className={`flex items-center relative z-10 ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
                            <div className="relative">
                              <Icon className={`transition-all duration-300 ${
                                isCollapsed ? 'w-4 h-4' : 'w-4 h-4'
                              } ${
                                isActive 
                                  ? 'text-cyan-400 scale-110' 
                                  : 'text-cyan-400/70 group-hover:text-cyan-400 group-hover:scale-110'
                              }`} />
                              {isActive && (
                                <motion.div
                                  layoutId="activeIconGlow"
                                  className="absolute inset-0 bg-cyan-400 rounded-full blur-sm"
                                />
                              )}
                            </div>
                            
                            {!isCollapsed && (
                              <div className="flex-1 min-w-0 flex items-center justify-between">
                                <div>
                                  <div className={`font-medium text-sm transition-colors duration-300 ${
                                    isActive ? 'text-cyan-50' : 'text-cyan-100/90 group-hover:text-cyan-50'
                                  }`}>
                                    {item.name}
                                  </div>
                                  <div className={`text-xs transition-colors duration-300 font-light ${
                                    isActive ? 'text-cyan-400/80' : 'text-cyan-400/60 group-hover:text-cyan-400/70'
                                  }`}>
                                    {item.description}
                                  </div>
                                </div>
                                
                                {item.badge && (
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    item.badge === 'NEW' 
                                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/30'
                                      : 'bg-cyan-500/10 text-cyan-300 border border-cyan-400/20'
                                  }`}>
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                            )}
                            
                            {!isCollapsed && isActive && (
                              <motion.div
                                layoutId="activeMenuIndicator"
                                className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"
                              />
                            )}
                          </div>
                          
                          {isCollapsed && isActive && (
                            <motion.div
                              layoutId="activeMenuIndicatorCollapsed"
                              className="w-1 h-1 bg-cyan-400 rounded-full mx-auto mt-2 shadow-lg shadow-cyan-400/50"
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
          <div className={`p-4 border-t border-cyan-500/10 ${isCollapsed ? 'px-2' : ''}`}>
            <div className="space-y-3">
              {/* User Profile */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className={`flex items-center rounded-xl bg-cyan-500/5 backdrop-blur-sm border border-cyan-400/10 hover:border-cyan-400/30 transition-all duration-300 ${
                  isCollapsed ? 'p-2 justify-center' : 'p-3 space-x-3'
                }`}
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-400/20 to-cyan-600/30 rounded-full flex items-center justify-center border border-cyan-400/30">
                    <User className="w-4 h-4 text-cyan-400" />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute -inset-1 bg-cyan-400/20 rounded-full blur-sm"
                  />
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="text-cyan-50 text-sm font-medium truncate">{getUserName()}</div>
                    <div className="text-cyan-400/60 text-xs font-light truncate">{getUserEmail()}</div>
                  </div>
                )}
                {!isCollapsed && (
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"
                  />
                )}
              </motion.div>

              {/* Action Buttons */}
              <div className={`grid gap-2 ${isCollapsed ? 'grid-cols-1' : 'grid-cols-2'}`}>
                <motion.button 
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.open('https://support.tokabi.com', '_blank')}
                  className={`text-cyan-400/80 hover:text-cyan-300 transition-all duration-300 text-sm font-medium rounded-xl border border-cyan-400/20 hover:border-cyan-400/40 bg-cyan-500/5 hover:bg-cyan-500/10 backdrop-blur-sm ${
                    isCollapsed ? 'p-2 flex justify-center' : 'p-2'
                  }`}
                  title={isCollapsed ? "Support" : undefined}
                >
                  {isCollapsed ? (
                    <HelpCircle className="w-4 h-4" />
                  ) : (
                    'Support'
                  )}
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className={`text-cyan-400/80 hover:text-rose-400 transition-all duration-300 text-sm font-medium rounded-xl border border-cyan-400/20 hover:border-rose-400/40 bg-cyan-500/5 hover:bg-rose-500/10 backdrop-blur-sm ${
                    isCollapsed ? 'p-2 flex justify-center' : 'p-2'
                  }`}
                  title={isCollapsed ? "Logout" : undefined}
                >
                  {isCollapsed ? (
                    <LogOut className="w-4 h-4" />
                  ) : (
                    'Logout'
                  )}
                </motion.button>
              </div>

              {/* Collapse Toggle Button */}
              <div className="pt-2 border-t border-cyan-500/10">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(6, 182, 212, 0.1)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onToggleCollapse}
                  className="w-full p-2 text-cyan-400/70 hover:text-cyan-300 hover:bg-cyan-500/5 rounded-xl transition-all duration-300 flex items-center justify-center backdrop-blur-sm border border-transparent hover:border-cyan-400/20"
                  title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  {isCollapsed ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : (
                    <ChevronLeft className="w-4 h-4" />
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Menu Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="lg:hidden fixed top-4 left-4 z-30"
          >
            <motion.button
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpen}
              className="p-3 rounded-xl bg-cyan-500/10 backdrop-blur-sm border border-cyan-400/20 text-cyan-400 hover:text-cyan-300 transition-all duration-300 shadow-lg shadow-cyan-500/10"
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