"use client";
import { useRef, useState } from "react";

const MAX_BYTES = 1_500_000; // 1.5 MB — POC localStorage budget

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

/* ----------------------- SINGLE ----------------------- */
export function PhotoFieldSingle({
  label,
  hint,
  value,
  onChange,
  aspect = "aspect-[3/4]",
}: {
  label: string;
  hint?: string;
  value?: string;
  onChange: (v: string | undefined) => void;
  aspect?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [err, setErr] = useState<string | null>(null);

  const handle = async (f?: File) => {
    if (!f) return;
    if (f.size > MAX_BYTES) {
      setErr(`Too big — ${(f.size / 1024 / 1024).toFixed(1)}MB. Limit 1.5MB on the POC.`);
      return;
    }
    setErr(null);
    onChange(await readFile(f));
  };

  return (
    <div>
      <label className="eyebrow">{label}</label>

      <div className={`relative border border-dashed border-bone/25 ${value ? "" : aspect}`}>
        <input
          ref={ref}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handle(e.target.files?.[0])}
        />

        {value ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt={label} className={`w-full ${aspect} object-cover`} />
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => ref.current?.click()}
                className="font-mono text-[10px] tracking-[0.22em] bg-ink/80 text-bone border border-bone/30 px-2 py-1 hover:border-volt hover:text-volt"
              >
                REPLACE
              </button>
              <button
                onClick={() => onChange(undefined)}
                className="font-mono text-[10px] tracking-[0.22em] bg-ink/80 text-red-400 border border-red-400/40 px-2 py-1 hover:bg-red-400/10"
              >
                REMOVE
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => ref.current?.click()}
            className="w-full h-full flex flex-col items-center justify-center hover:border-volt/60 text-center"
          >
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="10" fill="white" fillOpacity="0.08"/>
              <circle cx="17" cy="19" r="4.5" fill="white" fillOpacity="0.25"/>
              <path d="M8 36c0 0 5-10 11-10s8 6 12 6 9-12 9-12l6 16H8z" fill="white" fillOpacity="0.2"/>
            </svg>
            <div className="mt-2 font-mono text-[10.5px] tracking-[0.22em] text-bone/55">
              UPLOAD IMAGE
            </div>
            <div className="mt-1 font-mono text-[9.5px] tracking-[0.18em] text-bone/35">
              JPG / PNG · max 1.5MB
            </div>
          </button>
        )}
      </div>

      {hint && (
        <div className="mt-1.5 font-mono text-[10px] tracking-[0.18em] text-bone/40">{hint}</div>
      )}
      {err && (
        <div className="mt-1.5 font-mono text-[10px] tracking-[0.18em] text-red-400">! {err}</div>
      )}
    </div>
  );
}

/* ----------------------- GALLERY ----------------------- */
export function PhotoFieldGallery({
  label,
  hint,
  values,
  onChange,
  max = 8,
}: {
  label: string;
  hint?: string;
  values: string[];
  onChange: (v: string[]) => void;
  max?: number;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [err, setErr] = useState<string | null>(null);

  const handle = async (files: FileList | null) => {
    if (!files || !files.length) return;
    const remaining = max - values.length;
    if (remaining <= 0) {
      setErr(`Max ${max} photos.`);
      return;
    }
    const picked: string[] = [];
    for (const f of Array.from(files).slice(0, remaining)) {
      if (f.size > MAX_BYTES) {
        setErr(`Skipped "${f.name}" — over 1.5MB.`);
        continue;
      }
      picked.push(await readFile(f));
    }
    setErr(picked.length ? null : err);
    if (picked.length) onChange([...values, ...picked]);
  };

  const removeAt = (i: number) => onChange(values.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="eyebrow">{label}</label>
        <span className="font-mono text-[9.5px] tracking-[0.22em] text-bone/45">
          {values.length} / {max}
        </span>
      </div>

      <input
        ref={ref}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handle(e.target.files)}
      />

      <div className="grid grid-cols-3 gap-2">
        {values.map((src, i) => (
          <div key={i} className="relative aspect-square border border-bone/15">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`gallery ${i + 1}`} className="w-full h-full object-cover" />
            <button
              onClick={() => removeAt(i)}
              className="absolute top-1 right-1 font-mono text-[9px] tracking-[0.18em] bg-ink/80 text-red-400 border border-red-400/40 px-1.5 py-0.5 hover:bg-red-400/10"
            >
              ×
            </button>
          </div>
        ))}

        {values.length < max && (
          <button
            onClick={() => ref.current?.click()}
            className="aspect-square border border-dashed border-bone/25 flex flex-col items-center justify-center hover:border-volt/60"
          >
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="10" fill="white" fillOpacity="0.08"/>
              <circle cx="17" cy="19" r="4.5" fill="white" fillOpacity="0.25"/>
              <path d="M8 36c0 0 5-10 11-10s8 6 12 6 9-12 9-12l6 16H8z" fill="white" fillOpacity="0.2"/>
            </svg>
            <div className="mt-1 font-mono text-[9px] tracking-[0.22em] text-bone/50">ADD</div>
          </button>
        )}
      </div>

      {hint && (
        <div className="mt-2 font-mono text-[10px] tracking-[0.18em] text-bone/40">{hint}</div>
      )}
      {err && (
        <div className="mt-1.5 font-mono text-[10px] tracking-[0.18em] text-red-400">! {err}</div>
      )}
    </div>
  );
}
