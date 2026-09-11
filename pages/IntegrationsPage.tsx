import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageShell, PageSection, PageClose } from '../components/redesign/PageShell';
import { PrimaryCta, SecondaryCta, useBi } from '../components/redesign/ui';
import {
  PARTNERS,
  CATEGORY_LABEL,
  CATEGORY_ACCENT,
  PartnerCategory,
  partnerSlug,
} from '../components/redesign/partners';
import { Bi } from '../components/redesign/copy';
import PartnerLogo from '../components/redesign/PartnerLogo';

/**
 * /integrations — "Show active integrations and setup details."
 *
 * Only the confirmed roster appears, and every entry is marked ACTIVE. There
 * is deliberately no "coming soon" tier anywhere on this page: the spec bars
 * it on the homepage, and repeating an unconfirmed partner here would leak the
 * same unapproved claim onto a page merchants read as a commitment.
 *
 * The one interaction on the page is the category filter — it is a real
 * control (buttons with `aria-pressed`), not a hover reveal, and every card
 * stays readable with the filter untouched.
 */

const FILTERS: { key: PartnerCategory | 'all'; label: Bi }[] = [
  { key: 'all', label: { ar: 'الكل', en: 'All' } },
  { key: 'payments', label: CATEGORY_LABEL.payments },
  { key: 'shipping', label: CATEGORY_LABEL.shipping },
  { key: 'messaging', label: CATEGORY_LABEL.messaging },
  { key: 'marketing', label: CATEGORY_LABEL.marketing },
  { key: 'tax', label: CATEGORY_LABEL.tax },
];

/** What a merchant needs before the integration can be switched on. */
export const SETUP: Record<PartnerCategory, Bi> = {
  payments: {
    ar: 'محتاج حساب تاجر مفعّل عند مزوّد الدفع، وبعدها بتحط بيانات الربط في لوحة تحكم نُمُو.',
    en: 'You need an active merchant account with the payment provider, then you enter the connection details in your numu dashboard.',
  },
  shipping: {
    ar: 'محتاج حساب عند شركة الشحن، وبعدها بتربطه بنُمُو وتحدد أسعار الشحن بالمحافظة.',
    en: 'You need an account with the carrier, then you connect it to numu and set your shipping rates by governorate.',
  },
  messaging: {
    ar: 'بتربط رقم الواتساب بتاع المتجر، وبعدها تقدر تتابع العملاء والأوردرات من نفس المكان.',
    en: 'You connect the store WhatsApp number, then you can follow customers and orders from the same place.',
  },
  marketing: {
    ar: 'بتحط الـ Pixel ID والتوكن في لوحة التحكم، وبعدها الأحداث بتتبعت من المتجر ومن السيرفر مع بعض.',
    en: 'You add the pixel ID and token in the dashboard, then events are sent from the storefront and the server together.',
  },
  tax: {
    ar: 'محتاج تسجيل عند مصلحة الضرايب المصرية وبيانات الربط، وبعدها الفواتير بتتبعت من نُمُو.',
    en: 'You need an Egyptian Tax Authority registration and its credentials, then invoices are submitted from numu.',
  },
};

const IntegrationsPage: React.FC = () => {
  const { b } = useBi();
  const [filter, setFilter] = useState<PartnerCategory | 'all'>('all');

  const shown = filter === 'all' ? PARTNERS : PARTNERS.filter((p) => p.category === filter);

  return (
    <PageShell
      slug="integrations"
      eyebrow={{ ar: 'التكاملات', en: 'Integrations' }}
      heading={{
        ar: 'التكاملات الشغالة دلوقتي على نُمُو.',
        en: 'The integrations running on numu today.',
      }}
      lead={{
        ar: 'دي التكاملات المفعّلة فعليًا. مش بنعرض أي شريك هنا قبل ما الربط يبقى شغال وموافَق عليه.',
        en: 'These are the integrations that are actually live. We do not list a partner here before the connection is working and approved.',
      }}
      title={{
        ar: 'تكاملات نُمُو — الدفع والشحن والتواصل',
        en: 'numu integrations — payments, shipping and messaging',
      }}
      description={{
        ar: 'بيموب، فوري، كاشير، إنستاباي، بوسطة، وواتساب — التكاملات المفعّلة على نُمُو وإيه اللي محتاجه عشان تشغّلها.',
        en: 'Paymob, Fawry, Kashier, InstaPay, Bosta and WhatsApp — the live numu integrations and what you need to switch each one on.',
      }}
    >
      <PageSection surface="paper">
        {/* Category filter */}
        <div
          role="group"
          aria-label={b({ ar: 'تصفية حسب النوع', en: 'Filter by category' })}
          className="flex flex-wrap gap-2"
        >
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(f.key)}
                className={`rounded-[4px] border px-4 py-2 text-sm font-semibold transition-colors
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron
                  focus-visible:ring-offset-2 focus-visible:ring-offset-paper
                  ${active
                    ? 'border-navy bg-navy text-cream'
                    : 'border-ink/15 text-ink-soft hover:border-navy/40 hover:text-navy'}`}
              >
                {b(f.label)}
              </button>
            );
          })}
        </div>

        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <li
              key={p.name}
              className="flex flex-col bg-cream border border-ink/12 rounded-[4px] p-6"
            >
              <div className="flex items-center gap-3 h-7">
                <PartnerLogo partner={p} size={28} />
                <span className="font-display text-lg font-bold text-ink">{p.name}</span>
              </div>

              <p className="prose-body-sm mt-3 text-ink-soft/85">{b(p.desc)}</p>

              <p className={`mt-4 font-mono text-[10px] uppercase tracking-[0.16em] ${CATEGORY_ACCENT[p.category]}`}>
                {b(CATEGORY_LABEL[p.category])}
              </p>

              <p className="prose-body-sm mt-4 pt-4 border-t border-ink/10 text-ink-soft/70">
                {b(SETUP[p.category])}
              </p>

              {/* Status pairs a dot with a word — never colour alone. */}
              <p className="mt-5 inline-flex items-center gap-2">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-sage" />
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-sage">
                  {b({ ar: 'شغّال', en: 'Active' })}
                </span>
              </p>
              <Link
                to={`/integrations/${partnerSlug(p.name)}`}
                className="mt-5 font-semibold text-sm text-navy underline decoration-navy/30 underline-offset-4"
              >
                {b({ ar: 'تفاصيل التكامل', en: 'Integration details' })}
              </Link>
            </li>
          ))}
        </ul>
      </PageSection>

      <PageClose
        heading={{ ar: 'اربط أدواتك وابدأ بيع.', en: 'Connect your tools and start selling.' }}
        support={{
          ar: 'افتح متجرك وشغّل التكاملات اللي محتاجها من لوحة التحكم.',
          en: 'Open your store and switch on the integrations you need from the dashboard.',
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

export default IntegrationsPage;
