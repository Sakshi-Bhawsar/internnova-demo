import type { User } from "@/types";

const TOKEN_KEY = "internova_token";
const USER_KEY = "internova_user";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setSession(token: string, user: User): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  document.cookie = `internova_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  document.cookie = "internova_token=; path=/; max-age=0; SameSite=Lax";
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function getPostLoginPath(user: User): string {
  if (user.role === "ADMIN") return "/admin";
  if (user.role === "MENTOR") {
    if (user.mentorStatus === "PENDING" || !user.isActive) {
      return "/mentor/pending";
    }
    return "/mentor";
  }
  return "/dashboard";
}
