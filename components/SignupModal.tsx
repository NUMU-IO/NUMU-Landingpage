import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
// Provider-carrying wrapper: Google Identity Services is fetched when this
// modal opens, not on every page load. See components/GoogleAuthScope.tsx.
import { GoogleSignInButton as GoogleLogin } from "./GoogleSignInButton";
import { useLanguage } from "../contexts/LanguageContext";
import { useSignupModal } from "../contexts/SignupModalContext";
import { register } from "../services/authApi";
import { getAttribution } from "../lib/attribution";
import { phoneError, toE164Eg } from "../lib/phone";
import { identifySignup, track, trackAndLeave } from "../lib/analytics";

const API_URL = import.meta.env.VITE_API_URL || "https://numueg.app/api/v1";
const DASHBOARD_URL =
  import.meta.env.VITE_DASHBOARD_URL || "https://merchant.numueg.app";

/**
 * Signup modal — direct, no-beta-gate account creation. This is the landing's
 * primary CTA target, the same registration the invite email drops merchants
 * into: Google one-click, or full name + email + password. On success we hand
 * off to the merchant hub exactly like the demo flow does (cookies are set on
 * the shared .numueg.app parent domain).
 *
 * Deliberately distinct from <DemoStartModal/> — that one spins up a throwaway
 * 7-day demo tenant; this one creates the merchant's real account.
 */
const SignupModal: React.FC = () => {
  const { language, dir } = useLanguage();
  const isAr = language === "ar";
  const { isOpen, close, planIntent } = useSignupModal();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  // Required. Without it we have no way to reach a merchant who stalls
  // mid-setup, and wallet warnings stay email-only.
  const [phone, setPhone] = useState("");
  // Default on: most merchants read WhatsApp on the number they just
  // typed, so this is one tick rather than a second field for everyone.
  const [waSame, setWaSame] = useState(true);
  const [waPhone, setWaPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const modalRef = useRef<HTMLDivElement>(null);

  // The top of the funnel. Every drop-off number below this is measured
  // against how many people opened the form, not how many saw the page.
  useEffect(() => {
    if (!isOpen) return;
    track("signup_modal_opened", { plan_intent: planIntent ?? null });
  }, [isOpen, planIntent]);

  // Lock scroll + Escape to close while open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) close();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Split the full name into first/last — the register endpoint wants both,
    // each ≥2 chars (mirrors the merchant-hub register schema).
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" ");
    if (firstName.length < 2 || lastName.length < 2) {
      setError(isAr ? "اكتب اسمك بالكامل (الاسم الأول واسم العائلة)." : "Please enter your full name (first and last).");
      return;
    }
    const e164 = toE164Eg(phone);
    if (!e164) {
      setError(phoneError(isAr));
      return;
    }
    // Only validated when they actually said the numbers differ; an
    // untouched field behind an unticked box is not an error.
    const waE164 = waSame ? null : toE164Eg(waPhone);
    if (!waSame && !waE164) {
      setError(phoneError(isAr));
      return;
    }
    if (password.length < 12) {
      setError(isAr ? "كلمة المرور لازم تكون ١٢ حرف على الأقل." : "Password must be at least 12 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await register({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        phone: e164,
        whatsapp_same_as_phone: waSame,
        whatsapp_phone: waE164 ?? undefined,
        // The page's locale decides which language every merchant-facing
        // message renders in from here on.
        language: isAr ? "ar" : "en",
        // Which pricing card brought them here. "payg" auto-activates
        // Pay as you Grow when their store is created — no billing page
        // detour; paid intents are recorded for attribution.
        plan_intent: planIntent ?? undefined,
        // UTMs + referrer captured on arrival, first touch within the tab.
        attribution: getAttribution(),
      });

      // Identify before the redirect below ends this page's life. Only the
      // account id and coarse context — the email and phone are in our own
      // database and have no business in a third-party analytics tool.
      if (res.user?.id) {
        identifySignup(res.user.id, {
          plan_intent: planIntent ?? null,
          language: isAr ? "ar" : "en",
          whatsapp_same_as_phone: waSame,
        });
      }
      // The next statement navigates to the hub, which would abandon a
      // normal in-flight capture. sendBeacon survives the unload.
      trackAndLeave("signup_submitted", { plan_intent: planIntent ?? null });

      // Hand the freshly-created account off to the merchant hub via the
      // same /token-handoff bridge the demo flow uses, rather than calling
      // authenticated endpoints (e.g. verify-email-code) from the landing
      // origin — those fail cross-origin. The hub then runs the canonical
      // email-verification + onboarding flow, exactly what an invite-email
      // signup lands in.
      if (res.tokens?.access_token) {
        const handoff = new URL("/token-handoff", DASHBOARD_URL);
        handoff.searchParams.set("access_token", res.tokens.access_token);
        handoff.searchParams.set("refresh_token", res.tokens.refresh_token);
        // Verify email first (required), on the merchant hub where the
        // verify flow reliably works. After verifying, the hub routes the
        // new merchant on to create-store → onboarding.
        handoff.searchParams.set("redirect", "/verify-email");
        window.location.href = handoff.toString();
        return;
      }
      // Fallback: cookies were set on the shared parent domain, so a plain
      // redirect to the hub still carries the session.
      window.location.href = DASHBOARD_URL;
    } catch (err: any) {
      // A failed signup is the most useful event on this page — it is the
      // difference between "nobody wants this" and "the form is broken".
      // `reason` is our own server's message, never anything typed here.
      track("signup_failed", {
        reason: String(err?.message ?? "unknown").slice(0, 120),
        plan_intent: planIntent ?? null,
      });
      setError(
        err?.message ||
          (isAr ? "حصل مشكلة، حاول تاني." : "Something went wrong, try again."),
      );
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
          onClick={close}
          className="absolute top-4 end-4 size-8 rounded-[4px] flex items-center justify-center text-cream/55 hover:text-terracotta hover:bg-cream/5 transition-colors"
          aria-label={isAr ? "إغلاق" : "Close"}
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
              {isAr ? "تسجيل مجاني" : "FREE SIGN-UP"}
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-[28px] font-bold text-cream tracking-tight">
            {isAr ? "أنشئ متجرك دلوقتي" : "Create your store now"}
          </h2>
          <p className="prose-body-sm text-cream/70 mt-2">
            {isAr
              ? "سجّل في أقل من دقيقة وابدأ بيع — مجانًا وبدون فيزا."
              : "Sign up in under a minute and start selling — free, no card."}
          </p>
        </div>

        {/* Google — one-click signup, straight to the dashboard */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              if (!credentialResponse.credential) return;
              track("signup_google_clicked", { plan_intent: planIntent ?? null });
              setLoading(true);
              setError("");
              try {
                const res = await fetch(`${API_URL}/auth/google`, {
                  method: "POST",
                  credentials: "include",
                  headers: { "Content-Type": "application/json" },
                  // Send whatever the form already holds. Google's token
                  // carries no phone number, so this is the only chance to
                  // attach one without making one-click into two steps —
                  // and the API only writes it when the user has none.
                  body: JSON.stringify({
                    id_token: credentialResponse.credential,
                    phone: toE164Eg(phone) || undefined,
                    attribution: getAttribution(),
                  }),
                });
                if (!res.ok) {
                  const errBody = await res.json().catch(() => null);
                  throw new Error(
                    errBody?.detail ||
                      errBody?.error?.message ||
                      (isAr ? "فشل تسجيل الدخول بجوجل" : "Google login failed"),
                  );
                }
                window.location.href = DASHBOARD_URL;
              } catch (err: any) {
                setError(err.message || (isAr ? "فشل تسجيل الدخول بجوجل" : "Google login failed"));
                setLoading(false);
              }
            }}
            onError={() =>
              setError(isAr ? "فشل تسجيل الدخول بجوجل" : "Google sign-in failed")
            }
            size="large"
            width="100%"
            text="signup_with"
            shape="pill"
            theme="filled_black"
          />
        </div>

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

        {/* Email + password form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={isAr ? "الاسم بالكامل" : "Full name"}
            disabled={loading}
            className="w-full h-12 px-4 rounded-[4px] bg-cream/5 border border-cream/15 text-cream placeholder-cream/40 focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all text-sm"
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={isAr ? "بريدك الإلكتروني" : "Your email"}
            disabled={loading}
            className="w-full h-12 px-4 rounded-[4px] bg-cream/5 border border-cream/15 text-cream placeholder-cream/40 focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all text-sm"
            dir="ltr"
          />
          <div>
            <input
              type="tel"
              required
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={isAr ? "رقم الموبايل (واتساب)" : "Mobile number (WhatsApp)"}
              disabled={loading}
              className="w-full h-12 px-4 rounded-[4px] bg-cream/5 border border-cream/15 text-cream placeholder-cream/40 focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all text-sm"
              dir="ltr"
            />
            <p className="mt-1.5 font-mono text-[10px] text-cream/45 leading-relaxed">
              {isAr
                ? "علشان نبعتلك تنبيهات المتجر ونساعدك على واتساب."
                : "So we can send store alerts and help you on WhatsApp."}
            </p>
            <label className="mt-2 flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={waSame}
                onChange={(e) => setWaSame(e.target.checked)}
                disabled={loading}
                className="h-3.5 w-3.5 rounded-[2px] accent-saffron"
              />
              <span className="font-mono text-[10px] text-cream/60">
                {isAr
                  ? "ده نفس رقم الواتساب بتاعي"
                  : "This is also my WhatsApp number"}
              </span>
            </label>
            {!waSame && (
              <input
                type="tel"
                required
                inputMode="tel"
                value={waPhone}
                onChange={(e) => setWaPhone(e.target.value)}
                placeholder={isAr ? "رقم الواتساب" : "WhatsApp number"}
                disabled={loading}
                className="mt-2 w-full h-12 px-4 rounded-[4px] bg-cream/5 border border-cream/15 text-cream placeholder-cream/40 focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all text-sm"
                dir="ltr"
              />
            )}
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isAr ? "كلمة المرور (١٢ حرف على الأقل)" : "Password (min 12 characters)"}
              disabled={loading}
              className="w-full h-12 px-4 pe-11 rounded-[4px] bg-cream/5 border border-cream/15 text-cream placeholder-cream/40 focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all text-sm"
              dir="ltr"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute inset-y-0 end-3 flex items-center text-cream/50 hover:text-cream transition-colors"
              aria-label={showPassword ? (isAr ? "إخفاء" : "Hide") : (isAr ? "إظهار" : "Show")}
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" y1="2" x2="22" y2="22" /></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
              )}
            </button>
          </div>

          {error && (
            <p className="font-mono text-[11px] text-terracotta bg-terracotta/10 border border-terracotta/30 rounded-[4px] px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group w-full bg-saffron text-ink font-semibold h-12 px-6 rounded-[4px] hover:bg-saffron/90 active:scale-[0.985] transition-all duration-200 ease-numu disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-sm"
          >
            {loading ? (
              <>
                <span className="size-4 rounded-full border-2 border-ink/30 border-t-ink animate-spin" />
                <span>{isAr ? "بنعمل حسابك..." : "Creating your account..."}</span>
              </>
            ) : (
              <>
                <span>{isAr ? "أنشئ الحساب" : "Create account"}</span>
                <span aria-hidden="true" className="text-lg text-terracotta rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform">→</span>
              </>
            )}
          </button>
        </form>

        <p className="text-center font-mono text-[10px] uppercase tracking-[0.18em] text-cream/50 mt-5">
          {isAr ? "عندك حساب؟" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              close();
              navigate("/login");
            }}
            className="text-saffron hover:text-cream underline transition-colors"
          >
            {isAr ? "سجّل دخول" : "Log in"}
          </button>
        </p>
      </div>
    </div>,
    document.body,
  );
};

export default SignupModal;
