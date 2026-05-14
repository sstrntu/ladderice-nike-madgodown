"use client";
import { useEffect, useState } from "react";
import { TopBar, SectionHead } from "@/components/Brand";
import {
  loadNotifs, saveNotifs, seedIfEmpty, type NotifItem,
} from "@/lib/notifications";

const KIND_LABEL: Record<NotifItem["kind"], string> = {
  address: "ADDRESS",
  reminder: "REMINDER",
  refund: "REFUND",
  drop: "DROP",
  waitlist: "WAITLIST",
  system: "SYSTEM",
};

function timeAgo(t: number) {
  const s = Math.floor((Date.now() - t) / 1000);
  if (s < 60) return s + "s";
  const m = Math.floor(s / 60);
  if (m < 60) return m + "m";
  const h = Math.floor(m / 60);
  if (h < 24) return h + "h";
  const d = Math.floor(h / 24);
  return d + "d";
}

export default function NotificationsPage() {
  const [list, setList] = useState<NotifItem[]>([]);

  useEffect(() => {
    seedIfEmpty();
    setList(loadNotifs());
  }, []);

  const markAllRead = () => {
    const next = list.map((n) => ({ ...n, read: true }));
    saveNotifs(next);
    setList(next);
  };
  const toggle = (id: string) => {
    const next = list.map((n) => (n.id === id ? { ...n, read: !n.read } : n));
    saveNotifs(next);
    setList(next);
  };
  const clear = () => {
    if (!confirm("Clear all notifications?")) return;
    saveNotifs([]);
    setList([]);
  };
  const unread = list.filter((n) => !n.read).length;

  return (
    <div className="relative pb-10">
      <TopBar back="/" title="NOTIFICATIONS" />

      <div className="px-5 pt-6">
        <div className="flex items-end justify-between gap-3">
          <SectionHead
            eyebrow={unread > 0 ? `${unread} UNREAD` : "ALL READ"}
            title="Inbox."
            hint="Address drops, reminders, refund updates, waitlist hits."
          />
          <div className="flex flex-col items-end gap-2 shrink-0">
            <button onClick={markAllRead} className="font-mono text-[10px] tracking-[0.22em] text-volt">
              MARK ALL READ
            </button>
            <button onClick={clear} className="font-mono text-[10px] tracking-[0.22em] text-red-400">
              CLEAR
            </button>
          </div>
        </div>

        {list.length === 0 ? (
          <div className="mt-10 border border-dashed border-bone/20 p-6 text-center">
            <div className="font-mono text-[10px] tracking-[0.22em] text-bone/45">EMPTY</div>
            <p className="mt-2 text-[13px] text-bone/65">No notifications yet.</p>
          </div>
        ) : (
          <div className="mt-6 divide-y divide-bone/10 border-y border-bone/10">
            {list.map((n) => (
              <button
                key={n.id}
                onClick={() => toggle(n.id)}
                className="w-full text-left py-4 flex gap-3"
              >
                <span className={`mt-1 h-2 w-2 rounded-full shrink-0 ${n.read ? "bg-bone/20" : "bg-volt"}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[9.5px] tracking-[0.22em] text-bone/55">
                      {KIND_LABEL[n.kind]}
                    </span>
                    <span className="font-mono text-[9.5px] tracking-[0.18em] text-bone/45">
                      {timeAgo(n.createdAt)}
                    </span>
                  </div>
                  <div className={`mt-1 font-impact text-[16px] leading-tight ${n.read ? "text-bone/70" : "text-bone"}`}>
                    {n.title}
                  </div>
                  <p className={`mt-1 text-[12.5px] leading-snug ${n.read ? "text-bone/55" : "text-bone/80"}`}>
                    {n.body}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
