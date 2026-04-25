import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { useSEO } from "../../hooks/useSEO";

/**
 * Profit margin calculator — free SEO tool (audit §2.6). Targets Arabic
 * long-tail searches "حاسبة هامش الربح", "إزاي أحسب الربح". Everything
 * client-side. COD-aware: optional shipping cost deducted before margin
 * because 70%+ of Egyptian orders are COD and shipping is a real cost.
 */

const toArabicDigits = (s: string): string =>
  s.replace(/[0-9]/g, (d) => String.fromCharCode(0x0660 + parseInt(d, 10)));

const arabicToWestern = (s: string): string =>
  s.replace(/[٠-٩]/g, (d) =>
    String(d.charCodeAt(0) - 0x0660),
  );

// Accept Western or Arabic-Indic digits, return a finite number or NaN.
const parseNum = (raw: string): number => {
  const cleaned = arabicToWestern(raw).replace(/[^0-9.]/g, "");
  if (!cleaned) return NaN;
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : NaN;
};

const fmt = (n: number, isAr: boolean, digits = 2): string => {
  if (!Number.isFinite(n)) return "—";
  const out = n.toLocaleString(isAr ? "ar-EG" : "en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
  return out;
};

const Tool: React.FC = () => {
  const { dir, language } = useLanguage();
  const isAr = language === "ar";

  useSEO({
    title: isAr
      ? "حاسبة هامش الربح المجانية — نُمُو"
      : "Profit margin calculator — numu",
    description: isAr
      ? "احسب هامش الربح ونسبة المارك-أب والربح الصافي بالجنيه المصري فوراً. تحسب تكلفة الشحن للدفع عند الاستلام. مجاني، بدون تسجيل."
      : "Calculate profit margin, markup %, and net profit in EGP instantly. Accounts for COD shipping cost. Free, no signup.",
    canonical: "https://numueg.app/tools/profit-margin",
  });

  const [cost, setCost] = useState("120");
  const [price, setPrice] = useState("300");
  const [shipping, setShipping] = useState("");
  const [quantity, setQuantity] = useState("1");

  const calc = useMemo(() => {
    const c = parseNum(cost);
    const p = parseNum(price);
    const s = parseNum(shipping) || 0;
    const q = Math.max(1, Math.floor(parseNum(quantity) || 1));

    if (!Number.isFinite(c) || !Number.isFinite(p)) return null;

    const grossPerUnit = p - c;
    const netPerUnit = grossPerUnit - s;
    const margin = p > 0 ? (netPerUnit / p) * 100 : 0;
    const markup = c > 0 ? (netPerUnit / c) * 100 : 0;
    const totalProfit = netPerUnit * q;
    const totalRevenue = p * q;

    // Reverse: what to sell at to hit targetMargin% on this cost?
    const targets = [20, 30, 40, 50].map((t) => ({
      margin: t,
      suggestedPrice: c > 0 ? (c + s) / (1 - t / 100) : 0,
    }));

    return {
      grossPerUnit,
      netPerUnit,
      margin,
      markup,
      totalProfit,
      totalRevenue,
      targets,
      healthy: margin >= 25,
      warning: margin < 10 && Number.isFinite(margin),
    };
  }, [cost, price, shipping, quantity]);

  const showArabic = isAr;

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
        <div className="inline-flex items-center gap-2 bg-navy/10 border border-navy/30 rounded-[4px] px-3 py-1 mb-5">
          <span className="size-1.5 rounded-full bg-navy" aria-hidden="true" />
          <span className="font-mono text-[10px] font-semibold text-navy uppercase tracking-[0.18em]">
            § PROFIT MARGIN · COD-AWARE
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight leading-[1.08] mb-4 max-w-3xl mx-auto">
          {isAr ? (
            <>
              شوف ربحك الحقيقي
              {" "}
              <span className="text-terracotta">في ثانية.</span>
            </>
          ) : (
            <>
              See your true profit{" "}
              <span className="text-terracotta">in seconds.</span>
            </>
          )}
        </h1>
        <p className="prose-body text-ink/75 max-w-2xl mx-auto">
          {isAr
            ? "اكتب تكلفة المنتج وسعر بيعه، احسب هامش الربح، المارك-أب، والربح الصافي — بتكلفة الشحن للدفع عند الاستلام."
            : "Enter your product cost and sale price — see margin %, markup %, and net profit with COD shipping factored in."}
        </p>
      </div>

      <div className="relative z-10 max-w-[1000px] mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Inputs */}
          <div className="lg:col-span-2 bg-paper border border-ink/10 rounded-[10px] shadow-card p-5 sm:p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold text-ink-soft/70 mb-4">
              § {isAr ? "المدخلات" : "INPUTS"}
            </p>
            <div className="flex flex-col gap-5">
              {[
                {
                  id: "cost",
                  val: cost,
                  set: setCost,
                  label_ar: "تكلفة المنتج",
                  label_en: "Product cost",
                  hint_ar: "التكلفة للوحدة الواحدة (ج.م)",
                  hint_en: "Per-unit cost (EGP)",
                },
                {
                  id: "price",
                  val: price,
                  set: setPrice,
                  label_ar: "سعر البيع",
                  label_en: "Sale price",
                  hint_ar: "سعر البيع للوحدة (ج.م)",
                  hint_en: "Per-unit sale price (EGP)",
                },
                {
                  id: "shipping",
                  val: shipping,
                  set: setShipping,
                  label_ar: "تكلفة الشحن (اختياري)",
                  label_en: "Shipping cost (optional)",
                  hint_ar: "للدفع عند الاستلام — بيقلل الربح",
                  hint_en: "For COD orders — reduces profit",
                },
                {
                  id: "quantity",
                  val: quantity,
                  set: setQuantity,
                  label_ar: "الكمية",
                  label_en: "Quantity",
                  hint_ar: "لحساب الربح الإجمالي",
                  hint_en: "For total profit",
                },
              ].map((f) => (
                <div key={f.id}>
                  <label
                    htmlFor={f.id}
                    className="block font-display text-sm font-semibold text-ink mb-1"
                  >
                    {isAr ? f.label_ar : f.label_en}
                  </label>
                  <input
                    id={f.id}
                    type="text"
                    inputMode="decimal"
                    value={f.val}
                    onChange={(e) => f.set(e.target.value)}
                    className="w-full h-11 px-3 bg-cream border border-ink/15 rounded-[4px] font-display text-base text-ink tabular-nums focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20 transition-all duration-200 ease-numu"
                    dir="ltr"
                  />
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft/55">
                    {isAr ? f.hint_ar : f.hint_en}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {/* Primary result — margin % huge */}
            <div
              className={`rounded-[10px] p-6 sm:p-8 text-center ${
                calc?.warning
                  ? "bg-terracotta text-cream"
                  : calc?.healthy
                    ? "bg-sage/90 text-cream"
                    : "bg-navy text-cream"
              }`}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold text-cream/70 mb-2">
                § {isAr ? "هامش الربح" : "PROFIT MARGIN"}
              </p>
              <p className="font-display text-5xl sm:text-6xl font-bold tabular-nums leading-none mb-3">
                {calc
                  ? showArabic
                    ? `${toArabicDigits(calc.margin.toFixed(1))}%`
                    : `${calc.margin.toFixed(1)}%`
                  : "—"}
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-cream/85">
                {calc?.warning
                  ? isAr
                    ? "تحذير · الهامش منخفض"
                    : "Warning · low margin"
                  : calc?.healthy
                    ? isAr
                      ? "جيد · هامش صحي"
                      : "Healthy margin"
                    : isAr
                      ? "عادي"
                      : "Standard"}
              </p>
            </div>

            {/* KPI grid — accent bars use static class strings so Tailwind
                JIT can discover them at build time. */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label_ar: "الربح الصافي / وحدة",
                  label_en: "Net profit / unit",
                  value: calc
                    ? `${showArabic ? toArabicDigits(fmt(calc.netPerUnit, isAr)) : fmt(calc.netPerUnit, isAr)} ${isAr ? "ج.م" : "EGP"}`
                    : "—",
                  accentClass: "bg-navy",
                },
                {
                  label_ar: "المارك-أب",
                  label_en: "Markup %",
                  value: calc
                    ? `${showArabic ? toArabicDigits(calc.markup.toFixed(1)) : calc.markup.toFixed(1)}%`
                    : "—",
                  accentClass: "bg-saffron",
                },
                {
                  label_ar: "الربح الإجمالي",
                  label_en: "Total profit",
                  value: calc
                    ? `${showArabic ? toArabicDigits(fmt(calc.totalProfit, isAr, 0)) : fmt(calc.totalProfit, isAr, 0)} ${isAr ? "ج.م" : "EGP"}`
                    : "—",
                  accentClass: "bg-terracotta",
                },
                {
                  label_ar: "الإيرادات",
                  label_en: "Total revenue",
                  value: calc
                    ? `${showArabic ? toArabicDigits(fmt(calc.totalRevenue, isAr, 0)) : fmt(calc.totalRevenue, isAr, 0)} ${isAr ? "ج.م" : "EGP"}`
                    : "—",
                  accentClass: "bg-sage",
                },
              ].map((k, i) => (
                <div
                  key={i}
                  className="relative bg-paper border border-ink/10 rounded-[10px] p-4 sm:p-5"
                >
                  <span
                    aria-hidden="true"
                    className={`absolute top-0 start-0 w-8 h-[3px] ${k.accentClass}`}
                  />
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft/60 font-semibold mb-1.5">
                    {isAr ? k.label_ar : k.label_en}
                  </p>
                  <p className="font-display text-xl sm:text-2xl font-bold text-ink tabular-nums leading-none">
                    {k.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Target-margin reverse lookup */}
            {calc && Number.isFinite(parseNum(cost)) && parseNum(cost) > 0 && (
              <div className="bg-paper border border-ink/10 rounded-[10px] p-5 sm:p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold text-ink-soft/70 mb-3">
                  § {isAr ? "عشان تحقّق هامش هدف" : "HIT A TARGET MARGIN"}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {calc.targets.map((t) => (
                    <div
                      key={t.margin}
                      className="text-center bg-cream border border-ink/10 rounded-[4px] p-3"
                    >
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft/60 mb-1">
                        {showArabic
                          ? `${toArabicDigits(String(t.margin))}% هامش`
                          : `${t.margin}% margin`}
                      </p>
                      <p className="font-display text-base font-bold text-navy tabular-nums">
                        {showArabic
                          ? `${toArabicDigits(fmt(t.suggestedPrice, isAr, 0))} ج.م`
                          : `${fmt(t.suggestedPrice, isAr, 0)} EGP`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="mt-6 bg-cream border border-ink/10 rounded-[10px] p-4 sm:p-5">
          <p className="prose-body-sm text-ink/70">
            {isAr
              ? "🇪🇬 للدفع عند الاستلام في مصر: اتوقع ١٠–٢٠% RTO (أوردرات مرفوضة). لو عايز تحسب خسارة الـ RTO اضرب الربح × (١ - معدل RTO). numu Trust Network بيقلل الـ RTO."
              : "🇪🇬 For Egyptian COD: expect 10-20% RTO (refused orders). To model RTO loss, multiply net profit × (1 − RTO rate). numu Trust Network reduces RTO."}
          </p>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 bg-navy rounded-[14px] p-6 sm:p-8 text-center">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-cream tracking-tight mb-2">
            {isAr
              ? "نُمُو بيحسب كل ده تلقائي على كل أوردر."
              : "numu runs these numbers on every order automatically."}
          </h2>
          <p className="prose-body-sm text-cream/75 max-w-xl mx-auto mb-5">
            {isAr
              ? "لوحة تحكم بتشوف فيها الهامش، المخزون، وRTO في الوقت الفعلي."
              : "A dashboard that shows margin, inventory, and RTO in real time."}
          </p>
          <Link
            to="/?demo=1"
            className="group inline-flex items-center justify-center gap-2 bg-cream text-navy font-semibold py-3 px-6 rounded-[4px] hover:bg-cream/90 active:scale-[0.985] transition-all duration-200 ease-numu"
          >
            <span>{isAr ? "جرّب الداشبورد" : "See the dashboard"}</span>
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
