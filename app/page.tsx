import Link from "next/link";
import { BrandMark } from "@/components/Brand";
import { EVENT, TICKET_TYPES, THB } from "@/lib/data";
import { HeaderNav } from "@/components/HeaderNav";

export default function Landing() {
  return (
    <div className="relative">
      {/* HEADER */}
      <header className="px-5 h-14 flex items-center justify-between border-b border-bone/10">
        <BrandMark />
        <HeaderNav />
      </header>

      {/* MARQUEE */}
      <div className="border-b border-bone/10 overflow-hidden">
        <div className="ticker py-2 font-mono text-[10.5px] tracking-[0.22em] text-volt">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="flex gap-9">
              <span>● MAD GODOWN BKK 26</span>
              <span>● 11 — 21 JUN</span>
              <span>● SONGWAT · 狂仓</span>
              <span>● DON&apos;T GIVE OUT THE ADDRESS</span>
              <span>● LET THE HUNTERS SEARCH</span>
              <span>● WORLD CUP 26</span>
              <span>● TIER 1 — ENG · BRA · FRA</span>
            </span>
          ))}
        </div>
      </div>

      {/* HERO */}
      <section className="px-5 pt-6">
        <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.22em] text-bone/45">
          <span>{EVENT.hero.coords}</span>
          <span>{EVENT.hero.season}</span>
        </div>

        <h1 className="mt-5 font-display italic tracking-[-0.01em] text-bone leading-none whitespace-nowrap text-[68px]">
          BANGKOK
        </h1>

        <div className="mt-3 flex items-baseline gap-3">
          <span className="font-impact text-volt text-[44px] leading-none">MAD</span>
          <span className="font-impact text-bone text-[44px] leading-none">GODOWN</span>
          <span className="font-mono text-volt text-[11px] tracking-[0.24em] ml-1 self-end pb-1">
            ’26
          </span>
        </div>

        <div className="mt-3 font-mono text-[11.5px] text-bone/65 tracking-[0.22em]">
          {EVENT.thaiName} · {EVENT.chineseName} · BKK
        </div>

        {/* Shipping-label panel */}
        <div className="mt-7 grid grid-cols-2 border border-bone/15">
          <div className="p-4 border-r border-bone/15">
            <div className="font-mono text-[9.5px] tracking-[0.24em] text-bone/45">
              DATE / TIME
            </div>
            <div className="mt-2 font-impact text-volt text-[22px] leading-none">
              {EVENT.dateLabel}
            </div>
            <div className="mt-1.5 font-mono text-[10.5px] text-bone/55 tracking-[0.16em]">
              10 NIGHTS · BKK
            </div>
          </div>
          <div className="p-4">
            <div className="font-mono text-[9.5px] tracking-[0.24em] text-bone/45">
              VENUE
            </div>
            <div className="mt-2 font-impact text-bone text-[22px] leading-none">
              {EVENT.venueLabel}
            </div>
            <div className="mt-1.5 font-mono text-[10.5px] text-bone/55 tracking-[0.16em]">
              ADDRESS HIDDEN&nbsp;↘
            </div>
          </div>
        </div>

        {/* description */}
        <p className="mt-6 text-[14px] leading-[1.55] text-bone/80">
          <span className="tape">NOT A POP-UP</span>{" "}
          {EVENT.description}
        </p>

        {/* venue hint */}
        <div className="mt-5 border-l-2 border-volt pl-3 text-[12.5px] text-bone/70 italic font-display leading-snug">
          “{EVENT.venueHint}”
        </div>

        {/* CTAs */}
        <div className="mt-8 space-y-2.5">
          <Link href="/tickets" className="btn-volt">
            RESERVE A SEAT &nbsp;→
          </Link>
          <Link href="/tickets" className="btn-ghost">
            BOOK MEDIA DAY · 11 JUN
          </Link>
        </div>
      </section>

      {/* TICKETS PREVIEW */}
      <section className="mt-12">
        <div className="px-5 flex items-baseline justify-between mb-4">
          <h2 className="font-display italic text-[28px] leading-none">The tickets</h2>
          <Link
            href="/tickets"
            className="font-mono text-[10px] tracking-[0.22em] text-volt"
          >
            VIEW ALL &nbsp;→
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-3">
          {TICKET_TYPES.slice(0, 5).map((t) => (
            <Link
              href="/tickets"
              key={t.id}
              className={`crate ${t.soldOut ? "sold" : ""} relative shrink-0 w-[212px] p-4 tick-corners`}
            >
              <span className="tc1" />
              <span className="tc2" />
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${t.zoneColor}`} />
                <span className="font-mono text-[9.5px] tracking-[0.22em] text-bone/50">
                  {t.category}
                </span>
              </div>
              <div className="mt-3 font-impact text-[20px] leading-tight">
                {t.name}
              </div>
              <div className="mt-1 font-mono text-[10.5px] text-bone/50 leading-snug min-h-[28px] line-clamp-2">
                {t.subtitle}
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="font-display text-volt text-[22px] leading-none">
                  {THB(t.priceTHB)}
                </span>
                <span className="font-mono text-[9.5px] tracking-[0.22em] text-bone/45">
                  {t.soldOut ? "SOLD OUT" : "AVAILABLE"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* HOW TO RESERVE */}
      <section className="px-5 mt-12">
        <h2 className="font-display italic text-[28px] leading-none">How to reserve</h2>
        <ol className="mt-4 space-y-3">
          {[
            "Pick a pass — Hunter is free, workshops are limited.",
            "Pick a day and a shift. Weekends run two shifts.",
            "Drop your name, mobile, email — must match ID.",
            "Confirm in 10 minutes or the seat returns to inventory.",
            "Show the QR at the inner gate. The supervisor plays a game.",
          ].map((s, i) => (
            <li key={i} className="flex gap-4 items-start">
              <span className="font-impact text-volt text-[16px] leading-none w-7 shrink-0 pt-0.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[13.5px] text-bone/80 leading-snug">{s}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* TERMS */}
      <section className="px-5 mt-12">
        <h2 className="font-display italic text-[28px] leading-none">Terms</h2>
        <ul className="mt-4 space-y-2 text-[12.5px] text-bone/65 font-mono leading-snug">
          <li>· Bring photo ID. Name on ticket must match.</li>
          <li>· Tickets are non-transferable unless the type allows.</li>
          <li>· Cancellations 7+ days out refund to 80%.</li>
          <li>· No livestreaming workshops without media pass.</li>
          <li>· The address rotates. Trust the signs, not Google.</li>
        </ul>
      </section>

      {/* HASHTAGS */}
      <section className="px-5 mt-12">
        <div className="flex flex-wrap gap-2">
          {EVENT.hashtags.map((h) => (
            <span key={h} className="chip">{h}</span>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-5 mt-14 pb-8">
        <div className="font-mono text-[10px] tracking-[0.22em] text-bone/35">
          BY LADDERICE × NIKE FOOTBALL · APR 2026
        </div>
        <div className="mt-4 grid grid-cols-2 gap-y-2 font-mono text-[10px] tracking-[0.22em]">
          <Link href="/admin" className="text-bone/40 hover:text-volt">→ ADMIN DASHBOARD</Link>
          <Link href="/admin/events" className="text-bone/40 hover:text-volt">→ EVENT CMS</Link>
          <Link href="/queue" className="text-bone/40 hover:text-volt">→ WAITING ROOM</Link>
          <Link href="/waitlist" className="text-bone/40 hover:text-volt">→ WAITLIST</Link>
          <Link href="/preview/emails" className="text-bone/40 hover:text-volt">→ EMAIL PREVIEWS</Link>
          <Link href="/preview/receipt" className="text-bone/40 hover:text-volt">→ RECEIPT PREVIEW</Link>
        </div>
      </footer>
    </div>
  );
}
