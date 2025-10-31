// src/components/Layout/Header.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, TrendingUp, Shield } from 'lucide-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '#features' },
    { name: 'Security', href: '#security' },
    { name: 'Pricing', href: '#pricing' },
  ];

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      // Handle smooth scroll for anchor links
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
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-gray-900/95 backdrop-blur-xl border-b border-gray-800/50'
            : 'bg-gray-900/80 backdrop-blur-lg border-b border-gray-800/30'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex-shrink-0 flex items-center"
            >
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-br rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/40 transition-all duration-300">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-light text-xl tracking-tight">TOKABI</span>
                  <span className="text-cyan-400 text-xs font-medium tracking-wider">ALGORITHMIC TRADING</span>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || 
                                (location.hash === item.href && location.pathname === '/');
                return (
                  <motion.div key={item.name} whileHover={{ y: -1 }}>
                    <button
                      onClick={() => handleNavClick(item.href)}
                      className={`relative px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                        isActive
                          ? 'text-cyan-400'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      {item.name}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute inset-0 bg-cyan-500/10 border border-cyan-500/20 rounded-lg -z-10"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              <Link
                to="/login"
                className="px-6 py-2.5 text-gray-300 hover:text-white font-medium text-sm transition-colors duration-200 hover:bg-gray-800/50 rounded-lg"
              >
                Client Login
              </Link>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/register"
                  className="px-6 py-2.5 bg-gradient-to-r from-yellow-500 to-ywllo-500 text-white font-medium text-sm rounded-lg hover:from-yellow-400 hover:to-yellow-400 transition-all duration-300 shadow-lg shadow-yellow-500/25 flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Start Institutional Trial
                </Link>
              </motion.div>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:text-white transition-colors duration-200"
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
              className="lg:hidden bg-gray-900/95 backdrop-blur-xl border-t border-gray-800/50"
            >
              <div className="px-4 py-6 space-y-2">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href || 
                                  (location.hash === item.href && location.pathname === '/');
                  return (
                    <motion.button
                      key={item.name}
                      onClick={() => handleNavClick(item.href)}
                      className={`block w-full text-left px-4 py-3 rounded-lg font-medium text-base transition-all duration-200 ${
                        isActive
                          ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20'
                          : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                      }`}
                    >
                      {item.name}
                    </motion.button>
                  );
                })}
                <div className="pt-4 border-t border-gray-800/50 space-y-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-3 text-gray-300 hover:text-white font-medium text-base transition-colors duration-200 hover:bg-gray-800/50 rounded-lg"
                  >
                    Client Login
                  </Link>
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-center px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium text-base rounded-lg hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      Start Trial
                    </Link>
                  </motion.div>
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