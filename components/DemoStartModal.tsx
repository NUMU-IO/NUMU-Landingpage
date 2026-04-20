import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useLanguage } from "../contexts/LanguageContext";

const API_URL = import.meta.env.VITE_API_URL || "";
const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL || "https://merchant.numueg.app";
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";

interface DemoStartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DemoStartModal: React.FC<DemoStartModalProps> = ({ isOpen, onClose }) => {
  const { t, language, dir } = useLanguage();
  const [email, setEmail] = useState("");
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
          email,
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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
      dir={dir}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md rounded-3xl bg-[#0a0e1a] border border-white/10 shadow-2xl p-8 animate-fade-in-up"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 end-4 text-white/40 hover:text-white transition-colors"
          aria-label="Close"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
            <span className="material-symbols-outlined text-primary text-3xl">
              {magicLinkSent ? "mark_email_read" : "storefront"}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white font-display">
            {magicLinkSent
              ? isAr ? "بَعَتنا لك لينك" : "Check your inbox"
              : t("demo.modal.title")}
          </h2>
          <p className="text-sm text-white/50 mt-2">
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
            className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-xl transition-colors text-sm"
          >
            {isAr ? "تمام" : "Got it"}
          </button>
        ) : (
          <>
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("demo.modal.email_placeholder")}
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all text-sm"
                  dir="ltr"
                />
              </div>

              {/* Turnstile widget */}
              {TURNSTILE_SITE_KEY && (
                <div ref={turnstileRef} className="flex justify-center" />
              )}

              {/* Error message */}
              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading || (!!TURNSTILE_SITE_KEY && !turnstileToken)}
                className="w-full bg-brand-gradient text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
              >
                {loading ? (
                  <>
                    <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>{t("demo.modal.loading")}</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">rocket_launch</span>
                    <span>{t("demo.modal.submit")}</span>
                  </>
                )}
              </button>
            </form>

            {/* OR divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#0a0e1a] px-3 text-white/40">
                  {isAr ? "أو" : "or"}
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

            <p className="text-center text-xs text-white/40 mt-4">
              {isAr
                ? "بالدخول بجوجل بتحصل على تجربة ٣٠ يوم مباشرة"
                : "Google sign-up gets you a 30-day trial instantly"}
            </p>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default DemoStartModal;
