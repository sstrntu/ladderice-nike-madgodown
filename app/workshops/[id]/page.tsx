"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/Brand";
import { EventArtwork } from "@/components/EventArtwork";
import { WORKSHOPS } from "@/lib/workshops";
import { ticketById, THB } from "@/lib/data";
import { useBooking } from "@/lib/context";
import { WorkshopRunRail } from "@/components/WorkshopRunRail";

export default function WorkshopDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { setDraft } = useBooking();
  const w = WORKSHOPS[params.id];
  const tk = ticketById(params.id);

  // Reachable from the home scrub calendar, the home preview rail, and the
  // /tickets funnel — so go back to wherever the user actually came from.
  // Fall back to /tickets only on a cold deep-link with no in-app history.
  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/tickets");
    }
  };

  if (!w || !tk) {
    return (
      <div className="px-5 py-10">
        <TopBar onBack={goBack} />
        <p className="mt-6 text-bone/70 font-mono text-[12px]">Workshop not found.</p>
      </div>
    );
  }

  const start = () => {
    setDraft({ ticketTypeId: tk.id, quantity: 1 });
    router.push("/schedule");
  };

  return (
    <div className="relative pb-cta">
      <WorkshopRunRail targetId="run-outline" count={w.outline.length} />
      <TopBar onBack={goBack} title="WORKSHOP" />

      {/* Hero artwork */}
      <EventArtwork
        src={tk.imageUrl}
        accent={tk.accentHex ?? "#D4FF3D"}
        aspect="hero"
        eyebrow={`${tk.category} · WITH ${w.artist.toUpperCase()}`}
        title={tk.name}
        footer={`${w.duration} · ${w.level}`}
        className="border-b border-bone/15"
      />

      <div className="px-5 pt-5">
        {/* Eyebrow + chips */}
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${tk.zoneColor}`} />
          <span className="font-mono text-[9.5px] tracking-[0.22em] text-bone/55">
            {tk.category} · {w.level}
          </span>
        </div>

        {/* Title */}
        <h1 className="mt-3 font-display italic text-[40px] leading-[0.95] tracking-tight">
          {tk.name}
        </h1>
        <div className="mt-2 font-mono text-[11px] tracking-[0.22em] text-bone/65">
          WITH · <span className="text-volt">{w.artist}</span>
        </div>
        <p className="mt-2 text-[13px] text-bone/75 italic font-display">{w.artistTagline}</p>

        {/* Stats grid */}
        <div className="mt-6 grid grid-cols-3 border border-bone/15 divide-x divide-bone/15">
          <Stat label="PRICE" value={THB(tk.priceTHB)} accent />
          <Stat label="DURATION" value={w.duration} />
          <Stat label="SEATS" value={String(tk.capacityPerSession)} />
        </div>
        <div className="grid grid-cols-3 border-x border-b border-bone/15 divide-x divide-bone/15">
          <Stat label="LEVEL" value={w.level} />
          <Stat label="LANGUAGE" value={w.language} />
          <Stat label="VENUE" value="SONGWAT" />
        </div>

        {/* Take-home */}
        <Block title="What you take home">
          <p className="text-[13.5px] text-bone/85 leading-snug">{w.takeHome}</p>
        </Block>

        {/* Outline */}
        <Block title="The 2-hour run">
          <ol id="run-outline" className="space-y-3">
            {w.outline.map((step, i) => (
              <li
                key={i}
                data-step
                className="run-step grid grid-cols-[auto_1fr] gap-3 items-start"
              >
                <span className="run-step-time font-mono text-[10.5px] tracking-[0.18em] pt-0.5 whitespace-nowrap">
                  {step.time}
                </span>
                <span className="text-[13px] text-bone/80 leading-snug">{step.title}</span>
              </li>
            ))}
          </ol>
        </Block>

        {/* Materials */}
        <Block title="On the table">
          <ul className="text-[13px] text-bone/80 space-y-1.5 leading-snug">
            {w.materials.map((m) => <li key={m}>· {m}</li>)}
          </ul>
        </Block>

        {/* Prereqs */}
        <Block title="Come prepared">
          <ul className="text-[13px] text-bone/80 space-y-1.5 leading-snug">
            {w.prereqs.map((m) => <li key={m}>· {m}</li>)}
          </ul>
        </Block>

        {/* Why it matters */}
        <Block title="Why it matters">
          <p className="text-[13px] text-bone/80 italic font-display leading-snug">
            “{w.whyItMatters}”
          </p>
        </Block>

        <div className="mt-8 text-center">
          <Link href="/tickets" className="font-mono text-[10.5px] tracking-[0.22em] text-bone/55 hover:text-volt">
            ← BACK TO TICKETS
          </Link>
        </div>
      </div>

      <div className="action-bar">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[10px] tracking-[0.22em] text-bone/55">
            {tk.name}
          </span>
          <span className="font-display text-[20px] text-volt leading-none">{THB(tk.priceTHB)}</span>
        </div>
        <button onClick={start} disabled={tk.soldOut} className="btn-volt">
          {tk.soldOut ? "SOLD OUT" : "RESERVE THIS WORKSHOP  →"}
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="p-3">
      <div className="font-mono text-[9.5px] tracking-[0.22em] text-bone/45">{label}</div>
      <div className={`mt-1 font-impact text-[15px] leading-tight ${accent ? "text-volt" : "text-bone"}`}>
        {value}
      </div>
    </div>
  );
}
function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="font-display italic text-[22px] leading-none">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
