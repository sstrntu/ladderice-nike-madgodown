export type Status =
  | "reserved"
  | "confirmed"
  | "cancelled"
  | "refunded"
  | "checked_in";

export interface TicketType {
  id: string;
  category: "ENTRY" | "WORKSHOP" | "VIP" | "EARLY_BIRD" | "GROUP";
  name: string;
  subtitle: string;
  priceTHB: number;
  capacityPerSession: number;
  perUserLimit: number;
  description: string;
  zoneColor: string; // tailwind class for the dot
  accentHex?: string; // hex value used by procedural artwork
  imageUrl?: string;
  soldOut?: boolean;
}

export interface SessionSlot {
  id: string; // e.g. 2026-06-11_eve
  date: string; // YYYY-MM-DD
  label: string; // human label
  time: string; // e.g. "18:00 – 22:00"
  capacityNote: "OPEN" | "FEW_LEFT" | "SOLD_OUT";
  shiftCount?: number;
}

export interface Attendee {
  fullName: string;
  email: string;
  phone: string;
  guests: number;
  org?: string;
  notes?: string;
}

export interface Booking {
  id: string;
  bookingCode: string;
  ticketTypeId: string;
  sessionId: string;
  quantity: number;
  totalTHB: number;
  attendee: Attendee;
  status: Status;
  createdAt: number;
  qrSeed: string;
  promoCode?: string;
}

export interface DraftBooking {
  ticketTypeId?: string;
  sessionId?: string;
  quantity: number;
  attendee?: Attendee;
  promoCode?: string;
}
