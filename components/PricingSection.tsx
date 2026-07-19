import React, { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useSignupModal, PlanIntent } from "../contexts/SignupModalContext";
import DemoStartModal from "./DemoStartModal";

const API_URL = import.meta.env.VITE_API_URL || "";

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
  cta: string; // try_demo | subscribe | signup_payg | contact
  popular: boolean;
  /** Pay-as-you-Grow only — live admin-controlled rate (e.g. 3). */
  commission_percent?: number;
  features: PlanFeature[];
}

interface Promo {
  code: string;
  text_en: string;
  text_ar: string;
}

interface TrialMeta {
  enabled: boolean;
  days: number;
  visible: boolean;
}

interface PricingData {
  plans: Plan[];
  promo?: Promo;
  trial?: TrialMeta;
}

// Arabic-Indic numeral converter for RTL price display
const toArabicDigits = (s: string): string =>
  s.replace(/[0-9]/g, (d) => String.fromCharCode(0x0660 + parseInt(d, 10)));

const PricingSection: React.FC = () => {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const { open: openSignup } = useSignupModal();
  const [data, setData] = useState<PricingData | null>(null);
  const [annual, setAnnual] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/public/pricing-plans`, { credentials: "include" })
      .then((r) => r.json())
      .then((json) => setData(json.data))
      .catch(() => {});
  }, []);

  if (!data) return null;

  const { plans, promo } = data;

  // Product JSON-LD per plan — lets Google show price/offer rich snippets
  const productSchema = {
    '@context': 'https://schema.org',
    '@graph': plans
      .filter((p) => p.price_monthly > 0)
      .map((p) => ({
        '@type': 'Product',
        name: `numu — ${p.name_en}`,
        description: `${p.name_en} plan for numu, the Arabic-first commerce platform. ${p.features.slice(0, 3).map((f) => f.en).join('. ')}.`,
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
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {/* Eyebrow + header */}
      <div className="text-center mb-10 sm:mb-14">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-terracotta font-semibold">
            § PRICING
          </span>
          <span className="eyebrow">
            {isAr ? "باقات واضحة · بدون مفاجآت" : "CLEAR PLANS · NO SURPRISES"}
          </span>
        </div>

        <h2 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-bold text-ink tracking-tight leading-[1.05] mb-5">
          {isAr ? "باقات بسيطة وشفافة." : "Simple, transparent pricing."}
        </h2>
        <p className="prose-body text-ink/75 max-w-xl mx-auto">
          {isAr
            ? "مفيش رسوم مخفية. مفيش عمولة على الأوردرات. أنت تاخد ١٠٠٪ من إيراداتك."
            : "No hidden fees. No per-order commissions. You keep 100% of your revenue."}
        </p>

        {/* Saffron promo chip — warmth / offers, per brand kit */}
        {promo && (
          <div className="mt-7 inline-flex items-center gap-2.5 px-4 py-2 bg-saffron/15 border border-saffron/40 rounded-[4px]">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-saffron animate-pulse"
            />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] font-semibold text-saffron">
              {isAr ? promo.text_ar : promo.text_en}
            </span>
          </div>
        )}

        {/* Annual toggle — flat, hairline border, no neu */}
        <div className="mt-7 inline-flex items-center gap-3 px-4 py-2 bg-paper border border-ink/10 rounded-[4px]">
          <span
            className={`font-mono text-[11px] uppercase tracking-[0.18em] font-semibold transition-colors ${
              !annual ? "text-navy" : "text-ink-soft/50"
            }`}
          >
            {isAr ? "شهري" : "Monthly"}
          </span>
          <button
            type="button"
            title={isAr ? "تبديل الفترة" : "Toggle billing period"}
            onClick={() => setAnnual(!annual)}
            // eslint-disable-next-line jsx-a11y/aria-proptypes
            aria-pressed={annual}
            className={`relative w-10 h-5 rounded-[4px] transition-colors duration-200 ease-numu ${
              annual ? "bg-navy" : "bg-bone"
            }`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-[2px] bg-cream shadow-sm transition-transform duration-200 ease-numu ${
                annual
                  ? "translate-x-[21px] rtl:-translate-x-[21px]"
                  : "translate-x-0.5 rtl:-translate-x-0.5"
              }`}
            />
          </button>
          <span
            className={`font-mono text-[11px] uppercase tracking-[0.18em] font-semibold transition-colors ${
              annual ? "text-navy" : "text-ink-soft/50"
            }`}
          >
            {isAr ? "سنوي" : "Annual"}
          </span>
          {annual && (
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold text-cream bg-terracotta px-2 py-0.5 rounded-[2px]">
              {isAr ? `وفر ${toArabicDigits("17")}٪` : "Save 17%"}
            </span>
          )}
        </div>
      </div>

      {/* Plan cards — grid of flat editorial panels */}
      <div
        className={`grid gap-5 lg:gap-6 items-start ${
          plans.length === 1
            ? "grid-cols-1 max-w-md mx-auto"
            : plans.length === 2
              ? "grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto"
              : plans.length === 3
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        }`}
      >
        {plans.map((plan) => {
          const isFree = plan.price_monthly === 0;
          const isCustom = plan.price_monthly === -1;
          const isPopular = plan.popular;
          const isPayg = plan.key === "payg";
          // Trial length comes from the admin-controlled signup settings
          // (falls back to 30 for older API payloads).
          const trialDays = String(data.trial?.days ?? 30);
          const paygPct = String(plan.commission_percent ?? 3);

          const priceRaw = isCustom
            ? isAr
              ? "قيمة مخصصة"
              : "Custom"
            : isFree
              ? isAr
                ? "مجاناً"
                : "Free"
              : annual && plan.price_annual > 0
                ? plan.price_annual.toLocaleString()
                : plan.price_monthly.toLocaleString();

          const price =
            isAr && !isCustom && !isFree ? toArabicDigits(priceRaw) : priceRaw;

          const period = isPayg
            ? isAr
              ? `${toArabicDigits(paygPct)}٪ فقط على كل طلب مدفوع`
              : `Only ${paygPct}% per paid order`
            : isFree
            ? isAr
              ? `تجربة مجانية ${toArabicDigits(trialDays)} يوم`
              : `${trialDays}-day free trial`
            : isCustom
              ? isAr
                ? "حسب متطلباتك ونطاق عملك"
                : "Based on your requirements"
              : annual
                ? isAr
                  ? "جنيه/سنة"
                  : "EGP/year"
                : isAr
                  ? "جنيه/شهر"
                  : "EGP/month";

          const subtitle = isPayg
            ? isAr
              ? "بدون اشتراك شهري — ادفع وأنت تنمو"
              : "No monthly subscription — pay as you grow"
            : isFree
            ? isAr
              ? "بدون بطاقة ائتمان"
              : "No credit card needed"
            : isCustom
              ? isAr
                ? "حلول مخصصة للشركات الكبيرة"
                : "Custom solutions for large businesses"
              : isAr
                ? `كل اللي محتاجه ${plan.name_ar === "ستارترز" ? "تبدأ" : "تنمو"}`
                : `Everything you need to ${plan.name_en === "Starter" ? "start" : "grow"}`;

          // Popular plan inverts palette: navy bg + cream text. Flat, no gradient.
          const cardBase = "relative flex flex-col rounded-[14px] overflow-hidden transition-all duration-300 ease-numu";
          const cardSurface = isPopular
            ? "bg-navy text-cream shadow-card lg:scale-[1.03] z-10"
            : "bg-paper border border-ink/10 text-ink shadow-card hover:-translate-y-0.5 hover:shadow-md";

          return (
            <div key={plan.key} className={`${cardBase} ${cardSurface}`}>
              {/* Popular ribbon — saffron mono label peeking above top edge */}
              {isPopular && (
                <span className="absolute top-3 end-3 z-10 bg-saffron text-ink font-mono text-[10px] uppercase tracking-[0.18em] font-semibold px-2 py-0.5 rounded-[2px]">
                  {isAr ? "الأكثر شهرة" : "Most Popular"}
                </span>
              )}

              <div className="flex flex-col flex-1 p-6 sm:p-8">
                {/* Plan name — mono eyebrow, not icon */}
                <div className="mb-6">
                  <p
                    className={`font-mono text-[11px] uppercase tracking-[0.18em] font-semibold mb-1 ${
                      isPopular ? "text-saffron" : "text-terracotta"
                    }`}
                  >
                    {isAr ? plan.name_ar : plan.name_en}
                  </p>
                </div>

                {/* Price — Reem Kufi display, tabular */}
                <div className="mb-2">
                  {!isFree && !isCustom && (
                    <p
                      className={`font-mono text-[10px] uppercase tracking-[0.18em] mb-1 ${
                        isPopular ? "text-cream/60" : "text-ink-soft/60"
                      }`}
                    >
                      {isAr ? "يبدأ من" : "Starting at"}
                    </p>
                  )}
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span
                      className={`font-display font-bold tabular-nums tracking-tight leading-none ${
                        isFree || isCustom
                          ? "text-4xl sm:text-5xl"
                          : "text-5xl sm:text-6xl"
                      }`}
                    >
                      {price}
                    </span>
                    {!isFree && !isCustom && (
                      <span
                        className={`text-sm font-medium ${
                          isPopular ? "text-cream/60" : "text-ink-soft/70"
                        }`}
                      >
                        {period}
                      </span>
                    )}
                  </div>
                </div>

                <p
                  className={`text-sm mb-6 ${
                    isPopular ? "text-cream/70" : "text-ink-soft/75"
                  }`}
                >
                  {isFree || isCustom ? period : subtitle}
                </p>

                {/* CTA — each card does what it says:
                    try_demo → demo modal (name+email, throwaway tenant);
                    subscribe / signup_payg → real signup carrying the plan
                    intent (payg auto-activates at store creation);
                    contact → contact page. */}
                <div className="mb-6">
                  {(plan.cta === "try_demo" ||
                    plan.cta === "subscribe" ||
                    plan.cta === "signup_payg") && (
                    <button
                      type="button"
                      onClick={() =>
                        plan.cta === "try_demo"
                          ? setDemoOpen(true)
                          : openSignup(
                              plan.cta === "signup_payg"
                                ? "payg"
                                : (["starter", "pro"].includes(plan.key)
                                    ? (plan.key as PlanIntent)
                                    : null),
                            )
                      }
                      className={`group w-full font-semibold py-3.5 rounded-[4px] text-sm transition-all duration-200 ease-numu flex items-center justify-center gap-2 ${
                        isPopular
                          ? "bg-cream text-navy hover:bg-cream/90 active:scale-[0.985]"
                          : "bg-navy text-cream hover:bg-navy-800 active:scale-[0.985]"
                      }`}
                    >
                      <span>
                        {plan.cta === "try_demo"
                          ? isAr
                            ? "جرّب الآن"
                            : "Try now"
                          : isPayg
                            ? isAr
                              ? "ابدأ مجاناً وانمو"
                              : "Start free & grow"
                            : isFree
                              ? isAr
                                ? "ابدأ مجاناً"
                                : "Start free"
                              : isAr
                                ? "ابدأ الآن"
                                : "Start now"}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`text-base group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform rtl:rotate-180 ${
                          isPopular ? "text-terracotta" : "text-saffron"
                        }`}
                      >
                        →
                      </span>
                    </button>
                  )}
                  {plan.cta === "contact" && (
                    <a
                      href="/contact"
                      className={`block w-full text-center font-semibold py-3.5 rounded-[4px] text-sm transition-all duration-200 ease-numu border ${
                        isPopular
                          ? "border-cream/30 text-cream hover:bg-cream/10"
                          : "border-ink/15 text-ink hover:border-terracotta hover:text-terracotta hover:bg-terracotta/[0.04]"
                      }`}
                    >
                      {isAr ? "تواصل معنا" : "Contact us"}
                    </a>
                  )}
                </div>

                {/* Hairline divider — bone on light, cream/20 on navy */}
                <div
                  className={`h-px mb-6 ${
                    isPopular ? "bg-cream/15" : "bg-bone"
                  }`}
                />

                {/* Features — sage check (success) */}
                <ul className="space-y-3 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg
                        className={`size-4 shrink-0 mt-0.5 ${
                          isPopular ? "text-saffron" : "text-sage"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 12.75 6 6 9-13.5"
                        />
                      </svg>
                      <span
                        className={`text-[13px] leading-relaxed ${
                          isPopular ? "text-cream/80" : "text-ink-soft/85"
                        }`}
                      >
                        {isAr ? f.ar : f.en}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom note */}
      <p className="prose-body-sm text-center text-ink/70 mt-12 max-w-2xl mx-auto">
        {isAr
          ? "كل الباقات بتشمل: كل الثيمات، الدفع عند الاستلام، بيموب، فوري، بوسطة، ومتجر عربي ١٠٠٪. مفيش عمولة على أوردراتك."
          : "All plans include: all themes, COD, Paymob, Fawry, Bosta, and a fully Arabic storefront. Zero commission on your orders."}
      </p>

      {/* Pledge strip — 30-day money-back is the answer to the #1 pricing
          objection ("what if I don't like it?") and the reassurance
          WooCommerce leads with. Paired with cancel-anytime + data-
          ownership, it disarms the three standard SaaS pricing objections
          in one row. Static class strings (no dynamic `bg-${accent}`) so
          Tailwind JIT can see every utility at build time. */}
      <div className="mt-10 max-w-4xl mx-auto bg-paper border border-ink/10 rounded-[10px] shadow-card p-5 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-4">
          <div className="flex items-start gap-3 sm:items-center sm:flex-col sm:text-center">
            <span
              aria-hidden="true"
              className="shrink-0 inline-flex items-center justify-center size-9 rounded-[4px] bg-terracotta/10 border border-terracotta/30"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4 text-terracotta"
              >
                <path d="M12 2.5l7.5 3v6.3c0 4.3-3 8.1-7.5 9.7C7.5 19.9 4.5 16.1 4.5 11.8V5.5L12 2.5z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </span>
            <div className="min-w-0">
              <p className="font-display text-sm font-semibold text-ink leading-tight mb-0.5">
                {isAr ? 'استرداد كامل خلال ٣٠ يوم' : '30-day money-back guarantee'}
              </p>
              <p className="prose-body-sm text-ink/70 leading-snug">
                {isAr
                  ? 'ما عجبكش؟ فلوسك ترجع كاملة. بدون أسئلة.'
                  : 'Not a fit? Full refund. No questions.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 sm:items-center sm:flex-col sm:text-center">
            <span
              aria-hidden="true"
              className="shrink-0 inline-flex items-center justify-center size-9 rounded-[4px] bg-sage/10 border border-sage/30"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4 text-sage"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M8 12l3 3 5-6" />
              </svg>
            </span>
            <div className="min-w-0">
              <p className="font-display text-sm font-semibold text-ink leading-tight mb-0.5">
                {isAr ? 'إلغاء في أي وقت' : 'Cancel anytime'}
              </p>
              <p className="prose-body-sm text-ink/70 leading-snug">
                {isAr
                  ? 'بدون التزام طويل. غيّر أو وقّف وقت ما تحب.'
                  : 'No lock-in. Change or stop whenever you want.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 sm:items-center sm:flex-col sm:text-center">
            <span
              aria-hidden="true"
              className="shrink-0 inline-flex items-center justify-center size-9 rounded-[4px] bg-navy/10 border border-navy/30"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4 text-navy"
              >
                <rect x="4" y="5" width="16" height="14" rx="2" />
                <path d="M9 10l3 3 3-3" />
                <path d="M12 13V7" />
              </svg>
            </span>
            <div className="min-w-0">
              <p className="font-display text-sm font-semibold text-ink leading-tight mb-0.5">
                {isAr ? 'بياناتك بياناتك' : 'Your data stays yours'}
              </p>
              <p className="prose-body-sm text-ink/70 leading-snug">
                {isAr
                  ? 'تصدير العملاء، الأوردرات، المنتجات ساعة ما تحب — CSV.'
                  : 'Export customers, orders, products anytime — CSV.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <DemoStartModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  );
};

export default PricingSection;
