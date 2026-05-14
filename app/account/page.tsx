"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TopBar, SectionHead } from "@/components/Brand";
import { getUser, setUser, signOut, type MockUser } from "@/lib/auth";

export default function AccountPage() {
  const router = useRouter();
  const [user, setU] = useState<MockUser | null>(null);
  const [name, setName] = useState("");
  const [lang, setLang] = useState<"en" | "th">("en");
  const [marketing, setMarketing] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.push("/auth?redirect=/account");
      return;
    }
    setU(u);
    setName(u.name ?? "");
    setLang(u.lang ?? "en");
    setMarketing(u.marketingOptIn ?? true);
  }, [router]);

  if (!user) return <div className="px-5 py-10"><TopBar back="/" /></div>;

  const save = () => {
    const next: MockUser = { ...user, name, lang, marketingOptIn: marketing };
    setUser(next);
    setU(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const out = () => {
    signOut();
    router.push("/");
  };

  return (
    <div className="relative pb-10">
      <TopBar back="/" title="ACCOUNT" />

      <div className="px-5 pt-6">
        <SectionHead eyebrow="MEMBER" title="Your account." hint="Edit how we contact you. Data stays on this device for the POC." />

        {/* Identity card */}
        <div className="mt-6 border border-bone/15 p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 grid place-items-center border border-volt/50 font-impact text-volt text-[18px]">
              {(name || user.email)[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="font-impact text-[18px] truncate">{name || user.email}</div>
              <div className="font-mono text-[10.5px] tracking-[0.18em] text-bone/55 truncate">
                {user.email} · via {user.provider.toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Profile */}
        <div className="mt-6 space-y-4">
          <div>
            <label className="eyebrow">Display name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="As you'd like to be greeted" />
          </div>

          <div>
            <label className="eyebrow">Language</label>
            <div className="grid grid-cols-2 gap-2">
              {(["en", "th"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`btn-ghost ${lang === l ? "!border-volt !text-volt" : ""}`}
                >
                  {l === "en" ? "ENGLISH" : "ภาษาไทย"}
                </button>
              ))}
            </div>
          </div>

          <div className="border border-bone/15 p-4">
            <label className="flex gap-3 items-start cursor-pointer">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="mt-1 accent-volt h-4 w-4 shrink-0"
              />
              <span className="text-[12.5px] text-bone/85 leading-snug">
                Send me drop alerts, address reveals, and post-event recaps via email + LINE.
                <span className="block mt-1 font-mono text-[10.5px] text-bone/45 tracking-[0.16em]">
                  PDPA — you can opt out anytime.
                </span>
              </span>
            </label>
          </div>
        </div>

        <button onClick={save} className="btn-volt mt-6">
          {saved ? "SAVED ✓" : "SAVE CHANGES"}
        </button>

        {/* Quick links */}
        <div className="mt-8 grid grid-cols-1 gap-2">
          <Link href="/my-tickets" className="btn-ghost">MY TICKETS</Link>
          <Link href="/notifications" className="btn-ghost">NOTIFICATIONS</Link>
          <Link href="/legal/privacy" className="btn-ghost">PRIVACY NOTICE</Link>
        </div>

        {/* Danger */}
        <div className="mt-10 border-t border-bone/10 pt-6">
          <button
            onClick={out}
            className="font-mono text-[11px] tracking-[0.22em] text-red-400 hover:underline"
          >
            SIGN OUT
          </button>
          <button
            onClick={() => alert("Mock — would create a PDPA data export request")}
            className="block mt-3 font-mono text-[11px] tracking-[0.22em] text-bone/50 hover:text-bone"
          >
            REQUEST DATA EXPORT (PDPA)
          </button>
          <button
            onClick={() => alert("Mock — would request account deletion")}
            className="block mt-3 font-mono text-[11px] tracking-[0.22em] text-bone/50 hover:text-bone"
          >
            DELETE ACCOUNT
          </button>
        </div>
      </div>
    </div>
  );
}
