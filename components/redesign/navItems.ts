import { Bi } from './copy';

/**
 * Header navigation.
 *
 * `page-architecture.md` fixes the header set: كيف تعمل · المميزات ·
 * التكاملات · الأسعار · تواصل معنا. Items with `groups` open the full-width
 * mega panel, which is how the other secondary pages become reachable without
 * "exposing a long list of internal anchors" in the bar itself.
 *
 * A panel item still has its own `to`, so the top-level label is always a real
 * destination — the panel adds routes, it never replaces the link.
 */

export interface NavLink {
  to: string;
  label: Bi;
  desc: Bi;
}

export interface NavGroup {
  title: Bi;
  links: NavLink[];
}

/** Optional promoted card shown at the end of a panel. */
export interface NavFeature {
  to: string;
  eyebrow: Bi;
  title: Bi;
  desc: Bi;
}

export interface NavItem {
  key: string;
  to: string;
  label: Bi;
  groups?: NavGroup[];
  feature?: NavFeature;
}

export const NAV_ITEMS: NavItem[] = [
  {
    key: 'how',
    to: '/product-tour',
    label: { ar: 'كيف تعمل', en: 'How it works' },
  },
  {
    key: 'features',
    to: '/features',
    label: { ar: 'المميزات', en: 'Features' },
    groups: [
      {
        title: { ar: 'ابني وابيع', en: 'Build and sell' },
        links: [
          {
            to: '/features',
            label: { ar: 'كل المميزات', en: 'All features' },
            desc: { ar: 'مرتّبة حسب شغلك اليومي', en: 'Grouped by your daily job' },
          },
          {
            to: '/themes',
            label: { ar: 'الثيمات', en: 'Themes' },
            desc: { ar: 'واجهات عربية جاهزة للتعديل', en: 'Arabic storefronts, ready to edit' },
          },
          {
            to: '/product-tour',
            label: { ar: 'جولة في المنتج', en: 'Product tour' },
            desc: { ar: 'من فتح المتجر لشحن الأوردر', en: 'From opening to shipping' },
          },
        ],
      },
      {
        title: { ar: 'شغّل وطمّن', en: 'Operate with confidence' },
        links: [
          {
            to: '/trust-network',
            label: { ar: 'Trust Network', en: 'Trust Network' },
            desc: { ar: 'إشارات ريسك قبل ما تشحن', en: 'Risk signals before you ship' },
          },
          {
            to: '/integrations',
            label: { ar: 'التكاملات', en: 'Integrations' },
            desc: { ar: 'دفع، شحن، وواتساب', en: 'Payments, shipping, WhatsApp' },
          },
          {
            to: '/support',
            label: { ar: 'الدعم', en: 'Support' },
            desc: { ar: 'حد يرد عليك بالعربي', en: 'Someone answers, in Arabic' },
          },
        ],
      },
    ],
    feature: {
      to: '/product-tour',
      eyebrow: { ar: 'جولة سريعة', en: 'Quick tour' },
      title: { ar: 'شوف المنتج قبل ما تبدأ.', en: 'See the product before you start.' },
      desc: {
        ar: 'خمس خطوات بالترتيب اللي التاجر بيمشي بيه فعلًا.',
        en: 'Five steps, in the order a merchant actually moves through.',
      },
    },
  },
  {
    key: 'integrations',
    to: '/integrations',
    label: { ar: 'التكاملات', en: 'Integrations' },
  },
  {
    key: 'pricing',
    to: '/pricing',
    label: { ar: 'الأسعار', en: 'Pricing' },
  },
  {
    key: 'resources',
    to: '/resources',
    label: { ar: 'مصادر', en: 'Resources' },
    groups: [
      {
        title: { ar: 'اتعلّم', en: 'Learn' },
        links: [
          {
            to: '/learn',
            label: { ar: 'أدلة', en: 'Guides' },
            desc: { ar: 'شروحات عملية للسوق المصري', en: 'Practical guides for Egypt' },
          },
          {
            to: '/resources',
            label: { ar: 'كل المصادر', en: 'All resources' },
            desc: { ar: 'حاجات تقراها وحاجات تستخدمها', en: 'Things to read, things to use' },
          },
        ],
      },
      {
        title: { ar: 'استخدم', en: 'Use' },
        links: [
          {
            to: '/tools',
            label: { ar: 'أدوات مجانية', en: 'Free tools' },
            desc: { ar: 'حاسبات من غير حساب', en: 'Calculators, no account' },
          },
          {
            to: '/about',
            label: { ar: 'عن نُمُو', en: 'About numu' },
            desc: { ar: 'ليه المنصة موجودة', en: 'Why the platform exists' },
          },
        ],
      },
    ],
  },
  {
    key: 'contact',
    to: '/contact',
    label: { ar: 'تواصل معنا', en: 'Contact' },
  },
];
