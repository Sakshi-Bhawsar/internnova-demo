import { apiClient } from "@/lib/api";
import type { AuthResponse, User } from "@/types";

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  education?: string;
  college?: string;
  graduationYear?: number;
  role: "STUDENT" | "MENTOR";
}

export interface LoginPayload {
  email: string;
  password: string;
}

export async function registerApi(payload: RegisterPayload): Promise<AuthResponse> {
  const res = await apiClient<AuthResponse>(
    "/auth/register",
    { method: "POST", body: JSON.stringify(payload) },
    false
  );
  return res.data!;
}

export async function loginApi(payload: LoginPayload): Promise<AuthResponse> {
  const res = await apiClient<AuthResponse>(
    "/auth/login",
    { method: "POST", body: JSON.stringify(payload) },
    false
  );
  return res.data!;
}

export async function logoutApi(): Promise<void> {
  try {
    await apiClient("/auth/logout", { method: "POST" });
  } catch {
    // Clear client session even if API fails
  }
}

export async function fetchMeApi(): Promise<User> {
  const res = await apiClient<{ user: User }>("/auth/me");
  return res.data!.user;
}
