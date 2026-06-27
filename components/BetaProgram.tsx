import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSignupModal } from '../contexts/SignupModalContext';

/**
 * Founder's 100 — real-scarcity urgency block.
 *
 * Repurposes the old BetaProgram component. Leans on the brand-kit's
 * "أول ١٠٠ تاجر" / "First 100 merchants" editorial language (see
 * .claude/skills/numu-design/social/exported-images/Founder_perks___كن_تاجر_مؤسس.png
 * and Urgency___أول_١٠٠_تاجر.png).
 *
 * Pulls live remaining-seats count from /public/waitlist/stats — same
 * endpoint WaitlistModal already uses. Falls back to static copy if the
 * API is unreachable.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'https://numueg.app/api/v1';
const FOUNDER_CAP = 100;

const toArabicDigits = (s: string | number): string =>
  String(s).replace(/[0-9]/g, (d) =>
    String.fromCharCode(0x0660 + parseInt(d, 10)),
  );

interface Perk {
  key: string;
  title_en: string;
  title_ar: string;
  desc_en: string;
  desc_ar: string;
  accent: 'saffron' | 'terracotta' | 'sage' | 'navy';
}

const perks: Perk[] = [
  {
    key: 'price-lock',
    title_en: '12-month price lock.',
    title_ar: 'سعر مثبت ١٢ شهر.',
    desc_en:
      "Whatever tier you join, you keep the launch price for a full year — even when we raise it.",
    desc_ar:
      'أي باقة تنضم بيها، السعر متثبّت ١٢ شهر كاملة — حتى لو رفعنا الأسعار.',
    accent: 'saffron',
  },
  {
    key: 'trust-network-first',
    title_en: 'Feed Trust Network first.',
    title_ar: 'بياناتك بتبني شبكة الثقة.',
    desc_en:
      'Early orders contribute to Trust Network signal. Your COD scoring becomes high-confidence faster than anyone who joins later.',
    desc_ar:
      'أوردراتك الأولى بتساهم في شبكة الثقة. تقييم الكاش بتاعك بيوصل لدرجة "ثقة عالية" قبل أي حد يدخل بعدك.',
    accent: 'terracotta',
  },
  {
    key: 'premium-free',
    title_en: '30 days Premium. On us.',
    title_ar: 'تجربة Premium ٣٠ يوم مجاناً.',
    desc_en:
      "Full Premium tier for your first 30 days — no credit card, no downgrade surprise.",
    desc_ar:
      'باقة Premium بالكامل في أول ٣٠ يوم — بدون بطاقة ائتمان، بدون مفاجآت.',
    accent: 'sage',
  },
  {
    key: 'direct-slack',
    title_en: 'Direct Slack line to the team.',
    title_ar: 'سلاك مباشر مع الفريق.',
    desc_en:
      'Not a ticket system. You\'re in a private channel with product + support leads, responding in Arabic.',
    desc_ar:
      'مش نظام تيكيت. إنت في قناة خاصة مع قادة المنتج والدعم، بيردّوا بالعربي.',
    accent: 'navy',
  },
  {
    key: 'shape-product',
    title_en: 'Vote on the next feature.',
    title_ar: 'إنت بتقرر الفيتشر الجاي.',
    desc_en:
      "Founders get a monthly roadmap vote. The top-voted item ships that quarter — and we'll tell you which merchant requested it.",
    desc_ar:
      'كل شهر بيكون فيه تصويت على الرودماب. الفيتشر اللي يكسب بيطلع نفس الربع — وبنقول مين التاجر اللي طلبها.',
    accent: 'saffron',
  },
  {
    key: 'badge',
    title_en: '"Founding Merchant" badge.',
    title_ar: 'بادج «تاجر مؤسس».',
    desc_en:
      'Your storefront gets a permanent "Founding Merchant" badge. A small, permanent mark for being here first.',
    desc_ar:
      'متجرك بياخد بادج دائم «تاجر مؤسس». علامة صغيرة ودائمة على إنك كنت هنا من الأول.',
    accent: 'terracotta',
  },
];

const accentMap: Record<
  Perk['accent'],
  { dot: string; text: string; rule: string }
> = {
  saffron: { dot: 'bg-saffron', text: 'text-saffron', rule: 'bg-saffron' },
  terracotta: {
    dot: 'bg-terracotta',
    text: 'text-terracotta',
    rule: 'bg-terracotta',
  },
  sage: { dot: 'bg-sage', text: 'text-sage', rule: 'bg-sage' },
  navy: { dot: 'bg-navy', text: 'text-navy', rule: 'bg-navy' },
};

const BetaProgram: React.FC = () => {
  const { dir, language } = useLanguage();
  const { open: openSignup } = useSignupModal();
  const isAr = language === 'ar';
  const [stats, setStats] = useState<{
    total_signups: number;
    stores_launched: number;
  } | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/public/waitlist/stats`, { credentials: 'include' })
      .then((r) => r.json())
      .then((json) => setStats(json.data ?? json))
      .catch(() => {});
  }, []);

  const claimed = Math.min(stats?.stores_launched ?? 0, FOUNDER_CAP);
  const remaining = Math.max(FOUNDER_CAP - claimed, 0);
  const fillPct = Math.round((claimed / FOUNDER_CAP) * 100);

  return (
    <div className="max-w-[1360px] mx-auto w-full px-4 sm:px-6 lg:px-10" dir={dir}>
      {/* Header */}
      <div className="text-center mb-10 sm:mb-14">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-terracotta font-semibold">
            § FOUNDER'S 100
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-saffron/15 border border-saffron/40 rounded-[4px] font-mono text-[10px] uppercase tracking-[0.18em] font-semibold text-saffron">
            <span
              className="size-1.5 rounded-full bg-saffron animate-pulse"
              aria-hidden="true"
            />
            {isAr
              ? `متبقّي ${toArabicDigits(remaining)} مقعد`
              : `${remaining} seats left`}
          </span>
        </div>

        <h2 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-bold text-ink tracking-tight leading-[1.05] mb-5">
          {isAr ? (
            <>
              أول <span className="text-terracotta">{toArabicDigits(100)} تاجر</span>
              <br />
              بياخدوا حاجة لغيرهم مش هياخدها.
            </>
          ) : (
            <>
              The first{' '}
              <span className="text-terracotta">100 merchants</span>
              <br />
              get what nobody after them will.
            </>
          )}
        </h2>
        <p className="prose-body text-ink/75 max-w-2xl mx-auto">
          {isAr
            ? 'برنامج التاجر المؤسس مش تصفيق على الدخول المبكر — ده حزمة من الامتيازات المدفوعة لفريق البيتا.'
            : "Founding Merchant isn't a pat on the back for joining early — it's a paid-for package of perks for our beta cohort."}
        </p>
      </div>

      {/* Seat counter strip */}
      <div className="mb-10 sm:mb-14 max-w-3xl mx-auto bg-paper border border-ink/10 rounded-[14px] shadow-card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-4xl sm:text-5xl font-bold text-navy tabular-nums leading-none">
              {isAr ? toArabicDigits(claimed) : claimed}
            </span>
            <span className="font-mono text-[12px] text-ink-soft/60 uppercase tracking-[0.18em]">
              /{isAr ? toArabicDigits(FOUNDER_CAP) : FOUNDER_CAP}{' '}
              {isAr ? 'مقعد انحجز' : 'seats taken'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="size-1.5 rounded-full bg-sage"
              aria-hidden="true"
            />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] font-semibold text-sage">
              {isAr ? 'مفتوح الآن' : 'Open now'}
            </span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-2 bg-bone rounded-[2px] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-terracotta to-saffron rounded-[2px] transition-all duration-700 ease-numu"
            style={{ width: `${fillPct}%` }}
            aria-hidden="true"
          />
        </div>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft/60">
          {isAr
            ? `${toArabicDigits(remaining)} مكان متبقّي قبل ما البرنامج يقفل`
            : `${remaining} spots remaining before the program closes`}
        </p>
      </div>

      {/* Perks grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        {perks.map((perk) => {
          const a = accentMap[perk.accent];
          return (
            <article
              key={perk.key}
              className="relative flex flex-col gap-3 p-6 sm:p-7 rounded-[10px] bg-paper border border-ink/10 shadow-card hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 ease-numu"
            >
              <span
                aria-hidden="true"
                className={`absolute top-0 start-0 w-10 h-[3px] ${a.rule}`}
              />
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`size-1.5 rounded-full ${a.dot}`}
                  aria-hidden="true"
                />
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.18em] font-semibold ${a.text}`}
                >
                  {isAr ? 'امتياز مؤسس' : 'FOUNDER PERK'}
                </span>
              </div>
              <h3 className="font-display text-lg sm:text-xl font-semibold text-ink tracking-tight leading-tight">
                {isAr ? perk.title_ar : perk.title_en}
              </h3>
              <p className="prose-body-sm text-ink/75">
                {isAr ? perk.desc_ar : perk.desc_en}
              </p>
            </article>
          );
        })}
      </div>

      {/* CTA */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => openSignup()}
          className="group inline-flex items-center gap-3 bg-navy text-cream font-semibold py-3.5 px-8 rounded-[4px] shadow-card hover:bg-navy-800 active:scale-[0.985] transition-all duration-200 ease-numu text-sm sm:text-base"
        >
          <span>
            {isAr
              ? `احجز مقعدك — ${toArabicDigits(remaining)} متبقّي`
              : `Claim your seat — ${remaining} left`}
          </span>
          <span
            aria-hidden="true"
            className="text-lg text-saffron group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform rtl:rotate-180"
          >
            →
          </span>
        </button>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft/55 mt-4">
          {isAr
            ? 'مفيش فيزا مطلوبة · تقدر تلغي في أي وقت'
            : 'No credit card · cancel anytime'}
        </p>
      </div>
    </div>
  );
};

export default BetaProgram;
