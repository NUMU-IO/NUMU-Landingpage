import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { key: 'footer.products', href: '/pricing', hash: 'preview' },
    { key: 'footer.themes', href: '/themes' },
    // Sitewide link so /stores is reachable by crawl, not just from sitemap.xml —
    // it is in turn the only path Googlebot has to any <sub>.numueg.app storefront.
    { key: 'footer.stores', href: '/stores' },
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

  const socials = [
    {
      href: 'https://www.instagram.com/numu_eg/',
      label: 'Follow numu on Instagram',
      icon: (
        <svg aria-hidden="true" className="size-5" fill="currentColor" viewBox="0 0 24 24">
          <path clipRule="evenodd" fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.468 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
        </svg>
      ),
    },
    {
      href: 'https://x.com/numueg',
      label: 'Follow numu on X',
      icon: (
        <svg aria-hidden="true" className="size-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      href: 'https://www.linkedin.com/in/numueg',
      label: 'Connect with numu on LinkedIn',
      icon: (
        <svg aria-hidden="true" className="size-5" fill="currentColor" viewBox="0 0 24 24">
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
                className="font-medium text-sm text-ink-soft/80 hover:text-navy transition-colors"
              >
                {t(link.key)}
              </Link>
            ))}
          </div>

          {/* Hairline divider */}
          <div className="w-full h-px bg-ink/10" />

          {/* Bottom rail — socials + copyright */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft/60 order-2 sm:order-1">
              {t('footer.copyright')}
            </p>
            <div className="flex gap-3 order-1 sm:order-2">
              {socials.map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="size-9 rounded-[4px] border border-ink/10 flex items-center justify-center text-ink-soft hover:text-navy hover:border-navy/30 hover:bg-navy/[0.03] transition-colors"
                >
                  {icon}
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
