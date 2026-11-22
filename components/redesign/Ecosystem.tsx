import React, { useState } from 'react';
import { ecosystem, CTA } from './copy';
import type { Bi } from './copy';
import { Section, SectionHead, ContextLink, useBi } from './ui';
import { PARTNERS_WITH_LOGOS, type PartnerCategory } from './partners';
import PartnerLogo from './PartnerLogo';

/**
 * 07 — Ecosystem and integrations. `sections/06-ecosystem.md`.
 *
 * Only the confirmed roster in `partners.tsx` appears here. There is no
 * "coming soon" tier — the spec forbids labelling an unconfirmed integration
 * that way on the homepage, so an unconfirmed partner is simply absent.
 *
 * A merchant comes here to check one name: "is my courier here?". So the
 * roster is split into the three kinds they think in, with a switch, and each
 * kind shows its logos large with the name in text. No tiles: space groups
 * them. Every kind is in the page from the first paint (the others are
 * `hidden`), so the roster reads the same to a crawler and without script.
 * `PARTNERS_WITH_LOGOS`, never `PARTNERS`: an integration that is real but has
 * no supplied brand file must not be drawn as a logo.
 */
const KINDS: { key: string; label: Bi; categories: PartnerCategory[] }[] = [
  { key: 'pay', label: { ar: 'الدفع', en: 'Payments' }, categories: ['payments', 'methods', 'wallets'] },
  { key: 'ship', label: { ar: 'الشحن', en: 'Shipping' }, categories: ['shipping', 'handoff'] },
  {
    key: 'channels',
    label: { ar: 'القنوات', en: 'Channels' },
    categories: ['messaging', 'marketing', 'tax', 'domains', 'imports', 'ai'],
  },
];

const GROUPS = KINDS.map((k) => ({
  ...k,
  partners: PARTNERS_WITH_LOGOS.filter((p) => k.categories.includes(p.category)),
})).filter((g) => g.partners.length > 0);

const Ecosystem: React.FC = () => {
  const { b } = useBi();
  const [active, setActive] = useState(GROUPS[0]?.key);

  return (
    <Section id="ecosystem" surface="paper" labelledBy="ecosystem-heading">
      <SectionHead
        id="ecosystem-heading"
        eyebrow={{ ar: 'التكاملات', en: 'Integrations' }}
        heading={ecosystem.heading}
        support={ecosystem.support}
      />

      <div
        role="tablist"
        aria-label={b({ ar: 'نوع التكامل', en: 'Kind of integration' })}
        className="mt-10 inline-flex max-w-full flex-wrap gap-1 rounded-[22px] bg-cream p-1"
      >
        {GROUPS.map((g) => (
          <button
            key={g.key}
            type="button"
            role="tab"
            id={`ecosystem-tab-${g.key}`}
            aria-selected={active === g.key}
            aria-controls={`ecosystem-panel-${g.key}`}
            onClick={() => setActive(g.key)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-cream
              ${active === g.key ? 'bg-navy text-cream' : 'text-ink-soft/75 hover:text-ink'}`}
          >
            {b(g.label)}
            <span className="ms-2 tabular-nums opacity-70">{g.partners.length}</span>
          </button>
        ))}
      </div>

      {GROUPS.map((g) => (
        <ul
          key={g.key}
          role="tabpanel"
          id={`ecosystem-panel-${g.key}`}
          aria-labelledby={`ecosystem-tab-${g.key}`}
          hidden={active !== g.key}
          /* `grid` would override the hidden attribute, so the class goes too. */
          className={active === g.key ? 'mt-10 grid grid-cols-3 gap-x-4 gap-y-9 sm:grid-cols-5 lg:grid-cols-7' : 'hidden'}
        >
          {g.partners.map((p) => (
            <li key={p.name} className="flex flex-col items-center gap-3 text-center">
              <PartnerLogo partner={p} size={44} />
              <span className="text-[12.5px]/[1.35] font-semibold text-ink-soft/80">
                {b({ ar: p.nameAr ?? p.name, en: p.name })}
              </span>
            </li>
          ))}
        </ul>
      ))}

      <div className="mt-12">
        <ContextLink label={CTA.integrations} to="/integrations" />
      </div>
    </Section>
  );
};

export default Ecosystem;
