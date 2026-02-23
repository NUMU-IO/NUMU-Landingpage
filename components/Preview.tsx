import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Preview: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(4);
  const { t } = useLanguage();
  const chartData = [
    { key: 'mon', height: '40%' },
    { key: 'tue', height: '60%' },
    { key: 'wed', height: '30%' },
    { key: 'thu', height: '80%' },
    { key: 'fri', height: '65%' },
  ];

  return (
    <div className="max-w-6xl mx-auto w-full flex flex-col items-center justify-center h-full px-4">
      <div className="text-center mb-4 sm:mb-6 lg:mb-12">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-main dark:text-white mb-2">{t('preview.title')}</h2>
        <p className="text-text-muted text-sm sm:text-base max-w-xl mx-auto">{t('preview.subtitle')}</p>
      </div>
      <div className="relative w-full max-w-4xl lg:aspect-video lg:h-[500px] flex items-center justify-center">
        <div className="relative w-full h-full bg-background-light dark:bg-background-dark rounded-2xl sm:rounded-3xl shadow-neu-floating p-3 sm:p-4 md:p-8 transform transition-transform duration-500 hover:scale-[1.01] flex flex-col min-h-[400px] sm:min-h-[500px] lg:min-h-0">
          <div className="flex justify-between items-center mb-3 sm:mb-4 md:mb-6 shrink-0">
            <div className="flex gap-1.5 sm:gap-2">
              <div className="size-2.5 sm:size-3 rounded-full bg-red-400 shadow-neu-pressed-sm"></div>
              <div className="size-2.5 sm:size-3 rounded-full bg-yellow-400 shadow-neu-pressed-sm"></div>
              <div className="size-2.5 sm:size-3 rounded-full bg-green-400 shadow-neu-pressed-sm"></div>
            </div>
            <div className="h-1.5 sm:h-2 w-16 sm:w-24 rounded-full shadow-neu-pressed"></div>
          </div>
          <div className="flex-grow flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-6 min-h-0 overflow-hidden">
            <div className="flex-grow flex flex-col gap-3 sm:gap-4 w-full md:w-2/3 min-h-0">
              <div className="bg-background-light dark:bg-background-dark rounded-xl sm:rounded-2xl shadow-neu-pressed p-3 sm:p-4 md:p-6 flex-grow flex flex-col justify-end min-h-0">
                <div className="flex justify-between items-end gap-3 pb-2 h-[120px] sm:h-[150px] md:h-full" onMouseLeave={() => setActiveIndex(4)}>
                  {chartData.map((item, index) => (
                    <div
                      key={item.key}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`w-full rounded-t-lg relative group cursor-pointer transition-all duration-300 origin-bottom ${
                        activeIndex === index
                          ? 'bg-brand-gradient shadow-[0_0_15px_rgba(30,58,138,0.5)] scale-y-105'
                          : 'bg-primary/20 hover:bg-primary/30'
                      }`}
                      style={{ height: item.height }}
                    ></div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs font-bold text-text-muted border-t border-gray-200/50 pt-2">
                  {chartData.map((item, index) => (
                    <span
                      key={item.key}
                      className={`transition-colors duration-300 ${activeIndex === index ? 'text-primary' : ''}`}
                    >
                      {t(`preview.${item.key}`)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3 flex flex-row md:flex-col gap-3 sm:gap-4">
              <div className="bg-background-light dark:bg-background-dark rounded-lg sm:rounded-xl shadow-neu-flat-sm p-3 sm:p-4 flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                  <span className="material-symbols-outlined text-primary text-xs sm:text-sm">trending_up</span>
                  <span className="text-[10px] sm:text-xs font-bold text-text-muted">{t('preview.revenue')}</span>
                </div>
                <p className="text-sm sm:text-lg md:text-xl font-black text-text-main dark:text-white">{t('preview.amount')}</p>
              </div>
              <div className="bg-background-light dark:bg-background-dark rounded-lg sm:rounded-xl shadow-neu-flat-sm p-3 sm:p-4 flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                  <span className="material-symbols-outlined text-green-500 text-xs sm:text-sm">shopping_bag</span>
                  <span className="text-[10px] sm:text-xs font-bold text-text-muted">{t('preview.orders')}</span>
                </div>
                <p className="text-sm sm:text-lg md:text-xl font-black text-text-main dark:text-white">845</p>
              </div>
              <div className="bg-background-light dark:bg-background-dark rounded-lg sm:rounded-xl shadow-neu-flat-sm p-3 sm:p-4 flex-1 flex flex-col justify-center relative overflow-hidden group">
                 <div className="absolute inset-0 bg-brand-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                 <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                   <span className="material-symbols-outlined text-orange-500 text-xs sm:text-sm group-hover:scale-110 transition-transform duration-300 rtl:-scale-x-100">local_shipping</span>
                   <span className="text-[10px] sm:text-xs font-bold text-text-muted">{t('preview.shipments')}</span>
                 </div>
                 <p className="text-sm sm:text-lg md:text-xl font-black text-text-main dark:text-white">12</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -right-6 top-20 bg-background-light dark:bg-background-dark p-4 rounded-xl shadow-neu-floating animate-bounce hidden md:block" style={{ animationDuration: '3s' }}>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-cover bg-center shadow-neu-pressed" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuChrw_ty--tfe2xRRDTWWkWxzY87nwwvfnja0ne1Gh8vbBMRdPrmuv294dOU4GrRSBn3RKBci8niBAY3WWFwvOgCGsjXzL0OFses_7W27KBJizfqcvQ9yUdWktPG3Z6d78ugAaLFnh5k7YwV9AayU_b1JAjUE7wdk726Ma7XhfUTJFOHmQVkB83czOBuHM2MxH29eAu0yXlp1VFaPvPADrX1t05iea77xjsOULAjP_KAoj2YR3fOF4Ks4-d5NUYEkYvHiO4E-gltak')" }}></div>
            <div>
              <p className="text-xs font-bold text-text-main">{t('preview.new_order')}</p>
              <p className="text-[10px] text-text-muted">{t('preview.new_order_time')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
