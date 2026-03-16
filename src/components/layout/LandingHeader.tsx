// src/components/layout/LandingHeader.tsx
// Clean, professional header for landing pages - Tokabi Brand with Theme Toggle
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TokabiFull } from '../brand/TokabiFull';
import {
  Menu,
  X,
  ArrowRight,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const LandingHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Escape key handler
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Navigation items matching PDF spec
  const navigation = [
    { name: 'About', href: '/about' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Spatial Intelligence', href: '/spatial-intelligence' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'FAQ', href: '/faq' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 dark:bg-dark-base/95 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-dark-border'
            : 'bg-white/80 dark:bg-dark-base/80 backdrop-blur-sm'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-shrink-0"
            >
              <Link to="/" className="flex items-center group">
                <TokabiFull className="h-8 text-cyan-900 dark:text-white" />
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      isActive
                        ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-600/5 dark:bg-cyan-400/10'
                        : 'text-tokabi-secondary dark:text-gray-400 hover:text-tokabi-primary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-dark-elevated'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Desktop CTA & Theme Toggle */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-2.5 rounded-lg bg-gray-100 dark:bg-dark-elevated text-tokabi-secondary dark:text-cyan-400 hover:bg-gray-200 dark:hover:bg-dark-surface transition-all"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </motion.button>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="px-5 py-2.5 text-tokabi-secondary dark:text-gray-400 hover:text-tokabi-primary dark:hover:text-white font-medium text-sm transition-all"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="px-5 py-2.5 text-tokabi-secondary dark:text-gray-400 hover:text-tokabi-primary dark:hover:text-white font-medium text-sm transition-all disabled:opacity-50"
                  >
                    {isLoading ? 'Signing Out...' : 'Sign Out'}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-5 py-2.5 text-tokabi-secondary dark:text-gray-400 hover:text-tokabi-primary dark:hover:text-white font-medium text-sm transition-all"
                  >
                    Sign In
                  </Link>
                  <Link to="/register">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className="group px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white font-semibold text-sm rounded-btn shadow-btn-cyan hover:from-cyan-700 hover:to-cyan-800 transition-all duration-300 flex items-center gap-2"
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </motion.button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button & Theme Toggle */}
            <div className="lg:hidden flex items-center space-x-2" ref={mobileMenuRef}>
              {/* Mobile Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-dark-elevated text-tokabi-secondary dark:text-cyan-400 transition-all"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-tokabi-secondary dark:text-gray-400 hover:text-tokabi-primary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-dark-elevated transition-all"
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>

              {/* Mobile Dropdown */}
              <AnimatePresence>
                {isMobileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 bg-white dark:bg-dark-base border-b border-gray-100 dark:border-dark-border shadow-lg"
                  >
                    <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
                      {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                          <Link
                            key={item.name}
                            to={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`block px-4 py-3 rounded-lg font-medium text-base transition-all ${
                              isActive
                                ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-600/5 dark:bg-cyan-400/10'
                                : 'text-tokabi-secondary dark:text-gray-400 hover:text-tokabi-primary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-dark-elevated'
                            }`}
                          >
                            {item.name}
                          </Link>
                        );
                      })}

                      <div className="pt-4 mt-4 border-t border-gray-100 dark:border-dark-border space-y-2">
                        {isAuthenticated ? (
                          <>
                            <Link
                              to="/dashboard"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block px-4 py-3 rounded-lg font-medium text-tokabi-secondary dark:text-gray-400 hover:text-tokabi-primary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-dark-elevated transition-all"
                            >
                              Dashboard
                            </Link>
                            <button
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                handleLogout();
                              }}
                              disabled={isLoading}
                              className="block w-full text-left px-4 py-3 rounded-lg font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-50"
                            >
                              {isLoading ? 'Signing Out...' : 'Sign Out'}
                            </button>
                          </>
                        ) : (
                          <>
                            <Link
                              to="/login"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block px-4 py-3 rounded-lg font-medium text-tokabi-secondary dark:text-gray-400 hover:text-tokabi-primary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-dark-elevated transition-all"
                            >
                              Sign In
                            </Link>
                            <Link
                              to="/register"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block px-4 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white font-semibold text-center rounded-lg hover:from-cyan-700 hover:to-cyan-800 transition-all"
                            >
                            Sign Up
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </nav>
      </header>

      {/* Header Spacer */}
      <div className="h-16 lg:h-20" />
    </>
  );
};

export default LandingHeader;
