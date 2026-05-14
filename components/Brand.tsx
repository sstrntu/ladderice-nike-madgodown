import Link from "next/link";

// Text-only wordmark. No logo until brand is finalized.
export function BrandMark({
  size = "sm",
}: {
  size?: "sm" | "md" | "lg";
}) {
  const cls =
    size === "lg"
      ? "text-[15px]"
      : size === "md"
      ? "text-[13px]"
      : "text-[11.5px]";
  return (
    <div className="flex items-baseline gap-1.5 leading-none">
      <span className={`font-impact tracking-[0.18em] text-bone ${cls}`}>
        LADDERICE
      </span>
      <span className="font-mono text-[10px] text-bone/45 tracking-[0.18em]">
        ×
      </span>
      <span className={`font-impact tracking-[0.18em] text-bone ${cls}`}>
        NIKE&nbsp;FB
      </span>
    </div>
  );
}

export function TopBar({
  back,
  title,
  right,
}: {
  back?: string;
  title?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="px-5 h-14 flex items-center justify-between gap-3 border-b border-bone/10">
      <div className="flex items-center gap-3 min-w-0">
        {back ? (
          <Link
            href={back}
            aria-label="Back"
            className="font-mono text-[11px] tracking-[0.2em] text-bone/70 hover:text-volt"
          >
            ← BACK
          </Link>
        ) : (
          <BrandMark />
        )}
      </div>
      {title && (
        <span className="font-mono text-[10px] tracking-[0.22em] text-bone/45 uppercase truncate">
          {title}
        </span>
      )}
      <div className="min-w-[56px] text-right">
        {right ?? (
          <span className="font-mono text-[10px] tracking-[0.22em] text-volt">
            MG · 26
          </span>
        )}
      </div>
    </div>
  );
}

export function StepDots({ step }: { step: number }) {
  const labels = ["TICKET", "DATE", "INFO", "REVIEW", "PAY"];
  return (
    <div className="px-5 pt-4 pb-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-[0.22em] text-volt">
          {String(step).padStart(2, "0")} / {String(labels.length).padStart(2, "0")} · {labels[step - 1]}
        </span>
        <span className="font-mono text-[10px] tracking-[0.22em] text-bone/45">
          {labels[step] ? `NEXT · ${labels[step]}` : "FINAL"}
        </span>
      </div>
      <div className="mt-2 flex items-center gap-1">
        {labels.map((_, i) => (
          <span
            key={i}
            className={`h-[3px] flex-1 ${i <= step - 1 ? "bg-volt" : "bg-bone/12"}`}
          />
        ))}
      </div>
    </div>
  );
}

// Section heading used across screens — keeps vertical rhythm consistent.
export function SectionHead({
  eyebrow,
  title,
  hint,
}: {
  eyebrow?: string;
  title: string;
  hint?: string;
}) {
  return (
    <div>
      {eyebrow && (
        <div className="font-mono text-[10px] tracking-[0.22em] text-bone/45 uppercase mb-2">
          {eyebrow}
        </div>
      )}
      <h1 className="font-display italic text-[40px] leading-[0.95] tracking-tight">
        {title}
      </h1>
      {hint && (
        <p className="mt-2 text-[13px] text-bone/65 font-mono leading-snug">
          {hint}
        </p>
      )}
    </div>
  );
}
