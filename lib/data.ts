import type { TicketType, SessionSlot } from "./types";

export const EVENT = {
  shortName: "MAD GODOWN BKK 26",
  longName: "Ladderice × Nike Football — MAD GODOWN",
  thaiName: "แม๊ดโกดัง",
  chineseName: "狂仓",
  tagline: "A controlled chaos marketplace. Not a pop-up. A system.",
  description:
    "Songwat was where goods first touched Bangkok — boats, sweat, warehouses, sacks, abacus, ledgers. For the World Cup, we functionalize that history. Crates instead of shelves. Tarps instead of walls. The football fashion of right now, mined from the city that moves it.",
  dateLabel: "11 – 21 JUN 2026",
  dateRange: { from: "2026-06-11", to: "2026-06-21" },
  venueLabel: "SONGWAT, BANGKOK",
  venueHint:
    "Don't expect an address. Follow the MAD GOALDOWN signs through the alleys. Ask a tuk-tuk driver. The hunt is the experience.",
  hero: { coords: "13.7374° N · 100.5008° E", season: "WORLD CUP / RAINY 26" },
  hashtags: ["#MADGODOWN", "#MADGOALDOWN", "#NIKEFOOTBALL", "#LADDERICE", "#SONGWATBKK"],
};

export const TICKET_TYPES: TicketType[] = [
  {
    id: "hunter",
    category: "ENTRY",
    name: "HUNTER PASS",
    subtitle: "General admission · walk-the-alley",
    priceTHB: 0,
    capacityPerSession: 240,
    perUserLimit: 4,
    description:
      "Free RSVP. Gets you through the inner gate. The labor supervisor will play a 'game' with you on the way in.",
    zoneColor: "bg-bone",
  },
  {
    id: "earlybird",
    category: "EARLY_BIRD",
    name: "EARLY BIRD · DAY 01",
    subtitle: "Launch day · 11 Jun only",
    priceTHB: 350,
    capacityPerSession: 60,
    perUserLimit: 2,
    description:
      "Be on the first boat in. Comes with a numbered Songwat ledger card and first-pull on collab merch.",
    zoneColor: "bg-volt",
  },
  {
    id: "silk-stitch",
    category: "WORKSHOP",
    name: "SILK & STITCH",
    subtitle: "Workshop · P Rose · Singer treadle",
    priceTHB: 850,
    capacityPerSession: 12,
    perUserLimit: 2,
    description:
      "Two hours on old Singer machines with P Rose. You sew an Avery-style nameset onto a federation blank. Take it home.",
    zoneColor: "bg-[#FF7A3D]",
  },
  {
    id: "jame-jewel",
    category: "WORKSHOP",
    name: "JAME · COPPER WIRE",
    subtitle: "Workshop · jewelry & wire",
    priceTHB: 750,
    capacityPerSession: 10,
    perUserLimit: 2,
    description:
      "Make one piece. Copper wire, weigh-scale fittings, a thumbprint. Jame walks you through.",
    zoneColor: "bg-[#C58A2E]",
    soldOut: true,
  },
  {
    id: "styling-talk",
    category: "WORKSHOP",
    name: "STYLING TALK",
    subtitle: "Talk · Thunder & G · Dr. WIT",
    priceTHB: 250,
    capacityPerSession: 40,
    perUserLimit: 2,
    description:
      "A short and loud panel inside the godown. Stylists, doctors of cool, no slides.",
    zoneColor: "bg-[#3D9BFF]",
  },
  {
    id: "fashion-show",
    category: "VIP",
    name: "MEDIA DAY × FASHION SHOW",
    subtitle: "Sol Songwat · 11 Jun · invite-tier",
    priceTHB: 2800,
    capacityPerSession: 80,
    perUserLimit: 2,
    description:
      "Trader 'workflow' as runway. Pa khao ma, federation kits, copper, silk. F&B and a dessert collab. Limited.",
    zoneColor: "bg-[#E63946]",
  },
  {
    id: "supply-chain",
    category: "VIP",
    name: "SUPPLY CHAIN · ALL ACCESS",
    subtitle: "All 10 days · every workshop · 1 collab piece",
    priceTHB: 6900,
    capacityPerSession: 25,
    perUserLimit: 1,
    description:
      "The full Songwat-to-godown-to-market route. Includes one Ladderice × Nike Football collab item from the drop of 3.",
    zoneColor: "bg-[#9D4EDD]",
  },
  {
    id: "crew-group",
    category: "GROUP",
    name: "CREW OF 5",
    subtitle: "Group ticket · roll deep",
    priceTHB: 1400,
    capacityPerSession: 20,
    perUserLimit: 1,
    description:
      "Five hunter passes bundled, priced like four. One ledger card per crew.",
    zoneColor: "bg-[#21A179]",
  },
];

// 10-day window 11–21 Jun. Showtimes mirror the deck:
// Mon–Fri 12:30–21:30 (1 shift). Sat–Sun 09:00–22:00 (2 shifts).
function dow(dateStr: string) {
  return new Date(dateStr + "T00:00:00").getDay(); // 0=Sun..6=Sat
}
function buildSessions(): SessionSlot[] {
  const out: SessionSlot[] = [];
  const start = new Date("2026-06-11T00:00:00");
  for (let i = 0; i < 11; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    const w = dow(iso);
    const weekend = w === 0 || w === 6;
    const dayLabel = d.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" }).toUpperCase();

    if (weekend) {
      out.push({
        id: `${iso}_AM`,
        date: iso,
        label: `${dayLabel} · SHIFT A`,
        time: "09:00 – 18:00",
        capacityNote: i === 0 ? "FEW_LEFT" : "OPEN",
        shiftCount: 2,
      });
      out.push({
        id: `${iso}_PM`,
        date: iso,
        label: `${dayLabel} · SHIFT B`,
        time: "13:00 – 22:00",
        capacityNote: i === 0 ? "SOLD_OUT" : "OPEN",
        shiftCount: 2,
      });
    } else {
      out.push({
        id: `${iso}_EVE`,
        date: iso,
        label: dayLabel,
        time: "12:30 – 21:30",
        capacityNote: i === 0 ? "FEW_LEFT" : "OPEN",
      });
    }
  }
  return out;
}
export const SESSIONS: SessionSlot[] = buildSessions();

export const PROMO_CODES: Record<string, { pct: number; label: string }> = {
  SONGWAT26: { pct: 15, label: "Songwat local · 15% off" },
  KOLONLY: { pct: 100, label: "Comp · KOL invite" },
};

export function ticketById(id?: string) {
  return TICKET_TYPES.find((t) => t.id === id);
}
export function sessionById(id?: string) {
  return SESSIONS.find((s) => s.id === id);
}
export const THB = (n: number) =>
  n === 0 ? "FREE" : "฿" + n.toLocaleString("en-US");
