// Mock auth — localStorage only. Replace with Supabase Auth later.
const KEY = "madgodown:auth:v1";

export interface MockUser {
  email: string;
  name?: string;
  provider: "email" | "line" | "google" | "apple";
  lang?: "en" | "th";
  marketingOptIn?: boolean;
  signedInAt: number;
}

export function getUser(): MockUser | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; }
}
export function setUser(u: MockUser | null) {
  if (typeof window === "undefined") return;
  if (u) localStorage.setItem(KEY, JSON.stringify(u));
  else localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("auth-change"));
}
export function signOut() { setUser(null); }
