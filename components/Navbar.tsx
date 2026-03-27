import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Navbar: React.FC = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: id } });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
      }
    }
  };

  const handleLanguageSelect = (lang: 'en' | 'ar') => {
    if (language !== lang) {
      toggleLanguage();
    }
    setIsLangMenuOpen(false);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsLangMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="fixed top-2 sm:top-4 md:top-6 left-0 right-0 z-50 flex justify-center px-3 sm:px-4 pointer-events-none" ref={menuRef}>
      <nav aria-label="Main navigation" className="bg-background-light/80 backdrop-blur-md dark:bg-background-dark/80 rounded-full shadow-neu-floating border border-white/20 px-3 sm:px-6 md:px-8 py-2.5 sm:py-3 flex items-center justify-between w-full max-w-6xl pointer-events-auto transition-all duration-300 relative">

        {/* Left: Logo */}
        <div className="flex-1 flex justify-start">
          <Link to="/" aria-label="NUMU home" className="flex items-center gap-2 md:gap-3 text-text-main dark:text-white">
            <img src={language === 'ar' ? '/numu-logo-ar.png' : '/numu-logo-en.png'} alt="NUMU — E-commerce platform for Egypt and MENA" className="h-7 sm:h-8 md:h-10 w-auto object-contain" width="120" height="40" />
          </Link>
        </div>

        {/* Center: Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-8">
          <a onClick={(e) => handleNavClick(e, 'preview')} className="text-text-muted hover:text-primary font-medium text-sm transition-colors cursor-pointer" href="#preview">{t('nav.product')}</a>
          <a onClick={(e) => handleNavClick(e, 'features')} className="text-text-muted hover:text-primary font-medium text-sm transition-colors cursor-pointer" href="#features">{t('nav.features')}</a>
          <a onClick={(e) => handleNavClick(e, 'testimonials')} className="text-text-muted hover:text-primary font-medium text-sm transition-colors cursor-pointer" href="#testimonials">{t('nav.testimonials')}</a>
        </div>

        {/* Right: Actions */}
        <div className="flex-1 flex justify-end items-center gap-1.5 sm:gap-3 md:gap-6">
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              aria-label="Select language"
              aria-expanded={isLangMenuOpen}
              className="text-text-muted hover:text-primary font-medium text-sm transition-colors cursor-pointer flex items-center gap-2 p-2"
            >
              <span className="material-symbols-outlined text-lg sm:text-xl" aria-hidden="true">language</span>
            </button>

            {isLangMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-32 bg-background-light dark:bg-background-dark rounded-xl shadow-neu-floating border border-white/20 overflow-hidden flex flex-col py-1">
                <button
                  onClick={() => handleLanguageSelect('en')}
                  className={`px-4 py-2.5 text-sm text-start hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${language === 'en' ? 'text-primary font-bold' : 'text-text-muted'}`}
                >
                  English
                </button>
                <button
                  onClick={() => handleLanguageSelect('ar')}
                  className={`px-4 py-2.5 text-sm text-start hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${language === 'ar' ? 'text-primary font-bold' : 'text-text-muted'}`}
                >
                  العربية
                </button>
              </div>
            )}
          </div>

          <Link to="/login" className="text-text-muted hover:text-primary font-medium text-sm transition-colors hidden lg:block">
            {t('auth.login_link')}
          </Link>

          <Link to="/signup" className="bg-brand-gradient text-white text-xs sm:text-sm font-bold py-1.5 px-3 sm:py-2 sm:px-4 md:py-2.5 md:px-6 rounded-full shadow-neu-flat-sm active:shadow-neu-pressed-sm transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
            <span>{t('nav.start_free')}</span>
          </Link>

          {/* Burger Menu Button */}
          <button
            className="lg:hidden text-text-main dark:text-white p-1.5 -mr-1"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            <span className="material-symbols-outlined text-xl sm:text-2xl" aria-hidden="true">
              {isMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <>
          {/* Backdrop to close on outside tap */}
          <div
            className="fixed inset-0 z-[-1] pointer-events-auto lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="absolute top-full left-3 right-3 sm:left-4 sm:right-4 mt-2 p-3 sm:p-4 bg-background-light/95 backdrop-blur-xl dark:bg-background-dark/95 rounded-2xl shadow-neu-floating border border-white/20 pointer-events-auto lg:hidden flex flex-col gap-1 animate-slide-down">
            <a onClick={(e) => handleNavClick(e, 'preview')} className="text-text-main font-medium text-base sm:text-lg p-3 hover:bg-black/5 rounded-xl transition-colors cursor-pointer" href="#preview">{t('nav.product')}</a>
            <a onClick={(e) => handleNavClick(e, 'features')} className="text-text-main font-medium text-base sm:text-lg p-3 hover:bg-black/5 rounded-xl transition-colors cursor-pointer" href="#features">{t('nav.features')}</a>
            <a onClick={(e) => handleNavClick(e, 'testimonials')} className="text-text-main font-medium text-base sm:text-lg p-3 hover:bg-black/5 rounded-xl transition-colors cursor-pointer" href="#testimonials">{t('nav.testimonials')}</a>
            <Link to="/login" className="text-text-main font-medium text-base sm:text-lg p-3 hover:bg-black/5 rounded-xl transition-colors" onClick={() => setIsMenuOpen(false)}>
              {t('auth.login_link')}
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;
