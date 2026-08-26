import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CookieConsent from '../components/CookieConsent';
import { useLanguage } from '../contexts/LanguageContext';
import { useSEO } from '../hooks/useSEO';
import { DEFAULT_TRIAL_DAYS, toArabicDigits } from '../lib/trialInfo';
import PricingSection from '../components/PricingSection';
import FAQ from '../components/FAQ';
import { PageClose } from '../components/redesign/PageShell';
import { PrimaryCta, SecondaryCta } from '../components/redesign/ui';

/**
 * /pricing — "Plans, fees, limits, and terms."
 *
 * This is where the detail the homepage deliberately leaves out belongs:
 * every plan (not just the three homepage roles), annual billing, the launch
 * promo and the full FAQ. `PricingSection` is reused unchanged so the numbers
 * here and the numbers on the homepage come from the same admin-controlled
 * endpoint and cannot drift.
 *
 * Two changes from the previous version of this page:
 *
 *   • It now uses the shared `Navbar`/`Footer` chrome instead of a bespoke
 *     mini-nav, per `pages/other-pages.md` — "Every secondary page uses the
 *     same Numueg header ... and footer."
 *   • The meta description no longer claims "from 99 EGP/month". The live
 *     pricing endpoint's cheapest paid plan is Starter at 250 EGP, so that
 *     figure was stale. The description now describes the plan shape without
 *     quoting a price, which keeps it correct whatever the admin sets.
 */
const Pricing: React.FC = () => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  useSEO({
    title: isAr
      ? 'الباقات — نُمُو · اشتراك واضح و٠٪ عمولة على الأوردر'
      : 'Pricing — numu · clear subscriptions and 0% per-order commission',
    description: isAr
      ? `باقات شفّافة من نُمُو — منصة التجارة الإلكترونية عربي الأول لمصر والشرق الأوسط. اشتراك شهري بدون عمولة على الأوردرات، أو "ادفع وأنت تنمو" بدون اشتراك، وتجربة مجانية ${toArabicDigits(String(DEFAULT_TRIAL_DAYS))} يوم بدون بطاقة ائتمان.`
      : `Transparent plans for numu — Arabic-first commerce for Egypt & MENA. Zero-commission subscriptions or Pay as you Grow with no monthly fee, plus a ${DEFAULT_TRIAL_DAYS}-day free trial, no credit card.`,
    canonical: 'https://numueg.app/pricing',
  });

  return (
    <div className="relative font-display bg-cream min-h-screen">
      <Navbar />

      <main id="main" className="relative z-10">
        <section className="bg-cream numu-dot-surface pt-28 sm:pt-32 lg:pt-36 pb-12 sm:pb-16">
          <PricingSection />
        </section>

        <section className="py-14 sm:py-20 bg-paper border-t border-ink/10">
          <FAQ />
        </section>

        <PageClose
          heading={{ ar: 'جاهز تفتح متجرك؟', en: 'Ready to open your store?' }}
          support={{
            ar: 'ابدأ من غير بطاقة ائتمان، وغيّر باقتك في أي وقت.',
            en: 'Start with no credit card and change your plan whenever you like.',
          }}
          action={
            <>
              <PrimaryCta onDark />
              <SecondaryCta onDark />
            </>
          }
        />
      </main>

      <footer className="bg-paper py-12 lg:py-16">
        <Footer />
      </footer>

      <CookieConsent />
    </div>
  );
};

export default Pricing;
