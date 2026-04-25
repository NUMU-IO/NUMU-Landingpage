import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import ImportShowcase from './ImportShowcase';
import AIShowcase from './AIShowcase';
import MultiChannelShowcase from './MultiChannelShowcase';

/**
 * ShowcaseTabs — merges the three legacy showcase demos (Import, AI,
 * MultiChannel) into one tabbed container. Cuts scroll depth and lets
 * the section live under a single § BEYOND A STOREFRONT header.
 *
 * Each tab lazily mounts only when active, so the heavy animated demos
 * don't all boot at once on first render.
 */

type Tab = 'import' | 'ai' | 'multi';

interface TabDef {
  key: Tab;
  label_en: string;
  label_ar: string;
  title_en: string;
  title_ar: string;
  accent: 'navy' | 'terracotta' | 'saffron';
}

const tabs: TabDef[] = [
  {
    key: 'import',
    label_en: 'Product import',
    label_ar: 'استيراد المنتجات',
    title_en: 'Instagram → your storefront.',
    title_ar: 'من إنستغرام → متجرك.',
    accent: 'navy',
  },
  {
    key: 'ai',
    label_en: 'AI assistant',
    label_ar: 'الذكاء الاصطناعي',
    title_en: 'Arabic product descriptions, generated.',
    title_ar: 'وصف منتجات بالعربي، تلقائي.',
    accent: 'terracotta',
  },
  {
    key: 'multi',
    label_en: 'Multi-channel',
    label_ar: 'تعدد القنوات',
    title_en: 'One inventory, every channel.',
    title_ar: 'مخزن واحد، كل القنوات.',
    accent: 'saffron',
  },
];

const accentMap: Record<
  TabDef['accent'],
  { active: string; dot: string; underline: string }
> = {
  navy: {
    active: 'bg-navy text-cream',
    dot: 'bg-saffron',
    underline: 'bg-navy',
  },
  terracotta: {
    active: 'bg-terracotta text-cream',
    dot: 'bg-cream',
    underline: 'bg-terracotta',
  },
  saffron: {
    active: 'bg-saffron text-ink',
    dot: 'bg-terracotta',
    underline: 'bg-saffron',
  },
};

const ShowcaseTabs: React.FC = () => {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [active, setActive] = useState<Tab>('import');

  return (
    <div className="max-w-[1360px] mx-auto w-full px-4 sm:px-6 lg:px-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-terracotta font-semibold">
            § BEYOND A STOREFRONT
          </span>
          <span className="eyebrow">
            {isAr
              ? 'استيراد · ذكاء اصطناعي · قنوات متعددة'
              : 'IMPORT · AI · MULTI-CHANNEL'}
          </span>
        </div>
        <h2 className="font-display text-4xl sm:text-5xl lg:text-[52px] font-bold text-ink tracking-tight leading-[1.05] mb-4">
          {isAr ? (
            <>
              أدوات التاجر الحقيقية،{' '}
              <span className="text-terracotta">تحت زرار واحد.</span>
            </>
          ) : (
            <>
              Real merchant tools,{' '}
              <span className="text-terracotta">under one hood.</span>
            </>
          )}
        </h2>
      </div>

      {/* Tab switcher */}
      <div
        className="mb-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
        role="tablist"
        aria-label={isAr ? 'أدوات التاجر' : 'Merchant tools'}
      >
        {tabs.map((tab) => {
          const a = accentMap[tab.accent];
          const isActive = tab.key === active;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              id={`showcase-tab-${tab.key}`}
              aria-controls={`showcase-panel-${tab.key}`}
              // eslint-disable-next-line jsx-a11y/aria-proptypes
              aria-selected={isActive}
              onClick={() => setActive(tab.key)}
              className={`group relative flex items-center gap-2 rounded-[4px] border px-4 sm:px-5 py-2.5 transition-all duration-200 ease-numu ${
                isActive
                  ? `${a.active} border-transparent shadow-card`
                  : 'bg-paper text-ink border-ink/15 hover:border-ink/30 hover:bg-navy/[0.03]'
              }`}
            >
              <span
                aria-hidden="true"
                className={`size-1.5 rounded-full ${isActive ? a.dot : 'bg-ink/30'}`}
              />
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] font-semibold whitespace-nowrap">
                {isAr ? tab.label_ar : tab.label_en}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sub-headline for active tab */}
      <div className="text-center mb-8">
        <p className="font-display text-xl sm:text-2xl font-semibold text-ink tracking-tight">
          {tabs.find((t) => t.key === active) &&
            (isAr
              ? tabs.find((t) => t.key === active)!.title_ar
              : tabs.find((t) => t.key === active)!.title_en)}
        </p>
      </div>

      {/* Tab panels — only the active one mounts */}
      <div
        role="tabpanel"
        id={`showcase-panel-${active}`}
        aria-labelledby={`showcase-tab-${active}`}
        className="animate-fade-in-up"
        key={active}
      >
        {active === 'import' && <ImportShowcase />}
        {active === 'ai' && <AIShowcase />}
        {active === 'multi' && <MultiChannelShowcase />}
      </div>
    </div>
  );
};

export default ShowcaseTabs;
