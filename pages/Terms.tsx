import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useSEO } from '../hooks/useSEO';

const sectionIcons = [
  'person_add',
  'store',
  'payments',
  'inventory_2',
  'cancel',
  'gavel',
  'mail',
];

const sections = [
  { title: 'terms.account_title', text: 'terms.account_text' },
  { title: 'terms.services_title', text: 'terms.services_text' },
  { title: 'terms.payments_title', text: 'terms.payments_text' },
  { title: 'terms.content_title', text: 'terms.content_text' },
  { title: 'terms.termination_title', text: 'terms.termination_text' },
  { title: 'terms.liability_title', text: 'terms.liability_text' },
  { title: 'terms.contact_title', text: 'terms.contact_text' },
];

const Terms: React.FC = () => {
  const { t, dir, language } = useLanguage();

  useSEO({
    title: 'Terms of Service — NUMU | E-commerce Platform for Egypt & MENA',
    description: 'Review the NUMU terms of service governing the use of our e-commerce platform, payment processing, and merchant obligations in Egypt and MENA.',
    canonical: 'https://numueg.app/terms',
  });

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark" dir={dir}>
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 sm:px-12 py-5">
        <Link to="/">
          <img src={language === 'ar' ? '/numu-logo-ar.webp' : '/numu-logo-en.webp'} alt="NUMU" width="120" height="32" className="h-8 w-auto object-contain" />
        </Link>
        <Link to="/" className="text-sm text-text-muted hover:text-primary font-medium transition-colors">
          {t('waitlist.back_home')}
        </Link>
      </nav>

      {/* Hero */}
      <div className="text-center px-6 pt-12 sm:pt-20 pb-10 sm:pb-14">
        <div className="animate-fade-in-up-1 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
          <span className="material-symbols-outlined text-base">description</span>
          {t('terms.last_updated')}: March 2026
        </div>
        <h1 className="animate-fade-in-up-2 text-3xl sm:text-4xl md:text-5xl font-black text-text-main dark:text-white mb-4">
          {t('terms.title')}
        </h1>
        <p className="animate-fade-in-up-3 text-text-muted text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
          {t('terms.intro')}
        </p>
      </div>

      {/* Sections */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="grid gap-4 sm:gap-6">
          {sections.map(({ title, text }, i) => (
            <div
              key={title}
              className={`animate-fade-in-up-${Math.min(i + 3, 8)} rounded-2xl sm:rounded-3xl bg-background-light dark:bg-background-dark shadow-[6px_6px_12px_rgba(163,177,198,0.4),-6px_-6px_12px_rgba(255,255,255,0.8)] p-5 sm:p-7 md:p-8 flex gap-4 sm:gap-5 items-start`}
            >
              <div className="shrink-0 size-10 sm:size-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-xl sm:text-2xl">{sectionIcons[i]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base sm:text-lg font-bold text-text-main dark:text-white mb-1.5">
                  {t(title)}
                </h2>
                <p className="text-sm sm:text-base text-text-muted leading-relaxed text-start">
                  {t(text)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Terms;
