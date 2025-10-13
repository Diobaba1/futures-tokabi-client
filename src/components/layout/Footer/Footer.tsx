// src/components/Layout/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '/features' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'API Documentation', href: '/docs' },
        { name: 'Changelog', href: '/changelog' },
        { name: 'Status', href: '/status' },
      ],
    },
    {
      title: 'Solutions',
      links: [
        { name: 'Enterprise', href: '/enterprise' },
        { name: 'Institutional', href: '/institutional' },
        { name: 'Hedge Funds', href: '/hedge-funds' },
        { name: 'Family Offices', href: '/family-offices' },
        { name: 'Brokerages', href: '/brokerages' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', href: '/docs' },
        { name: 'Help Center', href: '/help' },
        { name: 'Community', href: '/community' },
        { name: 'Partners', href: '/partners' },
        { name: 'Events', href: '/events' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Legal', href: '/legal' },
        { name: 'Privacy', href: '/privacy' },
        { name: 'Security', href: '/security' },
      ],
    },
  ];

  const socialLinks = [
    {
      name: 'Twitter',
      href: 'https://twitter.com/tokabi',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ),
    },
    {
      name: 'GitHub',
      href: 'https://github.com/tokabi',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.337-3.369-1.337-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.022.8-.223 1.65-.334 2.5-.338.85.004 1.7.115 2.5.338 1.91-1.291 2.75-1.022 2.75-1.022.544 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.335-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/tokabi',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: 'Discord',
      href: 'https://discord.gg/tokabi',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.317 4.37a19.791 19.791 0 01-5.16 1.58 13.28 13.28 0 00-2.157-2.43c-.27-.24-.56-.46-.86-.68a19.71 19.71 0 00-5.16-1.58 1.52 1.52 0 00-1.64 1.72c.14 1.81.42 3.63.81 5.41a19.76 19.76 0 01-6.59 3.15 1.53 1.53 0 00-.75 2.61c3.89 3.51 8.13 5.81 12.57 7.23a16.31 16.31 0 003.69.45 16.5 16.5 0 003.57-.45 1.52 1.52 0 001-1.72c-.14-1.81-.42-3.63-.81-5.41a19.8 19.8 0 016.59-3.15 1.53 1.53 0 00.75-2.61c-3.89-3.51-8.13-5.81-12.57-7.23a16.3 16.3 0 00-3.69-.45 16.5 16.5 0 00-3.57.45 1.52 1.52 0 00-1 1.72c.14 1.81.42 3.63.81 5.41zM8.02 15.33c-.95 0-1.72-.86-1.72-1.92s.77-1.92 1.72-1.92 1.72.86 1.72 1.92-.77 1.92-1.72 1.92zm7.98 0c-.95 0-1.72-.86-1.72-1.92s.77-1.92 1.72-1.92 1.72.86 1.72 1.92-.77 1.92-1.72 1.92z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-gray-900 border-t border-gray-800/50">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/25">
                <span className="text-gray-900 font-bold text-xl">T</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-2xl tracking-tight">TOKABI</span>
                <span className="text-yellow-400 text-sm font-medium tracking-wider">ENTERPRISE</span>
              </div>
            </Link>
            
            <p className="text-gray-400 text-lg mb-6 max-w-md">
              Institutional-grade AI trading platform trusted by professional traders and financial institutions worldwide.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-400 hover:text-yellow-400 hover:border-yellow-500/30 transition-all duration-200"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Navigation Sections */}
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <h3 className="text-white font-bold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-yellow-400 transition-colors duration-200 text-base"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Security Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-gray-800/50"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
            <div className="flex flex-wrap items-center justify-center gap-6">
              {[
                { name: 'SOC 2 Type II', icon: '🛡️' },
                { name: 'ISO 27001', icon: '🔒' },
                { name: 'GDPR Compliant', icon: '🌐' },
                { name: '256-bit SSL', icon: '🔑' },
              ].map((badge, index) => (
                <motion.div
                  key={badge.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-800/30 border border-gray-700/30 rounded-lg"
                >
                  <span className="text-yellow-400">{badge.icon}</span>
                  <span className="text-gray-300 text-sm font-medium">{badge.name}</span>
                </motion.div>
              ))}
            </div>

            {/* Newsletter Signup */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3"
            >
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500/50 transition-colors duration-200 w-64"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-bold rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 shadow-lg shadow-yellow-500/25"
              >
                Subscribe
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} Tokabi Enterprise. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-yellow-400 transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-yellow-400 transition-colors duration-200">
                Terms of Service
              </Link>
              <Link to="/security" className="text-gray-400 hover:text-yellow-400 transition-colors duration-200">
                Security
              </Link>
              <div className="flex items-center space-x-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;