import React from 'react';
import { MERCHANTS, Merchant } from './merchants';
import { AssetSlot, useBi } from './ui';
import { CTA } from './copy';
import { useSignupModal } from '../../contexts/SignupModalContext';

/**
 * "Merchants with us" — two rows moving in opposite directions (W2).
 *
 * CSS does all the motion (`.numu-mq*` in `index.css`); this file has no
 * effect and no timer. Each row is its tile group rendered twice in one
 * track, and the track is rendered twice; moving every track by exactly its
 * own width (`translateX(-100%)`) makes the loop seamless at any width. Only
 * the first group of the first track is focusable and announced — every other
 * copy is `inert` and `aria-hidden`, so a keyboard or screen-reader user
 * meets each store once.
 *
 * The strip is forced `dir="ltr"` so the physical keyframe means the same thing
 * in both locales; each tile carries the page direction back for its text.
 * Both rows end in a "your store here?" tile. Row one drifts toward the end of
 * the reading direction, row two toward the
 * start. Hover or keyboard focus pauses a row; `prefers-reduced-motion` turns
 * the rows into a static wrapped grid of the first group.
 */

const REPEAT = 3;

const MerchantMarquee: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { b, dir } = useBi();
  const { open } = useSignupModal();
  const ltr = dir === 'ltr';

  const brandTile = (m: Merchant) => (
    <a
      href={m.url}
      target="_blank"
      rel="noopener noreferrer"
      dir={dir}
      className="numu-mq-tile flex items-center gap-4 w-[290px] sm:w-[340px] h-[128px] px-5 rounded-[12px]
        bg-cream border border-ink/10 hover:border-navy/35 transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
    >
      <span
        className={`grid place-items-center size-[76px] shrink-0 overflow-hidden rounded-[8px] border border-ink/10
          ${m.logoOnDark ? 'bg-ink' : 'bg-cream'}`}
      >
        <img src={m.logo} alt="" width={76} height={76} loading="lazy" decoding="async" className="size-[76px] object-contain" />
      </span>
      <span className="min-w-0">
        <span className="block font-display text-[21px]/[1.3] font-bold text-ink truncate">{m.name}</span>
        <span className="block text-[14px]/[1.45] text-ink-soft/80 truncate">{b(m.category)}</span>
        <span className="mt-1.5 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft/80">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-sage" />
          {b({ ar: 'متجر شغّال', en: 'Live store' })}
        </span>
      </span>
    </a>
  );

  const joinTile = (
    <button
      type="button"
      onClick={() => open()}
      dir={dir}
      className="numu-mq-tile group flex flex-col justify-center items-start gap-2 w-[290px] sm:w-[340px] h-full min-h-[128px] px-6 rounded-[12px]
        bg-navy text-cream text-start border border-navy hover:bg-navy-800 transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
    >
      <span className="font-display text-[22px]/[1.3] font-bold">{b({ ar: 'متجرك هنا؟', en: 'Your store here?' })}</span>
      <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-cream/85">
        {b(CTA.primary)}
        <span aria-hidden="true" className="text-saffron rtl:rotate-180">→</span>
      </span>
    </button>
  );

  const thumbTile = (m: Merchant) => (
    <a
      href={m.url}
      target="_blank"
      rel="noopener noreferrer"
      dir={dir}
      className="numu-mq-tile block w-[300px] sm:w-[420px] rounded-[12px] overflow-hidden bg-cream border border-ink/10
        hover:border-navy/35 transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
    >
      <span className="block border-b border-ink/10">
        <AssetSlot asset={m.thumb} ratio={16 / 10} sizes="420px" alt={{ ar: '', en: '' }} />
      </span>
      <span className="flex items-center justify-between gap-3 px-3.5 py-2.5">
        <span className="font-display text-[17px] font-bold text-ink truncate">{m.name}</span>
        <span className="shrink-0 text-[12px] font-semibold text-navy">
          {b({ ar: 'زور المتجر', en: 'Visit store' })}
          <span aria-hidden="true" className="ms-1 inline-block rtl:-scale-x-100">↗</span>
        </span>
      </span>
    </a>
  );

  const brands = [...MERCHANTS.map((m) => ({ key: m.slug, node: brandTile(m) })), { key: 'join', node: joinTile }];
  const thumbs = [...MERCHANTS.map((m) => ({ key: m.slug, node: thumbTile(m) })), { key: 'join', node: joinTile }];

  return (
    <div className={`space-y-5 mx-[calc(50%-50vw)] ${className}`}>
      <Row items={brands} towardEnd ltr={ltr} seconds={26} label={b({ ar: 'متاجر شغّالة على نُمُو', en: 'Stores running on numu' })} />
      <Row items={thumbs} towardEnd={false} ltr={ltr} seconds={30} label={b({ ar: 'واجهات المتاجر', en: 'The storefronts' })} />
    </div>
  );
};

/**
 * One marquee row. The keyframe always moves content to the left; a row that
 * should drift toward the reading direction's end runs it in reverse in LTR,
 * and a row that drifts toward the start runs it in reverse in RTL.
 */
const Row: React.FC<{
  items: { key: string; node: React.ReactNode }[];
  towardEnd: boolean;
  ltr: boolean;
  seconds: number;
  label: string;
}> = ({ items, towardEnd, ltr, seconds, label }) => {
  const style = {
    animationDuration: `${seconds}s`,
    animationDirection: towardEnd === ltr ? 'reverse' : 'normal',
  } as React.CSSProperties;

  const group = (live: boolean, i: number) => (
    <ul
      key={i}
      className="numu-mq-group"
      aria-label={live ? label : undefined}
      {...(live ? {} : { inert: true, 'aria-hidden': true })}
    >
      {items.map((it) => (
        <li key={it.key}>{it.node}</li>
      ))}
    </ul>
  );

  return (
    <div className="numu-mq" dir="ltr">
      <div className="numu-mq-track" style={style}>
        {Array.from({ length: REPEAT }, (_, i) => group(i === 0, i))}
      </div>
      <div className="numu-mq-track" style={style} aria-hidden="true" inert>
        {Array.from({ length: REPEAT }, (_, i) => group(false, i + REPEAT))}
      </div>
    </div>
  );
};

export default MerchantMarquee;
