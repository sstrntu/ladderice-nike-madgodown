"use client";
import { useMemo } from "react";

// Deterministic pseudo-QR — visual mock only. Seed -> 29x29 grid.
function hash(str: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}
function rng(seed: number) {
  let s = seed || 1;
  return () => {
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
    return ((s >>> 0) % 1000) / 1000;
  };
}

export function PseudoQR({ seed, size = 220 }: { seed: string; size?: number }) {
  const cells = useMemo(() => {
    const N = 29;
    const r = rng(hash(seed));
    const grid: boolean[] = Array.from({ length: N * N }, () => r() > 0.5);

    const setBlock = (x: number, y: number, on: boolean) => {
      if (x < 0 || y < 0 || x >= N || y >= N) return;
      grid[y * N + x] = on;
    };
    const finder = (ox: number, oy: number) => {
      for (let y = 0; y < 7; y++)
        for (let x = 0; x < 7; x++) {
          const onBorder = x === 0 || y === 0 || x === 6 || y === 6;
          const inner = x >= 2 && x <= 4 && y >= 2 && y <= 4;
          setBlock(ox + x, oy + y, onBorder || inner);
        }
      // clear quiet ring
      for (let y = -1; y <= 7; y++) {
        setBlock(ox + 7, oy + y, false);
        setBlock(ox - 1, oy + y, false);
      }
      for (let x = -1; x <= 7; x++) {
        setBlock(ox + x, oy + 7, false);
        setBlock(ox + x, oy - 1, false);
      }
    };
    finder(0, 0);
    finder(N - 7, 0);
    finder(0, N - 7);
    return grid;
  }, [seed]);

  return (
    <div
      className="pseudoqr"
      style={{ width: size, height: size }}
      aria-label="Ticket QR code (mock)"
    >
      {cells.map((on, i) => (
        <i key={i} style={{ background: on ? "#D4FF3D" : "transparent" }} />
      ))}
    </div>
  );
}
