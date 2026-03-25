import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Waitlist: React.FC = () => {
  const { t, dir, language } = useLanguage();
  const [elapsed, setElapsed] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Timer counts up from when the user landed on this page
  useEffect(() => {
    const start = Date.now();

    const tick = () => {
      const diff = Math.floor((Date.now() - start) / 1000);
      setElapsed({
        days: Math.floor(diff / 86400),
        hours: Math.floor((diff % 86400) / 3600),
        minutes: Math.floor((diff % 3600) / 60),
        seconds: diff % 60,
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const timerBlocks = [
    { value: elapsed.days, label: t('waitlist.days') },
    { value: elapsed.hours, label: t('waitlist.hours') },
    { value: elapsed.minutes, label: t('waitlist.minutes') },
    { value: elapsed.seconds, label: t('waitlist.seconds') },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-6" dir={dir}>
      <div className="w-full max-w-lg text-center flex flex-col items-center gap-8">
        {/* Logo */}
        <Link to="/" className="inline-block hover:scale-105 transition-transform">
          <img src={language === 'ar' ? '/numu-logo-ar.png' : '/numu-logo-en.png'} alt="NUMU" className="h-10 w-auto object-contain" width="120" height="40" loading="eager" fetchPriority="high" />
        </Link>

        {/* Checkmark */}
        <div className="size-20 sm:size-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-neu-flat">
          <span className="material-symbols-outlined text-white text-4xl sm:text-5xl">check_circle</span>
        </div>

        {/* Title & subtitle */}
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-text-main dark:text-white">
            {t('waitlist.title')}
          </h1>
          <p className="text-text-muted text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            {t('waitlist.subtitle')}
          </p>
        </div>

        {/* Timer */}
        <div className="flex flex-col items-center gap-3 w-full">
          <p className="text-xs font-bold uppercase tracking-widest text-text-muted">
            {t('waitlist.time_on_waitlist')}
          </p>
          <div className="flex gap-2 sm:gap-3 md:gap-4" dir="ltr">
            {timerBlocks.map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5">
                <div className="w-14 sm:w-16 md:w-20 rounded-2xl bg-background-light dark:bg-background-dark shadow-[6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.9)] flex items-center justify-center">
                  <span className="text-xl sm:text-2xl md:text-3xl font-black text-text-main dark:text-white tabular-nums py-4">
                    {String(value).padStart(2, '0')}
                  </span>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Link
          to="/"
          className="bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] text-white font-bold h-12 sm:h-14 px-10 rounded-2xl shadow-neu-flat hover:shadow-neu-flat-sm active:shadow-neu-pressed hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
        >
          <span>{t('waitlist.back_home')}</span>
          <span className="material-symbols-outlined rtl:rotate-180">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
};

export default Waitlist;
