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
  // the same cross-origin handoff the demo flow uses — instead of calling
  // authenticated endpoints from the landing origin.
  tokens?: AuthTokens;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  /** Pricing card the visitor clicked before signing up (payg auto-activates). */
  plan_intent?: "payg" | "starter" | "pro";
  /** UTMs + referrer, recorded on the merchant lead for channel attribution. */
  attribution?: Attribution;
}

/** POST with CSRF header, auto-retry once on CSRF failure, then refresh token. */
async function postWithCsrf<T>(
  url: string,
  body: unknown,
  errorPrefix: string,
): Promise<T> {
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

  let res = await doFetch();

  // Extract user-friendly error message from API response
  const extractError = (errBody: any, fallback: string): string => {
    if (!errBody) return fallback;
    // API format: { error: { code, message } }
    if (errBody.error?.message) return errBody.error.message;
    // FastAPI format: { detail: "..." }
    if (errBody.detail) return errBody.detail;
    return fallback;
  };

  // Handle CSRF token expiry: refresh and retry once
  if (res.status === 403) {
    const errBody = await res.json().catch(() => null);
    if (errBody?.detail === "CSRF validation failed") {
      await initCSRF();
      res = await doFetch();
    } else {
      throw new Error(extractError(errBody, `${errorPrefix} (${res.status})`));
    }
  }

  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw new Error(extractError(errBody, `${errorPrefix} (${res.status})`));
  }

  const json = await res.json();

  // Refresh CSRF token now that we have auth cookies
  await initCSRF();

  return json.data;
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  return postWithCsrf<AuthResponse>(
    `${API_BASE}/auth/login`,
    { email, password },
    "Login failed",
  );
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  return postWithCsrf<AuthResponse>(
    `${API_BASE}/auth/register`,
    data,
    "Registration failed",
  );
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  return postWithCsrf<{ message: string }>(
    `${API_BASE}/auth/forgot-password`,
    { email },
    "Password reset request failed",
  );
}

export async function verifyEmailByCode(code: string): Promise<void> {
  await postWithCsrf<unknown>(
    `${API_BASE}/auth/verify-email-code`,
    { code },
    "Verification failed",
  );
}

export async function verifyEmailByToken(token: string): Promise<void> {
  await postWithCsrf<unknown>(
    `${API_BASE}/auth/verify-email`,
    { token },
    "Verification failed",
  );
}

export async function resendVerificationEmail(): Promise<void> {
  await postWithCsrf<unknown>(
    `${API_BASE}/auth/resend-verification`,
    {},
    "Failed to resend verification email",
  );
}
