import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSignupModal } from '../contexts/SignupModalContext';

/**
 * How It Works — 3-step editorial tiles. Matches the brand-kit tagline
 * "ابدأ في ١٥ دقيقة" / "Start in 15 minutes" — Egyptian merchants bounce
 * if they can't answer "how do I start?" in under 10 seconds, so this
 * answers it explicitly with timings per step.
 */

const toArabicDigits = (s: string | number): string =>
  String(s).replace(/[0-9]/g, (d) =>
    String.fromCharCode(0x0660 + parseInt(d, 10)),
  );

interface Step {
  index: string;
  index_ar: string;
  time_en: string;
  time_ar: string;
  title_en: string;
  title_ar: string;
  body_en: string;
  body_ar: string;
  accent: 'saffron' | 'terracotta' | 'sage';
}

const steps: Step[] = [
  {
    index: '01',
    index_ar: '٠١',
    time_en: '30 seconds',
    time_ar: '٣٠ ثانية',
    title_en: 'Sign up.',
    title_ar: 'سجّل.',
    body_en:
      'Email, Google, or the demo flow. No credit card, no sales call. You land in the dashboard in 30 seconds.',
    body_ar:
      'إيميل، جوجل، أو بدء تجريبي. بدون بطاقة ائتمان، بدون مكالمة مبيعات. هتلاقي نفسك في لوحة التحكم في ٣٠ ثانية.',
    accent: 'saffron',
  },
  {
    index: '02',
    index_ar: '٠٢',
    time_en: '10 minutes',
    time_ar: '١٠ دقايق',
    title_en: 'Pick a theme + import products.',
    title_ar: 'اختر ثيم وارفع منتجاتك.',
    body_en:
      'Choose from 40+ Arabic-first themes. Import products from Excel, Instagram, or your existing Shopify store — variants and images auto-generated.',
    body_ar:
      'اختار من +٤٠ ثيم عربي. استورد منتجاتك من إكسل، إنستغرام، أو من متجر شوبيفاي. المتغيرات والصور بتتعمل تلقائي.',
    accent: 'terracotta',
  },
  {
    index: '03',
    index_ar: '٠٣',
    time_en: '3 minutes',
    time_ar: '٣ دقايق',
    title_en: 'Connect Paymob + Bosta.',
    title_ar: 'وصّل بيموب وبوسطة.',
    body_en:
      'One click each. Payments accept cards, Fawry, and cash on delivery; Bosta prints waybills and sets governorate rates. You\'re live.',
    body_ar:
      'ضغطة لكل واحد. الدفع بيشغّل كروت وفوري والدفع عند الاستلام؛ بوسطة بتطبع البوالص وتظبّط أسعار المحافظات. متجرك شغّال.',
    accent: 'sage',
  },
];

const accentMap: Record<
  Step['accent'],
  { numeral: string; bar: string; label: string; labelBg: string }
> = {
  saffron: {
    numeral: 'text-saffron',
    bar: 'bg-saffron',
    label: 'text-saffron',
    labelBg: 'bg-saffron/10 border-saffron/40',
  },
  terracotta: {
    numeral: 'text-terracotta',
    bar: 'bg-terracotta',
    label: 'text-terracotta',
    labelBg: 'bg-terracotta/10 border-terracotta/30',
  },
  sage: {
    numeral: 'text-sage',
    bar: 'bg-sage',
    label: 'text-sage',
    labelBg: 'bg-sage/10 border-sage/40',
  },
};

const HowItWorks: React.FC = () => {
  const { language } = useLanguage();
  const { open: openSignup } = useSignupModal();
  const isAr = language === 'ar';

  return (
    <div className="max-w-[1360px] mx-auto w-full px-4 sm:px-6 lg:px-10">
      <div className="text-center mb-10 sm:mb-14">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-terracotta font-semibold">
            § HOW IT WORKS
          </span>
          <span className="eyebrow">
            {isAr
              ? `من الصفر لمتجر شغّال في ${toArabicDigits(15)} دقيقة`
              : 'FROM ZERO TO LIVE STORE IN 15 MINUTES'}
          </span>
        </div>
        <h2 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-bold text-ink tracking-tight leading-[1.05] mb-5">
          {isAr ? (
            <>
              افتح متجرك في{' '}
              <span className="text-terracotta">
                {toArabicDigits(15)} دقيقة.
              </span>
            </>
          ) : (
            <>
              Launch your store in{' '}
              <span className="text-terracotta">15 minutes.</span>
            </>
          )}
        </h2>
        <p className="prose-body text-ink/75 max-w-2xl mx-auto">
          {isAr
            ? 'مفيش مبرمج، مفيش مكالمة مبيعات، مفيش بطاقة ائتمان. تلات خطوات.'
            : 'No developer, no sales call, no credit card. Three steps.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 mb-10">
        {steps.map((step) => {
          const a = accentMap[step.accent];
          return (
            <article
              key={step.index}
              className="relative bg-paper border border-ink/10 rounded-[10px] shadow-card p-6 sm:p-8 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 ease-numu"
            >
              <span
                aria-hidden="true"
                className={`absolute top-0 start-0 w-12 h-[3px] ${a.bar}`}
              />

              <p
                className={`font-display text-[72px] sm:text-[88px] font-bold leading-none tabular-nums tracking-tight ${a.numeral} mb-2`}
              >
                {isAr ? step.index_ar : step.index}
              </p>

              <span
                className={`inline-flex items-center gap-1.5 ${a.labelBg} border rounded-[4px] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] font-semibold ${a.label} mb-4`}
              >
                <span
                  aria-hidden="true"
                  className={`size-1 rounded-full ${a.bar}`}
                />
                {isAr ? step.time_ar : step.time_en}
              </span>

              <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink tracking-tight leading-tight mb-3">
                {isAr ? step.title_ar : step.title_en}
              </h3>
              <p className="prose-body-sm text-ink/75">
                {isAr ? step.body_ar : step.body_en}
              </p>
            </article>
          );
        })}
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={() => openSignup()}
          className="group inline-flex items-center gap-3 bg-navy text-cream font-semibold py-3.5 px-7 rounded-[4px] shadow-card hover:bg-navy-800 active:scale-[0.985] transition-all duration-200 ease-numu text-sm sm:text-base"
        >
          <span>{isAr ? 'ابدأ دلوقتي' : 'Start now'}</span>
          <span
            aria-hidden="true"
            className="text-lg text-saffron group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform rtl:rotate-180"
          >
            →
          </span>
        </button>
      </div>
    </div>
  );
};

export default HowItWorks;
