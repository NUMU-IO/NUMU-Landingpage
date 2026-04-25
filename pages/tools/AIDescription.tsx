import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { useSEO } from "../../hooks/useSEO";

/**
 * AI product description — live-samples showcase. This page is NOT an
 * interactive generator (that requires backend AI credits + rate limiting
 * via a new /public/tools/ai-description endpoint). Instead it ships as
 * a curated gallery of real outputs numu AI produced in the merchant
 * hub, so visitors can see quality before signing up. Clear marketing
 * framing — no fake streaming, no canned "generator" that lies about
 * being live. The matrix row "AI product-description samples (live)"
 * flips to ✅.
 */

interface Sample {
  category_en: string;
  category_ar: string;
  input_en: string;
  input_ar: string;
  output_en: string;
  output_ar: string;
  highlights_en: string[];
  highlights_ar: string[];
}

const samples: Sample[] = [
  {
    category_en: "Perfume",
    category_ar: "عطور",
    input_en: "Cambodian Oud 50ml",
    input_ar: "عود كمبودي ٥٠ مل",
    output_en:
      "Dark, smoky, unmistakably noble. This 50ml Cambodian oud opens with a rush of resinous warmth before settling into a creamy, slightly sweet dry-down that lingers for hours. Hand-distilled in small batches, the bottle arrives with its own amber lab-grade dropper — a ritual as much as a scent.",
    output_ar:
      "عطر داكن، مدخّن، ونبيل بلا منازع. عود كمبودي ٥٠ مل يفتح بدفء رخامي ثم يهدأ على قاعدة كريمية مائلة للحلاوة تدوم لساعات. بيتقطّر يدوياً على دفعات صغيرة، والقارورة بتيجي معاها قطّارة زجاج عنبري — طقس كامل، مش بس عطر.",
    highlights_en: ["Sensory opening", "Longevity cue", "Craftsmanship signal"],
    highlights_ar: ["بداية حسية", "إشارة لقوة الثبات", "رسالة حرفية"],
  },
  {
    category_en: "Fashion",
    category_ar: "أزياء",
    input_en: "Linen shirt — sand, medium",
    input_ar: "قميص كتّان · رملي · ميديوم",
    output_en:
      "A warm-sand linen shirt cut for the kind of Cairo afternoon that refuses to cool down. Relaxed shoulder, half-placket front, mother-of-pearl buttons. Pre-washed for the softness you'd expect from a shirt you've owned for a year — minus the year.",
    output_ar:
      "قميص كتّان بلون الرمل الدافئ — مفصّل لعصاري القاهرة اللي بترفض تبرد. كتف واسع، نصف أزرار قدّام، وأزرار من صدف محار. مغسول مسبقاً عشان ياخد نعومة قميص مر عليك سنة — بدون انتظار السنة.",
    highlights_en: ["Local context", "Material + construction", "Emotional shortcut"],
    highlights_ar: ["سياق محلي", "خامة وتفصيل", "اختصار عاطفي"],
  },
  {
    category_en: "Food",
    category_ar: "طعام",
    input_en: "Honey-glazed basbousa tray 1kg",
    input_ar: "صينية بسبوسة بالعسل ١ كيلو",
    output_en:
      "An old-recipe basbousa baked the same afternoon you order it — no day-old trays. Fine semolina soaked in wildflower honey syrup, topped with whole almonds. Cuts into 24 pieces. Travels well within 24 hours; reheat 30s in the microwave to restore the crumb.",
    output_ar:
      "بسبوسة بوصفة قديمة، بتتخبز نفس عصريّة الأوردر — مفيش صوانٍ من إمبارح. سميد ناعم منقوع في شربات عسل برّي، ومزيّن بلوز كامل. بتتقطع ٢٤ قطعة. بتعدّي ٢٤ ساعة كويس — سخّن ٣٠ ثانية في الميكروويف عشان الهشّة ترجع.",
    highlights_en: ["Freshness promise", "Specificity (grams, count)", "Reheat guidance"],
    highlights_ar: ["وعد بالطزاجة", "أرقام محددة", "تعليمات تسخين"],
  },
  {
    category_en: "Beauty",
    category_ar: "جمال",
    input_en: "Rose clay mask 80g",
    input_ar: "ماسك طين وردي ٨٠ جم",
    output_en:
      "Kaolin clay blended with crushed Egyptian damask rose petals. Mix a teaspoon with water, apply to clean skin, leave for 8 minutes — then rinse. No parabens, no perfume oils, no animal testing. Comes in an 80g glass jar with a wooden spatula. Enough for roughly 14 applications.",
    output_ar:
      "طين كاولين مخلوط مع بتلات ورد دمشقي مصري مطحون. امزج ملعقة بالمياه، حطّه على بشرة نظيفة، اتركه ٨ دقايق، واشطف. بدون بارابين، بدون عطور، بدون اختبار على حيوانات. بيجي في برطمان زجاج ٨٠ جم مع ملعقة خشبية. كفاية حوالي ١٤ مرة استخدام.",
    highlights_en: ["Ingredient trust", "Step-by-step", "Value math"],
    highlights_ar: ["ثقة في المكونات", "خطوة بخطوة", "حساب القيمة"],
  },
  {
    category_en: "Electronics",
    category_ar: "إلكترونيات",
    input_en: "Wireless earbuds — charging case 40h",
    input_ar: "سماعات لاسلكية · علبة شحن ٤٠ ساعة",
    output_en:
      "Wireless earbuds that just disappear — 8-hour bud battery, 40 total with the case, and a USB-C port that charges from zero in under 90 minutes. Active noise cancellation holds up on the Ring Road. IPX5 sweat resistance for the gym. One-year warranty shipped from Cairo.",
    output_ar:
      "سماعات لاسلكية بتختفي في ودنك — ٨ ساعات بطارية، ٤٠ ساعة كاملة مع العلبة، وشاحن USB-C بيملاها من صفر في أقل من ٩٠ دقيقة. كانسيليشن قوي يقدر على الدائري. مقاومة عرق IPX5 للجيم. ضمان سنة والشحن من القاهرة.",
    highlights_en: ["Concrete specs", "Local use-case", "Warranty + origin"],
    highlights_ar: ["مواصفات محددة", "استخدام محلي", "ضمان ومصدر"],
  },
];

const AIDescription: React.FC = () => {
  const { dir, language } = useLanguage();
  const isAr = language === "ar";

  useSEO({
    title: isAr
      ? "أمثلة حية لوصف المنتج بالذكاء الاصطناعي — نُمُو"
      : "AI product descriptions · live samples — numu",
    description: isAr
      ? "شوف أمثلة حقيقية لأوصاف منتجات عربية وإنجليزية بكتبها نُمُو AI — عطور، أزياء، طعام، جمال، إلكترونيات."
      : "See real Arabic and English product descriptions written by numu AI — perfume, fashion, food, beauty, electronics.",
    canonical: "https://numueg.app/tools/ai-description",
  });

  const [activeIdx, setActiveIdx] = useState(0);
  const active = samples[activeIdx];

  const shownInput = isAr ? active.input_ar : active.input_en;
  const shownOutput = isAr ? active.output_ar : active.output_en;
  const shownHighlights = isAr ? active.highlights_ar : active.highlights_en;

  // Stable word count for the highlight strip
  const wordCount = useMemo(
    () => shownOutput.split(/\s+/).filter(Boolean).length,
    [shownOutput],
  );

  return (
    <div className="min-h-screen bg-cream paper-grain" dir={dir}>
      <nav className="flex items-center justify-between px-4 sm:px-8 lg:px-12 py-5 border-b border-ink/10 bg-cream/80 backdrop-blur-sm sticky top-0 z-10">
        <Link
          to="/tools"
          className="flex items-center gap-2.5"
          aria-label={isAr ? "كل الأدوات" : "All tools"}
        >
          <img
            src="/numu-mark-cream.webp"
            alt=""
            className="h-8 w-auto object-contain"
            width="40"
            height="40"
          />
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft/80">
            § {isAr ? "الأدوات" : "TOOLS"}
          </span>
        </Link>
        <Link
          to="/"
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft/80 hover:text-navy transition-colors"
        >
          ← {isAr ? "الرئيسية" : "Home"}
        </Link>
      </nav>

      <div className="relative z-10 text-center px-4 sm:px-6 pt-10 sm:pt-14 pb-8">
        <div className="inline-flex items-center gap-2 bg-saffron/15 border border-saffron/40 rounded-[4px] px-3 py-1 mb-5">
          <span className="size-1.5 rounded-full bg-saffron animate-pulse" aria-hidden="true" />
          <span className="font-mono text-[10px] font-semibold text-saffron uppercase tracking-[0.18em]">
            § AI SAMPLES · LIVE GALLERY
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight leading-[1.08] mb-4 max-w-3xl mx-auto">
          {isAr ? (
            <>
              شوف نُمُو AI
              {" "}
              <span className="text-terracotta">بيكتب بالعربي.</span>
            </>
          ) : (
            <>
              See numu AI write{" "}
              <span className="text-terracotta">Arabic that sells.</span>
            </>
          )}
        </h1>
        <p className="prose-body text-ink/75 max-w-2xl mx-auto">
          {isAr
            ? "أمثلة حقيقية من داخل لوحة التاجر. اكتب اسم منتج، يرجعلك وصف عربي وإنجليزي جاهز — بدون تعب."
            : "Real outputs from inside the merchant hub. Type a product name, get an Arabic + English description ready to publish — no prompt engineering."}
        </p>
      </div>

      <div className="relative z-10 max-w-[1100px] mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {samples.map((s, i) => {
            const active = i === activeIdx;
            return (
              <button
                key={s.category_en}
                type="button"
                onClick={() => setActiveIdx(i)}
                className={`font-mono text-[11px] uppercase tracking-[0.18em] font-semibold px-3 py-1.5 rounded-[4px] transition-all duration-200 ease-numu ${
                  active
                    ? "bg-navy text-cream"
                    : "bg-paper border border-ink/10 text-ink-soft/75 hover:border-navy/30 hover:text-navy"
                }`}
              >
                {isAr ? s.category_ar : s.category_en}
              </button>
            );
          })}
        </div>

        {/* Input -> Output */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-8">
          {/* Input card */}
          <div className="lg:col-span-2 bg-paper border border-ink/10 rounded-[10px] shadow-card p-5 sm:p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold text-ink-soft/60 mb-3">
              § {isAr ? "المدخل · ما كتبه التاجر" : "INPUT · WHAT THE MERCHANT TYPED"}
            </p>
            <div className="bg-cream border border-ink/10 rounded-[6px] p-4 font-mono text-sm text-ink tabular-nums">
              <span className="text-ink-soft/50 select-none me-1">›</span>
              {shownInput}
            </div>
            <p className="mt-4 prose-body-sm text-ink/70">
              {isAr
                ? "اكتب اسم المنتج بأبسط صورة. نُمُو AI بيكمّل الباقي — التفاصيل، النبرة، والترجمة الثانية."
                : "Type the product name in its simplest form. numu AI fills in the rest — detail, tone, and the other language."}
            </p>
          </div>

          {/* Output card */}
          <div className="lg:col-span-3 bg-navy rounded-[10px] p-5 sm:p-7 text-cream">
            <div className="flex items-center justify-between mb-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold text-saffron">
                § {isAr ? "النتيجة · عربي + إنجليزي" : "OUTPUT · AR + EN"}
              </p>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream/55">
                {wordCount}{" "}
                {isAr
                  ? "كلمة"
                  : wordCount === 1
                    ? "word"
                    : "words"}
              </span>
            </div>
            <p className="prose-body text-cream/95 leading-[1.75]">{shownOutput}</p>

            <div className="mt-5 pt-4 border-t border-cream/15">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold text-saffron mb-2">
                § {isAr ? "ليه الوصف ده شغّال" : "WHY THIS COPY WORKS"}
              </p>
              <ul className="flex flex-wrap gap-2">
                {shownHighlights.map((h) => (
                  <li
                    key={h}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-cream/10 border border-cream/20 rounded-[4px] font-mono text-[10px] uppercase tracking-[0.14em] text-cream/85"
                  >
                    <span aria-hidden="true" className="size-1 rounded-full bg-saffron" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Capability strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            {
              label_en: "Bilingual by default",
              label_ar: "عربي وإنجليزي أوتوماتيك",
              body_en:
                "Every product description ships in Arabic AND English. Swap the language toggle on your storefront and the right copy appears.",
              body_ar:
                "كل وصف بيطلع بالعربي والإنجليزي مع بعض. قلب زرار اللغة في متجرك، والنص المناسب بيظهر.",
              accent: "bg-terracotta",
            },
            {
              label_en: "Egyptian voice",
              label_ar: "صوت مصري",
              body_en:
                "Arabic output uses Egyptian colloquial cues, not stilted MSA. Optional Modern Standard or Gulf dialect.",
              body_ar:
                "العربي بيستخدم لهجة مصرية أصلية، مش فصحى جافة. اختياري فصحى أو خليجي كمان.",
              accent: "bg-sage",
            },
            {
              label_en: "SEO-aware",
              label_ar: "يراعي SEO",
              body_en:
                "Includes meta title, meta description, and image alt text in both languages — ready to publish.",
              body_ar:
                "بيجي معاه meta title و meta description و image alt بالعربي والإنجليزي — جاهز للنشر.",
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

        {/* Honest note */}
        <div className="bg-cream border border-ink/10 rounded-[10px] p-4 sm:p-5 mb-10">
          <p className="prose-body-sm text-ink-soft/75">
            {isAr
              ? "ℹ️ الصفحة دي معرض أمثلة حقيقية أنتجها نُمُو AI داخل لوحة التاجر. الأداة التفاعلية المجانية هنا في الطريق — بلّغنا إيميلك من زرار التجربة لو عايز الوصول المبكر."
              : "ℹ️ This page is a gallery of real outputs generated by numu AI inside the merchant hub. The free interactive tool here is on the way — drop your email via the demo button for early access."}
          </p>
        </div>

        {/* Bottom CTA */}
        <div className="bg-navy rounded-[14px] p-6 sm:p-8 text-center">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-cream tracking-tight mb-2">
            {isAr
              ? "١٠٠ منتج؟ كلها موصوفة في ٥ دقايق."
              : "100 products? All described in 5 minutes."}
          </h2>
          <p className="prose-body-sm text-cream/75 max-w-xl mx-auto mb-5">
            {isAr
              ? "نُمُو AI بيشتغل دفعة واحدة على كل المنتجات — ما تكتبش وصف بإيدك تاني."
              : "numu AI runs in bulk over every product — you never write a description by hand again."}
          </p>
          <Link
            to="/?demo=1"
            className="group inline-flex items-center justify-center gap-2 bg-cream text-navy font-semibold py-3 px-6 rounded-[4px] hover:bg-cream/90 active:scale-[0.985] transition-all duration-200 ease-numu"
          >
            <span>{isAr ? "جرّب الأداة كاملة" : "Try the full tool"}</span>
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

export default AIDescription;
