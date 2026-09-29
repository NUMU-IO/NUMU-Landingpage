import type { WalkStep } from '../../components/redesign/GuideWalkthrough';

/**
 * Academy walkthroughs, keyed by guide slug (`pages/Learn.tsx`).
 *
 * Frames are captures of the local sandbox hub (test data, store names
 * masked) at 1280×800, DPR 2 → 1600×1000 WebP, made with
 * `scripts/capture-learn-walkthroughs.mjs` from `scripts/learn-walkthroughs.spec.json`
 * on 2026-09-27 (the test store's Vionne-like logo hidden or masked). `spot` is the control the step
 * presses, as percentages of the frame, measured from the live DOM at
 * capture time — re-capture rather than hand-edit it if the hub changes.
 */
export const WALKTHROUGHS: Record<string, WalkStep[]> = {
  'open-store-egypt': [
    {
      src: '/assets/learn-open-store-egypt-s1.webp',
      spot: { x: 35.1, y: 78.6, w: 29.8, h: 6 },
      caption: { ar: 'اكتب بياناتك ودوس «أنشئ الحساب»', en: 'Fill in your details and press Create account' },
    },
    {
      src: '/assets/learn-open-store-egypt-s2.webp',
      spot: { x: 57.2, y: 39.5, w: 12.6, h: 16 },
      caption: { ar: 'اختار نوع منتجاتك، مثلاً ملابس وأزياء', en: 'Pick what you sell, e.g. Fashion & Clothing' },
    },
    {
      src: '/assets/learn-open-store-egypt-s3.webp',
      spot: { x: 32.5, y: 47, w: 35, h: 11.8 },
      caption: { ar: 'في الشحن اختار بوسطة للتوصيل والتتبّع', en: 'For shipping, pick Bosta for delivery and tracking' },
    },
    {
      src: '/assets/learn-open-store-egypt-s4.webp',
      spot: { x: 32.5, y: 57.5, w: 35, h: 9 },
      caption: { ar: 'الكاش شغّال لوحده، ضيف بيموب للكروت', en: 'Cash on delivery is on by default; add Paymob for cards' },
    },
  ],
  'paymob-vs-fawry': [
    {
      src: '/assets/learn-paymob-vs-fawry-s1.webp',
      spot: { x: 52.2, y: 35.3, w: 21.8, h: 29.5 },
      caption: { ar: 'من إعداد الدفع افتح كارت بيموب', en: 'In Payment setup, open the Paymob card' },
    },
    {
      src: '/assets/learn-paymob-vs-fawry-s2.webp',
      spot: { x: 40.5, y: 40.6, w: 33.5, h: 4.5 },
      caption: { ar: 'الصق مفاتيحك من لوحة تحكم بيموب', en: 'Paste your keys from the Paymob dashboard' },
    },
    {
      src: '/assets/learn-paymob-vs-fawry-s3.webp',
      spot: { x: 21.6, y: 48, w: 4.7, h: 4 },
      caption: { ar: 'أو فعّل فوري بداله للدفع كاش في المنافذ', en: 'Or switch on Fawry instead, for cash at outlets' },
    },
  ],
  'reduce-cod-rto': [
    {
      src: '/assets/learn-reduce-cod-rto-s1.webp',
      spot: { x: 7.8, y: 48.3, w: 4.1, h: 3.5 },
      caption: { ar: 'شغّل تأكيد أوردرات الكاش على واتساب', en: 'Turn on WhatsApp confirmation for COD orders' },
    },
    {
      src: '/assets/learn-reduce-cod-rto-s2.webp',
      spot: { x: 7.7, y: 48.3, w: 4.1, h: 3.5 },
      caption: { ar: 'اطلب عربون قبل ما أوردر الكاش يتأكد', en: 'Require a deposit before a COD order is confirmed' },
    },
    {
      src: '/assets/learn-reduce-cod-rto-s3.webp',
      spot: { x: 4.1, y: 44.5, w: 4.1, h: 3.5 },
      caption: { ar: 'شغّل شبكة الثقة عشان تكشف الزبون اللي بيرفض', en: 'Turn on Trust Network to flag serial refusers' },
    },
    {
      src: '/assets/learn-reduce-cod-rto-s4.webp',
      spot: { x: 4.1, y: 47.8, w: 20.9, h: 4.5 },
      caption: { ar: 'ابعت تأكيد واتساب من صفحة الأوردر', en: 'Send the WhatsApp confirmation from the order page' },
    },
  ],
  'governorate-shipping': [
    {
      src: '/assets/learn-governorate-shipping-s1.webp',
      spot: { x: 4.4, y: 14, w: 11.2, h: 5.5 },
      caption: { ar: 'من مناطق الشحن دوس «منطقة جديدة»', en: 'In Shipping zones, press New zone' },
    },
    {
      src: '/assets/learn-governorate-shipping-s2.webp',
      spot: { x: 38, y: 58.9, w: 13.8, h: 4.5 },
      caption: { ar: 'اختار مجموعة المحافظات، مثلاً الدلتا', en: 'Pick a governorate group, e.g. Delta' },
    },
    {
      src: '/assets/learn-governorate-shipping-s3.webp',
      spot: { x: 34.2, y: 63.6, w: 38.4, h: 5.5 },
      caption: { ar: 'حط سعر الشحن للمنطقة دي', en: 'Set the shipping price for this zone' },
    },
  ],
  'whatsapp-instagram-selling': [
    {
      src: '/assets/learn-whatsapp-instagram-selling-s1.webp',
      spot: { x: 33.4, y: 49.8, w: 13.4, h: 5.5 },
      caption: { ar: 'من القنوات اربط فيسبوك وإنستجرام', en: 'In Channels, connect Facebook and Instagram' },
    },
    {
      src: '/assets/learn-whatsapp-instagram-selling-s2.webp',
      spot: { x: 82.7, y: 71.8, w: 14.8, h: 4 },
      caption: { ar: 'من واتساب دوس «ربط الحساب» واربط رقمك', en: 'In WhatsApp, open Connect account to link a number' },
    },
    {
      src: '/assets/learn-whatsapp-instagram-selling-s3.webp',
      spot: { x: 4.1, y: 56.9, w: 15.1, h: 5.5 },
      caption: { ar: 'الصق روابط بوستاتك واستوردها كمنتجات', en: 'Paste your post links and import them as products' },
    },
  ],
  'eta-einvoicing': [
    {
      src: '/assets/learn-eta-einvoicing-s1.webp',
      spot: { x: 40.5, y: 31.1, w: 35.4, h: 4.5 },
      caption: { ar: 'افتح الفواتير واكتب رقمك الضريبي', en: 'Open Invoices and enter your Tax ID' },
    },
    {
      src: '/assets/learn-eta-einvoicing-s2.webp',
      spot: { x: 4.1, y: 49.4, w: 22.9, h: 4.5 },
      caption: { ar: 'تابع حالة كل فاتورة: مرسلة ولا مقبولة ولا مرفوضة', en: 'Track each invoice: submitted, accepted or rejected' },
    },
  ],
  'import-products': [
    {
      src: '/assets/learn-import-products-s1.webp',
      spot: { x: 9.8, y: 22.2, w: 13, h: 4.4 },
      caption: { ar: 'من المنتجات افتح القايمة واضغط استيراد', en: 'In Products, open the menu and press Import' },
    },
    {
      src: '/assets/learn-import-products-s2.webp',
      spot: { x: 34.8, y: 34.4, w: 30.5, h: 7.8 },
      caption: { ar: 'نزّل النموذج واملاه بمنتجاتك', en: 'Download the template and fill in your products' },
    },
    {
      src: '/assets/learn-import-products-s3.webp',
      spot: { x: 34.8, y: 44.1, w: 30.5, h: 22.8 },
      caption: { ar: 'ارفع ملف الإكسل أو الـCSV واضغط استيراد', en: 'Upload the Excel or CSV file, then press Import' },
    },
    {
      src: '/assets/learn-import-products-s4.webp',
      spot: { x: 4.1, y: 39.1, w: 71.7, h: 15.8 },
      caption: { ar: 'أو الصق روابط بوستات إنستجرام واضغط استيراد', en: 'Or paste Instagram post links, then press Import' },
    },
  ],
  'choose-store-name': [
    {
      src: '/assets/learn-choose-store-name-s1.webp',
      spot: { x: 64, y: 44.1, w: 24.8, h: 5.5 },
      caption: { ar: 'اختار مجال متجرك والطابع اللي يشبهك', en: 'Choose your industry and the style that fits you' },
    },
    {
      src: '/assets/learn-choose-store-name-s2.webp',
      spot: { x: 71.3, y: 64.3, w: 19.8, h: 7.1 },
      caption: { ar: 'انسخ الاسم اللي عجبك، ولو مش عاجبك اضغط شفّل', en: 'Copy the name you like, or press Shuffle for more' },
    },
    {
      src: '/assets/learn-choose-store-name-s3.webp',
      spot: { x: 30.6, y: 56, w: 21.8, h: 5.5 },
      caption: { ar: 'من إعدادات المتجر اكتب اسم متجرك', en: 'In Store settings, type your store name' },
    },
  ],
  'ramadan-campaign': [
    {
      src: '/assets/learn-ramadan-campaign-s1.webp',
      spot: { x: 66.3, y: 68.8, w: 9.5, h: 3.8 },
      caption: { ar: 'اعمل خصم تلقائي واختار «اشتري 2 خد 1 مجاني»', en: 'Create an automatic discount: pick Buy 2, get 1 free' },
    },
    {
      src: '/assets/learn-ramadan-campaign-s2.webp',
      spot: { x: 40.6, y: 56.3, w: 35.2, h: 5.5 },
      caption: { ar: 'حدّد يوم بداية العرض ونهايته على رمضان', en: 'Set the offer\'s start and end dates for Ramadan' },
    },
    {
      src: '/assets/learn-ramadan-campaign-s3.webp',
      spot: { x: 0.4, y: 40.4, w: 24.2, h: 8.5 },
      caption: { ar: 'ضيف شريط إعلانات بآخر ميعاد للطلب قبل العيد', en: 'Add an announcement bar with your Eid order cut-off' },
    },
    {
      src: '/assets/learn-ramadan-campaign-s4.webp',
      spot: { x: 2.5, y: 11.6, w: 10.3, h: 5.5 },
      caption: { ar: 'وابعت نفس الميعاد لعملائك في حملة واتساب', en: 'Send the same cut-off in a WhatsApp campaign' },
    },
  ],
  'first-100-orders': [
    {
      src: '/assets/learn-first-100-orders-s1.webp',
      spot: { x: 7.8, y: 49.3, w: 4.1, h: 3.5 },
      caption: { ar: 'اربط واتساب وشغّل رسايل تأكيد الطلب وتحديث الشحن', en: 'Connect WhatsApp, then switch on order and shipping messages' },
    },
    {
      src: '/assets/learn-first-100-orders-s2.webp',
      spot: { x: 4.5, y: 50.9, w: 29, h: 7.1 },
      caption: { ar: 'نزّل كشف التسليم وسلّم الشحنات للمندوب مرة واحدة', en: 'Download the pickup manifest and hand over in one batch' },
    },
    {
      src: '/assets/learn-first-100-orders-s3.webp',
      spot: { x: 57.2, y: 51.5, w: 12.7, h: 4 },
      caption: { ar: 'راجع أرقامك كل أسبوع: اختار «الأسبوع الماضي»', en: 'Review weekly: choose Last week' },
    },
    {
      src: '/assets/learn-first-100-orders-s4.webp',
      spot: { x: 4.1, y: 22.3, w: 4.1, h: 3.5 },
      caption: { ar: 'وخلّي الملخص الأسبوعي يوصلك على الإيميل', en: 'Keep the weekly summary email switched on' },
    },
  ],
};
