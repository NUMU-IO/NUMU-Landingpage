import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useSEO } from '../hooks/useSEO';

const NotFound: React.FC = () => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  useSEO({
    title: isAr ? 'الصفحة مش موجودة — نُمُو' : 'Page not found — numu',
    description: isAr
      ? 'الصفحة اللي بتدور عليها مش موجودة. ارجع لنُمُو.'
      : "The page you're looking for doesn't exist. Return to numu.",
    canonical: 'https://numueg.app/404',
    noIndex: true,
  });

  return (
    <div className="min-h-screen bg-cream paper-grain flex items-center justify-center px-4">
      <div className="relative z-10 text-center max-w-xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 mb-10 hover:opacity-90 transition-opacity"
          aria-label={isAr ? 'نُمُو — الرئيسية' : 'numu — home'}
        >
          <img
            src="/numu-mark-cream.webp"
            alt=""
            className="h-10 w-auto object-contain"
            width="48"
            height="48"
          />
          {isAr ? (
            <span className="font-display text-2xl font-bold tracking-tight text-ink">
              نُمُو
            </span>
          ) : (
            <span className="font-display text-xl font-semibold tracking-tight text-ink lowercase">
              numu
            </span>
          )}
        </Link>

        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-terracotta font-semibold mb-4">
          § 404 · NOT FOUND
        </p>
        <h1 className="font-display text-5xl sm:text-6xl lg:text-[72px] font-bold text-ink tracking-tight leading-[1.05] mb-5">
          {isAr ? (
            <>
              الصفحة <span className="text-terracotta">مش موجودة.</span>
            </>
          ) : (
            <>
              Page <span className="text-terracotta">not found.</span>
            </>
          )}
        </h1>
        <p className="prose-body text-ink/75 mb-10">
          {isAr
            ? 'الرابط ده مش شغّال أو الصفحة اتنقلت. ارجع للرئيسية وابدأ من هناك.'
            : "That link isn't valid or the page has moved. Head back to the homepage and start again."}
        </p>
        <Link
          to="/"
          className="group inline-flex items-center gap-3 bg-navy text-cream font-semibold py-3.5 px-7 rounded-[4px] shadow-card hover:bg-navy-800 active:scale-[0.985] transition-all duration-200 ease-numu text-sm sm:text-base"
        >
          <span>{isAr ? 'الصفحة الرئيسية' : 'Back to home'}</span>
          <span
            aria-hidden="true"
            className="text-lg text-saffron rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform"
          >
            →
          </span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
