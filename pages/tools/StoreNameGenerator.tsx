import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { useSEO } from "../../hooks/useSEO";

/**
 * Arabic-first store name generator — free SEO tool (audit §2.6).
 * Pure client-side. Targets long-tail Arabic keywords like
 * "مولد اسم متجر", "اسم محل عطور", "اقتراحات أسماء متاجر". Every
 * click reshuffles deterministically based on inputs + a rotating
 * seed so "Regenerate" produces fresh results.
 */

type Industry =
  | "fashion"
  | "perfume"
  | "coffee"
  | "beauty"
  | "food"
  | "home"
  | "electronics"
  | "bookstore"
  | "jewelry"
  | "general";

type Mood = "classic" | "modern" | "luxurious" | "playful" | "minimal" | "bold";

const industryNouns: Record<Industry, { ar: string[]; en: string[] }> = {
  fashion: {
    ar: ["قماش", "خيط", "طرز", "حرير", "عبق", "لمسة", "أناقة", "زي", "خامة"],
    en: ["Silk", "Thread", "Weave", "Cloth", "Atelier", "Tailor", "Seam", "Stitch", "Loom"],
  },
  perfume: {
    ar: ["عطر", "عود", "مسك", "ورد", "عنبر", "نفحة", "شذا", "عبير", "طيب"],
    en: ["Oud", "Musk", "Rose", "Amber", "Scent", "Aroma", "Essence", "Blossom", "Bloom"],
  },
  coffee: {
    ar: ["قهوة", "بن", "حبة", "نبتة", "رشفة", "مذاق", "فنجان", "روح"],
    en: ["Bean", "Brew", "Roast", "Cup", "Sip", "Bloom", "Grind", "Cafe"],
  },
  beauty: {
    ar: ["جمال", "بهاء", "سحر", "ألق", "نضارة", "لمعان", "ندى", "نعمة"],
    en: ["Glow", "Bloom", "Radiance", "Charm", "Dew", "Grace", "Aura", "Luna"],
  },
  food: {
    ar: ["مائدة", "مطبخ", "نكهة", "طبق", "لقمة", "وصفة", "ذوق", "بهار"],
    en: ["Kitchen", "Table", "Plate", "Bite", "Recipe", "Flavor", "Spice", "Feast"],
  },
  home: {
    ar: ["بيت", "دار", "ركن", "مرسى", "لمسة", "هدوء", "دفء", "ظل"],
    en: ["House", "Hearth", "Nest", "Corner", "Haven", "Shade", "Loom", "Rest"],
  },
  electronics: {
    ar: ["برج", "ذرة", "نبض", "شرارة", "ضوء", "دارة", "رقمي"],
    en: ["Spark", "Circuit", "Pulse", "Pixel", "Volt", "Core", "Node"],
  },
  bookstore: {
    ar: ["كتاب", "سطر", "صفحة", "حكاية", "ورق", "رواية", "حرف", "مكتبة"],
    en: ["Page", "Verse", "Chapter", "Leaf", "Story", "Script", "Inkwell", "Folio"],
  },
  jewelry: {
    ar: ["جوهرة", "ذهب", "لؤلؤ", "ياقوت", "فضة", "زمرد", "تاج", "ألماس"],
    en: ["Gem", "Pearl", "Ruby", "Gold", "Silver", "Emerald", "Crown", "Jewel"],
  },
  general: {
    ar: ["سوق", "متجر", "ركن", "زاوية", "محل", "مرسى", "لمسة"],
    en: ["Market", "Store", "Corner", "Post", "Mill", "Trade", "Goods"],
  },
};

const moodAdjectives: Record<Mood, { ar: string[]; en: string[] }> = {
  classic: {
    ar: ["أصيل", "عريق", "تراثي", "قديم"],
    en: ["Classic", "Heritage", "Old", "Vintage"],
  },
  modern: {
    ar: ["جديد", "حديث", "عصري", "طازج"],
    en: ["Fresh", "Modern", "New", "Nova"],
  },
  luxurious: {
    ar: ["ملكي", "ذهبي", "فاخر", "راقي", "سامي"],
    en: ["Royal", "Gold", "Noble", "Regal", "Prime"],
  },
  playful: {
    ar: ["لطيف", "مرح", "حلو", "بهجة"],
    en: ["Merry", "Sweet", "Bloom", "Joy"],
  },
  minimal: {
    ar: ["بسيط", "نقي", "صافي", "هادئ"],
    en: ["Pure", "Plain", "Calm", "Still"],
  },
  bold: {
    ar: ["جريء", "قوي", "سيد", "ملكي"],
    en: ["Bold", "Prime", "Strong", "Apex"],
  },
};

const arabicConnectors = ["دار", "بيت", "سوق", "ركن", "مرسى"];
const englishConnectors = ["House of", "The", "", "", ""];

const rand = (seed: number, max: number): number => {
  // Simple deterministic xorshift so regeneration is reproducible given
  // the same input — avoids React remount flicker on re-render.
  let x = seed;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  return Math.abs(x) % max;
};

const generateNames = (
  industry: Industry,
  mood: Mood,
  personalName: string,
  isAr: boolean,
  seed: number,
): string[] => {
  const nouns = isAr ? industryNouns[industry].ar : industryNouns[industry].en;
  const adjs = isAr ? moodAdjectives[mood].ar : moodAdjectives[mood].en;
  const connectors = isAr ? arabicConnectors : englishConnectors;
  const results = new Set<string>();

  let attempt = 0;
  while (results.size < 20 && attempt < 120) {
    const s = seed + attempt * 7919;
    const noun = nouns[rand(s, nouns.length)];
    const adj = adjs[rand(s * 3 + 1, adjs.length)];
    const conn = connectors[rand(s * 5 + 2, connectors.length)];
    const template = rand(s * 11 + 3, personalName ? 9 : 7);

    let name = "";
    if (isAr) {
      switch (template) {
        case 0:
          name = noun;
          break;
        case 1:
          name = `${adj} ${noun}`;
          break;
        case 2:
          name = `${noun} ${adj}`;
          break;
        case 3:
          name = `${conn} ${noun}`;
          break;
        case 4:
          name = `${conn} ${noun} ${adj}`;
          break;
        case 5:
          name = `ال${noun}`;
          break;
        case 6:
          name = `${noun} & ${nouns[rand(s * 13 + 5, nouns.length)]}`;
          break;
        case 7:
          name = `دار ${personalName}`;
          break;
        case 8:
          name = `${personalName} ${noun}`;
          break;
      }
    } else {
      switch (template) {
        case 0:
          name = noun;
          break;
        case 1:
          name = `${adj} ${noun}`;
          break;
        case 2:
          name = `${noun} & Co`;
          break;
        case 3: {
          const c = conn;
          name = c ? `${c} ${noun}` : `${noun} Atelier`;
          break;
        }
        case 4:
          name = `${adj} ${noun} Co`;
          break;
        case 5:
          name = `${noun}works`;
          break;
        case 6:
          name = `${noun} & ${nouns[rand(s * 13 + 5, nouns.length)]}`;
          break;
        case 7:
          name = `House of ${personalName}`;
          break;
        case 8:
          name = `${personalName} ${noun}`;
          break;
      }
    }
    name = name.trim();
    if (name) results.add(name);
    attempt += 1;
  }
  return Array.from(results);
};

const Tool: React.FC = () => {
  const { dir, language } = useLanguage();
  const isAr = language === "ar";

  useSEO({
    title: isAr
      ? "مولّد أسماء متاجر عربية مجاني — نُمُو"
      : "Arabic store name generator — numu",
    description: isAr
      ? "احصل على ٢٠ اسم متجر عربي مناسب لصناعتك في ثواني. مجاني، بدون تسجيل، وبدون حد استخدام — من نُمُو."
      : "Get 20 on-brand Arabic store name ideas for your industry in seconds. Free, no signup, no limits — from numu.",
    canonical: "https://numueg.app/tools/store-names",
  });

  const [industry, setIndustry] = useState<Industry>("perfume");
  const [mood, setMood] = useState<Mood>("luxurious");
  const [personalName, setPersonalName] = useState("");
  const [seed, setSeed] = useState(() => Date.now() & 0x7fffffff);
  const [copied, setCopied] = useState<string | null>(null);

  const names = useMemo(
    () => generateNames(industry, mood, personalName.trim(), isAr, seed),
    [industry, mood, personalName, isAr, seed],
  );

  const handleCopy = async (name: string) => {
    try {
      await navigator.clipboard.writeText(name);
      setCopied(name);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // clipboard API unavailable — silently skip; the name is still selectable
    }
  };

  const industryOptions: [Industry, string, string][] = [
    ["fashion", "أزياء", "Fashion"],
    ["perfume", "عطور", "Perfume"],
    ["coffee", "قهوة", "Coffee"],
    ["beauty", "جمال", "Beauty"],
    ["food", "طعام", "Food"],
    ["home", "منزل", "Home"],
    ["electronics", "إلكترونيات", "Electronics"],
    ["bookstore", "كتب", "Books"],
    ["jewelry", "مجوهرات", "Jewelry"],
    ["general", "عام", "General"],
  ];

  const moodOptions: [Mood, string, string][] = [
    ["classic", "تراثي", "Classic"],
    ["modern", "عصري", "Modern"],
    ["luxurious", "فاخر", "Luxurious"],
    ["playful", "مرح", "Playful"],
    ["minimal", "بسيط", "Minimal"],
    ["bold", "جريء", "Bold"],
  ];

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
        <div className="inline-flex items-center gap-2 bg-terracotta/10 border border-terracotta/30 rounded-[4px] px-3 py-1 mb-5">
          <span className="size-1.5 rounded-full bg-terracotta" aria-hidden="true" />
          <span className="font-mono text-[10px] font-semibold text-terracotta uppercase tracking-[0.18em]">
            § STORE NAME GENERATOR
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight leading-[1.08] mb-4 max-w-3xl mx-auto">
          {isAr ? (
            <>
              اسم متجرك في
              {" "}
              <span className="text-terracotta">دقيقة.</span>
            </>
          ) : (
            <>
              Name your store in{" "}
              <span className="text-terracotta">one minute.</span>
            </>
          )}
        </h1>
        <p className="prose-body text-ink/75 max-w-2xl mx-auto">
          {isAr
            ? "اختار الصناعة والطابع، وإحنا بنقترح ٢٠ اسم عربي جاهز للبراند."
            : "Pick an industry and a mood — we'll suggest 20 brand-ready Arabic names."}
        </p>
      </div>

      <div className="relative z-10 max-w-[1100px] mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        {/* Controls */}
        <div className="bg-paper border border-ink/10 rounded-[10px] shadow-card p-5 sm:p-7 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label
                htmlFor="industry"
                className="block font-mono text-[10px] uppercase tracking-[0.18em] font-semibold text-ink-soft/70 mb-2"
              >
                § {isAr ? "الصناعة" : "Industry"}
              </label>
              <select
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value as Industry)}
                className="w-full h-11 px-3 bg-cream border border-ink/15 rounded-[4px] font-display text-sm text-ink focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20 transition-all duration-200 ease-numu"
              >
                {industryOptions.map(([val, ar, en]) => (
                  <option key={val} value={val}>
                    {isAr ? ar : en}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="mood"
                className="block font-mono text-[10px] uppercase tracking-[0.18em] font-semibold text-ink-soft/70 mb-2"
              >
                § {isAr ? "الطابع" : "Mood"}
              </label>
              <select
                id="mood"
                value={mood}
                onChange={(e) => setMood(e.target.value as Mood)}
                className="w-full h-11 px-3 bg-cream border border-ink/15 rounded-[4px] font-display text-sm text-ink focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20 transition-all duration-200 ease-numu"
              >
                {moodOptions.map(([val, ar, en]) => (
                  <option key={val} value={val}>
                    {isAr ? ar : en}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="personal"
                className="block font-mono text-[10px] uppercase tracking-[0.18em] font-semibold text-ink-soft/70 mb-2"
              >
                § {isAr ? "اسمك (اختياري)" : "Your name (optional)"}
              </label>
              <input
                id="personal"
                type="text"
                value={personalName}
                onChange={(e) => setPersonalName(e.target.value)}
                placeholder={isAr ? "أحمد · ليلى · ..." : "Ahmed · Laila · ..."}
                className="w-full h-11 px-3 bg-cream border border-ink/15 rounded-[4px] font-display text-sm text-ink placeholder:text-ink-soft/40 focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20 transition-all duration-200 ease-numu"
                maxLength={30}
              />
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <p className="font-mono text-[11px] text-ink-soft/60">
              {isAr
                ? `${names.length} اسم — بتتغيّر كل ما تضغط شافل`
                : `${names.length} names — reshuffle for new ideas`}
            </p>
            <button
              type="button"
              onClick={() => setSeed((s) => (s * 1103515245 + 12345) & 0x7fffffff)}
              className="group bg-navy text-cream font-semibold py-2.5 px-5 rounded-[4px] hover:bg-navy-800 active:scale-[0.985] transition-all duration-200 ease-numu flex items-center gap-2 text-sm"
            >
              <span>{isAr ? "شفّل" : "Regenerate"}</span>
              <span
                aria-hidden="true"
                className="text-base text-saffron group-hover:rotate-180 transition-transform duration-500"
              >
                ↻
              </span>
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {names.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => handleCopy(name)}
              className="group text-start bg-paper border border-ink/10 rounded-[10px] shadow-card p-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 ease-numu"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-display text-lg font-semibold text-ink tracking-tight leading-tight truncate">
                  {name}
                </span>
                <span
                  aria-hidden="true"
                  className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft/50 group-hover:text-terracotta transition-colors"
                >
                  {copied === name
                    ? isAr
                      ? "نُسخ"
                      : "Copied"
                    : isAr
                      ? "نسخ"
                      : "Copy"}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 bg-navy rounded-[14px] p-6 sm:p-8 text-center">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-cream tracking-tight mb-2">
            {isAr
              ? "لقيت الاسم؟ افتح متجرك بيه في ١٥ دقيقة."
              : "Picked a name? Open your store with it in 15 minutes."}
          </h2>
          <p className="prose-body-sm text-cream/75 max-w-xl mx-auto mb-5">
            {isAr
              ? "تجربة ٣٠ يوم مجاناً. بدون بطاقة. عربي ١٠٠٪."
              : "30-day free trial. No card. Fully Arabic."}
          </p>
          <Link
            to="/?demo=1"
            className="group inline-flex items-center justify-center gap-2 bg-cream text-navy font-semibold py-3 px-6 rounded-[4px] hover:bg-cream/90 active:scale-[0.985] transition-all duration-200 ease-numu"
          >
            <span>{isAr ? "ابدأ متجرك" : "Start your store"}</span>
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

export default Tool;
