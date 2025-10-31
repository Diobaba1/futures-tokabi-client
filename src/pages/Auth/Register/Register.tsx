// src/pages/Register.tsx
import React, { useState } from 'react';
import { useAuth } from '../../../components/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { RegisterRequest } from '../../../types';
import { motion } from 'framer-motion';
import { useToast } from '../../../components/ui/Toast';

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterRequest>({ email: '', full_name: '', password: '' });
  const { register, isLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData);
      showToast('Registration successful! Redirecting...', 'success', 3000);
      navigate('/dashboard');
    } catch (err: any) {
      let errorMsg = 'Registration failed';
      if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) {
          errorMsg = err.response.data.detail.map((e: any) => e.msg).join(', ');
        } else {
          errorMsg = err.response.data.detail;
        }
      }
      showToast(errorMsg, 'error', 5000);
    }
  };

  return (
    <div className=" py-8 min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
        >
          <source src="https://res.cloudinary.com/deioo5lrm/video/upload/v1761910590/86786-594417043_spgl4w.mp4" type="video/mp4" />
          {/* Fallback gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-cyan-900/20 to-gray-900"></div>
        </video>
        {/* Video overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>
      </div>

      {/* Animated Orbs - Reduced opacity for video */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.08, 0.05]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute top-10 left-10 w-64 h-64 bg-yellow-600 rounded-full mix-blend-soft-light filter blur-xl"
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.08, 0.05, 0.08]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 2
        }}
        className="absolute top-10 right-10 w-64 h-64 bg-green-600 rounded-full mix-blend-soft-light filter blur-xl"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.05, 0.1, 0.05]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 4
        }}
        className="absolute bottom-10 left-20 w-64 h-64 bg-blue-600 rounded-full mix-blend-soft-light filter blur-xl"
      />

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

      <div className="max-w-md w-full space-y-8 relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="mx-auto w-16 h-16  rounded-2xl flex items-center justify-center shadow-lg mb-6 backdrop-blur-sm"
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </motion.div>
          <h2 className="text-4xl font-light tracking-tight text-white mb-3">
            Create Account
          </h2>
          <p className="text-gray-300 text-base font-normal leading-relaxed tracking-wide">
            Join our institutional trading platform and begin your professional journey
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-8 space-y-6 bg-gray-800/40 backdrop-blur-lg border border-gray-700/30 rounded-2xl shadow-2xl p-8"
          onSubmit={handleSubmit}
        >
          <div className="space-y-5">
            {/* Full Name Field */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Enter your full name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
                className="block w-full pl-10 pr-4 py-3.5 bg-gray-700/30 border border-gray-600/30 rounded-xl placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent transition-all duration-200 backdrop-blur-sm font-light tracking-wide"
              />
            </motion.div>

            {/* Email Field */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative"
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="block w-full pl-10 pr-4 py-3.5 bg-gray-700/30 border border-gray-600/30 rounded-xl placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-200 backdrop-blur-sm font-light tracking-wide"
              />
            </motion.div>

            {/* Password Field */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative"
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type="password"
                placeholder="Create secure password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="block w-full pl-10 pr-4 py-3.5 bg-gray-700/30 border border-gray-600/30 rounded-xl placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent transition-all duration-200 backdrop-blur-sm font-light tracking-wide"
              />
            </motion.div>
          </div>

          {/* Terms Agreement */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-start space-x-3"
          >
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="mt-1 w-4 h-4 text-cyan-500 focus:ring-cyan-500 border-gray-600 rounded bg-gray-700/50"
            />
            <label htmlFor="terms" className="text-sm text-gray-300 font-light tracking-wide leading-relaxed">
              I agree to the{' '}
              <a href="/terms" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 font-normal">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 font-normal">
                Privacy Policy
              </a>
            </label>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            type="submit"
            disabled={isLoading}
            className="group relative w-full py-4 px-4 border border-transparent text-base font-medium rounded-xl text-gray-900 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-cyan-500/25 backdrop-blur-sm"
          >
            <span className="relative z-10 flex items-center justify-center tracking-wide">
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                'Create Professional Account'
              )}
            </span>
          </motion.button>

          {/* Divider */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="relative"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-gray-800/40 text-gray-400 font-light tracking-wide">Already registered?</span>
            </div>
          </motion.div>

          {/* Login Link */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center"
          >
            <Link 
              to="/login" 
              className="inline-flex items-center px-6 py-3 border border-gray-600/50 text-base font-normal rounded-xl text-gray-300 bg-gray-700/30 hover:bg-gray-700/50 hover:text-white transition-all duration-200 hover:border-gray-500/50 backdrop-blur-sm tracking-wide"
            >
              Access existing account
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </motion.div>
        </motion.form>

        {/* Security Notice */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="text-center"
        >
          <p className="text-gray-400 text-xs font-light flex items-center justify-center space-x-2 tracking-wide">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Bank-level encryption & enterprise security protocols</span>
          </p>
        </motion.div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent"></div>
    </div>
  );
};

export default Register;