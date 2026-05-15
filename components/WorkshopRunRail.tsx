"use client";

import { useEffect, useState } from "react";

export function WorkshopRunRail({
  targetId,
  count,
}: {
  targetId: string;
  count: number;
}) {
  const [p, setP] = useState(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const tick = () => {
      const root = document.getElementById(targetId);
      if (!root) return;
      const steps = Array.from(
        root.querySelectorAll<HTMLElement>("[data-step]")
      );
      if (steps.length === 0) return;

      const line = window.innerHeight * 0.46;
      const mid = (el: HTMLElement) => {
        const r = el.getBoundingClientRect();
        return r.top + r.height / 2;
      };

      const first = mid(steps[0]);
      const last = mid(steps[steps.length - 1]);
      const prog =
        last === first
          ? 0
          : Math.min(1, Math.max(0, (line - first) / (last - first)));
      setP(prog);

      let best = 0;
      let bestDist = Infinity;
      steps.forEach((el, i) => {
        const d = Math.abs(mid(el) - line);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      steps.forEach((el, i) => el.classList.toggle("is-current", i <= best));
      setActive(best);
    };

    const onScroll = () => {
      if (reduce) {
        tick();
        return;
      }
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    tick();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [targetId, count]);

  return (
    <div className="run-rail-wrap" aria-hidden>
      <div className="run-rail">
        <span className="run-rail-cap">00:00</span>
        <div className="run-rail-track">
          <div className="run-rail-fill" style={{ height: `${p * 100}%` }} />
          {Array.from({ length: count }).map((_, i) => (
            <span
              key={i}
              className={`run-rail-tick ${i <= active ? "passed" : ""} ${
                i === active ? "current" : ""
              }`}
              style={{ top: count > 1 ? `${(i / (count - 1)) * 100}%` : "0%" }}
            />
          ))}
        </div>
        <span className="run-rail-cap">2:00</span>
      </div>
    </div>
  );
}
