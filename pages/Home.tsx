import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SideNav from '../components/SideNav';
import Hero from '../components/Hero';
import Preview from '../components/Preview';
import Features from '../components/Features';
import ImportShowcase from '../components/ImportShowcase';
import AIShowcase from '../components/AIShowcase';
import MultiChannelShowcase from '../components/MultiChannelShowcase';
import Integrations from '../components/Integrations';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import { NavItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useLandingConfig } from '../contexts/LandingConfigContext';

const Home: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState<string>('hero');
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const { t } = useLanguage();
  const { isSectionVisible } = useLandingConfig();
  const location = useLocation();

  const allNavItems: NavItem[] = useMemo(() => [
    { id: 'hero', label: t('nav.home') },
    { id: 'preview', label: t('nav.preview') },
    { id: 'features', label: t('nav.features') },
    { id: 'import-showcase', label: t('nav.integrations') },
    { id: 'ai-showcase', label: t('features.ai.title') },
    { id: 'multichannel-showcase', label: t('features.multichannel.title') },
    { id: 'integrations', label: t('nav.integrations') },
    { id: 'testimonials', label: t('nav.testimonials') },
    { id: 'cta', label: t('nav.cta') },
    { id: 'footer', label: t('nav.footer') },
  ], [t]);

  // Filter nav items to only include visible sections
  const navItems = useMemo(
    () => allNavItems.filter((item) => isSectionVisible(item.id)),
    [allNavItems, isSectionVisible]
  );

  useEffect(() => {
    // Handle scroll from other pages
    if (location.state && location.state.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      // Clear state to prevent scrolling on subsequent renders/refreshes
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
        threshold: 0.55,
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
    <div className="h-screen overflow-hidden relative font-display">
      <Navbar />
      <SideNav activeId={activeSectionId} items={navItems} />

      <main className="lg:snap-y lg:snap-mandatory h-screen overflow-y-scroll scroll-smooth no-scrollbar w-full">
        {isSectionVisible('hero') && (
          <section id="hero" className="lg:snap-start min-h-screen lg:h-screen relative flex items-center justify-center bg-background-light pt-20 lg:pt-0">
            <Hero />
          </section>
        )}
        {isSectionVisible('preview') && (
          <section id="preview" className="lg:snap-start min-h-screen lg:h-screen relative flex items-center justify-center bg-background-alt overflow-hidden py-20 lg:py-0">
            <Preview />
          </section>
        )}
        {isSectionVisible('features') && (
          <section id="features" className="lg:snap-start min-h-screen lg:h-screen relative flex items-center justify-center bg-background-light py-20 lg:py-0">
            <Features />
          </section>
        )}
        {isSectionVisible('import-showcase') && (
          <section id="import-showcase" className="lg:snap-start min-h-screen lg:h-screen relative flex items-center justify-center bg-background-alt py-20 lg:py-0">
            <ImportShowcase />
          </section>
        )}
        {isSectionVisible('ai-showcase') && (
          <section id="ai-showcase" className="lg:snap-start min-h-screen lg:h-screen relative flex items-center justify-center bg-background-light py-20 lg:py-0">
            <AIShowcase />
          </section>
        )}
        {isSectionVisible('multichannel-showcase') && (
          <section id="multichannel-showcase" className="lg:snap-start min-h-screen lg:h-screen relative flex items-center justify-center bg-background-alt py-20 lg:py-0">
            <MultiChannelShowcase />
          </section>
        )}
        {isSectionVisible('integrations') && (
          <section id="integrations" className="lg:snap-start min-h-screen lg:h-screen relative flex items-center justify-center bg-background-light py-20 lg:py-0">
            <Integrations />
          </section>
        )}
        {isSectionVisible('testimonials') && (
          <section id="testimonials" className="lg:snap-start min-h-screen lg:h-screen relative flex items-center justify-center bg-background-alt py-20 lg:py-0">
            <Testimonials />
          </section>
        )}
        {isSectionVisible('cta') && (
          <section id="cta" className="lg:snap-start min-h-[60vh] lg:min-h-screen lg:h-screen relative flex items-center justify-center bg-background-light py-16 lg:py-0">
            <CTA />
          </section>
        )}
        {isSectionVisible('footer') && (
          <section id="footer" className="lg:snap-end relative flex items-center justify-center bg-background-alt py-12 lg:py-16">
            <Footer />
          </section>
        )}
      </main>
    </div>
  );
};

export default Home;
