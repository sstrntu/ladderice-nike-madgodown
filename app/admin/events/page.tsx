"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TopBar, SectionHead } from "@/components/Brand";
import { loadEvents, type CmsEvent } from "@/lib/eventsStore";

export default function EventsListPage() {
  const [list, setList] = useState<CmsEvent[]>([]);
  useEffect(() => { setList(loadEvents()); }, []);

  return (
    <div className="relative pb-10">
      <TopBar back="/admin" title="EVENTS" />

      <div className="px-5 pt-6">
        <div className="flex items-end justify-between">
          <SectionHead eyebrow="CMS" title="Events." hint="Drafts and published events. Add one for the next drop." />
          <Link href="/admin/events/new" className="font-mono text-[10.5px] tracking-[0.22em] text-volt shrink-0 pb-1">
            + NEW EVENT
          </Link>
        </div>

        {list.length === 0 ? (
          <div className="mt-10 border border-dashed border-bone/20 p-6 text-center">
            <div className="font-mono text-[10px] tracking-[0.22em] text-bone/45">EMPTY</div>
            <p className="mt-2 text-[13px] text-bone/75 leading-snug">
              No events yet. Mad Godown is hard-coded in <code className="font-mono text-volt text-[11.5px]">lib/data.ts</code>;
              new drops live here.
            </p>
            <Link href="/admin/events/new" className="btn-volt mt-5 inline-flex w-auto px-6">
              CREATE FIRST EVENT
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {list.map((e) => (
              <Link
                key={e.id}
                href={`/admin/events/${e.id}`}
                className="block border border-bone/15 p-4 hover:border-volt/50"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9.5px] tracking-[0.22em] text-bone/50">
                    {e.id}
                  </span>
                  <span className={`font-mono text-[9.5px] tracking-[0.22em] ${
                    e.status === "PUBLISHED" ? "text-volt"
                    : e.status === "DRAFT" ? "text-bone/55" : "text-red-400"
                  }`}>
                    {e.status}
                  </span>
                </div>
                <div className="mt-1.5 font-impact text-[18px] leading-tight">{e.name}</div>
                <div className="mt-1 font-mono text-[10.5px] text-bone/60">
                  {e.dateRange.from} → {e.dateRange.to} · {e.venueLabel}
                </div>
                <div className="mt-2 flex items-center gap-3 font-mono text-[10px] tracking-[0.18em] text-bone/55">
                  <span>{e.ticketTypes.length} TICKETS</span>
                  <span>·</span>
                  <span>{e.sessions.length} SESSIONS</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <Link href="/admin" className="block mt-8 font-mono text-[10.5px] tracking-[0.22em] text-bone/45 hover:text-volt">
          ← BACK TO DASHBOARD
        </Link>
      </div>
    </div>
  );
}
