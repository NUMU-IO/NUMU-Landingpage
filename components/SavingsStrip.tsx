import React, { useMemo, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

/**
 * Savings strip — interactive ROI calculator placed directly above Pricing.
 * Shows the annual cost a 3%-commission competitor would take from you vs
 * what numu takes (zero). The point is to make the 0% commission tangible,
 * not just a feature bullet.
 *
 * Assumption: a typical regional commerce platform takes ~3% of each order.
 * numu takes 0%. Delta is the annual saving.
 */

const OTHER_PLATFORM_PCT = 0.03;

const toArabicDigits = (s: string | number): string =>
  String(s).replace(/[0-9]/g, (d) =>
    String.fromCharCode(0x0660 + parseInt(d, 10)),
  );

/** Normalise Arabic-Indic digits back to ASCII. Needed because the input
 *  renders in whichever script `isAr` dictates, so keystrokes arrive mixed
 *  and clampInt must accept both ranges. */
const arabicDigitsToWestern = (s: string): string =>
  s.replace(/[٠-٩]/g, (d) =>
    String(d.charCodeAt(0) - 0x0660),
  );

const formatEGP = (amount: number, isAr: boolean): string => {
  const rounded = Math.round(amount);
  const withCommas = rounded.toLocaleString("en-US");
  return isAr ? toArabicDigits(withCommas) : withCommas;
};

const SavingsStrip: React.FC = () => {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [ordersPerMonth, setOrdersPerMonth] = useState(500);
  const [avgOrderValue, setAvgOrderValue] = useState(300);

  const { monthlyCommission, annualCommission } = useMemo(() => {
    const monthlyVolume = ordersPerMonth * avgOrderValue;
    const m = monthlyVolume * OTHER_PLATFORM_PCT;
    return { monthlyCommission: m, annualCommission: m * 12 };
  }, [ordersPerMonth, avgOrderValue]);

  /** Accept both Arabic-Indic and Western digits; strip commas, spaces,
   *  and any other junk before parsing. Clamp to sensible bounds. */
  const clampInt = (raw: string, fallback: number, max = 1_000_000): number => {
    const normalised = arabicDigitsToWestern(raw).replace(/[^0-9]/g, "");
    if (!normalised) return fallback;
    const n = parseInt(normalised, 10);
    if (!Number.isFinite(n) || n < 0) return fallback;
    return Math.min(n, max);
  };

  const inputClass =
    "h-11 px-3 rounded-[4px] bg-cream border border-ink/25 text-ink text-base font-display font-semibold tabular-nums focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20 transition-all";
  const labelClass =
    "font-mono text-[10px] uppercase tracking-[0.18em] font-semibold text-navy";

  return (
    <div className="max-w-[1100px] mx-auto w-full px-4 sm:px-6 lg:px-10">
      <div className="relative bg-paper border border-ink/10 rounded-[14px] shadow-card overflow-hidden">
        {/* Saffron accent rail */}
        <span
          aria-hidden="true"
          className="absolute top-0 start-0 w-24 h-[3px] bg-saffron"
        />

        {/* Header */}
        <div className="px-6 sm:px-8 lg:px-10 pt-6 sm:pt-7">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold text-terracotta block mb-1">
            § SAVINGS CALCULATOR
          </span>
          <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink tracking-tight leading-tight">
            {isAr
              ? "هتوفّر كام لو عندك متجر نُمُو؟"
              : "How much would numu save you?"}
          </h3>
        </div>

        {/* Inputs — side by side, easy to scan */}
        <div className="px-6 sm:px-8 lg:px-10 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="savings-orders" className={labelClass}>
                {isAr ? "أوردرات / شهر" : "Orders / month"}
              </label>
              <input
                id="savings-orders"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="off"
                value={isAr ? toArabicDigits(ordersPerMonth) : ordersPerMonth}
                onChange={(e) =>
                  setOrdersPerMonth(clampInt(e.target.value, 0, 100_000))
                }
                dir="ltr"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="savings-aov" className={labelClass}>
                {isAr ? "متوسط الأوردر (EGP)" : "Avg order (EGP)"}
              </label>
              <input
                id="savings-aov"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="off"
                value={isAr ? toArabicDigits(avgOrderValue) : avgOrderValue}
                onChange={(e) =>
                  setAvgOrderValue(clampInt(e.target.value, 0, 100_000))
                }
                dir="ltr"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Comparison — what others take vs what you keep */}
        <div className="mt-6 mx-6 sm:mx-8 lg:mx-10 mb-6 sm:mb-7 grid grid-cols-1 md:grid-cols-2 rounded-[10px] overflow-hidden border border-ink/10">
          {/* What others take */}
          <div className="bg-terracotta/5 p-5 sm:p-6 flex flex-col gap-1 border-b md:border-b-0 md:border-e border-terracotta/15">
            <div className="flex items-center gap-2 mb-1">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-terracotta"
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold text-terracotta">
                {isAr
                  ? `منصة بتاخد ${toArabicDigits(3)}٪`
                  : "A 3%-commission platform"}
              </span>
            </div>
            <p className="font-display text-[28px] sm:text-[36px] lg:text-[40px] font-bold text-terracotta tabular-nums leading-none tracking-tight line-through decoration-[2px] decoration-terracotta/60">
              {formatEGP(annualCommission, isAr)}{" "}
              <span className="text-terracotta/70 text-lg sm:text-xl">EGP</span>
            </p>
            <p className="prose-body-sm text-ink/65">
              {isAr
                ? `بيطير من جيبك سنوياً · ${formatEGP(monthlyCommission, isAr)} EGP كل شهر`
                : `out of your pocket per year · ${formatEGP(monthlyCommission, isAr)} EGP monthly`}
            </p>
          </div>

          {/* What you keep on numu */}
          <div className="bg-saffron/10 p-5 sm:p-6 flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-1">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-saffron animate-pulse"
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold text-saffron">
                {isAr ? `على نُمُو · ${toArabicDigits(0)}٪ عمولة` : "On numu · 0% commission"}
              </span>
            </div>
            <p className="font-display text-[32px] sm:text-[44px] lg:text-[52px] font-bold text-saffron tabular-nums leading-none tracking-tight">
              {isAr ? `+${formatEGP(annualCommission, isAr)}` : `+${formatEGP(annualCommission, isAr)}`}{" "}
              <span className="text-saffron/80 text-xl sm:text-2xl">EGP</span>
            </p>
            <p className="prose-body-sm text-ink/75">
              {isAr
                ? "في جيبك · كل سنة · بدون عمولة"
                : "in your pocket · every year · no commission"}
            </p>
          </div>
        </div>

        {/* Footnote */}
        <div className="px-6 sm:px-8 lg:px-10 pb-5 border-t border-bone pt-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft/55">
            {isAr
              ? "حساب تقديري · مقارنة بنسبة عمولة ٣٪. الأرقام بتتغيّر بنسبة الخصم الفعلية في متجرك."
              : "Illustrative · assumes a 3% benchmark. Your real saving depends on the commission you pay today."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SavingsStrip;
