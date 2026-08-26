import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { useSEO } from "../../hooks/useSEO";

/**
 * VAT calculator — free SEO tool. Targets "حاسبة ضريبة القيمة المضافة",
 * "حساب الضريبة المضافة ١٤", "إزاي أحسب الضريبة". Everything client-side.
 *
 * Two directions, because merchants need both and almost every competing
 * calculator only does one: adding VAT to a net price, and extracting the VAT
 * already inside a gross price. The second is the one people get wrong —
 * subtracting 14% from a VAT-inclusive total is not the same as removing the
 * VAT from it, and the error compounds across a whole invoice.
 *
 * Rates cover Egypt (14%) and Saudi (15%) because the platform already sells
 * into both markets, plus a custom rate for the reduced/zero-rated cases.
 */

const toArabicDigits = (s: string): string =>
  s.replace(/[0-9]/g, (d) => String.fromCharCode(0x0660 + parseInt(d, 10)));

const arabicToWestern = (s: string): string =>
  s.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));

const parseNum = (raw: string): number => {
  const cleaned = arabicToWestern(raw).replace(/[^0-9.]/g, "");
  if (!cleaned) return NaN;
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : NaN;
};

const fmt = (n: number, isAr: boolean, digits = 2): string => {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(isAr ? "ar-EG" : "en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
};

type Mode = "add" | "remove";

const RATES = [
  { id: "eg", rate: 14, label_ar: "مصر ١٤٪", label_en: "Egypt 14%" },
  { id: "sa", rate: 15, label_ar: "السعودية ١٥٪", label_en: "Saudi 15%" },
  { id: "custom", rate: 0, label_ar: "نسبة أخرى", label_en: "Custom" },
];

const Tool: React.FC = () => {
  const { dir, language } = useLanguage();
  const isAr = language === "ar";

  useSEO({
    title: isAr
      ? "حاسبة ضريبة القيمة المضافة المجانية — نُمُو"
      : "VAT calculator (Egypt 14%) — numu",
    description: isAr
      ? "احسب ضريبة القيمة المضافة ١٤٪ في مصر أو ١٥٪ في السعودية — أضف الضريبة على السعر أو استخرجها من سعر شامل. مجاني، بدون تسجيل."
      : "Calculate VAT at Egypt's 14% or Saudi's 15% — add VAT to a net price or extract the VAT already inside a gross price. Free, no signup.",
    canonical: "https://numueg.app/tools/vat",
  });

  const [mode, setMode] = useState<Mode>("add");
  const [amount, setAmount] = useState("1000");
  const [rateId, setRateId] = useState("eg");
  const [customRate, setCustomRate] = useState("14");

  const rate = useMemo(() => {
    if (rateId === "custom") {
      const r = parseNum(customRate);
      return Number.isFinite(r) ? r : NaN;
    }
    return RATES.find((r) => r.id === rateId)?.rate ?? NaN;
  }, [rateId, customRate]);

  const calc = useMemo(() => {
    const a = parseNum(amount);
    if (!Number.isFinite(a) || !Number.isFinite(rate) || rate < 0) return null;

    const factor = rate / 100;
    if (mode === "add") {
      const vat = a * factor;
      return { net: a, vat, gross: a + vat };
    }
    // Removing VAT: divide by (1 + rate), do NOT subtract rate% of the gross.
    // At 14% those differ by ~2% of the total, which is the single most common
    // mistake in hand-rolled invoice maths.
    const net = a / (1 + factor);
    return { net, vat: a - net, gross: a };
  }, [amount, rate, mode]);

  const num = (n: number) => {
    const s = fmt(n, isAr);
    return isAr ? toArabicDigits(s) : s;
  };

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
        <div className="inline-flex items-center gap-2 bg-sage/15 border border-sage/40 rounded-[4px] px-3 py-1 mb-5">
          <span className="size-1.5 rounded-full bg-sage" aria-hidden="true" />
          <span className="font-mono text-[10px] font-semibold text-sage uppercase tracking-[0.18em]">
            § VAT · EG 14% / SA 15%
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight leading-[1.08] mb-4 max-w-3xl mx-auto">
          {isAr ? (
            <>
              احسب الضريبة المضافة{" "}
              <span className="text-terracotta">صح من أول مرة.</span>
            </>
          ) : (
            <>
              Get VAT right <span className="text-terracotta">the first time.</span>
            </>
          )}
        </h1>
        <p className="prose-body text-ink/75 max-w-2xl mx-auto">
          {isAr
            ? "أضف الضريبة على السعر، أو استخرجها من سعر شامل. الاتجاهين مختلفين — وطرح ١٤٪ من سعر شامل بيطلع رقم غلط."
            : "Add VAT to a net price, or pull the VAT out of a gross one. They are not the same sum — subtracting 14% from a VAT-inclusive total gives the wrong answer."}
        </p>
      </div>

      <div className="relative z-10 max-w-[1000px] mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Inputs */}
          <div className="lg:col-span-2 bg-paper border border-ink/10 rounded-[10px] shadow-card p-5 sm:p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold text-ink-soft/70 mb-4">
              § {isAr ? "المدخلات" : "INPUTS"}
            </p>

            <div
              className="grid grid-cols-2 gap-2 mb-5"
              role="radiogroup"
              aria-label={isAr ? "نوع الحساب" : "Calculation mode"}
            >
              {(["add", "remove"] as Mode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={mode === m}
                  onClick={() => setMode(m)}
                  className={`h-11 rounded-[4px] font-display text-sm font-semibold transition-colors duration-200 ease-numu border ${
                    mode === m
                      ? "bg-navy text-cream border-navy"
                      : "bg-cream text-ink border-ink/15 hover:border-navy/40"
                  }`}
                >
                  {m === "add"
                    ? isAr
                      ? "أضف الضريبة"
                      : "Add VAT"
                    : isAr
                      ? "استخرج الضريبة"
                      : "Remove VAT"}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <label
                  htmlFor="amount"
                  className="block font-display text-sm font-semibold text-ink mb-1"
                >
                  {mode === "add"
                    ? isAr
                      ? "السعر قبل الضريبة"
                      : "Price before VAT"
                    : isAr
                      ? "السعر شامل الضريبة"
                      : "Price including VAT"}
                </label>
                <input
                  id="amount"
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full h-11 px-3 bg-cream border border-ink/15 rounded-[4px] font-display text-base text-ink tabular-nums focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20 transition-all duration-200 ease-numu"
                  dir="ltr"
                />
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft/55">
                  {isAr ? "بالجنيه المصري" : "In EGP"}
                </p>
              </div>

              <div>
                <span className="block font-display text-sm font-semibold text-ink mb-1">
                  {isAr ? "نسبة الضريبة" : "VAT rate"}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {RATES.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRateId(r.id)}
                      className={`h-10 rounded-[4px] font-display text-xs font-semibold transition-colors duration-200 ease-numu border ${
                        rateId === r.id
                          ? "bg-sage/90 text-cream border-sage"
                          : "bg-cream text-ink border-ink/15 hover:border-sage/50"
                      }`}
                    >
                      {isAr ? r.label_ar : r.label_en}
                    </button>
                  ))}
                </div>
                {rateId === "custom" && (
                  <input
                    id="customRate"
                    type="text"
                    inputMode="decimal"
                    value={customRate}
                    onChange={(e) => setCustomRate(e.target.value)}
                    aria-label={isAr ? "نسبة مخصصة" : "Custom rate"}
                    className="mt-2 w-full h-11 px-3 bg-cream border border-ink/15 rounded-[4px] font-display text-base text-ink tabular-nums focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20 transition-all duration-200 ease-numu"
                    dir="ltr"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="rounded-[10px] p-6 sm:p-8 text-center bg-navy text-cream">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold text-cream/70 mb-2">
                § {isAr ? "قيمة الضريبة" : "VAT AMOUNT"}
              </p>
              <p className="font-display text-5xl sm:text-6xl font-bold tabular-nums leading-none mb-3">
                {calc ? num(calc.vat) : "—"}
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cream/70">
                {isAr ? "جنيه مصري" : "EGP"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label_ar: "قبل الضريبة",
                  label_en: "Before VAT",
                  value: calc?.net,
                },
                {
                  label_ar: "شامل الضريبة",
                  label_en: "Including VAT",
                  value: calc?.gross,
                },
              ].map((row) => (
                <div
                  key={row.label_en}
                  className="bg-paper border border-ink/10 rounded-[10px] shadow-card p-5 text-center"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft/60 mb-2">
                    {isAr ? row.label_ar : row.label_en}
                  </p>
                  <p className="font-display text-2xl sm:text-3xl font-bold text-ink tabular-nums">
                    {calc && row.value !== undefined ? num(row.value) : "—"}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-paper border border-ink/10 rounded-[10px] shadow-card p-5 sm:p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold text-ink-soft/70 mb-3">
                § {isAr ? "الخطوة اللي بعدها" : "WHAT COMES NEXT"}
              </p>
              <p className="prose-body text-sm text-ink/75 mb-4">
                {isAr
                  ? "الضريبة دي لازم تتقدّم لمصلحة الضرائب على كل فاتورة. نُمُو بيولّد الفاتورة الإلكترونية ويبعتها لمنظومة ETA أوتوماتيك — من غير ما تحسب حاجة بإيدك."
                  : "This VAT has to reach the Tax Authority on every invoice. numu generates the e-invoice and files it with ETA automatically — no manual arithmetic anywhere in the loop."}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/?signup=1"
                  className="inline-flex items-center gap-2 rounded-[4px] bg-navy px-5 py-2.5 font-display text-sm font-semibold text-cream transition-colors hover:bg-navy/90"
                >
                  {isAr ? "ابدأ مجاناً" : "Start free"}
                </Link>
                <Link
                  to="/tools/invoice"
                  className="inline-flex items-center gap-2 rounded-[4px] border border-ink/15 px-5 py-2.5 font-display text-sm font-semibold text-ink transition-colors hover:border-navy/40"
                >
                  {isAr ? "مولّد الفواتير" : "Invoice generator"}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Explainer — the reason this page deserves to rank, and the answer
            someone searching "إزاي أحسب الضريبة" actually needs. */}
        <div className="mt-12 max-w-[760px] mx-auto">
          <h2 className="font-display text-2xl font-bold text-ink mb-4">
            {isAr
              ? "إزاي تحسب ضريبة القيمة المضافة؟"
              : "How is VAT calculated?"}
          </h2>
          <div className="flex flex-col gap-4 prose-body text-ink/75 text-sm leading-relaxed">
            <p>
              {isAr
                ? "لو عندك السعر قبل الضريبة: اضرب في ٠٫١٤ (نسبة مصر ١٤٪) عشان تجيب قيمة الضريبة، وزوّدها على السعر."
                : "If you have the price before VAT: multiply by 0.14 (Egypt's 14%) to get the VAT, then add it to the price."}
            </p>
            <p>
              {isAr
                ? "لو عندك سعر شامل الضريبة والمطلوب تستخرجها: اقسم على ١٫١٤ — مش تطرح ١٤٪. الفرق بين الطريقتين حوالي ٢٪ من الإجمالي، وده أكتر غلط بيتكرر في الفواتير اليدوية."
                : "If you have a VAT-inclusive price and need the VAT out of it: divide by 1.14 — do not subtract 14%. The two differ by roughly 2% of the total, and it is the most common error in hand-written invoices."}
            </p>
            <p>
              {isAr
                ? "مثال: منتج بـ ١١٤ جنيه شامل الضريبة. القسمة على ١٫١٤ بتديك ١٠٠ جنيه قبل الضريبة و١٤ جنيه ضريبة. لو طرحت ١٤٪ من ١١٤ كنت هتطلع ٩٨٫٠٤ — وده غلط."
                : "Example: an item at 114 EGP including VAT. Dividing by 1.14 gives 100 EGP net and 14 EGP VAT. Subtracting 14% from 114 would give 98.04 — which is wrong."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tool;
