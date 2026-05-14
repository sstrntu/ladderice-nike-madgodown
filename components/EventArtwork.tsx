"use client";

interface Props {
  /** Optional uploaded image URL — wins over procedural art. */
  src?: string;
  /** Tailwind accent class like "bg-volt" or "bg-[#FF7A3D]" — recolours procedural variant. */
  accent?: string;
  /** Short label in the top eyebrow. */
  eyebrow?: string;
  /** Big display word for the procedural variant. */
  title?: string;
  /** Optional bottom right tag (e.g. date / venue). */
  footer?: string;
  /** Aspect — "poster" = 3:4, "hero" = 16:9, "square" = 1:1, "thumb" = 4:3. */
  aspect?: "poster" | "hero" | "square" | "thumb";
  className?: string;
  /** When true, hides text overlay (useful for thumbnails) */
  bare?: boolean;
}

const ASPECTS = {
  poster: "aspect-[3/4]",
  hero: "aspect-[16/9]",
  square: "aspect-square",
  thumb: "aspect-[4/3]",
} as const;

export function EventArtwork({
  src,
  accent = "#D4FF3D",
  eyebrow,
  title,
  footer,
  aspect = "poster",
  className = "",
  bare = false,
}: Props) {
  // If we have an uploaded image, render it.
  if (src) {
    return (
      <div className={`relative overflow-hidden ${ASPECTS[aspect]} ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={title || "Event artwork"} className="w-full h-full object-cover" />
        {/* Bottom gradient to keep overlays readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
        {!bare && (eyebrow || title || footer) && (
          <Overlay eyebrow={eyebrow} title={title} footer={footer} accent={accent} />
        )}
      </div>
    );
  }

  // No image uploaded — show a neutral placeholder with a photo icon.
  return (
    <div className={`relative overflow-hidden ${ASPECTS[aspect]} ${className} bg-bone/8 flex items-center justify-center`}>
      <svg width="64" height="64" viewBox="0 0 80 80" fill="none" className="opacity-30">
        <rect width="80" height="80" rx="16" fill="white" fillOpacity="0.15"/>
        <circle cx="28" cy="30" r="8" fill="white"/>
        <path d="M8 62 C8 62 18 44 28 44 C38 44 42 54 52 54 C62 54 72 36 72 36 L72 72 L8 72 Z" fill="white"/>
      </svg>
    </div>
  );
}

function Overlay({
  eyebrow, title, footer, accent,
}: { eyebrow?: string; title?: string; footer?: string; accent: string }) {
  return (
    <div className="absolute inset-0 p-4 flex flex-col">
      {eyebrow && (
        <div className="font-mono text-[9.5px] tracking-[0.22em]" style={{ color: accent }}>
          {eyebrow}
        </div>
      )}
      {title && (
        <div className="mt-auto font-display italic text-bone text-[clamp(22px,7vw,40px)] leading-[0.88] tracking-tight">
          {title}
        </div>
      )}
      {footer && (
        <div className="mt-1 font-mono text-[9.5px] tracking-[0.22em] text-bone/65">
          {footer}
        </div>
      )}
    </div>
  );
}
