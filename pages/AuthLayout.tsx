import React, { Suspense, lazy } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Ballpit = lazy(() => import('../components/Ballpit'));

const AuthLayout: React.FC = () => {
  const { t, dir } = useLanguage();

  return (
    <div className="min-h-screen-safe flex flex-col lg:flex-row bg-background-light dark:bg-background-dark font-display" dir={dir}>
      {/* Image Section */}
      <div className="lg:w-1/2 bg-[#02000a] relative overflow-hidden flex items-center justify-center p-4 pt-10 pb-20 sm:p-6 sm:pt-12 sm:pb-24 md:p-12 lg:p-16 text-white min-h-[30vh] sm:min-h-[35vh] lg:min-h-screen order-1 lg:order-none z-0">
        <Suspense fallback={<div className="absolute inset-0 bg-[#02000a]" />}>
          <Ballpit
            count={120}
            gravity={0.1}
            friction={0.963}
            wallBounce={0.95}
            followCursor
            colors={["#02000a","#133477","#060128"]}
          />
        </Suspense>
        
        <div className="relative z-10 max-w-lg text-center lg:text-start pointer-events-none w-full">
          <div className="pointer-events-auto">
            <Link to="/" className="inline-block mb-4 lg:mb-8 hover:scale-105 transition-transform">
              <div className="flex items-center gap-3 text-white justify-center lg:justify-start">
                 <img src="/numu_logo.png" alt="NUMU" className="h-10 lg:h-12 w-auto object-contain brightness-0 invert" width="120" height="40" />
              </div>
            </Link>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-2 lg:mb-6 leading-tight">
              {t('auth.hero_title')}
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90 leading-relaxed max-w-md mx-auto lg:mx-0">
              {t('auth.hero_subtitle')}
            </p>
            
            <div className="mt-8 lg:mt-12 hidden md:flex gap-4 justify-center lg:justify-start">
              <div className="flex -space-x-4 rtl:space-x-reverse">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="size-10 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm flex items-center justify-center text-xs font-bold">
                    {i}k+
                  </div>
                ))}
              </div>
              <div className="flex flex-col text-start">
                <span className="font-bold text-sm">{t('auth.joined_count')}</span>
                <span className="text-xs opacity-75">{t('auth.joined_text')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="lg:w-1/2 flex items-center justify-center p-5 pt-10 sm:p-6 sm:pt-12 md:p-12 lg:p-24 order-2 lg:order-none bg-[#E0E5EC] flex-1 -mt-8 sm:-mt-12 md:-mt-20 rounded-t-[2rem] sm:rounded-t-[3rem] lg:mt-0 lg:rounded-none relative z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] lg:shadow-none">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
