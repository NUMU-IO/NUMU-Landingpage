import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import {
  useContactModal,
  ContactVariant,
} from "../contexts/ContactModalContext";

/**
 * Contact section — 3 editorial cards (WhatsApp / Email / Call) + address rail.
 * Each card is a semantic link (mailto: / tel: / https://wa.me/) for built-in
 * mobile handoff. Schema.org ContactPoint markup added inline for SEO.
 *
 * Brand-kit mapping:
 *   WhatsApp    → sage (primary channel for MENA merchants)
 *   Email       → navy
 *   Call (WA)   → terracotta (urgent / founder's program)
 */

interface Channel {
  key: string;
  label_en: string;
  label_ar: string;
  title_en: string;
  title_ar: string;
  value: string;
  valueDisplay?: string;
  /** Either an external URL or a modal variant. */
  action:
    | { kind: "external"; href: string }
    | { kind: "modal"; variant: ContactVariant };
  cta_en: string;
  cta_ar: string;
  surface: "sage" | "navy" | "terracotta";
  contactType: string;
}

const channels: Channel[] = [
  {
    key: "whatsapp",
    label_en: "WhatsApp",
    label_ar: "واتساب",
    title_en: "Talk to a human.",
    title_ar: "كلّم إنسان حقيقي.",
    value: "+201000000000",
    valueDisplay: "+20 100 000 0000",
    action: { kind: "external", href: "https://wa.me/201060082542" },
    cta_en: "Chat on WhatsApp",
    cta_ar: "ابدأ المحادثة",
    surface: "sage",
    contactType: "customer support",
  },
  {
    key: "email",
    label_en: "Email",
    label_ar: "إيميل",
    title_en: "Write us a proper note.",
    title_ar: "ابعت رسالة مفصلة.",
    value: "support@numueg.app",
    action: { kind: "modal", variant: "email" },
    cta_en: "Send a message",
    cta_ar: "ابعت رسالة",
    surface: "navy",
    contactType: "technical support",
  },
  {
    key: "sales",
    label_en: "Sales",
    label_ar: "مبيعات",
    title_en: "Big store? Book a call.",
    title_ar: "متجر كبير؟ احجز مكالمة.",
    value: "sales@numueg.app",
    action: { kind: "modal", variant: "call" },
    cta_en: "Reserve a call",
    cta_ar: "احجز مكالمة",
    surface: "terracotta",
    contactType: "sales",
  },
];

const surfaceStyles: Record<
  Channel["surface"],
  {
    bg: string;
    text: string;
    body: string;
    label: string;
    labelBg: string;
    accent: string;
    value: string;
    border: string;
  }
> = {
  sage: {
    bg: "bg-sage",
    text: "text-cream",
    body: "text-cream/80",
    label: "text-cream/60",
    labelBg: "bg-cream text-sage",
    accent: "text-saffron",
    value: "text-cream",
    border: "border-cream/20",
  },
  navy: {
    bg: "bg-navy",
    text: "text-cream",
    body: "text-cream/75",
    label: "text-cream/55",
    labelBg: "bg-saffron text-ink",
    accent: "text-saffron",
    value: "text-cream",
    border: "border-cream/15",
  },
  terracotta: {
    bg: "bg-terracotta",
    text: "text-cream",
    body: "text-cream/80",
    label: "text-cream/60",
    labelBg: "bg-cream text-terracotta",
    accent: "text-saffron",
    value: "text-cream",
    border: "border-cream/20",
  },
};

const ContactSection: React.FC = () => {
  const { language } = useLanguage();
  const { open: openContact } = useContactModal();
  const isAr = language === "ar";

  return (
    <div className="max-w-[1360px] mx-auto w-full px-4 sm:px-6 lg:px-10">
      {/* Schema.org ContactPoint structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "numu",
            url: "https://numueg.app",
            contactPoint: channels.map((c) => ({
              "@type": "ContactPoint",
              contactType: c.contactType,
              email: c.value.includes("@") ? c.value : undefined,
              telephone: c.value.startsWith("+") ? c.value : undefined,
              availableLanguage: ["Arabic", "English"],
              areaServed: ["EG", "SA", "AE", "KW", "QA", "BH", "OM"],
            })),
          }),
        }}
      />

      {/* Header */}
      <header className="mb-10 sm:mb-14 text-center">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-terracotta font-semibold">
            § CONTACT
          </span>
          <span className="eyebrow">
            {isAr
              ? "هنسمعك · هنردّ عليك · بالعربي"
              : "WE LISTEN · WE REPLY · IN ARABIC"}
          </span>
        </div>
        <h2 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-bold text-ink tracking-tight leading-[1.05] mb-5">
          {isAr ? (
            <>
              عندك سؤال؟ <span className="text-terracotta">اتكلم معانا.</span>
            </>
          ) : (
            <>
              Got a question?{" "}
              <span className="text-terracotta">Let's talk.</span>
            </>
          )}
        </h2>
        <p className="prose-body text-ink/75 max-w-2xl mx-auto">
          {isAr
            ? "فريق الدعم بيرد بالعربي في أقل من ساعة. اختار الطريقة اللي تناسبك."
            : "Support replies in Arabic within the hour. Pick whichever channel works for you."}
        </p>
      </header>

      {/* 3 contact cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
        {channels.map((channel) => {
          const s = surfaceStyles[channel.surface];
          const label = isAr ? channel.label_ar : channel.label_en;
          const title = isAr ? channel.title_ar : channel.title_en;
          const cta = isAr ? channel.cta_ar : channel.cta_en;

          const cardClasses = `group relative flex flex-col p-7 sm:p-8 rounded-[10px] ${s.bg} min-h-[260px] text-start w-full transition-all duration-200 ease-numu hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:outline-none`;

          const body = (
            <>
              {/* Top row — CHANNEL mono + pill tag */}
              <div className="flex items-center justify-between mb-6">
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.18em] font-semibold ${s.label}`}
                >
                  {isAr ? "قناة" : "CHANNEL"}
                </span>
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.18em] font-semibold px-2.5 py-1 rounded-[4px] ${s.labelBg}`}
                >
                  {label}
                </span>
              </div>

              {/* Title */}
              <h3
                className={`font-display text-2xl sm:text-[26px] font-bold tracking-tight leading-[1.15] mb-3 ${s.text}`}
              >
                {title}
              </h3>

              {/* Address/value in mono */}
              <p
                className={`font-mono text-[12px] tracking-wide ${s.value} mb-6 break-all`}
                dir="ltr"
              >
                {channel.valueDisplay ?? channel.value}
              </p>

              {/* CTA at bottom */}
              <div
                className={`mt-auto pt-5 border-t ${s.border} flex items-center justify-between`}
              >
                <span
                  className={`font-mono text-[11px] uppercase tracking-[0.18em] font-semibold ${s.text}`}
                >
                  {cta}
                </span>
                <span
                  aria-hidden="true"
                  className={`text-lg ${s.accent} group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:rotate-180 transition-transform`}
                >
                  →
                </span>
              </div>
            </>
          );

          if (channel.action.kind === "external") {
            return (
              <a
                key={channel.key}
                href={channel.action.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label}: ${cta}`}
                className={cardClasses}
              >
                {body}
              </a>
            );
          }

          // Modal variant — rendered as a button so the whole card is a single
          // accessible activation target (keyboard + screen reader announce it
          // as "button" not "link that opens modal").
          return (
            <button
              key={channel.key}
              type="button"
              onClick={() =>
                openContact(
                  channel.action.kind === "modal"
                    ? channel.action.variant
                    : "email",
                )
              }
              aria-label={`${label}: ${cta}`}
              aria-haspopup="dialog"
              className={cardClasses}
            >
              {body}
            </button>
          );
        })}
      </div>

      {/* Address + hours rail — editorial paper tile below the grid */}
      <div className="mt-5 bg-paper border border-ink/10 rounded-[10px] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="size-1.5 rounded-full bg-sage" aria-hidden="true" />
          <address className="not-italic font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft/75">
            {isAr ? "القاهرة الجديدة · مصر · ٢٠٢٦" : "New Cairo · Egypt · 2026"}
          </address>
        </div>
        <div className="flex items-center gap-4 text-ink-soft/75">
          <div className="flex items-center gap-2">
            <span
              className="size-1.5 rounded-full bg-saffron"
              aria-hidden="true"
            />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em]">
              {isAr ? "الأحد – الخميس · ٩ص – ٦م" : "Sun – Thu · 9 am – 6 pm"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
