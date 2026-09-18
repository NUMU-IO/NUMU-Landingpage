import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useSEO } from "../hooks/useSEO";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CookieConsent from "../components/CookieConsent";

/**
 * Developer landing — stub docs page positioning numu as a serious SaaS
 * with API depth. Audit §2.5: shipping /developers as a signal that the
 * platform is extensible matters for technical buyers even before we
 * have full public docs. Content here is intentionally aspirational but
 * grounded in shipping endpoints (Trust Network, pricing, contact).
 */

interface Endpoint {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  purpose_en: string;
  purpose_ar: string;
}

const endpoints: Endpoint[] = [
  {
    method: "POST",
    path: "/api/v1/public/waitlist",
    purpose_en: "Submit email to the Founder's 100 waitlist.",
    purpose_ar: "تسجيل الإيميل في قائمة أول ١٠٠ تاجر.",
  },
  {
    method: "POST",
    path: "/api/v1/public/contact",
    purpose_en: "Submit a contact or callback request.",
    purpose_ar: "طلب تواصل أو مكالمة.",
  },
  {
    method: "GET",
    path: "/api/v1/public/pricing-plans",
    purpose_en: "List active pricing plans with features and promos.",
    purpose_ar: "عرض الباقات والمميزات والعروض النشطة.",
  },
  {
    method: "POST",
    path: "/api/v1/auth/register",
    purpose_en: "Create a merchant account — returns an access token.",
    purpose_ar: "إنشاء حساب تاجر — يرجع access token.",
  },
  {
    method: "POST",
    path: "/api/v1/stores/{store_id}/access-tokens",
    purpose_en: "Mint a scoped API token. The secret is shown once.",
    purpose_ar: "إنشاء توكن API بصلاحيات محددة. السر بيظهر مرة واحدة بس.",
  },
  {
    method: "GET",
    path: "/api/v1/stores/{store_id}/orders/",
    purpose_en: "List orders with filters, pagination, and status facets.",
    purpose_ar: "عرض الأوردرات مع فلاتر، تصفح، وتجميع حسب الحالة.",
  },
  {
    method: "POST",
    path: "/api/v1/stores/{store_id}/shipments/waybills",
    purpose_en: "Generate a courier waybill for an order. No form-filling.",
    purpose_ar: "إنشاء بوليصة شحن لأوردر — بدون ملء فورم.",
  },
  {
    method: "GET",
    path: "/api/v1/stores/{store_id}/invoices/by-order/{order_id}",
    purpose_en: "Fetch the ETA-compliant e-invoice for an order.",
    purpose_ar: "جيب الفاتورة الإلكترونية المعتمدة من ETA لأوردر.",
  },
  {
    method: "POST",
    path: "/api/v1/stores/{store_id}/webhooks",
    purpose_en: "Subscribe an endpoint to order and product events.",
    purpose_ar: "اشترك بـ endpoint في أحداث الأوردرات والمنتجات.",
  },
];

const methodColor: Record<Endpoint["method"], { bg: string; text: string }> = {
  GET: { bg: "bg-sage/10 border border-sage/30", text: "text-sage" },
  POST: { bg: "bg-navy/10 border border-navy/30", text: "text-navy" },
  PUT: { bg: "bg-saffron/10 border border-saffron/30", text: "text-saffron" },
  DELETE: {
    bg: "bg-terracotta/10 border border-terracotta/30",
    text: "text-terracotta",
  },
};

const Developers: React.FC = () => {
  const { dir, language } = useLanguage();
  const isAr = language === "ar";

  useSEO({
    title: isAr
      ? "وثائق المطورين — نُمُو API"
      : "Developer docs — numu API",
    description: isAr
      ? "REST API موثّقة بالكامل لبناء تكاملات مخصصة مع نُمُو: أوردرات، Trust Network، بوالص بوسطة، فواتير ETA، وأكتر."
      : "Fully documented REST API for building custom integrations with numu: orders, Trust Network, Bosta waybills, ETA invoices, and more.",
    canonical: "https://numueg.app/developers",
  });

  return (
    <div className="relative min-h-screen bg-cream font-display" dir={dir}>
      <Navbar />

      <main id="main" className="bg-cream numu-dot-surface pt-24 sm:pt-28">

      <div className="relative z-10 text-center px-4 sm:px-6 pt-12 sm:pt-16 pb-10">
        <div className="inline-flex items-center gap-2 bg-navy/10 border border-navy/30 rounded-[4px] px-3 py-1 mb-5">
          <span className="size-1.5 rounded-full bg-navy" aria-hidden="true" />
          <span className="font-mono text-[10px] font-semibold text-navy uppercase tracking-[0.18em]">
            § DEVELOPERS · REST · JSON
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-bold text-ink tracking-tight leading-[1.05] mb-5">
          {isAr ? (
            <>
              ابنِ على
              {" "}
              <span className="text-terracotta">نُمُو.</span>
            </>
          ) : (
            <>
              Build on{" "}
              <span className="text-terracotta">numu.</span>
            </>
          )}
        </h1>
        <p className="prose-body text-ink/75 max-w-2xl mx-auto">
          {isAr
            ? "متجرك متاح كـ REST API: المنتجات، الأوردرات، الشحن، الفواتير والعملاء. اعمل توكن بصلاحيات محددة، اشترك في الأحداث، وابني أدواتك."
            : "Your store, as a REST API: products, orders, shipping, invoices and customers. Mint a scoped token, subscribe to events, build your own tools."}
        </p>
      </div>

      <div className="relative z-10 max-w-[1100px] mx-auto px-4 sm:px-6 pb-8">
        {/* Four feature pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            {
              eyebrow: "REST",
              title_en: "REST + JSON",
              title_ar: "REST + JSON",
              body_en:
                "Predictable resource URLs, standard HTTP verbs, JSON everywhere.",
              body_ar:
                "URLs متوقّعة، HTTP verbs معيارية، JSON في كل مكان.",
              accent: "bg-navy",
            },
            {
              eyebrow: "WEBHOOKS",
              title_en: "Webhooks",
              title_ar: "Webhooks",
              body_en:
                "Signed, retried deliveries for order, payment and product events. Test and rotate from the API.",
              body_ar:
                "رسائل موقّعة وبتتعاد لو فشلت، لأحداث الأوردرات والدفع والمنتجات. تقدر تجربها وتغيّر السر من الـ API.",
              accent: "bg-terracotta",
            },
            {
              eyebrow: "TOKENS",
              title_en: "Scoped API tokens",
              title_ar: "توكنات بصلاحيات محددة",
              body_en:
                "Mint a token per integration, scoped per domain and pinned to one store. Revoke it any time.",
              body_ar:
                "اعمل توكن لكل تكامل، بصلاحيات محددة ومربوط بمتجر واحد. وتقدر توقفه في أي وقت.",
              accent: "bg-saffron",
            },
            {
              eyebrow: "REFERENCE",
              title_en: "Live API reference",
              title_ar: "مرجع الـ API مباشر",
              body_en:
                "An OpenAPI document generated from the running API — point your client generator at it.",
              body_ar:
                "ملف OpenAPI بيتولد من الـ API نفسه — وصّل عليه مولّد الكلاينت بتاعك.",
              accent: "bg-sage",
            },
          ].map((pillar) => (
            <article
              key={pillar.eyebrow}
              className="relative bg-paper border border-ink/10 rounded-[10px] shadow-card p-5 sm:p-6 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 ease-numu"
            >
              <span
                aria-hidden="true"
                className={`absolute top-0 start-0 w-10 h-[3px] ${pillar.accent}`}
              />
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft/60 font-semibold mb-2">
                § {pillar.eyebrow}
              </p>
              <h2 className="font-display text-base sm:text-lg font-semibold text-ink tracking-tight mb-2">
                {isAr ? pillar.title_ar : pillar.title_en}
              </h2>
              <p className="prose-body-sm text-ink/75">
                {isAr ? pillar.body_ar : pillar.body_en}
              </p>
            </article>
          ))}
        </div>

        {/* Code sample — terminal-style, navy bg */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-10 h-[3px] bg-navy" aria-hidden="true" />
            <h2 className="font-display text-xl sm:text-2xl font-bold text-ink tracking-tight">
              {isAr ? "مثال سريع" : "Quick example"}
            </h2>
          </div>
          <pre
            className="bg-navy rounded-[10px] p-5 sm:p-6 overflow-x-auto font-mono text-[12px] sm:text-[13px] text-cream/90 leading-relaxed"
            dir="ltr"
          >
{`# Send every paid order to your own system.
# NUMU_TOKEN is a scoped token you minted in the dashboard.

curl -X POST \\
  https://numueg.app/api/v1/stores/$STORE_ID/webhooks \\
  -H "Authorization: Bearer $NUMU_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://erp.example.com/hooks/numu",
    "events": ["order.paid", "order.status_changed"],
    "description": "ERP sync"
  }'

# =>
# {
#   "id": "8f2b...",
#   "events": ["order.paid", "order.status_changed"],
#   "is_active": true,
#   "secret": "shown once — sign every delivery with it"
# }

# Each delivery carries:
#   X-NUMU-Event:        order.paid
#   X-NUMU-Delivery:     <id, stable across retries>
#   X-NUMU-Signature-V1: t=<unix>,v1=<hmac sha256 of "t.body">`}
          </pre>
        </div>

        {/* Endpoints table */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-10 h-[3px] bg-terracotta" aria-hidden="true" />
            <h2 className="font-display text-xl sm:text-2xl font-bold text-ink tracking-tight">
              {isAr ? "نظرة على الـ endpoints" : "Endpoints at a glance"}
            </h2>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft/55">
              v1
            </span>
          </div>
          <div className="bg-paper border border-ink/10 rounded-[10px] shadow-card overflow-hidden">
            {endpoints.map((ep, i) => {
              const mc = methodColor[ep.method];
              return (
                <div
                  key={ep.path}
                  className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 sm:p-5 ${
                    i < endpoints.length - 1 ? "border-b border-bone" : ""
                  } hover:bg-navy/[0.02] transition-colors`}
                >
                  <span
                    className={`shrink-0 inline-flex items-center justify-center w-16 px-2 py-0.5 ${mc.bg} rounded-[4px] font-mono text-[10px] uppercase tracking-[0.14em] font-semibold ${mc.text}`}
                  >
                    {ep.method}
                  </span>
                  <code
                    className="font-mono text-[12px] sm:text-[13px] text-ink font-semibold truncate"
                    dir="ltr"
                  >
                    {ep.path}
                  </code>
                  <span className="sm:ms-auto text-[13px] text-ink-soft/75 sm:text-end">
                    {isAr ? ep.purpose_ar : ep.purpose_en}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft/55">
            {isAr ? "المرجع الكامل: " : "Full reference: "}
            <a
              href="https://numueg.app/api/v1/public/docs"
              className="text-navy underline underline-offset-2 hover:text-terracotta transition-colors"
            >
              /api/v1/public/docs
            </a>
          </p>
        </div>

        {/* CTA row */}
        <div className="bg-navy rounded-[14px] p-8 sm:p-10 text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-saffron font-semibold">
            § EARLY ACCESS
          </span>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl font-bold text-cream tracking-tight leading-tight mb-3">
            {isAr
              ? "الـ API في Beta خاص"
              : "API is in private beta"}
          </h2>
          <p className="prose-body text-cream/75 max-w-xl mx-auto mb-6">
            {isAr
              ? "بنضم مطورين مؤسسين يساعدونا نصيغ الـ API. عايز تدخل الباتش الأول؟"
              : "We're onboarding founding developers to help shape the API. Want in on the first wave?"}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/contact"
              className="group inline-flex items-center justify-center gap-2 bg-cream text-navy font-semibold py-3 px-6 rounded-[4px] hover:bg-cream/90 active:scale-[0.985] transition-all duration-200 ease-numu"
            >
              <span>{isAr ? "اطلب الوصول" : "Request access"}</span>
              <span
                aria-hidden="true"
                className="text-lg text-terracotta group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform rtl:rotate-180"
              >
                →
              </span>
            </Link>
            <Link
              to="/apps"
              className="inline-flex items-center justify-center gap-2 border border-cream/30 text-cream font-semibold py-3 px-6 rounded-[4px] hover:bg-cream/10 transition-all duration-200 ease-numu"
            >
              {isAr ? "تصفّح الـ App Store" : "Browse the App Store"}
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

export default Developers;
