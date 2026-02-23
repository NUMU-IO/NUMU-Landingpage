import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const AIShowcase: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [typedChars, setTypedChars] = useState(0);
  const { t, dir } = useLanguage();

  const steps = [
    { key: 'step1', icon: 'image' },
    { key: 'step2', icon: 'auto_awesome' },
    { key: 'step3', icon: 'check_circle' },
  ];

  const advanceStep = useCallback(() => {
    setActiveStep((prev) => (prev + 1) % 3);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(advanceStep, 3500);
    return () => clearInterval(interval);
  }, [isPaused, advanceStep]);

  // Typing animation for step 2
  const aiTextEn = 'Handcrafted genuine leather crossbody bag with adjustable strap and gold-tone hardware. Perfect for everyday elegance.';
  const aiTextAr = 'شنطة كروس من الجلد الطبيعي بحزام قابل للتعديل وإكسسوارات دهبي. مثالية للأناقة اليومية.';
  const aiText = dir === 'rtl' ? aiTextAr : aiTextEn;

  useEffect(() => {
    if (activeStep === 1) {
      setTypedChars(0);
      const interval = setInterval(() => {
        setTypedChars((prev) => {
          if (prev >= aiText.length) {
            clearInterval(interval);
            return prev;
          }
          return prev + 2;
        });
      }, 30);
      return () => clearInterval(interval);
    } else {
      setTypedChars(0);
    }
  }, [activeStep, aiText.length]);

  return (
    <div className="max-w-6xl mx-auto w-full px-4">
      <div className="flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-16">
        {/* Text side */}
        <div className="lg:w-1/2 text-center lg:text-start">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full shadow-neu-pressed-sm mb-4 w-fit mx-auto lg:mx-0">
            <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
            <span className="text-[10px] sm:text-xs font-semibold text-text-muted tracking-wide uppercase">{dir === 'rtl' ? 'مدعوم بالذكاء الاصطناعي' : 'AI Powered'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-text-main dark:text-white mb-3 sm:mb-4 tracking-tight">
            {t('ai.title')}
          </h2>
          <p className="text-text-muted text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0">
            {t('ai.subtitle')}
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
                    {t(`ai.${step.key}_title`)}
                  </p>
                  <p className="text-text-muted text-xs sm:text-sm mt-0.5">
                    {t(`ai.${step.key}_desc`)}
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
                {/* Step 1: Select a product */}
                <div
                  className="absolute inset-0 p-3 flex flex-col transition-all duration-500"
                  style={{
                    opacity: activeStep === 0 ? 1 : 0,
                    transform: `translateX(${activeStep === 0 ? '0' : activeStep > 0 ? (dir === 'rtl' ? '100%' : '-100%') : (dir === 'rtl' ? '-100%' : '100%')})`,
                  }}
                >
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <div className="size-6 rounded-md bg-brand-gradient flex items-center justify-center">
                      <span className="text-white text-[8px] font-black">N</span>
                    </div>
                    <span className="text-xs font-bold text-gray-800">{dir === 'rtl' ? 'اختار منتج' : 'Select Product'}</span>
                  </div>

                  {/* Product card */}
                  <div className="bg-gray-50 rounded-xl overflow-hidden mb-3">
                    <div className="bg-amber-100 h-32 flex items-center justify-center">
                      <span className="material-symbols-outlined text-amber-300 text-5xl">shopping_bag</span>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-bold text-gray-800">{dir === 'rtl' ? 'شنطة جلد طبيعي' : 'Leather Crossbody Bag'}</p>
                      <p className="text-xs text-primary font-bold mt-1">{dir === 'rtl' ? '٤٥٠ ج.م' : 'EGP 450'}</p>
                    </div>
                  </div>

                  {/* Empty description field */}
                  <div className="bg-gray-50 rounded-xl p-3 flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-gray-500">{dir === 'rtl' ? 'الوصف' : 'Description'}</span>
                      <span className="text-[8px] text-gray-400">{dir === 'rtl' ? 'فاضي' : 'Empty'}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-200 rounded-full w-full"></div>
                      <div className="h-2 bg-gray-200 rounded-full w-3/4"></div>
                      <div className="h-2 bg-gray-200 rounded-full w-1/2"></div>
                    </div>
                  </div>

                  {/* Generate button */}
                  <div className="mt-3">
                    <div className="bg-brand-gradient text-white text-xs font-bold py-2.5 rounded-xl text-center flex items-center justify-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">auto_awesome</span>
                      <span>{dir === 'rtl' ? 'اكتب بالذكاء الاصطناعي' : 'Generate with AI'}</span>
                    </div>
                  </div>
                </div>

                {/* Step 2: AI generating */}
                <div
                  className="absolute inset-0 p-3 flex flex-col transition-all duration-500"
                  style={{
                    opacity: activeStep === 1 ? 1 : 0,
                    transform: `translateX(${activeStep === 1 ? '0' : activeStep > 1 ? (dir === 'rtl' ? '100%' : '-100%') : (dir === 'rtl' ? '-100%' : '100%')})`,
                  }}
                >
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <div className="size-6 rounded-md bg-brand-gradient flex items-center justify-center">
                      <span className="text-white text-[8px] font-black">N</span>
                    </div>
                    <span className="text-xs font-bold text-gray-800">{dir === 'rtl' ? 'الذكاء الاصطناعي بيكتب...' : 'AI Writing...'}</span>
                    <div className="flex gap-0.5 items-center ms-auto">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="size-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 150}ms` }}></div>
                      ))}
                    </div>
                  </div>

                  {/* Product mini preview */}
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2 mb-3">
                    <div className="size-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-amber-300 text-lg">shopping_bag</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-800">{dir === 'rtl' ? 'شنطة جلد طبيعي' : 'Leather Crossbody Bag'}</p>
                      <p className="text-[8px] text-primary font-bold">{dir === 'rtl' ? '٤٥٠ ج.م' : 'EGP 450'}</p>
                    </div>
                  </div>

                  {/* AI typing output */}
                  <div className="bg-purple-50 rounded-xl p-3 flex-1 border border-purple-100">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="material-symbols-outlined text-purple-500 text-xs">auto_awesome</span>
                      <span className="text-[10px] font-bold text-purple-600">{dir === 'rtl' ? 'وصف عربي' : 'English Description'}</span>
                    </div>
                    <p className="text-[10px] text-gray-700 leading-relaxed" style={{ direction: dir }}>
                      {aiText.slice(0, typedChars)}
                      {typedChars < aiText.length && (
                        <span className="inline-block w-0.5 h-3 bg-purple-500 animate-pulse ms-0.5 align-middle"></span>
                      )}
                    </p>
                  </div>

                  {/* Language toggle */}
                  <div className="flex gap-2 mt-3">
                    <div className="flex-1 bg-primary/10 rounded-lg py-2 text-center">
                      <span className="text-[10px] font-bold text-primary">{dir === 'rtl' ? 'عربي ✓' : 'English ✓'}</span>
                    </div>
                    <div className="flex-1 bg-gray-100 rounded-lg py-2 text-center">
                      <span className="text-[10px] font-bold text-gray-500">{dir === 'rtl' ? 'English' : 'العربية'}</span>
                    </div>
                  </div>
                </div>

                {/* Step 3: Polished result */}
                <div
                  className="absolute inset-0 p-3 flex flex-col transition-all duration-500"
                  style={{
                    opacity: activeStep === 2 ? 1 : 0,
                    transform: `translateX(${activeStep === 2 ? '0' : activeStep < 2 ? (dir === 'rtl' ? '-100%' : '100%') : (dir === 'rtl' ? '100%' : '-100%')})`,
                  }}
                >
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <div className="size-6 rounded-md bg-brand-gradient flex items-center justify-center">
                      <span className="text-white text-[8px] font-black">N</span>
                    </div>
                    <span className="text-xs font-bold text-gray-800">{dir === 'rtl' ? 'جاهز للنشر' : 'Ready to Publish'}</span>
                  </div>

                  {/* Final product card */}
                  <div className="bg-gray-50 rounded-xl overflow-hidden mb-3 transition-all duration-500"
                    style={{
                      opacity: activeStep === 2 ? 1 : 0,
                      transform: activeStep === 2 ? 'translateY(0)' : 'translateY(10px)',
                    }}
                  >
                    <div className="bg-amber-100 h-24 flex items-center justify-center relative">
                      <span className="material-symbols-outlined text-amber-300 text-4xl">shopping_bag</span>
                      <div className="absolute top-2 end-2 bg-green-500 text-white text-[7px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[8px]">check</span>
                        SEO
                      </div>
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs font-bold text-gray-800">{dir === 'rtl' ? 'شنطة جلد طبيعي' : 'Leather Crossbody Bag'}</p>
                      <p className="text-[9px] text-primary font-bold">{dir === 'rtl' ? '٤٥٠ ج.م' : 'EGP 450'}</p>
                    </div>
                  </div>

                  {/* EN description */}
                  <div className="bg-blue-50 rounded-lg p-2.5 mb-2 transition-all duration-500"
                    style={{
                      opacity: activeStep === 2 ? 1 : 0,
                      transitionDelay: '200ms',
                    }}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-[8px] font-bold text-blue-600">EN</span>
                      <span className="material-symbols-outlined text-green-500 text-[10px]">check_circle</span>
                    </div>
                    <p className="text-[8px] text-gray-600 leading-relaxed">Handcrafted genuine leather crossbody bag with adjustable strap and gold-tone hardware.</p>
                  </div>

                  {/* AR description */}
                  <div className="bg-emerald-50 rounded-lg p-2.5 mb-2 transition-all duration-500"
                    style={{
                      opacity: activeStep === 2 ? 1 : 0,
                      transitionDelay: '400ms',
                    }}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-[8px] font-bold text-emerald-600">AR</span>
                      <span className="material-symbols-outlined text-green-500 text-[10px]">check_circle</span>
                    </div>
                    <p className="text-[8px] text-gray-600 leading-relaxed" dir="rtl">شنطة كروس من الجلد الطبيعي بحزام قابل للتعديل وإكسسوارات دهبي.</p>
                  </div>

                  {/* SEO tags */}
                  <div className="flex flex-wrap gap-1 mb-3 transition-all duration-500"
                    style={{
                      opacity: activeStep === 2 ? 1 : 0,
                      transitionDelay: '600ms',
                    }}
                  >
                    {(dir === 'rtl' ? ['شنط جلد', 'كروس بادي', 'اكسسوارات'] : ['leather bag', 'crossbody', 'accessories']).map((tag, i) => (
                      <span key={i} className="text-[7px] font-medium bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">#{tag}</span>
                    ))}
                  </div>

                  {/* Success */}
                  <div className="mt-auto bg-green-50 border border-green-200 rounded-xl p-2 flex items-center justify-center gap-1.5"
                    style={{
                      opacity: activeStep === 2 ? 1 : 0,
                      transition: 'opacity 500ms ease',
                      transitionDelay: '800ms',
                    }}
                  >
                    <span className="material-symbols-outlined text-green-600 text-sm">task_alt</span>
                    <span className="text-[10px] font-bold text-green-700">
                      {dir === 'rtl' ? 'الوصف جاهز بلغتين!' : 'Bilingual descriptions ready!'}
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

export default AIShowcase;
