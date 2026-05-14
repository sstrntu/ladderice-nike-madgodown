"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TopBar, SectionHead } from "@/components/Brand";
import { PhotoFieldSingle, PhotoFieldGallery } from "@/components/PhotoField";
import {
  getEvent, upsertEvent, deleteEvent,
  type CmsEvent, type CmsTicketType, type CmsSession,
} from "@/lib/eventsStore";

type Tab = "details" | "tickets" | "sessions";

export default function EditEventPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [e, setE] = useState<CmsEvent | null>(null);
  const [tab, setTab] = useState<Tab>("details");
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    const ev = getEvent(id);
    if (!ev) { router.push("/admin/events"); return; }
    setE(ev);
  }, [id, router]);

  if (!e) return <div className="px-5 py-10"><TopBar back="/admin/events" /></div>;

  const persist = (next: CmsEvent) => {
    upsertEvent(next);
    setE(next);
    setSavedAt(Date.now());
    setTimeout(() => setSavedAt(null), 1500);
  };

  return (
    <div className="relative pb-cta">
      <TopBar back="/admin/events" title="EDIT WORKSHOP" right={
        <span className="font-mono text-[10px] tracking-[0.22em] text-bone/45">{e.status}</span>
      } />

      <div className="px-5 pt-6">
        <div className="flex items-baseline justify-between gap-3">
          <SectionHead eyebrow={`ID · ${e.id}`} title={e.name || "Untitled"} />
          {savedAt && (
            <span className="font-mono text-[10px] tracking-[0.22em] text-volt shrink-0">SAVED ✓</span>
          )}
        </div>

        {/* Tabs */}
        <div className="mt-6 grid grid-cols-3 gap-2">
          {(["details", "tickets", "sessions"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`btn-ghost ${tab === t ? "!border-volt !text-volt" : ""}`}
            >
              {t.toUpperCase()}{t === "tickets" ? ` · ${e.ticketTypes.length}` : t === "sessions" ? ` · ${e.sessions.length}` : ""}
            </button>
          ))}
        </div>

        {tab === "details" && <DetailsTab event={e} persist={persist} />}
        {tab === "tickets" && <TicketsTab event={e} persist={persist} />}
        {tab === "sessions" && <SessionsTab event={e} persist={persist} />}
      </div>

      <div className="action-bar grid grid-cols-[1fr_auto] gap-2">
        <button
          onClick={() => persist({ ...e, status: e.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED" })}
          className="btn-volt"
        >
          {e.status === "PUBLISHED" ? "UNPUBLISH" : "PUBLISH &nbsp;→"}
        </button>
        <button
          onClick={() => {
            if (confirm("Delete this workshop? Cannot undo.")) {
              deleteEvent(e.id);
              router.push("/admin/events");
            }
          }}
          className="btn-ghost !text-red-400 !border-red-400/40 !w-auto px-4"
        >
          DELETE
        </button>
      </div>
    </div>
  );
}

/* ---------------- Tabs ---------------- */

function DetailsTab({ event, persist }: { event: CmsEvent; persist: (e: CmsEvent) => void }) {
  const [draft, setDraft] = useState(event);
  useEffect(() => setDraft(event), [event.id]);
  const dirty = JSON.stringify(draft) !== JSON.stringify(event);

  const set = <K extends keyof CmsEvent>(k: K, v: CmsEvent[K]) => setDraft((d) => ({ ...d, [k]: v }));

  return (
    <div className="mt-6 space-y-6">
      {/* Visuals up top */}
      <div className="space-y-5">
        <div className="flex items-baseline justify-between">
          <h3 className="font-display italic text-[18px] leading-none">Visuals</h3>
          <span className="font-mono text-[9.5px] tracking-[0.22em] text-bone/45">
            POSTER · HERO · GALLERY
          </span>
        </div>

        <PhotoFieldSingle
          label="Poster · 3:4"
          hint="Cover on /tickets and /my-tickets."
          value={draft.posterUrl}
          onChange={(v) => set("posterUrl", v)}
          aspect="aspect-[3/4]"
        />
        <PhotoFieldSingle
          label="Hero · 16:9"
          hint="Wide image at the top of the landing page."
          value={draft.heroUrl}
          onChange={(v) => set("heroUrl", v)}
          aspect="aspect-[16/9]"
        />
        <PhotoFieldGallery
          label="Gallery"
          hint="Crowd / venue / craft shots. Up to 8."
          values={draft.gallery ?? []}
          onChange={(v) => set("gallery", v)}
          max={8}
        />

        <div>
          <label className="eyebrow">Accent color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              className="h-12 w-16 bg-ink border border-bone/15 cursor-pointer p-0"
              value={draft.accentHex ?? "#D4FF3D"}
              onChange={(e) => set("accentHex", e.target.value)}
            />
            <input
              className="input uppercase"
              value={draft.accentHex ?? "#D4FF3D"}
              onChange={(e) => set("accentHex", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Core info */}
      <div className="pt-6 border-t border-bone/10 space-y-5">
        <h3 className="font-display italic text-[18px] leading-none">Core info</h3>
        <div>
          <label className="eyebrow">Workshop name</label>
          <input className="input" value={draft.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div>
          <label className="eyebrow">Short name</label>
          <input className="input uppercase" value={draft.shortName} onChange={(e) => set("shortName", e.target.value)} />
        </div>
        <div>
          <label className="eyebrow">Tagline</label>
          <input className="input" value={draft.tagline} onChange={(e) => set("tagline", e.target.value)} />
        </div>
        <div>
          <label className="eyebrow">Description</label>
          <textarea className="input min-h-[120px]" value={draft.description} onChange={(e) => set("description", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="eyebrow">From</label>
            <input className="input" type="date" value={draft.dateRange.from} onChange={(e) => set("dateRange", { ...draft.dateRange, from: e.target.value })} />
          </div>
          <div>
            <label className="eyebrow">To</label>
            <input className="input" type="date" value={draft.dateRange.to} onChange={(e) => set("dateRange", { ...draft.dateRange, to: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="eyebrow">Venue</label>
          <input className="input uppercase" value={draft.venueLabel} onChange={(e) => set("venueLabel", e.target.value)} />
        </div>
      </div>

      <button
        disabled={!dirty}
        onClick={() => persist(draft)}
        className="btn-volt"
      >
        {dirty ? "SAVE CHANGES" : "NO CHANGES"}
      </button>
    </div>
  );
}

function TicketsTab({ event, persist }: { event: CmsEvent; persist: (e: CmsEvent) => void }) {
  const add = () => {
    const t: CmsTicketType = {
      id: "tk_" + Math.random().toString(36).slice(2, 8),
      name: "New ticket",
      category: "ENTRY",
      priceTHB: 0,
      capacityPerSession: 50,
      perUserLimit: 2,
      description: "",
    };
    persist({ ...event, ticketTypes: [...event.ticketTypes, t] });
  };
  const update = (id: string, patch: Partial<CmsTicketType>) =>
    persist({ ...event, ticketTypes: event.ticketTypes.map((t) => (t.id === id ? { ...t, ...patch } : t)) });
  const remove = (id: string) =>
    persist({ ...event, ticketTypes: event.ticketTypes.filter((t) => t.id !== id) });

  return (
    <div className="mt-6">
      <button onClick={add} className="btn-ghost">+ ADD TICKET TYPE</button>

      <div className="mt-4 space-y-3">
        {event.ticketTypes.length === 0 && (
          <p className="font-mono text-[11px] tracking-[0.18em] text-bone/45">NO TICKET TYPES YET.</p>
        )}
        {event.ticketTypes.map((t) => (
          <div key={t.id} className="border border-bone/15 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9.5px] tracking-[0.22em] text-bone/45">{t.id}</span>
              <button onClick={() => remove(t.id)} className="font-mono text-[10px] tracking-[0.22em] text-red-400">REMOVE</button>
            </div>
            <div>
              <label className="eyebrow">Name</label>
              <input className="input" value={t.name} onChange={(e) => update(t.id, { name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="eyebrow">Category</label>
                <select className="input" value={t.category} onChange={(e) => update(t.id, { category: e.target.value as CmsTicketType["category"] })}>
                  {["ENTRY", "WORKSHOP", "VIP", "EARLY_BIRD", "GROUP"].map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="eyebrow">Price (THB)</label>
                <input className="input" type="number" min={0} value={t.priceTHB}
                  onChange={(e) => update(t.id, { priceTHB: Number(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="eyebrow">Capacity / session</label>
                <input className="input" type="number" min={1} value={t.capacityPerSession}
                  onChange={(e) => update(t.id, { capacityPerSession: Number(e.target.value) || 1 })} />
              </div>
              <div>
                <label className="eyebrow">Limit / user</label>
                <input className="input" type="number" min={1} value={t.perUserLimit}
                  onChange={(e) => update(t.id, { perUserLimit: Number(e.target.value) || 1 })} />
              </div>
            </div>
            <div>
              <label className="eyebrow">Description</label>
              <textarea className="input min-h-[72px]" value={t.description} onChange={(e) => update(t.id, { description: e.target.value })} />
            </div>

            <PhotoFieldSingle
              label="Ticket image · 4:3"
              hint="Used as the workshop card preview. Optional."
              value={t.imageUrl}
              onChange={(v) => update(t.id, { imageUrl: v })}
              aspect="aspect-[4/3]"
            />

            <div>
              <label className="eyebrow">Accent color (procedural fallback)</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  className="h-10 w-14 bg-ink border border-bone/15 cursor-pointer p-0"
                  value={t.accentHex ?? "#D4FF3D"}
                  onChange={(e) => update(t.id, { accentHex: e.target.value })}
                />
                <input
                  className="input uppercase"
                  value={t.accentHex ?? "#D4FF3D"}
                  onChange={(e) => update(t.id, { accentHex: e.target.value })}
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={!!t.soldOut} onChange={(e) => update(t.id, { soldOut: e.target.checked })} className="accent-volt h-4 w-4" />
              <span className="font-mono text-[11px] tracking-[0.18em] text-bone/75">MARK AS SOLD OUT</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

function SessionsTab({ event, persist }: { event: CmsEvent; persist: (e: CmsEvent) => void }) {
  const add = () => {
    const s: CmsSession = {
      id: "ses_" + Math.random().toString(36).slice(2, 8),
      date: event.dateRange.from || new Date().toISOString().slice(0, 10),
      startTime: "18:00",
      endTime: "22:00",
      label: "Evening shift",
      capacityNote: "OPEN",
    };
    persist({ ...event, sessions: [...event.sessions, s] });
  };
  const update = (id: string, patch: Partial<CmsSession>) =>
    persist({ ...event, sessions: event.sessions.map((s) => (s.id === id ? { ...s, ...patch } : s)) });
  const remove = (id: string) =>
    persist({ ...event, sessions: event.sessions.filter((s) => s.id !== id) });

  return (
    <div className="mt-6">
      <button onClick={add} className="btn-ghost">+ ADD SESSION</button>

      <div className="mt-4 space-y-3">
        {event.sessions.length === 0 && (
          <p className="font-mono text-[11px] tracking-[0.18em] text-bone/45">NO SESSIONS YET.</p>
        )}
        {event.sessions.map((s) => (
          <div key={s.id} className="border border-bone/15 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9.5px] tracking-[0.22em] text-bone/45">{s.id}</span>
              <button onClick={() => remove(s.id)} className="font-mono text-[10px] tracking-[0.22em] text-red-400">REMOVE</button>
            </div>
            <div>
              <label className="eyebrow">Label</label>
              <input className="input" value={s.label} onChange={(e) => update(s.id, { label: e.target.value })} />
            </div>
            <div>
              <label className="eyebrow">Date</label>
              <input className="input" type="date" value={s.date} onChange={(e) => update(s.id, { date: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="eyebrow">Start</label>
                <input className="input" type="time" value={s.startTime} onChange={(e) => update(s.id, { startTime: e.target.value })} />
              </div>
              <div>
                <label className="eyebrow">End</label>
                <input className="input" type="time" value={s.endTime} onChange={(e) => update(s.id, { endTime: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="eyebrow">Status</label>
              <select className="input" value={s.capacityNote} onChange={(e) => update(s.id, { capacityNote: e.target.value as CmsSession["capacityNote"] })}>
                <option value="OPEN">OPEN</option>
                <option value="FEW_LEFT">FEW LEFT</option>
                <option value="SOLD_OUT">SOLD OUT</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
