import React from 'react';
import { Link } from 'react-router-dom';
import { PageShell, PageSection, PageClose, BodyHead } from '../components/redesign/PageShell';
import { PrimaryCta, SecondaryCta, useBi } from '../components/redesign/ui';
import type { Bi } from '../components/redesign/copy';

/**
 * /about — "Explain why Numueg exists and who builds it."
 *
 * The "why" is written from product truth that the platform already stands
 * behind: an Arabic-first storefront, local payment and shipping, and cash on
 * delivery treated as the default rather than an add-on.
 *
 * The "who" is deliberately thin. Founder names, team size, company history,
 * funding and milestones are all owner-supplied facts that nobody has
 * approved for publication, and inventing a founding story is exactly the
 * kind of unsupported claim `content-system.md` bars. The section below says
 * only what is verifiable — where the team is and what it works on — and the
 * handoff lists the full company narrative as PENDING.
 */

const BELIEFS: { title: Bi; body: Bi }[] = [
  {
    title: { ar: 'العربي مش إضافة', en: 'Arabic is not an add-on' },
    body: {
      ar: 'المتجر مبني من الأساس من اليمين لليسار — الخطوط، الأرقام، التواريخ، والفواتير. مش ترجمة اتحطت فوق قالب إنجليزي.',
      en: 'The storefront is built right-to-left from the ground up — type, numerals, dates and invoices. Not a translation layered onto an English template.',
    },
  },
  {
    title: { ar: 'الدفع عند الاستلام هو الأصل', en: 'Cash on delivery is the default' },
    body: {
      ar: 'أغلب الأوردرات في السوق المصري بتتدفع عند الاستلام، فبنتعامل معاها كحالة أساسية بأدواتها، مش كخيار تاني.',
      en: 'Most orders in the Egyptian market are paid on delivery, so we treat that as the primary case with its own tooling, not a secondary option.',
    },
  },
  {
    title: { ar: 'الأدوات المحلية جوّه المنصة', en: 'Local tools live inside the platform' },
    body: {
      ar: 'الدفع والشحن والتواصل اللي التاجر المصري بيستخدمهم فعلًا مربوطين من جوّه، مش محتاجين وسيط أو مبرمج.',
      en: 'The payment, shipping and messaging an Egyptian merchant actually uses are wired in, with no middleman or developer required.',
    },
  },
  {
    title: { ar: 'التسعير مفهوم', en: 'Pricing you can follow' },
    body: {
      ar: 'اشتراك واضح ورسوم الأوردر مكتوبة على حدة، عشان التاجر يعرف بيدفع إيه قبل ما يبدأ.',
      en: 'A clear subscription with per-order fees written on their own line, so a merchant knows what they pay before starting.',
    },
  },
];

const About: React.FC = () => {
  const { b } = useBi();

  return (
    <PageShell
      slug="about"
      eyebrow={{ ar: 'عن نُمُو', en: 'About numu' }}
      heading={{
        ar: 'اتعملت عشان التاجر المصري، مش عشان السوق العالمي.',
        en: 'Built for the Egyptian merchant, not for the global market.',
      }}
      lead={{
        ar: 'أغلب منصات المتاجر اتبنت لسوق تاني، وبعدين اتترجمت. نُمُو بدأ من السوق اللي بيشتغل فيه التاجر هنا.',
        en: 'Most store platforms were built for another market and translated afterwards. numu started from the market a merchant here actually works in.',
      }}
      title={{
        ar: 'عن نُمُو — منصة متاجر إلكترونية للسوق المصري',
        en: 'About numu — an e-commerce platform for the Egyptian market',
      }}
      description={{
        ar: 'ليه نُمُو موجود: متجر عربي من الأساس، دفع عند الاستلام كحالة أساسية، ودفع وشحن محلي مربوط من جوّه.',
        en: 'Why numu exists: an Arabic-first storefront, cash on delivery as the primary case, and local payment and shipping wired in.',
      }}
      action={<SecondaryCta />}
    >
      <PageSection surface="paper">
        <BodyHead
          heading={{ ar: 'الحاجات اللي بنبني عليها.', en: 'What we build on.' }}
          support={{
            ar: 'أربع قرارات بتفسّر شكل المنتج، ومن غيرها كان هيبقى منصة تانية مترجمة.',
            en: 'Four decisions that explain the shape of the product. Without them it would be one more translated platform.',
          }}
        />

        <ul className="mt-10 grid gap-5 sm:grid-cols-2">
          {BELIEFS.map((item, i) => (
            <li key={i} className="bg-cream border border-ink/12 rounded-[4px] p-6 sm:p-7">
              <h3 className="font-display text-lg font-bold text-ink">{b(item.title)}</h3>
              <p className="prose-body-sm mt-3 text-ink-soft/85">{b(item.body)}</p>
            </li>
          ))}
        </ul>
      </PageSection>

      <PageSection surface="cream">
        <div className="max-w-2xl">
          <BodyHead heading={{ ar: 'مين بيبني نُمُو.', en: 'Who builds numu.' }} />
          <p className="prose-body mt-5 text-ink-soft/85">
            {b({
              ar: 'فريق شغال من القاهرة الجديدة على منصة التجارة، والثيمات العربية، والتكاملات المحلية للدفع والشحن، ودعم التجار بالعربي.',
              en: 'A team working from New Cairo on the commerce platform, the Arabic themes, the local payment and shipping integrations, and Arabic-language merchant support.',
            })}
          </p>
          <p className="prose-body mt-4 text-ink-soft/85">
            {b({
              ar: 'لو عايز تعرف أكتر أو تتكلم مع حد من الفريق،',
              en: 'If you want to know more or speak to someone on the team,',
            })}{' '}
            <Link
              to="/support"
              className="font-semibold text-navy underline decoration-navy/30 underline-offset-4 hover:decoration-navy"
            >
              {b({ ar: 'كلّمنا', en: 'get in touch' })}
            </Link>
            .
          </p>
          <Link
            to="/about/facts"
            className="mt-6 inline-flex font-semibold text-navy underline decoration-navy/30 underline-offset-4 hover:decoration-navy"
          >
            {b({ ar: 'شوف حقائق الأسعار والحدود والتجربة', en: 'See the official pricing, limits and trial facts' })}
          </Link>
        </div>
      </PageSection>

      <PageClose
        heading={{ ar: 'ابدأ متجرك على نُمُو.', en: 'Start your store on numu.' }}
        support={{
          ar: 'من غير بطاقة ائتمان، ومن غير برمجة.',
          en: 'No credit card, no code.',
        }}
        action={<PrimaryCta onDark />}
      />
    </PageShell>
  );
};

export default About;
