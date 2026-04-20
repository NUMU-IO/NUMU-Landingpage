import React, { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
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
  cta: string;
  popular: boolean;
  features: PlanFeature[];
}

interface Promo {
  code: string;
  text_en: string;
  text_ar: string;
}

interface PricingData {
  plans: Plan[];
  promo?: Promo;
}

/* ── plan icon SVGs (Heroicons outline) ── */
const planIcons: Record<string, React.ReactNode> = {
  free: (
    <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.841m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
    </svg>
  ),
  starter: (
    <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.841m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
    </svg>
  ),
  growth: (
    <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
    </svg>
  ),
  professional: (
    <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>
  ),
  enterprise: (
    <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
    </svg>
  ),
};

const getIcon = (key: string) =>
  planIcons[key] || planIcons["starter"];

const PricingSection: React.FC = () => {
  const { language } = useLanguage();
  const isAr = language === "ar";
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text-main dark:text-white mb-5">
          {isAr ? "باقات بسيطة وشفافة" : "Simple, Transparent Pricing"}
        </h2>
        <p className="text-text-muted max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          {isAr
            ? "مفيش رسوم مخفية. مفيش عمولة على الأوردرات. أنت تاخد ١٠٠٪ من إيراداتك."
            : "No hidden fees. No per-order commissions. You keep 100% of your revenue."}
        </p>

        {promo && (
          <div className="mt-7 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-bold">
            <span className="material-symbols-outlined text-base">local_offer</span>
            {isAr ? promo.text_ar : promo.text_en}
          </div>
        )}

        {/* Annual toggle */}
        <div className="mt-8 inline-flex items-center gap-3 px-6 py-3 rounded-full bg-background-light dark:bg-background-dark shadow-neu-pressed-sm">
          <span className={`text-sm font-semibold transition-colors ${!annual ? "text-primary" : "text-text-muted"}`}>
            {isAr ? "شهري" : "Monthly"}
          </span>
          <button
            type="button"
            title={isAr ? "تبديل الفترة" : "Toggle billing period"}
            onClick={() => setAnnual(!annual)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${annual ? "bg-primary" : "bg-text-muted/30"}`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
                annual ? "translate-x-6 rtl:-translate-x-6" : "translate-x-0.5 rtl:-translate-x-0.5"
              }`}
            />
          </button>
          <span className={`text-sm font-semibold transition-colors ${annual ? "text-primary" : "text-text-muted"}`}>
            {isAr ? "سنوي" : "Annual"}
          </span>
          {annual && (
            <span className="text-[11px] font-bold text-white bg-primary px-2.5 py-0.5 rounded-full">
              {isAr ? "وفر ١٧٪" : "Save 17%"}
            </span>
          )}
        </div>
      </div>

      {/* Plan Cards */}
      <div className={`grid gap-5 lg:gap-6 items-start ${
        plans.length === 1 ? "grid-cols-1 max-w-md mx-auto" :
        plans.length === 2 ? "grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto" :
        plans.length === 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto" :
        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      }`}>
        {plans.map((plan) => {
          const isFree = plan.price_monthly === 0;
          const isCustom = plan.price_monthly === -1;
          const isPopular = plan.popular;

          const price = isCustom
            ? isAr ? "قيمة مخصصة" : "Custom"
            : isFree
              ? isAr ? "مجاناً" : "Free"
              : annual && plan.price_annual > 0
                ? plan.price_annual.toLocaleString()
                : plan.price_monthly.toLocaleString();

          const period =
            isFree
              ? isAr ? "تجربة مجانية ٣٠ يوم" : "30-day free trial"
              : isCustom
                ? isAr ? "حسب متطلباتك ونطاق عملك" : "Based on your requirements"
                : annual
                  ? isAr ? "جنيه/سنة" : "EGP/year"
                  : isAr ? "جنيه/شهر" : "EGP/month";

          const subtitle =
            isFree
              ? isAr ? "بدون بطاقة ائتمان" : "No credit card needed"
              : isCustom
                ? isAr ? "حلول مخصصة للشركات الكبيرة" : "Custom solutions for large businesses"
                : isAr
                  ? `كل اللي محتاجه ${plan.name_ar === "ستارترز" ? "تبدأ" : "تنمو"}`
                  : `Everything you need to ${plan.name_en === "Starter" ? "start" : "grow"}`;

          return (
            <div
              key={plan.key}
              className={`relative flex flex-col rounded-3xl transition-all duration-300 ${
                isPopular
                  ? "bg-brand-gradient text-white shadow-[0_20px_60px_-15px_rgba(15,23,42,0.5)] lg:scale-105 z-10"
                  : "bg-background-light dark:bg-background-dark shadow-neu-flat hover:shadow-neu-floating"
              }`}
            >
              {/* Card content */}
              <div className="flex flex-col flex-1 p-7 sm:p-9">

                {/* Icon + plan name */}
                <div className="flex items-center gap-3 mb-8">
                  <div className={`size-11 rounded-xl flex items-center justify-center ${
                    isPopular ? "bg-white/15" : "bg-primary/10"
                  }`}>
                    <span className={isPopular ? "text-white" : "text-primary"}>{getIcon(plan.key)}</span>
                  </div>
                  <h3 className={`text-base font-bold ${isPopular ? "text-white/90" : "text-text-main dark:text-white"}`}>
                    {isAr ? plan.name_ar : plan.name_en}
                  </h3>
                </div>

                {/* Price block */}
                <div className="mb-2">
                  {!isFree && !isCustom && (
                    <p className={`text-xs font-medium mb-1 ${isPopular ? "text-white/50" : "text-text-muted"}`}>
                      {isAr ? "يبدأ من" : "Starting at"}
                    </p>
                  )}
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className={`font-black tracking-tight ${
                      isFree || isCustom ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl"
                    } ${
                      isPopular ? "text-white" : "text-text-main dark:text-white"
                    }`}>
                      {price}
                    </span>
                    {!isFree && !isCustom && (
                      <span className={`text-sm font-medium ${isPopular ? "text-white/50" : "text-text-muted"}`}>
                        {period}
                      </span>
                    )}
                  </div>
                </div>

                {/* Subtitle / period for free & custom */}
                <p className={`text-sm mb-7 ${isPopular ? "text-white/60" : "text-text-muted"}`}>
                  {isFree || isCustom ? period : subtitle}
                </p>

                {/* CTA */}
                <div className="mb-8">
                  {(plan.cta === "try_demo" || plan.cta === "subscribe") && (
                    <button
                      type="button"
                      onClick={() => setDemoOpen(true)}
                      className={`w-full font-bold py-4 rounded-2xl text-sm transition-all duration-200 ${
                        isPopular
                          ? "bg-white text-[#0f172a] hover:bg-white/90 shadow-lg shadow-black/10"
                          : "bg-brand-gradient text-white hover:opacity-90 shadow-neu-primary"
                      }`}
                    >
                      {isFree
                        ? isAr ? "ابدأ مجاناً" : "Start free"
                        : isAr ? "ابدأ الآن" : "Get started"}
                    </button>
                  )}
                  {plan.cta === "contact" && (
                    <a
                      href="/contact"
                      className={`block w-full text-center font-bold py-4 rounded-2xl text-sm transition-all duration-200 ${
                        isPopular
                          ? "bg-white text-[#0f172a] hover:bg-white/90 shadow-lg shadow-black/10"
                          : "border-2 border-text-main/15 text-text-main dark:text-white hover:border-primary/30 hover:bg-primary/5"
                      }`}
                    >
                      {isAr ? "تواصل معنا" : "Contact us"}
                    </a>
                  )}
                </div>

                {/* Divider */}
                <div className={`h-px mb-7 ${isPopular ? "bg-white/10" : "bg-text-muted/10"}`} />

                {/* Features */}
                <ul className="space-y-4 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className={`size-[18px] shrink-0 mt-0.5 ${isPopular ? "text-blue-300" : "text-primary"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      <span className={`text-[13px] leading-relaxed ${
                        isPopular ? "text-white/75" : "text-text-muted"
                      }`}>
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
      <p className="text-center text-sm text-text-muted mt-14 max-w-xl mx-auto leading-relaxed">
        {isAr
          ? "كل الباقات بتشمل: كل الثيمات، الدفع عند الاستلام، بيموب، فوري، بوسطة، ومتجر عربي ١٠٠٪. مفيش عمولة على أوردراتك."
          : "All plans include: all themes, COD, Paymob, Fawry, Bosta, and a fully Arabic storefront. Zero commission on your orders."}
      </p>

      <DemoStartModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  );
};

export default PricingSection;
