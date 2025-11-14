// src/components/Translator.tsx
import React, { useEffect, useState, useRef } from 'react';
import { Globe } from 'lucide-react'; // npm i lucide-react if not installed

const Translator: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scriptLoadedRef = useRef(false); // Prevent double loads in Strict Mode

  const loadScript = (retry = false) => {
    if (scriptLoadedRef.current) return; // Already loaded

    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'; // Force HTTPS
    script.async = true;
    script.crossOrigin = 'anonymous'; // Help with CORS

    script.onload = () => {
      scriptLoadedRef.current = true;
      setIsLoaded(true);
      setError(null);
    };

    script.onerror = (e) => {
      console.error('Google Translate script failed to load:', e);
      setError('Translation unavailable (script load failed). Please refresh.');
      if (!retry) {
        // Retry once after delay
        setTimeout(() => loadScript(true), 2000);
      }
    };

    document.head.appendChild(script);
  };

  useEffect(() => {
    loadScript();

    // Initialize callback (global)
    (window as any).googleTranslateElementInit = () => {
      try {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,zh-CN', // English & Mandarin (Simplified)
            layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element'
        );
      } catch (initError) {
        console.error('Google Translate init failed:', initError);
        setError('Translation init failed. Please refresh.');
      }
    };

    // Cleanup
    return () => {
      const existingScript = document.querySelector('script[src*="translate.google.com"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
      delete (window as any).googleTranslateElementInit;
      scriptLoadedRef.current = false;
    };
  }, []);

  if (error) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <button className="p-2 bg-red-600/80 text-white rounded-full shadow-lg">
          <Globe className="w-5 h-5" />
          <span className="ml-2 text-xs">Error</span>
        </button>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="fixed top-4 right-4 z-50 animate-pulse">
        <div className="p-2 bg-gray-800/80 border border-gray-600/50 rounded-full"></div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <div className="relative">
          {/* Floating Button */}
          <button
            className="p-2 bg-gray-800/80 hover:bg-gray-700/80 border border-gray-600/50 rounded-full text-white shadow-lg backdrop-blur-sm transition-all duration-200"
            onClick={() => {
              const element = document.getElementById('google_translate_element');
              if (element) {
                element.style.display = element.style.display === 'none' ? 'block' : 'none';
              }
            }}
            title="Translate Page"
          >
            <Globe className="w-5 h-5" />
          </button>
          {/* Hidden Dropdown */}
          <div
            id="google_translate_element"
            className="absolute top-full right-0 mt-2 hidden bg-gray-800/95 border border-gray-600/50 rounded-lg p-2 shadow-xl backdrop-blur-sm min-w-[200px]"
          ></div>
        </div>
      </div>

      <style>{`
        #google_translate_element > div > div {
          border: none !important;
          box-shadow: none !important;
        }
        #google_translate_element select {
          background: #374151 !important;
          border: 1px solid #4b5563 !important;
          border-radius: 0.5rem !important;
          padding: 0.5rem !important;
          font-size: 0.875rem !important;
          color: #f9fafb !important;
          width: 100% !important;
        }
        #google_translate_element select option {
          background: #1f2937 !important;
          color: #f9fafb !important;
        }
      `}</style>
    </>
  );
};

export default Translator;