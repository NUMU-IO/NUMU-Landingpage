import React from 'react';
import { Link } from 'react-router-dom';
import { PARTNERS_WITH_MARKS } from './partners';
import PartnerLogo from './PartnerLogo';
import { useBi } from './ui';
import { Reveal } from './Reveal';

/**
 * The partner logo strip — the quiet trust band near the top of the page.
 *
 * ─── On the wording ───────────────────────────────────────────────────────
 * The reference for this band is Vondera's «موثوق من». That heading is not
 * used here, and the difference matters: «موثوق من» means "trusted by", which
 * says these companies vouch for Numueg. They do not. What is true is that
 * Numueg is built to work with them, so the band says «متكامل مع» —
 * "integrated with". Same trust signal, and it is a claim that survives being
 * checked.
 *
 * ─── On what appears ──────────────────────────────────────────────────────
 * `PARTNERS_WITH_MARKS`, so a company is drawn only where a real mark exists
 * — either a brand file in `public/` or its official simple-icons glyph.
 * Integrations that are live in the product but have neither are named on
 * /integrations rather than being given an invented mark here. See
 * `partners.tsx` and `PartnerLogo.tsx`.
 *
 * ─── On placement ─────────────────────────────────────────────────────────
 * `page-architecture.md` fixes the homepage at eight sections, so this is not
 * a ninth. It is a band at the foot of section 02, where an early trust
 * signal belongs and where it cannot interrupt the argument.
 *
 * Logos are shown as supplied — no greyscale filter, no recolouring, no
 * tinting on hover. Most brand guidelines forbid that, and a partner's mark
 * is not ours to restyle.
 */

const TrustedBy: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { b } = useBi();

  if (PARTNERS_WITH_MARKS.length === 0) return null;

  return (
    <Reveal
      delay={80}
      className={`border-t border-ink/10 pt-9 ${className}`}
    >
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-10">
        <p className="shrink-0 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft/55">
          {b({ ar: 'متكامل مع', en: 'Integrated with' })}
        </p>

        <ul className="flex flex-1 flex-wrap items-center justify-center gap-x-9 gap-y-6 sm:justify-start">
          {PARTNERS_WITH_MARKS.map((p) => (
            <li key={p.name} className="flex items-center gap-2.5">
              <PartnerLogo partner={p} size={24} />
              <span className="text-sm font-semibold text-ink-soft/80">
                {b({ ar: p.nameAr ?? p.name, en: p.name })}
              </span>
            </li>
          ))}
        </ul>

        <Link
          to="/integrations"
          className="group inline-flex min-h-6 shrink-0 items-center gap-1.5 rounded-[2px] py-1
            text-sm font-semibold text-navy focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        >
          <span className="underline decoration-navy/30 underline-offset-4 group-hover:decoration-navy">
            {b({ ar: 'كل التكاملات', en: 'All integrations' })}
          </span>
          <span aria-hidden="true" className="rtl:rotate-180">→</span>
        </Link>
      </div>
    </Reveal>
  );
};

export default TrustedBy;
