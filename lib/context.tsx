"use client";
import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from "react";
import type { DraftBooking, Booking } from "./types";
import { loadBookings, saveBookings } from "./store";

interface Ctx {
  draft: DraftBooking;
  setDraft: (d: Partial<DraftBooking>) => void;
  resetDraft: () => void;
  bookings: Booking[];
  refresh: () => void;
}

const initial: DraftBooking = { quantity: 1 };
const C = createContext<Ctx>({
  draft: initial,
  setDraft: () => {},
  resetDraft: () => {},
  bookings: [],
  refresh: () => {},
});

const DRAFT_KEY = "madgodown:draft:v1";

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraftState] = useState<DraftBooking>(initial);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (raw) setDraftState(JSON.parse(raw));
    } catch {}
    setBookings(loadBookings());
  }, []);

  const setDraft = useCallback((d: Partial<DraftBooking>) => {
    setDraftState((prev) => {
      const next = { ...prev, ...d };
      try { window.localStorage.setItem(DRAFT_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const resetDraft = useCallback(() => {
    setDraftState(initial);
    try { window.localStorage.removeItem(DRAFT_KEY); } catch {}
  }, []);

  const refresh = useCallback(() => {
    setBookings(loadBookings());
  }, []);

  // expose a saveBookings sync via storage event for admin tabs
  useEffect(() => {
    const fn = () => setBookings(loadBookings());
    window.addEventListener("storage", fn);
    return () => window.removeEventListener("storage", fn);
  }, []);

  const value = useMemo(
    () => ({ draft, setDraft, resetDraft, bookings, refresh }),
    [draft, setDraft, resetDraft, bookings, refresh]
  );
  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useBooking() {
  return useContext(C);
}

// helper not in ctx so non-react callers can also write
export { saveBookings };
