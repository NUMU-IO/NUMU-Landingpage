import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import type { Bi } from './copy';
import { useBi } from './ui';
import { Reveal } from './Reveal';
import { useSignupModal, type PlanIntent } from '../../contexts/SignupModalContext';
import { usePricing, type PublicPlan } from '../../lib/pricingFacts';
import { DEFAULT_TRIAL_DAYS, toArabicDigits } from '../../lib/trialInfo';

/**
 * /pricing — the page a visitor lands on from «الأسعار» (owner request
 * 2026-09-28: a separate page that sells the subscription, in Egyptian
 * words, with calm motion and the dashboard's own icons).
 *
 * Every number comes from `GET /public/pricing-plans` through `usePricing`,
 * which starts from the snapshot the prerender bakes into the page — so the
 * plans are on screen at first paint and never vanish if the live request
 * fails. Nothing here invents a price, a limit or a saving: the yearly saving
 * is computed from the two prices the admin set.
 *
 * Icons are Microsoft's Fluent Emoji 3D set (MIT, `public/emoji3d/LICENSE`,
 * fetched 2026-09-28) — the glossy 3D style the owner asked for. Motion is
 * the cards' fade-up and the recommended plan's slow breath; it stops under
 * `prefers-reduced-motion` (global rule in `index.css`).
 */

/** A Fluent Emoji 3D icon from `public/emoji3d/` (decorative). */
const Icon3D: React.FC<{ name: string; size?: number }> = ({ name, size = 44 }) => (
  <img
    src={`/emoji3d/${name}.webp`}
    alt=""
    width={size}
    height={size}
    loading="lazy"
    decoding="async"
    className="shrink-0 select-none"
    style={{ width: size, height: size }}
  />
);

const PLAN_META: Record<string, { icon: string; accent: string; tagline: Bi }> = {
  starter: {
    icon: 'seedling',
    accent: '#5F7D24',
    tagline: { ar: 'عشان تبدأ صح، من غير ما تشيل هم.', en: 'To start right, without the worry.' },
  },
  pro: {
    icon: 'rocket',
    accent: '#4657B8',
    tagline: { ar: 'للي الأوردرات بقت بتجري وراه.', en: 'For when the orders start chasing you.' },
  },
  enterprise: {
    icon: 'building',
    accent: '#A0489B',
    tagline: { ar: 'للبراندات الكبيرة اللي عايزة كل حاجة على مقاسها.', en: 'For big brands that want everything made to measure.' },
  },
};
const CARD_KEYS = ['starter', 'pro', 'enterprise'] as const;

/**
 * The plans themselves — chips, launch offer, monthly/yearly switch, the
 * three plan cards and Pay as you grow. Shared by `/pricing` (below) and the
 * homepage pricing section (`PricingFinalCta`), so the two can never drift.
 */
export const PlansBody: React.FC = () => {
  const { b, isAr } = useBi();
  const data = usePricing();
  const { open } = useSignupModal();
  const [annual, setAnnual] = useState(false);

  const num = (n: number) => {
    const s = n.toLocaleString('en-US');
    return isAr ? toArabicDigits(s) : s;
  };
  const days = data?.trial?.days ?? DEFAULT_TRIAL_DAYS;
  const trialOn = data?.trial?.enabled !== false;
  const cards = CARD_KEYS.map((k) => data?.plans.find((p) => p.key === k)).filter(Boolean) as PublicPlan[];
  const payg = data?.plans.find((p) => p.key === 'payg');

  // Months the yearly price saves, from the recommended plan's own prices.
  const ref = cards.find((p) => p.popular) ?? cards[0];
  const monthsFree =
    ref && ref.price_monthly > 0 && ref.price_annual > 0
      ? Math.round((ref.price_monthly * 12 - ref.price_annual) / ref.price_monthly)
      : 0;
  const saving: Bi =
    monthsFree === 1
      ? { ar: 'شهر ببلاش', en: '1 month free' }
      : monthsFree === 2
        ? { ar: 'شهرين ببلاش', en: '2 months free' }
        : { ar: `${num(monthsFree)} شهور ببلاش`, en: `${monthsFree} months free` };

  const chips: { icon: string; text: Bi; show: boolean }[] = [
    { icon: 'gift', text: { ar: `أول ${num(days)} يوم ببلاش`, en: `First ${days} days free` }, show: trialOn },
    { icon: 'card', text: { ar: 'من غير بطاقة ائتمان', en: 'No credit card' }, show: true },
    {
      icon: 'moneybag',
      text: { ar: '٠٪ عمولة على الأوردر في الباقات الشهرية', en: '0% per-order commission on monthly plans' },
      show: true,
    },
    { icon: 'banknote', text: { ar: 'الكاش عند الاستلام شغّال من أول يوم', en: 'Cash on delivery from day one' }, show: true },
    { icon: 'cycle', text: { ar: 'غيّر باقتك وقت ما تحب', en: 'Change plans whenever you like' }, show: true },
  ];

  const currency = (p: PublicPlan) => (p.currency === 'EGP' ? (isAr ? 'ج.م' : 'EGP') : p.currency);

  const cta = (plan: PublicPlan, popular: boolean) => {
    const base =
      'group inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-[15px] font-bold transition-transform active:translate-y-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2';
    const look = popular
      ? 'bg-saffron text-navy-900 shadow-[0_2px_0_#B97F1C] focus-visible:ring-offset-navy'
      : 'bg-navy text-cream shadow-[0_2px_0_#001F3F] focus-visible:ring-offset-paper';
    const arrow = (
      <span aria-hidden="true" className="transition-transform group-hover:-translate-x-0.5 ltr:group-hover:translate-x-0.5 rtl:rotate-180">
        →
      </span>
    );
    if (plan.cta === 'contact') {
      return (
        <Link to="/contact" className={`${base} ${look}`}>
          {b({ ar: 'كلّمنا ونظبطهالك', en: 'Talk to us' })}
          {arrow}
        </Link>
      );
    }
    return (
      <button type="button" onClick={() => open(plan.key as PlanIntent)} className={`${base} ${look}`}>
        {trialOn ? b({ ar: 'ابدأ تجربتك ببلاش', en: 'Start your free trial' }) : b({ ar: 'اشترك دلوقتي', en: 'Subscribe now' })}
        {arrow}
      </button>
    );
  };

  return (
    <>
    <ul className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-2.5">
      {chips
        .filter((c) => c.show)
        .map((c, i) => (
          <Reveal
            key={c.text.en}
            as="li"
            delay={i * 70}
            className="flex items-center gap-2 rounded-full border border-ink/10 bg-paper py-1.5 pe-4 ps-2 text-[13.5px] font-semibold text-ink shadow-[0_1px_2px_rgba(0,31,63,0.06)]"
          >
            <Icon3D name={c.icon} size={28} />
            {b(c.text)}
          </Reveal>
        ))}
    </ul>

    {data?.promo && (
      <p className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-full border border-dashed border-saffron bg-saffron/10 px-4 py-2 text-[14px] font-semibold text-ink">
        <Icon3D name="gift" size={22} />
        {isAr ? data.promo.text_ar : data.promo.text_en}
      </p>
    )}

    {/* Monthly / yearly */}
    {cards.some((p) => p.price_annual > 0) && (
      <div
        role="group"
        aria-label={b({ ar: 'طريقة الدفع', en: 'Billing' })}
        className="mx-auto mt-10 flex w-fit items-center gap-1 rounded-full border border-ink/10 bg-paper p-1"
      >
        {[false, true].map((isYearly) => (
          <button
            key={String(isYearly)}
            type="button"
            aria-pressed={annual === isYearly}
            onClick={() => setAnnual(isYearly)}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-[14px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron ${
              annual === isYearly ? 'bg-navy text-cream' : 'text-ink-soft hover:text-ink'
            }`}
          >
            {isYearly ? b({ ar: 'سنوي', en: 'Yearly' }) : b({ ar: 'شهري', en: 'Monthly' })}
            {isYearly && monthsFree > 0 && (
              <span className="rounded-full bg-sage/20 px-2 py-0.5 text-[11px] font-bold text-sage">{b(saving)}</span>
            )}
          </button>
        ))}
      </div>
    )}

    {/* Plans */}
    {cards.length ? (
      <div className="mt-10 grid gap-5 md:grid-cols-3 md:items-stretch">
        {cards.map((plan, i) => {
          const meta = PLAN_META[plan.key];
          const popular = plan.popular;
          const custom = plan.price_monthly < 0;
          const yearly = annual && plan.price_annual > 0;
          const price = yearly ? plan.price_annual : plan.price_monthly;
          return (
            <Reveal
              key={plan.key}
              delay={i * 90}
              className={`relative flex flex-col rounded-[20px] border p-6 sm:p-7 transition-transform duration-300 hover:-translate-y-1 ${
                popular ? 'numu-breathe border-navy bg-navy text-cream' : 'border-ink/10 bg-paper text-ink'
              }`}
            >
              {popular && (
                <span className="absolute -top-3 start-6 rounded-full bg-saffron px-3 py-1 text-[12px] font-bold text-navy-900">
                  {b({ ar: 'الأكتر اختيارًا', en: 'Most picked' })}
                </span>
              )}
              <div className="flex items-center gap-3">
                <Icon3D name={meta.icon} size={52} />
                <h2 className={`font-display text-[22px] font-bold ${popular ? 'text-cream' : 'text-ink'}`}>{isAr ? plan.name_ar : plan.name_en}</h2>
              </div>
              <p className={`mt-3 text-[14.5px] leading-7 ${popular ? 'text-cream/80' : 'text-ink-soft/85'}`}>{b(meta.tagline)}</p>

              <div className="mt-6 min-h-[82px]">
                {custom ? (
                  <p className="font-display text-[30px]/[1.2] font-bold">{b({ ar: 'سعر على مقاسك', en: 'Priced for you' })}</p>
                ) : (
                  <div key={String(yearly)} className="numu-bubble-in">
                    <p className="flex items-baseline gap-2">
                      <span className="font-display text-[44px]/[1] font-bold tabular-nums">{num(price)}</span>
                      <span className={`text-sm ${popular ? 'text-cream/75' : 'text-ink-soft/75'}`}>
                        {currency(plan)} / {yearly ? b({ ar: 'سنة', en: 'year' }) : b({ ar: 'شهر', en: 'month' })}
                      </span>
                    </p>
                    {yearly && (
                      <p className={`mt-2 text-[13px] ${popular ? 'text-cream/75' : 'text-ink-soft/75'}`}>
                        {b({
                          ar: `يعني ${num(Math.round(plan.price_annual / 12))} ${currency(plan)} في الشهر`,
                          en: `That is ${num(Math.round(plan.price_annual / 12))} ${currency(plan)} a month`,
                        })}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <ul className="mt-6 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f.en} className="flex items-start gap-2.5 text-[14.5px] leading-6">
                    <Check
                      aria-hidden="true"
                      className="mt-1 size-4 shrink-0"
                      style={{ color: popular ? '#E8A430' : meta.accent }}
                      strokeWidth={2.6}
                    />
                    <span>{isAr ? f.ar : f.en}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7">{cta(plan, popular)}</div>
            </Reveal>
          );
        })}
      </div>
    ) : (
      <div aria-hidden="true" className="mt-10 grid gap-5 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-[440px] animate-pulse rounded-[20px] border border-ink/10 bg-paper" />
        ))}
      </div>
    )}

    {/* Not ready to pick? Pay as you grow. */}
    {payg && (
      <Reveal className="mt-8 flex flex-col gap-5 rounded-[20px] border-2 border-dashed border-sage/50 bg-sage/[0.07] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div className="flex items-start gap-4">
          <Icon3D name="chart" size={52} />
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-terracotta">
              {b({ ar: 'مش متأكد لسه؟', en: 'Not sure yet?' })}
            </p>
            <h2 className="mt-1 font-display text-xl font-bold text-ink">{isAr ? payg.name_ar : payg.name_en}</h2>
            <p className="prose-body-sm mt-1 text-ink-soft/85">
              {b({
                ar: `من غير اشتراك شهري: بتدفع ${num(payg.commission_percent ?? 3)}٪ بس على كل أوردر مدفوع.`,
                en: `No monthly fee: you pay ${payg.commission_percent ?? 3}% only on each paid order.`,
              })}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => open('payg')}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border-2 border-sage bg-paper px-5 py-3 text-[15px] font-bold text-ink transition-colors hover:bg-sage hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
        >
          {b({ ar: 'ابدأ من غير اشتراك', en: 'Start with no subscription' })}
        </button>
      </Reveal>
    )}
    </>
  );
};

const PricingPlans: React.FC = () => {
  const { b, isAr } = useBi();
  const data = usePricing();
  const num = (n: number) => {
    const s = n.toLocaleString('en-US');
    return isAr ? toArabicDigits(s) : s;
  };
  const days = data?.trial?.days ?? DEFAULT_TRIAL_DAYS;
  const trialOn = data?.trial?.enabled !== false;

  const steps: { icon: string; title: Bi; body: Bi }[] = [
    {
      icon: 'memo',
      title: { ar: 'سجّل', en: 'Sign up' },
      body: { ar: 'الاسم والإيميل والموبايل والباسورد، وخلاص.', en: 'Name, email, phone and a password. That is it.' },
    },
    {
      icon: 'party',
      title: { ar: 'جرّب ببلاش', en: 'Try it free' },
      body: {
        ar: `افتح متجرك وجرّبه ${num(days)} يوم، من غير بطاقة ائتمان.`,
        en: `Open your store and try it for ${days} days, no credit card.`,
      },
    },
    {
      icon: 'check',
      title: { ar: 'اختار باقتك', en: 'Pick your plan' },
      body: {
        ar: 'لما تكون مرتاح، اختار الباقة اللي تناسبك — أو ادفع على قد ما بتبيع.',
        en: 'When you are ready, pick the plan that fits — or pay only as you sell.',
      },
    },
  ];

  // Product JSON-LD per paid plan — price rich results (carried over from the
  // previous pricing component).
  const productSchema = {
    '@context': 'https://schema.org',
    '@graph': (data?.plans ?? [])
      .filter((p) => p.price_monthly > 0)
      .map((p) => ({
        '@type': 'Product',
        name: `numu — ${p.name_en}`,
        description: `${p.name_en} plan for numu, the Arabic-first commerce platform. ${p.features
          .slice(0, 3)
          .map((f) => f.en)
          .join('. ')}.`,
        brand: { '@type': 'Brand', name: 'numu' },
        offers: {
          '@type': 'Offer',
          price: String(p.price_monthly),
          priceCurrency: p.currency || 'EGP',
          priceValidUntil: '2026-12-31',
          availability: 'https://schema.org/InStock',
          url: 'https://numueg.app/pricing',
        },
      })),
  };

  return (
    <>
      {productSchema['@graph'].length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      )}

      {/* ── Hero + plans ── */}
      <section className="relative overflow-hidden bg-cream numu-dot-surface pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20">
        <div className="relative max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-10">
          <header className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta">
              {b({ ar: 'الأسعار', en: 'Pricing' })}
            </p>
            <h1 className="mt-4 font-display font-bold text-ink text-[34px]/[1.25] sm:text-[48px]/[1.18] lg:text-[56px]/[1.12]">
              {b({ ar: 'باقة على قد مقاسك… وبتكبر معاك.', en: 'A plan that fits you now — and grows with you.' })}
            </h1>
            <p className="prose-body mx-auto mt-5 max-w-2xl text-ink-soft/85">
              {trialOn
                ? b({
                    ar: `جرّب نُمُو ${num(days)} يوم ببلاش، وبعدها اختار اللي يريّحك — ومفيش رسوم مستخبية.`,
                    en: `Try numu free for ${days} days, then pick what suits you — with no hidden fees.`,
                  })
                : b({ ar: 'اختار اللي يريّحك — ومفيش رسوم مستخبية.', en: 'Pick what suits you — with no hidden fees.' })}
            </p>
          </header>

          <PlansBody />
        </div>
      </section>

      {/* ── Three steps ── */}
      <section className="border-t border-ink/10 bg-paper py-16 sm:py-20">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-10">
          <h2 className="text-center font-display text-[28px]/[1.3] font-bold text-ink sm:text-[36px]/[1.25]">
            {b({ ar: '٣ خطوات وتبقى بتبيع', en: 'Three steps to selling' })}
          </h2>
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.title.en} as="li" delay={i * 110} className="rounded-[18px] border border-ink/10 bg-cream p-6">
                <div className="flex items-center gap-3">
                  <Icon3D name={s.icon} size={56} />
                  <span className="font-mono text-[12px] font-bold text-ink-soft/70">{num(i + 1)}</span>
                </div>
                <h3 className="mt-4 font-display text-xl font-bold text-ink">{b(s.title)}</h3>
                <p className="prose-body-sm mt-2 text-ink-soft/85">{b(s.body)}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
};

export default PricingPlans;
