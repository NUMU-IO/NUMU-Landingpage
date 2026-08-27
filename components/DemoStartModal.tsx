import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
// See components/GoogleAuthScope.tsx — GIS loads with the modal, not the page.
import { GoogleSignInButton as GoogleLogin } from "./GoogleSignInButton";
import { useLanguage } from "../contexts/LanguageContext";
import { toArabicDigits, useTrialMeta } from "../lib/trialInfo";

const API_URL = import.meta.env.VITE_API_URL || "";
const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL || "https://merchant.numueg.app";
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";

interface DemoStartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DemoStartModal: React.FC<DemoStartModalProps> = ({ isOpen, onClose }) => {
  const { t, language, dir } = useLanguage();
  const { days: trialDays } = useTrialMeta();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const isAr = language === "ar";

  // Render Turnstile widget when modal opens
  useEffect(() => {
    if (!isOpen || !TURNSTILE_SITE_KEY || !turnstileRef.current) return;
    // @ts-ignore — Cloudflare Turnstile global
    if (typeof window.turnstile === "undefined") return;

    // @ts-ignore
    const widgetId = window.turnstile.render(turnstileRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      callback: (token: string) => setTurnstileToken(token),
      "expired-callback": () => setTurnstileToken(null),
      theme: "dark",
      language: language === "ar" ? "ar" : "en",
    });

    return () => {
      // @ts-ignore
      if (typeof window.turnstile !== "undefined") window.turnstile.remove(widgetId);
    };
  }, [isOpen, language]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/public/demo/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: name.trim(),
          email,
          whatsapp: whatsapp.trim() || null,
          language,
          turnstile_token: turnstileToken,
        }),
      });

      if (res.status === 422) {
        const body = await res.json();
        const detail = body.detail || "";
        if (detail.includes("real email")) setError(t("demo.modal.error.disposable"));
        else if (detail.includes("Bot")) setError(t("demo.modal.error.turnstile"));
        else setError(detail || t("demo.modal.error.generic"));
        setLoading(false);
        return;
      }

      if (res.status === 429) {
        setError(t("demo.modal.error.rate_limit"));
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError(t("demo.modal.error.generic"));
        setLoading(false);
        return;
      }

      const body = await res.json();
      const data = body.data;

      // Existing account — backend sent a magic login link instead of
      // provisioning a new demo. Show a "check your email" confirmation.
      if (data?.status === "magic_link_sent") {
        setMagicLinkSent(true);
        setLoading(false);
        return;
      }

      // Redirect to the merchant hub's /token-handoff page with tokens
      // as URL params. That page calls POST /auth/token-handoff to set
      // httpOnly cookies on the hub's own origin, then redirects to /.
      if (data?.access_token) {
        const handoffUrl = new URL("/token-handoff", DASHBOARD_URL);
        handoffUrl.searchParams.set("access_token", data.access_token);
        handoffUrl.searchParams.set("refresh_token", data.refresh_token);
        handoffUrl.searchParams.set("redirect", "/?welcome=demo");
        window.location.href = handoffUrl.toString();
      }
    } catch {
      setError(t("demo.modal.error.generic"));
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-ink/80 backdrop-blur-md p-4"
      dir={dir}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md rounded-[14px] bg-navy-900 border border-cream/10 shadow-modal-panel p-8 animate-modal-panel"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 end-4 size-8 rounded-[4px] flex items-center justify-center text-cream/55 hover:text-terracotta hover:bg-cream/5 transition-colors"
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-saffron/15 border border-saffron/40 rounded-[4px] px-3 py-1 mb-4">
            <span className="size-1.5 rounded-full bg-saffron animate-pulse" aria-hidden="true" />
            <span className="font-mono text-[10px] font-semibold text-saffron uppercase tracking-[0.18em]">
              {magicLinkSent
                ? isAr
                  ? "لينك مبعوت"
                  : "LINK SENT"
                : isAr
                  ? `تجربة ${toArabicDigits(String(trialDays))} يوم`
                  : `${trialDays}-DAY TRIAL`}
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-[28px] font-bold text-cream tracking-tight">
            {magicLinkSent
              ? isAr ? "بَعَتنا لك لينك" : "Check your inbox"
              : t("demo.modal.title")}
          </h2>
          <p className="prose-body-sm text-cream/70 mt-2">
            {magicLinkSent
              ? isAr
                ? `بَعَتنا لينك دخول على ${email} \u2014 اضغط عليه وهتلاقي نفسك جوا لوحة التحكم.`
                : `We sent a login link to ${email}. Click it to get back into your account.`
              : t("demo.modal.subtitle")}
          </p>
        </div>

        {magicLinkSent ? (
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-cream/10 hover:bg-cream/15 text-cream font-semibold py-3 px-6 rounded-[4px] transition-colors text-sm"
          >
            {isAr ? "تمام" : "Got it"}
          </button>
        ) : (
          <>
            {/* Form — name + email both required so every demo lead is
                attributable to a person, not just an inbox. */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  required
                  minLength={2}
                  maxLength={120}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isAr ? "اسمك بالكامل" : "Your full name"}
                  disabled={loading}
                  className="w-full h-12 px-4 rounded-[4px] bg-cream/5 border border-cream/15 text-cream placeholder-cream/40 focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all text-sm"
                />
              </div>
              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("demo.modal.email_placeholder")}
                  disabled={loading}
                  className="w-full h-12 px-4 rounded-[4px] bg-cream/5 border border-cream/15 text-cream placeholder-cream/40 focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all text-sm"
                  dir="ltr"
                />
              </div>
              {/* WhatsApp — optional on purpose: it's the lead channel
                  that converts in Egypt, but forcing it costs signups. */}
              <div>
                <input
                  type="tel"
                  inputMode="tel"
                  maxLength={20}
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder={
                    isAr ? "رقم الواتساب (اختياري)" : "WhatsApp number (optional)"
                  }
                  disabled={loading}
                  className="w-full h-12 px-4 rounded-[4px] bg-cream/5 border border-cream/15 text-cream placeholder-cream/40 focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all text-sm"
                  dir="ltr"
                />
              </div>

              {/* Turnstile widget */}
              {TURNSTILE_SITE_KEY && (
                <div ref={turnstileRef} className="flex justify-center" />
              )}

              {/* Error message */}
              {error && (
                <p className="font-mono text-[11px] text-terracotta bg-terracotta/10 border border-terracotta/30 rounded-[4px] px-3 py-2">{error}</p>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading || (!!TURNSTILE_SITE_KEY && !turnstileToken)}
                className="group w-full bg-saffron text-ink font-semibold h-12 px-6 rounded-[4px] hover:bg-saffron/90 active:scale-[0.985] transition-all duration-200 ease-numu disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-sm"
              >
                {loading ? (
                  <>
                    <span className="size-4 rounded-full border-2 border-ink/30 border-t-ink animate-spin" />
                    <span>{t("demo.modal.loading")}</span>
                  </>
                ) : (
                  <>
                    <span>{t("demo.modal.submit")}</span>
                    <span aria-hidden="true" className="text-lg text-terracotta rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform">→</span>
                  </>
                )}
              </button>
            </form>

            {/* OR divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-cream/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-navy-900 px-3 font-mono text-[10px] uppercase tracking-[0.18em] text-cream/50">
                  {isAr ? "أو" : "OR"}
                </span>
              </div>
            </div>

            {/* Google OAuth \u2014 goes straight to 30-day trial (skips 7-day demo) */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  if (!credentialResponse.credential) return;
                  setLoading(true);
                  setError("");
                  try {
                    const res = await fetch(`${API_URL}/auth/google`, {
                      method: "POST",
                      credentials: "include",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        id_token: credentialResponse.credential,
                      }),
                    });
                    if (!res.ok) {
                      const errBody = await res.json().catch(() => null);
                      throw new Error(
                        errBody?.detail ||
                          errBody?.error?.message ||
                          (isAr ? "فشل تسجيل الدخول بجوجل" : "Google login failed")
                      );
                    }
                    window.location.href = DASHBOARD_URL;
                  } catch (err: any) {
                    setError(
                      err.message ||
                        (isAr ? "فشل تسجيل الدخول بجوجل" : "Google login failed")
                    );
                    setLoading(false);
                  }
                }}
                onError={() =>
                  setError(
                    isAr ? "فشل تسجيل الدخول بجوجل" : "Google sign-in failed"
                  )
                }
                size="large"
                width="100%"
                text="signup_with"
                shape="pill"
                theme="filled_black"
              />
            </div>

            <p className="text-center font-mono text-[10px] uppercase tracking-[0.18em] text-cream/50 mt-4">
              {isAr
                ? `بالدخول بجوجل بتحصل على تجربة ${toArabicDigits(String(trialDays))} يوم مباشرة`
                : `Google sign-up gets you a ${trialDays}-day trial instantly`}
            </p>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default DemoStartModal;
