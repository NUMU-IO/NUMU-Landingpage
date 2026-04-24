import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

/* Bosta hex mark — kept in brand red */
const BostaIcon = ({ size = 22 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 68 68"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M65.244 17.666L35.544.533a3.78 3.78 0 00-3.87 0l-29.7 17.133C.79 18.376 0 19.639 0 21.06v25.107c0 1.421.71 2.684 1.975 3.395l29.7 17.133c.631.315 1.263.552 1.974.552.71 0 1.343-.158 1.975-.552l29.7-17.133c1.184-.71 1.974-1.974 1.974-3.395V21.06a4.24 4.24 0 00-2.054-3.394zM60.347 39.93l-10.98-6.316 10.98-6.316V39.93zM33.649 7.323L57.424 21.06 33.65 34.798 9.795 21.06 33.649 7.323zM6.872 27.219l10.98 6.316-10.98 6.316V27.219zm26.777 32.607L9.795 46.088l14.85-8.606 6.95 4.027c.632.316 1.264.553 1.975.553.71 0 1.343-.158 1.975-.553l6.95-4.027 14.85 8.606L33.65 59.826z"
      fill="#E30613"
    />
  </svg>
);

const WhatsAppIcon = ({ size = 22 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="#25D366"
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

type Category = "payments" | "shipping" | "messaging";

interface Partner {
  name: string;
  desc_en: string;
  desc_ar: string;
  category: Category;
  logo: React.ReactNode;
}

/**
 * Category → brand-kit accent mapping.
 * Payments  → navy       (primary trust signal)
 * Shipping  → terracotta (callout / highlight)
 * Messaging → sage       (active / live channel)
 */
const categoryMeta: Record<
  Category,
  { label_en: string; label_ar: string; dot: string; text: string; bg: string; border: string }
> = {
  payments: {
    label_en: "Payments",
    label_ar: "دفع",
    dot: "bg-navy",
    text: "text-navy",
    bg: "bg-navy/5",
    border: "border-navy/20",
  },
  shipping: {
    label_en: "Shipping",
    label_ar: "شحن",
    dot: "bg-terracotta",
    text: "text-terracotta",
    bg: "bg-terracotta/5",
    border: "border-terracotta/20",
  },
  messaging: {
    label_en: "Messaging",
    label_ar: "تواصل",
    dot: "bg-sage",
    text: "text-sage",
    bg: "bg-sage/5",
    border: "border-sage/30",
  },
};

const Integrations: React.FC = () => {
  const { t, dir, language } = useLanguage();
  const isAr = language === "ar";

  const partners: Partner[] = [
    {
      name: "Paymob",
      desc_en: "Cards · Apple Pay · Wallets",
      desc_ar: "كروت · آبل باي · محافظ",
      category: "payments",
      logo: (
        <img
          src="/paymob-logo.webp"
          alt="Paymob"
          width="120"
          height="28"
          loading="lazy"
          decoding="async"
          className="h-5 w-auto object-contain"
        />
      ),
    },
    {
      name: "Fawry",
      desc_en: "Pay-anywhere cash network",
      desc_ar: "ادفع من أي فرع فوري",
      category: "payments",
      logo: (
        <img
          src="/fawry-logo.webp"
          alt="Fawry"
          width="120"
          height="28"
          loading="lazy"
          decoding="async"
          className="h-5 w-auto object-contain"
        />
      ),
    },
    {
      name: "Kashier",
      desc_en: "Unified payment gateway",
      desc_ar: "بوابة دفع متكاملة",
      category: "payments",
      logo: (
        <img
          src="/kashier-logo.webp"
          alt="Kashier"
          width="120"
          height="28"
          loading="lazy"
          decoding="async"
          className="h-5 w-auto object-contain"
        />
      ),
    },
    {
      name: "Bosta",
      desc_en: "Waybills · governorate rates",
      desc_ar: "بوالص · أسعار بالمحافظة",
      category: "shipping",
      logo: <BostaIcon size={22} />,
    },
    {
      name: "Aramex",
      desc_en: "International shipping",
      desc_ar: "شحن دولي",
      category: "shipping",
      logo: (
        <span className="font-display text-base font-bold tracking-tight text-terracotta">
          aramex
        </span>
      ),
    },
    {
      name: "WhatsApp",
      desc_en: "Order updates · support",
      desc_ar: "تحديثات الأوردرات والدعم",
      category: "messaging",
      logo: <WhatsAppIcon size={22} />,
    },
  ];

  return (
    <div className="max-w-[1360px] mx-auto w-full px-4 sm:px-6 lg:px-10">
      {/* Header — § marker + eyebrow + display title. Repositioned as
          "numu App Store" per audit §2.5 — the ecosystem frame signals
          "serious SaaS" to merchants comparing against Shopify (21k apps)
          / Salla (550 apps). Frame matters more than scale at this stage. */}
      <div className="text-center mb-10 sm:mb-14">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-terracotta font-semibold">
            § APP STORE
          </span>
          <span className="eyebrow">
            {isAr
              ? "دفع · شحن · تواصل"
              : "PAYMENTS · SHIPPING · MESSAGING"}
          </span>
        </div>

        <h2 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-bold text-ink tracking-tight leading-[1.05] mb-5">
          {t("integrations.title")}
        </h2>
        <p className="prose-body text-ink/75 max-w-2xl mx-auto">
          {t("integrations.subtitle")}
        </p>

        {/* Stat callout — "6 native · 0 setup" */}
        <div className="mt-7 inline-flex items-center gap-4 px-5 py-2.5 bg-paper border border-ink/10 rounded-[4px]">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-bold text-navy tabular-nums">
              {isAr ? "٦" : "6"}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft/75">
              {isAr ? "تكامل جاهز" : "Native"}
            </span>
          </div>
          <span className="w-px h-4 bg-bone" aria-hidden="true" />
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-bold text-sage tabular-nums">
              {isAr ? "٠" : "0"}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft/75">
              {isAr ? "إعداد" : "Setup"}
            </span>
          </div>
          <span className="w-px h-4 bg-bone" aria-hidden="true" />
          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-sage animate-pulse" aria-hidden="true" />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] font-semibold text-sage">
              {isAr ? "نشط" : "Live"}
            </span>
          </div>
        </div>
      </div>

      {/* Partner grid — 3 columns desktop, 2 tablet, 1 mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
        {partners.map((partner) => {
          const meta = categoryMeta[partner.category];
          return (
            <div
              key={partner.name}
              className="group relative flex flex-col p-5 sm:p-6 bg-paper border border-ink/10 rounded-[10px] shadow-card hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 ease-numu"
            >
              {/* Category chip — peeks top-right */}
              <div className="flex items-center justify-between mb-6">
                <div
                  className={`size-12 rounded-[6px] bg-cream border border-ink/10 flex items-center justify-center p-2`}
                >
                  {partner.logo}
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 ${meta.bg} border ${meta.border} rounded-[4px] font-mono text-[10px] uppercase tracking-[0.18em] font-semibold ${meta.text}`}
                >
                  <span
                    className={`size-1 rounded-full ${meta.dot}`}
                    aria-hidden="true"
                  />
                  {isAr ? meta.label_ar : meta.label_en}
                </span>
              </div>

              {/* Name + desc */}
              <div>
                <h3 className="font-display text-lg font-semibold text-ink tracking-tight mb-1">
                  {partner.name}
                </h3>
                <p className="prose-body-sm text-ink/75">
                  {isAr ? partner.desc_ar : partner.desc_en}
                </p>
              </div>

              {/* Bottom status rail — sage "connected" dot + mono label */}
              <div className="mt-6 pt-4 border-t border-bone flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span
                    className="size-1.5 rounded-full bg-sage"
                    aria-hidden="true"
                  />
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft/60">
                    {isAr ? "متصل" : "Connected"}
                  </span>
                </div>
                <span
                  aria-hidden="true"
                  className="font-mono text-[11px] text-ink-soft/40 group-hover:text-terracotta transition-colors rtl:rotate-180"
                >
                  →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA — directs to the full App Store directory at /apps.
          Inline "Coming soon" pills list the next-shipping integrations
          (Stripe, Meta, TikTok, Khazenly) so visitors see the roadmap at
          a glance without leaving the section. */}
      <div className="mt-10 flex flex-col items-center gap-4">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft/60">
            {isAr ? "جاي قريب" : "Coming soon"}
          </span>
          {(dir === "rtl"
            ? ["سترايب", "ميتا", "تيك توك", "خزنلي"]
            : ["Stripe", "Meta", "TikTok", "Khazenly"]
          ).map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-cream border border-ink/10 rounded-[2px] font-mono text-[10px] uppercase tracking-[0.18em] font-semibold text-ink-soft/75"
            >
              <span
                aria-hidden="true"
                className="size-1 rounded-full bg-saffron"
              />
              {name}
            </span>
          ))}
        </div>

        <Link
          to="/apps"
          className="group inline-flex items-center gap-2 px-5 py-3 rounded-[4px] border border-ink/15 hover:border-terracotta hover:text-terracotta hover:bg-terracotta/[0.04] font-semibold text-sm text-ink transition-all duration-200 ease-numu"
        >
          <span>{isAr ? "استعرض كل التكاملات" : "Browse all integrations"}</span>
          <span
            aria-hidden="true"
            className="text-lg text-saffron group-hover:text-terracotta group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-all rtl:rotate-180"
          >
            →
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Integrations;
