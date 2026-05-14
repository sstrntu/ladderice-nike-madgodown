"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { TopBar } from "@/components/Brand";
import { signInAsAdmin, setUser } from "@/lib/auth";

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="px-5 py-10"><TopBar back="/" /></div>}>
      <AuthInner />
    </Suspense>
  );
}

function AuthInner() {
  const router = useRouter();
  const search = useSearchParams();
  const redirect = search.get("redirect") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const demo = () => {
    signInAsAdmin();
    router.push(redirect);
  };

  const real = () => {
    // POC: any email + non-empty password works
    if (!email.includes("@") || !password) return;
    setUser({
      email,
      name: email.split("@")[0],
      provider: "email",
      role: "admin",
      signedInAt: Date.now(),
    });
    router.push(redirect);
  };

  return (
    <div className="relative pb-10">
      <TopBar back="/" title="STAFF GATE" />

      <div className="px-5 pt-10">
        <div className="font-mono text-[10px] tracking-[0.32em] text-bone/55">
          ORGANIZER LOGIN · BKK · 2026
        </div>

        <h1 className="mt-4 font-display italic text-bone leading-[0.9] text-[44px] tracking-tight">
          Staff entrance.
        </h1>
        <p className="mt-3 text-[13px] text-bone/70 leading-snug">
          Only event organizers and gate staff sign in. Ticket buyers
          don&apos;t need an account &mdash; QR codes arrive by email with a
          confirmation code they can look up anytime.
        </p>

        {/* email / password block */}
        <div className="mt-7 space-y-3">
          <div>
            <label className="eyebrow">Email</label>
            <input
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="organizer@madgodown.com"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="eyebrow">Password</label>
            <input
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          <button
            onClick={real}
            disabled={!email.includes("@") || !password}
            className="btn-volt"
          >
            SIGN IN &nbsp;→
          </button>
        </div>

        {/* demo bypass */}
        <div className="mt-10 relative border border-dashed border-bone/25 p-4">
          <span className="absolute -top-2 left-3 bg-ink px-2 font-mono text-[9.5px] tracking-[0.22em] text-bone/55">
            DEMO · POC ONLY
          </span>
          <p className="text-[12px] text-bone/65 leading-snug">
            Skip the form and jump in with seeded admin permissions.
          </p>
          <button
            onClick={demo}
            className="btn-ghost mt-3 !border-volt !text-volt"
          >
            SIGN IN AS DEMO ADMIN &nbsp;→
          </button>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="font-mono text-[10.5px] tracking-[0.22em] text-bone/55 hover:text-volt"
          >
            ← BACK TO LANDING
          </Link>
        </div>
        <div className="mt-3 text-center">
          <Link
            href="/lookup"
            className="font-mono text-[10.5px] tracking-[0.22em] text-volt hover:underline"
          >
            BOUGHT A TICKET? LOOK IT UP &nbsp;→
          </Link>
        </div>
      </div>
    </div>
  );
}
