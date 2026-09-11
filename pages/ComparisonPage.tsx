import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { PageClose, PageSection, PageShell } from '../components/redesign/PageShell';
import { PrimaryCta, useBi } from '../components/redesign/ui';
import type { Bi } from '../components/redesign/copy';

interface Alternative {
  name: string;
  slug: string;
  summary: Bi;
  official: string;
}

export const alternatives: Alternative[] = [
  { name: 'Shopify', slug: 'numu-vs-shopify-egypt', official: 'https://www.shopify.com/', summary: { ar: 'منصة عالمية مستضافة ومعروفة بمنظومة التطبيقات الكبيرة.', en: 'A global hosted platform known for its large app ecosystem.' } },
  { name: 'WooCommerce', slug: 'numu-vs-woocommerce-egypt', official: 'https://woocommerce.com/', summary: { ar: 'إضافة مفتوحة المصدر لووردبريس تعطي تحكمًا واسعًا مقابل إدارة الاستضافة والإضافات.', en: 'An open-source WordPress plugin with broad control and responsibility for hosting and plugins.' } },
  { name: 'Salla', slug: 'numu-vs-salla-egypt', official: 'https://salla.com/', summary: { ar: 'منصة تجارة إلكترونية عربية تخدم تجار المنطقة.', en: 'An Arabic e-commerce platform serving merchants in the region.' } },
  { name: 'Zid', slug: 'numu-vs-zid-egypt', official: 'https://zid.sa/', summary: { ar: 'منصة تجارة إلكترونية عربية بمنظومة حلول للتجار.', en: 'An Arabic e-commerce platform with an ecosystem of merchant solutions.' } },
];

const rows: { criterion: Bi; numu: Bi }[] = [
  { criterion: { ar: 'السوق الأساسي', en: 'Primary market' }, numu: { ar: 'مصر، بواجهة عربية من الأساس', en: 'Egypt, with Arabic-first storefronts' } },
  { criterion: { ar: 'السعر', en: 'Price' }, numu: { ar: 'ستارتر من 250 جنيه مصري شهريًا', en: 'Starter from 250 EGP/month' } },
  { criterion: { ar: 'حد الأوردرات', en: 'Order limit' }, numu: { ar: 'بلا حدود على الباقات التجارية', en: 'Unlimited on commercial plans' } },
  { criterion: { ar: 'التجربة', en: 'Trial' }, numu: { ar: '37 يوم من غير بطاقة', en: '37 days without a credit card' } },
  { criterion: { ar: 'تكاملات مصر', en: 'Egypt integrations' }, numu: { ar: 'Paymob وفوري وKashier وإنستاباي وبوسطة وETA', en: 'Paymob, Fawry, Kashier, InstaPay, Bosta and ETA' } },
];

const ComparisonPage: React.FC = () => {
  const { slug } = useParams();
  const { b, lang, isAr } = useBi();
  const alternative = alternatives.find((item) => item.slug === slug);
  if (!alternative) return <Navigate to={`/${lang}/404`} replace />;

  return (
    <PageShell
      slug={`compare/${alternative.slug}`}
      eyebrow={{ ar: 'مقارنة واضحة', en: 'Clear comparison' }}
      heading={{ ar: `نُمُو ولا ${alternative.name} للتاجر في مصر؟`, en: `NUMU or ${alternative.name} for a merchant in Egypt?` }}
      lead={{ ar: `نُمُو اختيار محلي للتاجر اللي محتاج دفع وشحن وتسعير مصري جاهز. ${alternative.summary.ar}`, en: `NUMU is the local option for merchants who need Egyptian payments, shipping and EGP pricing ready to use. ${alternative.summary.en}` }}
      title={{ ar: `نُمُو مقابل ${alternative.name} في مصر — مقارنة 2026`, en: `NUMU vs ${alternative.name} in Egypt — 2026 comparison` }}
      description={{ ar: `مقارنة عملية بين نُمُو و${alternative.name} للتجار في مصر: السعر، العربي، حدود الأوردرات، والدفع والشحن المحلي.`, en: `A practical NUMU vs ${alternative.name} comparison for Egyptian merchants: price, Arabic, order limits, local payments and shipping.` }}
    >
      <PageSection surface="paper">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-[6px] border border-ink/10 bg-cream">
          <div className="grid grid-cols-[1fr_1fr_1fr] bg-navy p-4 text-cream font-semibold">
            <span>{isAr ? 'المعيار' : 'Criterion'}</span><span>NUMU</span><span>{alternative.name}</span>
          </div>
          {rows.map((row) => (
            <div key={b(row.criterion)} className="grid grid-cols-[1fr_1fr_1fr] gap-3 border-t border-ink/10 p-4 text-sm">
              <strong>{b(row.criterion)}</strong><span>{b(row.numu)}</span><span>{isAr ? 'راجعه على الموقع الرسمي' : 'Verify on the official site'}</span>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-8 max-w-4xl prose-body text-ink-soft/80">
          <p>{isAr ? 'إزاي عملنا المقارنة: حقائق نُمُو مأخوذة من كتالوج المنتج الفعلي. لم نفترض سعر أو ميزة عند المنافس؛ راجع موقعه الرسمي لأن الباقات والتكاملات تتغير.' : 'Method: NUMU facts come from the active product catalog. We do not assume a competitor price or feature; verify its official site because plans and integrations change.'}</p>
          <a href={alternative.official} rel="noopener noreferrer" className="mt-4 inline-flex font-semibold text-navy underline underline-offset-4">
            {isAr ? `الموقع الرسمي لـ${alternative.name}` : `${alternative.name} official website`}
          </a>
          <p className="mt-4 text-sm">{isAr ? 'آخر مراجعة: ١١ سبتمبر ٢٠٢٦.' : 'Last reviewed: 11 September 2026.'}</p>
        </div>
      </PageSection>
      <PageClose heading={{ ar: 'جرّب نُمُو بنفسك.', en: 'Try NUMU yourself.' }} action={<PrimaryCta onDark />} />
    </PageShell>
  );
};

export default ComparisonPage;
