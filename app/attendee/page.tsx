"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TopBar, StepDots, SectionHead } from "@/components/Brand";
import { useBooking } from "@/lib/context";
import { ticketById } from "@/lib/data";

function validEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}
function validPhone(s: string) {
  return /^[0-9+\-\s()]{7,16}$/.test(s);
}

export default function AttendeePage() {
  const router = useRouter();
  const { draft, setDraft } = useBooking();
  const tk = ticketById(draft.ticketTypeId);

  const a =
    draft.attendee ?? {
      fullName: "",
      email: "",
      phone: "",
      guests: 1,
      org: "",
      notes: "",
    };
  const [form, setForm] = useState(a);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const errs = {
    fullName: !form.fullName.trim() ? "Required" : null,
    email: !form.email.trim()
      ? "Required"
      : !validEmail(form.email)
      ? "Looks off"
      : null,
    phone: !form.phone.trim()
      ? "Required"
      : !validPhone(form.phone)
      ? "Looks off"
      : null,
  };
  const formOk = !errs.fullName && !errs.email && !errs.phone;

  if (!tk || !draft.sessionId) {
    return (
      <div className="px-5 py-10">
        <TopBar back="/schedule" />
        <p className="mt-6 text-bone/70 font-mono text-[12px]">
          Pick a ticket and date first.
        </p>
      </div>
    );
  }

  const onSubmit = () => {
    setTouched({ fullName: true, email: true, phone: true });
    if (!formOk) return;
    setDraft({ attendee: form });
    router.push("/review");
  };

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="relative pb-cta">
      <TopBar back="/schedule" title="STEP 03 · INFO" />
      <StepDots step={3} />

      <div className="px-5 pt-5">
        <SectionHead
          title="Who's coming."
          hint="Name as it appears on ID. We don't sell your data — Songwat law."
        />

        <div className="mt-7 space-y-5">
          <div>
            <label className="eyebrow">Full name *</label>
            <input
              className="input"
              value={form.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, fullName: true }))}
              placeholder="As on ID / Passport"
            />
            {touched.fullName && errs.fullName && <FieldErr>{errs.fullName}</FieldErr>}
          </div>

          <div>
            <label className="eyebrow">Email *</label>
            <input
              className="input"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              placeholder="you@somewhere.com"
              type="email"
            />
            {touched.email && errs.email && <FieldErr>{errs.email}</FieldErr>}
          </div>

          <div>
            <label className="eyebrow">Mobile *</label>
            <input
              className="input"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
              placeholder="+66 81 234 5678"
              inputMode="tel"
            />
            {touched.phone && errs.phone && <FieldErr>{errs.phone}</FieldErr>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="eyebrow"># Guests</label>
              <input
                className="input"
                type="number"
                min={1}
                max={tk.perUserLimit}
                value={form.guests}
                onChange={(e) =>
                  set(
                    "guests",
                    Math.max(
                      1,
                      Math.min(tk.perUserLimit, Number(e.target.value) || 1)
                    )
                  )
                }
              />
            </div>
            <div>
              <label className="eyebrow">Org / crew</label>
              <input
                className="input"
                value={form.org ?? ""}
                onChange={(e) => set("org", e.target.value)}
                placeholder="Optional"
              />
            </div>
          </div>

          <div>
            <label className="eyebrow">Notes — workshop, access, allergies</label>
            <textarea
              className="input min-h-[88px]"
              value={form.notes ?? ""}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Optional — e.g. left-handed for Singer machine"
            />
          </div>
        </div>

        <div className="mt-7 border border-bone/15 p-4">
          <div className="font-mono text-[10px] tracking-[0.22em] text-bone/50">
            FINE PRINT
          </div>
          <p className="mt-2 text-[12px] text-bone/70 leading-snug">
            Tickets are non-refundable within 7 days of the event. E-ticket
            emailed within 24h. Show QR + ID at the inner gate. Lineup, time,
            and address are subject to change — that's the point.
          </p>
        </div>
      </div>

      <div className="action-bar">
        <button onClick={onSubmit} className="btn-volt" disabled={!formOk}>
          REVIEW BOOKING &nbsp;→
        </button>
      </div>
    </div>
  );
}

function FieldErr({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-1.5 font-mono text-[10px] tracking-[0.22em] text-red-400">
      ! {children}
    </div>
  );
}
