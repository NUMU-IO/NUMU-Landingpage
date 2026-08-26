import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useSEO } from "../hooks/useSEO";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CookieConsent from "../components/CookieConsent";
import { DEFAULT_TRIAL_DAYS, toArabicDigits } from "../lib/trialInfo";

/**
 * /learn — Academy v1 index (audit §2.7). Ten short-form bilingual
 * guides that target high-intent Arabic long-tail queries Egyptian
 * merchants actually type into Google. Each guide is collapsible and
 * self-contained — visitors get real answers without leaving the page.
 * Structure is intentionally promotable to individual /learn/:slug
 * pages in a future sprint without breaking URLs (the slug is already
 * set as the anchor-hash so deep links like /learn#paymob-vs-fawry
 * work today).
 */

interface Guide {
  slug: string;
  category_en: string;
  category_ar: string;
  title_en: string;
  title_ar: string;
  readTime: number;
  body_en: string[];
  body_ar: string[];
  accent: "navy" | "terracotta" | "sage" | "saffron";
  /** Optional inline tip that sits inside the guide as a call-out. */
  tip_en?: string;
  tip_ar?: string;
}

const guides: Guide[] = [
  {
    slug: "open-store-egypt",
    category_en: "Getting started",
    category_ar: "البدء",
    title_en: "How to open an online store in Egypt",
    title_ar: "إزاي تفتح متجر إلكتروني في مصر",
    readTime: 4,
    accent: "terracotta",
    body_en: [
      "Three decisions get you 80% of the way: pick a platform, connect a payment gateway, and connect a courier. Everything else — theme, product photos, invoice copy — can iterate later.",
      "Platform: pick one that is Arabic-first from day one (RTL, right-aligned forms, Arabic-Indic digits in checkout). Retrofitting Arabic on Shopify works but costs hours per week in template fixes.",
      "Payments: Paymob for cards + Apple Pay, Fawry for cash-at-point, COD for the 60–90% of shoppers who will refuse to enter card details online. You need all three. Pick the platform that ships with all three as defaults.",
      "Shipping: Bosta for same-day Cairo + governorate rates; add Aramex for international later. Skip manual waybill PDFs — pick a platform with API-level waybill generation.",
    ],
    body_ar: [
      "تلات قرارات بتوصّلك ٨٠٪ من الطريق: اختار منصّة، اربط بوابة دفع، واربط شركة شحن. الباقي — ثيم، صور منتجات، نبرة الفواتير — بيتعدّل بعدها.",
      "المنصّة: اختار واحدة عربي من الأول (RTL، الفورم مظبوطة من اليمين، أرقام عربية في الشيك أوت). تعديل شوبيفاي لتبقى عربي شغّال بس بيكلّف ساعات كل أسبوع في تصحيح الثيم.",
      "الدفع: بيموب للكروت وآبل باي، فوري للكاش في الفروع، والدفع عند الاستلام لـ٦٠-٩٠٪ من الزباين اللي ما هيكتبوش كروت أونلاين. التلاتة محتاجينهم. اختار منصّة جاية بالتلاتة جاهزين.",
      "الشحن: بوسطة للتوصيل في نفس اليوم داخل القاهرة وبأسعار بالمحافظة، وأراميكس للشحن الدولي بعدين. متطبعش بوالص يدوي — اختار منصّة بتصدر البوليصة عن طريق API.",
    ],
    tip_en:
      "numu merchants go from signup to shipping their first COD order in under 25 minutes on average.",
    tip_ar:
      "معدّل تجار نُمُو من التسجيل لأول أوردر كاش مشحون: أقل من ٢٥ دقيقة.",
  },
  {
    slug: "paymob-vs-fawry",
    category_en: "Payments",
    category_ar: "الدفع",
    title_en: "Paymob vs Fawry — which should you wire up first?",
    title_ar: "بيموب ولا فوري · إيه اللي تربطه الأول",
    readTime: 3,
    accent: "navy",
    body_en: [
      "They solve different problems. Wire up both; the question is which default to lead with.",
      "Paymob is for online card + Apple Pay + Meeza. Checkout happens in-flow. Best when your shoppers have cards, trust online payments, and want instant confirmation. Fees: ~2.75% + ~3 EGP per successful transaction.",
      "Fawry is cash-at-point — the customer gets a reference number, walks to any of ~225,000 Fawry outlets, and pays cash. Best when shoppers don't trust entering card details online but can't wait for COD. Fees: ~0.85% + ~2 EGP.",
      "Rule of thumb: lead with Paymob if your AOV is above 500 EGP, lead with Fawry below. Offer both, always.",
    ],
    body_ar: [
      "حلول لمشاكل مختلفة. اربط الاتنين؛ السؤال الأولوية لمين.",
      "بيموب: للدفع أونلاين بالكروت وآبل باي وميزة. الشيك أوت بيتم داخل المتجر. الأنسب لما الزباين عندهم كروت، واثقين في الدفع أونلاين، ومستعجلين. الرسوم: ~٢.٧٥٪ + ~٣ ج.م لكل تحصيل ناجح.",
      "فوري: كاش في الفروع — الزبون بياخد رقم مرجعي، بيمشي لأي فرع من ~٢٢٥,٠٠٠ فرع، بيدفع كاش. الأنسب لما الزباين مش واثقين في الدفع أونلاين بس مش عايزين ينتظروا COD. الرسوم: ~٠.٨٥٪ + ~٢ ج.م.",
      "القاعدة: ابدأ بيموب لو متوسط الأوردر فوق ٥٠٠ ج.م، وابدأ فوري لو تحت. وفّر الاتنين مع بعض دايماً.",
    ],
  },
  {
    slug: "reduce-cod-rto",
    category_en: "COD",
    category_ar: "الكاش",
    title_en: "How to reduce refused COD orders (RTO)",
    title_ar: "إزاي تقلّل الأوردرات المرفوضة COD",
    readTime: 5,
    accent: "terracotta",
    body_en: [
      "Refused deliveries (RTO — Return To Origin) cost 20–40% of Egyptian COD orders. Every refused order is shipping fee × 2 + re-stocking + damage risk. Here's how to cut it:",
      "1. Confirm by WhatsApp before dispatch. A 15-second \"Hi, your order is ready to ship — confirm the address?\" cuts RTO by 10–15% on its own.",
      "2. Require a deposit for orders above 1,000 EGP. Partial Fawry pre-pay signals commitment and filters out test shoppers.",
      "3. Use a cross-merchant fraud network. numu's Trust Network tags shoppers who've refused COD at other stores so you see the risk before you print a waybill.",
      "4. Teleport detection — if the shipping address changes by more than 50 km from the shopper's previous order, flag it automatically.",
      "5. Don't block new-to-network shoppers. First-time buyers refuse at normal rates; you don't want to kill acquisition.",
    ],
    body_ar: [
      "الأوردرات المرفوضة (RTO — رجوع للأصل) بتكلّف ٢٠-٤٠٪ من أوردرات الكاش في مصر. كل أوردر مرفوض = شحن × ٢ + إعادة تخزين + مخاطر ضرر. إزاي تقلّلها:",
      "١. أكّد على واتساب قبل الشحن. \"أوردرك جاهز للشحن — أكّد العنوان؟\" بيقلّل الـ RTO ١٠-١٥٪ لوحدها.",
      "٢. اطلب دفعة جزئية للأوردرات فوق ١,٠٠٠ ج.م. دفع فوري جزئي بيبعت رسالة التزام وبيفلتر الزبون اللي \"بيجرّب\".",
      "٣. استخدم شبكة تاجر مشتركة. Trust Network في نُمُو بيحدّد الزبون اللي رفض كاش في متاجر تانية عشان تشوف الريسك قبل ما تطبع البوليصة.",
      "٤. كشف Teleport — لو العنوان اتغيّر بـ أكتر من ٥٠ كم من أوردر الزبون الفائت، نبّهنا عليه تلقائياً.",
      "٥. متبلوكش الزبون الجديد على الشبكة. اللي بيشتري لأول مرة بيرفض بمعدلات طبيعية؛ متفقدش اكتساب.",
    ],
    tip_en:
      "Merchants on numu Trust Network see a 30–45% drop in RTO within the first 60 days.",
    tip_ar:
      "التجار على Trust Network بيشوفوا انخفاض ٣٠-٤٥٪ في الـ RTO خلال أول ٦٠ يوم.",
  },
  {
    slug: "governorate-shipping",
    category_en: "Shipping",
    category_ar: "الشحن",
    title_en: "Calculating shipping rates by governorate",
    title_ar: "حساب أسعار الشحن بالمحافظة",
    readTime: 3,
    accent: "sage",
    body_en: [
      "Egypt has 27 governorates. One flat national rate either loses you money in Upper Egypt or prices out Cairo. Set three tiers:",
      "Tier 1 — Greater Cairo (Cairo · Giza · Qalyubia): cheapest. Typical 50-80 EGP for Bosta standard.",
      "Tier 2 — Delta + Alexandria (Sharqia · Gharbia · Menoufia · Beheira · Kafr El Sheikh · Damietta · Alexandria · Dakahlia · Port Said · Ismailia · Suez): 75-110 EGP.",
      "Tier 3 — Upper Egypt + Sinai + Red Sea (Minya · Assiut · Sohag · Qena · Luxor · Aswan · North Sinai · South Sinai · Red Sea · New Valley · Matrouh · Fayoum · Beni Suef): 100-150 EGP.",
      "Show the governorate-specific fee before checkout so shoppers don't abandon over surprise shipping.",
    ],
    body_ar: [
      "مصر فيها ٢٧ محافظة. سعر شحن ثابت لكل مصر إما بيخسّرك في الصعيد أو بيطلّع سعر القاهرة عالي. اعمل ٣ شرائح:",
      "شريحة ١ — القاهرة الكبرى (القاهرة · الجيزة · القليوبية): الأرخص. نموذجي ٥٠-٨٠ ج.م بوسطة ستاندرد.",
      "شريحة ٢ — الدلتا والإسكندرية (الشرقية · الغربية · المنوفية · البحيرة · كفر الشيخ · دمياط · الإسكندرية · الدقهلية · بورسعيد · الإسماعيلية · السويس): ٧٥-١١٠ ج.م.",
      "شريحة ٣ — الصعيد والبحر الأحمر وسيناء (المنيا · أسيوط · سوهاج · قنا · الأقصر · أسوان · سيناء · الوادي الجديد · مطروح · الفيوم · بني سويف): ١٠٠-١٥٠ ج.م.",
      "اعرض سعر المحافظة قبل الشيك أوت — مفاجأة الشحن أكبر سبب للتخلّي عن الأوردر.",
    ],
  },
  {
    slug: "whatsapp-instagram-selling",
    category_en: "Channels",
    category_ar: "القنوات",
    title_en: "Sell on WhatsApp and Instagram from one inventory",
    title_ar: "ابيع من واتساب وإنستغرام من مخزون واحد",
    readTime: 4,
    accent: "sage",
    body_en: [
      "80% of Egyptian online shoppers find products on Instagram but want to pay via WhatsApp. You need one inventory that syncs to both without duplicate work.",
      "Instagram: connect Meta Catalog → auto-tag products in posts/reels → shoppers tap \"view on website\" to check out. Don't try to sell inside Instagram DMs at scale — you'll lose orders to message chaos.",
      "WhatsApp: connect WhatsApp Cloud API (not the old Business app). Automate order confirmations, tracking pings, and delivery-day messages. Live agents handle exceptions only.",
      "TikTok Shop is live in MENA now. Connect it too — but treat it as a top-of-funnel channel. Your storefront closes the sale.",
      "Warning: running multiple channels with separate inventory spreadsheets leads to double-selling the last unit. Pick a platform that has a single source of truth and webhook out to all channels.",
    ],
    body_ar: [
      "٨٠٪ من المتسوقين المصريين أونلاين بيلاقوا المنتج على إنستغرام، بس عايزين يدفعوا عبر واتساب. محتاج مخزون واحد بيتزامن مع الاتنين بدون تكرار شغل.",
      "إنستغرام: اربط Meta Catalog → يتطبق تاج تلقائي للمنتجات في البوستات والريلز → الزبون يضغط \"عرض على الموقع\" للشيك أوت. متحاولش تبيع جوه رسايل إنستغرام على نطاق — هتخسر أوردرات في الفوضى.",
      "واتساب: اربط WhatsApp Cloud API (مش تطبيق الـ Business القديم). اعمل أتمتة لتأكيدات الأوردر، رسايل التتبّع، ورسايل يوم التوصيل. الـ agents بس لاستثناءات.",
      "TikTok Shop دلوقتي متاح في المنطقة. اربطه كمان — بس اعتبره قناة أعلى للقمع. متجرك بيقفل البيعة.",
      "تحذير: تشغيل قنوات متعددة بمخزون في شيتات منفصلة = بيع آخر قطعة مرتين. اختار منصّة فيها مصدر واحد للمخزون بـ webhooks لكل القنوات.",
    ],
  },
  {
    slug: "eta-einvoicing",
    category_en: "Tax",
    category_ar: "الضرائب",
    title_en: "ETA e-invoicing — start here",
    title_ar: "الفاتورة الإلكترونية ETA — ابدأ كده",
    readTime: 4,
    accent: "navy",
    body_en: [
      "Egyptian Tax Authority (ETA) mandates electronic invoices for all registered merchants. PDFs printed from Word no longer count.",
      "You need: a Tax ID, an activity code, a digital signature token (USB stick from your bank or a cloud token via ETA portal), and an e-invoicing integration.",
      "The integration matters most. Submitting each invoice manually through the ETA portal is untenable past ~20 orders/day. Pick a commerce platform that auto-submits each finalized order as a compliant e-invoice.",
      "Four fields the ETA portal will reject without: seller Tax ID, buyer Tax ID (for B2B) or National ID (for B2C over 50,000 EGP), issue date in ISO format, and tax breakdown per line item.",
      "Penalties: missing e-invoices are fined 50,000 EGP per incident after your grace period. Get it right before volume ramps.",
    ],
    body_ar: [
      "مصلحة الضرائب المصرية (ETA) بتفرض الفاتورة الإلكترونية على كل التجار المسجّلين. PDF مطبوعة من Word ما بتتحسبش.",
      "محتاج: رقم ضريبي، رمز نشاط، توكن توقيع رقمي (USB من البنك أو توكن سحابي من بوابة ETA)، وتكامل فواتير إلكترونية.",
      "التكامل هو الأهم. تقديم كل فاتورة يدوياً من بوابة ETA بيبقى مستحيل بعد ~٢٠ أوردر/يوم. اختار منصّة تجارة بترفع كل أوردر منتهي كفاتورة متوافقة تلقائياً.",
      "أربع حقول البوابة بترفض من غيرها: الرقم الضريبي للبائع، الرقم الضريبي للمشتري (B2B) أو الرقم القومي (B2C فوق ٥٠,٠٠٠ ج.م)، تاريخ الإصدار بصيغة ISO، وتفصيل الضريبة لكل بند.",
      "الغرامات: فاتورة ناقصة = ٥٠,٠٠٠ ج.م لكل حالة بعد فترة السماح. ظبّطها قبل ما الحجم يكبر.",
    ],
    tip_en:
      "numu submits every finalized order to ETA automatically — zero manual uploads.",
    tip_ar:
      "نُمُو بيرفع كل أوردر منتهي لـ ETA تلقائياً — صفر رفع يدوي.",
  },
  {
    slug: "import-products",
    category_en: "Catalog",
    category_ar: "الكتالوج",
    title_en: "Import products from Excel or Instagram fast",
    title_ar: "استيراد المنتجات من إكسل أو إنستغرام بسرعة",
    readTime: 3,
    accent: "saffron",
    body_en: [
      "Typing 100 products by hand is the #1 reason merchants give up during setup. Three import paths:",
      "Excel / CSV: the classic. Download a template, fill in rows, upload. Best for merchants with a supplier price list already in spreadsheet form. Column order matters — use the template don't invent your own.",
      "Instagram: if you already sell on Instagram, point the importer at your public profile. It reads the last 100-200 posts, extracts the product image + caption, and generates Arabic + English titles + descriptions via AI.",
      "Shopify / Salla export: if migrating, export products.csv from your old platform and upload directly. Images, variants, and tags preserved.",
      "After import, audit the first 10 products. Fix categories + pricing there, then batch-apply the fixes to the remaining 90.",
    ],
    body_ar: [
      "كتابة ١٠٠ منتج باليد أكبر سبب التجار بيستسلموا أثناء الإعداد. ٣ طرق استيراد:",
      "إكسل / CSV: الكلاسيكي. نزّل قالب، املأ الصفوف، ارفع. الأنسب لتاجر عنده لائحة أسعار من المورّد في شيت. ترتيب الأعمدة مهم — استخدم القالب ومتخترعش من عندك.",
      "إنستغرام: لو بتبيع على إنستغرام، وجّه المستورد لبروفايلك العام. بيقرا آخر ١٠٠-٢٠٠ بوست، يستخرج صورة المنتج + الكابشن، ويولّد العنوان والوصف بالعربي والإنجليزي بـ AI.",
      "تصدير Shopify / Salla: لو بتنقل، صدّر products.csv من المنصّة القديمة وارفع مباشرة. الصور، الفارينتس، والتاجز كلها بتتحفظ.",
      "بعد الاستيراد، راجع أول ١٠ منتجات. صحّح الفئات والأسعار هناك، وطبّق التصحيحات على الـ ٩٠ الباقيين دفعة واحدة.",
    ],
  },
  {
    slug: "choose-store-name",
    category_en: "Branding",
    category_ar: "البراند",
    title_en: "Choosing a store name that works in Arabic + English",
    title_ar: "اختيار اسم متجر شغّال بالعربي والإنجليزي",
    readTime: 3,
    accent: "terracotta",
    body_en: [
      "A good Egyptian store name is pronounceable in both languages, spellable by someone who heard it once, and doesn't conflict with an existing Arabic trademark.",
      "Rules of thumb:",
      "• Keep it 2–3 syllables. \"Nuqta\", \"Habibi\", \"Layla\" — easy to remember, easy to type in either script.",
      "• Avoid English puns. Arabic speakers will Google-translate your English name; if the translation is weird, you lose trust.",
      "• Check domain + Instagram + TikTok availability in one pass. If the .com is taken, .app / .store / .eg work fine.",
      "• Test pronunciation with 5 non-designer friends. If they stumble, rename now — rebranding post-launch costs orders.",
    ],
    body_ar: [
      "اسم متجر مصري كويّس بينطق بالعربي والإنجليزي، يتكتب بسهولة من الناس اللي سمعت عنه لأول مرة، ومش بيصادم علامة تجارية عربية موجودة.",
      "قواعد عامة:",
      "• خلّيه ٢-٣ مقاطع. \"نُقطة\"، \"حبيبي\"، \"ليلى\" — سهل تذكّره، سهل كتابته بالأبجديتين.",
      "• تجنّب التورية الإنجليزية. الناطقين بالعربي هيترجموا اسمك بجوجل؛ لو الترجمة غريبة، بتخسر الثقة.",
      "• شيك على الدومين + إنستغرام + تيك توك في مرّة واحدة. لو الـ .com متاخد، .app / .store / .eg بتنفع.",
      "• جرّب النطق مع ٥ أصدقاء مش مصمّمين. لو اتلعثموا، غيّر الاسم دلوقتي — إعادة البراند بعد الإطلاق بتكلّف أوردرات.",
    ],
    tip_en:
      "Our free tool at /tools/store-names generates 20 Arabic-first names in seconds.",
    tip_ar:
      "أداتنا المجانية في /tools/store-names بتطلّع ٢٠ اسم عربي في ثواني.",
  },
  {
    slug: "ramadan-campaign",
    category_en: "Seasons",
    category_ar: "المواسم",
    title_en: "Setting up a Ramadan campaign that actually ships on time",
    title_ar: "إعداد حملة رمضان بتوصّل في الوقت",
    readTime: 4,
    accent: "saffron",
    body_en: [
      "Ramadan is 60–90% of many Egyptian merchants' annual revenue. It's also the month with the most failed deliveries if you don't plan.",
      "Two weeks before: finalize your Ramadan SKUs (عرض ٢ × ١, gift bundles, suhoor/iftar-timed drops). Upload them with Ramadan-specific product photography. Generic product pics underperform seasonal ones by 30–50%.",
      "One week before: lock in shipping cutoffs. Bosta slows 20–30% during Ramadan working hours. Communicate \"order by X date for delivery before Eid\" loudly on your homepage + WhatsApp.",
      "During: iftar and pre-suhoor are your conversion peaks. Schedule push notifications and ad spend accordingly.",
      "Post-Eid: clear seasonal SKUs fast. Don't let Ramadan packaging sit in storage for 11 months.",
    ],
    body_ar: [
      "رمضان ٦٠-٩٠٪ من الإيرادات السنوية لكتير من التجار المصريين. وهو كمان الشهر بأكبر معدل توصيل فاشل لو متخطّطتش.",
      "قبل أسبوعين: ثبّت منتجات رمضان بتاعتك (عرض ٢ × ١، مجموعات هدايا، منتجات بتيجي قبل الإفطار/السحور). ارفعها بتصوير رمضاني. الصور العادية بتقلّ أداءها ٣٠-٥٠٪ مقارنة بالموسمية.",
      "قبل أسبوع: ثبّت مواعيد قطع الشحن. بوسطة بتبطأ ٢٠-٣٠٪ في ساعات العمل في رمضان. بلّغ \"اطلب قبل تاريخ X للوصول قبل العيد\" بصوت عالي على الصفحة الرئيسية والواتساب.",
      "خلال الشهر: الإفطار وقبل السحور قمم التحويل. اجدول الإشعارات وصرف الإعلانات حسبهم.",
      "بعد العيد: صرّف منتجات الموسم بسرعة. متسيبش تغليف رمضان قاعد ١١ شهر.",
    ],
  },
  {
    slug: "first-100-orders",
    category_en: "Growth",
    category_ar: "النمو",
    title_en: "Your first 100 orders — how to handle them without burning out",
    title_ar: "أول ١٠٠ أوردر — إزاي تديرهم من غير ما تنهار",
    readTime: 4,
    accent: "navy",
    body_en: [
      "Orders 1-20 feel exciting. Orders 20-100 are where most solo merchants burn out. Here's the discipline:",
      "Automate confirmations + tracking pings via WhatsApp from day one. If you're typing \"Hi your order is on the way\" by hand, you'll stop after 30 orders.",
      "Batch pickups. Schedule Bosta pickup for one time-slot per day, not on-demand. A pickup every 2 hours is a productivity killer.",
      "Save support macros. For the 5 questions every customer asks (\"when does it arrive?\", \"can I exchange?\", \"do you ship to X?\"), pre-write the answers in Arabic and English. Paste, don't retype.",
      "Audit weekly, not daily. Daily revenue feels exciting but trends only show up over 7+ day windows. Skip the daily dopamine.",
      "Talk to your first 20 customers personally. After that, scale with automation. The first 20 teach you what to automate.",
    ],
    body_ar: [
      "أوردرات ١-٢٠ بتبقى مثيرة. أوردرات ٢٠-١٠٠ هي اللي فيها التاجر لوحده بينهار. الضبط:",
      "أتمت التأكيدات ورسايل التتبّع عبر واتساب من أول يوم. لو بتكتب \"أوردرك في الطريق\" باليد، هتوقّف بعد ٣٠ أوردر.",
      "دفعات استلام. اجدول بوسطة في شريحة وقت واحدة في اليوم، مش حسب الطلب. استلام كل ساعتين قاتل للإنتاجية.",
      "احفظ ماكرو الدعم. للـ٥ أسئلة اللي كل زبون بيسألها (\"بيوصل إمتى؟\"، \"أقدر أستبدل؟\"، \"بتشحنوا لـX؟\")، اكتب الإجابات مسبقاً بالعربي والإنجليزي. ألصق، متعيدش كتابة.",
      "راجع أسبوعياً، مش يومياً. الإيراد اليومي ممتع بس الترند بيظهر على نافذة ٧+ أيام. اتخطّى الدوبامين اليومي.",
      "اتكلّم مع أول ٢٠ زبون شخصياً. بعد كده، اتّسع بالأتمتة. الـ٢٠ الأوّلين بيعلّموك تأتمت إيه.",
    ],
    tip_en:
      "numu's dashboard groups all 5 common questions into canned Arabic + English responses by default.",
    tip_ar:
      "داشبورد نُمُو بيجمّع الـ٥ أسئلة الأكثر شيوعاً كـ قوالب إجابات عربي وإنجليزي جاهزة.",
  },
];

const accentBar: Record<Guide["accent"], string> = {
  navy: "bg-navy",
  terracotta: "bg-terracotta",
  sage: "bg-sage",
  saffron: "bg-saffron",
};
const accentText: Record<Guide["accent"], string> = {
  navy: "text-navy",
  terracotta: "text-terracotta",
  sage: "text-sage",
  saffron: "text-saffron",
};

const Learn: React.FC = () => {
  const { dir, language } = useLanguage();
  const isAr = language === "ar";
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  useSEO({
    title: isAr
      ? "أكاديمية نُمُو — أدلة للتجار المصريين"
      : "numu Academy — guides for Egyptian merchants",
    description: isAr
      ? "١٠ أدلة مركّزة للتجار في مصر: فتح متجر، بيموب وفوري، تقليل RTO، الفاتورة الإلكترونية ETA، حملات رمضان، وأكتر."
      : "10 focused guides for Egyptian merchants: opening a store, Paymob vs Fawry, reducing RTO, ETA e-invoicing, Ramadan campaigns, and more.",
    canonical: "https://numueg.app/learn",
  });

  // Simple category aggregation from the data itself
  const categories = Array.from(
    new Set(guides.map((g) => (isAr ? g.category_ar : g.category_en))),
  );

  return (
    <div className="relative min-h-screen bg-cream font-display" dir={dir}>
      <Navbar />

      <main id="main" className="bg-cream numu-dot-surface pt-24 sm:pt-28">

      <div className="relative z-10 text-center px-4 sm:px-6 pt-12 sm:pt-16 pb-10">
        <div className="inline-flex items-center gap-2 bg-saffron/15 border border-saffron/40 rounded-[4px] px-3 py-1 mb-5">
          <span className="size-1.5 rounded-full bg-saffron" aria-hidden="true" />
          <span className="font-mono text-[10px] font-semibold text-saffron uppercase tracking-[0.18em]">
            § ACADEMY · MERCHANT GUIDES
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-bold text-ink tracking-tight leading-[1.05] mb-5">
          {isAr ? (
            <>
              كل اللي تاجر مصري
              {" "}
              <span className="text-terracotta">محتاج يعرفه.</span>
            </>
          ) : (
            <>
              Everything an Egyptian merchant{" "}
              <span className="text-terracotta">needs to know.</span>
            </>
          )}
        </h1>
        <p className="prose-body text-ink/75 max-w-2xl mx-auto">
          {isAr
            ? "١٠ أدلة قصيرة، كل واحد ٣-٥ دقايق قراية. مفيش حشو. عربي وإنجليزي مع بعض."
            : "10 short guides, 3–5 minutes each. No fluff. Arabic and English, side by side."}
        </p>
        {/* Category chips — purely informational; no filtering wired */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <span
              key={cat}
              className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold text-ink-soft/65 px-2.5 py-0.5 bg-paper border border-ink/10 rounded-[4px]"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-[900px] mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="flex flex-col gap-3">
          {guides.map((g, i) => {
            const open = openSlug === g.slug;
            const body = isAr ? g.body_ar : g.body_en;
            return (
              <article
                key={g.slug}
                id={g.slug}
                className={`relative bg-paper border border-ink/10 rounded-[10px] overflow-hidden transition-all duration-200 ease-numu ${
                  open ? "shadow-card" : ""
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute top-0 start-0 w-12 h-[3px] ${accentBar[g.accent]}`}
                />
                <button
                  type="button"
                  onClick={() => setOpenSlug(open ? null : g.slug)}
                  // eslint-disable-next-line jsx-a11y/aria-proptypes
                  aria-expanded={open}
                  className="w-full flex items-start justify-between gap-4 text-start p-5 sm:p-6 hover:bg-navy/[0.03] transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft/60 font-semibold">
                        § {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`font-mono text-[10px] uppercase tracking-[0.14em] font-semibold ${accentText[g.accent]}`}
                      >
                        {isAr ? g.category_ar : g.category_en}
                      </span>
                      <span
                        aria-hidden="true"
                        className="size-1 rounded-full bg-ink-soft/30"
                      />
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft/55">
                        {isAr
                          ? `${g.readTime} دقايق قراية`
                          : `${g.readTime} min read`}
                      </span>
                    </div>
                    <h2 className="font-display text-lg sm:text-xl font-semibold text-ink tracking-tight leading-tight">
                      {isAr ? g.title_ar : g.title_en}
                    </h2>
                  </div>
                  <span
                    aria-hidden="true"
                    className={`shrink-0 size-7 rounded-[4px] bg-cream border border-ink/10 flex items-center justify-center text-ink-soft transition-transform duration-200 ease-numu ${
                      open ? "rotate-45 text-terracotta border-terracotta/40" : ""
                    }`}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                </button>
                {open && (
                  <div className="px-5 sm:px-6 pb-6 sm:pb-7 pt-0">
                    <div className="border-t border-bone pt-5 flex flex-col gap-3">
                      {body.map((para, pi) => (
                        <p
                          key={pi}
                          className="prose-body text-ink/80 leading-[1.8]"
                        >
                          {para}
                        </p>
                      ))}

                      {(isAr ? g.tip_ar : g.tip_en) && (
                        <div
                          className={`mt-2 bg-cream border border-ink/10 rounded-[6px] p-4 border-s-[3px] ${
                            g.accent === "navy"
                              ? "border-s-navy"
                              : g.accent === "terracotta"
                                ? "border-s-terracotta"
                                : g.accent === "sage"
                                  ? "border-s-sage"
                                  : "border-s-saffron"
                          }`}
                        >
                          <p className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold text-ink-soft/60 mb-1">
                            § {isAr ? "ملاحظة نُمُو" : "NUMU NOTE"}
                          </p>
                          <p className="prose-body-sm text-ink/80">
                            {isAr ? g.tip_ar : g.tip_en}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-navy rounded-[14px] p-8 sm:p-10 text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-saffron font-semibold">
            § READY TO SHIP?
          </span>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl font-bold text-cream tracking-tight leading-tight mb-3">
            {isAr
              ? "كل اللي قريته، نُمُو معمول عشانه."
              : "Everything you just read — numu is built for."}
          </h2>
          <p className="prose-body text-cream/75 max-w-xl mx-auto mb-6">
            {isAr
              ? `افتح متجر تجربة ${toArabicDigits(String(DEFAULT_TRIAL_DAYS))} يوم مجاناً. بوابات دفع، شحن، فواتير — جاهزين.`
              : `Start a ${DEFAULT_TRIAL_DAYS}-day trial. Payments, shipping, invoicing — already wired.`}
          </p>
          <Link
            to="/?demo=1"
            className="group inline-flex items-center justify-center gap-2 bg-cream text-navy font-semibold py-3 px-6 rounded-[4px] hover:bg-cream/90 active:scale-[0.985] transition-all duration-200 ease-numu"
          >
            <span>{isAr ? "افتح متجرك" : "Open your store"}</span>
            <span
              aria-hidden="true"
              className="text-lg text-terracotta group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform rtl:rotate-180"
            >
              →
            </span>
          </Link>
        </div>
      </div>
      </main>

      <footer className="relative bg-paper numu-dot-surface py-12 lg:py-16 -mt-8 sm:-mt-10
        rounded-t-[32px] sm:rounded-t-[44px] border-t border-ink/[0.09]">
        <Footer />
      </footer>

      <CookieConsent />
    </div>
  );
};

export default Learn;
