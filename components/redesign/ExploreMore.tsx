import React, { Suspense, lazy, useRef } from 'react';
import { useBi } from './ui';
import { useInView } from './hooks';
import { Reveal } from './Reveal';
import { ASSETS } from './assets';
import type { CoverflowItem } from './originkit/CoverflowGallery';

/**
 * "Explore more" — the five standalone pages, surfaced from the homepage.
 *
 * ─── Why this is not a ninth section ──────────────────────────────────────
 * `page-architecture.md` fixes the homepage at eight sections and is explicit
 * that nothing may compete with that story. So this is not part of the
 * narrative: it sits in the footer region, below the final CTA, styled as a
 * quiet directory rather than a pitch. A visitor who has finished the page
 * and wants to keep looking finds it; a visitor reading the argument never
 * has it interrupt them.
 *
 * ─── The cards are real ───────────────────────────────────────────────────
 * Each card is a screenshot of the route it links to, taken from the running
 * app, with the (identical on every page) navbar band cropped away. Nothing
 * is drawn, mocked up or dressed in a fake browser frame — the picture is
 * literally what is behind the link.
 *
 * The gallery itself is OriginKit's Coverflow Gallery, used as delivered; see
 * `originkit/CoverflowGallery.tsx` for how real links are attached to a
 * component that has no href API.
 *
 * ─── Why it waits for the viewport ────────────────────────────────────────
 * `loading="lazy"` was not enough on its own. Chrome's lazy-load threshold
 * widens on a slow connection, so with the cards in the DOM from the start
 * all five screenshots were fetched during the initial page load — ~2s of
 * mobile bandwidth taken from the hero video, at the exact moment the
 * webfonts were still arriving. Mounting the gallery only once the section is
 * near the viewport keeps them out of the DOM entirely until then. Same
 * approach the Globe already uses in `ReliabilityGrowth.tsx`.
 */

const CoverflowGallery = lazy(() => import('./originkit/CoverflowGallery'));

const DESTINATIONS: CoverflowItem[] = [
  {
    to: '/themes',
    label: { ar: 'الثيمات', en: 'Themes' },
    desc: { ar: 'واجهات عربية جاهزة', en: 'Ready Arabic storefronts' },
    image: ASSETS.exploreThemes.src,
    alt: {
      ar: 'صفحة الثيمات في نُمُو.',
      en: 'The numu themes page.',
    },
  },
  {
    to: '/apps',
    label: { ar: 'متجر التطبيقات', en: 'App store' },
    desc: { ar: 'إضافات توسّع متجرك', en: 'Add-ons that extend your store' },
    image: ASSETS.exploreApps.src,
    alt: {
      ar: 'صفحة متجر التطبيقات في نُمُو.',
      en: 'The numu app store page.',
    },
  },
  {
    to: '/tools',
    label: { ar: 'أدوات مجانية', en: 'Free tools' },
    desc: { ar: 'حاسبات من غير حساب', en: 'Calculators, no account' },
    image: ASSETS.exploreTools.src,
    alt: {
      ar: 'صفحة الأدوات المجانية في نُمُو.',
      en: 'The numu free tools page.',
    },
  },
  {
    to: '/learn',
    label: { ar: 'الأكاديمية', en: 'Academy' },
    desc: { ar: 'أدلة عملية للسوق المصري', en: 'Practical guides for Egypt' },
    image: ASSETS.exploreLearn.src,
    alt: {
      ar: 'صفحة أكاديمية نُمُو.',
      en: 'The numu academy page.',
    },
  },
  {
    to: '/developers',
    label: { ar: 'المطورين', en: 'Developers' },
    desc: { ar: 'API وويب هوكس', en: 'API and webhooks' },
    image: ASSETS.exploreDevelopers.src,
    alt: {
      ar: 'صفحة وثائق المطورين في نُمُو.',
      en: 'The numu developer documentation page.',
    },
  },
];

const ExploreMore: React.FC = () => {
  const { b } = useBi();
  const ref = useRef<HTMLDivElement>(null);
  /* A generous margin on purpose. The gallery has to measure itself before it
     can size its cards, so swapping it in for the reserved box is never a
     perfect height match at every container width. Mounting it well before it
     scrolls into view means that settling happens off-screen, where it costs
     no layout shift — while still keeping the five screenshots out of the
     initial page load, which is what this gate is for. */
  const inView = useInView(ref, '1200px');

  return (
    <section
      aria-labelledby="explore-more-heading"
      className="relative bg-paper numu-dot-surface numu-soft-cream pt-14 sm:pt-16 pb-6
        -mt-8 sm:-mt-10 rounded-t-[32px] sm:rounded-t-[44px] border-t border-ink/[0.09]"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-10">
        <h2
          id="explore-more-heading"
          className="text-center font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft/55"
        >
          {b({ ar: 'كمان في نُمُو', en: 'More from numu' })}
        </h2>

        <Reveal delay={60} className="mt-6">
          {/* The reserved box is roughly the height of whichever rendering will
              mount — the scroller below `lg`, the 3D stage above it — so
              nothing on the page shifts when the gallery arrives. */}
          <div ref={ref}>
            {inView ? (
              <Suspense fallback={<div className="h-[333px] lg:h-[472px]" aria-hidden="true" />}>
                <CoverflowGallery items={DESTINATIONS} />
              </Suspense>
            ) : (
              <div className="h-[333px] lg:h-[472px]" aria-hidden="true" />
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default ExploreMore;
