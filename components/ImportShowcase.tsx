import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const ImportShowcase: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);
  const { t, dir } = useLanguage();

  const steps = [
    { key: 'step1', icon: 'photo_library' },
    { key: 'step2', icon: 'cloud_download' },
    { key: 'step3', icon: 'storefront' },
  ];

  const advanceStep = useCallback(() => {
    setActiveStep((prev) => (prev + 1) % 3);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(advanceStep, 3500);
    return () => clearInterval(interval);
  }, [isPaused, advanceStep]);

  // Animate progress bar in step 2
  useEffect(() => {
    if (activeStep === 1) {
      setProgressWidth(0);
      const timeout = setTimeout(() => setProgressWidth(100), 100);
      return () => clearTimeout(timeout);
    } else {
      setProgressWidth(0);
    }
  }, [activeStep]);

  // Simulated Instagram product grid colors
  const productColors = [
    'bg-blue-100', 'bg-pink-100', 'bg-amber-100',
    'bg-emerald-100', 'bg-purple-100', 'bg-rose-100',
    'bg-cyan-100', 'bg-indigo-100', 'bg-orange-100',
  ];

  const productNames = [
    { en: 'Leather Bag', ar: 'شنطة جلد' },
    { en: 'Watch', ar: 'ساعة' },
    { en: 'Scarf', ar: 'إيشارب' },
    { en: 'Earrings', ar: 'حلق' },
    { en: 'Sunglasses', ar: 'نضارة' },
    { en: 'Bracelet', ar: 'أسورة' },
  ];

  const productPrices = ['350', '1,200', '180', '250', '450', '320'];

  return (
    <div className="max-w-6xl mx-auto w-full px-4">
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
        {/* Text side */}
        <div className="lg:w-1/2 text-center lg:text-start">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full shadow-neu-pressed-sm mb-4 w-fit mx-auto lg:mx-0">
            <span className="material-symbols-outlined text-primary text-sm">share</span>
            <span className="text-[10px] sm:text-xs font-semibold text-text-muted tracking-wide uppercase">Social Commerce</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-text-main dark:text-white mb-3 sm:mb-4 tracking-tight">
            {t('import.title')}
          </h2>
          <p className="text-text-muted text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0">
            {t('import.subtitle')}
          </p>
          <div className="flex flex-col gap-4 sm:gap-5">
            {steps.map((step, idx) => (
              <button
                key={step.key}
                onClick={() => { setActiveStep(idx); setIsPaused(true); setTimeout(() => setIsPaused(false), 5000); }}
                className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl transition-all duration-300 text-start ${
                  activeStep === idx
                    ? 'shadow-neu-pressed bg-background-light scale-[1.02]'
                    : 'hover:bg-background-alt/50'
                }`}
              >
                <div className={`size-10 sm:size-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                  activeStep === idx
                    ? 'bg-brand-gradient text-white shadow-neu-primary'
                    : 'shadow-neu-flat-sm text-primary'
                }`}>
                  <span className="material-symbols-outlined text-lg sm:text-xl">{step.icon}</span>
                </div>
                <div>
                  <p className={`font-bold text-sm sm:text-base transition-colors duration-300 ${
                    activeStep === idx ? 'text-primary' : 'text-text-main'
                  }`}>
                    {t(`import.${step.key}_title`)}
                  </p>
                  <p className="text-text-muted text-xs sm:text-sm mt-0.5">
                    {t(`import.${step.key}_desc`)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Phone mockup side */}
        <div className="lg:w-1/2 flex items-center justify-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative">
            {/* Phone frame */}
            <div className="relative w-[260px] sm:w-[280px] md:w-[300px] h-[520px] sm:h-[560px] md:h-[600px] bg-white rounded-[2.5rem] border-[6px] border-gray-800 shadow-neu-floating overflow-hidden">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-800 rounded-b-2xl z-20"></div>

              {/* Status bar */}
              <div className="h-10 bg-white flex items-end justify-between px-6 pb-1">
                <span className="text-[10px] font-semibold text-gray-800">9:41</span>
                <div className="flex gap-1">
                  <span className="material-symbols-outlined text-[10px] text-gray-800">signal_cellular_alt</span>
                  <span className="material-symbols-outlined text-[10px] text-gray-800">battery_full</span>
                </div>
              </div>

              {/* Screen content */}
              <div className="relative h-[calc(100%-40px)] overflow-hidden">
                {/* Step 1: Instagram-style feed */}
                <div
                  className="absolute inset-0 p-3 flex flex-col transition-all duration-500"
                  style={{
                    opacity: activeStep === 0 ? 1 : 0,
                    transform: `translateX(${activeStep === 0 ? '0' : activeStep > 0 ? (dir === 'rtl' ? '100%' : '-100%') : (dir === 'rtl' ? '-100%' : '100%')})`,
                  }}
                >
                  {/* Instagram header */}
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2">
                      <div className="size-7 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">IG</span>
                      </div>
                      <span className="text-xs font-bold text-gray-800">your_store</span>
                    </div>
                    <span className="text-[10px] text-primary font-bold">Select All</span>
                  </div>

                  {/* Product grid */}
                  <div className="grid grid-cols-3 gap-1.5 flex-1">
                    {productColors.map((color, idx) => (
                      <div
                        key={idx}
                        className={`${color} rounded-lg relative overflow-hidden aspect-square flex items-center justify-center transition-all duration-300`}
                        style={{ animationDelay: `${idx * 100}ms` }}
                      >
                        <span className="material-symbols-outlined text-gray-400 text-2xl">image</span>
                        {idx < 6 && (
                          <div className="absolute top-1 right-1 size-4 rounded-full bg-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-[10px]">check</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Import button */}
                  <div className="mt-3">
                    <div className="bg-brand-gradient text-white text-xs font-bold py-2.5 rounded-xl text-center flex items-center justify-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">cloud_download</span>
                      <span>Import 6 Products</span>
                    </div>
                  </div>
                </div>

                {/* Step 2: Dashboard import */}
                <div
                  className="absolute inset-0 p-3 flex flex-col transition-all duration-500"
                  style={{
                    opacity: activeStep === 1 ? 1 : 0,
                    transform: `translateX(${activeStep === 1 ? '0' : activeStep > 1 ? (dir === 'rtl' ? '100%' : '-100%') : (dir === 'rtl' ? '-100%' : '100%')})`,
                  }}
                >
                  {/* Dashboard header */}
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <div className="size-6 rounded-md bg-brand-gradient flex items-center justify-center">
                      <span className="text-white text-[8px] font-black">N</span>
                    </div>
                    <span className="text-xs font-bold text-gray-800">NUMU Dashboard</span>
                  </div>

                  {/* Progress section */}
                  <div className="bg-blue-50 rounded-xl p-3 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-gray-700">Importing Products...</span>
                      <span className="text-[10px] font-bold text-primary">{activeStep === 1 ? '6/6' : '0/6'}</span>
                    </div>
                    <div className="h-2 bg-white rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-gradient rounded-full transition-all duration-[2500ms] ease-out"
                        style={{ width: `${progressWidth}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Imported product list */}
                  <div className="flex-1 space-y-2 overflow-hidden">
                    {productNames.slice(0, 6).map((product, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg transition-all duration-500"
                        style={{
                          opacity: activeStep === 1 ? 1 : 0,
                          transform: activeStep === 1 ? 'translateY(0)' : 'translateY(10px)',
                          transitionDelay: `${idx * 300 + 200}ms`,
                        }}
                      >
                        <div className={`size-8 ${productColors[idx]} rounded-md flex items-center justify-center shrink-0`}>
                          <span className="material-symbols-outlined text-gray-400 text-sm">image</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-medium text-gray-800 truncate">{dir === 'rtl' ? product.ar : product.en}</p>
                          <p className="text-[8px] text-gray-400">EGP {productPrices[idx]}</p>
                        </div>
                        <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step 3: Live store */}
                <div
                  className="absolute inset-0 p-3 flex flex-col transition-all duration-500"
                  style={{
                    opacity: activeStep === 2 ? 1 : 0,
                    transform: `translateX(${activeStep === 2 ? '0' : activeStep < 2 ? (dir === 'rtl' ? '-100%' : '100%') : (dir === 'rtl' ? '100%' : '-100%')})`,
                  }}
                >
                  {/* Store header */}
                  <div className="flex items-center justify-between mb-3 px-1">
                    <span className="text-xs font-bold text-gray-800">{dir === 'rtl' ? 'متجرك' : 'Your Store'}</span>
                    <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      <span className="size-1.5 rounded-full bg-green-500"></span>
                      <span className="text-[8px] font-bold">{dir === 'rtl' ? 'مباشر' : 'Live'}</span>
                    </div>
                  </div>

                  {/* Product grid */}
                  <div className="grid grid-cols-2 gap-2 flex-1 overflow-hidden">
                    {productNames.slice(0, 6).map((product, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 rounded-xl overflow-hidden flex flex-col transition-all duration-500"
                        style={{
                          opacity: activeStep === 2 ? 1 : 0,
                          transform: activeStep === 2 ? 'scale(1)' : 'scale(0.8)',
                          transitionDelay: `${idx * 150}ms`,
                        }}
                      >
                        <div className={`${productColors[idx]} aspect-square flex items-center justify-center`}>
                          <span className="material-symbols-outlined text-gray-400 text-xl">image</span>
                        </div>
                        <div className="p-1.5">
                          <p className="text-[9px] font-medium text-gray-800 truncate">{dir === 'rtl' ? product.ar : product.en}</p>
                          <p className="text-[9px] font-bold text-primary">{dir === 'rtl' ? `${productPrices[idx]} ج.م` : `EGP ${productPrices[idx]}`}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Success badge */}
                  <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-2 flex items-center justify-center gap-1.5"
                    style={{
                      opacity: activeStep === 2 ? 1 : 0,
                      transition: 'opacity 500ms ease',
                      transitionDelay: '1000ms',
                    }}
                  >
                    <span className="material-symbols-outlined text-green-600 text-sm">celebration</span>
                    <span className="text-[10px] font-bold text-green-700">
                      {dir === 'rtl' ? '6 منتجات اتضافوا بنجاح!' : '6 products added successfully!'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Home indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gray-300 rounded-full"></div>
            </div>

            {/* Step indicator dots */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => { setActiveStep(idx); setIsPaused(true); setTimeout(() => setIsPaused(false), 5000); }}
                  className={`rounded-full transition-all duration-300 ${
                    activeStep === idx
                      ? 'w-8 h-2.5 bg-brand-gradient'
                      : 'size-2.5 bg-primary/20 hover:bg-primary/40'
                  }`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportShowcase;
