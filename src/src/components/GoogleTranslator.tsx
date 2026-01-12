import React, { useState, useEffect, useRef } from 'react';
import { Languages, ChevronDown, Check } from 'lucide-react';

// Declare Google Translate types
declare global {
  interface Window {
    google?: {
      translate: {
        TranslateElement: new (
          config: {
            pageLanguage: string;
            includedLanguages?: string;
            layout?: number;
            autoDisplay?: boolean;
          },
          elementId: string
        ) => void;
        Element?: {
          InlineLayout?: {
            SIMPLE: number;
          };
        };
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

const GoogleTranslator: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const [isLoaded, setIsLoaded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const googleTranslateRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '中文', flag: '🇨🇳' },
    // { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    // { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    // { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    // { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    // { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
    // { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
    // { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
    // { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
    // { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    // { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  ];

  useEffect(() => {
    // Initialize Google Translate
    const addGoogleTranslateScript = () => {
      if (document.getElementById('google-translate-script')) {
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    };

    // Initialize callback
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: languages.map(lang => lang.code).join(','),
            layout: window.google.translate.Element?.InlineLayout?.SIMPLE || 0,
            autoDisplay: false,
          },
          'google_translate_element'
        );
        setIsLoaded(true);
      }
    };

    addGoogleTranslateScript();

    // Check if already loaded
    const checkInterval = setInterval(() => {
      if (window.google?.translate?.TranslateElement) {
        setIsLoaded(true);
        clearInterval(checkInterval);
      }
    }, 100);

    // Cleanup
    return () => {
      clearInterval(checkInterval);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (langCode: string) => {
    setCurrentLang(langCode);
    setIsOpen(false);

    // Trigger Google Translate
    const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (selectElement) {
      selectElement.value = langCode;
      selectElement.dispatchEvent(new Event('change'));
      
      // Show success notification
      showNotification(`Language changed to ${languages.find(l => l.code === langCode)?.name}`);
    } else {
      console.warn('Google Translate not ready yet');
      showNotification('Translator is loading, please try again', 'warning');
    }
  };

  const showNotification = (message: string, type: 'success' | 'warning' = 'success') => {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 z-[100] px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm border transition-all duration-300 ${
      type === 'success' 
        ? 'bg-green-500/90 border-green-400 text-white' 
        : 'bg-yellow-500/90 border-yellow-400 text-white'
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  const currentLanguage = languages.find(lang => lang.code === currentLang);

  return (
    <>
      {/* Hidden Google Translate Element */}
      <div 
        id="google_translate_element" 
        ref={googleTranslateRef}
        style={{ display: 'none' }}
      />

      {/* Custom Language Selector */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={!isLoaded}
          className={`flex items-center space-x-2 px-3 py-2 rounded-xl bg-gray-800/50 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 backdrop-blur-xl shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 text-gray-300 hover:text-white ${
            !isLoaded ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          title={!isLoaded ? 'Loading translator...' : 'Select language'}
        >
          <Languages className="w-4 h-4" />
          <span className="text-sm font-medium">{currentLanguage?.flag}</span>
          <span className="text-xs hidden sm:inline">{currentLanguage?.code.toUpperCase()}</span>
          <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          {!isLoaded && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          )}
        </button>

        {isOpen && isLoaded && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-gray-900/95 backdrop-blur-2xl border border-cyan-500/20 rounded-xl shadow-2xl shadow-cyan-500/20 py-2 overflow-hidden z-50">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 pointer-events-none" />
            
            <div className="px-3 py-2 border-b border-cyan-500/20">
              <p className="text-xs text-gray-400 font-medium">Select Language</p>
            </div>

            <div className="max-h-80 overflow-y-auto py-2">
              <div className="space-y-1">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => changeLanguage(language.code)}
                    className={`flex items-center justify-between w-full px-3 py-2.5 text-sm transition-all duration-200 ${
                      currentLang === language.code
                        ? 'bg-cyan-500/20 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-cyan-500/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{language.flag}</span>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{language.nativeName}</span>
                        <span className="text-xs text-gray-400">{language.name}</span>
                      </div>
                    </div>
                    {currentLang === language.code && (
                      <Check className="w-4 h-4 text-cyan-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-3 py-2 border-t border-cyan-500/20 mt-2">
              <p className="text-xs text-gray-400">
                Powered by{' '}
                <span className="text-cyan-400 font-medium">Google Translate</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS to hide Google Translate banner */}
      <style>{`
        .goog-te-banner-frame {
          display: none !important;
        }
        body {
          top: 0 !important;
        }
        .goog-te-combo {
          display: none;
        }
        .skiptranslate {
          display: none !important;
        }
        body > .skiptranslate {
          display: none !important;
        }
        iframe.skiptranslate {
          display: none !important;
        }
        .goog-logo-link {
          display: none !important;
        }
        .goog-te-gadget {
          color: transparent !important;
        }
        .goog-te-gadget .goog-te-combo {
          margin: 0 !important;
        }
      `}</style>
    </>
  );
};

export default GoogleTranslator;