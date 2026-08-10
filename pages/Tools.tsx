import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useSEO } from "../hooks/useSEO";
import { DEFAULT_TRIAL_DAYS, toArabicDigits } from "../lib/trialInfo";

/**
 * Free tools hub — audit §2.6. This is the highest-leverage SEO moat
 * no MENA competitor has built. Each tool targets a high-intent Arabic
 * long-tail keyword ("مولد اسم متجر", "حاسبة هامش الربح", "مولد فاتورة
 * إلكترونية") and funnels visitors into a store signup.
 */

type Status = "live" | "coming_soon";

interface Tool {
  slug: string;
  title_en: string;
  title_ar: string;
  desc_en: string;
  desc_ar: string;
  accent: "navy" | "terracotta" | "sage" | "saffron";
  status: Status;
  icon: React.ReactNode;
}

const tools: Tool[] = [
  {
    slug: "store-names",
    title_en: "Arabic store name generator",
    title_ar: "مولّد أسماء متاجر",
    desc_en:
      "Pick an industry and mood, get 20 brand-ready Arabic store names in seconds. Free, unlimited.",
    desc_ar:
      "اختار الصناعة والطابع، احصل على ٢٠ اسم متجر عربي جاهز للبراند في ثواني. مجاني، بدون حد.",
    accent: "terracotta",
    status: "live",
    icon: (
      <path d="M4 7h16M4 12h10M4 17h16" />
    ),
  },
  {
    slug: "profit-margin",
    title_en: "Profit margin calculator",
    title_ar: "حاسبة هامش الربح",
    desc_en:
      "Enter your cost and sale price, see margin %, markup %, and EGP profit instantly. COD-aware.",
    desc_ar:
      "اكتب التكلفة وسعر البيع، شوف هامش الربح، نسبة المارك-أب، والربح بالجنيه فوراً. بيحسب الدفع عند الاستلام.",
    accent: "navy",
    status: "live",
    icon: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M8 10h8M8 14h5" />
        <circle cx="16" cy="15" r="1" fill="currentColor" />
      </>
    ),
  },
  {
    slug: "invoice",
    title_en: "Egyptian invoice generator",
    title_ar: "مولّد فاتورة مصرية",
    desc_en:
      "Generate an ETA-format invoice — VAT, totals in EGP words, print or save as PDF. No signup.",
    desc_ar:
      "اعمل فاتورة بصيغة ETA — ضريبة القيمة المضافة، إجمالي بالحروف، اطبع أو احفظ PDF. بدون تسجيل.",
    accent: "sage",
    status: "live",
    icon: (
      <>
        <path d="M7 4h7l4 4v12H7z" />
        <path d="M14 4v4h4" />
        <path d="M10 13h5M10 16h5" />
      </>
    ),
  },
  {
    // Live-samples gallery now ships as the public face; the interactive
    // generator stays inside the merchant hub until the public endpoint
    // lands. Audit matrix row "AI product-description samples (live)"
    // flips to ✅.
    slug: "ai-description",
    title_en: "AI product description · samples",
    title_ar: "أمثلة · وصف منتج بالذكاء الاصطناعي",
    desc_en:
      "See real Arabic + English product descriptions written by numu AI — perfume, fashion, food, and more.",
    desc_ar:
      "شوف أوصاف منتجات عربية وإنجليزية حقيقية من نُمُو AI — عطور، أزياء، طعام، وأكتر.",
    accent: "saffron",
    status: "live",
    icon: (
      <>
        <path d="M12 3l2.4 5.6L20 11l-5.6 2.4L12 19l-2.4-5.6L4 11l5.6-2.4z" />
      </>
    ),
  },
  {
    slug: "vat",
    title_en: "VAT calculator (Egypt 14%)",
    title_ar: "حاسبة ضريبة القيمة المضافة",
    desc_en:
      "Add 14% VAT to a price, or pull the VAT out of a VAT-inclusive one. Saudi 15% and custom rates too.",
    desc_ar:
      "أضف ضريبة ١٤٪ على السعر، أو استخرجها من سعر شامل الضريبة. وكمان ١٥٪ للسعودية ونسبة مخصصة.",
    accent: "navy",
    status: "live",
    icon: (
      <>
        <path d="M8 16L16 8" />
        <circle cx="9" cy="9" r="1.6" />
        <circle cx="15" cy="15" r="1.6" />
      </>
    ),
  },
  {
    slug: "cod",
    title_en: "COD & RTO cost calculator",
    title_ar: "حاسبة تكلفة الدفع عند الاستلام",
    desc_en:
      "What a delivered order really costs once refused ones are counted — plus the RTO rate where you start losing money.",
    desc_ar:
      "تكلفة الأوردر المتسلّم فعلاً بعد حساب المرتجعات — ونسبة المرتجعات اللي بتبدأ تخسر عندها.",
    accent: "terracotta",
    status: "live",
    icon: (
      <>
        <path d="M3 7h11v8H3z" />
        <path d="M14 10h4l3 3v2h-7z" />
        <circle cx="7" cy="17" r="1.6" />
        <circle cx="17" cy="17" r="1.6" />
      </>
    ),
  },
];

const accentBar: Record<string, string> = {
  navy: "bg-navy",
  terracotta: "bg-terracotta",
  sage: "bg-sage",
  saffron: "bg-saffron",
};
const accentText: Record<string, string> = {
  navy: "text-navy",
  terracotta: "text-terracotta",
  sage: "text-sage",
  saffron: "text-saffron",
};
const accentBg: Record<string, string> = {
  navy: "bg-navy/10 border-navy/30",
  terracotta: "bg-terracotta/10 border-terracotta/30",
  sage: "bg-sage/10 border-sage/30",
  saffron: "bg-saffron/10 border-saffron/30",
};

const Tools: React.FC = () => {
  const { dir, language } = useLanguage();
  const isAr = language === "ar";

  useSEO({
    title: isAr
      ? "أدوات مجانية للتجار — نُمُو"
      : "Free merchant tools — numu",
    description: isAr
      ? "أدوات مجانية لكل تاجر مصري — مولّد أسماء، حاسبة هامش ربح، مولّد فاتورة إلكترونية، ومولّد وصف منتجات بالذكاء الاصطناعي."
      : "Free tools for every Egyptian merchant — Arabic store name generator, profit margin calculator, ETA invoice generator, and AI product description writer.",
    canonical: "https://numueg.app/tools",
  });

  return (
    <div className="min-h-screen bg-cream paper-grain" dir={dir}>
      <nav className="flex items-center justify-between px-4 sm:px-8 lg:px-12 py-5 border-b border-ink/10 bg-cream/80 backdrop-blur-sm sticky top-0 z-10">
        <Link
          to="/"
          className="flex items-center gap-2.5"
          aria-label={isAr ? "نُمُو — الرئيسية" : "numu — home"}
        >
          <img
            src="/numu-mark-cream.webp"
            alt=""
            className="h-8 w-auto object-contain"
            width="40"
            height="40"
          />
          {isAr ? (
            <span className="font-display text-xl font-bold tracking-tight text-ink">
              نُمُو
            </span>
          ) : (
            <span className="font-display text-lg font-semibold tracking-tight text-ink lowercase">
              numu
            </span>
          )}
        </Link>
        <Link
          to="/"
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft/80 hover:text-navy transition-colors"
        >
          ← {isAr ? "الرئيسية" : "Home"}
        </Link>
      </nav>

      <div className="relative z-10 text-center px-4 sm:px-6 pt-12 sm:pt-16 pb-10">
        <div className="inline-flex items-center gap-2 bg-saffron/15 border border-saffron/40 rounded-[4px] px-3 py-1 mb-5">
          <span className="size-1.5 rounded-full bg-saffron" aria-hidden="true" />
          <span className="font-mono text-[10px] font-semibold text-saffron uppercase tracking-[0.18em]">
            § FREE TOOLS · NO SIGNUP
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-bold text-ink tracking-tight leading-[1.05] mb-5">
          {isAr ? (
            <>
              أدوات مجانية
              {" "}
              <span className="text-terracotta">لكل تاجر.</span>
            </>
          ) : (
            <>
              Free tools for{" "}
              <span className="text-terracotta">every merchant.</span>
            </>
          )}
        </h1>
        <p className="prose-body text-ink/75 max-w-2xl mx-auto">
          {isAr
            ? "استخدمهم بدون حساب، بدون حد استخدام. بنوفّرهم عشان لما تكبر تحب تيجي عند نُمُو."
            : "No account, no rate limits, no catch. We ship them free so when you outgrow them, you come back to numu."}
        </p>
      </div>

      <div className="relative z-10 max-w-[1100px] mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {tools.map((tool) => {
            const isLive = tool.status === "live";
            const CardTag = isLive ? Link : "div";
            const cardProps = isLive
              ? { to: `/tools/${tool.slug}` }
              : { "aria-disabled": true };
            return (
              <CardTag
                key={tool.slug}
                {...(cardProps as Record<string, unknown>)}
                className={`group relative flex flex-col p-6 sm:p-7 bg-paper border border-ink/10 rounded-[10px] shadow-card transition-all duration-200 ease-numu ${
                  isLive
                    ? "hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                    : "opacity-70 cursor-not-allowed"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute top-0 start-0 w-12 h-[3px] ${accentBar[tool.accent]}`}
                />
                <div className="flex items-start justify-between mb-4 gap-3">
                  <span
                    aria-hidden="true"
                    className={`inline-flex items-center justify-center size-11 rounded-[8px] border ${accentBg[tool.accent]}`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`size-5 ${accentText[tool.accent]}`}
                    >
                      {tool.icon}
                    </svg>
                  </span>
                  {isLive ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-sage/10 border border-sage/30 rounded-[4px] font-mono text-[10px] uppercase tracking-[0.14em] font-semibold text-sage">
                      <span
                        aria-hidden="true"
                        className="size-1 rounded-full bg-sage animate-pulse"
                      />
                      {isAr ? "جاهز" : "Ready"}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-saffron/10 border border-saffron/30 rounded-[4px] font-mono text-[10px] uppercase tracking-[0.14em] font-semibold text-saffron">
                      <span aria-hidden="true" className="size-1 rounded-full bg-saffron" />
                      {isAr ? "جاي قريب" : "Coming soon"}
                    </span>
                  )}
                </div>
                <h2 className="font-display text-xl sm:text-2xl font-semibold text-ink tracking-tight mb-2 leading-tight">
                  {isAr ? tool.title_ar : tool.title_en}
                </h2>
                <p className="prose-body-sm text-ink/75 mb-5">
                  {isAr ? tool.desc_ar : tool.desc_en}
                </p>
                {isLive && (
                  <span
                    className={`mt-auto inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] font-semibold ${accentText[tool.accent]}`}
                  >
                    {isAr ? "جرّب الأداة" : "Open tool"}
                    <span
                      aria-hidden="true"
                      className="text-base group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform rtl:rotate-180"
                    >
                      →
                    </span>
                  </span>
                )}
              </CardTag>
            );
          })}
        </div>

        <div className="mt-16 bg-navy rounded-[14px] p-8 sm:p-10 text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-saffron font-semibold">
            § OUTGROWING THESE?
          </span>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl font-bold text-cream tracking-tight leading-tight mb-3">
            {isAr
              ? "لما تحتاج أكتر من أدوات مفردة."
              : "When you need more than a single tool."}
          </h2>
          <p className="prose-body text-cream/75 max-w-xl mx-auto mb-6">
            {isAr
              ? `نُمُو بيجمع كل حاجة — متجر، دفع، شحن، فواتير، AI — في لوحة واحدة. ابدأ مجاناً ${toArabicDigits(String(DEFAULT_TRIAL_DAYS))} يوم.`
              : "numu bundles every tool — storefront, payments, shipping, invoices, AI — into one dashboard. Free for 30 days."}
          </p>
          <Link
            to="/?demo=1"
            className="group inline-flex items-center justify-center gap-2 bg-cream text-navy font-semibold py-3 px-6 rounded-[4px] hover:bg-cream/90 active:scale-[0.985] transition-all duration-200 ease-numu"
          >
            <span>{isAr ? "جرّب نُمُو مجاناً" : "Try numu free"}</span>
            <span
              aria-hidden="true"
              className="text-lg text-terracotta group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform rtl:rotate-180"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Tools;
