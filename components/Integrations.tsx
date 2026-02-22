import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Integrations: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-20 px-4">
      <div className="lg:w-1/2 text-center lg:text-start">
        <h2 className="text-3xl md:text-4xl font-bold text-text-main dark:text-white mb-6">{t('integrations.title')}</h2>
        <p className="text-text-muted text-lg mb-8">
          {t('integrations.subtitle')}
        </p>
        <ul className="space-y-4 text-start inline-block">
          {[
            { icon: 'payments', text: t('integrations.paymob') },
            { icon: 'local_shipping', text: t('integrations.bosta') },
            { icon: 'chat', text: t('integrations.whatsapp') },
            { icon: 'auto_awesome', text: t('integrations.ai') },
          ].map((item, idx) => (
            <li key={idx} className="flex items-center gap-3 text-text-main font-medium">
              <span className="size-8 rounded-full shadow-neu-pressed text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">{item.icon}</span>
              </span>
              {item.text}
            </li>
          ))}
        </ul>
      </div>
      <div className="lg:w-1/2 relative h-[300px] md:h-[400px] w-full flex items-center justify-center mt-8 lg:mt-0">
        <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="relative z-10 size-24 md:size-32 bg-background-light rounded-full shadow-neu-floating flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl md:text-4xl text-primary">dataset</span>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] md:w-[280px] md:h-[280px] rounded-full border border-primary/10">
          <div className="absolute -top-5 md:-top-6 left-1/2 -translate-x-1/2 size-12 md:size-16 bg-background-light rounded-full shadow-neu-flat-sm flex items-center justify-center animate-float" style={{ animationDelay: '0s' }}>
            <span className="material-symbols-outlined text-primary text-xl md:text-2xl">payments</span>
          </div>
          <div className="absolute -bottom-5 md:-bottom-6 left-1/2 -translate-x-1/2 size-12 md:size-16 bg-background-light rounded-full shadow-neu-flat-sm flex items-center justify-center animate-float" style={{ animationDelay: '1.5s' }}>
            <span className="material-symbols-outlined text-brand-end text-xl md:text-2xl">local_shipping</span>
          </div>
          <div className="absolute top-1/2 -right-5 md:-right-6 -translate-y-1/2 size-12 md:size-16 bg-background-light rounded-full shadow-neu-flat-sm flex items-center justify-center animate-float" style={{ animationDelay: '3s' }}>
            <span className="material-symbols-outlined text-primary text-xl md:text-2xl">receipt_long</span>
          </div>
          <div className="absolute top-1/2 -left-5 md:-left-6 -translate-y-1/2 size-12 md:size-16 bg-background-light rounded-full shadow-neu-flat-sm flex items-center justify-center animate-float" style={{ animationDelay: '4.5s' }}>
            <span className="material-symbols-outlined text-brand-end text-xl md:text-2xl">chat</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Integrations;