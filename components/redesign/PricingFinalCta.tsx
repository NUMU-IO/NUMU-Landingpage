import React from 'react';
import { Link } from 'react-router-dom';
import { pricing, finalCta, CTA } from './copy';
import { Section, SectionHead, PrimaryCta, useBi } from './ui';
import { useTrialMeta, toArabicDigits } from '../../lib/trialInfo';
import { ASSETS } from './assets';
import BlurReveal from './originkit/BlurReveal';
import { PlansBody } from './PricingPlans';

/**
 * 08 — Pricing and final CTA. `sections/08-pricing-and-final-cta.md`.
 *
 * No price is written in this file. Every value comes from
 * `GET /public/pricing-plans`, the same admin-controlled endpoint the rest of
 * the site already reads — which is exactly what the spec requires: "The
 * redesign document does not invent those values."
 *
 * Since 2026-09-28 the plans block is `PlansBody` from `PricingPlans.tsx` —
 * the same chips, launch offer, monthly/yearly switch, cards and Pay as you
 * grow band the /pricing page shows (owner request: "pricing in the home page
 * like the pricing page"). This file keeps the section heading, the
 * reassurance links and the final CTA.
 *
 * Subscription and per-order fees are printed on separate lines. The 0%
 * per-order figure is not asserted here for the first time: it is the
 * standing published claim already carried by the live pricing and comparison
 * surfaces.
 */

const PricingFinalCta: React.FC = () => {
  const { b } = useBi();
  const trial = useTrialMeta();

  return (
    <>
      <Section id="pricing" surface="cream" labelledBy="pricing-heading">
        <SectionHead
          id="pricing-heading"
          eyebrow={{ ar: 'الأسعار', en: 'Pricing' }}
          heading={pricing.heading}
          support={pricing.support}
          align="center"
        />

        {/* The same plans block as /pricing (`PlansBody`), so the two never drift. */}
        <PlansBody />

        {/* Reassurance row — only approved terms, each linked to its policy. */}
        <ul className="mt-12 flex flex-wrap justify-center gap-x-7 gap-y-3">
          {[
            trial.visible && trial.enabled
              ? {
                  to: '/pricing',
                  label: {
                    ar: `تجربة ${toArabicDigits(String(trial.days))} يوم مجانًا`,
                    en: `${trial.days}-day free trial`,
                  },
                }
              : null,
            { to: '/terms', label: { ar: 'إلغاء في أي وقت', en: 'Cancel anytime' } },
            { to: '/data-deletion', label: { ar: 'تصدير بياناتك', en: 'Export your data' } },
            { to: '/contact', label: { ar: 'دعم بالعربي', en: 'Support in Arabic' } },
          ]
            .filter(Boolean)
            .map((item) => {
              const it = item as { to: string; label: { ar: string; en: string } };
              return (
                <li key={it.to}>
                  <Link
                    to={it.to}
                    className="inline-flex items-center min-h-6 py-1 font-mono text-[11px] uppercase
                      tracking-[0.14em] text-ink-soft/70 underline decoration-ink/20 underline-offset-4
                      transition-colors hover:text-navy hover:decoration-navy/50"
                  >
                    {b(it.label)}
                  </Link>
                </li>
              );
            })}
        </ul>
      </Section>

      {/* ── Final CTA ── */}
      <section
        id="final-cta"
        aria-labelledby="final-cta-heading"
        className="relative bg-navy-900 numu-navy-surface numu-soft-navy py-20 sm:py-24 lg:py-28
          -mt-8 sm:-mt-10 rounded-t-[32px] sm:rounded-t-[44px] border-t border-cream/12"
      >
        <div className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 items-center">
            <div className="text-start">
              <h2
                id="final-cta-heading"
                className="font-display font-bold text-cream text-[30px]/[1.28] sm:text-[36px]/[1.24] lg:text-[46px]/[1.2]"
              >
                {b(finalCta.heading)}
              </h2>
              <p className="prose-body mt-5 max-w-xl text-cream/75">{b(finalCta.support)}</p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <PrimaryCta size="lg" onDark />
                <Link
                  to="/login"
                  className="inline-flex items-center min-h-6 py-1 text-sm font-semibold text-cream/80
                    underline decoration-cream/30
                    underline-offset-4 transition-colors hover:text-cream hover:decoration-cream/70
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron
                    focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900 rounded-[2px]"
                >
                  {b(CTA.login)}
                </Link>
              </div>
            </div>

            {/* Blur Reveal, as a contained aside rather than a section-wide
                effect: the Trust Network screen sits behind a soft blur and a
                lens on the pointer brings it into focus. It closes the page on
                the thing merchants ask about most, and the ring is cream so the
                lens stays inside the palette on this navy surface. Falls back
                to the plain sharp screenshot on touch and reduced motion. */}
            <aside
              aria-hidden="false"
              className="rounded-[14px] overflow-hidden border border-cream/15 aspect-[4/3] lg:aspect-[5/4]"
            >
              <BlurReveal
                src={ASSETS.trustNetwork.src}
                alt={b({
                  ar: 'شاشة Trust Network في نُمُو: فحص الأوردر، إشارة الريسك، وإعدادات القرار.',
                  en: 'The numu Trust Network screen: order screening, the risk signal, and the decision settings.',
                })}
                className="w-full h-full"
                size={190}
              />
            </aside>
          </div>
        </div>
      </section>
    </>
  );
};

export default PricingFinalCta;
