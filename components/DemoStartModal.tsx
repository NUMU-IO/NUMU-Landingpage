import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "../contexts/LanguageContext";

const API_URL = import.meta.env.VITE_API_URL || "";
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
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

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
      const dashboardUrl = body.data?.dashboard_url;

      // Redirect to the merchant hub — cookies are already set by the API
      if (dashboardUrl) {
        window.location.href = dashboardUrl;
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
            <span className="material-symbols-outlined text-primary text-3xl">storefront</span>
          </div>
          <h2 className="text-xl font-bold text-white font-display">
            {t("demo.modal.title")}
          </h2>
          <p className="text-sm text-white/50 mt-2">
            {t("demo.modal.subtitle")}
          </p>
        </div>

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
      </div>
    </div>,
    document.body,
  );
};

export default DemoStartModal;
