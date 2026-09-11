import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { PageSection, PageShell } from '../components/redesign/PageShell';
import PartnerLogo from '../components/redesign/PartnerLogo';
import { CATEGORY_LABEL, PARTNERS, partnerSlug } from '../components/redesign/partners';
import { useBi } from '../components/redesign/ui';
import { SETUP } from './IntegrationsPage';

const IntegrationDetail: React.FC = () => {
  const { slug } = useParams();
  const { b, isAr, lang } = useBi();
  const partner = PARTNERS.find((item) => partnerSlug(item.name) === slug);
  if (!partner) return <Navigate to={`/${lang}/404`} replace />;

  const displayName = isAr ? (partner.nameAr ?? partner.name) : partner.name;
  const answer = isAr
    ? `أيوه. تكامل ${displayName} شغّال على نُمُو حاليًا: ${partner.desc.ar}.`
    : `Yes. The ${partner.name} integration is active on NUMU today: ${partner.desc.en}.`;

  return (
    <PageShell
      slug={`integrations/${slug}`}
      eyebrow={CATEGORY_LABEL[partner.category]}
      heading={{ ar: `هل نُمُو متكامل مع ${displayName}؟`, en: `Does NUMU integrate with ${partner.name}?` }}
      lead={{ ar: answer, en: answer }}
      title={{ ar: `تكامل ${displayName} مع نُمُو`, en: `${partner.name} integration with NUMU` }}
      description={{ ar: answer, en: answer }}
    >
      <PageSection surface="paper">
        <div className="mx-auto max-w-3xl rounded-[6px] border border-ink/10 bg-cream p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <PartnerLogo partner={partner} size={44} />
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">{displayName}</h2>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-sage">
                {isAr ? 'شغّال ومتاح' : 'Active and available'}
              </p>
            </div>
          </div>
          <h3 className="mt-8 font-display text-xl font-bold text-ink">{isAr ? 'إيه اللي محتاجه للتشغيل؟' : 'What do you need to enable it?'}</h3>
          <p className="mt-3 prose-body text-ink-soft/85">{b(SETUP[partner.category])}</p>
          <p className="mt-8 text-sm text-ink-soft/65">{isAr ? 'آخر تحقق من حالة التكامل: ١١ سبتمبر ٢٠٢٦.' : 'Integration status last verified: 11 September 2026.'}</p>
          <Link to="/integrations" className="mt-7 inline-flex font-semibold text-navy underline underline-offset-4">
            {isAr ? 'شوف كل التكاملات' : 'See all integrations'}
          </Link>
        </div>
      </PageSection>
    </PageShell>
  );
};

export default IntegrationDetail;
