/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Tokabi Brand Colors
        tokabi: {
          primary: '#1A1A1A',      // Dark charcoal - headers, emphasis
          secondary: '#4A4A4A',    // Medium gray - body text
          accent: '#00A86B',       // Jade green - CTAs, highlights
          'accent-hover': '#008F5B', // Darker jade for hover
          light: '#F5F5F5',        // Light gray - sections
        },
        // Cyan Color Palette (700, 800, 900)
        cyan: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        // Dark Mode Background Colors
        dark: {
          base: '#030712',       // Near black - main background
          elevated: '#0a1628',   // Slightly lighter - cards, elevated surfaces
          surface: '#0f2132',    // Surface elements
          border: '#1e3a4f',     // Border color
          muted: '#1a2e3f',      // Muted backgrounds
        },
        // Glassmorphism Colors
        glass: {
          white: 'rgba(255, 255, 255, 0.1)',
          'white-strong': 'rgba(255, 255, 255, 0.15)',
          dark: 'rgba(0, 0, 0, 0.2)',
          cyan: 'rgba(14, 116, 144, 0.1)',
          'cyan-strong': 'rgba(14, 116, 144, 0.2)',
        },
        // Semantic Colors
        success: '#00A86B',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        // Custom type scale matching PDF specs
        'hero': ['48px', { lineHeight: '1.2', fontWeight: '700' }],
        'hero-mobile': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['36px', { lineHeight: '1.3', fontWeight: '700' }],
        'h2-mobile': ['28px', { lineHeight: '1.3', fontWeight: '700' }],
        'h3': ['24px', { lineHeight: '1.4', fontWeight: '600' }],
        'h3-mobile': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'h4': ['20px', { lineHeight: '1.5', fontWeight: '600' }],
        'h4-mobile': ['18px', { lineHeight: '1.5', fontWeight: '600' }],
        'body': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-mobile': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'small': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      spacing: {
        'xs': '8px',
        'sm': '16px',
        'md': '24px',
        'lg': '32px',
        'xl': '48px',
        '2xl': '64px',
        '3xl': '96px',
      },
      borderRadius: {
        'btn': '8px',
        'card': '12px',
        'glass': '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'btn-primary': '0 4px 12px rgba(0, 168, 107, 0.3)',
        'btn-cyan': '0 4px 12px rgba(14, 116, 144, 0.3)',
        'card-dark': '0 2px 8px rgba(0, 0, 0, 0.3)',
        'card-dark-hover': '0 8px 24px rgba(0, 0, 0, 0.4)',
        // Glassmorphism shadows
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.15)',
        'glass-cyan': '0 8px 32px rgba(14, 116, 144, 0.15)',
        'glass-cyan-lg': '0 16px 48px rgba(14, 116, 144, 0.2)',
        'glow-cyan': '0 0 40px rgba(14, 116, 144, 0.3)',
        'glow-cyan-sm': '0 0 20px rgba(14, 116, 144, 0.2)',
        'inner-glow': 'inset 0 1px 1px rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'gradient': 'gradient 3s ease infinite',
        'gradient-xy': 'gradient-xy 6s ease infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-slow': 'bounce 3s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'gradient-xy': {
          '0%, 100%': { backgroundPosition: '0% 0%' },
          '25%': { backgroundPosition: '100% 0%' },
          '50%': { backgroundPosition: '100% 100%' },
          '75%': { backgroundPosition: '0% 100%' },
        },
      },
      backdropBlur: {
        xs: '2px',
        glass: '12px',
        'glass-lg': '20px',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'glass-gradient-dark': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
        'cyan-gradient': 'linear-gradient(135deg, #0e7490 0%, #155e75 100%)',
        'cyan-gradient-radial': 'radial-gradient(circle at center, rgba(14, 116, 144, 0.2) 0%, transparent 70%)',
        'mesh-gradient': 'radial-gradient(at 40% 20%, rgba(14, 116, 144, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(6, 182, 212, 0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(21, 94, 117, 0.1) 0px, transparent 50%)',
      },
    },
  },
  plugins: [],
}
