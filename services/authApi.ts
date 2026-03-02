/**
 * Auth API service for the NUMU landing page.
 * Authentication is handled via httpOnly cookies set by the backend.
 * CSRF token is stored in memory and sent on state-changing requests.
 */

import { getCSRFToken, initCSRF } from "./csrf";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8021/api/v1";

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

export interface AuthResponse {
  user: User;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
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

  // Handle CSRF token expiry: refresh and retry once
  if (res.status === 403) {
    const errBody = await res.json().catch(() => null);
    if (errBody?.detail === "CSRF validation failed") {
      await initCSRF();
      res = await doFetch();
    } else {
      throw new Error(errBody?.detail || `${errorPrefix} (${res.status})`);
    }
  }

  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw new Error(errBody?.detail || `${errorPrefix} (${res.status})`);
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
