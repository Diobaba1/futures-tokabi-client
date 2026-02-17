// ============================================================================
// FILE: src/pages/Register.tsx (WITH DEBUGGING & FIXES)
// ============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../components/contexts/AuthContext';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { RegisterRequest } from '../../../types';
import { motion } from 'framer-motion';
import { useToast } from '../../../components/ui/Toast';

interface RegisterFormData extends RegisterRequest {
  referral_code?: string;
}

const Register: React.FC = () => {
  const [searchParams] = useSearchParams();
  const refParam = searchParams.get('ref');
  
  // ✅ DEBUG: Log the referral parameter
  useEffect(() => {
    console.log('🔍 DEBUG: URL Search Params:', searchParams.toString());
    console.log('🔍 DEBUG: Referral Param:', refParam);
  }, [searchParams, refParam]);
  
  const [formData, setFormData] = useState<RegisterFormData>({ 
    email: '', 
    full_name: '', 
    password: '',
    referral_code: refParam || '' // ✅ Initialize with URL param
  });
  
  const [hasShownReferralToast, setHasShownReferralToast] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedRisk, setAgreedRisk] = useState(false);
  const [agreedPlatform, setAgreedPlatform] = useState(false);
  const allAgreed = useMemo(() => agreedTerms && agreedRisk && agreedPlatform, [agreedTerms, agreedRisk, agreedPlatform]);

  const { register, isLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Show success message if referral code is detected (only once)
  useEffect(() => {
    if (refParam && !hasShownReferralToast) {
      showToast(`Referral code "${refParam}" applied!`, 'success', 3000);
      setHasShownReferralToast(true);
    }
  }, [refParam, hasShownReferralToast, showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clean up the data before sending - remove empty referral code
    const dataToSend = {
      email: formData.email,
      full_name: formData.full_name,
      password: formData.password,
      // Only include referral_code if it's not empty
      ...(formData.referral_code?.trim() && { referral_code: formData.referral_code.trim() })
    };

    // ✅ DEBUG: Log what we're sending
    console.log('🚀 Submitting registration with data:', {
      ...dataToSend,
      password: '****' // Don't log actual password
    });

    try {
      await register(dataToSend);
      showToast('Registration successful! Redirecting...', 'success', 3000);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('❌ Registration error:', err);

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
    <div className="py-8 min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden">
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
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-cyan-900/20 to-gray-900"></div>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>
      </div>

      {/* Animated Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.06, 0.1, 0.06]
        }}
        transition={{ 
          duration: 7,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute top-10 left-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-soft-light filter blur-3xl"
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.06, 0.1]
        }}
        transition={{ 
          duration: 9,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 2
        }}
        className="absolute top-20 right-10 w-80 h-80 bg-blue-500 rounded-full mix-blend-soft-light filter blur-3xl"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.05, 0.12, 0.05]
        }}
        transition={{ 
          duration: 11,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 4
        }}
        className="absolute bottom-10 left-1/4 w-96 h-96 bg-cyan-400 rounded-full mix-blend-soft-light filter blur-3xl"
      />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

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
            className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/50 mb-6 backdrop-blur-sm"
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </motion.div>
          <h2 className="text-4xl font-light tracking-tight text-white mb-3">
            Create Account
          </h2>
          <p className="text-gray-300 text-base font-normal leading-relaxed tracking-wide">
            Join our institutional trading platform
          </p>
          {refParam && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-full"
            >
              <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              <span className="text-cyan-300 text-sm font-medium">
                Referred by: {refParam}
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Form Card */}
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-8 space-y-6 bg-gray-800/50 backdrop-blur-xl border border-cyan-500/20 rounded-2xl shadow-2xl shadow-cyan-500/10 p-8"
          onSubmit={handleSubmit}
        >
          <div className="space-y-5">
            {/* Full Name Field */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative group"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-cyan-400 group-focus-within:text-cyan-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
                className="block w-full pl-12 pr-4 py-3.5 bg-gray-700/40 border border-cyan-500/20 rounded-xl placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400/60 transition-all duration-200 backdrop-blur-sm font-light tracking-wide hover:border-cyan-500/30"
              />
            </motion.div>

            {/* Email Field */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative group"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-cyan-400 group-focus-within:text-cyan-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="block w-full pl-12 pr-4 py-3.5 bg-gray-700/40 border border-cyan-500/20 rounded-xl placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400/60 transition-all duration-200 backdrop-blur-sm font-light tracking-wide hover:border-cyan-500/30"
              />
            </motion.div>

            {/* Password Field */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative group"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-cyan-400 group-focus-within:text-cyan-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={8}
                className="block w-full pl-12 pr-4 py-3.5 bg-gray-700/40 border border-cyan-500/20 rounded-xl placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400/60 transition-all duration-200 backdrop-blur-sm font-light tracking-wide hover:border-cyan-500/30"
              />
            </motion.div>

            {/* Referral Code Field */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="relative group"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-cyan-400 group-focus-within:text-cyan-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Referral Code (Optional)"
                value={formData.referral_code}
                onChange={(e) => {
                  const code = e.target.value.toUpperCase();
                  setFormData({ ...formData, referral_code: code });
                  console.log('🔍 DEBUG: Referral code updated:', code);
                }}
                className="block w-full pl-12 pr-4 py-3.5 bg-gray-700/40 border border-cyan-500/20 rounded-xl placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400/60 transition-all duration-200 backdrop-blur-sm font-light tracking-wide hover:border-cyan-500/30 uppercase"
              />
              {formData.referral_code && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </motion.div>
              )}
            </motion.div>

            {/* ✅ DEBUG: Show what will be sent */}
            {process.env.NODE_ENV === 'development' && formData.referral_code && (
              <div className="text-xs text-cyan-400 bg-cyan-500/10 p-2 rounded border border-cyan-500/20">
                <strong>DEBUG:</strong> Will send referral_code: {formData.referral_code}
              </div>
            )}
          </div>

          {/* Legal Agreements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-3 bg-cyan-500/5 p-4 rounded-lg border border-cyan-500/10"
          >
            <div className="flex items-start space-x-3">
              <input
                id="terms"
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-cyan-500 focus:ring-cyan-500 border-cyan-500/30 rounded bg-gray-700/50"
              />
              <label htmlFor="terms" className="text-sm text-gray-300 font-light tracking-wide leading-relaxed">
                I have read and agree to Tokabi's{' '}
                <a href="/terms" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 font-normal underline underline-offset-2">
                  Terms of Service
                </a>
              </label>
            </div>
            <div className="flex items-start space-x-3">
              <input
                id="risk"
                type="checkbox"
                checked={agreedRisk}
                onChange={(e) => setAgreedRisk(e.target.checked)}
                className="mt-1 w-4 h-4 text-cyan-500 focus:ring-cyan-500 border-cyan-500/30 rounded bg-gray-700/50"
              />
              <label htmlFor="risk" className="text-sm text-gray-300 font-light tracking-wide leading-relaxed">
                I understand that trading involves substantial risk of loss
              </label>
            </div>
            <div className="flex items-start space-x-3">
              <input
                id="platform"
                type="checkbox"
                checked={agreedPlatform}
                onChange={(e) => setAgreedPlatform(e.target.checked)}
                className="mt-1 w-4 h-4 text-cyan-500 focus:ring-cyan-500 border-cyan-500/30 rounded bg-gray-700/50"
              />
              <label htmlFor="platform" className="text-sm text-gray-300 font-light tracking-wide leading-relaxed">
                I confirm that Tokabi is a software platform, not an investment advisor
              </label>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            type="submit"
            disabled={isLoading || !allAgreed}
            className="group relative w-full py-4 px-4 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-cyan-500 via-cyan-600 to-blue-600 hover:from-cyan-400 hover:via-cyan-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-cyan-500/30 backdrop-blur-sm overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            <span className="relative z-10 flex items-center justify-center tracking-wide">
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </span>
          </motion.button>

          {/* Divider */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cyan-500/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-800/50 text-gray-400 font-light tracking-wide">Already have an account?</span>
            </div>
          </motion.div>

          {/* Login Link */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="text-center"
          >
            <Link 
              to="/login" 
              className="inline-flex items-center px-6 py-3 border border-cyan-500/30 text-base font-normal rounded-xl text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 hover:text-cyan-200 transition-all duration-200 hover:border-cyan-400/50 backdrop-blur-sm tracking-wide group"
            >
              Sign In
              <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </motion.div>
        </motion.form>

        {/* Security Notice */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-cyan-500/10 rounded-full border border-cyan-500/20">
            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-cyan-300 text-xs font-light tracking-wide">Bank-level encryption & security</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default Register;