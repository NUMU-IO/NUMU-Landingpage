import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useSEO } from '../hooks/useSEO';
import ContactForm from '../components/ContactForm';

/**
 * Standalone /contact page — kept alive for SEO (indexable, shareable URL,
 * direct-traffic bookmarks). Reuses the same <ContactForm variant="email" />
 * as the landing-page modal so there's one source of truth.
 */
const Contact: React.FC = () => {
  const { t, dir, language } = useLanguage();
  const isAr = language === 'ar';

  useSEO({
    title: isAr
      ? 'كلمنا — نُمُو · دعم التجار في مصر والشرق الأوسط'
      : 'Contact numu — Get help with your Egypt & MENA online store',
    description: isAr
      ? 'تواصل مع فريق نُمُو للدعم، المبيعات، أو الشراكات. بنرد بالعربي في أقل من ساعة خلال أوقات العمل.'
      : 'Reach out to the numu team for support, sales, or partnership inquiries. We reply in Arabic and English within the hour during business hours.',
    canonical: 'https://numueg.app/contact',
  });

  return (
    <div className="min-h-screen bg-cream flex flex-col paper-grain" dir={dir}>
      {/* Lightweight top bar — brand kit, not the full Navbar */}
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

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-[560px] w-full flex flex-col gap-8">
          <header className="text-center">
            <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-terracotta font-semibold">
                § CONTACT
              </span>
              <span className="eyebrow">
                {isAr ? 'بالعربي · خلال ساعة' : 'IN ARABIC · WITHIN THE HOUR'}
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink tracking-tight leading-[1.05] mb-4">
              {isAr ? (
                <>
                  عندك سؤال؟{' '}
                  <span className="text-terracotta">اتكلم معانا.</span>
                </>
              ) : (
                <>
                  Got a question?{' '}
                  <span className="text-terracotta">Let's talk.</span>
                </>
              )}
            </h1>
            <p className="prose-body text-ink/75">
              {t('contact.subtitle')}
            </p>
          </header>

          {/* Editorial panel wrapping the form */}
          <div className="relative bg-paper border border-ink/10 rounded-[14px] p-6 sm:p-8 shadow-card">
            <span className="absolute -top-3 start-6 bg-paper px-2 font-mono text-[11px] uppercase tracking-[0.18em] text-terracotta border border-terracotta/40 rounded-[2px] font-semibold">
              § MESSAGE
            </span>
            <ContactForm variant="email" />
          </div>

          {/* Direct-reach rail — mono labels, brand accent dots */}
          <div className="pt-4 border-t border-bone">
            <p className="text-center font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft/60 mb-4">
              {t('contact.or_reach')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <a
                href="https://wa.me/201060082542"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-ink hover:text-sage transition-colors"
              >
                <span
                  className="size-1.5 rounded-full bg-sage"
                  aria-hidden="true"
                />
                <span className="font-mono text-[12px] tracking-wide" dir="ltr">
                  +20 106 008 2542
                </span>
              </a>
              <span className="hidden sm:block w-px h-4 bg-bone" aria-hidden="true" />
              <a
                href="mailto:support@numueg.app"
                className="flex items-center gap-2 text-sm text-ink hover:text-navy transition-colors"
              >
                <span
                  className="size-1.5 rounded-full bg-navy"
                  aria-hidden="true"
                />
                <span className="font-mono text-[12px] tracking-wide" dir="ltr">
                  support@numueg.app
                </span>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
