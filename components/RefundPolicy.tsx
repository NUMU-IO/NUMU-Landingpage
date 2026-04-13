import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const RefundPolicy: React.FC = () => {
  const { t } = useLanguage();

  const cards = [
    {
      icon: (
        <svg className="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
        </svg>
      ),
      title: t('refund.card1_title'),
      desc: t('refund.card1_desc'),
    },
    {
      icon: (
        <svg className="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
        </svg>
      ),
      title: t('refund.card2_title'),
      desc: t('refund.card2_desc'),
    },
    {
      icon: (
        <svg className="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
      title: t('refund.card3_title'),
      desc: t('refund.card3_desc'),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-12 sm:mb-16">
        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 mb-4">
          {t('refund.badge')}
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text-main dark:text-white mb-4">
          {t('refund.title')}
        </h2>
        <p className="text-text-muted text-sm sm:text-base max-w-xl mx-auto">
          {t('refund.subtitle')}
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {cards.map((card, i) => (
          <div
            key={i}
            className="group relative rounded-3xl p-8 sm:p-10 bg-background-light dark:bg-background-dark shadow-neu-flat hover:shadow-neu-flat-sm transition-all duration-300 hover:-translate-y-1 text-center"
          >
            <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              {card.icon}
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-text-main dark:text-white mb-3">
              {card.title}
            </h3>
            <p className="text-sm text-text-muted leading-relaxed">
              {card.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Link to full policy */}
      <div className="text-center mt-10">
        <Link
          to="/refund"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] text-white font-bold text-sm shadow-neu-flat hover:shadow-neu-flat-sm hover:scale-[1.01] active:shadow-neu-pressed transition-all"
        >
          <span className="material-symbols-outlined text-base">description</span>
          {t('refund.view_full')}
        </Link>
      </div>
    </div>
  );
};

export default RefundPolicy;
