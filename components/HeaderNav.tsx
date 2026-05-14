"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getUser, type MockUser } from "@/lib/auth";

export function HeaderNav() {
  const [user, setUser] = useState<MockUser | null>(null);

  useEffect(() => {
    const sync = () => setUser(getUser());
    sync();
    window.addEventListener("auth-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("auth-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return (
    <div className="flex items-center gap-4 font-mono text-[10px] tracking-[0.22em]">
      <Link href="/lookup" className="text-bone/65 hover:text-volt">
        LOOKUP
      </Link>
      <Link href="/admin" className={user?.role === "admin" ? "text-volt hover:underline" : "text-bone/65 hover:text-volt"}>
        ADMIN
      </Link>
    </div>
  );
}
