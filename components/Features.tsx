import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Features: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="max-w-6xl mx-auto w-full px-4">
      <div className="mb-8 md:mb-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-text-main dark:text-white mb-4">{t('features.title')}</h2>
        <p className="text-text-muted max-w-2xl mx-auto">{t('features.subtitle')}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {[
          { icon: 'payments', title: t('features.payments.title'), desc: t('features.payments.desc') },
          { icon: 'local_shipping', title: t('features.logistics.title'), desc: t('features.logistics.desc') },
          { icon: 'receipt_long', title: t('features.tax.title'), desc: t('features.tax.desc') },
          { icon: 'translate', title: t('features.arabic.title'), desc: t('features.arabic.desc') },
        ].map((feature, idx) => (
          <div key={idx} className="bg-background-light dark:bg-background-dark rounded-3xl shadow-neu-flat p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-2 duration-300 h-full justify-center">
            <div className="size-16 rounded-full shadow-neu-pressed flex items-center justify-center text-primary mb-6">
              <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
            </div>
            <h3 className="text-lg font-bold text-text-main dark:text-white mb-2">{feature.title}</h3>
            <p className="text-sm text-text-muted">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;