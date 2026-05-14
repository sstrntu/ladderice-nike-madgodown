"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth";

export function AdminBanner() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const sync = () => setIsAdmin(getUser()?.role === "admin");
    sync();
    window.addEventListener("auth-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("auth-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (!isAdmin) return null;

  return (
    <div className="bg-volt text-ink px-5 py-2 flex items-center justify-between gap-3">
      <div className="font-mono text-[9.5px] tracking-[0.22em] font-bold">ADMIN MODE</div>
      <div className="flex items-center gap-4 font-mono text-[9.5px] tracking-[0.22em]">
        <Link href="/admin" className="hover:underline">DASHBOARD</Link>
        <Link href="/admin/events" className="hover:underline">EDIT WORKSHOPS</Link>
        <Link href="/admin/events/new" className="hover:underline">+ NEW</Link>
      </div>
    </div>
  );
}
