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

/* ============================================================
   Fixed CTA vocabulary — content-system.md § "Fixed CTA vocabulary"
   These labels are locked for v1. Alternatives such as `ابدأ دلوقتي`,
   `ابدأ الآن`, `جرّب نسخة تجريبية`, `ابدأ مجاناً` are explicitly banned.
   ============================================================ */
export const CTA = {
  primary: { ar: 'أنشئ متجرك مجانًا', en: 'Create your store free' },
  secondary: { ar: 'شاهد الديمو', en: 'See the demo' },
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
    ar: 'بدون بطاقة ائتمان · بدون برمجة · ابدأ خلال دقائق',
    en: 'No credit card · No code · Start in minutes',
  },
  /** Accessible description of the hero footage for screen readers. */
  videoAlt: {
    ar: 'فيديو قصير لتجار بيجهزوا طلبات ويعبّوا شحنات في مساحة شغلهم.',
    en: 'A short video of merchants preparing orders and packing parcels in their workspace.',
  },
} satisfies Record<string, Bi>;

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
    ar: 'دفع محلي، شحن مناسب، واتساب، ودفع عند الاستلام — الأدوات الأساسية للتاجر المصري في مكان واحد.',
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
        ar: 'كارت، محفظة، أو دفع عند الاستلام — العميل بيختار، والأوردر بيوصلك بنفس الشكل.',
        en: 'Card, wallet, or cash on delivery — the customer chooses, and the order reaches you the same way.',
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
  globeAlt: {
    ar: 'كرة أرضية منقّطة، الشرق الأوسط وشمال أفريقيا في المنتصف.',
    en: 'A dotted globe with the Middle East and North Africa centred.',
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
    ar: 'الأدوات اللي بتبيع بيها، متوصلة مع بعض.',
    en: 'The tools you sell with, connected to each other.',
  },
  support: {
    ar: 'اربط الدفع، الشحن، واتساب، والتكاملات اللي محتاجها — وخلي نُمُو يجمعلك التشغيل في مكان واحد.',
    en: 'Connect payments, shipping, WhatsApp and the integrations you need — and let numu bring the operation together in one place.',
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
