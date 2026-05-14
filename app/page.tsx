import Link from "next/link";
import { BrandMark } from "@/components/Brand";
import { EVENT, TICKET_TYPES, THB, WORKSHOP_OUTLOOK, WORKSHOP_RULES } from "@/lib/data";
import { HeaderNav } from "@/components/HeaderNav";
import { EventArtwork } from "@/components/EventArtwork";
import { AdminBanner } from "@/components/AdminBanner";
import { WORKSHOPS } from "@/lib/workshops";
import { HomeMotion } from "@/components/HomeMotion";

export default function Landing() {
  const workshopTypes = TICKET_TYPES.filter((t) => t.category === "WORKSHOP");

  return (
    <div className="relative">
      <HomeMotion />
      <AdminBanner />

      {/* HEADER */}
      <header className="px-5 h-14 flex items-center justify-between border-b border-bone/10">
        <BrandMark />
        <HeaderNav />
      </header>

      {/* MARQUEE */}
      <div className="ticker-shell border-b border-bone/10 overflow-hidden">
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
      <section className="homepage-section px-5 pt-6">
        <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.22em] text-bone/45">
          <span>{EVENT.hero.coords}</span>
          <span>{EVENT.hero.season}</span>
        </div>

        {/* Hero artwork — uses uploaded heroUrl if present, otherwise upload placeholder */}
        <div className="mt-4 -mx-5">
          <EventArtwork
            src={EVENT.heroUrl}
            accent={EVENT.accentHex}
            aspect="hero"
            eyebrow="แม๊ดโกดัง · 狂仓"
            title="BANGKOK / 26"
            footer={`${EVENT.dateLabel} · SONGWAT`}
            className="border-y border-bone/15"
          />
        </div>

        <h1 className="mt-6 font-display italic tracking-[-0.01em] text-bone leading-none whitespace-nowrap text-[68px]">
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
              11 DAYS · BKK
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
              SONGWAT&nbsp;↘
            </div>
          </div>
        </div>

        {/* description */}
        <p className="mt-6 text-[14px] leading-[1.55] text-bone/80">
          <span className="tape">REGISTRATION REQUIRED</span>{" "}
          {EVENT.description}
        </p>

        {/* venue hint */}
        <div className="mt-5 border-l-2 border-volt pl-3 text-[12.5px] text-bone/70 italic font-display leading-snug">
          “{EVENT.venueHint}”
        </div>

        {/* CTAs */}
        <div className="mt-8 space-y-2.5">
          <Link href="/tickets" className="btn-volt">
            REGISTER FOR WORKSHOPS &nbsp;→
          </Link>
          <Link href="#workshop-outlook" className="btn-ghost">
            VIEW 6.11 - 6.21 CALENDAR
          </Link>
        </div>
      </section>

      {/* WORKSHOP OUTLOOK */}
      <section id="workshop-outlook" className="motion-reveal homepage-section section-wipe px-5 mt-12 scroll-mt-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-volt text-[42px] leading-[0.9]">
            MAD SKILLS<br />WORKSHOPs<br />OUTLOOK
          </h2>
          <div className="font-mono text-[10px] tracking-[0.22em] text-bone/45 text-right">
            BY LADDERICE<br />APRIL 2026
          </div>
        </div>
        <div className="mt-6 border-t border-dotted border-volt/70">
          {WORKSHOP_OUTLOOK.map((day, i) => (
            <article
              key={day.date}
              className="motion-reveal calendar-row grid grid-cols-[82px_1fr] gap-4 py-4 border-b border-dotted border-volt/45"
              style={{ "--row-delay": `${i * 55}ms` } as React.CSSProperties}
            >
              <div>
                <div className="font-display text-volt text-[20px] leading-none">{day.day}</div>
                <div className="font-display text-volt text-[38px] leading-none">{day.label}</div>
              </div>
              <ul className="space-y-2 pt-1">
                {day.items.map((item) => (
                  <li key={item.label} className="flex gap-2 text-[13px] leading-snug text-bone/85">
                    <span className="text-volt">•</span>
                    {item.ticketTypeId ? (
                      <Link
                        href={`/workshops/${item.ticketTypeId}`}
                        className="calendar-workshop-link hover:text-volt hover:underline underline-offset-4"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span>{item.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* WORKSHOP INFO */}
      <section className="motion-reveal homepage-section section-wipe px-5 mt-12">
        <h2 className="font-display text-volt text-[54px] leading-none">WORKSHOPS</h2>
        <div className="mt-6 space-y-8">
          <div>
            <h3 className="font-display text-volt text-[28px] leading-none">ALWAYS ON WORKSHOP</h3>
            <p className="mt-2 font-impact text-volt text-[18px] leading-tight">
              Special customizations supported by local artisans
            </p>
            <ul className="mt-4 space-y-2 text-[13px] leading-snug text-bone/78">
              {WORKSHOP_RULES.alwaysOn.map((rule) => (
                <li key={rule} className="flex gap-2">
                  <span className="text-volt">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-dashed border-volt/70 pt-8">
            <h3 className="font-display text-volt text-[28px] leading-none">MAD SKILLS WORKSHOPS</h3>
            <p className="mt-2 font-impact text-volt text-[18px] leading-tight">
              8 different workshops that support the culture of football
            </p>
            <ul className="mt-4 space-y-2 text-[13px] leading-snug text-bone/78">
              {WORKSHOP_RULES.registered.map((rule) => (
                <li key={rule} className="flex gap-2">
                  <span className="text-volt">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* LOOKUP BANNER */}
      <section className="motion-reveal homepage-section px-5 mt-10">
        <Link
          href="/lookup"
          className="flex items-center justify-between border border-bone/20 hover:border-volt/60 p-4 group transition-colors"
        >
          <div>
            <div className="font-mono text-[9.5px] tracking-[0.28em] text-bone/50">ALREADY BOOKED?</div>
            <div className="mt-1 font-impact text-[20px] leading-tight text-bone group-hover:text-volt transition-colors">
              LOOK UP YOUR TICKET
            </div>
            <div className="mt-0.5 font-mono text-[10.5px] text-bone/55 tracking-[0.16em]">
              Retrieve your QR with booking code + email
            </div>
          </div>
          <div className="font-impact text-volt text-[28px] leading-none shrink-0 ml-4">→</div>
        </Link>
      </section>

      {/* TICKETS PREVIEW */}
      <section className="motion-reveal homepage-section section-wipe mt-10">
        <div className="px-5 flex items-baseline justify-between mb-4">
          <h2 className="font-display italic text-[28px] leading-none">Workshop registration</h2>
          <Link
            href="/tickets"
            className="font-mono text-[10px] tracking-[0.22em] text-volt"
          >
            VIEW ALL &nbsp;→
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-3">
          {workshopTypes.slice(0, 5).map((t) => (
            <Link
              href={WORKSHOPS[t.id] ? `/workshops/${t.id}` : "/tickets"}
              key={t.id}
              className={`workshop-card crate ${t.soldOut ? "sold" : ""} relative shrink-0 w-[224px] tick-corners overflow-hidden`}
            >
              <span className="tc1" />
              <span className="tc2" />
              <EventArtwork
                src={t.imageUrl}
                accent={t.accentHex ?? "#D4FF3D"}
                aspect="thumb"
                eyebrow={t.category}
                title={t.name}
                bare={!!t.imageUrl}
              />
              <div className="p-4">
                <div className="font-mono text-[10px] text-bone/50 leading-snug min-h-[24px] line-clamp-2">
                  {t.subtitle}
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="font-display text-volt text-[22px] leading-none">
                    {THB(t.priceTHB)}
                  </span>
                  <span className="font-mono text-[9.5px] tracking-[0.22em] text-bone/45">
                    {t.soldOut ? "SOLD OUT" : "AVAILABLE"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* HOW TO RESERVE */}
      <section className="motion-reveal homepage-section section-wipe px-5 mt-12">
        <h2 className="font-display italic text-[28px] leading-none">How to register</h2>
        <ol className="mt-4 space-y-3">
          {[
            "Pick Always On or one of the MAD SKILLS workshops.",
            "Pick the workshop day and session window.",
            "Drop your name, mobile, email — must match ID.",
            "Confirm in 10 minutes or the seat returns to inventory.",
            "Show the QR on arrival. No-show seats can move to all-day registrants.",
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
      <section className="motion-reveal homepage-section section-wipe px-5 mt-12">
        <h2 className="font-display italic text-[28px] leading-none">Terms</h2>
        <ul className="mt-4 space-y-2 text-[12.5px] text-bone/65 font-mono leading-snug">
          <li>· Bring photo ID. Name on ticket must match.</li>
          <li>· Workshop seats are extremely limited and FCFS after registration.</li>
          <li>· Basic units do not require purchase; upgrades may require jersey purchase.</li>
          <li>· Bring old or recently purchased Nike federation jerseys for Always On.</li>
          <li>· Mechanics and target groups may differ by session.</li>
        </ul>
      </section>

      {/* GALLERY (from event) */}
      {EVENT.gallery.length > 0 && (
        <section className="mt-12">
          <div className="px-5 mb-4">
            <h2 className="font-display italic text-[28px] leading-none">From the floor</h2>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 pb-2">
            {EVENT.gallery.map((src, i) => (
              <div key={i} className="shrink-0 w-[200px] aspect-square border border-bone/15">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Songwat ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}

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
          <Link href="/lookup" className="text-volt hover:underline">→ LOOK UP TICKET</Link>
          <Link href="/waitlist" className="text-bone/40 hover:text-volt">→ WAITLIST</Link>
        </div>
      </footer>
    </div>
  );
}
