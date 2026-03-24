import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Pricing: React.FC = () => {
  const { t, dir, language } = useLanguage();

  const perks = [
    { icon: 'timer', text: t('pricing.free_trial') },
    { icon: 'credit_card_off', text: t('pricing.no_card') },
    { icon: 'event_available', text: t('pricing.cancel') },
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col" dir={dir}>
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 sm:px-12 py-5">
        <Link to="/">
          <img src={language === 'ar' ? '/numu-logo-ar.png' : '/numu-logo-en.png'} alt="NUMU" className="h-8 w-auto object-contain" />
        </Link>
        <Link to="/" className="text-sm text-text-muted hover:text-primary font-medium transition-colors">
          {t('waitlist.back_home')}
        </Link>
      </nav>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-lg w-full text-center flex flex-col items-center gap-8">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold">
            <span className="material-symbols-outlined text-base">schedule</span>
            {t('pricing.coming_soon')}
          </span>

          <h1 className="text-3xl sm:text-4xl font-black text-text-main dark:text-white leading-tight">
            {t('pricing.title')}
          </h1>
          <p className="text-text-muted text-base leading-relaxed max-w-md">
            {t('pricing.subtitle')}
          </p>

          {/* Perks */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
            {perks.map(({ icon, text }) => (
              <div key={icon} className="flex items-center gap-2 text-text-muted text-sm">
                <span className="material-symbols-outlined text-primary text-lg">{icon}</span>
                {text}
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link
            to="/signup"
            className="bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] text-white font-bold h-14 px-10 rounded-2xl shadow-neu-flat hover:shadow-neu-flat-sm active:shadow-neu-pressed hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
          >
            <span>{t('pricing.notify')}</span>
            <span className="material-symbols-outlined rtl:rotate-180">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
