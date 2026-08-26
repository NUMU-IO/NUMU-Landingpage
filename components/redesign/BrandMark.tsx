import React from 'react';
import { BRAND_MARKS, hasBrandMark } from './brandIcons';

/**
 * Renders a company's real mark, or nothing.
 *
 * Three rules, and they are the whole point of this component:
 *
 *   1. The path data comes from `brandIcons.ts`, which is generated from the
 *      `simple-icons` package. Nothing here is drawn by us.
 *   2. A mark is painted in its own official colour by default. Brand
 *      guidelines generally forbid recolouring, so `tone="brand"` is the
 *      default and `tone="ink"` exists only for places where a monochrome
 *      row is the established treatment.
 *   3. A company with no entry renders `null`. The caller decides what to
 *      show instead — a neutral, identical-for-everyone glyph, or just the
 *      name. What it must never do is invent a mark.
 *
 * The glyph is decorative: the company name is always adjacent as real text,
 * so the SVG is `aria-hidden` and carries no title.
 */

interface Props {
  /** Key in `BRAND_MARKS`. Unknown keys render nothing. */
  brand: string;
  size?: number;
  tone?: 'brand' | 'ink';
  className?: string;
}

const BrandMark: React.FC<Props> = ({ brand, size = 22, tone = 'brand', className = '' }) => {
  if (!hasBrandMark(brand)) return null;
  const mark = BRAND_MARKS[brand];

  return (
    <svg
      role="img"
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`shrink-0 ${className}`}
      fill={tone === 'brand' ? `#${mark.hex}` : 'currentColor'}
    >
      <path d={mark.path} />
    </svg>
  );
};

export default BrandMark;
