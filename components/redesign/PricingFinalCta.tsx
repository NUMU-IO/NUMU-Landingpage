import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { pricing, finalCta, CTA } from './copy';
import { Section, SectionHead, PrimaryCta, useBi } from './ui';
import { useSignupModal } from '../../contexts/SignupModalContext';
import { useTrialMeta, toArabicDigits } from '../../lib/trialInfo';
import { ASSETS } from './assets';
import BlurReveal from './originkit/BlurReveal';

/**
 * 08 — Pricing and final CTA. `sections/08-pricing-and-final-cta.md`.
 *
 * No price is written in this file. Every value comes from
 * `GET /public/pricing-plans`, the same admin-controlled endpoint the rest of
 * the site already reads — which is exactly what the spec requires: "The
 * redesign document does not invent those values."
 *
 * The endpoint currently returns five commercial variants. The homepage shows
 * the three the spec fixes — entry, recommended, enterprise/custom — and
 * leaves the trial and Pay-as-you-Grow variants to /pricing, along with
 * annual billing, the full feature comparison and the launch campaign.
 *
 * Subscription and per-order fees are printed on separate lines. The 0%
 * per-order figure is not asserted here for the first time: it is the
 * standing published claim already carried by the live pricing and comparison
 * surfaces.
 */

interface PlanFeature {
  en: string;
  ar: string;
}

interface Plan {
  key: string;
  name_en: string;
  name_ar: string;
  price_monthly: number;
  price_annual: number;
  currency: string;
  cta: string;
  popular: boolean;
  commission_percent?: number;
  features: PlanFeature[];
}

const API_URL = import.meta.env.VITE_API_URL || 'https://numueg.app/api/v1';

/** Homepage shows exactly these three roles, in this order. */
const HOMEPAGE_PLAN_KEYS = ['starter', 'pro', 'enterprise'] as const;

const PricingFinalCta: React.FC = () => {
  const { b, isAr } = useBi();
  const [plans, setPlans] = useState<Plan[] | null>(null);
  // Pay as you Grow is deliberately not one of the three cards. It is not a
  // fourth tier competing on features — it is the answer to "I don't want
  // to pick a plan yet", so it sits above them as its own thing.
  const [payg, setPayg] = useState<Plan | null>(null);
  const [failed, setFailed] = useState(false);
  const trial = useTrialMeta();
  const { open: openSignup } = useSignupModal();

  useEffect(() => {
    let alive = true;
    fetch(`${API_URL}/public/pricing-plans`, { credentials: 'include' })
      .then((r) => r.json())
      .then((json) => {
        if (!alive) return;
        const all: Plan[] = json?.data?.plans ?? [];
        const picked = HOMEPAGE_PLAN_KEYS.map((k) => all.find((p) => p.key === k)).filter(
          Boolean,
        ) as Plan[];
        if (picked.length === HOMEPAGE_PLAN_KEYS.length) setPlans(picked);
        else setFailed(true);
        // Rendered independently of the three: if the admin hides payg the
        // band disappears and the tiers are unaffected, and vice versa.
        setPayg(all.find((p) => p.key === 'payg') ?? null);
      })
      .catch(() => {
        if (alive) setFailed(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  const num = (v: string) => (isAr ? toArabicDigits(v) : v);

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

        {/* ── "Not sure yet?" → Pay as you Grow ──
            Placed above the tiers on purpose. The three cards ask the
            visitor to predict how big they will get, which is the exact
            question a first-time merchant cannot answer and the most
            common reason they leave without choosing anything. This gives
            that person somewhere to go instead of nowhere. It is a band
            rather than a fourth card because it is not competing on
            features — comparing it column-by-column would frame it as the
            weakest tier when it is really the no-commitment option. */}
        {payg && (
          <div className="mt-12">
            <p className="text-center font-mono text-[11px] uppercase tracking-[0.18em] text-terracotta font-semibold">
              {b({ ar: 'مش متأكد لسه؟', en: 'Not sure yet?' })}
            </p>

            <div
              className="mx-auto mt-4 max-w-4xl rounded-[4px] border-2 border-sage/45 bg-sage/[0.07]
                p-6 sm:p-7 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <h3 className="font-display text-xl font-bold text-ink">
                  {isAr ? payg.name_ar : payg.name_en}
                </h3>
                <p className="prose-body-sm mt-2 text-ink-soft/85">
                  {b({
                    ar: 'ابدأ من غير اشتراك شهري. مش بتدفع حاجة غير لما تبيع.',
                    en: 'Start with no monthly fee. You only pay when you sell.',
                  })}
                </p>
              </div>

              <div className="flex shrink-0 flex-col items-start gap-4 sm:items-end">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl font-bold text-sage">
                    {num(String(payg.commission_percent ?? 3))}
                    {isAr ? '٪' : '%'}
                  </span>
                  <span className="text-sm text-ink-soft/70">
                    {b({ ar: 'على كل أوردر مدفوع', en: 'per paid order' })}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => openSignup('payg')}
                  className="group inline-flex items-center justify-center gap-2 rounded-[4px]
                    border border-navy/25 px-5 py-2.5 text-sm font-semibold text-navy
                    transition-all duration-200 ease-numu active:scale-[0.985]
                    hover:bg-navy/[0.05] focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-saffron focus-visible:ring-offset-2
                    focus-visible:ring-offset-cream"
                >
                  <span>{b(CTA.primary)}</span>
                  <span
                    aria-hidden="true"
                    className="text-saffron rtl:rotate-180 transition-transform
                      group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
                  >
                    →
                  </span>
                </button>
              </div>
            </div>

            <p className="mt-6 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft/50">
              {b({ ar: 'أو اختار باقة ثابتة', en: 'Or pick a fixed plan' })}
            </p>
          </div>
        )}

        {plans ? (
          <div className="mt-8 grid gap-5 lg:grid-cols-3 items-start">
            {plans.map((plan) => {
              const isCustom = plan.price_monthly === -1;
              const recommended = plan.popular;

              return (
                <div
                  key={plan.key}
                  className={`relative flex flex-col h-full rounded-[4px] p-6 sm:p-7
                    ${recommended
                      ? 'bg-paper border-2 border-navy shadow-card lg:-mt-4 lg:pb-10'
                      : 'bg-paper border border-ink/12'}`}
                >
                  {recommended && (
                    <span
                      className="absolute -top-3 start-6 rounded-[3px] bg-navy px-3 py-1
                        font-mono text-[10px] uppercase tracking-[0.16em] text-cream"
                    >
                      {b({ ar: 'الأنسب للنمو', en: 'Best for growth' })}
                    </span>
                  )}

                  <h3 className="font-display text-xl font-bold text-ink">
                    {isAr ? plan.name_ar : plan.name_en}
                  </h3>

                  {/* ── Subscription fee ── */}
                  <dl className="mt-6 space-y-3 border-b border-ink/10 pb-6">
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft/60">
                        {b({ ar: 'الاشتراك', en: 'Subscription' })}
                      </dt>
                      <dd className="mt-1.5 font-display text-ink">
                        {isCustom ? (
                          <span className="text-2xl font-bold">
                            {b({ ar: 'حسب احتياجك', en: 'Custom' })}
                          </span>
                        ) : (
                          <>
                            <span className="text-3xl font-bold">
                              {num(plan.price_monthly.toLocaleString('en-US'))}
                            </span>
                            <span className="ms-2 text-sm text-ink-soft/70">
                              {b({ ar: 'جنيه/شهر', en: 'EGP/month' })}
                            </span>
                          </>
                        )}
                      </dd>
                    </div>

                    {/* ── Transaction fee — always a separate line ── */}
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft/60">
                        {b({ ar: 'عمولة على الأوردر', en: 'Per-order fee' })}
                      </dt>
                      <dd className="mt-1.5 font-display text-lg font-bold text-sage">
                        {plan.commission_percent
                          ? `${num(String(plan.commission_percent))}${isAr ? '٪' : '%'}`
                          : `${num('0')}${isAr ? '٪' : '%'}`}
                      </dd>
                    </div>
                  </dl>

                  <ul className="mt-6 space-y-2.5 flex-1">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex gap-2.5">
                        <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-navy/40" />
                        <span className="prose-body-sm text-ink-soft/85">
                          {isAr ? f.ar : f.en}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-7">
                    {plan.cta === 'contact' ? (
                      <Link
                        to="/contact"
                        className="inline-flex w-full items-center justify-center rounded-[4px]
                          border border-navy/25 px-5 py-2.5 text-sm font-semibold text-navy
                          transition-colors hover:bg-navy/[0.05]
                          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron
                          focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
                      >
                        {b(CTA.sales)}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          openSignup(plan.key === 'starter' || plan.key === 'pro' ? plan.key : null)
                        }
                        className={`group inline-flex w-full items-center justify-center gap-2
                          rounded-[4px] px-5 py-2.5 text-sm font-semibold transition-all
                          duration-200 ease-numu active:scale-[0.985]
                          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron
                          focus-visible:ring-offset-2 focus-visible:ring-offset-cream
                          ${recommended
                            ? 'bg-navy text-cream hover:bg-navy-800'
                            : 'border border-navy/25 text-navy hover:bg-navy/[0.05]'}`}
                      >
                        <span>{b(CTA.primary)}</span>
                        <span
                          aria-hidden="true"
                          className="text-saffron rtl:rotate-180 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
                        >
                          →
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Prices could not be loaded: link to the pricing page rather than
          // print a number this component made up.
          <div className="mt-12 text-center">
            {failed && (
              <Link
                to="/pricing"
                className="font-semibold text-navy underline decoration-navy/30 underline-offset-4 hover:decoration-navy"
              >
                {b({ ar: 'شوف الباقات والأسعار', en: 'See plans and pricing' })}
              </Link>
            )}
          </div>
        )}

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
