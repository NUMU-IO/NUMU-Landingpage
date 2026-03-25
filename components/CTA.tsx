import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const CTA: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="max-w-5xl mx-auto w-full px-4">
      <div className="relative rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] shadow-neu-floating p-6 sm:p-8 md:p-16 text-center overflow-hidden" style={{ background: 'hsl(222.2, 47.4%, 11.2%)' }}>
        {/* NUMU watermark pattern — same as merchant hub balance cards */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('/numu_v3.png')", backgroundSize: "100px", backgroundRepeat: "repeat" }} />

        <div className="relative z-10 flex flex-col items-center gap-4 sm:gap-6">
          <h2 className="font-arabic text-2xl sm:text-3xl md:text-5xl font-extrabold text-white tracking-tight">{t('cta.title')}</h2>
          <p className="text-white/50 text-sm sm:text-base md:text-lg max-w-xl">{t('cta.subtitle')}</p>
          <Link
            to="/signup"
            className="mt-2 sm:mt-4 bg-white text-brand-start text-sm sm:text-base md:text-lg font-bold h-12 sm:h-14 md:h-16 px-6 sm:px-8 md:px-10 rounded-2xl shadow-[6px_6px_12px_rgba(0,0,0,0.3)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <span>{t('cta.button')}</span>
            <span className="material-symbols-outlined">rocket_launch</span>
          </Link>
          <p className="text-xs text-white/30 font-medium mt-2 sm:mt-4">{t('cta.note')}</p>
        </div>
      </div>
    </div>
  );
};

export default CTA;
