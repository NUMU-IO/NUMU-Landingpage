import React from 'react';
import { Link } from 'react-router-dom';
import { PageShell, PageSection, PageClose, BodyHead } from '../components/redesign/PageShell';
import { PrimaryCta, useBi } from '../components/redesign/ui';
import type { Bi } from '../components/redesign/copy';

/**
 * /resources — "Help merchants learn and act."
 *
 * A hub, not a third content library. The guides already live at /learn and
 * the calculators at /tools; this page's only job is to make both reachable
 * from one place and to say what each is for. Nothing is duplicated, so there
 * is no second copy to drift out of date.
 */

interface Card {
  to: string;
  kicker: Bi;
  title: Bi;
  body: Bi;
  items: Bi[];
  cta: Bi;
}

const CARDS: Card[] = [
  {
    to: '/learn',
    kicker: { ar: 'أدلة', en: 'Guides' },
    title: { ar: 'اتعلّم تشتغل صح.', en: 'Learn how to run it properly.' },
    body: {
      ar: 'أدلة عملية مكتوبة للسوق المصري: من فتح المتجر، لتقليل الأوردرات المرفوضة، للفاتورة الإلكترونية.',
      en: 'Practical guides written for the Egyptian market: opening the store, cutting refused orders, e-invoicing.',
    },
    items: [
      { ar: 'إزاي تفتح متجر إلكتروني في مصر', en: 'How to open an online store in Egypt' },
      { ar: 'إزاي تقلّل الأوردرات المرفوضة COD', en: 'How to reduce refused COD orders' },
      { ar: 'حساب أسعار الشحن بالمحافظة', en: 'Calculating shipping rates by governorate' },
      { ar: 'الفاتورة الإلكترونية ETA — ابدأ كده', en: 'ETA e-invoicing — start here' },
    ],
    cta: { ar: 'افتح الأدلة', en: 'Open the guides' },
  },
  {
    to: '/tools',
    kicker: { ar: 'أدوات', en: 'Tools' },
    title: { ar: 'أدوات مجانية تستخدمها دلوقتي.', en: 'Free tools you can use right now.' },
    body: {
      ar: 'حاسبات ومولّدات بتشتغل من غير حساب، مبنية على الأرقام والمصطلحات المصرية.',
      en: 'Calculators and generators that work without an account, built on Egyptian numbers and terms.',
    },
    items: [
      { ar: 'مولّد أسماء متاجر', en: 'Arabic store name generator' },
      { ar: 'حاسبة هامش الربح', en: 'Profit margin calculator' },
      { ar: 'مولّد فاتورة مصرية', en: 'Egyptian invoice generator' },
      { ar: 'أمثلة وصف منتج بالذكاء الاصطناعي', en: 'AI product description samples' },
    ],
    cta: { ar: 'افتح الأدوات', en: 'Open the tools' },
  },
];

const Resources: React.FC = () => {
  const { b } = useBi();

  return (
    <PageShell
      slug="resources"
      eyebrow={{ ar: 'مصادر', en: 'Resources' }}
      heading={{
        ar: 'حاجات تقراها، وحاجات تستخدمها.',
        en: 'Things to read, and things to use.'
      }}
      lead={{
        ar: 'الأدلة بتشرح إزاي تشتغل في السوق المصري، والأدوات بتحسبلك اللي محتاج يتحسب. الاتنين مجانيين ومن غير حساب.',
        en: 'The guides explain how to operate in the Egyptian market; the tools do the arithmetic for you. Both are free and need no account.',
      }}
      title={{
        ar: 'مصادر نُمُو — أدلة وأدوات مجانية للتجار',
        en: 'numu resources — free guides and tools for merchants',
      }}
      description={{
        ar: 'أدلة عملية وأدوات مجانية للتجار في مصر: فتح متجر، تقليل الأوردرات المرفوضة، حساب الشحن والربح، والفاتورة الإلكترونية.',
        en: 'Practical guides and free tools for merchants in Egypt: opening a store, cutting refused orders, shipping and margin maths, e-invoicing.',
      }}
    >
      <PageSection surface="paper">
        <ul className="grid gap-5 lg:grid-cols-2">
          {CARDS.map((card) => (
            <li
              key={card.to}
              className="flex flex-col bg-cream border border-ink/12 rounded-[4px] p-6 sm:p-8"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-navy">
                {b(card.kicker)}
              </p>
              <h2 className="font-display text-2xl font-bold text-ink mt-3">{b(card.title)}</h2>
              <p className="prose-body mt-3 text-ink-soft/85">{b(card.body)}</p>

              <ul className="mt-6 space-y-2.5 flex-1">
                {card.items.map((item, i) => (
                  <li key={i} className="flex gap-3 border-t border-ink/10 pt-2.5">
                    <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-saffron" />
                    <span className="prose-body-sm text-ink-soft/80">{b(item)}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={card.to}
                className="mt-7 inline-flex items-center justify-center rounded-[4px] bg-navy px-5 py-2.5
                  text-sm font-semibold text-cream transition-colors hover:bg-navy-800
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron
                  focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
              >
                {b(card.cta)}
              </Link>
            </li>
          ))}
        </ul>
      </PageSection>

      <PageSection surface="cream">
        <BodyHead
          heading={{ ar: 'قارن قبل ما تختار.', en: 'Compare before you choose.' }}
          support={{ ar: 'مقارنات واضحة للتاجر المصري، من غير اختراع أسعار أو مميزات عند المنافسين.', en: 'Clear comparisons for Egyptian merchants, without inventing competitor prices or features.' }}
        />
        <div className="mt-7 flex flex-wrap gap-3">
          {['shopify', 'woocommerce', 'salla', 'zid'].map((name) => (
            <Link
              key={name}
              to={`/compare/numu-vs-${name}-egypt`}
              className="rounded-[4px] border border-ink/15 bg-paper px-4 py-2.5 text-sm font-semibold text-navy hover:border-navy/40"
            >
              NUMU vs {name === 'woocommerce' ? 'WooCommerce' : name[0].toUpperCase() + name.slice(1)}
            </Link>
          ))}
        </div>
      </PageSection>

      <PageClose
        heading={{ ar: 'جاهز تطبّق اللي قريته؟', en: 'Ready to apply what you read?' }}
        support={{
          ar: 'افتح متجرك وابدأ من غير بطاقة ائتمان.',
          en: 'Open your store and start with no credit card.',
        }}
        action={<PrimaryCta onDark />}
      />
    </PageShell>
  );
};

export default Resources;
