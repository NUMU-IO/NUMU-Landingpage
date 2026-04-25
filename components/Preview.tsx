import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Dashboard bento preview — 5 tiles in brand-kit colors.
 * Flat editorial panels with hairline borders and 10–14px radii.
 * Mix of cream/paper/navy surfaces for visual rhythm.
 */

const toArabicDigits = (s: string | number): string =>
  String(s).replace(/[0-9]/g, (d) =>
    String.fromCharCode(0x0660 + parseInt(d, 10)),
  );

const Preview: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(4);
  const { t, dir, language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <div className="max-w-[1360px] mx-auto w-full px-4 sm:px-6 lg:px-10">
      {/* Header */}
      <div className="text-center mb-10 sm:mb-14">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-terracotta font-semibold">
            § DASHBOARD
          </span>
          <span className="eyebrow">
            {isAr ? 'مركز التحكم · في مكان واحد' : 'COMMAND CENTER · ALL IN ONE'}
          </span>
        </div>
        <h2 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-bold text-ink tracking-tight leading-[1.05] mb-5">
          {t('preview.title')}
        </h2>
        <p className="prose-body text-ink/75 max-w-2xl mx-auto">
          {t('preview.subtitle')}
        </p>
      </div>

      {/* Bento — 3 cols, mixed sizes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {/* Revenue — large paper card, saffron accent bar */}
        <div className="md:col-span-2 bg-paper border border-ink/10 border-s-[3px] border-s-saffron rounded-[14px] p-6 sm:p-7 shadow-card transition-all duration-200 ease-numu hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between mb-5">
            <div>
              <span className="font-mono text-[10px] font-semibold text-ink-soft/60 uppercase tracking-[0.18em]">
                {t('preview.revenue')}
              </span>
              <p className="font-display text-3xl sm:text-4xl font-bold text-navy tracking-tight tabular-nums mt-1 leading-none">
                {t('preview.amount')}
              </p>
            </div>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] font-semibold text-sage bg-sage/10 border border-sage/30 px-2.5 py-1 rounded-[4px]">
              ↑ {isAr ? toArabicDigits(23) : '23'}%
            </span>
          </div>
          {/* Chart bars */}
          <div className="bg-cream border border-ink/10 rounded-[10px] p-4">
            <div
              className="flex items-end gap-2 h-24 sm:h-32"
              onMouseLeave={() => setActiveIndex(4)}
            >
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
                  className={`w-full rounded-t-[2px] transition-all duration-200 ease-numu cursor-pointer origin-bottom ${
                    activeIndex === index ? 'bg-navy' : 'bg-navy/25 hover:bg-navy/40'
                  }`}
                  style={{ height: item.height }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft/55 border-t border-bone pt-2">
              {['mon', 'tue', 'wed', 'thu', 'fri'].map((key, index) => (
                <span
                  key={key}
                  className={`transition-colors duration-200 ${
                    activeIndex === index ? 'text-terracotta font-semibold' : ''
                  }`}
                >
                  {t(`preview.${key}`)}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Orders — navy inversion tile */}
        <div className="bg-navy text-cream rounded-[14px] p-6 sm:p-7 shadow-card transition-all duration-200 ease-numu hover:-translate-y-0.5">
          <div className="flex items-center gap-2 mb-4">
            <span
              className="size-1.5 rounded-full bg-saffron"
              aria-hidden="true"
            />
            <span className="font-mono text-[10px] font-semibold text-cream/55 uppercase tracking-[0.18em]">
              {t('preview.orders')}
            </span>
          </div>
          <p className="font-display text-4xl font-bold tracking-tight tabular-nums mb-6 text-cream leading-none">
            {isAr ? toArabicDigits(845) : '845'}
          </p>
          <div className="space-y-2.5">
            {[
              {
                label: isAr ? 'قيد التوصيل' : 'In Transit',
                count: 12,
                dot: 'bg-saffron',
                text: 'text-saffron',
              },
              {
                label: isAr ? 'تم التسليم' : 'Delivered',
                count: 820,
                dot: 'bg-sage',
                text: 'text-sage',
              },
              {
                label: isAr ? 'معلقة' : 'Pending',
                count: 13,
                dot: 'bg-terracotta',
                text: 'text-terracotta',
              },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`size-1.5 rounded-full ${item.dot}`}
                    aria-hidden="true"
                  />
                  <span className="text-[12px] text-cream/60">{item.label}</span>
                </div>
                <span
                  className={`font-mono text-[11px] font-semibold tabular-nums ${item.text}`}
                >
                  {isAr ? toArabicDigits(item.count) : item.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipments — terracotta accent */}
        <div className="bg-paper border border-ink/10 border-t-[3px] border-t-terracotta rounded-[14px] p-6 sm:p-7 shadow-card transition-all duration-200 ease-numu hover:-translate-y-0.5 hover:shadow-md">
          <span className="font-mono text-[10px] font-semibold text-ink-soft/60 uppercase tracking-[0.18em]">
            {t('preview.shipments')}
          </span>
          <p className="font-display text-5xl font-bold text-terracotta mt-2 mb-2 tabular-nums leading-none">
            {isAr ? toArabicDigits(12) : '12'}
          </p>
          <p className="prose-body-sm text-ink/70">
            {isAr ? 'شحنات نشطة الآن' : 'Active shipments now'}
          </p>
          <div className="mt-4 pt-3 border-t border-bone flex items-center gap-1.5">
            <span
              className="size-1.5 rounded-full bg-sage"
              aria-hidden="true"
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft/60">
              Bosta · {isAr ? 'مباشر' : 'Live'}
            </span>
          </div>
        </div>

        {/* Customers — navy accent, avatar chips */}
        <div className="bg-paper border border-ink/10 border-t-[3px] border-t-navy rounded-[14px] p-6 sm:p-7 shadow-card transition-all duration-200 ease-numu hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-[10px] font-semibold text-ink-soft/60 uppercase tracking-[0.18em]">
              {isAr ? 'العملاء الجدد' : 'New Customers'}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] font-semibold text-sage">
              +{isAr ? toArabicDigits(18) : '18'}%
            </span>
          </div>
          <p className="font-display text-3xl font-bold text-navy mb-4 tabular-nums leading-none">
            {t('hero.stats.users')}
          </p>
          <div className="flex items-center">
            <div className="flex -space-x-2 rtl:space-x-reverse">
              {['F', 'M', 'S', 'A', 'N'].map((letter, i) => {
                const colors = [
                  'bg-terracotta text-cream',
                  'bg-saffron text-ink',
                  'bg-sage text-cream',
                  'bg-navy text-cream',
                  'bg-bone text-ink',
                ];
                return (
                  <div
                    key={i}
                    className={`size-8 rounded-full flex items-center justify-center border-2 border-paper ${colors[i]}`}
                  >
                    <span className="font-display text-[11px] font-bold">
                      {letter}
                    </span>
                  </div>
                );
              })}
            </div>
            <span className="font-mono text-[10px] text-ink-soft/55 ms-3 uppercase tracking-[0.18em]">
              +{isAr ? toArabicDigits(337) : '337'} {isAr ? 'آخرين' : 'more'}
            </span>
          </div>
        </div>

        {/* Conversion — sage accent */}
        <div className="bg-paper border border-ink/10 border-t-[3px] border-t-sage rounded-[14px] p-6 sm:p-7 shadow-card transition-all duration-200 ease-numu hover:-translate-y-0.5 hover:shadow-md">
          <span className="font-mono text-[10px] font-semibold text-ink-soft/60 uppercase tracking-[0.18em]">
            {isAr ? 'معدل التحويل' : 'Conversion Rate'}
          </span>
          <div className="flex items-end gap-3 mt-3">
            <p className="font-display text-4xl font-bold text-navy tabular-nums leading-none">
              {isAr ? toArabicDigits('3.2') : '3.2'}%
            </p>
            <span className="font-mono text-[11px] font-semibold text-sage mb-1">
              +{isAr ? toArabicDigits('0.4') : '0.4'}%
            </span>
          </div>
          <div className="mt-4 bg-bone rounded-[2px] overflow-hidden h-1.5">
            <div className="h-full w-[64%] bg-sage rounded-[2px]" />
          </div>
          <p className="font-mono text-[10px] text-ink-soft/55 mt-2 uppercase tracking-[0.18em]">
            {isAr
              ? `أعلى من المتوسط بـ ${toArabicDigits('1.8')}٪`
              : '1.8% above avg'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Preview;
