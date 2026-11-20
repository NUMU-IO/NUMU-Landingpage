import React from 'react';
import { Link } from 'react-router-dom';
import { useBi } from './ui';
import { ASSETS } from './assets';
import type { Bi } from './copy';

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
 * Five plain links in a grid. It was a 3D coverflow: one destination visible
 * at a time, a second control to actually open it, and a gallery script to
 * download and measure itself before any of it appeared.
 */

const DESTINATIONS: { to: string; label: Bi; desc: Bi; image: string }[] = [
  {
    to: '/themes',
    label: { ar: 'الثيمات', en: 'Themes' },
    desc: { ar: 'واجهات عربية جاهزة', en: 'Ready Arabic storefronts' },
    image: ASSETS.exploreThemes.src,
  },
  {
    to: '/apps',
    label: { ar: 'متجر التطبيقات', en: 'App store' },
    desc: { ar: 'إضافات توسّع متجرك', en: 'Add-ons that extend your store' },
    image: ASSETS.exploreApps.src,
  },
  {
    to: '/tools',
    label: { ar: 'أدوات مجانية', en: 'Free tools' },
    desc: { ar: 'حاسبات من غير حساب', en: 'Calculators, no account' },
    image: ASSETS.exploreTools.src,
  },
  {
    to: '/learn',
    label: { ar: 'الأكاديمية', en: 'Academy' },
    desc: { ar: 'أدلة عملية للسوق المصري', en: 'Practical guides for Egypt' },
    image: ASSETS.exploreLearn.src,
  },
  {
    to: '/developers',
    label: { ar: 'المطورين', en: 'Developers' },
    desc: { ar: 'API وويب هوكس', en: 'API and webhooks' },
    image: ASSETS.exploreDevelopers.src,
  },
];

const ExploreMore: React.FC = () => {
  const { b } = useBi();

  return (
    <section
      aria-labelledby="explore-more-heading"
      className="relative numu-below-fold bg-paper numu-dot-surface numu-soft-cream pt-14 sm:pt-16 pb-6
        -mt-8 sm:-mt-10 rounded-t-[32px] sm:rounded-t-[44px] border-t border-ink/[0.09]"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-10">
        <h2
          id="explore-more-heading"
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft/55"
        >
          {b({ ar: 'كمان في نُمُو', en: 'More from numu' })}
        </h2>

        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {DESTINATIONS.map((d) => (
            <li key={d.to}>
              <Link
                to={d.to}
                className="group block overflow-hidden rounded-[10px] border border-ink/10 bg-cream
                  transition-colors hover:border-navy/35
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron
                  focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              >
                <img
                  src={d.image}
                  alt=""
                  width={640}
                  height={400}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[16/10] w-full border-b border-ink/10 object-cover object-top"
                />
                <span className="block px-3.5 py-3">
                  <span className="flex items-center justify-between gap-2 text-[15px] font-bold text-ink">
                    {b(d.label)}
                    <span aria-hidden="true" className="text-navy/50 transition-colors group-hover:text-navy rtl:rotate-180">
                      →
                    </span>
                  </span>
                  <span className="mt-0.5 block text-[12.5px]/[1.5] text-ink-soft/75">{b(d.desc)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ExploreMore;
