// src/pages/Login.tsx
import React, { useState } from 'react';
import { useAuth } from '../../../components/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LoginRequest } from '../../../types';
import { motion } from 'framer-motion';
import { useToast } from '../../../components/ui/Toast';

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginRequest>({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData);
      showToast('Login successful! Redirecting...', 'success', 3000);
      navigate('/dashboard');
    } catch (err: any) {
      let errorMsg = 'Login failed';
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
    <div className="min-h-screen flex items-center justify-center bg-gray-950 relative overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-30"
          poster="https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
        >
          <source src="https://res.cloudinary.com/deioo5lrm/video/upload/v1761910590/86786-594417043_spgl4w.mp4" type="video/mp4" />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-cyan-950/30 to-gray-950"></div>
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950/90 via-cyan-950/50 to-gray-950/90 backdrop-blur-sm"></div>
      </div>

      {/* Glowing Animated Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, 30, 0],
          y: [0, -20, 0],
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
        className="absolute top-20 left-20 w-96 h-96 bg-cyan-700 rounded-full mix-blend-screen filter blur-3xl"
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          x: [0, -40, 0],
          y: [0, 30, 0],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute top-40 right-20 w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-screen filter blur-3xl"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.4, 1],
          x: [0, 20, 0],
          y: [0, -30, 0],
          opacity: [0.15, 0.28, 0.15]
        }}
        transition={{ 
          duration: 12,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 4
        }}
        className="absolute bottom-20 left-1/3 w-[450px] h-[450px] bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl"
      />

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,black,transparent)]"></div>

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
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="mx-auto w-10 h-10 bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/50 mb-6 backdrop-blur-xl border border-cyan-400/20 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
            <svg className="w-5 h-5 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Glassmorphic Form Card */}
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-8 space-y-6 bg-gray-900/40 backdrop-blur-2xl border border-cyan-500/20 rounded-3xl shadow-2xl shadow-cyan-500/10 p-8 relative overflow-hidden"
          onSubmit={handleSubmit}
        >
          {/* Glass reflection effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 rounded-3xl"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
          
          <div className="space-y-5 relative z-10">
            {/* Email Field */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative group"
            >
              <label className="block text-sm font-medium text-cyan-300/90 mb-2 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-cyan-400/70 group-focus-within:text-cyan-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="block w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-cyan-500/30 rounded-xl placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400/60 transition-all duration-300 backdrop-blur-xl font-light tracking-wide hover:border-cyan-400/50 hover:bg-gray-800/70"
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative group"
            >
              <label className="block text-sm font-medium text-cyan-300/90 mb-2 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-cyan-400/70 group-focus-within:text-cyan-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="block w-full pl-12 pr-12 py-4 bg-gray-800/50 border border-cyan-500/30 rounded-xl placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400/60 transition-all duration-300 backdrop-blur-xl font-light tracking-wide hover:border-cyan-400/50 hover:bg-gray-800/70"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-cyan-400/70 hover:text-cyan-300 transition-colors"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Remember Me & Forgot Password */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-between relative z-10"
          >
            <div className="flex items-center group">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-gray-900 border-cyan-500/30 rounded bg-gray-800/50 transition-all cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-3 block text-sm text-cyan-200/80 font-light group-hover:text-cyan-100 transition-colors cursor-pointer">
                Keep me signed in
              </label>
            </div>

            {/* UPDATED: Changed from <a> to <Link> for React Router */}
            <div className="text-sm">
              <Link 
                to="/forgot-password" 
                className="text-cyan-400 hover:text-cyan-300 transition-all duration-200 font-normal hover:underline underline-offset-4 group"
              >
                Forgot password?
                <svg 
                  className="w-4 h-4 ml-1 inline-block transition-transform group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            type="submit"
            disabled={isLoading}
            className="group relative w-full py-4 px-4 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-cyan-500 via-cyan-600 to-blue-600 hover:from-cyan-400 hover:via-cyan-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/50 active:scale-[0.98] shadow-lg shadow-cyan-500/30 backdrop-blur-xl overflow-hidden z-10"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            <span className="relative z-10 flex items-center justify-center tracking-wide">
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Access Dashboard
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
            transition={{ duration: 0.6, delay: 0.6 }}
            className="relative z-10"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cyan-500/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-900/40 text-cyan-300/70 font-light tracking-wide backdrop-blur-xl">New to our platform?</span>
            </div>
          </motion.div>

          {/* Sign Up Link */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-center relative z-10"
          >
            <Link 
              to="/register" 
              className="inline-flex items-center px-6 py-3.5 border border-cyan-500/30 text-base font-normal rounded-xl text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 hover:text-cyan-200 hover:border-cyan-400/50 transition-all duration-300 backdrop-blur-xl tracking-wide group shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20"
            >
              Create new account
              <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </motion.div>

          {/* Social Login Section (Optional) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center relative z-10"
          >
            <div className="text-sm text-cyan-300/70 mb-3 font-light tracking-wide">
              Or continue with
            </div>
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                onClick={() => showToast('Google login coming soon!', 'info')}
                className="p-3 border border-cyan-500/20 rounded-xl text-cyan-300 bg-cyan-500/5 hover:bg-cyan-500/10 hover:border-cyan-400/40 transition-all duration-300 backdrop-blur-xl group"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </button>
              <button
                type="button"
                onClick={() => showToast('GitHub login coming soon!', 'info')}
                className="p-3 border border-cyan-500/20 rounded-xl text-cyan-300 bg-cyan-500/5 hover:bg-cyan-500/10 hover:border-cyan-400/40 transition-all duration-300 backdrop-blur-xl group"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
              </button>
            </div>
          </motion.div>
        </motion.form>

        {/* Security Notice */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="text-center"
        >
          <div className="inline-flex items-center space-x-2 px-5 py-3 bg-cyan-500/10 rounded-full border border-cyan-500/20 backdrop-blur-xl shadow-lg shadow-cyan-500/10">
            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-cyan-300/90 text-xs font-light tracking-wide">256-bit encryption & enterprise security</span>
          </div>
        </motion.div>

        {/* Help & Support Links */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="text-center"
        >
          <div className="flex flex-wrap justify-center gap-4 text-sm text-cyan-300/70">
            <Link 
              to="/support" 
              className="hover:text-cyan-200 transition-colors duration-200 hover:underline underline-offset-2"
            >
              Need help?
            </Link>
            <span className="text-cyan-500/40">•</span>
            <Link 
              to="/terms" 
              className="hover:text-cyan-200 transition-colors duration-200 hover:underline underline-offset-2"
            >
              Terms
            </Link>
            <span className="text-cyan-500/40">•</span>
            <Link 
              to="/privacy" 
              className="hover:text-cyan-200 transition-colors duration-200 hover:underline underline-offset-2"
            >
              Privacy
            </Link>
            <span className="text-cyan-500/40">•</span>
            <Link 
              to="/contact" 
              className="hover:text-cyan-200 transition-colors duration-200 hover:underline underline-offset-2"
            >
              Contact
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default Login;