import React from 'react';

/**
 * SVG filter definitions for the liquid-glass header.
 *
 * Technique per https://kube.io/blog/liquid-glass-css-svg/ — a real refraction
 * pass rather than a flat frosted blur:
 *
 *   feTurbulence  generates a smooth noise field
 *   feGaussianBlur softens it into gentle, lens-like undulations
 *   feDisplacementMap bends the backdrop along that field
 *
 * Two things make this safe to run behind live text:
 *
 *   1. It is applied through `backdrop-filter`, which only ever touches what
 *      is *behind* the element. The nav labels and logo are foreground, so
 *      they stay pixel-crisp no matter how hard the backdrop is displaced.
 *   2. `scale` is small (8px). Big values look like a funhouse mirror and
 *      make whatever is scrolling underneath unreadable.
 *
 * `baseFrequency` is deliberately low: high frequencies read as noise//grain,
 * low ones read as thick glass.
 *
 * Rendered once at the app root. The `<svg>` is zero-size and
 * `aria-hidden` — it contributes no layout and no accessibility tree node.
 */
const LiquidGlassDefs: React.FC = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    width="0"
    height="0"
    style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
  >
    <defs>
      <filter id="numu-liquid-glass" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.008 0.008"
          numOctaves="2"
          seed="7"
          result="noise"
        />
        {/* Smooths the noise into slow, lens-like swells. Without this the
            displacement reads as grain instead of glass. */}
        <feGaussianBlur in="noise" stdDeviation="6" result="smooth" />
        <feDisplacementMap
          in="SourceGraphic"
          in2="smooth"
          scale="8"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </defs>
  </svg>
);

export default LiquidGlassDefs;
