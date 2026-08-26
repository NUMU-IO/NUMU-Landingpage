import React from 'react';
import { usePrefersReducedMotion, useMediaQuery } from '../hooks';
import { PARTNERS_WITH_LOGOS } from '../partners';
import { useBi } from '../ui';
import OriginKitInteractiveGrid from './vendor/interactive-grid';

/**
 * Interactive Grid — approved integrations section ONLY.
 * `animations/originkit-placement.md` § "3. Interactive Grid".
 *
 * The component is the real OriginKit one, retrieved through OriginKit MCP
 * and vendored unmodified in `./vendor/interactive-grid.tsx`. Everything
 * below is configuration.
 *
 * ─── v1 configuration ─────────────────────────────────────────────────────
 * The placement doc overrides most of the component's defaults:
 *
 *   cardFill    #000000 → cream          (Numueg surface, not a dark wall)
 *   cardBorder  #292929 → navy @ 14%     (palette border)
 *   shadow      false   → true, navy     ("soft shadow")
 *   glow        false   → false          (explicitly disabled in v1)
 *   rounded     8       → 12             (matches the section's card radius)
 *   columns×rows 7×6    → sized to the roster, see below
 *
 * ─── Why the grid is small ────────────────────────────────────────────────
 * The component tiles its `images` array to fill every cell, so a 7×6 wall
 * would repeat six marks seven times over. A repeated wall reads as "numu has
 * forty integrations", which is exactly the unapproved claim
 * `06-ecosystem.md` guards against. So the grid is sized to the roster: one
 * cell per confirmed integration, no repeats. It grows on its own the day
 * partnerships confirms more marks.
 *
 * Every logo here is a real brand file shipped in `public/`. There are no
 * text stand-ins — a wordmark typed in the site's own font is not that
 * company's logo, and the previous Aramex placeholder was removed for
 * exactly that reason.
 */

const CONFIG = {
  rounded: 12,
  logoScale: 3,
  cardFill: '#FBF6ED',
  cardBorder: 'rgba(0, 51, 102, 0.14)',
  shadow: true,
  cardShadow: 'rgba(0, 31, 63, 0.10)',
  glow: false,
  perspective: 1600,
} as const;

const InteractiveGrid: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { b } = useBi();
  const reduced = usePrefersReducedMotion();
  const isMobile = useMediaQuery('(max-width: 639px)');

  // One cell per confirmed integration — the roster drives the shape.
  // `PARTNERS_WITH_LOGOS`, never `PARTNERS`: an integration that is real but
  // has no supplied brand file must not be drawn as a logo.
  const images = PARTNERS_WITH_LOGOS.map((p) => ({ src: p.logoSrc, alt: p.name }));
  const columns = isMobile ? 3 : Math.min(6, images.length);
  const rows = Math.ceil(images.length / columns);

  return (
    <div className={className}>
      <div
        // Reduced motion freezes the lift: pointer events never reach the
        // cards, so the grid renders as a plain, static logo row.
        style={{ pointerEvents: reduced ? 'none' : undefined }}
        className="h-[190px] sm:h-[240px] rounded-[14px] border border-ink/10 bg-bone/30"
      >
        <OriginKitInteractiveGrid
          images={images}
          columns={columns}
          rows={rows}
          gap={isMobile ? 8 : 12}
          padding={isMobile ? '16px' : '28px'}
          rounded={CONFIG.rounded}
          logoScale={CONFIG.logoScale}
          cardFill={CONFIG.cardFill}
          cardBorder={CONFIG.cardBorder}
          shadow={CONFIG.shadow}
          cardShadow={CONFIG.cardShadow}
          glow={CONFIG.glow}
          perspective={CONFIG.perspective}
        />
      </div>

      {/* Names in text, always present. The grid gives each card an accessible
          name, but hover must never be the only way to read the roster — and
          this line is what a touch or reduced-motion visitor gets. */}
      <p className="mt-5 text-center prose-body-sm text-ink-soft/70">
        {b({ ar: 'التكاملات المفعّلة دلوقتي:', en: 'Live integrations today:' })}{' '}
        <span className="text-ink font-semibold">
          {PARTNERS_WITH_LOGOS.map((p) => p.name).join(' · ')}
        </span>
      </p>
    </div>
  );
};

export default InteractiveGrid;
