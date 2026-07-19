import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useSEO } from '../hooks/useSEO';
import { DEFAULT_TRIAL_DAYS, toArabicDigits } from '../lib/trialInfo';
import PricingSection from '../components/PricingSection';
import FAQ from '../components/FAQ';

/**
 * Standalone /pricing page — kept alive for SEO (indexable, bookmarkable,
 * direct-traffic). Reuses the migrated PricingSection so the component
 * rendered here and the one embedded in the Home page come from a single
 * source of truth.
 */
const Pricing: React.FC = () => {
  const { t, dir, language } = useLanguage();
  const isAr = language === 'ar';

  useSEO({
    title: isAr
      ? 'الباقات — نُمُو · ٠٪ عمولة، يبدأ من ٩٩ جنيه/شهر'
      : 'Pricing — numu · 0% commission, from 99 EGP/month',
    description: isAr
      ? `باقات شفّافة من نُمُو — منصة التجارة الإلكترونية عربي الأول لمصر والشرق الأوسط. اشتراك شهري بدون عمولة، أو "ادفع وأنت تنمو" بدون اشتراك، وتجربة مجانية ${toArabicDigits(String(DEFAULT_TRIAL_DAYS))} يوم بدون بطاقة ائتمان.`
      : `Transparent plans for numu — Arabic-first commerce for Egypt & MENA. Zero-commission subscriptions or Pay as you Grow with no monthly fee, plus a ${DEFAULT_TRIAL_DAYS}-day free trial, no credit card.`,
    canonical: 'https://numueg.app/pricing',
  });

  return (
    <div className="min-h-screen bg-cream paper-grain" dir={dir}>
      <nav className="flex items-center justify-between px-4 sm:px-8 lg:px-12 py-5 border-b border-ink/10 bg-cream/80 backdrop-blur-sm sticky top-0 z-10">
        <Link
          to="/"
          className="flex items-center gap-2.5"
          aria-label={isAr ? 'نُمُو — الرئيسية' : 'numu — home'}
        >
          <img
            src="/numu-mark-cream.webp"
            alt=""
            className="h-8 w-auto object-contain"
            width="40"
            height="40"
          />
          {isAr ? (
            <span className="font-display text-xl font-bold tracking-tight text-ink">
              نُمُو
            </span>
          ) : (
            <span className="font-display text-lg font-semibold tracking-tight text-ink lowercase">
              numu
            </span>
          )}
        </Link>
        <Link
          to="/"
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft/80 hover:text-navy transition-colors"
        >
          ← {isAr ? 'الرئيسية' : 'Home'}
        </Link>
      </nav>

      <main className="relative z-10">
        <section className="py-12 sm:py-16 bg-cream">
          <PricingSection />
        </section>

        <section className="py-12 sm:py-16 bg-paper/40 border-t border-ink/10">
          <FAQ />
        </section>
      </main>
    </div>
  );
};

export default Pricing;
