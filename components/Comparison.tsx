import React from "react";
import { useLanguage } from "../contexts/LanguageContext";

/**
 * "No Tricks" — direct comparison against regional/global commerce platforms.
 * Lifted from the brand kit's مقارنة_صريحة___بدون_حيل editorial post.
 * The actual competitive pitch: transparent pricing, zero commission,
 * Arabic-first, local integrations out of the box.
 */

interface Row {
  label_ar: string;
  label_en: string;
  numu_ar: string;
  numu_en: string;
  others_ar: string;
  others_en: string;
  /** Render competitor value with strike-through to call out the hidden cost */
  strikeOthers?: boolean;
  /** Render numu value as a checkmark, others as X */
  boolean?: boolean;
}

const rows: Row[] = [
  {
    label_ar: "اشتراك شهري",
    label_en: "Monthly subscription",
    numu_ar: "يبدأ من ٢٥٠ ج.م",
    numu_en: "From 250 EGP",
    others_ar: "مجاني",
    others_en: "Free",
    strikeOthers: true,
  },
  {
    label_ar: "عمولة على الأوردر",
    label_en: "Per-order commission",
    numu_ar: "٠٪",
    numu_en: "0%",
    others_ar: "٣٪ – ٧٪",
    others_en: "3% – 7%",
    strikeOthers: true,
  },
  {
    label_ar: "رسوم دفع",
    label_en: "Payment fees",
    numu_ar: "واضحة",
    numu_en: "Disclosed",
    others_ar: "مخفية",
    others_en: "Hidden",
    strikeOthers: true,
  },
  {
    label_ar: "دعم بالعربي",
    label_en: "Arabic support",
    numu_ar: "",
    numu_en: "",
    others_ar: "",
    others_en: "",
    boolean: true,
  },
  {
    label_ar: "تكاملات محلية (بيموب · فوري · بوسطة)",
    label_en: "Local integrations (Paymob · Fawry · Bosta)",
    numu_ar: "",
    numu_en: "",
    others_ar: "",
    others_en: "",
    boolean: true,
  },
  {
    label_ar: "فاتورة إلكترونية ETA",
    label_en: "ETA e-invoicing",
    numu_ar: "",
    numu_en: "",
    others_ar: "",
    others_en: "",
    boolean: true,
  },
];

const Comparison: React.FC = () => {
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <div className="max-w-[1200px] mx-auto w-full px-4 sm:px-6 lg:px-10">
      {/* Header */}
      <div className="mb-8 sm:mb-10 text-center">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cream bg-terracotta px-2.5 py-1 rounded-[2px] font-semibold">
            NO TRICKS · {isAr ? "بدون حيل" : "SIMPLY HONEST"}
          </span>
        </div>
        <h2 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-bold text-ink tracking-tight leading-[1.05] mb-5">
          {isAr ? (
            <>
              بيقولوا{" "}
              <span className="relative inline-block">
                مجاني
                <span
                  aria-hidden="true"
                  className="absolute start-0 end-0 top-1/2 h-[3px] bg-terracotta -translate-y-1/2"
                />
              </span>
              .<br />
              وياخدوا من <span className="text-terracotta">مبيعاتك.</span>
            </>
          ) : (
            <>
              They say{" "}
              <span className="relative inline-block">
                "free"
                <span
                  aria-hidden="true"
                  className="absolute start-0 end-0 top-1/2 h-[3px] bg-terracotta -translate-y-1/2"
                />
              </span>
              .<br />
              Then take a cut of your{" "}
              <span className="text-terracotta">sales.</span>
            </>
          )}
        </h2>
        <p className="prose-body text-ink/75 max-w-2xl mx-auto">
          {isAr
            ? "شفّاف من الأول. مفيش نسبة خفية، مفيش رسوم مستخبية."
            : "Transparent from day one. No hidden percentage. No surprise fees."}
        </p>
      </div>

      {/* Comparison table */}
      <div className="bg-paper border border-ink/10 rounded-[10px] overflow-hidden shadow-card">
        {/* Header row */}
        <div className="grid grid-cols-[1.3fr_1fr_1fr] sm:grid-cols-[1.5fr_1fr_1fr]">
          <div className="p-4 sm:p-5 bg-paper" />
          <div className="p-4 sm:p-5 bg-saffron flex items-center justify-center gap-2 border-s border-ink/10">
            <span className="font-display text-lg sm:text-xl font-bold text-ink tracking-tight">
              {isAr ? "نُمُو" : "numu"}
            </span>
            <span
              className="size-1.5 rounded-full bg-sage"
              aria-hidden="true"
            />
          </div>
          <div className="p-4 sm:p-5 bg-navy flex items-center justify-center border-s border-ink/10">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] font-semibold text-cream/80">
              {isAr ? "منصات تانية" : "Other platforms"}
            </span>
          </div>
        </div>

        {/* Data rows */}
        {rows.map((row, i) => {
          const label = isAr ? row.label_ar : row.label_en;
          const numuVal = isAr ? row.numu_ar : row.numu_en;
          const othersVal = isAr ? row.others_ar : row.others_en;
          const isOdd = i % 2 === 1;

          return (
            <div
              key={label}
              className={`grid grid-cols-[1.3fr_1fr_1fr] sm:grid-cols-[1.5fr_1fr_1fr] border-t border-ink/10 ${
                isOdd ? "bg-cream/40" : ""
              }`}
            >
              {/* Label */}
              <div className="p-4 sm:p-5 flex items-center">
                <span className="font-display text-sm sm:text-base font-semibold text-ink">
                  {label}
                </span>
              </div>

              {/* numu column — always in saffron accent surface */}
              <div className="p-4 sm:p-5 flex items-center justify-center border-s border-ink/10 bg-saffron/10">
                {row.boolean ? (
                  <svg
                    className="size-6 text-sage"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    aria-label={isAr ? "نعم" : "Yes"}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                ) : (
                  <span className="font-display text-sm sm:text-base font-bold text-terracotta tracking-tight text-center">
                    {numuVal}
                  </span>
                )}
              </div>

              {/* Others column — struck-through or ✗ */}
              <div className="p-4 sm:p-5 flex items-center justify-center border-s border-ink/10">
                {row.boolean ? (
                  <svg
                    className="size-5 text-terracotta/60"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    aria-label={isAr ? "لا" : "No"}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <span
                    className={`text-sm sm:text-base text-ink-soft/55 text-center ${
                      row.strikeOthers ? "line-through decoration-terracotta decoration-2" : ""
                    }`}
                  >
                    {othersVal}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footnote */}
      <p className="mt-6 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft/60">
        {isAr
          ? "شفّاف من الأول · مفيش نسبة خفية · مفيش رسوم مستخبية"
          : "Transparent from day one · No hidden percentages · No surprise fees"}
      </p>
    </div>
  );
};

export default Comparison;
