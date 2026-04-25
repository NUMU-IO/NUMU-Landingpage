import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useSEO } from "../hooks/useSEO";
import ThemePreview, { ThemeSpec } from "../components/ThemePreview";

/**
 * Ready-made stores / theme gallery — audit §2.4 + matrix row "Theme /
 * template store". Each card renders a live inline mockup of an
 * industry-specific storefront; the CTA funnels into the existing demo
 * flow with a theme-slug hint so backend can seed the right layout.
 * No external asset dependencies — pure SVG + CSS mockups.
 */

type Category =
  | "all"
  | "perfume"
  | "fashion"
  | "beauty"
  | "food"
  | "electronics"
  | "jewelry";

const themes: ThemeSpec[] = [
  {
    slug: "oud-perfume",
    name_en: "Oud & Amber",
    name_ar: "عود وعنبر",
    industry_en: "Perfume",
    industry_ar: "عطور",
    brand_en: "Al-Nafha",
    brand_ar: "النفحة",
    heroLead_en: "Essence of Arabia.",
    heroLead_ar: "عطر عربي أصيل.",
    heroSub_en: "Handcrafted oud, rose, and amber blends.",
    heroSub_ar: "عود وورد وعنبر بأيدي مصرية.",
    dir: "rtl",
    palette: {
      surface: "#1C1410",
      ink: "#F5EAD6",
      accent: "#D4A84B",
      accentSoft: "#2A1E16",
      muted: "rgba(245, 234, 214, 0.08)",
    },
    products: [
      { name_en: "Royal Oud", name_ar: "عود ملكي", price: 1800, shape: "bottle" },
      { name_en: "Rose Amber", name_ar: "ورد عنبر", price: 1200, shape: "bottle" },
      { name_en: "White Musk", name_ar: "مسك أبيض", price: 950, shape: "bottle" },
      { name_en: "Cedar Incense", name_ar: "بخور الأرز", price: 750, shape: "bottle" },
    ],
  },
  {
    slug: "minimal-fashion",
    name_en: "Atelier Minimal",
    name_ar: "أتلييه بسيط",
    industry_en: "Fashion",
    industry_ar: "أزياء",
    brand_en: "HABIBI",
    brand_ar: "حبيبي",
    heroLead_en: "Made to move.",
    heroLead_ar: "مصمّم للحركة.",
    heroSub_en: "New arrivals · Spring 2026 capsule.",
    heroSub_ar: "وصل حديثاً · كبسولة ربيع ٢٠٢٦.",
    dir: "ltr",
    palette: {
      surface: "#F5EFE6",
      ink: "#0F1624",
      accent: "#C14A1C",
      accentSoft: "rgba(193, 74, 28, 0.08)",
      muted: "rgba(15, 22, 36, 0.1)",
    },
    products: [
      { name_en: "Linen Shirt", name_ar: "قميص كتّان", price: 1400, shape: "square" },
      { name_en: "Wide Trousers", name_ar: "بنطلون واسع", price: 1800, shape: "pill" },
      { name_en: "Knit Cardigan", name_ar: "كارديجان", price: 2200, shape: "arch" },
      { name_en: "Cotton Tee", name_ar: "تيشرت قطن", price: 650, shape: "square" },
    ],
  },
  {
    slug: "rose-beauty",
    name_en: "Rose & Glow",
    name_ar: "وردي وبريق",
    industry_en: "Beauty",
    industry_ar: "جمال",
    brand_en: "Layla Skin",
    brand_ar: "ليلى سكين",
    heroLead_en: "Clean beauty. Proudly Arab.",
    heroLead_ar: "جمال طبيعي · من جذورنا.",
    heroSub_en: "Paraben-free serums and masks.",
    heroSub_ar: "سيروم وماسكات خالية من البارابين.",
    dir: "ltr",
    palette: {
      surface: "#FBEFEA",
      ink: "#4A1F2A",
      accent: "#E07C9E",
      accentSoft: "rgba(224, 124, 158, 0.14)",
      muted: "rgba(74, 31, 42, 0.12)",
    },
    products: [
      { name_en: "Rose Serum", name_ar: "سيروم الورد", price: 480, shape: "bottle" },
      { name_en: "Clay Mask", name_ar: "ماسك الطين", price: 320, shape: "circle" },
      { name_en: "Lip Balm", name_ar: "بلسم شفاه", price: 180, shape: "pill" },
      { name_en: "Honey Cream", name_ar: "كريم العسل", price: 420, shape: "circle" },
    ],
  },
  {
    slug: "saffron-food",
    name_en: "Saffron Table",
    name_ar: "مائدة الزعفران",
    industry_en: "Food & grocery",
    industry_ar: "طعام",
    brand_en: "Koshary Co",
    brand_ar: "كشري كو",
    heroLead_en: "Cairo flavours, to your door.",
    heroLead_ar: "طعم القاهرة · لحد بيتك.",
    heroSub_en: "Same-day delivery across Greater Cairo.",
    heroSub_ar: "توصيل في نفس اليوم داخل القاهرة الكبرى.",
    dir: "rtl",
    palette: {
      surface: "#FFF8EE",
      ink: "#2B1810",
      accent: "#E8A430",
      accentSoft: "rgba(232, 164, 48, 0.16)",
      muted: "rgba(43, 24, 16, 0.1)",
    },
    products: [
      { name_en: "Classic Koshary", name_ar: "كشري بلدي", price: 75, shape: "circle" },
      { name_en: "Molokhia Pot", name_ar: "حلة ملوخية", price: 140, shape: "arch" },
      { name_en: "Fattah Tray", name_ar: "صينية فتة", price: 180, shape: "circle" },
      { name_en: "Basbousa", name_ar: "بسبوسة", price: 60, shape: "square" },
    ],
  },
  {
    slug: "electronics-grid",
    name_en: "Circuit Grid",
    name_ar: "شبكة الدوائر",
    industry_en: "Electronics",
    industry_ar: "إلكترونيات",
    brand_en: "Numen Gear",
    brand_ar: "نومن جير",
    heroLead_en: "Gear that ships today.",
    heroLead_ar: "أدوات بتوصلك النهاردة.",
    heroSub_en: "Headphones · cameras · accessories.",
    heroSub_ar: "سماعات · كاميرات · إكسسوارات.",
    dir: "ltr",
    palette: {
      surface: "#0F1624",
      ink: "#F5EFE6",
      accent: "#6BA0D4",
      accentSoft: "rgba(107, 160, 212, 0.12)",
      muted: "rgba(245, 239, 230, 0.08)",
    },
    products: [
      { name_en: "Wireless Pods", name_ar: "سماعات لاسلكية", price: 1800, shape: "pill" },
      { name_en: "Smart Watch", name_ar: "ساعة ذكية", price: 3200, shape: "square" },
      { name_en: "Power Bank", name_ar: "باور بانك", price: 850, shape: "pill" },
      { name_en: "USB Hub", name_ar: "USB Hub", price: 520, shape: "square" },
    ],
  },
  {
    slug: "gold-jewelry",
    name_en: "Ingot & Pearl",
    name_ar: "سبيكة ولؤلؤ",
    industry_en: "Jewelry",
    industry_ar: "مجوهرات",
    brand_en: "Nuqta",
    brand_ar: "نُقطة",
    heroLead_en: "Heirlooms, handmade.",
    heroLead_ar: "قطع مصوغة بتدوم.",
    heroSub_en: "18k gold, natural pearls, Egyptian craft.",
    heroSub_ar: "ذهب عيار ١٨، لؤلؤ طبيعي، صنعة مصرية.",
    dir: "rtl",
    palette: {
      surface: "#FBF6ED",
      ink: "#2B1F0F",
      accent: "#B38F3A",
      accentSoft: "rgba(179, 143, 58, 0.14)",
      muted: "rgba(43, 31, 15, 0.1)",
    },
    products: [
      { name_en: "Pearl Pendant", name_ar: "دلاية لؤلؤ", price: 4200, shape: "diamond" },
      { name_en: "Gold Hoops", name_ar: "حلق ذهب", price: 3800, shape: "circle" },
      { name_en: "Signet Ring", name_ar: "خاتم توقيع", price: 2900, shape: "circle" },
      { name_en: "Chain Bracelet", name_ar: "غويشة", price: 5500, shape: "pill" },
    ],
  },
];

const categoryMeta: Record<
  Category,
  { en: string; ar: string }
> = {
  all: { en: "All", ar: "الكل" },
  perfume: { en: "Perfume", ar: "عطور" },
  fashion: { en: "Fashion", ar: "أزياء" },
  beauty: { en: "Beauty", ar: "جمال" },
  food: { en: "Food", ar: "طعام" },
  electronics: { en: "Electronics", ar: "إلكترونيات" },
  jewelry: { en: "Jewelry", ar: "مجوهرات" },
};

const themeCategory = (t: ThemeSpec): Exclude<Category, "all"> => {
  if (t.slug.includes("perfume")) return "perfume";
  if (t.slug.includes("fashion")) return "fashion";
  if (t.slug.includes("beauty")) return "beauty";
  if (t.slug.includes("food")) return "food";
  if (t.slug.includes("electronics")) return "electronics";
  return "jewelry";
};

const Themes: React.FC = () => {
  const { dir, language } = useLanguage();
  const isAr = language === "ar";
  const [filter, setFilter] = useState<Category>("all");

  useSEO({
    title: isAr
      ? "متاجر جاهزة · قوالب نُمُو"
      : "Ready-made stores · numu themes",
    description: isAr
      ? "متاجر عربية جاهزة للإطلاق — عطور، أزياء، جمال، طعام، إلكترونيات، مجوهرات. اختار القالب، ابدأ تجربة ٣٠ يوم مجاناً."
      : "Arabic-first industry stores ready to launch — perfume, fashion, beauty, food, electronics, jewelry. Pick a theme, start a 30-day free trial.",
    canonical: "https://numueg.app/themes",
  });

  const filtered = useMemo(() => {
    if (filter === "all") return themes;
    return themes.filter((t) => themeCategory(t) === filter);
  }, [filter]);

  const categoryOrder: Category[] = [
    "all",
    "perfume",
    "fashion",
    "beauty",
    "food",
    "electronics",
    "jewelry",
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
          <span className="size-1.5 rounded-full bg-terracotta" aria-hidden="true" />
          <span className="font-mono text-[10px] font-semibold text-terracotta uppercase tracking-[0.18em]">
            § READY-MADE STORES · AR-FIRST
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-bold text-ink tracking-tight leading-[1.05] mb-5">
          {isAr ? (
            <>
              متجرك الجاهز
              {" "}
              <span className="text-terracotta">في كليك واحدة.</span>
            </>
          ) : (
            <>
              Your store, already built.{" "}
              <span className="text-terracotta">One click to launch.</span>
            </>
          )}
        </h1>
        <p className="prose-body text-ink/75 max-w-2xl mx-auto">
          {isAr
            ? "قوالب عربية كاملة بمنتجات وصور مبدئية. اختار واحد، بدّل المنتجات، وابدأ البيع — كل ده في تجربة ٣٠ يوم مجاناً."
            : "Full Arabic storefronts preloaded with sample products and copy. Pick one, swap in your goods, and start selling — all inside a 30-day free trial."}
        </p>
      </div>

      <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        {/* Category filter row */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categoryOrder.map((cat) => {
            const active = filter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={`font-mono text-[11px] uppercase tracking-[0.18em] font-semibold px-3 py-1.5 rounded-[4px] transition-all duration-200 ease-numu ${
                  active
                    ? "bg-navy text-cream"
                    : "bg-paper border border-ink/10 text-ink-soft/75 hover:border-navy/30 hover:text-navy"
                }`}
              >
                {isAr ? categoryMeta[cat].ar : categoryMeta[cat].en}
              </button>
            );
          })}
        </div>

        {/* Themes grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((theme) => (
            <article
              key={theme.slug}
              className="group flex flex-col bg-paper border border-ink/10 rounded-[10px] shadow-card overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 ease-numu"
            >
              {/* Inline mockup */}
              <div
                className="p-3 border-b border-ink/10"
                style={{ background: theme.palette.accentSoft }}
              >
                <ThemePreview theme={theme} isAr={isAr} size="md" />
              </div>

              {/* Meta */}
              <div className="p-5 flex flex-col flex-1 gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft/60 font-semibold mb-1">
                      § {isAr ? theme.industry_ar : theme.industry_en}
                    </p>
                    <h2 className="font-display text-lg font-semibold text-ink tracking-tight leading-tight">
                      {isAr ? theme.name_ar : theme.name_en}
                    </h2>
                  </div>
                  {/* Palette chips */}
                  <div className="flex shrink-0 gap-1">
                    {[
                      theme.palette.surface,
                      theme.palette.ink,
                      theme.palette.accent,
                    ].map((c, i) => (
                      <span
                        key={i}
                        aria-hidden="true"
                        className="size-4 rounded-full border border-ink/10"
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                </div>

                <Link
                  to={`/?demo=1&theme=${theme.slug}`}
                  className="group/cta mt-auto inline-flex items-center justify-between gap-2 bg-navy text-cream font-semibold py-2.5 px-4 rounded-[4px] hover:bg-navy-800 active:scale-[0.985] transition-all duration-200 ease-numu text-sm"
                >
                  <span>{isAr ? "استخدم القالب" : "Use this theme"}</span>
                  <span
                    aria-hidden="true"
                    className="text-base text-saffron group-hover/cta:translate-x-0.5 rtl:group-hover/cta:-translate-x-0.5 transition-transform rtl:rotate-180"
                  >
                    →
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center prose-body text-ink-soft/60 py-10">
            {isAr
              ? "مفيش قوالب للتصنيف ده لسه — قريب."
              : "No themes in this category yet — check back soon."}
          </p>
        )}

        {/* Bottom row — comparison + CTA */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label_en: "Arabic-first",
              label_ar: "عربي الأول",
              body_en: "RTL rendering baked in. English is a toggle, not the default.",
              body_ar: "RTL مبنيّ من الأساس. الإنجليزي زرار تبديل مش الأساس.",
              accent: "bg-terracotta",
            },
            {
              label_en: "COD-ready",
              label_ar: "كاش جاهز",
              body_en: "Every theme ships with COD + Paymob + Fawry wired out of the box.",
              body_ar: "كل قالب بيجي بـ COD وبيموب وفوري متوصّلين جاهز.",
              accent: "bg-sage",
            },
            {
              label_en: "Swap everything",
              label_ar: "غيّر كل حاجة",
              body_en: "Colors, fonts, layout, copy — customise live inside the hub.",
              body_ar: "ألوان، خطوط، layout، كوبي — كل حاجة بتتعدّل من داخل الهب.",
              accent: "bg-saffron",
            },
          ].map((item, i) => (
            <article
              key={i}
              className="relative bg-paper border border-ink/10 rounded-[10px] shadow-card p-5 sm:p-6"
            >
              <span
                aria-hidden="true"
                className={`absolute top-0 start-0 w-10 h-[3px] ${item.accent}`}
              />
              <h3 className="font-display text-base font-semibold text-ink tracking-tight mb-1">
                {isAr ? item.label_ar : item.label_en}
              </h3>
              <p className="prose-body-sm text-ink/75">
                {isAr ? item.body_ar : item.body_en}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 bg-navy rounded-[14px] p-8 sm:p-10 text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-saffron font-semibold">
            § FREE 30-DAY TRIAL
          </span>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl font-bold text-cream tracking-tight leading-tight mb-3">
            {isAr
              ? "اختار قالب وابدأ — بدون بطاقة."
              : "Pick a theme and start — no card."}
          </h2>
          <p className="prose-body text-cream/75 max-w-xl mx-auto mb-6">
            {isAr
              ? "كل قالب بيشتغل كاملاً من أول كليك. نمنشأ نسختك خلال ٣٠ ثانية."
              : "Every theme boots fully functional on the first click. Your copy is live in 30 seconds."}
          </p>
          <Link
            to="/?demo=1"
            className="group inline-flex items-center justify-center gap-2 bg-cream text-navy font-semibold py-3 px-6 rounded-[4px] hover:bg-cream/90 active:scale-[0.985] transition-all duration-200 ease-numu"
          >
            <span>{isAr ? "ابدأ متجرك" : "Launch your store"}</span>
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

export default Themes;
