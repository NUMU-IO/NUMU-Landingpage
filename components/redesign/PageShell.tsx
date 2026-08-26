import React, { ReactNode } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import CookieConsent from '../CookieConsent';
import { Bi } from './copy';
import { useBi } from './ui';
import { useSEO } from '../../hooks/useSEO';

/**
 * Shared shell for every secondary page — `pages/other-pages.md`.
 *
 * "Every secondary page uses the same Numueg header, identity tokens,
 * Arabic-first typography, primary CTA and footer. Each page has one job and
 * one primary action."
 *
 * The shell owns the header, the page-lead block, the vertical rhythm and the
 * footer, so an individual page can only supply its body and its one closing
 * step. That is what keeps these pages premium by consistency rather than by
 * adding effects to fill space.
 */

export const PageShell: React.FC<{
  /** Slug used for the canonical URL, e.g. `features`. */
  slug: string;
  eyebrow: Bi;
  /** The page's single headline. */
  heading: Bi;
  /** One supporting paragraph — the page's job in a sentence. */
  lead: Bi;
  title: Bi;
  description: Bi;
  /** The one primary action for this page. */
  action?: ReactNode;
  children: ReactNode;
}> = ({ slug, eyebrow, heading, lead, title, description, action, children }) => {
  const { b } = useBi();

  useSEO({
    title: b(title),
    description: b(description),
    canonical: `https://numueg.app/${slug}`,
  });

  return (
    <div className="relative font-display bg-cream min-h-screen">
      <Navbar />

      <main id="main">
        {/* Page lead */}
        <header className="bg-cream numu-dot-surface pt-28 sm:pt-32 lg:pt-36 pb-14 sm:pb-16">
          <div className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-10">
            <p className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.18em] text-navy mb-5">
              {b(eyebrow)}
            </p>
            <h1 className="font-display font-bold text-ink text-[30px]/[1.28] sm:text-[42px]/[1.2] lg:text-[52px]/[1.16] max-w-3xl">
              {b(heading)}
            </h1>
            <p className="prose-body mt-6 max-w-2xl text-ink-soft/85">{b(lead)}</p>
            {action && <div className="mt-9 flex flex-wrap items-center gap-3">{action}</div>}
          </div>
        </header>

        {children}
      </main>

      <footer className="bg-paper py-12 lg:py-16">
        <Footer />
      </footer>

      <CookieConsent />
    </div>
  );
};

/** Body band inside a secondary page. Mirrors the homepage `Section` rhythm. */
export const PageSection: React.FC<{
  id?: string;
  surface?: 'cream' | 'paper' | 'navy';
  className?: string;
  children: ReactNode;
}> = ({ id, surface = 'paper', className = '', children }) => {
  const surfaceCls = {
    cream: 'bg-cream text-ink',
    paper: 'bg-paper text-ink',
    navy: 'bg-navy-900 text-cream',
  }[surface];
  const edgeCls = surface === 'navy' ? 'border-cream/12' : 'border-ink/[0.09]';
  const textureCls =
    surface === 'navy'
      ? 'numu-navy-surface numu-soft-navy'
      : 'numu-dot-surface numu-soft-cream';

  return (
    <section
      id={id}
      className={`relative ${surfaceCls} ${textureCls} py-16 sm:py-20 lg:py-24
        -mt-8 sm:-mt-10 rounded-t-[32px] sm:rounded-t-[44px] border-t ${edgeCls} ${className}`}
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-10">{children}</div>
    </section>
  );
};

/** Closing step — the single "what next" every secondary page ends on. */
export const PageClose: React.FC<{
  heading: Bi;
  support?: Bi;
  action: ReactNode;
}> = ({ heading, support, action }) => {
  const { b } = useBi();

  return (
    <section
      className="relative bg-navy-900 numu-navy-surface numu-soft-navy py-16 sm:py-20 lg:py-24
        -mt-8 sm:-mt-10 rounded-t-[32px] sm:rounded-t-[44px] border-t border-cream/12"
    >
      <div className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-10 text-center">
        <h2 className="font-display font-bold text-cream text-[26px]/[1.3] sm:text-[30px]/[1.26] lg:text-[38px]/[1.22]">
          {b(heading)}
        </h2>
        {support && (
          <p className="prose-body mt-4 mx-auto max-w-xl text-cream/75">{b(support)}</p>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">{action}</div>
      </div>
    </section>
  );
};

/** Section heading inside a secondary page body. */
export const BodyHead: React.FC<{ heading: Bi; support?: Bi; onDark?: boolean }> = ({
  heading,
  support,
  onDark = false,
}) => {
  const { b } = useBi();
  return (
    <header className="max-w-2xl">
      <h2
        className={`font-display font-bold text-[24px]/[1.3] sm:text-[28px]/[1.28] lg:text-[36px]/[1.24] ${
          onDark ? 'text-cream' : 'text-ink'
        }`}
      >
        {b(heading)}
      </h2>
      {support && (
        <p className={`prose-body mt-4 ${onDark ? 'text-cream/75' : 'text-ink-soft/85'}`}>
          {b(support)}
        </p>
      )}
    </header>
  );
};
