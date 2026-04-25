import React, { useState, useEffect, useRef, useMemo, Suspense, lazy } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SideNav from '../components/SideNav';
import Hero, { HeroStats } from '../components/Hero';
import CookieConsent from '../components/CookieConsent';
import Footer from '../components/Footer';
import { NavItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useLandingConfig } from '../contexts/LandingConfigContext';
import { useSEO } from '../hooks/useSEO';

/**
 * Below-the-fold sections are lazy-loaded. Only Hero + Navbar + SideNav
 * ship in the main chunk — everything else splits out so first paint
 * lands faster and Lighthouse's initial bundle-size penalty drops.
 */
const Preview = lazy(() => import('../components/Preview'));
const HowItWorks = lazy(() => import('../components/HowItWorks'));
const Features = lazy(() => import('../components/Features'));
const CODFirst = lazy(() => import('../components/CODFirst'));
const TrustNetwork = lazy(() => import('../components/TrustNetwork'));
const ShowcaseTabs = lazy(() => import('../components/ShowcaseTabs'));
const Integrations = lazy(() => import('../components/Integrations'));
const Comparison = lazy(() => import('../components/Comparison'));
const ObjectionHandler = lazy(() => import('../components/ObjectionHandler'));
const SavingsStrip = lazy(() => import('../components/SavingsStrip'));
const PricingSection = lazy(() => import('../components/PricingSection'));
const Testimonials = lazy(() => import('../components/Testimonials'));
const BetaProgram = lazy(() => import('../components/BetaProgram'));
const FAQ = lazy(() => import('../components/FAQ'));
const CTA = lazy(() => import('../components/CTA'));
const ContactSection = lazy(() => import('../components/ContactSection'));

// Placeholder while a below-fold chunk is in-flight — reserves ~300px so
// scroll position doesn't jump when the chunk boots.
const SectionFallback: React.FC = () => (
  <div className="min-h-[300px] bg-transparent" aria-hidden="true" />
);

const Home: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState<string>('hero');
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const { t, language } = useLanguage();
  const { isSectionVisible } = useLandingConfig();
  const location = useLocation();

  useSEO({
    title:
      language === 'ar'
        ? 'نُمُو — افتح متجرك الإلكتروني في مصر والشرق الأوسط · ٠٪ عمولة'
        : 'numu — Arabic-first e-commerce platform for Egypt & MENA · 0% commission',
    description:
      language === 'ar'
        ? 'افتح متجرك الإلكتروني في ١٥ دقيقة. واجهة عربي، بيموب وفوري وبوسطة وفاتورة إلكترونية كلها جوّا. ٠٪ عمولة على الأوردرات. اشتراك شفّاف من ٩٩ جنيه/شهر. للتجار في مصر والسعودية والإمارات.'
        : 'Launch your online store in 15 minutes. Arabic-first storefront, Paymob + Fawry + Bosta + ETA e-invoicing built in. Zero commission on orders. Transparent pricing from 99 EGP/mo. Built for merchants in Egypt, Saudi Arabia, UAE.',
    canonical: 'https://numueg.app/',
  });

  const allNavItems: NavItem[] = useMemo(
    () => [
      { id: 'hero', label: t('nav.home') },
      { id: 'how-it-works', label: t('nav.how') },
      { id: 'preview', label: t('nav.preview') },
      { id: 'features', label: t('nav.features') },
      { id: 'cod-first', label: t('nav.cod') },
      { id: 'trust-network', label: t('nav.trust_network') },
      { id: 'showcase', label: t('nav.showcase') },
      { id: 'integrations', label: t('nav.integrations') },
      { id: 'comparison', label: t('nav.compare') },
      { id: 'objections', label: t('nav.objections') },
      { id: 'pricing', label: t('nav.pricing') },
      { id: 'testimonials', label: t('nav.testimonials') },
      { id: 'founders-100', label: t('nav.founders') },
      { id: 'faq', label: t('nav.faq') },
      { id: 'cta', label: t('nav.cta') },
      { id: 'contact', label: t('nav.contact') },
      { id: 'footer', label: t('nav.footer') },
    ],
    [t],
  );

  const navItems = useMemo(
    () => allNavItems.filter((item) => isSectionVisible(item.id)),
    [allNavItems, isSectionVisible],
  );

  useEffect(() => {
    if (location.state && location.state.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSectionId(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.3,
      },
    );

    const currentRefs = sectionRefs.current;
    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) {
        currentRefs.set(item.id, el);
        observer.observe(el);
      }
    });

    return () => {
      navItems.forEach((item) => {
        const el = currentRefs.get(item.id);
        if (el) observer.unobserve(el);
      });
    };
  }, [navItems]);

  return (
    <div className="relative font-display">
      <Navbar />
      <SideNav activeId={activeSectionId} items={navItems} />

      <main className="w-full scroll-smooth">
        {/* Hero — stays in main chunk for fastest first paint */}
        {isSectionVisible('hero') && (
          <section id="hero">
            <Hero />
          </section>
        )}

        {/* Stats bridge — sits in the light section right after the hero */}
        {isSectionVisible('hero') && (
          <div className="bg-background-light relative z-10 -mt-14 sm:-mt-20 lg:-mt-24">
            <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
              <HeroStats />
            </div>
          </div>
        )}

        <Suspense fallback={<SectionFallback />}>
          {/* How It Works — clarity first, before features */}
          {isSectionVisible('how-it-works') && (
            <section
              id="how-it-works"
              className="py-12 sm:py-16 bg-background-alt"
            >
              <HowItWorks />
            </section>
          )}

          {/* Preview — bento dashboard */}
          {isSectionVisible('preview') && (
            <section id="preview" className="py-12 sm:py-16 bg-background-light">
              <Preview />
            </section>
          )}

          {/* Features — 6 full-bleed brand-color cards */}
          {isSectionVisible('features') && (
            <section
              id="features"
              className="py-12 sm:py-16 bg-background-alt"
            >
              <Features />
            </section>
          )}

          {/* COD-first — context for Trust Network. Frames COD as the
              default order type (95% of EG orders) instead of a plugin. */}
          {isSectionVisible('cod-first') && (
            <section
              id="cod-first"
              className="py-12 sm:py-16 bg-background-light"
              aria-label="Cash on Delivery is numu's default"
            >
              <CODFirst />
            </section>
          )}

          {/* Trust Network — COD fraud shield (the moat) */}
          {isSectionVisible('trust-network') && (
            <section
              id="trust-network"
              className="py-12 sm:py-16 bg-background-alt"
              aria-label="numu Trust Network"
            >
              <TrustNetwork />
            </section>
          )}

          {/* Showcase tabs — merges Import + AI + MultiChannel */}
          {isSectionVisible('showcase') && (
            <section
              id="showcase"
              className="py-12 sm:py-16 bg-background-alt"
            >
              <ShowcaseTabs />
            </section>
          )}

          {/* Integrations */}
          {isSectionVisible('integrations') && (
            <section
              id="integrations"
              className="py-12 sm:py-16 bg-background-light"
            >
              <Integrations />
            </section>
          )}

          {/* Comparison — "No Tricks" */}
          <section
            id="comparison"
            className="py-12 sm:py-16 bg-background-alt"
          >
            <Comparison />
          </section>

          {/* Objection handler — before Pricing, disarm objections */}
          {isSectionVisible('objections') && (
            <section
              id="objections"
              className="py-12 sm:py-16 bg-background-light"
            >
              <ObjectionHandler />
            </section>
          )}

          {/* Savings strip — ROI math right above price. Shares bg with
              Objections above + Pricing below so the paper panel inside
              reads as an elevated card, not a bg swap. */}
          <section id="savings" className="pb-8 sm:pb-10 bg-background-light">
            <SavingsStrip />
          </section>

          {/* Pricing */}
          <section id="pricing" className="py-12 sm:py-16 bg-background-light">
            <PricingSection />
          </section>

          {/* Testimonials */}
          {isSectionVisible('testimonials') && (
            <section
              id="testimonials"
              className="py-12 sm:py-16 bg-background-alt"
            >
              <Testimonials />
            </section>
          )}

          {/* Founder's 100 — repurposed BetaProgram */}
          {isSectionVisible('founders-100') && (
            <section
              id="founders-100"
              className="py-12 sm:py-16 bg-background-light"
            >
              <BetaProgram />
            </section>
          )}

          {/* FAQ */}
          {isSectionVisible('faq') && (
            <section id="faq" className="py-12 sm:py-16 bg-background-alt">
              <FAQ />
            </section>
          )}

          {/* Closing CTA */}
          {isSectionVisible('cta') && (
            <section id="cta" className="py-12 sm:py-16 bg-background-light">
              <CTA />
            </section>
          )}

          {/* Contact — 3 channels (WhatsApp / Email / Sales) */}
          <section id="contact" className="py-12 sm:py-16 bg-background-alt">
            <ContactSection />
          </section>
        </Suspense>

        {/* Footer */}
        {isSectionVisible('footer') && (
          <section id="footer" className="bg-background-alt py-12 lg:py-16">
            <Footer />
          </section>
        )}
      </main>
      <CookieConsent />
    </div>
  );
};

export default Home;
