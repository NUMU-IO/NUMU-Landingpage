import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useWaitlistModal } from '../contexts/WaitlistModalContext';

/**
 * numu Trust Network — COD fraud shield.
 *
 * Grounded in NUMU-api/src/application/services/cod_trust_service.py and
 * network_reputation_service.py: every shopper's phone is SHA-256 hashed
 * and their cross-merchant order/RTO/delivery/refund history is pooled.
 * Merchants see a risk score + confidence + label before shipping COD.
 *
 * Framing is shopper-centric ("this customer has refused 15 orders")
 * not merchant-centric ("join our collective") — matches the real
 * product: it's a fraud shield, not a co-op.
 */

const toArabicDigits = (s: string | number): string =>
  String(s).replace(/[0-9]/g, (d) =>
    String.fromCharCode(0x0660 + parseInt(d, 10)),
  );

interface Signal {
  key: string;
  label_en: string;
  label_ar: string;
  title_en: string;
  title_ar: string;
  body_en: string;
  body_ar: string;
  accent: 'terracotta' | 'saffron' | 'sage';
}

const signals: Signal[] = [
  {
    key: 'rto',
    label_en: 'RTO HISTORY',
    label_ar: 'سجلّ الرفض',
    title_en: 'How often this shopper refuses COD.',
    title_ar: 'كم مرة الزبون ده رفض كاش عند الاستلام.',
    body_en:
      'Counted across every numu store. A shopper with 11 RTOs at other merchants is flagged before your van leaves the warehouse.',
    body_ar:
      'بنعدّ كل رفضة على كل متاجر نُمُو. الزبون اللي عنده ١١ رفضة عند تجار تانيين بيتعلّم قبل ما العربية تخرج من المخزن.',
    accent: 'terracotta',
  },
  {
    key: 'teleport',
    label_en: 'TELEPORT DETECTION',
    label_ar: 'كشف التنقّل المفاجئ',
    title_en: 'Ship to Alexandria yesterday, Aswan today?',
    title_ar: 'الشحن كان الإسكندرية إمبارح، وأسوان النهاردة؟',
    body_en:
      'Shipping addresses that jump more than 50 km between orders within a short window get flagged automatically — common fraud signature.',
    body_ar:
      'العناوين اللي بتقفز أكثر من ٥٠ كم بين الأوردرات في وقت قصير بتتعلّم تلقائي — بصمة نصب معروفة.',
    accent: 'saffron',
  },
  {
    key: 'new',
    label_en: 'NEW TO NETWORK',
    label_ar: 'جديد على الشبكة',
    title_en: 'First-time shoppers get a fair start.',
    title_ar: 'الزبون الجديد بياخد فرصة عادلة.',
    body_en:
      'No history yet? Label them "new_to_network" with low confidence — never block on insufficient data. The default behaviour is to warn, never auto-reject first-timers.',
    body_ar:
      'لسه مفيش سجلّ؟ بيتّسم "جديد" بثقة منخفضة — بنمنع الحظر على معلومات ناقصة. الإعداد الافتراضي تحذير، مش رفض.',
    accent: 'sage',
  },
];

const accentMap: Record<
  Signal['accent'],
  { bg: string; border: string; dot: string; text: string }
> = {
  terracotta: {
    bg: 'bg-terracotta/10',
    border: 'border-terracotta/30',
    dot: 'bg-terracotta',
    text: 'text-terracotta',
  },
  saffron: {
    bg: 'bg-saffron/10',
    border: 'border-saffron/40',
    dot: 'bg-saffron',
    text: 'text-saffron',
  },
  sage: {
    bg: 'bg-sage/10',
    border: 'border-sage/40',
    dot: 'bg-sage',
    text: 'text-sage',
  },
};

const TrustNetwork: React.FC = () => {
  const { dir, language } = useLanguage();
  const { open: openWaitlist } = useWaitlistModal();
  const isAr = language === 'ar';

  return (
    <div className="max-w-[1360px] mx-auto w-full px-4 sm:px-6 lg:px-10">
      <div className="relative bg-navy text-cream rounded-[14px] overflow-hidden numu-mockup-frame">
        {/* Souk-tile top edge */}
        <span
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-3 opacity-25"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='88' height='12' viewBox='0 0 88 12'><g fill='none' stroke='%23F5EFE6' stroke-width='1'><path d='M0 6 L6 0 L12 6 L6 12 Z' /><circle cx='22' cy='6' r='3' /><path d='M32 6 L38 0 L44 6 L38 12 Z' /><circle cx='54' cy='6' r='3' /><path d='M64 6 L70 0 L76 6 L70 12 Z' /><circle cx='84' cy='6' r='3' /></g></svg>\")",
            backgroundRepeat: 'repeat-x',
          }}
        />

        <div className="relative px-5 sm:px-10 lg:px-16 py-14 sm:py-20">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-14">
            <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-terracotta font-semibold">
                § TRUST NETWORK
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-saffron/20 border border-saffron/50 rounded-[4px] font-mono text-[10px] uppercase tracking-[0.18em] font-semibold text-saffron">
                <span
                  className="size-1.5 rounded-full bg-saffron animate-pulse"
                  aria-hidden="true"
                />
                {isAr ? 'حصري على نُمُو' : 'EXCLUSIVE TO NUMU'}
              </span>
            </div>

            <h2 className="font-display text-[32px] sm:text-5xl lg:text-[60px] font-bold tracking-tight leading-[1.05] mb-5 max-w-5xl mx-auto">
              {isAr ? (
                <>
                  الزبون ده رفض{' '}
                  <span className="text-terracotta">
                    {toArabicDigits(15)} أوردر
                  </span>{' '}
                  قبل كده.
                  <br />
                  إنت لسه مش عارف.
                </>
              ) : (
                <>
                  This shopper refused{' '}
                  <span className="text-terracotta">15 COD orders</span> at
                  other stores.
                  <br />
                  You didn't know. Until now.
                </>
              )}
            </h2>
            <p className="prose-body text-cream/80 max-w-2xl mx-auto">
              {isAr
                ? 'Trust Network بيجمع سجلّ كل زبون على كل متاجر نُمُو. قبل ما تشحن كاش، بتشوف الريسك.'
                : "Trust Network pools every shopper's COD history across all numu stores. Before you ship, you see the risk."}
            </p>

            <div className="flex justify-center mt-6">
              <span
                className="w-12 h-[2px] bg-terracotta"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* "Moment of truth" risk card mockup */}
          <div className="max-w-2xl mx-auto mb-10 sm:mb-14">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream/50 mb-2 text-center">
              {isAr
                ? 'ده اللي بتشوفه عند الطلب'
                : "HERE'S WHAT YOU SEE AT ORDER TIME"}
            </p>

            <div
              className="bg-navy-900 border border-cream/10 rounded-[10px] p-5 sm:p-6 shadow-card"
              dir={dir}
            >
              {/* Card header — shopper identity */}
              <div className="flex items-start justify-between gap-3 mb-4 pb-4 border-b border-cream/10">
                <div className="min-w-0">
                  <p className="font-display text-base sm:text-lg font-semibold text-cream mb-1">
                    {isAr ? 'أحمد مصطفى' : 'Ahmed Mostafa'}
                  </p>
                  <p
                    className="font-mono text-[12px] text-cream/55 tracking-wide"
                    dir="ltr"
                  >
                    +20 1XX XXX XX42 · SHA-256 hashed
                  </p>
                </div>
                <span className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 bg-terracotta/20 border border-terracotta/50 rounded-[4px] font-mono text-[10px] uppercase tracking-[0.18em] font-semibold text-terracotta">
                  <span
                    className="size-1.5 rounded-full bg-terracotta"
                    aria-hidden="true"
                  />
                  {isAr ? 'ريسك عالي' : 'HIGH RISK'}
                </span>
              </div>

              {/* Score row */}
              <div className="flex items-baseline gap-3 mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream/55">
                    {isAr ? 'تقييم' : 'SCORE'}
                  </span>
                  <span className="font-display text-4xl sm:text-5xl font-bold text-terracotta tabular-nums leading-none">
                    {isAr ? toArabicDigits(87) : '87'}
                  </span>
                  <span className="font-mono text-[12px] text-cream/45">
                    / {isAr ? toArabicDigits(100) : '100'}
                  </span>
                </div>
                <span className="w-px h-8 bg-cream/15" aria-hidden="true" />
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-sage font-semibold">
                  {isAr ? 'ثقة عالية' : 'HIGH CONFIDENCE'}
                </span>
              </div>

              {/* Signal breakdown */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5">
                {[
                  {
                    label: isAr ? 'أوردرات' : 'Orders',
                    value: isAr ? toArabicDigits(27) : '27',
                    accent: 'text-cream',
                  },
                  {
                    label: isAr ? 'رفض' : 'RTOs',
                    value: isAr ? toArabicDigits(11) : '11',
                    accent: 'text-terracotta',
                  },
                  {
                    label: isAr ? 'متجر' : 'Stores',
                    value: isAr ? toArabicDigits(9) : '9',
                    accent: 'text-cream',
                  },
                ].map((kpi) => (
                  <div
                    key={kpi.label}
                    className="bg-cream/5 border border-cream/10 rounded-[4px] px-3 py-2"
                  >
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-cream/50 mb-0.5">
                      {kpi.label}
                    </p>
                    <p
                      className={`font-display text-xl font-bold tabular-nums leading-none ${kpi.accent}`}
                    >
                      {kpi.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Factor tags */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-terracotta/15 border border-terracotta/30 rounded-[2px] font-mono text-[10px] uppercase tracking-[0.14em] text-terracotta">
                  <span
                    className="size-1 rounded-full bg-terracotta"
                    aria-hidden="true"
                  />
                  {isAr
                    ? `معدل رفض ${toArabicDigits(40)}%`
                    : '40% refusal rate'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-saffron/15 border border-saffron/40 rounded-[2px] font-mono text-[10px] uppercase tracking-[0.14em] text-saffron">
                  <span
                    className="size-1 rounded-full bg-saffron"
                    aria-hidden="true"
                  />
                  {isAr ? 'آخر رفض: ٣ أيام' : 'Last RTO: 3 days ago'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-cream/5 border border-cream/15 rounded-[2px] font-mono text-[10px] uppercase tracking-[0.14em] text-cream/65">
                  <span
                    className="size-1 rounded-full bg-cream/50"
                    aria-hidden="true"
                  />
                  {isAr ? '٦ أكتوبر' : '6 October'}
                </span>
              </div>

              {/* Action buttons — merchant decides */}
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  className="flex-1 bg-terracotta text-cream font-semibold text-sm py-2.5 rounded-[4px] hover:bg-terracotta/90 transition-colors cursor-default"
                  disabled
                >
                  {isAr ? 'احجب الأوردر' : 'Block order'}
                </button>
                <button
                  type="button"
                  className="flex-1 bg-saffron text-ink font-semibold text-sm py-2.5 rounded-[4px] hover:bg-saffron/90 transition-colors cursor-default"
                  disabled
                >
                  {isAr ? 'اطلب دفع مسبق (فوري)' : 'Require Fawry prepay'}
                </button>
                <button
                  type="button"
                  className="flex-1 bg-cream/10 text-cream border border-cream/20 font-semibold text-sm py-2.5 rounded-[4px] hover:bg-cream/15 transition-colors cursor-default"
                  disabled
                >
                  {isAr ? 'اشحن بأي طريقة' : 'Ship anyway'}
                </button>
              </div>
            </div>

            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream/45 mt-3 text-center">
              {isAr
                ? 'نموذج توضيحي · البيانات الحقيقية معمّاة'
                : 'Illustrative · real data is hashed before leaving your store'}
            </p>
          </div>

          {/* 3 signal cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-10 sm:mb-14">
            {signals.map((sig) => {
              const a = accentMap[sig.accent];
              return (
                <article
                  key={sig.key}
                  className={`p-5 sm:p-6 rounded-[10px] ${a.bg} border ${a.border}`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`size-1.5 rounded-full ${a.dot}`}
                      aria-hidden="true"
                    />
                    <span
                      className={`font-mono text-[10px] uppercase tracking-[0.18em] font-semibold ${a.text}`}
                    >
                      {isAr ? sig.label_ar : sig.label_en}
                    </span>
                  </div>
                  <h3 className="font-display text-base sm:text-lg font-semibold text-cream tracking-tight leading-tight mb-2">
                    {isAr ? sig.title_ar : sig.title_en}
                  </h3>
                  <p className="prose-body-sm text-cream/75">
                    {isAr ? sig.body_ar : sig.body_en}
                  </p>
                </article>
              );
            })}
          </div>

          {/* Merchant control + privacy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-10">
            <div className="bg-cream/5 border border-cream/10 rounded-[10px] p-5 sm:p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-saffron font-semibold mb-2">
                {isAr ? 'القرار قراراك' : "YOU'RE IN CONTROL"}
              </p>
              <p className="prose-body-sm text-cream/85">
                {isAr
                  ? 'Trust Network بيطلع الريسك. القرار قرارك: احجب، اطلب دفع مسبق، أو اشحن بأي طريقة. إنت بتظبط الحد وشروط الثقة من إعدادات متجرك.'
                  : 'Trust Network surfaces the risk; the action is yours — block, require prepayment, or ship anyway. You set the threshold and confidence rules from your store settings.'}
              </p>
            </div>
            <div className="bg-cream/5 border border-cream/10 rounded-[10px] p-5 sm:p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sage font-semibold mb-2">
                {isAr ? 'خصوصية أولاً' : 'PRIVACY FIRST'}
              </p>
              <p className="prose-body-sm text-cream/85">
                {isAr
                  ? 'أرقام التليفونات بتتعمّى بـ SHA-256 قبل ما تطلع من متجرك. البيانات الخام مبتتشاركش بين التجار. Fail-open: لو حصل عطل في البنية التحتية، الأوردر بيعدّي عادي.'
                  : 'Phone numbers are SHA-256 hashed before leaving your store. Raw PII is never shared across merchants. Fail-open: infrastructure hiccups never block a legitimate order.'}
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => openWaitlist()}
              className="group inline-flex items-center gap-3 bg-cream text-navy font-semibold py-3.5 px-8 rounded-[4px] hover:bg-cream/90 active:scale-[0.985] transition-all duration-200 ease-numu text-sm sm:text-base"
            >
              <span>
                {isAr ? 'فعّل Trust Network على متجرك' : 'Enable on your store'}
              </span>
              <span
                aria-hidden="true"
                className="text-lg text-terracotta group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform rtl:rotate-180"
              >
                →
              </span>
            </button>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream/50 mt-4">
              {isAr
                ? 'Opt-in · fail-open · تقدر تقفله في أي وقت'
                : 'Opt-in · fail-open · toggle off anytime'}
            </p>
          </div>
        </div>

        {/* Souk-tile bottom edge */}
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-3 opacity-25"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='88' height='12' viewBox='0 0 88 12'><g fill='none' stroke='%23F5EFE6' stroke-width='1'><path d='M0 6 L6 0 L12 6 L6 12 Z' /><circle cx='22' cy='6' r='3' /><path d='M32 6 L38 0 L44 6 L38 12 Z' /><circle cx='54' cy='6' r='3' /><path d='M64 6 L70 0 L76 6 L70 12 Z' /><circle cx='84' cy='6' r='3' /></g></svg>\")",
            backgroundRepeat: 'repeat-x',
          }}
        />
      </div>
    </div>
  );
};

export default TrustNetwork;
