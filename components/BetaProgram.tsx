import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const BetaProgram: React.FC = () => {
  const { dir, language } = useLanguage();
  const isAr = language === 'ar';

  const perks = [
    {
      icon: 'rocket_launch',
      title: isAr ? 'وصول مبكر' : 'Early Access',
      desc: isAr ? 'كن من أوائل التجار على المنصة وابني حضورك قبل الجميع' : 'Be among the first merchants and build your presence before everyone else',
    },
    {
      icon: 'diamond',
      title: isAr ? 'شهر Premium مجاناً' : '1 Month Premium Free',
      desc: isAr ? 'أكمل إعداد متجرك واحصل على شهر كامل مجاناً من الباقة المتقدمة' : 'Complete your store setup and get a full month of Premium — on us',
    },
    {
      icon: 'support_agent',
      title: isAr ? 'دعم أولوية' : 'Priority Support',
      desc: isAr ? 'فريقنا جاهز يساعدك أول بأول وتجربتك تكون ممتازة' : 'Our team is ready to help you every step of the way',
    },
    {
      icon: 'group_add',
      title: isAr ? 'ادعي أصدقائك' : 'Invite Friends',
      desc: isAr ? 'شارك كود الإحالة — كل صديق يسجل يرفعك في الترتيب' : 'Share your referral code — each friend who joins bumps you up the queue',
    },
    {
      icon: 'feedback',
      title: isAr ? 'صوتك مسموع' : 'Shape the Product',
      desc: isAr ? 'رأيك يأثر مباشرة على المميزات الجديدة اللي بنبنيها' : 'Your feedback directly influences the features we build next',
    },
    {
      icon: 'workspace_premium',
      title: isAr ? 'بادج حصري' : 'Exclusive Badge',
      desc: isAr ? 'متجرك يحصل على بادج "تاجر مؤسس" — تميز يدوم' : 'Your store gets a "Founding Merchant" badge — a distinction that lasts',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto w-full px-4" dir={dir}>
      {/* Header */}
      <div className="text-center mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-300/20 rounded-full px-4 py-1.5 mb-4">
          <span className="material-symbols-outlined text-amber-500 text-sm">star</span>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">{isAr ? 'برنامج البيتا' : 'BETA PROGRAM'}</span>
        </div>
        <h2 className="font-arabic text-2xl sm:text-3xl md:text-4xl font-extrabold text-text-main dark:text-white tracking-tight mb-3">
          {isAr ? 'ليه تنضم لبرنامج البيتا؟' : 'Why Join the Beta Program?'}
        </h2>
        <p className="text-text-muted text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          {isAr
            ? 'تجار البيتا يحصلوا على مميزات حصرية ودعم مباشر وتأثير حقيقي على المنتج.'
            : 'Beta merchants get exclusive perks, direct support, and real influence on the product.'}
        </p>
      </div>

      {/* Perks grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {perks.map((perk) => (
          <div
            key={perk.icon}
            className="rounded-2xl bg-background-light dark:bg-background-dark shadow-neu-flat p-6 sm:p-7 flex flex-col gap-3 hover:shadow-neu-floating transition-shadow duration-300"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-xl">{perk.icon}</span>
            </div>
            <h3 className="text-base font-bold text-text-main dark:text-white">{perk.title}</h3>
            <p className="text-sm text-text-muted leading-relaxed">{perk.desc}</p>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="mt-12 sm:mt-16 rounded-2xl bg-background-light dark:bg-background-dark shadow-neu-flat p-6 sm:p-10">
        <h3 className="text-lg sm:text-xl font-bold text-text-main dark:text-white mb-6 text-center">
          {isAr ? 'إزاي تنضم؟' : 'How It Works'}
        </h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-6 sm:gap-3">
          {[
            { step: '1', icon: 'mail', text: isAr ? 'سجّل بريدك في قائمة الانتظار' : 'Sign up for the waitlist' },
            { step: '2', icon: 'share', text: isAr ? 'شارك كود الإحالة مع أصدقائك' : 'Share your referral code with friends' },
            { step: '3', icon: 'key', text: isAr ? 'استلم كود الدعوة على بريدك' : 'Receive your invite code via email' },
            { step: '4', icon: 'storefront', text: isAr ? 'ابدأ ببناء متجرك!' : 'Start building your store!' },
          ].map((s, i, arr) => (
            <React.Fragment key={s.step}>
              <div className="flex sm:flex-col items-center gap-3 sm:gap-2 text-center flex-1">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-lg">{s.icon}</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-0.5">{isAr ? `خطوة ${s.step}` : `Step ${s.step}`}</p>
                  <p className="text-sm font-medium text-text-main dark:text-white">{s.text}</p>
                </div>
              </div>
              {i < arr.length - 1 && (
                <div className="hidden sm:block w-8 h-px bg-border-light dark:bg-white/10" />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="#waitlist"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] text-white font-bold h-12 sm:h-14 px-8 sm:px-10 rounded-2xl shadow-neu-flat hover:shadow-neu-flat-sm hover:scale-[1.01] transition-all"
          >
            <span>{isAr ? 'انضم الآن' : 'Join Now'}</span>
            <span className="material-symbols-outlined rtl:rotate-180">arrow_forward</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default BetaProgram;
