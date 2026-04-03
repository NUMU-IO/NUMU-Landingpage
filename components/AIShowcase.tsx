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

  const aiTextEn = 'Handcrafted genuine leather crossbody bag with adjustable strap and gold-tone hardware. Perfect for everyday elegance.';
  const aiTextAr = 'شنطة كروس من الجلد الطبيعي بحزام قابل للتعديل وإكسسوارات دهبي. مثالية للأناقة اليومية.';
  const aiText = dir === 'rtl' ? aiTextAr : aiTextEn;

  useEffect(() => {
    if (activeStep === 1) {
      setTypedChars(0);
      const interval = setInterval(() => {
        setTypedChars((prev) => {
          if (prev >= aiText.length) { clearInterval(interval); return prev; }
          return prev + 2;
        });
      }, 30);
      return () => clearInterval(interval);
    } else {
      setTypedChars(0);
    }
  }, [activeStep, aiText.length]);

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
      <div className="flex flex-col lg:flex-row-reverse items-center gap-10 lg:gap-20">
        {/* Text side */}
        <div className="lg:w-1/2 text-center lg:text-start">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-100 mb-6 w-fit mx-auto lg:mx-0">
            <span className="material-symbols-outlined text-violet-500 text-sm">auto_awesome</span>
            <span className="text-[11px] font-semibold text-violet-600 tracking-wide">{dir === 'rtl' ? 'مدعوم بالذكاء الاصطناعي' : 'AI Powered'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold text-text-main mb-4 tracking-tight">
            {t('ai.title')}
          </h2>
          <p className="text-text-muted text-sm sm:text-base md:text-lg mb-8 max-w-lg mx-auto lg:mx-0 font-body">
            {t('ai.subtitle')}
          </p>
          <div className="flex flex-col gap-3">
            {steps.map((step, idx) => (
              <button
                key={step.key}
                onClick={() => { setActiveStep(idx); setIsPaused(true); setTimeout(() => setIsPaused(false), 5000); }}
                className={`flex items-start gap-3 sm:gap-4 p-4 rounded-2xl transition-all duration-300 text-start ${
                  activeStep === idx
                    ? 'shadow-neu-pressed bg-background-light'
                    : 'hover:bg-background-alt/50'
                }`}
              >
                <div className={`size-10 sm:size-11 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                  activeStep === idx
                    ? 'bg-brand-gradient text-white shadow-neu-primary'
                    : 'shadow-neu-flat-sm text-primary'
                }`}>
                  <span className="material-symbols-outlined text-lg">{step.icon}</span>
                </div>
                <div>
                  <p className={`font-display font-semibold text-sm sm:text-base transition-colors duration-300 ${
                    activeStep === idx ? 'text-text-main' : 'text-text-muted'
                  }`}>
                    {t(`ai.${step.key}_title`)}
                  </p>
                  <p className="text-text-muted text-xs sm:text-sm mt-0.5 font-body">
                    {t(`ai.${step.key}_desc`)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Phone mockup */}
        <div className="lg:w-1/2 flex items-center justify-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative">
            <div className="relative w-[260px] sm:w-[280px] md:w-[300px] h-[520px] sm:h-[560px] md:h-[600px] bg-background-light rounded-[2.5rem] border-[6px] border-gray-800 shadow-neu-floating overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-800 rounded-b-2xl z-20" />
              <div className="h-10 bg-background-light flex items-end justify-between px-6 pb-1">
                <span className="text-[10px] font-semibold text-text-main">9:41</span>
                <div className="flex gap-1">
                  <span className="material-symbols-outlined text-[10px] text-text-main">signal_cellular_alt</span>
                  <span className="material-symbols-outlined text-[10px] text-text-main">battery_full</span>
                </div>
              </div>

              <div className="relative h-[calc(100%-40px)] overflow-hidden">
                {/* Step 1 */}
                <div className="absolute inset-0 p-3 flex flex-col transition-all duration-500" style={{
                  opacity: activeStep === 0 ? 1 : 0,
                  transform: `translateX(${activeStep === 0 ? '0' : activeStep > 0 ? (dir === 'rtl' ? '100%' : '-100%') : (dir === 'rtl' ? '-100%' : '100%')})`,
                }}>
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <div className="size-6 rounded-md bg-accent flex items-center justify-center">
                      <span className="text-white text-[8px] font-black">N</span>
                    </div>
                    <span className="text-xs font-bold text-text-main">{dir === 'rtl' ? 'اختار منتج' : 'Select Product'}</span>
                  </div>
                  <div className="bg-background-alt rounded-2xl overflow-hidden mb-3">
                    <div className="bg-amber-100 h-32 flex items-center justify-center">
                      <span className="material-symbols-outlined text-amber-300 text-5xl">shopping_bag</span>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-bold text-text-main">{dir === 'rtl' ? 'شنطة جلد طبيعي' : 'Leather Crossbody Bag'}</p>
                      <p className="text-xs text-accent font-bold mt-1">{dir === 'rtl' ? '٤٥٠ ج.م' : 'EGP 450'}</p>
                    </div>
                  </div>
                  <div className="bg-background-alt rounded-2xl p-3 flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-text-muted">{dir === 'rtl' ? 'الوصف' : 'Description'}</span>
                      <span className="text-[8px] text-text-muted">{dir === 'rtl' ? 'فاضي' : 'Empty'}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-background-light rounded-full w-full shadow-neu-pressed-sm" />
                      <div className="h-2 bg-background-light rounded-full w-3/4 shadow-neu-pressed-sm" />
                      <div className="h-2 bg-background-light rounded-full w-1/2 shadow-neu-pressed-sm" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="bg-violet-500 text-white text-xs font-bold py-2.5 rounded-2xl text-center flex items-center justify-center gap-1.5 shadow-neu-primary">
                      <span className="material-symbols-outlined text-sm">auto_awesome</span>
                      <span>{dir === 'rtl' ? 'اكتب بالذكاء الاصطناعي' : 'Generate with AI'}</span>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="absolute inset-0 p-3 flex flex-col transition-all duration-500" style={{
                  opacity: activeStep === 1 ? 1 : 0,
                  transform: `translateX(${activeStep === 1 ? '0' : activeStep > 1 ? (dir === 'rtl' ? '100%' : '-100%') : (dir === 'rtl' ? '-100%' : '100%')})`,
                }}>
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <div className="size-6 rounded-md bg-accent flex items-center justify-center">
                      <span className="text-white text-[8px] font-black">N</span>
                    </div>
                    <span className="text-xs font-bold text-text-main">{dir === 'rtl' ? 'الذكاء الاصطناعي بيكتب...' : 'AI Writing...'}</span>
                    <div className="flex gap-0.5 items-center ms-auto">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="size-1.5 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-background-alt rounded-2xl p-2 mb-3">
                    <div className="size-10 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-amber-300 text-lg">shopping_bag</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-text-main">{dir === 'rtl' ? 'شنطة جلد طبيعي' : 'Leather Crossbody Bag'}</p>
                      <p className="text-[8px] text-accent font-bold">{dir === 'rtl' ? '٤٥٠ ج.م' : 'EGP 450'}</p>
                    </div>
                  </div>
                  <div className="bg-violet-50 rounded-2xl p-3 flex-1 border border-violet-100">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="material-symbols-outlined text-violet-500 text-xs">auto_awesome</span>
                      <span className="text-[10px] font-bold text-violet-600">{dir === 'rtl' ? 'وصف عربي' : 'English Description'}</span>
                    </div>
                    <p className="text-[10px] text-text-main leading-relaxed" style={{ direction: dir }}>
                      {aiText.slice(0, typedChars)}
                      {typedChars < aiText.length && (
                        <span className="inline-block w-0.5 h-3 bg-violet-500 animate-pulse ms-0.5 align-middle" />
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <div className="flex-1 bg-accent/10 rounded-2xl py-2 text-center">
                      <span className="text-[10px] font-bold text-accent">{dir === 'rtl' ? 'عربي ✓' : 'English ✓'}</span>
                    </div>
                    <div className="flex-1 bg-background-alt rounded-2xl py-2 text-center">
                      <span className="text-[10px] font-bold text-text-muted">{dir === 'rtl' ? 'English' : 'العربية'}</span>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="absolute inset-0 p-3 flex flex-col transition-all duration-500" style={{
                  opacity: activeStep === 2 ? 1 : 0,
                  transform: `translateX(${activeStep === 2 ? '0' : activeStep < 2 ? (dir === 'rtl' ? '-100%' : '100%') : (dir === 'rtl' ? '100%' : '-100%')})`,
                }}>
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <div className="size-6 rounded-md bg-accent flex items-center justify-center">
                      <span className="text-white text-[8px] font-black">N</span>
                    </div>
                    <span className="text-xs font-bold text-text-main">{dir === 'rtl' ? 'جاهز للنشر' : 'Ready to Publish'}</span>
                  </div>
                  <div className="bg-background-alt rounded-2xl overflow-hidden mb-3 transition-all duration-500" style={{
                    opacity: activeStep === 2 ? 1 : 0,
                    transform: activeStep === 2 ? 'translateY(0)' : 'translateY(10px)',
                  }}>
                    <div className="bg-amber-100 h-24 flex items-center justify-center relative">
                      <span className="material-symbols-outlined text-amber-300 text-4xl">shopping_bag</span>
                      <div className="absolute top-2 end-2 bg-emerald-500 text-white text-[7px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[8px]">check</span>
                        SEO
                      </div>
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs font-bold text-text-main">{dir === 'rtl' ? 'شنطة جلد طبيعي' : 'Leather Crossbody Bag'}</p>
                      <p className="text-[9px] text-accent font-bold">{dir === 'rtl' ? '٤٥٠ ج.م' : 'EGP 450'}</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-2xl p-2.5 mb-2 transition-all duration-500" style={{ opacity: activeStep === 2 ? 1 : 0, transitionDelay: '200ms' }}>
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-[8px] font-bold text-blue-600">EN</span>
                      <span className="material-symbols-outlined text-emerald-500 text-[10px]">check_circle</span>
                    </div>
                    <p className="text-[8px] text-text-muted leading-relaxed">Handcrafted genuine leather crossbody bag with adjustable strap and gold-tone hardware.</p>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-2.5 mb-2 transition-all duration-500" style={{ opacity: activeStep === 2 ? 1 : 0, transitionDelay: '400ms' }}>
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-[8px] font-bold text-emerald-600">AR</span>
                      <span className="material-symbols-outlined text-emerald-500 text-[10px]">check_circle</span>
                    </div>
                    <p className="text-[8px] text-text-muted leading-relaxed" dir="rtl">شنطة كروس من الجلد الطبيعي بحزام قابل للتعديل وإكسسوارات دهبي.</p>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3 transition-all duration-500" style={{ opacity: activeStep === 2 ? 1 : 0, transitionDelay: '600ms' }}>
                    {(dir === 'rtl' ? ['شنط جلد', 'كروس بادي', 'اكسسوارات'] : ['leather bag', 'crossbody', 'accessories']).map((tag, i) => (
                      <span key={i} className="text-[7px] font-medium bg-background-alt text-text-muted px-2 py-0.5 rounded-full shadow-neu-flat-sm">#{tag}</span>
                    ))}
                  </div>
                  <div className="mt-auto bg-emerald-50 border border-emerald-200 rounded-2xl p-2 flex items-center justify-center gap-1.5" style={{
                    opacity: activeStep === 2 ? 1 : 0,
                    transition: 'opacity 500ms ease',
                    transitionDelay: '800ms',
                  }}>
                    <span className="material-symbols-outlined text-emerald-600 text-sm">task_alt</span>
                    <span className="text-[10px] font-bold text-emerald-700">
                      {dir === 'rtl' ? 'الوصف جاهز بلغتين!' : 'Bilingual descriptions ready!'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-background-alt rounded-full" />
            </div>

            <div className="flex items-center justify-center gap-2 mt-6">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => { setActiveStep(idx); setIsPaused(true); setTimeout(() => setIsPaused(false), 5000); }}
                  className={`rounded-full transition-all duration-300 ${
                    activeStep === idx ? 'w-8 h-2.5 bg-violet-500 shadow-neu-primary' : 'size-2.5 bg-background-alt shadow-neu-flat-sm hover:shadow-neu-pressed-sm'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIShowcase;
