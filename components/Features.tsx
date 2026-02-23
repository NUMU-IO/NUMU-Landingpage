import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Features: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="max-w-6xl mx-auto w-full px-4">
      <div className="mb-6 sm:mb-8 md:mb-16 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-main dark:text-white mb-2 sm:mb-4">{t('features.title')}</h2>
        <p className="text-text-muted text-sm sm:text-base max-w-2xl mx-auto">{t('features.subtitle')}</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {[
          { icon: 'payments', title: t('features.payments.title'), desc: t('features.payments.desc') },
          { icon: 'local_shipping', title: t('features.logistics.title'), desc: t('features.logistics.desc') },
          { icon: 'receipt_long', title: t('features.tax.title'), desc: t('features.tax.desc') },
          { icon: 'translate', title: t('features.arabic.title'), desc: t('features.arabic.desc') },
          { icon: 'share', title: t('features.social.title'), desc: t('features.social.desc') },
          { icon: 'auto_awesome', title: t('features.ai.title'), desc: t('features.ai.desc') },
          { icon: 'devices', title: t('features.multichannel.title'), desc: t('features.multichannel.desc') },
        ].map((feature, idx) => (
          <div key={idx} className="bg-background-light dark:bg-background-dark rounded-2xl md:rounded-3xl shadow-neu-flat p-5 sm:p-6 md:p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-2 duration-300 h-full justify-center">
            <div className="size-12 md:size-16 rounded-full shadow-neu-pressed flex items-center justify-center text-primary mb-4 md:mb-6">
              <span className="material-symbols-outlined text-2xl md:text-3xl">{feature.icon}</span>
            </div>
            <h3 className="text-base md:text-lg font-bold text-text-main dark:text-white mb-1.5 md:mb-2">{feature.title}</h3>
            <p className="text-xs md:text-sm text-text-muted">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;