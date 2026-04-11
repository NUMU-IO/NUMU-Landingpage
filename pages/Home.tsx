import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SideNav from '../components/SideNav';
import Hero, { HeroStats } from '../components/Hero';
import Preview from '../components/Preview';
import Features from '../components/Features';
import ImportShowcase from '../components/ImportShowcase';
import AIShowcase from '../components/AIShowcase';
import MultiChannelShowcase from '../components/MultiChannelShowcase';
import CookieConsent from '../components/CookieConsent';
import Integrations from '../components/Integrations';
import Testimonials from '../components/Testimonials';
import BetaProgram from '../components/BetaProgram';
import WaitlistSection from '../components/WaitlistSection';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import { NavItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useLandingConfig } from '../contexts/LandingConfigContext';
import { useSEO } from '../hooks/useSEO';

const Home: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState<string>('hero');
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const { t } = useLanguage();
  const { isSectionVisible } = useLandingConfig();
  const location = useLocation();

  useSEO({
    title: 'NUMU — Build Your Online Store in Egypt & MENA',
    description: 'Launch your e-commerce store with bilingual Arabic-English support, Egyptian payment gateways (Paymob, Fawry), Bosta shipping, and ETA e-invoicing. Start selling online in Egypt, Saudi Arabia, and UAE today.',
    canonical: 'https://numueg.app/',
  });

  const allNavItems: NavItem[] = useMemo(() => [
    { id: 'hero', label: t('nav.home') },
    { id: 'preview', label: t('nav.preview') },
    { id: 'features', label: t('nav.features') },
    { id: 'import-showcase', label: t('nav.integrations') },
    { id: 'ai-showcase', label: t('features.ai.title') },
    { id: 'multichannel-showcase', label: t('features.multichannel.title') },
    { id: 'integrations', label: t('nav.integrations') },
    { id: 'testimonials', label: t('nav.testimonials') },
    { id: 'beta-program', label: t('nav.beta') },
    { id: 'waitlist', label: t('nav.waitlist') },
    { id: 'cta', label: t('nav.cta') },
    { id: 'footer', label: t('nav.footer') },
  ], [t]);

  const navItems = useMemo(
    () => allNavItems.filter((item) => isSectionVisible(item.id)),
    [allNavItems, isSectionVisible]
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
      }
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
        {/* Hero - dark background, dashboard overlaps into light */}
        {isSectionVisible('hero') && (
          <section id="hero">
            <Hero />
          </section>
        )}

        {/* Stats bridge — sits in the light section right after the hero */}
        {isSectionVisible('hero') && (
          <div className="bg-background-light relative z-10 -mt-24 sm:-mt-32 lg:-mt-40">
            <div className="max-w-6xl mx-auto px-4">
              <HeroStats />
            </div>
          </div>
        )}

        {/* Preview - neumorphic light */}
        {isSectionVisible('preview') && (
          <section id="preview" className="py-16 sm:py-24 bg-background-alt">
            <Preview />
          </section>
        )}

        {/* Features */}
        {isSectionVisible('features') && (
          <section id="features" className="py-16 sm:py-24 bg-background-light">
            <Features />
          </section>
        )}

        {/* Import showcase */}
        {isSectionVisible('import-showcase') && (
          <section id="import-showcase" className="py-16 sm:py-24 bg-background-alt">
            <ImportShowcase />
          </section>
        )}

        {/* AI showcase */}
        {isSectionVisible('ai-showcase') && (
          <section id="ai-showcase" className="py-16 sm:py-24 bg-background-light">
            <AIShowcase />
          </section>
        )}

        {/* Multi-channel */}
        {isSectionVisible('multichannel-showcase') && (
          <section id="multichannel-showcase" className="py-16 sm:py-24 bg-background-alt">
            <MultiChannelShowcase />
          </section>
        )}

        {/* Integrations */}
        {isSectionVisible('integrations') && (
          <section id="integrations" className="py-16 sm:py-24 bg-background-light">
            <Integrations />
          </section>
        )}

        {/* Testimonials */}
        {isSectionVisible('testimonials') && (
          <section id="testimonials" className="py-16 sm:py-24 bg-background-alt">
            <Testimonials />
          </section>
        )}

        {/* Beta Program */}
        {isSectionVisible('beta-program') && (
          <section id="beta-program" className="py-16 sm:py-24 bg-background-light">
            <BetaProgram />
          </section>
        )}

        {/* Waitlist */}
        {isSectionVisible('waitlist') && (
          <section id="waitlist" className="py-16 sm:py-24 bg-background-alt">
            <WaitlistSection />
          </section>
        )}

        {/* CTA */}
        {isSectionVisible('cta') && (
          <section id="cta" className="py-16 sm:py-24 bg-background-light">
            <CTA />
          </section>
        )}

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
