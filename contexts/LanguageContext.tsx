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
  'auth.forgot_password': 'Forgot password?',
  'auth.forgot_title': 'Reset Your Password',
  'auth.forgot_subtitle': 'Enter your email and we\'ll send you a reset link.',
  'auth.forgot_send': 'Send Reset Link',
  'auth.forgot_back': 'Back to login',
  'auth.forgot_success': 'If this email is registered, you\'ll receive a reset link shortly.',

  // Verify Email
  'verify.title': 'Verify Your Email',
  'verify.subtitle': 'We sent a 6-digit code to',
  'verify.submit': 'Verify',
  'verify.resend': 'Resend code',
  'verify.resend_cooldown': 'Resend in',
  'verify.checking_link': 'Verifying your email...',

  // Waitlist
  'waitlist.title': 'Welcome to the Waitlist!',
  'waitlist.subtitle': 'Your email has been verified successfully. You\'re now on our waitlist — we\'ll notify you as soon as your spot is ready.',
  'waitlist.member_since': 'Member since',
  'waitlist.time_on_waitlist': 'Time on waitlist',
  'waitlist.days': 'Days',
  'waitlist.hours': 'Hours',
  'waitlist.minutes': 'Minutes',
  'waitlist.seconds': 'Seconds',
  'waitlist.back_home': 'Back to Home',

  // Pricing
  'pricing.title': 'Simple, Transparent Pricing',
  'pricing.subtitle': 'We\'re preparing our pricing plans. Join the waitlist and be the first to know when we launch.',
  'pricing.coming_soon': 'Coming Soon',
  'pricing.notify': 'Get Notified at Launch',
  'pricing.free_trial': '14-day free trial',
  'pricing.no_card': 'No credit card required',
  'pricing.cancel': 'Cancel anytime',

  // Privacy
  'privacy.title': 'Privacy Policy',
  'privacy.last_updated': 'Last updated',
  'privacy.intro': 'At NUMU, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information when you use our e-commerce platform.',
  'privacy.collect_title': 'Information We Collect',
  'privacy.collect_text': 'We collect information you provide directly to us, such as your name, email address, phone number, and store details when you create an account. We also collect transaction data, product information, and customer data that you manage through our platform.',
  'privacy.use_title': 'How We Use Your Information',
  'privacy.use_text': 'We use your information to provide and improve our services, process transactions, send you notifications about your store, and communicate with you about updates and offers. We never sell your personal data to third parties.',
  'privacy.protect_title': 'How We Protect Your Data',
  'privacy.protect_text': 'We use industry-standard encryption (AES-256) to protect sensitive data at rest and in transit. All payment information is processed through PCI-compliant gateways. Your merchant credentials are encrypted with AES-256-GCM.',
  'privacy.cookies_title': 'Cookies',
  'privacy.cookies_text': 'We use essential httpOnly cookies for authentication and session management. We do not use third-party tracking cookies for advertising purposes.',
  'privacy.rights_title': 'Your Rights',
  'privacy.rights_text': 'You have the right to access, correct, or delete your personal data at any time. You can export your store data or request account deletion by contacting our support team.',
  'privacy.contact_title': 'Contact Us',
  'privacy.contact_text': 'If you have any questions about this privacy policy, please contact us at privacy@numueg.app.',

  // Terms
  'terms.title': 'Terms of Service',
  'terms.last_updated': 'Last updated',
  'terms.intro': 'Welcome to NUMU. By using our platform, you agree to these terms. Please read them carefully.',
  'terms.account_title': 'Account Registration',
  'terms.account_text': 'You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials. You must be at least 18 years old to use our services.',
  'terms.services_title': 'Our Services',
  'terms.services_text': 'NUMU provides an e-commerce platform that allows merchants to create online stores, manage products, process orders, and accept payments. We reserve the right to modify or discontinue features with reasonable notice.',
  'terms.payments_title': 'Payments & Fees',
  'terms.payments_text': 'Transaction fees and subscription costs are outlined in your pricing plan. All monetary values are processed in Egyptian Pounds (EGP). Payments are handled through PCI-compliant third-party processors (Paymob, Fawry).',
  'terms.content_title': 'Your Content',
  'terms.content_text': 'You retain ownership of all content you upload to your store. You are responsible for ensuring your products and content comply with Egyptian law. We may remove content that violates our policies.',
  'terms.termination_title': 'Termination',
  'terms.termination_text': 'You may close your account at any time. We may suspend or terminate accounts that violate these terms. Upon termination, you can request an export of your data within 30 days.',
  'terms.liability_title': 'Limitation of Liability',
  'terms.liability_text': 'NUMU is provided "as is" without warranty. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform.',
  'terms.contact_title': 'Contact Us',
  'terms.contact_text': 'For questions about these terms, please contact us at legal@numueg.app.',

  // Contact
  'contact.title': 'Get in Touch',
  'contact.subtitle': 'Have a question or need help? We\'d love to hear from you.',
  'contact.name': 'Your Name',
  'contact.name_placeholder': 'e.g. Ahmed Ali',
  'contact.email': 'Email Address',
  'contact.email_placeholder': 'name@company.com',
  'contact.message': 'Message',
  'contact.message_placeholder': 'How can we help you?',
  'contact.send': 'Send Message',
  'contact.success': 'Thank you! Your message has been sent. We\'ll get back to you soon.',
  'contact.error': 'Something went wrong. Please try again or email us directly.',
  'contact.or_reach': 'Or reach us directly',
  'contact.location': 'Cairo · Egypt',
  'contact.email_us': 'Email us',
  'contact.follow': 'Follow us',
  'contact.phone': 'Phone Number',
  'contact.phone_placeholder': '+20 1XX XXX XXXX',
  'contact.country': 'Country',
  'contact.country_placeholder': 'e.g. Egypt',
  'contact.city': 'City',
  'contact.city_placeholder': 'e.g. Cairo',

  // Refund Policy
  'refund.badge': 'Shop with Confidence',
  'refund.title': 'Refund Policy',
  'refund.subtitle': 'Your satisfaction is our priority. We make returns simple and hassle-free.',
  'refund.card1_title': '14-Day Returns',
  'refund.card1_desc': 'Return any unused item in its original condition within 14 days of delivery for a full refund.',
  'refund.card2_title': 'Quality Guarantee',
  'refund.card2_desc': 'Received a defective or damaged product? We\'ll replace it or issue a full refund — no questions asked.',
  'refund.card3_title': 'Fast Refunds',
  'refund.card3_desc': 'Approved refunds are processed within 5–7 business days. We keep you updated every step of the way.',
  'refund.view_full': 'View Full Policy',
  'refund.section1_title': 'Return Eligibility',
  'refund.section1_text': 'You can return any unused product in its original condition and packaging within 14 days of delivery. Items must have all tags attached and be free from signs of wear or use.',
  'refund.section2_title': 'Quality Guarantee',
  'refund.section2_text': 'If you receive a defective, damaged, or incorrect item, we will replace it or issue a full refund at no extra cost. Simply contact us within 48 hours of delivery with photos of the issue.',
  'refund.section3_title': 'Refund Processing Time',
  'refund.section3_text': 'Once your return is received and inspected, your refund will be processed within 5–7 business days. You will receive an email notification when the refund has been issued to your original payment method.',
  'refund.section4_title': 'Return Shipping',
  'refund.section4_text': 'For eligible returns, we arrange free pickup from your address. A courier will contact you to schedule a convenient pickup time. For defective items, return shipping is always free.',
  'refund.section5_title': 'Non-Returnable Items',
  'refund.section5_text': 'Personal care products, intimate accessories, items with removed tags or barcodes, and products that have been worn or washed cannot be returned. Sale items marked as final sale are also excluded.',
  'refund.section6_title': 'Need Help?',
  'refund.section6_text': 'Our support team is here to help with any return or refund questions. Reach out via email at hello@numueg.app or through our social media channels. We typically respond within 24 hours.',

  // Navbar
  'nav.home': 'Home',
  'nav.preview': 'Preview',
  'nav.product': 'Product',
  'nav.features': 'Features',
  'nav.how': 'How it works',
  'nav.integrations': 'Integrations',
  'nav.cod': 'COD',
  'nav.trust_network': 'Trust Network',
  'nav.showcase': 'Tools',
  'nav.compare': 'Compare',
  'nav.objections': 'Honest answers',
  'nav.pricing': 'Pricing',
  'nav.faq': 'FAQ',
  'nav.founders': "Founder's 100",
  'nav.contact': 'Contact',
  'nav.testimonials': 'Stories',
  'nav.beta': 'Beta Program',
  'nav.waitlist': 'Waitlist',
  'nav.cta': 'Start Now',
  'nav.footer': 'Connect',
  'nav.start_free': 'Start Free',
  
  // Hero
  'hero.built_for': 'Built for Egypt & GCC',
  'hero.title_line1': 'NUMU Grows Your',
  'hero.title_line2': 'E-Commerce',
  'hero.title_line3': 'in Egypt & MENA',
  'hero.subtitle': 'The only platform with built-in Paymob, Fawry, and Bosta integrations. Native Arabic support, ETA e-invoicing, and advanced COD workflows designed for local growth.',
  'hero.cta_primary': 'Create your free store',
  'hero.cta_secondary': 'Try a Demo',
  'demo.modal.title': 'Open your demo store in 30 seconds',
  'demo.modal.subtitle': 'Free, no credit card. 7-day demo with sample products and orders.',
  'demo.modal.email_placeholder': 'Your email',
  'demo.modal.submit': 'Launch demo store',
  'demo.modal.loading': 'Setting up your demo store...',
  'demo.modal.error.rate_limit': 'Too many demos. Try again in an hour.',
  'demo.modal.error.disposable': 'Please use a real email address.',
  'demo.modal.error.turnstile': 'Bot verification failed. Please try again.',
  'demo.modal.error.generic': 'Something went wrong. Please try again.',
  'hero.badge_eta': 'Supports EGP, SAR, AED',
  'hero.badge_whatsapp': 'Native Arabic Storefronts',
  'hero.badge_clean': 'Cash on Delivery Optimized',
  'hero.stats.sales': 'Total Sales',
  'hero.stats.users': 'New Users',
  // Hero trust row — ETA is the #1 thing no foreign SaaS offers, so it
  // leads; local payment + carrier wordmarks follow as typographic rails.
  'hero.trust_eyebrow': 'Trusted stack',
  'hero.trust_eta': 'ETA e-invoicing · government-certified',
  'hero.trust_pay': 'Pay',
  'hero.trust_ship': 'Ship',

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
  'footer.apps': 'App Store',
  'footer.themes': 'Themes',
  'footer.developers': 'Developers',
  'footer.tools': 'Free tools',
  'footer.learn': 'Academy',
  'footer.pricing': 'Pricing',
  'footer.privacy': 'Privacy',
  'footer.terms': 'Terms',
  'footer.contact': 'Contact',
  'footer.refund': 'Refund Policy',
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
  'auth.forgot_password': 'نسيت الباسورد؟',
  'auth.forgot_title': 'استعادة الباسورد',
  'auth.forgot_subtitle': 'اكتب الإيميل بتاعك وهنبعتلك لينك تغير الباسورد.',
  'auth.forgot_send': 'ابعت لينك الاستعادة',
  'auth.forgot_back': 'رجوع لتسجيل الدخول',
  'auth.forgot_success': 'لو الإيميل ده مسجل عندنا، هتوصلك رسالة فيها لينك الاستعادة.',

  // Verify Email
  'verify.title': 'أكد الإيميل بتاعك',
  'verify.subtitle': 'بعتنالك كود مكون من 6 أرقام على',
  'verify.submit': 'تأكيد',
  'verify.resend': 'ابعت الكود تاني',
  'verify.resend_cooldown': 'ابعت تاني بعد',
  'verify.checking_link': 'جاري التحقق من الإيميل...',

  // Waitlist
  'waitlist.title': 'أهلاً بيك في قايمة الانتظار!',
  'waitlist.subtitle': 'الإيميل بتاعك اتأكد بنجاح. إنت دلوقتي في قايمة الانتظار — هنبلغك أول ما مكانك يكون جاهز.',
  'waitlist.member_since': 'عضو من',
  'waitlist.time_on_waitlist': 'الوقت في الانتظار',
  'waitlist.days': 'يوم',
  'waitlist.hours': 'ساعة',
  'waitlist.minutes': 'دقيقة',
  'waitlist.seconds': 'ثانية',
  'waitlist.back_home': 'الرجوع للصفحة الرئيسية',

  // Pricing
  'pricing.title': 'أسعار بسيطة وشفافة',
  'pricing.subtitle': 'بنجهز خطط الأسعار. سجل في قايمة الانتظار وكن أول واحد يعرف لما ننطلق.',
  'pricing.coming_soon': 'قريباً',
  'pricing.notify': 'بلغني وقت الإطلاق',
  'pricing.free_trial': 'تجربة مجانية 14 يوم',
  'pricing.no_card': 'مش محتاج بطاقة ائتمان',
  'pricing.cancel': 'إلغاء في أي وقت',

  // Privacy
  'privacy.title': 'سياسة الخصوصية',
  'privacy.last_updated': 'آخر تحديث',
  'privacy.intro': 'في نمو، خصوصيتك مهمة جداً بالنسبالنا. السياسة دي بتوضح إزاي بنجمع ونستخدم ونحمي بياناتك الشخصية لما بتستخدم منصة التجارة الإلكترونية بتاعتنا.',
  'privacy.collect_title': 'البيانات اللي بنجمعها',
  'privacy.collect_text': 'بنجمع البيانات اللي بتقدمهالنا مباشرة زي اسمك والإيميل ورقم التليفون وتفاصيل المتجر لما بتعمل حساب. كمان بنجمع بيانات المعاملات والمنتجات وبيانات العملاء اللي بتديرها من خلال المنصة.',
  'privacy.use_title': 'إزاي بنستخدم بياناتك',
  'privacy.use_text': 'بنستخدم بياناتك عشان نقدملك خدماتنا ونحسنها، ونعالج المعاملات، ونبعتلك إشعارات عن متجرك، ونتواصل معاك بخصوص التحديثات والعروض. مش بنبيع بياناتك الشخصية لأي طرف تالت.',
  'privacy.protect_title': 'إزاي بنحمي بياناتك',
  'privacy.protect_text': 'بنستخدم تشفير بمعايير الصناعة (AES-256) لحماية البيانات الحساسة. كل معلومات الدفع بتتعالج من خلال بوابات متوافقة مع معايير PCI. بيانات التجار بتتشفر بـ AES-256-GCM.',
  'privacy.cookies_title': 'ملفات تعريف الارتباط',
  'privacy.cookies_text': 'بنستخدم ملفات تعريف ارتباط أساسية httpOnly للمصادقة وإدارة الجلسات. مش بنستخدم ملفات تعريف ارتباط تابعة لطرف تالت لأغراض إعلانية.',
  'privacy.rights_title': 'حقوقك',
  'privacy.rights_text': 'ليك الحق تطلع على بياناتك الشخصية أو تصححها أو تحذفها في أي وقت. تقدر تصدر بيانات متجرك أو تطلب حذف حسابك عن طريق التواصل مع فريق الدعم.',
  'privacy.contact_title': 'تواصل معانا',
  'privacy.contact_text': 'لو عندك أي أسئلة عن سياسة الخصوصية، تواصل معانا على privacy@numueg.app.',

  // Terms
  'terms.title': 'شروط الاستخدام',
  'terms.last_updated': 'آخر تحديث',
  'terms.intro': 'أهلاً بيك في نمو. باستخدامك للمنصة، إنت موافق على الشروط دي. اقرأها كويس.',
  'terms.account_title': 'تسجيل الحساب',
  'terms.account_text': 'لازم تقدم بيانات صحيحة لما بتعمل حساب. إنت مسؤول عن تأمين بيانات حسابك. لازم يكون عمرك 18 سنة على الأقل عشان تستخدم خدماتنا.',
  'terms.services_title': 'خدماتنا',
  'terms.services_text': 'نمو بتقدم منصة تجارة إلكترونية بتسمح للتجار يعملوا متاجر أونلاين ويديروا المنتجات ويعالجوا الطلبات ويقبلوا المدفوعات. بنحتفظ بالحق نعدل أو نوقف خاصيات مع إشعار مناسب.',
  'terms.payments_title': 'المدفوعات والرسوم',
  'terms.payments_text': 'رسوم المعاملات وتكاليف الاشتراك موضحة في خطة الأسعار بتاعتك. كل المبالغ بالجنيه المصري. المدفوعات بتتعالج من خلال بوابات دفع آمنة (باي موب، فوري).',
  'terms.content_title': 'المحتوى بتاعك',
  'terms.content_text': 'إنت صاحب كل المحتوى اللي بترفعه على متجرك. إنت مسؤول إن منتجاتك ومحتواك يكونوا متوافقين مع القانون المصري. ممكن نشيل محتوى يخالف سياساتنا.',
  'terms.termination_title': 'إنهاء الحساب',
  'terms.termination_text': 'تقدر تقفل حسابك في أي وقت. ممكن نعلق أو ننهي حسابات تخالف الشروط دي. بعد الإنهاء، تقدر تطلب تصدير بياناتك خلال 30 يوم.',
  'terms.liability_title': 'حدود المسؤولية',
  'terms.liability_text': 'نمو بتتقدم "كما هي" بدون ضمان. مش مسؤولين عن أي أضرار غير مباشرة أو عرضية أو تبعية ناتجة عن استخدامك للمنصة.',
  'terms.contact_title': 'تواصل معانا',
  'terms.contact_text': 'لأي أسئلة عن الشروط دي، تواصل معانا على legal@numueg.app.',

  // Contact
  'contact.title': 'تواصل معانا',
  'contact.subtitle': 'عندك سؤال أو محتاج مساعدة؟ يسعدنا نسمع منك.',
  'contact.name': 'اسمك',
  'contact.name_placeholder': 'مثلاً أحمد علي',
  'contact.email': 'الإيميل',
  'contact.email_placeholder': 'name@company.com',
  'contact.message': 'الرسالة',
  'contact.message_placeholder': 'إزاي نقدر نساعدك؟',
  'contact.send': 'ابعت الرسالة',
  'contact.success': 'شكراً! رسالتك اتبعتت. هنرد عليك في أقرب وقت.',
  'contact.error': 'حصل مشكلة. حاول تاني أو ابعتلنا إيميل مباشرة.',
  'contact.or_reach': 'أو تواصل معانا مباشرة',
  'contact.location': 'القاهرة · مصر',
  'contact.email_us': 'ابعتلنا إيميل',
  'contact.follow': 'تابعنا',
  'contact.phone': 'رقم الموبايل',
  'contact.phone_placeholder': '+20 1XX XXX XXXX',
  'contact.country': 'البلد',
  'contact.country_placeholder': 'مثلاً مصر',
  'contact.city': 'المدينة',
  'contact.city_placeholder': 'مثلاً القاهرة',

  // Refund Policy
  'refund.badge': 'اشتري وانت مطمن',
  'refund.title': 'سياسة الاسترجاع',
  'refund.subtitle': 'رضاك أولويتنا. بنسهّل عملية الاسترجاع لأقصى درجة.',
  'refund.card1_title': 'استرجاع خلال 14 يوم',
  'refund.card1_desc': 'ارجع أي منتج مستخدمش وبحالته الأصلية خلال 14 يوم من الاستلام واسترد فلوسك كاملة.',
  'refund.card2_title': 'ضمان الجودة',
  'refund.card2_desc': 'وصلك منتج معيب أو متضرر؟ هنبدّله أو نرجعلك فلوسك كاملة — من غير أي أسئلة.',
  'refund.card3_title': 'استرداد سريع',
  'refund.card3_desc': 'المبالغ المسترجعة بتتحول خلال 5-7 أيام عمل. هنفضل نبلّغك بكل خطوة.',
  'refund.view_full': 'عرض السياسة الكاملة',
  'refund.section1_title': 'شروط الاسترجاع',
  'refund.section1_text': 'تقدر ترجع أي منتج مستخدمش وبحالته الأصلية وتغليفه خلال 14 يوم من الاستلام. لازم تكون كل التاجز موجودة والمنتج مفيهوش أي علامات استخدام.',
  'refund.section2_title': 'ضمان الجودة',
  'refund.section2_text': 'لو وصلك منتج معيب أو متضرر أو غلط، هنبدّله أو نرجعلك فلوسك كاملة من غير أي تكلفة إضافية. كلمنا خلال 48 ساعة من الاستلام وابعتلنا صور المشكلة.',
  'refund.section3_title': 'مدة معالجة الاسترداد',
  'refund.section3_text': 'بعد ما نستلم المرتجع ونفحصه، هنعالج الاسترداد خلال 5-7 أيام عمل. هتوصلك رسالة على الإيميل لما المبلغ يترجع لطريقة الدفع الأصلية.',
  'refund.section4_title': 'شحن المرتجعات',
  'refund.section4_text': 'للمرتجعات المؤهلة، بنرتب استلام مجاني من عنوانك. مندوب الشحن هيتواصل معاك لتحديد ميعاد مناسب. للمنتجات المعيبة، شحن المرتجع دايماً مجاني.',
  'refund.section5_title': 'منتجات مش قابلة للاسترجاع',
  'refund.section5_text': 'منتجات العناية الشخصية والإكسسوارات الحميمية والمنتجات اللي اتشال منها التاجز أو الباركود والمنتجات اللي اتلبست أو اتغسلت مش بنقبل رجوعها. كمان منتجات التخفيضات المحددة كبيع نهائي مش بترجع.',
  'refund.section6_title': 'محتاج مساعدة؟',
  'refund.section6_text': 'فريق الدعم بتاعنا موجود يساعدك في أي سؤال عن الاسترجاع أو الاسترداد. كلمنا على الإيميل hello@numueg.app أو من خلال صفحاتنا على السوشيال ميديا. بنرد عادةً خلال 24 ساعة.',

  // Navbar
  'nav.home': 'الرئيسية',
  'nav.preview': 'نظرة سريعة',
  'nav.product': 'المنتج',
  'nav.features': 'المميزات',
  'nav.how': 'إزاي بتشتغل',
  'nav.integrations': 'التكاملات',
  'nav.cod': 'كاش',
  'nav.trust_network': 'شبكة الثقة',
  'nav.showcase': 'الأدوات',
  'nav.compare': 'قارن',
  'nav.objections': 'ردود صريحة',
  'nav.pricing': 'الباقات',
  'nav.faq': 'أسئلة شائعة',
  'nav.founders': 'التاجر المؤسس',
  'nav.contact': 'كلمنا',
  'nav.testimonials': 'قصص نجاح',
  'nav.beta': 'برنامج البيتا',
  'nav.waitlist': 'قائمة الانتظار',
  'nav.cta': 'ابدأ دلوقتي',
  'nav.footer': 'كلمونا',
  'nav.start_free': 'جرب ببلاش',
  
  // Hero
  'hero.built_for': 'معمول عشان مصر والخليج',
  'hero.title_line1': 'نُمو معاك في نمو',
  'hero.title_line2': 'تجارتك الإلكترونية',
  'hero.title_line3': 'في مصر والشرق',
  'hero.title_line4': 'الأوسط',
  'hero.subtitle': 'المنصة الوحيدة اللي فيها كل حاجة: بيموب، فوري، وبوسطة. عربي 100%، فاتورة إلكترونية، وشغل الدفع عند الاستلام اللي ينجزك.',
  'hero.cta_primary': 'أنشئ متجرك مجانًا',
  'hero.cta_secondary': 'جرّب نسخة تجريبية',
  'demo.modal.title': 'افتح متجرك التجريبي في ٣٠ ثانية',
  'demo.modal.subtitle': 'مجاناً، بدون بطاقة. تجربة ٧ أيام مع منتجات وأوردرات تجريبية.',
  'demo.modal.email_placeholder': 'بريدك الإلكتروني',
  'demo.modal.submit': 'افتح المتجر التجريبي',
  'demo.modal.loading': 'بنجهز متجرك...',
  'demo.modal.error.rate_limit': 'حاول تاني بعد ساعة.',
  'demo.modal.error.disposable': 'استخدم بريد حقيقي.',
  'demo.modal.error.turnstile': 'فشل التحقق. حاول تاني.',
  'demo.modal.error.generic': 'حصل مشكلة. حاول تاني.',
  'hero.badge_eta': 'بيدعم الجنيه، الريال، والدرهم',
  'hero.badge_whatsapp': 'واجهة عربي مظبوطة',
  'hero.badge_clean': 'متظبط للدفع عند الاستلام',
  'hero.stats.sales': 'إجمالي المبيعات',
  'hero.stats.users': 'تجار جدد',
  // Hero trust row — Arabic
  'hero.trust_eyebrow': 'أدواتك المعتمدة',
  'hero.trust_eta': 'فاتورة إلكترونية · معتمدة من مصلحة الضرايب',
  'hero.trust_pay': 'دفع',
  'hero.trust_ship': 'شحن',

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
  'footer.apps': 'متجر التطبيقات',
  'footer.themes': 'القوالب',
  'footer.developers': 'المطورين',
  'footer.tools': 'أدوات مجانية',
  'footer.learn': 'الأكاديمية',
  'footer.pricing': 'الأسعار',
  'footer.privacy': 'الخصوصية',
  'footer.terms': 'الشروط',
  'footer.contact': 'كلمونا',
  'footer.refund': 'سياسة الاسترجاع',
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

// Arabic is the landing's primary language — it always loads in Arabic for
// every visitor regardless of browser locale (Numu's audience is Egypt/MENA).
// The navbar toggle still lets anyone switch to English at any time.
const getInitialLanguage = (): Language => 'ar';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

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
