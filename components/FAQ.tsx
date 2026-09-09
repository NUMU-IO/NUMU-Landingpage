import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { DEFAULT_TRIAL_DAYS, toArabicDigits } from '../lib/trialInfo';

/**
 * FAQ section — emits its own FAQPage JSON-LD from the same `items` array
 * that renders the visible copy, so schema can never drift from what's
 * on-page. Google only grants rich results when the two match exactly.
 */

interface FAQItem {
  q_en: string;
  q_ar: string;
  a_en: string;
  a_ar: string;
}

const items: FAQItem[] = [
  {
    q_en: 'What payment gateways does numu support?',
    q_ar: 'إيه بوابات الدفع اللي نُمُو بيدعمها؟',
    a_en:
      'numu natively integrates with Paymob and Fawry for card and wallet payments, and supports Cash on Delivery (COD) with advanced fee configuration for Egypt and the GCC. Kashier is also available for unified payments.',
    a_ar:
      'نُمُو متصل مباشرة بـ بيموب وفوري للدفع بالكروت والمحافظ، وبيدعم الدفع عند الاستلام مع إعدادات متقدمة للرسوم في مصر والخليج. Kashier كمان متاحة كبوابة موحّدة.',
  },
  {
    q_en: 'Does numu support Arabic storefronts?',
    q_ar: 'نُمُو بيدعم واجهات عربي؟',
    a_en:
      'Yes. numu is Arabic-first with full RTL (right-to-left) support across the dashboard and customer storefronts. All content can be managed bilingually in Arabic and English.',
    a_ar:
      'أيوه. نُمُو عربي الأول — RTL كامل في لوحة التحكم والمتاجر. كل المحتوى بتقدر تديره بالعربي والإنجليزي.',
  },
  {
    q_en: 'How does numu handle shipping in Egypt?',
    q_ar: 'إزاي نُمُو بيدير الشحن في مصر؟',
    a_en:
      'numu integrates directly with Bosta for automated waybill generation and governorate-based shipping rates across Egypt. Merchants ship orders without touching a single form.',
    a_ar:
      'نُمُو متصل مباشرة ببوسطة — بوالص تلقائية وأسعار بالمحافظة. التاجر مش هيلمس ورقة ولا يملأ فورم.',
  },
  {
    q_en: 'Is numu compliant with Egyptian tax regulations?',
    q_ar: 'نُمُو متوافق مع مصلحة الضرائب؟',
    a_en:
      'Yes. numu automatically generates ETA (Egyptian Tax Authority) compliant e-invoices for every transaction, keeping your business fully tax-compliant without manual work.',
    a_ar:
      'أيوه. نُمُو بيطلع فاتورة إلكترونية متوافقة مع ETA (مصلحة الضرائب) تلقائي على كل أوردر. متجرك مظبوط ضريبياً بدون تدخّل يدوي.',
  },
  {
    q_en: 'Can I sell on WhatsApp and Instagram with numu?',
    q_ar: 'أقدر أبيع من واتساب وإنستغرام من نُمُو؟',
    a_en:
      'Yes. numu supports multi-channel selling from a single dashboard — website, WhatsApp, Instagram, and Facebook orders and inventory all in one place.',
    a_ar:
      'أيوه. نُمُو بيجمع كل القنوات في لوحة واحدة — الموقع، واتساب، إنستغرام، فيسبوك. نفس المخزون، نفس الأوردرات.',
  },
  {
    q_en: 'Is there a free trial?',
    q_ar: 'فيه تجربة مجانية؟',
    a_en: `Yes. numu offers a ${DEFAULT_TRIAL_DAYS}-day free trial — no credit card required. You can start selling immediately and upgrade to a paid plan (or Pay as you Grow) when ready.`,
    a_ar: `أيوه. تجربة مجانية ${toArabicDigits(String(DEFAULT_TRIAL_DAYS))} يوم — بدون بطاقة ائتمان. تقدر تبدأ البيع فوراً وتبقى تشترك لما تحب — أو اختار "ادفع وأنت تنمو" بدون اشتراك.`,
  },
  {
    q_en: 'What is numu Trust Network?',
    q_ar: 'إيه هي شبكة الثقة في نُمُو؟',
    a_en:
      "Trust Network is a cross-merchant fraud shield for COD orders. When a shopper places a COD order at any numu store, we check their hashed phone against the network's order/RTO history so you see the risk before shipping. Phones are SHA-256 hashed; raw PII never leaves your store; the feature is opt-in and fail-open.",
    a_ar:
      'شبكة الثقة درع ضد نصب الكاش عند الاستلام عبر كل متاجر نُمُو. لما زبون يطلب كاش من أي متجر، بنفحص سجلّه (بعد ما رقم تليفونه يتعمّى) عبر الشبكة وبتشوف الريسك قبل ما تشحن. التليفونات SHA-256 hashed، الداتا الخام مبتطلعش من متجرك، الميزة opt-in وfail-open.',
  },
];

const FAQ: React.FC = () => {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // FAQPage schema — emitted from the same `items` source so the visible copy
  // and the structured data can never diverge.
  //
  // This previously always emitted the ENGLISH strings, with a note that
  // "Google's crawler prefers consistent-language answers". Consistent with
  // the PAGE is the part that matters: Google's structured-data policy is that
  // markup must match the content a visitor sees, and answering in English
  // under Arabic copy is the mismatch that rule exists to catch. It also
  // declared `inLanguage: ['en', 'ar']` while carrying one of them, so the
  // claim was wrong in its own terms.
  //
  // For an Arabic-first product whose merchants search in Arabic, the cost was
  // concrete: the Arabic answers were on the page for a human and invisible to
  // every answer engine — the exact audience this markup exists for.
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: isAr ? 'ar' : 'en',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: isAr ? item.q_ar : item.q_en,
      acceptedAnswer: {
        '@type': 'Answer',
        text: isAr ? item.a_ar : item.a_en,
      },
    })),
  };

  return (
    <div className="max-w-[900px] mx-auto w-full px-4 sm:px-6 lg:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="text-center mb-10 sm:mb-14">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-terracotta font-semibold">
            § FAQ
          </span>
          <span className="eyebrow">
            {isAr ? 'أسئلة التجار · بأمانة' : 'MERCHANT QUESTIONS · STRAIGHT ANSWERS'}
          </span>
        </div>
        <h2 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-bold text-ink tracking-tight leading-[1.05] mb-5">
          {isAr ? (
            <>
              أسئلة بتيجي{' '}
              <span className="text-terracotta">كتير.</span>
            </>
          ) : (
            <>
              The questions we get <span className="text-terracotta">most.</span>
            </>
          )}
        </h2>
        <p className="prose-body text-ink/75 max-w-2xl mx-auto">
          {isAr
            ? 'لسه عندك سؤال؟ افتح مكالمة من قسم التواصل.'
            : 'Still wondering? Open a call from the Contact section.'}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item, idx) => {
          const open = idx === openIndex;
          const q = isAr ? item.q_ar : item.q_en;
          const a = isAr ? item.a_ar : item.a_en;
          return (
            <div
              key={item.q_en}
              className={`bg-paper border border-ink/10 rounded-[10px] overflow-hidden transition-all duration-200 ease-numu ${
                open ? 'shadow-card' : ''
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : idx)}
                // eslint-disable-next-line jsx-a11y/aria-proptypes
                aria-expanded={open}
                className="w-full flex items-center justify-between gap-4 text-start p-5 sm:p-6 hover:bg-navy/[0.03] transition-colors"
              >
                <span className="font-display text-base sm:text-lg font-semibold text-ink leading-tight">
                  {q}
                </span>
                <span
                  aria-hidden="true"
                  className={`shrink-0 size-7 rounded-[4px] bg-cream border border-ink/10 flex items-center justify-center text-ink-soft transition-transform duration-200 ease-numu ${
                    open ? 'rotate-45 text-terracotta border-terracotta/40' : ''
                  }`}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </span>
              </button>
              {open && (
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1">
                  <div className="border-t border-bone pt-4">
                    <p className="prose-body text-ink/80">{a}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQ;
