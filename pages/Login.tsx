import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// See components/GoogleAuthScope.tsx — GIS loads with this route, not the app.
import { GoogleSignInButton as GoogleLogin } from "../components/GoogleSignInButton";
import { useLanguage } from "../contexts/LanguageContext";
import { login, forgotPassword } from "../services/authApi";
import { useSEO } from "../hooks/useSEO";

const API_BASE = import.meta.env.VITE_API_URL || "https://numueg.app/api/v1";
const DASHBOARD_URL =
  import.meta.env.VITE_DASHBOARD_URL || "https://merchant.numueg.app";

// Shared field styles — match the brand-kit input treatment used in
// ContactForm and the Waitlist modal: flat 4px radius, cream surface,
// ink/25 hairline, navy focus ring.
const inputClass =
  "h-12 sm:h-14 px-4 rounded-[4px] bg-cream border border-ink/25 text-ink placeholder:text-ink-soft/55 text-sm focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20 transition-all duration-200 ease-numu";

const labelClass =
  "font-mono text-[12px] font-semibold text-navy uppercase tracking-[0.14em]";

const Login: React.FC = () => {
  const { t, language } = useLanguage();
  const isAr = language === "ar";
  useSEO({
    title: isAr ? "تسجيل الدخول — نُمُو" : "Login — numu",
    description: isAr
      ? "سجّل دخولك على حساب التاجر في نُمُو."
      : "Sign in to your numu merchant account.",
    canonical: "https://numueg.app/login",
    noIndex: true,
  });
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);
      if (!result.user?.is_verified) {
        navigate(`/verify-email?email=${encodeURIComponent(email)}`);
      } else {
        window.location.href = DASHBOARD_URL;
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotLoading(true);

    try {
      await forgotPassword(forgotEmail);
      setForgotSent(true);
    } catch (err: any) {
      setForgotError(err.message || "Request failed");
    } finally {
      setForgotLoading(false);
    }
  };

  // Primary submit button — shared between login + forgot flows.
  const SubmitButton: React.FC<{
    busy: boolean;
    label: string;
  }> = ({ busy, label }) => (
    <button
      type="submit"
      disabled={busy}
      className="group mt-2 bg-navy text-cream font-semibold h-12 sm:h-14 rounded-[4px] hover:bg-navy-800 active:scale-[0.985] transition-all duration-200 ease-numu flex items-center justify-center gap-3 w-full disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
    >
      {busy ? (
        <span className="size-5 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
      ) : (
        <>
          <span>{label}</span>
          <span
            aria-hidden="true"
            className="text-lg text-saffron rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform"
          >
            →
          </span>
        </>
      )}
    </button>
  );

  if (showForgot) {
    return (
      <div className="flex flex-col gap-6">
        <div className="text-center lg:text-start">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-terracotta font-semibold">
            § RESET
          </span>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight mb-2">
            {t("auth.forgot_title")}
          </h2>
          <p className="prose-body text-ink/75">
            {t("auth.forgot_subtitle")}
          </p>
        </div>

        {forgotSent ? (
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-sage bg-sage/10 border border-sage/30 rounded-[4px] px-3 py-3 font-semibold">
            <span className="size-1.5 rounded-full bg-sage" aria-hidden="true" />
            {t("auth.forgot_success")}
          </div>
        ) : (
          <>
            {forgotError && (
              <p className="font-mono text-[11px] text-terracotta bg-terracotta/10 border border-terracotta/30 rounded-[4px] px-3 py-2">
                {forgotError}
              </p>
            )}

            <form onSubmit={handleForgotPassword} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="forgot-email" className={labelClass}>
                  {t("auth.email")}
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className={inputClass}
                  placeholder={t("auth.email_placeholder")}
                  dir="ltr"
                />
              </div>
              <SubmitButton busy={forgotLoading} label={t("auth.forgot_send")} />
            </form>
          </>
        )}

        <button
          type="button"
          onClick={() => {
            setShowForgot(false);
            setForgotSent(false);
            setForgotError("");
          }}
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-terracotta hover:text-navy font-semibold transition-colors"
        >
          ← {t("auth.forgot_back")}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center lg:text-start">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-terracotta font-semibold">
          § LOGIN
        </span>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight mb-2">
          {t("auth.login_title")}
        </h2>
        <p className="prose-body text-ink/75">
          {t("auth.login_subtitle")}
        </p>
      </div>

      {error && (
        <p className="font-mono text-[11px] text-terracotta bg-terracotta/10 border border-terracotta/30 rounded-[4px] px-3 py-2">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-email" className={labelClass}>
            {t("auth.email")}
          </label>
          <input
            id="login-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder={t("auth.email_placeholder")}
            dir="ltr"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-password" className={labelClass}>
            {t("auth.password")}
          </label>
          <input
            id="login-password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder="••••••••"
          />
        </div>

        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => {
              setShowForgot(true);
              setForgotEmail(email);
            }}
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-terracotta hover:text-navy font-semibold transition-colors"
          >
            {t("auth.forgot_password")}
          </button>
        </div>

        <SubmitButton busy={loading} label={t("auth.login_button")} />
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-ink/10" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-cream px-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft/60">
            {isAr ? "أو" : "OR"}
          </span>
        </div>
      </div>

      {/* Google Sign-In */}
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            if (!credentialResponse.credential) return;
            setLoading(true);
            setError("");
            try {
              const res = await fetch(`${API_BASE}/auth/google`, {
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
                    "Google login failed",
                );
              }
              window.location.href = DASHBOARD_URL;
            } catch (err: any) {
              setError(err.message || "Google login failed");
            } finally {
              setLoading(false);
            }
          }}
          onError={() =>
            setError(isAr ? "فشل تسجيل الدخول بجوجل" : "Google sign-in failed")
          }
          size="large"
          width="100%"
          text="signin_with"
          shape="pill"
        />
      </div>

      <p className="text-center font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft/65">
        {t("auth.dont_have_account")}{" "}
        <Link
          to="/signup"
          className="text-terracotta hover:text-navy font-semibold transition-colors"
        >
          {t("auth.signup_link")} →
        </Link>
      </p>
    </div>
  );
};

export default Login;
