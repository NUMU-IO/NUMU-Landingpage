import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useSignupModal } from '../contexts/SignupModalContext';
import { CTA } from './redesign/copy';
import { NAV_ITEMS } from './redesign/navItems';
import { usePrefersReducedMotion } from './redesign/hooks';

/**
 * Site header.
 *
 * A full-width bar that sits clear over the homepage hero video and settles
 * onto a cream surface with a hairline once the page scrolls. Actions are
 * pill-shaped — the one place the brand's square 4px radius is broken, because
 * a pill reads as a control rather than a card.
 *
 * ─── Mega panel ───────────────────────────────────────────────────────────
 * Items with `groups` open a panel that spans the whole window rather than a
 * dropdown hanging off the trigger. It opens on hover for pointer users and
 * on click/Enter for everyone else, and it never traps: the panel closes on
 * Escape (returning focus to the trigger), on pointer-leave of the whole
 * header, and on navigation.
 *
 * Hover is never the only route in — every trigger is a real `<button>` with
 * `aria-expanded`, and the item's own label is also a link target in the
 * panel, so the destination is reachable without opening anything.
 *
 * `transparentAtTop` is opt-in per page: pages whose hero is a light surface
 * leave it off, or cream text would land on cream.
 */
const Navbar: React.FC<{ transparentAtTop?: boolean }> = ({ transparentAtTop = false }) => {
  const { language, toggleLanguage } = useLanguage();
  const { open: openSignup } = useSignupModal();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const closeTimer = useRef<number | null>(null);
  const reduced = usePrefersReducedMotion();

  const isAr = language === 'ar';
  const L = useCallback(
    (v: { ar: string; en: string }) => (isAr ? v.ar : v.en),
    [isAr],
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (openKey) triggerRefs.current[openKey]?.focus();
      setOpenKey(null);
      setIsLangMenuOpen(false);
      setIsMenuOpen(false);
    };
    const onClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenKey(null);
        setIsMenuOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('keydown', onEsc);
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('keydown', onEsc);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [openKey]);

  // Close everything on navigation.
  useEffect(() => {
    setIsMenuOpen(false);
    setIsLangMenuOpen(false);
    setOpenKey(null);
    setExpandedMobile(null);
  }, [location.pathname]);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    if (!isMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMenuOpen]);

  useEffect(
    () => () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    },
    [],
  );

  const openPanel = (key: string) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setOpenKey(key);
  };
  // Small grace period, so travelling from the trigger into the panel does
  // not close it out from under the pointer.
  const schedulePanelClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenKey(null), 140);
  };

  const overVideo = transparentAtTop && !scrolled && !openKey && !isMenuOpen;
  const activeItem = NAV_ITEMS.find((i) => i.key === openKey && i.groups);

  const linkCls = `text-sm font-medium transition-colors rounded-[3px]
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-4 ${
      overVideo
        ? 'text-cream/85 hover:text-cream focus-visible:ring-offset-navy-900'
        : 'text-ink-soft/85 hover:text-navy focus-visible:ring-offset-cream'
    }`;

  return (
    <header
      ref={headerRef}
      onPointerLeave={schedulePanelClose}
      className="fixed inset-x-0 top-0 z-50"
    >
      {/* ── The glass pane ──
          Deliberately its own leaf element rather than a class on <header>.

          `backdrop-filter` on an element makes it a Backdrop Root: any
          descendant that also has `backdrop-filter` can then only sample what
          that ancestor painted, not the page. With the class on <header>, the
          mega panel and the language menu were descendants of a backdrop root
          whose contents are empty behind them — so their blur had nothing to
          blur and they rendered as flat tinted boxes. It looked like the glass
          simply had not been applied.

          Keeping the pane childless, and the bar content and both dropdowns as
          its siblings, means every one of them samples the page directly.

          Over the hero the pane is dark-tinted so cream text keeps contrast
          against bright frames; on scroll it becomes the cream pane. */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 transition-colors duration-300 ease-numu ${
          overVideo
            ? 'numu-liquid-glass-dark'
            : 'numu-liquid-glass border-b border-ink/10'
        }`}
      />

      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <nav
          aria-label={isAr ? 'التنقل الرئيسي' : 'Main'}
          className="h-16 sm:h-[72px] flex items-center justify-between gap-4"
        >
          {/* ── Logo ── */}
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0"
            aria-label={isAr ? 'نُمُو — الرئيسية' : 'numu — home'}
          >
            <img
              src={overVideo ? '/numu-mark-cream-on-dark.webp' : '/numu-mark-cream.webp'}
              alt=""
              className="h-8 sm:h-9 w-auto object-contain"
              width="36"
              height="36"
              fetchPriority="high"
            />
            <span
              className={`font-display font-bold tracking-tight ${
                isAr ? 'text-xl sm:text-[26px]' : 'text-lg sm:text-2xl lowercase font-semibold'
              } ${overVideo ? 'text-cream' : 'text-ink'}`}
            >
              {isAr ? 'نُمُو' : 'numu'}
            </span>
          </Link>

          {/* ── Centre links ── */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) =>
              item.groups ? (
                <button
                  key={item.key}
                  ref={(el) => {
                    triggerRefs.current[item.key] = el;
                  }}
                  type="button"
                  aria-expanded={openKey === item.key}
                  aria-haspopup="true"
                  onPointerEnter={() => openPanel(item.key)}
                  onFocus={() => openPanel(item.key)}
                  onClick={() => setOpenKey(openKey === item.key ? null : item.key)}
                  className={`${linkCls} inline-flex items-center gap-1.5 px-3 py-2`}
                >
                  {L(item.label)}
                  <svg
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    aria-hidden="true"
                    className={`transition-transform duration-200 ${
                      openKey === item.key ? 'rotate-180' : ''
                    }`}
                  >
                    <path
                      d="M1 1l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              ) : (
                <Link
                  key={item.key}
                  to={item.to}
                  onPointerEnter={schedulePanelClose}
                  className={`${linkCls} px-3 py-2`}
                >
                  {L(item.label)}
                </Link>
              ),
            )}
          </div>

          {/* ── Actions ── */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                aria-expanded={isLangMenuOpen}
                aria-haspopup="true"
                // WCAG 2.5.3 Label in Name: the accessible name has to CONTAIN the
                // visible text. The button reads "AR", so an aria-label of just
                // "تغيير اللغة" left a voice-control user with no way to say it —
                // and failed axe's label-content-name-mismatch.
                aria-label={isAr ? 'AR — تغيير اللغة' : 'EN — Switch language'}
                className={`font-mono text-[11px] uppercase tracking-[0.16em] px-2.5 py-2 rounded-full
                  whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-saffron ${
                    overVideo
                      ? 'text-cream/80 hover:text-cream hover:bg-cream/10'
                      : 'text-ink-soft/80 hover:text-navy hover:bg-navy/[0.05]'
                  }`}
              >
                {isAr ? 'AR' : 'EN'}
              </button>

              {isLangMenuOpen && (
                <div className="absolute top-full end-0 mt-2 w-32 numu-liquid-glass-panel
                  border border-ink/10 overflow-hidden flex flex-col py-1 rounded-[8px]
                  animate-fade-in-up">
                  {(['en', 'ar'] as const).map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => {
                        if (language !== code) toggleLanguage();
                        setIsLangMenuOpen(false);
                      }}
                      className={`px-4 py-2.5 text-sm text-start hover:bg-navy/[0.05] transition-colors ${
                        language === code ? 'text-navy font-semibold' : 'text-ink-soft'
                      }`}
                    >
                      {code === 'en' ? 'English' : 'العربية'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/login"
              className={`hidden md:inline-flex items-center px-3.5 py-2 rounded-full text-sm font-medium
                transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron ${
                  overVideo
                    ? 'text-cream/90 hover:bg-cream/10'
                    : 'text-ink-soft hover:bg-navy/[0.05] hover:text-navy'
                }`}
            >
              {L(CTA.login)}
            </Link>

            <button
              type="button"
              onClick={() => openSignup()}
              className={`inline-flex items-center gap-2 rounded-full px-4 sm:px-5 py-2 sm:py-2.5
                text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ease-numu
                active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron
                focus-visible:ring-offset-2 ${
                  overVideo
                    ? 'bg-cream text-navy-900 hover:bg-paper focus-visible:ring-offset-navy-900'
                    : 'bg-navy text-cream hover:bg-navy-800 focus-visible:ring-offset-cream'
                }`}
            >
              {L(CTA.primary)}
            </button>

            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label={isAr ? 'القائمة' : 'Menu'}
              className={`lg:hidden p-2 -me-1 rounded-full transition-colors focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-saffron ${
                  overVideo ? 'text-cream hover:bg-cream/10' : 'text-ink hover:bg-navy/[0.05]'
                }`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                {isMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </nav>
      </div>

      {/* ── Mega panel — spans the window, not the trigger ── */}
      {activeItem && (
        <div
          onPointerEnter={() => openPanel(activeItem.key)}
          className={`hidden lg:block absolute inset-x-0 top-full numu-liquid-glass-panel
            border-b border-ink/10 ${reduced ? '' : 'animate-slide-down'}`}
        >
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-x-10 gap-y-8">
              {activeItem.groups!.map((group, gi) => (
                <div key={gi}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft/55 mb-4">
                    {L(group.title)}
                  </p>
                  <ul className="space-y-1">
                    {group.links.map((link) => (
                      <li key={link.to}>
                        <Link
                          to={link.to}
                          className="block -mx-3 px-3 py-2.5 rounded-[8px] transition-colors
                            hover:bg-navy/[0.05] focus-visible:outline-none focus-visible:bg-navy/[0.05]"
                        >
                          <span className="block text-sm font-semibold text-ink">
                            {L(link.label)}
                          </span>
                          <span className="block prose-body-sm text-ink-soft/70 mt-0.5">
                            {L(link.desc)}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {activeItem.feature && (
                <Link
                  to={activeItem.feature.to}
                  className="group flex flex-col justify-between rounded-[12px] bg-navy-900
                    numu-navy-surface numu-soft-navy p-6 transition-colors hover:bg-navy-800
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                >
                  <div className="relative z-10">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-saffron">
                      {L(activeItem.feature.eyebrow)}
                    </p>
                    <p className="font-display text-lg font-bold text-cream mt-3 leading-snug">
                      {L(activeItem.feature.title)}
                    </p>
                    <p className="prose-body-sm text-cream/70 mt-2">
                      {L(activeItem.feature.desc)}
                    </p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="relative z-10 mt-5 text-saffron rtl:rotate-180 transition-transform
                      group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                  >
                    →
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile sheet ──
          `relative` is load-bearing, not cosmetic. The glass pane above is
          `position: absolute` and stretches to `inset-0` of the header, so
          when this sheet opens the header grows and the pane grows with it —
          right over the sheet. Positioned elements paint above static in-flow
          content, so an unpositioned sheet ended up *behind* the pane and the
          menu rendered as a blank cream rectangle. Positioning it puts it back
          on top. */}
      {isMenuOpen && (
        <div className="relative lg:hidden border-t border-ink/10 numu-liquid-glass-panel max-h-[calc(100dvh-64px)] overflow-y-auto">
          <div className="px-4 sm:px-6 py-4 flex flex-col gap-1">
            {NAV_ITEMS.map((item) =>
              item.groups ? (
                <div key={item.key}>
                  <button
                    type="button"
                    aria-expanded={expandedMobile === item.key}
                    onClick={() => setExpandedMobile(expandedMobile === item.key ? null : item.key)}
                    className="w-full flex items-center justify-between p-3 text-base font-medium text-ink
                      rounded-[6px] hover:bg-navy/[0.05] transition-colors"
                  >
                    {L(item.label)}
                    <svg
                      width="12" height="7" viewBox="0 0 10 6" fill="none" aria-hidden="true"
                      className={`transition-transform ${expandedMobile === item.key ? 'rotate-180' : ''}`}
                    >
                      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {expandedMobile === item.key && (
                    <div className="ps-3 pb-2 flex flex-col">
                      {item.groups.flatMap((g) => g.links).map((link) => (
                        <Link
                          key={link.to}
                          to={link.to}
                          className="p-3 text-sm text-ink-soft hover:text-navy rounded-[6px]
                            hover:bg-navy/[0.05] transition-colors"
                        >
                          {L(link.label)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.key}
                  to={item.to}
                  className="p-3 text-base font-medium text-ink rounded-[6px] hover:bg-navy/[0.05] transition-colors"
                >
                  {L(item.label)}
                </Link>
              ),
            )}

            <Link
              to="/login"
              className="p-3 text-base font-medium text-ink rounded-[6px] hover:bg-navy/[0.05] transition-colors"
            >
              {L(CTA.login)}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
