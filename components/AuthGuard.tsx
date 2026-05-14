"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getUser, ADMIN_ROUTE_PREFIX } from "@/lib/auth";

type Phase = "checking" | "allowed";

/**
 * Guard policy:
 * - Buyers don't need an account. Everything *except* /admin/* is open.
 * - /admin/* requires a signed-in admin. Non-admins get bounced to /auth.
 * - /auth itself is open (it's the admin login).
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("checking");

  const isAdminRoute = pathname.startsWith(ADMIN_ROUTE_PREFIX);

  useEffect(() => {
    if (!isAdminRoute) {
      setPhase("allowed");
      return;
    }
    const check = () => {
      const u = getUser();
      if (!u || u.role !== "admin") {
        router.replace(`/auth?redirect=${encodeURIComponent(pathname)}`);
        return;
      }
      setPhase("allowed");
    };
    check();
    window.addEventListener("auth-change", check);
    return () => window.removeEventListener("auth-change", check);
  }, [pathname, router, isAdminRoute]);

  // Public route: render immediately, no flash.
  if (!isAdminRoute) return <>{children}</>;

  if (phase === "checking") {
    return (
      <div className="px-5 pt-24 flex flex-col items-center text-center">
        <div className="font-mono text-[10px] tracking-[0.32em] text-bone/45">
          STAFF GATE
        </div>
        <div className="mt-4 h-[3px] w-32 bg-bone/10 overflow-hidden">
          <div className="h-full w-1/3 bg-volt animate-[loadbar_1.2s_ease-in-out_infinite]" />
        </div>
        <style>{`@keyframes loadbar{0%{transform:translateX(-110%)}100%{transform:translateX(330%)}}`}</style>
      </div>
    );
  }
  return <>{children}</>;
}
