import React, { Suspense, lazy, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CookieConsent from '../components/CookieConsent';
import HeroSection from '../components/redesign/HeroSection';
import { useLanguage } from '../contexts/LanguageContext';
import { useSEO } from '../hooks/useSEO';

/**
 * Homepage — v1 redesign.
 *
 * The section order below is FIXED by `page-architecture.md` and must not be
 * reordered without an approved conversion hypothesis:
 *
 *   1. Hero
 *   2. Merchant proof
 *   3. Local commerce layer
 *   4. Product system showcase
 *   5. Reliability and growth
 *   6. COD operations and Trust Network
 *   7. Ecosystem and integrations
 *   8. Pricing and final CTA
 *
 * Explicitly excluded from the v1 homepage: the savings calculator, the
 * founder-seat campaign, the long competitor comparison, the full FAQ
 * inventory, detailed security implementation and the full integrations
 * catalogue. Those components still exist in `components/` and belong on
 * their own pages or in later experiments.
 *
 * Only the hero ships in the main chunk, so the headline and primary CTA
 * paint without waiting for anything below the fold.
 */

const MerchantProof = lazy(() => import('../components/redesign/MerchantProof'));
const LocalCommerce = lazy(() => import('../components/redesign/LocalCommerce'));
const ProductSystem = lazy(() => import('../components/redesign/ProductSystem'));
const ReliabilityGrowth = lazy(() => import('../components/redesign/ReliabilityGrowth'));
const CodOperations = lazy(() => import('../components/redesign/CodOperations'));
const InboxAndMobile = lazy(() => import('../components/redesign/InboxAndMobile'));
const Ecosystem = lazy(() => import('../components/redesign/Ecosystem'));
const PricingFinalCta = lazy(() => import('../components/redesign/PricingFinalCta'));
const ExploreMore = lazy(() => import('../components/redesign/ExploreMore'));

/** Reserves height so the scroll position does not jump as chunks boot. */
const SectionFallback: React.FC = () => (
  <div className="min-h-[420px]" aria-hidden="true" />
);

const Home: React.FC = () => {
  const { language } = useLanguage();
  const location = useLocation();

  useSEO({
    title:
      language === 'ar'
        ? 'نُمُو — افتح متجرك وابدأ البيع من غير تعقيد'
        : 'numu — Open your store and start selling, without the complexity',
    description:
      language === 'ar'
        ? 'متجر عربي جاهز، دفع محلي، شحن أسهل، ودفع عند الاستلام معمول للسوق المصري. ابدأ من غير بطاقة ائتمان ومن غير برمجة.'
        : 'An Arabic storefront that is ready to go, local payments, easier shipping, and cash on delivery built for the Egyptian market. Start with no credit card and no code.',
    canonical: 'https://numueg.app/',
  });

  useEffect(() => {
    const target = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (!target) return;
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
    window.history.replaceState({}, document.title);
  }, [location]);

  return (
    <div className="relative font-display">
      <Navbar transparentAtTop />

      <main id="main" className="w-full">
        {/* 1 */}
        <HeroSection />

        <Suspense fallback={<SectionFallback />}>
          {/* 2 */}
          <MerchantProof />
          {/* 3 */}
          <LocalCommerce />
          {/* 4 */}
          <ProductSystem />
          {/* 5 */}
          <ReliabilityGrowth />
          {/* 6 */}
          <CodOperations />
          {/* 6b — تواصل: the inbox, and numu on the phone. Sits with the
              communication story rather than opening a new one. */}
          <InboxAndMobile />
          {/* 7 */}
          <Ecosystem />
          {/* 8 */}
          <PricingFinalCta />
        </Suspense>
      </main>

      {/* Below the narrative, not inside it — see ExploreMore's header note. */}
      <Suspense fallback={null}>
        <ExploreMore />
      </Suspense>

      <footer id="footer" className="relative bg-paper numu-dot-surface pt-8 pb-12 lg:pb-16">
        <Footer />
      </footer>

      <CookieConsent />
    </div>
  );
};

export default Home;
