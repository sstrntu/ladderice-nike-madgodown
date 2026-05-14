"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TopBar } from "@/components/Brand";
import { PseudoQR } from "@/components/PseudoQR";
import { getBooking } from "@/lib/store";
import { ticketById, sessionById, THB } from "@/lib/data";
import type { Booking } from "@/lib/types";

export default function ConfirmationPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [b, setB] = useState<Booking | null>(null);

  useEffect(() => {
    setB(getBooking(id) ?? null);
  }, [id]);

  if (!b) {
    return (
      <div className="px-5 py-10">
        <TopBar back="/" />
        <p className="mt-6 text-bone/70 font-mono text-[12px]">
          Booking not found.
        </p>
      </div>
    );
  }
  const tk = ticketById(b.ticketTypeId)!;
  const s = sessionById(b.sessionId)!;

  return (
    <div className="relative pb-12">
      <TopBar back="/" title="CONFIRMED" />

      <div className="px-5 pt-6">
        <div className="flex items-center gap-3">
          <span className="tape">CONFIRMED</span>
          <span className="font-mono text-[10px] tracking-[0.22em] text-bone/55">
            CODE · {b.bookingCode}
          </span>
        </div>

        <h1 className="mt-5 font-display italic text-[40px] leading-[0.95] tracking-tight">
          You&apos;re in.
          <br />
          Now find it.
        </h1>
        <p className="mt-2 text-[13px] text-bone/65 font-mono leading-snug">
          An email is on its way. The address drops 24h before the shift.
        </p>
      </div>

      {/* QR + ticket card */}
      <div className="mx-5 mt-6 border border-volt/40 p-4 bg-dirt/40 relative tick-corners">
        <span className="tc1" />
        <span className="tc2" />
        <div className="flex items-start gap-4">
          <PseudoQR seed={b.qrSeed} size={148} />
          <div className="flex-1 min-w-0">
            <div className="font-mono text-[9.5px] tracking-[0.22em] text-bone/50">
              TICKET
            </div>
            <div className="mt-1 font-impact text-[20px] leading-tight truncate">
              {tk.name}
            </div>
            <div className="font-mono text-[10px] text-bone/55">×{b.quantity}</div>

            <div className="mt-3 font-mono text-[9.5px] tracking-[0.22em] text-bone/50">
              SHIFT
            </div>
            <div className="mt-0.5 font-display text-[15px] text-volt leading-tight">
              {s.label}
            </div>
            <div className="font-mono text-[10px] text-bone/55">{s.time}</div>

            <div className="mt-3 font-mono text-[9.5px] tracking-[0.22em] text-bone/50">
              PAID
            </div>
            <div className="mt-0.5 font-display text-[18px] text-bone leading-none">
              {THB(b.totalTHB)}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={() => alert("Mock — would download ticket PDF")}
            className="btn-ghost"
          >
            DOWNLOAD
          </button>
          <button
            onClick={() => alert("Mock — would add to calendar")}
            className="btn-ghost"
          >
            + CALENDAR
          </button>
        </div>
      </div>

      {/* Check-in instructions */}
      <div className="mx-5 mt-6 border border-bone/15 p-4">
        <div className="font-mono text-[10px] tracking-[0.22em] text-bone/50">
          HOW TO CHECK IN
        </div>
        <ol className="mt-3 space-y-3">
          {[
            "Get to Songwat. Follow MAD GOALDOWN signs in the alleys.",
            "Inner Gate — show your QR + matching ID to the supervisor.",
            "Play the game. Pick a sticker pack. You're in.",
          ].map((step, i) => (
            <li key={i} className="flex gap-4 items-start">
              <span className="font-impact text-volt text-[16px] leading-none w-7 shrink-0 pt-0.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[13px] text-bone/85 leading-snug">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="px-5 mt-6 grid grid-cols-2 gap-2">
        <Link href="/my-tickets" className="btn-volt">
          MY TICKETS
        </Link>
        <Link href={`/cancel/${b.id}`} className="btn-ghost">
          MANAGE / CANCEL
        </Link>
      </div>

      <Link
        href="/"
        className="block mt-6 mb-4 font-mono text-[10px] tracking-[0.22em] text-bone/40 hover:text-volt text-center"
      >
        ← BACK TO LANDING
      </Link>
    </div>
  );
}
