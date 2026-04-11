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
    <div className="max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-black text-text-main dark:text-white mb-4">
          {isAr ? "باقات بسيطة وشفافة" : "Simple, Transparent Pricing"}
        </h2>
        <p className="text-text-muted max-w-lg mx-auto">
          {isAr
            ? "مفيش رسوم مخفية. مفيش عمولة على الأوردرات. أنت تاخد ١٠٠٪ من إيراداتك."
            : "No hidden fees. No per-order commissions. You keep 100% of your revenue."}
        </p>

        {promo && (
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold">
            <span className="material-symbols-outlined text-base">local_offer</span>
            {isAr ? promo.text_ar : promo.text_en}
          </div>
        )}

        {/* Annual toggle */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <span className={`text-sm ${!annual ? "text-text-main dark:text-white font-bold" : "text-text-muted"}`}>
            {isAr ? "شهري" : "Monthly"}
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-12 h-6 rounded-full transition-colors ${annual ? "bg-primary" : "bg-gray-600"}`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                annual ? "translate-x-6 rtl:-translate-x-6" : "translate-x-0.5 rtl:-translate-x-0.5"
              }`}
            />
          </button>
          <span className={`text-sm ${annual ? "text-text-main dark:text-white font-bold" : "text-text-muted"}`}>
            {isAr ? "سنوي (وفر ١٧٪)" : "Annual (save 17%)"}
          </span>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const price =
            plan.price_monthly === -1
              ? isAr ? "حسب الطلب" : "Custom"
              : plan.price_monthly === 0
                ? isAr ? "مجاناً" : "Free"
                : annual && plan.price_annual > 0
                  ? plan.price_annual.toLocaleString()
                  : plan.price_monthly.toLocaleString();

          const period =
            plan.price_monthly <= 0 || plan.price_monthly === -1
              ? plan.price_monthly === 0
                ? isAr ? "بدون بطاقة ائتمان" : "No credit card required"
                : ""
              : annual
                ? isAr ? "جنيه/سنة" : "EGP/year"
                : isAr ? "جنيه/شهر" : "EGP/month";

          return (
            <div
              key={plan.key}
              className={`rounded-2xl border p-6 flex flex-col ${
                plan.popular
                  ? "border-primary bg-primary/5 dark:bg-primary/10 ring-2 ring-primary/30"
                  : "border-white/10 bg-white/5 dark:bg-white/5"
              }`}
            >
              {plan.popular && (
                <span className="inline-block text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full mb-4 self-start">
                  {isAr ? "الأكثر شيوعاً" : "Most Popular"}
                </span>
              )}

              <h3 className="text-lg font-bold text-text-main dark:text-white">
                {isAr ? plan.name_ar : plan.name_en}
              </h3>

              <div className="mt-3 mb-1">
                <span className="text-3xl font-black text-text-main dark:text-white">{price}</span>
                {period && <span className="text-sm text-text-muted ms-1">{period}</span>}
              </div>

              <ul className="mt-4 space-y-2.5 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-muted">
                    <span className="material-symbols-outlined text-primary text-base mt-0.5">check_circle</span>
                    {isAr ? f.ar : f.en}
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                {(plan.cta === "try_demo" || plan.cta === "subscribe") && (
                  <button
                    onClick={() => setDemoOpen(true)}
                    className={`w-full font-bold py-3 rounded-xl text-sm transition-opacity ${
                      plan.popular || plan.cta === "try_demo"
                        ? "bg-brand-gradient text-white hover:opacity-90"
                        : "border border-white/20 text-text-main dark:text-white hover:bg-white/10"
                    }`}
                  >
                    {plan.cta === "try_demo"
                      ? isAr ? "ابدأ تجربتك المجانية" : "Start free trial"
                      : isAr ? "جرب أولاً ثم اشترك" : "Try first, then subscribe"}
                  </button>
                )}
                {plan.cta === "contact" && (
                  <a
                    href="/contact"
                    className="block w-full text-center font-bold py-3 rounded-xl text-sm border border-white/20 text-text-main dark:text-white hover:bg-white/10 transition-colors"
                  >
                    {isAr ? "تواصل معنا" : "Contact us"}
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom note */}
      <p className="text-center text-sm text-text-muted mt-10 max-w-lg mx-auto">
        {isAr
          ? "كل الباقات بتشمل: كل الثيمات، الدفع عند الاستلام، بيموب، فوري، بوسطة، ومتجر عربي ١٠٠٪. مفيش عمولة على أوردراتك."
          : "All plans include: all themes, COD, Paymob, Fawry, Bosta, and a fully Arabic storefront. Zero commission on your orders."}
      </p>

      <DemoStartModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  );
};

export default PricingSection;
