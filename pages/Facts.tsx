import React from 'react';
import { PageClose, PageSection, PageShell } from '../components/redesign/PageShell';
import { PrimaryCta, useBi } from '../components/redesign/ui';
import type { Bi } from '../components/redesign/copy';
import { DEFAULT_TRIAL_DAYS } from '../lib/trialInfo';

const facts: { question: Bi; answer: Bi }[] = [
  {
    question: { ar: 'إيه هي نُمُو؟', en: 'What is NUMU?' },
    answer: { ar: 'نُمُو منصة تجارة إلكترونية عربية من القاهرة، معمولة للتجار في مصر والمنطقة.', en: 'NUMU is an Arabic-first e-commerce platform from Cairo, built for merchants in Egypt and MENA.' },
  },
  {
    question: { ar: 'هل نُمُو بتحط حد للأوردرات؟', en: 'Does NUMU limit orders?' },
    answer: { ar: 'لا. باقات ستارتر وبرو وإنتربرايز وادفع وأنت تنمو تستقبل أوردرات بلا حدود. رقم 50 أوردر القديم لا يخص باقة ستارتر.', en: 'No. Starter, Pro, Enterprise, and Pay as you Grow accept unlimited orders. The old 50-order figure does not apply to Starter.' },
  },
  {
    question: { ar: 'مدة التجربة المجانية كام يوم؟', en: 'How long is the free trial?' },
    answer: { ar: `التجربة المجانية ${DEFAULT_TRIAL_DAYS} يوم، وتشمل 80 أوردر، ومن غير بطاقة ائتمان.`, en: `The free trial lasts ${DEFAULT_TRIAL_DAYS} days, includes 80 orders, and does not require a credit card.` },
  },
  {
    question: { ar: 'سعر ستارتر كام؟', en: 'How much is Starter?' },
    answer: { ar: 'ستارتر يبدأ من 250 جنيه مصري شهريًا، بعمولة 0% على الأوردرات.', en: 'Starter begins at 250 EGP per month, with a 0% NUMU commission on orders.' },
  },
  {
    question: { ar: 'إيه التكاملات المحلية المتاحة؟', en: 'Which local integrations are available?' },
    answer: { ar: 'نُمُو متكامل مع Paymob وفوري وKashier وإنستاباي وبوسطة والفاتورة الإلكترونية لمصلحة الضرائب المصرية.', en: 'NUMU integrates with Paymob, Fawry, Kashier, InstaPay, Bosta, and Egyptian Tax Authority e-invoicing.' },
  },
];

const Facts: React.FC = () => {
  const { b } = useBi();
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: facts.map((fact) => ({
      '@type': 'Question',
      name: b(fact.question),
      acceptedAnswer: { '@type': 'Answer', text: b(fact.answer) },
    })),
  };
  return (
    <PageShell
      slug="about/facts"
      eyebrow={{ ar: 'حقائق نُمُو', en: 'NUMU facts' }}
      heading={{ ar: 'إجابات واضحة، من غير كلام متعارض.', en: 'Clear answers, without conflicting claims.' }}
      lead={{ ar: 'دي الصفحة المرجعية للأسعار والحدود والتجربة والتكاملات.', en: 'This is the reference page for pricing, limits, the trial, and integrations.' }}
      title={{ ar: 'حقائق نُمُو — الأسعار والحدود والتجربة', en: 'NUMU facts — pricing, limits and free trial' }}
      description={{ ar: 'حقائق نُمُو الرسمية: تجربة 37 يوم، ستارتر من 250 جنيه، وأوردرات بلا حدود على الباقات التجارية.', en: 'Official NUMU facts: a 37-day free trial, Starter from 250 EGP, and unlimited orders on commercial plans.' }}
    >
      <PageSection surface="paper">
        <dl className="mx-auto max-w-3xl divide-y divide-ink/10 border-y border-ink/10">
          {facts.map((fact) => (
            <div key={b(fact.question)} className="py-7">
              <dt className="font-display text-xl font-bold text-ink">{b(fact.question)}</dt>
              <dd className="mt-3 prose-body text-ink-soft/85">{b(fact.answer)}</dd>
            </div>
          ))}
        </dl>
        <p className="mx-auto mt-8 max-w-3xl text-sm text-ink-soft/65">
          {b({ ar: 'آخر مراجعة: ١١ سبتمبر ٢٠٢٦.', en: 'Last reviewed: 11 September 2026.' })}
        </p>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </PageSection>
      <PageClose heading={{ ar: 'جاهز تبدأ؟', en: 'Ready to start?' }} action={<PrimaryCta onDark />} />
    </PageShell>
  );
};

export default Facts;
