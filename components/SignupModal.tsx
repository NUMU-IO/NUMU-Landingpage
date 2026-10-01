import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
// Provider-carrying wrapper: Google Identity Services is fetched when this
// modal opens, not on every page load. See components/GoogleAuthScope.tsx.
import { GoogleSignInButton as GoogleLogin } from "./GoogleSignInButton";
import { useLanguage } from "../contexts/LanguageContext";
import { useSignupModal } from "../contexts/SignupModalContext";
import {
  AuthError,
  EMAIL_SHAPE,
  authErrorMessage,
  fieldErrorMessage,
  googleLogin,
  register,
  type AuthField,
} from "../services/authApi";
import { getAttribution } from "../lib/attribution";
import { toE164 } from "../lib/phone";
import { identifySignup, track, trackAndLeave } from "../lib/analytics";
import { toArabicDigits, useTrialMeta } from "../lib/trialInfo";
import { clearPrefill, readPrefill } from "../lib/onboardingPrefill";

const DASHBOARD_URL =
  import.meta.env.VITE_DASHBOARD_URL || "https://merchant.numueg.app";

/**
 * Signup modal — direct, no-beta-gate account creation. This is the landing's
 * primary CTA target, the same registration the invite email drops merchants
 * into: Google one-click, or full name + email + password. On success we hand
 * off to the merchant hub through `/token-handoff` (cookies are set on the
 * shared .numueg.app parent domain).
 *
 * This is the only door. The 7-day demo-tenant modal was retired on
 * 2026-09-25: every "start" action on the site opens this modal, and the
 * account it creates carries the trial (`useTrialMeta`, 37 days today).
 */
/**
 * "37-day trial · no card", with the day count from the admin-controlled
 * pricing config. A child component rather than a hook in the modal itself:
 * the modal is mounted on every page and this only renders while it is open,
 * so the pricing-plans fetch never runs on a plain page view.
 */
const TrialBadge: React.FC<{ isAr: boolean }> = ({ isAr }) => {
  const { days } = useTrialMeta();
  return (
    <span className="font-mono text-[10px] font-semibold text-saffron uppercase tracking-[0.18em]">
      {isAr
        ? `تجربة ${toArabicDigits(String(days))} يوم · من غير بطاقة`
        : `${days}-DAY TRIAL · NO CARD`}
    </span>
  );
};

/** The API's whole policy: a length, plus a breached-password check that
 *  only the server can run (it answers PASSWORD_BREACHED). */
const PASSWORD_RULES: { ok: (p: string) => boolean; ar: string; en: string }[] = [
  { ok: (p) => p.length >= 8, ar: "٨ حروف على الأقل، وأي حروف أو أرقام", en: "8+ characters, any letters or numbers" },
];

const LABEL = "block mb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-cream/60";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';

const SignupModal: React.FC = () => {
  const { language, dir } = useLanguage();
  const isAr = language === "ar";
  const { isOpen, close, planIntent, referralCode } = useSignupModal();

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
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<AuthField, string>>>({});
  // The typed email already has an account: offer the way back in instead
  // of a dead end.
  const [emailTaken, setEmailTaken] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  // The top of the funnel. Every drop-off number below this is measured
  // against how many people opened the form, not how many saw the page.
  useEffect(() => {
    if (!isOpen) return;
    track("signup_modal_opened", { plan_intent: planIntent ?? null });
  }, [isOpen, planIntent]);

  // Lock scroll, move focus into the dialog, keep Tab inside it, Escape closes.
  // The dialog itself takes focus, not the first input, so a phone keyboard
  // doesn't cover the form the moment it opens.
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modalRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key !== "Tab" || !modalRef.current) return;
      const items = modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === modalRef.current)) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first?.focus();
      } else if (!modalRef.current.contains(active)) {
        e.preventDefault();
        first?.focus();
      }
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

  // Errors sit under the field they belong to; focus goes to the first one
  // once the inputs are enabled again.
  useEffect(() => {
    if (loading) return;
    const first = (["name", "email", "phone", "password"] as const).find((f) => fieldErrors[f]);
    if (first) document.getElementById(`signup-${first}`)?.focus();
  }, [fieldErrors, loading]);

  const fieldProps = (field: AuthField, hint?: string) => ({
    id: `signup-${field}`,
    "aria-invalid": fieldErrors[field] ? true : undefined,
    "aria-describedby":
      [fieldErrors[field] ? `signup-${field}-error` : "", hint ?? ""].filter(Boolean).join(" ") ||
      undefined,
  });

  const fieldError = (field: AuthField) =>
    fieldErrors[field] ? (
      <p id={`signup-${field}-error`} className="mt-1.5 text-[12px] text-terracotta">
        {fieldErrors[field]}
      </p>
    ) : null;

  // Login and reset are the hub's; the typed email rides along so it is not
  // asked for twice.
  const goToLogin = (path: "login" | "forgot-password") => {
    const url = new URL(`/${path}`, DASHBOARD_URL);
    url.searchParams.set("lang", language);
    if (email) url.searchParams.set("email", email);
    window.location.href = url.toString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setEmailTaken(false);

    // Split the full name into first/last — the register endpoint wants both,
    // each ≥2 chars (mirrors the merchant-hub register schema).
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" ");
    const e164 = toE164(phone);
    // Only validated when they actually said the numbers differ; an
    // untouched field behind an unticked box is not an error.
    const waE164 = waSame ? null : toE164(waPhone);
    const errors: Partial<Record<AuthField, string>> = {};
    if (firstName.length < 2 || lastName.length < 2) errors.name = fieldErrorMessage("name", isAr);
    if (!EMAIL_SHAPE.test(email.trim())) errors.email = fieldErrorMessage("email", isAr);
    if (!e164 || (!waSame && !waE164)) errors.phone = fieldErrorMessage("phone", isAr);
    if (!PASSWORD_RULES.every((r) => r.ok(password))) errors.password = fieldErrorMessage("password", isAr);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const res = await register({
        email: email.trim(),
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
        // The merchant who sent them. Attribution is first-touch on the
        // backend, so a code that arrived on a previous visit still wins.
        referral_code: referralCode ?? undefined,
        // UTMs + referrer captured on arrival, first touch within the tab.
        attribution: getAttribution(),
      });

      // Identify before the redirect below ends this page's life. Only the
      // account id and coarse context — the email and phone are in our own
      // database and have no business in a third-party analytics tool.
      if (res.user?.id) {
        identifySignup(
          res.user.id,
          // Taken from the response rather than the form fields, so what
          // PostHog shows is what the account actually holds — the API
          // normalises the phone to E.164 and may correct the email.
          {
            email: res.user.email,
            name: `${res.user.first_name} ${res.user.last_name}`,
            phone: res.user.phone ?? e164,
          },
          {
            plan_intent: planIntent ?? null,
            language: isAr ? "ar" : "en",
            whatsapp_same_as_phone: waSame,
          },
        );
      }
      // The next statement navigates to the hub, which would abandon a
      // normal in-flight capture. sendBeacon survives the unload.
      trackAndLeave("signup_submitted", { plan_intent: planIntent ?? null, chat_prefill: !!readPrefill() });

      // Hand the freshly-created account off to the merchant hub via the
      // /token-handoff bridge, rather than calling
      // authenticated endpoints (e.g. verify-email-code) from the landing
      // origin — those fail cross-origin. The hub then runs the canonical
      // email-verification + onboarding flow, exactly what an invite-email
      // signup lands in.
      if (res.tokens?.access_token) {
        const handoff = new URL("/token-handoff", DASHBOARD_URL);
        // Verify email first (required), on the merchant hub where the
        // verify flow reliably works. After verifying, the hub routes the
        // new merchant on to create-store → onboarding.
        // The onboarding chat's answers ride along; the hub stores them for
        // its setup wizard (see lib/onboardingPrefill.ts).
        const prefill = readPrefill();
        handoff.hash = new URLSearchParams({
          access_token: res.tokens.access_token,
          refresh_token: res.tokens.refresh_token,
          redirect: "/verify-email",
          ...(prefill ? { prefill } : {}),
        }).toString();
        clearPrefill();
        window.location.href = handoff.toString();
        return;
      }
      // Fallback: cookies were set on the shared parent domain, so a plain
      // redirect to the hub still carries the session.
      window.location.href = DASHBOARD_URL;
    } catch (err) {
      // A failed signup is the most useful event on this page — it is the
      // difference between "nobody wants this" and "the form is broken".
      // `reason` is the error code only: the server's message can carry the
      // email that was typed.
      const code = err instanceof AuthError ? err.code : "UNKNOWN";
      track("signup_failed", { reason: code, plan_intent: planIntent ?? null });
      const message = authErrorMessage(err, isAr);
      if (err instanceof AuthError && err.field) {
        setEmailTaken(code === "EMAIL_ALREADY_REGISTERED");
        setFieldErrors({ [err.field]: message });
      } else {
        setError(message);
      }
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex overflow-y-auto bg-ink/80 backdrop-blur-md p-4"
      dir={dir}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        aria-labelledby="signup-modal-title"
        className="relative m-auto w-full max-w-md focus:outline-none rounded-[14px] bg-navy-900 border border-cream/10 shadow-modal-panel p-8 animate-modal-panel"
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
            <TrialBadge isAr={isAr} />
          </div>
          <h2 id="signup-modal-title" className="font-display text-2xl sm:text-[28px] font-bold text-cream tracking-tight">
            {isAr ? "أنشئ متجرك دلوقتي" : "Create your store now"}
          </h2>
          <p className="prose-body-sm text-cream/70 mt-2">
            {isAr
              ? "الاسم والإيميل والموبايل والباسورد، وخلاص. من غير فيزا ومن غير مكالمات مبيعات."
              : "Sign up in under a minute and start selling — free, no card."}
          </p>
        </div>

        {/* Google — authenticate here, then let the hub resolve first-store onboarding. */}
        <div className="flex justify-center text-cream/70">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              if (!credentialResponse.credential) return;
              track("signup_google_clicked", { plan_intent: planIntent ?? null });
              setLoading(true);
              setError("");
              try {
                const res = await googleLogin(credentialResponse.credential, {
                  phone: toE164(phone) || undefined,
                  attribution: getAttribution(),
                  language: isAr ? "ar" : "en",
                  plan_intent: planIntent ?? undefined,
                  referral_code: referralCode ?? undefined,
                });
                if (res.tokens?.access_token) {
                  const handoff = new URL("/token-handoff", DASHBOARD_URL);
                  // Root resolves accounts without a store to /create-store,
                  // where OAuth users must now provide their phone number.
                  const prefill = readPrefill();
                  handoff.hash = new URLSearchParams({
                    access_token: res.tokens.access_token,
                    refresh_token: res.tokens.refresh_token,
                    redirect: "/",
                    ...(prefill ? { prefill } : {}),
                  }).toString();
                  clearPrefill();
                  window.location.href = handoff.toString();
                  return;
                }
                window.location.href = DASHBOARD_URL;
              } catch (err) {
                setError(authErrorMessage(err, isAr));
                setLoading(false);
              }
            }}
            onError={() =>
              setError(isAr ? "فشل تسجيل الدخول بجوجل" : "Google sign-in failed")
            }
            size="large"
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
        <form noValidate onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="signup-name" className={LABEL}>
              {isAr ? "الاسم بالكامل" : "Full name"}
            </label>
            <input
              {...fieldProps("name")}
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={isAr ? "مثال: سارة أحمد" : "e.g. Sara Ahmed"}
              disabled={loading}
              className="w-full h-12 px-4 rounded-[4px] bg-cream/5 border border-cream/15 text-cream placeholder-cream/40 focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all text-sm"
            />
            {fieldError("name")}
          </div>
          <div>
            <label htmlFor="signup-email" className={LABEL}>
              {isAr ? "الإيميل" : "Email"}
            </label>
            <input
              {...fieldProps("email")}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@gmail.com"
              disabled={loading}
              className="w-full h-12 px-4 rounded-[4px] bg-cream/5 border border-cream/15 text-cream placeholder-cream/40 focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all text-sm"
              dir="ltr"
            />
            {fieldError("email")}
            {emailTaken && (
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => goToLogin("login")}
                  className="h-9 px-3 rounded-[4px] bg-saffron text-ink text-xs font-semibold hover:bg-saffron/90 transition-colors"
                >
                  {isAr ? "سجّل دخول" : "Log in"}
                </button>
                <button
                  type="button"
                  onClick={() => goToLogin("forgot-password")}
                  className="h-9 px-3 rounded-[4px] border border-cream/25 text-cream text-xs hover:border-saffron transition-colors"
                >
                  {isAr ? "نسيت الباسورد؟" : "Forgot password?"}
                </button>
              </div>
            )}
          </div>
          <div>
            <label htmlFor="signup-phone" className={LABEL}>
              {isAr ? "رقم الموبايل (واتساب)" : "Mobile number (WhatsApp)"}
            </label>
            <input
              {...fieldProps("phone", "signup-phone-hint")}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01001234567"
              disabled={loading}
              className="w-full h-12 px-4 rounded-[4px] bg-cream/5 border border-cream/15 text-cream placeholder-cream/40 focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all text-sm"
              dir="ltr"
            />
            {fieldError("phone")}
            <p id="signup-phone-hint" className="mt-1.5 font-mono text-[10px] text-cream/45 leading-relaxed">
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
                inputMode="tel"
                aria-label={isAr ? "رقم الواتساب" : "WhatsApp number"}
                value={waPhone}
                onChange={(e) => setWaPhone(e.target.value)}
                placeholder={isAr ? "رقم الواتساب" : "WhatsApp number"}
                disabled={loading}
                className="mt-2 w-full h-12 px-4 rounded-[4px] bg-cream/5 border border-cream/15 text-cream placeholder-cream/40 focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all text-sm"
                dir="ltr"
              />
            )}
          </div>
          <div>
            <label htmlFor="signup-password" className={LABEL}>
              {isAr ? "الباسورد" : "Password"}
            </label>
            <div className="relative">
              <input
                {...fieldProps("password", "signup-password-rules")}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                maxLength={128}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            <ul id="signup-password-rules" className="mt-2 space-y-1">
              {PASSWORD_RULES.map((rule) => {
                const met = rule.ok(password);
                return (
                  <li
                    key={rule.en}
                    className={`font-mono text-[10px] flex items-center gap-1.5 ${met ? "text-sage" : "text-cream/50"}`}
                  >
                    <span aria-hidden="true">{met ? "✓" : "○"}</span>
                    <span>{isAr ? rule.ar : rule.en}</span>
                    <span className="sr-only">{met ? (isAr ? "(تمام)" : "(done)") : ""}</span>
                  </li>
                );
              })}
            </ul>
            {fieldError("password")}
          </div>

          {error && (
            <p role="alert" className="text-[12px] text-terracotta bg-terracotta/10 border border-terracotta/30 rounded-[4px] px-3 py-2">{error}</p>
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
          <p className="text-center text-[11px] text-cream/55 leading-relaxed">
            {isAr ? "بإنشاء الحساب إنت موافق على " : "By creating an account you agree to the "}
            <a href={`/${language}/terms`} target="_blank" rel="noopener" className="underline hover:text-saffron">
              {isAr ? "الشروط" : "Terms"}
            </a>
            {isAr ? " و" : " and "}
            <a href={`/${language}/privacy`} target="_blank" rel="noopener" className="underline hover:text-saffron">
              {isAr ? "سياسة الخصوصية" : "Privacy Policy"}
            </a>
            .
          </p>
        </form>

        <p className="text-center font-mono text-[10px] uppercase tracking-[0.18em] text-cream/50 mt-5">
          {isAr ? "عندك حساب؟" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => goToLogin("login")}
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
