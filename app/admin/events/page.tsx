"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TopBar, SectionHead } from "@/components/Brand";
import { EventArtwork } from "@/components/EventArtwork";
import { loadEvents, type CmsEvent } from "@/lib/eventsStore";

export default function EventsListPage() {
  const [list, setList] = useState<CmsEvent[]>([]);
  useEffect(() => { setList(loadEvents()); }, []);

  return (
    <div className="relative pb-10">
      <TopBar back="/admin" title="WORKSHOPS" />

      <div className="px-5 pt-6">
        <div className="flex items-end justify-between">
          <SectionHead eyebrow="CMS" title="Workshops." hint="Drafts and published workshops. Add one for the next drop." />
          <Link href="/admin/events/new" className="font-mono text-[10.5px] tracking-[0.22em] text-volt shrink-0 pb-1">
            + NEW WORKSHOP
          </Link>
        </div>

        {list.length === 0 ? (
          <div className="mt-10 border border-dashed border-bone/20 p-6 text-center">
            <div className="font-mono text-[10px] tracking-[0.22em] text-bone/45">EMPTY</div>
            <p className="mt-2 text-[13px] text-bone/75 leading-snug">
              No workshops yet. Mad Godown is hard-coded in <code className="font-mono text-volt text-[11.5px]">lib/data.ts</code>;
              new drops live here.
            </p>
            <Link href="/admin/events/new" className="btn-volt mt-5 inline-flex w-auto px-6">
              CREATE FIRST WORKSHOP
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {list.map((e) => (
              <Link
                key={e.id}
                href={`/admin/events/${e.id}`}
                className="block border border-bone/15 hover:border-volt/50 overflow-hidden"
              >
                <div className="grid grid-cols-[96px_1fr]">
                  <EventArtwork
                    src={e.posterUrl || e.heroUrl}
                    accent={e.accentHex ?? "#D4FF3D"}
                    aspect="thumb"
                    title={e.shortName || e.name}
                    bare={!!e.posterUrl || !!e.heroUrl}
                    className="border-r border-bone/15"
                  />
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9.5px] tracking-[0.22em] text-bone/50 truncate">
                        {e.id}
                      </span>
                      <span className={`font-mono text-[9.5px] tracking-[0.22em] shrink-0 ${
                        e.status === "PUBLISHED" ? "text-volt"
                        : e.status === "DRAFT" ? "text-bone/55" : "text-red-400"
                      }`}>
                        {e.status}
                      </span>
                    </div>
                    <div className="mt-1 font-impact text-[16px] leading-tight truncate">{e.name}</div>
                    <div className="mt-1 font-mono text-[10px] text-bone/55 truncate">
                      {e.dateRange.from} → {e.dateRange.to}
                    </div>
                    <div className="mt-1.5 flex items-center gap-2 font-mono text-[9.5px] tracking-[0.18em] text-bone/55">
                      <span>{e.ticketTypes.length}T</span>
                      <span>·</span>
                      <span>{e.sessions.length}S</span>
                      {(e.gallery?.length ?? 0) > 0 && (<><span>·</span><span>{e.gallery?.length}📷</span></>)}
                    </div>
                  </div>
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
