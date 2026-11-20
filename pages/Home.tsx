import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CookieConsent from '../components/CookieConsent';
import HeroSection from '../components/redesign/HeroSection';
import OnboardingChat from '../components/redesign/OnboardingChat';
import MerchantProof from '../components/redesign/MerchantProof';
import LocalCommerce from '../components/redesign/LocalCommerce';
import ProductSystem from '../components/redesign/ProductSystem';
import ReliabilityGrowth from '../components/redesign/ReliabilityGrowth';
import CodOperations from '../components/redesign/CodOperations';
import InboxAndMobile from '../components/redesign/InboxAndMobile';
import Ecosystem from '../components/redesign/Ecosystem';
import PricingFinalCta from '../components/redesign/PricingFinalCta';
import ExploreMore from '../components/redesign/ExploreMore';
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
 * The whole page is one chunk. It is prerendered, so the headline and primary
 * CTA are painted from HTML before any script runs; splitting each section
 * into its own lazy chunk only meant the sections below the hero collapsed to
 * an empty box, then came back, while React took over.
 *
 * Amended by the owner's 2026-09-25 request (`docs/Plans/landing page
 * updates/`): a guided chat sits between the hero and section 2 (1b),
 * section 2 now opens with the merchants marquee, and section 5
 * shows the order pipeline in place of the globe. The order above is
 * otherwise unchanged.
 */

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

        {/* 1b — the onboarding chat: a few questions, then sign-up with the
            answers carried into the hub's setup wizard. */}
        <OnboardingChat />
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
      </main>

      {/* Below the narrative, not inside it — see ExploreMore's header note. */}
      <ExploreMore />

      <footer id="footer" className="relative numu-below-fold bg-paper numu-dot-surface pt-8 pb-12 lg:pb-16">
        <Footer />
      </footer>

      <CookieConsent />
    </div>
  );
};

export default Home;
