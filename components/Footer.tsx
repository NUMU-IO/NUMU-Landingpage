import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import NewsletterForm from './redesign/NewsletterForm';
import BrandMark from './redesign/BrandMark';

const Footer: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { key: 'footer.products', href: '/pricing', hash: 'preview' },
    { key: 'footer.themes', href: '/themes' },
    { key: 'footer.apps', href: '/apps' },
    { key: 'footer.tools', href: '/tools' },
    { key: 'footer.learn', href: '/learn' },
    { key: 'footer.developers', href: '/developers' },
    { key: 'footer.pricing', href: '/pricing' },
    { key: 'footer.privacy', href: '/privacy' },
    { key: 'footer.terms', href: '/terms' },
    { key: 'footer.contact', href: '/contact' },
    { key: 'footer.refund', href: '/refund' },
  ];

  const handleClick = (e: React.MouseEvent, link: typeof links[0]) => {
    if (!link.hash) return;
    e.preventDefault();
    const scrollTo = () => {
      const el = document.getElementById(link.hash!);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    };
    if (location.pathname === '/') {
      scrollTo();
    } else {
      navigate('/');
      setTimeout(scrollTo, 100);
    }
  };

  /**
   * The three accounts numu actually runs, as supplied by the owner.
   *
   * The previous list pointed at `instagram.com/numu_eg`,
   * `linkedin.com/in/numueg` (a personal-profile URL) and `x.com/numueg` —
   * none of which are the real accounts. X is gone rather than guessed at:
   * an unverified social link is worse than no link.
   *
   * Instagram and Facebook render their own marks from `brandIcons.ts`.
   * LinkedIn was withdrawn from simple-icons, so it keeps the genuine glyph
   * already committed in this file rather than being redrawn.
   */
  const socials: {
    href: string;
    label: string;
    brand?: string;
    icon?: React.ReactNode;
  }[] = [
    {
      href: 'https://www.instagram.com/numueg_',
      label: language === 'ar' ? 'نُمُو على إنستغرام' : 'numu on Instagram',
      brand: 'instagram',
    },
    {
      href: 'https://www.facebook.com/share/1HUqWH3eEk/',
      label: language === 'ar' ? 'نُمُو على فيسبوك' : 'numu on Facebook',
      brand: 'facebook',
    },
    {
      href: 'https://www.linkedin.com/company/numueg/',
      label: language === 'ar' ? 'نُمُو على لينكدإن' : 'numu on LinkedIn',
      icon: (
        <svg aria-hidden="true" className="size-5" fill="#0A66C2" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto w-full px-4 py-8 md:py-12">
      {/* Editorial panel — cream-paper bg, hairline border, square corners,
          mono section marker peeking above the top edge */}
      <div className="relative bg-paper border border-ink/10 rounded-[4px] px-6 sm:px-10 py-10 sm:py-12">
        {/* § section marker — brand-kit signature */}
        <span
          className="absolute -top-3 start-6 bg-paper px-2 font-mono text-[11px] uppercase tracking-[0.18em] text-terracotta border border-terracotta/40 rounded-[2px]"
          aria-hidden="true"
        >
          § numueg.app · cairo · 2026
        </span>

        <div className="flex flex-col items-center gap-8 sm:gap-10">
          {/* N mark + Reem Kufi wordmark — Arabic glyph نُمُو when Arabic,
              lowercase latin 'numu' otherwise (per brand kit) */}
          <Link
            to="/"
            aria-label={language === 'ar' ? 'نُمُو — الرئيسية' : 'numu — home'}
            className="flex items-center gap-3"
          >
            <img
              src="/numu-mark-cream.webp"
              alt=""
              className="h-11 sm:h-12 w-auto object-contain"
              width="48"
              height="48"
            />
            {language === 'ar' ? (
              <span className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink">
                نُمُو
              </span>
            ) : (
              <span className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-ink lowercase">
                numu
              </span>
            )}
          </Link>

          {/* Tagline */}
          <p className="prose-body text-ink/75 text-center max-w-xl">
            {language === 'ar'
              ? 'منصة التجارة الإلكترونية للتجار في مصر والشرق الأوسط — ابدأ مجانًا.'
              : 'The commerce platform for merchants in Egypt and MENA — start free.'}
          </p>

          {/* Link row */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 sm:gap-x-8">
            {links.map((link) => (
              <Link
                key={link.key}
                to={link.hash ? '/' : link.href}
                onClick={(e) => handleClick(e, link)}
                className="inline-flex items-center min-h-6 py-1 font-medium text-sm text-ink-soft/80 hover:text-navy transition-colors"
              >
                {t(link.key)}
              </Link>
            ))}
          </div>

          {/* Hairline divider */}
          <div className="w-full h-px bg-ink/10" />

          {/* Newsletter — see `NewsletterForm.tsx` for which list this is. */}
          <div className="w-full max-w-md">
            <NewsletterForm />
          </div>

          <div className="w-full h-px bg-ink/10" />

          {/* Bottom rail — socials + copyright */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft/60 order-2 sm:order-1">
              {t('footer.copyright')}
            </p>
            <div className="flex gap-3 order-1 sm:order-2">
              {socials.map(({ href, icon, brand, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="size-9 rounded-[4px] border border-ink/10 flex items-center justify-center
                    text-ink-soft transition-colors hover:border-navy/30 hover:bg-navy/[0.03]
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron
                    focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                >
                  {brand ? <BrandMark brand={brand} size={20} /> : icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
