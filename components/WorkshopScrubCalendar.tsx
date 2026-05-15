"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { WORKSHOP_OUTLOOK } from "@/lib/data";

export function WorkshopScrubCalendar() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const total = WORKSHOP_OUTLOOK.length;

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    let raf = 0;
    const measure = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? Math.min(1, Math.max(0, el.scrollLeft / max)) : 0);

      const cards = el.querySelectorAll<HTMLElement>("[data-day]");
      const center = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      cards.forEach((c, i) => {
        const mid = c.offsetLeft + c.offsetWidth / 2;
        const d = Math.abs(mid - center);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActive(best);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    measure();
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const jump = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelectorAll<HTMLElement>("[data-day]")[i];
    if (!card) return;
    el.scrollTo({
      left: card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2,
      behavior: "smooth",
    });
  };

  const day = WORKSHOP_OUTLOOK[active];

  return (
    <div className="scrub-cal mt-6">
      <div className="flex items-center justify-between gap-4">
        <span className="font-mono text-[10px] tracking-[0.24em] text-bone/45">
          SWIPE ↔ {day.day} · SONGWAT
        </span>
        <span className="font-impact text-volt text-[15px] tracking-[0.1em] tabular-nums">
          DAY {String(active + 1).padStart(2, "0")}
          <span className="text-bone/35"> / {total}</span>
        </span>
      </div>

      <div className="scrub-rail mt-3" aria-hidden>
        <div
          className="scrub-rail-fill"
          style={{ transform: `scaleX(${progress})` }}
        />
        <div className="scrub-rail-ticks">
          {WORKSHOP_OUTLOOK.map((d, i) => (
            <button
              key={d.date}
              type="button"
              aria-label={`Jump to ${d.label}`}
              onClick={() => jump(i)}
              className={`scrub-tick ${i <= active ? "passed" : ""} ${
                i === active ? "current" : ""
              }`}
            />
          ))}
        </div>
      </div>

      <div ref={trackRef} className="scrub-track no-scrollbar">
        {WORKSHOP_OUTLOOK.map((d, i) => (
          <article
            key={d.date}
            data-day
            className={`scrub-card ${i === active ? "is-active" : ""}`}
          >
            <div className="scrub-card-inner tick-corners">
              <span className="tc1" />
              <span className="tc2" />

              <div className="flex items-start justify-between">
                <span className="font-mono text-[9px] tracking-[0.26em] text-bone/40">
                  狂仓 · CRATE {String(i + 1).padStart(2, "0")}
                </span>
                <span className="scrub-punch" />
              </div>

              <div className="scrub-stamp mt-6">
                <div className="font-display text-volt text-[20px] leading-none">
                  {d.day}
                </div>
                <div className="font-display text-volt text-[68px] leading-[0.82] tracking-[-0.02em]">
                  {d.label}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-dotted border-volt/60 flex-1">
                <ul className="space-y-3">
                  {d.items.map((item) => (
                    <li
                      key={item.label}
                      className="flex gap-2 text-[13px] leading-snug text-bone/85"
                    >
                      <span className="text-volt shrink-0">•</span>
                      {item.ticketTypeId ? (
                        <Link
                          href={`/workshops/${item.ticketTypeId}`}
                          className="calendar-workshop-link"
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <span>{item.label}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 flex items-center justify-between font-mono text-[9px] tracking-[0.22em] text-bone/35">
                <span>MAD GODOWN BKK 26</span>
                <span className="tabular-nums">
                  {String(i + 1).padStart(2, "0")} / {total}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
