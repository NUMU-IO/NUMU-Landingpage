import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

/**
 * COD-first section — audit §4.2. Reframes Cash-on-Delivery as numu's
 * default instead of a plugin competitors bolt on. The four pillars map
 * to real shipping features: Bosta auto-waybills, Trust Network risk
 * scoring (already shipped as its own section; we cross-reference here),
 * Fawry pre-pay upsell, and governorate-aware shipping rates. Lives
 * between Features and TrustNetwork on Home so it reads as context for
 * the moat section that follows.
 */

const CODFirst: React.FC = () => {
  const { dir, language } = useLanguage();
  const isAr = language === "ar";

  return (
    <div className="max-w-[1360px] mx-auto w-full px-4 sm:px-6 lg:px-10" dir={dir}>
      {/* Header */}
      <div className="text-center mb-10 sm:mb-14">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-terracotta font-semibold">
            § COD-FIRST
          </span>
          <span className="eyebrow">
            {isAr
              ? "الدفع عند الاستلام · مش ميزة إضافية"
              : "CASH ON DELIVERY · NOT A PLUGIN"}
          </span>
        </div>

        <h2 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-bold text-ink tracking-tight leading-[1.05] mb-5">
          {isAr ? (
            <>
              ٩٥% من الأوردرات في مصر
              {" "}
              <span className="text-terracotta">كاش.</span>
              {" "}
              نُمُو اتبنى على الحقيقة دي.
            </>
          ) : (
            <>
              95% of Egyptian orders pay{" "}
              <span className="text-terracotta">on delivery.</span>
              {" "}
              numu was built on that reality.
            </>
          )}
        </h2>
        <p className="prose-body text-ink/75 max-w-2xl mx-auto">
          {isAr
            ? "شوبيفاي وويكومرس بيعاملوا الكاش كإضافة. عندنا، هو الأساس — مع بوالص تلقائية، كشف محتالين، رسوم قابلة للتعديل، وترقية ذكية لدفع مسبق."
            : "Shopify and WooCommerce treat COD as an add-on. At numu it's the default — with automated waybills, fraud detection, configurable fees, and a smart pre-pay upsell."}
        </p>
      </div>

      {/* 4-pillar grid — each pillar cross-references a real feature */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5 mb-10">
        {/* 1. Auto-waybills */}
        <article className="relative bg-paper border border-ink/10 rounded-[10px] shadow-card p-6 sm:p-7 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 ease-numu">
          <span
            aria-hidden="true"
            className="absolute top-0 start-0 w-12 h-[3px] bg-terracotta"
          />
          <div className="flex items-start justify-between mb-4 gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-terracotta font-semibold">
              § 01 · DISPATCH
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-sage/10 border border-sage/30 rounded-[4px] font-mono text-[10px] uppercase tracking-[0.14em] font-semibold text-sage">
              <span aria-hidden="true" className="size-1 rounded-full bg-sage" />
              {isAr ? "نشط" : "Live"}
            </span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink tracking-tight mb-2 leading-tight">
            {isAr
              ? "بوالص بوسطة تلقائية — بدون ورق"
              : "Auto Bosta waybills — zero paperwork"}
          </h3>
          <p className="prose-body-sm text-ink/75 mb-4">
            {isAr
              ? "أوردر جديد؟ البوليصة بتتولّد مباشرة مع الباركود، وتظبيط الحجم، وسعر الشحن بمحافظة الشحن. التاجر بيقبل، مندوب بوسطة بيمرّ يستلم."
              : "New order? The waybill is generated instantly — barcode, dimensions, governorate rate. Merchant confirms, Bosta pickup swings by."}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft/55">
            {isAr ? "وقت توفير: ٣-٥ دقايق / أوردر" : "Saves 3–5 minutes per order"}
          </p>
        </article>

        {/* 2. Trust Network risk scoring (cross-reference) */}
        <article className="relative bg-navy text-cream rounded-[10px] shadow-card p-6 sm:p-7 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 ease-numu">
          <span
            aria-hidden="true"
            className="absolute top-0 start-0 w-12 h-[3px] bg-saffron"
          />
          <div className="flex items-start justify-between mb-4 gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-saffron font-semibold">
              § 02 · FRAUD SHIELD
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-saffron/15 border border-saffron/40 rounded-[4px] font-mono text-[10px] uppercase tracking-[0.14em] font-semibold text-saffron">
              <span aria-hidden="true" className="size-1 rounded-full bg-saffron animate-pulse" />
              {isAr ? "موات نُمُو" : "numu moat"}
            </span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-semibold tracking-tight mb-2 leading-tight">
            {isAr
              ? "Trust Network بيفحص الزبون قبل الشحن"
              : "Trust Network scores the shopper before you ship"}
          </h3>
          <p className="prose-body-sm text-cream/80 mb-4">
            {isAr
              ? "كل زبون كاش بيتفحص سجلّه عبر كل متاجر نُمُو قبل ما البوليصة تتطبع. رفض أوردرات قبل كده؟ بتشوفها. Teleport فجأة بين المدن؟ بنتحذّرك."
              : "Every COD shopper is checked against the cross-merchant network before a waybill prints. Prior refusals? You see them. Sudden teleport between cities? We flag it."}
          </p>
          <Link
            to="/#trust-network"
            className="group inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] font-semibold text-saffron hover:text-cream transition-colors"
          >
            {isAr ? "اقرأ عن الشبكة" : "Read the full section"}
            <span
              aria-hidden="true"
              className="text-base group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform rtl:rotate-180"
            >
              →
            </span>
          </Link>
        </article>

        {/* 3. Pre-pay upsell */}
        <article className="relative bg-paper border border-ink/10 rounded-[10px] shadow-card p-6 sm:p-7 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 ease-numu">
          <span
            aria-hidden="true"
            className="absolute top-0 start-0 w-12 h-[3px] bg-sage"
          />
          <div className="flex items-start justify-between mb-4 gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-sage font-semibold">
              § 03 · RECOVERY
            </span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink tracking-tight mb-2 leading-tight">
            {isAr
              ? "ترقية لدفع مسبق بفوري — ذكية، اختيارية"
              : "Smart Fawry pre-pay upsell — optional, automatic"}
          </h3>
          <p className="prose-body-sm text-ink/75 mb-4">
            {isAr
              ? "لو زبون عنده ريسك عالي من Trust Network، نُمُو بيقترح عليه يدفع عن طريق فوري قبل الشحن. بدل ما ترفض الأوردر، بتحوّله لأوردر مضمون."
              : "If Trust Network flags a shopper as high risk, numu can automatically offer Fawry pre-pay before dispatch. Convert a refused order into a paid one instead of blocking it."}
          </p>
          <div className="flex items-center gap-2 text-[13px]">
            <span className="px-2 py-0.5 bg-terracotta/10 border border-terracotta/30 rounded-[4px] font-mono text-[10px] uppercase tracking-[0.14em] text-terracotta font-semibold">
              {isAr ? "قبل" : "Before"}
            </span>
            <span className="text-ink-soft/70 line-through">
              {isAr ? "بلوك" : "Block"}
            </span>
            <span aria-hidden="true" className="text-ink-soft/40 rtl:rotate-180">→</span>
            <span className="px-2 py-0.5 bg-sage/10 border border-sage/30 rounded-[4px] font-mono text-[10px] uppercase tracking-[0.14em] text-sage font-semibold">
              {isAr ? "بعد" : "After"}
            </span>
            <span className="text-ink font-semibold">
              {isAr ? "ادفع على فوري أولاً" : "Pay via Fawry first"}
            </span>
          </div>
        </article>

        {/* 4. Governorate rates */}
        <article className="relative bg-paper border border-ink/10 rounded-[10px] shadow-card p-6 sm:p-7 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 ease-numu">
          <span
            aria-hidden="true"
            className="absolute top-0 start-0 w-12 h-[3px] bg-navy"
          />
          <div className="flex items-start justify-between mb-4 gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-navy font-semibold">
              § 04 · RATES
            </span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink tracking-tight mb-2 leading-tight">
            {isAr
              ? "أسعار شحن بمحافظة، مش zone مجنّنك"
              : "Governorate-aware rates — not generic zones"}
          </h3>
          <p className="prose-body-sm text-ink/75 mb-4">
            {isAr
              ? "القاهرة، الإسكندرية، والمنصورة مش كلها بسعر واحد. نُمُو بيطبّق السعر الصح بالمحافظة تلقائي وبيظهره للزبون قبل الدفع — بدون جداول Excel."
              : "Cairo, Alexandria, and Mansoura aren't one rate. numu applies the correct governorate fee automatically and shows it to the shopper before checkout — no spreadsheet math."}
          </p>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { gov_en: "Cairo", gov_ar: "القاهرة", fee: 60 },
              { gov_en: "Alex", gov_ar: "الإسكندرية", fee: 75 },
              { gov_en: "Aswan", gov_ar: "أسوان", fee: 120 },
            ].map((row) => (
              <div
                key={row.gov_en}
                className="bg-cream border border-ink/10 rounded-[4px] p-2"
              >
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-soft/60">
                  {isAr ? row.gov_ar : row.gov_en}
                </p>
                <p className="font-display text-sm font-bold text-navy tabular-nums">
                  {isAr ? `${row.fee} ج.م` : `${row.fee} EGP`}
                </p>
              </div>
            ))}
          </div>
        </article>
      </div>

      {/* Comparison callout — how competitors treat COD */}
      <div className="bg-paper border border-ink/10 rounded-[10px] shadow-card overflow-hidden">
        <div className="px-5 sm:px-7 py-4 border-b border-bone">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft/60 font-semibold">
            § {isAr ? "المقارنة" : "SIDE-BY-SIDE"}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x rtl:sm:divide-x-reverse divide-bone">
          {[
            {
              vendor: "Shopify",
              stance_en: "COD is a paid 3rd-party app. Rate config, risk flags, and Fawry upsell need separate plugins.",
              stance_ar: "الكاش بأبلكيشن تاني مدفوع. ضبط الأسعار وكشف الاحتيال وفوري — كلها إضافات منفصلة.",
              accent: "text-ink-soft/70",
            },
            {
              vendor: "WooCommerce",
              stance_en: "Ships with basic COD toggle. No local fraud data, no Egypt-specific rate tables, no carrier API.",
              stance_ar: "بيجي بـ COD toggle أساسي. بدون داتا محليّة للاحتيال، بدون جداول أسعار مصرية، بدون API شركات الشحن.",
              accent: "text-ink-soft/70",
            },
            {
              vendor: "numu",
              stance_en: "COD is the default order type. Bosta, Trust Network, Fawry pre-pay, and governorate rates are wired in on day one.",
              stance_ar: "الكاش نوع الأوردر الأساسي. بوسطة، Trust Network، فوري، وأسعار المحافظات مربوطين من أول يوم.",
              accent: "text-terracotta",
            },
          ].map((v) => (
            <div key={v.vendor} className="p-5 sm:p-6">
              <p
                className={`font-display text-lg font-bold tracking-tight mb-2 ${v.accent}`}
              >
                {v.vendor}
              </p>
              <p className="prose-body-sm text-ink/75">
                {isAr ? v.stance_ar : v.stance_en}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CODFirst;
