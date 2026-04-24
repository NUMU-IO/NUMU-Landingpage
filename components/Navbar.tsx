import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useWaitlistModal } from '../contexts/WaitlistModalContext';

const Navbar: React.FC = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const { open: openWaitlist } = useWaitlistModal();
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
    if (language !== lang) toggleLanguage();
    setIsLangMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsMenuOpen(false);
      if (langRef.current && !langRef.current.contains(e.target as Node)) setIsLangMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsLangMenuOpen(false);
  }, [location.pathname]);

  const navLinkBase = 'font-medium text-sm transition-colors cursor-pointer text-ink-soft/80 hover:text-navy';

  return (
    <div
      className="fixed top-2 sm:top-4 md:top-6 left-0 right-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none"
      ref={menuRef}
    >
      <nav
        className={`px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 flex items-center justify-between w-full max-w-[1360px] pointer-events-auto transition-all duration-300 ease-numu relative rounded-[10px] ${
          scrolled
            ? 'bg-cream/85 backdrop-blur-md border border-ink/10 shadow-card'
            : 'bg-cream/60 backdrop-blur-md border border-ink/5'
        }`}
      >
        {/* Logo */}
        <div className="flex-1 flex justify-start">
          <Link
            to="/"
            className="flex items-center gap-2.5 md:gap-3"
            aria-label={language === 'ar' ? 'نُمُو — الرئيسية' : 'numu — home'}
          >
            {/* N monogram on cream ground — canonical mark per brand kit v1.0 */}
            <img
              src="/numu-mark-cream.webp"
              alt=""
              className="h-8 sm:h-9 md:h-10 w-auto object-contain"
              width="40"
              height="40"
              fetchPriority="high"
            />
            {/* Wordmark — Reem Kufi, Arabic glyph when Arabic is active. Latin
                stays lowercase per brand kit. */}
            {language === 'ar' ? (
              <span className="font-display text-xl sm:text-2xl md:text-[26px] font-bold tracking-tight text-ink">
                نُمُو
              </span>
            ) : (
              <span className="font-display text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-ink lowercase">
                numu
              </span>
            )}
          </Link>
        </div>

        {/* Center links */}
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
              className={navLinkBase}
              href={`#${item.id}`}
            >
              {item.label}
            </a>
          ))}
          <Link to="/contact" className={navLinkBase}>
            {t('footer.contact')}
          </Link>
        </div>

        {/* Right actions */}
        <div className="flex-1 flex justify-end items-center gap-1 sm:gap-2 md:gap-4">
          {/* Language switcher — mono label, not a globe icon */}
          <div className="relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft/80 hover:text-navy px-2 py-1.5 transition-colors"
              aria-label="Switch language"
              // eslint-disable-next-line jsx-a11y/aria-proptypes
              aria-expanded={isLangMenuOpen}
            >
              {language === 'ar' ? 'AR · EN' : 'EN · AR'}
            </button>

            {isLangMenuOpen && (
              <div className="absolute top-full end-0 mt-2 w-32 bg-cream border border-ink/10 shadow-card overflow-hidden flex flex-col py-1 rounded-[4px] animate-fade-in-up">
                <button
                  type="button"
                  onClick={() => handleLanguageSelect('en')}
                  className={`px-4 py-2.5 text-sm text-start hover:bg-navy/[0.04] transition-colors ${
                    language === 'en' ? 'text-navy font-semibold' : 'text-ink-soft'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => handleLanguageSelect('ar')}
                  className={`px-4 py-2.5 text-sm text-start hover:bg-navy/[0.04] transition-colors ${
                    language === 'ar' ? 'text-navy font-semibold' : 'text-ink-soft'
                  }`}
                >
                  العربية
                </button>
              </div>
            )}
          </div>

          <Link
            to="/login"
            className="hidden lg:block font-medium text-sm text-ink-soft/80 hover:text-navy transition-colors"
          >
            {t('auth.login_link')}
          </Link>

          {/* Primary CTA — flat navy on cream, square radius */}
          <button
            type="button"
            onClick={() => openWaitlist()}
            className="group bg-navy text-cream text-xs sm:text-sm font-semibold py-2 px-3 sm:py-2.5 sm:px-5 md:px-6 rounded-[4px] hover:bg-navy-800 active:scale-[0.985] transition-all duration-200 ease-numu flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"
          >
            <span>{language === 'ar' ? 'انضم للبيتا' : 'Join Beta'}</span>
            {/* Saffron arrow accent — echoes hero CTA */}
            <span
              aria-hidden="true"
              className="text-saffron rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform"
            >
              →
            </span>
          </button>

          {/* Burger */}
          <button
            type="button"
            className="lg:hidden p-1.5 text-ink hover:text-navy transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            // eslint-disable-next-line jsx-a11y/aria-proptypes
            aria-expanded={isMenuOpen}
          >
            {/* Lucide-style 1.5px stroke burger/close — no material symbols */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              {isMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-[-1] pointer-events-auto lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="absolute top-full left-3 right-3 sm:left-4 sm:right-4 mt-2 p-3 sm:p-4 bg-cream border border-ink/10 shadow-card rounded-[10px] pointer-events-auto lg:hidden flex flex-col gap-0.5 animate-fade-in-up">
            {[
              { id: 'features', label: t('nav.features') },
              { id: 'integrations', label: t('nav.integrations') },
              { id: 'testimonials', label: t('nav.testimonials') },
              { id: 'beta-program', label: language === 'ar' ? 'برنامج البيتا' : 'Beta Program' },
            ].map((item) => (
              <a
                key={item.id}
                onClick={(e) => handleNavClick(e, item.id)}
                href={`#${item.id}`}
                className="text-ink font-medium text-base p-3 hover:bg-navy/[0.04] rounded-[4px] transition-colors cursor-pointer"
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                openWaitlist();
              }}
              className="text-navy font-semibold text-base p-3 hover:bg-navy/[0.04] rounded-[4px] transition-colors cursor-pointer text-start"
            >
              {language === 'ar' ? 'انضم للقائمة' : 'Join Waitlist'}
            </button>
            <Link
              to="/contact"
              className="text-ink font-medium text-base p-3 hover:bg-navy/[0.04] rounded-[4px] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('footer.contact')}
            </Link>
            <Link
              to="/login"
              className="text-ink font-medium text-base p-3 hover:bg-navy/[0.04] rounded-[4px] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('auth.login_link')}
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;
