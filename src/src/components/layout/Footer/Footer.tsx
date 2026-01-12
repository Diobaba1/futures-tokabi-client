// src/components/Layout/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Mail, ArrowRight } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Platform',
      links: [
        { name: 'Trading Features', href: '#features' },
        { name: 'Security', href: '#security' },
        { name: 'API Documentation', href: '/docs' },
        { name: 'System Status', href: '/status' },
        { name: 'Release Notes', href: '/changelog' },
      ],
    },
    {
      title: 'Solutions',
      links: [
        { name: 'Institutional Trading', href: '/institutional' },
        { name: 'Hedge Funds', href: '/hedge-funds' },
        { name: 'Family Offices', href: '/family-offices' },
        { name: 'Asset Managers', href: '/asset-managers' },
        { name: 'Broker-Dealers', href: '/broker-dealers' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', href: '/docs' },
        { name: 'Trading Academy', href: '/academy' },
        { name: 'Market Insights', href: '/insights' },
        { name: 'Integration Partners', href: '/partners' },
        { name: 'Webinars', href: '/webinars' },
      ],
    },
    {
      title: 'Enterprise',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Compliance', href: '/compliance' },
        { name: 'Careers', href: '/careers' },
        { name: 'Legal', href: '/legal' },
        { name: 'Contact Sales', href: '/contact' },
      ],
    },
  ];

  const socialLinks = [
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/tokabi',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: 'GitHub',
      href: 'https://github.com/tokabi',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.337-3.369-1.337-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.022.8-.223 1.65-.334 2.5-.338.85.004 1.7.115 2.5.338 1.91-1.291 2.75-1.022 2.75-1.022.544 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.335-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
        </svg>
      ),
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/tokabi',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ),
    },
  ];

  const complianceBadges = [
    { name: 'SOC 2 Type II', description: 'Security Compliance' },
    { name: 'ISO 27001', description: 'Information Security' },
    { name: 'GDPR Compliant', description: 'Data Protection' },
    { name: 'AES-256 Encryption', description: 'Bank-Level Security' },
  ];

  return (
    <footer className="bg-gray-950 border-t border-gray-800/30">
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
              <div className="w-12 h-12 bg-gradient-to-br rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-light text-2xl tracking-tight">TOKABI</span>
                <span className="text-cyan-400 text-sm font-medium tracking-wider">ALGORITHMIC TRADING</span>
              </div>
            </Link>
            
            <p className="text-gray-400 text-base mb-6 max-w-md font-light leading-relaxed">
              Institutional-grade algorithmic trading platform providing advanced AI-driven 
              solutions for professional traders and financial institutions.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-gray-800/30 border border-gray-700/30 rounded-lg text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-200"
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
              <h3 className="text-white font-semibold text-base mb-4 tracking-tight">{section.title}</h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 text-sm font-light"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Compliance & Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-gray-800/30"
        >
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
            {/* Compliance Badges */}
            <div className="flex-1">
              <h4 className="text-white font-semibold text-sm mb-4 tracking-wider">COMPLIANCE & SECURITY</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {complianceBadges.map((badge, index) => (
                  <motion.div
                    key={badge.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex flex-col p-3 bg-gray-800/20 border border-gray-700/30 rounded-lg"
                  >
                    <div className="text-cyan-400 font-medium text-sm">{badge.name}</div>
                    <div className="text-gray-500 text-xs font-light mt-1">{badge.description}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex-1 max-w-md"
            >
              <h4 className="text-white font-semibold text-sm mb-4 tracking-wider">MARKET INSIGHTS</h4>
              <p className="text-gray-400 text-sm mb-4 font-light">
                Receive institutional-grade market analysis and trading insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    placeholder="Enter professional email"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-800/30 border border-gray-700/30 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors duration-200 font-light"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium text-sm rounded-lg hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-cyan-500/25 flex items-center gap-2 whitespace-nowrap"
                >
                  Subscribe
                  <ArrowRight className="w-3 h-3" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="text-gray-500 text-sm font-light">
              © {currentYear} Tokabi Algorithmic Trading. All rights reserved.
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <Link to="/privacy" className="text-gray-500 hover:text-cyan-400 transition-colors duration-200 font-light">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-500 hover:text-cyan-400 transition-colors duration-200 font-light">
                Terms of Service
              </Link>
              <Link to="/compliance" className="text-gray-500 hover:text-cyan-400 transition-colors duration-200 font-light">
                Compliance
              </Link>
              <div className="flex items-center gap-2 text-emerald-400">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                <span className="text-xs font-medium">Systems Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;