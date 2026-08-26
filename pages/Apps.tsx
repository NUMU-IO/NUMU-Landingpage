import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useSEO } from "../hooks/useSEO";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CookieConsent from "../components/CookieConsent";
import {
  PARTNERS,
  CATEGORY_LABEL,
  type Partner,
  type PartnerCategory,
} from "../components/redesign/partners";
import PartnerLogo from "../components/redesign/PartnerLogo";
import {
  CreditCard,
  Truck,
  MessageCircle,
  Megaphone,
  ReceiptText,
  type LucideIcon,
} from "lucide-react";

/**
 * App Store directory — every integration numu actually ships.
 *
 * ─── Why the roadmap tiers are gone ───────────────────────────────────────
 * This page used to carry three tiers: live, "جاي قريب", and "مخطط". The
 * owner asked for the coming-soon tier to go, and once it did the planned
 * tier had no reason to stay either — both were the same promise at
 * different distances, and neither described anything a merchant could use.
 *
 * Removing them also removed a set of claims that did not survive checking
 * against NUMU-api. The old list marked Aramex "live" when selecting it
 * silently ships with Bosta; marked InstaPay, Mylerz and J&T as future work
 * when all three have working adapters today; and listed ShipBlu, Khazenly,
 * Vodafone Cash, Klaviyo, Zoho, QuickBooks, GA4, Google Merchant Center and
 * TikTok Shop, none of which exist in the codebase in any form.
 *
 * So the page is now driven by `components/redesign/partners.tsx` — the same
 * verified roster the homepage and /integrations read, where every entry
 * carries an `evidence` line pointing at the code that makes it real. One
 * source of truth, and nothing on this page that a merchant cannot switch on
 * today.
 *
 * ─── Logos ────────────────────────────────────────────────────────────────
 * `PartnerLogo` resolves each mark from a real brand file or the company's
 * official simple-icons glyph, and falls back to one neutral connector icon
 * that is identical for every partner. Nothing here is a drawn stand-in.
 */

/**
 * Category icons — lucide, ISC licensed, no attribution required.
 *
 * flaticon was the first choice but it refuses non-browser requests (403),
 * and its free tier requires a visible credit line on the site. lucide is a
 * consistent single-weight line set, tree-shaken so only these five glyphs
 * reach the bundle, and it needs no credit.
 *
 * These are category signposts, not decoration: they help a merchant find the
 * shipping block without reading every heading. They are `aria-hidden`
 * because the heading beside each one already says the same thing.
 */
const CATEGORY_ICON: Record<PartnerCategory, LucideIcon> = {
  payments: CreditCard,
  shipping: Truck,
  messaging: MessageCircle,
  marketing: Megaphone,
  tax: ReceiptText,
};

const CATEGORY_ACCENT: Record<PartnerCategory, string> = {
  payments: "bg-navy",
  shipping: "bg-terracotta",
  messaging: "bg-sage",
  marketing: "bg-saffron",
  tax: "bg-navy",
};

const CATEGORY_ORDER: PartnerCategory[] = [
  "payments",
  "shipping",
  "messaging",
  "marketing",
  "tax",
];

const Apps: React.FC = () => {
  const { dir, language } = useLanguage();
  const isAr = language === "ar";

  useSEO({
    title: isAr
      ? "متجر تطبيقات نُمُو — التكاملات والشركاء"
      : "numu App Store — integrations and partners",
    description: isAr
      ? "كل التكاملات الشغالة على نُمُو — بيموب، فوري، كاشير، إنستاباي، فواتيرك، بوسطة، Mylerz، J&T، واتساب، فيسبوك، إنستغرام، Meta، تيك توك، والفاتورة الإلكترونية."
      : "Every integration running on numu today — Paymob, Fawry, Kashier, InstaPay, Fawaterak, Bosta, Mylerz, J&T, WhatsApp, Facebook, Instagram, Meta, TikTok and ETA e-invoicing.",
    canonical: "https://numueg.app/apps",
  });

  const liveCount = PARTNERS.length;

  return (
    <div className="relative min-h-screen bg-cream font-display" dir={dir}>
      <Navbar />

      <main id="main" className="bg-cream numu-dot-surface pt-24 sm:pt-28">

      <div className="relative z-10 text-center px-4 sm:px-6 pt-12 sm:pt-16 pb-10">
        <div className="inline-flex items-center gap-2 bg-terracotta/10 border border-terracotta/30 rounded-[4px] px-3 py-1 mb-5">
          <span
            className="size-1.5 rounded-full bg-terracotta"
            aria-hidden="true"
          />
          <span className="font-mono text-[10px] font-semibold text-terracotta uppercase tracking-[0.18em]">
            § APP STORE
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-bold text-ink tracking-tight leading-[1.05] mb-5">
          {isAr ? (
            <>
              كل أدواتك في
              {" "}
              <span className="text-terracotta">مكان واحد.</span>
            </>
          ) : (
            <>
              Every tool you need,
              {" "}
              <span className="text-terracotta">one place.</span>
            </>
          )}
        </h1>
        <p className="prose-body text-ink/75 max-w-2xl mx-auto">
          {isAr
            ? "نُمُو متصل مباشرة بكل حاجة تاجر مصري محتاجها — دفع، شحن، واتساب، تسويق، محاسبة، وتحليلات. بدون أكواد، بدون رسوم إضافية."
            : "numu ships with direct integrations to every platform an Egyptian merchant needs — payments, shipping, WhatsApp, marketing, accounting, analytics. No code, no extra fees."}
        </p>

        {/* One count, and it is the only one that means anything: how many
            integrations a merchant can switch on right now. */}
        <div className="mt-7 inline-flex items-center gap-3 px-5 py-2.5 bg-paper border border-ink/10 rounded-[4px]">
          <span className="font-display text-lg font-bold text-sage tabular-nums">
            {liveCount}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] font-semibold text-sage">
            {isAr ? "تكامل شغّال دلوقتي" : "integrations live today"}
          </span>
        </div>
      </div>

      <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 pb-16 sm:pb-24">
        {CATEGORY_ORDER.map((cat) => {
          const catApps = PARTNERS.filter((a) => a.category === cat);
          if (!catApps.length) return null;
          return (
            <section key={cat} className="mb-12 last:mb-0">
              <div className="flex items-center gap-3 mb-6">
                <span
                  aria-hidden="true"
                  className={`grid size-9 shrink-0 place-items-center rounded-[8px] text-cream ${CATEGORY_ACCENT[cat]}`}
                >
                  {React.createElement(CATEGORY_ICON[cat], { size: 18, strokeWidth: 1.9 })}
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                  {isAr ? CATEGORY_LABEL[cat].ar : CATEGORY_LABEL[cat].en}
                </h2>
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft/55">
                  {catApps.length}{" "}
                  {isAr
                    ? catApps.length === 1
                      ? "تكامل"
                      : "تكاملات"
                    : catApps.length === 1
                      ? "integration"
                      : "integrations"}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {catApps.map((app: Partner) => (
                  <article
                    key={app.name}
                    className="flex flex-col p-5 sm:p-6 bg-paper border border-ink/10 rounded-[10px] shadow-card hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 ease-numu"
                  >
                    <div className="flex items-start justify-between mb-4 gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <PartnerLogo partner={app} size={30} />
                        <h3 className="font-display text-base sm:text-lg font-semibold text-ink tracking-tight leading-tight">
                          {isAr ? (app.nameAr ?? app.name) : app.name}
                        </h3>
                      </div>
                      {/* Every integration on this page is live, so the badge
                          states that rather than encoding a roadmap tier. */}
                      <span className="shrink-0 inline-flex items-center gap-1.5 px-2 py-0.5 bg-sage/10 border border-sage/30 rounded-[4px] font-mono text-[10px] uppercase tracking-[0.14em] font-semibold text-sage">
                        <span aria-hidden="true" className="size-1 rounded-full bg-sage animate-pulse" />
                        {isAr ? "نشط" : "Live"}
                      </span>
                    </div>
                    <p className="prose-body-sm text-ink/75">
                      {isAr ? app.desc.ar : app.desc.en}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          );
        })}

        {/* Bottom CTA — pushes to developers page for custom integrations */}
        <div className="mt-16 bg-navy rounded-[14px] p-8 sm:p-10 text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-saffron font-semibold">
            § BUILDING SOMETHING CUSTOM?
          </span>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl font-bold text-cream tracking-tight leading-tight mb-3">
            {isAr
              ? "ماشفتش التكامل اللي محتاجه؟"
              : "Can't find the integration you need?"}
          </h2>
          <p className="prose-body text-cream/75 max-w-xl mx-auto mb-6">
            {isAr
              ? "الـ REST API بتاعنا موثّقة بالكامل. ابنِ التكامل اللي يناسبك، أو كلمنا نبنيه معاك."
              : "Our REST API is fully documented. Build the integration you need, or talk to us and we'll build it with you."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/developers"
              className="group inline-flex items-center justify-center gap-2 bg-cream text-navy font-semibold py-3 px-6 rounded-[4px] hover:bg-cream/90 active:scale-[0.985] transition-all duration-200 ease-numu"
            >
              <span>{isAr ? "وثائق المطورين" : "Developer docs"}</span>
              <span
                aria-hidden="true"
                className="text-lg text-terracotta group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform rtl:rotate-180"
              >
                →
              </span>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 border border-cream/30 text-cream font-semibold py-3 px-6 rounded-[4px] hover:bg-cream/10 transition-all duration-200 ease-numu"
            >
              {isAr ? "تواصل معانا" : "Talk to us"}
            </Link>
          </div>
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

export default Apps;
