import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Navbar: React.FC = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

  return (
    <div className="fixed top-4 md:top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav className="bg-background-light/80 backdrop-blur-md dark:bg-background-dark/80 rounded-full shadow-neu-floating border border-white/20 px-6 md:px-8 py-3 flex items-center justify-between w-full max-w-6xl pointer-events-auto transition-all duration-300 relative">
        
        {/* Left: Logo */}
        <div className="flex-1 flex justify-start">
          <Link to="/" className="flex items-center gap-2 md:gap-3 text-text-main dark:text-white">
            <img src="/numu_logo.png" alt="NUMU" className="h-8 md:h-10 w-auto object-contain" width="120" height="40" />
          </Link>
        </div>

        {/* Center: Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-8">
          <a onClick={(e) => handleNavClick(e, 'preview')} className="text-text-muted hover:text-primary font-medium text-sm transition-colors cursor-pointer" href="#preview">{t('nav.product')}</a>
          <a onClick={(e) => handleNavClick(e, 'features')} className="text-text-muted hover:text-primary font-medium text-sm transition-colors cursor-pointer" href="#features">{t('nav.features')}</a>
          <a onClick={(e) => handleNavClick(e, 'testimonials')} className="text-text-muted hover:text-primary font-medium text-sm transition-colors cursor-pointer" href="#testimonials">{t('nav.testimonials')}</a>
        </div>

        {/* Right: Actions */}
        <div className="flex-1 flex justify-end items-center gap-3 md:gap-6">
          <div className="relative">
            <button 
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="text-text-muted hover:text-primary font-medium text-sm transition-colors cursor-pointer flex items-center gap-2 p-2"
            >
              <span className="material-symbols-outlined text-xl">language</span>
            </button>
            
            {isLangMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-32 bg-background-light dark:bg-background-dark rounded-xl shadow-neu-floating border border-white/20 overflow-hidden flex flex-col py-1">
                <button
                  onClick={() => handleLanguageSelect('en')}
                  className={`px-4 py-2 text-sm text-start hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${language === 'en' ? 'text-primary font-bold' : 'text-text-muted'}`}
                >
                  English
                </button>
                <button
                  onClick={() => handleLanguageSelect('ar')}
                  className={`px-4 py-2 text-sm text-start hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${language === 'ar' ? 'text-primary font-bold' : 'text-text-muted'}`}
                >
                  العربية
                </button>
              </div>
            )}
          </div>
          
          <Link to="/login" className="text-text-muted hover:text-primary font-medium text-sm transition-colors hidden lg:block">
            {t('auth.login_link')}
          </Link>
          
          <Link to="/signup" className="bg-brand-gradient text-white text-sm font-bold py-2 px-4 md:py-2.5 md:px-6 rounded-full shadow-neu-flat-sm active:shadow-neu-pressed-sm transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center gap-2 whitespace-nowrap">
            <span>{t('nav.start_free')}</span>
          </Link>

          {/* Burger Menu Button */}
          <button 
            className="lg:hidden text-text-main dark:text-white p-1"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="material-symbols-outlined text-2xl">
              {isMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="absolute top-full left-4 right-4 mt-2 p-4 bg-background-light/95 backdrop-blur-xl dark:bg-background-dark/95 rounded-2xl shadow-neu-floating border border-white/20 pointer-events-auto lg:hidden flex flex-col gap-4 animate-in slide-in-from-top-2 fade-in duration-200">
          <a onClick={(e) => handleNavClick(e, 'preview')} className="text-text-main font-medium text-lg p-2 hover:bg-black/5 rounded-lg transition-colors" href="#preview">{t('nav.product')}</a>
          <a onClick={(e) => handleNavClick(e, 'features')} className="text-text-main font-medium text-lg p-2 hover:bg-black/5 rounded-lg transition-colors" href="#features">{t('nav.features')}</a>
          <a onClick={(e) => handleNavClick(e, 'testimonials')} className="text-text-main font-medium text-lg p-2 hover:bg-black/5 rounded-lg transition-colors" href="#testimonials">{t('nav.testimonials')}</a>
          <Link to="/login" className="text-text-main font-medium text-lg p-2 hover:bg-black/5 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
            {t('auth.login_link')}
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;