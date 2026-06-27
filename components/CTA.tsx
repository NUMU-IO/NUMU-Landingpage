import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useSignupModal } from '../contexts/SignupModalContext';

/**
 * Closing CTA — full-bleed navy editorial panel with souk-tile accent,
 * saffron "founder's program" chip and terracotta divider. Matches the
 * brand-kit "CTA · start free" post aesthetic.
 */
const CTA: React.FC = () => {
  const { language } = useLanguage();
  const { open: openSignup } = useSignupModal();
  const isAr = language === 'ar';

  return (
    <div className="max-w-[1200px] mx-auto w-full px-4 sm:px-6 lg:px-10">
      <div className="relative bg-navy text-cream rounded-[14px] overflow-hidden numu-mockup-frame">
        {/* Souk-tile top edge — editorial motif */}
        <span
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-3 opacity-30"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='88' height='12' viewBox='0 0 88 12'><g fill='none' stroke='%23F5EFE6' stroke-width='1'><path d='M0 6 L6 0 L12 6 L6 12 Z' /><circle cx='22' cy='6' r='3' /><path d='M32 6 L38 0 L44 6 L38 12 Z' /><circle cx='54' cy='6' r='3' /><path d='M64 6 L70 0 L76 6 L70 12 Z' /><circle cx='84' cy='6' r='3' /></g></svg>\")",
            backgroundRepeat: 'repeat-x',
          }}
        />

        <div className="relative px-6 sm:px-10 lg:px-16 py-14 sm:py-16 lg:py-20 text-center">
          {/* Mono eyebrow + founder chip */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-saffron font-semibold">
              § FOUNDER'S PROGRAM
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-saffron/15 border border-saffron/40 rounded-[4px] font-mono text-[10px] uppercase tracking-[0.18em] font-semibold text-saffron">
              <span
                className="size-1.5 rounded-full bg-saffron animate-pulse"
                aria-hidden="true"
              />
              {isAr ? `أول ${toArabicDigits('100')} تاجر` : 'First 100 merchants'}
            </span>
          </div>

          {/* Headline — terracotta accent on the verb */}
          <h2 className="font-display text-4xl sm:text-5xl lg:text-[64px] font-bold tracking-tight leading-[1.05] mb-5">
            {isAr ? (
              <>
                جاهز <span className="text-saffron">تبدأ</span>؟
              </>
            ) : (
              <>
                Ready to <span className="text-saffron">start</span>?
              </>
            )}
          </h2>

          <p className="prose-body text-cream/80 max-w-xl mx-auto mb-4">
            {isAr
              ? 'سجّل دلوقتي وافتح متجرك في دقايق. وصول مبكر، دعم أولوية، وشهر Premium مجاناً.'
              : 'Sign up now and launch your store in minutes. Early access, priority support, free month of Premium.'}
          </p>

          {/* Terracotta hairline — editorial signature */}
          <div className="flex justify-center mb-8">
            <span className="w-12 h-[2px] bg-terracotta" aria-hidden="true" />
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto sm:inline-flex">
            {/* Primary — cream on navy, saffron arrow, opens the signup modal */}
            <button
              type="button"
              onClick={() => openSignup()}
              className="group bg-cream text-navy font-semibold py-3.5 px-7 rounded-[4px] text-sm sm:text-base hover:bg-cream/90 active:scale-[0.985] transition-all duration-200 ease-numu flex items-center gap-3 w-full sm:w-auto justify-center"
            >
              <span>{isAr ? 'أنشئ متجرك مجانًا' : 'Create your free store'}</span>
              <span
                aria-hidden="true"
                className="text-lg text-terracotta group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform rtl:rotate-180"
              >
                →
              </span>
            </button>

            {/* Secondary — outlined cream, existing-account login */}
            <Link
              to="/login"
              className="border border-cream/25 text-cream font-semibold py-3.5 px-7 rounded-[4px] text-sm sm:text-base hover:bg-cream/5 hover:border-saffron/60 hover:text-saffron transition-all duration-200 ease-numu flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <span>{isAr ? 'عندي حساب بالفعل' : 'I already have an account'}</span>
            </Link>
          </div>

          {/* Fine print — mono, muted */}
          <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-cream/50">
            {isAr
              ? `بدون فيزا · تجربة ${toArabicDigits('14')} يوم`
              : 'No credit card · 14-day trial'}
          </p>
        </div>

        {/* Souk-tile bottom edge */}
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-3 opacity-30"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='88' height='12' viewBox='0 0 88 12'><g fill='none' stroke='%23F5EFE6' stroke-width='1'><path d='M0 6 L6 0 L12 6 L6 12 Z' /><circle cx='22' cy='6' r='3' /><path d='M32 6 L38 0 L44 6 L38 12 Z' /><circle cx='54' cy='6' r='3' /><path d='M64 6 L70 0 L76 6 L70 12 Z' /><circle cx='84' cy='6' r='3' /></g></svg>\")",
            backgroundRepeat: 'repeat-x',
          }}
        />
      </div>
    </div>
  );
};

const toArabicDigits = (s: string): string =>
  s.replace(/[0-9]/g, (d) => String.fromCharCode(0x0660 + parseInt(d, 10)));

export default CTA;
