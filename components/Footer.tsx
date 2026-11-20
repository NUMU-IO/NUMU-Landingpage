import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import NewsletterForm from './redesign/NewsletterForm';
import BrandMark from './redesign/BrandMark';

type Bi = { ar: string; en: string };

/**
 * Site footer: brand and newsletter on the start side, the site map in three
 * columns beside it, and the copyright, policies and social accounts on a
 * closing rail.
 *
 * Every public page is linked from here, which is what makes /stores (and
 * through it every <sub>.numueg.app storefront) reachable by crawl rather
 * than only from sitemap.xml.
 */
const COLUMNS: { title: Bi; links: { to: string; label: Bi }[] }[] = [
  {
    title: { ar: 'المنتج', en: 'Product' },
    links: [
      { to: '/features', label: { ar: 'المميزات', en: 'Features' } },
      { to: '/pricing', label: { ar: 'الأسعار', en: 'Pricing' } },
      { to: '/themes', label: { ar: 'القوالب', en: 'Themes' } },
      { to: '/apps', label: { ar: 'متجر التطبيقات', en: 'App store' } },
      { to: '/integrations', label: { ar: 'التكاملات', en: 'Integrations' } },
      { to: '/stores', label: { ar: 'دليل المتاجر', en: 'Store directory' } },
    ],
  },
  {
    title: { ar: 'مصادر', en: 'Resources' },
    links: [
      { to: '/learn', label: { ar: 'الأكاديمية', en: 'Academy' } },
      { to: '/blog', label: { ar: 'المدوّنة', en: 'Blog' } },
      { to: '/tools', label: { ar: 'أدوات مجانية', en: 'Free tools' } },
      { to: '/developers', label: { ar: 'المطورين', en: 'Developers' } },
      { to: '/support', label: { ar: 'الدعم', en: 'Support' } },
    ],
  },
  {
    title: { ar: 'نُمُو', en: 'Company' },
    links: [
      { to: '/about', label: { ar: 'عن نُمُو', en: 'About' } },
      { to: '/contact', label: { ar: 'كلمونا', en: 'Contact' } },
      { to: '/partners', label: { ar: 'استعين بخبير', en: 'Hire an expert' } },
    ],
  },
];

const POLICIES: { to: string; label: Bi }[] = [
  { to: '/privacy', label: { ar: 'الخصوصية', en: 'Privacy' } },
  { to: '/terms', label: { ar: 'الشروط', en: 'Terms' } },
  { to: '/refund', label: { ar: 'سياسة الاسترجاع', en: 'Refund policy' } },
];

const LINK_CLS =
  'inline-flex min-h-6 items-center rounded-[2px] py-0.5 text-sm text-ink-soft/85 transition-colors hover:text-navy ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-paper';

const Footer: React.FC = () => {
  const { t, language } = useLanguage();
  const b = (v: Bi) => v[language === 'ar' ? 'ar' : 'en'];

  /**
   * The four accounts numu actually runs.
   *
   * These URLs are also the Organization `sameAs` set in index.html and the
   * two must stay identical - they are what tells Google which profiles are
   * this brand's. Each is the canonical form of its account, not a share
   * redirect (which identifies no account) and not a /in/ personal-profile
   * URL (which would ask Google to equate the company with a person).
   *
   * Instagram and Facebook render their official marks from `brandIcons.ts`.
   * X and LinkedIn were withdrawn from simple-icons, so they keep the genuine
   * glyphs committed here rather than being redrawn.
   */
  const socials: {
    href: string;
    label: string;
    brand?: string;
    icon?: React.ReactNode;
  }[] = [
    {
      href: 'https://www.instagram.com/numueg_/',
      label: language === 'ar' ? 'نُمُو على إنستغرام' : 'numu on Instagram',
      brand: 'instagram',
    },
    {
      href: 'https://www.facebook.com/Numuegy/',
      label: language === 'ar' ? 'نُمُو على فيسبوك' : 'numu on Facebook',
      brand: 'facebook',
    },
    {
      href: 'https://x.com/Numuegy',
      label: language === 'ar' ? 'نُمُو على إكس' : 'numu on X',
      icon: (
        <svg aria-hidden="true" className="size-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      href: 'https://www.linkedin.com/company/numueg',
      label: language === 'ar' ? 'نُمُو على لينكدإن' : 'numu on LinkedIn',
      icon: (
        <svg aria-hidden="true" className="size-5" fill="#0A66C2" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-10">
      <div className="grid gap-12 border-t border-ink/10 pt-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,2fr)] lg:gap-16">
        {/* ── Brand and newsletter ── */}
        <div>
          {/* N mark + wordmark — Arabic glyph نُمُو when Arabic, lowercase
              latin 'numu' otherwise (per brand kit) */}
          <Link
            to="/"
            aria-label={language === 'ar' ? 'نُمُو — الرئيسية' : 'numu — home'}
            className="inline-flex items-center gap-3"
          >
            <img
              src="/numu-mark-cream.webp"
              alt=""
              className="h-10 w-auto object-contain"
              width="40"
              height="43"
              loading="lazy"
              decoding="async"
            />
            {language === 'ar' ? (
              <span className="font-display text-3xl font-bold tracking-tight text-ink">نُمُو</span>
            ) : (
              <span className="font-display text-2xl font-semibold tracking-tight text-ink lowercase">numu</span>
            )}
          </Link>

          <p className="prose-body-sm mt-4 max-w-sm text-ink-soft/80">
            {language === 'ar'
              ? 'منصة التجارة الإلكترونية للتجار في مصر والشرق الأوسط.'
              : 'The commerce platform for merchants in Egypt and MENA.'}
          </p>

          {/* Newsletter — see `NewsletterForm.tsx` for which list this is. */}
          <div className="mt-7 max-w-sm">
            <NewsletterForm />
          </div>
        </div>

        {/* ── Site map ── */}
        <nav
          aria-label={language === 'ar' ? 'روابط الموقع' : 'Site links'}
          className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3"
        >
          {COLUMNS.map((col) => (
            <div key={col.title.en}>
              <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-ink-soft/60">
                {b(col.title)}
              </h2>
              <ul className="mt-4 space-y-2">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className={LINK_CLS}>
                      {b(link.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* ── Closing rail: copyright, policies, socials ── */}
      <div className="mt-12 flex flex-col gap-5 border-t border-ink/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <p className="text-[13px] text-ink-soft/70">{t('footer.copyright')}</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {POLICIES.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className={`${LINK_CLS} text-[13px]`}>
                  {b(link.label)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-2.5">
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
  );
};

export default Footer;
