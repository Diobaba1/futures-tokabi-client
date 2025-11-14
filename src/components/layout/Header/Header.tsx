// src/components/Layout/Header.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X,
  TrendingUp, 
  Shield, 
  User, 
  LogOut, 
  Settings,
  Briefcase,
  BarChart3,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { UserResponse } from '../../../types';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-header-menu]')) {
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navigation = [
    { name: 'Features', href: '/features', icon: BarChart3 },
    { name: 'Community', href: '/community', icon: Briefcase },
  ];

  const userMenuItems = [
    { name: 'Portal', href: '/dashboard', icon: BarChart3 },
    { name: 'Account Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const getDisplayName = (user: UserResponse | null): string => {
    if (!user) return 'Account';
    if (user.full_name && user.full_name.trim()) {
      return user.full_name.split(' ')[0];
    }
    return user.email.split('@')[0];
  };

  const getUserStatus = (user: UserResponse | null): string => {
    if (!user) return 'Professional';
    if (user.is_subscribed) return 'Enterprise';
    if (user.is_verified) return 'Verified';
    return 'Professional';
  };

  const getStatusColor = (user: UserResponse | null): string => {
    if (!user) return 'from-cyan-500 to-blue-500';
    if (user.is_subscribed) return 'from-cyan-400 to-blue-500';
    if (user.is_verified) return 'from-cyan-500 to-cyan-600';
    return 'from-gray-500 to-gray-600';
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-gray-950/80 backdrop-blur-2xl border-b border-cyan-500/20 shadow-2xl shadow-cyan-500/10'
            : 'bg-gray-950/40 backdrop-blur-xl border-b border-cyan-500/10'
        }`}
        data-header-menu
      >
        {/* Glassmorphic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none" />
        
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="flex-shrink-0 flex items-center relative z-10"
            >
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative w-11 h-11 bg-gradient-to-br from-cyan-500 via-cyan-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/50 group-hover:shadow-cyan-500/70 transition-all duration-300 backdrop-blur-xl border border-cyan-400/30 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                  <TrendingUp className="w-6 h-6 text-white relative z-10 drop-shadow-lg" />
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-semibold text-xl tracking-tight drop-shadow-lg bg-gradient-to-r from-white to-cyan-100 bg-clip-text">
                    TOKABI
                  </span>
                  <span className="text-cyan-400 text-xs font-medium tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI Trading Machine
                  </span>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2 relative z-10">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                return (
                  <motion.div 
                    key={item.name} 
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to={item.href}
                      className={`relative px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 backdrop-blur-xl group overflow-hidden ${
                        isActive
                          ? 'text-white bg-gradient-to-r from-cyan-500/20 via-cyan-600/20 to-blue-600/20 border border-cyan-400/40 shadow-lg shadow-cyan-500/20'
                          : 'text-gray-300 hover:text-white hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20'
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                      <Icon className={`w-4 h-4 relative z-10 ${isActive ? 'text-cyan-400' : ''}`} />
                      <span className="relative z-10">{item.name}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-3 relative z-10">
              {isAuthenticated ? (
                <>
                  {/* User Menu */}
                  <div className="relative" data-header-menu>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-gray-800/50 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 backdrop-blur-xl group shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20"
                    >
                      <div className={`w-9 h-9 bg-gradient-to-br ${getStatusColor(user)} rounded-lg flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-lg relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
                        <User className="w-5 h-5 text-white relative z-10" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-white text-sm font-medium">
                          {getDisplayName(user)}
                        </span>
                        <span className="text-cyan-400 text-xs font-light flex items-center gap-1">
                          {getUserStatus(user)}
                          {user?.is_subscribed && <Sparkles className="w-3 h-3" />}
                        </span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-cyan-400 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </motion.button>

                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 top-full mt-3 w-72 bg-gray-900/95 backdrop-blur-2xl border border-cyan-500/20 rounded-2xl shadow-2xl shadow-cyan-500/20 py-2 overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 pointer-events-none" />
                          
                          <div className="px-4 py-3 border-b border-cyan-500/20 relative">
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 bg-gradient-to-br ${getStatusColor(user)} rounded-xl flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-lg relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
                                <User className="w-6 h-6 text-white relative z-10" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-semibold truncate">
                                  {user?.full_name || user?.email.split('@')[0]}
                                </p>
                                <p className="text-cyan-400 text-xs font-medium flex items-center gap-1">
                                  {getUserStatus(user)}
                                  {user?.is_subscribed && <Sparkles className="w-3 h-3" />}
                                </p>
                                <p className="text-gray-400 text-xs truncate mt-0.5">
                                  {user?.email}
                                </p>
                              </div>
                            </div>
                            {user?.last_login && (
                              <div className="mt-2 px-3 py-1.5 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                                <p className="text-cyan-300 text-xs">
                                  Last login: {new Date(user.last_login).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                              </div>
                            )}
                          </div>
                          
                          <div className="py-2">
                            {userMenuItems.map((item) => {
                              const Icon = item.icon;
                              return (
                                <Link
                                  key={item.name}
                                  to={item.href}
                                  onClick={() => setIsUserMenuOpen(false)}
                                  className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-cyan-500/10 transition-all duration-200 backdrop-blur-xl group"
                                >
                                  <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/20 transition-all">
                                    <Icon className="w-4 h-4 text-cyan-400" />
                                  </div>
                                  <span className="font-medium">{item.name}</span>
                                </Link>
                              );
                            })}
                          </div>
                          
                          <div className="border-t border-cyan-500/20 pt-2">
                            <button
                              onClick={handleLogout}
                              disabled={isLoading}
                              className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 backdrop-blur-xl disabled:opacity-50 group"
                            >
                              <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center group-hover:bg-red-500/20 transition-all">
                                <LogOut className="w-4 h-4" />
                              </div>
                              <span className="font-medium">{isLoading ? 'Signing Out...' : 'Sign Out'}</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Quick Dashboard Button */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      to="/dashboard"
                      className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 via-cyan-600 to-blue-600 text-white font-medium text-sm rounded-xl hover:from-cyan-400 hover:via-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-500/40 hover:shadow-cyan-500/60 backdrop-blur-xl border border-cyan-400/30 flex items-center gap-2 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                      <BarChart3 className="w-4 h-4 relative z-10" />
                      <span className="relative z-10">Trading Desk</span>
                    </Link>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    
                    <Link
                      to="/login"
                      className="px-6 py-2.5 text-gray-300 hover:text-white font-medium text-sm transition-all duration-300 hover:bg-cyan-500/10 rounded-xl border border-transparent hover:border-cyan-500/20 backdrop-blur-xl"
                    >
                      Login
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      to="/register"
                      className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 via-cyan-600 to-blue-600 text-white font-medium text-sm rounded-xl hover:from-cyan-400 hover:via-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-500/40 hover:shadow-cyan-500/60 backdrop-blur-xl border border-cyan-400/30 flex items-center gap-2 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                      <User className="w-4 h-4 relative z-10" />
                      <span className="relative z-10">Register</span>
                    </Link>
                  </motion.div>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden relative z-10" data-header-menu>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 rounded-xl bg-gray-800/50 border border-cyan-500/20 text-gray-300 hover:text-white hover:border-cyan-400/40 transition-all duration-300 backdrop-blur-xl shadow-lg shadow-cyan-500/10"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </motion.button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-gray-900/95 backdrop-blur-2xl border-t border-cyan-500/20 relative overflow-hidden"
              data-header-menu
            >
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
              
              <div className="px-4 py-6 space-y-3 relative">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.name}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 w-full text-left px-4 py-3.5 rounded-xl font-medium text-base transition-all duration-300 backdrop-blur-xl ${
                          isActive
                            ? 'text-white bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/40 shadow-lg shadow-cyan-500/20'
                            : 'text-gray-300 hover:text-white hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20'
                        }`}
                      >
                        <div className={`w-9 h-9 ${isActive ? 'bg-cyan-500/20' : 'bg-gray-800/50'} rounded-lg flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-gray-400'}`} />
                        </div>
                        {item.name}
                      </Link>
                    </motion.div>
                  );
                })}
                
                <div className="pt-4 border-t border-cyan-500/20 space-y-3">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-500/20 backdrop-blur-xl">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 bg-gradient-to-br ${getStatusColor(user)} rounded-xl flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-lg relative overflow-hidden`}>
                            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
                            <User className="w-6 h-6 text-white relative z-10" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-semibold">
                              {getDisplayName(user)}
                            </p>
                            <p className="text-cyan-400 text-xs font-medium flex items-center gap-1">
                              {getUserStatus(user)}
                              {user?.is_subscribed && <Sparkles className="w-3 h-3" />}
                            </p>
                            <p className="text-gray-400 text-xs truncate mt-0.5">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {userMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.name}
                            to={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 w-full px-4 py-3.5 text-gray-300 hover:text-white font-medium text-base transition-all duration-300 backdrop-blur-xl hover:bg-cyan-500/10 rounded-xl border border-transparent hover:border-cyan-500/20"
                          >
                            <div className="w-9 h-9 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                              <Icon className="w-5 h-5 text-cyan-400" />
                            </div>
                            {item.name}
                          </Link>
                        );
                      })}
                      
                      <button
                        onClick={handleLogout}
                        disabled={isLoading}
                        className="flex items-center gap-3 w-full px-4 py-3.5 text-red-400 hover:text-red-300 font-medium text-base transition-all duration-300 backdrop-blur-xl hover:bg-red-500/10 rounded-xl disabled:opacity-50 border border-transparent hover:border-red-500/20"
                      >
                        <div className="w-9 h-9 bg-red-500/10 rounded-lg flex items-center justify-center">
                          <LogOut className="w-5 h-5" />
                        </div>
                        {isLoading ? 'Signing Out...' : 'Sign Out'}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full text-center px-4 py-3.5 text-gray-300 hover:text-white font-medium text-base transition-all duration-300 backdrop-blur-xl hover:bg-cyan-500/10 rounded-xl border border-cyan-500/20 hover:border-cyan-400/40"
                      >
                        Login
                      </Link>
                      <motion.div whileTap={{ scale: 0.98 }}>
                        <Link
                          to="/register"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="w-full text-center px-4 py-3.5 bg-gradient-to-r from-cyan-500 via-cyan-600 to-blue-600 text-white font-medium text-base rounded-xl hover:from-cyan-400 hover:via-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-500/40 backdrop-blur-xl border border-cyan-400/30 flex items-center justify-center gap-2 relative overflow-hidden group"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-active:translate-x-[200%] transition-transform duration-1000" />
                          <Shield className="w-5 h-5 relative z-10" />
                          <span className="relative z-10">Request Demo</span>
                        </Link>
                      </motion.div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Header Spacer */}
      <div className="h-16 lg:h-20" />
    </>
  );
};

export default Header;