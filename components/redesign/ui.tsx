import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSignupModal } from '../../contexts/SignupModalContext';
import { useDemoModal } from '../../contexts/DemoModalContext';
import { CTA, Bi, Lang, pick } from './copy';
import { Reveal } from './Reveal';
import { ASSETS, AssetKey, IS_DEV } from './assets';

/* ============================================================
   Bilingual text helper
   ============================================================ */

/** Reads the active language once, so sections stay free of `isAr` ternaries. */
export function useBi() {
  const { language, dir } = useLanguage();
  const lang = language as Lang;
  return {
    lang,
    dir,
    isAr: lang === 'ar',
    /** Resolve a bilingual string. */
    b: (v: Bi) => pick(v, lang),
  };
}

/* ============================================================
   CTA system — content-system.md § "Fixed CTA vocabulary"

   Every homepage button routes through this file. That is what keeps the
   locked labels from drifting: a section cannot invent `ابدأ الآن` because
   it never writes a label, it only picks a role.
   ============================================================ */

type CtaSize = 'md' | 'lg';

const sizeCls: Record<CtaSize, string> = {
  md: 'text-sm py-2.5 px-5',
  lg: 'text-[15px] sm:text-base py-3.5 px-7',
};

/**
 * Shared focus ring. The palette has no dedicated focus colour, so this uses
 * `saffron` on an offset — it clears WCAG 2.2 non-text contrast against both
 * the cream and the navy-900 surfaces.
 */
const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-cream';
const focusRingOnDark =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900';

/** Primary conversion — always `أنشئ متجرك مجانًا`, always the signup flow. */
export const PrimaryCta: React.FC<{
  size?: CtaSize;
  onDark?: boolean;
  className?: string;
}> = ({ size = 'lg', onDark = false, className = '' }) => {
  const { b } = useBi();
  const { open } = useSignupModal();

  return (
    <button
      type="button"
      onClick={() => open()}
      className={`group inline-flex items-center gap-2 rounded-[4px] font-semibold
        transition-all duration-200 ease-numu active:scale-[0.985] whitespace-nowrap
        ${onDark
          ? `bg-cream text-navy-900 hover:bg-paper ${focusRingOnDark}`
          : `bg-navy text-cream hover:bg-navy-800 ${focusRing}`}
        ${sizeCls[size]} ${className}`}
    >
      <span>{b(CTA.primary)}</span>
      <span
        aria-hidden="true"
        className="text-saffron rtl:rotate-180 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
      >
        →
      </span>
    </button>
  );
};

/** Secondary conversion — always `شاهد الديمو`, always the demo flow. */
export const SecondaryCta: React.FC<{
  size?: CtaSize;
  onDark?: boolean;
  className?: string;
}> = ({ size = 'lg', onDark = false, className = '' }) => {
  const { b } = useBi();
  const { open } = useDemoModal();

  return (
    <button
      type="button"
      onClick={open}
      className={`inline-flex items-center gap-2 rounded-[4px] font-semibold border
        transition-all duration-200 ease-numu active:scale-[0.985] whitespace-nowrap
        ${onDark
          ? `border-cream/35 text-cream hover:bg-cream/10 ${focusRingOnDark}`
          : `border-navy/25 text-navy hover:bg-navy/[0.05] hover:border-navy/40 ${focusRing}`}
        ${sizeCls[size]} ${className}`}
    >
      {b(CTA.secondary)}
    </button>
  );
};

/**
 * Contextual link — only for the four approved destinations in
 * `content-system.md`. Takes the label as a `Bi` so a section still cannot
 * type its own string.
 */
export const ContextLink: React.FC<{
  label: Bi;
  to: string;
  onDark?: boolean;
  className?: string;
}> = ({ label, to, onDark = false, className = '' }) => {
  const { b } = useBi();

  return (
    <Link
      to={to}
      // min-h-6 = 24px: WCAG 2.2 SC 2.5.8 target size. These links are
      // standalone, so the inline-in-a-sentence exception does not apply.
      className={`group inline-flex items-center gap-1.5 font-semibold text-sm rounded-[2px]
        min-h-6 py-1 transition-colors ${onDark
          ? `text-cream/85 hover:text-cream ${focusRingOnDark}`
          : `text-navy hover:text-navy-800 ${focusRing}`}
        ${className}`}
    >
      <span className="underline decoration-current/30 underline-offset-4 group-hover:decoration-current/70">
        {b(label)}
      </span>
      <span aria-hidden="true" className="rtl:rotate-180 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5">
        →
      </span>
    </Link>
  );
};

/* ============================================================
   Section layout
   ============================================================ */

/**
 * Section wrapper. Owns the vertical rhythm and the surface so individual
 * sections never hand-roll padding — `numu-identity.md` § "Layout": one
 * dominant message, one visual job, generous whitespace.
 */
export const Section: React.FC<{
  id: string;
  surface?: 'cream' | 'paper' | 'navy';
  className?: string;
  children: ReactNode;
  labelledBy?: string;
  /**
   * Sections stack as panels: each one lifts over the previous with a rounded
   * top edge. Pass `false` for the first panel after the hero if the overlap
   * is not wanted.
   */
  stacked?: boolean;
}> = ({ id, surface = 'cream', className = '', children, labelledBy, stacked = true }) => {
  const surfaceCls = {
    cream: 'bg-cream text-ink',
    paper: 'bg-paper text-ink',
    navy: 'bg-navy-900 text-cream',
  }[surface];

  // The hairline follows the radius, so the panel edge stays legible even
  // between cream and paper, which are only a few values apart.
  const edgeCls = surface === 'navy' ? 'border-cream/12' : 'border-ink/[0.09]';
  // Light panels get the ink dot field; navy panels already have their own.
  const textureCls =
    surface === 'navy'
      ? 'numu-navy-surface numu-soft-navy'
      : 'numu-dot-surface numu-soft-cream';

  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`relative ${surfaceCls} ${textureCls} py-20 sm:py-24 lg:py-32 ${
        stacked
          ? `-mt-8 sm:-mt-10 rounded-t-[32px] sm:rounded-t-[44px] border-t ${edgeCls}`
          : ''
      } ${className}`}
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-10">{children}</div>
    </section>
  );
};

/**
 * Section heading block: one eyebrow, one headline, one supporting paragraph.
 * `align="start"` follows the writing direction, so Arabic reads from the
 * right without any `rtl:` overrides at the call site.
 */
export const SectionHead: React.FC<{
  id: string;
  eyebrow?: Bi;
  heading: Bi;
  support?: Bi;
  onDark?: boolean;
  align?: 'start' | 'center';
  className?: string;
}> = ({ id, eyebrow, heading, support, onDark = false, align = 'start', className = '' }) => {
  const { b } = useBi();

  return (
    <header
      className={`${align === 'center' ? 'text-center mx-auto max-w-3xl' : 'text-start max-w-2xl'} ${className}`}
    >
      {eyebrow && (
        <Reveal
          as="p"
          className={`font-mono text-[11px] sm:text-xs uppercase tracking-[0.18em] mb-5 ${
            onDark ? 'text-saffron' : 'text-navy'
          }`}
        >
          {b(eyebrow)}
        </Reveal>
      )}
      {/* Size and line-height are always written together with the `/`
          syntax. Tailwind's named sizes (`text-4xl` …) carry their own
          line-height, which silently beats a separate `leading-*` class and
          leaves Arabic headings colliding at the larger breakpoints. */}
      <Reveal
        as="h2"
        id={id}
        delay={60}
        className={`font-display font-bold text-[27px]/[1.28] sm:text-[34px]/[1.25] lg:text-[44px]/[1.22] ${
          onDark ? 'text-cream' : 'text-ink'
        }`}
      >
        {b(heading)}
      </Reveal>
      {support && (
        <Reveal
          as="p"
          delay={130}
          className={`prose-body mt-5 ${onDark ? 'text-cream/75' : 'text-ink-soft/85'}`}
        >
          {b(support)}
        </Reveal>
      )}
    </header>
  );
};

/* ============================================================
   Asset slot
   ============================================================ */

/**
 * Renders a required production image, or — while the file is outstanding —
 * a state that is honest about being unfinished.
 *
 * `asset-plan.md` allows exactly one placeholder behaviour: a visible
 * `ASSET REQUIRED` note **in development only**. In a production build an
 * undelivered asset renders a plain brand surface instead: no invented
 * screenshot, no fake chrome, nothing a visitor could mistake for the
 * product. The surrounding copy is written to carry the section on its own.
 */
export const AssetSlot: React.FC<{
  asset: AssetKey;
  alt: Bi;
  /** Aspect ratio, e.g. `16 / 10`. */
  ratio?: number;
  className?: string;
  imgClassName?: string;
  /** Lazy by default; pass `false` for anything above the fold. */
  lazy?: boolean;
  /** Rendered instead of the neutral panel when the asset is missing. */
  fallback?: ReactNode;
}> = ({ asset, alt, ratio = 16 / 10, className = '', imgClassName = '', lazy = true, fallback }) => {
  const { b } = useBi();
  const entry = ASSETS[asset];

  if (entry.delivered) {
    return (
      <img
        src={entry.src}
        alt={b(alt)}
        loading={lazy ? 'lazy' : 'eager'}
        decoding="async"
        style={{ aspectRatio: String(ratio) }}
        className={`w-full h-full object-cover ${imgClassName} ${className}`}
      />
    );
  }

  if (IS_DEV) {
    return (
      <div
        style={{ aspectRatio: String(ratio) }}
        className={`w-full flex flex-col items-center justify-center gap-2 p-6 text-center
          border-2 border-dashed border-navy/35 bg-navy/[0.04] rounded-[4px] ${className}`}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-terracotta">
          ASSET REQUIRED
        </p>
        <p className="font-mono text-[11px] text-ink-soft/80 break-all">{entry.src}</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft/55">
          owner: {entry.owner}
        </p>
      </div>
    );
  }

  if (fallback) return <>{fallback}</>;

  // Production, asset still outstanding: a quiet brand surface, never a
  // stand-in for the product UI.
  return (
    <div
      style={{ aspectRatio: String(ratio) }}
      className={`w-full bg-bone/60 border border-ink/10 rounded-[4px] ${className}`}
      role="presentation"
    />
  );
};
