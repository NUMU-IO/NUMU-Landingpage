import React from 'react';
import { PageShell, PageSection, PageClose } from '../components/redesign/PageShell';
import { PrimaryCta, SecondaryCta, AssetSlot, useBi } from '../components/redesign/ui';
import type { Bi } from '../components/redesign/copy';
import type { AssetKey as Key } from '../components/redesign/assets';

/**
 * /product-tour — "Let a visitor explore the product UI."
 *
 * The guided sequence fixed by `pages/other-pages.md`: theme engine →
 * storefront → dashboard → analytics → orders.
 *
 * Rendered as a numbered vertical walkthrough with every step visible at
 * once. There is no tab, accordion or hover state to operate, which means the
 * page is already keyboard-complete and already works with JavaScript
 * disabled — no separate static fallback needed.
 */

interface Step {
  asset: Key;
  title: Bi;
  body: Bi;
  alt: Bi;
}

const STEPS: Step[] = [
  {
    asset: 'themeEngine',
    title: { ar: 'اختار شكل متجرك', en: 'Choose how your store looks' },
    body: {
      ar: 'ابدأ من ثيم عربي جاهز، وعدّل الألوان والخطوط وترتيب الأقسام لحد ما يبقى شبه براندك.',
      en: 'Start from a ready Arabic theme, then adjust colours, fonts and section order until it looks like your brand.',
    },
    alt: {
      ar: 'محرر الثيم في نُمُو: الألوان والخطوط وأقسام المتجر.',
      en: 'The numu theme editor: colours, fonts and store sections.',
    },
  },
  {
    asset: 'storefrontPreview',
    title: { ar: 'شوفه زي ما العميل هيشوفه', en: 'See it the way your customer will' },
    body: {
      ar: 'المعاينة بتوريك المتجر بالظبط زي ما هيظهر للعميل على الموبايل والكمبيوتر، قبل ما تنشر.',
      en: 'The preview shows the storefront exactly as a customer sees it on phone and desktop, before you publish.',
    },
    alt: {
      ar: 'معاينة متجر عربي جاهز على الموبايل والكمبيوتر.',
      en: 'Preview of a ready Arabic storefront on phone and desktop.',
    },
  },
  {
    asset: 'dashboardHome',
    title: { ar: 'ادير يومك من لوحة واحدة', en: 'Run your day from one dashboard' },
    body: {
      ar: 'الطلبات الجديدة، حالة كل أوردر، والشحنات — الشاشة اللي بتفتحها الصبح وتشتغل منها.',
      en: 'New orders, the status of each one, and shipments — the screen you open in the morning and work from.',
    },
    alt: {
      ar: 'لوحة تحكم نُمُو: الطلبات الجديدة وحالة كل أوردر.',
      en: 'The numu dashboard: new orders and the status of each one.',
    },
  },
  {
    asset: 'analytics',
    title: { ar: 'اعرف بتكسب منين', en: 'Know where the money comes from' },
    body: {
      ar: 'المبيعات، المنتجات الأكتر طلبًا، ومصادر الزيارات — عشان تعرف تصرف فلوسك ووقتك فين.',
      en: 'Sales, best-selling products and traffic sources — so you know where to spend your money and time.',
    },
    alt: {
      ar: 'تحليلات نُمُو: المبيعات والمنتجات الأكتر طلبًا ومصادر الزيارات.',
      en: 'numu analytics: sales, best-selling products and traffic sources.',
    },
  },
  {
    asset: 'ordersWorkflow',
    title: { ar: 'قرّر قبل ما تشحن', en: 'Decide before you ship' },
    body: {
      ar: 'في الأوردرات اللي بالدفع عند الاستلام، بتشوف إشارة الريسك وتختار: تشحن، تطلب دفع مسبق، أو تحجب.',
      en: 'On cash-on-delivery orders you see the risk signal and choose: ship, request prepayment, or hold.',
    },
    alt: {
      ar: 'شاشة الأوردر في نُمُو وعليها إشارة الريسك والإجراءات المتاحة للتاجر.',
      en: 'The numu order screen showing the risk signal and the merchant actions.',
    },
  },
];

const AR_DIGITS = ['١', '٢', '٣', '٤', '٥'];

const ProductTour: React.FC = () => {
  const { b, isAr } = useBi();

  return (
    <PageShell
      slug="product-tour"
      eyebrow={{ ar: 'جولة في المنتج', en: 'Product tour' }}
      heading={{
        ar: 'من فتح المتجر لأول أوردر بيتشحن.',
        en: 'From opening the store to the first order shipped.',
      }}
      lead={{
        ar: 'خمس خطوات بترتيبها الطبيعي، زي ما التاجر بيمرّ بيها فعلًا في نُمُو.',
        en: 'Five steps in their natural order, the way a merchant actually moves through numu.',
      }}
      title={{
        ar: 'جولة في نُمُو — من إنشاء المتجر لشحن الأوردر',
        en: 'A tour of numu — from creating the store to shipping the order',
      }}
      description={{
        ar: 'اتفرّج على محرر الثيم، المتجر، لوحة التحكم، التحليلات، وشاشة الأوردرات في نُمُو خطوة بخطوة.',
        en: 'Walk through the numu theme editor, storefront, dashboard, analytics and orders screen step by step.',
      }}
      action={<PrimaryCta />}
    >
      <PageSection surface="paper">
        <ol className="space-y-16 lg:space-y-24">
          {STEPS.map((step, i) => (
            <li
              key={step.asset}
              className="grid lg:grid-cols-[1fr_1.35fr] gap-8 lg:gap-14 items-center"
            >
              <div>
                <span
                  aria-hidden="true"
                  className="grid place-items-center size-11 rounded-full border border-navy/25
                    bg-cream font-display text-lg font-bold text-navy"
                >
                  {isAr ? AR_DIGITS[i] : i + 1}
                </span>
                <h2 className="font-display font-bold text-ink text-[22px]/[1.32] lg:text-[30px]/[1.26] mt-5">
                  {b(step.title)}
                </h2>
                <p className="prose-body mt-4 text-ink-soft/85">{b(step.body)}</p>
              </div>

              <div className="overflow-hidden rounded-[4px] border border-ink/10 bg-cream numu-mockup-frame">
                <AssetSlot asset={step.asset} alt={step.alt} ratio={16 / 10} />
              </div>
            </li>
          ))}
        </ol>
      </PageSection>

      <PageClose
        heading={{ ar: 'جرّبها على متجرك انت.', en: 'Try it on your own store.' }}
        support={{
          ar: 'ابدأ من غير بطاقة ائتمان، وامشي في نفس الخطوات دي على بياناتك.',
          en: 'Start with no credit card and walk the same steps on your own data.',
        }}
        action={
          <>
            <PrimaryCta onDark />
            <SecondaryCta onDark />
          </>
        }
      />
    </PageShell>
  );
};

export default ProductTour;
