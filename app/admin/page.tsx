"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { TopBar, SectionHead } from "@/components/Brand";
import {
  loadBookings, saveBookings, upsertBooking, makeCode, makeId,
} from "@/lib/store";
import { TICKET_TYPES, SESSIONS, ticketById, sessionById, THB } from "@/lib/data";
import type { Booking } from "@/lib/types";

type Filter = "all" | "confirmed" | "cancelled" | "refunded" | "checked_in";

export default function AdminPage() {
  const [list, setList] = useState<Booking[]>([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const refresh = () => setList(loadBookings());
  useEffect(() => { refresh(); }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return list.filter((b) => {
      const tk = ticketById(b.ticketTypeId);
      const hay = `${b.bookingCode} ${b.attendee.fullName} ${b.attendee.email} ${tk?.name ?? ""}`.toLowerCase();
      if (term && !hay.includes(term)) return false;
      if (filter !== "all" && b.status !== filter) return false;
      return true;
    });
  }, [list, q, filter]);

  const inv = TICKET_TYPES.map((t) => {
    const sold = list
      .filter(
        (b) =>
          b.ticketTypeId === t.id &&
          (b.status === "confirmed" || b.status === "checked_in")
      )
      .reduce((sum, b) => sum + b.quantity, 0);
    const cap = t.capacityPerSession * SESSIONS.length;
    return {
      tk: t,
      sold,
      cap,
      pct: cap === 0 ? 0 : Math.min(100, Math.round((sold / cap) * 100)),
    };
  });

  const rev = list
    .filter((b) => b.status === "confirmed" || b.status === "checked_in")
    .reduce((s, b) => s + b.totalTHB, 0);
  const paid = list.filter(
    (b) => b.status === "confirmed" || b.status === "checked_in"
  ).length;
  const refunded = list.filter((b) => b.status === "refunded").length;
  const checkedIn = list.filter((b) => b.status === "checked_in").length;

  const checkIn = (b: Booking) => {
    upsertBooking({ ...b, status: "checked_in" });
    refresh();
  };
  const cancel = (b: Booking) => {
    upsertBooking({ ...b, status: "cancelled" });
    refresh();
  };

  const seedDemo = () => {
    const demo: Booking[] = [
      mkBooking("hunter", SESSIONS[0].id, 2, "John Smith", "john@example.com", "confirmed"),
      mkBooking("earlybird", SESSIONS[0].id, 1, "Anna Lee", "anna@example.com", "confirmed"),
      mkBooking("silk-stitch", SESSIONS[3].id, 1, "Michael Brown", "mb@example.com", "checked_in"),
      mkBooking("fashion-show", SESSIONS[0].id, 2, "Sophia Davis", "sd@example.com", "confirmed"),
      mkBooking("supply-chain", SESSIONS[2].id, 1, "David Wilson", "dw@example.com", "confirmed"),
      mkBooking("crew-group", SESSIONS[5].id, 1, "Crew Five", "crew@example.com", "refunded"),
    ];
    saveBookings([...demo, ...list]);
    refresh();
  };

  const wipe = () => {
    if (!confirm("Wipe all bookings on this device?")) return;
    saveBookings([]);
    refresh();
  };

  const exportCsv = () => {
    const rows = [
      ["BookingCode", "Status", "Ticket", "Session", "Qty", "Total", "Name", "Email", "Phone", "Created"].join(","),
      ...list.map((b) => {
        const tk = ticketById(b.ticketTypeId)!;
        const s = sessionById(b.sessionId)!;
        return [
          b.bookingCode, b.status, tk.name, s.label + " " + s.time,
          b.quantity, b.totalTHB, b.attendee.fullName, b.attendee.email,
          b.attendee.phone, new Date(b.createdAt).toISOString(),
        ]
          .map((x) => `"${String(x).replace(/"/g, '""')}"`)
          .join(",");
      }),
    ].join("\n");
    const blob = new Blob([rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "madgodown-bookings.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative pb-12">
      <TopBar back="/" title="ORGANIZER · ADMIN" />

      <div className="px-5 pt-6">
        <SectionHead title="Dashboard." />

        {/* CMS / Tools row */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          <Link href="/admin/events" className="border border-bone/15 p-3 hover:border-volt/50">
            <div className="font-mono text-[10px] tracking-[0.22em] text-bone/50">CMS</div>
            <div className="mt-1 font-impact text-[15px] leading-tight">EVENTS</div>
          </Link>
          <Link href="/admin/preview/emails" className="border border-bone/15 p-3 hover:border-volt/50">
            <div className="font-mono text-[10px] tracking-[0.22em] text-bone/50">DESIGN</div>
            <div className="mt-1 font-impact text-[15px] leading-tight">EMAILS</div>
          </Link>
          <Link href="/admin/preview/receipt" className="border border-bone/15 p-3 hover:border-volt/50">
            <div className="font-mono text-[10px] tracking-[0.22em] text-bone/50">DESIGN</div>
            <div className="mt-1 font-impact text-[15px] leading-tight">RECEIPT</div>
          </Link>
        </div>

        {/* KPIs */}
        <div className="mt-6 grid grid-cols-2 gap-2">
          <Kpi label="REVENUE" value={THB(rev)} accent />
          <Kpi label="PAID BOOKINGS" value={String(paid)} />
          <Kpi label="CHECKED IN" value={String(checkedIn)} />
          <Kpi label="REFUNDED" value={String(refunded)} />
        </div>

        {/* Inventory */}
        <div className="mt-8">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="font-display italic text-[22px] leading-none">
              Ticket inventory
            </h2>
            <span className="font-mono text-[10px] tracking-[0.22em] text-bone/45">
              {TICKET_TYPES.length} TYPES
            </span>
          </div>
          <div className="space-y-2">
            {inv.map(({ tk, sold, cap, pct }) => (
              <Link key={tk.id} href="/admin/events" className="block border border-bone/15 hover:border-volt/40 p-3 transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`h-2 w-2 rounded-full ${tk.zoneColor} shrink-0`} />
                    <span className="font-impact text-[15px] truncate">{tk.name}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-[10px] tracking-[0.18em] text-bone/65">
                      {sold} / {cap} · {pct}%
                    </span>
                    <span className="font-mono text-[9.5px] tracking-[0.18em] text-bone/35">EDIT →</span>
                  </div>
                </div>
                <div className="mt-2 h-[4px] bg-bone/10">
                  <div className="h-full bg-volt" style={{ width: `${pct}%` }} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Bookings header */}
        <div className="mt-9 flex items-baseline justify-between">
          <h2 className="font-display italic text-[22px] leading-none">Bookings</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={seedDemo}
              className="font-mono text-[10px] tracking-[0.22em] text-volt hover:underline"
            >
              + SEED
            </button>
            <button
              onClick={exportCsv}
              className="font-mono text-[10px] tracking-[0.22em] text-bone/70 hover:text-volt"
            >
              EXPORT CSV
            </button>
            <button
              onClick={wipe}
              className="font-mono text-[10px] tracking-[0.22em] text-red-400 hover:underline"
            >
              WIPE
            </button>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
          <input
            className="input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name / email / code"
          />
          <select
            className="input !w-auto pr-3"
            value={filter}
            onChange={(e) => setFilter(e.target.value as Filter)}
          >
            <option value="all">ALL</option>
            <option value="confirmed">CONFIRMED</option>
            <option value="checked_in">CHECKED IN</option>
            <option value="cancelled">CANCELLED</option>
            <option value="refunded">REFUNDED</option>
          </select>
        </div>

        {/* List */}
        <div className="mt-4 space-y-2">
          {filtered.length === 0 ? (
            <p className="text-bone/55 font-mono text-[11.5px] tracking-[0.18em] mt-6">
              NO BOOKINGS MATCH.
            </p>
          ) : (
            filtered.map((b) => {
              const tk = ticketById(b.ticketTypeId)!;
              const s = sessionById(b.sessionId)!;
              return (
                <div key={b.id} className="border border-bone/15 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-mono text-[9.5px] tracking-[0.22em] text-bone/50">
                        #{b.bookingCode}
                      </div>
                      <div className="mt-1 font-impact text-[16px] leading-tight truncate">
                        {tk.name}
                      </div>
                      <div className="mt-0.5 font-mono text-[10.5px] text-bone/60">
                        {s.label}
                      </div>
                      <div className="mt-1 font-mono text-[10.5px] text-bone/75 truncate">
                        {b.attendee.fullName} · {b.attendee.email}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div
                        className={`font-mono text-[9.5px] tracking-[0.22em] ${
                          b.status === "confirmed"
                            ? "text-volt"
                            : b.status === "checked_in"
                            ? "text-bone/55"
                            : "text-red-400"
                        }`}
                      >
                        {b.status.toUpperCase().replace("_", " ")}
                      </div>
                      <div className="mt-1 font-display text-[18px] text-bone leading-none">
                        {THB(b.totalTHB)}
                      </div>
                      <div className="mt-0.5 font-mono text-[10px] text-bone/55">
                        ×{b.quantity}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    {b.status === "confirmed" && (
                      <button onClick={() => checkIn(b)} className="btn-ghost compact">
                        CHECK IN
                      </button>
                    )}
                    {(b.status === "confirmed" || b.status === "checked_in") && (
                      <button onClick={() => cancel(b)} className="btn-ghost compact">
                        CANCEL
                      </button>
                    )}
                    <Link href={`/cancel/${b.id}`} className="btn-ghost compact">
                      MANAGE
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function Kpi({
  label, value, accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="border border-bone/15 p-3">
      <div className="font-mono text-[10px] tracking-[0.22em] text-bone/50">
        {label}
      </div>
      <div
        className={`mt-1.5 font-display ${
          accent ? "text-volt" : "text-bone"
        } text-[22px] leading-none truncate`}
      >
        {value}
      </div>
    </div>
  );
}

function mkBooking(
  ticketTypeId: string, sessionId: string, qty: number,
  name: string, email: string, status: Booking["status"]
): Booking {
  const tk = ticketById(ticketTypeId)!;
  const id = makeId();
  return {
    id,
    bookingCode: makeCode(),
    ticketTypeId,
    sessionId,
    quantity: qty,
    totalTHB: tk.priceTHB * qty + (tk.priceTHB === 0 ? 0 : 45),
    attendee: { fullName: name, email, phone: "081 234 5678", guests: qty },
    status,
    createdAt: Date.now() - Math.floor(Math.random() * 86_400_000 * 7),
    qrSeed: id + "-" + Math.random().toString(36).slice(2),
  };
}
