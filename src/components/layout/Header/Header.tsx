// src/components/Layout/Header.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TokabiFull } from '../../brand/TokabiFull';
import {
  Menu,
  X,
  TrendingUp,
  User,
  LogOut,
  Settings,
  Briefcase,
  BarChart3,
  ChevronDown,
  Sparkles,
  Shield,
  Zap,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { UserResponse } from '../../../types';
import GoogleTranslator from '../../GoogleTranslator';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isHoveringUser, setIsHoveringUser] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Enhanced scroll handler with throttle
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setIsScrolled(scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Enhanced click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        setIsMobileMenuOpen(false);
      }
      
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Keyboard navigation
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
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
    { 
      name: 'Features', 
      href: '/features', 
      icon: BarChart3,
      description: 'Advanced trading tools'
    },
    { 
      name: 'Community', 
      href: '/community', 
      icon: Briefcase,
      description: 'Join our traders'
    },
    { 
      name: 'Pricing', 
      href: '/pricing', 
      icon: Zap,
      description: 'Choose your plan'
    }
  ];

  const userMenuItems = [
    { name: 'Trading Desk', href: '/dashboard', icon: BarChart3, description: 'Start trading' },
    { name: 'Billing', href: '/dashboard/billing', icon: CreditCard, description: 'Manage subscription' },
    { name: 'Account Settings', href: '/dashboard/settings', icon: Settings, description: 'Manage account' },
    { name: 'Security', href: '/dashboard/settings/security', icon: Shield, description: 'Privacy & security' },
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
    if (user.is_subscribed) return 'from-purple-500 to-purple-600';
    if (user.is_verified) return 'from-emerald-500 to-emerald-600';
    return 'from-cyan-500 to-blue-500';
  };

  const getStatusIcon = (user: UserResponse | null) => {
    if (!user) return Sparkles;
    if (user.is_subscribed) return Zap;
    if (user.is_verified) return Shield;
    return Sparkles;
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-gray-950/95 backdrop-blur-2xl border-b border-cyan-500/20 shadow-2xl shadow-cyan-500/10'
            : 'bg-gray-950/60 backdrop-blur-xl border-b border-cyan-500/10'
        }`}
      >
        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/5 to-blue-500/10 pointer-events-none" />
        
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Enhanced Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="flex-shrink-0 flex items-center relative z-10"
            >
              <Link
                to="/"
                className="flex items-center space-x-3 group"
                aria-label="TOKABI Home"
              >
                <TokabiFull className="h-9 text-cyan-900" />
              </Link>
            </motion.div>

            {/* Enhanced Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1 relative z-10">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                return (
                  <motion.div 
                    key={item.name} 
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative"
                  >
                    <Link
                      to={item.href}
                      className={`relative px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 backdrop-blur-xl group overflow-hidden ${
                        isActive
                          ? 'text-white bg-gradient-to-r from-cyan-500/20 via-cyan-600/20 to-blue-600/20 border border-cyan-400/40 shadow-lg shadow-cyan-500/20'
                          : 'text-gray-300 hover:text-white hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20'
                      }`}
                    >
                      <motion.div 
                        className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent ${
                          isActive ? 'opacity-100' : 'opacity-0'
                        }`}
                        whileHover={{ x: ['0%', '200%'] }}
                        transition={{ duration: 0.8 }}
                      />
                      <Icon className={`w-4 h-4 relative z-10 ${isActive ? 'text-cyan-400' : 'text-gray-400'}`} />
                      <span className="relative z-10">{item.name}</span>
                      
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Enhanced Desktop CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-3 relative z-10">
              {/* Enhanced Google Translator */}
              <div className="mr-2">
                <GoogleTranslator />
              </div>

              {isAuthenticated ? (
                <>
                  {/* Enhanced User Menu */}
                  <div 
                    className="relative" 
                    ref={userMenuRef}
                    onMouseEnter={() => setIsHoveringUser(true)}
                    onMouseLeave={() => setIsHoveringUser(false)}
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-gray-800/50 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 backdrop-blur-xl group shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20"
                      aria-expanded={isUserMenuOpen}
                      aria-haspopup="true"
                    >
                      <div className={`w-9 h-9 bg-gradient-to-br ${getStatusColor(user)} rounded-lg flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-lg relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
                        <User className="w-5 h-5 text-white relative z-10" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-white text-sm font-semibold">
                          {getDisplayName(user)}
                        </span>
                        <span className="text-cyan-400 text-xs font-light flex items-center gap-1">
                          {getUserStatus(user)}
                          {React.createElement(getStatusIcon(user), { className: "w-3 h-3" })}
                        </span>
                      </div>
                      <motion.div
                        animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-4 h-4 text-cyan-400" />
                      </motion.div>
                    </motion.button>

                    <AnimatePresence>
                      {(isUserMenuOpen || isHoveringUser) && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 top-full mt-2 w-80 bg-gray-900/95 backdrop-blur-2xl border border-cyan-500/20 rounded-2xl shadow-2xl shadow-cyan-500/20 py-2 overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-blue-500/5 pointer-events-none" />
                          
                          {/* User Info Section */}
                          <div className="px-4 py-4 border-b border-cyan-500/20 relative">
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
                                  {React.createElement(getStatusIcon(user), { className: "w-3 h-3" })}
                                </p>
                                <p className="text-gray-400 text-xs truncate mt-0.5">
                                  {user?.email}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Menu Items */}
                          <div className="py-2">
                            {userMenuItems.map((item, index) => {
                              const Icon = item.icon;
                              return (
                                <motion.div
                                  key={item.name}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                >
                                  <Link
                                    to={item.href}
                                    onClick={() => setIsUserMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-cyan-500/10 transition-all duration-200 group"
                                  >
                                    <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/20 transition-all">
                                      <Icon className="w-4 h-4 text-cyan-400" />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="font-medium text-sm">{item.name}</span>
                                      <span className="text-gray-400 text-xs">{item.description}</span>
                                    </div>
                                  </Link>
                                </motion.div>
                              );
                            })}
                          </div>
                          
                          {/* Logout Section */}
                          <div className="border-t border-cyan-500/20 pt-2">
                            <motion.button
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 }}
                              onClick={handleLogout}
                              disabled={isLoading}
                              className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 disabled:opacity-50 group"
                            >
                              <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center group-hover:bg-red-500/20 transition-all">
                                <LogOut className="w-4 h-4" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium text-sm text-left">
                                  {isLoading ? 'Signing Out...' : 'Sign Out'}
                                </span>
                                <span className="text-red-400/70 text-xs">End your session</span>
                              </div>
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Enhanced Quick Dashboard Button */}
                  <motion.div 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                    className="relative"
                  >
                    <Link
                      to="/dashboard"
                      className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 via-cyan-600 to-blue-600 text-white font-medium text-sm rounded-xl hover:from-cyan-400 hover:via-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-500/40 hover:shadow-cyan-500/60 backdrop-blur-xl border border-cyan-400/30 flex items-center gap-2 relative overflow-hidden group"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.6 }}
                      />
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
                      Sign In
                    </Link>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                    className="relative"
                  >
                    <Link
                      to="/register"
                      className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 via-cyan-600 to-blue-600 text-white font-medium text-sm rounded-xl hover:from-cyan-400 hover:via-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-500/40 hover:shadow-cyan-500/60 backdrop-blur-xl border border-cyan-400/30 flex items-center gap-2 relative overflow-hidden group"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.6 }}
                      />
                      <User className="w-4 h-4 relative z-10" />
                      <span className="relative z-10">Get Started</span>
                    </Link>
                  </motion.div>
                </>
              )}
            </div>

            {/* Enhanced Mobile menu button */}
            <div className="lg:hidden flex items-center gap-3 relative z-10" ref={mobileMenuRef}>
              {/* Mobile Translator */}
              <div className="scale-90">
                <GoogleTranslator />
              </div>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 rounded-xl bg-gray-800/50 border border-cyan-500/20 text-gray-300 hover:text-white hover:border-cyan-400/40 transition-all duration-300 backdrop-blur-xl shadow-lg shadow-cyan-500/10"
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle menu"
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </motion.div>
              </motion.button>

              {/* Enhanced Mobile Dropdown Menu */}
              <AnimatePresence>
                {isMobileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-2xl border border-cyan-500/20 rounded-2xl shadow-2xl shadow-cyan-500/20 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-blue-500/5 pointer-events-none" />
                    
                    {/* Navigation Items */}
                    <div className="py-3">
                      {navigation.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.href;
                        return (
                          <motion.div
                            key={item.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Link
                              to={item.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={`flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-cyan-500/10 transition-all duration-200 group ${
                                isActive ? 'bg-cyan-500/10 text-white' : ''
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                isActive 
                                  ? 'bg-cyan-500/20 text-cyan-400' 
                                  : 'bg-cyan-500/10 group-hover:bg-cyan-500/20 text-cyan-400/70'
                              }`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium text-sm">{item.name}</span>
                                <span className="text-gray-400 text-xs">{item.description}</span>
                              </div>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Auth Section */}
                    <div className="border-t border-cyan-500/20 pt-2">
                      {isAuthenticated ? (
                        <>
                          {/* User Info */}
                          <div className="px-4 py-3 border-b border-cyan-500/20">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 bg-gradient-to-br ${getStatusColor(user)} rounded-xl flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-lg`}>
                                <User className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-semibold truncate">
                                  {getDisplayName(user)}
                                </p>
                                <p className="text-cyan-400 text-xs flex items-center gap-1">
                                  {getUserStatus(user)}
                                  {React.createElement(getStatusIcon(user), { className: "w-3 h-3" })}
                                </p>
                              </div>
                            </div>
                          </div>

                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            <Link
                              to="/dashboard"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-cyan-500/10 transition-all duration-200 group"
                            >
                              <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/20 transition-all">
                                <BarChart3 className="w-4 h-4 text-cyan-400" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium text-sm">Trading Desk</span>
                                <span className="text-gray-400 text-xs">Start trading</span>
                              </div>
                            </Link>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.35 }}
                          >
                            <Link
                              to="/dashboard/billing"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-cyan-500/10 transition-all duration-200 group"
                            >
                              <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/20 transition-all">
                                <CreditCard className="w-4 h-4 text-cyan-400" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium text-sm">Billing</span>
                                <span className="text-gray-400 text-xs">Manage subscription</span>
                              </div>
                            </Link>
                          </motion.div>

                          <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            onClick={handleLogout}
                            disabled={isLoading}
                            className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 disabled:opacity-50 group"
                          >
                            <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center group-hover:bg-red-500/20 transition-all">
                              <LogOut className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-sm text-left">
                                {isLoading ? 'Signing Out...' : 'Sign Out'}
                              </span>
                              <span className="text-red-400/70 text-xs">End your session</span>
                            </div>
                          </motion.button>
                        </>
                      ) : (
                        <>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            <Link
                              to="/login"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-cyan-500/10 transition-all duration-200 group"
                            >
                              <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/20 transition-all">
                                <User className="w-4 h-4 text-cyan-400" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium text-sm">Sign In</span>
                                <span className="text-gray-400 text-xs">Access your account</span>
                              </div>
                            </Link>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                          >
                            <Link
                              to="/register"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all duration-200 group"
                            >
                              <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/30 transition-all">
                                <Sparkles className="w-4 h-4" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium text-sm">Get Started</span>
                                <span className="text-cyan-400/70 text-xs">Create your account</span>
                              </div>
                            </Link>
                          </motion.div>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Header Spacer */}
      <div className="h-16 lg:h-20" />
    </>
  );
};

export default Header;