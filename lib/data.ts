import type { TicketType, SessionSlot } from "./types";

export const EVENT = {
  shortName: "MAD GODOWN BKK 26",
  longName: "Ladderice × Nike Football — MAD SKILLS WORKSHOPs",
  thaiName: "แม๊ดโกดัง",
  chineseName: "狂仓",
  tagline: "8 different workshops that support the culture of football.",
  description:
    "MAD SKILLS WORKSHOPs brings Ladderice, Nike Football, local artisans, stylists, makers, and football voices into Play Art House Songwat. Always-on customization runs beside eight focused sessions across craft, styling, jersey treatment, Thai football culture, and accessorizing.",
  dateLabel: "11 – 21 JUN 2026",
  dateRange: { from: "2026-06-11", to: "2026-06-21" },
  venueLabel: "PLAY ART HOUSE, SONGWAT",
  venueHint:
    "Special customizations are supported by local artisans. Registered sessions are first-come, first-served with extremely limited seats.",
  hero: { coords: "13.7374° N · 100.5008° E", season: "WORLD CUP / RAINY 26" },
  hashtags: ["#MADGODOWN", "#MADGOALDOWN", "#NIKEFOOTBALL", "#LADDERICE", "#SONGWATBKK"],
  // Optional uploaded media — undefined means EventArtwork falls back to procedural.
  posterUrl: undefined as string | undefined,
  heroUrl: undefined as string | undefined,
  gallery: [] as string[],
  accentHex: "#D4FF3D",
};

export const TICKET_TYPES: TicketType[] = [
  {
    id: "always-on",
    category: "ENTRY",
    name: "ALWAYS ON WORKSHOP",
    subtitle: "Local artisan customization · all-day support",
    priceTHB: 0,
    capacityPerSession: 80,
    perUserLimit: 1,
    description:
      "FCFS customization support for old or recently purchased Nike federation jerseys. Basic units are limited; premium upgrades require jersey purchase.",
    zoneColor: "bg-volt",
    accentHex: "#D4FF3D",
  },
  {
    id: "opening-night",
    category: "PROGRAM",
    name: "OPENING NIGHT",
    subtitle: "Thu 6.11 · Play Art House Songwat",
    priceTHB: 0,
    capacityPerSession: 120,
    perUserLimit: 2,
    description:
      "Opening night for MAD GODOWN BKK. First look at the workshop system, customization tables, and program calendar.",
    zoneColor: "bg-volt",
    accentHex: "#D4FF3D",
  },
  {
    id: "styling-mad-ginga",
    category: "WORKSHOP",
    name: "WORKSHOP 1 · STYLING MAD GINGA",
    subtitle: "Sat 6.13 · with Thunder",
    priceTHB: 0,
    capacityPerSession: 16,
    perUserLimit: 1,
    description:
      "A football-styling session about rhythm, silhouette, and attitude through the MAD GINGA lens.",
    zoneColor: "bg-volt",
    accentHex: "#D4FF3D",
  },
  {
    id: "thaipologic-101",
    category: "WORKSHOP",
    name: "WORKSHOP 2 · THAIPOLOGIC 101",
    subtitle: "Sun 6.14 · with MAAN",
    priceTHB: 0,
    capacityPerSession: 16,
    perUserLimit: 1,
    description:
      "A Thai visual logic session with MAAN, translating local cues into football customization language.",
    zoneColor: "bg-volt",
    accentHex: "#D4FF3D",
  },
  {
    id: "silktrade",
    category: "WORKSHOP",
    name: "WORKSHOP 3 · SILKTRADE",
    subtitle: "Mon 6.15 · with Ladderice",
    priceTHB: 0,
    capacityPerSession: 16,
    perUserLimit: 1,
    description:
      "A textile-led customization session using Thai fabric references, collars, cuffs, sleeves, and bead details.",
    zoneColor: "bg-volt",
    accentHex: "#D4FF3D",
  },
  {
    id: "yerba-madtae",
    category: "WORKSHOP",
    name: "WORKSHOP 4 · YERBA MADTAE",
    subtitle: "Mon 6.15 · with Ladderice",
    priceTHB: 0,
    capacityPerSession: 16,
    perUserLimit: 1,
    description:
      "A Ladderice session connecting drink ritual, terrace energy, and football kit customization.",
    zoneColor: "bg-volt",
    accentHex: "#D4FF3D",
  },
  {
    id: "jerseys-to-dye-for",
    category: "WORKSHOP",
    name: "WORKSHOP 5 · JERSEYS TO DYE FOR",
    subtitle: "Tue 6.16 · with Moh Hom Phrae",
    priceTHB: 0,
    capacityPerSession: 14,
    perUserLimit: 1,
    description:
      "A jersey treatment workshop with Moh Hom Phrae, focused on fabric color, local dye knowledge, and football identity.",
    zoneColor: "bg-volt",
    accentHex: "#D4FF3D",
  },
  {
    id: "teatalk-hia-wit",
    category: "WORKSHOP",
    name: "WORKSHOP 6 · TEATALK W/ HIA WIT",
    subtitle: "Wed 6.17 · football history chat",
    priceTHB: 0,
    capacityPerSession: 36,
    perUserLimit: 1,
    description:
      "A football history conversation with HIA WIT, built as a tea talk with the expert.",
    zoneColor: "bg-volt",
    accentHex: "#D4FF3D",
  },
  {
    id: "accessorize-teerapol",
    category: "WORKSHOP",
    name: "WORKSHOP 7 · ACCESSORIZE",
    subtitle: "Sat 6.20 · with Teerapol",
    priceTHB: 0,
    capacityPerSession: 16,
    perUserLimit: 1,
    description:
      "A kit accessorizing session with Teerapol, focused on finishing details that move between football and street.",
    zoneColor: "bg-volt",
    accentHex: "#D4FF3D",
  },
  {
    id: "nat-am",
    category: "WORKSHOP",
    name: "WORKSHOP 8",
    subtitle: "Sun 6.21 · with Nat Am",
    priceTHB: 0,
    capacityPerSession: 16,
    perUserLimit: 1,
    description:
      "The final MAD SKILLS workshop of the program, hosted with Nat Am alongside Create with Nike athlete and catalyst sessions.",
    zoneColor: "bg-volt",
    accentHex: "#D4FF3D",
  },
];

export const WORKSHOP_OUTLOOK = [
  {
    date: "2026-06-11",
    day: "THU",
    label: "6.11",
    items: [{ label: "OPENING NIGHT" }],
  },
  {
    date: "2026-06-12",
    day: "FRI",
    label: "6.12",
    items: [{ label: "Create with Nike Catalyst" }],
  },
  {
    date: "2026-06-13",
    day: "SAT",
    label: "6.13",
    items: [{ label: 'WORKSHOP 1 "STYLING MAD GINGA" w/ THUNDER', ticketTypeId: "styling-mad-ginga" }],
  },
  {
    date: "2026-06-14",
    day: "SUN",
    label: "6.14",
    items: [
      { label: 'WORKSHOP 2 "THAIPOLOGIC 101" w/ MAAN', ticketTypeId: "thaipologic-101" },
      { label: "Create with Nike protagonist" },
    ],
  },
  {
    date: "2026-06-15",
    day: "MON",
    label: "6.15",
    items: [
      { label: 'WORKSHOP 3 "SILKTRADE" w/ LADDERICE', ticketTypeId: "silktrade" },
      { label: 'WORKSHOP 4 "YERBA MADTAE" w/ LADDERICE', ticketTypeId: "yerba-madtae" },
    ],
  },
  {
    date: "2026-06-16",
    day: "TUE",
    label: "6.16",
    items: [{ label: 'WORKSHOP 5 "JERSEYS TO DYE FOR" w/ MOH HOM PHRAE', ticketTypeId: "jerseys-to-dye-for" }],
  },
  {
    date: "2026-06-17",
    day: "WED",
    label: "6.17",
    items: [
      { label: 'WORKSHOP 6 "TEATALK w/ HIA WIT" - the football history chat with the expert.', ticketTypeId: "teatalk-hia-wit" },
      { label: "Create with HIA WIT" },
    ],
  },
  {
    date: "2026-06-18",
    day: "THU",
    label: "6.18",
    items: [{ label: "Create with Nike Athletes / Catalysts" }],
  },
  {
    date: "2026-06-19",
    day: "FRI",
    label: "6.19",
    items: [{ label: "Create with Bank Suphanat" }],
  },
  {
    date: "2026-06-20",
    day: "SAT",
    label: "6.20",
    items: [{ label: 'WORKSHOP 7 "ACCESSORIZE w/ TEERAPOL"', ticketTypeId: "accessorize-teerapol" }],
  },
  {
    date: "2026-06-21",
    day: "SUN",
    label: "6.21",
    items: [
      { label: "WORKSHOP 8 w/ NAT AM", ticketTypeId: "nat-am" },
      { label: "Create with Nike Athletes / Catalysts" },
    ],
  },
];

export const WORKSHOP_RULES = {
  alwaysOn: [
    "FCFS for pre-registered guests.",
    "Purchases not required.",
    "Bring your old Nike federation jersey. Limited to 1 per person.",
    "Bring your recently purchased Nike federation jersey.",
    "Subject to available blanks.",
    "Basic units: limited pieces, heat transfers, pre-produced Thai fabric pieces including collar, cuffs, sleeves, and beads.",
    "Premium upgrades require jersey purchase: silk pieces and metallic beads.",
    "Walk-ins and waitlists are welcome, but must wait.",
  ],
  registered: [
    "FCFS after registration.",
    "Each workshop session is extremely limited.",
    "Mechanics and target groups may slightly differ.",
    "No-show spots will be given to all-day workshop registrants during that time.",
    "No purchase required for basic units.",
    "Options to upgrade to jerseys.",
    "Special items can be won after the session.",
  ],
};

export const TICKET_DATE_OPTIONS: Record<string, string[]> = {
  "always-on": WORKSHOP_OUTLOOK.map((d) => d.date),
  "opening-night": ["2026-06-11"],
  "styling-mad-ginga": ["2026-06-13"],
  "thaipologic-101": ["2026-06-14"],
  silktrade: ["2026-06-15"],
  "yerba-madtae": ["2026-06-15"],
  "jerseys-to-dye-for": ["2026-06-16"],
  "teatalk-hia-wit": ["2026-06-17"],
  "accessorize-teerapol": ["2026-06-20"],
  "nat-am": ["2026-06-21"],
};

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
