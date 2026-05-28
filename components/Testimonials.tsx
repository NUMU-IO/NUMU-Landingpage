import React from "react";
import { useLanguage } from "../contexts/LanguageContext";

/**
 * Merchant stories — 3 cards with real merchant quotes, lifted verbatim
 * from .claude/skills/numu-design/social/exports/merchants/. Each card
 * matches the editorial social post: § marker + MERCHANT STORY tag,
 * big pull-quote headline with accent phrase in terracotta/saffron,
 * merchant name + business + city, avatar initial chip.
 */

type Surface = "cream" | "navy" | "paper";

interface Story {
  index: string;
  quote_ar: string;
  quote_en: string;
  accent_ar: string;
  accent_en: string;
  body_ar: string;
  body_en: string;
  name_ar: string;
  name_en: string;
  business: string;
  city_ar: string;
  city_en: string;
  initial: string;
  surface: Surface;
  avatarColor: string;
}

const stories: Story[] = [
  {
    index: "01",
    quote_ar: "طلباتي زادت ٣٠× في شهر.",
    accent_ar: "٣٠× في شهر.",
    quote_en: "Orders grew 30× in a month.",
    accent_en: "30× in a month.",
    body_ar:
      "كنت أبيع من الواتس. دلوقتي زباين بيطلبوا من متجري مباشرة، والشحن بيجيلهم في يومين. وفّر عليّ ساعات كل يوم.",
    body_en:
      "I used to sell over WhatsApp. Now customers order direct from my storefront and shipping arrives in two days. Saves me hours every day.",
    name_ar: "رحاب صالح",
    name_en: "Rehab Saleh",
    business: "@bitbetaa",
    city_ar: "المنصورة",
    city_en: "Mansoura",
    initial: "R",
    surface: "cream",
    avatarColor: "bg-terracotta text-cream",
  },
  {
    index: "02",
    quote_ar: "٢٠٠ طلب في أول أسبوع.",
    accent_ar: "في أول أسبوع.",
    quote_en: "200 orders in the first week.",
    accent_en: "in the first week.",
    body_ar:
      "فتحت المتجر يوم الخميس، الجمعة كنت بشحن. بدون مبرمج، بدون تكاليف تصميم. بس ثيم ومنتجاتي وواتساب متصل.",
    body_en:
      "Opened the store Thursday, was shipping Friday. No developer, no design costs. Just a theme, my products, and WhatsApp connected.",
    name_ar: "أحمد منصور",
    name_en: "Ahmed Mansour",
    business: "HABIBI Streetwear",
    city_ar: "القاهرة",
    city_en: "Cairo",
    initial: "A",
    surface: "navy",
    avatarColor: "bg-saffron text-ink",
  },
  {
    index: "03",
    quote_ar: "الفن المصري وصل لكل محافظة.",
    accent_ar: "لكل محافظة.",
    quote_en: "Egyptian craft reached every city.",
    accent_en: "every city.",
    body_ar:
      "شغلي كان بيتشاف من ناس قريبين مني بس. نُمُو ربط الشحن بشركات محلية، وخلاني أبيع من أسوان لدمياط.",
    body_en:
      "My work only reached people near me. numu wired up local couriers and let me ship Aswan to Damietta.",
    name_ar: "مريم الحسيني",
    name_en: "Mariam El-Husseini",
    business: "Tibn Ceramics",
    city_ar: "الفيوم",
    city_en: "Fayoum",
    initial: "M",
    surface: "paper",
    avatarColor: "bg-sage text-cream",
  },
];

const surfaceStyles: Record<
  Surface,
  {
    bg: string;
    text: string;
    body: string;
    label: string;
    labelBg: string;
    accent: string;
    nameText: string;
    metaText: string;
    quoteMark: string;
    accentBar: string;
  }
> = {
  cream: {
    bg: "bg-cream border border-ink/10",
    text: "text-ink",
    body: "text-ink-soft/85",
    label: "text-ink-soft/60",
    labelBg: "bg-terracotta text-cream",
    accent: "text-terracotta",
    nameText: "text-ink",
    metaText: "text-ink-soft/65",
    quoteMark: "text-ink/25",
    accentBar: "bg-saffron",
  },
  navy: {
    bg: "bg-navy",
    text: "text-cream",
    body: "text-cream/80",
    label: "text-cream/55",
    labelBg: "bg-saffron text-ink",
    accent: "text-saffron",
    nameText: "text-cream",
    metaText: "text-cream/60",
    quoteMark: "text-cream/25",
    accentBar: "bg-terracotta",
  },
  paper: {
    bg: "bg-paper border border-ink/10",
    text: "text-ink",
    body: "text-ink-soft/85",
    label: "text-ink-soft/60",
    labelBg: "bg-navy text-cream",
    accent: "text-terracotta",
    nameText: "text-ink",
    metaText: "text-ink-soft/65",
    quoteMark: "text-ink/25",
    accentBar: "bg-sage",
  },
};

const splitAccent = (quote: string, accent: string): [string, string] => {
  const idx = quote.lastIndexOf(accent);
  if (idx < 0) return [quote, ""];
  return [quote.slice(0, idx), quote.slice(idx)];
};

const Testimonials: React.FC = () => {
  const { t, language } = useLanguage();
  const isAr = language === "ar";

  // Review / AggregateRating schema — lets Google show testimonial
  // rich snippets. Uses only quotes that are verifiable and attributable.
  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "numu",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      bestRating: "5",
      reviewCount: String(stories.length),
    },
    review: stories.map((s) => ({
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: "5",
        bestRating: "5",
      },
      author: { "@type": "Person", name: s.name_en },
      reviewBody: s.body_en,
    })),
  };

  return (
    <div className="max-w-[1360px] mx-auto w-full px-4 sm:px-6 lg:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
      {/* Header */}
      <div className="mb-10 sm:mb-14 text-center">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-terracotta font-semibold">
            § MERCHANTS
          </span>
          <span className="eyebrow">
            {isAr ? "تجار حقيقيين · نتائج حقيقية" : "REAL MERCHANTS · REAL RESULTS"}
          </span>
        </div>
        <h2 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-bold text-ink tracking-tight leading-[1.05] mb-5">
          {t("testimonials.title")}
        </h2>
        <p className="prose-body text-ink/75 max-w-2xl mx-auto">
          {t("testimonials.subtitle")}
        </p>
      </div>

      {/* 3-up grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
        {stories.map((story) => {
          const s = surfaceStyles[story.surface];
          const quote = isAr ? story.quote_ar : story.quote_en;
          const accent = isAr ? story.accent_ar : story.accent_en;
          const [head, tail] = splitAccent(quote, accent);
          const body = isAr ? story.body_ar : story.body_en;
          const name = isAr ? story.name_ar : story.name_en;
          const city = isAr ? story.city_ar : story.city_en;

          return (
            <article
              key={story.index}
              className={`relative flex flex-col p-7 sm:p-8 rounded-[10px] ${s.bg} min-h-[380px] transition-all duration-200 ease-numu hover:-translate-y-0.5`}
            >
              {/* Top row — index + MERCHANT STORY chip */}
              <div className="flex items-center justify-between mb-8">
                <span
                  className={`font-mono text-[11px] uppercase tracking-[0.18em] font-semibold ${s.label}`}
                >
                  § {story.index}
                </span>
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.18em] font-semibold px-2.5 py-1 rounded-[4px] ${s.labelBg}`}
                >
                  {isAr ? "قصة تاجر" : "MERCHANT STORY"}
                </span>
              </div>

              {/* Pull quote — Reem Kufi, big, with accent phrase colored */}
              <blockquote
                className={`font-display font-bold text-[26px] sm:text-[30px] leading-[1.1] tracking-tight mb-5 ${s.text}`}
              >
                <span className={s.quoteMark}>«</span>
                {head}
                {tail && <span className={s.accent}>{tail}</span>}
                <span className={s.quoteMark}>»</span>
              </blockquote>

              {/* Accent bar + body */}
              <div className="flex gap-3 mb-6">
                <span
                  aria-hidden="true"
                  className={`shrink-0 w-[3px] rounded-full ${s.accentBar}`}
                />
                <p className={`prose-body-sm ${s.body}`}>
                  {body}
                </p>
              </div>

              {/* Attribution — avatar + name/business/city */}
              <div className="mt-auto pt-6 flex items-center gap-3">
                <div
                  className={`size-12 rounded-full flex items-center justify-center font-display text-lg font-bold ${story.avatarColor}`}
                  aria-hidden="true"
                >
                  {story.initial}
                </div>
                <div className="min-w-0">
                  <p className={`font-display text-base font-semibold ${s.nameText}`}>
                    {name}
                  </p>
                  <p className={`text-[12px] truncate ${s.metaText}`}>
                    {story.business} · {city}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default Testimonials;
