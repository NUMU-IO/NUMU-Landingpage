/**
 * Auth API service for the NUMU landing page.
 * Authentication is handled via httpOnly cookies set by the backend.
 * CSRF token is stored in memory and sent on state-changing requests.
 */

import type { Attribution } from "../lib/attribution";
import { getCSRFToken, initCSRF } from "./csrf";

const API_BASE = import.meta.env.VITE_API_URL || "https://numueg.app/api/v1";

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string | null;
  role: string;
  status: string;
  avatar_url: string | null;
  is_verified: boolean;
  trial_ends_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface AuthResponse {
  user: User;
  // The backend also returns the freshly-minted session tokens in the body
  // (in addition to setting httpOnly cookies). The landing uses these to
  // hand the new account off to the merchant hub via /token-handoff —
  // the cross-origin /token-handoff bridge — instead of calling
  // authenticated endpoints from the landing origin.
  tokens?: AuthTokens;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  /** Required by the API — an unreachable merchant is not a lead. */
  phone: string;
  /** Default true. When false, `whatsapp_phone` carries the real number. */
  whatsapp_same_as_phone?: boolean;
  /** Only sent when it differs from `phone`; absence means "same". */
  whatsapp_phone?: string;
  /** Page locale — picks the language of every merchant-facing message. */
  language?: "ar" | "en";
  /** Pricing card the visitor clicked before signing up (payg auto-activates). */
  plan_intent?: "payg" | "starter" | "pro";
  /** From a referral link. The backend attributes it first-touch and ignores
   *  an unknown code rather than rejecting the registration. */
  referral_code?: string;
  /** UTMs + referrer, recorded on the merchant lead for channel attribution. */
  attribution?: Attribution;
}

/** Shape check only; the API decides whether the address is real. */
export const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type AuthField = "name" | "email" | "phone" | "password";

/**
 * A failed auth call, reduced to what a form can act on: the server's error
 * code (or NETWORK / SERVER when there was no usable answer) and the field at
 * fault. Never shown as-is — `authErrorMessage` turns it into merchant copy.
 */
export class AuthError extends Error {
  constructor(
    public code: string,
    public field?: AuthField,
    public retryAfter?: number,
  ) {
    super(code);
    this.name = "AuthError";
  }
}

const FIELD_BY_API_FIELD: Record<string, AuthField> = {
  first_name: "name",
  last_name: "name",
  email: "email",
  phone: "phone",
  whatsapp_phone: "phone",
  password: "password",
};

function toAuthError(status: number, errBody: any): AuthError {
  const error = errBody?.error;
  if (!error?.code || status >= 500) return new AuthError("SERVER");
  const apiField = Array.isArray(error.details)
    ? String(error.details[0]?.field ?? "").split(".").pop() ?? ""
    : "";
  if (/breach/i.test(String(error.message ?? ""))) {
    return new AuthError("PASSWORD_BREACHED", "password");
  }
  const field =
    FIELD_BY_API_FIELD[apiField] ??
    (error.code === "EMAIL_ALREADY_REGISTERED"
      ? "email"
      : /^password/i.test(String(error.message ?? ""))
        ? "password"
        : undefined);
  return new AuthError(error.code, field, error.details?.retry_after);
}

const FIELD_COPY: Record<AuthField, [string, string]> = {
  name: [
    "اكتب اسمك بالكامل (الاسم الأول واسم العائلة).",
    "Please enter your full name (first and last).",
  ],
  email: [
    "الإيميل ده مش مظبوط، اتأكد منه (مثال: name@gmail.com).",
    "That email doesn't look right (e.g. name@gmail.com).",
  ],
  phone: [
    "اكتب رقم موبايل صحيح (مثال: 01001234567 أو ‎+966512345678).",
    "Enter a valid mobile number (e.g. 01001234567 or +966512345678).",
  ],
  password: [
    "الباسورد لازم يكون ٨ حروف على الأقل.",
    "Password must be at least 8 characters.",
  ],
};

/** Merchant-facing copy for any error an auth call threw, in the page's language. */
export function authErrorMessage(err: unknown, isAr: boolean): string {
  const pick = ([ar, en]: [string, string]) => (isAr ? ar : en);
  const e = err instanceof AuthError ? err : new AuthError("SERVER");
  switch (e.code) {
    case "NETWORK":
      return pick([
        "مفيش اتصال بالإنترنت دلوقتي. بياناتك لسه في الفورم، جرّب تاني.",
        "No internet connection. Your details are still in the form, try again.",
      ]);
    case "PASSWORD_BREACHED":
      return pick([
        "الباسورد ده ظهر قبل كده في تسريبات بيانات، فسهل يتخمّن. اختار واحد تاني.",
        "This password has shown up in a data breach, so it is easy to guess. Pick a different one.",
      ]);
    case "EMAIL_ALREADY_REGISTERED":
      return pick(["الإيميل ده عليه حساب بالفعل.", "This email already has an account."]);
    case "AUTHENTICATION_ERROR":
      return pick(["الإيميل أو الباسورد غلط.", "Wrong email or password."]);
    case "ACCOUNT_LOCKED": {
      const minutes = Math.max(1, Math.ceil((e.retryAfter ?? 900) / 60));
      return pick([
        `محاولات كتير غلط. استنى ${minutes} دقيقة وجرّب تاني.`,
        `Too many failed attempts. Wait ${minutes} minutes and try again.`,
      ]);
    }
    case "RATE_LIMIT_EXCEEDED":
      return pick(["محاولات كتير ورا بعض. استنى شوية وجرّب تاني.", "Too many attempts. Wait a moment and try again."]);
    case "VALIDATION_ERROR":
      return e.field
        ? pick(FIELD_COPY[e.field])
        : pick(["في بيانات مش مظبوطة. راجعها وجرّب تاني.", "Some details aren't right. Check them and try again."]);
    default:
      return pick([
        "حصلت مشكلة عندنا، جرّب كمان شوية. بياناتك لسه في الفورم.",
        "Something went wrong on our side. Try again in a moment, your details are still here.",
      ]);
  }
}

/** Client-side copy for a field, shared with the forms' own validation. */
export function fieldErrorMessage(field: AuthField, isAr: boolean): string {
  return FIELD_COPY[field][isAr ? 0 : 1];
}

/** POST with CSRF header, auto-retry once on CSRF failure, then refresh token. */
async function postWithCsrf<T>(url: string, body: unknown): Promise<T> {
  const doFetch = () => {
    const token = getCSRFToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["X-CSRF-Token"] = token;
    return fetch(url, {
      method: "POST",
      credentials: "include",
      headers,
      body: JSON.stringify(body),
    });
  };

  // fetch only throws when the request never got an answer.
  const send = () =>
    doFetch().catch(() => {
      throw new AuthError("NETWORK");
    });

  let res = await send();

  // Handle CSRF token expiry: refresh and retry once
  if (res.status === 403) {
    const errBody = await res.json().catch(() => null);
    if (errBody?.detail === "CSRF validation failed") {
      await initCSRF();
      res = await send();
    } else {
      throw toAuthError(res.status, errBody);
    }
  }

  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw toAuthError(res.status, errBody);
  }

  const json = await res.json();

  // Refresh CSRF token now that we have auth cookies
  await initCSRF();

  return json.data;
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  return postWithCsrf<AuthResponse>(`${API_BASE}/auth/register`, data);
}

/** The same funnel context the email door sends, so a Google signup keeps it. */
export type GoogleSignupContext = Pick<
  RegisterData,
  "phone" | "attribution" | "language" | "plan_intent" | "referral_code"
>;

export async function googleLogin(
  idToken: string,
  context: Partial<GoogleSignupContext> = {},
): Promise<AuthResponse> {
  return postWithCsrf<AuthResponse>(`${API_BASE}/auth/google`, {
    id_token: idToken,
    ...context,
  });
}
