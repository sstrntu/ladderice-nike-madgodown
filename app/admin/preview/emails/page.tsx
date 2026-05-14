"use client";
import { useState } from "react";
import { TopBar, SectionHead } from "@/components/Brand";
import { EVENT } from "@/lib/data";

type Tpl = "confirmation" | "reminder" | "address" | "refund" | "waitlist";

const TPLS: { id: Tpl; label: string; subject: string }[] = [
  { id: "confirmation", label: "CONFIRMATION", subject: "You're in. Booking MG-K3X9P2" },
  { id: "reminder", label: "REMINDER · D-1", subject: "Tomorrow. Songwat. The address drops at 18:00" },
  { id: "address", label: "ADDRESS DROP", subject: "It's here. Come find us." },
  { id: "refund", label: "REFUND STATUS", subject: "Your refund is on the way — MG-K3X9P2" },
  { id: "waitlist", label: "WAITLIST OPEN", subject: "Your shot — 60 minutes only" },
];

export default function EmailPreviewPage() {
  const [tab, setTab] = useState<Tpl>("confirmation");

  return (
    <div className="relative pb-10">
      <TopBar back="/admin" title="EMAIL PREVIEWS" />

      <div className="px-5 pt-6">
        <SectionHead
          eyebrow="DEV · DESIGN REVIEW"
          title="Email previews."
          hint="What each transactional looks like before we wire Resend. Mobile inbox view."
        />

        {/* Tabs */}
        <div className="mt-5 -mx-5 px-5 overflow-x-auto no-scrollbar">
          <div className="flex gap-2">
            {TPLS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`btn-ghost compact !w-auto whitespace-nowrap ${
                  tab === t.id ? "!border-volt !text-volt" : ""
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Phone mock */}
        <div className="mt-5">
          <div className="border border-bone/15 bg-bone text-ink overflow-hidden">
            {/* email header (Gmail-ish) */}
            <div className="bg-[#F4F2EA] px-4 py-3 border-b border-ink/10">
              <div className="font-mono text-[9.5px] tracking-[0.18em] text-ink/55">FROM</div>
              <div className="font-impact text-[14px] tracking-[0.04em]">MAD GODOWN · LADDERICE × NIKE FB</div>
              <div className="font-mono text-[10px] text-ink/55 mt-0.5">noreply@madgodown.com</div>

              <div className="mt-3 font-mono text-[9.5px] tracking-[0.18em] text-ink/55">SUBJECT</div>
              <div className="font-display italic text-[18px] leading-tight mt-0.5">
                {TPLS.find((t) => t.id === tab)?.subject}
              </div>
            </div>

            <div className="p-5 text-[13.5px] leading-[1.55] text-ink/85 font-sans">
              {tab === "confirmation" && <Confirmation />}
              {tab === "reminder" && <Reminder />}
              {tab === "address" && <Address />}
              {tab === "refund" && <Refund />}
              {tab === "waitlist" && <Waitlist />}
            </div>

            <div className="px-5 py-4 border-t border-ink/10 bg-[#F4F2EA] font-mono text-[10px] tracking-[0.18em] text-ink/55 leading-snug">
              LADDERICE × NIKE FOOTBALL · BANGKOK · 2026 <br />
              Unsubscribe · Manage preferences · PDPA
            </div>
          </div>
        </div>

        <div className="mt-4 font-mono text-[10px] tracking-[0.18em] text-bone/40">
          PLAIN-HTML EQUIVALENT — Resend / React Email handoff
        </div>
      </div>
    </div>
  );
}

/* ---- email bodies ---- */
function Hello({ name = "Sira" }: { name?: string }) {
  return <p>Hi <strong>{name}</strong>,</p>;
}
function Sign() {
  return (
    <>
      <p className="mt-4">See you in the alley,</p>
      <p className="mt-1 font-impact tracking-[0.08em] text-[16px]">— LADDERICE × NIKE FB</p>
    </>
  );
}

function Confirmation() {
  return (
    <>
      <Hello />
      <p className="mt-2">You&apos;re in. Your seat at <strong>MAD GODOWN BKK</strong> is locked.</p>
      <div className="my-4 border border-ink/15 p-4 bg-white">
        <div className="text-[10px] tracking-[0.22em] text-ink/55 font-mono">BOOKING CODE</div>
        <div className="font-impact text-[26px] mt-1 tracking-[0.06em]">MG-K3X9P2</div>
        <div className="text-[11.5px] mt-3 text-ink/55 font-mono tracking-[0.16em]">SAT 13 JUN · SHIFT A · 09:00–18:00</div>
        <div className="text-[11.5px] mt-1 text-ink/55 font-mono tracking-[0.16em]">SILK &amp; STITCH · ×1</div>
        <div className="text-[16px] mt-3 font-impact">TOTAL · ฿895</div>
      </div>
      <p><strong>No account needed.</strong> Save this code &mdash; you can pull up your QR anytime at <a className="underline">madgodown.com/lookup</a> with this code + the email this was sent to.</p>
      <p className="mt-3">The address drops 24 hours before your shift. Watch this inbox and your LINE.</p>
      <p className="mt-3">Bring photo ID. Name on ticket must match.</p>
      <Sign />
    </>
  );
}
function Reminder() {
  return (
    <>
      <Hello />
      <p className="mt-2">Tomorrow. Songwat. You ready?</p>
      <ul className="mt-3 list-disc pl-5 space-y-1">
        <li>The address pin drops at <strong>18:00 today</strong>.</li>
        <li>Closed shoes. Sleeves you can roll up.</li>
        <li>Show your QR + matching ID at the inner gate.</li>
      </ul>
      <p className="mt-3 italic font-display">"Don't expect an address. Follow the MAD GOALDOWN signs."</p>
      <Sign />
    </>
  );
}
function Address() {
  return (
    <>
      <Hello />
      <p className="mt-2">It's open. Get on the boat.</p>
      <div className="my-4 border border-ink/15 p-4 bg-white">
        <div className="text-[10px] tracking-[0.22em] text-ink/55 font-mono">PIN</div>
        <div className="font-impact text-[18px] mt-1">SOI WANIT 2 · NEXT TO THE BLUE DOORS</div>
        <a className="mt-3 inline-block text-[12px] underline">Open in Google Maps →</a>
      </div>
      <p>Tuk-tuk drivers know "Mad Goaldown" — say it loud, they'll know.</p>
      <Sign />
    </>
  );
}
function Refund() {
  return (
    <>
      <Hello />
      <p className="mt-2">Your refund is processed.</p>
      <div className="my-4 border border-ink/15 p-4 bg-white">
        <div className="text-[10px] tracking-[0.22em] text-ink/55 font-mono">BOOKING</div>
        <div className="font-impact text-[18px] mt-1">MG-K3X9P2</div>
        <div className="text-[16px] mt-3 font-impact">REFUNDED · ฿716 <span className="text-[11px] text-ink/55 ml-1">(80% · 9 days out)</span></div>
        <div className="text-[11px] mt-1 text-ink/55 font-mono tracking-[0.16em]">3–5 BUSINESS DAYS · ORIGINAL PAYMENT METHOD</div>
      </div>
      <Sign />
    </>
  );
}
function Waitlist() {
  return (
    <>
      <Hello />
      <p className="mt-2">A seat opened up. You're up.</p>
      <p className="mt-2">This window closes in <strong>60 minutes</strong>. If you miss it, the seat passes to the next on the list.</p>
      <a className="mt-4 inline-block bg-ink text-bone px-5 py-3 font-impact tracking-[0.1em]">CLAIM YOUR SEAT →</a>
      <Sign />
    </>
  );
}
