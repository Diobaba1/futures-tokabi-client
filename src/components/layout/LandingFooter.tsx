// src/components/layout/LandingFooter.tsx
// Clean, professional footer for landing pages - Tokabi Brand with Theme Support
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Mail } from 'lucide-react';

interface FooterLink {
  name: string;
  href: string;
  comingSoon?: boolean;
  isEmail?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const LandingFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections: FooterSection[] = [
    {
      title: 'Product',
      links: [
        { name: 'How It Works', href: '/how-it-works' },
        { name: 'Spatial Intelligence', href: '/spatial-intelligence' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'FAQ', href: '/faq' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About', href: '/about' },
        { name: 'Blog', href: '#', comingSoon: true },
        { name: 'Careers', href: '#', comingSoon: true },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'support@tokabi.com', href: 'mailto:support@tokabi.com', isEmail: true },
        { name: 'Documentation', href: '#', comingSoon: true },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
      ],
    },
  ];

  return (
    <footer className="bg-white dark:bg-dark-base border-t border-gray-100 dark:border-dark-border transition-colors duration-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-cyan-800 rounded-xl flex items-center justify-center shadow-md shadow-cyan-700/20">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-tokabi-primary dark:text-white tracking-tight">
                TOKABI
              </span>
            </Link>

            <p className="text-tokabi-secondary dark:text-gray-400 text-base max-w-sm leading-relaxed">
              Market intelligence for disciplined execution.
            </p>
          </div>

          {/* Navigation Sections */}
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-tokabi-primary dark:text-white font-semibold text-sm uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    {link.comingSoon ? (
                      <span className="text-gray-400 dark:text-gray-500 text-sm flex items-center gap-2">
                        {link.name}
                        <span className="text-xs bg-gray-100 dark:bg-dark-elevated text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
                          coming soon
                        </span>
                      </span>
                    ) : link.isEmail ? (
                      <a
                        href={link.href}
                        className="text-tokabi-secondary dark:text-gray-400 hover:text-cyan-700 dark:hover:text-cyan-400 transition-colors duration-200 text-sm flex items-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-tokabi-secondary dark:text-gray-400 hover:text-cyan-700 dark:hover:text-cyan-400 transition-colors duration-200 text-sm"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-tokabi-secondary dark:text-gray-400 text-sm">
              © {currentYear} Tokabi. All rights reserved.
            </p>

            <div className="flex items-center gap-6 text-sm">
              <Link
                to="/terms"
                className="text-tokabi-secondary dark:text-gray-400 hover:text-cyan-700 dark:hover:text-cyan-400 transition-colors duration-200"
              >
                Terms
              </Link>
              <Link
                to="/privacy"
                className="text-tokabi-secondary dark:text-gray-400 hover:text-cyan-700 dark:hover:text-cyan-400 transition-colors duration-200"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
