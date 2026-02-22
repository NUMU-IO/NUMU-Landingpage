import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SideNav from '../components/SideNav';
import Hero from '../components/Hero';
import Preview from '../components/Preview';
import Features from '../components/Features';
import Integrations from '../components/Integrations';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import { NavItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const Home: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState<string>('hero');
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const { t } = useLanguage();
  const location = useLocation();

  const navItems: NavItem[] = [
    { id: 'hero', label: t('nav.home') },
    { id: 'preview', label: t('nav.preview') },
    { id: 'features', label: t('nav.features') },
    { id: 'integrations', label: t('nav.integrations') },
    { id: 'testimonials', label: t('nav.testimonials') },
    { id: 'cta', label: t('nav.cta') },
    { id: 'footer', label: t('nav.footer') },
  ];

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
        threshold: 0.55, // Trigger when >55% visible
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
        <section id="hero" className="lg:snap-start min-h-screen lg:h-screen relative flex items-center justify-center bg-background-light pt-20 lg:pt-0">
          <Hero />
        </section>
        <section id="preview" className="lg:snap-start min-h-screen lg:h-screen relative flex items-center justify-center bg-background-alt overflow-hidden py-20 lg:py-0">
          <Preview />
        </section>
        <section id="features" className="lg:snap-start min-h-screen lg:h-screen relative flex items-center justify-center bg-background-light py-20 lg:py-0">
          <Features />
        </section>
        <section id="integrations" className="lg:snap-start min-h-screen lg:h-screen relative flex items-center justify-center bg-background-alt py-20 lg:py-0">
          <Integrations />
        </section>
        <section id="testimonials" className="lg:snap-start min-h-screen lg:h-screen relative flex items-center justify-center bg-background-light py-20 lg:py-0">
          <Testimonials />
        </section>
        <section id="cta" className="lg:snap-start min-h-screen lg:h-screen relative flex items-center justify-center bg-background-alt py-20 lg:py-0">
          <CTA />
        </section>
        <section id="footer" className="lg:snap-start min-h-screen lg:h-screen relative flex items-center justify-center bg-background-light py-20 lg:py-0">
          <Footer />
        </section>
      </main>
    </div>
  );
};

export default Home;
