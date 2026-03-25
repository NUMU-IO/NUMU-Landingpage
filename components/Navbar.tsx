import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Navbar: React.FC = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div className="fixed top-2 sm:top-4 md:top-6 left-0 right-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none" ref={menuRef}>
      <nav className={`rounded-2xl px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 flex items-center justify-between w-full max-w-7xl pointer-events-auto transition-all duration-500 relative ${
        scrolled
          ? 'bg-background-light/80 backdrop-blur-md shadow-neu-floating border border-white/20'
          : 'bg-white/5 backdrop-blur-md border border-white/10'
      }`}>

        {/* Left: Logo */}
        <div className="flex-1 flex justify-start">
          <Link to="/" className="flex items-center gap-2 md:gap-3">
            <img
              src={language === 'ar' ? '/numu-logo-ar.webp' : '/numu-logo-en.webp'}
              alt="NUMU"
              className={`h-7 sm:h-8 md:h-10 w-auto object-contain transition-all duration-300 ${!scrolled ? 'brightness-0 invert' : ''}`}
              width="120"
              height="40"
              fetchPriority="high"
            />
          </Link>
        </div>

        {/* Center: Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-8">
          {[
            { id: 'features', label: t('nav.features') },
            { id: 'integrations', label: t('nav.integrations') },
            { id: 'testimonials', label: t('nav.testimonials') },
            { id: 'cta', label: t('nav.cta') },
          ].map((item) => (
            <a
              key={item.id}
              onClick={(e) => handleNavClick(e, item.id)}
              className={`font-medium text-sm transition-colors cursor-pointer ${
                scrolled ? 'text-text-muted hover:text-primary' : 'text-white/60 hover:text-white'
              }`}
              href={`#${item.id}`}
            >
              {item.label}
            </a>
          ))}
          <Link
            to="/contact"
            className={`font-medium text-sm transition-colors ${
              scrolled ? 'text-text-muted hover:text-primary' : 'text-white/60 hover:text-white'
            }`}
          >
            {t('footer.contact')}
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex-1 flex justify-end items-center gap-1.5 sm:gap-3 md:gap-6">
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className={`font-medium text-sm transition-colors cursor-pointer flex items-center gap-2 p-2 ${
                scrolled ? 'text-text-muted hover:text-primary' : 'text-white/50 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-lg sm:text-xl">language</span>
            </button>

            {isLangMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-32 bg-background-light dark:bg-background-dark rounded-xl shadow-neu-floating border border-white/20 overflow-hidden flex flex-col py-1 animate-slide-down">
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

          <Link to="/login" className={`font-medium text-sm transition-colors hidden lg:block ${
            scrolled ? 'text-text-muted hover:text-primary' : 'text-white/70 hover:text-white'
          }`}>
            {t('auth.login_link')}
          </Link>

          <Link to="/signup" className={`text-white text-xs sm:text-sm font-bold py-1.5 px-3 sm:py-2 sm:px-4 md:py-2.5 md:px-6 rounded-full transition-all duration-200 hover:scale-105 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${
            scrolled
              ? 'bg-brand-gradient shadow-neu-flat-sm active:shadow-neu-pressed-sm hover:shadow-lg'
              : 'bg-brand-gradient shadow-[0_2px_10px_rgba(30,58,138,0.4)] hover:shadow-[0_4px_20px_rgba(30,58,138,0.5)]'
          }`}>
            <span>{t('nav.start_free')}</span>
          </Link>

          {/* Burger Menu Button */}
          <button
            className={`lg:hidden p-1.5 -mr-1 ${scrolled ? 'text-text-main' : 'text-white'}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="material-symbols-outlined text-xl sm:text-2xl">
              {isMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-[-1] pointer-events-auto lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="absolute top-full left-3 right-3 sm:left-4 sm:right-4 mt-2 p-3 sm:p-4 bg-background-light/95 backdrop-blur-xl dark:bg-background-dark/95 rounded-2xl shadow-neu-floating border border-white/20 pointer-events-auto lg:hidden flex flex-col gap-1 animate-slide-down">
            <a onClick={(e) => handleNavClick(e, 'features')} className="text-text-main font-medium text-base sm:text-lg p-3 hover:bg-black/5 rounded-xl transition-colors cursor-pointer" href="#features">{t('nav.features')}</a>
            <a onClick={(e) => handleNavClick(e, 'integrations')} className="text-text-main font-medium text-base sm:text-lg p-3 hover:bg-black/5 rounded-xl transition-colors cursor-pointer" href="#integrations">{t('nav.integrations')}</a>
            <a onClick={(e) => handleNavClick(e, 'testimonials')} className="text-text-main font-medium text-base sm:text-lg p-3 hover:bg-black/5 rounded-xl transition-colors cursor-pointer" href="#testimonials">{t('nav.testimonials')}</a>
            <a onClick={(e) => handleNavClick(e, 'cta')} className="text-text-main font-medium text-base sm:text-lg p-3 hover:bg-black/5 rounded-xl transition-colors cursor-pointer" href="#cta">{t('nav.cta')}</a>
            <Link to="/contact" className="text-text-main font-medium text-base sm:text-lg p-3 hover:bg-black/5 rounded-xl transition-colors" onClick={() => setIsMenuOpen(false)}>
              {t('footer.contact')}
            </Link>
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
