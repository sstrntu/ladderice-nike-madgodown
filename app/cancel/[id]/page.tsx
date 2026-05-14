"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TopBar, SectionHead } from "@/components/Brand";
import { getBooking, upsertBooking } from "@/lib/store";
import { ticketById, sessionById, THB } from "@/lib/data";
import type { Booking } from "@/lib/types";

type Mode = "cancel" | "refund" | "transfer";

export default function CancelPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [b, setB] = useState<Booking | null>(null);
  const [mode, setMode] = useState<Mode>("cancel");
  const [transferEmail, setTransferEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setB(getBooking(id) ?? null);
  }, [id]);

  if (!b) {
    return (
      <div className="px-5 py-10">
        <TopBar back="/my-tickets" />
        <p className="mt-6 text-bone/70 font-mono text-[12px]">
          Booking not found.
        </p>
      </div>
    );
  }
  const tk = ticketById(b.ticketTypeId)!;
  const s = sessionById(b.sessionId)!;

  const daysOut = Math.max(
    0,
    Math.ceil((new Date(s.date).getTime() - Date.now()) / 86_400_000)
  );
  const refundPct = daysOut >= 7 ? 80 : daysOut >= 3 ? 40 : 0;
  const refundAmount = Math.round((b.totalTHB * refundPct) / 100);
  const cancellable = b.status === "confirmed";

  const apply = () => {
    if (!cancellable) return;
    const next: Booking = { ...b };
    if (mode === "cancel") next.status = "cancelled";
    if (mode === "refund") next.status = "refunded";
    if (mode === "transfer") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(transferEmail)) return;
      next.attendee = {
        ...next.attendee,
        email: transferEmail,
        fullName: "Transferred — TBC",
      };
    }
    upsertBooking(next);
    setB(next);
    setSubmitted(true);
  };

  return (
    <div className="relative pb-10">
      <TopBar back="/my-tickets" title="MANAGE BOOKING" />

      <div className="px-5 pt-6">
        <SectionHead
          title="Manage."
          hint="Refunds depend on the event policy. Admin may need to approve."
        />

        {/* Booking summary */}
        <div className="mt-5 border border-bone/15 p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9.5px] tracking-[0.22em] text-bone/50">
              {tk.category} · #{b.bookingCode}
            </span>
            <span
              className={`font-mono text-[9.5px] tracking-[0.22em] ${
                b.status === "confirmed" ? "text-volt" : "text-red-400"
              }`}
            >
              {b.status.toUpperCase().replace("_", " ")}
            </span>
          </div>
          <div className="mt-2 font-impact text-[22px] leading-none">{tk.name}</div>
          <div className="mt-1.5 font-mono text-[11px] text-bone/60">
            {s.label} · {s.time}
          </div>
          <div className="mt-2 font-display text-volt text-[20px] leading-none">
            {THB(b.totalTHB)}
          </div>
        </div>

        {submitted ? (
          <div className="mt-6 border border-volt/40 p-4 bg-dirt/40">
            <div className="font-mono text-[10px] tracking-[0.22em] text-volt">
              REQUEST SUBMITTED
            </div>
            <p className="mt-2 text-[13px] text-bone/85 leading-snug">
              {mode === "refund"
                ? `Refund request for ${THB(refundAmount)} (${refundPct}%) — pending admin approval.`
                : mode === "cancel"
                ? "Booking cancelled. The seat is back in the inventory pool if the type allows."
                : `Transfer pending to ${transferEmail}.`}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link href="/my-tickets" className="btn-volt">
                MY TICKETS
              </Link>
              <Link href="/" className="btn-ghost">
                HOME
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Mode tabs */}
            <div className="mt-6 grid grid-cols-3 gap-2">
              {(["cancel", "refund", "transfer"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`btn-ghost ${
                    mode === m ? "!border-volt !text-volt" : ""
                  }`}
                >
                  {m.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="mt-5 border border-bone/15 p-4">
              {mode === "cancel" && (
                <>
                  <div className="font-mono text-[10px] tracking-[0.22em] text-bone/50">
                    CANCEL BOOKING
                  </div>
                  <p className="mt-2 text-[13px] text-bone/80 leading-snug">
                    No refund. Your seat returns to inventory only if the ticket type allows.
                  </p>
                </>
              )}
              {mode === "refund" && (
                <>
                  <div className="font-mono text-[10px] tracking-[0.22em] text-bone/50">
                    REFUND REQUEST
                  </div>
                  <ul className="mt-2 text-[12.5px] text-bone/80 space-y-1.5 leading-snug">
                    <li>· ≥ 7 days out: 80% refund</li>
                    <li>· 3–6 days out: 40% refund</li>
                    <li>· &lt; 3 days out: no refund</li>
                  </ul>
                  <div className="mt-3 pt-3 border-t border-bone/15 flex items-center justify-between">
                    <span className="font-mono text-[10.5px] tracking-[0.22em] text-bone/55">
                      DAYS OUT
                    </span>
                    <span className="font-impact text-[18px] text-volt leading-none">
                      {daysOut}
                    </span>
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="font-mono text-[10.5px] tracking-[0.22em] text-bone/55">
                      REFUND
                    </span>
                    <span className="font-display text-[20px] text-volt leading-none">
                      {THB(refundAmount)}{" "}
                      <span className="font-mono text-[10px] text-bone/55 ml-1">
                        ({refundPct}%)
                      </span>
                    </span>
                  </div>
                </>
              )}
              {mode === "transfer" && (
                <>
                  <div className="font-mono text-[10px] tracking-[0.22em] text-bone/50">
                    TRANSFER TICKET
                  </div>
                  <p className="mt-2 text-[13px] text-bone/80 leading-snug">
                    Only allowed for HUNTER and CREW tickets. Receiver must show their ID at the gate.
                  </p>
                  <label className="eyebrow mt-4">Receiver email</label>
                  <input
                    className="input"
                    type="email"
                    value={transferEmail}
                    onChange={(e) => setTransferEmail(e.target.value)}
                    placeholder="friend@yo.com"
                  />
                </>
              )}
            </div>

            <button
              disabled={!cancellable || (mode === "transfer" && !transferEmail)}
              onClick={apply}
              className="btn-volt mt-5"
            >
              {mode === "cancel"
                ? "CONFIRM CANCEL"
                : mode === "refund"
                ? "REQUEST REFUND"
                : "SEND TRANSFER"}
            </button>
            {!cancellable && (
              <p className="mt-2 font-mono text-[10.5px] text-red-400 tracking-[0.22em]">
                BOOKING IS NOT IN AN EDITABLE STATE
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
