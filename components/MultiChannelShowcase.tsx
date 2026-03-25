import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const MultiChannelShowcase: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { t, dir } = useLanguage();

  const steps = [
    { key: 'step1', icon: 'dashboard' },
    { key: 'step2', icon: 'share' },
    { key: 'step3', icon: 'monitoring' },
  ];

  const advanceStep = useCallback(() => {
    setActiveStep((prev) => (prev + 1) % 3);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(advanceStep, 3500);
    return () => clearInterval(interval);
  }, [isPaused, advanceStep]);

  const channels = [
    { icon: 'language', label: dir === 'rtl' ? 'الموقع' : 'Website', color: 'bg-blue-500', lightColor: 'bg-blue-50', orders: 24 },
    { icon: 'chat', label: dir === 'rtl' ? 'واتساب' : 'WhatsApp', color: 'bg-green-500', lightColor: 'bg-green-50', orders: 18 },
    { icon: 'photo_camera', label: dir === 'rtl' ? 'إنستجرام' : 'Instagram', color: 'bg-pink-500', lightColor: 'bg-pink-50', orders: 12 },
    { icon: 'thumb_up', label: dir === 'rtl' ? 'فيسبوك' : 'Facebook', color: 'bg-indigo-500', lightColor: 'bg-indigo-50', orders: 8 },
  ];

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
        {/* Text side */}
        <div className="lg:w-1/2 text-center lg:text-start">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background-alt shadow-neu-flat-sm mb-6 w-fit mx-auto lg:mx-0">
            <span className="material-symbols-outlined text-primary text-sm">devices</span>
            <span className="text-[11px] font-semibold text-primary tracking-wide">{dir === 'rtl' ? 'قنوات متعددة' : 'Multi-Channel'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold text-text-main mb-4 tracking-tight">
            {t('multichannel.title')}
          </h2>
          <p className="text-text-muted text-sm sm:text-base md:text-lg mb-8 max-w-lg mx-auto lg:mx-0 font-body">
            {t('multichannel.subtitle')}
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
                    {t(`multichannel.${step.key}_title`)}
                  </p>
                  <p className="text-text-muted text-xs sm:text-sm mt-0.5 font-body">
                    {t(`multichannel.${step.key}_desc`)}
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
                    <span className="text-xs font-bold text-text-main">{dir === 'rtl' ? 'لوحة التحكم' : 'Dashboard'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-background-alt rounded-2xl p-2 text-center shadow-neu-flat-sm">
                      <p className="text-lg font-black text-text-main">62</p>
                      <p className="text-[8px] text-text-muted font-medium">{dir === 'rtl' ? 'طلبات اليوم' : "Today's Orders"}</p>
                    </div>
                    <div className="bg-background-alt rounded-2xl p-2 text-center shadow-neu-flat-sm">
                      <p className="text-lg font-black text-text-main">4</p>
                      <p className="text-[8px] text-text-muted font-medium">{dir === 'rtl' ? 'قنوات فعالة' : 'Active Channels'}</p>
                    </div>
                  </div>
                  <div className="space-y-2 flex-1">
                    {channels.map((ch, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 p-2.5 bg-background-alt rounded-2xl shadow-neu-flat-sm transition-all duration-500" style={{
                        opacity: activeStep === 0 ? 1 : 0,
                        transform: activeStep === 0 ? 'translateX(0)' : `translateX(${dir === 'rtl' ? '20px' : '-20px'})`,
                        transitionDelay: `${idx * 150}ms`,
                      }}>
                        <div className={`size-9 ${ch.color} rounded-xl flex items-center justify-center shrink-0`}>
                          <span className="material-symbols-outlined text-white text-base">{ch.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold text-text-main">{ch.label}</p>
                          <p className="text-[8px] text-text-muted">{ch.orders} {dir === 'rtl' ? 'طلب' : 'orders'}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="size-1.5 rounded-full bg-emerald-500" />
                          <span className="text-[7px] text-emerald-600 font-bold">{dir === 'rtl' ? 'فعال' : 'Active'}</span>
                        </div>
                      </div>
                    ))}
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
                    <span className="text-xs font-bold text-text-main">{dir === 'rtl' ? 'انشر في كل مكان' : 'Publish Everywhere'}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-background-alt rounded-2xl p-2 mb-3 shadow-neu-flat-sm">
                    <div className="size-10 bg-pink-100 rounded-xl flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-pink-300 text-lg">checkroom</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-text-main">{dir === 'rtl' ? 'فستان صيفي' : 'Summer Dress'}</p>
                      <p className="text-[8px] text-accent font-bold">{dir === 'rtl' ? '٦٥٠ ج.م' : 'EGP 650'}</p>
                    </div>
                  </div>
                  <div className="space-y-2 flex-1">
                    {channels.map((ch, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 p-2.5 bg-background-alt rounded-2xl shadow-neu-flat-sm transition-all duration-500" style={{
                        opacity: activeStep === 1 ? 1 : 0,
                        transform: activeStep === 1 ? 'scale(1)' : 'scale(0.9)',
                        transitionDelay: `${idx * 200}ms`,
                      }}>
                        <div className={`size-8 ${ch.lightColor} rounded-xl flex items-center justify-center shrink-0`}>
                          <span className={`material-symbols-outlined ${ch.color.replace('bg-', 'text-')} text-sm`}>{ch.icon}</span>
                        </div>
                        <span className="text-[10px] font-medium text-text-main flex-1">{ch.label}</span>
                        <div className="w-8 h-4.5 bg-accent rounded-full flex items-center px-0.5 justify-end">
                          <div className="size-3.5 bg-white rounded-full shadow-sm" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3">
                    <div className="bg-brand-gradient text-white text-xs font-bold py-2.5 rounded-2xl text-center flex items-center justify-center gap-1.5 shadow-neu-primary">
                      <span className="material-symbols-outlined text-sm">publish</span>
                      <span>{dir === 'rtl' ? 'انشر في 4 قنوات' : 'Publish to 4 Channels'}</span>
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
                    <span className="text-xs font-bold text-text-main">{dir === 'rtl' ? 'التقارير الموحدة' : 'Unified Analytics'}</span>
                  </div>
                  <div className="bg-background-alt rounded-2xl p-3 mb-3 shadow-neu-flat-sm transition-all duration-500" style={{
                    opacity: activeStep === 2 ? 1 : 0,
                    transform: activeStep === 2 ? 'translateY(0)' : 'translateY(10px)',
                  }}>
                    <p className="text-[9px] text-text-muted font-medium mb-1">{dir === 'rtl' ? 'إجمالي الإيرادات' : 'Total Revenue'}</p>
                    <p className="text-xl font-black text-text-main">{dir === 'rtl' ? '١٢٨,٤٠٠ ج.م' : 'EGP 128,400'}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-emerald-500 text-xs">trending_up</span>
                      <span className="text-[8px] font-bold text-emerald-600">+23%</span>
                    </div>
                  </div>
                  <div className="space-y-2 flex-1">
                    {channels.map((ch, idx) => {
                      const percentages = [38, 29, 20, 13];
                      const amounts = ['48,800', '37,200', '25,700', '16,700'];
                      return (
                        <div key={idx} className="bg-background-alt rounded-2xl p-2.5 shadow-neu-flat-sm transition-all duration-500" style={{
                          opacity: activeStep === 2 ? 1 : 0,
                          transform: activeStep === 2 ? 'translateY(0)' : 'translateY(10px)',
                          transitionDelay: `${idx * 150 + 200}ms`,
                        }}>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-1.5">
                              <div className={`size-5 ${ch.color} rounded flex items-center justify-center`}>
                                <span className="material-symbols-outlined text-white text-[10px]">{ch.icon}</span>
                              </div>
                              <span className="text-[9px] font-bold text-text-main">{ch.label}</span>
                            </div>
                            <span className="text-[9px] font-bold text-text-muted">{dir === 'rtl' ? `${amounts[idx]} ج.م` : `EGP ${amounts[idx]}`}</span>
                          </div>
                          <div className="h-1.5 bg-background-light rounded-full overflow-hidden shadow-neu-pressed-sm">
                            <div className={`h-full ${ch.color} rounded-full transition-all duration-1000 ease-out`}
                              style={{ width: activeStep === 2 ? `${percentages[idx]}%` : '0%', transitionDelay: `${idx * 150 + 400}ms` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-3 bg-background-alt shadow-neu-flat-sm rounded-2xl p-2 flex items-center justify-center gap-1.5" style={{
                    opacity: activeStep === 2 ? 1 : 0,
                    transition: 'opacity 500ms ease',
                    transitionDelay: '1000ms',
                  }}>
                    <span className="material-symbols-outlined text-emerald-600 text-sm">insights</span>
                    <span className="text-[10px] font-bold text-emerald-700">
                      {dir === 'rtl' ? 'كل القنوات في مكان واحد!' : 'All channels in one place!'}
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
                    activeStep === idx ? 'w-8 h-2.5 bg-brand-gradient shadow-neu-primary' : 'size-2.5 bg-background-alt shadow-neu-flat-sm hover:shadow-neu-pressed-sm'
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

export default MultiChannelShowcase;
