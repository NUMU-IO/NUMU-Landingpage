import React, { Suspense, lazy } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * AuthLayout — two-column shell for /login and /verify-email.
 *
 * Layout: on large screens, a proper 50/50 split. Stacked on mobile.
 * Left (brand) panel gets the navy Ballpit animation + wordmark + tagline.
 * Right (form) panel is cream with the <Outlet /> for the active route.
 *
 * The flex classes use `basis-1/2 shrink-0 grow-0` on both panels to
 * avoid the `w-1/2` + `flex-1` race condition that collapsed the form
 * panel in an earlier pass.
 */
const Ballpit = lazy(() => import('../components/Ballpit'));

const AuthLayout: React.FC = () => {
  const { t, dir, language } = useLanguage();

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row bg-cream font-display"
      dir={dir}
    >
      {/* Brand panel */}
      <div className="relative overflow-hidden bg-navy-900 text-cream lg:basis-1/2 lg:shrink-0 lg:grow-0 min-h-[38vh] lg:min-h-screen order-1 lg:order-none z-0 flex items-center justify-center p-6 sm:p-10 lg:p-16">
        {/* Falling balls — pointer-events on the canvas let the user
            interact; text sits above in its own stacking context. */}
        <Suspense fallback={<div className="absolute inset-0 bg-navy-900" aria-hidden="true" />}>
          <Ballpit
            count={90}
            gravity={0.22}
            friction={0.982}
            wallBounce={0.78}
            followCursor
            colors={[
              '#001F3F', // navy-900 (subtle layer depth)
              '#1F4A7A', // navy-600
              '#E8A430', // saffron
              '#C14A1C', // terracotta
              '#6B8E68', // sage
              '#F5EFE6', // cream
            ]}
          />
        </Suspense>

        {/* Terracotta→saffron hairline at bottom — brand-kit signature */}
        <span
          aria-hidden="true"
          className="absolute bottom-0 start-0 end-0 h-[3px] bg-gradient-to-r from-terracotta to-saffron opacity-60 z-20"
        />

        {/* Content sits above the canvas. Pointer events on the canvas
            are allowed to pass through — the balls are backdrop, the
            text + CTA need to be interactive. */}
        <div className="relative z-10 max-w-lg text-center lg:text-start w-full pointer-events-none">
          <div className="pointer-events-auto">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 mb-6 lg:mb-10 hover:opacity-90 transition-opacity"
              aria-label={language === 'ar' ? 'نُمُو — الرئيسية' : 'numu — home'}
            >
              <img
                src="/numu-mark-navy.webp"
                alt=""
                className="h-10 lg:h-12 w-auto object-contain"
                width="48"
                height="48"
              />
              {language === 'ar' ? (
                <span className="font-display text-2xl lg:text-[28px] font-bold tracking-tight text-cream">
                  نُمُو
                </span>
              ) : (
                <span className="font-display text-xl lg:text-2xl font-semibold tracking-tight text-cream lowercase">
                  numu
                </span>
              )}
            </Link>

            <div className="inline-flex items-center gap-2 bg-saffron/15 border border-saffron/40 rounded-[4px] px-3 py-1 mb-5">
              <span
                className="size-1.5 rounded-full bg-saffron animate-pulse"
                aria-hidden="true"
              />
              <span className="font-mono text-[10px] font-semibold text-saffron uppercase tracking-[0.18em]">
                {language === 'ar' ? 'بيتا خاصة' : 'PRIVATE BETA'}
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-[52px] font-bold tracking-tight leading-[1.05] mb-4 text-cream">
              {t('auth.hero_title')}
            </h1>
            <p className="prose-body text-cream/80 max-w-md mx-auto lg:mx-0">
              {t('auth.hero_subtitle')}
            </p>

            <div className="mt-8 lg:mt-12 hidden md:flex items-center gap-4 justify-center lg:justify-start">
              <div className="flex -space-x-3 rtl:space-x-reverse">
                {[
                  'bg-terracotta text-cream',
                  'bg-saffron text-ink',
                  'bg-sage text-cream',
                  'bg-navy text-cream',
                ].map((palette, i) => (
                  <div
                    key={i}
                    className={`size-9 rounded-full border-2 border-navy-900 flex items-center justify-center font-display text-xs font-bold ${palette}`}
                    aria-hidden="true"
                  >
                    {['R', 'A', 'M', 'F'][i]}
                  </div>
                ))}
              </div>
              <div className="flex flex-col text-start">
                <span className="font-display font-semibold text-sm text-cream">
                  {t('auth.joined_count')}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream/55">
                  {t('auth.joined_text')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="lg:basis-1/2 lg:shrink-0 lg:grow-0 flex items-center justify-center p-6 sm:p-10 lg:p-16 order-2 lg:order-none bg-cream relative z-10">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
