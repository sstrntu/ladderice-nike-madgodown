"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TopBar, StepDots, SectionHead } from "@/components/Brand";
import { useBooking } from "@/lib/context";
import { ticketById, sessionById, THB, PROMO_CODES } from "@/lib/data";
import { upsertBooking, makeCode, makeId } from "@/lib/store";
import type { Booking } from "@/lib/types";

export default function ReviewPage() {
  const router = useRouter();
  const { draft, resetDraft, refresh } = useBooking();
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const tk = ticketById(draft.ticketTypeId);
  const sess = sessionById(draft.sessionId);
  const qty = draft.quantity ?? 1;

  if (!tk || !sess || !draft.attendee) {
    return (
      <div className="px-5 py-10">
        <TopBar back="/attendee" />
        <p className="mt-6 text-bone/70 font-mono text-[12px]">
          Missing info. Restart the flow.
        </p>
      </div>
    );
  }

  const subtotal = tk.priceTHB * qty;
  const promo = draft.promoCode ? PROMO_CODES[draft.promoCode] : null;
  const discount = promo ? Math.round((subtotal * promo.pct) / 100) : 0;
  const serviceFee = tk.priceTHB === 0 ? 0 : 45;
  const total = Math.max(0, subtotal - discount + serviceFee);

  const confirm = () => {
    if (!agree) return;
    setSubmitting(true);
    const id = makeId();
    const booking: Booking = {
      id,
      bookingCode: makeCode(),
      ticketTypeId: tk.id,
      sessionId: sess.id,
      quantity: qty,
      totalTHB: total,
      attendee: draft.attendee!,
      status: "confirmed",
      createdAt: Date.now(),
      qrSeed: `${id}-${Math.random().toString(36).slice(2, 8)}`,
      promoCode: draft.promoCode,
    };
    upsertBooking(booking);
    refresh();
    resetDraft();
    setTimeout(() => router.push(`/confirmation/${booking.id}`), 350);
  };

  const dayLabel = sess.label.replace(" · SHIFT A", "").replace(" · SHIFT B", "");
  const shift = sess.label.includes("SHIFT") ? sess.label.split("· ")[1] : "EVENING";

  return (
    <div className="relative pb-cta">
      <TopBar back="/attendee" title="STEP 04 · REVIEW" />
      <StepDots step={4} />

      <div className="px-5 pt-5">
        <SectionHead
          title="Review."
          hint="Confirm in 10 minutes — or the seat goes back to inventory."
        />

        {/* Receipt-style card */}
        <div className="mt-5 border border-bone/20 bg-dirt/40 p-5">
          <div className="flex items-center justify-between">
            <span className="tape">MAD GODOWN BKK</span>
            <span className="font-mono text-[10px] tracking-[0.22em] text-bone/55">
              DRAFT
            </span>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${tk.zoneColor}`} />
            <span className="font-mono text-[9.5px] tracking-[0.22em] text-bone/50">
              {tk.category}
            </span>
          </div>
          <div className="mt-1.5 font-impact text-[24px] leading-none">{tk.name}</div>
          <div className="mt-1 font-mono text-[10.5px] text-bone/55 leading-snug">
            {tk.subtitle}
          </div>

          <Divider />

          <Row label="DATE" value={dayLabel} />
          <Row label="SHIFT" value={`${shift} · ${sess.time}`} />
          <Row label="VENUE" value="Songwat · BKK · address sent 24h before" />

          <Divider />

          <Row label="NAME" value={draft.attendee.fullName} />
          <Row label="EMAIL" value={draft.attendee.email} />
          <Row label="MOBILE" value={draft.attendee.phone} />
          {draft.attendee.org && <Row label="CREW" value={draft.attendee.org} />}
          {draft.attendee.notes && <Row label="NOTES" value={draft.attendee.notes} />}

          <Divider />

          <Row
            label={`Subtotal · ${qty} × ${THB(tk.priceTHB)}`}
            value={THB(subtotal)}
          />
          {promo && (
            <Row
              label={`Promo · ${draft.promoCode}`}
              value={`− ${THB(discount)}`}
              accent
            />
          )}
          {serviceFee > 0 && <Row label="Service fee" value={THB(serviceFee)} />}
          <div className="mt-3 pt-3 border-t border-bone/15 flex items-baseline justify-between">
            <span className="font-impact text-[16px] tracking-[0.08em]">TOTAL</span>
            <span className="font-display text-volt text-[28px] leading-none">
              {THB(total)}
            </span>
          </div>
        </div>

        {/* Edit links */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <EditLink href="/tickets" label="EDIT TICKET" />
          <EditLink href="/schedule" label="EDIT DATE" />
          <EditLink href="/attendee" label="EDIT INFO" />
        </div>

        {/* Terms */}
        <label className="mt-7 flex gap-3 items-start cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-1 accent-volt h-4 w-4 shrink-0"
          />
          <span className="text-[12.5px] text-bone/80 leading-snug">
            I agree to the terms — non-refundable inside 7 days, name on ticket
            matches ID, no livestreaming workshops, and I'll follow the MAD
            GOALDOWN signs.
          </span>
        </label>
      </div>

      <div className="action-bar">
        <button
          onClick={confirm}
          className="btn-volt"
          disabled={!agree || submitting}
        >
          {submitting
            ? "CONFIRMING…"
            : total === 0
            ? "CONFIRM RSVP"
            : `PAY ${THB(total)} · MOCK`}
        </button>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="mt-2 flex items-start justify-between gap-3">
      <span className="font-mono text-[10px] tracking-[0.22em] text-bone/50 uppercase">
        {label}
      </span>
      <span
        className={`font-mono text-[12px] text-right leading-snug ${
          accent ? "text-volt" : "text-bone/90"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
function Divider() {
  return <div className="my-4 border-t border-dashed border-bone/15" />;
}
function EditLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="btn-ghost compact text-center">
      {label}
    </Link>
  );
}
