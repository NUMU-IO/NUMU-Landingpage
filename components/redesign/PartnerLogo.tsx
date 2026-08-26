import React from 'react';
import BrandMark from './BrandMark';
import type { Partner } from './partners';

/**
 * One partner's mark, from whichever real source exists — and a neutral glyph
 * when neither does.
 *
 * Order of preference:
 *   1. `logoSrc`, a brand file shipped in `public/`. Egyptian partners
 *      (Paymob, Fawry, Kashier, InstaPay, Bosta) are only available this way.
 *   2. `brand`, the company's official mark from simple-icons.
 *   3. A connector glyph — identical for every partner that reaches it.
 *
 * Step 3 is the important one. It is deliberately generic and deliberately
 * the same everywhere, so it cannot be mistaken for a company's mark. It is
 * never that company's initial and never its name set in our typeface: both
 * of those read as a wordmark, which is the thing we must not fabricate.
 */

interface Props {
  partner: Partner;
  size?: number;
  className?: string;
}

const PartnerLogo: React.FC<Props> = ({ partner, size = 26, className = '' }) => {
  if (partner.logoSrc) {
    return (
      <img
        src={partner.logoSrc}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        className={`shrink-0 object-contain ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  if (partner.brand) {
    return <BrandMark brand={partner.brand} size={size} className={className} />;
  }

  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-[6px] border border-ink/15
        text-ink-soft/45 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={Math.round(size * 0.55)}
        height={Math.round(size * 0.55)}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      >
        <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5" />
        <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5" />
      </svg>
    </span>
  );
};

export default PartnerLogo;
