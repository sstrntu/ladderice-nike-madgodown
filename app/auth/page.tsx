"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { setUser, signInAsAdmin } from "@/lib/auth";

type Step = "method" | "otp" | "done";

export default function AuthPage() {
  return (
    <Suspense fallback={<FrontDoorShell />}>
      <AuthInner />
    </Suspense>
  );
}

function FrontDoorShell() {
  return (
    <div className="px-5 pt-12">
      <div className="font-mono text-[10px] tracking-[0.32em] text-bone/55">
        FRONT DOOR
      </div>
    </div>
  );
}

function AuthInner() {
  const router = useRouter();
  const search = useSearchParams();
  const redirect = search.get("redirect") || "/";

  const [step, setStep] = useState<Step>("method");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [cooldown, setCooldown] = useState(0);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidCode = code.every((d) => /^\d$/.test(d));

  const sendCode = () => {
    if (!isValidEmail) return;
    setStep("otp");
    setCooldown(30);
    setTimeout(() => refs.current[0]?.focus(), 50);
  };

  const verifyCode = () => {
    if (!isValidCode) return;
    setUser({
      email,
      provider: "email",
      role: "user",
      signedInAt: Date.now(),
    });
    setStep("done");
    setTimeout(() => router.push(redirect), 700);
  };

  const onDigit = (i: number, v: string) => {
    const d = v.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[i] = d;
    setCode(next);
    if (d && i < 5) refs.current[i + 1]?.focus();
  };
  const onKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[i] && i > 0) refs.current[i - 1]?.focus();
  };
  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    e.preventDefault();
    const next = Array(6).fill("");
    for (let i = 0; i < text.length; i++) next[i] = text[i];
    setCode(next);
    refs.current[Math.min(text.length, 5)]?.focus();
  };

  const social = (provider: "line" | "google" | "apple") => {
    setUser({
      email: `${provider}-user@example.com`,
      provider,
      role: "user",
      signedInAt: Date.now(),
    });
    router.push(redirect);
  };

  const goAdmin = () => {
    signInAsAdmin();
    router.push("/admin");
  };

  return (
    <div className="relative">
      {/* Front-door hero */}
      <div className="px-5 pt-10 pb-6">
        <div className="font-mono text-[10px] tracking-[0.32em] text-bone/55">
          FRONT DOOR · BKK · 2026
        </div>
        <h1 className="mt-4 font-display italic text-bone leading-[0.88] text-[64px] whitespace-nowrap tracking-tight">
          MAD GODOWN
        </h1>
        <div className="mt-2 font-mono text-[11px] tracking-[0.22em] text-bone/55">
          แม๊ดโกดัง · 狂仓
        </div>
      </div>

      <div className="px-5 pb-12">
        {step === "method" && (
          <>
            <div className="font-display italic text-[26px] leading-tight">
              Step inside.
            </div>
            <p className="mt-2 text-[12.5px] text-bone/65 font-mono leading-snug">
              One ID, every ticket. We email you a 6-digit code &mdash; no passwords.
            </p>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => social("line")}
                className="btn-volt !bg-[#06C755] !text-white"
              >
                CONTINUE WITH LINE
              </button>
              <button onClick={() => social("google")} className="btn-ghost">
                CONTINUE WITH GOOGLE
              </button>
              <button onClick={() => social("apple")} className="btn-ghost">
                CONTINUE WITH APPLE
              </button>
            </div>

            <div className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-bone/15" />
              <span className="font-mono text-[10px] tracking-[0.22em] text-bone/45">
                OR EMAIL
              </span>
              <span className="h-px flex-1 bg-bone/15" />
            </div>

            <label className="eyebrow">Email</label>
            <input
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@somewhere.com"
              type="email"
              inputMode="email"
              autoFocus
            />
            <button
              onClick={sendCode}
              disabled={!isValidEmail}
              className="btn-volt mt-4"
            >
              SEND CODE &nbsp;→
            </button>

            {/* Demo / staff entrance */}
            <div className="mt-10 relative border border-dashed border-bone/25 p-4">
              <span className="absolute -top-2 left-3 bg-ink px-2 font-mono text-[9.5px] tracking-[0.22em] text-bone/55">
                STAFF ENTRANCE · DEMO
              </span>
              <p className="text-[12px] text-bone/65 leading-snug">
                Bypass the email step and jump straight into the organizer dashboard with seeded permissions.
              </p>
              <button
                onClick={goAdmin}
                className="btn-ghost mt-3 !border-volt !text-volt"
              >
                SIGN IN AS ADMIN &nbsp;→
              </button>
              <div className="mt-2 font-mono text-[9.5px] tracking-[0.22em] text-bone/40">
                POC ONLY · REMOVE BEFORE LAUNCH
              </div>
            </div>

            <p className="mt-6 font-mono text-[10px] tracking-[0.18em] text-bone/45 leading-snug">
              By continuing you agree to our{" "}
              <Link href="#" className="text-volt underline-offset-4 hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-volt underline-offset-4 hover:underline">
                Privacy Notice
              </Link>
              . PDPA compliant.
            </p>
          </>
        )}

        {step === "otp" && (
          <>
            <div className="font-display italic text-[26px] leading-tight">
              Code sent.
            </div>
            <p className="mt-2 text-[12.5px] text-bone/65 font-mono leading-snug">
              Six digits on the way to{" "}
              <span className="text-bone">{email}</span>. Expires in 10 minutes.
            </p>

            <div className="mt-7 grid grid-cols-6 gap-2">
              {code.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  value={d}
                  onChange={(e) => onDigit(i, e.target.value)}
                  onKeyDown={(e) => onKey(i, e)}
                  onPaste={onPaste}
                  inputMode="numeric"
                  maxLength={1}
                  className="input !h-14 text-center font-impact text-[28px] !p-0"
                />
              ))}
            </div>

            <button
              onClick={verifyCode}
              disabled={!isValidCode}
              className="btn-volt mt-5"
            >
              VERIFY &nbsp;→
            </button>

            <div className="mt-5 flex items-center justify-between font-mono text-[10.5px] tracking-[0.22em]">
              <button
                onClick={() => setStep("method")}
                className="text-bone/55 hover:text-bone"
              >
                ← CHANGE EMAIL
              </button>
              <button
                onClick={() => {
                  if (cooldown === 0) setCooldown(30);
                }}
                disabled={cooldown > 0}
                className={cooldown > 0 ? "text-bone/35" : "text-volt"}
              >
                {cooldown > 0 ? `RESEND IN ${cooldown}s` : "RESEND CODE"}
              </button>
            </div>

            <p className="mt-6 font-mono text-[10.5px] text-bone/45 leading-snug">
              Tip · for this POC any 6 digits work.
            </p>
          </>
        )}

        {step === "done" && (
          <div className="mt-10 text-center">
            <div className="tape inline-block">CONFIRMED</div>
            <h2 className="mt-5 font-display italic text-[36px] leading-[0.95]">
              You&apos;re in.
            </h2>
            <p className="mt-2 font-mono text-[11px] tracking-[0.22em] text-bone/55">
              REDIRECTING…
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
