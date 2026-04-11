import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useSEO } from '../hooks/useSEO';
import DemoStartModal from '../components/DemoStartModal';

const plans = [
  {
    key: 'trial',
    nameEn: '30-Day Free Trial',
    nameAr: 'تجربة مجانية ٣٠ يوم',
    priceEn: 'Free',
    priceAr: 'مجاناً',
    periodEn: 'No credit card required',
    periodAr: 'بدون بطاقة ائتمان',
    features: [
      { en: '100 products', ar: '١٠٠ منتج' },
      { en: 'Custom domain', ar: 'دومين خاص' },
      { en: 'All 12 premium themes', ar: 'كل الـ ١٢ ثيم' },
      { en: 'Basic analytics', ar: 'تحليلات أساسية' },
      { en: 'WhatsApp support', ar: 'دعم واتساب' },
    ],
    cta: 'try_demo',
    popular: false,
  },
  {
    key: 'starter',
    nameEn: 'Starter',
    nameAr: 'ستارتر',
    priceEn: '99',
    priceAr: '٩٩',
    annualPriceEn: '990',
    annualPriceAr: '٩٩٠',
    periodEn: 'EGP/month',
    periodAr: 'جنيه/شهر',
    features: [
      { en: '100 products', ar: '١٠٠ منتج' },
      { en: 'Custom domain', ar: 'دومين خاص' },
      { en: 'All 12 premium themes', ar: 'كل الـ ١٢ ثيم' },
      { en: 'Discount codes', ar: 'أكواد خصم' },
      { en: '3 staff members', ar: '٣ أعضاء فريق' },
      { en: 'Webhooks', ar: 'ويب هوكس' },
    ],
    cta: 'subscribe',
    popular: false,
  },
  {
    key: 'pro',
    nameEn: 'Pro',
    nameAr: 'برو',
    priceEn: '299',
    priceAr: '٢٩٩',
    annualPriceEn: '2,990',
    annualPriceAr: '٢,٩٩٠',
    periodEn: 'EGP/month',
    periodAr: 'جنيه/شهر',
    features: [
      { en: 'Unlimited products', ar: 'منتجات بلا حدود' },
      { en: 'Advanced analytics', ar: 'تحليلات متقدمة' },
      { en: 'Automations', ar: 'أتمتة' },
      { en: 'Abandoned cart recovery', ar: 'استرداد السلات المتروكة' },
      { en: 'API access', ar: 'وصول API' },
      { en: '10 staff members', ar: '١٠ أعضاء فريق' },
      { en: 'Priority support', ar: 'دعم أولوية' },
    ],
    cta: 'subscribe',
    popular: true,
  },
  {
    key: 'enterprise',
    nameEn: 'Enterprise',
    nameAr: 'إنتربرايز',
    priceEn: 'Custom',
    priceAr: 'حسب الطلب',
    periodEn: '',
    periodAr: '',
    features: [
      { en: 'Everything in Pro', ar: 'كل مميزات برو' },
      { en: 'Multi-store', ar: 'متاجر متعددة' },
      { en: 'Dedicated account manager', ar: 'مدير حساب مخصص' },
      { en: 'SLA & uptime guarantee', ar: 'ضمان SLA' },
      { en: 'White-glove onboarding', ar: 'إعداد مخصص' },
    ],
    cta: 'contact',
    popular: false,
  },
];

const Pricing: React.FC = () => {
  const { t, dir, language } = useLanguage();
  const isAr = language === 'ar';
  const [annual, setAnnual] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);

  useSEO({
    title: isAr ? 'الأسعار — NUMU | باقات بسيطة وشفافة' : 'Pricing — NUMU | Simple, Transparent Plans',
    description: isAr
      ? 'باقات NUMU تبدأ من ٩٩ جنيه/شهر. تجربة مجانية ٣٠ يوم بدون بطاقة.'
      : 'NUMU plans start at 99 EGP/month. 30-day free trial, no credit card required.',
    canonical: 'https://numueg.app/pricing',
  });

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark" dir={dir}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 sm:px-12 py-5">
        <Link to="/">
          <img src={isAr ? '/numu-logo-ar.webp' : '/numu-logo-en.webp'} alt="NUMU" className="h-8 w-auto" />
        </Link>
        <Link to="/" className="text-sm text-text-muted hover:text-primary font-medium transition-colors">
          {isAr ? 'الرئيسية' : 'Home'}
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-black text-text-main dark:text-white mb-4">
            {isAr ? 'باقات بسيطة وشفافة' : 'Simple, Transparent Pricing'}
          </h1>
          <p className="text-text-muted max-w-lg mx-auto">
            {isAr
              ? 'مفيش رسوم مخفية. مفيش عمولة على الأوردرات. أنت تاخد ١٠٠٪ من إيراداتك.'
              : 'No hidden fees. No per-order commissions. You keep 100% of your revenue.'}
          </p>

          {/* Promo Banner */}
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold">
            <span className="material-symbols-outlined text-base">local_offer</span>
            {isAr ? 'عرض الإطلاق: ٥٠٪ خصم أول ٣ شهور بكود LAUNCH50' : 'Launch offer: 50% off first 3 months with code LAUNCH50'}
          </div>

          {/* Annual toggle */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className={`text-sm ${!annual ? 'text-text-main dark:text-white font-bold' : 'text-text-muted'}`}>
              {isAr ? 'شهري' : 'Monthly'}
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-12 h-6 rounded-full transition-colors ${annual ? 'bg-primary' : 'bg-gray-600'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${annual ? 'translate-x-6 rtl:-translate-x-6' : 'translate-x-0.5 rtl:-translate-x-0.5'}`} />
            </button>
            <span className={`text-sm ${annual ? 'text-text-main dark:text-white font-bold' : 'text-text-muted'}`}>
              {isAr ? 'سنوي (وفر ١٧٪)' : 'Annual (save 17%)'}
            </span>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.key}
              className={`rounded-2xl border p-6 flex flex-col ${
                plan.popular
                  ? 'border-primary bg-primary/5 dark:bg-primary/10 ring-2 ring-primary/30'
                  : 'border-white/10 bg-white/5 dark:bg-white/5'
              }`}
            >
              {plan.popular && (
                <span className="inline-block text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full mb-4 self-start">
                  {isAr ? 'الأكثر شيوعاً' : 'Most Popular'}
                </span>
              )}

              <h3 className="text-lg font-bold text-text-main dark:text-white">
                {isAr ? plan.nameAr : plan.nameEn}
              </h3>

              <div className="mt-3 mb-1">
                <span className="text-3xl font-black text-text-main dark:text-white">
                  {plan.key === 'trial' || plan.key === 'enterprise'
                    ? (isAr ? plan.priceAr : plan.priceEn)
                    : annual && plan.annualPriceEn
                      ? (isAr ? plan.annualPriceAr : plan.annualPriceEn)
                      : (isAr ? plan.priceAr : plan.priceEn)}
                </span>
                {plan.periodEn && (
                  <span className="text-sm text-text-muted ms-1">
                    {annual && plan.key !== 'trial' && plan.key !== 'enterprise'
                      ? (isAr ? 'جنيه/سنة' : 'EGP/year')
                      : (isAr ? plan.periodAr : plan.periodEn)}
                  </span>
                )}
              </div>

              <ul className="mt-4 space-y-2.5 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-muted">
                    <span className="material-symbols-outlined text-primary text-base mt-0.5">check_circle</span>
                    {isAr ? f.ar : f.en}
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                {plan.cta === 'try_demo' && (
                  <button
                    onClick={() => setDemoOpen(true)}
                    className="w-full bg-brand-gradient text-white font-bold py-3 rounded-xl text-sm hover:opacity-90 transition-opacity"
                  >
                    {isAr ? 'ابدأ تجربتك المجانية' : 'Start free trial'}
                  </button>
                )}
                {plan.cta === 'subscribe' && (
                  <button
                    onClick={() => setDemoOpen(true)}
                    className={`w-full font-bold py-3 rounded-xl text-sm transition-opacity ${
                      plan.popular
                        ? 'bg-brand-gradient text-white hover:opacity-90'
                        : 'border border-white/20 text-text-main dark:text-white hover:bg-white/10'
                    }`}
                  >
                    {isAr ? 'جرب أولاً ثم اشترك' : 'Try first, then subscribe'}
                  </button>
                )}
                {plan.cta === 'contact' && (
                  <Link
                    to="/contact"
                    className="block w-full text-center font-bold py-3 rounded-xl text-sm border border-white/20 text-text-main dark:text-white hover:bg-white/10 transition-colors"
                  >
                    {isAr ? 'تواصل معنا' : 'Contact us'}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-sm text-text-muted mt-12 max-w-lg mx-auto">
          {isAr
            ? 'كل الباقات بتشمل: كل الثيمات، الدفع عند الاستلام، بيموب، فوري، بوسطة، ومتجر عربي ١٠٠٪. مفيش عمولة على أوردراتك.'
            : 'All plans include: all themes, COD, Paymob, Fawry, Bosta, and a fully Arabic storefront. Zero commission on your orders.'}
        </p>
      </div>

      <DemoStartModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  );
};

export default Pricing;
