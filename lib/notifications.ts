const KEY_NOTIF = "madgodown:notifications:v1";
const KEY_WAIT = "madgodown:waitlist:v1";

export interface NotifItem {
  id: string;
  kind: "address" | "reminder" | "refund" | "drop" | "waitlist" | "system";
  title: string;
  body: string;
  createdAt: number;
  read: boolean;
}
export function loadNotifs(): NotifItem[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY_NOTIF) || "[]"); } catch { return []; }
}
export function saveNotifs(list: NotifItem[]) {
  if (typeof window !== "undefined") localStorage.setItem(KEY_NOTIF, JSON.stringify(list));
}
export function addNotif(n: Omit<NotifItem, "id" | "createdAt" | "read">) {
  const list = loadNotifs();
  list.unshift({
    ...n,
    id: "n_" + Math.random().toString(36).slice(2, 9),
    createdAt: Date.now(),
    read: false,
  });
  saveNotifs(list);
}
export function unreadCount() { return loadNotifs().filter((n) => !n.read).length; }

export interface WaitlistEntry {
  ticketTypeId: string;
  email: string;
  createdAt: number;
}
export function loadWaitlist(): WaitlistEntry[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY_WAIT) || "[]"); } catch { return []; }
}
export function joinWaitlist(ticketTypeId: string, email: string) {
  const list = loadWaitlist();
  if (list.some((w) => w.ticketTypeId === ticketTypeId && w.email === email)) return;
  list.unshift({ ticketTypeId, email, createdAt: Date.now() });
  if (typeof window !== "undefined") localStorage.setItem(KEY_WAIT, JSON.stringify(list));
}

// Seed a few demo notifications first time the inbox is opened.
export function seedIfEmpty() {
  if (loadNotifs().length > 0) return;
  saveNotifs([
    {
      id: "n_seed1", kind: "drop", read: false, createdAt: Date.now() - 1000 * 60 * 12,
      title: "TIER 1 federation kits dropped",
      body: "Brazil, France, England are in. Limited runs — Hunter pass gets first pull from 09:00 SAT.",
    },
    {
      id: "n_seed2", kind: "address", read: false, createdAt: Date.now() - 1000 * 60 * 60 * 2,
      title: "Address unlocks in 22h",
      body: "Your shift is in less than 24 hours. Watch this inbox + your LINE for the alley pin.",
    },
    {
      id: "n_seed3", kind: "reminder", read: true, createdAt: Date.now() - 1000 * 60 * 60 * 24,
      title: "Workshop reminder · Silk & Stitch",
      body: "P Rose is set. Wear sleeves you can roll up. Closed shoes. Singer machines wait for no one.",
    },
  ]);
}
