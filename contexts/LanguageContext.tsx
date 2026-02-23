import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations: Record<string, string> = {
  // Auth
  'auth.hero_title': 'Launch your empire today.',
  'auth.hero_subtitle': 'Join the fastest growing commerce platform in the Middle East. Start selling in minutes, not months.',
  'auth.joined_count': '10k+ Merchants',
  'auth.joined_text': 'Growing their business with NUMU',
  'auth.signup_title': 'Create Account',
  'auth.signup_subtitle': 'Start your 14-day free trial. No credit card required.',
  'auth.name': 'Full Name',
  'auth.name_placeholder': 'e.g. Ahmed Ali',
  'auth.email': 'Email Address',
  'auth.email_placeholder': 'name@company.com',
  'auth.password': 'Password',
  'auth.confirm_password': 'Confirm Password',
  'auth.signup_button': 'Create Account',
  'auth.login_link': 'Log in',
  'auth.already_have_account': 'Already have an account?',
  'auth.dont_have_account': 'Don\'t have an account?',
  'auth.signup_link': 'Sign up',
  'auth.login_title': 'Welcome Back',
  'auth.login_subtitle': 'Enter your credentials to access your dashboard.',
  'auth.login_button': 'Sign In',
  'auth.remember_me': 'Remember me',
  'auth.forgot_password': 'Forgot password?',

  // Navbar
  'nav.home': 'Home',
  'nav.preview': 'Preview',
  'nav.product': 'Product',
  'nav.features': 'Features',
  'nav.integrations': 'Integrations',
  'nav.testimonials': 'Stories',
  'nav.cta': 'Start Now',
  'nav.footer': 'Connect',
  'nav.start_free': 'Start Free',
  
  // Hero
  'hero.built_for': 'Built for Egypt & GCC',
  'hero.title_start': 'Launch Your Online Store in',
  'hero.title_highlight': 'Egypt & MENA',
  'hero.subtitle': 'The only platform with built-in Paymob, Fawry, and Bosta integrations. Native Arabic support, ETA e-invoicing, and advanced COD workflows designed for local growth.',
  'hero.cta_primary': 'Start Selling Today',
  'hero.cta_secondary': 'Watch Demo',
  'hero.badge_eta': 'Supports EGP, SAR, AED',
  'hero.badge_whatsapp': 'Native Arabic Storefronts',
  'hero.badge_clean': 'Cash on Delivery Optimized',
  'hero.stats.sales': 'Total Sales',
  'hero.stats.users': 'New Users',

  // Features
  'features.title': 'Built for the Way MENA Trades',
  'features.subtitle': 'Forget generic tools. NUMU is engineered for the unique needs of merchants in Egypt, Saudi Arabia, and the UAE.',
  'features.payments.title': 'Local Payments',
  'features.payments.desc': 'Accept payments via Paymob, Fawry, and mobile wallets. Offer seamless Cash on Delivery with fee configuration.',
  'features.logistics.title': 'Automated Logistics',
  'features.logistics.desc': 'Ship instantly with Bosta. Automatic waybill generation and governorate-based shipping rates.',
  'features.tax.title': 'Tax Compliance',
  'features.tax.desc': 'Generate ETA-compliant e-invoices automatically. Worry-free tax compliance for your business.',
  'features.arabic.title': 'Arabic-First',
  'features.arabic.desc': 'Fully localized dashboard and storefronts. Right-to-Left (RTL) support that feels native, not translated.',

  // Integrations
  'integrations.title': 'Your Local Ecosystem, Connected',
  'integrations.subtitle': 'Connect the tools you already use. From Cairo to Riyadh, we integrate with the region\'s top services so you can focus on selling.',
  'integrations.paymob': 'Paymob & Fawry for seamless payments',
  'integrations.bosta': 'Bosta for automated shipping',
  'integrations.whatsapp': 'WhatsApp for order updates',
  'integrations.ai': 'AI Product Descriptions in Arabic',

  // Testimonials
  'testimonials.title': 'Trusted by Merchants Across the Region',
  'testimonials.t1.text': '"The Bosta integration is a game changer. We ship 50+ orders a day across Egypt without printing a single manual waybill."',
  'testimonials.t1.role': 'Founder, Nile Threads',
  'testimonials.t1.loc': 'Cairo, Egypt',
  'testimonials.t2.text': '"Finally a platform that handles Arabic content correctly. Our conversion rate doubled when we switched to NUMU\'s localized checkout."',
  'testimonials.t2.role': 'Owner, TechSouq',
  'testimonials.t2.loc': 'Dubai, UAE',
  'testimonials.t3.text': '"Managing Cash on Delivery and online payments in one dashboard made our accounting so much easier. Highly recommended."',
  'testimonials.t3.role': 'Manager, Alex Gear',
  'testimonials.t3.loc': 'Jeddah, KSA',

  // CTA
  'cta.title': 'Ready to scale your empire?',
  'cta.subtitle': 'Join 10,000+ merchants growing with NUMU today. No setup fees, cancel anytime.',
  'cta.button': 'Start Your Free Trial',
  'cta.note': 'No credit card required for trial.',

  // Footer
  'footer.products': 'Products',
  'footer.integrations': 'Integrations',
  'footer.pricing': 'Pricing',
  'footer.privacy': 'Privacy',
  'footer.terms': 'Terms',
  'footer.contact': 'Contact',
  'footer.copyright': '© 2026 NUMU Inc. All rights reserved.',

  // Preview
  'preview.title': 'Command Center',
  'preview.subtitle': 'Everything you need to run your Egyptian empire in one place.',
  'preview.mon': 'MON',
  'preview.tue': 'TUE',
  'preview.wed': 'WED',
  'preview.thu': 'THU',
  'preview.fri': 'FRI',
  'preview.revenue': 'Revenue',
  'preview.orders': 'Orders',
  'preview.shipments': 'Shipments',
  'preview.new_order': 'New Order!',
  'preview.new_order_time': 'Just now • Cairo, EG',
  'preview.amount': 'EGP 42,405',

  // Import Showcase
  'import.title': 'From Instagram to Your Store in Seconds',
  'import.subtitle': 'Import your entire product catalog from social media with one click. No manual data entry, no hassle.',
  'import.step1_title': 'Browse Your Feed',
  'import.step1_desc': 'Connect your Instagram or Facebook shop and browse your products.',
  'import.step2_title': 'One-Click Import',
  'import.step2_desc': 'Select products and import them with photos, prices, and descriptions.',
  'import.step3_title': 'Live & Selling',
  'import.step3_desc': 'Products go live on your NUMU store instantly. Start selling!',

  // AI Showcase
  'ai.title': 'AI Writes Your Product Descriptions',
  'ai.subtitle': 'Just upload a product photo. Our AI generates compelling descriptions in Arabic and English — optimized for search and conversions.',
  'ai.step1_title': 'Select a Product',
  'ai.step1_desc': 'Pick any product from your catalog that needs a description.',
  'ai.step2_title': 'AI Generates Copy',
  'ai.step2_desc': 'Our AI writes SEO-optimized descriptions in both Arabic and English.',
  'ai.step3_title': 'Publish & Sell',
  'ai.step3_desc': 'Review, edit if needed, and publish. SEO tags included automatically.',

  // Multi-Channel Showcase
  'multichannel.title': 'One Dashboard, Every Channel',
  'multichannel.subtitle': 'Manage your website, WhatsApp, Instagram, and Facebook store from a single unified dashboard. No more switching tabs.',
  'multichannel.step1_title': 'Unified Dashboard',
  'multichannel.step1_desc': 'See all your channels, orders, and inventory in one place.',
  'multichannel.step2_title': 'Publish Everywhere',
  'multichannel.step2_desc': 'List products on all channels with one click. Sync inventory automatically.',
  'multichannel.step3_title': 'Track Everything',
  'multichannel.step3_desc': 'Unified analytics across all channels. Know where your sales come from.',

  // New Features
  'features.social.title': 'Social Import',
  'features.social.desc': 'Import your product catalog directly from Instagram and Facebook. One click to sync your social storefront.',
  'features.ai.title': 'AI Descriptions',
  'features.ai.desc': 'Generate compelling product descriptions in Arabic and English with AI. Optimized for search and conversions.',
  'features.multichannel.title': 'Multi-Channel',
  'features.multichannel.desc': 'Sell on your website, WhatsApp, Instagram, and Facebook from one unified dashboard.',
};

export const translationsAr: Record<string, string> = {
  // Auth
  'auth.hero_title': 'ابدأ إمبراطوريتك النهاردة.',
  'auth.hero_subtitle': 'انضم لأسرع منصة تجارة إلكترونية بتكبر في الشرق الأوسط. ابدأ بيع في دقايق، مش شهور.',
  'auth.joined_count': '+10 آلاف تاجر',
  'auth.joined_text': 'بيكبروا شغلهم مع نمو',
  'auth.signup_title': 'اعمل حساب جديد',
  'auth.signup_subtitle': 'جرب المنصة ببلاش لمدة 14 يوم. من غير فيزا.',
  'auth.name': 'الاسم بالكامل',
  'auth.name_placeholder': 'مثال: أحمد علي',
  'auth.email': 'الإيميل',
  'auth.email_placeholder': 'name@company.com',
  'auth.password': 'الباسورد',
  'auth.confirm_password': 'تأكيد الباسورد',
  'auth.signup_button': 'اعمل حساب',
  'auth.login_link': 'سجل دخول',
  'auth.already_have_account': 'عندك حساب؟',
  'auth.dont_have_account': 'معندكش حساب؟',
  'auth.signup_link': 'سجل دلوقتي',
  'auth.login_title': 'نورتنا تاني',
  'auth.login_subtitle': 'دخل بياناتك عشان تفتح لوحة التحكم.',
  'auth.login_button': 'سجل دخول',
  'auth.remember_me': 'خليك فاكرني',
  'auth.forgot_password': 'نسيت الباسورد؟',

  // Navbar
  'nav.home': 'الرئيسية',
  'nav.preview': 'نظرة سريعة',
  'nav.product': 'المنتج',
  'nav.features': 'المميزات',
  'nav.integrations': 'التكاملات',
  'nav.testimonials': 'قصص نجاح',
  'nav.cta': 'ابدأ دلوقتي',
  'nav.footer': 'كلمونا',
  'nav.start_free': 'جرب ببلاش',
  
  // Hero
  'hero.built_for': 'معمول عشان مصر والخليج',
  'hero.title_start': 'افتح متجرك الإلكتروني في',
  'hero.title_highlight': 'مصر والشرق الأوسط',
  'hero.subtitle': 'المنصة الوحيدة اللي فيها كل حاجة: بيموب، فوري، وبوسطة. عربي 100%، فاتورة إلكترونية، وشغل الدفع عند الاستلام اللي ينجزك.',
  'hero.cta_primary': 'ابدأ متجرك دلوقتي',
  'hero.cta_secondary': 'شوف الفيديو',
  'hero.badge_eta': 'بيدعم الجنيه، الريال، والدرهم',
  'hero.badge_whatsapp': 'واجهة عربي مظبوطة',
  'hero.badge_clean': 'متظبط للدفع عند الاستلام',
  'hero.stats.sales': 'إجمالي المبيعات',
  'hero.stats.users': 'تجار جدد',

  // Features
  'features.title': 'متفصل عشان التجارة في منطقتنا',
  'features.subtitle': 'سيبك من الأدوات اللي مش لينا. نمو معمولة مخصوص عشان تريح التجار في مصر، السعودية، والإمارات.',
  'features.payments.title': 'دفع محلي',
  'features.payments.desc': 'استقبل فلوسك بـ بيموب، فوري، والمحافظ. وظبط الدفع عند الاستلام بمزاجك.',
  'features.logistics.title': 'شحن أوتوماتيك',
  'features.logistics.desc': 'اشحن علطول مع بوسطة. البوليصة بتطلع لوحدها وسعر الشحن بيتحسب حسب المحافظة.',
  'features.tax.title': 'مظبوط مع الضرايب',
  'features.tax.desc': 'الفاتورة الإلكترونية بتطلع لوحدها ومربوطة بالضرايب. ريح دماغك من وجع القلب.',
  'features.arabic.title': 'عربي أباً عن جد',
  'features.arabic.desc': 'لوحة تحكم وواجهة متجر عربي 100%. مش مجرد ترجمة جوجل، ده عربي بجد.',

  // Integrations
  'integrations.title': 'كل أدواتك في مكان واحد',
  'integrations.subtitle': 'اربط الأدوات اللي بتستخدمها. من القاهرة للرياض، احنا مجمعينلك كل الخدمات المهمة عشان تركز في البيع وبس.',
  'integrations.paymob': 'بيموب وفوري عشان الدفع يمشى',
  'integrations.bosta': 'بوسطة عشان الشحن ينجز',
  'integrations.whatsapp': 'واتساب عشان تتابع الطلبات',
  'integrations.ai': 'وصف منتجات بالذكاء الاصطناعي بالعربي',

  // Testimonials
  'testimonials.title': 'تجار كتير بيثقوا فينا',
  'testimonials.t1.text': '"ربط بوسطة ده اختراع. بنشحن أكتر من 50 أوردر في اليوم في كل حتة في مصر من غير ما نطبع بوليصة واحدة بإيدينا."',
  'testimonials.t1.role': 'مؤسس، نايل ثريدز',
  'testimonials.t1.loc': 'القاهرة، مصر',
  'testimonials.t2.text': '"أخيراً منصة فاهمة العربي صح. مبيعاتنا زادت الضعف لما نقلنا لصفحة الدفع المعربة من نمو."',
  'testimonials.t2.role': 'مالك، تك سوق',
  'testimonials.t2.loc': 'دبي، الإمارات',
  'testimonials.t3.text': '"إدارة الكاش والدفع الأونلاين في مكان واحد ريحتنا جداً في الحسابات. بنصح أي حد بيها."',
  'testimonials.t3.role': 'مدير، أليكس جير',
  'testimonials.t3.loc': 'جدة، السعودية',

  // CTA
  'cta.title': 'جاهز تكبر البيزنس بتاعك؟',
  'cta.subtitle': 'انضم لأكتر من 10,000 تاجر بيكبروا مع نمو النهاردة. مفيش مصاريف تأسيس، وتقدر تلغي في أي وقت.',
  'cta.button': 'ابدأ تجربتك المجانية',
  'cta.note': 'مش محتاج فيزا عشان تجرب.',

  // Footer
  'footer.products': 'المنتجات',
  'footer.integrations': 'التكاملات',
  'footer.pricing': 'الأسعار',
  'footer.privacy': 'الخصوصية',
  'footer.terms': 'الشروط',
  'footer.contact': 'كلمونا',
  'footer.copyright': '© 2026 شركة نمو. جميع الحقوق محفوظة.',

  // Preview
  'preview.title': 'مركز القيادة',
  'preview.subtitle': 'كل اللي محتاجه عشان تدير إمبراطوريتك في مكان واحد.',
  'preview.mon': 'الاثنين',
  'preview.tue': 'الثلاثاء',
  'preview.wed': 'الأربعاء',
  'preview.thu': 'الخميس',
  'preview.fri': 'الجمعة',
  'preview.revenue': 'الإيرادات',
  'preview.orders': 'الطلبات',
  'preview.shipments': 'الشحنات',
  'preview.new_order': 'طلب جديد!',
  'preview.new_order_time': 'دلوقتي • القاهرة',
  'preview.amount': '٤٢,٤٠٥ ج.م',

  // Import Showcase
  'import.title': 'من إنستجرام لمتجرك في ثواني',
  'import.subtitle': 'استورد كل منتجاتك من السوشيال ميديا بضغطة واحدة. من غير إدخال بيانات يدوي.',
  'import.step1_title': 'تصفح البوستات',
  'import.step1_desc': 'اربط حساب إنستجرام أو فيسبوك وتصفح منتجاتك.',
  'import.step2_title': 'استورد بضغطة',
  'import.step2_desc': 'اختار المنتجات واستوردهم بالصور والأسعار والوصف.',
  'import.step3_title': 'في متجرك وجاهز للبيع',
  'import.step3_desc': 'المنتجات بتظهر في متجرك على نمو فوراً. ابدأ بيع!',

  // AI Showcase
  'ai.title': 'الذكاء الاصطناعي بيكتب وصف منتجاتك',
  'ai.subtitle': 'ارفع صورة المنتج وخلي الذكاء الاصطناعي يكتبلك وصف بالعربي والإنجليزي — مظبوط للسيرش والمبيعات.',
  'ai.step1_title': 'اختار منتج',
  'ai.step1_desc': 'اختار أي منتج من الكتالوج محتاج وصف.',
  'ai.step2_title': 'الـ AI بيكتب',
  'ai.step2_desc': 'الذكاء الاصطناعي بيكتب وصف مظبوط بالعربي والإنجليزي.',
  'ai.step3_title': 'انشر وابدأ بيع',
  'ai.step3_desc': 'راجع، عدل لو عايز، وانشر. الـ SEO tags بتتحط أوتوماتيك.',

  // Multi-Channel Showcase
  'multichannel.title': 'لوحة تحكم واحدة، كل القنوات',
  'multichannel.subtitle': 'ادير موقعك، واتساب، إنستجرام، وفيسبوك من لوحة تحكم واحدة. مفيش تنقل بين تابات.',
  'multichannel.step1_title': 'لوحة تحكم موحدة',
  'multichannel.step1_desc': 'شوف كل القنوات، الطلبات، والمخزون في مكان واحد.',
  'multichannel.step2_title': 'انشر في كل مكان',
  'multichannel.step2_desc': 'اعرض منتجاتك في كل القنوات بضغطة. المخزون بيتزامن أوتوماتيك.',
  'multichannel.step3_title': 'تابع كل حاجة',
  'multichannel.step3_desc': 'تقارير موحدة من كل القنوات. اعرف مبيعاتك جاية منين.',

  // New Features
  'features.social.title': 'استيراد من السوشيال',
  'features.social.desc': 'استورد منتجاتك من إنستجرام وفيسبوك مباشرة. ضغطة واحدة وكل حاجة تتنقل.',
  'features.ai.title': 'وصف بالذكاء الاصطناعي',
  'features.ai.desc': 'اكتب وصف منتجاتك بالعربي والإنجليزي بالذكاء الاصطناعي. مظبوط للسيرش والمبيعات.',
  'features.multichannel.title': 'بيع متعدد القنوات',
  'features.multichannel.desc': 'بيع من موقعك، واتساب، إنستجرام، وفيسبوك من لوحة تحكم واحدة.',
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const t = (key: string) => {
    if (language === 'ar') {
      return translationsAr[key] || translations[key] || key;
    }
    return translations[key] || key;
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [dir, language]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
