import React from "react";
import { useLanguage } from "../contexts/LanguageContext";

/**
 * Feature grid — 6 full-bleed editorial cards, each in a distinct brand-kit color.
 * Content lifted verbatim from the canonical social/exports/features set.
 * Layout: 3×2 on desktop, 2×3 tablet, 1×6 mobile. Flat, no gradients, no icons.
 */

type Surface =
  | "cream-ink"
  | "navy-cream"
  | "saffron-ink"
  | "sage-cream"
  | "terracotta-cream";

interface Feature {
  label_en: string;
  label_ar: string;
  headline_ar: string;
  headline_en: string;
  /** The two words to accent in terracotta — matches the social export aesthetic */
  accent_ar?: string;
  accent_en?: string;
  body_ar: string;
  body_en: string;
  surface: Surface;
}

const features: Feature[] = [
  {
    label_en: "Catalog",
    label_ar: "منتجات",
    headline_ar: "ارفع ١٠٠ منتج في ٥ دقايق.",
    accent_ar: "في ٥ دقايق.",
    headline_en: "100 products live in 5 minutes.",
    accent_en: "in 5 minutes.",
    body_ar:
      "استيراد من إكسل أو من إنستغرام مباشرة. متغيرات اللون والمقاس تلقائي. بدون نسخ ولصق.",
    body_en:
      "Import from Excel or Instagram directly. Color and size variants auto-generated. No copy-paste.",
    surface: "cream-ink",
  },
  {
    label_en: "Payments",
    label_ar: "دفع",
    headline_ar: "كل طرق الدفع في لوحة واحدة.",
    accent_ar: "في لوحة واحدة.",
    headline_en: "Every payment method, one dashboard.",
    accent_en: "one dashboard.",
    body_ar:
      "فوري · فيزا · ماستركارد · فودافون كاش · إنستاباي · كاش عند الاستلام. بدون إعدادات معقدة.",
    body_en:
      "Fawry · Visa · Mastercard · Vodafone Cash · InstaPay · Cash on Delivery. No complex setup.",
    surface: "navy-cream",
  },
  {
    label_en: "Analytics",
    label_ar: "تقارير",
    headline_ar: "اعرف مين بيشتري وامتى وليه.",
    accent_ar: "وامتى وليه.",
    headline_en: "Know who buys, when, and why.",
    accent_en: "when, and why.",
    body_ar:
      "تقارير أسبوعية بتوصل على إيميلك. بدون Google Analytics. بدون صداع.",
    body_en:
      "Weekly reports to your inbox. No Google Analytics. No headaches.",
    surface: "saffron-ink",
  },
  {
    label_en: "Themes",
    label_ar: "ثيمات",
    headline_ar: "+٤٠ تصميم بالعربي.",
    accent_ar: "بالعربي.",
    headline_en: "40+ designs, Arabic-first.",
    accent_en: "Arabic-first.",
    body_ar:
      "ثيمات اتبنت خصيصًا للسوق المصري. RTL من أول يوم. غيّر ثيمك بضغطة زرار.",
    body_en:
      "Themes built specifically for the MENA market. RTL from day one. Switch with one click.",
    surface: "cream-ink",
  },
  {
    label_en: "WhatsApp",
    label_ar: "واتساب",
    headline_ar: "واتساب بزنس مربوط مباشرة.",
    accent_ar: "مربوط مباشرة.",
    headline_en: "WhatsApp Business, wired in.",
    accent_en: "wired in.",
    body_ar:
      "رسايل تلقائية · عربات مهجورة · تتبع شحنات · رسايل ترويجية جماعية. كله من نُمُو.",
    body_en:
      "Auto messages · abandoned carts · shipment tracking · bulk promos. All from numu.",
    surface: "sage-cream",
  },
  {
    label_en: "Mobile App",
    label_ar: "تطبيق",
    headline_ar: "تابع متجرك من أي مكان.",
    accent_ar: "من أي مكان.",
    headline_en: "Run your store from anywhere.",
    accent_en: "from anywhere.",
    body_ar:
      "تطبيق نُمُو على iOS و Android. ردّ على زبون. اشحن طلب. كل ده وانت بره المحل.",
    body_en:
      "numu on iOS and Android. Reply to customers. Ship orders. All while you're out.",
    surface: "terracotta-cream",
  },
];

const surfaceStyles: Record<
  Surface,
  { bg: string; text: string; body: string; label: string; labelBg: string; accent: string }
> = {
  "cream-ink": {
    bg: "bg-cream border border-ink/10",
    text: "text-ink",
    body: "text-ink-soft/85",
    label: "text-ink-soft/60",
    labelBg: "bg-saffron text-ink",
    accent: "text-terracotta",
  },
  "navy-cream": {
    bg: "bg-navy",
    text: "text-cream",
    body: "text-cream/75",
    label: "text-cream/50",
    labelBg: "bg-saffron text-ink",
    accent: "text-terracotta",
  },
  "saffron-ink": {
    bg: "bg-saffron",
    text: "text-ink",
    body: "text-ink/75",
    label: "text-ink/55",
    labelBg: "bg-navy text-cream",
    accent: "text-terracotta",
  },
  "sage-cream": {
    bg: "bg-sage",
    text: "text-cream",
    body: "text-cream/80",
    label: "text-cream/55",
    labelBg: "bg-cream text-sage",
    accent: "text-terracotta",
  },
  "terracotta-cream": {
    bg: "bg-terracotta",
    text: "text-cream",
    body: "text-cream/80",
    label: "text-cream/55",
    labelBg: "bg-cream text-terracotta",
    accent: "text-saffron",
  },
};

const Features: React.FC = () => {
  const { t, language } = useLanguage();
  const isAr = language === "ar";

  const splitAccent = (
    headline: string,
    accent?: string,
  ): [string, string] => {
    if (!accent) return [headline, ""];
    const idx = headline.lastIndexOf(accent);
    if (idx < 0) return [headline, ""];
    return [headline.slice(0, idx), headline.slice(idx)];
  };

  return (
    <div className="max-w-[1360px] mx-auto w-full px-4 sm:px-6 lg:px-10">
      {/* Header */}
      <div className="mb-10 sm:mb-14 text-center">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-terracotta font-semibold">
            § FEATURES
          </span>
          <span className="eyebrow">
            {isAr ? "كل حاجة محتاجها · في مكان واحد" : "EVERYTHING YOU NEED · ONE PLACE"}
          </span>
        </div>
        <h2 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-bold text-ink tracking-tight leading-[1.05] mb-5">
          {t("features.title")}
        </h2>
        <p className="prose-body text-ink/75 max-w-2xl mx-auto">
          {t("features.subtitle")}
        </p>
      </div>

      {/* 3×2 feature grid — each card is a full-bleed brand color */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
        {features.map((feature) => {
          const s = surfaceStyles[feature.surface];
          const headline = isAr ? feature.headline_ar : feature.headline_en;
          const accent = isAr ? feature.accent_ar : feature.accent_en;
          const [head, tail] = splitAccent(headline, accent);
          const body = isAr ? feature.body_ar : feature.body_en;
          const label = isAr ? feature.label_ar : feature.label_en;

          return (
            <article
              key={feature.label_en}
              className={`relative flex flex-col p-7 sm:p-8 rounded-[10px] ${s.bg} min-h-[300px] transition-all duration-200 ease-numu hover:-translate-y-0.5`}
            >
              {/* Top row — FEATURE mono label + colored category pill */}
              <div className="flex items-center justify-between mb-8">
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.18em] font-semibold ${s.label}`}
                >
                  {isAr ? "ميزة" : "FEATURE"}
                </span>
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.18em] font-semibold px-2.5 py-1 rounded-[4px] ${s.labelBg}`}
                >
                  {label}
                </span>
              </div>

              {/* Headline — Reem Kufi bold, last phrase in accent color */}
              <h3
                className={`font-display text-2xl sm:text-[28px] font-bold tracking-tight leading-[1.1] mb-4 ${s.text}`}
              >
                {head}
                {tail && <span className={s.accent}>{tail}</span>}
              </h3>

              {/* Body */}
              <p className={`prose-body-sm ${s.body}`}>
                {body}
              </p>

              {/* Bottom rail — mono numueg.app + subtle N glyph */}
              <div className="mt-auto pt-6 flex items-center justify-between">
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.18em] ${s.label}`}
                >
                  numueg.app
                </span>
                <span
                  aria-hidden="true"
                  className={`font-display font-bold text-sm ${s.label}`}
                >
                  N
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default Features;
