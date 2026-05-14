import type { Booking } from "./types";

const KEY = "madgodown:bookings:v1";

export function loadBookings(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Booking[]) : [];
  } catch {
    return [];
  }
}

export function saveBookings(list: Booking[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(list));
}

export function upsertBooking(b: Booking) {
  const list = loadBookings();
  const i = list.findIndex((x) => x.id === b.id);
  if (i >= 0) list[i] = b;
  else list.unshift(b);
  saveBookings(list);
  return list;
}

export function getBooking(id: string): Booking | undefined {
  return loadBookings().find((b) => b.id === id);
}

// 6-char human code
export function makeCode() {
  const alpha = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += alpha[Math.floor(Math.random() * alpha.length)];
  return "MG-" + s;
}

export function makeId() {
  return (
    Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8)
  ).toUpperCase();
}
