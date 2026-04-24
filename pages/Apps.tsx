import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useSEO } from "../hooks/useSEO";

type Status = "live" | "coming_soon" | "planned";

interface App {
  name: string;
  desc_en: string;
  desc_ar: string;
  category:
    | "payments"
    | "shipping"
    | "messaging"
    | "marketing"
    | "accounting"
    | "analytics";
  status: Status;
}

/**
 * App Store directory — one page listing every third-party integration
 * numu ships or plans to ship. Audit §2.5: visitors comparing against
 * Shopify (21k apps) / Salla (550 apps) scan for ecosystem depth. Showing
 * the full roadmap — live, coming soon, planned — signals "serious SaaS"
 * even before the numbers are there.
 */

const apps: App[] = [
  // Payments
  {
    name: "Paymob",
    desc_en: "Cards, Apple Pay, wallets — Egypt's default gateway.",
    desc_ar: "كروت، آبل باي، والمحافظ — بوابة مصر الأولى.",
    category: "payments",
    status: "live",
  },
  {
    name: "Fawry",
    desc_en: "Pay at any of 225,000+ cash collection points.",
    desc_ar: "ادفع من أكتر من ٢٢٥,٠٠٠ نقطة تحصيل في مصر.",
    category: "payments",
    status: "live",
  },
  {
    name: "Kashier",
    desc_en: "Unified gateway — cards, wallets, installments.",
    desc_ar: "بوابة موحّدة — كروت، محافظ، تقسيط.",
    category: "payments",
    status: "live",
  },
  {
    name: "Vodafone Cash",
    desc_en: "Mobile wallet — Egypt's largest wallet network.",
    desc_ar: "محفظة موبايل — أكبر شبكة محافظ في مصر.",
    category: "payments",
    status: "coming_soon",
  },
  {
    name: "InstaPay",
    desc_en: "Instant bank-to-bank transfers. Powered by CBE.",
    desc_ar: "تحويل فوري بين البنوك. من البنك المركزي.",
    category: "payments",
    status: "coming_soon",
  },
  {
    name: "Stripe",
    desc_en: "Global card processing for MENA merchants selling abroad.",
    desc_ar: "دفع كروت دولي للتجار اللي بيبيعوا خارج المنطقة.",
    category: "payments",
    status: "planned",
  },

  // Shipping
  {
    name: "Bosta",
    desc_en: "Automated waybills + governorate-based shipping rates.",
    desc_ar: "بوالص تلقائية وأسعار شحن بالمحافظة.",
    category: "shipping",
    status: "live",
  },
  {
    name: "Aramex",
    desc_en: "International shipping across MENA and beyond.",
    desc_ar: "شحن دولي عبر الشرق الأوسط والعالم.",
    category: "shipping",
    status: "live",
  },
  {
    name: "ShipBlu",
    desc_en: "Same-day delivery in Cairo and Alexandria.",
    desc_ar: "توصيل في نفس اليوم في القاهرة والإسكندرية.",
    category: "shipping",
    status: "coming_soon",
  },
  {
    name: "Khazenly",
    desc_en: "Fulfillment + warehousing partner for mid-size stores.",
    desc_ar: "شريك تخزين وتنفيذ أوردرات للمتاجر المتوسطة.",
    category: "shipping",
    status: "coming_soon",
  },
  {
    name: "Mylerz",
    desc_en: "Express last-mile delivery across Egypt.",
    desc_ar: "توصيل سريع لآخر ميل عبر مصر.",
    category: "shipping",
    status: "planned",
  },
  {
    name: "J&T Express",
    desc_en: "Regional courier with strong Delta + Upper Egypt coverage.",
    desc_ar: "شحن إقليمي بتغطية قوية في الدلتا والصعيد.",
    category: "shipping",
    status: "planned",
  },

  // Messaging
  {
    name: "WhatsApp Business",
    desc_en: "Send order updates, confirmations, and support messages.",
    desc_ar: "بعت تحديثات الأوردرات، التأكيدات، ورسايل الدعم.",
    category: "messaging",
    status: "live",
  },
  {
    name: "WhatsApp Cloud API",
    desc_en: "Direct Cloud API integration — verified business profile.",
    desc_ar: "تكامل Cloud API مباشر — بروفايل موثّق.",
    category: "messaging",
    status: "coming_soon",
  },

  // Marketing
  {
    name: "Meta Catalog",
    desc_en: "Sync products to Instagram Shopping + Facebook Shop.",
    desc_ar: "مزامنة المنتجات مع إنستغرام شوبنج وفيسبوك شوب.",
    category: "marketing",
    status: "coming_soon",
  },
  {
    name: "Google Merchant Center",
    desc_en: "List products on Google Shopping across MENA.",
    desc_ar: "اعرض منتجاتك على جوجل شوبنج في المنطقة.",
    category: "marketing",
    status: "coming_soon",
  },
  {
    name: "TikTok Shop",
    desc_en: "Sell directly inside TikTok videos and Live streams.",
    desc_ar: "بيع مباشرة من فيديوهات تيك توك والبثوث المباشرة.",
    category: "marketing",
    status: "planned",
  },
  {
    name: "Klaviyo",
    desc_en: "Email + SMS automation with Arabic templates.",
    desc_ar: "أتمتة إيميل و SMS بقوالب عربية.",
    category: "marketing",
    status: "planned",
  },

  // Accounting
  {
    name: "ETA e-Invoice",
    desc_en: "Auto-generated ETA-compliant invoices for every order.",
    desc_ar: "فاتورة إلكترونية متوافقة مع مصلحة الضرائب تلقائي.",
    category: "accounting",
    status: "live",
  },
  {
    name: "Zoho Books",
    desc_en: "Sync orders, invoices, and customers to Zoho.",
    desc_ar: "مزامنة الأوردرات، الفواتير، والعملاء مع زوهو.",
    category: "accounting",
    status: "planned",
  },
  {
    name: "QuickBooks MENA",
    desc_en: "Arabic-localized QuickBooks sync for larger stores.",
    desc_ar: "مزامنة QuickBooks معرّبة للمتاجر الأكبر.",
    category: "accounting",
    status: "planned",
  },

  // Analytics
  {
    name: "Google Analytics 4",
    desc_en: "Out-of-the-box GA4 events for every storefront action.",
    desc_ar: "أحداث GA4 جاهزة لكل حركة في المتجر.",
    category: "analytics",
    status: "coming_soon",
  },
  {
    name: "Meta Pixel + CAPI",
    desc_en: "Server-side conversions API for iOS 14+ accuracy.",
    desc_ar: "Conversions API من الخادم لدقة أعلى بعد iOS 14.",
    category: "analytics",
    status: "coming_soon",
  },
];

const categoryLabels: Record<
  App["category"],
  { en: string; ar: string; accent: "navy" | "terracotta" | "sage" | "saffron" }
> = {
  payments: { en: "Payments", ar: "الدفع", accent: "navy" },
  shipping: { en: "Shipping", ar: "الشحن", accent: "terracotta" },
  messaging: { en: "Messaging", ar: "التواصل", accent: "sage" },
  marketing: { en: "Marketing", ar: "التسويق", accent: "saffron" },
  accounting: { en: "Accounting", ar: "المحاسبة", accent: "navy" },
  analytics: { en: "Analytics", ar: "التحليلات", accent: "terracotta" },
};

const statusMeta: Record<
  Status,
  { en: string; ar: string; dot: string; text: string; bg: string; border: string }
> = {
  live: {
    en: "Live",
    ar: "نشط",
    dot: "bg-sage",
    text: "text-sage",
    bg: "bg-sage/10",
    border: "border-sage/30",
  },
  coming_soon: {
    en: "Coming soon",
    ar: "جاي قريب",
    dot: "bg-saffron",
    text: "text-saffron",
    bg: "bg-saffron/10",
    border: "border-saffron/30",
  },
  planned: {
    en: "Planned",
    ar: "مخطط",
    dot: "bg-ink-soft/50",
    text: "text-ink-soft/70",
    bg: "bg-cream",
    border: "border-ink/10",
  },
};

const accentBar: Record<string, string> = {
  navy: "bg-navy",
  terracotta: "bg-terracotta",
  sage: "bg-sage",
  saffron: "bg-saffron",
};

const Apps: React.FC = () => {
  const { dir, language } = useLanguage();
  const isAr = language === "ar";

  useSEO({
    title: isAr
      ? "متجر تطبيقات نُمُو — التكاملات والشركاء"
      : "numu App Store — integrations and partners",
    description: isAr
      ? "كل التكاملات اللي بيحتاجها تاجر مصري — بيموب، فوري، بوسطة، أراميكس، واتساب، فاتورة إلكترونية، و٢٠+ تكامل قادم في ٢٠٢٦."
      : "Every integration a MENA merchant needs — Paymob, Fawry, Bosta, Aramex, WhatsApp, ETA e-invoicing, and 20+ more coming in 2026.",
    canonical: "https://numueg.app/apps",
  });

  const liveCount = apps.filter((a) => a.status === "live").length;
  const comingCount = apps.filter((a) => a.status === "coming_soon").length;
  const plannedCount = apps.filter((a) => a.status === "planned").length;

  const categoryOrder: App["category"][] = [
    "payments",
    "shipping",
    "messaging",
    "marketing",
    "accounting",
    "analytics",
  ];

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
        <div className="inline-flex items-center gap-2 bg-terracotta/10 border border-terracotta/30 rounded-[4px] px-3 py-1 mb-5">
          <span
            className="size-1.5 rounded-full bg-terracotta"
            aria-hidden="true"
          />
          <span className="font-mono text-[10px] font-semibold text-terracotta uppercase tracking-[0.18em]">
            § APP STORE
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-bold text-ink tracking-tight leading-[1.05] mb-5">
          {isAr ? (
            <>
              كل أدواتك في
              {" "}
              <span className="text-terracotta">مكان واحد.</span>
            </>
          ) : (
            <>
              Every tool you need,
              {" "}
              <span className="text-terracotta">one place.</span>
            </>
          )}
        </h1>
        <p className="prose-body text-ink/75 max-w-2xl mx-auto">
          {isAr
            ? "نُمُو متصل مباشرة بكل حاجة تاجر مصري محتاجها — دفع، شحن، واتساب، تسويق، محاسبة، وتحليلات. بدون أكواد، بدون رسوم إضافية."
            : "numu ships with direct integrations to every platform an Egyptian merchant needs — payments, shipping, WhatsApp, marketing, accounting, analytics. No code, no extra fees."}
        </p>

        {/* Scale strip */}
        <div className="mt-7 inline-flex items-center gap-4 px-5 py-2.5 bg-paper border border-ink/10 rounded-[4px]">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-bold text-sage tabular-nums">
              {liveCount}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] font-semibold text-sage">
              {isAr ? "نشط" : "Live"}
            </span>
          </div>
          <span className="w-px h-4 bg-bone" aria-hidden="true" />
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-bold text-saffron tabular-nums">
              {comingCount}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] font-semibold text-saffron">
              {isAr ? "جاي قريب" : "Coming soon"}
            </span>
          </div>
          <span className="w-px h-4 bg-bone" aria-hidden="true" />
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-bold text-ink-soft/70 tabular-nums">
              {plannedCount}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] font-semibold text-ink-soft/70">
              {isAr ? "مخطط" : "Planned"}
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 pb-16 sm:pb-24">
        {categoryOrder.map((cat) => {
          const catApps = apps.filter((a) => a.category === cat);
          if (!catApps.length) return null;
          const meta = categoryLabels[cat];
          return (
            <section key={cat} className="mb-12 last:mb-0">
              <div className="flex items-center gap-3 mb-6">
                <span
                  aria-hidden="true"
                  className={`w-10 h-[3px] ${accentBar[meta.accent]}`}
                />
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                  {isAr ? meta.ar : meta.en}
                </h2>
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft/55">
                  {catApps.length}{" "}
                  {isAr
                    ? catApps.length === 1
                      ? "تطبيق"
                      : "تطبيقات"
                    : catApps.length === 1
                      ? "app"
                      : "apps"}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {catApps.map((app) => {
                  const s = statusMeta[app.status];
                  return (
                    <article
                      key={app.name}
                      className="flex flex-col p-5 sm:p-6 bg-paper border border-ink/10 rounded-[10px] shadow-card hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 ease-numu"
                    >
                      <div className="flex items-start justify-between mb-4 gap-3">
                        <h3 className="font-display text-base sm:text-lg font-semibold text-ink tracking-tight leading-tight">
                          {app.name}
                        </h3>
                        <span
                          className={`shrink-0 inline-flex items-center gap-1.5 px-2 py-0.5 ${s.bg} border ${s.border} rounded-[4px] font-mono text-[10px] uppercase tracking-[0.14em] font-semibold ${s.text}`}
                        >
                          <span
                            aria-hidden="true"
                            className={`size-1 rounded-full ${s.dot} ${app.status === "live" ? "animate-pulse" : ""}`}
                          />
                          {isAr ? s.ar : s.en}
                        </span>
                      </div>
                      <p className="prose-body-sm text-ink/75">
                        {isAr ? app.desc_ar : app.desc_en}
                      </p>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* Bottom CTA — pushes to developers page for custom integrations */}
        <div className="mt-16 bg-navy rounded-[14px] p-8 sm:p-10 text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-saffron font-semibold">
            § BUILDING SOMETHING CUSTOM?
          </span>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl font-bold text-cream tracking-tight leading-tight mb-3">
            {isAr
              ? "ماشفتش التكامل اللي محتاجه؟"
              : "Can't find the integration you need?"}
          </h2>
          <p className="prose-body text-cream/75 max-w-xl mx-auto mb-6">
            {isAr
              ? "الـ REST API بتاعنا موثّقة بالكامل. ابنِ التكامل اللي يناسبك، أو كلمنا نبنيه معاك."
              : "Our REST API is fully documented. Build the integration you need, or talk to us and we'll build it with you."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/developers"
              className="group inline-flex items-center justify-center gap-2 bg-cream text-navy font-semibold py-3 px-6 rounded-[4px] hover:bg-cream/90 active:scale-[0.985] transition-all duration-200 ease-numu"
            >
              <span>{isAr ? "وثائق المطورين" : "Developer docs"}</span>
              <span
                aria-hidden="true"
                className="text-lg text-terracotta group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform rtl:rotate-180"
              >
                →
              </span>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 border border-cream/30 text-cream font-semibold py-3 px-6 rounded-[4px] hover:bg-cream/10 transition-all duration-200 ease-numu"
            >
              {isAr ? "تواصل معانا" : "Talk to us"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Apps;
