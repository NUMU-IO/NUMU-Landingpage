/**
 * Auth API service for the NUMU landing page.
 * Authentication is handled via httpOnly cookies set by the backend.
 */

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

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail || `Login failed (${res.status})`);
  }

  const json = await res.json();
  return json.data;
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail || `Registration failed (${res.status})`);
  }

  const json = await res.json();
  return json.data;
}
