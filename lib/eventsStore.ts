// Mock event/ticket-type/session CMS — localStorage only.
const KEY = "madgodown:cms:v1";

export interface CmsTicketType {
  id: string;
  name: string;
  category: "ENTRY" | "WORKSHOP" | "VIP" | "EARLY_BIRD" | "GROUP";
  priceTHB: number;
  capacityPerSession: number;
  perUserLimit: number;
  description: string;
  soldOut?: boolean;
}
export interface CmsSession {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string;
  label: string;
  capacityNote: "OPEN" | "FEW_LEFT" | "SOLD_OUT";
}
export interface CmsEvent {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  dateRange: { from: string; to: string };
  venueLabel: string;
  posterUrl?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  ticketTypes: CmsTicketType[];
  sessions: CmsSession[];
  createdAt: number;
  updatedAt: number;
}

export function loadEvents(): CmsEvent[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
export function saveEvents(list: CmsEvent[]) {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(list));
}
export function upsertEvent(e: CmsEvent) {
  const list = loadEvents();
  const i = list.findIndex((x) => x.id === e.id);
  if (i >= 0) list[i] = { ...e, updatedAt: Date.now() };
  else list.unshift(e);
  saveEvents(list);
  return list;
}
export function getEvent(id: string) { return loadEvents().find((e) => e.id === id); }
export function deleteEvent(id: string) { saveEvents(loadEvents().filter((e) => e.id !== id)); }
export function makeEventId() {
  return "ev_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
