// Mock auth — localStorage only. Replace with Supabase Auth later.
const KEY = "madgodown:auth:v1";

export type Role = "user" | "admin";

export interface MockUser {
  email: string;
  name?: string;
  provider: "email" | "line" | "google" | "apple" | "demo-admin";
  role: Role;
  lang?: "en" | "th";
  marketingOptIn?: boolean;
  signedInAt: number;
}

export function getUser(): MockUser | null {
  if (typeof window === "undefined") return null;
  try {
    const u = JSON.parse(localStorage.getItem(KEY) || "null");
    if (u && !u.role) u.role = "user"; // migrate older records
    return u;
  } catch {
    return null;
  }
}
export function setUser(u: MockUser | null) {
  if (typeof window === "undefined") return;
  if (u) localStorage.setItem(KEY, JSON.stringify(u));
  else localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("auth-change"));
}
export function signOut() { setUser(null); }

export function signInAsAdmin() {
  setUser({
    email: "admin@madgodown.com",
    name: "Demo Admin",
    provider: "demo-admin",
    role: "admin",
    signedInAt: Date.now(),
  });
}

// Routes that don't require a session.
export const PUBLIC_ROUTES = new Set<string>(["/auth"]);
// Routes that require admin role.
export const ADMIN_ROUTE_PREFIX = "/admin";
