"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TopBar, SectionHead } from "@/components/Brand";
import { PseudoQR } from "@/components/PseudoQR";
import { loadBookings } from "@/lib/store";
import { ticketById, sessionById, THB } from "@/lib/data";
import type { Booking } from "@/lib/types";

export default function MyTicketsPage() {
  const [list, setList] = useState<Booking[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    setList(loadBookings());
  }, []);

  return (
    <div className="relative pb-10">
      <TopBar back="/" title="MY TICKETS" />

      <div className="px-5 pt-6">
        <SectionHead
          title="My tickets."
          hint="Stored on this device for the POC. Real version uses an email link + booking code."
        />

        {list.length === 0 ? (
          <div className="mt-12 text-center">
            <p className="text-bone/55 font-mono text-[12px] tracking-[0.18em]">
              NO TICKETS YET
            </p>
            <Link href="/tickets" className="btn-volt mt-5 inline-flex w-auto px-6">
              RESERVE A SEAT &nbsp;→
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {list.map((b) => {
              const tk = ticketById(b.ticketTypeId)!;
              const s = sessionById(b.sessionId)!;
              const open = openId === b.id;
              const used = b.status === "checked_in";
              const cancelled =
                b.status === "cancelled" || b.status === "refunded";
              return (
                <div
                  key={b.id}
                  className={`crate relative tick-corners ${cancelled ? "sold" : ""}`}
                >
                  <span className="tc1" />
                  <span className="tc2" />

                  <button
                    className="w-full text-left p-4"
                    onClick={() => setOpenId(open ? null : b.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${tk.zoneColor}`} />
                        <span className="font-mono text-[9.5px] tracking-[0.22em] text-bone/50">
                          {tk.category} · #{b.bookingCode}
                        </span>
                      </div>
                      <span
                        className={`font-mono text-[9.5px] tracking-[0.22em] ${
                          used
                            ? "text-bone/40"
                            : cancelled
                            ? "text-red-400"
                            : "text-volt"
                        }`}
                      >
                        {used
                          ? "USED"
                          : cancelled
                          ? b.status.toUpperCase()
                          : "ACTIVE"}
                      </span>
                    </div>
                    <div className="mt-2 font-impact text-[20px] leading-none">
                      {tk.name}
                    </div>
                    <div className="mt-1.5 font-mono text-[10.5px] text-bone/60">
                      {s.label} · {s.time}
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-mono text-[10px] tracking-[0.22em] text-bone/55">
                        QTY {b.quantity} · {THB(b.totalTHB)}
                      </span>
                      <span className="font-mono text-[10px] tracking-[0.22em] text-bone/55">
                        {open ? "▴ HIDE" : "▾ QR CODE"}
                      </span>
                    </div>
                  </button>

                  {open && (
                    <div className="px-4 pb-4">
                      <div className="border-t border-bone/15 pt-4 flex flex-col items-center">
                        <PseudoQR seed={b.qrSeed} size={210} />
                        <div className="mt-3 text-center">
                          <div className="font-mono text-[10px] tracking-[0.22em] text-bone/50">
                            SHOW AT INNER GATE
                          </div>
                          <div className="mt-1 font-impact text-[16px] text-volt">
                            {b.bookingCode}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <Link href={`/cancel/${b.id}`} className="btn-ghost">
                          MANAGE
                        </Link>
                        <button
                          onClick={() => alert("Mock — calendar")}
                          className="btn-ghost"
                        >
                          + CAL
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
