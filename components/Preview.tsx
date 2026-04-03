import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Preview: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(4);
  const { t, dir } = useLanguage();

  return (
    <div className="max-w-6xl mx-auto w-full px-4 py-8">
      <div className="text-center mb-6 sm:mb-8 lg:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full shadow-neu-pressed-sm mb-4 w-fit mx-auto">
          <span className="material-symbols-outlined text-primary text-sm">terminal</span>
          <span className="text-[10px] sm:text-xs font-semibold text-text-muted tracking-wide uppercase">{dir === 'rtl' ? 'مركز التحكم' : 'Command Center'}</span>
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-text-main dark:text-white mb-2">{t('preview.title')}</h2>
        <p className="text-text-muted text-sm sm:text-base max-w-xl mx-auto">{t('preview.subtitle')}</p>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {/* Revenue card - large */}
        <div className="md:col-span-2 bg-background-light dark:bg-background-dark rounded-2xl sm:rounded-3xl shadow-neu-flat p-5 sm:p-6 md:p-8 transition-transform hover:-translate-y-1 duration-300 group">
          <div className="flex items-center justify-between mb-5">
            <div>
              <span className="text-[10px] sm:text-xs font-bold text-text-muted uppercase tracking-wider">{t('preview.revenue')}</span>
              <p className="text-xl sm:text-2xl md:text-3xl font-black text-text-main dark:text-white mt-1">{t('preview.amount')}</p>
            </div>
            <div className="flex items-center gap-1.5 shadow-neu-pressed-sm rounded-full px-3 py-1.5">
              <span className="material-symbols-outlined text-primary text-sm">trending_up</span>
              <span className="text-xs font-bold text-primary">+23%</span>
            </div>
          </div>
          {/* Chart bars */}
          <div className="bg-background-light dark:bg-background-dark rounded-xl shadow-neu-pressed p-4">
            <div className="flex items-end gap-2 h-24 sm:h-32" onMouseLeave={() => setActiveIndex(4)}>
              {[
                { key: 'mon', height: '40%' },
                { key: 'tue', height: '60%' },
                { key: 'wed', height: '30%' },
                { key: 'thu', height: '80%' },
                { key: 'fri', height: '65%' },
              ].map((item, index) => (
                <div
                  key={item.key}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`w-full rounded-t-lg transition-all duration-300 cursor-pointer origin-bottom ${
                    activeIndex === index
                      ? 'bg-brand-gradient shadow-[0_0_15px_rgba(30,58,138,0.5)] scale-y-105'
                      : 'bg-primary/20 hover:bg-primary/30'
                  }`}
                  style={{ height: item.height }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs font-bold text-text-muted border-t border-gray-200/50 pt-2">
              {['mon', 'tue', 'wed', 'thu', 'fri'].map((key, index) => (
                <span key={key} className={`transition-colors duration-300 ${activeIndex === index ? 'text-primary' : ''}`}>
                  {t(`preview.${key}`)}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Orders card - merchant hub glass style */}
        <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 text-white transition-transform hover:-translate-y-1 duration-300" style={{ background: '#0d1117', boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 8px 30px rgba(0,0,0,0.3)' }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-blue-400 text-lg">shopping_bag</span>
            <span className="text-[11px] font-medium text-white/45 uppercase tracking-wider">{t('preview.orders')}</span>
          </div>
          <p className="text-3xl sm:text-4xl font-bold tracking-tight tabular-nums mb-6" style={{ color: 'rgba(255,255,255,0.92)' }}>845</p>
          <div className="space-y-3">
            {[
              { label: dir === 'rtl' ? 'قيد التوصيل' : 'In Transit', count: 12, dotColor: 'bg-blue-400', badgeClass: 'text-blue-400 bg-blue-500/10' },
              { label: dir === 'rtl' ? 'تم التسليم' : 'Delivered', count: 820, dotColor: 'bg-emerald-400', badgeClass: 'text-emerald-400 bg-emerald-500/10' },
              { label: dir === 'rtl' ? 'معلقة' : 'Pending', count: 13, dotColor: 'bg-amber-400', badgeClass: 'text-amber-400 bg-amber-500/10' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`size-2 rounded-full ${item.dotColor}`} />
                  <span className="text-[11px] text-white/45">{item.label}</span>
                </div>
                <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${item.badgeClass}`}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipments */}
        <div className="bg-background-light dark:bg-background-dark rounded-2xl sm:rounded-3xl shadow-neu-flat p-5 sm:p-6 md:p-8 relative overflow-hidden transition-transform hover:-translate-y-1 duration-300 group">
          <div className="absolute inset-0 bg-brand-gradient opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
          <span className="material-symbols-outlined text-primary/10 text-6xl absolute bottom-2 end-2 rtl:-scale-x-100">local_shipping</span>
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-orange-500 text-sm group-hover:scale-110 transition-transform duration-300 rtl:-scale-x-100">local_shipping</span>
              <span className="text-[10px] sm:text-xs font-bold text-text-muted uppercase tracking-wider">{t('preview.shipments')}</span>
            </div>
            <p className="text-3xl font-black text-text-main dark:text-white mt-2 mb-1">12</p>
            <p className="text-xs text-text-muted">{dir === 'rtl' ? 'شحنات نشطة الآن' : 'Active shipments now'}</p>
          </div>
        </div>

        {/* Customers */}
        <div className="bg-background-light dark:bg-background-dark rounded-2xl sm:rounded-3xl shadow-neu-flat p-5 sm:p-6 md:p-8 transition-transform hover:-translate-y-1 duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] sm:text-xs font-bold text-text-muted uppercase tracking-wider">{dir === 'rtl' ? 'العملاء الجدد' : 'New Customers'}</span>
            <div className="flex items-center gap-1 shadow-neu-pressed-sm rounded-full px-2 py-1">
              <span className="text-[10px] font-bold text-primary">+18%</span>
            </div>
          </div>
          <p className="text-3xl font-black text-text-main dark:text-white mb-4">{t('hero.stats.users')}</p>
          <div className="flex items-center">
            <div className="flex -space-x-2 rtl:space-x-reverse">
              {['F', 'M', 'S', 'A', 'N'].map((letter, i) => (
                <div key={i} className="size-8 rounded-full shadow-neu-flat-sm bg-background-light flex items-center justify-center border-2 border-background-light">
                  <span className="text-[10px] font-semibold text-text-muted">{letter}</span>
                </div>
              ))}
            </div>
            <span className="text-xs text-text-muted ms-3">+337 {dir === 'rtl' ? 'آخرين' : 'more'}</span>
          </div>
        </div>

        {/* Conversion */}
        <div className="bg-background-light dark:bg-background-dark rounded-2xl sm:rounded-3xl shadow-neu-flat p-5 sm:p-6 md:p-8 transition-transform hover:-translate-y-1 duration-300">
          <span className="text-[10px] sm:text-xs font-bold text-text-muted uppercase tracking-wider">{dir === 'rtl' ? 'معدل التحويل' : 'Conversion Rate'}</span>
          <div className="flex items-end gap-3 mt-3">
            <p className="text-3xl font-black text-text-main dark:text-white">3.2%</p>
            <span className="text-xs font-bold text-primary mb-1">+0.4%</span>
          </div>
          <div className="mt-4 rounded-full shadow-neu-pressed overflow-hidden h-3">
            <div className="h-full w-[64%] bg-brand-gradient rounded-full" />
          </div>
          <p className="text-[10px] text-text-muted mt-2">{dir === 'rtl' ? 'أعلى من المتوسط بـ 1.8%' : '1.8% above industry average'}</p>
        </div>
      </div>
    </div>
  );
};

export default Preview;
