import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const CTA: React.FC = () => {
  const { t, language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <div className="max-w-5xl mx-auto w-full px-4">
      <div className="relative rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] shadow-neu-floating p-6 sm:p-8 md:p-16 text-center overflow-hidden" style={{ background: 'hsl(222.2, 47.4%, 11.2%)' }}>
        {/* NUMU watermark pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('/numu_v3.webp')", backgroundSize: "100px", backgroundRepeat: "repeat" }} />

        <div className="relative z-10 flex flex-col items-center gap-4 sm:gap-6">
          <h2 className="font-arabic text-2xl sm:text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            {isAr ? 'جاهز تبني متجرك؟' : 'Ready to build your store?'}
          </h2>
          <p className="text-white/50 text-sm sm:text-base md:text-lg max-w-xl">
            {isAr
              ? 'انضم لبرنامج البيتا الخاص واحصل على وصول مبكر ودعم أولوية وشهر Premium مجاناً.'
              : 'Join our private beta for early access, priority support, and a free month of Premium.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 mt-2 sm:mt-4 w-full sm:w-auto">
            {/* Primary — scroll to waitlist */}
            <a
              href="#waitlist"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white text-brand-start text-sm sm:text-base md:text-lg font-bold h-12 sm:h-14 md:h-16 px-6 sm:px-8 md:px-10 rounded-2xl shadow-[6px_6px_12px_rgba(0,0,0,0.3)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <span>{isAr ? 'انضم لقائمة الانتظار' : 'Join the Waitlist'}</span>
              <span className="material-symbols-outlined">group_add</span>
            </a>

            {/* Secondary — for those who already have a code */}
            <Link
              to="/signup"
              className="border border-white/20 text-white text-sm sm:text-base font-semibold h-12 sm:h-14 md:h-16 px-6 sm:px-8 rounded-2xl hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <span>{isAr ? 'عندي كود دعوة' : 'I have an invite code'}</span>
              <span className="material-symbols-outlined rtl:rotate-180">arrow_forward</span>
            </Link>
          </div>

          <p className="text-xs text-white/30 font-medium mt-2 sm:mt-4">
            {isAr ? 'مفيش فيزا مطلوبة. الفترة التجريبية 14 يوم.' : 'No credit card required. 14-day trial included.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CTA;
