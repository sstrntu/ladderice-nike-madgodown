// Static workshop detail content keyed by ticket type id.
export interface WorkshopDetail {
  ticketTypeId: string;
  artist: string;
  artistTagline: string;
  level: "OPEN" | "BEGINNER" | "INTERMEDIATE" | "INVITE ONLY";
  duration: string;
  language: string;
  takeHome: string;
  materials: string[];
  prereqs: string[];
  outline: { time: string; title: string }[];
  whyItMatters: string;
}

export const WORKSHOPS: Record<string, WorkshopDetail> = {
  "silk-stitch": {
    ticketTypeId: "silk-stitch",
    artist: "P Rose",
    artistTagline: "Songwat seamstress — three generations on the same block.",
    level: "OPEN",
    duration: "2 hours",
    language: "Thai · English",
    takeHome:
      "One federation blank stitched with your own Avery-style nameset on a vintage Singer treadle.",
    materials: [
      "Singer 15-30 treadle machine (1962)",
      "Federation blank — Brazil / France / England / Korea",
      "Heat-press nameset + Avery letters",
      "Thai silk thread, beeswax, scissors",
    ],
    prereqs: ["None — beginners welcome.", "Wear sleeves you can roll up.", "Closed shoes."],
    outline: [
      { time: "00:00 – 00:15", title: "P Rose introduces the treadle. No motors, no shortcuts." },
      { time: "00:15 – 00:45", title: "Pick your federation blank and nameset combo." },
      { time: "00:45 – 01:30", title: "Stitch — short straight, double-stitched hem, learn to backtack." },
      { time: "01:30 – 01:50", title: "Heat press the nameset. P Rose checks alignment." },
      { time: "01:50 – 02:00", title: "Photo at the gate. You leave wearing it." },
    ],
    whyItMatters:
      "Songwat's seamstresses kept the docks dressed. This is the same machine, the same hands, the same craft — applied to the kit you wear in 26.",
  },
  "jame-jewel": {
    ticketTypeId: "jame-jewel",
    artist: "JAME",
    artistTagline: "Copper-wire artisan working out of the back of a godown.",
    level: "BEGINNER",
    duration: "1.5 hours",
    language: "Thai",
    takeHome: "One copper wire piece — ring, pendant, or earring — fitted to you.",
    materials: ["Recycled copper wire", "Weigh-scale fittings", "Forging hammer", "Files, gloves"],
    prereqs: ["None.", "Take off other jewelry before you start."],
    outline: [
      { time: "00:00 – 00:10", title: "JAME walks you through copper as a material." },
      { time: "00:10 – 00:30", title: "Sketch what you want. Decide ring / pendant / earring." },
      { time: "00:30 – 01:10", title: "Cut, hammer, shape, file. JAME corrects in real time." },
      { time: "01:10 – 01:30", title: "Polish + photo. Your thumbprint stays on the piece." },
    ],
    whyItMatters:
      "Before plastic, copper was the cheap-and-honest material of the trading post. Forging it yourself is the most Songwat thing you can do.",
  },
  "styling-talk": {
    ticketTypeId: "styling-talk",
    artist: "Thunder, G & Dr. WIT",
    artistTagline: "Three voices on football, fashion, and where the two collide in BKK.",
    level: "OPEN",
    duration: "45 minutes + Q&A",
    language: "Thai · English Q&A",
    takeHome: "A loud panel and the sticker pack you came for.",
    materials: ["Mic. Crates as seats. No slides."],
    prereqs: ["None.", "Bring questions, not laptops."],
    outline: [
      { time: "00:00 – 00:10", title: "Thunder & G on what 'football fit' means in 26." },
      { time: "00:10 – 00:25", title: "Dr. WIT on Songwat as system, not aesthetic." },
      { time: "00:25 – 00:45", title: "Q&A — first 10 hands get the mic." },
    ],
    whyItMatters:
      "Style talks usually happen in clean rooms. This one happens in a warehouse, with the goods stacked behind the speakers.",
  },
};
