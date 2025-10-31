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
  Building,
  Briefcase,
  BarChart3
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

  // Close menus when clicking outside
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
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Account Settings', href: '/settings', icon: Settings },
    { name: 'Institutional Portal', href: '/institutional', icon: Building },
  ];

  // Helper function to get display name from user data
  const getDisplayName = (user: UserResponse | null): string => {
    if (!user) return 'Account';
    
    // Use full_name if available, otherwise use email prefix
    if (user.full_name && user.full_name.trim()) {
      return user.full_name.split(' ')[0]; // First name only
    }
    
    return user.email.split('@')[0];
  };

  // Helper function to get user status/tier
  const getUserStatus = (user: UserResponse | null): string => {
    if (!user) return 'Professional Account';
    
    if (user.is_subscribed) {
      return 'Enterprise Tier';
    } else if (user.is_verified) {
      return 'Verified Account';
    } else {
      return 'Professional Account';
    }
  };

  // Helper function to get account type based on user properties
  const getAccountType = (user: UserResponse | null): string => {
    if (!user) return 'Professional';
    
    if (user.is_subscribed) {
      return 'Enterprise';
    } else if (user.is_verified) {
      return 'Verified';
    } else {
      return 'Professional';
    }
  };

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-black/5 backdrop-blur-2xl border-b border-cyan-800/20 shadow-xl shadow-cyan-900/10'
            : 'bg-black/0 backdrop-blur-xl border-b border-cyan-800/10'
        }`}
        data-header-menu
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="flex-shrink-0 flex items-center"
            >
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-900/80 to-blue-900/80 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-900/30 group-hover:shadow-cyan-900/50 transition-all duration-300 backdrop-blur-sm border border-cyan-800/20">
                  <TrendingUp className="w-5 h-5 text-cyan-200 drop-shadow-sm" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-light text-xl tracking-tight drop-shadow-sm">TOKABI</span>
                  <span className="text-cyan-300 text-xs font-medium tracking-wider">AI Trading Machine</span>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                return (
                  <motion.div key={item.name} whileHover={{ y: -2 }}>
                    <Link
                      to={item.href}
                      className={`relative px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-2 backdrop-blur-sm ${
                        isActive
                          ? 'text-cyan-300 bg-cyan-900/20 border border-cyan-700/30 shadow-md shadow-cyan-900/20'
                          : 'text-gray-300 hover:text-cyan-200 hover:bg-black/10'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.name}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute inset-0 bg-cyan-900/30 border border-cyan-700/40 rounded-lg -z-10 backdrop-blur-sm"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Desktop CTA Buttons - Conditionally rendered based on auth */}
            <div className="hidden lg:flex items-center space-x-3">
              {isAuthenticated ? (
                <>
                  {/* User Menu */}
                  <div className="relative" data-header-menu>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-3 p-2 rounded-lg bg-black/10 border border-gray-600/30 hover:border-cyan-700/40 transition-all duration-300 backdrop-blur-sm group"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-900/60 to-blue-900/60 rounded-lg flex items-center justify-center backdrop-blur-sm border border-cyan-800/20">
                        <User className="w-4 h-4 text-cyan-200" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-white text-sm font-medium">
                          {getDisplayName(user)}
                        </span>
                        <span className="text-cyan-300 text-xs font-light">
                          {getUserStatus(user)}
                        </span>
                      </div>
                    </motion.button>

                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 top-full mt-2 w-64 bg-black/90 backdrop-blur-2xl border border-cyan-800/20 rounded-xl shadow-2xl shadow-cyan-900/20 py-2"
                        >
                          <div className="px-4 py-2 border-b border-cyan-800/10">
                            <p className="text-white text-sm font-medium truncate">
                              {user?.email}
                            </p>
                            <p className="text-cyan-300 text-xs font-light">
                              {getAccountType(user)} Account
                            </p>
                            {user?.last_login && (
                              <p className="text-gray-400 text-xs mt-1">
                                Last login: {new Date(user.last_login).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          
                          {userMenuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setIsUserMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-cyan-200 hover:bg-cyan-900/20 transition-all duration-200 backdrop-blur-sm"
                              >
                                <Icon className="w-4 h-4" />
                                {item.name}
                              </Link>
                            );
                          })}
                          
                          <div className="border-t border-cyan-800/10 pt-2">
                            <button
                              onClick={handleLogout}
                              disabled={isLoading}
                              className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 backdrop-blur-sm disabled:opacity-50"
                            >
                              <LogOut className="w-4 h-4" />
                              {isLoading ? 'Signing Out...' : 'Sign Out'}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Quick Access Dashboard Button */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      to="/dashboard"
                      className="px-6 py-2.5 bg-gradient-to-r from-cyan-900/80 to-cyan-800/80 text-white font-medium text-sm rounded-lg hover:from-cyan-900 hover:to-cyan-800 transition-all duration-300 shadow-lg shadow-cyan-900/30 backdrop-blur-sm border border-cyan-800/20 flex items-center gap-2"
                    >
                      <BarChart3 className="w-4 h-4" />
                      Trading Desk
                    </Link>
                  </motion.div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-6 py-2.5 text-gray-300 hover:text-cyan-200 font-medium text-sm transition-all duration-300 hover:bg-black/10 rounded-lg border border-transparent hover:border-gray-600/30 backdrop-blur-sm"
                  >
                    Login
                  </Link>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      to="/register"
                      className="px-6 py-2.5 bg-gradient-to-r from-cyan-900/80 to-cyan-800/80 text-white font-medium text-sm rounded-lg hover:from-cyan-900 hover:to-cyan-800 transition-all duration-300 shadow-lg shadow-cyan-900/30 backdrop-blur-sm border border-cyan-800/20 flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      Request Demo
                    </Link>
                  </motion.div>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden" data-header-menu>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg bg-black/10 border border-gray-600/30 text-gray-300 hover:text-cyan-200 transition-all duration-300 backdrop-blur-sm"
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
              className="lg:hidden bg-black/90 backdrop-blur-2xl border-t border-cyan-800/20"
              data-header-menu
            >
              <div className="px-4 py-6 space-y-2">
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
                        className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg font-medium text-base transition-all duration-300 backdrop-blur-sm ${
                          isActive
                            ? 'text-cyan-300 bg-cyan-900/20 border border-cyan-700/30'
                            : 'text-gray-300 hover:text-cyan-200 hover:bg-black/20'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {item.name}
                      </Link>
                    </motion.div>
                  );
                })}
                
                <div className="pt-4 border-t border-cyan-800/20 space-y-3">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 bg-black/50 rounded-lg border border-cyan-800/20 backdrop-blur-sm">
                        <p className="text-white text-sm font-medium">
                          {getDisplayName(user)}
                        </p>
                        <p className="text-cyan-300 text-xs font-light">
                          {getUserStatus(user)}
                        </p>
                        {user?.email && (
                          <p className="text-gray-400 text-xs mt-1 truncate">
                            {user.email}
                          </p>
                        )}
                      </div>
                      
                      {userMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.name}
                            to={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 w-full px-4 py-3 text-gray-300 hover:text-cyan-200 font-medium text-base transition-all duration-300 backdrop-blur-sm hover:bg-black/20 rounded-lg"
                          >
                            <Icon className="w-4 h-4" />
                            {item.name}
                          </Link>
                        );
                      })}
                      
                      <button
                        onClick={handleLogout}
                        disabled={isLoading}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:text-red-300 font-medium text-base transition-all duration-300 backdrop-blur-sm hover:bg-red-500/10 rounded-lg disabled:opacity-50"
                      >
                        <LogOut className="w-4 h-4" />
                        {isLoading ? 'Signing Out...' : 'Sign Out'}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full text-center px-4 py-3 text-gray-300 hover:text-cyan-200 font-medium text-base transition-all duration-300 backdrop-blur-sm hover:bg-black/20 rounded-lg border border-gray-600/30"
                      >
                        Login
                      </Link>
                      <motion.div whileTap={{ scale: 0.95 }}>
                        <Link
                          to="/register"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block w-full text-center px-4 py-3 bg-gradient-to-r from-cyan-900/80 to-cyan-800/80 text-white font-medium text-base rounded-lg hover:from-cyan-900 hover:to-cyan-800 transition-all duration-300 shadow-lg shadow-cyan-900/30 backdrop-blur-sm border border-cyan-800/20 flex items-center justify-center gap-2"
                        >
                          <Shield className="w-4 h-4" />
                          Request Demo
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