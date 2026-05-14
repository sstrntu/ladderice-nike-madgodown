"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TopBar, StepDots, SectionHead } from "@/components/Brand";
import { SESSIONS, TICKET_DATE_OPTIONS, ticketById } from "@/lib/data";
import { useBooking } from "@/lib/context";

export default function SchedulePage() {
  const router = useRouter();
  const { draft, setDraft } = useBooking();
  const tk = ticketById(draft.ticketTypeId);

  const availableDates = tk ? TICKET_DATE_OPTIONS[tk.id] : undefined;
  const availableSessions = availableDates
    ? SESSIONS.filter((s) => availableDates.includes(s.date))
    : SESSIONS;

  const dates = useMemo(() => {
    const seen = new Set<string>();
    return availableSessions.filter((s) => {
      if (seen.has(s.date)) return false;
      seen.add(s.date);
      return true;
    });
  }, [availableSessions]);

  const initialDate =
    availableSessions.find((s) => s.id === draft.sessionId)?.date ?? dates[0].date;
  const [activeDate, setActiveDate] = useState<string>(initialDate);
  const slots = availableSessions.filter((s) => s.date === activeDate);

  const [holdUntil, setHoldUntil] = useState<number | null>(null);
  useEffect(() => {
    if (draft.sessionId) setHoldUntil(Date.now() + 1000 * 60 * 10);
  }, [draft.sessionId]);
  const remaining = useRemaining(holdUntil);

  if (!tk) {
    return (
      <div className="px-5 py-10">
        <TopBar back="/tickets" />
        <p className="mt-6 text-bone/70 font-mono text-[12px]">
          No ticket selected. Go back.
        </p>
      </div>
    );
  }

  return (
    <div className="relative pb-cta">
      <TopBar back="/tickets" title="STEP 02 · DATE" />
      <StepDots step={2} />

      <div className="px-5 pt-5">
        <SectionHead title="Pick a session." hint="Only eligible workshop dates are shown. Capacity is extremely limited." />

        {/* Selected ticket reference */}
        <div className="mt-5 flex items-center gap-2 border border-bone/12 px-3 py-2.5">
          <span className={`h-2 w-2 rounded-full ${tk.zoneColor}`} />
          <span className="font-mono text-[10px] tracking-[0.22em] text-bone/50">
            FOR
          </span>
          <span className="font-impact text-[14px] truncate">{tk.name}</span>
        </div>

        {/* Date pills */}
        <div className="mt-6">
          <label className="eyebrow">Day</label>
          <div className="-mx-5 px-5 overflow-x-auto no-scrollbar">
            <div className="flex gap-2">
              {dates.map((d) => {
                const dt = new Date(d.date + "T00:00:00");
                const day = dt
                  .toLocaleDateString("en-GB", { weekday: "short" })
                  .toUpperCase();
                const num = dt.getDate();
                const active = activeDate === d.date;
                return (
                  <button
                    key={d.date}
                    onClick={() => setActiveDate(d.date)}
                    className={`shrink-0 w-[60px] h-[78px] flex flex-col items-center justify-center border ${
                      active
                        ? "bg-volt text-ink border-volt"
                        : "bg-transparent text-bone/85 border-bone/15 hover:border-volt/50"
                    }`}
                  >
                    <span
                      className={`font-mono text-[9.5px] tracking-[0.22em] ${
                        active ? "text-ink" : "text-bone/50"
                      }`}
                    >
                      {day}
                    </span>
                    <span className="font-impact text-[32px] leading-none mt-1.5">
                      {num}
                    </span>
                    <span
                      className={`font-mono text-[9px] tracking-[0.22em] mt-1 ${
                        active ? "text-ink" : "text-bone/45"
                      }`}
                    >
                      JUN
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Slot list */}
        <div className="mt-6 space-y-2.5">
          <label className="eyebrow">Shift</label>
          {slots.map((s) => {
            const sold = s.capacityNote === "SOLD_OUT";
            const few = s.capacityNote === "FEW_LEFT";
            const isSel = draft.sessionId === s.id;
            return (
              <button
                key={s.id}
                disabled={sold}
                onClick={() => setDraft({ sessionId: s.id })}
                className={`crate w-full text-left p-4 relative ${
                  isSel ? "selected" : ""
                } ${sold ? "sold" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-impact text-[18px] leading-none">
                      {s.label}
                    </div>
                    <div className="mt-1.5 font-mono text-[10.5px] tracking-[0.22em] text-bone/60">
                      {s.time} · BKK
                    </div>
                  </div>
                  <span
                    className={`font-mono text-[9.5px] tracking-[0.22em] ${
                      sold
                        ? "text-red-400"
                        : few
                        ? "text-volt"
                        : "text-bone/55"
                    }`}
                  >
                    {sold
                      ? "SOLD OUT"
                      : few
                      ? "FEW TICKETS LEFT"
                      : "OPEN"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Limits notice */}
        <div className="mt-7 border border-bone/15 p-4">
          <div className="font-mono text-[10px] tracking-[0.22em] text-bone/50">
            LIMITS
          </div>
          <ul className="mt-2 text-[12.5px] text-bone/75 space-y-1.5 leading-snug">
            <li>· {tk.perUserLimit} ticket{tk.perUserLimit > 1 ? "s" : ""} per user, per session</li>
            <li>· 1 active session reservation per user at a time</li>
            <li>· Seats are held for <span className="text-volt">10 minutes</span> after you pick</li>
          </ul>
        </div>
      </div>

      <div className="action-bar">
        {holdUntil && remaining && (
          <div className="mb-2 flex items-center justify-between font-mono text-[10px] tracking-[0.22em]">
            <span className="text-bone/55">SEAT HOLD</span>
            <span className="text-volt">{remaining} REMAINING</span>
          </div>
        )}
        <button
          disabled={!draft.sessionId}
          onClick={() => router.push("/attendee")}
          className="btn-volt"
        >
          CONTINUE TO INFO &nbsp;→
        </button>
      </div>
    </div>
  );
}

function useRemaining(target: number | null) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!target) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [target]);
  if (!target) return null;
  const ms = Math.max(0, target - now);
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
