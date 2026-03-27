import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Integrations: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto w-full flex flex-col lg:flex-row items-center gap-8 sm:gap-10 lg:gap-20 px-4">
      <div className="lg:w-1/2 text-center lg:text-start">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-main dark:text-white mb-4 sm:mb-6">{t('integrations.title')}</h2>
        <p className="text-text-muted text-sm sm:text-base md:text-lg mb-6 sm:mb-8">
          {t('integrations.subtitle')}
        </p>
        <ul className="space-y-3 sm:space-y-4 text-start inline-block">
          {[
            { icon: 'payments', text: t('integrations.paymob') },
            { icon: 'local_shipping', text: t('integrations.bosta') },
            { icon: 'chat', text: t('integrations.whatsapp') },
            { icon: 'auto_awesome', text: t('integrations.ai') },
          ].map((item, idx) => (
            <li key={idx} className="flex items-center gap-2.5 sm:gap-3 text-text-main font-medium text-sm sm:text-base">
              <span className="size-7 sm:size-8 rounded-full shadow-neu-pressed text-primary flex items-center justify-center shrink-0" aria-hidden="true">
                <span className="material-symbols-outlined text-xs sm:text-sm">{item.icon}</span>
              </span>
              {item.text}
            </li>
          ))}
        </ul>
      </div>
      <div className="lg:w-1/2 relative h-[250px] sm:h-[300px] md:h-[400px] w-full flex items-center justify-center mt-4 sm:mt-8 lg:mt-0">
        <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="relative z-10 size-20 sm:size-24 md:size-32 bg-background-light rounded-full shadow-neu-floating flex items-center justify-center">
          <span className="material-symbols-outlined text-2xl sm:text-3xl md:text-4xl text-primary">dataset</span>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] md:w-[280px] md:h-[280px] rounded-full border border-primary/10">
          <div className="absolute -top-4 sm:-top-5 md:-top-6 left-1/2 -translate-x-1/2 size-10 sm:size-12 md:size-16 bg-background-light rounded-full shadow-neu-flat-sm flex items-center justify-center animate-float" style={{ animationDelay: '0s' }}>
            <span className="material-symbols-outlined text-primary text-lg sm:text-xl md:text-2xl">payments</span>
          </div>
          <div className="absolute -bottom-4 sm:-bottom-5 md:-bottom-6 left-1/2 -translate-x-1/2 size-10 sm:size-12 md:size-16 bg-background-light rounded-full shadow-neu-flat-sm flex items-center justify-center animate-float" style={{ animationDelay: '1.5s' }}>
            <span className="material-symbols-outlined text-brand-end text-lg sm:text-xl md:text-2xl">local_shipping</span>
          </div>
          <div className="absolute top-1/2 -right-4 sm:-right-5 md:-right-6 -translate-y-1/2 size-10 sm:size-12 md:size-16 bg-background-light rounded-full shadow-neu-flat-sm flex items-center justify-center animate-float" style={{ animationDelay: '3s' }}>
            <span className="material-symbols-outlined text-primary text-lg sm:text-xl md:text-2xl">receipt_long</span>
          </div>
          <div className="absolute top-1/2 -left-4 sm:-left-5 md:-left-6 -translate-y-1/2 size-10 sm:size-12 md:size-16 bg-background-light rounded-full shadow-neu-flat-sm flex items-center justify-center animate-float" style={{ animationDelay: '4.5s' }}>
            <span className="material-symbols-outlined text-brand-end text-lg sm:text-xl md:text-2xl">chat</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Integrations;