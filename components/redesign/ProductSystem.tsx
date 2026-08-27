import React, { useState, useRef } from 'react';
import { productSystem, CTA } from './copy';
import { ASSETS, AssetKey } from './assets';
import { Section, SectionHead, AssetSlot, ContextLink, useBi } from './ui';

/**
 * 04 — Product system showcase. `sections/04-product-system.md`.
 *
 * Three tabs — `التحليلات` (default) · `الطلبات` · `المتجر` — mapped to the
 * required screenshots. `orders-workflow.webp` is deliberately absent: it is
 * reserved for the COD section and must not be repeated here.
 *
 * Tabs follow the ARIA authoring practice for a manually-activated tablist:
 * arrow keys move focus, Home/End jump to the ends, and the panel is
 * labelled by its tab. Nothing is hover-only.
 *
 * The storefront preview renders as a plain screenshot. Dither Reveal was
 * removed from this tab on the owner's instruction: the point of the panel is
 * to show what the store looks like, and an effect over it competes with the
 * thing it is meant to show.
 */

const TAB_IDS = productSystem.tabs.map((t) => t.key);

const ProductSystem: React.FC = () => {
  const { b } = useBi();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = TAB_IDS.length - 1;
    let next: number | null = null;

    // Arrow semantics follow the writing direction, so in Arabic the left
    // arrow moves to the *next* tab, matching what the user sees.
    const rtl = document.documentElement.dir === 'rtl';
    const forward = rtl ? 'ArrowLeft' : 'ArrowRight';
    const back = rtl ? 'ArrowRight' : 'ArrowLeft';

    if (e.key === forward) next = active === last ? 0 : active + 1;
    else if (e.key === back) next = active === 0 ? last : active - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;

    if (next !== null) {
      e.preventDefault();
      setActive(next);
      tabRefs.current[next]?.focus();
    }
  };

  return (
    <Section id="product-system" surface="paper" labelledBy="product-system-heading">
      <SectionHead
        id="product-system-heading"
        eyebrow={{ ar: 'المنتج', en: 'The product' }}
        heading={productSystem.heading}
        support={productSystem.support}
      />

      <div className="mt-12 sm:mt-14">
        {/* ── Tabs ── */}
        <div
          role="tablist"
          aria-label={b({ ar: 'أقسام المنتج', en: 'Product areas' })}
          onKeyDown={onKeyDown}
          className="inline-flex gap-1 p-1 bg-bone/60 border border-ink/10 rounded-[4px]"
        >
          {productSystem.tabs.map((tab, i) => (
            <button
              key={tab.key}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`tab-${tab.key}`}
              aria-selected={active === i}
              aria-controls={`panel-${tab.key}`}
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              className={`px-4 sm:px-6 py-2.5 rounded-[3px] text-sm font-semibold transition-colors
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron
                focus-visible:ring-offset-1 focus-visible:ring-offset-paper
                ${active === i
                  ? 'bg-cream text-navy shadow-xs'
                  : 'text-ink-soft/70 hover:text-ink'}`}
            >
              {b(tab.label)}
            </button>
          ))}
        </div>

        {/* ── Panels ── */}
        {productSystem.tabs.map((tab, i) => (
          <div
            key={tab.key}
            role="tabpanel"
            id={`panel-${tab.key}`}
            aria-labelledby={`tab-${tab.key}`}
            hidden={active !== i}
            className="mt-8"
          >
            <p className="prose-body max-w-2xl text-ink-soft/85">{b(tab.body)}</p>
            <div className="mt-7">
              <PanelVisual tabKey={tab.key} />
            </div>
          </div>
        ))}

        <div className="mt-10">
          <ContextLink label={CTA.productTour} to="/product-tour" />
        </div>
      </div>

      {/* Without JavaScript the tabs cannot switch, so every panel is served
          as a plain vertical stack instead — same screenshots, same order. */}
      <noscript>
        <div className="mt-12 space-y-12">
          {productSystem.tabs.map((tab) => (
            <div key={tab.key}>
              <h3 className="font-display text-xl font-bold text-ink">{b(tab.label)}</h3>
              <p className="prose-body mt-3 max-w-2xl text-ink-soft/85">{b(tab.body)}</p>
              <div className="mt-5">
                <PanelVisual tabKey={tab.key} noEffects />
              </div>
            </div>
          ))}
        </div>
      </noscript>
    </Section>
  );
};

const frameCls = 'overflow-hidden rounded-[4px] border border-ink/10 bg-cream numu-mockup-frame';

const PanelVisual: React.FC<{ tabKey: string; noEffects?: boolean }> = ({
  tabKey,
  noEffects = false,
}) => {
  const { b } = useBi();

  if (tabKey === 'store') {
    // Theme engine beside the storefront it produces — the only place the
    // Dither Reveal is allowed to run.
    return (
      <div className="grid md:grid-cols-2 gap-5">
        <div className={frameCls}>
          <AssetSlot
            asset="themeEngine"
            /* Measured: 1118 CSS px in the tab panel on desktop. */
            sizes="(min-width: 1280px) 1150px, 100vw"
            ratio={16 / 10}
            alt={{
              ar: 'محرر الثيم في نُمُو: اختيار الألوان والخطوط وأقسام المتجر.',
              en: 'The numu theme editor: choosing colours, fonts and store sections.',
            }}
          />
        </div>

        <div className={frameCls}>
          <AssetSlot
            asset="storefrontPreview"
            sizes="(min-width: 1280px) 1150px, 100vw"
            ratio={16 / 10}
            alt={{
              ar: 'معاينة متجر عربي جاهز زي ما العميل بيشوفه.',
              en: 'Preview of a ready Arabic storefront as the customer sees it.',
            }}
          />
        </div>
      </div>
    );
  }

  const map: Record<string, { asset: AssetKey; alt: { ar: string; en: string } }> = {
    orders: {
      asset: 'dashboardHome',
      alt: {
        ar: 'لوحة تحكم نُمُو: الطلبات الجديدة وحالة كل أوردر.',
        en: 'The numu dashboard: new orders and the status of each one.',
      },
    },
    analytics: {
      asset: 'analytics',
      alt: {
        ar: 'تحليلات نُمُو: المبيعات والمنتجات الأكتر طلبًا ومصادر الزيارات.',
        en: 'numu analytics: sales, best-selling products and traffic sources.',
      },
    },
  };

  const entry = map[tabKey];
  if (!entry) return null;

  return (
    <div className={frameCls}>
      <AssetSlot
        asset={entry.asset}
        ratio={16 / 9}
        alt={entry.alt}
        sizes="(min-width: 1280px) 1150px, 100vw"
      />
    </div>
  );
};

export default ProductSystem;
