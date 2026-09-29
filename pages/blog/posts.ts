import type { Bi } from '../../components/redesign/copy';

/**
 * /blog posts (W5, `docs/Plans/landing page updates/05-blog.md`).
 *
 * `/learn` holds evergreen how-to guides; `/blog` holds anything with a date:
 * market notes, product explainers, seasonal prep, and — once a merchant signs
 * off — their stories. Writing a post = adding an object here, adding its slug
 * to `BLOG_SLUGS` in `scripts/prerender.mjs`, and building.
 *
 * Rules: every fact about numu must be one the integrations audit (W1) marked
 * live; no merchant numbers or quotes without written consent; Egyptian
 * colloquial Arabic, English a plain translation (tone rules in `copy.ts`).
 * Body blocks: a string that starts with "## " is a sub-heading, everything
 * else is a paragraph. Cadence target: two posts a month, dated.
 */
export interface Post {
  slug: string;
  title: Bi;
  excerpt: Bi;
  category: Bi;
  publishedAt: string;
  updatedAt?: string;
  readTime: number;
  body: { ar: string[]; en: string[] };
  /** Internal links shown under the post — pages that exist. */
  related: { to: string; label: Bi }[];
}

export const POSTS: Post[] = [
  {
    slug: 'cod-in-egypt-2026',
    title: {
      ar: 'الدفع عند الاستلام في مصر: ليه لسه هو الملك، وإزاي تقلّل المرتجعات',
      en: 'Cash on delivery in Egypt: why it still rules, and how to cut returns',
    },
    excerpt: {
      ar: 'أغلب عملاءك لسه عايزين يدفعوا لما الطرد يوصل. الحل مش إنك تلغي الكاش — الحل إنك تعرف مين يستاهل تشحنله.',
      en: 'Most of your customers still want to pay when the parcel arrives. The answer is not dropping cash — it is knowing who to ship to.',
    },
    category: { ar: 'الكاش', en: 'Cash on delivery' },
    publishedAt: '2026-09-26',
    readTime: 5,
    body: {
      ar: [
        'لو بتبيع أونلاين في مصر، إنت عارف المشهد ده: أوردر جديد، تجهّزه، تشحنه، والمندوب يرجع بيه عشان العميل "مش موجود" أو "غيّر رأيه". الشحنة راحت وجت، ومصاريف الشحن عليك.',
        '## ليه الدفع عند الاستلام مش هيختفي',
        'العميل المصري عايز يشوف الحاجة الأول. الثقة في الدفع أونلاين بتزيد، بس لسه أغلب الناس بتختار الكاش لما يكون قدامها. لو قفلت الدفع عند الاستلام، إنت كده بتقفل الباب في وش جزء كبير من عملاءك.',
        'يبقى السؤال الصح مش "أقفل الكاش ولا لأ"، السؤال: أشحن لمين وأنا مرتاح، وأطلب عربون من مين؟',
        '## خمس حاجات بتقلّل المرتجعات فعلًا',
        'أولًا، أكّد الأوردر قبل ما تشحن. رسالة واتساب قصيرة فيها المنتج والإجمالي والعنوان بتفرز العميل الجد من اللي كان بيتفرج. في نُمُو رسالة التأكيد بتروح لوحدها أول ما الأوردر يوصل.',
        'ثانيًا، اعرض سعر الشحن الحقيقي قبل ما العميل يأكد. المفاجأة في المصاريف عند الباب من أكتر أسباب الرفض. حدّد أسعارك حسب المحافظة، والعميل يشوفها في الشيك أوت.',
        'ثالثًا، بص على إشارة الريسك قبل الشحن. شبكة الثقة في نُمُو (Trust Network) بتبص على سجل رقم الموبايل عبر المتاجر، وبتديك إشارة: الأوردر ده مريح ولا يستاهل نظرة تانية. القرار في الآخر قرارك.',
        'رابعًا، اطلب عربون من الأوردرات اللي فيها ريسك. بدل ما ترفض الأوردر، اطلب مبلغ صغير مقدّم بمحفظة أو إنستاباي أو كارت. العميل الجد بيدفع، واللي مش جد بيبان.',
        'خامسًا، حسّن الشحن نفسه: وقت أقصر بين الأوردر والشحن، ورقم تتبّع يوصل للعميل. كل يوم تأخير بيدّي فرصة للعميل يغيّر رأيه.',
        '## احسبها صح',
        'قبل ما تقرر، احسب تكلفة الأوردر اللي بيرجع: شحن رايح وجاي، تغليف، ووقت. حاسبة تكلفة الدفع عند الاستلام المجانية على نُمُو بتوريك نسبة المرتجعات اللي بتبدأ تخسر عندها.',
        'الخلاصة: الكاش هيفضل موجود، والتاجر الشاطر هو اللي بيشحن وهو عارف مين قدامه.',
      ],
      en: [
        'If you sell online in Egypt you know the scene: a new order, you pack it, ship it, and the courier brings it back because the customer "wasn\'t there" or "changed their mind". The parcel went and came back, and the shipping is on you.',
        '## Why cash on delivery is not going away',
        'Egyptian shoppers want to see the item first. Trust in online payment is growing, but when cash is on offer most people still pick it. Switch cash on delivery off and you close the door on a large share of your customers.',
        'So the right question is not "keep cash or not" but "who do I ship to with confidence, and who do I ask for a deposit?"',
        '## Five things that actually cut returns',
        'First, confirm the order before you ship. A short WhatsApp message with the product, total and address separates serious buyers from browsers. In numu the confirmation goes out on its own when the order arrives.',
        'Second, show the real shipping price before the customer confirms. Surprise fees at the door are a top reason for refusal. Set your rates by governorate and the customer sees them at checkout.',
        'Third, look at the risk signal before shipping. numu\'s Trust Network looks at a phone number\'s history across stores and gives you a signal: this order looks fine, or it deserves a second look. The decision stays yours.',
        'Fourth, ask for a deposit on risky orders. Instead of refusing the order, ask for a small amount up front by wallet, InstaPay or card. Serious customers pay; the rest show themselves.',
        'Fifth, improve the shipping itself: less time between order and dispatch, and a tracking number the customer receives. Every day of delay is a chance to change their mind.',
        '## Do the maths',
        'Before deciding, work out what a returned order costs you: shipping both ways, packaging and time. numu\'s free COD cost calculator shows the return rate at which you start losing money.',
        'Bottom line: cash is here to stay, and the smart merchant ships knowing who is on the other side.',
      ],
    },
    related: [
      { to: '/trust-network', label: { ar: 'إزاي Trust Network بيشتغل', en: 'How Trust Network works' } },
      { to: '/tools/cod', label: { ar: 'حاسبة تكلفة الدفع عند الاستلام', en: 'COD cost calculator' } },
      { to: '/learn/reduce-cod-rto', label: { ar: 'دليل تقليل الأوردرات المرفوضة', en: 'Guide: reduce refused COD orders' } },
    ],
  },
  {
    slug: 'shipping-companies-egypt-compared',
    title: {
      ar: 'بوسطة ولا مايلرز ولا J&T ولا مندوبك؟ الشحن جوه نُمُو بالتفصيل',
      en: 'Bosta, Mylerz, J&T or your own courier? Shipping inside numu, in detail',
    },
    excerpt: {
      ar: 'أربع طرق تشحن بيها من نُمُو. مش هنقولك مين الأرخص — ده بيتغيّر — هنقولك كل واحدة بتعمل إيه جوه لوحة التحكم.',
      en: 'Four ways to ship from numu. We won\'t tell you who is cheapest — that changes — we will tell you what each does inside the dashboard.',
    },
    category: { ar: 'الشحن', en: 'Shipping' },
    publishedAt: '2026-09-26',
    readTime: 4,
    body: {
      ar: [
        'أول سؤال بيسأله أي تاجر بعد ما يفتح المتجر: هشحن مع مين؟ الإجابة بتفرق حسب حجم أوردراتك، المحافظات اللي بتبعتلها، وهل عندك مندوب ولا لأ. في نُمُو عندك أربع طرق، وتقدر تستخدم أكتر من واحدة.',
        '## بوسطة',
        'بوسطة متوصّلة بنُمُو جاهزة: بتعمل البوليصة من جوه الأوردر، وبتتابع الشحنة، وتقدر تلغي أو تعمل مرتجع من نفس المكان. لو لسه بتبدأ وعايز حاجة شغّالة من أول يوم، دي أسهل نقطة بداية.',
        '## مايلرز وJ&T Express',
        'الاتنين متوصّلين برضه: شحن وتتبّع للأوردرات من لوحة التحكم. بتربط حسابك عندهم من صفحة الشحن، وبعدها تختار الشركة وانت بتعمل الشحنة.',
        '## مندوبك الخاص',
        'لو عندك مندوب أو شركة صغيرة بتتعامل معاها بنفسك، نُمُو بيطلعلك بوليصة للأوردر، وعميلك بياخد صفحة يتابع منها الشحنة. يعني نفس شكل الشركات الكبيرة، بس بمندوبك.',
        '## أسعار الشحن للعميل',
        'أيًا كانت الشركة، إنت اللي بتحدد سعر الشحن اللي العميل يدفعه، حسب المحافظة. العميل بيشوف السعر قبل ما يأكد، فمفيش مفاجآت على الباب. وفيه حاسبة أسعار شحن جوه لوحة التحكم تجرّب بيها قبل ما تثبّت.',
        '## نصيحتنا',
        'ابدأ بشركة واحدة وحدّد أسعارك بالمحافظة. لما أوردراتك تكبر، جرّب شركة تانية على محافظات معيّنة وقارن نسبة التسليم. وطباعة البوالص بالجملة وتسوية الكاش مع شركة الشحن بيوفروا عليك ساعات كل أسبوع.',
      ],
      en: [
        'The first question every merchant asks after opening the store: who do I ship with? The answer depends on your order volume, the governorates you ship to, and whether you have your own courier. numu gives you four ways, and you can use more than one.',
        '## Bosta',
        'Bosta is wired into numu: create the waybill from inside the order, track the parcel, and cancel or return from the same place. If you are starting out and want something working from day one, it is the easiest place to begin.',
        '## Mylerz and J&T Express',
        'Both are connected too: shipping and tracking from the dashboard. You connect your account with them from the shipping page, then pick the carrier when you create a shipment.',
        '## Your own courier',
        'If you have your own courier or a small company you deal with directly, numu issues a waybill for the order and your customer gets a page to track the parcel. The same experience as the big carriers, with your courier.',
        '## What the customer pays',
        'Whatever the carrier, you set the shipping price the customer pays, by governorate. The customer sees it before confirming, so there are no surprises at the door. A rate calculator in the dashboard lets you try prices before you fix them.',
        '## Our advice',
        'Start with one carrier and set your rates by governorate. As volume grows, try a second carrier on specific governorates and compare delivery rates. Bulk label printing and cash reconciliation with the courier save hours every week.',
      ],
    },
    related: [
      { to: '/integrations/bosta', label: { ar: 'تكامل بوسطة', en: 'Bosta integration' } },
      { to: '/integrations/your-own-courier', label: { ar: 'مندوبك الخاص', en: 'Your own courier' } },
      { to: '/learn/governorate-shipping', label: { ar: 'دليل أسعار الشحن بالمحافظة', en: 'Guide: shipping rates by governorate' } },
    ],
  },
  {
    slug: 'wallet-payments-vodafone-cash-instapay',
    title: {
      ar: 'تستقبل فودافون كاش وإنستاباي على متجرك إزاي؟',
      en: 'How to accept Vodafone Cash and InstaPay on your store',
    },
    excerpt: {
      ar: 'نص عملاءك معاهم محفظة على الموبايل. خلّيهم يدفعوا بيها من غير ما تستنى سكرين شوت على الواتساب.',
      en: 'Half your customers carry a mobile wallet. Let them pay with it without waiting for a screenshot on WhatsApp.',
    },
    category: { ar: 'الدفع', en: 'Payments' },
    publishedAt: '2026-09-26',
    readTime: 4,
    body: {
      ar: [
        'كتير من التجار بيستقبلوا فودافون كاش بالطريقة القديمة: العميل يحوّل، يبعت سكرين شوت على الواتساب، وانت تدوّر عليها وسط مية رسالة عشان تطابقها مع الأوردر. نُمُو بيحط الخطوة دي جوه الشيك أوت.',
        '## المحافظات اللي تقدر تستقبلها',
        'فودافون كاش، وWE Pay، وأورنج كاش، وإنستاباي، والتحويل البنكي. بتحط رقم المحفظة أو بيانات الحساب في الإعدادات، والعميل بيشوفها وهو بيطلب.',
        '## العميل بيعمل إيه',
        'بيختار طريقة الدفع، بيحوّل، وبيرفع صورة الإيصال في نفس الصفحة. الإيصال بيتربط بالأوردر لوحده، فانت بتشوفه جنب الأوردر وتأكد الدفع بضغطة.',
        '## ولو عايز الدفع يتأكد لوحده؟',
        'لو عايز المحفظة تتدفع من غير تأكيد يدوي، اربط Paymob: بيقبل الكروت والمحافظ ومنها فودافون كاش، وبيقبل ValU كمان. وفوري بيدّي العميل كود يدفع بيه من أي منفذ.',
        '## المحافظ والعربون',
        'المحافظ وإنستاباي كمان طريقة سهلة لعربون أوردر الدفع عند الاستلام: العميل يدفع مبلغ صغير مقدّم، والأوردر يتأكد. ده بيقلّل الأوردرات اللي بترجع من غير ما تقفل الكاش.',
        '## ابدأ بإيه',
        'لو بتبدأ: حط رقم فودافون كاش وإنستاباي، وسيب الدفع عند الاستلام شغّال. لما الأوردرات تكبر ووقت التأكيد اليدوي يبقى عبء، اربط بوابة دفع.',
      ],
      en: [
        'Many merchants take Vodafone Cash the old way: the customer transfers, sends a screenshot on WhatsApp, and you dig through a hundred messages to match it to the order. numu puts that step inside checkout.',
        '## The wallets you can accept',
        'Vodafone Cash, WE Pay, Orange Cash, InstaPay and bank transfer. You add the wallet number or account details in settings, and the customer sees them while ordering.',
        '## What the customer does',
        'They pick the payment method, transfer, and upload the receipt on the same page. The receipt is attached to the order, so you see it next to the order and confirm payment in one click.',
        '## Want payment confirmed automatically?',
        'If you want wallet payments without manual confirmation, connect Paymob: it takes cards and wallets including Vodafone Cash, and ValU too. Fawry gives the customer a code to pay at any outlet.',
        '## Wallets and deposits',
        'Wallets and InstaPay are also an easy way to take a deposit on a cash-on-delivery order: the customer pays a small amount up front and the order is confirmed. That cuts returned orders without switching cash off.',
        '## Where to start',
        'Starting out: add your Vodafone Cash and InstaPay details and keep cash on delivery on. When orders grow and manual confirmation becomes a chore, connect a payment gateway.',
      ],
    },
    related: [
      { to: '/integrations/vodafone-cash', label: { ar: 'فودافون كاش على نُمُو', en: 'Vodafone Cash on numu' } },
      { to: '/integrations/instapay', label: { ar: 'إنستاباي على نُمُو', en: 'InstaPay on numu' } },
      { to: '/learn/paymob-vs-fawry', label: { ar: 'بيموب ولا فوري؟', en: 'Paymob or Fawry?' } },
    ],
  },
  {
    slug: 'custom-domain-in-minutes',
    title: {
      ar: 'من اسمك.numueg.app لدومينك الخاص في دقايق',
      en: 'From yourname.numueg.app to your own domain in minutes',
    },
    excerpt: {
      ar: 'الدومين الخاص بيفرق في ثقة العميل وفي الإعلانات. الربط سجل واحد، والشهادة بتتعمل لوحدها.',
      en: 'Your own domain changes how much customers trust you, and how your ads perform. Connecting it is one record, and the certificate is automatic.',
    },
    category: { ar: 'المتجر', en: 'Your store' },
    publishedAt: '2026-09-26',
    readTime: 3,
    body: {
      ar: [
        'كل متجر على نُمُو بيبدأ بعنوان جاهز على numueg.app، وده كفاية تبدأ بيه. بس لما البراند يكبر، العميل بيثق أكتر في عنوان باسمك، والإعلانات والإيميلات بتبان أحسن.',
        '## الربط بيتعمل إزاي',
        'بتضيف الدومين في إعدادات المتجر، وبتعمل سجل CNAME واحد عند الشركة اللي شاري منها الدومين. أول ما السجل يشتغل، الشهادة (HTTPS) بتتعمل لوحدها — مش محتاج تشتري شهادة ولا تركّب حاجة.',
        '## مين عامل كده؟',
        'متاجر شغّالة على نُمُو بدومينها الخاص فعلًا، زي Vionne على vionneeg.com وPixel Print على pixelprinteg.com. تقدر تدخلها وتشوف بنفسك.',
        '## حاجات خد بالك منها',
        'اشتري الدومين من شركة معروفة وخلّي التجديد تلقائي — دومين خلص تجديده معناه متجر واقف. ولو بتغيّر العنوان بعد ما بقالك فترة شغّال، العنوان القديم بيفضل شغّال، فالعملاء القدام مش هيتوهوا.',
      ],
      en: [
        'Every numu store starts with a ready address on numueg.app, which is enough to begin. As the brand grows, customers trust an address with your name more, and ads and emails look better.',
        '## How to connect it',
        'Add the domain in store settings and create one CNAME record with the company you bought the domain from. As soon as the record works, the HTTPS certificate is issued automatically — nothing to buy or install.',
        '## Who does this already?',
        'Stores running on numu on their own domains, such as Vionne at vionneeg.com and Pixel Print at pixelprinteg.com. You can open them and see for yourself.',
        '## Things to watch',
        'Buy the domain from a known registrar and turn on auto-renewal — an expired domain means a store that is down. If you switch addresses after trading for a while, the old address keeps working, so returning customers do not get lost.',
      ],
    },
    related: [
      { to: '/integrations/custom-domain', label: { ar: 'الدومين الخاص', en: 'Custom domain' } },
      { to: '/learn/choose-store-name', label: { ar: 'اختيار اسم للمتجر', en: 'Choosing a store name' } },
      { to: '/tools/store-names', label: { ar: 'مولّد أسماء متاجر', en: 'Store name generator' } },
    ],
  },
  {
    slug: 'whatsapp-order-confirmation',
    title: {
      ar: 'تأكيد الأوردرات على واتساب من غير كول سنتر',
      en: 'Order confirmation on WhatsApp without a call centre',
    },
    excerpt: {
      ar: 'تتصل بكل عميل عشان تأكد الأوردر؟ في طريقة أسهل: الرسالة بتروح لوحدها، وانت بتشوف مين رد.',
      en: 'Calling every customer to confirm the order? There is an easier way: the message goes out by itself and you see who replied.',
    },
    category: { ar: 'واتساب', en: 'WhatsApp' },
    publishedAt: '2026-09-26',
    readTime: 4,
    body: {
      ar: [
        'التأكيد بالتليفون بياكل وقتك: مكالمات مبترد، عملاء بيردوا بعد ساعتين، وموظف قاعد طول اليوم على الموبايل. واتساب بيحل ده، بس لو اتعمل صح.',
        '## الرسالة بتروح لوحدها',
        'في نُمُو بتربط رقم واتساب بيزنس بتاع المتجر، وأول ما أوردر يوصل، رسالة التأكيد بتروح للعميل فيها تفاصيل الأوردر. نفس الكلام مع تحديثات الشحن. وانت شايف كل رسالة راحت لمين وحالتها.',
        '## الرد في صندوق واحد',
        'ردود العملاء على واتساب، ورسايل فيسبوك وإنستغرام، كلها بتيجي في صندوق وارد واحد. وانت بترد، العميل وأوردراته قدامك، من غير ما تفتح شاشة تانية.',
        '## حملات برضه',
        'غير التأكيد، تقدر تبعت حملات واتساب بقوالب معتمدة للعملاء اللي وافقوا يستقبلوا رسايل — عرض جديد، منتج رجع، أو تذكير بسلة متروكة.',
        '## نصايح للرسالة نفسها',
        'خليها قصيرة: اسم المنتج، الإجمالي، العنوان، وسؤال واحد واضح. متكتبش فقرة. وخلّي فيه طريقة سهلة يعدّل بيها العنوان لو غلط — عنوان غلط يعني شحنة راجعة.',
      ],
      en: [
        'Phone confirmation eats your time: unanswered calls, customers who reply two hours later, and someone sitting on the phone all day. WhatsApp solves this, if it is done right.',
        '## The message goes out by itself',
        'In numu you connect the store\'s WhatsApp Business number, and when an order arrives the confirmation goes to the customer with the order details. Same for shipping updates. You see every message, who it went to, and its status.',
        '## Replies in one inbox',
        'Customer replies on WhatsApp, plus Facebook and Instagram messages, land in one shared inbox. While you reply, the customer and their orders are in front of you, without opening another screen.',
        '## Campaigns too',
        'Beyond confirmations you can send WhatsApp campaigns with approved templates to customers who opted in — a new offer, a product back in stock, or an abandoned-cart reminder.',
        '## Tips for the message itself',
        'Keep it short: product name, total, address, and one clear question. No paragraphs. Give an easy way to fix the address — a wrong address means a returned parcel.',
      ],
    },
    related: [
      { to: '/integrations/whatsapp', label: { ar: 'تكامل واتساب', en: 'WhatsApp integration' } },
      { to: '/learn/whatsapp-instagram-selling', label: { ar: 'البيع من واتساب وإنستغرام', en: 'Selling on WhatsApp and Instagram' } },
      { to: '/features', label: { ar: 'كل المميزات', en: 'All features' } },
    ],
  },
  {
    slug: 'ramadan-2027-prep',
    title: {
      ar: 'جهّز متجرك لرمضان ٢٠٢٧ من دلوقتي',
      en: 'Get your store ready for Ramadan 2027 now',
    },
    excerpt: {
      ar: 'موسم رمضان والعيد بيتكسب قبل ما يبدأ. قائمة تجهيز على أسابيع، من المخزون للشحن للحملات.',
      en: 'The Ramadan and Eid season is won before it starts. A week-by-week checklist, from stock to shipping to campaigns.',
    },
    category: { ar: 'المواسم', en: 'Seasons' },
    publishedAt: '2026-09-26',
    readTime: 5,
    body: {
      ar: [
        'رمضان والعيد أكبر موسم بيع عند أغلب التجار في مصر. واللي بيكسب فيه هو اللي جهّز بدري، مش اللي صحي أول يوم ولقى المخزون خلص والمندوب مش لاحق.',
        '## قبلها بشهرين: المخزون والمنتجات',
        'بص على مبيعات الموسم اللي فات وحدّد المنتجات اللي هتطلب. ظبّط المخزون، وجهّز صور ووصف المنتجات الجديدة. وصف المنتجات بالذكاء الاصطناعي في نُمُو بيكتب عربي وإنجليزي دفعة واحدة، فمش هتقعد ليالي تكتب.',
        '## قبلها بشهر: العروض والحملات',
        'جهّز أكواد الخصم والعروض، والباقات (bundles) اللي بتزوّد قيمة الأوردر. حضّر قوالب رسايل واتساب للحملات من بدري عشان تتعتمد قبل الموسم.',
        '## قبلها بأسبوعين: الشحن',
        'اتفق مع شركة الشحن على مواعيد الاستلام، وخلّي عندك خطة لو الضغط زاد — مندوب إضافي أو شركة تانية على محافظات معيّنة. وراجع أسعار الشحن بالمحافظة.',
        '## أسبوع قبله: الإعلانات والتتبّع',
        'اتأكد إن بيكسل Meta وتيك توك شغّالين صح على المتجر، وإن الأحداث بتوصل من السيرفر كمان. إعلان من غير تتبّع صح يعني فلوس بتتصرف وانت مش شايف نتيجتها.',
        '## خلال الموسم',
        'أكّد الأوردرات بسرعة، وشحّن في نفس اليوم لو تقدر. وبص على إشارة الريسك قبل ما تشحن أوردرات الدفع عند الاستلام، خصوصًا الكبيرة. والعيد؟ اعرض آخر موعد للطلب يوصل قبل العيد بوضوح.',
      ],
      en: [
        'Ramadan and Eid are the biggest selling season for most merchants in Egypt. The ones who win are the ones who prepared early, not the ones who woke up on day one to empty stock and a courier who cannot keep up.',
        '## Two months before: stock and products',
        'Look at last season\'s sales and pick the products that will sell. Sort out stock and prepare photos and descriptions for new products. numu\'s AI product descriptions write Arabic and English in bulk, so no late nights writing.',
        '## A month before: offers and campaigns',
        'Prepare discount codes, offers and bundles that raise order value. Prepare WhatsApp campaign templates early so they are approved before the season.',
        '## Two weeks before: shipping',
        'Agree pickup times with your carrier and have a plan for peaks — an extra courier or a second carrier on specific governorates. Review your shipping rates by governorate.',
        '## A week before: ads and tracking',
        'Make sure the Meta and TikTok pixels work correctly on the store and that events also arrive from the server. An ad without proper tracking is money spent without seeing the result.',
        '## During the season',
        'Confirm orders fast and ship the same day if you can. Check the risk signal before shipping cash-on-delivery orders, especially large ones. And for Eid, show the last order date that still arrives in time, clearly.',
      ],
    },
    related: [
      { to: '/learn/ramadan-campaign', label: { ar: 'دليل حملة رمضان', en: 'Guide: Ramadan campaign' } },
      { to: '/tools/ai-description', label: { ar: 'أمثلة وصف المنتجات', en: 'AI description examples' } },
      { to: '/integrations/meta', label: { ar: 'بيكسل Meta', en: 'Meta pixel' } },
    ],
  },
  {
    slug: 'connect-chatgpt-to-your-store',
    title: {
      ar: 'اربط ChatGPT أو Claude بمتجرك: شرح بالبلدي',
      en: 'Connect ChatGPT or Claude to your store, in plain words',
    },
    excerpt: {
      ar: 'بدل ما تفتح عشر شاشات، اسأل مساعد الذكاء الاصطناعي بتاعك: "إيه الأوردرات اللي مستنية شحن النهارده؟"',
      en: 'Instead of opening ten screens, ask your AI assistant: "Which orders are waiting to ship today?"',
    },
    category: { ar: 'ذكاء اصطناعي', en: 'AI' },
    publishedAt: '2026-09-26',
    readTime: 4,
    body: {
      ar: [
        'أغلب التجار بيستخدموا ChatGPT أو Claude في كتابة البوستات والردود. الجديد إن المساعد ده يقدر يشتغل على متجرك نفسه: يقرا الأوردرات، يعدّل منتج، يطلعلك تقرير — وانت بتكلّمه عادي.',
        '## يعني إيه MCP؟',
        'MCP طريقة بتخلّي مساعد الذكاء الاصطناعي يتكلّم مع برنامج تاني بأمان. نُمُو عامل خادم MCP لمتجرك، فأي مساعد بيدعم MCP — زي Claude وChatGPT وCursor — يقدر يتوصّل بيه.',
        '## الربط بيتعمل إزاي',
        'من إعدادات المتجر، في صفحة "اربط الذكاء الاصطناعي"، بتعمل مفتاح ربط وتختار صلاحياته: مثلًا قراية الأوردرات بس، أو المنتجات كمان. بعدها بتحط المفتاح في تطبيق المساعد وخلاص.',
        '## تسأله إيه؟',
        '"إيه أكتر خمس منتجات اتباعت الشهر ده؟" — "فيه أوردرات دفع عند الاستلام مستنية شحن من امبارح؟" — "نزّل سعر المنتج الفلاني عشرة في المية." المساعد بيشتغل على بيانات متجرك الحقيقية.',
        '## الأمان',
        'كل مفتاح مربوط بمتجر واحد بس، وبالصلاحيات اللي انت اخترتها، وتقدر تلغيه في أي وقت. ابدأ بصلاحية قراية بس لحد ما تتعوّد، وبعدين زوّد.',
      ],
      en: [
        'Most merchants use ChatGPT or Claude to write posts and replies. What is new is that the assistant can work on your store itself: read orders, edit a product, pull a report — while you talk to it normally.',
        '## What is MCP?',
        'MCP is a way for an AI assistant to talk to another program safely. numu runs an MCP server for your store, so any assistant that supports MCP — like Claude, ChatGPT and Cursor — can connect to it.',
        '## How to connect',
        'In store settings, on the "Connect your AI" page, create a connection key and choose its permissions: for example, read orders only, or products too. Then paste the key into the assistant app and you are done.',
        '## What to ask',
        '"What were my top five products this month?" — "Are there cash-on-delivery orders waiting to ship since yesterday?" — "Lower the price of this product by ten percent." The assistant works on your store\'s real data.',
        '## Safety',
        'Each key is tied to one store only, with the permissions you chose, and you can revoke it any time. Start with read-only access until you are used to it, then add more.',
      ],
    },
    related: [
      { to: '/integrations/connect-your-ai-mcp', label: { ar: 'اربط الذكاء الاصطناعي (MCP)', en: 'Connect your AI (MCP)' } },
      { to: '/developers', label: { ar: 'المطورين', en: 'Developers' } },
      { to: '/features', label: { ar: 'كل المميزات', en: 'All features' } },
    ],
  },
];
