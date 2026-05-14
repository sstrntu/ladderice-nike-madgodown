"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getUser, PUBLIC_ROUTES, ADMIN_ROUTE_PREFIX } from "@/lib/auth";

type Phase = "checking" | "allowed";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("checking");

  useEffect(() => {
    const check = () => {
      const u = getUser();
      const isPublic = PUBLIC_ROUTES.has(pathname);
      const isAdminRoute = pathname.startsWith(ADMIN_ROUTE_PREFIX);

      if (isPublic) {
        // /auth: if already signed in, send them on
        if (u) {
          const sp = new URLSearchParams(window.location.search);
          router.replace(sp.get("redirect") || "/");
          return;
        }
        setPhase("allowed");
        return;
      }

      if (!u) {
        router.replace(`/auth?redirect=${encodeURIComponent(pathname)}`);
        return;
      }
      if (isAdminRoute && u.role !== "admin") {
        router.replace("/?denied=admin");
        return;
      }
      setPhase("allowed");
    };

    check();
    window.addEventListener("auth-change", check);
    return () => window.removeEventListener("auth-change", check);
  }, [pathname, router]);

  if (phase === "checking") {
    return (
      <div className="px-5 pt-24 flex flex-col items-center text-center">
        <div className="font-mono text-[10px] tracking-[0.32em] text-bone/45">
          MAD GODOWN
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
