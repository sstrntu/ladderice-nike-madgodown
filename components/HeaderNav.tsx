"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getUser, type MockUser } from "@/lib/auth";
import { loadNotifs } from "@/lib/notifications";

export function HeaderNav() {
  const [user, setUser] = useState<MockUser | null>(null);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const sync = () => {
      setUser(getUser());
      setUnread(loadNotifs().filter((n) => !n.read).length);
    };
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
      <Link href="/notifications" className="relative text-bone/65 hover:text-volt">
        INBOX
        {unread > 0 && (
          <span className="absolute -top-1.5 -right-3 h-4 min-w-4 px-1 inline-flex items-center justify-center bg-volt text-ink rounded-full text-[9px] leading-none">
            {unread}
          </span>
        )}
      </Link>
      {user ? (
        <Link href="/account" className="text-volt hover:underline">
          {user.email.split("@")[0].toUpperCase().slice(0, 8)}
        </Link>
      ) : (
        <Link href="/auth" className="text-bone/65 hover:text-volt">
          SIGN IN
        </Link>
      )}
    </div>
  );
}
