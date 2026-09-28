/**
 * Homepage copy — v1 source of truth.
 *
 * Every Arabic string below is quoted verbatim from the approved redesign
 * package (`docs/Plans/landing page redesign/`). Arabic is the v1 baseline;
 * English is a translation for the language switch, never a second visual
 * hierarchy.
 *
 * DO NOT edit an Arabic headline here without changing the matching
 * `sections/*.md` file and getting content-owner approval — see
 * `content-system.md` § "Source-of-truth homepage copy".
 */

export type Lang = 'ar' | 'en';

/** One bilingual string. */
export interface Bi {
  ar: string;
  en: string;
}

export const pick = (b: Bi, lang: Lang): string => (lang === 'ar' ? b.ar : b.en);

/* ── Tone rules (W7, `docs/Plans/landing page updates/07-egyptian-tone.md`) ──
   1. Egyptian, never MSA: إزاي not كيف, عشان not لأن, دلوقتي not الآن, مش not ليس.
   2. One idea per sentence; ≤ 14 words in a bubble or caption, ≤ 20 in body copy.
   3. A joke is about the pain of the old way — never the merchant, a customer,
      a courier, a region or a competitor by name. At most one per section.
   4. No jokes in pricing, legal, Trust Network, payment or shipping errors,
      anything with a number, or a button label.
   5. English is a plain translation; jokes do not travel.
   Inventory + MSA-flag script output: `copy-inventory.md` in the same folder. */

import type { AssetKey } from './assets';

/* ============================================================
   Fixed CTA vocabulary — content-system.md § "Fixed CTA vocabulary"
   These labels are locked for v1. Alternatives such as `ابدأ دلوقتي`,
   `ابدأ الآن`, `جرّب نسخة تجريبية`, `ابدأ مجاناً` are explicitly banned.
   The secondary conversion is the product tour (`productTour`). The demo
   label was retired on 2026-09-25: the marketing site has one door, the
   trial, and no 7-day demo tenant.
   ============================================================ */
export const CTA = {
  primary: { ar: 'أنشئ متجرك مجانًا', en: 'Create your store free' },
  productTour: { ar: 'استكشف لوحة التحكم', en: 'Explore the dashboard' },
  integrations: { ar: 'استعرض التكاملات', en: 'Browse integrations' },
  trustNetwork: { ar: 'اعرف عن Trust Network', en: 'About Trust Network' },
  login: { ar: 'عندي حساب بالفعل', en: 'I already have an account' },
  sales: { ar: 'كلم فريق المبيعات', en: 'Talk to sales' },
  howItWorks: { ar: 'اعرف إزاي بتشتغل', en: 'See how it works' },
  merchantStories: { ar: 'شوف قصص التجار', en: 'See merchant stories' },
} satisfies Record<string, Bi>;

/* ============================================================
   01 — Hero
   ============================================================ */
export const hero = {
  headline: {
    ar: 'افتح متجرك وابدأ البيع من غير تعقيد.',
    en: 'Open your store and start selling, without the complexity.',
  },
  support: {
    ar: 'متجر عربي جاهز، دفع محلي، شحن أسهل، ودفع عند الاستلام معمول للسوق المصري.',
    en: 'An Arabic storefront that is ready to go, local payments, easier shipping, and cash on delivery built for the Egyptian market.',
  },
  reassurance: {
    ar: 'من غير بطاقة ائتمان · من غير مبرمج · من غير ابن خالتك اللي بيفهم في الكمبيوتر',
    en: 'No credit card · No code · Start in minutes',
  },
  /** Accessible description of the hero film (the poster's alt text). */
  videoAlt: {
    ar: 'فيلم موشن قصير عن نُمُو: بتفتح متجرك وتجهّزه، وعميلك بيدفع بالطريقة اللي تريحه أو كاش عند الاستلام، والتحديثات بتوصله على واتساب، وبتشحن لكل المحافظات، وكل أرقامك قدامك في لوحة واحدة.',
    en: 'A short motion film about numu: open and set up your store, let customers pay their way or cash on delivery, send updates on WhatsApp, ship to every governorate, and see every number on one dashboard.',
  },
  /** The film player's accessible name. */
  filmLabel: { ar: 'فيلم نُمُو', en: 'The numu film' },
} satisfies Record<string, Bi>;

/* ============================================================
   01b — Onboarding chat (added 2026-09-25, owner request — W3,
   `docs/Plans/landing page updates/03-onboarding-chat.md`)
   A scripted conversation, not a model. Chip values are the hub setup
   wizard's own option ids, so the answers pre-fill `OnboardingWizard` after
   sign-up. Every reply quotes only what the integrations audit (W1)
   verified. Humour budget: one light line (the tea), none in the summary.
   ============================================================ */
export interface ChatChip {
  value: string;
  label: Bi;
  /** What numu says back to this answer, when it says something specific. */
  reply?: Bi;
  /** Sub-line under a preset (niche list only). */
  desc?: Bi;
}

export const onboardingChat = {
  eyebrow: { ar: 'ابدأ من هنا', en: 'Start here' },
  heading: {
    ar: 'قولّنا بتبيع إيه، والباقي علينا.',
    en: 'Tell us what you sell. We take it from there.',
  },
  support: {
    ar: 'كام سؤال على السريع بدل فورم طويل. إجاباتك بتتحفظ، وتلاقيها مستنياك أول ما تفتح متجرك.',
    en: 'A few quick questions instead of a long form. Your answers are kept and waiting for you the moment you open your store.',
  },
  bot: { ar: 'نُمُو', en: 'numu' },
  status: { ar: 'بيرد دلوقتي', en: 'Replying now' },
  threadLabel: { ar: 'المحادثة مع نُمُو', en: 'Conversation with numu' },
  composer: {
    label: { ar: 'اوصف متجرك في سطر', en: 'Describe your store in a line' },
    // Cycled as the placeholder while the box is empty (static under reduced motion).
    examples: [
      { ar: 'بعمل حلويات بيتي وبوصّل في القاهرة والجيزة…', en: 'I bake at home and deliver across Cairo and Giza…' },
      { ar: 'عندي براند طرح وأوشحة شغّال على إنستجرام…', en: 'I run a scarves brand on Instagram…' },
      { ar: 'ببيع إكسسوارات موبايل، وأغلب عملائي بيدفعوا كاش…', en: 'I sell phone accessories and most customers pay cash…' },
      { ar: 'محل هدوم في المنصورة وعايز أبيع أونلاين…', en: 'A clothes shop in Mansoura that wants to sell online…' },
    ] as Bi[],
    submit: { ar: 'ابني متجري', en: 'Build my store' },
    hint: { ar: 'اكتب بالعامي عادي — أو اختار من تحت', en: 'Type it plainly — or pick one below' },
    presets: { ar: 'الأكتر اختيارًا', en: 'Most picked' },
  },
  choicesLabel: { ar: 'اختار إجابة', en: 'Pick an answer' },
  niche: {
    ask: {
      ar: 'أهلًا! أنا نُمُو. مش هاخد من وقتك أكتر من كوباية شاي — كام سؤال ونبدأ. بتبيع إيه؟',
      en: "Hi, I'm numu. A few quick questions and we start. What do you sell?",
    },
    chips: [
      { value: 'fashion', label: { ar: 'ملابس وأزياء', en: 'Fashion & clothing' }, desc: { ar: 'فساتين، طرح، جينز، تيشيرتات', en: 'Dresses, scarves, jeans, tees' } },
      { value: 'accessories', label: { ar: 'إكسسوارات', en: 'Accessories' }, desc: { ar: 'شنط، ساعات، فضة ونظارات', en: 'Bags, watches, silver, eyewear' } },
      { value: 'beauty', label: { ar: 'تجميل وعناية', en: 'Beauty & care' }, desc: { ar: 'ميكب، سكين كير، برفانات', en: 'Makeup, skincare, perfume' } },
      { value: 'electronics', label: { ar: 'إلكترونيات', en: 'Electronics' }, desc: { ar: 'موبايلات، سماعات، شواحن', en: 'Phones, headphones, chargers' } },
      { value: 'food', label: { ar: 'أكل ومشروبات', en: 'Food & drinks' }, desc: { ar: 'حلويات بيتي، قهوة، أكل صحي', en: 'Home-made sweets, coffee, healthy food' } },
      { value: 'home', label: { ar: 'مستلزمات البيت', en: 'Home & living' }, desc: { ar: 'مفروشات، ديكور، أدوات مطبخ', en: 'Bedding, decor, kitchenware' } },
      { value: 'other', label: { ar: 'حاجة تانية', en: 'Something else' }, desc: { ar: 'كتب، هدايا، أي حاجة تتباع', en: 'Books, gifts, anything that sells' } },
    ] as ChatChip[],
  },
  where: {
    ask: { ar: 'حلو. وبتبيع دلوقتي منين؟', en: 'Nice. Where do you sell today?' },
    chips: [
      { value: 'instagram', label: { ar: 'إنستجرام أو فيسبوك', en: 'Instagram or Facebook' } },
      { value: 'easyorders', label: { ar: 'إيزي أوردرز', en: 'EasyOrders' } },
      { value: 'vondera', label: { ar: 'فونديرا', en: 'Vondera' } },
      { value: 'shopify', label: { ar: 'شوبيفاي', en: 'Shopify' } },
      { value: 'own_site', label: { ar: 'موقع خاص بيا', en: 'My own site' } },
      { value: 'offline', label: { ar: 'محل على الأرض', en: 'A physical shop' } },
      { value: 'nowhere', label: { ar: 'لسه مبدأتش', en: 'Not selling yet' } },
    ] as ChatChip[],
  },
  orders: {
    ask: { ar: 'وبيجيلك كام أوردر في الشهر تقريبًا؟', en: 'Roughly how many orders a month?' },
    notYet: {
      ar: 'ولا يهمك، كلنا بدأنا من أول أوردر. أول أوردر عليك، والباقي علينا.',
      en: 'No problem — everyone starts from order one.',
    },
    notYetLabel: { ar: 'لسه', en: 'Not yet' },
    chips: [
      { value: '1-50', label: { ar: 'أقل من ٥٠', en: 'Under 50' } },
      { value: '51-200', label: { ar: 'من ٥٠ لـ ٢٠٠', en: '50 – 200' } },
      { value: '201-1000', label: { ar: 'من ٢٠٠ لـ ١٠٠٠', en: '200 – 1,000' } },
      { value: '1000+', label: { ar: 'أكتر من ١٠٠٠', en: 'Over 1,000' } },
    ] as ChatChip[],
  },
  pay: {
    ask: { ar: 'عميلك بيدفع إزاي غالبًا؟', en: 'How do your customers usually pay?' },
    chips: [
      {
        value: 'cod',
        label: { ar: 'كاش عند الاستلام', en: 'Cash on delivery' },
        reply: {
          ar: 'الدفع عند الاستلام عندنا مش خانة في فورم، ده نص الشغل: شبكة الثقة بتكشف الزبون اللي بيرفض الاستلام قبل ما تشحن.',
          en: 'Cash on delivery is half the job here, not a checkbox: Trust Network flags customers who refuse deliveries before you ship.',
        },
      },
      {
        value: 'card',
        label: { ar: 'كارت فيزا أو ماستركارد', en: 'Visa or Mastercard' },
        reply: {
          ar: 'الكروت بتشتغل عن طريق Paymob أو Kashier، والدفع عند الاستلام فاضل شغّال جنبهم.',
          en: 'Cards run through Paymob or Kashier, with cash on delivery still on beside them.',
        },
      },
      {
        value: 'wallet',
        label: { ar: 'فودافون كاش والمحافظ', en: 'Vodafone Cash & wallets' },
        reply: {
          ar: 'المحافظ تتربط من Paymob، أو العميل يحوّل على فودافون كاش ويرفع صورة الإيصال.',
          en: 'Wallets connect through Paymob, or the customer transfers by Vodafone Cash and uploads the receipt.',
        },
      },
      {
        value: 'fawry',
        label: { ar: 'فوري', en: 'Fawry' },
        reply: {
          ar: 'فوري بيدّي عميلك كود يدفع بيه من أي منفذ فوري.',
          en: 'Fawry gives your customer a code to pay at any Fawry outlet.',
        },
      },
      {
        value: 'all',
        label: { ar: 'كل ده', en: 'All of these' },
        reply: {
          ar: 'ماشي. الكاش شغّال دايمًا، وجنبه بوابة أونلاين واحدة تختارها، وفودافون كاش وإنستاباي بالإيصال.',
          en: 'Sure. Cash on delivery is always on, next to one online gateway you choose, plus Vodafone Cash and InstaPay by receipt.',
        },
      },
    ] as ChatChip[],
  },
  ship: {
    ask: { ar: 'والشحن؟', en: 'And shipping?' },
    chips: [
      {
        value: 'bosta',
        label: { ar: 'بوسطة', en: 'Bosta' },
        reply: {
          ar: 'بوسطة متوصّلة جاهزة: البوليصة والتتبّع من جوه الأوردر.',
          en: 'Bosta is wired in: the waybill and tracking come from inside the order.',
        },
      },
      {
        value: 'mylerz_jt',
        label: { ar: 'مايلرز أو J&T', en: 'Mylerz or J&T' },
        reply: {
          ar: 'مايلرز وJ&T بتربطهم من صفحة الشحن أول ما المتجر يتفتح.',
          en: 'Mylerz and J&T connect from the shipping page once the store is open.',
        },
      },
      {
        value: 'own',
        label: { ar: 'مندوبي الخاص', en: 'My own courier' },
        reply: {
          ar: 'مندوبك ليه بوليصة من نُمُو، وعميلك ليه صفحة يتابع منها الشحنة.',
          en: 'Your courier gets a numu waybill, and your customer gets a page to track the parcel.',
        },
      },
      {
        value: 'both',
        label: { ar: 'بوسطة ومندوبي', en: 'Bosta and my courier' },
        reply: {
          ar: 'بوسطة ومندوبك الاتنين شغّالين من نفس الشاشة.',
          en: 'Bosta and your own courier both work from the same screen.',
        },
      },
      {
        value: 'unknown',
        label: { ar: 'لسه معرفش', en: 'Not sure yet' },
        reply: {
          ar: 'ولا يهمك. ابدأ بأسعار شحن حسب المحافظة، واربط شركة الشحن وقت ما تحب.',
          en: 'No problem. Start with shipping rates by governorate and connect a carrier whenever you like.',
        },
      },
    ] as ChatChip[],
  },
  done: {
    title: { ar: 'تمام كده، فهمت عليك.', en: 'That is everything I need.' },
    rows: {
      niche: { ar: 'بتبيع', en: 'You sell' },
      where: { ar: 'بتبيع منين', en: 'Selling on' },
      orders: { ar: 'أوردرات الشهر', en: 'Orders a month' },
      pay: { ar: 'الدفع', en: 'Payments' },
      ship: { ar: 'الشحن', en: 'Shipping' },
    },
    fit: { ar: 'ده بالظبط اللي نُمُو معمول عشانه.', en: 'That is exactly what numu is built for.' },
    carry: {
      ar: 'سجّل، وهتلاقي إجاباتك دي مستنياك في خطوات إعداد المتجر.',
      en: 'Sign up and these answers will be waiting in your store setup.',
    },
    restart: { ar: 'غيّر إجاباتي', en: 'Change my answers' },
  },
  figure: {
    alt: {
      ar: 'خطوة إعداد المتجر في لوحة تحكم نُمُو، والتصنيف ومكان البيع وعدد الأوردرات متعلّمين جاهزين من إجابات الشات.',
      en: 'The store setup step in the numu dashboard, with the category, sales channel and order band already selected from the chat answers.',
    },
    caption: {
      ar: 'إجاباتك بتوصل هنا: خطوات إعداد متجرك في لوحة التحكم، متعلّمة جاهزة.',
      en: 'Where your answers land: your store setup in the dashboard, already filled in.',
    },
  },
};

/* ============================================================
   02 — Merchant proof
   ============================================================ */
export const merchantProof = {
  heading: {
    ar: 'تجّار حقيقيين بيبيعوا من هنا.',
    en: 'Real merchants sell from here.',
  },
  support: {
    ar: 'من أول منتج لحد أول طلب، نُمُو بيساعد التجار يحوّلوا شغلهم أونلاين بطريقة أوضح.',
    en: 'From the first product to the first order, numu helps merchants move their business online more clearly.',
  },
  /**
   * Shown in place of the story cards while marketing has not delivered
   * written consent for any story. Deliberately makes no claim.
   */
  pendingNote: {
    ar: 'المتاجر اللي هنا شغّالة فعلًا وتقدر تدخلها بنفسك. مش بنكتب كلام على لسان تاجر ولا رقم من غير ما صاحبه يوافق عليه.',
    en: 'The stores here are live and you can open them yourself. We do not put words in a merchant’s mouth, or publish a number, without their sign-off.',
  },
} satisfies Record<string, Bi>;

/* ============================================================
   03 — Local commerce layer
   (the fixed replacement for Shopify's AI-chat section)
   ============================================================ */
export const localCommerce = {
  heading: {
    ar: 'تجارتك ماشية مع السوق اللي بتبيع فيه.',
    en: 'Your commerce runs with the market you sell in.',
  },
  support: {
    ar: 'الدفع والشحن وواتساب والدفع عند الاستلام — الحاجات اللي بتفتح لها خمس تابات كل يوم، في تاب واحدة.',
    en: 'Local payments, shipping that fits, WhatsApp, and cash on delivery — the essentials for an Egyptian merchant in one place.',
  },
  blocks: [
    {
      key: 'payment',
      step: { ar: 'الدفع', en: 'Payment' },
      heading: {
        ar: 'خلّي العميل يدفع بالطريقة اللي تناسبه.',
        en: 'Let the customer pay the way that suits them.',
      },
      body: {
        ar: 'كارت، فودافون كاش أو أي محفظة، إنستاباي، أو دفع عند الاستلام — العميل بيختار، والأوردر بيوصلك بنفس الشكل.',
        en: 'Card, Vodafone Cash or any wallet, InstaPay, or cash on delivery — the customer chooses, and the order reaches you the same way.',
      },
    },
    {
      key: 'shipping',
      step: { ar: 'الشحن', en: 'Shipping' },
      heading: {
        ar: 'اعرض سعر الشحن الصح قبل تأكيد الأوردر.',
        en: 'Show the right shipping price before the order is confirmed.',
      },
      body: {
        ar: 'حدّد أسعار الشحن حسب المحافظة، فالعميل يشوف التكلفة الحقيقية قبل ما يأكد.',
        en: 'Set shipping rates by governorate, so the customer sees the real cost before confirming.',
      },
    },
    {
      key: 'communication',
      step: { ar: 'المتابعة', en: 'Follow-up' },
      heading: {
        ar: 'تابع العميل والأوردر من غير ما تضيع بين الرسائل.',
        en: 'Follow the customer and the order without getting lost between messages.',
      },
      body: {
        ar: 'حالة الأوردر والتواصل مع العميل في نفس المكان، مش متفرقين على كذا تطبيق.',
        en: 'Order status and customer contact in the same place, not scattered across apps.',
      },
    },
  ],
  /** Labels on the connected-workflow diagram. */
  flow: {
    order: { ar: 'أوردر من العميل', en: 'Customer order' },
    payment: { ar: 'اختيار طريقة الدفع', en: 'Payment choice' },
    shipping: { ar: 'قرار الشحن', en: 'Shipping decision' },
    dashboard: { ar: 'لوحة تحكم التاجر', en: 'Merchant dashboard' },
  },
};

/* ============================================================
   04 — Product system showcase
   ============================================================ */
export const productSystem = {
  heading: {
    ar: 'من شكل المتجر لقرارات البيع — كل حاجة قدامك.',
    en: 'From how the store looks to how you decide — all in front of you.',
  },
  support: {
    ar: 'اختار شكل عربي احترافي، أضف منتجاتك، وبعدها تابع الطلبات والمبيعات من لوحة تحكم واحدة.',
    en: 'Pick a professional Arabic look, add your products, then follow orders and sales from one dashboard.',
  },
  /* Order is deliberate: analytics first, because "did I make money" is the
     question a merchant opens the dashboard to answer; the storefront last,
     because it is the thing they set up once. */
  tabs: [
    {
      key: 'analytics',
      label: { ar: 'التحليلات', en: 'Analytics' },
      body: {
        ar: 'شوف المبيعات والمنتجات الأكتر طلبًا ومصادر الزيارات، عشان تعرف تصرف فلوسك ووقتك فين.',
        en: 'See sales, best-selling products and traffic sources, so you know where to spend your money and time.',
      },
    },
    {
      key: 'orders',
      label: { ar: 'الطلبات', en: 'Orders' },
      body: {
        ar: 'الطلبات الجديدة، حالة كل أوردر، والشحنات — كلها في شاشة واحدة تفتحها الصبح وتعرف تشتغل منها.',
        en: 'New orders, the status of each one, and shipments — all on one screen you can open and work from.',
      },
    },
    {
      key: 'store',
      label: { ar: 'المتجر', en: 'Store' },
      body: {
        ar: 'اختار ثيم عربي جاهز وعدّل الألوان والخطوط والأقسام، وشوف شكل متجرك زي ما العميل هيشوفه بالظبط.',
        en: 'Pick a ready Arabic theme, adjust colors, fonts and sections, and see your store exactly as the customer will.',
      },
    },
  ],
};

/* ============================================================
   05 — Reliability and growth
   ============================================================ */
export const reliability = {
  heading: {
    ar: 'ثابت وقت الزحمة. وجاهز للنمو.',
    en: 'Reliable when orders surge. Ready when your business grows.',
  },
  support: {
    ar: 'من أول أوردر لحد مواسم البيع الكبيرة، تابع متجرك وطلباتك ودفعك وشحنك من مكان واحد.',
    en: 'From the first order to the big selling seasons, follow your store, orders, payments and shipping from one place.',
  },
  /**
   * Qualitative only. `05-reliability-and-growth.md`: "Never invent uptime,
   * order volume, or market coverage." No number appears in this section
   * until the product owner approves one.
   */
  points: [
    {
      ar: 'متجرك شغّال وقت العروض ومواسم الذروة، من غير ما تقلق من الضغط.',
      en: 'Your store keeps running through promotions and peak season, without you worrying about load.',
    },
    {
      ar: 'الطلبات والدفع والشحن بيفضلوا متابعين مع بعض، مهما زاد حجم شغلك.',
      en: 'Orders, payments and shipping stay in step with each other however much your volume grows.',
    },
    {
      ar: 'ابدأ بمتجر واحد، وكبّر لما شغلك يكبر، من غير ما تنقل بياناتك من مكان لمكان.',
      en: 'Start with one store and scale as your business grows, without migrating your data somewhere else.',
    },
  ],
  /**
   * The section's proof since 2026-09-25 (`06-earth-replacement.md`): five
   * real hub screens from the order arriving to the cash being confirmed.
   * Captions are Egyptian colloquial and describe what is on the screen —
   * still no number, no uptime, no coverage claim.
   */
  pipeline: {
    heading: { ar: 'من الأوردر لحد الفلوس في جيبك', en: 'From the order to the cash in your pocket' },
    steps: [
      {
        key: 'order',
        label: { ar: 'أوردر جديد وصل', en: 'A new order lands' },
        caption: {
          ar: 'الأوردر بحالته وعميله وشحنته في شاشة واحدة.',
          en: 'The order, its status, its customer and its shipment on one screen.',
        },
        asset: 'hubOrders',
        alt: {
          ar: 'قائمة الطلبات في نُمُو: رقم الأوردر والعميل والدفع والحالة.',
          en: 'The numu orders list: order number, customer, payment and status.',
        },
      },
      {
        key: 'risk',
        label: { ar: 'إشارة الريسك قبل الشحن', en: 'The risk signal before you ship' },
        caption: {
          ar: 'Trust Network بيقولك الأوردر ده مضمون ولا يستاهل عربون. القرار قرارك.',
          en: 'Trust Network tells you whether this order is safe or worth a deposit. The call is yours.',
        },
        asset: 'trustNetwork',
        alt: {
          ar: 'شاشة Trust Network في نُمُو: إشارة الريسك والإجراءات المتاحة للتاجر.',
          en: 'The numu Trust Network screen: the risk signal and the actions open to the merchant.',
        },
      },
      {
        key: 'whatsapp',
        label: { ar: 'تأكيد على واتساب', en: 'Confirmation on WhatsApp' },
        caption: {
          ar: 'رسالة التأكيد بتروح لوحدها، وإنت شايف اتقرت ولا لأ.',
          en: 'The confirmation goes out by itself, and you can see whether it was read.',
        },
        asset: 'whatsapp',
        alt: {
          ar: 'شاشة واتساب بيزنس في نُمُو وعليها رسائل التأكيد المرسلة وحالتها.',
          en: 'The numu WhatsApp Business screen with the confirmation messages sent and their status.',
        },
      },
      {
        key: 'shipping',
        label: { ar: 'البوليصة والتتبّع', en: 'Waybill and tracking' },
        caption: {
          ar: 'بوسطة أو مايلرز أو J&T أو مندوبك الخاص: بوليصة وتتبّع من جوه نُمُو.',
          en: 'Bosta, Mylerz, J&T or your own courier: waybill and tracking from inside numu.',
        },
        asset: 'hubLogistics',
        alt: {
          ar: 'صفحة الشحن في نُمُو: المناطق والأسعار وشركات الشحن ومندوبك الخاص.',
          en: 'The numu shipping page: zones, rates, couriers and your own courier.',
        },
      },
      {
        key: 'cash',
        label: { ar: 'الفلوس اتأكدت', en: 'The cash is confirmed' },
        caption: {
          ar: 'لما الكاش يوصل بتأكد الدفع من الأوردر نفسه، وتسوية الكاش مع شركة الشحن ليها صفحتها.',
          en: 'When the cash arrives you confirm the payment on the order itself; settling cash with the courier has its own page.',
        },
        asset: 'hubOrderDetail',
        alt: {
          ar: 'تفاصيل أوردر في نُمُو: ملخص الدفع والرصيد المتبقي وزرار تأكيد الدفع.',
          en: 'An order in numu: the payment summary, the balance due and the confirm-payment button.',
        },
      },
    ] satisfies { key: string; label: Bi; caption: Bi; asset: AssetKey; alt: Bi }[],
  },
};

/* ============================================================
   06 — COD operations and Trust Network
   (homepage order position 6 — see page-architecture.md)
   ============================================================ */
export const cod = {
  heading: {
    ar: 'الدفع عند الاستلام، معمول صح.',
    en: 'Cash on delivery, done right.',
  },
  support: {
    ar: 'شوف إشارات الخطر قبل الشحن، اختار الإجراء المناسب، وخلي الأوردر الموثوق يكمل طريقه.',
    en: 'See the risk signals before you ship, choose the right action, and let a trusted order carry on.',
  },
  steps: [
    { ar: 'إشارة ريسك واضحة', en: 'A clear risk signal' },
    { ar: 'قرارك أنت', en: 'The decision is yours' },
    { ar: 'شحن أو دفع مسبق', en: 'Ship or take prepayment' },
  ],
  /** The three merchant-controlled actions shown on the order view. */
  actions: [
    { ar: 'اشحن', en: 'Ship' },
    { ar: 'اطلب دفع مسبق', en: 'Request prepayment' },
    { ar: 'احجب', en: 'Hold' },
  ],
  /**
   * Homepage says opt-in + merchant-controlled and nothing more. Hashing,
   * data boundaries, retention and appeals live on /trust-network.
   */
  control: {
    ar: 'الخاصية دي اختيارية وبتشتغل بقرارك. نُمُو بيوريك الإشارة، والقرار النهائي يفضل عندك.',
    en: 'This feature is opt-in and runs on your decision. numu shows you the signal; the final call stays with you.',
  },
};

/* ============================================================
   07 — Ecosystem and integrations
   ============================================================ */
export const ecosystem = {
  heading: {
    ar: 'الأدوات اللي بتبيع بيها، بتكلّم بعض — من غير ما تكون إنت الوسيط.',
    en: 'The tools you sell with, talking to each other — without you in the middle.',
  },
  support: {
    ar: 'اربط الدفع والمحافظ، الشحن، واتساب، الدومين، الاستيراد، والذكاء الاصطناعي — وخلي نُمُو يجمعلك التشغيل في مكان واحد.',
    en: 'Connect payments and wallets, shipping, WhatsApp, your domain, imports and AI — and let numu bring the operation together in one place.',
  },
};

/* ============================================================
   08 — Pricing and final CTA
   ============================================================ */
export const pricing = {
  heading: {
    ar: 'ابدأ ببساطة. واختار الباقة لما تكبر.',
    en: 'Start simply. Choose a plan as you grow.',
  },
  support: {
    ar: 'مفيش رسوم مستخبية، ومفيش تعقيد في أول خطوة. ابدأ بالخطة المناسبة وحوّلها لما احتياجك يكبر.',
    en: 'No hidden fees and no complexity in the first step. Start on the right plan and change it when your needs grow.',
  },
};

export const finalCta = {
  heading: { ar: 'جاهز تفتح متجرك؟', en: 'Ready to open your store?' },
  support: {
    ar: 'ابدأ من غير بطاقة ائتمان، وشوف نُمُو مناسب لتجارتك من أول يوم.',
    en: 'Start without a credit card and see how numu fits your business from day one.',
  },
} satisfies Record<string, Bi>;
