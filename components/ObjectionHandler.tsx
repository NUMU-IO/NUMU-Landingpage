import React from "react";
import { useLanguage } from "../contexts/LanguageContext";

/**
 * Objection handler — 4 killer objections + direct answers, placed
 * directly before Pricing so visitors arrive at the price already
 * disarmed. Lifted from the brand-kit's
 * Objection___مش_عارف_أبرمج.png and hc-feed carousel copy.
 */

interface Row {
  obj_en: string;
  obj_ar: string;
  ans_en: string;
  ans_ar: string;
  emphasis_en?: string;
  emphasis_ar?: string;
}

const rows: Row[] = [
  {
    obj_en: "I can't code.",
    obj_ar: "مش عارف أبرمج.",
    ans_en:
      "Neither does numu. Themes, products, payments — all click-to-configure. If you've used Instagram, you can use numu.",
    ans_ar:
      "ولا إحنا بنعرف ! بتحتاج ثيمات، منتجات، دفع — كله بضغطة زرار. لو استخدمت إنستغرام، تقدر تستخدم نُمُو.",
    emphasis_en: "zero code",
    emphasis_ar: "بدون كود",
  },
  {
    obj_en: "Starting costs are too high.",
    obj_ar: "تكاليف البداية عالية.",
    ans_en:
      "250 EGP/month. No percentage on orders. No hidden payment fees. No setup charge. That's it.",
    ans_ar:
      "٢٥٠ جنيه/شهر. مفيش نسبة على الأوردرات. مفيش رسوم دفع مخفية. مفيش رسوم تأسيس. وخلاص.",
    emphasis_en: "250 EGP/month",
    emphasis_ar: "٢٥٠ جنيه/شهر",
  },
  {
    obj_en: "Support never actually replies.",
    obj_ar: "الدعم مبيوصلش فعلاً.",
    ans_en:
      "WhatsApp, email, or a scheduled call — all three reply in Arabic within an hour during business hours. First 100 merchants get a direct Slack line to the team.",
    ans_ar:
      "واتساب، إيميل، أو مكالمة متحجوزة — كلهم بيردّوا بالعربي في أقل من ساعة في أوقات العمل. أول ١٠٠ تاجر بياخدوا سلاك مباشر مع الفريق.",
    emphasis_en: "under 1 hour",
    emphasis_ar: "أقل من ساعة",
  },
  {
    obj_en: "I'll get locked in / lose my data.",
    obj_ar: "هتقفل عليّ / هفقد بياناتي.",
    ans_en:
      "Products, customers, orders — all exportable to CSV any time. No contracts, no penalty to leave. Trust Network data stays hashed (you couldn't leak it even if you wanted to).",
    ans_ar:
      "المنتجات، العملاء، الأوردرات — كلها بتتصدّر لـ CSV في أي وقت. مفيش عقود، مفيش غرامة للخروج. داتا شبكة الثقة مُعمّاة (حتى لو حبيت ما تقدرش تسرّبها).",
    emphasis_en: "CSV export anytime",
    emphasis_ar: "تصدير CSV أي وقت",
  },
];

const ObjectionHandler: React.FC = () => {
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <div className="max-w-[1100px] mx-auto w-full px-4 sm:px-6 lg:px-10">
      <div className="text-center mb-10 sm:mb-12">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cream bg-terracotta px-2.5 py-1 rounded-[2px] font-semibold">
            {isAr ? "ردّ على الاعتراضات · صريح" : "STRAIGHT ANSWERS · NO SPIN"}
          </span>
        </div>
        <h2 className="font-display text-4xl sm:text-5xl lg:text-[52px] font-bold text-ink tracking-tight leading-[1.05] mb-5">
          {isAr ? (
            <>
              عارفين إنت <span className="text-terracotta">بتفكر في إيه.</span>
            </>
          ) : (
            <>
              We know what you're{" "}
              <span className="text-terracotta">thinking.</span>
            </>
          )}
        </h2>
        <p className="prose-body text-ink/75 max-w-2xl mx-auto">
          {isAr
            ? "أربعة اعتراضات بنسمعها من كل تاجر قبل ما يبدأ. الرد بصراحة:"
            : "Four objections every merchant raises before signing up. The honest answers:"}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {rows.map((row, idx) => {
          const obj = isAr ? row.obj_ar : row.obj_en;
          const ans = isAr ? row.ans_ar : row.ans_en;
          const emphasis = isAr ? row.emphasis_ar : row.emphasis_en;
          return (
            <div
              key={obj}
              className="grid grid-cols-1 md:grid-cols-[minmax(200px,1fr)_2fr] gap-0 bg-paper border border-ink/10 rounded-[10px] overflow-hidden shadow-card"
            >
              {/* Objection side — terracotta editorial */}
              <div className="bg-terracotta/5 border-b md:border-b-0 md:border-e border-terracotta/20 p-5 sm:p-6 flex flex-col justify-center">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-terracotta font-semibold mb-2">
                  {isAr
                    ? `اعتراض ${String(idx + 1)
                        .padStart(2, "0")
                        .replace(/[0-9]/g, (d) =>
                          String.fromCharCode(0x0660 + parseInt(d, 10)),
                        )}`
                    : `OBJECTION ${String(idx + 1).padStart(2, "0")}`}
                </span>
                <p className="font-display text-lg sm:text-xl font-semibold text-ink tracking-tight leading-tight">
                  "{obj}"
                </p>
              </div>
              {/* Answer side — paper with emphasis chip */}
              <div className="p-5 sm:p-6 flex flex-col justify-center">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-sage font-semibold mb-2">
                  {isAr ? "الرد" : "ANSWER"}
                </span>
                <p className="prose-body text-ink/80">{ans}</p>
                {emphasis && (
                  <span className="inline-flex items-center self-start mt-3 gap-1.5 bg-saffron/15 border border-saffron/40 rounded-[4px] px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.14em] font-semibold text-saffron">
                    <span
                      className="size-1 rounded-full bg-saffron"
                      aria-hidden="true"
                    />
                    {emphasis}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft/60">
        {isAr
          ? "شافف من أول يوم · لو شايف فيه إجابة ناقصة، اكتبلنا."
          : "Transparent from day one · see a missing answer? Tell us."}
      </p>
    </div>
  );
};

export default ObjectionHandler;
