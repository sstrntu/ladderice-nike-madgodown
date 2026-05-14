"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TopBar, StepDots, SectionHead } from "@/components/Brand";
import { EventArtwork } from "@/components/EventArtwork";
import { TICKET_TYPES, THB, PROMO_CODES } from "@/lib/data";
import { WORKSHOPS } from "@/lib/workshops";
import { useBooking } from "@/lib/context";

export default function TicketsPage() {
  const router = useRouter();
  const { draft, setDraft } = useBooking();
  const [promo, setPromo] = useState(draft.promoCode ?? "");
  const [promoMsg, setPromoMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const selected = draft.ticketTypeId;
  const tk = TICKET_TYPES.find((t) => t.id === selected);
  const qty = draft.quantity ?? 1;

  const applyPromo = () => {
    const code = promo.trim().toUpperCase();
    if (!code) {
      setPromoMsg(null);
      setDraft({ promoCode: undefined });
      return;
    }
    const hit = PROMO_CODES[code];
    if (hit) {
      setPromoMsg({ ok: true, text: hit.label });
      setDraft({ promoCode: code });
    } else {
      setPromoMsg({ ok: false, text: "Invalid code." });
      setDraft({ promoCode: undefined });
    }
  };

  const canContinue = !!tk && !tk.soldOut;

  return (
    <div className="relative pb-cta">
      <TopBar back="/" title="STEP 01 · TICKET" />
      <StepDots step={1} />

      <div className="px-5 pt-5">
        <SectionHead title="Pick your pass." hint="Quantity capped per user. Sold-out crates are disabled." />

        {/* Promo */}
        <div className="mt-6">
          <label className="eyebrow">Invitation / promo code</label>
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <input
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              placeholder="ENTER CODE"
              className="input uppercase"
            />
            <button onClick={applyPromo} className="btn-ghost !w-auto px-5">
              APPLY
            </button>
          </div>
          {promoMsg && (
            <div
              className={`mt-2 font-mono text-[10.5px] tracking-[0.22em] ${
                promoMsg.ok ? "text-volt" : "text-red-400"
              }`}
            >
              {promoMsg.ok ? "✓ " : "! "}
              {promoMsg.text}
            </div>
          )}
        </div>

        {/* Ticket crate list */}
        <div className="mt-7 space-y-3">
          {TICKET_TYPES.map((t) => {
            const isSel = selected === t.id;
            return (
              <button
                key={t.id}
                disabled={t.soldOut}
                onClick={() =>
                  setDraft({
                    ticketTypeId: t.id,
                    quantity: Math.min(qty, t.perUserLimit),
                  })
                }
                className={`crate w-full text-left relative tick-corners overflow-hidden ${
                  isSel ? "selected" : ""
                } ${t.soldOut ? "sold" : ""}`}
              >
                <span className="tc1" />
                <span className="tc2" />

                {/* artwork band */}
                <div className="grid grid-cols-[88px_1fr] gap-3 p-3 items-center">
                  <EventArtwork
                    src={t.imageUrl}
                    accent={t.accentHex ?? "#D4FF3D"}
                    aspect="square"
                    bare
                    className="border border-bone/15"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${t.zoneColor}`} />
                      <span className="font-mono text-[9.5px] tracking-[0.22em] text-bone/50">
                        {t.category}
                      </span>
                    </div>
                    <div className="mt-1 font-impact text-[18px] leading-tight truncate">
                      {t.name}
                    </div>
                    <div className="mt-0.5 font-mono text-[10px] text-bone/50 leading-snug truncate">
                      {t.subtitle}
                    </div>
                  </div>
                </div>

                <div className="px-4 pt-3 pb-4 border-t border-bone/12">

                {/* meta row */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9.5px] tracking-[0.22em] text-bone/50">
                    {t.soldOut ? "" : `CAP ${t.capacityPerSession} / SESSION`}
                  </span>
                  <span
                    className={`font-mono text-[9.5px] tracking-[0.22em] ${
                      t.soldOut ? "text-red-400" : "text-volt"
                    }`}
                  >
                    {t.soldOut ? "SOLD OUT" : "AVAILABLE"}
                  </span>
                </div>

                {/* title + price */}
                <div className="mt-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-impact text-[22px] leading-none">{t.name}</div>
                    <div className="mt-1 font-mono text-[10.5px] text-bone/50 leading-snug">
                      {t.subtitle}
                    </div>
                  </div>
                  <div className="font-display text-volt text-[24px] leading-none shrink-0">
                    {THB(t.priceTHB)}
                  </div>
                </div>

                <p className="mt-3 text-[12.5px] text-bone/75 leading-snug">
                  {t.description}
                </p>

                {/* deep links */}
                <div className="mt-3 flex items-center gap-4 font-mono text-[10px] tracking-[0.22em]">
                  {WORKSHOPS[t.id] && (
                    <Link
                      href={`/workshops/${t.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-volt hover:underline"
                    >
                      MORE DETAILS →
                    </Link>
                  )}
                  {t.soldOut && (
                    <Link
                      href="/waitlist"
                      onClick={(e) => e.stopPropagation()}
                      className="text-volt hover:underline"
                    >
                      JOIN WAITLIST →
                    </Link>
                  )}
                </div>

                {/* qty stepper */}
                {isSel && (
                  <div className="mt-4 pt-3 border-t border-bone/15 flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-[0.22em] text-bone/50">
                      QTY · MAX {t.perUserLimit}
                    </span>
                    <div className="flex items-center gap-3">
                      <span
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDraft({ quantity: Math.max(1, qty - 1) });
                        }}
                        className="font-impact text-volt text-[22px] leading-none w-8 h-8 inline-flex items-center justify-center border border-bone/25"
                        role="button"
                      >
                        −
                      </span>
                      <span className="font-impact text-[20px] w-6 text-center leading-none">
                        {qty}
                      </span>
                      <span
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDraft({
                            quantity: Math.min(t.perUserLimit, qty + 1),
                          });
                        }}
                        className="font-impact text-volt text-[22px] leading-none w-8 h-8 inline-flex items-center justify-center border border-bone/25"
                        role="button"
                      >
                        +
                      </span>
                    </div>
                  </div>
                )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="action-bar">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[10px] tracking-[0.22em] text-bone/55 truncate">
            {tk ? `${tk.name} · ×${qty}` : "NO TICKET YET"}
          </span>
          <span className="font-display text-[20px] text-volt leading-none">
            {tk ? THB(tk.priceTHB * qty) : "—"}
          </span>
        </div>
        <button
          disabled={!canContinue}
          onClick={() => router.push("/schedule")}
          className="btn-volt"
        >
          CONTINUE TO DATE &nbsp;→
        </button>
      </div>
    </div>
  );
}
