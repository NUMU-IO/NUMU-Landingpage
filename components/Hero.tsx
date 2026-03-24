import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Hero: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(3);
  const bars = [40, 60, 30, 80, 55];
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full px-4 md:px-8 pt-4 sm:pt-6 lg:pt-20 pb-8 sm:pb-12 lg:pb-0">
      <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6 text-center lg:text-start z-10">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-neu-pressed-sm w-fit mx-auto lg:mx-0">
          <span className="size-2 rounded-full bg-brand-gradient animate-pulse"></span>
          <span className="text-[10px] sm:text-xs font-semibold text-text-muted tracking-wide uppercase">{t('hero.built_for')}</span>
        </div>
        <h1 className="text-[1.75rem] sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-text-main dark:text-white">
          {t('hero.title_start')} <br />
          <span className="bg-brand-gradient bg-clip-text text-transparent">{t('hero.title_highlight')}</span>
        </h1>
        <p className="text-text-muted text-sm sm:text-base md:text-lg lg:text-xl font-normal leading-relaxed max-w-lg mx-auto lg:mx-0">
          {t('hero.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-2 sm:pt-4 w-full sm:w-auto">
          <Link to="/signup" className="bg-brand-gradient text-white text-sm sm:text-base font-bold h-11 sm:h-12 md:h-14 px-6 sm:px-8 rounded-2xl shadow-[5px_5px_10px_rgba(15,23,42,0.3),-5px_-5px_10px_rgba(255,255,255,0.9)] active:shadow-neu-pressed hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group w-full sm:w-auto">
            <span>{t('hero.cta_primary')}</span>
            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1 rtl:rotate-180">arrow_forward</span>
          </Link>
          <button className="bg-background-light dark:bg-background-dark text-text-main dark:text-white text-sm sm:text-base font-bold h-11 sm:h-12 md:h-14 px-6 sm:px-8 rounded-2xl shadow-neu-flat hover:shadow-neu-flat-sm active:shadow-neu-pressed transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
            <span className="material-symbols-outlined text-primary">play_circle</span>
            <span>{t('hero.cta_secondary')}</span>
          </button>
        </div>
        <div className="pt-4 sm:pt-6 lg:pt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-6 text-text-muted text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="material-symbols-outlined text-primary text-base sm:text-lg">check_circle</span>
            <span>{t('hero.badge_eta')}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="material-symbols-outlined text-primary text-base sm:text-lg">check_circle</span>
            <span>{t('hero.badge_whatsapp')}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="material-symbols-outlined text-primary text-base sm:text-lg">check_circle</span>
            <span>{t('hero.badge_clean')}</span>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex relative w-full aspect-square md:aspect-[4/3] h-[500px] items-center justify-center perspective-[1000px]">
        <div className="absolute inset-0 bg-gradient-to-tr rtl:bg-gradient-to-tl from-primary/5 to-transparent rounded-full blur-3xl"></div>
        <div className="relative w-full max-w-sm bg-background-light dark:bg-background-dark rounded-3xl shadow-neu-floating p-6 md:p-8 transform rotate-y-12 rotate-x-6 rtl:-rotate-y-12 hover:rotate-0 transition-transform duration-700">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              <div className="size-3 rounded-full bg-red-400 shadow-neu-pressed-sm"></div>
              <div className="size-3 rounded-full bg-yellow-400 shadow-neu-pressed-sm"></div>
              <div className="size-3 rounded-full bg-green-400 shadow-neu-pressed-sm"></div>
            </div>
            <div className="h-2 w-16 rounded-full shadow-neu-pressed"></div>
          </div>
          <div className="bg-background-light dark:bg-background-dark rounded-2xl shadow-neu-pressed p-4 mb-4">
            <div className="flex justify-between items-end h-24 gap-2" onMouseLeave={() => setActiveIndex(3)}>
              {bars.map((height, index) => (
                <div
                  key={index}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`w-full rounded-t-md transition-all duration-300 cursor-pointer origin-bottom ${
                    activeIndex === index
                      ? 'bg-brand-gradient shadow-[0_0_15px_rgba(30,58,138,0.5)] scale-y-105'
                      : 'bg-primary/20 hover:bg-primary/30'
                  }`}
                  style={{ height: `${height}%` }}
                ></div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="bg-background-light rounded-xl shadow-neu-flat-sm p-3 w-[48%]">
              <div className="text-[10px] font-bold text-text-muted mb-1">{t('hero.stats.sales')}</div>
              <div className="text-sm font-black text-text-main">EGP 12,400</div>
            </div>
            <div className="bg-background-light rounded-xl shadow-neu-flat-sm p-3 w-[48%]">
              <div className="text-[10px] font-bold text-text-muted mb-1">{t('hero.stats.users')}</div>
              <div className="text-sm font-black text-text-main">342</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;