"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TopBar, SectionHead } from "@/components/Brand";
import { upsertEvent, makeEventId, type CmsEvent } from "@/lib/eventsStore";

export default function NewEventPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    shortName: "",
    tagline: "",
    description: "",
    venueLabel: "",
    from: "",
    to: "",
  });
  const [poster, setPoster] = useState<string | undefined>();

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const ok = form.name && form.shortName && form.from && form.to;

  const onFile = (f?: File) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setPoster(r.result as string);
    r.readAsDataURL(f);
  };

  const save = (status: CmsEvent["status"]) => {
    const id = makeEventId();
    const e: CmsEvent = {
      id,
      name: form.name,
      shortName: form.shortName,
      tagline: form.tagline,
      description: form.description,
      venueLabel: form.venueLabel,
      dateRange: { from: form.from, to: form.to },
      posterUrl: poster,
      status,
      ticketTypes: [],
      sessions: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    upsertEvent(e);
    router.push(`/admin/events/${id}`);
  };

  return (
    <div className="relative pb-cta">
      <TopBar back="/admin/events" title="NEW EVENT" />

      <div className="px-5 pt-6">
        <SectionHead eyebrow="CMS · CREATE" title="New event." hint="Set the core. Add ticket types and sessions after saving." />

        <div className="mt-6 space-y-5">
          <Field label="Event name *" hint="e.g. Mad Godown BKK 26">
            <input className="input" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="LADDERICE × NIKE FB — MAD GODOWN" />
          </Field>

          <Field label="Short name *" hint="Used in tickets / nav">
            <input className="input uppercase" value={form.shortName} onChange={(e) => set("shortName", e.target.value)} placeholder="MAD GODOWN" />
          </Field>

          <Field label="Tagline">
            <input className="input" value={form.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="A controlled chaos marketplace." />
          </Field>

          <Field label="Description">
            <textarea
              className="input min-h-[120px]"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="What is this thing? Why does it exist?"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="From *">
              <input className="input" type="date" value={form.from} onChange={(e) => set("from", e.target.value)} />
            </Field>
            <Field label="To *">
              <input className="input" type="date" value={form.to} onChange={(e) => set("to", e.target.value)} />
            </Field>
          </div>

          <Field label="Venue">
            <input className="input uppercase" value={form.venueLabel} onChange={(e) => set("venueLabel", e.target.value)} placeholder="SONGWAT, BANGKOK" />
          </Field>

          <Field label="Poster" hint="JPG/PNG · stored as data URL for this POC">
            <label className="block border border-dashed border-bone/25 p-4 cursor-pointer hover:border-volt/60">
              <input type="file" className="hidden" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} />
              {poster ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={poster} alt="poster" className="w-full h-44 object-cover" />
              ) : (
                <div className="text-center font-mono text-[11px] tracking-[0.22em] text-bone/50">
                  ↑ DROP / SELECT FILE
                </div>
              )}
            </label>
          </Field>
        </div>
      </div>

      <div className="action-bar grid grid-cols-2 gap-2">
        <button onClick={() => save("DRAFT")} disabled={!ok} className="btn-ghost">
          SAVE AS DRAFT
        </button>
        <button onClick={() => save("PUBLISHED")} disabled={!ok} className="btn-volt">
          PUBLISH &nbsp;→
        </button>
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="eyebrow">{label}</label>
      {children}
      {hint && (
        <div className="mt-1 font-mono text-[10px] tracking-[0.18em] text-bone/40">{hint}</div>
      )}
    </div>
  );
}
