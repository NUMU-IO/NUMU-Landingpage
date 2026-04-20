import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useSEO } from '../hooks/useSEO';

const NotFound: React.FC = () => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  useSEO({
    title: isAr ? 'الصفحة غير موجودة — NUMU' : 'Page Not Found — NUMU',
    description: isAr
      ? 'الصفحة اللي بتدور عليها مش موجودة. ارجع لصفحة NUMU الرئيسية.'
      : "The page you're looking for doesn't exist. Return to the NUMU homepage.",
    canonical: 'https://numueg.app/404',
    noIndex: true,
  });

  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <p className="text-sm font-semibold text-primary mb-4 tracking-widest uppercase">404</p>
        <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
          {isAr ? 'الصفحة مش موجودة' : 'Page not found'}
        </h1>
        <p className="text-base text-white/60 mb-10">
          {isAr
            ? 'الرابط ده مش شغال أو الصفحة اتنقلت. تقدر ترجع للرئيسية وتبدأ من هناك.'
            : "That link isn't valid or the page has moved. Head back to the homepage and start again."}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-brand-gradient text-white font-bold py-3 px-8 rounded-2xl transition-all hover:scale-[1.02]"
        >
          <span>{isAr ? 'الصفحة الرئيسية' : 'Back to home'}</span>
          <span className="material-symbols-outlined rtl:rotate-180">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
