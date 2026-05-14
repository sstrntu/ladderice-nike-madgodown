"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TopBar, SectionHead } from "@/components/Brand";
import { PhotoFieldSingle, PhotoFieldGallery } from "@/components/PhotoField";
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
    accentHex: "#D4FF3D",
  });
  const [posterUrl, setPosterUrl] = useState<string | undefined>();
  const [heroUrl, setHeroUrl] = useState<string | undefined>();
  const [gallery, setGallery] = useState<string[]>([]);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const ok = form.name && form.shortName && form.from && form.to;

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
      posterUrl,
      heroUrl,
      gallery,
      accentHex: form.accentHex,
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
        <SectionHead
          eyebrow="CMS · CREATE"
          title="New event."
          hint="Drop the core info + visuals. Add tickets and sessions after saving."
        />

        {/* ---------- VISUALS BLOCK ---------- */}
        <section className="mt-7">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display italic text-[22px] leading-none">Visuals</h2>
            <span className="font-mono text-[9.5px] tracking-[0.22em] text-bone/45">
              POSTER · HERO · GALLERY
            </span>
          </div>
          <p className="mt-2 font-mono text-[10px] tracking-[0.18em] text-bone/50 leading-snug">
            Poster = vertical card used on tickets list + my-tickets.
            Hero = wide image on the landing.
            Gallery = optional shots for the event page.
          </p>

          <div className="mt-5 space-y-6">
            <PhotoFieldSingle
              label="Poster · 3:4"
              hint="Used as the primary cover on ticket lists. Vertical works best."
              value={posterUrl}
              onChange={setPosterUrl}
              aspect="aspect-[3/4]"
            />
            <PhotoFieldSingle
              label="Hero · 16:9"
              hint="Wide image for the landing page top. Skip if you want the procedural artwork."
              value={heroUrl}
              onChange={setHeroUrl}
              aspect="aspect-[16/9]"
            />
            <PhotoFieldGallery
              label="Gallery"
              hint="Optional crowd / venue / craft photos. Up to 8."
              values={gallery}
              onChange={setGallery}
              max={8}
            />

            <div>
              <label className="eyebrow">Accent color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  className="h-12 w-16 bg-ink border border-bone/15 cursor-pointer p-0"
                  value={form.accentHex}
                  onChange={(e) => set("accentHex", e.target.value)}
                />
                <input
                  className="input uppercase"
                  value={form.accentHex}
                  onChange={(e) => set("accentHex", e.target.value)}
                  placeholder="#D4FF3D"
                />
              </div>
              <div className="mt-1.5 font-mono text-[10px] tracking-[0.18em] text-bone/40">
                Drives procedural artwork colour when no hero is uploaded.
              </div>
            </div>
          </div>
        </section>

        {/* ---------- CORE INFO ---------- */}
        <section className="mt-10">
          <h2 className="font-display italic text-[22px] leading-none">Core info</h2>

          <div className="mt-5 space-y-5">
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
          </div>
        </section>
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
