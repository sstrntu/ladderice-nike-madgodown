"use client";
import { useState } from "react";
import Link from "next/link";
import { TopBar, SectionHead } from "@/components/Brand";
import { TICKET_TYPES, THB } from "@/lib/data";
import { joinWaitlist, addNotif } from "@/lib/notifications";

export default function WaitlistPage() {
  const sold = TICKET_TYPES.filter((t) => t.soldOut);
  const [picked, setPicked] = useState<string | null>(sold[0]?.id ?? null);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !!picked;

  const submit = () => {
    if (!isValid || !picked) return;
    joinWaitlist(picked, email);
    addNotif({
      kind: "waitlist",
      title: "You're on the waitlist",
      body: `We'll ping you the moment ${TICKET_TYPES.find((t) => t.id === picked)?.name ?? "this ticket"} re-opens.`,
    });
    setDone(true);
  };

  return (
    <div className="relative pb-10">
      <TopBar back="/tickets" title="WAITLIST" />

      <div className="px-5 pt-6">
        <SectionHead
          eyebrow="NOTIFY ME"
          title="Sold out. Not gone."
          hint="Drop your email — we'll ping the second a seat opens up."
        />

        {!done ? (
          <>
            <div className="mt-6 space-y-2">
              <label className="eyebrow">Pick the ticket</label>
              {sold.length === 0 ? (
                <p className="font-mono text-[11px] tracking-[0.18em] text-bone/55">
                  NOTHING SOLD OUT RIGHT NOW.
                </p>
              ) : (
                sold.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setPicked(t.id)}
                    className={`crate w-full text-left p-3 ${picked === t.id ? "selected" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${t.zoneColor}`} />
                        <span className="font-impact text-[16px]">{t.name}</span>
                      </div>
                      <span className="font-display text-volt text-[16px]">{THB(t.priceTHB)}</span>
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="mt-5">
              <label className="eyebrow">Email</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@somewhere.com"
              />
            </div>

            <button onClick={submit} disabled={!isValid} className="btn-volt mt-5">
              JOIN THE WAITLIST &nbsp;→
            </button>

            <p className="mt-5 font-mono text-[10.5px] text-bone/45 leading-snug">
              We message in order of signup. No transfers. We don&apos;t sell your email.
            </p>
          </>
        ) : (
          <div className="mt-8 border border-volt/40 p-5 bg-dirt/40">
            <div className="tape inline-block">YOU&apos;RE ON THE LIST</div>
            <p className="mt-3 text-[13.5px] text-bone/85 leading-snug">
              We&apos;ll send a one-time, 60-minute window to grab it before it goes back to the pool.
              Check the inbox.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <Link href="/notifications" className="btn-volt">INBOX</Link>
              <Link href="/" className="btn-ghost">HOME</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
