"use client";
import { useState } from "react";
import Link from "next/link";
import { TopBar } from "@/components/Brand";
import { PseudoQR } from "@/components/PseudoQR";
import { EventArtwork } from "@/components/EventArtwork";
import { loadBookings } from "@/lib/store";
import { ticketById, sessionById, THB } from "@/lib/data";
import type { Booking } from "@/lib/types";

export default function LookupPage() {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [found, setFound] = useState<Booking | null>(null);

  const normCode = code.trim().toUpperCase().replace(/^MG-?/, "");
  const valid =
    /^[A-Z0-9]{6}$/.test(normCode) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const lookup = () => {
    setErr(null);
    if (!valid) {
      setErr("Enter a valid code (e.g. MG-K3X9P2) and the email used at checkout.");
      return;
    }
    const all = loadBookings();
    const match = all.find(
      (b) =>
        b.bookingCode.replace(/^MG-?/, "").toUpperCase() === normCode &&
        b.attendee.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (!match) {
      setErr("No booking matches that code + email. Check your confirmation email.");
      return;
    }
    setFound(match);
  };

  const reset = () => {
    setFound(null);
    setCode("");
    setEmail("");
    setErr(null);
  };

  return (
    <div className="relative pb-10">
      <TopBar back="/" title="LOOK UP TICKET" />

      <div className="px-5 pt-6">
        <div className="font-mono text-[10px] tracking-[0.32em] text-bone/55">
          GUEST CHECKOUT · NO ACCOUNT NEEDED
        </div>
        <h1 className="mt-3 font-display italic text-[36px] leading-[0.95] tracking-tight">
          Find your ticket.
        </h1>
        <p className="mt-2 text-[13px] text-bone/65 font-mono leading-snug">
          Enter the booking code from your confirmation email and the email
          you bought with. We&apos;ll show your QR.
        </p>

        {!found ? (
          <>
            <div className="mt-7 space-y-4">
              <div>
                <label className="eyebrow">Booking code</label>
                <input
                  className="input uppercase tracking-[0.3em] text-center"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="MG-K3X9P2"
                  autoFocus
                />
                <div className="mt-1 font-mono text-[10px] tracking-[0.18em] text-bone/40">
                  Format: MG-XXXXXX
                </div>
              </div>
              <div>
                <label className="eyebrow">Email at checkout</label>
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@somewhere.com"
                />
              </div>

              <button
                onClick={lookup}
                disabled={!valid}
                className="btn-volt"
              >
                LOOK UP &nbsp;→
              </button>

              {err && (
                <div className="font-mono text-[10.5px] tracking-[0.18em] text-red-400">
                  ! {err}
                </div>
              )}
            </div>

            <div className="mt-10 border border-bone/15 p-4">
              <div className="font-mono text-[10px] tracking-[0.22em] text-bone/55">
                LOST YOUR EMAIL?
              </div>
              <p className="mt-2 text-[12.5px] text-bone/75 leading-snug">
                Check the spam folder for &quot;Mad Godown&quot;. Still nothing?
                Reply to any of our channels with your full name and date of
                purchase — we&apos;ll resend.
              </p>
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/my-tickets"
                className="font-mono text-[10.5px] tracking-[0.22em] text-bone/55 hover:text-volt"
              >
                BOUGHT ON THIS DEVICE? SEE THIS DEVICE&apos;S TICKETS →
              </Link>
            </div>
          </>
        ) : (
          <FoundTicket booking={found} onReset={reset} />
        )}
      </div>
    </div>
  );
}

function FoundTicket({
  booking,
  onReset,
}: {
  booking: Booking;
  onReset: () => void;
}) {
  const tk = ticketById(booking.ticketTypeId)!;
  const s = sessionById(booking.sessionId)!;

  return (
    <div className="mt-7">
      <div className="tape inline-block">MATCH FOUND</div>

      <div className="mt-5 border border-volt/40 p-4 bg-dirt/40 relative tick-corners">
        <span className="tc1" />
        <span className="tc2" />
        <div className="flex items-start gap-4">
          <PseudoQR seed={booking.qrSeed} size={148} />
          <div className="flex-1 min-w-0">
            <EventArtwork
              src={tk.imageUrl}
              accent={tk.accentHex ?? "#D4FF3D"}
              aspect="thumb"
              bare
              className="w-full mb-3 border border-bone/15"
            />
            <div className="font-mono text-[9.5px] tracking-[0.22em] text-bone/50">
              TICKET · #{booking.bookingCode}
            </div>
            <div className="mt-1 font-impact text-[18px] leading-tight truncate">
              {tk.name}
            </div>
            <div className="font-mono text-[10px] text-bone/55">
              ×{booking.quantity}
            </div>
            <div className="mt-2 font-mono text-[10px] tracking-[0.22em] text-bone/50">
              SHIFT
            </div>
            <div className="font-display text-volt text-[15px] leading-tight">
              {s.label}
            </div>
            <div className="font-mono text-[10px] text-bone/55">{s.time}</div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={() => alert("Mock — would download PDF")}
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

      <div className="mt-5 grid grid-cols-2 gap-2">
        <button onClick={onReset} className="btn-ghost">
          LOOK UP ANOTHER
        </button>
        <Link href={`/cancel/${booking.id}`} className="btn-ghost">
          MANAGE
        </Link>
      </div>
    </div>
  );
}
