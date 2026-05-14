"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TopBar, SectionHead } from "@/components/Brand";

export default function QueuePage() {
  const router = useRouter();
  const [pos, setPos] = useState(347);
  const [total, setTotal] = useState(1142);
  const [eta, setEta] = useState(8 * 60); // seconds
  const [paused, setPaused] = useState(false);
  const [done, setDone] = useState(false);

  // Simulated movement — every ~1.5s drop the queue
  useEffect(() => {
    if (paused || done) return;
    const t = setInterval(() => {
      setPos((p) => {
        const next = Math.max(0, p - Math.ceil(Math.random() * 6));
        if (next === 0) setDone(true);
        return next;
      });
      setEta((e) => Math.max(0, e - 2));
    }, 1500);
    return () => clearInterval(t);
  }, [paused, done]);

  const pct = Math.max(2, Math.round(((total - pos) / total) * 100));
  const mm = String(Math.floor(eta / 60)).padStart(2, "0");
  const ss = String(eta % 60).padStart(2, "0");

  return (
    <div className="relative pb-10">
      <TopBar back="/" title="WAITING ROOM" />

      <div className="px-5 pt-6">
        <SectionHead
          eyebrow="LAUNCH-DAY SURGE"
          title="Hold tight."
          hint="Hunter Pass dropped. You're queued. Refresh and you lose your spot."
        />

        {/* Big number */}
        <div className="mt-8 text-center">
          <div className="font-mono text-[10px] tracking-[0.22em] text-bone/55">YOU&apos;RE NUMBER</div>
          <div className="mt-3 font-display italic text-volt text-[112px] leading-none tabular-nums">
            {pos.toLocaleString()}
          </div>
          <div className="mt-1 font-mono text-[10px] tracking-[0.22em] text-bone/55">
            OF {total.toLocaleString()} IN LINE
          </div>
        </div>

        {/* Progress */}
        <div className="mt-8">
          <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.22em] mb-2">
            <span className="text-bone/55">PROGRESS</span>
            <span className="text-volt">{pct}%</span>
          </div>
          <div className="h-[5px] bg-bone/10">
            <div
              className="h-full bg-volt transition-[width] duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* ETA */}
        <div className="mt-7 grid grid-cols-2 gap-2">
          <div className="border border-bone/15 p-3">
            <div className="font-mono text-[10px] tracking-[0.22em] text-bone/55">ETA</div>
            <div className="mt-1 font-impact text-volt text-[28px] leading-none tabular-nums">
              {mm}:{ss}
            </div>
          </div>
          <div className="border border-bone/15 p-3">
            <div className="font-mono text-[10px] tracking-[0.22em] text-bone/55">RATE</div>
            <div className="mt-1 font-impact text-bone text-[28px] leading-none">
              ~2/s
            </div>
          </div>
        </div>

        {/* House rules */}
        <div className="mt-7 border border-bone/15 p-4">
          <div className="font-mono text-[10px] tracking-[0.22em] text-bone/55">
            HOUSE RULES
          </div>
          <ul className="mt-2 text-[12.5px] text-bone/80 space-y-1.5 leading-snug">
            <li>· Don&apos;t refresh. You&apos;ll lose your spot.</li>
            <li>· One device per person. We track tokens.</li>
            <li>· You&apos;ll get 4 minutes to check out once you&apos;re in.</li>
          </ul>
        </div>

        {/* Pause/leave */}
        <div className="mt-6 flex items-center justify-between font-mono text-[10.5px] tracking-[0.22em]">
          <button onClick={() => setPaused((p) => !p)} className="text-bone/55 hover:text-bone">
            {paused ? "▶ RESUME (DEMO)" : "⏸ PAUSE (DEMO)"}
          </button>
          <Link href="/" className="text-red-400 hover:underline">
            LEAVE QUEUE
          </Link>
        </div>

        {/* Done state */}
        {done && (
          <div className="mt-10 border border-volt/40 p-5 bg-dirt/40 text-center">
            <div className="tape inline-block">DOORS OPEN</div>
            <h2 className="mt-4 font-display italic text-[28px] leading-tight">
              You&apos;re up.
            </h2>
            <p className="mt-2 text-[13px] text-bone/75">
              4-minute window starts the moment you tap below.
            </p>
            <button
              onClick={() => router.push("/tickets")}
              className="btn-volt mt-5"
            >
              ENTER &nbsp;→
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
