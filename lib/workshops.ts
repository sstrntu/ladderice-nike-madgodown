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

const commonPrereqs = [
  "Registration required. FCFS on arrival.",
  "No purchase required for basic units.",
  "Upgrade options may require jersey purchase.",
];

export const WORKSHOPS: Record<string, WorkshopDetail> = {
  "styling-mad-ginga": {
    ticketTypeId: "styling-mad-ginga",
    artist: "Thunder",
    artistTagline: "Football styling through the MAD GINGA lens.",
    level: "OPEN",
    duration: "Limited session",
    language: "Thai",
    takeHome: "A styled football look direction and session-only MAD SKILLS item chance.",
    materials: ["Nike federation jerseys", "Styling references", "Custom trim options", "Session table tools"],
    prereqs: commonPrereqs,
    outline: [
      { time: "CHECK-IN", title: "Confirm registration and available base unit." },
      { time: "SESSION", title: "Break down styling rhythm, silhouette, and MAD GINGA cues." },
      { time: "BUILD", title: "Apply the selected styling logic to kit details." },
      { time: "WRAP", title: "Final look check and special item draw." },
    ],
    whyItMatters:
      "The workshop treats football style as culture, not costume: movement, confidence, and local taste translated onto kit.",
  },
  "thaipologic-101": {
    ticketTypeId: "thaipologic-101",
    artist: "MAAN",
    artistTagline: "Thai visual logic for football customization.",
    level: "OPEN",
    duration: "Limited session",
    language: "Thai",
    takeHome: "A customization direction based on Thai graphic and material cues.",
    materials: ["Thai fabric references", "Nike federation jerseys", "Heat transfer options", "Custom detail samples"],
    prereqs: commonPrereqs,
    outline: [
      { time: "CHECK-IN", title: "Confirm session seat and available material set." },
      { time: "SESSION", title: "Decode Thai references with MAAN." },
      { time: "BUILD", title: "Translate the references into collar, cuff, sleeve, or bead details." },
      { time: "WRAP", title: "Final review and documentation." },
    ],
    whyItMatters:
      "The session keeps Thai references specific, useful, and wearable inside the football kit system.",
  },
  silktrade: {
    ticketTypeId: "silktrade",
    artist: "Ladderice",
    artistTagline: "Thai textile details applied to football kits.",
    level: "OPEN",
    duration: "Limited session",
    language: "Thai · English",
    takeHome: "A textile-led kit customization using available Thai fabric pieces.",
    materials: ["Pre-produced Thai fabric pieces", "Collars", "Cuffs", "Sleeves", "Beads", "Heat transfers"],
    prereqs: commonPrereqs,
    outline: [
      { time: "CHECK-IN", title: "Select available base and confirm upgrade options." },
      { time: "SESSION", title: "Review silk and trade references with Ladderice." },
      { time: "BUILD", title: "Place collar, cuff, sleeve, or bead details." },
      { time: "WRAP", title: "Fit check and final table pass." },
    ],
    whyItMatters:
      "SILKTRADE connects Thai textile craft to football identity through small, wearable interventions.",
  },
  "yerba-madtae": {
    ticketTypeId: "yerba-madtae",
    artist: "Ladderice",
    artistTagline: "Terrace ritual, kit culture, and MADTAE attitude.",
    level: "OPEN",
    duration: "Limited session",
    language: "Thai · English",
    takeHome: "A Ladderice-guided customization direction tied to MADTAE energy.",
    materials: ["Nike federation jerseys", "Graphic references", "Heat transfers", "Fabric and bead options"],
    prereqs: commonPrereqs,
    outline: [
      { time: "CHECK-IN", title: "Confirm registration and available materials." },
      { time: "SESSION", title: "Build the MADTAE reference board around football ritual." },
      { time: "BUILD", title: "Choose and apply a focused kit detail." },
      { time: "WRAP", title: "Final check and photo moment." },
    ],
    whyItMatters:
      "The workshop gives the program a terrace-language lane: casual, social, and still rooted in football.",
  },
  "jerseys-to-dye-for": {
    ticketTypeId: "jerseys-to-dye-for",
    artist: "Moh Hom Phrae",
    artistTagline: "Local dye knowledge for federation jerseys.",
    level: "OPEN",
    duration: "Limited session",
    language: "Thai",
    takeHome: "A jersey treatment direction informed by Moh Hom Phrae dye practice.",
    materials: ["Jersey blanks", "Dye references", "Treatment samples", "Protective workshop tools"],
    prereqs: commonPrereqs,
    outline: [
      { time: "CHECK-IN", title: "Confirm base unit and session limitations." },
      { time: "SESSION", title: "Learn the dye reference and material behavior." },
      { time: "BUILD", title: "Apply a guided jersey treatment or finish." },
      { time: "WRAP", title: "Drying, care notes, and final handoff." },
    ],
    whyItMatters:
      "The session brings regional color knowledge into the football kit conversation without flattening it into a generic effect.",
  },
  "teatalk-hia-wit": {
    ticketTypeId: "teatalk-hia-wit",
    artist: "HIA WIT",
    artistTagline: "Football history chat with the expert.",
    level: "OPEN",
    duration: "Talk session",
    language: "Thai",
    takeHome: "Football history context, Create with HIA WIT access, and session-only item chance.",
    materials: ["Tea table", "Archive references", "Conversation prompts"],
    prereqs: ["Registration required. FCFS on arrival.", "Bring questions for the expert."],
    outline: [
      { time: "CHECK-IN", title: "Confirm seat and tea talk access." },
      { time: "SESSION", title: "HIA WIT leads a football history conversation." },
      { time: "Q&A", title: "Audience questions and reference sharing." },
      { time: "WRAP", title: "Create with HIA WIT handoff." },
    ],
    whyItMatters:
      "MAD SKILLS is not only making. The culture also needs memory, names, matches, and context.",
  },
  "accessorize-teerapol": {
    ticketTypeId: "accessorize-teerapol",
    artist: "Teerapol",
    artistTagline: "Finishing details for football looks.",
    level: "OPEN",
    duration: "Limited session",
    language: "Thai",
    takeHome: "A kit accessory or finishing detail selected and assembled in session.",
    materials: ["Accessory references", "Beads", "Metallic details", "Fabric trims", "Jersey bases"],
    prereqs: commonPrereqs,
    outline: [
      { time: "CHECK-IN", title: "Confirm materials and available base units." },
      { time: "SESSION", title: "Review accessory logic with Teerapol." },
      { time: "BUILD", title: "Assemble a focused kit detail." },
      { time: "WRAP", title: "Final styling check." },
    ],
    whyItMatters:
      "Accessories let small choices carry the whole look. This session makes those choices deliberate.",
  },
  "nat-am": {
    ticketTypeId: "nat-am",
    artist: "Nat Am",
    artistTagline: "Final workshop host for the MAD SKILLS run.",
    level: "OPEN",
    duration: "Limited session",
    language: "Thai",
    takeHome: "A final-day MAD SKILLS customization and session-only item chance.",
    materials: ["Nike federation jerseys", "Custom details", "Athlete and catalyst references"],
    prereqs: commonPrereqs,
    outline: [
      { time: "CHECK-IN", title: "Confirm registration and available base unit." },
      { time: "SESSION", title: "Nat Am leads the final workshop brief." },
      { time: "BUILD", title: "Customize with available details." },
      { time: "WRAP", title: "Close the program with Create with Nike athlete and catalyst sessions." },
    ],
    whyItMatters:
      "The final workshop closes the run by bringing the maker table back to football people and live culture.",
  },
};
